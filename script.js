// Dark Mode Toggle
const darkToggleBtn = document.getElementById('darkModeToggle');
function setDarkMode(enabled) {
  document.body.classList.toggle('dark-mode', enabled);
  darkToggleBtn.setAttribute('aria-pressed', enabled);
  localStorage.setItem('typing_dark_mode', enabled);
}
darkToggleBtn.addEventListener('click', () => {
  setDarkMode(!document.body.classList.contains('dark-mode'));
  playClickSound();
});
window.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('typing_dark_mode') === 'true') setDarkMode(true);
});

// Page Transitions + Sound Effects
function fadeOutIn(url) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = '#000';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.6s ease';
  overlay.style.zIndex = 3000;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.style.opacity = '0.9');
  setTimeout(() => window.location.href = url, 600);
}
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
function playSound(frequency = 440, duration = 100) {
  if(audioCtx.state === 'suspended') audioCtx.resume();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  oscillator.type = 'square';
  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration / 1000);
  oscillator.stop(audioCtx.currentTime + duration / 1000);
}
function playClickSound() { playSound(660, 80); }

// Navigation logic
function openPage(url) {
  if(url) {
    playClickSound();
    fadeOutIn(url);
  }
}
document.querySelectorAll('.card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => openPage(card.dataset.target));
  card.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPage(card.dataset.target);
    }
  });
});
document.querySelectorAll('nav.menu-nav .menu-btn').forEach(btn => {
  btn.style.cursor = 'pointer';
  btn.addEventListener('click', () => openPage(btn.dataset.target));
  btn.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPage(btn.dataset.target);
    }
  });
});

// Magic click particle
document.addEventListener('click', e => {
  const particle = document.createElement('div');
  particle.classList.add('magic-particle');
  document.body.appendChild(particle);
  particle.style.left = (e.clientX - 8) + 'px';
  particle.style.top = (e.clientY - 8) + 'px';
  particle.addEventListener('animationend', () => particle.remove());
});

// Trailing particles
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

// Fevicol sticky cards effect
let draggedCard = null;
let stickTarget = null;
let connector = null;
function centerOf(el) {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width/2, y: rect.top + rect.height/2 };
}
function createConnector() {
  connector = document.createElement('div');
  connector.className = 'fevicol-connector';
  document.body.appendChild(connector);
}
function updateConnector(el1, el2) {
  const c1 = centerOf(el1), c2 = centerOf(el2);
  const dx = c2.x - c1.x, dy = c2.y - c1.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  connector.style.width = dist + 'px';
  connector.style.top = c1.y + 'px';
  connector.style.left = c1.x + 'px';
  connector.style.transform = `rotate(${angle}deg)`;
}
function removeConnector() {
  if(connector) {
    connector.remove();
    connector = null;
  }
}
document.querySelectorAll('.card[draggable="true"]').forEach(card => {
  card.addEventListener('dragstart', e => {
    draggedCard = card;
    card.classList.add('fevicol-sticky');
    createConnector();
  });
  card.addEventListener('dragend', e => {
    if(stickTarget) {
      stickTarget.classList.remove('fevicol-stick-target');
      stickTarget = null;
    }
    if(draggedCard) draggedCard.classList.remove('fevicol-sticky');
    draggedCard = null;
    removeConnector();
  });
  card.addEventListener('dragover', e => {
    e.preventDefault();
    if(!draggedCard || draggedCard === card) return;
    if(stickTarget && stickTarget !== card) {
      stickTarget.classList.remove('fevicol-stick-target');
    }
    stickTarget = card;
    stickTarget.classList.add('fevicol-stick-target');
    if(draggedCard) updateConnector(draggedCard, stickTarget);
  });
  card.addEventListener('dragleave', e => {
    if(stickTarget === card) {
      stickTarget.classList.remove('fevicol-stick-target');
      stickTarget = null;
      if(connector && draggedCard) updateConnector(draggedCard, draggedCard);
    }
  });
  card.addEventListener('drag', e => {
    if(!draggedCard || (e.clientX === 0 && e.clientY === 0)) return;
    if(stickTarget) updateConnector(draggedCard, stickTarget);
  });
});
