/* ====== Keep this block in sync with CONFIG in home.js ====== */
const CONFIG = {
  brand: { name: "Taste of ", accent: "Ruhuna", mark: "../assets/ruhuna-2.png" },
  tagline: "University of Ruhuna · Matara, Southern Province · Unofficial student project"
};

const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[c]));

function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove("show"), 2400);
}

function initBrand() {
  const { brand } = CONFIG;
  document.title = `Services & Benefits | ${brand.name}${brand.accent}`;

  document.querySelectorAll("[data-brand-mark]").forEach(el => {
    el.innerHTML = "";
    if (/\.(png|jpe?g|svg|webp|gif)$/i.test(brand.mark)) {
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
      el.textContent = brand.mark;
    }
  });

  document.querySelectorAll("[data-brand-name]").forEach(el => {
    el.innerHTML = `${esc(brand.name)}<span class="brand-green">${esc(brand.accent)}</span>`;
  });

  const taglineEl = document.getElementById("footer-tagline");
  if (taglineEl) taglineEl.textContent = CONFIG.tagline;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBrand);
} else {
  initBrand();
}