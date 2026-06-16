// ============================================================
// CORE UI
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

// 3D / depth elements
const depthTargets = [
  { el: document.querySelector(".about-img-main"), depth: 1.15 },
  { el: document.querySelector(".about-img-accent"), depth: 0.75 },
  { el: document.querySelector(".weddings-main-img"), depth: 0.95 },
  { el: document.querySelector(".map-container"), depth: 0.8 },
  ...document.querySelectorAll(
    ".room-card, .amenity-card, .testimonial-card, .weddings-feature, .contact-card, .wb-item, .g-item",
  ),
].flatMap((item) => (item?.el ? [item] : [{ el: item, depth: 1 }])); // normalize

const isReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const isMobile = window.matchMedia("(max-width: 768px)").matches;

// ============================================================
// HELPERS
// ============================================================
function closeMobileNav() {
  mobileNav.classList.remove("open");
  document.body.style.overflow = "";
}

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

// Make inline handlers work and keep things tidy
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.handleForm = handleForm;

// ============================================================
// INTERACTIONS
// ============================================================
hamburger?.addEventListener("click", () => {
  mobileNav.classList.add("open");
  document.body.style.overflow = "hidden";
});

navClose?.addEventListener("click", closeMobileNav);
mobLinks.forEach((l) => l.addEventListener("click", closeMobileNav));

lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
    closeMobileNav();
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
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
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);
revealEls.forEach((el) => revealObserver.observe(el));

// ============================================================
// FORM HANDLING
// ============================================================
function handleForm(e) {
  e.preventDefault();
  const form = document.getElementById("enquiryForm");
  const success = document.getElementById("formSuccess");
  if (!form || !success) return;
  form.style.display = "none";
  success.style.display = "block";
}

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
// 3D SCROLL ENGINE
// ============================================================
let ticking = false;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateDepthTransforms() {
  if (isReducedMotion) return;

  const vh = window.innerHeight || 1;
  const scrollY = window.scrollY || 0;

  // navbar + progress bar
  navbar?.classList.toggle("scrolled", scrollY > 60);
  if (scrollBar) {
    const docHeight = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    scrollBar.style.width = `${(scrollY / docHeight) * 100}%`;
  }

  // Hero depth
  const heroProgress = clamp(scrollY / vh, 0, 1);
  if (heroBg) heroBg.style.setProperty("--hero-bg-y", `${scrollY * 0.18}px`);
  if (heroOrb1) heroOrb1.style.setProperty("--orb1-y", `${scrollY * 0.12}px`);
  if (heroOrb2) heroOrb2.style.setProperty("--orb2-y", `${-scrollY * 0.08}px`);
  if (heroOrb3) heroOrb3.style.setProperty("--orb3-y", `${scrollY * 0.04}px`);
  if (heroContent) {
    heroContent.style.setProperty("--hero-shift", `${scrollY * 0.08}px`);
    heroContent.style.setProperty(
      "--hero-rx",
      `${(heroProgress * -2.2).toFixed(2)}deg`,
    );
  }

  // Section-card 3D transforms
  const intensityBase = isMobile ? 0.45 : 1;
  depthTargets.forEach((target, idx) => {
    const el = target?.el || target;
    if (!el) return;

    const depth = target.depth || 1;
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const offset = (center - vh / 2) / vh;
    const visible = 1 - clamp(Math.abs(offset) * 1.2, 0, 1);

    const lift = clamp(-offset * 28 * depth * intensityBase, -18, 18);
    const rx = clamp(-offset * 7 * depth * intensityBase, -7.5, 7.5);
    const ry = clamp(offset * 4 * depth * intensityBase, -4.5, 4.5);
    const scale = 1 + visible * 0.012 * depth;

    el.style.setProperty("--lift", `${lift.toFixed(2)}px`);
    el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    el.style.setProperty("--scale", `${scale.toFixed(3)}`);
  });

  // Gentle section tilt for the current viewport
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const inView = rect.top < vh && rect.bottom > 0;
    section.style.setProperty("--section-depth", inView ? "1" : "0");
  });

  ticking = false;
}

function requestUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updateDepthTransforms);
    ticking = true;
  }
}

window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", requestUpdate);
requestUpdate();

// ============================================================
// OPTIONAL POINTER TILT FOR DESKTOP
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
