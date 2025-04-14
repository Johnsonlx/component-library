const container = document.getElementById("components-container");
const nav = document.createElement("nav");
nav.id = "category-nav";

// Navigation vor den Komponenten-Container innerhalb von <main> einfügen
document.querySelector("main").insertBefore(nav, container);

fetch("components.json")
  .then(res => res.json())
  .then(components => {
    const categories = [...new Set(components.map(c => c.category))];

    // Navigation aufbauen
    categories.forEach(cat => {
      const link = document.createElement("a");
      link.href = `#${cat}`;
      link.textContent = cat;
      nav.appendChild(link);
    });

    // Komponenten anzeigen
    let currentCategory = "";
    components.forEach(component => {
      if (component.category !== currentCategory) {
        const heading = document.createElement("h2");
        heading.id = component.category;
        heading.textContent = component.category;
        container.appendChild(heading);
        currentCategory = component.category;
      }

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
          container.appendChild(div);

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
