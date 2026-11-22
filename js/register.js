/* ====== Single-file controller for register.html ====== */
const CONFIG = {
  brand: { name: "Taste of ", accent: "Ruhuna", mark: "../assets/ruhuna-2.png" },
  tagline: "University of Ruhuna · Matara, Southern Province",
  faculties: [
    "Agriculture",
    "Engineering",
    "Fisheries & Marine Sciences and Technology",
    "Humanities & Social Sciences",
    "Management & Finance",
    "Medicine",
    "Science",
    "Technology",
    "Allied Health Sciences"
  ],
  years: ["1st year", "2nd year", "3rd year", "4th year", "Postgraduate"]
};

const FACULTY_PREFIXES = {
  AG: "Agriculture",
  EG: "Engineering",
  FM: "Fisheries & Marine Sciences and Technology",
  HS: "Humanities & Social Sciences",
  MF: "Management & Finance",
  MD: "Medicine",
  SC: "Science",
  TG: "Technology",
  AH: "Allied Health Sciences"
};

const STORAGE = { users: "ruhuna_users_v1" };

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[c]));

function showModal(id, on = true) {
  const modal = $(id);
  if (modal) modal.classList.toggle("show", on);
}

function toast(msg) {
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove("show"), 2400);
}

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE.users, JSON.stringify(users));
    return true;
  } catch {
    toast("Could not save: browser storage is full or blocked");
    return false;
  }
}

let users = load(STORAGE.users, []);

/* ---------- shared header & footer ---------- */
function renderLayout() {
  const headerHost = document.querySelector("[data-site-header]");
  if (headerHost && !headerHost.innerHTML.trim()) {
    headerHost.innerHTML = `
      <header class="site-header">
        <a class="brand" href="home.html#home">
          <span class="brand-mark" data-brand-mark></span>
          <span data-brand-name></span>
        </a>
        <nav class="main-nav" aria-label="Main navigation">
          <a class="nav-link" href="home.html#home">Home</a>
          <a class="nav-link" href="home.html#menu">Menu</a>
          <a class="nav-link" href="home.html#canteens">Canteens</a>
          <a class="nav-link active" href="register.html">Register</a>
        </nav>
        <div class="header-actions">
          <a class="button button-light small" href="home.html#menu">Order now</a>
        </div>
      </header>
    `;
  }

  const footerHost = document.querySelector("[data-site-footer]");
  if (footerHost && !footerHost.innerHTML.trim()) {
    footerHost.innerHTML = `
      <footer class="footer">
        <div class="section-wrap footer-inner">
          <a class="brand" href="home.html#home">
            <span class="brand-mark" data-brand-mark></span>
            <span data-brand-name></span>
          </a>
          <p id="footer-tagline">${esc(CONFIG.tagline)}</p>
        </div>
      </footer>
    `;
  }
}

/* ---------- helpers ---------- */
const normPhone = v => v.replace(/[\s-]/g, "");
const normId = v => v.trim().toUpperCase();

async function hashPassword(pw) {
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return "demo-" + btoa(encodeURIComponent(pw));
}

