// ===== Marina Shop - content sourced from berowrawatersboathire.com.au =====

const marinaShopSections = [
  {
    id: "bottleshop",
    icon: "ti-bottle",
    image: null,
    title: "Bottle Shop",

    subtitle: "Wine, beer & spirits",
    special: false,
    html: `
      <p>A good selection of wines, beer and spirits — sold individually,
      by the six-pack, or by the carton. Wine is available in small
      187-200ml bottles or large bottles, perfect for take away or to
      enjoy at the Fish Café next door.</p>
    `
  },
  {
    id: "chandlery",
    icon: "ti-tool",
    image: null,
    title: "Chandlery",

    subtitle: "Boat essentials & spares",
    special: false,
    html: `
      <p>A small range of ship chandlery items to get you through any
      minor emergency on the water — bilge pumps, oils and lubricants,
      navigation lights, ropes, fuel tanks and fittings, and bungs.</p>
    `
  },
  {
    id: "tackle",
    icon: "ti-fish",
    image: null,
    title: "Fishing Tackle",

    subtitle: "Bait, tackle & gear",
    special: false,
    html: `
      <p>Everything you need for a day's fishing on Berowra Creek — fresh
      bait, ice, hooks, sinkers, lures and line. Not sure what's biting?
      Ask our staff for local tips before you head out.</p>
    `
  },
  {
    id: "fuelessentials",
    icon: "ti-gas-station",
    image: null,
    title: "Fuel & Essentials",
    subtitle: "Fuel, LPG, firewood, ice, snacks",
    special: false,
    html: `
      <p>Diesel and premium unleaded fuel, Swap and Go LPG, and firewood
      for your camp or BBQ.</p>
      <p>Also on hand: ice, snack food, ice creams and soft drinks for
      your day on the water.</p>
    `
  }
];

function openMarinaShopPage() {
  renderMarinaShopList();
  document.getElementById("marina-shop-viewer").classList.add("open");
  toggleMenu();
}

function closeMarinaShopPage() {
  document.getElementById("marina-shop-viewer").classList.remove("open");
}

function renderMarinaShopList() {
  const listEl = document.getElementById("marina-shop-list");
  listEl.innerHTML = "";

  marinaShopSections.forEach(section => {
    const card = document.createElement("div");
    card.className = "guide-card" + (section.special ? " guide-card-special" : "");

    const iconHtml = section.image
      ? `<img src="${section.image}" class="shop-card-thumb" alt="${section.title}">`
      : `<i class="ti ${section.icon}" style="font-size:24px; color:#0a3d63;"></i>`;

    card.innerHTML = `
      <div class="guide-card-header" onclick="toggleShopSection('${section.id}')">
        <div class="guide-card-header-left">
          ${iconHtml}
          <div>
            <div class="guide-card-title">${section.title}</div>
            <div class="guide-card-subtitle">${section.subtitle}</div>
          </div>
        </div>
        <i class="ti ti-chevron-right guide-chevron" id="shop-chevron-${section.id}"></i>
      </div>
      <div class="guide-card-body" id="shop-body-${section.id}">
        ${section.html}
      </div>
    `;
    listEl.appendChild(card);
  });
}

function toggleShopSection(id) {
  const body = document.getElementById("shop-body-" + id);
  const chevron = document.getElementById("shop-chevron-" + id);
  body.classList.toggle("open");
  chevron.classList.toggle("open");
}
