/* =====================================================
   VEINSTORE — Main JavaScript
   Interactive Game Top-Up Logic
   ===================================================== */

'use strict';

// =====================================================
// PARTICLE SYSTEM
// =====================================================
const ParticleSystem = (() => {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;
  const COLORS = ['#00f5ff', '#bf00ff', '#ff0080', '#00ff88'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.1,
      life: Math.random() * 300 + 100,
      maxLife: 0,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, () => {
      const p = createParticle();
      p.maxLife = p.life;
      return p;
    });
    window.addEventListener('resize', resize);
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      if (p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
        particles[i] = createParticle();
        particles[i].maxLife = particles[i].life;
        return;
      }

      const opacity = (p.life / p.maxLife) * p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const opacity = (1 - dist / 100) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,245,255,${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(loop);
  }

  return { init };
})();

// =====================================================
// COUNTER ANIMATION
// =====================================================
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const startTime = performance.now();
  const start = 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(ease * target);

    if (target >= 1000000) {
      el.textContent = (current / 1000000).toFixed(1) + 'JT' + suffix;
    } else if (target >= 1000) {
      el.textContent = (current / 1000).toFixed(0) + 'K' + suffix;
    } else {
      el.textContent = current + suffix;
    }

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// =====================================================
// GAME DATA
// =====================================================
const gameData = {
  ml: {
    title: 'Mobile Legends',
    sub: 'Diamonds · Season Pass',
    icon: '<img src="IMG/mlbb.jpg" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">',
    bg: 'ml-bg',
    denoms: [
      { amount: '5 Diamonds', price: 'Rp 1.500', bonus: '' },
      { amount: '12 Diamonds', price: 'Rp 3.000', bonus: '' },
      { amount: '65 Diamonds', price: 'Rp 15.000', bonus: '' },
      { amount: '172 Diamonds', price: 'Rp 39.000', bonus: '+5 Bonus' },
      { amount: '257 Diamonds', price: 'Rp 59.000', bonus: '+8 Bonus' },
      { amount: '344 Diamonds', price: 'Rp 79.000', bonus: '+12 Bonus' },
      { amount: '706 Diamonds', price: 'Rp 159.000', bonus: '+28 Bonus' },
      { amount: '2195 Diamonds', price: 'Rp 490.000', bonus: '+95 Bonus' },
      { amount: 'Weekly Pass', price: 'Rp 29.000', bonus: '100 Diamonds/hari' },
    ],
  },
  ff: {
    title: 'Free Fire',
    sub: 'Diamonds · Elite Pass',
    icon: '<img src="IMG/ffv6.png" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">',
    bg: 'ff-bg',
    denoms: [
      { amount: '50 Diamonds', price: 'Rp 11.000', bonus: '' },
      { amount: '100 Diamonds', price: 'Rp 20.000', bonus: '' },
      { amount: '210 Diamonds', price: 'Rp 40.000', bonus: '+5 Bonus' },
      { amount: '520 Diamonds', price: 'Rp 99.000', bonus: '+15 Bonus' },
      { amount: '1060 Diamonds', price: 'Rp 199.000', bonus: '+30 Bonus' },
      { amount: 'Elite Pass', price: 'Rp 79.000', bonus: 'Season Eksklusif' },
    ],
  },
  pubg: {
    title: 'PUBG Mobile',
    sub: 'UC · Royal Pass',
    icon: '<img src="IMG/pubgmv7.png" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">',
    bg: 'pubg-bg',
    denoms: [
      { amount: '60 UC', price: 'Rp 15.000', bonus: '' },
      { amount: '170 UC', price: 'Rp 40.000', bonus: '' },
      { amount: '325 UC', price: 'Rp 75.000', bonus: '' },
      { amount: '660 UC', price: 'Rp 149.000', bonus: '+10 Bonus' },
      { amount: '1800 UC', price: 'Rp 399.000', bonus: '+30 Bonus' },
      { amount: 'Royal Pass', price: 'Rp 149.000', bonus: 'Season Penuh' },
    ],
  },
  gi: {
    title: 'Genshin Impact',
    sub: 'Genesis Crystals · Welkin',
    icon: '<img src="IMG/genshin.png" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">',
    bg: 'gi-bg',
    denoms: [
      { amount: '60 Crystals', price: 'Rp 15.000', bonus: '' },
      { amount: '300 Crystals', price: 'Rp 69.000', bonus: '+30 Bonus' },
      { amount: '980 Crystals', price: 'Rp 219.000', bonus: '+110 Bonus' },
      { amount: '1980 Crystals', price: 'Rp 439.000', bonus: '+260 Bonus' },
      { amount: 'Welkin Moon', price: 'Rp 79.000', bonus: '90 Primogems/hari' },
    ],
  },
  val: {
    title: 'Valorant',
    sub: 'VP · Battle Pass',
    icon: '<img src="IMG/vlalo.jpg" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">',
    bg: 'val-bg',
    denoms: [
      { amount: '475 VP', price: 'Rp 49.000', bonus: '' },
      { amount: '1000 VP', price: 'Rp 99.000', bonus: '' },
      { amount: '2050 VP', price: 'Rp 199.000', bonus: '' },
      { amount: '3650 VP', price: 'Rp 349.000', bonus: '' },
      { amount: 'Battle Pass', price: 'Rp 149.000', bonus: 'Konten Eksklusif' },
    ],
  },
  hok: {
    title: 'Honor of Kings',
    sub: 'Tokens · Season Pass',
    icon: '<img src="IMG/hokv7.png" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">',
    bg: 'hok-bg',
    denoms: [
      { amount: '60 Tokens', price: 'Rp 11.000', bonus: '' },
      { amount: '160 Tokens', price: 'Rp 29.000', bonus: '' },
      { amount: '330 Tokens', price: 'Rp 59.000', bonus: '+10 Bonus' },
      { amount: '680 Tokens', price: 'Rp 119.000', bonus: '+20 Bonus' },
      { amount: 'Season Pass', price: 'Rp 89.000', bonus: 'Konten Musiman' },
    ],
  },
  steam: {
    title: 'Steam Wallet',
    sub: 'USD · IDR Wallet Code',
    icon: '<img src="IMG/mlbb.jpg" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">',
    bg: 'steam-bg',
    denoms: [
      { amount: 'Rp 20.000', price: 'Rp 22.000', bonus: '' },
      { amount: 'Rp 50.000', price: 'Rp 53.000', bonus: '' },
      { amount: 'Rp 100.000', price: 'Rp 104.000', bonus: '' },
      { amount: 'Rp 200.000', price: 'Rp 207.000', bonus: '' },
      { amount: 'USD 5', price: 'Rp 82.000', bonus: '' },
      { amount: 'USD 10', price: 'Rp 162.000', bonus: '' },
    ],
  },
  coc: {
    title: 'Clash of Clans',
    sub: 'Gems · Season Challenges',
    icon: '<img src="IMG/coc.jpg" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">',
    bg: 'coc-bg',
    denoms: [
      { amount: '80 Gems', price: 'Rp 14.000', bonus: '' },
      { amount: '500 Gems', price: 'Rp 79.000', bonus: '' },
      { amount: '1200 Gems', price: 'Rp 189.000', bonus: '+50 Bonus' },
      { amount: '2500 Gems', price: 'Rp 389.000', bonus: '+100 Bonus' },
      { amount: 'Season Pass', price: 'Rp 59.000', bonus: 'Gold Pass' },
    ],
  },
};

