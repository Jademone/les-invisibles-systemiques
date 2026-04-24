/* Les Invisibles Systémiques, assets/site.js
 * Gère : dark mode, animations scroll, chiffres animés, menu mobile.
 * Le thème initial est appliqué par un script inline dans le <head> pour éviter le flash.
 */
(function () {
  'use strict';

  /* ==== DARK MODE ==== */
  var html = document.documentElement;
  var STORAGE_KEY = 'lis-theme';

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    var buttons = document.querySelectorAll('.theme-toggle');
    buttons.forEach(function (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });
  }

  function toggleTheme() {
    var current = html.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Branche les boutons de bascule (un dans la nav, un dans le menu mobile)
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        toggleTheme();
      });
    });
    // Synchronise l'état initial des boutons
    setTheme(html.getAttribute('data-theme') || 'light');
  });

  /* ==== MENU MOBILE ==== */
  document.addEventListener('DOMContentLoaded', function () {
    var burger = document.getElementById('burger');
    var menu = document.getElementById('mobile-menu');
    if (!burger || !menu) return;
    burger.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('open');
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  });

  /* ==== ANIMATIONS AU SCROLL ==== */
  document.addEventListener('DOMContentLoaded', function () {
    if (!('IntersectionObserver' in window)) return;

    // Anime l'apparition des éléments marqués .reveal
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObs.observe(el);
    });

    /* ==== CHIFFRES ANIMÉS (count-up) ==== */
    var numberObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) return;
        var duration = 1400;
        var start = performance.now();
        var startVal = 0;

        function step(now) {
          var progress = Math.min((now - start) / duration, 1);
          // easeOutExpo pour un final doux
          var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          var value = Math.round(startVal + (target - startVal) * eased);
          el.textContent = value;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        numberObs.unobserve(el);
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('[data-count]').forEach(function (el) {
      numberObs.observe(el);
    });
  });

  /* ==== BARRE DE PROGRESSION LECTURE (articles uniquement) ==== */
  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.getElementById('read-progress');
    var article = document.querySelector('.article-body');
    if (!bar || !article) return;

    function update() {
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var scrolled = -rect.top;
      var pct = Math.max(0, Math.min(1, scrolled / total));
      bar.style.transform = 'scaleX(' + pct + ')';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

})();
