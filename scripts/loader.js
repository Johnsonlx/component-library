   const container = document.getElementById("components-container");
      const nav = document.getElementById("category-nav");

      fetch("components.json")
        .then(res => res.json())
        .then(components => {
          const categories = [...new Set(components.map(c => c.category))].sort();

          categories.forEach(cat => {
            const link = document.createElement("a");
            link.href = `#${cat}`;
            link.textContent = cat;
            link.className = "bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition transform hover:-translate-y-1";
            nav.appendChild(link);
          });

          const categorySections = {};

          categories.forEach(cat => {
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
                    <pre class="relative bg-gray-100 p-3 rounded overflow-x-auto text-sm"><button class="copy-btn absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">Copy</button><code>${html.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
                  `;

                  categorySections[component.category].appendChild(div);

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
        })
        .catch(err => {
          console.error("Fehler beim Laden der components.json:", err);
          container.innerHTML = `<p class="text-red-600">Fehler beim Laden der Komponenten. Prüfe die Konsole.</p>`;
        });


// Scrollspy + Zurück nach oben + Mobile Menü
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('category-nav');
  const toggleNav = document.getElementById('toggleNav');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const container = document.getElementById('components-container');


  // Komponenten laden
  categories.forEach(cat => {
    container.insertAdjacentHTML('beforeend', components[cat.id]);

    const link = document.createElement('a');
    link.href = `#${cat.id}`;
    link.textContent = cat.label;
    link.className = 'px-3 py-1 rounded bg-gray-700 text-white text-sm hover:bg-gray-800 transition';
    nav.appendChild(link);
  });

  // Scrollspy
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    categories.forEach(cat => {
      const section = document.getElementById(cat.id);
      const link = nav.querySelector(`a[href="#${cat.id}"]`);
      if (section.offsetTop <= scrollY + 100 && section.offsetTop + section.offsetHeight > scrollY + 100) {
        link.classList.add('active-link');
      } else {
        link.classList.remove('active-link');
      }
    });

    // Zurück nach oben anzeigen
    if (scrollY > 400) {
      backToTopBtn.classList.remove('hidden');
    } else {
      backToTopBtn.classList.add('hidden');
    }
  });

  // Zurück nach oben
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Mobile Nav Toggle
  toggleNav?.addEventListener('click', () => {
    nav.classList.toggle('hidden');
  });
});
