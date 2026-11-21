/* =====================================================================
   menu.js  (html/menu.html only): full menu with filters + search
   Needs js/common.js loaded first.
   ===================================================================== */

function renderPage() {
  renderFoods();
}

function renderFoods() {

  const q = $("search-input").value.trim().toLowerCase();

  const canteen = $("canteen-filter").value;
  const category = $("category-filter").value;
  const meal = $("meal-filter").value;
  const only = $("available-filter").checked;

  const list = foods.filter(f =>

    (!q || `${f.name} ${f.canteen} ${f.category} ${f.description}`
      .toLowerCase().includes(q)) &&

    (canteen === "All" || f.canteen === canteen) &&
    (category === "All" || f.category === category) &&

    matchesMeal(f, meal) &&
    (!only || inStock(f))

  );

  $("all-food-grid").innerHTML = list.length
    ? list.map(foodCard).join("")
    : '<div class="empty-grid">No matching food found. Try changing your filters.</div>';

  $("results-count").textContent =
    `${list.length} food item${list.length === 1 ? "" : "s"} found`;

}


/* Filter dropdowns */
{
  const opts = C.map(c => `<option>${esc(c)}</option>`).join("");
  const cats = Object.keys(CATEGORIES).map(c => `<option>${c}</option>`).join("");

  $("canteen-filter").innerHTML = '<option value="All">All canteens</option>' + opts;
  $("category-filter").innerHTML = '<option value="All">All categories</option>' + cats;
}

/* Filters passed from the home page, e.g. menu.html?canteen=Main%20Canteen&q=kottu */
{
  const p = new URLSearchParams(location.search);
  const setIfValid = (id, v) => {
    const sel = $(id);
    if (v && [...sel.options].some(o => o.value === v || o.text === v)) sel.value = v;
  };
  setIfValid("canteen-filter", p.get("canteen"));
  setIfValid("category-filter", p.get("category"));
  setIfValid("meal-filter", p.get("meal"));
  if (p.get("q")) $("search-input").value = p.get("q");
}

["canteen-filter", "category-filter", "meal-filter", "available-filter"]
  .forEach(id => $(id).addEventListener("change", renderFoods));

$("search-input").addEventListener("input", renderFoods);

$("menu-search").addEventListener("submit", e => {
  e.preventDefault();
  renderFoods();
});

$("clear-filters").addEventListener("click", () => {
  ["canteen-filter", "category-filter", "meal-filter"].forEach(id => $(id).value = "All");
  $("available-filter").checked = false;
  $("search-input").value = "";
  renderFoods();
});

document.title = `Menu | ${CONFIG.brand.name}${CONFIG.brand.accent}`;

initCommon();
