// ========== Глобальні змінні ==========
let currentLang = 'en';

// ========== THEME TOGGLE ==========
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  const icon = themeBtn.querySelector('i');
  const textSpan = themeBtn.querySelector('span');

  function updateTheme(isDark) {
    if (isDark) {
      document.body.classList.add('dark');
      if (icon) icon.className = 'fas fa-sun';
      if (textSpan)
        textSpan.textContent =
          currentLang === 'en' ? 'Light mode' : 'Світла тема';
    } else {
      document.body.classList.remove('dark');
      if (icon) icon.className = 'fas fa-moon';
      if (textSpan)
        textSpan.textContent =
          currentLang === 'en' ? 'Dark mode' : 'Темна тема';
    }
  }

  themeBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    updateTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  if (localStorage.getItem('theme') === 'dark') updateTheme(true);
}

// ========== LANGUAGE TOGGLE ==========
function updateLanguage(lang) {
  currentLang = lang;

  // Оновлюємо всі елементи з data-en/data-uk
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      el.innerHTML = text;
    }
  });

  // Оновлюємо текст кнопки теми
  const themeSpan = document.querySelector('#themeToggle span');
  if (themeSpan) {
    const isDark = document.body.classList.contains('dark');
    themeSpan.textContent =
      lang === 'en'
        ? isDark
          ? 'Light mode'
          : 'Dark mode'
        : isDark
          ? 'Світла тема'
          : 'Темна тема';
  }

  // Оновлюємо текст кнопки мови
  const langBtnSpan = document.querySelector('#langToggle span');
  if (langBtnSpan) {
    langBtnSpan.textContent = lang === 'en' ? 'Українська' : 'English';
  }

  // Оновлюємо Pro Tips (окремі блоки .tip-text-en/.tip-text-uk)
  if (lang === 'en') {
    document
      .querySelectorAll('.tip-text-en')
      .forEach(el => (el.style.display = 'inline'));
    document
      .querySelectorAll('.tip-text-uk')
      .forEach(el => (el.style.display = 'none'));
  } else {
    document
      .querySelectorAll('.tip-text-en')
      .forEach(el => (el.style.display = 'none'));
    document
      .querySelectorAll('.tip-text-uk')
      .forEach(el => (el.style.display = 'inline'));
  }

  localStorage.setItem('language', lang);
}

// Ініціалізація кнопки мови
const langToggle = document.getElementById('langToggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'uk' : 'en';
    updateLanguage(newLang);
  });
}

// Завантажуємо збережену мову
const savedLang = localStorage.getItem('language');
updateLanguage(savedLang === 'uk' ? 'uk' : 'en');

// ========== FAQ (акордеон) ==========
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', function () {
    const item = this.closest('.faq-item');
    const isActive = item.classList.contains('active');

    // Закриваємо всі інші
    document
      .querySelectorAll('.faq-item')
      .forEach(i => i.classList.remove('active'));
    // Відкриваємо поточний, якщо він був закритий
    if (!isActive) item.classList.add('active');
  });
});

// ========== DONATE MODAL ==========
const donateBtn = document.getElementById('donateBtn');
const donateModal = document.getElementById('donateModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.querySelector('.donate-modal-overlay');

function openModal() {
  if (donateModal) {
    donateModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if (donateModal) {
    donateModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (donateBtn) donateBtn.addEventListener('click', openModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

// Закриття по Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && donateModal?.classList.contains('active')) {
    closeModal();
  }
});

// ========== SCROLL TO DONATE SECTION ==========
// Скрол до секції донатів через якір
(function () {
  const footerSupportLink = document.getElementById('footerSupportLink');
  const supportNavBtn = document.getElementById('supportNavBtn');
  const donateAnchor = document.getElementById('donateAnchor');

  function scrollToDonate(e) {
    e.preventDefault();
    if (donateAnchor) {
      donateAnchor.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  if (supportNavBtn) {
    supportNavBtn.addEventListener('click', scrollToDonate);
    console.log('Support button initialized');
  }

  if (footerSupportLink) {
    footerSupportLink.addEventListener('click', scrollToDonate);
    console.log('Footer support link initialized');
  }
})();
