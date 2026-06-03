// ========== Глобальні змінні ==========
let currentLang = 'en';

// ========== ДОПОМІЖНА ФУНКЦІЯ ДЛЯ ПЛАВНОГО СКРОЛУ З ВІДСТУПОМ ==========
function scrollToSectionWithOffset(element, offset = 80) {
  if (!element) return;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}

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

// ========== SIDENAV (CODE MAP) NAVIGATION ==========
const sections = [
  { id: 'section-hero', labelEn: 'Hero', labelUk: 'Головна' },
  {
    id: 'section-hero-features',
    labelEn: 'Benefits',
    labelUk: 'Переваги',
  },
  { id: 'section-system-reqs', labelEn: 'Requirements', labelUk: 'Вимоги' },
  { id: 'section-tech-stack', labelEn: 'Tech Stack', labelUk: 'Технології' },
  { id: 'section-features', labelEn: 'Features', labelUk: 'Можливості' },
  { id: 'section-how-it-works', labelEn: 'Get Started', labelUk: 'Розпочати' },
  {
    id: 'section-step-by-step',
    labelEn: 'Step by Step',
    labelUk: 'Інструкція',
  },
  {
    id: 'section-quick-guide',
    labelEn: 'Quick Guide',
    labelUk: 'Посібник',
  },
  { id: 'section-pro-tips', labelEn: 'Pro Tips', labelUk: 'Поради' },
  { id: 'section-faq', labelEn: 'FAQ', labelUk: 'FAQ' },
  { id: 'section-download-cta', labelEn: 'Download', labelUk: 'Завантажити' },
  { id: 'section-support', labelEn: 'Support', labelUk: 'Підтримка' },
  { id: 'section-footer', labelEn: 'Footer', labelUk: 'Footer' },
];

function buildDesktopNav() {
  const container = document.getElementById('sectionNav');
  if (!container) return;
  container.innerHTML = '';
  sections.forEach(section => {
    const el = document.getElementById(section.id);
    if (!el) return;
    const item = document.createElement('a');
    item.href = `#${section.id}`;
    item.className = 'nav-dot-item';
    item.setAttribute('data-id', section.id);
    const initialLabel =
      currentLang === 'en' ? section.labelEn : section.labelUk;
    item.innerHTML = `<div class="nav-dot"></div><span class="nav-label" data-label-en="${section.labelEn}" data-label-uk="${section.labelUk}">${initialLabel}</span>`;
    item.addEventListener('click', e => {
      e.preventDefault();
      scrollToSectionWithOffset(el, 100); // Відступ 100px від верху
    });
    container.appendChild(item);
  });
}

function buildMobileNav() {
  const container = document.getElementById('mobileNavItems');
  if (!container) return;
  container.innerHTML = '';
  sections.forEach(section => {
    const el = document.getElementById(section.id);
    if (!el) return;
    const item = document.createElement('a');
    item.href = `#${section.id}`;
    item.className = 'mobile-nav-item';
    item.setAttribute('data-id', section.id);
    const initialLabel =
      currentLang === 'en' ? section.labelEn : section.labelUk;
    item.innerHTML = `<div class="mobile-nav-dot"></div><span class="mobile-nav-label" data-label-en="${section.labelEn}" data-label-uk="${section.labelUk}">${initialLabel}</span>`;
    item.addEventListener('click', e => {
      e.preventDefault();
      scrollToSectionWithOffset(el, 80); // Відступ 80px від верху
      closeMobileMenu();
    });
    container.appendChild(item);
  });
}

function updateNavLabels() {
  const lang = currentLang;
  document.querySelectorAll('.nav-label').forEach(label => {
    const en = label.getAttribute('data-label-en');
    const uk = label.getAttribute('data-label-uk');
    if (en && uk) {
      label.textContent = lang === 'en' ? en : uk;
    }
  });
  document.querySelectorAll('.mobile-nav-label').forEach(label => {
    const en = label.getAttribute('data-label-en');
    const uk = label.getAttribute('data-label-uk');
    if (en && uk) {
      label.textContent = lang === 'en' ? en : uk;
    }
  });
}

