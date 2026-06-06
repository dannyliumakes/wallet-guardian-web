/* ============================================================
   Wallet Guardian — JavaScript
   ============================================================ */

// ===== i18n Translations =====
// Imported from js/translations.js

// ===== State =====
let currentLang = "zh-TW";
window._formLoadTime = Date.now();

// ===== DOM refs =====
const htmlEl = document.documentElement;
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const langDesk = document.getElementById("langSwitcherDesktop");
const langMob = document.getElementById("langSwitcherMobile");
const toastEl = document.getElementById("toast");
const wishlistForm = document.getElementById("wishlistForm");
const feedbackForm = document.getElementById("feedbackForm");

// ===== i18n apply =====
function applyLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  // Update html lang attribute
  htmlEl.setAttribute("lang", lang === "zh-TW" ? "zh-TW" : "en");
  htmlEl.setAttribute("data-lang", lang);

  // Update all [data-i18n] elements
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  // Update all [data-i18n-placeholder] elements
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key] !== undefined) {
      el.setAttribute("placeholder", t[key]);
    }
  });

  // Update active language visual indicator
  document.querySelectorAll(".lang-option").forEach((el) => {
    el.classList.toggle("active", el.getAttribute("data-lang") === lang);
  });
}

// ===== Language Switcher =====
function toggleLanguage(e) {
  e.stopPropagation();
  const nextLang = currentLang === "zh-TW" ? "en" : "zh-TW";
  applyLanguage(nextLang);
}

langDesk.addEventListener("click", toggleLanguage);
langMob.addEventListener("click", toggleLanguage);

// ===== Mobile Menu =====
const closeMobileNav = () => {
  mobileNav.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
};

menuToggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen);
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

// ===== Smooth Anchor Scroll =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// ===== Toast Notification =====
let toastTimeout = null;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2800);
}

// ===== Form Submissions =====
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwuacZLt99sfZXJ8OlTRAs5Eih1K3sCKXxf-hvhMTp5f_4jYj7HR-v0l8ZZlNTUmL9agg/exec";

const submitToSheet = async (payload) => {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("Form submission failed:", err);
  }
};

wishlistForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = document.getElementById("wishlistInput").value.trim();
  const desc = document.getElementById("wishlistDescInput").value.trim();
  const hp = document.getElementById("wishlistHp").value;
  if (!url) {
    showToast(translations[currentLang]["toast_error_required"]);
    return;
  }
  showToast(translations[currentLang]["toast_wishlist"]);
  wishlistForm.reset();
  await submitToSheet({
    type: "wishlist",
    wishlistInput: url,
    wishlistDescInput: desc,
    hp,
    ts: window._formLoadTime,
    lang: currentLang,
    ua: navigator.userAgent,
  });
});

feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = document.getElementById("feedbackInput").value.trim();
  const hp = document.getElementById("feedbackHp").value;
  if (!text) {
    showToast(translations[currentLang]["toast_error_required"]);
    return;
  }
  showToast(translations[currentLang]["toast_feedback"]);
  feedbackForm.reset();
  await submitToSheet({
    type: "feedback",
    feedbackInput: text,
    hp,
    ts: window._formLoadTime,
    lang: currentLang,
    ua: navigator.userAgent,
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) closeMobileNav();
});

// ===== Carousel =====
(function initCarousel() {
  const track = document.querySelector("[data-carousel-track]");
  const slides = track
    ? Array.from(track.querySelectorAll(".carousel-slide"))
    : [];
  const dots = document.querySelectorAll(".carousel-dot");
  if (!track || slides.length === 0) return;

  const INTERVAL_MS = 4000;
  const totalSlides = slides.length;
  let currentIndex = 0;

  // Clone first slide and append — enables seamless rightward infinite loop
  const firstClone = slides[0].cloneNode(true);
  firstClone.classList.remove("active");
  track.appendChild(firstClone);

  function updateActive(index) {
    const dotIndex = index % totalSlides;
    slides.forEach((slide, i) =>
      slide.classList.toggle("active", i === dotIndex),
    );
    dots.forEach((dot, i) => dot.classList.toggle("active", i === dotIndex));
  }

  function goTo(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
    updateActive(index);
  }

  function snapTo(index) {
    track.style.transition = "none";
    track.style.transform = `translateX(-${index * 100}%)`;
    track.getBoundingClientRect(); // force reflow before re-enabling transition
    track.style.transition = "";
    currentIndex = index;
    updateActive(index);
  }

  // After sliding to clone of slide 1, silently snap back to real slide 1
  track.addEventListener("transitionend", () => {
    if (currentIndex === totalSlides) snapTo(0);
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => goTo(Number(dot.dataset.index)));
  });

  // Continuous auto-play, no hover pause
  setInterval(() => goTo(currentIndex + 1), INTERVAL_MS);
})();

// ===== Init =====
applyLanguage("zh-TW");
