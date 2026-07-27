// Web Audio API Sound Generator (No external MP3 files needed!)
class AudioController {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playPageTurn() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.18);
    }

    playFootstep() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }
}

const sfx = new AudioController();

// Dynamic Glowing Firefly Generator
function createFireflies() {
    const container = document.getElementById('firefly-container');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const fly = document.createElement('div');
        fly.className = 'firefly';
        fly.style.left = Math.random() * 100 + 'vw';
        fly.style.top = Math.random() * 100 + 'vh';
        fly.style.animationDelay = (Math.random() * 5) + 's';
        fly.style.animationDuration = (3 + Math.random() * 4) + 's';
        container.appendChild(fly);
    }
}

// Scroll Mechanics: Animate Ember Walking Legs & Trigger Footsteps
let lastScrollY = window.scrollY;
let isScrollingTimer = null;
let footstepInterval = null;

window.addEventListener('scroll', () => {
    const ember = document.getElementById('walker-ember');
    const scrollDelta = Math.abs(window.scrollY - lastScrollY);

    if (scrollDelta > 2) {
        if (ember && !ember.classList.contains('is-walking')) {
            ember.classList.add('is-walking');
            if (!footstepInterval) {
                footstepInterval = setInterval(() => sfx.playFootstep(), 220);
            }
        }

        clearTimeout(isScrollingTimer);
        isScrollingTimer = setTimeout(() => {
            if (ember) ember.classList.remove('is-walking');
            clearInterval(footstepInterval);
            footstepInterval = null;
        }, 150);
    }

    lastScrollY = window.scrollY;
});

// Reveal Storybook Parchment Pages with Page-Turn SFX as You Walk
const pageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (!entry.target.classList.contains('page-visible')) {
                entry.target.classList.add('page-visible');
                sfx.playPageTurn();
            }
        }
    });
}, { threshold: 0.2 });

document.addEventListener('DOMContentLoaded', () => {
    createFireflies();
    document.querySelectorAll('.storybook-scroll').forEach(scroll => {
        pageObserver.observe(scroll);
    });
});
