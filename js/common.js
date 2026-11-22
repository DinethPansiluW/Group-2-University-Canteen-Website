/* =====================================================================
   common.js  (shared by index.html and html/menu.html)
   Data, helpers, cart, checkout + payment, owner panel.
   Each page script defines  renderPage()  and then calls  initCommon().
   ===================================================================== */

const SITE_ROOT = new URL("../", document.currentScript.src);

/* Cart drawer, checkout modal, owner dashboard and toast (shared markup) */
document.body.insertAdjacentHTML("beforeend", `
<div class="overlay" id="cart-overlay"></div>
<aside class="drawer" id="cart-drawer" aria-label="Cart">
  <div class="drawer-head"><h2>Your cart</h2><button class="close-button" id="cart-close" aria-label="Close">×</button></div>
  <div id="cart-items" class="cart-items"></div>
  <div class="cart-footer"><div class="total-row"><span>Total</span><strong id="cart-total"></strong></div><button class="button button-green full" id="checkout-button">Continue to checkout</button><small>You pay by card at checkout. Demo: no real payment is processed.</small></div>
</aside>

<div class="modal-backdrop" id="checkout-modal"><div class="modal">
  <button class="close-button modal-x" data-close="checkout-modal" aria-label="Close">×</button>
  <h2>Confirm &amp; pay</h2><p class="muted">One canteen per order. Payment is required to place the order.</p>
  <form id="checkout-form" autocomplete="off" novalidate>
    <label class="form-label">Student name<input id="student-name" required placeholder="Your name"></label>
    <label class="form-label">Student ID<input id="student-id" required placeholder="Your university ID"></label>
    <label class="form-label">Pickup canteen<select id="pickup-canteen" disabled></select></label>
    <div class="pay-box">
      <div class="pay-title">💳 Pay by card <span class="pay-demo">Demo</span></div>
      <label class="form-label">Card number<input id="card-number" inputmode="numeric" maxlength="23" placeholder="4242 4242 4242 4242"></label>
      <div class="form-two">
        <label class="form-label">Expiry<input id="card-expiry" inputmode="numeric" maxlength="5" placeholder="MM/YY"></label>
        <label class="form-label">CVV<input id="card-cvv" inputmode="numeric" maxlength="4" placeholder="123" type="password"></label>
      </div>
      <small class="pay-note">Demo only: no real payment is made and the card number is never saved (only the last 4 digits).</small>
      <small class="field-error" id="pay-error"></small>
    </div>
    <div class="checkout-total"><span>Order total</span><strong id="checkout-total"></strong></div>
    <button class="button button-green full" type="submit" id="pay-button">Pay &amp; place order</button>
  </form>
</div></div>

<div class="modal-backdrop" id="owner-modal"><div class="modal owner-modal">
  <button class="close-button modal-x" data-close="owner-modal" aria-label="Close">×</button>
  <h2>Owner dashboard</h2>
  <div class="owner-tabs"><button class="owner-tab active" data-owner-tab="manage">Manage food</button><button class="owner-tab" data-owner-tab="orders">Orders</button></div>
  <div id="owner-manage">
    <form id="food-form" class="owner-form">
      <input type="hidden" id="edit-food-id">
      <label class="form-label">Canteen<select id="owner-canteen"></select></label>
      <label class="form-label">Food name<input id="food-name" required placeholder="e.g. Chicken Kottu"></label>
      <div class="form-two"><label class="form-label">Category<select id="food-category"></select></label><label class="form-label">Meal time<select id="food-meal"><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option value="All">Any time (shown in All food only)</option></select></label></div>
      <div class="form-two"><label class="form-label">Price<input id="food-price" type="number" min="0" required></label><label class="form-label">Quantity<input id="food-quantity" type="number" min="0" required></label></div>
      <label class="form-label">Description (optional)<input id="food-desc" maxlength="80"></label>
      <button class="button button-green full" type="submit" id="save-food">Add food item</button>
      <button class="button button-light full hidden" type="button" id="cancel-edit">Cancel edit</button>
    </form>
    <div class="owner-food-list"><h3>Current menu</h3><div id="owner-food-items"></div></div>
  </div>
  <div id="owner-orders" class="hidden"><div id="owner-order-list"></div></div>
  <p class="demo-note">Demo: data is saved in this browser (LocalStorage). For multiple users and devices, connect a backend and database.</p>
</div></div>

<div class="toast" id="toast" role="status"></div>
`);

 

