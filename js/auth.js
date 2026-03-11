// ── AUTH LOGIC ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const loginTab   = document.getElementById('login-tab');
  const signupTab  = document.getElementById('signup-tab');
  const loginForm  = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  // Tab switching
  function switchTab(tab) {
    const isLogin = tab === 'login';
    loginTab.classList.toggle('active', isLogin);
    signupTab.classList.toggle('active', !isLogin);
    loginForm.classList.toggle('hidden', !isLogin);
    signupForm.classList.toggle('hidden', isLogin);
  }
  if (loginTab)  loginTab.addEventListener('click',  () => switchTab('login'));
  if (signupTab) signupTab.addEventListener('click',  () => switchTab('signup'));

  // Helpers
  function showErr(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
  }
  function clearErrs(...ids) { ids.forEach(id => { const el = document.getElementById(id); if(el) el.classList.remove('show'); }); }
  function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  // ── LOGIN ──
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      clearErrs('login-email-err', 'login-pass-err', 'login-general-err');
      const email = document.getElementById('login-email').value.trim();
      const pass  = document.getElementById('login-pass').value;
      let valid = true;
      if (!isValidEmail(email)) { showErr('login-email-err', 'Enter a valid email'); valid = false; }
      if (pass.length < 6)       { showErr('login-pass-err', 'Password must be 6+ characters'); valid = false; }
      if (!valid) return;

      // Check stored users
      const users = JSON.parse(localStorage.getItem('r2e_users') || '[]');
      const user  = users.find(u => u.email === email && u.password === pass);
      if (!user) { showErr('login-general-err', 'Invalid email or password'); return; }

      localStorage.setItem('r2e_user', JSON.stringify(user));
      location.href = 'dashboard.html';
    });
  }

  // ── SIGN UP ──
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      clearErrs('signup-name-err','signup-email-err','signup-pass-err','signup-confirm-err','signup-general-err');
      const name    = document.getElementById('signup-name').value.trim();
      const email   = document.getElementById('signup-email').value.trim();
      const pass    = document.getElementById('signup-pass').value;
      const confirm = document.getElementById('signup-confirm').value;
      let valid = true;
      if (!name)                 { showErr('signup-name-err', 'Name is required'); valid = false; }
      if (!isValidEmail(email))  { showErr('signup-email-err', 'Enter a valid email'); valid = false; }
      if (pass.length < 6)       { showErr('signup-pass-err', 'Password must be 6+ characters'); valid = false; }
      if (pass !== confirm)      { showErr('signup-confirm-err', "Passwords don't match"); valid = false; }
      if (!valid) return;

      const users = JSON.parse(localStorage.getItem('r2e_users') || '[]');
      if (users.find(u => u.email === email)) { showErr('signup-general-err', 'Email already registered'); return; }

      const newUser = { name, email, password: pass, joinedAt: Date.now(), points: 0 };
      users.push(newUser);
      localStorage.setItem('r2e_users', JSON.stringify(users));
      localStorage.setItem('r2e_user', JSON.stringify(newUser));
      location.href = 'dashboard.html';
    });
  }
});
