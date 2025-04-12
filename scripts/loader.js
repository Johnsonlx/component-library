const container = document.getElementById("components-container");

const categories = [
  { name: "Buttons", path: "buttons" },
  { name: "Cards", path: "cards" },
  { name: "Forms", path: "forms" },
  { name: "Modals", path: "modals" },
  { name: "Navbars", path: "navbars" },
  { name: "Tooltips", path: "tooltips" }
];

categories.forEach(category => {
  const heading = document.createElement("h2");
  heading.textContent = category.name;
  container.appendChild(heading);

 fetch("components.json")
  .then(res => res.json())
  .then(components => {
    const container = document.getElementById("components-container");
    const nav = document.getElementById("category-nav");
    const categories = [...new Set(components.map(c => c.category))];

    // Navigation
    categories.forEach(cat => {
      const link = document.createElement("a");
      link.href = `#${cat}`;
      link.textContent = cat;
      nav.appendChild(link);
    });

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
          });
      });
    });
});
