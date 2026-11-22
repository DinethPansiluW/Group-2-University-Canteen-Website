/* ====== Keep this block in sync with CONFIG in home.js / register.js ====== */
const CONFIG = {
  brand: { name: "Taste of ", accent: "Ruhuna", mark: "../assets/ruhuna-2.png" },
  tagline: "University of Ruhuna · Matara, Southern Province"
};
const STORAGE = {
  users: "ruhuna_users_v1",
  session: "ruhuna_active_user_v1"
};

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[c]));
const showModal = (id, on = true) => $(id).classList.toggle("show", on);

function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove("show"), 2400);
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE.users);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSession(sessionData, remember) {
  try {
    const serialized = JSON.stringify(sessionData);
    localStorage.setItem(STORAGE.session, serialized);
    if (remember) {
      sessionStorage.removeItem(STORAGE.session);
    } else {
      sessionStorage.setItem(STORAGE.session, serialized);
    }
    return true;
  } catch {
    toast("Could not save session: browser storage is full or blocked");
    return false;
  }
}

const normId = v => v.trim().toUpperCase();
const normEmail = v => v.trim().toLowerCase();

// Demo only: hashes with SHA-256 to match register.js. A real site must verify on the server.
async function hashPassword(pw) {
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return "demo-" + btoa(encodeURIComponent(pw));
}

function setFieldError(id, msg) {
  const el = $(id);
  $("err-" + id).textContent = msg;
  el.setAttribute("aria-invalid", msg ? "true" : "false");
  return !msg;
}

function validateInputs() {
  const idVal = $("identifier").value;
  const pwVal = $("password").value;
  const idOk = setFieldError("identifier", idVal.trim() ? "" : "Enter your student ID or email address.");
  const pwOk = setFieldError("password", pwVal ? "" : "Enter your password.");
  if (!idOk) $("identifier").focus();
  else if (!pwOk) $("password").focus();
  return idOk && pwOk;
}

$("login-form").addEventListener("submit", async e => {
  e.preventDefault();
  if (!validateInputs()) return toast("Please enter your login details");

  const btn = $("login-submit");
  btn.disabled = true;
  try {
    const users = loadUsers();
    const rawId = $("identifier").value.trim();
    const lookupId = normId(rawId);
    const lookupEmail = normEmail(rawId);
    const pwHash = await hashPassword($("password").value);

    const matchedUser = users.find(u =>
      (normId(u.studentId || "") === lookupId || normEmail(u.email || "") === lookupEmail) &&
      u.passwordHash === pwHash
    );

    if (!matchedUser) {
      setFieldError("password", "Invalid student ID/email or password.");
      $("password").focus();
      return toast("Could not sign in — check your details");
    }

    const session = {
      id: matchedUser.id,
      fullName: matchedUser.fullName,
      studentId: matchedUser.studentId,
      faculty: matchedUser.faculty,
      year: matchedUser.year,
      signedInAt: new Date().toLocaleString()
    };
    saveSession(session, $("remember-me").checked);
    try { if (window.parent !== window) parent.postMessage({ authDone: true }, "*"); } catch {}

    const firstName = (matchedUser.fullName || "Student").split(/\s+/)[0];
    $("success-text").textContent = `Welcome back, ${firstName}. You are signed in to Ruhuna Eats.`;
    $("success-id").textContent = matchedUser.studentId;
    showModal("success-modal");
    $("success-continue").focus();
    toast("Signed in successfully!");
  } finally {
    btn.disabled = false;
  }
});

["identifier", "password"].forEach(id => {
  const el = $(id);
  el.addEventListener("blur", () => {
    if (el.value.trim()) setFieldError(id, "");
  });
  el.addEventListener("input", () => {
    if (el.getAttribute("aria-invalid") === "true") setFieldError(id, "");
  });
});

$("show-password").addEventListener("change", e => {
  $("password").type = e.target.checked ? "text" : "password";
});

$("stay-here").addEventListener("click", () => {
  showModal("success-modal", false);
  $("identifier").focus();
});
$("success-modal").addEventListener("click", e => {
  if (e.target === $("success-modal")) showModal("success-modal", false);
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") showModal("success-modal", false);
});

function init() {
  const { brand } = CONFIG;
  document.title = `Login | ${brand.name}${brand.accent}`;
  $$("[data-brand-mark]").forEach(el => {
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
      el.classList.remove("has-logo");
      el.textContent = brand.mark || "R";
    }
  });
  $$("[data-brand-name]").forEach(el => {
    el.innerHTML = `${esc(brand.name)}<span class="brand-green">${esc(brand.accent)}</span>`;
  });
  $("footer-tagline").textContent = CONFIG.tagline;
}

init();