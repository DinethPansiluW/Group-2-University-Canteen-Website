const CONFIG = {
  brand: { name: "Taste of ", accent: "Ruhuna", mark: "../assets/ruhuna-2.png" },
  tagline: "University of Ruhuna · Matara, Southern Province "
};

const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function initBrand() {
  const { brand } = CONFIG;
  document.title = `Services & Benefits | ${brand.name}${brand.accent}`;
  
  document.querySelectorAll("[data-brand-mark]").forEach(el => {
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

initBrand();
