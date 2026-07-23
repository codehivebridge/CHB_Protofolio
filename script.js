/* =========================================================================
   CODE HIVE BRIDGE — site logic
   Reads PROJECTS and SITE_CONFIG from config.js. You shouldn't need to
   edit this file just to add projects or change payment details.
   ========================================================================= */

const STACKS = {
  html:   { label: "HTML",   short: "<>",  },
  css:    { label: "CSS",    short: "{ }", },
  js:     { label: "JavaScript", short: "JS", },
  python: { label: "Python", short: "PY", },
  php:    { label: "PHP",    short: "PHP", },
  mysql:  { label: "MySQL",  short: "DB", }
};

const HEX_POINTS = "50,3 95,26 95,74 50,97 5,74 5,26"; // flat-ish pointy hex

function hexSvg(){
  return `<svg viewBox="0 0 100 100"><polygon points="${HEX_POINTS}"/></svg>`;
}

/* ---------- HERO: six-stack bridge chain ---------- */
function renderStackHexes(){
  const el = document.getElementById("stackHexes");
  el.innerHTML = Object.entries(STACKS).map(([key, s]) => `
    <div class="stack-hex" title="${s.label}">
      ${hexSvg()}
      <span>${s.short}</span>
    </div>
  `).join("");
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
          ? `<a class="btn btn-honey" href="${p.freeUrl}" target="_blank" rel="noopener">Download source</a>`
          : `<button class="btn btn-honey" data-buy="${p.id}">Buy via UPI</button>`
        }
      </article>
    `;
  }).join("");

  // stat: free / paid counts (whole catalog, not filtered)
  document.getElementById("statFree").textContent = PROJECTS.filter(p => p.price === 0).length;
  document.getElementById("statPaid").textContent = PROJECTS.filter(p => p.price > 0).length;
}

/* ---------- PAYMENT MODAL ---------- */
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

  // Generate QR client-side (needs internet on the visitor's browser, same as any live site)
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

function closeBuyModal(){ backdrop.hidden = true; modalBody.innerHTML = ""; }

document.addEventListener("click", (e) => {
  const buyBtn = e.target.closest("button[data-buy]");
  if (buyBtn) {
    const project = PROJECTS.find(p => p.id === buyBtn.dataset.buy);
    if (project) openBuyModal(project);
  }
});
document.getElementById("modalClose").addEventListener("click", closeBuyModal);
backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeBuyModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeBuyModal(); });

/* ---------- INIT ---------- */
document.getElementById("statTotal").textContent = PROJECTS.length + (PROJECTS.length >= 80 ? "" : "+");
renderStackHexes();
renderStackLegend();
renderStackFilterChips();
bindPriceFilterChips();
renderProjects();