const CONFIG = {

  brand: { name: "Taste of ", accent: "Ruhuna", mark: "../assets/ruhuna-2.png" },

  tagline: "University of Ruhuna · Matara, Southern Province · Unofficial student project",

  currency: "Rs.",

  ownerPin: "1234",  

  canteens: [
    { name: "Main Canteen", campus: "Wellamadama, Matara", icon: "🏛️" },
    { name: "Library Canteen", campus: "Wellamadama, Matara", icon: "📚" },
    { name: "Agriculture Canteen", campus: "Mapalana, Kamburupitiya", icon: "🌱" },
    { name: "Engineering Canteen", campus: "Hapugala, Galle", icon: "⚙️" },
    { name: "Technology Canteen", campus: "Kamburupitiya", icon: "💡" },
    { name: "Medical Canteen", campus: "Karapitiya, Galle", icon: "🩺" }
  ]

};

const CATEGORIES = {
  "Rice & Curry": "🍛",
  "Kottu": "🍜",
  "Roti & Paratha": "🫓",
  "String Hoppers": "🍝",
  "Hoppers": "🥞",
  "Short Eats": "🥟",
  "Rolls": "🌯",
  "Buns": "🍞",
  "Pastries": "🥐",
  "Desserts": "🍮",
  "Juices": "🧃",
  "Drinks": "🥥",
  "Other": "🍽️"
};

const STORAGE = {
  foods: "ruhuna_foods_v1",
  orders: "ruhuna_orders_v1",
  cart: "ruhuna_cart_v1"
};

const ORDER_STATUSES = [
  "Pending",
  "Accepted",
  "Preparing",
  "Ready for Pickup",
  "Completed",
  "Rejected"
];

const C = CONFIG.canteens.map(c => c.name);

const s = (name, canteen, category, meal, price, quantity, description) =>
  ({
    id: "f" + Math.random().toString(36).slice(2, 9),
    name,
    canteen: C[canteen % C.length],
    category,
    meal,
    price,
    quantity,
    description
  });

const starterFoods = [

  s("Kiribath & Lunu Miris", 0, "Rice & Curry", "Breakfast", 180, 20,
    "Milk rice with spicy onion sambol."),

  s("Pol Roti & Sambol", 1, "Roti & Paratha", "Breakfast", 120, 24,
    "Coconut roti with katta sambol."),

  s("Egg Hoppers", 3, "Hoppers", "Breakfast", 130, 15,
    "Crispy hopper with a soft egg."),

  s("String Hoppers", 2, "String Hoppers", "Breakfast", 100, 18,
    "With dhal and pol sambol."),

  s("Plain Tea", 4, "Drinks", "Breakfast", 60, 40,
    "Hot Ceylon tea."),

  s("Rice & Curry", 0, "Rice & Curry", "Lunch", 280, 25,
    "Rice with today's vegetable curries."),

  s("Ambul Thiyal Rice", 3, "Rice & Curry", "Lunch", 420, 8,
    "Southern sour fish curry with rice."),

  s("Jackfruit (Polos) Rice", 2, "Rice & Curry", "Lunch", 300, 0,
    "Young jackfruit curry with rice."),

  s("Chicken Kottu", 5, "Kottu", "Lunch", 450, 9,
    "Classic chicken kottu."),

  s("Vegetable Kottu", 1, "Kottu", "Lunch", 320, 14,
    "Kottu with fresh vegetables."),

  s("Isso Vade", 0, "Short Eats", "All", 90, 16,
    "Crispy prawn vade."),

  s("Fish Bun", 4, "Buns", "All", 120, 3,
    "Soft bun with spicy fish filling."),

  s("Wattalappam", 1, "Desserts", "All", 180, 10,
    "Coconut milk, jaggery and cardamom pudding."),

  s("Thambili (King Coconut)", 5, "Drinks", "All", 150, 20,
    "Served chilled."),

  s("Wood Apple Juice", 2, "Juices", "All", 160, 12,
    "Tangy divul juice."),

  s("Chicken Fried Rice", 3, "Rice & Curry", "Dinner", 480, 15,
    "Wok-fried rice with chicken and egg."),

  s("Egg Kottu", 5, "Kottu", "Dinner", 380, 12,
    "Chopped roti stir-fried with egg and vegetables."),

  s("Pol Roti & Dhal Curry", 1, "Roti & Paratha", "Dinner", 150, 20,
    "Coconut roti with creamy dhal curry."),

  s("Vegetable Fried Rice", 0, "Rice & Curry", "Dinner", 350, 14,
    "Fried rice with fresh mixed vegetables.")

];

