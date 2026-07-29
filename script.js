document.addEventListener('DOMContentLoaded', () => {
  const fireflyContainer = document.getElementById('fireflies');
  const ember = document.getElementById('ember-character');
  const emberStage = document.getElementById('ember-container');
  const pawContainer = document.getElementById('paw-container');

  // 1. Generate Floating Fireflies
  for (let i = 0; i < 30; i++) {
    const fly = document.createElement('div');
    fly.className = 'firefly';
    fly.style.left = Math.random() * 100 + 'vw';
    fly.style.top = Math.random() * 100 + 'vh';
    fly.style.animationDelay = Math.random() * 5 + 's';
    fly.style.animationDuration = (3 + Math.random() * 4) + 's';
    fireflyContainer.appendChild(fly);
  }

  // 2. Ember Entrance Sequence
  // On page load, Ember walks in from the left and then enters breathing/idle mode
  if (ember) {
    ember.classList.add('ember-entering', 'ember-walking');

    setTimeout(() => {
      ember.classList.remove('ember-entering', 'ember-walking');
      ember.classList.add('ember-idle');
    }, 2200);
  }

  // Helper Function: Spawn Glowing Paw Prints
  function spawnPawPrint(offsetPixels) {
    if (!pawContainer) return;
    const paw = document.createElement('span');
    paw.className = 'paw-print';
    paw.innerHTML = '🐾';
    paw.style.left = `calc(50% + ${offsetPixels}px)`;
    pawContainer.appendChild(paw);

    setTimeout(() => {
      paw.remove();
    }, 1800);
  }

  // 3. Interactive Button Actions
  const foundBtn = document.getElementById('found-btn');
  const meetBtn = document.getElementById('meet-btn');

  if (foundBtn) {
    let pawInterval;
    foundBtn.addEventListener('mouseenter', () => {
      if (ember) {
        ember.classList.remove('ember-idle');
        ember.classList.add('ember-walking');
      }
      if (emberStage) {
        emberStage.style.transform = 'scale(1.06) translateY(-4px)';
      }

      // Drop glowing paw prints while hovering over the "I Found Ember" button
      let offset = -30;
      pawInterval = setInterval(() => {
        spawnPawPrint(offset);
        offset = offset === -30 ? 30 : -30;
      }, 400);
    });

    foundBtn.addEventListener('mouseleave', () => {
      clearInterval(pawInterval);
      if (ember) {
        ember.classList.remove('ember-walking');
        ember.classList.add('ember-idle');
      }
      if (emberStage) {
        emberStage.style.transform = 'none';
      }
    });
  }

  if (meetBtn) {
    meetBtn.addEventListener('mouseenter', () => {
      if (ember) {
        ember.style.transform = 'rotate(-3deg) scale(1.02)';
      }
    });
    meetBtn.addEventListener('mouseleave', () => {
      if (ember) {
        ember.style.transform = 'none';
      }
    });
  }
});
