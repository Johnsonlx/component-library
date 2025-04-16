const container = document.getElementById("components-container");
const nav = document.getElementById("category-nav");
let allComponents = [];
let currentCategory = null;

// "Alle anzeigen"-Button erstellen
const allButton = document.createElement("button");
allButton.textContent = "Alle anzeigen";
allButton.className = "category-tab px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition active-tab";
allButton.dataset.category = "ALL";
nav.appendChild(allButton);

// Fetch Komponenten
fetch("components.json")
  .then(res => res.json())
  .then(components => {
    allComponents = components;
    const categories = [...new Set(components.map(c => c.category))].sort();

    categories.forEach(cat => {
      const link = document.createElement("button");
      link.textContent = cat;
      link.className = "category-tab px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition";
      link.dataset.category = cat;
      nav.appendChild(link);
    });

    renderComponents(components);

    // Kategorie-Button Events
    document.querySelectorAll(".category-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        const selectedCat = btn.dataset.category;
        currentCategory = selectedCat;

        document.querySelectorAll(".category-tab").forEach(b => b.classList.remove("active-tab"));
        btn.classList.add("active-tab");

        if (selectedCat === "ALL") {
          renderComponents(allComponents);
        } else {
          const filtered = allComponents.filter(c => c.category === selectedCat);
          renderComponents(filtered);
        }
      });
    });
  });

function renderComponents(components) {
  container.innerHTML = "";

  // "Nützliche Links"-Sektion anzeigen/verstecken
  const staticLinks = document.getElementById("static-links");
  if (staticLinks) {
    staticLinks.style.display = (components.length === allComponents.length) ? "block" : "none";
  }

  components.forEach(component => {
    fetch(component.file)
      .then(res => res.text())
      .then(html => {
        const wrapper = document.createElement("div");
        wrapper.className = "component-wrapper w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6 mb-10";

        wrapper.innerHTML = `
          <h3 class="component-title text-xl font-semibold mb-4 text-gray-900 dark:text-white">${component.title}</h3>
          <div class="preview w-full bg-gray-50 dark:bg-gray-700 p-4 rounded border border-dashed border-gray-300 dark:border-gray-600 mb-4">
            ${html}
          </div>
          <pre class="relative bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white p-4 rounded overflow-x-auto text-sm">
            <button class="copy-btn absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">Copy</button>
            <code>${html.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>
          </pre>
        `;

        container.appendChild(wrapper);

        // Copy-Button
        wrapper.querySelector(".copy-btn").addEventListener("click", () => {
          const codeText = wrapper.querySelector("code").textContent;
          navigator.clipboard.writeText(codeText).then(() => {
            const btn = wrapper.querySelector(".copy-btn");
            btn.textContent = "Kopiert!";
            setTimeout(() => btn.textContent = "Copy", 2000);
          });
        });
      });
  });
}

// Suche
document.getElementById("search").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = allComponents.filter(c =>
    c.title.toLowerCase().includes(term) || c.category.toLowerCase().includes(term)
  );
  renderComponents(filtered);

  // Tabs visuell zurücksetzen, wenn Suche aktiv ist
  document.querySelectorAll(".category-tab").forEach(b => b.classList.remove("active-tab"));
});

// Dark Mode Toggle
document.getElementById("darkToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
});
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}

// Back to Top
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("hidden", window.scrollY < 300);
});
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
