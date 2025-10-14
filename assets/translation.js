// ======================
// 🌍 WikiTranslator Free Version (MkDocs)
// ======================

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: 'bg,hr,cs,da,nl,et,fi,fr,de,el,hu,ga,it,lv,lt,mt,pl,pt,ro,sk,sl,es,sv',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    },
    'google_translate_container'
  );
}

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
      { code: 'sv', name: 'Svenska', flag: '🇸🇪' }
    ];
    this.currentLanguage = 'en';
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.addLanguageDropdown();
    this.setupEventListeners();
    this.loadSavedLanguage();
  }

  addLanguageDropdown() {
    const header =
      document.querySelector('.md-header__inner') ||
      document.querySelector('.md-header') ||
      document.querySelector('header');
    if (!header) return;

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
  }

  setupEventListeners() {
    const button = document.getElementById('languageButton');
    const menu = document.getElementById('languageMenu');

    if (button) {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
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
    this.saveCurrentLanguage(language.code);
    this.changeLanguage(language.code);
  }

  saveCurrentLanguage(lang) {
    localStorage.setItem('coollife-wiki-language', lang);
  }

  loadSavedLanguage() {
    const saved = localStorage.getItem('coollife-wiki-language');
    if (saved && saved !== 'en') this.changeLanguage(saved);
  }

  changeLanguage(langCode) {
    if (langCode === 'en') {
      this.googleTranslateClear();
    } else {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
      }
    }
  }

  googleTranslateClear() {
    const iframe = document.querySelector('.goog-te-banner-frame');
    if (iframe) {
      const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
      const restoreButton = innerDoc.querySelector('button');
      if (restoreButton) restoreButton.click();
    }
  }
}

new WikiTranslator();
