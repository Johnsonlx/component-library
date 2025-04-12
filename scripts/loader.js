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

  fetch(`components/${category.path}/`)
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const links = Array.from(doc.links).filter(link =>
        link.href.endsWith(".html")
      );

      links.forEach(link => {
        const file = link.href;
        const filename = file.split("/").pop().replace(".html", "").replace(/[-_]/g, " ");

        fetch(file)
          .then(res => res.text())
          .then(content => {
            const div = document.createElement("div");
            div.className = "component";
            div.innerHTML = `
              <h3>${filename}</h3>
              <div class="preview">${content}</div>
              <pre><code>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
            `;
            container.appendChild(div);
          });
      });
    });
});
