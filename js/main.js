/* ============================================================
   INSIDERS MEDIA — MAIN JAVASCRIPT
   ============================================================ */

(function () {
  'use strict';

  // ── NAV SCROLL EFFECT ──────────────────────────────────────
  const nav = document.getElementById('main-nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── MOBILE HAMBURGER ──────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });
  }

  // ── ACTIVE NAV LINK ──────────────────────────────────────
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a:not(.nav__cta)').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── INTERSECTION OBSERVER: FADE-UP ───────────────────────
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ── ANIMATED COUNTERS ────────────────────────────────────
  function animateCounter(el) {
    const raw = el.dataset.counter;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const target = parseFloat(raw);
    const isFloat = raw.includes('.');
    const decimals = isFloat ? (raw.split('.')[1] || '').length : 0;
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;
      el.textContent = prefix + (decimals > 0 ? val.toFixed(decimals) : Math.round(val)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));
  }

  // ── TICKER DUPLICATION (tech + testimonials) ─────────────
  const tickerTrack = document.getElementById('ticker-track');
  if (tickerTrack) {
    tickerTrack.innerHTML += tickerTrack.innerHTML;
  }
  const testimonialsTicker = document.getElementById('testimonials-ticker');
  if (testimonialsTicker) {
    testimonialsTicker.innerHTML += testimonialsTicker.innerHTML;
  }

  // ── SMOOTH SCROLL ANCHORS ────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const navH = nav ? nav.offsetHeight : 0;
        const y = target.getBoundingClientRect().top + window.pageYOffset - navH - 16;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ── PILLAR CARD ICON EMOJI SWAP ON HOVER ─────────────────
  document.querySelectorAll('.pillar-card').forEach(card => {
    const icon = card.querySelector('.pillar-card__icon');
    if (!icon) return;
    const original = icon.textContent;
    const hover = icon.dataset.hover;
    if (!hover) return;
    card.addEventListener('mouseenter', () => { icon.textContent = hover; });
    card.addEventListener('mouseleave', () => { icon.textContent = original; });
  });

  // ── 3D CARD TILT ON MOUSE MOVE ───────────────────────────
  const tiltTargets = document.querySelectorAll(
    '.pillar-card, .tcard, .expertise-card, .stat-box, .service-card'
  );
  tiltTargets.forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) *  5;
      this.style.transform    = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
      this.style.transition   = 'transform 0.08s ease';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform  = '';
      this.style.transition = 'transform 0.55s ease';
      setTimeout(() => { this.style.transition = ''; }, 560);
    });
  });

  // ── HERO METRICS COUNTER TICK (live-feel) ────────────────
  const metricEls = document.querySelectorAll('[data-tick]');
  metricEls.forEach(el => {
    const base = parseInt(el.dataset.tick, 10);
    setInterval(() => {
      const delta = Math.floor(Math.random() * 3);
      el.dataset.tick = base + delta;
      el.textContent  = (base + delta).toLocaleString();
    }, 3200 + Math.random() * 2000);
  });

  // ── TESTIMONIAL SLIDER ───────────────────────────────────
  const tTrack = document.getElementById('testimonial-track');
  const tPrev = document.getElementById('slider-prev');
  const tNext = document.getElementById('slider-next');
  if (tTrack && tPrev && tNext) {
    let currentIndex = 0;
    let autoSlideInterval;

    const updateSlider = () => {
      const cards = tTrack.querySelectorAll('.slide-card');
      if (!cards.length) return;
      const cardWidth = cards[0].offsetWidth;
      const margin = 24; // 12px left + 12px right
      tTrack.style.transform = `translateX(-${currentIndex * (cardWidth + margin)}px)`;
    };

    const nextSlide = () => {
      const cards = tTrack.querySelectorAll('.slide-card');
      const visibleCards = window.innerWidth <= 800 ? 1 : 2;
      if (currentIndex < cards.length - visibleCards) {
        currentIndex++;
      } else {
        currentIndex = 0; // Loop back to start
      }
      updateSlider();
    };

    const prevSlide = () => {
      const cards = tTrack.querySelectorAll('.slide-card');
      const visibleCards = window.innerWidth <= 800 ? 1 : 2;
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = Math.max(0, cards.length - visibleCards); // Loop to end
      }
      updateSlider();
    };

    tNext.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
    tPrev.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
    window.addEventListener('resize', updateSlider);
    setTimeout(updateSlider, 150);

    // Auto-slide logic
    const startAutoSlide = () => {
      autoSlideInterval = setInterval(nextSlide, 3500); // Slide every 3.5 seconds
    };
    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    };

    // Pause on hover so users can read comfortably
    tTrack.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    tTrack.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();
  }

})();
