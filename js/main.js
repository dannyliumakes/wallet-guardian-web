/* ============================================================
   Wallet Guardian — JavaScript
   ============================================================ */

// ===== i18n Translations =====
const translations = {
  'zh-TW': {
    nav_how: '運作方式',
    nav_wishlist: '願望清單',
    nav_feedback: '意見回饋',
    add_chrome: 'Add to Chrome',
    hero_title: '讓憤怒的寵物守護你的錢包！',
    hero_desc_top: '還在衝動購物嗎？',
    hero_desc_mid: 'Wallet Guardian 讓你在下單前',
    hero_desc_bold: '多思考一下',
    hero_desc_end: '。',
    hero_desc_bottom: '當你準備剁手，憤怒的貓咪就會出現瞪著你。',
    demo_placeholder: '示範區域',
    how_title: '鄙視你的購物衝動！',
    how_desc: '每當你想要購物時，只要把滑鼠移動到「🛍️購買」或「🛒加入購物車」的按鈕上，貓貓與狗狗就會用鄙視的眼神看著你😾。',
    how_slide1_title: '偵測購物意圖',
    how_slide1_text: 'Wallet Guardian 會自動掃描你瀏覽的網頁，當你靠近「購買」或「加入購物車」按鈕時，系統立刻啟動警戒模式。',
    how_slide2_title: '寵物鄙視攻擊',
    how_slide2_text: '憤怒的貓貓或狗狗會跳出畫面，用鄙視的眼神盯著你，搭配嘲諷的文字，讓你重新思考這筆消費是否真的必要。',
    how_slide3_title: '理性消費覺醒',
    how_slide3_text: '在被寵物鄙視之後，你會冷靜下來並關閉分頁，不知不覺就省下了一筆錢。錢包守住了，謝謝貓狗！',
    wishlist_title: '願望清單 Wishlist',
    wishlist_desc: '想讓哪家網站也被鄙視？告訴我們，我們會派寵物去駐守！',
    wishlist_label: '網站名稱 / 網址',
    wishlist_submit: '提交願望',
    feedback_title: '意見回饋 Feedback',
    feedback_desc: '寵物罷工了？還是發現了什麼奇怪的 Bug？請務必回報給我們。',
    feedback_label: '發生了什麼事？',
    feedback_submit: '送出回饋',
    form_placeholder: '請詳細描述問題...',
    footer_privacy: '隱私權政策',
    footer_terms: '服務條款',
    footer_copy: '© 2024 Wallet Guardian',
    toast_wishlist: '感謝您的願望！我們會派寵物去駐守 🐱',
    toast_feedback: '感謝您的回饋！我們會立即處理 🐶'
  },
  en: {
    nav_how: 'How It Works',
    nav_wishlist: 'Wishlist',
    nav_feedback: 'Feedback',
    add_chrome: 'Add to Chrome',
    hero_title: 'Let Angry Pets Guard Your Wallet!',
    hero_desc_top: 'Still impulse shopping?',
    hero_desc_mid: 'Wallet Guardian makes you',
    hero_desc_bold: 'think twice',
    hero_desc_end: ' before checkout.',
    hero_desc_bottom: "When you're about to splurge, an angry cat will stare you down.",
    demo_placeholder: 'Demo',
    how_title: 'Judge Your Shopping Impulse!',
    how_desc:
      'Whenever you try to shop, just hover over the "🛍️ Buy" or "🛒 Add to Cart" button — cats and dogs will judge you with a disdainful stare 😾.',
    how_slide1_title: 'Detect Shopping Intent',
    how_slide1_text: 'Wallet Guardian automatically scans the pages you browse. When you hover near a "Buy" or "Add to Cart" button, the system immediately enters alert mode.',
    how_slide2_title: 'Pet Disdain Attack',
    how_slide2_text: 'An angry cat or dog pops up, staring at you with pure contempt, accompanied by sarcastic messages that make you rethink whether this purchase is really necessary.',
    how_slide3_title: 'Rational Awakening',
    how_slide3_text: 'After being judged by the pets, you calm down and close the tab, unknowingly saving money. Wallet protected — thank you, cats and dogs!',
    wishlist_title: 'Wishlist',
    wishlist_desc: 'Want another website to be guarded? Tell us and we\'ll send our pets to patrol!',
    wishlist_label: 'Website Name / URL',
    wishlist_submit: 'Submit Wish',
    feedback_title: 'Feedback',
    feedback_desc: 'Pets on strike? Found a weird bug? Please let us know!',
    feedback_label: 'What happened?',
    feedback_submit: 'Send Feedback',
    form_placeholder: 'Please describe the issue in detail...',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_copy: '© 2024 Wallet Guardian',
    toast_wishlist: "Thanks for your wish! We'll send a pet to patrol 🐱",
    toast_feedback: "Thanks for your feedback! We'll handle it right away 🐶"
  }
};

