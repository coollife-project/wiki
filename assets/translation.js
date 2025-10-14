// ============================
// 🌍 CoolLIFE Wiki Free Translation System (Final Guaranteed)
// ============================

// Load the free Google Translate widget
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages:
        'bg,hr,cs,da,nl,et,fi,fr,de,el,hu,ga,it,lv,lt,mt,pl,pt,ro,sk,sl,es,sv',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    },
    'google_translate_container'
  );
}

// ============================
// 🌐 WikiTranslator Class
// ============================
class WikiTranslator {
  constructor() {
    this.euLanguages = [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'bg', name: 'Български', flag: '🇧🇬' },
      { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
      { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
      { code: 'da', name: 'Dansk', flag: '🇩🇰' },
      { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
      { code: 'et', name: 'Eesti', flag: '🇪🇪' },
      { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
      { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
      { code: 'ga', name: 'Gaeilge', flag: '🇮🇪' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' },
      { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
      { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
      { code: 'mt', name: 'Malti', flag: '🇲🇹' },
      { code: 'pl', name: 'Polski', flag: '🇵🇱' },
      { code: 'pt', name: 'Português', flag: '🇵🇹' },
      { code: 'ro', name: 'Română', flag: '🇷🇴' },
      { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
      { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    ];

    this.currentLanguage = 'en';
    this.start();
  }

  start() {
    this.waitForHeader(() => {
      this.addLanguageDropdown();
      this.setupEventListeners();
      this.loadSavedLanguage();
    });
  }

  // Wait until MkDocs header is ready
  waitForHeader(callback) {
    const checkHeader = () => {
      const header =
        document.querySelector('.md-header__inner') ||
        document.querySelector('.md-header') ||
        document.querySelector('header');
      const themeToggle = document.querySelector(
        '.md-header__button[title*="theme"], .md-header__button[aria-label*="theme"]'
      );
      if (header) {
        callback(header, themeToggle);
      } else {
        setTimeout(checkHeader, 300);
      }
    };
    checkHeader();
  }

  addLanguageDropdown() {
    const header =
      document.querySelector('.md-header__inner') ||
      document.querySelector('.md-header') ||
      document.querySelector('header');
    if (!header) {
      console.warn('⚠️ Header not found.');
      return;
    }

    const dropdownHTML = `
      <div class="language-dropdown">
        <button class="language-button" id="languageButton">
          <span id="currentFlag">🇬🇧</span>
          <span id="currentLanguage">English</span>
          <span class="arrow">▼</span>
        </button>
        <div class="language-menu" id="languageMenu">
          ${this.euLanguages
            .map(
              (lang) => `
            <div class="language-option" data-code="${lang.code}">
              <span class="flag-menu">${lang.flag}</span>
              <span class="language-name">${lang.name}</span>
            </div>`
            )
            .join('')}
        </div>
      </div>
      <div id="google_translate_container" style="display:none;"></div>
    `;

    const themeToggle = document.querySelector(
      '.md-header__button[title*="theme"], .md-header__button[aria-label*="theme"]'
    );
    if (themeToggle && themeToggle.parentElement) {
      themeToggle.parentElement.insertAdjacentHTML('beforebegin', dropdownHTML);
    } else {
      header.insertAdjacentHTML('beforeend', dropdownHTML);
    }

    console.log('✅ Language dropdown successfully added');
  }

  setupEventListeners() {
    const button = document.getElementById('languageButton');
    const menu = document.getElementById('languageMenu');

    if (button) {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.style.display =
          menu.style.display === 'block' ? 'none' : 'block';
      });
    }

    if (menu) {
      menu.addEventListener('click', (e) => {
        const option = e.target.closest('.language-option');
        if (option) {
          const code = option.dataset.code;
          const lang = this.euLanguages.find((l) => l.code === code);
          if (lang) this.selectLanguage(lang);
        }
      });
    }

    document.addEventListener('click', () => {
      if (menu) menu.style.display = 'none';
    });
  }

  selectLanguage(language) {
    document.getElementById('currentLanguage').textContent = language.name;
    document.getElementById('currentFlag').textContent = language.flag;
    localStorage.setItem('coollife-wiki-language', language.code);
    this.translateContent(language.code);
  }

  loadSavedLanguage() {
    const saved = localStorage.getItem('coollife-wiki-language');
    if (saved && saved !== 'en') this.translateContent(saved);
  }

  async translateContent(targetLang) {
    if (targetLang === 'en') {
      window.location.reload();
      return;
    }

    const select = document.querySelector('.goog-te-combo');
    if (!select) {
      console.warn('⚠️ Google Translate widget not ready yet.');
      return;
    }

    select.value = targetLang;
    select.dispatchEvent(new Event('change'));
    console.log(`🌍 Page translated to ${targetLang}`);
  }
}

new WikiTranslator();

// Hide Google Translate banner
const style = document.createElement('style');
style.innerHTML = `
  .goog-te-banner-frame.skiptranslate,
  .goog-te-gadget-icon { display: none !important; }
  body { top: 0px !important; }
`;
document.head.appendChild(style);
