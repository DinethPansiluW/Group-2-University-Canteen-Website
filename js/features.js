
const CONFIG = {
  brand: { name: "Taste of ", accent: "Ruhuna", mark: "../assets/ruhuna-2.png" },
  tagline: "University of Ruhuna · Matara, Southern Province · Unofficial student project",
  canteens: [
    { name: "Main Canteen",       campus: "Wellamadama, Matara",     icon: "🏛️" },
    { name: "Library Canteen",    campus: "Wellamadama, Matara",     icon: "📚" },
    { name: "Agriculture Canteen",campus: "Mapalana, Kamburupitiya", icon: "🌱" },
    { name: "Engineering Canteen",campus: "Hapugala, Galle",         icon: "⚙️" },
    { name: "Technology Canteen", campus: "Kamburupitiya",           icon: "💡" },
    { name: "Medical Canteen",    campus: "Karapitiya, Galle",       icon: "🩺" }
  ]
};

/* ====== EDIT THE PAGE CONTENT HERE ====== */
const FEATURES = [
  { icon: "🍽️", title: "Menus for every canteen", text: "Browse what each Ruhuna canteen serves, with prices, categories and meal times." },
  { icon: "🔎", title: "Search and filters",      text: "Find food by name, canteen, category, meal time or availability." },
  { icon: "📦", title: "Stock before you go",     text: "Every item shows Available, Limited or Sold Out, so you do not walk over for nothing." },
  { icon: "🛒", title: "Order ahead",             text: "Add items to your cart and place one order per canteen between lectures." },
  { icon: "🧾", title: "Order tracking",          text: "Keep your Order ID and follow your order from Pending to Ready for Pickup." },
  { icon: "💳", title: "Payment options",         text: "Pay cash on pickup. Online payment is available as a demo only." }
];
const STUDENT_SERVICES = [
  "See today's food by breakfast, lunch or dinner",
  "Order ahead and collect with your Order ID",
  "Register once with your student details",
  "Review your past orders at any time"
];
const OWNER_SERVICES = [
  "Add, edit and delete food items",
  "Set quantities and mark items as sold out",
  "Accept, prepare and complete incoming orders",
  "Reject an order and the stock is returned"
];
const STEPS = ["Register your account", "Choose your food", "Place your order", "Collect with your Order ID"];

/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[c]));

/* ---------- rendering ---------- */
function renderFeatures() {
  $("feature-grid").innerHTML = FEATURES.map(f => `<article class="feature-card">
    <div class="canteen-icon" aria-hidden="true">${f.icon}</div><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></article>`).join("");
}

function renderServices() {
  const li = list => list.map(t => `<li>${esc(t)}</li>`).join("");
  $("student-services").innerHTML = li(STUDENT_SERVICES);
  $("owner-services").innerHTML = li(OWNER_SERVICES);
}

function renderCanteens() {
  $("canteen-grid").innerHTML = CONFIG.canteens.map(c => `<a class="canteen-card" href="home.html#menu">
    <div class="canteen-icon" aria-hidden="true">${c.icon}</div><h3>${esc(c.name)}</h3><div class="canteen-campus">${esc(c.campus)}</div></a>`).join("");
}

function renderSteps() {
  $("how-steps").innerHTML = STEPS.map((t, i) => `<div><b>${i + 1}</b><span>${esc(t)}</span></div>`).join("");
}

/* ---------- init ---------- */
function init() {
  const { brand } = CONFIG;
  document.title = `Features & Services | ${brand.name}${brand.accent}`;
  $$("[data-brand-mark]").forEach(el => {
    el.innerHTML = "";
    if (/\.(png|jpe?g|svg|webp|gif)$/i.test(brand.mark)) { // image logo, falls back to "R"
      el.classList.add("has-logo");
      const img = new Image();
      img.alt = "University of Ruhuna logo";
      img.src = brand.mark;
      img.addEventListener("error", () => {
        el.classList.remove("has-logo");
        el.textContent = "R";
      });
      el.appendChild(img);
    } else {
      el.classList.remove("has-logo");
      el.textContent = brand.mark || "R";
    }
  });
  $$("[data-brand-name]").forEach(el => {
    el.innerHTML = `${esc(brand.name)}<span class="brand-green">${esc(brand.accent)}</span>`;
  });
  $("footer-tagline").textContent = CONFIG.tagline;
  const campuses = new Set(CONFIG.canteens.map(c => c.campus.split(",").pop().trim()));
  $("hero-count").textContent = `${CONFIG.canteens.length} canteens`;
  $("hero-campuses").textContent = [...campuses].join(" · ");
  renderFeatures();
  renderServices();
  renderCanteens();
  renderSteps();
}

init();