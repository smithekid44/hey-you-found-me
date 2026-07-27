// Web Audio API Sound Generator (Music & SFX without external MP3 files!)
class FairytaleAudioController {
    constructor() {
        this.ctx = null;
        this.isPlayingAmbient = false;
        this.ambientGain = null;
        this.ambientOscs = [];
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Gentle Ambient Forest Drone / Wind Chime Harmonies
    toggleAmbientMusic() {
        this.init();

        if (this.isPlayingAmbient) {
            this.stopAmbientMusic();
            return false;
        }

        // Master Gain for Music
        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 2);
        this.ambientGain.connect(this.ctx.destination);

        // Mystical Chord Frequencies (Fairytale Pentatonic Scale)
        const frequencies = [146.83, 220.00, 293.66, 440.00, 659.25]; // D3, A3, D4, A4, E5

        this.ambientOscs = frequencies.map((freq, i) => {
            const osc = this.ctx.createOscillator();
            const oscGain = this.ctx.createGain();
            
            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            // Subtle slow shimmer modulation
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.setValueAtTime(0.2 + i * 0.1, this.ctx.currentTime);
            lfoGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
            lfo.connect(oscGain.gain);
            lfo.start();

            oscGain.gain.setValueAtTime(0.03 / frequencies.length, this.ctx.currentTime);
            osc.connect(oscGain);
            oscGain.connect(this.ambientGain);
            osc.start();

            return osc;
        });

        this.isPlayingAmbient = true;
        return true;
    }

    stopAmbientMusic() {
        if (this.ambientGain) {
            this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
            setTimeout(() => {
                this.ambientOscs.forEach(osc => osc.stop());
                this.ambientOscs = [];
                this.isPlayingAmbient = false;
            }, 1000);
        }
    }

    playPageTurn() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
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
        osc.frequency.setValueAtTime(120, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }
}

const sfx = new FairytaleAudioController();

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

    // Audio Toggle Button Event Listener
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            const isPlaying = sfx.toggleAmbientMusic();
            if (isPlaying) {
                audioBtn.classList.add('playing');
                audioBtn.innerHTML = '🔊 Forest Music: On';
            } else {
                audioBtn.classList.remove('playing');
                audioBtn.innerHTML = '🔇 Forest Music: Off';
            }
        });
    }
});
