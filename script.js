// Web Audio API Sound Generator: Sleepy Lullaby & Gentle Crickets
class FairytaleAudioController {
    constructor() {
        this.ctx = null;
        this.isPlayingAmbient = false;
        this.ambientGain = null;
        this.lullabyTimer = null;
        this.cricketTimer = null;
        this.lullabyIndex = 0;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Toggle Music & Night Ambience
    toggleAmbientMusic() {
        this.init();

        if (this.isPlayingAmbient) {
            this.stopAmbientMusic();
            return false;
        }

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 1.5);
        this.ambientGain.connect(this.ctx.destination);

        this.isPlayingAmbient = true;
        this.startCrickets();
        this.startSleepyLullaby();
        return true;
    }

    stopAmbientMusic() {
        if (this.ambientGain) {
            this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
            setTimeout(() => {
                if (this.lullabyTimer) clearInterval(this.lullabyTimer);
                if (this.cricketTimer) clearInterval(this.cricketTimer);
                this.isPlayingAmbient = false;
            }, 1000);
        }
    }

    // Soft Crickets Chirping
    startCrickets() {
        const playCricketChirp = () => {
            if (!this.isPlayingAmbient) return;
            
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            // High soft cricket frequency
            osc.type = 'sine';
            osc.frequency.setValueAtTime(4500 + Math.random() * 200, now);

            // Subtle triple chirp envelope
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.008, now + 0.02);
            gain.gain.linearRampToValueAtTime(0, now + 0.04);
            gain.gain.linearRampToValueAtTime(0.008, now + 0.06);
            gain.gain.linearRampToValueAtTime(0, now + 0.08);

            osc.connect(gain);
            gain.connect(this.ambientGain);

            osc.start(now);
            osc.stop(now + 0.1);
        };

        // Randomly chirp every few seconds
        this.cricketTimer = setInterval(() => {
            if (Math.random() > 0.3) {
                playCricketChirp();
            }
        }, 1200);
    }

    // Gentle Music Box Sleepy Lullaby
    startSleepyLullaby() {
        // Soft Lullaby Frequencies (C Major / A Minor Pentatonic Bell Tones)
        const lullabyNotes = [
            523.25, 587.33, 659.25, 783.99, 880.00, // C5, D5, E5, G5, A5
            659.25, 523.25, 392.00, 440.00, 523.25
        ];

        const playBellNote = (freq) => {
            if (!this.isPlayingAmbient) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // Music-box style decay
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

            osc.connect(gain);
            gain.connect(this.ambientGain);

            osc.start(now);
            osc.stop(now + 2.3);
        };

        this.lullabyIndex = 0;
        this.lullabyTimer = setInterval(() => {
            const note = lullabyNotes[this.lullabyIndex % lullabyNotes.length];
            playBellNote(note);
            this.lullabyIndex++;
        }, 1600); // Slow, soothing rhythm
    }

    // Very Subtle Soft Page Turn
    playPageTurn() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }

    // Soft Organic Grass Step
    playFootstep() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.06);

        gain.gain.setValueAtTime(0.015, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
    }
}

const sfx = new FairytaleAudioController();

// Dynamic Glowing Fireflies Generator
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

// Scroll Mechanics: Animate Ember Walking Legs & Footstep Rustles
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
                footstepInterval = setInterval(() => sfx.playFootstep(), 260);
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

// Reveal Storybook Scrolls on Scroll
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

    // Toggle Music Button Listener
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            const isPlaying = sfx.toggleAmbientMusic();
            if (isPlaying) {
                audioBtn.classList.add('playing');
                audioBtn.innerHTML = '🌙 Lullaby & Crickets: On';
            } else {
                audioBtn.classList.remove('playing');
                audioBtn.innerHTML = '🔇 Lullaby & Crickets: Off';
            }
        });
    }
});
