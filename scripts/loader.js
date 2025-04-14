const container = document.getElementById("components-container");
const nav = document.createElement("nav");
nav.id = "category-nav";

// Sicherstellen, dass das nav-Element ganz oben im main-Container landet
const main = document.querySelector("main");
main.insertBefore(nav, main.firstChild);

// Navigation einfügen
if (container && container.parentElement === document.body) {
  document.body.insertBefore(nav, container);
} else {
  document.querySelector("main").insertBefore(nav, container);
}

fetch("components.json")
  .then(res => res.json())
  .then(components => {
    // Kategorien alphabetisch sortieren
    const categories = [...new Set(components.map(c => c.category))].sort();

    // Navigation aufbauen
    categories.forEach(cat => {
      const link = document.createElement("a");
      link.href = `#${cat}`;
      link.textContent = cat;
      nav.appendChild(link);
    });

    // Komponentengruppen-Wrapper für jede Kategorie anlegen
    const categorySections = {};

    categories.forEach(cat => {
      const section = document.createElement("section");
      section.id = cat;

      const heading = document.createElement("h2");
      heading.textContent = cat;
      section.appendChild(heading);

      container.appendChild(section);
      categorySections[cat] = section;
    });

    // Komponenten nach Kategorie & Titel sortieren
    components
      .sort((a, b) => {
        if (a.category === b.category) {
          return a.title.localeCompare(b.title);
        }
        return a.category.localeCompare(b.category);
      })
      .forEach(component => {
        fetch(component.file)
          .then(res => {
            if (!res.ok) {
              throw new Error(`Datei nicht gefunden: ${component.file}`);
            }
            return res.text();
          })
          .then(html => {
            const div = document.createElement("div");
            div.className = "component";
            div.innerHTML = `
              <h3>${component.title}</h3>
              <div class="preview">${html}</div>
              <pre><button class="copy-btn">Copy</button><code>${html.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
            `;

            categorySections[component.category].appendChild(div);

            const copyBtn = div.querySelector(".copy-btn");
            copyBtn.addEventListener("click", () => {
              const codeText = div.querySelector("code").textContent;
              navigator.clipboard.writeText(codeText)
                .then(() => {
                  copyBtn.textContent = "Kopiert!";
                  setTimeout(() => copyBtn.textContent = "Copy", 2000);
                })
                .catch(err => console.error("Fehler beim Kopieren:", err));
            });
          })
          .catch(err => console.error(`Fehler beim Laden von ${component.file}:`, err));
      });
  })
  .catch(err => {
    console.error("Fehler beim Laden der components.json:", err);
    container.innerHTML = `<p style="color:red">Fehler beim Laden der Komponenten. Prüfe die Konsole.</p>`;
  });
