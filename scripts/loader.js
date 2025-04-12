const container = document.getElementById("components-container");

const components = [
  {
    category: "Buttons",
    title: "Primary Button",
    file: "components/buttons/button-primary.html"
    file: "components/buttons/button-icon.html"
    file: "components/buttons/button-secondary.html"
    file: "components/buttons/button1.html"
  },
  {
    category: "Navbars",
    title: "Simple Navbar",
    file: "components/navbars/navbar-basic.html"
    file: "components/navbars/navbar-dropdown.html"
    file: "components/navbars/navbar-responsive.html"
    file: "components/navbars/navbar1.html"
  },
  {
    category: "Cards",
    title: "Basic Card",
    file: "components/cards/card-basic.html"
    file: "components/cards/card-image.html"
    file: "components/cards/card-product.html"
    file: "components/cards/card1.html"
  }
  {
    category: "Forms",
    title: "Basic Forms",
    file: "components/forme/form-contact.html"
    file: "components/forms/form-login.html"
    file: "components/forms/form1.html"
    file: "components/forms/search-form.html"
  }
  {
    category: "Modals",
    title: "Basic Modals",
    file: "components/modals/modal-confirmation.html"
    file: "components/modals/modal-image.html"
    file: "components/modals/modal-simple.html"
    file: "components/modals/modal1.html"
  }
  {
    category: "Tooltips",
    title: "Basic Tooltips",
    file: "components/tooltips/tooltip-basic.html"
    file: "components/tooltips/tooltip-icon.html"
    file: "components/tooltips/tooltip-positions.html"
    file: "components/tooltips/tooltip1.html"
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
