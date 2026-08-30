// ===== Boating Essentials - condensed reference for customers =====
// Content summarised from the NSW Boating Handbook (Transport for NSW),
// paraphrased into plain language. Refer to the official handbook for
// full legal detail: not a substitute for the safety briefing given at
// time of hire.

const boatingGuideSections = [
  {
    id: "conditions",
    icon: "ti-anchor",
    title: "Conditions of Hire",
    subtitle: "Return time & hire area limits",
    special: true,
    // PLACEHOLDER WORDING - confirm exact time and rules with business owner before publishing
    html: `
      <p><strong>All hire boats must be back at the marina by 4:00pm.</strong></p>
      <p>Your hire boat must not travel past the Berowra Waters ferry crossing.
      As you leave the marina, keep left (downstream, toward the sea) — do not
      turn right across the ferry line toward Silverwater.</p>
      <p style="color:#a3341d; font-size:12px;"><em>This section needs confirmation from the marina team before your trip. Please check with staff if you're unsure of your hire area or return time.</em></p>
    `
  },
  {
    id: "markers",
    icon: "ti-anchor",
    title: "Reading the Markers",
    subtitle: "Port, starboard & cardinal marks",
    special: false,
    html: `
      <div class="guide-diagram-wrap">
        <svg width="100%" height="290" viewBox="0 0 300 290">
          <text x="150" y="18" font-size="7.5" fill="#0a3d63" text-anchor="middle">(back to Berowra Waters Marina)</text>
          <polygon points="150,30 225,65 185,65 185,205 225,205 150,240 75,205 115,205 115,65 75,65"
            fill="#8fc1e8" stroke="#5a9bc4" stroke-width="1.5"></polygon>
          <text x="150" y="56" font-size="11" font-weight="bold" fill="#0a3d63" text-anchor="middle">UPSTREAM</text>
          <polygon points="215,72 207,86 223,86" fill="#2e8b2e"></polygon>
          <text x="215" y="100" font-size="7" fill="#111" text-anchor="middle">Green to Green</text>
          <text x="215" y="112" font-size="7" fill="#111" text-anchor="middle">Upstream</text>
          <rect x="167" y="87" width="16" height="24" fill="white" stroke="#999" stroke-width="0.5"></rect>
          <polygon points="167,87 175,75 175,87" fill="#cc0000"></polygon>
          <polygon points="183,87 175,75 175,87" fill="#2e8b2e"></polygon>
          <text x="150" y="132" font-size="7" font-weight="bold" fill="#0a3d63" text-anchor="middle" transform="rotate(90 150 132)">Keep to right in a channel</text>
          <rect x="117" y="156" width="16" height="24" fill="white" stroke="#999" stroke-width="0.5"></rect>
          <polygon points="117,180 125,192 125,180" fill="#2e8b2e"></polygon>
          <polygon points="133,180 125,192 125,180" fill="#cc0000"></polygon>
          <text x="85" y="164" font-size="7" fill="#111" text-anchor="middle">Red to Green</text>
          <text x="85" y="176" font-size="7" fill="#111" text-anchor="middle">Downstream</text>
          <rect x="76" y="182" width="18" height="18" fill="#cc0000"></rect>
          <text x="150" y="220" font-size="11" font-weight="bold" fill="#0a3d63" text-anchor="middle">DOWNSTREAM</text>
          <text x="150" y="258" font-size="7.5" fill="#0a3d63" text-anchor="middle">(away from Berowra Waters Marina)</text>
        </svg>
      </div>

      <p>Navigation marks (also called buoys) show you the edges of the safe
      channel. Each has a colour, shape and position that tells you which
      side to pass it on.</p>
      <p>When you sit in the boat facing forward, your <strong>right</strong>
      side is <strong>starboard</strong>, and your <strong>left</strong>
      side is <strong>port</strong>. Red marks are port, green marks are
      starboard.</p>
      <p><strong>Heading downstream, away from the marina:</strong><br>
      Keep red marks on your right, and green marks on your left.</p>
      <p><strong>Heading upstream, back to the marina:</strong><br>
      It flips — keep red marks on your left, and green marks on your right.</p>
      <p>If you see a pair of marks close together — one red, one green — the
      safe path is to travel between them.</p>

      <p>You may also see <strong>cardinal marks</strong> — black and yellow
      striped buoys used to mark a specific hazard, like a rock or shallow
      patch. They tell you which side of the hazard is safe: for example, an
      east cardinal mark means it's safe to pass on the eastern side of it.</p>
    `
  },
  {
    id: "safety",
    icon: "ti-vest",
    title: "Safety Equipment",
    subtitle: "What your hire boat must carry",
    special: false,
    html: `
      <p>Your hire boat is fitted out with everything required by law for
      enclosed waters like Berowra Creek. Here's what should be on board,
      and why it matters:</p>
      <p><strong>Lifejackets</strong> — one for every person on board, at all
      times, even if they don't have to be worn the whole trip.</p>
      <p><strong>Anchor and line</strong> — lets you hold your position
      against tide or current, or stop the boat drifting if you have engine
      trouble.</p>
      <p><strong>Bailer or bucket</strong> — for removing water from inside
      the boat if needed.</p>
      <p><strong>Fire extinguisher</strong> — required for any boat with an
      engine that starts with a key or button.</p>
      <p><strong>Paddles</strong> — a backup way to move the boat if the
      engine fails.</p>
      <p><strong>Sound signal</strong> (horn or whistle) and <strong>waterproof
      torch</strong> — for attracting attention or being seen if needed.</p>
      <p>If anything looks missing or not working properly, let marina staff
      know before you head out.</p>
    `
  },
  {
    id: "rightofway",
    icon: "ti-arrows-cross",
    title: "Right of Way",
    subtitle: "Giving way, channels & rivers",
    special: false,
    html: `
      <p><strong>Keep to the right</strong> — in Berowra Creek, stay as far
      to the right-hand (starboard) side of the waterway as you reasonably
      can. This makes it clear to other boats which way you're going,
      especially around bends.</p>
      <p><strong>Meeting another boat head-on?</strong> Both boats turn right
      and pass each other at a safe distance.</p>
      <p><strong>Crossing paths with another boat?</strong> Give way to
      boats approaching from your right.</p>
      <p><strong>Sailing boats and paddlers</strong> (kayaks, canoes) —
      powered boats should keep a good lookout and give way to them where
      possible.</p>
      <p><strong>Always keep a proper lookout</strong> — look all around,
      including behind you, especially at bends where you can't see what's
      coming.</p>
      <p>Both skippers are responsible for avoiding a collision — don't
      assume the other boat will always do the right thing.</p>
    `
  },
  {
    id: "speedwash",
    icon: "ti-gauge",
    title: "Speed & Wash",
    subtitle: "Knot limits, minimising your wake",
    special: false,
    html: `
      <p>Speed on the water is measured in <strong>knots</strong>, not km/h.
      As a rough guide: 4 knots is about a fast walking pace, 8 knots is
      about a jogging pace.</p>
      <p><strong>Speed zones</strong> in Berowra Creek are usually 4 or 8
      knots — check the sign, or use the Map Layers panel to see the zone
      boundaries on the map.</p>
      <p><strong>Even without a sign, you must always travel at a safe
      speed</strong> — one that gives you enough time to stop or turn to
      avoid a sudden hazard.</p>
      <p><strong>Wash</strong> is the wake your boat creates. In No Wash
      zones — and near moored boats, the shore, or other vessels — slow
      right down. Excessive wash can rock other boats, damage the
      shoreline, and is your responsibility if it causes damage.</p>
      <p>A good habit: look behind you occasionally to check how much wash
      you're creating, and slow down if it looks like it could disturb
      others.</p>
    `
  },
  {
    id: "mapkey",
    icon: "ti-map-2",
    title: "Map Key",
    subtitle: "What the map symbols mean",
    special: false,
    html: `
      <p class="guide-legend-heading">Navigation Marks</p>
      <div class="guide-legend-row"><span class="guide-legend-dot" style="background:#cc0000"></span>Port-hand marker</div>
      <div class="guide-legend-row"><span class="guide-legend-dot" style="background:#2e8b2e"></span>Starboard-hand marker</div>
      <div class="guide-legend-row"><span class="guide-legend-dot" style="background:#e6c200"></span>Water quality buoy</div>
      <div class="guide-legend-row"><span class="guide-legend-cardinal" style="background:linear-gradient(to bottom,black 33%,#f2d600 33%,#f2d600 66%,black 66%)"></span>East cardinal <em class="guide-verified">✓ verified locally</em></div>
      <div class="guide-legend-row"><span class="guide-legend-cardinal" style="background:linear-gradient(to bottom,black 50%,#f2d600 50%)"></span><span class="guide-legend-muted">North cardinal</span></div>
      <div class="guide-legend-row"><span class="guide-legend-cardinal" style="background:linear-gradient(to bottom,#f2d600 50%,black 50%)"></span><span class="guide-legend-muted">South cardinal</span></div>
      <div class="guide-legend-row"><span class="guide-legend-cardinal" style="background:linear-gradient(to bottom,#f2d600 25%,black 25%,black 75%,#f2d600 75%)"></span><span class="guide-legend-muted">West cardinal</span></div>

      <p class="guide-legend-heading">Buoys</p>
      <div class="guide-legend-row"><span class="guide-legend-buoy" style="color:#ff69b4"></span>Public buoy <em class="guide-verified">✓ official data</em></div>
      <div class="guide-legend-row"><span class="guide-legend-buoy" style="color:#4169e1"></span>Emergency buoy (Police/Maritime) <em class="guide-verified">✓ official data</em></div>
      <div class="guide-legend-row"><span class="guide-legend-buoy" style="color:#e6c200"></span>Private buoy <em class="guide-pending">pending confirmation</em></div>
      <div class="guide-legend-row"><span class="guide-legend-buoy" style="color:#cc0000"></span>Commercial buoy <em class="guide-pending">pending confirmation</em></div>

      <p class="guide-legend-heading">Map Layers / Zones</p>
      <div class="guide-legend-row"><span class="guide-legend-zone guide-zone-shallow"></span>Shallow water</div>
      <div class="guide-legend-row"><span class="guide-legend-zone" style="background:#ff8c00; opacity:0.5"></span>Speed zone</div>
      <div class="guide-legend-row"><span class="guide-legend-zone" style="background:#9932cc; opacity:0.5"></span>No wash zone</div>
      <div class="guide-legend-row"><span class="guide-legend-zone" style="background:#dc143c; opacity:0.5"></span>No towing zone</div>

      <p class="guide-legend-note">Cardinal and buoy colours marked "pending confirmation" are based on local knowledge and not yet cross-checked against official sources.</p>
    `
  }
];