// =====================================================
// MODAL CONTROLLER
// =====================================================
const Modal = (() => {
  let currentGame = null;
  let currentStep = 1;
  let selectedDenom = null;

  const overlay = document.getElementById('topupModal');
  const closeBtn = document.getElementById('modalClose');

  function open(gameKey) {
    currentGame = gameData[gameKey];
    if (!currentGame) return;

    selectedDenom = null;
    goToStep(1);
    populateGameInfo();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    currentStep = 1;
    selectedDenom = null;
  }

  function populateGameInfo() {
    document.getElementById('modalGameIcon').innerHTML = currentGame.icon;
    document.getElementById('modalGameIcon').className = `modal-game-icon ${currentGame.bg}`;
    document.getElementById('modalGameTitle').textContent = currentGame.title;
    document.getElementById('modalGameSub').textContent = currentGame.sub;

    // Build denom grid
    const grid = document.getElementById('denomGrid');
    grid.innerHTML = '';
    currentGame.denoms.forEach((d, i) => {
      const item = document.createElement('div');
      item.className = 'denom-item';
      item.dataset.index = i;
      item.innerHTML = `
        <div class="denom-amount">${d.amount}</div>
        <div class="denom-price">${d.price}</div>
        ${d.bonus ? `<div class="denom-bonus">+${d.bonus}</div>` : ''}
      `;
      item.addEventListener('click', () => selectDenom(item, d));
      grid.appendChild(item);
    });
  }

  function selectDenom(el, denom) {
    document.querySelectorAll('.denom-item').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    selectedDenom = denom;

    document.getElementById('selectedDenomInfo').style.display = 'flex';
    document.getElementById('denomVal').textContent = `${denom.amount} — ${denom.price}`;
    document.getElementById('denomNext').disabled = false;
  }

  function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step').forEach(s => {
      s.classList.remove('active', 'done');
    });
    document.querySelectorAll('.step-line').forEach(l => l.classList.remove('active'));

    currentStep = step;

    // Special step handling
    if (step === 'success') {
      document.getElementById('stepSuccess').classList.add('active');
      return;
    }

    // Show current step
    document.getElementById(`step${step}`).classList.add('active');

    // Update step indicators
    document.querySelectorAll('.step').forEach(s => {
      const sNum = parseInt(s.dataset.step);
      if (sNum < step) s.classList.add('done');
      else if (sNum === step) s.classList.add('active');
    });

    document.querySelectorAll('.step-line').forEach((l, i) => {
      if (i < step - 1) l.classList.add('active');
    });
  }

  function fillSummary() {
    document.getElementById('sumItem').textContent =
      `${currentGame.title} — ${selectedDenom.amount}`;
    document.getElementById('sumUser').textContent =
      document.getElementById('userId').value || '—';
    document.getElementById('sumTotal').textContent = selectedDenom.price;
  }

  function verifyUser() {
    const uid = document.getElementById('userId').value.trim();
    if (!uid) {
      shakeElement(document.getElementById('userId'));
      return;
    }

    const btn = document.getElementById('userNext');
    btn.textContent = '⏳ Memverifikasi...';
    btn.disabled = true;

    // Simulate verification
    setTimeout(() => {
      const names = ['Player_' + uid.slice(-4), 'GamerX_' + uid.slice(0, 3), 'Hero_' + uid];
      const name = names[Math.floor(Math.random() * names.length)];

      document.getElementById('verifyBanner').style.display = 'flex';
      document.getElementById('verifyName').textContent = name;

      btn.textContent = 'Lanjut →';
      btn.disabled = false;
      btn.dataset.next = '4';
      btn.onclick = () => {
        fillSummary();
        goToStep(4);
      };
    }, 1500);
  }

  function shakeElement(el) {
    el.style.animation = 'none';
    el.style.borderColor = 'var(--neon-pink)';
    el.style.boxShadow = '0 0 12px rgba(255,0,128,0.3)';
    setTimeout(() => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    }, 800);
  }

  function processPayment() {
    const payMethod = document.querySelector('input[name="payment"]:checked');
    if (!payMethod) {
      return;
    }

    const btn = document.getElementById('payBtn');
    btn.innerHTML = '<span class="btn-glow"></span>⏳ Memproses...';
    btn.disabled = true;

    setTimeout(() => {
      const orderId = 'VS-' + Date.now().toString(36).toUpperCase();
      document.getElementById('orderId').textContent = orderId;
      goToStep('success');
    }, 2000);
  }

  function bindEvents() {
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) close();
    });

    // Navigation buttons
    document.addEventListener('click', (e) => {
      const nextBtn = e.target.closest('.btn-next');
      const backBtn = e.target.closest('.btn-back');

      if (nextBtn && !nextBtn.disabled) {
        const nextStep = parseInt(nextBtn.dataset.next);
        if (nextStep === 4 && currentStep === 3) {
          const uid = document.getElementById('userId').value.trim();
          if (!uid) { shakeElement(document.getElementById('userId')); return; }
          fillSummary();
        }
        if (!isNaN(nextStep)) goToStep(nextStep);
      }

      if (backBtn) {
        const backStep = parseInt(backBtn.dataset.back);
        if (!isNaN(backStep)) goToStep(backStep);
      }
    });

    // User verify
    document.getElementById('userNext').addEventListener('click', verifyUser);

    // Payment
    document.getElementById('payBtn').addEventListener('click', processPayment);

    // Back home
    document.getElementById('backHomeBtn').addEventListener('click', close);
  }

  return { open, close, bindEvents };
})();

