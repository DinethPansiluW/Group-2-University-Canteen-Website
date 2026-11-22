(function () {
  const script = document.currentScript;
  const SHARED = new URL('./', script.src);   
  const ROOT = new URL('../', SHARED);         

 
  const PAGES = {
    home: 'index.html',
    about: 'html/about.html',
    menu: 'html/menu.html',
    orders: 'html/orders.html',
    register: 'html/register.html',
    login: 'html/login.html',
    contact: 'html/contact.html',
    profile: 'html/profile.html',
  };
  const BRAND_NAME = 'Taste of Ruhuna';                       
  const BRAND_NAME_HTML = 'Taste of <span class="brand-green">Ruhuna</span>';  
  const LOGO = 'assets/ruhuna-2.png'; 
  const LOGO_HEIGHT = 34;       
  const LOGO_HEIGHT_FOOTER = 30;
  const FOOTER_TAGLINE = 'University of Ruhuna · Matara, Southern Province';

  const url = (p) => new URL(p, ROOT).href;
  const path = decodeURIComponent(location.pathname);
  const isActive = (p) => path.endsWith(p);
 
  const onHome = !!document.getElementById('home');

 
  const cssHref = new URL('layout.css', SHARED).href;
  if (![...document.querySelectorAll('link[rel="stylesheet"]')].some((l) => l.href === cssHref)) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = cssHref;
    document.head.insertBefore(css, document.head.firstChild);
  }

  const homeHash = (h) => (onHome ? h : url(PAGES.home) + h);

  const link = (href, label, active) =>
    `<a class="nav-link${active ? ' active' : ''}" href="${href}">${label}</a>`;

  
  const brandHTML = (h) => `
    <a class="brand" href="${url(PAGES.home)}" aria-label="${BRAND_NAME}">
      <img class="brand-logo" src="${url(LOGO)}" alt="${BRAND_NAME}" style="height:${h}px;width:auto;max-width:none;display:block">
      <span data-brand-name>${BRAND_NAME_HTML}</span>
    </a>`;

  const headerHTML = (withActions) => `
  <header class="site-header">
    ${brandHTML(LOGO_HEIGHT)}
    <nav class="main-nav">
      ${link(homeHash('#home'), 'Home', onHome)}
      ${link(url(PAGES.menu), 'Menu', isActive(PAGES.menu))}
      ${link(url(PAGES.orders), 'Orders', isActive(PAGES.orders))}
      ${link(url(PAGES.contact), 'Contact Us', isActive(PAGES.contact))}
    </nav>
    ${withActions ? `
    <div class="header-actions">
      <button class="button button-dark small" id="owner-open">Owner panel</button>
      <button class="icon-button" id="cart-open" aria-label="Open cart">🛒<span id="cart-count" class="cart-count">0</span></button>
      <button class="icon-button profile-button" id="profile-open" aria-label="Profile"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"></path></svg></button>
    </div>` : ''}
  </header>`;

  const footerHTML = `
  <footer class="footer">
    <div class="section-wrap footer-about">
      <div class="footer-about-text">
        <h3>Our Mission</h3>
        <p>To eliminate long queues during tight lecture breaks by giving University of Ruhuna students a fast, transparent way to browse daily menus and reserve meals ahead of time. By helping canteen operators track real-time demand and update stock status effortlessly, we also reduce daily food waste while ensuring fresh meals are ready when you arrive.</p>
      </div>
      <nav class="footer-links" aria-label="Footer">
        <h3>Quick Links</h3>
        <a href="${url(PAGES.menu)}">Menu</a>
        <a href="${url(PAGES.about)}">About Us</a>
        <a href="${url(PAGES.register)}">Register</a>
        <a href="${url(PAGES.contact)}">Contact Us</a>
      </nav>
    </div>
    <div class="section-wrap footer-inner">
      ${brandHTML(LOGO_HEIGHT_FOOTER)}
      <p id="footer-tagline">${FOOTER_TAGLINE}</p>
    </div>
  </footer>`;

  document.querySelectorAll('[data-site-header]').forEach((el) => {
    el.outerHTML = headerHTML(el.hasAttribute('data-actions'));
  });
  document.querySelectorAll('[data-site-footer]').forEach((el) => {
    el.outerHTML = footerHTML;
  });

  // ---- Account modal (opened by the profile icon): Sign In / Register ----
  const AUTH_TEXT = {
    login: ['Welcome Back', 'Sign in with your student ID or email to access your account'],
    register: ['Create your account', 'Register once to order from any Ruhuna canteen'],
  };
  let authModal = null;

  function buildAuthModal() {
    const wrap = document.createElement('div');
    wrap.className = 'auth-backdrop';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'auth-title');
    wrap.innerHTML = `
      <div class="auth-box">
        <button type="button" class="auth-close" aria-label="Close">&times;</button>
        <h2 id="auth-title"></h2>
        <p class="auth-sub"></p>
        <div class="auth-tabs">
          <button type="button" class="auth-tab" data-tab="login">Sign In</button>
          <button type="button" class="auth-tab" data-tab="register">Register</button>
        </div>
        <iframe class="auth-frame" title="Account"></iframe>
      </div>`;
    document.body.appendChild(wrap);
    wrap.addEventListener('click', (e) => { if (e.target === wrap) closeAuth(); });
    wrap.querySelector('.auth-close').addEventListener('click', closeAuth);
    wrap.querySelectorAll('.auth-tab').forEach((b) => b.addEventListener('click', () => setAuthTab(b.dataset.tab)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAuth(); });
    return wrap;
  }

  function setAuthTab(tab) {
    const frame = authModal.querySelector('.auth-frame');
    authModal.querySelector('#auth-title').textContent = AUTH_TEXT[tab][0];
    authModal.querySelector('.auth-sub').textContent = AUTH_TEXT[tab][1];
    authModal.querySelectorAll('.auth-tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
    const target = url(PAGES[tab]) + '?embed=1';
    if (frame.getAttribute('src') !== target) frame.setAttribute('src', target);
  }

  function openAuth(tab) {
    if (!authModal) authModal = buildAuthModal();
    setAuthTab(tab || 'login');
    authModal.classList.add('show');
    document.body.classList.add('auth-open');
  }
  function closeAuth() {
    if (!authModal) return;
    authModal.classList.remove('show');
    document.body.classList.remove('auth-open');
  }

  // ---- Signed-in state (shared by every page) ----
  const SESSION_KEY = 'ruhuna_active_user_v1';
  const USERS_KEY = 'ruhuna_users_v1';
  function readJSON(store, key) {
    try { const raw = store.getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function currentUser() {
    const session = readJSON(sessionStorage, SESSION_KEY) || readJSON(localStorage, SESSION_KEY);
    if (!session) return null;
    const users = readJSON(localStorage, USERS_KEY) || [];
    return users.filter((u) => u.id === session.id)[0] || null;
  }
  function initialsOf(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }
  // Profile icon: plain icon when signed out, photo (or initials) when signed in
  function updateProfileButton() {
    const user = currentUser();
    document.querySelectorAll('#profile-open').forEach((b) => {
      b.classList.toggle('signed-in', !!user);
      b.setAttribute('aria-label', user ? 'My profile' : 'Sign in');
      b.title = user ? 'My profile' : 'Sign in';
      const old = b.querySelector('.profile-avatar');
      if (old) old.remove();
      const svg = b.querySelector('svg');
      if (user) {
        const av = document.createElement('span');
        av.className = 'profile-avatar';
        if (user.photo) {
          const img = document.createElement('img');
          img.src = user.photo;
          img.alt = '';
          av.appendChild(img);
        } else {
          av.textContent = initialsOf(user.fullName);
        }
        b.appendChild(av);
        if (svg) svg.style.display = 'none';
      } else if (svg) {
        svg.style.display = '';
      }
    });
  }

  document.querySelectorAll('#profile-open').forEach((b) => b.addEventListener('click', () => {
    if (currentUser()) location.href = url(PAGES.profile);   // signed in -> profile page
    else openAuth('login');                                  // signed out -> Sign In / Register popup
  }));
  updateProfileButton();
  window.addEventListener('storage', updateProfileButton);
  window.addEventListener('ruhuna-profile-updated', updateProfileButton);
  window.openAuthModal = openAuth;
  window.addEventListener('message', (e) => {
    if (e.data && e.data.authTab && authModal) setAuthTab(e.data.authTab);
    if (e.data && e.data.authDone) updateProfileButton();
  });

  // Inside the modal (embed mode): switch tabs instead of navigating away
  if (/[?&]embed=1/.test(location.search)) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href$="register.html"], a[href$="login.html"]');
      if (!a) return;
      e.preventDefault();
      parent.postMessage({ authTab: a.getAttribute('href').endsWith('register.html') ? 'register' : 'login' }, '*');
    });
  }
})();