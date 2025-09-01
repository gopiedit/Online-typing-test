// Dark Mode Toggle
const darkToggleBtn = document.getElementById('darkModeToggle');

function setDarkMode(enabled) {
  document.body.classList.toggle('dark-mode', enabled);
  darkToggleBtn.setAttribute('aria-pressed', enabled);
  darkToggleBtn.innerHTML = enabled ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  localStorage.setItem('typing_dark_mode', enabled);
}

darkToggleBtn.addEventListener('click', () => {
  setDarkMode(!document.body.classList.contains('dark-mode'));
});

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('typing_dark_mode') === 'true') setDarkMode(true);
  
  // Initialize animations
  initAnimations();
  initStatsCounter();
});

// Card navigation
function openPage(url) { 
  if (url) {
    // Add page transition effect
    document.body.style.opacity = '0';
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  }
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => openPage(card.dataset.target));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPage(card.dataset.target);
    }
  });
});

document.querySelectorAll('nav.menu-nav .menu-btn').forEach(btn => {
  btn.addEventListener('click', () => openPage(btn.dataset.target));
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPage(btn.dataset.target);
    }
  });
});

// Magic particle effect
document.addEventListener('click', e => {
  const particle = document.createElement('div');
  particle.classList.add('magic-particle');
  document.body.appendChild(particle);
  particle.style.left = (e.clientX - 8) + 'px';
  particle.style.top = (e.clientY - 8) + 'px';
  particle.addEventListener('animationend', () => particle.remove());
});

// Mouse trail effect
let particlesArray = [];
const maxParticles = 30;

function createTrailParticle(x, y) {
  if (particlesArray.length >= maxParticles) return;
  
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
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

const throttledCreateTrailParticle = throttle((x, y) => createTrailParticle(x, y), 20);

function onPointerMove(e) {
  let x, y;
  if (e.touches && e.touches.length > 0) {
    x = e.touches[0].clientX; 
    y = e.touches[0].clientY;
  } else {
    x = e.clientX; 
    y = e.clientY;
  }
  throttledCreateTrailParticle(x, y);
}

window.addEventListener('mousemove', onPointerMove);
window.addEventListener('touchmove', onPointerMove, { passive: true });

// Initialize animations
function initAnimations() {
  const animatedElements = document.querySelectorAll('.card, .feature, .stat');
  
  animatedElements.forEach((el, index) => {
    el.classList.add('fade-in');
    el.classList.add(`delay-${index % 3}`);
  });
}

// Animated stats counter
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target, 0, entry.target.getAttribute('data-count'), 1500);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statElements.forEach(el => observer.observe(el));
}

function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Text typing animation
const typingText = document.querySelector('.typing-text');
const texts = ['Typing Skills', 'Speed', 'Accuracy', 'Productivity'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function type() {
  const currentText = texts[textIndex];
  
  if (isDeleting) {
    typingText.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    typingDelay = 50;
  } else {
    typingText.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    typingDelay = 100;
  }
  
  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    typingDelay = 1000;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
    typingDelay = 500;
  }
  
  setTimeout(type, typingDelay);
}

// Start typing animation after page loads
window.addEventListener('load', () => {
  if (typingText) {
    setTimeout(type, 1000);
  }
});
