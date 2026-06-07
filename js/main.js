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
const toastContainer = document.getElementById("toast-container");
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
const TOAST_MAX = 3;

function showToast(message) {
  // Hard-remove oldest before adding new one to guarantee max on screen
  const all = toastContainer.querySelectorAll(".toast");
  if (all.length >= TOAST_MAX) {
    all[all.length - 1].remove();
  }

  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  toastContainer.prepend(el);

  void el.offsetHeight; // force reflow to trigger entrance transition
  el.classList.add("show");

  setTimeout(() => {
    el.classList.remove("show");
    el.addEventListener("transitionend", () => el.remove(), { once: true });
  }, 2800);
}

// ===== Form Submissions =====
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyzqVQeN_dN_yI-_TSjJpagtdiWlaK9-bOQw4_vcHVgXtHPxilJhJiMwvL69fFsI4ZXOg/exec";

const getSimpleUA = () => {
  const ua = navigator.userAgent;
  const browser =
    ua.match(/(Chrome|Firefox|Safari|Edge|OPR)\/[\d.]+/)?.[0] ?? "Unknown";
  const os =
    ua.match(
      /(Windows NT[\s\d.]+|Mac OS X[\s\d_]+|Linux|Android[\s\d.]+|like Mac OS X)/,
    )?.[0] ?? "Unknown";
  return `${browser}|${os}`;
};

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

function isValidUrl(value) {
  // Accept bare domains (e.g. amazon.com) or full URLs with protocol
  const bare = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
  try {
    const withProtocol = /^https?:\/\//i.test(value) ? value : "https://" + value;
    new URL(withProtocol);
    return bare.test(value) || /^https?:\/\//i.test(value);
  } catch {
    return false;
  }
}

const FORM_COOLDOWN_MS = 8000;

function lockForm(form) {
  const btn = form.querySelector("button[type='submit']");
  btn.disabled = true;
  setTimeout(() => { btn.disabled = false; }, FORM_COOLDOWN_MS);
}

wishlistForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = wishlistForm.querySelector("button[type='submit']");
  if (btn.disabled) return;
  const url = document.getElementById("wishlistInput").value.trim();
  const desc = document.getElementById("wishlistDescInput").value.trim();
  const hp = document.getElementById("wishlistHp").value;
  if (!url) {
    showToast(translations[currentLang]["toast_error_required"]);
    return;
  }
  if (!isValidUrl(url)) {
    showToast(translations[currentLang]["toast_error_url"]);
    return;
  }
  lockForm(wishlistForm);
  showToast(translations[currentLang]["toast_wishlist"]);
  wishlistForm.reset();
  await submitToSheet({
    type: "wishlist",
    wishlistInput: url,
    wishlistDescInput: desc,
    hp,
    ts: window._formLoadTime,
    lang: currentLang,
    ua: getSimpleUA(),
  });
});

feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = feedbackForm.querySelector("button[type='submit']");
  if (btn.disabled) return;
  const text = document.getElementById("feedbackInput").value.trim();
  const hp = document.getElementById("feedbackHp").value;
  if (!text) {
    showToast(translations[currentLang]["toast_error_required"]);
    return;
  }
  lockForm(feedbackForm);
  showToast(translations[currentLang]["toast_feedback"]);
  feedbackForm.reset();
  await submitToSheet({
    type: "feedback",
    feedbackInput: text,
    hp,
    ts: window._formLoadTime,
    lang: currentLang,
    ua: getSimpleUA(),
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
  track.addEventListener("transitionend", (e) => {
    if (e.target !== track) return;
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

// ===== Try It — GIF Follower =====
(function () {
  const gifCount = 28;
  const follower = document.getElementById("gifFollower");
  const followerImg = document.getElementById("gifFollowerImg");
  if (!follower || !followerImg) return;

  const tryBtns = document.querySelectorAll(".try-it-btn");
  if (!tryBtns.length) return;

  let currentGifIndex = null;
  let gifCycleTimer = null;
  let mouseX = 0;
  let mouseY = 0;
  let rafId = null;

  function randomGifIndex(exclude) {
    let idx;
    do { idx = Math.floor(Math.random() * gifCount) + 1; } while (idx === exclude);
    return idx;
  }

  function loadGif(index) {
    followerImg.src = `images/gif/${index}.gif`;
    currentGifIndex = index;
  }

  function startCycle() {
    const idx = randomGifIndex(currentGifIndex);
    loadGif(idx);
    gifCycleTimer = setInterval(() => {
      const next = randomGifIndex(currentGifIndex);
      loadGif(next);
    }, 5000);
  }

  function stopCycle() {
    clearInterval(gifCycleTimer);
    gifCycleTimer = null;
  }

  function trackMouse(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function animateFollower() {
    follower.style.transform = `translate(calc(${mouseX}px + 20px), calc(${mouseY}px - 50%))`;
    rafId = requestAnimationFrame(animateFollower);
  }

  tryBtns.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      follower.classList.add("visible");
      startCycle();
      rafId = requestAnimationFrame(animateFollower);
    });

    btn.addEventListener("mouseleave", () => {
      follower.classList.remove("visible");
      stopCycle();
      cancelAnimationFrame(rafId);
    });

    btn.addEventListener("click", () => {
      showToast(translations[currentLang]["toast_try_it"]);
    });
  });

  document.addEventListener("mousemove", trackMouse);
})();
