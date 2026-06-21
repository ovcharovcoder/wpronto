// ============================================
// ГЛОБАЛЬНІ ЗМІННІ ТА УТИЛІТИ
// ============================================

let currentLang = 'en';

/**
 * Плавний скрол до секції з відступом
 * @param {HTMLElement} element - цільовий елемент
 * @param {number} offset - відступ від верху (за замовчуванням 80px)
 */
function scrollToSectionWithOffset(element, offset = 80) {
  if (!element) return;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - offset;
  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
}

// ============================================
// СТВОРЕННЯ ПРАВОГО МЕНЮ НАВІГАЦІЇ (CODE MAP)
// ============================================

// Секції для навігації
const sections = [
  { id: 'section-hero', labelEn: 'Hero', labelUk: 'Головна' },
  { id: 'section-hero-features', labelEn: 'Benefits', labelUk: 'Переваги' },
  { id: 'section-system-reqs', labelEn: 'Requirements', labelUk: 'Вимоги' },
  { id: 'section-tech-stack', labelEn: 'Tech Stack', labelUk: 'Технології' },
  { id: 'section-features', labelEn: 'Features', labelUk: 'Можливості' },
  { id: 'section-how-it-works', labelEn: 'Get Started', labelUk: 'Розпочати' },
  {
    id: 'section-step-by-step',
    labelEn: 'Step by Step',
    labelUk: 'Інструкція',
  },
  { id: 'section-quick-guide', labelEn: 'Quick Guide', labelUk: 'Посібник' },
  { id: 'section-pro-tips', labelEn: 'Pro Tips', labelUk: 'Поради' },
  { id: 'section-faq', labelEn: 'FAQ', labelUk: 'FAQ' },
  { id: 'section-download-cta', labelEn: 'Download', labelUk: 'Завантажити' },
  {
    id: 'section-starter-themes',
    labelEn: 'Start themes',
    labelUk: 'Стартові теми',
  },
  { id: 'section-support', labelEn: 'Donate', labelUk: 'Підтримати' },
  { id: 'section-footer', labelEn: 'Footer', labelUk: 'Footer' },
];

// Створення десктопної навігації (права панель)
function buildDesktopNav() {
  const container = document.getElementById('sectionNav');
  if (!container) {
    console.warn('Element #sectionNav not found');
    return;
  }
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
      scrollToSectionWithOffset(el, 100);
    });

    container.appendChild(item);
  });
}

// Створення мобільної навігації (бургер-меню)
function buildMobileNav() {
  const container = document.getElementById('mobileNavItems');
  if (!container) {
    console.warn('Element #mobileNavItems not found');
    return;
  }
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
      scrollToSectionWithOffset(el, 80);
      closeMobileMenu();
    });

    container.appendChild(item);
  });
}

// Оновлення тексту в навігації при зміні мови
function updateNavLabels() {
  const lang = currentLang;

  document.querySelectorAll('.nav-label').forEach(label => {
    const en = label.getAttribute('data-label-en');
    const uk = label.getAttribute('data-label-uk');
    if (en && uk) label.textContent = lang === 'en' ? en : uk;
  });

  document.querySelectorAll('.mobile-nav-label').forEach(label => {
    const en = label.getAttribute('data-label-en');
    const uk = label.getAttribute('data-label-uk');
    if (en && uk) label.textContent = lang === 'en' ? en : uk;
  });
}

// ============================================
// ТЕМНА/СВІТЛА ТЕМА
// ============================================

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

// ============================================
// АКТИВНИЙ РОЗДІЛ (ВІДСТЕЖЕННЯ СКРОЛУ)
// ============================================

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

// ============================================
// МОБІЛЬНЕ МЕНЮ
// ============================================

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

// ============================================
// ПЕРЕКЛЮЧЕННЯ МОВИ
// ============================================

