/*  ╔═══════════════════════════════════════════════════════════════╗
    ║  UNDER CONSTRUCTION MODE — Boucenna Website                 ║
    ║                                                             ║
    ║  Change the flag below to control the maintenance screen:   ║
    ║    true  → visitors see the "under construction" page       ║
    ║    false → normal website is shown                          ║
    ╚═══════════════════════════════════════════════════════════════╝ */

const UNDER_CONSTRUCTION = false;

/* ── Nothing below needs to be edited ─────────────────────────── */

(function () {
  if (!UNDER_CONSTRUCTION) return;

  /* Hide all page content instantly (before paint) */
  document.documentElement.style.overflow = 'hidden';

  document.addEventListener('DOMContentLoaded', function () {

    /* Hide body content */
    document.body.style.overflow = 'hidden';

    /* Build overlay */
    var overlay = document.createElement('div');
    overlay.id = 'maintenance-overlay';
    overlay.innerHTML = ''
      /* ── inline styles ── */
      + '<style>'
      + '#maintenance-overlay {'
      + '  position: fixed; inset: 0; z-index: 999999;'
      + '  display: flex; align-items: center; justify-content: center;'
      + '  background: linear-gradient(160deg, #0a2540 0%, #071927 50%, #0a2540 100%);'
      + '  font-family: "Plus Jakarta Sans", "Cairo", "Noto Sans Arabic", sans-serif;'
      + '  color: #ffffff; text-align: center;'
      + '  overflow: hidden;'
      + '}'
      /* subtle animated background pattern */
      + '#maintenance-overlay::before {'
      + '  content: ""; position: absolute; inset: -50%;'
      + '  background: radial-gradient(circle at 30% 40%, rgba(0,102,204,0.12) 0%, transparent 60%),'
      + '              radial-gradient(circle at 70% 60%, rgba(0,172,177,0.10) 0%, transparent 60%);'
      + '  animation: m-drift 12s ease-in-out infinite alternate;'
      + '}'
      + '@keyframes m-drift { 0%{transform:translate(0,0)} 100%{transform:translate(40px,-30px)} }'
      /* card */
      + '.m-card {'
      + '  position: relative; z-index: 1;'
      + '  max-width: 560px; width: 90%; padding: 56px 40px;'
      + '  background: rgba(255,255,255,0.04);'
      + '  border: 1px solid rgba(255,255,255,0.08);'
      + '  border-radius: 20px;'
      + '  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);'
      + '}'
      /* logo */
      + '.m-logo { width: 200px; height: auto; margin-bottom: 40px; opacity: 0.95; }'
      /* divider */
      + '.m-divider {'
      + '  width: 48px; height: 3px; margin: 0 auto 36px;'
      + '  background: linear-gradient(90deg, #0066cc, #00ACB1);'
      + '  border-radius: 3px;'
      + '}'
      /* French text */
      + '.m-text-fr { font-size: 1.15rem; line-height: 1.85; color: rgba(255,255,255,0.88);'
      + '  margin-bottom: 28px; font-weight: 500; letter-spacing: 0.01em; }'
      /* Arabic text */
      + '.m-text-ar { font-family: "Cairo", "Noto Sans Arabic", sans-serif;'
      + '  font-size: 1.2rem; line-height: 2; color: rgba(255,255,255,0.72);'
      + '  direction: rtl; font-weight: 500; }'
      /* small accent line between languages */
      + '.m-sep { width: 24px; height: 1px; margin: 0 auto 28px;'
      + '  background: rgba(255,255,255,0.15); }'
      /* responsive */
      + '@media (max-width: 480px) {'
      + '  .m-card { padding: 40px 24px; }'
      + '  .m-logo { width: 160px; margin-bottom: 32px; }'
      + '  .m-text-fr { font-size: 1rem; }'
      + '  .m-text-ar { font-size: 1.05rem; }'
      + '}'
      + '</style>'

      /* ── markup ── */
      + '<div class="m-card">'
      +   '<img src="' + getLogoPath() + '" alt="Boucenna" class="m-logo">'
      +   '<div class="m-divider"></div>'
      +   '<p class="m-text-fr">'
      +     'Site web en cours de préparation.<br>'
      +     'Nous revenons très bientôt.'
      +   '</p>'
      +   '<div class="m-sep"></div>'
      +   '<p class="m-text-ar">'
      +     'الموقع الإلكتروني قيد التحضير.<br>'
      +     'سنعود إليكم قريبًا.'
      +   '</p>'
      + '</div>';

    document.body.appendChild(overlay);

    /* Also hide the preloader if present */
    var preloader = document.querySelector('[data-preloader]');
    if (preloader) preloader.style.display = 'none';
  });

  /**
   * Resolve the logo path relative to the current page depth.
   * Pages in the root use "./assets/...", deeper pages would use "../assets/...".
   */
  function getLogoPath() {
    var depth = (window.location.pathname.match(/\//g) || []).length - 1;
    /* All Boucenna pages are at root level, so use a simple relative path */
    var prefix = './';
    if (depth > 1) {
      prefix = '';
      for (var i = 1; i < depth; i++) prefix += '../';
    }
    return prefix + 'assets/images/SVG/new/logo-long-light.png';
  }
})();
