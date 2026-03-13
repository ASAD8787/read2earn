// ── DASHBOARD LOGIC ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('r2e_user') || 'null');
  const points = parseInt(localStorage.getItem('r2e_points') || '0', 10);

  // Redirect if not logged in
  if (!user) { location.href = 'auth.html'; return; }

  // Greet
  const greetEl = document.getElementById('dash-greet');
  if (greetEl) greetEl.textContent = `Welcome back, ${user.name.split(' ')[0]}! 👋`;

  // Animate balance counter
  const balEl = document.getElementById('wallet-balance');
  if (balEl) {
    balEl.dataset.balance = points;
    animateCount(balEl, 0, points, 1200);
  }

  // Stats
  const articlesRead  = parseInt(localStorage.getItem('r2e_articles_read') || '0', 10);
  const readMins      = parseInt(localStorage.getItem('r2e_read_mins') || '0', 10);
  const streak        = parseInt(localStorage.getItem('r2e_streak') || '1', 10);

  setEl('stat-articles', articlesRead);
  setEl('stat-time',     readMins + ' min');
  setEl('stat-streak',   streak + ' days');
  setEl('stat-tokens',   points.toLocaleString());

  // Activity feed
  const activities = JSON.parse(localStorage.getItem('r2e_activity') || 'null') || [
    { icon:'📖', title:'Read "The Future of AI"',        time:'2 mins ago',    pts:'+25' },
    { icon:'🎯', title:'Daily Streak Bonus',              time:'Today',         pts:'+15' },
    { icon:'📖', title:'Read "Crypto Market Analysis"',  time:'1 hour ago',    pts:'+30' },
    { icon:'🏆', title:'Joined KnowledgeCoin',                time:'Just now',      pts:'+50 Welcome!' },
  ];

  const feed = document.getElementById('activity-feed');
  if (feed) {
    feed.innerHTML = activities.map(a => `
      <div class="activity-item">
        <div class="activity-icon">${a.icon}</div>
        <div class="activity-info">
          <div class="ai-title">${a.title}</div>
          <div class="ai-time">${a.time}</div>
        </div>
        <div class="activity-pts">${a.pts}</div>
      </div>`).join('');
  }

  // Withdraw panel interactions
  const withdrawOpenBtn = document.getElementById('open-withdraw');
  const withdrawModal = document.getElementById('withdraw-modal');
  const withdrawCloseBtn = document.getElementById('withdraw-close-btn');
  const withdrawCloseBackdrop = document.getElementById('withdraw-close-backdrop');
  const withdrawBalance = document.getElementById('withdraw-balance');
  const withdrawUsd = document.getElementById('withdraw-usd');
  const withdrawNote = document.getElementById('withdraw-note');
  const withdrawRequest = document.getElementById('withdraw-request');

  function setWithdrawStats() {
    if (withdrawBalance) withdrawBalance.textContent = points.toLocaleString();
    if (withdrawUsd) withdrawUsd.textContent = '$' + (points * 0.001).toFixed(2);
    if (!withdrawNote) return;

    if (points >= 500) {
      withdrawNote.textContent = 'You are eligible. We will connect payout methods in the next update.';
      withdrawNote.classList.add('success');
    } else {
      const left = 500 - points;
      withdrawNote.textContent = `Minimum 500 tokens required. You need ${left.toLocaleString()} more tokens.`;
      withdrawNote.classList.remove('success');
    }
  }

  function openWithdrawPanel() {
    if (!withdrawModal) return;
    setWithdrawStats();
    withdrawModal.classList.add('open');
    withdrawModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeWithdrawPanel() {
    if (!withdrawModal) return;
    withdrawModal.classList.remove('open');
    withdrawModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (withdrawOpenBtn) withdrawOpenBtn.addEventListener('click', openWithdrawPanel);
  if (withdrawCloseBtn) withdrawCloseBtn.addEventListener('click', closeWithdrawPanel);
  if (withdrawCloseBackdrop) withdrawCloseBackdrop.addEventListener('click', closeWithdrawPanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeWithdrawPanel();
  });

  if (withdrawRequest) {
    withdrawRequest.addEventListener('click', () => {
      if (!withdrawNote) return;
      if (points >= 500) {
        withdrawNote.textContent = 'Request submitted. Payout processing feature will be enabled soon.';
        withdrawNote.classList.add('success');
      } else {
        const left = 500 - points;
        withdrawNote.textContent = `Not enough tokens yet. Read ${Math.ceil(left / 25)} more average articles to unlock withdraw.`;
        withdrawNote.classList.remove('success');
      }
    });
  }

  function setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
});
