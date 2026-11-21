/* Orders page: reads orders saved by the checkout (localStorage) */
(function () {
  const KEY = "ruhuna_orders_v1";
  const ICONS = {
    "Main Canteen": "🏛️", "Library Canteen": "📚", "Agriculture Canteen": "🌱",
    "Engineering Canteen": "⚙️", "Technology Canteen": "💡", "Medical Canteen": "🩺"
  };
  const FLOW = ["Pending", "Accepted", "Preparing", "Ready for Pickup", "Completed"];
  const FLOW_LABEL = { "Pending": "Placed", "Accepted": "Accepted", "Preparing": "Preparing",
    "Ready for Pickup": "Ready", "Completed": "Collected" };

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "Rs. " + Number(n || 0).toLocaleString("en-LK");

  const params = new URLSearchParams(location.search);
  const focusId = params.get("id");
  const justPlaced = params.get("new") === "1";

  let tab = "all";
  let query = "";

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }

  const isPast = (o) => o.status === "Completed" || o.status === "Rejected";
  const chipClass = (st) => st === "Completed" ? "ok" : st === "Rejected" ? "bad" : st === "Ready for Pickup" ? "go" : "";
  const chipText = (st) => st === "Pending" ? "Order placed" : st;
  const itemCount = (o) => o.items.reduce((n, i) => n + i.qty, 0);
  const itemsText = (o) => o.items.map((i) => `${esc(i.name)} × ${i.qty}`).join(", ");

  function renderList() {
    const all = load();
    const q = query.trim().toLowerCase();
    const list = all.filter((o) => {
      if (tab === "active" && isPast(o)) return false;
      if (tab === "past" && !isPast(o)) return false;
      if (!q) return true;
      return o.id.toLowerCase().includes(q) || o.items.some((i) => i.name.toLowerCase().includes(q));
    });

    if (!all.length) {
      $("order-list").innerHTML = `<div class="empty"><span class="big">🧾</span>You have not placed any orders yet.<br>
        <a class="button button-green" href="menu.html">Browse the menu</a></div>`;
      return;
    }
    if (!list.length) {
      $("order-list").innerHTML = `<div class="empty"><span class="big">🔍</span>No orders match.</div>`;
      return;
    }

    $("order-list").innerHTML = list.map((o) => `
      <button class="order-card" data-open="${esc(o.id)}">
        <div class="order-icon">${ICONS[o.canteen] || "🍽️"}</div>
        <div class="order-main">
          <b>${esc(o.canteen)}</b>
          <small>${esc(o.created)} · ${itemCount(o)} item${itemCount(o) > 1 ? "s" : ""}</small>
          <small>${itemsText(o)}</small>
          <small class="oid">${esc(o.id)}</small>
        </div>
        <div class="order-side">
          <strong>${money(o.total)}</strong>
          <span class="chip ${chipClass(o.status)}">${esc(chipText(o.status))}</span>
        </div>
      </button>`).join("");
  }

  function renderDetail(id) {
    const o = load().find((x) => x.id === id);
    if (!o) return;
    const rejected = o.status === "Rejected";
    const idx = FLOW.indexOf(o.status);

    const track = rejected ? "" : `<div class="track">${FLOW.map((st, i) =>
      `<div class="step ${i < idx || o.status === "Completed" ? "done" : i === idx ? "now" : ""}"><i></i>${FLOW_LABEL[st]}</div>`).join("")}</div>`;

    $("detail").innerHTML = `
      <button class="detail-x" data-close aria-label="Close">×</button>
      <h2>${esc(o.canteen)}</h2>
      <p class="sub">${esc(o.created)}</p>

      <div class="id-box">
        <small>YOUR ORDER ID</small>
        <div class="big-id">${esc(o.id)}</div>
        <button data-copy="${esc(o.id)}">Copy Order ID</button>
        <p>Show this Order ID at the ${esc(o.canteen)} counter to collect your food.</p>
      </div>

      ${rejected ? `<div class="reject-note">This order was rejected by the canteen. Your payment will be refunded (demo).</div>` : track}

      <div class="section-t">Items</div>
      ${o.items.map((i) => `<div class="line-row"><span>${esc(i.name)} × ${i.qty}</span><span>${money(i.price * i.qty)}</span></div>`).join("")}
      <div class="total-row2"><span>Total paid</span><span>${money(o.total)}</span></div>

      <div class="section-t">Details</div>
      <dl class="kv">
        <dt>Status</dt><dd><span class="chip ${chipClass(o.status)}">${esc(chipText(o.status))}</span></dd>
        <dt>Payment</dt><dd><span class="chip ok">Paid</span> ${esc(o.payment)}</dd>
        <dt>Student</dt><dd>${esc(o.student)} (${esc(o.studentId)})</dd>
        <dt>Pickup at</dt><dd>${esc(o.canteen)}</dd>
      </dl>`;
    $("detail-backdrop").classList.add("show");
    $("detail-backdrop").dataset.id = id;
  }

  const closeDetail = () => {
    $("detail-backdrop").classList.remove("show");
    delete $("detail-backdrop").dataset.id;
  };

  document.addEventListener("click", (e) => {
    const open = e.target.closest("[data-open]");
    if (open) return renderDetail(open.dataset.open);
    if (e.target.closest("[data-close]") || e.target === $("detail-backdrop")) return closeDetail();
    const copy = e.target.closest("[data-copy]");
    if (copy) {
      const txt = copy.dataset.copy;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(
        () => (copy.textContent = "Copied ✓"), () => (copy.textContent = txt));
    }
    const t = e.target.closest("[data-tab]");
    if (t) {
      tab = t.dataset.tab;
      document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b === t));
      renderList();
    }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDetail(); });
  $("order-search").addEventListener("input", (e) => { query = e.target.value; renderList(); });

  // Live update when the owner changes a status in another tab
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    renderList();
    const open = $("detail-backdrop").dataset.id;
    if (open) renderDetail(open);
  });

  // Called by common.js whenever data changes (e.g. owner updates a status)
  window.renderPage = () => {
    renderList();
    const open = $("detail-backdrop").dataset.id;
    if (open) renderDetail(open);
  };

  renderList();

  if (focusId && load().some((o) => o.id === focusId)) {
    if (justPlaced) {
      $("order-banner").innerHTML = `<div class="order-banner">✅ Payment successful. Your order has been placed. Keep your Order ID!</div>`;
    }
    renderDetail(focusId);
  }

  initCommon();
})();