// ========== ФУНКЦІЯ ДЛЯ ВІДСТЕЖЕННЯ АКТИВНОГО РОЗДІЛУ ==========
// Залишаємо як було добре - з порогом 250px
function updateActiveSection() {
  const scrollPos = window.scrollY + 250;
  let activeId = null;

  for (const s of sections) {
    const el = document.getElementById(s.id);
    if (el) {
      const offsetTop = el.offsetTop;
      const offsetBottom = offsetTop + el.offsetHeight;

      if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
        activeId = s.id;
        break;
      }
    }
  }

  if (!activeId && sections.length > 0) {
    const lastSection = document.getElementById(
      sections[sections.length - 1].id,
    );
    if (
      lastSection &&
      window.scrollY + window.innerHeight >= document.body.scrollHeight - 50
    ) {
      activeId = sections[sections.length - 1].id;
    }
  }

  document.querySelectorAll('.nav-dot-item, .mobile-nav-item').forEach(item => {
    if (item.getAttribute('data-id') === activeId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function closeMobileMenu() {
  document.getElementById('mobileNavOverlay')?.classList.remove('active');
  document.getElementById('mobileNavPanel')?.classList.remove('active');
  document.body.style.overflow = '';
}

function openMobileMenu() {
  document.getElementById('mobileNavOverlay')?.classList.add('active');
  document.getElementById('mobileNavPanel')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// ========== LANGUAGE TOGGLE ==========
function updateLanguage(lang) {
  currentLang = lang;

  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      el.innerHTML = text;
    }
  });

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

  const langBtnSpan = document.querySelector('#langToggle span');
  if (langBtnSpan) {
    langBtnSpan.textContent = lang === 'en' ? 'Українська' : 'English';
  }

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

  updateNavLabels();
  localStorage.setItem('language', lang);
}

const langToggle = document.getElementById('langToggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'uk' : 'en';
    updateLanguage(newLang);
  });
}

// ========== FAQ (акордеон) ==========
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', function () {
    const item = this.closest('.faq-item');
    const isActive = item.classList.contains('active');

    document
      .querySelectorAll('.faq-item')
      .forEach(i => i.classList.remove('active'));
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

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && donateModal?.classList.contains('active')) {
    closeModal();
  }
});

// ========== SCROLL TO DONATE SECTION ==========
(function () {
  const footerSupportLink = document.getElementById('footerSupportLink');
  const supportNavBtn = document.getElementById('supportNavBtn');
  const donateAnchor = document.getElementById('donateAnchor');

  function scrollToDonate(e) {
    e.preventDefault();
    if (donateAnchor) {
      scrollToSectionWithOffset(donateAnchor, 80); // Відступ 80px від верху
    }
  }

  if (supportNavBtn) {
    supportNavBtn.addEventListener('click', scrollToDonate);
  }

  if (footerSupportLink) {
    footerSupportLink.addEventListener('click', scrollToDonate);
  }
})();

// ========== ІНІЦІАЛІЗАЦІЯ ==========
const savedLang = localStorage.getItem('language');
currentLang = savedLang === 'uk' ? 'uk' : 'en';

buildDesktopNav();
buildMobileNav();
updateLanguage(currentLang);

window.addEventListener('scroll', updateActiveSection);
window.addEventListener('resize', updateActiveSection);
updateActiveSection();

document
  .getElementById('mobileNavBtn')
  ?.addEventListener('click', openMobileMenu);
document
  .getElementById('mobileNavClose')
  ?.addEventListener('click', closeMobileMenu);
document
  .getElementById('mobileNavOverlay')
  ?.addEventListener('click', closeMobileMenu);

// Додатковий обробник для підтримки лінка в футері
document
  .getElementById('footerSupportLinkBottom')
  ?.addEventListener('click', e => {
    e.preventDefault();
    const donateAnchor = document.getElementById('donateAnchor');
    if (donateAnchor) {
      scrollToSectionWithOffset(donateAnchor, 80); // Відступ 80px від верху
    }
  });
