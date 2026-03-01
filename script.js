/* ============================================
   RED_THZ PORTFOLIO - SCRIPT.JS
   All animations, AI chat, 3D, language toggle
   ============================================ */

// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('loaded');
  }, 2200);
});

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.transform = `translate(${followerX - 17.5}px, ${followerY - 17.5}px)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effects on interactive elements
  document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card, .bot-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width = '50px';
      follower.style.height = '50px';
      follower.style.borderColor = 'rgba(255, 60, 60, 0.6)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width = '35px';
      follower.style.height = '35px';
      follower.style.borderColor = '#ff3c3c';
    });
  });
}

// ===== PARTICLES BACKGROUND =====
const particlesCanvas = document.getElementById('particles-canvas');
if (particlesCanvas) {
  const pCtx = particlesCanvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 80;

  function resizeParticlesCanvas() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
  }
  resizeParticlesCanvas();
  window.addEventListener('resize', resizeParticlesCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * particlesCanvas.width;
      this.y = Math.random() * particlesCanvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > particlesCanvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > particlesCanvas.height) this.speedY *= -1;
    }
    draw() {
      pCtx.beginPath();
      pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(255, 60, 60, ${this.opacity})`;
      pCtx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          pCtx.beginPath();
          pCtx.strokeStyle = `rgba(255, 60, 60, ${0.05 * (1 - dist / 120)})`;
          pCtx.lineWidth = 0.5;
          pCtx.moveTo(particles[a].x, particles[a].y);
          pCtx.lineTo(particles[b].x, particles[b].y);
          pCtx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ===== HERO 3D CANVAS =====
const hero3DCanvas = document.getElementById('hero-3d-canvas');
if (hero3DCanvas) {
  const ctx3d = hero3DCanvas.getContext('2d');
  let w, h;
  let shapes = [];
  const SHAPE_COUNT = 15;

  function resizeHero3D() {
    w = hero3DCanvas.width = hero3DCanvas.parentElement.offsetWidth;
    h = hero3DCanvas.height = hero3DCanvas.parentElement.offsetHeight;
  }
  resizeHero3D();
  window.addEventListener('resize', resizeHero3D);

  class Shape3D {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.z = Math.random() * 200 + 50;
      this.rotX = Math.random() * Math.PI * 2;
      this.rotY = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.size = Math.random() * 60 + 20;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.type = Math.floor(Math.random() * 3); // 0=cube, 1=triangle, 2=diamond
      this.opacity = Math.random() * 0.12 + 0.03;
    }

    update() {
      this.rotX += this.rotSpeed;
      this.rotY += this.rotSpeed * 0.7;
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -100) this.x = w + 100;
      if (this.x > w + 100) this.x = -100;
      if (this.y < -100) this.y = h + 100;
      if (this.y > h + 100) this.y = -100;
    }

    draw() {
      ctx3d.save();
      ctx3d.translate(this.x, this.y);

      const scale = 200 / (200 + this.z);
      ctx3d.scale(scale, scale);

      const s = this.size;
      ctx3d.strokeStyle = `rgba(255, 60, 60, ${this.opacity})`;
      ctx3d.lineWidth = 1.5;

      if (this.type === 0) {
        // Rotating cube wireframe
        const cos = Math.cos(this.rotX);
        const sin = Math.sin(this.rotX);
        const cosY = Math.cos(this.rotY);
        const sinY = Math.sin(this.rotY);

        const vertices = [
          [-s/2, -s/2, -s/2], [s/2, -s/2, -s/2], [s/2, s/2, -s/2], [-s/2, s/2, -s/2],
          [-s/2, -s/2, s/2], [s/2, -s/2, s/2], [s/2, s/2, s/2], [-s/2, s/2, s/2]
        ];

        const projected = vertices.map(([x, y, z]) => {
          let ry = x * cosY - z * sinY;
          let rz = x * sinY + z * cosY;
          let rx = ry;
          let fy = y * cos - rz * sin;
          return [rx, fy];
        });

        const edges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];

        edges.forEach(([a, b]) => {
          ctx3d.beginPath();
          ctx3d.moveTo(projected[a][0], projected[a][1]);
          ctx3d.lineTo(projected[b][0], projected[b][1]);
          ctx3d.stroke();
        });

      } else if (this.type === 1) {
        // Rotating triangle
        ctx3d.rotate(this.rotX);
        ctx3d.beginPath();
        ctx3d.moveTo(0, -s/2);
        ctx3d.lineTo(s/2, s/2);
        ctx3d.lineTo(-s/2, s/2);
        ctx3d.closePath();
        ctx3d.stroke();
      } else {
        // Rotating diamond
        ctx3d.rotate(this.rotY);
        ctx3d.beginPath();
        ctx3d.moveTo(0, -s/2);
        ctx3d.lineTo(s/3, 0);
        ctx3d.lineTo(0, s/2);
        ctx3d.lineTo(-s/3, 0);
        ctx3d.closePath();
        ctx3d.stroke();
      }

      ctx3d.restore();
    }
  }

  for (let i = 0; i < SHAPE_COUNT; i++) {
    shapes.push(new Shape3D());
  }

  function animate3D() {
    ctx3d.clearRect(0, 0, w, h);

    // Background gradient
    const grad = ctx3d.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.7);
    grad.addColorStop(0, 'rgba(15, 52, 96, 0.15)');
    grad.addColorStop(0.5, 'rgba(26, 26, 46, 0.1)');
    grad.addColorStop(1, 'rgba(10, 10, 15, 0)');
    ctx3d.fillStyle = grad;
    ctx3d.fillRect(0, 0, w, h);

    shapes.forEach(s => {
      s.update();
      s.draw();
    });
    requestAnimationFrame(animate3D);
  }
  animate3D();
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== TYPEWRITER =====
const typewriterEl = document.getElementById('typewriter');
const typewriterWords = {
  de: ['Software Developer', 'Web Developer', 'Bot Developer', 'JavaScript Experte', 'Supabase Spezialist'],
  en: ['Software Developer', 'Web Developer', 'Bot Developer', 'JavaScript Expert', 'Supabase Specialist']
};