const $ = id => document.getElementById(id);

const $$ = sel => document.querySelectorAll(sel);

const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[c]));

const money = v => `${CONFIG.currency} ${Number(v).toLocaleString("en-LK")}`;

const find = id => foods.find(f => f.id === id);

const inStock = f => Number(f.quantity) > 0;

const stockState = f =>
  !inStock(f) ? "Sold Out" :
  f.quantity <= 5 ? "Limited" : "Available";

const emoji = f => CATEGORIES[f.category] || CATEGORIES.Other;

 

const FOOD_IMAGES = {

  "Kiribath & Lunu Miris":
    "https://gallecookingclass.com/wp-content/uploads/2023/10/milk-rice.jpg",

  "Pol Roti & Sambol":
    "https://gallecookingclass.com/wp-content/uploads/2023/10/roti.jpg",

  "Egg Hoppers":
    "https://gallecookingclass.com/wp-content/uploads/2023/10/appa.jpg",

  "String Hoppers":
    "https://gallecookingclass.com/wp-content/uploads/2023/10/string_hoppers.jpg",

  "Plain Tea":
    "https://www.triplanka.com/Images/Site%20Photos/Ceylon-Tea.jpg",

  "Rice & Curry":
    "https://gallecookingclass.com/wp-content/uploads/2023/10/rice_and_curry.jpg",

  "Ambul Thiyal Rice":
    "https://gallecookingclass.com/wp-content/uploads/2023/10/malu_ebulthiyal.jpg",

  "Jackfruit (Polos) Rice":
    "https://propermasala.com/_astro/polos-curry.bRccRsXh.webp",

  "Chicken Kottu":
    "https://art.whisk.com/image/upload/fl_progressive%2Ch_560%2Cw_560%2Cc_fill%2Cdpr_2.0/v1761222539775/recipe/63748663188716771fcf86b10e45c193.jpg",

  "Vegetable Kottu":
    "https://www.pastimahiyangana.lk/images/menu/kottu/vegetable-kottu.webp",

  "Isso Vade":
    "https://propermasala.com/_astro/isso-vadai.5kq47shE_10KMcC.webp",

  "Fish Bun":
    "https://sinhala.dailylife.lk/kitchen/fish-bun/images/homemade-fish-bun.jpg",

  "Wattalappam":
    "https://sinhala.dailylife.lk/kitchen/watalappan/images/watalappan.jpg",

  "Thambili (King Coconut)":
    "https://robinsonlinkblog.wordpress.com/wp-content/uploads/2016/04/p10207691.jpg?w=1460",

  "Wood Apple Juice":
    "https://deih43ym53wif.cloudfront.net/wood-apple-limonia-drink-glass-on-shutterstock_1232982658_.jpg_ba47922640.jpg"

};

 

const CATEGORY_IMAGES = {

  "Rice & Curry": FOOD_IMAGES["Rice & Curry"],

  "Kottu": FOOD_IMAGES["Vegetable Kottu"],

  "Roti & Paratha": FOOD_IMAGES["Pol Roti & Sambol"],

  "Hoppers": FOOD_IMAGES["Egg Hoppers"],

  "String Hoppers": FOOD_IMAGES["String Hoppers"],

  "Short Eats": FOOD_IMAGES["Isso Vade"],

  "Buns": FOOD_IMAGES["Fish Bun"],

  "Desserts": FOOD_IMAGES["Wattalappam"],

  "Juices": FOOD_IMAGES["Wood Apple Juice"],

  "Drinks": FOOD_IMAGES["Thambili (King Coconut)"]

};

 

