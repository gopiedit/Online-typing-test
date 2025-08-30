const darkToggleBtn = document.getElementById('darkModeToggle');
function setDarkMode(enabled) {
  document.body.classList.toggle('dark-mode', enabled);
  darkToggleBtn.setAttribute('aria-pressed', enabled);
  localStorage.setItem('typing_dark_mode', enabled);
}
darkToggleBtn.addEventListener('click', () => {
  setDarkMode(!document.body.classList.contains('dark-mode'));
});
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('typing_dark_mode') === 'true') setDarkMode(true);
});

// Card navigation
function openPage(url) { if(url) window.location.href = url; }
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => openPage(card.dataset.target));
  card.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPage(card.dataset.target);
    }
  });
});
document.querySelectorAll('nav.menu-nav .menu-btn').forEach(btn => {
  btn.addEventListener('click', () => openPage(btn.dataset.target));
  btn.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPage(btn.dataset.target);
    }
  });
});

// Magic particle
document.addEventListener('click', e => {
  const particle = document.createElement('div');
  particle.classList.add('magic-particle');
  document.body.appendChild(particle);
  particle.style.left = (e.clientX - 8) + 'px';
  particle.style.top = (e.clientY - 8) + 'px';
  particle.addEventListener('animationend', () => particle.remove());
});
let particlesArray = [];
const maxParticles = 30;
function createTrailParticle(x, y) {
  if(particlesArray.length >= maxParticles) return;
  const particle = document.createElement('div');
  particle.classList.add('trail-particle');
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  document.body.appendChild(particle);
  particle.addEventListener('animationend', () => {
    particle.remove();
    particlesArray = particlesArray.filter(p => p !== particle);
  });
  particlesArray.push(particle);
}
function throttle(fn, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if(now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}
const throttledCreateTrailParticle = throttle((x,y) => createTrailParticle(x,y), 20);
function onPointerMove(e) {
  let x,y;
  if(e.touches && e.touches.length > 0) {
    x = e.touches[0].clientX; y = e.touches[0].clientY;
  } else {
    x = e.clientX; y = e.clientY;
  }
  throttledCreateTrailParticle(x,y);
}
window.addEventListener('mousemove', onPointerMove);
window.addEventListener('touchmove', onPointerMove, { passive: true });
