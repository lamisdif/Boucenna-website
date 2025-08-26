'use strict';



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * PRELOADER
 *
 * preloader will be visible until document load
 */

const preloader = document.querySelector("[data-preloader]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * MOBILE NAVBAR
 *
 * show the mobile navbar when click menu button
 * and hidden after click menu close button or overlay
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNav = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNav);



/**
 * HEADER & BACK TOP BTN
 *
 * active header & back top btn when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeElementOnScroll = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

window.addEventListener("scroll", activeElementOnScroll);



/**
 * SCROLL REVEAL
 */

const revealElements = document.querySelectorAll("[data-reveal]");

const revealElementOnScroll = function () {
  for (let i = 0, len = revealElements.length; i < len; i++) {
    if (revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.15) {
      revealElements[i].classList.add("revealed");
    } else {
      revealElements[i].classList.remove("revealed");
    }
  }
}

window.addEventListener("scroll", revealElementOnScroll);

window.addEventListener("load", revealElementOnScroll);


// Hero Carousel
(function(){
  console.log('Carousel script loaded');

  function initCarousel() {
    console.log('Initializing carousel...');

    const carouselRoot = document.getElementById('hero-carousel');
    if(!carouselRoot) {
      console.error('Hero carousel container not found!');
      return;
    }

    // Clear any existing content
    carouselRoot.innerHTML = '';

    // Simple slides data
    // Full sets again; we'll optimize delivery via Netlify Image CDN + lazy load
    const ainOulmene = [
      'a.jpg', 'am.jpg', 'am2.jpg', 'am4.jpg', 'am5.jpg', 'am6.jpg',
      'am11.jpg', 'am12.jpg', 'am13.jpg', 'am14.jpg', 'am15.jpg', '20250526_162148.jpg'
    ].map(name => ({
      imageSrc: `./assets/images/ain oulmene/${name}`,
      title: "Clinique d'Aïn Oulmène",
      description: "Plateaux techniques modernes et équipe experte."
    }));

    const bouira = [
      'bouira.jpg',
      'Screenshot_20250528_071616_Gallery.jpg',
      'Screenshot_20250528_071624_Gallery.jpg',
      'Screenshot_20250528_071631_Gallery.jpg',
      'Screenshot_20250528_071638_Gallery.jpg',
      'Screenshot_20250528_071645_Gallery.jpg',
      'Screenshot_20250528_071651_Gallery.jpg',
      'Screenshot_20250528_071658_Gallery.jpg',
      'Screenshot_20250528_071704_Gallery.jpg',
      'Screenshot_20250528_071710_Gallery.jpg',
      'Screenshot_20250528_071716_Gallery.jpg',
      'Screenshot_20250528_071727_Gallery.jpg',
      'Screenshot_20250528_071733_Gallery.jpg',
      'Screenshot_20250528_071741_Gallery.jpg',
      'Screenshot_20250528_071748_Gallery.jpg',
      'Screenshot_20250528_071755_Gallery.jpg',
      'Screenshot_20250528_071801_Gallery.jpg',
      'Screenshot_20250528_071809_Gallery.jpg',
      'Screenshot_20250528_071815_Gallery.jpg',
      'Screenshot_20250528_071912_Gallery.jpg'
    ].map(name => ({
      imageSrc: `./assets/images/bouira/${name}`,
      title: 'Clinique de Bouira',
      description: 'Équipements de pointe, suivi personnalisé.'
    }));

    const cherchcel = ['chch4.jpg', 'chh.jpg', 'chh1.jpg', 'chh2.jpg', 'chh3.jpg']
      .map(name => ({
        imageSrc: `./assets/images/cherchcel/${name}`,
        title: 'Clinique de Cherchell',
        description: 'Soins d\'hémodialyse sûrs et confortables.'
      }));

    const pharmacie = ['ph.jpg', 'ph1.jpg', 'ph2.jpg', 'ph3.jpg', 'phh1.jpg', 'phh2.jpg', 'phh3.jpg', 'phh4.jpg']
      .map(name => ({
        imageSrc: `./assets/images/pharmacie/${name}`,
        title: 'Pharmacie Boucenna',
        description: 'Large gamme et conseils personnalisés.'
      }));

    // Merge all slides
    const slides = [
      ...ainOulmene,
      ...bouira,
      ...cherchcel,
      ...pharmacie
    ];

    console.log('Building carousel with', slides.length, 'slides');

    // Helper to generate optimized WebP via Netlify Image CDN (fallback: original)
    function optimizedUrl(src, width) {
      try {
        const u = new URL(src, location.origin);
        const path = u.pathname + (u.search || '');
        return `/.netlify/images?url=${encodeURIComponent(path)}&fm=webp&w=${width||1600}&fit=cover&auto=compress`;
      } catch { return src; }
    }

    // Build slides (lazy-load heavy images to speed up initial render)
    slides.forEach((s, idx) => {
      const slide = document.createElement('div');
      slide.className = 'hero-slide' + (idx === 0 ? ' active' : '');
      slide.style.position = 'absolute';
      slide.style.top = '0';
      slide.style.left = '0';
      slide.style.width = '100%';
      slide.style.height = '100%';
      // Opacity & transition handled by CSS (.hero-slide / .hero-slide.active)
      slide.dataset.src = optimizedUrl(s.imageSrc, 1600); // store optimized src for lazy load

      // Only inject the actual <img> for the first slide to improve LCP
      if (idx === 0) {
        const img = document.createElement('img');
        img.src = optimizedUrl(s.imageSrc, 1600);
        img.alt = s.title;
        img.loading = 'eager';
        img.decoding = 'async';
        img.setAttribute('fetchpriority', 'high');
        img.srcset = [1920,1600,1280,960,768].map(w=>`${optimizedUrl(s.imageSrc,w)} ${w}w`).join(', ');
        img.sizes = '(min-width: 1200px) 1200px, (min-width: 768px) 90vw, 100vw';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        slide.appendChild(img);
      }

      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.4)';

      const textWrap = document.createElement('div');
      textWrap.className = 'hero-text';
      const badge = document.createElement('span');
      badge.className = 'badge';
      // Infer type for badge color based on folder in path
      if (s.imageSrc.includes('/ain oulmene/')) badge.setAttribute('data-type', 'ain');
      else if (s.imageSrc.includes('/bouira/')) badge.setAttribute('data-type', 'bouira');
      else if (s.imageSrc.includes('/cherchcel/')) badge.setAttribute('data-type', 'cherchcel');
      else if (s.imageSrc.includes('/pharmacie/')) badge.setAttribute('data-type', 'pharmacie');
      badge.textContent = s.title;

      const h2 = document.createElement('h2');
      h2.textContent = s.title;

      const p = document.createElement('p');
      p.textContent = s.description;

      const textInner = document.createElement('div');
      textInner.style.maxWidth = '960px';
      textInner.style.margin = '0 auto';
      textInner.appendChild(badge);
      textInner.appendChild(h2);
      textInner.appendChild(p);
      textWrap.appendChild(textInner);

      slide.appendChild(overlay);
      slide.appendChild(textWrap);

      carouselRoot.appendChild(slide);
    });

    console.log('Carousel DOM built, starting autoplay...');

    // Simple autoplay
    const slideEls = Array.from(carouselRoot.querySelectorAll('.hero-slide'));
    let current = 0;
    let autoplayId = null;

    function ensureLoaded(idx) {
      const el = slideEls[idx];
      if (!el) return;
      const hasImg = el.querySelector('img');
      if (!hasImg) {
        const src = el.dataset.src;
        if (src) {
          const img = document.createElement('img');
          img.src = src;
          img.alt = slides[idx]?.title || 'Slide';
          img.loading = 'lazy';
          img.decoding = 'async';
          // responsive variants
          img.srcset = [1920,1600,1280,960,768].map(w=>`${optimizedUrl(slides[idx].imageSrc,w)} ${w}w`).join(', ');
          img.sizes = '(min-width: 1200px) 1200px, (min-width: 768px) 90vw, 100vw';
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          el.insertBefore(img, el.firstChild);
        }
      }
    }

    function show(idx){
      ensureLoaded(idx);
      slideEls.forEach((el, i) => {
        if (i === idx) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
      // Preload next slide opportunistically
      const nextIdx = (idx + 1) % slideEls.length;
      const preload = () => ensureLoaded(nextIdx);
      if ('requestIdleCallback' in window) {
        requestIdleCallback(preload, { timeout: 500 });
      } else {
        setTimeout(preload, 150);
      }
    }

    const startAutoplay = () => {
      stopAutoplay();
      autoplayId = setInterval(() => {
        current = (current + 1) % slideEls.length;
        show(current);
      }, 4000);
    };
    const stopAutoplay = () => { if (autoplayId) { clearInterval(autoplayId); autoplayId = null; } };
    startAutoplay();

    // Controls
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    // Dots (grouped by clinic/pharmacy)
    const getTypeFromSrc = (src) => {
      if (src.includes('/ain oulmene/')) return 'ain';
      if (src.includes('/bouira/')) return 'bouira';
      if (src.includes('/cherchcel/')) return 'cherchcel';
      if (src.includes('/pharmacie/')) return 'pharmacie';
      return 'other';
    };
    const typeToLabel = { ain: "Aïn Oulmène", bouira: 'Bouira', cherchcel: 'Cherchel', pharmacie: 'Pharmacie' };
    const groupOrder = ['ain','bouira','cherchcel','pharmacie'].filter(t => slides.some(s => getTypeFromSrc(s.imageSrc) === t));
    const firstIndexByType = {};
    groupOrder.forEach(t => {
      const idx = slides.findIndex(s => getTypeFromSrc(s.imageSrc) === t);
      if (idx >= 0) firstIndexByType[t] = idx;
    });

    const dotsRoot = document.getElementById('hero-dots');
    if (dotsRoot) {
      dotsRoot.innerHTML = '';
      groupOrder.forEach((t, gi) => {
        const dot = document.createElement('button');
        dot.className = 'hero-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', typeToLabel[t] || t);
        dot.setAttribute('data-type', t);
        dot.setAttribute('aria-selected', gi === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => {
          stopAutoplay();
          const targetIdx = firstIndexByType[t] ?? 0;
          current = targetIdx;
          show(current);
          updateDots();
          startAutoplay();
        });
        dotsRoot.appendChild(dot);
      });
    }

    const updateDots = () => {
      if (!dotsRoot) return;
      const dots = Array.from(dotsRoot.children);
      const curType = getTypeFromSrc(slides[current].imageSrc);
      dots.forEach(d => d.setAttribute('aria-selected', d.getAttribute('data-type') === curType ? 'true' : 'false'));
    };
    updateDots();

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoplay();
        current = (current - 1 + slideEls.length) % slideEls.length;
        show(current);
        updateDots();
        startAutoplay();
      });
      nextBtn.addEventListener('click', () => {
        stopAutoplay();
        current = (current + 1) % slideEls.length;
        show(current);
        updateDots();
        startAutoplay();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        stopAutoplay();
        current = (current - 1 + slideEls.length) % slideEls.length;
        show(current);
        updateDots();
        startAutoplay();
      } else if (e.key === 'ArrowRight') {
        stopAutoplay();
        current = (current + 1) % slideEls.length;
        show(current);
        updateDots();
        startAutoplay();
      }
    });

    // Touch swipe
    let touchStartX = 0;
    let touchEndX = 0;
    const threshold = 40;
    carouselRoot.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    carouselRoot.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) > threshold) {
        stopAutoplay();
        if (delta < 0) { current = (current + 1) % slideEls.length; } else { current = (current - 1 + slideEls.length) % slideEls.length; }
        show(current);
        updateDots();
        startAutoplay();
      }
    }, { passive: true });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    setTimeout(initCarousel, 100);
  }
})();

// Rendez-vous button behavior
(function(){
  const rdvBtn = document.querySelector('[data-rdv]');
  if (!rdvBtn) return;
  const phone = rdvBtn.getAttribute('data-phone') || '';
  const mail = rdvBtn.getAttribute('data-mail') || '';

  const isMobile = () => /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

  rdvBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isMobile() && phone) {
      window.location.href = `tel:${phone}`;
    } else if (mail) {
      const subject = encodeURIComponent('Prise de rendez-vous');
      const body = encodeURIComponent('Bonjour,\n\nJe souhaite prendre rendez-vous.\n\nMerci.');
      window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`;
    }
  });
})();