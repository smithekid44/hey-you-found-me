document.addEventListener('DOMContentLoaded', () => {
  const fireflyContainer = document.getElementById('fireflies');
  const ember = document.getElementById('ember-character');
  const emberStage = document.getElementById('ember-container');

  // Generate Floating Fireflies
  for (let i = 0; i < 25; i++) {
    const fly = document.createElement('div');
    fly.className = 'firefly';
    fly.style.left = Math.random() * 100 + 'vw';
    fly.style.top = Math.random() * 100 + 'vh';
    fly.style.animationDelay = Math.random() * 5 + 's';
    fly.style.animationDuration = (3 + Math.random() * 4) + 's';
    fireflyContainer.appendChild(fly);
  }

  // Interactive Ember Hover Effect
  const foundBtn = document.getElementById('found-btn');
  const meetBtn = document.getElementById('meet-btn');

  if (foundBtn) {
    foundBtn.addEventListener('mouseenter', () => {
      ember.classList.add('ember-walking');
      emberStage.style.transform = 'scale(1.08) translateY(-5px)';
    });
    foundBtn.addEventListener('mouseleave', () => {
      ember.classList.remove('ember-walking');
      emberStage.style.transform = 'none';
    });
  }

  if (meetBtn) {
    meetBtn.addEventListener('mouseenter', () => {
      ember.style.transform = 'rotate(-3deg)';
    });
    meetBtn.addEventListener('mouseleave', () => {
      ember.style.transform = 'none';
    });
  }
});
