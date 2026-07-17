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

  // Sports and lounge buttons both active
  $$('[data-mode-btn]').forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.modeBtn));
  });

  /* ---------- Splash screen (one-time experience chooser) ---------- */
  (function () {
    const splash = document.getElementById('splash');
    if (!splash) return;

    const hasSeen = (() => { try { return localStorage.getItem('excavate-experience-seen'); } catch (_) { return null; } })();

    if (hasSeen) {
      // Already chose — hide immediately and restore last mode
      splash.style.display = 'none';
      return; // setMode runs below via savedMode
    }

    // First visit — block scroll, wait for choice
    document.body.style.overflow = 'hidden';

    function chooseSplash(mode) {
      setMode(mode, { animate: false });
      splash.classList.add('hidden');
      setTimeout(() => { splash.style.display = 'none'; }, 750);
      document.body.style.overflow = '';
      try { localStorage.setItem('excavate-experience-seen', '1'); } catch (_) {}
    }

    const btnSports = document.getElementById('splashSports');
    const btnLounge = document.getElementById('splashLounge');
    if (btnSports) btnSports.addEventListener('click', () => chooseSplash('sports'));
    if (btnLounge) btnLounge.addEventListener('click', () => chooseSplash('lounge'));
  })();

  // Set mode from session (runs on every page load; on first visit splash sets it before this)
  const savedMode = (() => { try { return sessionStorage.getItem('excavate-mode'); } catch (_) { return null; } })();
  setMode(savedMode === 'lounge' ? 'lounge' : 'sports', { animate: false });

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
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new URLSearchParams(new FormData(form)).toString();
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
      })
      .then(() => { window.location.href = '/success.html'; })
      .catch(() => { window.location.href = '/success.html'; });
    });
  }
})();