const foodImage = f =>
  FOOD_IMAGES[f.name] || CATEGORY_IMAGES[f.category] || "";



function load(key, fallback) {

  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : structuredClone(fallback);
  }

  catch {
    return structuredClone(fallback);
  }

}


function save() {

  try {
    localStorage.setItem(STORAGE.foods, JSON.stringify(foods));
    localStorage.setItem(STORAGE.orders, JSON.stringify(orders));
    localStorage.setItem(STORAGE.cart, JSON.stringify(cart));
  }

  catch {
    toast("Could not save: browser storage is full or blocked");
  }

}


function toast(msg) {

  const el = $("toast");
  el.textContent = msg;
  el.classList.add("show");

  clearTimeout(toast.t);

  toast.t = setTimeout(() => el.classList.remove("show"), 2400);

}



let foods = load(STORAGE.foods, starterFoods);

let orders = load(STORAGE.orders, []);

let cart = load(STORAGE.cart, []);   // kept across pages (menu / home)


let ownerUnlocked = false;

 


function foodCard(f) {

  const st = stockState(f);
  const cls = st === "Sold Out" ? "sold" :
              st === "Limited" ? "limited" : "";

  return `<article class="food-card ${inStock(f) ? "" : "out"}">

    <div class="food-photo">
      ${foodImage(f)
        ? `<img src="${foodImage(f)}"
             alt="${esc(f.name)}"
             loading="lazy"
             onerror="this.style.display='none'">`
        : `<span class="food-photo-fallback" aria-hidden="true">${emoji(f)}</span>`
      }

      <span class="status-badge ${cls}">${st}</span>
    </div>

    <div class="food-content">

      <div class="food-topline">
        <span>${esc(f.canteen)}</span>
        <span>${esc(f.meal)}</span>
      </div>

      <h3>${esc(f.name)}</h3>

      <div class="food-desc">
        ${esc(f.description || f.category)}
      </div>

      <div class="food-bottom">

        <span class="price">${money(f.price)}</span>

        <button class="add-button"
          data-add="${esc(f.id)}"
          ${inStock(f) ? "" : "disabled"}>
          ${inStock(f) ? "+ Add" : "Unavailable"}
        </button>

      </div>

    </div>

  </article>`;

}


// Breakfast shows only Breakfast items, Lunch only Lunch, Dinner only Dinner.
// Items saved as "Any time" (All) appear only when "All" is selected.
function matchesMeal(f, meal) {
  return meal === "All" || f.meal === meal;
}



function cleanCart() {

   

  cart = cart.filter(i => find(i.id) && inStock(find(i.id)));

  cart.forEach(i => {
    i.qty = Math.min(i.qty, find(i.id).quantity);
  });

}


const picked = () => cart.filter(i => i.sel);

function pickItem(id, on) {

  const it = cart.find(x => x.id === id);
  if (!it) return;

  it.sel = on;

  // One canteen per order: ticking an item un-ticks other canteens' items
  if (on) {
    const c = find(id).canteen;
    let dropped = false;
    cart.forEach(x => {
      if (x.sel && find(x.id).canteen !== c) { x.sel = false; dropped = true; }
    });
    if (dropped) toast(`Only ${c} items selected (one canteen per order)`);
  }

  renderCart();
}

function cartTotal() {

  return picked().reduce(
    (n, i) => n + find(i.id).price * i.qty,
    0
  );

}