let currentLang = 'de';
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
  const words = typewriterWords[currentLang];
  const currentWord = words[wordIndex % words.length];

  if (isDeleting) {
    typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {
    typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex++;
    typeSpeed = 500;
  }

  setTimeout(typeWriter, typeSpeed);
}
typeWriter();

// ===== SCROLL REVEAL =====
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

scrollRevealElements.forEach(el => revealObserver.observe(el));

// ===== SKILL BARS ANIMATION =====
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const skillCard = entry.target.closest('.skill-card');
      const percentEl = skillCard ? skillCard.querySelector('.skill-percent') : null;

      // Keep bar width synced with the displayed percentage text (e.g. "68%")
      const displayedPercent = percentEl ? parseInt(percentEl.textContent, 10) : NaN;
      const dataWidth = parseInt(entry.target.getAttribute('data-width'), 10);
      const width = Number.isFinite(displayedPercent) ? displayedPercent : dataWidth;

      entry.target.style.width = `${width}%`;
      entry.target.setAttribute('data-width', String(width));
    }
  });
}, { threshold: 0.5 });

skillFills.forEach(bar => skillObserver.observe(bar));

// ===== NUMBER COUNTER ANIMATION =====
const counters = document.querySelectorAll('[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.getAttribute('data-count'));
      let current = 0;
      const increment = target / 80;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        entry.target.textContent = Math.floor(current).toLocaleString('de-DE');
      }, 20);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ===== TILT EFFECT =====
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -5;
    const rotateY = (x - centerX) / centerX * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
  });
});

