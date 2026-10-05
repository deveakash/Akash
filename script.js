const body = document.body;
const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
const themeToggle = document.getElementById("themeToggle");
const loader = document.getElementById("loader");
const backToTop = document.getElementById("backToTop");
const cursorGlow = document.getElementById("cursorGlow");
const typingText = document.getElementById("typingText");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

window.addEventListener("load", () => {
  setTimeout(() => loader?.classList.add("hidden"), 350);
});

// Sticky navbar style when scrolling.
const updateNavbarState = () => {
  if (window.scrollY > 24) {
    navbar?.classList.add("scrolled");
  } else {
    navbar?.classList.remove("scrolled");
  }

  if (window.scrollY > 420) {
    backToTop?.classList.add("show");
  } else {
    backToTop?.classList.remove("show");
  }
};

window.addEventListener("scroll", updateNavbarState, { passive: true });
updateNavbarState();

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("open");
    body.classList.toggle("no-scroll", navLinks.classList.contains("open"));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("active");
      body.classList.remove("no-scroll");
    });
  });
}

// Theme switch with localStorage support.
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") {
  body.classList.add("light-theme");
}

const refreshThemeIcon = () => {
  if (!themeToggle) return;
  themeToggle.innerHTML = body.classList.contains("light-theme")
    ? '<i class="fa-solid fa-moon"></i>'
    : '<i class="fa-solid fa-sun"></i>';
};

refreshThemeIcon();

themeToggle?.addEventListener("click", () => {
  body.classList.toggle("light-theme");
  localStorage.setItem("portfolio-theme", body.classList.contains("light-theme") ? "light" : "dark");
  refreshThemeIcon();
});

// Typing effect in hero section.
const typingPhrases = ["Web Developer", "Game Developer", "Freelancer"];
let phraseIndex = 0;
let letterIndex = 0;
let deleting = false;

const typingLoop = () => {
  if (!typingText) return;

  const current = typingPhrases[phraseIndex];

  if (!deleting) {
    typingText.textContent = current.slice(0, letterIndex + 1);
    letterIndex += 1;

    if (letterIndex === current.length) {
      deleting = true;
      setTimeout(typingLoop, 1100);
      return;
    }
  } else {
    typingText.textContent = current.slice(0, letterIndex - 1);
    letterIndex -= 1;

    if (letterIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    }
  }

  setTimeout(typingLoop, deleting ? 55 : 95);
};

typingLoop();

// Reveal animation when sections become visible.
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// Project category filter.
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === "all" || category === filter;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

// Demo submit handling.
const contactForm = document.getElementById("contactForm");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const btn = contactForm.querySelector("button[type='submit']");

  if (btn) {
    const oldLabel = btn.textContent;
    btn.textContent = "Message Sent";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = oldLabel;
      btn.disabled = false;
      contactForm.reset();
    }, 1600);
  }
});

// Cursor glow follows mouse movement.
if (cursorGlow) {
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let targetX = x;
  let targetY = y;

  window.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  });

  const animateCursor = () => {
    x += (targetX - x) * 0.14;
    y += (targetY - y) * 0.14;
    cursorGlow.style.transform = `translate(${x - 150}px, ${y - 150}px)`;
    requestAnimationFrame(animateCursor);
  };

  animateCursor();
}

// Button ripple effect.
const rippleTargets = document.querySelectorAll(".ripple");
rippleTargets.forEach((target) => {
  target.addEventListener("click", (event) => {
    const ripple = document.createElement("span");
    ripple.className = "ripple-ink";

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    target.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

// Subtle card tilt interaction.
const tiltCards = document.querySelectorAll(".tilt-card");
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
});

// Lightweight canvas particles for hero background.
const canvas = document.getElementById("particleCanvas");
if (canvas) {
  const context = canvas.getContext("2d");
  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 70);

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const createParticles = () => {
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.6,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25
      });
    }
  };

  const drawParticles = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const accentColor = body.classList.contains("light-theme")
      ? "rgba(2, 132, 199, 0.45)"
      : "rgba(56, 189, 248, 0.5)";

    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = accentColor;
      context.fill();
    });

    requestAnimationFrame(drawParticles);
  };

  resizeCanvas();
  createParticles();
  drawParticles();
  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
}
