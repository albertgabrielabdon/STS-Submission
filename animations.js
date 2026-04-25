// === CURSOR ===
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  setTimeout(() => {
    cursorRing.style.left = mx + 'px';
    cursorRing.style.top = my + 'px';
  }, 80);
});

// === PROGRESS ===
const progressBar = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
});

// === STARS ===
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars() {
  stars = [];
  const count = Math.floor((canvas.width * canvas.height) / 4000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      baseAlpha: Math.random() * 0.7 + 0.15,
      alpha: 0,
      twinkleSpeed: Math.random() * 0.015 + 0.003,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: Math.random() > 0.85 ? '#b8d4f0' : (Math.random() > 0.7 ? '#c9a96e' : '#ffffff')
    });
  }
}

let frame = 0;

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frame += 0.01;

  stars.forEach(s => {
    s.alpha = s.baseAlpha * (0.5 + 0.5 * Math.sin(frame * (s.twinkleSpeed * 100) + s.twinkleOffset));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = s.color.replace(')', `, ${s.alpha})`).replace('rgb', 'rgba').replace('#ffffff', `rgba(255,255,255,${s.alpha})`);

    if (s.color === '#ffffff') {
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    } else if (s.color === '#b8d4f0') {
      ctx.fillStyle = `rgba(184,212,240,${s.alpha})`;
    } else {
      ctx.fillStyle = `rgba(201,169,110,${s.alpha})`;
    }

    ctx.fill();

    // Occasional glow
    if (s.r > 1.2 && s.alpha > 0.6) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
      const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 2.5);
      grd.addColorStop(0, `rgba(255,255,255,${s.alpha * 0.15})`);
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grd;
      ctx.fill();
    }
  });

  requestAnimationFrame(animateStars);
}

resizeCanvas();
createStars();
animateStars();
window.addEventListener('resize', () => { resizeCanvas(); createStars(); });

// === PARALLAX on scroll ===
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  // Move stars slightly
  canvas.style.transform = `translateY(${y * 0.15}px)`;
});

// === FLOATING PARTICLES ===
const particleContainer = document.getElementById('particles');
for (let i = 0; i < 18; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 2 + 1;
  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${Math.random() * 100}vw;
    background: ${Math.random() > 0.5 ? 'rgba(201,169,110,0.4)' : 'rgba(184,212,240,0.3)'};
    --dur: ${Math.random() * 25 + 20}s;
    --delay: -${Math.random() * 30}s;
  `;
  particleContainer.appendChild(p);
}

// === REVEAL ON SCROLL ===
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

reveals.forEach(r => observer.observe(r));

// === IMAGE UPLOAD ===
function loadImage(input, slotId) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const slot = document.getElementById(slotId);
    const placeholder = slot.querySelector('.img-placeholder');
    const existingImg = slot.querySelector('img');
    if (existingImg) existingImg.remove();

    const img = document.createElement('img');
    img.src = e.target.result;
    slot.insertBefore(img, slot.querySelector('.image-caption'));
    placeholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// === MOUSE PARALLAX on hero ===
document.addEventListener('mousemove', (e) => {
  const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
  const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
  const orbit = document.querySelector('#hero svg');
  if (orbit) {
    orbit.style.transform = `translate(${xRatio * 15}px, ${yRatio * 10}px)`;
  }
});