/* ---------- validation ---------- */
const RULES = {
  "full-name": v => !v.trim()
    ? "Enter your full name."
    : !/^\p{L}[\p{L}\s.'-]{2,}$/u.test(v.trim())
      ? "Use letters only, at least 3 characters."
      : "",
  "student-id": v => !v.trim()
    ? "Enter your student ID."
    : !/^[A-Za-z0-9/-]{4,20}$/.test(v.trim())
      ? "Use 4 to 20 letters, numbers, / or -."
      : users.some(u => u.studentId === normId(v))
        ? "This student ID is already registered."
        : "",
  "academic-year": v => v ? "" : "Select your academic year.",
  "faculty": v => v ? "" : "Select your faculty.",
  "email": v => !v.trim()
    ? "Enter your email address."
    : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
      ? "Enter a valid email, like name@example.com."
      : users.some(u => u.email === v.trim().toLowerCase())
        ? "This email is already registered."
        : "",
  "phone": v => !v.trim()
    ? "Enter your mobile number."
    : !/^(?:0|\+94)7\d{8}$/.test(normPhone(v))
      ? "Enter a Sri Lankan mobile number, like 0712345678."
      : "",
  "password": v => !v
    ? "Create a password."
    : v.length < 8
      ? "Use at least 8 characters."
      : !/[A-Za-z]/.test(v) || !/\d/.test(v)
        ? "Include at least one letter and one number."
        : "",
  "confirm-password": v => !v
    ? "Re-enter your password."
    : v !== $("password").value
      ? "Passwords do not match."
      : "",
  "terms": () => $("terms").checked ? "" : "Please confirm your details are correct."
};

function checkField(id) {
  const el = $(id);
  const errEl = $("err-" + id);
  if (!el) return true;

  const msg = RULES[id](el.type === "checkbox" ? "" : el.value);
  if (errEl) errEl.textContent = msg;
  el.setAttribute("aria-invalid", msg ? "true" : "false");
  return !msg;
}

function checkAll() {
  const results = Object.keys(RULES).map(id => [id, checkField(id)]);
  const bad = results.find(([, ok]) => !ok);
  if (bad) $(bad[0]).focus();
  return !bad;
}

/* ---------- dropdowns ---------- */
function populateSelect(id, placeholder, items) {
  const select = $(id);
  if (!select) return;
  select.innerHTML =
    `<option value="">${esc(placeholder)}</option>` +
    items.map(item => `<option value="${esc(item)}">${esc(item)}</option>`).join("");
}

/* ---------- submit ---------- */
$("register-form").addEventListener("submit", async e => {
  e.preventDefault();
  if (!checkAll()) return toast("Please fix the highlighted fields");

  const btn = $("register-submit");
  btn.disabled = true;
  try {
    const user = {
      id: "U" + Date.now().toString(36).toUpperCase(),
      fullName: $("full-name").value.trim(),
      studentId: normId($("student-id").value),
      year: $("academic-year").value,
      faculty: $("faculty").value,
      email: $("email").value.trim().toLowerCase(),
      phone: normPhone($("phone").value),
      passwordHash: await hashPassword($("password").value),
      created: new Date().toLocaleString()
    };

    users.push(user);
    if (!save()) {
      users.pop();
      return;
    }

    $("success-text").textContent = `Welcome, ${user.fullName.split(/\s+/)[0]}. Your Ruhuna Eats account is ready.`;
    $("success-id").textContent = user.studentId;
    $("register-form").reset();
    $$("#register-form [aria-invalid]").forEach(el => el.setAttribute("aria-invalid", "false"));
    setPasswordVisibility(false);
    showModal("success-modal");
    $("success-continue").focus();
    toast("Registration successful!");
  } finally {
    btn.disabled = false;
  }
});

/* ---------- events ---------- */
Object.keys(RULES).forEach(id => {
  const el = $(id);
  if (!el) return;
  el.addEventListener("blur", () => {
    if (el.value || el.type === "checkbox") checkField(id);
  });
  el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input", () => {
    if (el.getAttribute("aria-invalid") === "true") checkField(id);
    if (id === "password" && $("confirm-password").value) checkField("confirm-password");
  });
});

// Auto-select Faculty from Student ID prefix (e.g., SC/2022/12345 -> Science)
$("student-id").addEventListener("input", e => {
  const prefix = e.target.value.trim().toUpperCase().split("/")[0];
  const matchedFaculty = FACULTY_PREFIXES[prefix];
  const facultyEl = $("faculty");
  if (matchedFaculty && facultyEl && !facultyEl.value) {
    facultyEl.value = matchedFaculty;
    checkField("faculty");
  }
});

function setPasswordVisibility(on) {
  ["password", "confirm-password"].forEach(id => {
    const el = $(id);
    if (el) el.type = on ? "text" : "password";
  });
  const toggle = $("show-password");
  if (toggle) toggle.checked = on;
}

$("show-password").addEventListener("change", e => setPasswordVisibility(e.target.checked));
$("register-another").addEventListener("click", () => {
  showModal("success-modal", false);
  $("full-name").focus();
});
$("success-modal").addEventListener("click", e => {
  if (e.target === $("success-modal")) showModal("success-modal", false);
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") showModal("success-modal", false);
});

/* ---------- init ---------- */
function init() {
  renderLayout();

  const { brand } = CONFIG;
  document.title = `Register | ${brand.name}${brand.accent}`;

  $$("[data-brand-mark]").forEach(el => {
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

  $$("[data-brand-name]").forEach(el => {
    el.innerHTML = `${esc(brand.name)}<span class="brand-green">${esc(brand.accent)}</span>`;
  });

  const taglineEl = $("footer-tagline");
  if (taglineEl) taglineEl.textContent = CONFIG.tagline;

  populateSelect("faculty", "Select faculty", CONFIG.faculties);
  populateSelect("academic-year", "Select year", CONFIG.years);
}

init();