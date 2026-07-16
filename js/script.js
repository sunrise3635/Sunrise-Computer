// ============================================
//  SUNRISE COMPUTER — Premium JS
// ============================================

// ===== LOADING SCREEN =====
const loader      = document.getElementById('loader');
const loaderBar   = document.getElementById('loaderBar');
const loaderPct   = document.getElementById('loaderPercent');

if (loader) {
  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';

  let progress  = 0;
  const DURATION = 1500;   // total ms (1.5 seconds)
  const TICK     = 20;     // update every 20ms
  const STEPS    = DURATION / TICK;
  const INC      = 100 / STEPS;

  const loadTimer = setInterval(() => {
    progress += INC;

    if (progress >= 100) {
      progress = 100;
      clearInterval(loadTimer);

      if (loaderBar) loaderBar.style.width = '100%';
      if (loaderPct) loaderPct.textContent = '100%';

      // Brief pause at 100%, then fade out
      setTimeout(() => {
        loader.classList.add('loader-exit');
        document.body.style.overflow = '';

        setTimeout(() => {
          loader.style.display = 'none';
        }, 800);
      }, 250);

    } else {
      if (loaderBar) loaderBar.style.width = progress + '%';
      if (loaderPct) loaderPct.textContent = Math.floor(progress) + '%';
    }
  }, TICK);
}

// ===== HERO IMAGE SLIDER =====
const slides = document.querySelectorAll(".hero-slide");
const dots   = document.querySelectorAll(".dot");

let currentIndex = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (dots[i]) dots[i].classList.remove("active");
  });
  if (slides[index]) slides[index].classList.add("active");
  if (dots[index]) dots[index].classList.add("active");
}

function nextSlide() {
  if (slides.length === 0) return;
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

if (slides.length > 0) {
  setInterval(nextSlide, 5000); // 5 seconds interval

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      showSlide(currentIndex);
    });
  });
}


// ===== NAVBAR GLASS ON SCROLL =====
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ===== SCROLL REVEAL =====
const animateEls = document.querySelectorAll('[data-animate]');

if (animateEls.length) {
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  animateEls.forEach(el => revealObs.observe(el));
}

// ===== STATS COUNTER — ON SCROLL =====
const counters = document.querySelectorAll('.stat-box h2');

function animateCounter(el) {
  const raw     = el.getAttribute('data-target') || el.innerText;
  const target  = parseFloat(raw.replace(/[^0-9.]/g, ''));
  const suffix  = raw.replace(/[0-9.]/g, '').trim();
  const steps   = 80;
  const duration = 1800;
  const inc      = target / steps;
  let count      = 0;

  el.innerText = '0' + suffix;

  const t = setInterval(() => {
    count += inc;
    if (count >= target) {
      el.innerText = Math.round(target) + suffix;
      clearInterval(t);
    } else {
      el.innerText = Math.floor(count) + suffix;
    }
  }, duration / steps);
}

if (counters.length) {
  counters.forEach(c => {
    c.setAttribute('data-target', c.innerText);
    c.innerText = '0';
  });

  const statsObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => statsObs.observe(c));
}

// ===== BOTTOM NAV ACTIVE STATE =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.bottom-nav-item');

if (navItems.length && sections.length) {
  const navObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach(item => {
            item.classList.toggle('active',
              item.getAttribute('href').includes(id));
          });
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach(s => navObs.observe(s));
}

// ===== AJAX CONTACT FORM SUBMISSION WITH MODAL POPUP =====
const contactForm  = document.querySelector('.contact-form');
const contactModal = document.getElementById('contactModal');
const modalOkBtn   = document.getElementById('modalOkBtn');

if (contactForm && contactModal && modalOkBtn) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);

    fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
      if (response.ok) {
        contactModal.classList.add('show');
        contactForm.reset();
      } else {
        alert('Oops! There was a problem submitting your form. Please try again.');
      }
    })
    .catch(error => {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
      alert('Oops! There was a problem submitting your form. Please try again.');
    });
  });

  modalOkBtn.addEventListener('click', () => {
    contactModal.classList.remove('show');
  });
}

// ===== GRAVITY PARTICLES BACKGROUND SYSTEM =====
const gravityCanvas = document.getElementById('gravity-bg');
if (gravityCanvas) {
  const ctx = gravityCanvas.getContext('2d');
  let particles = [];
  const particleCount = 110;
  
  const mouse = {
    x: null,
    y: null,
    radius: 180
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resizeCanvas() {
    gravityCanvas.width = window.innerWidth;
    gravityCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
      this.x = Math.random() * gravityCanvas.width;
      this.y = Math.random() * gravityCanvas.height;
    }

    reset() {
      this.x = Math.random() * gravityCanvas.width;
      this.y = Math.random() * gravityCanvas.height;
      this.size = Math.random() * 2 + 1; // 1px to 3px
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.driftX = (Math.random() - 0.5) * 0.2;
      this.driftY = (Math.random() - 0.5) * 0.2;
      // Burgundy & Rose Smoke subtle dots
      this.color = Math.random() > 0.5 ? 'rgba(75, 29, 63, 0.4)' : 'rgba(216, 167, 177, 0.6)';
    }

    update() {
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          // Gravitational pull force towards the mouse
          this.vx += (dx / distance) * force * 0.04;
          this.vy += (dy / distance) * force * 0.04;
        }
      }

      this.vx *= 0.97;
      this.vy *= 0.97;

      this.x += this.vx + this.driftX;
      this.y += this.vy + this.driftY;

      if (this.x < 0) this.x = gravityCanvas.width;
      if (this.x > gravityCanvas.width) this.x = 0;
      if (this.y < 0) this.y = gravityCanvas.height;
      if (this.y > gravityCanvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  init();

  function animate() {
    if (window.innerWidth < 768) {
      ctx.clearRect(0, 0, gravityCanvas.width, gravityCanvas.height);
      // Wait and check again later without rendering loop
      setTimeout(() => requestAnimationFrame(animate), 500);
      return;
    }

    ctx.clearRect(0, 0, gravityCanvas.width, gravityCanvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
}