function openBoatingGuidePage() {
  renderBoatingGuideList();
  document.getElementById("boating-guide-viewer").classList.add("open");
  toggleMenu();
}

function closeBoatingGuidePage() {
  document.getElementById("boating-guide-viewer").classList.remove("open");
}

function renderBoatingGuideList() {
  const listEl = document.getElementById("boating-guide-list");
  listEl.innerHTML = "";

  boatingGuideSections.forEach(section => {
    const card = document.createElement("div");
    card.className = "guide-card" + (section.special ? " guide-card-special" : "");

    card.innerHTML = `
      <div class="guide-card-header" onclick="toggleGuideSection('${section.id}')">
        <div class="guide-card-header-left">
          <i class="ti ${section.icon}"></i>
          <div>
            <div class="guide-card-title">${section.title}</div>
            <div class="guide-card-subtitle">${section.subtitle}</div>
          </div>
        </div>
        <i class="ti ti-chevron-right guide-chevron" id="chevron-${section.id}"></i>
      </div>
      <div class="guide-card-body" id="body-${section.id}">
        ${section.html}
      </div>
    `;
    listEl.appendChild(card);
  });
}

function toggleGuideSection(id) {
  const body = document.getElementById("body-" + id);
  const chevron = document.getElementById("chevron-" + id);
  body.classList.toggle("open");
  chevron.classList.toggle("open");
}
