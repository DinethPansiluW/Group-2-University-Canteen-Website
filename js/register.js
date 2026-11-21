/* ====== Keep this block in sync with CONFIG in home.js ====== */
const CONFIG = {
  brand: { name: "Taste of ", accent: "Ruhuna", mark: "../assets/ruhuna-2.png" },
  tagline: "University of Ruhuna · Matara, Southern Province · Unofficial student project",
  faculties: [
    "Agriculture", "Engineering", "Fisheries & Marine Sciences and Technology",
    "Humanities & Social Sciences", "Management & Finance", "Medicine",
    "Science", "Technology", "Allied Health Sciences"
  ],
  years: ["1st year", "2nd year", "3rd year", "4th year", "Postgraduate"]
};
const STORAGE = { users: "ruhuna_users_v1" };

const $ = id => document.getElementById(id); const $$ = sel => document.querySelectorAll(sel);
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const showModal = (id, on = true) => $(id).classList.toggle("show", on);

function toast(msg) {
  const el = $("toast");
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

/* ---------- helpers ---------- */
const normPhone = v => v.replace(/[\s-]/g, "");
const normId = v => v.trim().toUpperCase();

// Demo only: hashes with SHA-256 when the browser allows it. A real site must hash on the server.
async function hashPassword(pw) {
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return "demo-" + btoa(encodeURIComponent(pw));
}

/* ---------- validation ---------- */
// Each rule returns an error message, or "" when the value is fine.
const RULES = {
  "full-name": v => !v.trim() ? "Enter your full name."
    : !/^\p{L}[\p{L}\s.'-]{2,}$/u.test(v.trim()) ? "Use letters only, at least 3 characters." : "",
  "student-id": v => !v.trim() ? "Enter your student ID."
    : !/^[A-Za-z0-9/-]{4,20}$/.test(v.trim()) ? "Use 4 to 20 letters, numbers, / or -."
    : users.some(u => u.studentId === normId(v)) ? "This student ID is already registered." : "",
  "academic-year": v => v ? "" : "Select your academic year.",
  "faculty": v => v ? "" : "Select your faculty.",
  "email": v => !v.trim() ? "Enter your email address."
    : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "Enter a valid email, like name@example.com."
    : users.some(u => u.email === v.trim().toLowerCase()) ? "This email is already registered." : "",
  "phone": v => !v.trim() ? "Enter your mobile number."
    : !/^(?:0|\+94)7\d{8}$/.test(normPhone(v)) ? "Enter a Sri Lankan mobile number, like 0712345678." : "",
  "password": v => !v ? "Create a password."
    : v.length < 8 ? "Use at least 8 characters."
    : !/[A-Za-z]/.test(v) || !/\d/.test(v) ? "Include at least one letter and one number." : "",
  "confirm-password": v => !v ? "Re-enter your password."
    : v !== $("password").value ? "Passwords do not match." : "",
  "terms": () => $("terms").checked ? "" : "Please confirm your details are correct."
};

function checkField(id) {
  const el = $(id);
  const msg = RULES[id](el.type === "checkbox" ? "" : el.value);
  $("err-" + id).textContent = msg;
  el.setAttribute("aria-invalid", msg ? "true" : "false");
  return !msg;
}

function checkAll() {
  const results = Object.keys(RULES).map(id => [id, checkField(id)]);
  const bad = results.find(([, ok]) => !ok);
  if (bad) $(bad[0]).focus();
  return !bad;
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
    $("register-form").reset(); $$("#register-form [aria-invalid]").forEach(el => el.setAttribute("aria-invalid", "false"));
    setPasswordVisibility(false);
    showModal("success-modal");
    $("success-continue").focus();
    toast("Registration successful!");
  } finally {
    btn.disabled = false;
  }
});

/* ---------- events ---------- */
// Validate as the person leaves a field, and clear the error as they fix it
Object.keys(RULES).forEach(id => {
  const el = $(id);
  el.addEventListener("blur", () => {
    if (el.value || el.type === "checkbox") checkField(id);
  });
  el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input", () => {
    if (el.getAttribute("aria-invalid") === "true") checkField(id);
    if (id === "password" && $("confirm-password").value) checkField("confirm-password");
  });
});

function setPasswordVisibility(on) {
  ["password", "confirm-password"].forEach(id => {
    $(id).type = on ? "text" : "password";
  });
  $("show-password").checked = on;
}

$("show-password").addEventListener("change", e => setPasswordVisibility(e.target.checked));
$("register-another").addEventListener("click", () =>