// ===== LANGUAGE TOGGLE =====
const langToggle = document.getElementById('langToggle');
const langFlag = langToggle.querySelector('.lang-flag');
const langLabel = langToggle.querySelector('.lang-label');

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'de' ? 'en' : 'de';
  document.documentElement.setAttribute('data-lang', currentLang);

  if (currentLang === 'en') {
    langFlag.textContent = '🇬🇧';
    langLabel.textContent = 'EN';
  } else {
    langFlag.textContent = '🇩🇪';
    langLabel.textContent = 'DE';
  }

  // Update all translatable elements
  document.querySelectorAll('[data-de]').forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`);
  });

  // Update placeholders
  document.querySelectorAll('[data-de-placeholder]').forEach(el => {
    el.placeholder = el.getAttribute(`data-${currentLang}-placeholder`);
  });

  // Reset typewriter
  wordIndex = 0;
  charIndex = 0;
  isDeleting = false;
});

// ===== AI CHAT =====
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const chatSuggestions = document.getElementById('chatSuggestions');

// Knowledge base
const knowledgeBase = {
  de: {
    greeting: ['hallo', 'hi', 'hey', 'moin', 'servus', 'guten tag'],
    greetingResponse: 'Hey! 👋 Willkommen auf meiner Website! Wie kann ich dir helfen? Du kannst mich alles über Red_thz fragen!',

    who: ['wer', 'red_thz', 'über', 'vorstellung'],
    whoResponse: 'Red_thz ist ein leidenschaftlicher Software, Web und Bot Developer. Er spezialisiert sich auf JavaScript und nutzt Supabase als Datenbank. Seine Custom Discord Bots laufen auf Servern mit über 9.600+ Mitgliedern! 🚀',

    bots: ['bot', 'bots', 'discord', 'server', 'custom'],
    botsResponse: 'Red_thz hat Custom Bots für 4 große Server erstellt:\n\n🔴 **Mohgs** – 3.100 Mitglieder\n🔵 **Hyperions** – 2.800 Mitglieder\n🟢 **Lucent** – 2.700 Mitglieder\n🟠 **Soulflares** – 1.000 Mitglieder\n\nDas sind insgesamt über 9.600+ Mitglieder! Jeder Bot ist individuell und einzigartig. 💪',

    skills: ['skill', 'skills', 'können', 'fähigkeit', 'programmier', 'technik', 'tech'],
    skillsResponse: 'Red_thz beherrscht folgende Technologien:\n\n⚡ JavaScript – 95%\n🌐 HTML5 – 90%\n🎨 CSS3 – 90%\n💚 Node.js – 90%\n🗄️ Supabase – 85%\n🤖 Discord.js – 95%\n📦 Git – 80%\n🧠 KI Integration – 75%',

    contact: ['kontakt', 'erreichen', 'schreiben', 'nachricht', 'zusammenarbeit'],
    contactResponse: 'Du kannst Red_thz ganz einfach erreichen! 📬\n\n💬 Discord: Red_thz\n📧 Nutze das Kontaktformular unten auf der Website\n\nEr freut sich immer über neue Projekte und Zusammenarbeit! 🤝',

    projects: ['projekt', 'projekte', 'arbeit', 'portfolio', 'website'],
    projectsResponse: 'Red_thz arbeitet an verschiedenen spannenden Projekten:\n\n🌐 Portfolio Website – Mit 3D-Animationen und KI-Chat\n🤖 Custom Discord Bots – Für große Communities\n🧠 KI Bot System – Intelligente Automatisierung\n\nJedes Projekt wird mit Leidenschaft und modernster Technik umgesetzt! ✨',

    default: 'Hmm, das habe ich nicht ganz verstanden. 🤔 Frag mich doch etwas über:\n\n• Wer ist Red_thz?\n• Welche Bots hat er erstellt?\n• Welche Skills hat er?\n• Wie kann man ihn kontaktieren?'
  },
  en: {
    greeting: ['hello', 'hi', 'hey', 'yo', 'greetings', 'good'],
    greetingResponse: 'Hey! 👋 Welcome to my website! How can I help you? You can ask me anything about Red_thz!',

    who: ['who', 'red_thz', 'about', 'introduction'],
    whoResponse: 'Red_thz is a passionate Software, Web and Bot Developer. He specializes in JavaScript and uses Supabase as his database. His Custom Discord Bots run on servers with over 9,600+ members! 🚀',

    bots: ['bot', 'bots', 'discord', 'server', 'custom'],
    botsResponse: 'Red_thz has created Custom Bots for 4 major servers:\n\n🔴 **Mohgs** – 3,100 Members\n🔵 **Hyperions** – 2,800 Members\n🟢 **Lucent** – 2,700 Members\n🟠 **Soulflares** – 1,000 Members\n\nThat\'s over 9,600+ members total! Each bot is unique and individually tailored. 💪',

    skills: ['skill', 'skills', 'can', 'abilities', 'programming', 'tech'],
    skillsResponse: 'Red_thz masters these technologies:\n\n⚡ JavaScript – 75%\n🌐 HTML5 – 60%\n🎨 CSS3 – 50%\n💚 Node.js – 64%\n🗄️ Supabase – 65%\n🤖 Discord.js – 80%\n📦 Git – 40%\n🧠 AI Integration – 47%',

    contact: ['contact', 'reach', 'write', 'message', 'collaborate'],
    contactResponse: 'You can easily reach Red_thz! 📬\n\n💬 Discord: Red_thz\n📧 Use the contact form at the bottom of the website\n\nHe\'s always excited about new projects and collaborations! 🤝',

    projects: ['project', 'projects', 'work', 'portfolio', 'website'],
    projectsResponse: 'Red_thz works on various exciting projects:\n\n🌐 Portfolio Website – With 3D animations and AI chat\n🤖 Custom Discord Bots – For large communities\n🧠 AI Bot System – Intelligent automation\n\nEvery project is built with passion and cutting-edge technology! ✨',

    default: 'Hmm, I didn\'t quite understand that. 🤔 Try asking me about:\n\n• Who is Red_thz?\n• What bots has he created?\n• What skills does he have?\n• How can you contact him?'
  }
};

function getAIResponse(message) {
  const lang = currentLang;
  const kb = knowledgeBase[lang];
  const lower = message.toLowerCase();

  if (kb.greeting.some(w => lower.includes(w))) return kb.greetingResponse;
  if (kb.who.some(w => lower.includes(w))) return kb.whoResponse;
  if (kb.bots.some(w => lower.includes(w))) return kb.botsResponse;
  if (kb.skills.some(w => lower.includes(w))) return kb.skillsResponse;
  if (kb.contact.some(w => lower.includes(w))) return kb.contactResponse;
  if (kb.projects.some(w => lower.includes(w))) return kb.projectsResponse;
  return kb.default;
}

function addMessage(text, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
  messageDiv.innerHTML = `
    <div class="message-avatar">${isUser ? 'Du' : 'R'}</div>
    <div class="message-content"><p>${text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p></div>
  `;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;

  addMessage(msg, true);
  chatInput.value = '';
  chatSuggestions.style.display = 'none';

  // Typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot-message';
  typingDiv.id = 'typing-indicator';
  typingDiv.innerHTML = `
    <div class="message-avatar">R</div>
    <div class="message-content"><p>...</p></div>
  `;
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
    addMessage(getAIResponse(msg));
  }, 800 + Math.random() * 700);
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Suggestion buttons
document.querySelectorAll('.suggestion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    chatInput.value = btn.textContent;
    sendMessage();
  });
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('formName').value;
  const successMsg = currentLang === 'de'
    ? `Danke ${name}! Deine Nachricht wurde gesendet. 🚀`
    : `Thanks ${name}! Your message has been sent. 🚀`;

  alert(successMsg);
  e.target.reset();
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section');
const navLinksAll = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinksAll.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = '#ff3c3c';
    }
  });
});

// ===== PARALLAX ON MOUSE MOVE (HERO) =====
document.addEventListener('mousemove', (e) => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    heroContent.style.transform = `translate(${x}px, ${y}px)`;
  }
});

console.log('%c Red_thz Portfolio Loaded 🚀 ', 'background: #ff3c3c; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
