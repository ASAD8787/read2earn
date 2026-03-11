// ── THEME TOGGLE ──────────────────────────────────────────
(function () {
  const STORAGE_KEY = 'r2e_theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Apply saved or default theme immediately
  const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
  applyTheme(saved);

  window.toggleTheme = toggleTheme;
  window.applyTheme  = applyTheme;
})();
