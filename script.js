// ============================================================
// CORE UI ELEMENTS
// ============================================================
const scrollBar = document.getElementById("scroll-progress");
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburgerBtn");
const mobileNav = document.getElementById("mobileNav");
const navClose = document.getElementById("navClose");
const mobLinks = document.querySelectorAll(".mob-link");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const revealEls = document.querySelectorAll(".reveal");
const heroBg = document.querySelector(".hero-image-bg");
const heroOrb1 = document.querySelector(".hero-orb-1");
const heroOrb2 = document.querySelector(".hero-orb-2");
const heroOrb3 = document.querySelector(".hero-orb-3");
const heroContent = document.querySelector(".hero-content");
const sections = document.querySelectorAll("section");

// 3D / depth elements — each entry normalized to { el, depth }
const depthTargets = [
  { el: document.querySelector(".about-img-main"), depth: 1.15 },
  { el: document.querySelector(".about-img-accent"), depth: 0.75 },
  { el: document.querySelector(".weddings-main-img"), depth: 0.95 },
  { el: document.querySelector(".map-container"), depth: 0.8 },
  ...Array.from(
    document.querySelectorAll(
      ".room-card, .amenity-card, .testimonial-card, .weddings-feature, .contact-card, .wb-item, .g-item",
    ),
  ).map((el) => ({ el, depth: 1 })),
].filter((item) => item.el);

const isReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
let isMobile = window.matchMedia("(max-width: 768px)").matches;

// ============================================================
// HELPERS — MOBILE NAV
// ============================================================
function openMobileNav() {
  mobileNav.classList.add("open");
  hamburger?.classList.add("active");
  hamburger?.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMobileNav() {
  mobileNav.classList.remove("open");
  hamburger?.classList.remove("active");
  hamburger?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

// ============================================================
// HELPERS — LIGHTBOX
// ============================================================
function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
  lightboxImg.src = "";
}

// ============================================================
// HELPERS — FORM
// ============================================================
function handleForm(e) {
  e.preventDefault();
  const form = document.getElementById("enquiryForm");
  const success = document.getElementById("formSuccess");
  if (!form || !success) return;
  form.style.display = "none";
  success.style.display = "block";
}

// Expose for inline handlers in the HTML (onclick="openLightbox(...)" etc.)
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.handleForm = handleForm;

// ============================================================
// INTERACTIONS — NAV
// ============================================================
hamburger?.addEventListener("click", () => {
  if (mobileNav.classList.contains("open")) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
});

navClose?.addEventListener("click", closeMobileNav);
mobLinks.forEach((l) => l.addEventListener("click", closeMobileNav));

// Close mobile nav if window is resized up past the mobile breakpoint
window.addEventListener("resize", () => {
  isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (!isMobile && mobileNav.classList.contains("open")) {
    closeMobileNav();
  }
});

// ============================================================
// INTERACTIONS — LIGHTBOX & GLOBAL KEYS
// ============================================================
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
    closeMobileNav();
  }
});

// ============================================================
// SMOOTH ANCHOR SCROLLING
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    closeMobileNav();
    const offset = window.innerWidth <= 768 ? 66 : 74;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: isReducedMotion ? "auto" : "smooth" });
  });
});

// ============================================================
// SCROLL REVEAL OBSERVER
// ============================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);
revealEls.forEach((el) => revealObserver.observe(el));

// ============================================================
// LIGHTBOX GALLERY CLICK BINDING
// ============================================================
document.querySelectorAll(".g-item").forEach((item, index) => {
  const sources = [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1400&q=90",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=90",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=90",
    "https://images.unsplash.com/photo-1561501878-aabd62634533?w=1400&q=90",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1400&q=90",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&q=90",
    "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=1400&q=90",
  ];
  item.addEventListener("click", () =>
    openLightbox(sources[index] || sources[0]),
  );
  item.setAttribute("role", "button");
  item.setAttribute("tabindex", "0");
  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLightbox(sources[index] || sources[0]);
    }
  });
});