// =====================================================
// CATEGORY FILTER
// =====================================================
function initCategoryFilter() {
  const tabs = document.querySelectorAll('.cat-tab');
  const cards = document.querySelectorAll('.game-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.cat;

      cards.forEach(card => {
        if (cat === 'all' || card.dataset.cat.includes(cat)) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// =====================================================
// SEARCH
// =====================================================
function initSearch() {
  const searchInput = document.getElementById('gameSearch');
  const cards = document.querySelectorAll('.game-card');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const tabs = document.querySelectorAll('.cat-tab');
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector('.cat-tab[data-cat="all"]').classList.add('active');

    cards.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const sub = card.querySelector('.card-sub').textContent.toLowerCase();
      if (!query || title.includes(query) || sub.includes(query)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.blur();
      searchInput.value = '';
      cards.forEach(c => c.classList.remove('hidden'));
    }
  });
}

// =====================================================
// GAME CARD CLICK → OPEN MODAL
// =====================================================
function initGameCards() {
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      const gameKey = card.dataset.game;
      if (gameKey) Modal.open(gameKey);
    });
  });
}

// =====================================================
// STAT COUNTERS (Intersection Observer)
// =====================================================
function initStatCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
}

// =====================================================
// CARD 3D TILT EFFECT
// =====================================================
function initCardTilt() {
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;

      card.style.transform = `translateY(-6px) scale(1.01) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// =====================================================
// SCROLL REVEAL
// =====================================================
function initScrollReveal() {
  const elements = document.querySelectorAll('.game-card, .feature-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${i * 0.06}s`;
        entry.target.style.animation = 'fadeInUp 0.5s ease both';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

// =====================================================
// CUSTOM CURSOR GLOW
// =====================================================
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%);
    transition: transform 0.1s linear;
    border-radius: 50%;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// =====================================================
// HEADER SCROLL EFFECT
// =====================================================
function initHeaderScroll() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.style.borderBottomColor = 'rgba(0,245,255,0.3)';
    } else {
      header.style.borderBottomColor = 'rgba(0,245,255,0.25)';
    }
  });
}

// =====================================================
// PAYMENT RADIO INTERACTIONS
// =====================================================
function initPaymentOptions() {
  document.querySelectorAll('.pay-option input').forEach(radio => {
    radio.addEventListener('change', () => {
      document.getElementById('payBtn').disabled = false;
    });
  });
}

// =====================================================
// INIT ALL
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  ParticleSystem.init();
  initStatCounters();
  initCategoryFilter();
  initSearch();
  initGameCards();
  initCardTilt();
  initScrollReveal();
  initCursorGlow();
  initHeaderScroll();
  initPaymentOptions();
  Modal.bindEvents();

  // Ensure payBtn starts disabled
  document.getElementById('payBtn').disabled = true;

  console.log('%c⚡ VEINSTORE Loaded', 'color:#00f5ff;font-family:monospace;font-size:14px;font-weight:bold;');
});