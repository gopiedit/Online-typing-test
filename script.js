// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Animation for cards on scroll
const cards = document.querySelectorAll('.card');

function checkScroll() {
    cards.forEach(card => {
        const cardPosition = card.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (cardPosition < screenPosition) {
            card.classList.add('show');
        }
    });
}

window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);

// Animated stats counter
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        obj.innerHTML = id === 'stat4' ? value + '%' : value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Start counter animation when stats section is in view
const statsSection = document.querySelector('.stats');
let statsAnimated = false;
function checkStats() {
    const statsPosition = statsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;

    if (statsPosition < screenPosition && !statsAnimated) {
        animateValue('stat1', 0, 12500, 2000);
        animateValue('stat2', 0, 3820000, 2500);
        animateValue('stat3', 0, 98500, 2200);
        animateValue('stat4', 0, 92, 1800);
        statsAnimated = true;
    }
}
window.addEventListener('scroll', checkStats);
window.addEventListener('load', checkStats);

// Typing animation effect
const typingText = "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet, making it perfect for typing practice.";
let i = 0;
const speed = 50;
function typeWriter() {
    if (i < typingText.length) {
        document.querySelector(".typing-demo p").innerHTML = typingText.substring(0, i + 1) + '<span class="cursor"></span>';
        i++;
        setTimeout(typeWriter, speed);
    } else {
        // Restart animation after a delay
        setTimeout(() => {
            i = 0;
            typeWriter();
        }, 3000);
    }
}
// Start typing animation
setTimeout(typeWriter, 1000);
