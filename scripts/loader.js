document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("components-container");
  const nav = document.getElementById("category-nav");
  const searchInput = document.getElementById("search-input");

  fetch("components.json")
    .then(res => res.json())
    .then(components => {
      const categories = [...new Set(components.map(c => c.category))].sort();
      const categorySections = {};

      // Navigationslinks erzeugen
      categories.forEach(cat => {
        const link = document.createElement("a");
        link.href = `#${cat}`;
        link.textContent = cat;
        link.className = "tab-link text-sm px-3 py-2 rounded bg-gray-700 text-white hover:bg-gray-900 transition";
        link.setAttribute("data-target", cat);
        nav.appendChild(link);
      });

      // Rubriken-Abschnitte erzeugen
      categories.forEach(cat => {
        const section = document.createElement("section");
        section.id = cat;
        section.className = "mb-12";

        const heading = document.createElement("h2");
        heading.textContent = cat;
        heading.className = "text-2xl font-semibold border-b pb-2 mb-6";
        section.appendChild(heading);

        const grid = document.createElement("div");
        grid.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
        section.appendChild(grid);

        container.appendChild(section);
        categorySections[cat] = grid;
      });

      // Komponenten laden
      components
        .sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title))
        .forEach(component => {
          fetch(component.file)
            .then(res => {
              if (!res.ok) throw new Error(`Datei nicht gefunden: ${component.file}`);
              return res.text();
            })
            .then(html => {
              const div = document.createElement("div");
              div.className = "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-4 hover:shadow-md transition";
              div.innerHTML = `
                <h3 class="text-lg font-bold mb-2">${component.title}</h3>
                <div class="preview bg-gray-50 dark:bg-gray-700 p-3 rounded border border-dashed border-gray-300 dark:border-gray-600 mb-4">${html}</div>
                <pre class="relative bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto text-sm text-black dark:text-white">
                  <button class="copy-btn absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">Copy</button>
                  <code>${html.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>
                </pre>
              `;

              categorySections[component.category].appendChild(div);

              const copyBtn = div.querySelector(".copy-btn");
              copyBtn.addEventListener("click", () => {
                const codeText = div.querySelector("code").textContent;
                navigator.clipboard.writeText(codeText).then(() => {
                  copyBtn.textContent = "Kopiert!";
                  setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
                });
              });
            });
        });

      // Scrollspy
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute("id");
          document.querySelectorAll(".tab-link").forEach(link => {
            link.classList.toggle("bg-blue-600", link.getAttribute("data-target") === id && entry.isIntersecting);
            link.classList.toggle("text-white", entry.isIntersecting);
          });
        });
      }, { rootMargin: "-50% 0px -50% 0px", threshold: 0.1 });

      categories.forEach(cat => {
        const section = document.getElementById(cat);
        if (section) observer.observe(section);
      });

      // Suche
      searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase();
        document.querySelectorAll("section").forEach(section => {
          const visible = [...section.querySelectorAll("h3")].some(h3 =>
            h3.textContent.toLowerCase().includes(keyword)
          );
          section.style.display = visible ? "" : "none";
        });
      });
    });

  // Dark Mode Toggle
  const toggle = document.getElementById("dark-toggle");
  toggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });

  // Back to Top
  const backToTopBtn = document.getElementById("backToTopBtn");
  window.addEventListener("scroll", () => {
    backToTopBtn.classList.toggle("hidden", window.scrollY < 400);
  });
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Mobile Menu Toggle
  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("category-nav").classList.toggle("hidden");
  });
});
