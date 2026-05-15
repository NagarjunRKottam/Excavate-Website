(function () {
  'use strict';

  const $  = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  /* ---------- Nav: transparent → solid on scroll ---------- */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Sports / Lounge mode toggle ---------- */
  const body  = document.body;
  const flash = $('#modeFlash');

  function setMode(mode, { animate = true } = {}) {
    if (mode !== 'sports' && mode !== 'lounge') return;
    if (animate && flash && body.dataset.mode !== mode) {
      flash.classList.add('flash');
      setTimeout(() => flash.classList.remove('flash'), 650);
    }
    body.dataset.mode = mode;
    $$('[data-mode-btn]').forEach(btn => btn.classList.toggle('active', btn.dataset.modeBtn === mode));
    try { sessionStorage.setItem('excavate-mode', mode); } catch (_) {}
  }

  // Sports disabled — only lounge button is active
  $$('[data-mode-btn]').forEach(btn => {
    if (btn.dataset.modeBtn === 'lounge') {
      btn.addEventListener('click', () => setMode('lounge'));
    }
  });

  // Always default to lounge
  setMode('lounge', { animate: false });

  /* ---------- Mobile nav ---------- */
  const navToggle  = $('#navToggle');
  const navLinks   = $('#navLinks');
  const navOverlay = $('#navOverlay');

  function openDrawer() {
    navLinks.classList.add('open');
    navOverlay && navOverlay.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    navLinks.classList.remove('open');
    navOverlay && navOverlay.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () =>
      navLinks.classList.contains('open') ? closeDrawer() : openDrawer()
    );
    navOverlay && navOverlay.addEventListener('click', closeDrawer);
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
  }

  /* ---------- Menu / Events tab panels ---------- */
  $$('.menu-tabs').forEach(tabList => {
    const tabs   = $$('.menu-tab', tabList);
    const panels = $$('.menu-panel', tabList.parentElement);
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = panels.find(p => p.dataset.panel === tab.dataset.tab);
        if (panel) panel.classList.add('active');
      });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  /* ---------- Soft-launch banner modal ---------- */
  (function () {
    const modal = document.getElementById('launchModal');
    const closeBtn = document.getElementById('launchModalClose');
    if (!modal) return;

    const STORAGE_KEY = 'excavate-launch-seen';

    function closeModal() {
      modal.classList.add('hidden');
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (_) {}
    }

    // Only show once per session
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) {
        modal.classList.add('hidden');
        return;
      }
    } catch (_) {}

    // Close on button click
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
  })();

  /* ---------- Reservation form ---------- */
  const form = $('#reserveForm');
  const ok   = $('#reserveOk');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (ok) { ok.style.display = 'block'; form.reset(); }
    });
  }
})();
