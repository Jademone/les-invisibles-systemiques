/* Filtres + recherche pour la page /articles/
 * S'appuie sur des attributs data-category sur chaque .article-row
 * Pas de dépendance, vanilla JS.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var rows = Array.prototype.slice.call(document.querySelectorAll('.article-row'));
    var filterBtns = document.querySelectorAll('.filter-btn');
    var searchInput = document.getElementById('search-input');
    var emptyState = document.getElementById('empty-state');
    var resultCount = document.getElementById('result-count');

    if (!rows.length) return;

    var currentCategory = 'all';
    var currentQuery = '';

    function normalize(str) {
      return (str || '').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // retire les accents
    }

    function apply() {
      var shown = 0;
      var q = normalize(currentQuery.trim());

      rows.forEach(function (row) {
        var cat = (row.getAttribute('data-category') || '').toLowerCase();
        var text = normalize(row.textContent);
        var matchesCategory = currentCategory === 'all' || cat === currentCategory;
        var matchesQuery = !q || text.indexOf(q) !== -1;
        var visible = matchesCategory && matchesQuery;
        row.style.display = visible ? '' : 'none';
        if (visible) shown++;
      });

      if (emptyState) emptyState.style.display = shown === 0 ? 'block' : 'none';
      if (resultCount) {
        if (shown === rows.length && !q && currentCategory === 'all') {
          resultCount.textContent = rows.length + ' analyses publiées';
        } else {
          resultCount.textContent = shown + (shown > 1 ? ' résultats' : ' résultat');
        }
      }
    }

    // Boutons de filtre catégorie
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        currentCategory = (btn.getAttribute('data-filter') || 'all').toLowerCase();
        apply();
      });
    });

    // Recherche live (debounce léger)
    if (searchInput) {
      var timer = null;
      searchInput.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          currentQuery = searchInput.value;
          apply();
        }, 120);
      });

      // Echap pour vider
      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          searchInput.value = '';
          currentQuery = '';
          apply();
        }
      });
    }

    apply();
  });
})();