function renderCart() {

  cleanCart();

  try { localStorage.setItem(STORAGE.cart, JSON.stringify(cart)); } catch {}

  $("cart-count").textContent =
    cart.reduce((n, i) => n + i.qty, 0);

  $("cart-items").innerHTML = cart.map(i => {

    const f = find(i.id);

    return `<div class="cart-row ${i.sel ? "" : "unpicked"}">

      <label class="cart-pick" title="Select for checkout">
        <input type="checkbox" data-pick="${esc(f.id)}" ${i.sel ? "checked" : ""}
          aria-label="Select ${esc(f.name)} for checkout">
        <span class="tick" aria-hidden="true"></span>
      </label>

      <div class="cart-emoji">

        ${foodImage(f)
          ? `<img src="${foodImage(f)}"
               alt="${esc(f.name)}"
               loading="lazy"
               onerror="this.style.display='none'">`
          : `<span aria-hidden="true">${emoji(f)}</span>`
        }

      </div>

      <div class="cart-row-info">

        <b>${esc(f.name)}</b>

        <small>
          ${esc(f.canteen)} · ${money(f.price)}
        </small>

        <div class="qty-controls">

          <button data-qty="${esc(f.id)}"
            data-d="-1"
            aria-label="Decrease">−</button>

          <span>${i.qty}</span>

          <button data-qty="${esc(f.id)}"
            data-d="1"
            aria-label="Increase">+</button>

        </div>

      </div>

      <strong>${money(f.price * i.qty)}</strong>

    </div>`;

  }).join("") ||
    '<div class="empty-state">🛍️<br><br>Your cart is empty.<br>Add something tasty from the menu.</div>';

  $("cart-total").textContent =
    $("checkout-total").textContent = money(cartTotal());

  const n = picked().length;
  const cb = $("checkout-button");
  cb.disabled = !n;
  cb.textContent = n ? `Continue to checkout (${n})` : "Select items to continue";

}


const itemsText = o =>
  o.items.map(i => `${esc(i.name)} × ${i.qty}`).join(", ");


function renderOwnerFoods() {

  $("owner-food-items").innerHTML = foods.map(f =>

    `<div class="manage-row">

      <div>

        <strong>${esc(f.name)}</strong>

        <small>
          ${esc(f.canteen)} · ${money(f.price)} · Qty: ${f.quantity}
        </small>

      </div>

      <div class="manage-actions">

        <button class="mini-button" data-edit="${esc(f.id)}">
          Edit
        </button>

        <button class="mini-button" data-toggle="${esc(f.id)}">
          ${inStock(f) ? "Mark sold out" : "Restock (10)"}
        </button>

        <button class="mini-button danger" data-delete="${esc(f.id)}">
          Delete
        </button>

      </div>

    </div>`

  ).join("") || '<div class="empty-state">No food items yet.</div>';

}


function renderOwnerOrders() {

  $("owner-order-list").innerHTML = orders.length

    ? orders.map(o => `<div class="owner-order">

        <div class="owner-order-head">

          <div>

            <b class="order-id">${esc(o.id)}</b>

            <p class="muted">
              ${esc(o.student)} (${esc(o.studentId)}) ·
              ${esc(o.canteen)} · ${money(o.total)}
            </p>

            <p class="muted">${itemsText(o)}</p>

          </div>

          <select data-status="${esc(o.id)}" aria-label="Order status">

            ${ORDER_STATUSES.map(st =>
              `<option ${o.status === st ? "selected" : ""}>${st}</option>`
            ).join("")}

          </select>

        </div>

      </div>`).join("")

    : '<div class="empty-state">No orders received yet.</div>';

}


function renderAll() {

  // page-specific rendering (renderPage is defined by home.js / menu.js)
  if (typeof renderPage === "function") renderPage();

  renderCart();
  renderOwnerFoods();
  renderOwnerOrders();

}


function addToCart(id) {

  const f = find(id);

  if (!f || !inStock(f)) return;

  const ex = cart.find(i => i.id === id);

  if (ex) {

    if (ex.qty >= f.quantity)
      return toast("No more quantity available");

    ex.qty++;

  } else {

    const sel = picked();
    cart.push({
      id, qty: 1,
      sel: !sel.length || find(sel[0].id).canteen === f.canteen
    });

  }

  renderCart();

  toast("Added to cart");

}


function changeQty(id, d) {

  const i = cart.find(x => x.id === id);
  const f = find(id);

  if (!i || !f) return;

  i.qty += d;

  if (i.qty <= 0) {

    cart = cart.filter(x => x.id !== id);

  } else if (i.qty > f.quantity) {

    i.qty = f.quantity;

    toast("Maximum available quantity reached");

  }

  renderCart();

}


