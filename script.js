/* =========================================================================
   CODE HIVE BRIDGE — site logic
   Reads PROJECTS and SITE_CONFIG from config.js. You shouldn't need to
   edit this file just to add projects or change payment details.
   ========================================================================= */

const STACKS = {
  html:   { label: "HTML",       short: "<>"  },
  css:    { label: "CSS",        short: "{ }" },
  js:     { label: "JavaScript", short: "JS"  },
  python: { label: "Python",     short: "PY"  },
  php:    { label: "PHP",        short: "PHP" },
  mysql:  { label: "MySQL",      short: "DB"  }
};

// How each stack "runs" in the hero terminal — used to build a realistic
// command + output line for every real project in PROJECTS.
const RUN_TEMPLATES = {
  html:   (p) => ({ cmd: `open ${p.id}.html`,      out: `✓ ${p.title} rendered` }),
  css:    (p) => ({ cmd: `open ${p.id}.html`,      out: `✓ ${p.title} rendered` }),
  js:     (p) => ({ cmd: `node ${p.id}.js`,        out: `✓ ${p.title} running` }),
  python: (p) => ({ cmd: `python ${p.id}.py`,      out: `✓ ${p.title} running` }),
  php:    (p) => ({ cmd: `php ${p.id}.php`,        out: `✓ ${p.title} served` }),
  mysql:  (p) => ({ cmd: `mysql < ${p.id}.sql`,    out: `✓ ${p.title} seeded` })
};

const HEX_POINTS = "50,3 95,26 95,74 50,97 5,74 5,26"; // flat-ish pointy hex

function hexSvg(){
  return `<svg viewBox="0 0 100 100"><polygon points="${HEX_POINTS}"/></svg>`;
}

/* ---------- HERO: six-stack orbit hexes ---------- */
function renderStackHexes(){
  const el = document.getElementById("stackHexes");
  if (!el) return;
  el.innerHTML = Object.entries(STACKS).map(([key, s], i) => `
    <div class="orbit-hex oh-${i}" title="${s.label}">
      ${hexSvg()}
      <span>${s.short}</span>
    </div>
  `).join("");
}

/* ---------- HERO: laptop terminal, driven by real projects ---------- */
function buildTerminalQueue(){
  // Pull the run-command for every real project so the demo always
  // matches whatever is actually in PROJECTS — no separate fake list to keep in sync.
  return PROJECTS.map(p => {
    const template = RUN_TEMPLATES[p.stack] || RUN_TEMPLATES.html;
    const { cmd, out } = template(p);
    return { id: p.id, title: p.title, price: p.price, stack: p.stack, cmd, out };
  });
}

function renderStageChips(queue){
  const el = document.getElementById("stageChips");
  if (!el) return;
  const shown = queue.slice(0, 4); // keep the laptop screen readable
  el.innerHTML = shown.map((p, i) => `
    <div class="stage-chip" data-i="${i}">
      <span class="p-name">${p.title}</span>
      <div class="p-meta">
        <span>${STACKS[p.stack]?.short || p.stack}</span>
        <span class="price">${p.price === 0 ? "Free" : "₹" + p.price}</span>
      </div>
    </div>
  `).join("");
}

function initHeroStage(){
  const cmdEl = document.getElementById("stageCmd");
  const outEl = document.getElementById("stageOut");
  const pillEl = document.getElementById("stagePill");
  if (!cmdEl || !outEl) return;

  const queue = buildTerminalQueue();
  if (!queue.length) return;

  const shownCount = Math.min(queue.length, 4);
  renderStageChips(queue);
  if (pillEl) pillEl.textContent = `● ${PROJECTS.length}+ builds shipped`;

  const chipNodes = () => Array.from(document.querySelectorAll(".stage-chip"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let qIndex = 0;

  function typeCommand(text, done){
    cmdEl.textContent = "";
    outEl.classList.remove("show");
    outEl.textContent = "";
    let i = 0;
    const step = () => {
      cmdEl.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) {
        setTimeout(step, 28);
      } else {
        done();
      }
    };
    step();
  }

  function runLoop(){
    const project = queue[qIndex % queue.length];
    const chipIndex = qIndex % shownCount;
    chipNodes().forEach(c => c.classList.toggle("is-running", Number(c.dataset.i) === chipIndex));

    typeCommand(project.cmd, () => {
      setTimeout(() => {
        outEl.textContent = project.out;
        outEl.classList.add("show");
      }, 200);
    });

    qIndex = (qIndex + 1) % queue.length;
  }

  if (prefersReducedMotion) {
    cmdEl.textContent = queue[0].cmd;
    outEl.textContent = queue[0].out;
    outEl.classList.add("show");
    chipNodes()[0]?.classList.add("is-running");
  } else {
    runLoop();
    setInterval(runLoop, 3000);
  }

  // Subtle mouse parallax on the rig, ambient float otherwise.
  const stage = document.getElementById("heroStage");
  const rig = document.getElementById("heroRig");
  if (stage && rig && !prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    stage.addEventListener("mousemove", (e) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rig.style.transform = `translateY(${(-py * 10).toFixed(1)}px) rotateX(${(8 - py * 10).toFixed(1)}deg) rotateY(${(-16 - px * 12).toFixed(1)}deg)`;
      rig.style.animation = "none";
    });
    stage.addEventListener("mouseleave", () => {
      rig.style.animation = "float-rig 7s ease-in-out infinite";
    });
  }
}

