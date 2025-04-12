const container = document.getElementById("components-container");
const nav = document.createElement("nav");
nav.id = "category-nav";
document.body.insertBefore(nav, container);

// Komponenten aus JSON laden
fetch("components.json")
  .then(res => res.json())
  .then(components => {
    // Kategorien extrahieren (ohne Duplikate)
    const categories = [...new Set(components.map(c => c.category))];
    
    // Navigation erstellen
    categories.forEach(cat => {
      const link = document.createElement("a");
      link.href = `#${cat}`;
      link.textContent = cat;
      nav.appendChild(link);
    });
    
    // Komponenten nach Kategorien gruppieren und anzeigen
    let currentCategory = "";
    components.forEach(component => {
      if (component.category !== currentCategory) {
        // Neue Kategorie-Überschrift erstellen
        const heading = document.createElement("h2");
        heading.id = component.category;
        heading.textContent = component.category;
        container.appendChild(heading);
        currentCategory = component.category;
      }
      
      // HTML für die Komponente laden
      fetch(component.file)
        .then(res => res.text())
        .then(html => {
          const div = document.createElement("div");
          div.className = "component";
          div.innerHTML = `
            <h3>${component.title}</h3>
            <div class="preview">${html}</div>
            <pre><button class="copy-btn">Copy</button><code>${html.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
          `;
          container.appendChild(div);
          
          // Event-Listener für den Kopier-Button
          const copyBtn = div.querySelector(".copy-btn");
          copyBtn.addEventListener("click", () => {
            const codeText = div.querySelector("code").textContent;
            navigator.clipboard.writeText(codeText)
              .then(() => {
                // Feedback für erfolgreichen Kopiervorgang
                const originalText = copyBtn.textContent;
                copyBtn.textContent = "Kopiert!";
                setTimeout(() => {
                  copyBtn.textContent = originalText;
                }, 2000);
              })
              .catch(err => {
                console.error("Fehler beim Kopieren:", err);
              });
          });
        })
        .catch(error => {
          console.error(`Fehler beim Laden von ${component.file}:`, error);
        });
    });
  })
  .catch(error => {
    console.error("Fehler beim Laden der components.json:", error);
  });