const showDrawer = on => {

  $("cart-drawer").classList.toggle("show", on);
  $("cart-overlay").classList.toggle("show", on);

};


const showModal = (id, on = true) =>
  $(id).classList.toggle("show", on);



function checkout() {

  cleanCart();
  renderCart();

  if (!cart.length)
    return toast("Your cart is empty");

  const chosen = picked();

  if (!chosen.length)
    return toast("Tick the items you want to order");

  const canteens = [
    ...new Set(chosen.map(i => find(i.id).canteen))
  ];

  if (canteens.length > 1)
    return toast("Please order from one canteen at a time");

  $("pickup-canteen").innerHTML =
    `<option>${esc(canteens[0])}</option>`;

  showDrawer(false);
  showModal("checkout-modal");

}


/* ---------- Payment helpers (demo) ---------- */

const luhn = num => {
  let sum = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return sum % 10 === 0;
};

function validatePayment() {

  const num = $("card-number").value.replace(/\s/g, "");
  const exp = $("card-expiry").value.trim();
  const cvv = $("card-cvv").value.trim();

  if (!/^\d{13,19}$/.test(num) || !luhn(num))
    return "Enter a valid card number.";

  const m = exp.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!m) return "Enter expiry as MM/YY.";

  const endOfMonth = new Date(2000 + Number(m[2]), Number(m[1]), 0, 23, 59, 59);
  if (endOfMonth < new Date()) return "This card has expired.";

  if (!/^\d{3,4}$/.test(cvv)) return "Enter a valid CVV.";

  return "";
}

$("card-number").addEventListener("input", e => {
  e.target.value = e.target.value
    .replace(/\D/g, "").slice(0, 19)
    .replace(/(.{4})/g, "$1 ").trim();
});

$("card-expiry").addEventListener("input", e => {
  let v = e.target.value.replace(/\D/g, "").slice(0, 4);
  if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
  e.target.value = v;
});

$("card-cvv").addEventListener("input", e => {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
});


$("checkout-form").addEventListener("submit", e => {

  e.preventDefault();

  cleanCart();

  if (!picked().length)
    return toast("Your cart changed. Please review it.");

  const name = $("student-name").value.trim();
  const sid = $("student-id").value.trim();

  if (!name || !sid) {
    $("pay-error").textContent = "Please enter your name and student ID.";
    return;
  }

  const err = validatePayment();
  $("pay-error").textContent = err;
  if (err) return;

  const btn = $("pay-button");
  btn.disabled = true;
  btn.textContent = "Processing payment…";

  // Simulated payment. Only after "payment succeeds" is the order created.
  setTimeout(() => {

    cleanCart();

    if (!picked().length) {
      btn.disabled = false;
      btn.textContent = "Pay & place order";
      return toast("Your cart changed. Please review it.");
    }

    const last4 = $("card-number").value.replace(/\s/g, "").slice(-4);
    const now = new Date();

    const order = {

      id: "RU" +
        Date.now().toString(36).toUpperCase().slice(-5) +
        Math.random().toString(36).toUpperCase().slice(2, 5),

      student: name,

      studentId: sid,

      canteen: find(picked()[0].id).canteen,

      payment: "Card •••• " + last4,

      paid: true,

      items: picked().map(i => {

        const f = find(i.id);

        f.quantity -= i.qty;

        return {
          id: f.id,
          name: f.name,
          price: f.price,
          qty: i.qty
        };

      }),

      total: cartTotal(),

      status: "Pending",

      created: now.toLocaleString(),

      createdAt: now.getTime()

    };

    orders.unshift(order);

    cart = cart.filter(i => !i.sel); // keep un-ticked items in the cart

    save();

    $("checkout-form").reset();

    // Go straight to the Orders page and open this order's details
    location.href = new URL("html/orders.html?new=1&id=" + encodeURIComponent(order.id), SITE_ROOT).href;

  }, 900);

});


