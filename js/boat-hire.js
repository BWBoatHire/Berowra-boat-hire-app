// ===== Boat Hire - content sourced from berowrawatersboathire.com.au and the current pricing flyer =====

const boatHireSections = [
  {
    id: "yellowdory",
    group: "No Licence Required",
    image: "https://berowrawatersboathire.com.au/wp-content/uploads/2021/04/Yellow-Dory-4.jpg",
    title: "Yellow Dory",
    specs: "Steering wheel · Seats 5 · $500 bond",
    prices: ["2hrs $170", "Half day $220", "Full day $290"],
    html: `<p>A great option for less confident drivers — side console steering
    wheel makes it feel just like driving a car, but on the water. Comes with
    a large shade cover and anchor.</p>`
  },
  {
    id: "bluepolycraft",
    group: "No Licence Required",
    image: "https://berowrawatersboathire.com.au/wp-content/uploads/2021/04/Blue-polycrafts-4.jpg",
    title: "Blue Polycraft",
    specs: "Tiller steer · Seats 5 · $200 bond",
    prices: ["2hrs $120", "3hrs $160", "4hrs $180", "Full day $220"],
    html: `<p>A stable, carpeted little boat that's especially good for families
    with smaller children. Comes with an anchor and a large shade cover for
    extra protection.</p>`
  },
  {
    id: "bbqboat",
    group: "No Licence Required",
    image: "https://berowrawatersboathire.com.au/wp-content/uploads/2021/04/12-seater-BBQ-boat.jpg",
    title: "BBQ Boat",
    specs: "Seats 12 · Toilet, BBQ, swim ladder · $500 bond",
    prices: ["Full day $495", "Half day $395"],
    html: `<p>The perfect fishing boat or party boat — licensed to carry up to
    12 people including children. Comes with a toilet, BBQ, steering wheel
    for easy driving, and a large shade cover.</p>`
  },
  {
    id: "luxurybbq",
    group: "No Licence Required",
    image: "https://berowrawatersboathire.com.au/wp-content/uploads/2021/04/The-Don-2.jpg",
    title: "Luxury BBQ Boat",
    specs: "Seats 10 · Toilet, BBQ, swim ladder · $500 bond",
    prices: ["Full day $495", "Half day $395"],
    html: `<p>Cruise the Hawkesbury in comfort — large shade cover, comfortable
    seats, carpet, toilet, BBQ, anchor and swim ladder. The steering wheel
    makes it easy for any novice to drive.</p>`
  },
  {
    id: "kayaks",
    group: "No Licence Required",
    image: null,
    title: "Kayaks",
    specs: "Single or double",
    prices: ["Single from $30", "Double from $50"],
    html: `
      <p><strong>Single Kayak:</strong> 2hrs $30, 4hrs $50, full day $70, overnight $120</p>
      <p><strong>Double Kayak:</strong> 2hrs $50, 4hrs $70, full day $110, overnight $190</p>
    `
  },
  {
    id: "sportsrider",
    group: "Licence Required",
    image: "https://berowrawatersboathire.com.au/wp-content/uploads/2021/04/sportsriderBerowra1-1.jpg",
    title: "BOAB Sportsrider",
    specs: "100HP · Skiing, tubing, fishing",
    prices: ["Contact for pricing"],
    html: `<p>Our most powerful boat — an ideal choice for skiing, tubing or
    fishing further afield. Comes with padded seats and a shade cover.
    Water sports equipment can be hired separately. Boat licence required.</p>`
  },
  {
    id: "runabout",
    group: "Licence Required",
    image: "https://berowrawatersboathire.com.au/wp-content/uploads/2021/04/runabout-1.jpg",
    title: "BOAB Runabout",
    specs: "Also available with restrictor, no licence needed",
    prices: ["Contact for pricing"],
    html: `<p>A versatile runabout suited to fishing or exploring further along
    the river. Ask staff about the restrictor option if you'd prefer to hire
    without a boat licence.</p>`
  },
  {
    id: "sundecker",
    group: "Licence Required",
    image: "https://berowrawatersboathire.com.au/wp-content/uploads/2025/01/Serenity-2-1-370x360.jpg",
    title: "30' Sundecker \"Serenity\"",
    specs: "Sleeps 6 · Flybridge cruiser · Up to 8 for a day cruise",
    prices: ["Contact for pricing"],
    html: `<p>A roomy diesel-powered flybridge cruiser with 2 cabins, full
    bathroom with hot/cold shower, kitchen, BBQ and comfortable lounge areas.
    Available for a day cruise or longer charter. Boat licence required.</p>`
  }
];

function openBoatHirePage() {
  renderBoatHireList();
  document.getElementById("boat-hire-viewer").classList.add("open");
  toggleMenu();
}

function closeBoatHirePage() {
  document.getElementById("boat-hire-viewer").classList.remove("open");
}

function renderBoatHireList() {
  const listEl = document.getElementById("boat-hire-list");
  listEl.innerHTML = "";
  let lastGroup = null;

  boatHireSections.forEach(section => {
    if (section.group !== lastGroup) {
      const heading = document.createElement("p");
      heading.className = "tile-row-label";
      heading.style.marginTop = lastGroup ? "16px" : "0";
      heading.textContent = section.group;
      listEl.appendChild(heading);
      lastGroup = section.group;
    }

    const card = document.createElement("div");
    card.className = "guide-card";

    const imgHtml = section.image
      ? `<img src="${section.image}" class="boat-card-thumb" alt="${section.title}">`
      : `<div class="boat-card-thumb-fallback"><i class="ti ti-anchor"></i></div>`;

    const priceBadges = section.prices.map(p =>
      `<span class="boat-price-badge${p === 'Contact for pricing' ? ' boat-price-pending' : ''}">${p}</span>`
    ).join("");

    card.innerHTML = `
      <div class="boat-card-row" onclick="toggleBoatSection('${section.id}')">
        ${imgHtml}
        <div class="boat-card-info">
          <div class="boat-card-header-line">
            <div class="guide-card-title">${section.title}</div>
            <i class="ti ti-chevron-right guide-chevron" id="boat-chevron-${section.id}"></i>
          </div>
          <div class="guide-card-subtitle">${section.specs}</div>
          <div class="boat-price-row">${priceBadges}</div>
        </div>
      </div>
      <div class="guide-card-body" id="boat-body-${section.id}">
        ${section.html}
      </div>
    `;
    listEl.appendChild(card);
  });
}

function toggleBoatSection(id) {
  const body = document.getElementById("boat-body-" + id);
  const chevron = document.getElementById("boat-chevron-" + id);
  body.classList.toggle("open");
  chevron.classList.toggle("open");
}
