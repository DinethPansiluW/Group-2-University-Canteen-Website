/* =====================================================================
   home.js  (index.html only): hero and meal tabs
   Needs js/common.js loaded first.
   ===================================================================== */

let activeMeal = "All";

function renderPage() {
  renderHome();
}

function renderHome() {

  $("featured-title").textContent =
    activeMeal === "All" ? "Popular today" : `${activeMeal} menu`;

  const list = foods
    .filter(f => matchesMeal(f, activeMeal))
    .slice(0, 8);

  $("home-food-grid").innerHTML =
    list.map(foodCard).join("") ||
    `<div class="empty-grid">No ${activeMeal.toLowerCase()} items yet. The owner can add them from the Owner panel.</div>`;

  $$(".meal-tab").forEach(b =>
    b.classList.toggle("active", b.dataset.meal === activeMeal)
  );

}

/* Meal tabs */
$$(".meal-tab").forEach(b =>
  b.addEventListener("click", () => {
    activeMeal = b.dataset.meal;
    renderHome();
  })
);

/* Hero search -> Menu page */
$("hero-search").addEventListener("submit", e => {
  e.preventDefault();
  const q = $("search-input").value.trim();
  location.href = "html/menu.html" + (q ? "?q=" + encodeURIComponent(q) : "");
});

/* ---------- Start ---------- */

document.title = `${CONFIG.brand.name}${CONFIG.brand.accent} | University of Ruhuna Canteens`;

$("hero-count").textContent = "5 canteens, 1 campus";

$("today-date").textContent =
  new Date().toLocaleDateString(undefined, {
    weekday: "short", day: "numeric", month: "short", year: "numeric"
  });

{
  const h = new Date().getHours();
  activeMeal = h < 11 ? "Breakfast" : h < 15 ? "Lunch" : "Dinner";
}

initCommon();

/* Nav highlight while scrolling (only the in-page #links) */
{
  const links = [...$$(".nav-link")]
    .filter(l => (l.getAttribute("href") || "").startsWith("#"));

  const spy = new IntersectionObserver(es =>
    es.forEach(en => {
      if (en.isIntersecting)
        links.forEach(l =>
          l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id)
        );
    }),
    { rootMargin: "-40% 0px -55% 0px" }
  );

  links.forEach(l => {
    const sec = document.querySelector(l.getAttribute("href"));
    if (sec) spy.observe(sec);
  });
}