/* Small PIN dialog (replaces the browser prompt so the input can show a placeholder) */
function askPin() {

  return new Promise((resolve) => {

    const wrap = document.createElement("div");
    wrap.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(43,26,14,.55);display:flex;align-items:center;justify-content:center;padding:16px;";
    wrap.innerHTML =
      '<div style="background:#fff;border-radius:16px;padding:24px;width:min(340px,100%);box-shadow:0 20px 50px rgba(0,0,0,.25);font-family:inherit;">' +
        '<h3 style="margin:0 0 6px;font-size:18px;color:#2b1a0e;">Owner panel</h3>' +
        '<p style="margin:0 0 14px;font-size:13px;color:#75655a;">Enter owner PIN</p>' +
        '<input type="password" id="pin-input" placeholder="1234" autocomplete="off" ' +
          'style="width:100%;box-sizing:border-box;padding:12px;font:inherit;border:1.5px solid #eadfce;border-radius:10px;margin-bottom:16px;">' +
        '<div style="display:flex;gap:10px;justify-content:flex-end;">' +
          '<button type="button" id="pin-cancel" style="border:0;background:#f1e8da;color:#2b1a0e;padding:10px 16px;border-radius:10px;font-weight:700;cursor:pointer;">Cancel</button>' +
          '<button type="button" id="pin-ok" style="border:0;background:#3b2210;color:#fff;padding:10px 16px;border-radius:10px;font-weight:700;cursor:pointer;">Unlock</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    const input = wrap.querySelector("#pin-input");
    const done = (value) => { wrap.remove(); resolve(value); };

    wrap.querySelector("#pin-ok").addEventListener("click", () => done(input.value));
    wrap.querySelector("#pin-cancel").addEventListener("click", () => done(null));
    wrap.addEventListener("click", (e) => { if (e.target === wrap) done(null); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") done(input.value);
      if (e.key === "Escape") done(null);
    });
    input.focus();

  });

}


async function openOwner() {

  if (!ownerUnlocked) {

    const pin = await askPin();

    if (pin === null) return;

    if (pin !== CONFIG.ownerPin)
      return toast("Incorrect PIN");

    ownerUnlocked = true;

  }

  renderOwnerFoods();
  renderOwnerOrders();

  showModal("owner-modal");

}


function resetFoodForm() {

  $("food-form").reset();

  $("edit-food-id").value = "";

  $("save-food").textContent = "Add food item";

  $("cancel-edit").classList.add("hidden");

}


$("food-form").addEventListener("submit", e => {

  e.preventDefault();

  const id = $("edit-food-id").value;

  const old = id && find(id);

  const data = {

    id: id || "f" + Date.now().toString(36),

    canteen: $("owner-canteen").value,

    name: $("food-name").value.trim(),

    category: $("food-category").value,

    meal: $("food-meal").value,

    price: Math.max(0, Number($("food-price").value)),

    quantity: Math.max(
      0,
      Math.floor(Number($("food-quantity").value))
    ),

    description: $("food-desc").value.trim()

  };

  if (old) {

    foods = foods.map(f =>
      f.id === id ? { ...f, ...data } : f
    );

    toast("Food item updated");

  } else {

    foods.unshift(data);

    toast("New food item added");

  }

  save();

  resetFoodForm();

  renderAll();

});


function setOrderStatus(id, status) {

  const o = orders.find(x => x.id === id);

  if (!o) return;

  if (status === "Rejected" && !o.restocked) {

    

    o.items.forEach(i => {

      const f = find(i.id);

      if (f) f.quantity += i.qty;

    });

    o.restocked = true;

  } else if (status !== "Rejected" && o.restocked) {

    

    if (o.items.some(i =>
      !find(i.id) || find(i.id).quantity < i.qty
    )) {

      toast("Not enough stock to reopen this order");

      return renderOwnerOrders();

    }

    o.items.forEach(i => {

      find(i.id).quantity -= i.qty;

    });

    o.restocked = false;

  }

  o.status = status;

  save();

  renderAll();

  toast("Order status updated");

}
 