function updateLanguage(lang) {
  currentLang = lang;

  // Оновлення текстів з data-атрибутами
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) el.innerHTML = text;
  });

  // Оновлення кнопки теми
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

  // Оновлення кнопки мови
  const langBtnSpan = document.querySelector('#langToggle span');
  if (langBtnSpan)
    langBtnSpan.textContent = lang === 'en' ? 'Українська' : 'English';

  // Оновлення підказок (pro tips)
  const isEn = lang === 'en';
  document
    .querySelectorAll('.tip-text-en')
    .forEach(el => (el.style.display = isEn ? 'inline' : 'none'));
  document
    .querySelectorAll('.tip-text-uk')
    .forEach(el => (el.style.display = isEn ? 'none' : 'inline'));

  updateNavLabels();
  localStorage.setItem('language', lang);
}

const langToggle = document.getElementById('langToggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    updateLanguage(currentLang === 'en' ? 'uk' : 'en');
  });
}

// ============================================
// FAQ АКОРДЕОН
// ============================================

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

// ============================================
// DONATE MODAL
// ============================================

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
  if (e.key === 'Escape' && donateModal?.classList.contains('active'))
    closeModal();
});

// ============================================
// СКРОЛ ДО СЕКЦІЇ ПІДТРИМКИ
// ============================================

(function initDonateScroll() {
  const footerSupportLink = document.getElementById('footerSupportLink');
  const supportNavBtn = document.getElementById('supportNavBtn');
  const donateAnchor = document.getElementById('donateAnchor');

  function scrollToDonate(e) {
    e.preventDefault();
    if (donateAnchor) scrollToSectionWithOffset(donateAnchor, 80);
  }

  if (supportNavBtn) supportNavBtn.addEventListener('click', scrollToDonate);
  if (footerSupportLink)
    footerSupportLink.addEventListener('click', scrollToDonate);
})();

// ============================================
// AI ASSISTANT (6 ЗАПИТАНЬ)
// ============================================

