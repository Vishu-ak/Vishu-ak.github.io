/* ============================================================
   VISHNU KUMAR A.K. — ULTIMATE PORTFOLIO V2 — APP.JS
   Particles · Typing · GSAP · Counters · Filters · Cursor · Heatmap
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // THEME TOGGLE
  // ============================================================
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const html = document.documentElement;
  let currentTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  html.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', currentTheme);
      themeToggle.setAttribute('aria-label', `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`);
    });
  }

  // ============================================================
  // CUSTOM CURSOR
  // ============================================================
  const cursorEl = document.querySelector('.custom-cursor');
  if (cursorEl && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const dot = cursorEl.querySelector('.cursor-dot');
    const ring = cursorEl.querySelector('.cursor-ring');
    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    function animateRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover detection for interactive elements
    const interactiveSelectors = 'a, button, [role="button"], .project-card, .filter-btn, .contact-card, .education-card, input, textarea, select';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursorEl.classList.add('hovering');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursorEl.classList.remove('hovering');
      }
    });
  }

  // ============================================================
  // PARTICLE SYSTEM
  // ============================================================
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };
    let animFrameId;

    function resizeCanvas() {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        if (mouse.x != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
          }
        }

        // Boundary wrap
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.15;
            ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      animFrameId = requestAnimationFrame(animateParticles);
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animFrameId);
      resizeCanvas();
      initParticles();
      animateParticles();
    });

    resizeCanvas();
    initParticles();
    animateParticles();
  }

  // ============================================================
  // TERMINAL TYPING EFFECT
  // ============================================================
  function initTyping() {
    const terminalBody = document.getElementById('terminalBody');
    if (!terminalBody) return;

    const elements = terminalBody.querySelectorAll('[data-delay]');
    let currentIndex = 0;

    function typeElement(el) {
      const span = el.querySelector('[data-text]') || el.querySelector('.terminal__command');
      if (!span) {
        el.classList.add('visible');
        currentIndex++;
        if (currentIndex < elements.length) {
          setTimeout(() => typeElement(elements[currentIndex]), 300);
        }
        return;
      }

      const text = span.getAttribute('data-text') || '';
      el.classList.add('visible');
      let charIndex = 0;

      function typeChar() {
        if (charIndex <= text.length) {
          span.textContent = text.substring(0, charIndex);
          charIndex++;
          const delay = el.classList.contains('terminal__output') ? 15 : 40;
          setTimeout(typeChar, delay);
        } else {
          currentIndex++;
          if (currentIndex < elements.length) {
            setTimeout(() => typeElement(elements[currentIndex]), 400);
          }
        }
      }

      setTimeout(typeChar, 100);
    }

    // Start after a delay
    setTimeout(() => {
      if (elements.length > 0) {
        typeElement(elements[0]);
      }
    }, 1200);
  }

  initTyping();

  // ============================================================
  // SCROLL PROGRESS BAR
  // ============================================================
  const progressBar = document.querySelector('.scroll-progress__bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    }, { passive: true });
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  // Scroll-aware header
  const header = document.getElementById('header');
  let lastScroll = 0;
  if (header) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 100) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      if (currentScroll > lastScroll && currentScroll > 400) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // Active section highlighting
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // Mobile hamburger menu
  const hamburger = document.getElementById('navHamburger');
  const navLinksEl = document.getElementById('navLinks');
  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !expanded);
      navLinksEl.classList.toggle('open');
    });
    // Close on link click
    navLinksEl.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        navLinksEl.classList.remove('open');
      });
    });
  }

  // ============================================================
  // BACK TO TOP
  // ============================================================
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // PROJECT FILTERING
  // ============================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const categories = card.dataset.category || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ============================================================
  // GITHUB CONTRIBUTION HEATMAP
  // ============================================================
  function generateHeatmap() {
    const container = document.getElementById('heatmap');
    if (!container) return;

    // Generate ~52 weeks of data (364 days)
    const totalDays = 364;
    const fragment = document.createDocumentFragment();

    // Seed-based pseudo-random for consistent patterns
    let seed = 42;
    function seededRandom() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }

    for (let i = 0; i < totalDays; i++) {
      const cell = document.createElement('div');
      cell.className = 'heatmap__cell';

      // Create realistic activity pattern
      const dayOfWeek = i % 7;
      const weekNum = Math.floor(i / 7);
      let r = seededRandom();

      // Higher activity on weekdays
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        r *= 1.5;
      }

      // Burst periods (simulate project deadlines)
      if ((weekNum >= 10 && weekNum < 16) || (weekNum >= 28 && weekNum < 35) || (weekNum >= 42 && weekNum < 48)) {
        r *= 1.8;
      }

      let level = 0;
      if (r > 0.85) level = 4;
      else if (r > 0.65) level = 3;
      else if (r > 0.4) level = 2;
      else if (r > 0.2) level = 1;

      cell.setAttribute('data-level', level);
      fragment.appendChild(cell);
    }

    container.appendChild(fragment);
  }

  generateHeatmap();

  // ============================================================
  // COUNTER ANIMATION
  // ============================================================
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals) || 0;
    const duration = 1500;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      el.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = decimals > 0 ? target.toFixed(decimals) : target;
      }
    }

    requestAnimationFrame(step);
  }

  // ============================================================
  // GSAP ANIMATIONS (wait for GSAP to load)
  // ============================================================
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(initGSAP, 100);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- Hero entrance ---
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero__greeting', { opacity: 0, y: 20, duration: 0.6 }, 0.2)
      .from('.hero__name', { opacity: 0, y: 30, duration: 0.8 }, 0.4)
      .from('.hero__tagline', { opacity: 0, y: 20, duration: 0.6 }, 0.7)
      .from('.hero__subtitle', { opacity: 0, y: 20, duration: 0.6 }, 0.9)
      .from('.hero__cta', { opacity: 0, y: 20, duration: 0.6 }, 1.1)
      .from('.hero__stats', { opacity: 0, y: 20, duration: 0.6 }, 1.3)
      .from('.terminal', { opacity: 0, x: 40, duration: 0.8 }, 0.6);

    // Animate hero stat counters
    document.querySelectorAll('.hero__stat-number[data-count]').forEach(el => {
      animateCounter(el);
    });

    // --- Section headers ---
    document.querySelectorAll('[data-animate="header"]').forEach(header => {
      const label = header.querySelector('.section__label');
      const title = header.querySelector('.section__title');

      gsap.to([label, title], {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          once: true,
        }
      });
    });

    // --- Fade up elements ---
    document.querySelectorAll('[data-animate="fade-up"]').forEach(el => {
      const delay = parseFloat(el.dataset.animateDelay) || 0;
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        }
      });
    });

    // --- Timeline items ---
    document.querySelectorAll('[data-animate="timeline"]').forEach(item => {
      const card = item.querySelector('.timeline__card');
      gsap.to(card, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          once: true,
        }
      });
    });

    // --- Timeline line fill ---
    const timelineLine = document.querySelector('.timeline__line-fill');
    if (timelineLine) {
      gsap.to(timelineLine, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        }
      });
    }

    // --- Project cards staggered entrance ---
    const projectGrid = document.getElementById('projectGrid');
    if (projectGrid) {
      const cards = projectGrid.querySelectorAll('[data-animate="project"]');
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: projectGrid,
          start: 'top 80%',
          once: true,
        }
      });
    }

    // --- Skill bars fill on scroll ---
    document.querySelectorAll('.skill-bar__fill').forEach(bar => {
      const width = bar.dataset.width;
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          bar.style.width = width + '%';
        }
      });
    });

    // --- Stat counters ---
    document.querySelectorAll('[data-animate="counter"]').forEach(item => {
      const numEl = item.querySelector('[data-count]');
      if (numEl) {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            animateCounter(numEl);
          }
        });
      }
    });

    // --- Timeline marker dots glow ---
    document.querySelectorAll('.timeline__marker-dot').forEach(dot => {
      ScrollTrigger.create({
        trigger: dot,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.from(dot, {
            scale: 0,
            duration: 0.4,
            ease: 'back.out(2)',
          });
        }
      });
    });
  }

  // Wait for DOM and GSAP
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAP);
  } else {
    initGSAP();
  }

})();
