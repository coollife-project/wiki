// ============================
// 🌍 CoolLIFE Wiki Free Translation System
// ============================

// Load the free Google Translate widget (silent)
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
    this.init();
  }

  // ========== INIT ==========
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    console.log('🔧 Setting up WikiTranslator...');
    this.addLanguageDropdown();
    this.setupEventListeners();
    this.loadSavedLanguage();
  }

  // ========== DROPDOWN CREATION ==========
  addLanguageDropdown() {
    const header =
      document.querySelector('.md-header__inner') ||
      document.querySelector('.md-header') ||
      document.querySelector('header');

    if (!header) {
      console.warn('⚠️ Could not find MkDocs header.');
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

    header.insertAdjacentHTML('beforeend', dropdownHTML);
    console.log('✅ Language dropdown added to header');
  }

  // ========== EVENT LISTENERS ==========
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
          if (lang) {
            this.selectLanguage(lang);
          }
        }
      });
    }

    document.addEventListener('click', () => {
      if (menu) menu.style.display = 'none';
    });
  }

  // ========== LANGUAGE SELECTION ==========
  async selectLanguage(language) {
    document.getElementById('currentLanguage').textContent = language.name;
    document.getElementById('currentFlag').textContent = language.flag;
    document.getElementById('languageMenu').style.display = 'none';

    if (language.code !== this.currentLanguage) {
      await this.translateContent(language.code);
      this.currentLanguage = language.code;
      this.saveCurrentLanguage();
    }
  }

  saveCurrentLanguage() {
    localStorage.setItem('coollife-wiki-language', this.currentLanguage);
  }

  loadSavedLanguage() {
    const savedLang = localStorage.getItem('coollife-wiki-language');
    if (savedLang && savedLang !== 'en') {
      const language = this.euLanguages.find(
        (lang) => lang.code === savedLang
      );
      if (language) {
        document.getElementById('currentFlag').textContent = language.flag;
        document.getElementById('currentLanguage').textContent =
          language.name;
        this.currentLanguage = savedLang;
        setTimeout(() => this.translateContent(savedLang), 500);
      }
    }
  }

  // ========== FREE TRANSLATION METHOD ==========
  async translateText(text, targetLang) {
    if (targetLang === 'en' || !text.trim()) {
      return text;
    }

    const select = document.querySelector('.goog-te-combo');
    if (!select) {
      console.warn('⚠️ Google Translate widget not yet initialized.');
      return text;
    }

    // Trigger the free translation via Google Translate widget
    select.value = targetLang;
    select.dispatchEvent(new Event('change'));

    console.log(`🌍 Triggered free translation to ${targetLang}.`);
    return text;
  }

  // ========== PAGE TRANSLATION ==========
  async translateContent(targetLang) {
    if (targetLang === 'en') {
      window.location.reload(); // reload page to restore original language
      return;
    }

    console.log(`🔄 Translating entire page to ${targetLang}...`);
    await this.translateText('dummy', targetLang);
  }
}

// Initialize translator
new WikiTranslator();

// Optional: Hide the top Google Translate banner
const style = document.createElement('style');
style.innerHTML = `
  .goog-te-banner-frame.skiptranslate,
  .goog-te-gadget-icon {
    display: none !important;
  }
  body {
    top: 0px !important;
  }
`;
document.head.appendChild(style);