(function initAIAssistant() {
  const QA_LIST = [
    {
      en: 'How to install WPronto on Windows?',
      uk: 'Як встановити WPronto на Windows?',
      answerEn:
        'Download <strong>WPronto_3.0.zip</strong> and extract it. Run <code>WPronto.exe</code> as Administrator and install (for example, to <code>C:\\WPronto</code>). If SmartScreen blocks it, click <strong>More → Run anyway</strong>. Done!',
      answerUk:
        'Завантажте <strong>WPronto_3.0.zip</strong> та розархівуйте. Запустіть <code>WPronto.exe</code> від імені Адміністратора та встановіть (наприклад на <code>C:\\WPronto</code>). Якщо SmartScreen блокує, натисніть <strong>Докладніше → Все одно запустити</strong>. Готово!',
    },
    {
      en: 'How to create a new WordPress site?',
      uk: 'Як створити новий WordPress сайт?',
      answerEn:
        'Start the server (green indicator), click <strong>Create</strong> (or <kbd>Ctrl+Shift+C</kbd>), enter project name. WPronto auto-creates database and local domain. Then complete WordPress 5-minute installation.',
      answerUk:
        'Запустіть сервер (зелений індикатор), натисніть <strong>Create</strong> (або <kbd>Ctrl+Shift+C</kbd>), введіть назву проєкту. WPronto автоматично створить БД та локальний домен. Потім виконайте встановлення WordPress.',
    },
    {
      en: 'How to backup and restore my project?',
      uk: 'Як зробити бекап та відновити проєкт?',
      answerEn:
        'Select project → click <strong>Backup</strong> (<kbd>Ctrl+Shift+B</kbd>). Full backup saved to <code>WPronto/backups/</code>. To restore: select site → <strong>Restore</strong> → choose backup. If site was deleted, create new with exact name then restore.',
      answerUk:
        'Виберіть проєкт → натисніть <strong>Backup</strong> (<kbd>Ctrl+Shift+B</kbd>). Повний бекап зберігається в <code>WPronto/backups/</code>. Відновлення: виберіть сайт → <strong>Restore</strong> → оберіть бекап. Якщо сайт видалено — створіть новий з такою ж назвою, потім відновіть.',
    },
    {
      en: 'What are default database credentials?',
      uk: 'Які дані для входу до бази даних?',
      answerEn:
        'Username: <code>root</code><br>Password: <em>(empty, leave blank)</em><br>Access via built-in phpMyAdmin (<kbd>Ctrl+Shift+P</kbd>).',
      answerUk:
        'Логін: <code>root</code><br>Пароль: <em>(порожній, залиште поле пустим)</em><br>Доступ через вбудований phpMyAdmin (<kbd>Ctrl+Shift+P</kbd>).',
    },
    {
      en: 'Can I use WPronto for PHP learning without WordPress?',
      uk: 'Чи можна використовувати WPronto для вивчення PHP без WordPress?',
      answerEn:
        'Absolutely! Create a project named exactly <code>php</code>. WPronto will skip WordPress installation and database. Then edit files in <code>WPronto/www/php/</code> and access via <strong>Open Admin</strong>. Error reporting is pre-enabled.',
      answerUk:
        'Так! Створіть проєкт з назвою <code>php</code>. WPronto пропустить встановлення WordPress та БД. Редагуйте файли в <code>WPronto/www/php/</code> та відкривайте <strong>Open Admin</strong>. Показ помилок вже ввімкнено.',
    },
    {
      en: 'How to update PHP version in WPronto?',
      uk: 'Як оновити версію PHP у WPronto?',
      answerEn:
        'Download PHP (x64, non-thread-safe) from windows.php.net. Replace contents of <code>WPronto/core/php</code> folder with new files. Ensure required extensions (mysqli, curl) are enabled. Restart server.',
      answerUk:
        'Завантажте PHP (x64, non-thread-safe) з windows.php.net. Замініть вміст папки <code>WPronto/core/php</code> новими файлами. Переконайтесь, що потрібні розширення (mysqli, curl) активні. Перезапустіть сервер.',
    },
  ];

  // DOM елементи
  const elements = {
    questionsPanel: document.getElementById('assistantQuestionsPanel'),
    avatarBtn: document.getElementById('assistantAvatarBtn'),
    closePanelBtn: document.getElementById('closeQuestionsPanelBtn'),
    questionsList: document.getElementById('assistantQuestionsList'),
    answerPanel: document.getElementById('assistantAnswerPanel'),
    answerTitle: document.getElementById('assistantAnswerTitle'),
    answerText: document.getElementById('assistantAnswerText'),
    closeAnswerBtn: document.getElementById('closeAnswerPanelBtn'),
    inviteText: document.getElementById('assistantInviteText'),
    mobileOverlay: document.getElementById('assistantOverlay'),
  };

  // Поточна мова
  let assistantLang = 'en';
  try {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'uk') assistantLang = 'uk';
  } catch (e) {}

  // Закриття панелі запитань
  function closeQuestionsPanel() {
    elements.questionsPanel?.classList.remove('open');
    elements.mobileOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Відкриття панелі запитань
  function openQuestionsPanel() {
    elements.questionsPanel?.classList.add('open');
    if (elements.mobileOverlay && window.innerWidth <= 768) {
      elements.mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // Оновлення тексту запрошення
  function updateInviteText() {
    if (elements.inviteText) {
      elements.inviteText.textContent =
        assistantLang === 'uk' ? 'Питання є?' : 'Do you have a question?';
    }
  }

  // Відображення списку запитань
  function renderQuestions() {
    if (!elements.questionsList) return;
    elements.questionsList.innerHTML = '';

    QA_LIST.forEach(item => {
      const li = document.createElement('li');
      li.className = 'question-item';
      li.innerHTML = `<i class="fas fa-question-circle"></i><span>${assistantLang === 'uk' ? item.uk : item.en}</span>`;

      li.addEventListener('click', () => {
        const questionText = assistantLang === 'uk' ? item.uk : item.en;
        const answerContent =
          assistantLang === 'uk' ? item.answerUk : item.answerEn;
        if (elements.answerTitle)
          elements.answerTitle.innerHTML = `<i class="fas fa-robot"></i> ${questionText}`;
        if (elements.answerText) elements.answerText.innerHTML = answerContent;
        elements.answerPanel?.classList.add('open');
        closeQuestionsPanel();
      });

      elements.questionsList.appendChild(li);
    });
  }

  // Стеження за зміною мови
  function watchLanguageChange() {
    setInterval(() => {
      try {
        const newLang = localStorage.getItem('language') === 'uk' ? 'uk' : 'en';
        if (newLang !== assistantLang) {
          assistantLang = newLang;
          renderQuestions();
          updateInviteText();
        }
      } catch (e) {}
    }, 300);
  }

  // Оверлей для мобільних
  if (elements.mobileOverlay) {
    elements.mobileOverlay.addEventListener('click', closeQuestionsPanel);
  }

  // Аватар - відкриття/закриття
  if (elements.avatarBtn) {
    elements.avatarBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (elements.questionsPanel?.classList.contains('open')) {
        closeQuestionsPanel();
      } else {
        openQuestionsPanel();
      }
    });
  }

  // Кнопка закриття панелі
  if (elements.closePanelBtn) {
    elements.closePanelBtn.addEventListener('click', e => {
      e.stopPropagation();
      closeQuestionsPanel();
    });
  }

  // Кнопка закриття відповіді
  if (elements.closeAnswerBtn) {
    elements.closeAnswerBtn.addEventListener('click', () => {
      elements.answerPanel?.classList.remove('open');
    });
  }

  // Закриття при зміні розміру вікна
  window.addEventListener('resize', () => {
    if (
      window.innerWidth > 768 &&
      elements.questionsPanel?.classList.contains('open')
    ) {
      closeQuestionsPanel();
    }
    if (window.innerWidth > 768 && elements.mobileOverlay) {
      elements.mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Закриття при кліку поза панеллю (тільки десктоп)
  document.addEventListener('click', e => {
    if (
      window.innerWidth > 768 &&
      elements.questionsPanel?.classList.contains('open')
    ) {
      if (
        !elements.questionsPanel.contains(e.target) &&
        !elements.avatarBtn?.contains(e.target)
      ) {
        closeQuestionsPanel();
      }
    }
  });

  // Закриття по Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      elements.answerPanel?.classList.remove('open');
      if (elements.questionsPanel?.classList.contains('open'))
        closeQuestionsPanel();
    }
  });

  // Ініціалізація
  renderQuestions();
  updateInviteText();
  watchLanguageChange();
})();

