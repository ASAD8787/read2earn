// ── SHARED NAV LOGIC ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  // Active link highlight
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.includes(path)) a.classList.add('active');
  });

  // Show/hide dashboard link based on login state
  const user = JSON.parse(localStorage.getItem('r2e_user') || 'null');
  const dashLink  = document.getElementById('nav-dashboard');
  const loginLink = document.getElementById('nav-login');
  const logoutBtn = document.getElementById('nav-logout');
  const navUser   = document.getElementById('nav-user');

  if (user) {
    if (dashLink)  dashLink.style.display  = '';
    if (loginLink) loginLink.style.display  = 'none';
    if (logoutBtn) logoutBtn.style.display  = '';
    if (navUser)   navUser.textContent = `👤 ${user.name.split(' ')[0]}`;
  } else {
    if (dashLink)  dashLink.style.display  = 'none';
    if (logoutBtn) logoutBtn.style.display  = 'none';
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('r2e_user');
      location.href = 'index.html';
    });
  }
});