document.addEventListener("click", e => {

  const t = e.target.closest(
    "[data-add],[data-qty],[data-edit],[data-toggle],[data-delete]"
  );

  if (!t) return;

  const d = t.dataset;

  if (d.add) {

    addToCart(d.add);

  } else if (d.qty) {

    changeQty(d.qty, Number(d.d));

  } else if (d.edit) {

    const f = find(d.edit);

    if (!f) return;

    $("edit-food-id").value = f.id;

    $("owner-canteen").value = f.canteen;

    $("food-name").value = f.name;

    $("food-category").value = f.category;

    $("food-meal").value = f.meal;

    $("food-price").value = f.price;

    $("food-quantity").value = f.quantity;

    $("food-desc").value = f.description || "";

    $("save-food").textContent = "Save changes";

    $("cancel-edit").classList.remove("hidden");

    $("food-form").scrollIntoView({ block: "start" });

  } else if (d.toggle) {

    const f = find(d.toggle);

    f.quantity = inStock(f) ? 0 : 10;

    save();

    renderAll();

    toast("Availability updated");

  } else if (d.delete) {

    if (!confirm("Delete this food item from the menu?"))
      return;

    foods = foods.filter(f => f.id !== d.delete);

    save();

    renderAll();

    toast("Food item deleted");

  }

});


document.addEventListener("change", e => {

  if (e.target.dataset.pick) {
    return pickItem(e.target.dataset.pick, e.target.checked);
  }

  if (e.target.dataset.status) {

    setOrderStatus(e.target.dataset.status, e.target.value);

  }

});


document.addEventListener("keydown", e => {

  if (e.key !== "Escape") return;

  $$(".modal-backdrop.show").forEach(m =>
    m.classList.remove("show")
  );

  showDrawer(false);

});


$("cart-open").addEventListener("click", () =>
  showDrawer(true)
);


$("cart-close").addEventListener("click", () =>
  showDrawer(false)
);


$("cart-overlay").addEventListener("click", () =>
  showDrawer(false)
);


$("checkout-button").addEventListener("click", checkout);


const ownerBtn = $("owner-open");
if (ownerBtn) ownerBtn.addEventListener("click", openOwner);


$("cancel-edit").addEventListener("click", resetFoodForm);


$$("[data-close]").forEach(b =>

  b.addEventListener("click", () =>
    showModal(b.dataset.close, false)
  )

);


$$(".modal-backdrop").forEach(back =>

  back.addEventListener("click", e => {

    if (e.target === back)
      back.classList.remove("show");

  })

);


$$(".owner-tab").forEach(b =>

  b.addEventListener("click", () => {

    $$(".owner-tab").forEach(x =>
      x.classList.toggle("active", x === b)
    );

    $("owner-manage").classList.toggle(
      "hidden",
      b.dataset.ownerTab !== "manage"
    );

    $("owner-orders").classList.toggle(
      "hidden",
      b.dataset.ownerTab !== "orders"
    );

  })

);

function initCommon() {

  // Starter foods get random ids, so store them once; otherwise the cart
  // (kept between pages) could not find its items again after a page change.
  try {
    if (!localStorage.getItem(STORAGE.foods)) save();
  } catch {}

  // One-time: add starter Dinner items for browsers that saved the menu earlier
  try {
    if (!localStorage.getItem("ruhuna_dinner_seed_v1")) {
      starterFoods
        .filter(f => f.meal === "Dinner" && !foods.some(x => x.name === f.name))
        .forEach(f => foods.push(f));
      localStorage.setItem("ruhuna_dinner_seed_v1", "1");
      save();
    }
  } catch {}

  const { brand } = CONFIG;

  $$("[data-brand-name]").forEach(el =>
    el.innerHTML =
      `${esc(brand.name)}<span class="brand-green">${esc(brand.accent)}</span>`
  );

  const tag = $("footer-tagline");
  if (tag) tag.textContent = CONFIG.tagline;

  const opts = C.map(c => `<option>${esc(c)}</option>`).join("");
  const cats = Object.keys(CATEGORIES).map(c => `<option>${c}</option>`).join("");

  $("owner-canteen").innerHTML = opts;
  $("food-category").innerHTML = cats;

  renderAll();

}