// ============================================
// ІНІЦІАЛІЗАЦІЯ ПРИ ЗАВАНТАЖЕННІ
// ============================================

// Перевірка наявності елемента #sectionNav перед створенням навігації
document.addEventListener('DOMContentLoaded', () => {
  // Створюємо контейнер для правої навігації, якщо він відсутній
  if (!document.getElementById('sectionNav')) {
    const navContainer = document.createElement('div');
    navContainer.id = 'sectionNav';
    navContainer.className = 'section-nav';
    document.body.appendChild(navContainer);
  }

  const savedLang = localStorage.getItem('language');
  currentLang = savedLang === 'uk' ? 'uk' : 'en';

  buildDesktopNav();
  buildMobileNav();
  updateLanguage(currentLang);

  window.addEventListener('scroll', updateActiveSection);
  window.addEventListener('resize', updateActiveSection);
  updateActiveSection();

  // Мобільне меню
  document
    .getElementById('mobileNavBtn')
    ?.addEventListener('click', openMobileMenu);
  document
    .getElementById('mobileNavClose')
    ?.addEventListener('click', closeMobileMenu);
  document
    .getElementById('mobileNavOverlay')
    ?.addEventListener('click', closeMobileMenu);

  // Підтримка лінка в футері
  document
    .getElementById('footerSupportLinkBottom')
    ?.addEventListener('click', e => {
      e.preventDefault();
      const donateAnchor = document.getElementById('donateAnchor');
      if (donateAnchor) scrollToSectionWithOffset(donateAnchor, 80);
    });
});
