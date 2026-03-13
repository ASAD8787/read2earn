/* UI enhancements: optional interactions layered on top of existing behavior. */
(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  const initNavScrollState = () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const setState = () => {
      if (window.scrollY > 10) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };

    setState();
    window.addEventListener('scroll', setState, { passive: true });
  };

  const initRevealOnScroll = () => {
    const targets = document.querySelectorAll(
      '.hero-content > *, .section .section-title, .section .section-subtitle, .glass-card, .article-card, .dash-stat-card, .activity-item, .auth-box'
    );
    if (!targets.length) return;

    targets.forEach((el, idx) => {
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      const delay = Math.min((idx % 5) + 1, 4);
      el.classList.add(`reveal-delay-${delay}`);
    });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  };

  const initButtonRipple = () => {
    const buttons = document.querySelectorAll('.btn');
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        if (prefersReducedMotion) return;

        const rect = btn.getBoundingClientRect();
        const circle = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        circle.className = 'btn-ripple-el';
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.left = `${ev.clientX - rect.left - size / 2}px`;
        circle.style.top = `${ev.clientY - rect.top - size / 2}px`;

        btn.appendChild(circle);
        circle.addEventListener('animationend', () => circle.remove(), { once: true });
      });
    });
  };

  const initCardTilt = () => {
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll('.article-card, .glass-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (ev) => {
        const r = card.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width;
        const py = (ev.clientY - r.top) / r.height;
        const rx = (0.5 - py) * 4;
        const ry = (px - 0.5) * 5;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  };

  const initMobileMenuAnimation = () => {
    const burger = document.querySelector('.hamburger');
    if (!burger) return;

    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
    });
  };

  onReady(() => {
    initNavScrollState();
    initRevealOnScroll();
    initButtonRipple();
    initCardTilt();
    initMobileMenuAnimation();
  });
})();
