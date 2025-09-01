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
    initTestimonialAnimation();
    initTypingAnimation();
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
    card.addEventListener('click', () => {
        const target = card.querySelector('.card-button').textContent.toLowerCase().replace(/\s+/g, '-');
        openPage(target + '.html');
    });
});

document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.textContent.toLowerCase().replace(/\s+/g, '-');
        openPage(target + '.html');
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
    const animatedElements = document.querySelectorAll('.card, .feature');
    
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.animationDelay = `${index * 0.1}s`;
    });
}

// Testimonial animation
function initTestimonialAnimation() {
    const testimonials = document.querySelectorAll('.testimonial');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    
    testimonials.forEach(testimonial => {
        observer.observe(testimonial);
    });
}

// Typing animation
function initTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const texts = ['Online Typing Practice', 'Typing Speed', 'Accuracy', 'Productivity'];
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
    
    setTimeout(type, 1000);
}

// CTA button animation
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('mouseover', () => {
        ctaButton.style.transform = 'translateY(-3px)';
        ctaButton.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
    });
    
    ctaButton.addEventListener('mouseout', () => {
        ctaButton.style.transform = 'translateY(0)';
        ctaButton.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
    });
}