/* ---------- STACK LEGEND ---------- */
function renderStackLegend(){
  const el = document.getElementById("stackLegend");
  el.innerHTML = Object.entries(STACKS).map(([key, s]) => {
    const count = PROJECTS.filter(p => p.stack === key || (p.tags||[]).includes(key)).length;
    return `
      <div class="stack-card">
        <div class="hex-badge">${hexSvg()}<span>${s.short}</span></div>
        <div>
          <div class="stack-card-name">${s.label}</div>
          <div class="stack-card-count">${count} project${count === 1 ? "" : "s"}</div>
        </div>
      </div>
    `;
  }).join("");
}

/* ---------- FILTERS ---------- */
let activeStack = "all";
let activePrice = "all";

function renderStackFilterChips(){
  const el = document.getElementById("stackFilters");
  const chips = [`<button class="chip is-active" data-stack="all">All stacks</button>`]
    .concat(Object.entries(STACKS).map(([key, s]) =>
      `<button class="chip" data-stack="${key}">${s.label}</button>`
    ));
  el.innerHTML = chips.join("");

  el.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-stack]");
    if (!btn) return;
    activeStack = btn.dataset.stack;
    el.querySelectorAll(".chip").forEach(c => c.classList.toggle("is-active", c === btn));
    renderProjects();
  });
}

function bindPriceFilterChips(){
  const el = document.getElementById("priceFilters");
  el.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-price]");
    if (!btn) return;
    activePrice = btn.dataset.price;
    el.querySelectorAll(".chip").forEach(c => c.classList.toggle("is-active", c === btn));
    renderProjects();
  });
}

/* ---------- PROJECT GRID ---------- */
function renderProjects(){
  const grid = document.getElementById("hexGrid");
  const empty = document.getElementById("emptyState");

  const filtered = PROJECTS.filter(p => {
    const stackMatch = activeStack === "all" || p.stack === activeStack || (p.tags||[]).includes(activeStack);
    const priceMatch = activePrice === "all" || (activePrice === "free" && p.price === 0) || (activePrice === "paid" && p.price > 0);
    return stackMatch && priceMatch;
  });

  empty.hidden = filtered.length > 0;

  grid.innerHTML = filtered.map(p => {
    const isFree = p.price === 0;
    const allTags = [p.stack, ...(p.tags||[])];
    return `
      <article class="hex-card">
        <div class="hex-card-top">
          <h3>${p.title}</h3>
          <span class="price-tag ${isFree ? "free" : "paid"}">${isFree ? "Free" : "₹" + p.price}</span>
        </div>
        <div class="hex-tags">${allTags.map(t => `<span>${STACKS[t]?.label || t}</span>`).join("")}</div>
        <p>${p.summary}</p>
        ${isFree
          ? `<button class="btn btn-honey" data-free="${p.id}">Get free download</button>`
          : `<button class="btn btn-honey" data-buy="${p.id}">Buy via UPI</button>`
        }
      </article>
    `;
  }).join("");

  // stat: free / paid counts (whole catalog, not filtered)
  document.getElementById("statFree").textContent = PROJECTS.filter(p => p.price === 0).length;
  document.getElementById("statPaid").textContent = PROJECTS.filter(p => p.price > 0).length;
}

/* ---------- PAYMENT MODAL (paid projects) ---------- */
const backdrop = document.getElementById("modalBackdrop");
const modalBody = document.getElementById("modalBody");

