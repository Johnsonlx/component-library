document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("components-container");
  const nav = document.getElementById("category-nav");
  const mobileNav = document.getElementById("mobile-nav");

  fetch("components.json")
    .then(res => res.json())
    .then(components => {
      const categories = [...new Set(components.map(c => c.category))].sort();

      const categorySections = {};

      categories.forEach(cat => {
        // Navigationseinträge erzeugen (Desktop & Mobil)
        [nav, mobileNav].forEach(navEl => {
          const link = document.createElement("a");
          link.href = `#${cat}`;
          link.textContent = cat;
          link.className = "text-sm px-3 py-2 rounded bg-gray-700 text-white hover:bg-gray-900 transition";
          link.setAttribute("data-target", cat);
          navEl.appendChild(link);
        });

        // Sektionen im Content-Bereich
        const section = document.createElement("section");
        section.id = cat;
        section.className = "mb-12";

        const heading = document.createElement("h2");
        heading.textContent = cat;
        heading.className = "text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-6";
        section.appendChild(heading);

        const grid = document.createElement("div");
        grid.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
        section.appendChild(grid);

        container.appendChild(section);
        categorySections[cat] = grid;
      });

      // Komponenten laden
      components
        .sort((a, b) => a.category === b.category ? a.title.localeCompare(b.title) : a.category.localeCompare(b.category))
        .forEach(component => {
          fetch(component.file)
            .then(res => {
              if (!res.ok) throw new Error(`Datei nicht gefunden: ${component.file}`);
              return res.text();
            })
            .then(html => {
              const div = document.createElement("div");
              div.className = "bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-md transition";
              div.innerHTML = `
                <h3 class="text-lg font-bold mb-2">${component.title}</h3>
                <div class="preview bg-gray-50 p-3 rounded border border-dashed border-gray-300 mb-4">${html}</div>
                <pre class="relative bg-gray-100 p-3 rounded overflow-x-auto text-sm">
                  <button class="copy-btn absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">Copy</button>
                  <code>${html.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>
                </pre>
              `;
              categorySections[component.category].appendChild(div);

              // Copy-Funktion
              const copyBtn = div.querySelector(".copy-btn");
              copyBtn.addEventListener("click", () => {
                const codeText = div.querySelector("code").textContent;
                navigator.clipboard.writeText(codeText).then(() => {
                  copyBtn.textContent = "Kopiert!";
                  setTimeout(() => copyBtn.textContent = "Copy", 2000);
                });
              });
            })
            .catch(err => console.error(`Fehler beim Laden von ${component.file}:`, err));
        });

      // Scrollspy aktivieren
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute("id");
          document.querySelectorAll(`[data-target]`).forEach(link => {
            if (link.getAttribute("data-target") === id) {
              link.classList.toggle("active-category", entry.isIntersecting);
            }
          });
        });
      }, { rootMargin: "-50% 0px -50% 0px", threshold: 0.1 });

      categories.forEach(cat => {
        const section = document.getElementById(cat);
        if (section) observer.observe(section);
      });
    })
    .catch(err => {
      console.error("Fehler beim Laden der components.json:", err);
      container.innerHTML = `<p class="text-red-600">Fehler beim Laden der Komponenten. Prüfe die Konsole.</p>`;
    });

  // Back to Top Button
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("hidden", window.scrollY < 300);
  });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Mobile Navigation Toggle
  document.getElementById("menu-toggle").addEventListener("click", () => {
    mobileNav.classList.toggle("hidden");
  });
});
