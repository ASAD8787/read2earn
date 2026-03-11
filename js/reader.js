// ── READER PAGE LOGIC ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // ── Reading Progress Bar ──
  const progressBar = document.getElementById('reading-progress-bar');
  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
    progressBar.style.width = pct + '%';
    if (pct >= 90) rewardReading();
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  // ── Timer ──
  let seconds = 0;
  let rewarded = false;
  const REWARD_AT = 60; // seconds
  const TOKEN_REWARD = 25;
  const timerEl = document.getElementById('read-timer');

  setInterval(() => {
    seconds++;
    if (timerEl) {
      const m = String(Math.floor(seconds / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
    }
    if (seconds === REWARD_AT && !rewarded) rewardReading();
  }, 1000);

  // ── Reward ──
  function rewardReading() {
    if (rewarded) return;
    rewarded = true;
    const rect = (timerEl || document.body).getBoundingClientRect();
    awardPoints(TOKEN_REWARD, window.innerWidth / 2, window.innerHeight / 2);
    const banner = document.getElementById('reward-banner');
    if (banner) { banner.classList.remove('hidden'); setTimeout(() => banner.classList.add('hidden'), 4000); }
  }

  // ── Article data from URL param ──
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (id) {
    const articles = JSON.parse(localStorage.getItem('r2e_articles') || '[]');
    const art = articles.find(a => a.id === id);
    if (art) {
      const titleEl = document.getElementById('article-title');
      const imgEl   = document.getElementById('article-img');
      const metaEl  = document.getElementById('article-meta');
      if (titleEl) titleEl.textContent = art.title;
      if (imgEl)   imgEl.src = art.img;
      if (metaEl)  metaEl.innerHTML = `<span>📂 ${art.category}</span><span>⏱ ${art.readTime} min read</span><span>🪙 Earn ${art.reward} tokens</span>`;
    }
  }
});
