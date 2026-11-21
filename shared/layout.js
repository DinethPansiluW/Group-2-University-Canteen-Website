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
  };
  const BRAND_NAME = 'Taste of Ruhuna';                       
  const BRAND_NAME_HTML = 'Taste of <span class="brand-green">Ruhuna</span>';  
  const LOGO = 'assets/ruhuna-2.png'; 
  const LOGO_HEIGHT = 34;       
  const LOGO_HEIGHT_FOOTER = 30;
  const FOOTER_TAGLINE = 'University of Ruhuna · Matara, Southern Province · Unofficial student project';

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
      ${link(url(PAGES.about), 'About Us', isActive(PAGES.about))}
      ${link(url(PAGES.register), 'Register', isActive(PAGES.register))}
      ${link(url(PAGES.login), 'Login', isActive(PAGES.login))}
      ${link(url(PAGES.contact), 'Contact Us', isActive(PAGES.contact))}
    </nav>
    ${withActions ? `
    <div class="header-actions">
      <button class="icon-button" id="cart-open" aria-label="Open cart">🛒<span id="cart-count" class="cart-count">0</span></button>
      <button class="button button-dark small" id="owner-open">Owner panel</button>
    </div>` : ''}
  </header>`;

  const footerHTML = `
  <footer class="footer">
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
})();