function openBuyModal(project){
  const amount = project.price;
  const upiUri = `upi://pay?pa=${encodeURIComponent(SITE_CONFIG.upiId)}&pn=${encodeURIComponent(SITE_CONFIG.payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(project.title)}`;

  const waText = encodeURIComponent(`Hi! I just paid ₹${amount} for "${project.title}" via UPI. Sharing my payment screenshot here — please send the source code.`);
  const waLink = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${waText}`;
  const mailLink = `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent("Payment for " + project.title)}&body=${waText}`;

  modalBody.innerHTML = `
    <h3 id="modalTitle">${project.title}</h3>
    <div class="modal-price">₹${amount} — pay via any UPI app</div>
    <div class="qr-wrap" id="qrTarget"></div>
    <div class="upi-id-row">
      <code>${SITE_CONFIG.upiId}</code>
      <button class="copy-btn" id="copyUpi">Copy</button>
    </div>
    <ol class="modal-steps">
      <li>Scan the code above or pay to the UPI ID directly.</li>
      <li>Take a screenshot of the successful payment.</li>
      <li>Send it with the project name using a button below.</li>
      <li>Source code is sent to you once the payment is confirmed.</li>
    </ol>
    <div class="modal-actions">
      <a class="btn btn-honey btn-block" href="${waLink}" target="_blank" rel="noopener">Send screenshot on WhatsApp</a>
      <a class="btn btn-ghost btn-block" href="${mailLink}">Send screenshot by email</a>
    </div>
  `;

  const qrTarget = document.getElementById("qrTarget");
  if (window.QRCode) {
    new QRCode(qrTarget, { text: upiUri, width: 176, height: 176, colorDark: "#12151c", colorLight: "#ffffff" });
  } else {
    qrTarget.textContent = "QR unavailable — pay using the UPI ID below.";
  }

  document.getElementById("copyUpi").addEventListener("click", (e) => {
    navigator.clipboard.writeText(SITE_CONFIG.upiId).then(() => {
      e.target.textContent = "Copied!";
      setTimeout(() => { e.target.textContent = "Copy"; }, 1500);
    });
  });

  backdrop.hidden = false;
}

/* ---------- FREE DOWNLOAD MODAL (subscribe + email, free projects) ---------- */
function openFreeModal(project){
  modalBody.innerHTML = `
    <h3 id="modalTitle">${project.title}</h3>
    <div class="modal-price">Free — just subscribe first</div>
    <ol class="modal-steps">
      <li><strong>Subscribe to ${SITE_CONFIG.youtubeChannelName}</strong> on YouTube using the button below.</li>
      <li>Enter the email address you'd like the source code sent to.</li>
      <li>Tap "Request download" — this opens your email app with everything filled in, ready to send.</li>
      <li>Once your subscription is confirmed, the file is sent to that email.</li>
    </ol>
    <a class="btn btn-honey btn-block" href="${SITE_CONFIG.youtubeUrl}" target="_blank" rel="noopener">Subscribe on YouTube</a>
    <div class="email-row">
      <input type="email" id="freeEmailInput" placeholder="you@example.com" required />
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost btn-block" id="sendFreeRequest">Request download</button>
    </div>
    <p class="modal-note" id="freeModalNote" style="display:none;">Please enter a valid email first.</p>
  `;

  document.getElementById("sendFreeRequest").addEventListener("click", () => {
    const emailInput = document.getElementById("freeEmailInput");
    const note = document.getElementById("freeModalNote");
    const visitorEmail = emailInput.value.trim();

    if (!visitorEmail || !visitorEmail.includes("@")) {
      note.style.display = "block";
      return;
    }

    const subject = encodeURIComponent("Free download request: " + project.title);
    const body = encodeURIComponent(
      `Hi! I subscribed to ${SITE_CONFIG.youtubeChannelName} on YouTube and would like the free source code for "${project.title}".\n\nPlease send it to: ${visitorEmail}`
    );
    const mailLink = `mailto:${SITE_CONFIG.contactEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailLink;
  });

  backdrop.hidden = false;
}

/* ---------- SETUP SUPPORT MODAL (Services tab) ---------- */
function openSetupModal(){
  modalBody.innerHTML = `
    <h3 id="modalTitle">Setup support</h3>
    <div class="modal-price">Get any project running on your machine</div>
    <ol class="modal-steps">
      <li>Tell me which project you downloaded and what's not working.</li>
      <li>Include your OS and, if there's one, the exact error message.</li>
      <li>I'll walk you through installing dependencies and fixing config over chat.</li>
    </ol>
    <div class="modal-actions">
      <a class="btn btn-honey btn-block" href="mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent('Setup support request')}">Email for setup help</a>
      <a class="btn btn-ghost btn-block" href="https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hi! I need setup support for a project I downloaded from Code Hive Bridge.')}" target="_blank" rel="noopener">Ask on WhatsApp</a>
    </div>
  `;
  backdrop.hidden = false;
}

function closeBuyModal(){ backdrop.hidden = true; modalBody.innerHTML = ""; }

document.addEventListener("click", (e) => {
  const buyBtn = e.target.closest("button[data-buy]");
  if (buyBtn) {
    const project = PROJECTS.find(p => p.id === buyBtn.dataset.buy);
    if (project) openBuyModal(project);
  }
  const freeBtn = e.target.closest("button[data-free]");
  if (freeBtn) {
    const project = PROJECTS.find(p => p.id === freeBtn.dataset.free);
    if (project) openFreeModal(project);
  }
  const setupBtn = e.target.closest("button[data-setup]");
  if (setupBtn) openSetupModal();
});
document.getElementById("modalClose").addEventListener("click", closeBuyModal);
backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeBuyModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeBuyModal(); });

/* ---------- INIT ---------- */
document.getElementById("statTotal").textContent = PROJECTS.length + (PROJECTS.length >= 80 ? "" : "+");
renderStackHexes();
initHeroStage();
renderStackLegend();
renderStackFilterChips();
bindPriceFilterChips();
renderProjects();
