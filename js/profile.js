/* Profile page: shows the signed-in customer, lets them add a photo,
   fill in details, and log out. Uses the same browser storage as login.js / register.js. */
(function () {
  const USERS_KEY = "ruhuna_users_v1";
  const SESSION_KEY = "ruhuna_active_user_v1";

  // Same lists as the register form
  const FACULTIES = [
    "Agriculture", "Engineering", "Fisheries & Marine Sciences and Technology",
    "Humanities & Social Sciences", "Management & Finance", "Medicine",
    "Science", "Technology", "Allied Health Sciences"
  ];
  const YEARS = ["1st year", "2nd year", "3rd year", "4th year", "Postgraduate"];

  const el = (id) => document.getElementById(id);
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const say = (msg) => { if (typeof toast === "function") toast(msg); };

  /* ---------- storage ---------- */
  function readJSON(store, key) {
    try { const raw = store.getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function getSession() { return readJSON(sessionStorage, SESSION_KEY) || readJSON(localStorage, SESSION_KEY); }
  function getUsers() { return readJSON(localStorage, USERS_KEY) || []; }
  function saveUsers(users) {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); return true; }
    catch (e) { say("Could not save: browser storage is full or blocked"); return false; }
  }
  function currentUser() {
    const session = getSession();
    if (!session) return null;
    return getUsers().filter((u) => u.id === session.id)[0] || null;
  }
  function changed() { window.dispatchEvent(new Event("ruhuna-profile-updated")); }

  /* ---------- helpers ---------- */
  function initials(name) {
    const p = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!p.length) return "?";
    return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
  }
  const normPhone = (v) => v.replace(/[\s-]/g, "");
  const options = (list, first) =>
    (first != null ? '<option value="">' + esc(first) + "</option>" : "") +
    list.map((x) => "<option>" + esc(x) + "</option>").join("");

  /* ---------- draw ---------- */
  function drawAvatar(user) {
    const box = el("pf-avatar");
    box.innerHTML = "";
    if (user.photo) {
      const img = document.createElement("img");
      img.src = user.photo;
      img.alt = "Profile photo of " + user.fullName;
      box.appendChild(img);
    } else {
      box.textContent = initials(user.fullName);
    }
    el("pf-remove").style.display = user.photo ? "" : "none";
    el("pf-change").textContent = user.photo ? "Change photo" : "Upload photo";
  }

  function fillForm(user) {
    const role = window.roleOf(user), key = user.role || "student";
    el("pf-name").textContent = user.fullName;
    el("pf-sub").textContent = [role.label, user.studentId, user.faculty, user.year].filter(Boolean).join(" · ");
    el("pf-role").value = role.label;
    el("pf-id-label").textContent = role.idLabel;
    el("pf-faculty-label").textContent = role.facultyLabel;
    el("pf-faculty").closest("label").hidden = !role.needsFaculty;
    el("pf-year").closest("label").hidden = !role.needsYear;
    el("pf-faculty").innerHTML = window.facultyOptions(key, FACULTIES, esc);
    el("pf-fullname").value = user.fullName || "";
    el("pf-studentid").value = user.studentId || "";
    el("pf-email").value = user.email || "";
    el("pf-phone").value = user.phone || "";
    el("pf-faculty").value = user.faculty || "";
    el("pf-year").value = user.year || "";
    el("pf-canteen").value = user.favCanteen || "";
    el("pf-notes").value = user.notes || "";
    drawAvatar(user);
  }

  function render() {
    const user = currentUser();
    el("pf-guest").hidden = !!user;
    el("pf-card").hidden = !user;
    if (user) fillForm(user);
  }

  /* ---------- photo upload (cropped to a small square so it fits in browser storage) ---------- */
  function toAvatar(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const size = 256, c = document.createElement("canvas");
          c.width = c.height = size;
          const side = Math.min(img.width, img.height);
          c.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
          resolve(c.toDataURL("image/jpeg", 0.85));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function updateUser(patch) {
    const session = getSession();
    const users = getUsers();
    const i = users.findIndex((u) => session && u.id === session.id);
    if (i < 0) return null;
    users[i] = Object.assign({}, users[i], patch);
    if (!saveUsers(users)) return null;

    // keep the session summary in step (name, faculty, year)
    ["localStorage", "sessionStorage"].forEach((name) => {
      const store = window[name];
      const s = readJSON(store, SESSION_KEY);
      if (!s) return;
      s.fullName = users[i].fullName; s.faculty = users[i].faculty; s.year = users[i].year;
      try { store.setItem(SESSION_KEY, JSON.stringify(s)); } catch (e) {}
    });
    changed();
    return users[i];
  }

  el("pf-change").addEventListener("click", () => el("pf-photo").click());

  el("pf-photo").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!/^image\//.test(file.type)) return say("Please choose an image file (JPG or PNG)");
    if (file.size > 8 * 1024 * 1024) return say("That image is too large. Choose one under 8 MB");
    try {
      const photo = await toAvatar(file);
      const user = updateUser({ photo });
      if (user) { drawAvatar(user); say("Profile photo updated"); }
    } catch (err) {
      say("Could not read that image");
    }
  });

  el("pf-remove").addEventListener("click", () => {
    const user = updateUser({ photo: "" });
    if (user) { drawAvatar(user); say("Profile photo removed"); }
  });

  /* ---------- save details ---------- */
  function setError(id, msg) {
    el("pf-err-" + id).textContent = msg;
    el("pf-" + id).setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  el("pf-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = el("pf-fullname").value.trim();
    const phone = normPhone(el("pf-phone").value);

    const nameOk = setError("fullname",
      !name ? "Enter your full name."
      : !/^\p{L}[\p{L}\s.'-]{2,}$/u.test(name) ? "Use letters only, at least 3 characters." : "");
    const phoneOk = setError("phone",
      !phone ? "Enter your mobile number."
      : !/^(?:0|\+94)7\d{8}$/.test(phone) ? "Enter a Sri Lankan mobile number, like 0712345678." : "");
    if (!nameOk) return el("pf-fullname").focus();
    if (!phoneOk) return el("pf-phone").focus();

    const user = updateUser({
      fullName: name,
      phone: phone,
      faculty: window.roleOf(currentUser()).needsFaculty ? el("pf-faculty").value : "",
      year: window.roleOf(currentUser()).needsYear ? el("pf-year").value : "",
      favCanteen: el("pf-canteen").value,
      notes: el("pf-notes").value.trim()
    });
    if (!user) return;

    fillForm(user);
    const saved = el("pf-saved");
    saved.textContent = "✓ Saved";
    clearTimeout(saved.t);
    saved.t = setTimeout(() => { saved.textContent = ""; }, 2500);
    say("Profile saved");
  });

  /* ---------- log out ---------- */
  el("pf-logout").addEventListener("click", () => {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
    changed();
    say("You have been logged out");
    setTimeout(() => { location.href = "../index.html"; }, 600);
  });

  /* ---------- not signed in ---------- */
  el("pf-signin").addEventListener("click", () => {
    if (typeof window.openAuthModal === "function") window.openAuthModal("login");
  });

  /* ---------- start ---------- */
  el("pf-year").innerHTML = options(YEARS, "Select year");
  const canteens = (typeof C !== "undefined" && Array.isArray(C)) ? C : [];
  el("pf-canteen").innerHTML = options(canteens, "No favourite yet");
  render();
  window.addEventListener("storage", render);
  window.addEventListener("message", (e) => { if (e.data && e.data.authDone) render(); });
})();
