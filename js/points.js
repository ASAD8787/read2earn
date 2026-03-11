// ── POINTS / REWARDS ENGINE ────────────────────────────────
const POINTS_KEY = 'r2e_points';

function getPoints() {
  return parseInt(localStorage.getItem(POINTS_KEY) || '0', 10);
}

function awardPoints(amount, x, y) {
  const current = getPoints();
  const next = current + amount;
  localStorage.setItem(POINTS_KEY, next);
  showPointsPopup(amount, x, y);
  updateAllBalances(next);
  return next;
}

function showPointsPopup(amount, x = window.innerWidth / 2, y = window.innerHeight / 2) {
  const popup = document.createElement('div');
  popup.className = 'points-popup';
  popup.innerHTML = `🪙 +${amount} tokens`;
  popup.style.left = `${x - 60}px`;
  popup.style.top  = `${y - 30}px`;
  document.body.appendChild(popup);
  popup.addEventListener('animationend', () => popup.remove());
}

function updateAllBalances(value) {
  document.querySelectorAll('[data-balance]').forEach(el => {
    animateCount(el, parseInt(el.dataset.balance || '0', 10), value, 600);
    el.dataset.balance = value;
  });
}

function animateCount(el, from, to, duration) {
  const start = performance.now();
  const diff  = to - from;
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + diff * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

window.getPoints  = getPoints;
window.awardPoints = awardPoints;
window.animateCount = animateCount;
