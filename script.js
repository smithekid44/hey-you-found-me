document.addEventListener('DOMContentLoaded', () => {
  const fireflyContainer = document.getElementById('fireflies');
  const ember = document.getElementById('ember-character');
  const emberStage = document.getElementById('ember-container');
  const pawContainer = document.getElementById('paw-container');
  const statusElement = document.getElementById('status-message');

  // Your actual npoint endpoint URL
  const API_ENDPOINT = 'https://api.npoint.io/0031e99bdae3e4b148dc';

  // 1. Generate Floating Fireflies
  if (fireflyContainer) {
    for (let i = 0; i < 30; i++) {
      const fly = document.createElement('div');
      fly.className = 'firefly';
      fly.style.left = Math.random() * 100 + 'vw';
      fly.style.top = Math.random() * 100 + 'vh';
      fly.style.animationDelay = Math.random() * 5 + 's';
      fly.style.animationDuration = (3 + Math.random() * 4) + 's';
      fireflyContainer.appendChild(fly);
    }
  }

  // Helper Function: Spawn Paw Prints
  function spawnPawPrint(offsetPixels) {
    if (!pawContainer) return;
    const paw = document.createElement('span');
    paw.className = 'paw-print';
    paw.innerHTML = '🐾';
    paw.style.left = `calc(50% + ${offsetPixels}px)`;
    pawContainer.appendChild(paw);

    setTimeout(() => {
      paw.remove();
    }, 1500);
  }

  // 2. Interactive Button Hover Actions
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
        emberStage.style.transform = 'scale(1.05)';
      }

      let offset = -25;
      pawInterval = setInterval(() => {
        spawnPawPrint(offset);
        offset = offset === -25 ? 25 : -25;
      }, 350);
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
        ember.style.transform = 'rotate(-5deg)';
      }
    });
    meetBtn.addEventListener('mouseleave', () => {
      if (ember) {
        ember.style.transform = 'none';
      }
    });
  }

  // 3. Apply Visual State based on JSON Data
  function updateEmberUI(status) {
    if (status === 'missing') {
      if (ember) ember.classList.add('ember-missing');
      if (statusElement) statusElement.textContent = "Ember is currently missing! Keep looking!";
    } else {
      if (ember) ember.classList.remove('ember-missing');
      if (statusElement) statusElement.textContent = "Ember is safe at home!";
    }
  }

  // 4. Live Polling Function (Checks every 1 second)
  async function checkEmberStatus() {
    try {
      // Adding a timestamp query parameter prevents the browser from caching the old API response
      const response = await fetch(`${API_ENDPOINT}?t=${Date.now()}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      updateEmberUI(data.status);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  }

  // Start polling immediately, then check every 1 second
  checkEmberStatus();
  setInterval(checkEmberStatus, 1000);
});