// ============================================================
// 3D SCROLL ENGINE — smooth lerped depth, parallax & tilt
// ============================================================
let currentScrollY = window.scrollY;
let targetScrollY = window.scrollY;
let engineRunning = false;

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateDepthTransforms() {
  if (isReducedMotion) {
    engineRunning = false;
    return;
  }

  // Smoothly ease toward the real scroll position for a buttery feel
  currentScrollY = lerp(currentScrollY, targetScrollY, 0.09);
  if (Math.abs(targetScrollY - currentScrollY) < 0.05) {
    currentScrollY = targetScrollY;
  }

  const vh = window.innerHeight || 1;

  // Navbar + scroll progress bar
  navbar?.classList.toggle("scrolled", currentScrollY > 60);
  if (scrollBar) {
    const docHeight = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    scrollBar.style.width = `${(currentScrollY / docHeight) * 100}%`;
  }

  // Hero cinematic depth
  const heroProgress = clamp(currentScrollY / vh, 0, 1);
  if (heroBg) {
    heroBg.style.setProperty("--hero-bg-y", `${currentScrollY * 0.18}px`);
  }
  if (heroOrb1) {
    heroOrb1.style.setProperty("--orb1-y", `${currentScrollY * 0.12}px`);
  }
  if (heroOrb2) {
    heroOrb2.style.setProperty("--orb2-y", `${-currentScrollY * 0.08}px`);
  }
  if (heroOrb3) {
    heroOrb3.style.setProperty("--orb3-y", `${currentScrollY * 0.04}px`);
  }
  if (heroContent) {
    heroContent.style.setProperty("--hero-shift", `${currentScrollY * 0.08}px`);
    heroContent.style.setProperty(
      "--hero-rx",
      `${(heroProgress * -2.2).toFixed(2)}deg`,
    );
  }

  // Section-card dynamic 3D tilt mapping
  const intensityBase = isMobile ? 0.3 : 1.4;

  depthTargets.forEach((target) => {
    const el = target.el;
    if (!el) return;

    const depth = target.depth || 1;
    const rect = el.getBoundingClientRect();

    const elementTopFromDoc = rect.top + window.scrollY;
    const center = elementTopFromDoc - currentScrollY + rect.height / 2;
    const offset = (center - vh / 2) / vh;
    const visible = 1 - clamp(Math.abs(offset) * 1.2, 0, 1);

    const lift = clamp(-offset * 40 * depth * intensityBase, -30, 30);
    const rx = clamp(-offset * 15 * depth * intensityBase, -18, 18);
    const ry = clamp(offset * 10 * depth * intensityBase, -12, 12);
    const scale = 1 + visible * 0.02 * depth;

    el.style.setProperty("--lift", `${lift.toFixed(2)}px`);
    el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    el.style.setProperty("--scale", `${scale.toFixed(3)}`);
  });

  // Gentle section tilt flag for the current viewport
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const inView = rect.top < vh && rect.bottom > 0;
    section.style.setProperty("--section-depth", inView ? "1" : "0");
  });

  // Keep the loop alive while the eased value is still catching up
  if (Math.abs(targetScrollY - currentScrollY) > 0.05) {
    window.requestAnimationFrame(updateDepthTransforms);
  } else {
    engineRunning = false;
  }
}

function requestEngineUpdate() {
  targetScrollY = window.scrollY;
  if (!engineRunning) {
    engineRunning = true;
    window.requestAnimationFrame(updateDepthTransforms);
  }
}

window.addEventListener("scroll", requestEngineUpdate, { passive: true });
window.addEventListener(
  "resize",
  () => {
    isMobile = window.matchMedia("(max-width: 768px)").matches;
    requestEngineUpdate();
  },
  { passive: true },
);

// Kick off the engine once on load so initial positions are correct
requestEngineUpdate();

// ============================================================
// OPTIONAL POINTER TILT FOR DESKTOP HERO
// ============================================================
if (!isReducedMotion && !isMobile) {
  window.addEventListener("pointermove", (e) => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const rx = ((e.clientY - cy) / cy) * -1.2;
    const ry = ((e.clientX - cx) / cx) * 1.2;
    heroContent?.style.setProperty("--hero-rx", `${rx.toFixed(2)}deg`);
    heroBg?.style.setProperty(
      "--hero-bg-y",
      `${Math.max(-18, Math.min(18, ry * 6))}px`,
    );
  });
}
