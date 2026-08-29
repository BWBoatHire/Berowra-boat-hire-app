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
    special: true, // flags this as business-specific, not NSW law - styled differently
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
        <svg width="100%" height="130" viewBox="0 0 300 130">
          <rect x="60" y="0" width="90" height="130" fill="#8fc1e8"></rect>
          <text x="10" y="20" font-size="9" fill="#666">towards the sea</text>
          <text x="185" y="20" font-size="9" fill="#666">towards the marina</text>
          <line x1="105" y1="10" x2="105" y2="120" stroke="#666" stroke-width="1" stroke-dasharray="3,3"></line>
          <rect x="70" y="35" width="16" height="16" fill="#cc0000"></rect>
          <text x="60" y="65" font-size="8" fill="#111">Red mark</text>
          <polygon points="130,35 122,55 138,55" fill="#2e8b2e"></polygon>
          <text x="115" y="65" font-size="8" fill="#111">Green mark</text>
          <path d="M50 100 L 160 100" stroke="#111" stroke-width="2" marker-end="url(#arrow)"></path>
          <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#111"></path></marker></defs>
          <text x="60" y="118" font-size="8" fill="#111">Heading out: red on your right</text>
        </svg>
      </div>
      <p>Navigation marks (also called buoys) show you the edges of the safe
      channel. Each has a colour, shape and position that tells you which
      side to pass it on.</p>
      <p><strong>Leaving the marina (heading toward the sea):</strong><br>
      Keep red marks on your right, and green marks on your left.</p>
      <p><strong>Returning to the marina (heading back upstream):</strong><br>
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
      <p><strong>The speed zone</strong> in Berowra Creek from the Marina through to Calabash Bay is 4
      knots and is strictly enforced (fines apply) by both NSW Maritime Compliancce Officers and NSW Maritime Police — check for the sign, or use the Map Layers panel to see the zone
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
