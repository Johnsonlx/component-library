ocument.addEventListener("DOMContentLoaded", () => {
  const componentsContainer = document.getElementById("components-container");
  const tabsContainer = document.getElementById("tabs");
  const searchInput = document.getElementById("searchInput");
  const categoryNav = document.getElementById("category-nav");
  const backToTop = document.getElementById("backToTop");
  const mobileNav = document.getElementById("mobile-nav");
  const menuToggle = document.getElementById("menu-toggle");

  const components = [
    { category: "Buttons", name: "Primärer Button", html: "<button class='bg-blue-500 text-white px-4 py-2 rounded'>Klick mich</button>" },
    { category: "Buttons", name: "Sekundärer Button", html: "<button class='bg-gray-300 text-black px-4 py-2 rounded'>Abbrechen</button>" },
    { category: "Modals", name: "Einfaches Modal", html: "<div class='p-4 border rounded shadow'>Modal-Inhalt</div>" },
    { category: "Cards", name: "Info-Karte", html: "<div class='p-4 bg-white border rounded shadow'>Kartentext</div>" },
    { category: "Formulare", name: "Login Formular", html: "<form><input class='border p-2 rounded w-full mb-2' placeholder='Benutzername'><input class='border p-2 rounded w-full mb-2' placeholder='Passwort' type='password'><button class='bg-blue-500 text-white px-4 py-2 rounded w-full'>Login</button></form>" }
  ];

  const categories = [...new Set(components.map(c => c.category))];

  function createTabs() {
    tabsContainer.innerHTML = "";
    categories.forEach(category => {
      const tab = document.createElement("button");
      tab.textContent = category;
      tab.className = "px-3 py-1 bg-gray-200 hover:bg-blue-500 hover:text-white rounded text-sm";
      tab.addEventListener("click", () => {
        document.getElementById(`section-${category}`).scrollIntoView({ behavior: "smooth" });
      });
      tabsContainer.appendChild(tab);
    });
  }

  function renderComponents(filteredComponents = components) {
    componentsContainer.innerHTML = "";
    categoryNav.innerHTML = "";
    mobileNav.innerHTML = "";

    const grouped = filteredComponents.reduce((acc, comp) => {
      if (!acc[comp.category]) acc[comp.category] = [];
      acc[comp.category].push(comp);
      return acc;
    }, {});

    Object.keys(grouped).forEach(category => {
      const section = document.createElement("section");
      section.id = `section-${category}`;
      section.className = "mb-12";

      const heading = document.createElement("h2");
      heading.textContent = category;
      heading.className = "text-2xl font-bold mb-4 mt-8 scroll-mt-28";
      section.appendChild(heading);

      grouped[category].forEach(comp => {
        const card = document.createElement("div");
        card.className = "mb-6 p-4 bg-white border border-gray-300 rounded shadow";
        const title = document.createElement("h3");
        title.textContent = comp.name;
        title.className = "font-semibold mb-2";
        const preview = document.createElement("div");
        preview.innerHTML = comp.html;
        preview.className = "mb-2";
        card.appendChild(title);
        card.appendChild(preview);
        section.appendChild(card);
      });

      componentsContainer.appendChild(section);

      const navLink = document.createElement("button");
      navLink.textContent = category;
      navLink.className = "px-3 py-1 text-sm text-gray-700 hover:text-blue-600";
      navLink.addEventListener("click", () => {
        document.getElementById(`section-${category}`).scrollIntoView({ behavior: "smooth" });
      });

      const mobileLink = navLink.cloneNode(true);
      mobileLink.addEventListener("click", () => {
        mobileNav.classList.add("hidden");
        document.getElementById(`section-${category}`).scrollIntoView({ behavior: "smooth" });
      });

      categoryNav.appendChild(navLink);
      mobileNav.appendChild(mobileLink);
    });
  }

  function handleSearch() {
    const query = searchInput.value.toLowerCase();
    const filtered = components.filter(comp =>
      comp.name.toLowerCase().includes(query) || comp.category.toLowerCase().includes(query)
    );
    renderComponents(filtered);
  }

  function updateActiveNav() {
    const scrollPos = window.scrollY + 150;

    categories.forEach(category => {
      const section = document.getElementById(`section-${category}`);
      const link = [...categoryNav.children].find(btn => btn.textContent === category);
      if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
        link.classList.add("text-blue-600", "font-semibold");
      } else {
        link.classList.remove("text-blue-600", "font-semibold");
      }
    });
  }

  window.addEventListener("scroll", () => {
    updateActiveNav();
    if (window.scrollY > 300) {
      backToTop.classList.remove("hidden");
    } else {
      backToTop.classList.add("hidden");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  searchInput.addEventListener("input", handleSearch);

  menuToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("hidden");
  });

  createTabs();
  renderComponents();
});

