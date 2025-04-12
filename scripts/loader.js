const container = document.getElementById("components-container");

const components = [
  {
    category: "Buttons",
    title: "Primary Button",
    file: "components/buttons/button-primary.html"
  },
  {
    category: "Navbars",
    title: "Simple Navbar",
    file: "components/navbars/navbar-basic.html"
  },
  {
    category: "Cards",
    title: "Basic Card",
    file: "components/cards/card-basic.html"
  }
];

let currentCategory = "";

components.forEach(component => {
  if (component.category !== currentCategory) {
    const heading = document.createElement("h2");
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
        <pre><code>${html.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
      `;
      container.appendChild(div);
    });
});