// ===== State =====
let currentLang = 'zh-TW';

// ===== DOM refs =====
const htmlEl = document.documentElement;
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const langDesk = document.getElementById('langSwitcherDesktop');
const langMob = document.getElementById('langSwitcherMobile');
const toastEl = document.getElementById('toast');
const wishlistForm = document.getElementById('wishlistForm');
const feedbackForm = document.getElementById('feedbackForm');

// ===== i18n apply =====
function applyLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  // Update html lang attribute
  htmlEl.setAttribute('lang', lang === 'zh-TW' ? 'zh-TW' : 'en');
  htmlEl.setAttribute('data-lang', lang);

  // Update all [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  // Update all [data-i18n-placeholder] elements
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) {
      el.setAttribute('placeholder', t[key]);
    }
  });

  // Update active language visual indicator
  document.querySelectorAll('.lang-option').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-lang') === lang);
  });
}

// ===== Language Switcher =====
function toggleLanguage(e) {
  e.stopPropagation();
  const nextLang = currentLang === 'zh-TW' ? 'en' : 'zh-TW';
  applyLanguage(nextLang);
}

langDesk.addEventListener('click', toggleLanguage);
langMob.addEventListener('click', toggleLanguage);

// ===== Mobile Menu =====
menuToggle.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav when a link is clicked
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Smooth Anchor Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== Toast Notification =====
let toastTimeout = null;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2800);
}

// ===== Form Submissions =====
wishlistForm.addEventListener('submit', e => {
  e.preventDefault();
  const t = translations[currentLang];
  showToast(t.toast_wishlist);
  wishlistForm.reset();
});

feedbackForm.addEventListener('submit', e => {
  e.preventDefault();
  const t = translations[currentLang];
  showToast(t.toast_feedback);
  feedbackForm.reset();
});

// ===== Close mobile nav on window resize (going desktop) =====
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    mobileNav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// ===== Carousel =====
(function initCarousel() {
  const track = document.querySelector('[data-carousel-track]');
  const slides = track ? Array.from(track.querySelectorAll('.carousel-slide')) : [];
  const dots = document.querySelectorAll('.carousel-dot');
  if (!track || slides.length === 0) return;

  const INTERVAL_MS = 4000;
  const totalSlides = slides.length;
  let currentIndex = 0;

  // Clone first slide and append — enables seamless rightward infinite loop
  const firstClone = slides[0].cloneNode(true);
  firstClone.classList.remove('active');
  track.appendChild(firstClone);

  function updateActive(index) {
    const dotIndex = index % totalSlides;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === dotIndex));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === dotIndex));
  }

  function goTo(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
    updateActive(index);
  }

  function snapTo(index) {
    track.style.transition = 'none';
    track.style.transform = `translateX(-${index * 100}%)`;
    track.getBoundingClientRect(); // force reflow before re-enabling transition
    track.style.transition = '';
    currentIndex = index;
    updateActive(index);
  }

  // After sliding to clone of slide 1, silently snap back to real slide 1
  track.addEventListener('transitionend', () => {
    if (currentIndex === totalSlides) snapTo(0);
  });

  // Dot click
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      goTo(idx);
    });
  });

  // Continuous auto-play, no hover pause
  setInterval(() => goTo(currentIndex + 1), INTERVAL_MS);
})();

// ===== Init =====
applyLanguage('zh-TW');