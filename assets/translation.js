// EU Language Translation for CoolLIFE Wiki
class WikiTranslator {
    constructor() {
        this.euLanguages = [
            { code: 'en', name: 'English', flag: '\uD83C\uDDEC\uD83C\uDDE7' },
            { code: 'bg', name: 'Български', flag: '\uD83C\uDDE7\uD83C\uDDEC' },
            { code: 'hr', name: 'Hrvatski', flag: '\uD83C\uDDED\uD83C\uDDF7' },
            { code: 'cs', name: 'Čeština', flag: '\uD83C\uDDE8\uD83C\uDDFF' },
            { code: 'da', name: 'Dansk', flag: '\uD83C\uDDE9\uD83C\uDDF0' },
            { code: 'nl', name: 'Nederlands', flag: '\uD83C\uDDF3\uD83C\uDDF1' },
            { code: 'et', name: 'Eesti', flag: '\uD83C\uDDEA\uD83C\uDDEA' },
            { code: 'fi', name: 'Suomi', flag: '\uD83C\uDDEB\uD83C\uDDEE' },
            { code: 'fr', name: 'Français', flag: '\uD83C\uDDEB\uD83C\uDDF7' },
            { code: 'de', name: 'Deutsch', flag: '\uD83C\uDDE9\uD83C\uDDEA' },
            { code: 'el', name: 'Ελληνικά', flag: '\uD83C\uDDEC\uD83C\uDDF7' },
            { code: 'hu', name: 'Magyar', flag: '\uD83C\uDDED\uD83C\uDDFA' },
            { code: 'ga', name: 'Gaeilge', flag: '\uD83C\uDDEE\uD83C\uDDEA' },
            { code: 'it', name: 'Italiano', flag: '\uD83C\uDDEE\uD83C\uDDF9' },
            { code: 'lv', name: 'Latviešu', flag: '\uD83C\uDDF1\uD83C\uDDFB' },
            { code: 'lt', name: 'Lietuvių', flag: '\uD83C\uDDF1\uD83C\uDDF9' },
            { code: 'mt', name: 'Malti', flag: '\uD83C\uDDF2\uD83C\uDDF9' },
            { code: 'pl', name: 'Polski', flag: '\uD83C\uDDF5\uD83C\uDDF1' },
            { code: 'pt', name: 'Português', flag: '\uD83C\uDDF5\uD83C\uDDF9' },
            { code: 'ro', name: 'Română', flag: '\uD83C\uDDF7\uD83C\uDDF4' },
            { code: 'sk', name: 'Slovenčina', flag: '\uD83C\uDDF8\uD83C\uDDF0' },
            { code: 'sl', name: 'Slovenščina', flag: '\uD83C\uDDF8\uD83C\uDDEE' },
            { code: 'es', name: 'Español', flag: '\uD83C\uDDEA\uD83C\uDDF8' },
            { code: 'sv', name: 'Svenska', flag: '\uD83C\uDDF8\uD83C\uDDEA' }
        ];

        this.currentLanguage = 'en';
        this.originalContent = new Map();
        this.init();
    }

    saveCurrentLanguage() {
        localStorage.setItem('coollife-wiki-language', this.currentLanguage);
    }

    loadSavedLanguage() {
        const savedLang = localStorage.getItem('coollife-wiki-language');
        if (savedLang && savedLang !== 'en') {
            const language = this.euLanguages.find(lang => lang.code === savedLang);
            if (language) {
                document.getElementById('currentFlag').textContent = language.flag;
                document.getElementById('currentLanguage').textContent = language.name;
                this.currentLanguage = savedLang;
                setTimeout(() => this.translateContent(savedLang), 500);
            }
        }
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        console.log('Setting up WikiTranslator');
        this.addLanguageDropdown();
        this.setupEventListeners();
        this.loadSavedLanguage();
    }

    addLanguageDropdown() {
        const header = document.querySelector('.md-header__inner') || 
                       document.querySelector('.md-header') ||
                       document.querySelector('header');
        if (!header) {
            console.warn('Could not find header element');
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
                    ${this.euLanguages.map(lang => `
                        <div class="language-option" data-code="${lang.code}">
                            <span class="flag-menu">${lang.flag}</span>
                            <span class="language-name">${lang.name}</span>
                        </div>`).join('')}
                </div>
            </div>
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
                    const lang = this.euLanguages.find(l => l.code === code);
                    if (lang) this.selectLanguage(lang);
                }
            });
        }

        document.addEventListener('click', () => {
            if (menu) menu.style.display = 'none';
        });
    }

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

    async translateContent(targetLang) {
        if (targetLang === 'en') {
            this.restoreOriginalContent();
            return;
        }

        this.showLoadingIndicator();

        try {
            const selectors = [
                '.md-content h1',
                '.md-content h2', 
                '.md-content h3',
                '.md-content h4',
                '.md-content h5',
                '.md-content h6',
                '.md-content p',
                '.md-content li',
                '.md-nav__title',
                '.md-nav__link',
                '.md-toc__link'
            ];

            let elements = [];
            for (const selector of selectors) {
                elements = [...elements, ...document.querySelectorAll(selector)];
            }

            // Filter valid translatable elements
            const textElements = elements.filter(el => {
                if (el.closest('.language-dropdown')) return false;
                if (el.querySelector('img, figure, iframe, video')) return false;
                return el.textContent.trim().length > 1;
            });

            // Cache originals
            textElements.forEach(el => {
                const key = this.getElementKey(el);
                if (!this.originalContent.has(key)) {
                    this.originalContent.set(key, el.innerHTML);
                }
            });

            // Collect all texts
            const texts = textElements.map(el => el.innerText.trim());

            // Batch translate all texts
            const translations = await this.batchTranslateText(texts, targetLang);

            // Apply translations
            textElements.forEach((el, i) => {
                if (translations[i]) el.innerText = translations[i];
            });

        } catch (error) {
            console.error('Translation failed:', error);
            alert('Translation failed. Please try again.');
        } finally {
            this.hideLoadingIndicator();
        }
    }

    // ✅ Batch translation using MyMemory
    async batchTranslateText(texts, targetLang) {
        if (!texts.length || targetLang === 'en') return texts;

        const joined = texts.join('\n');
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(joined)}&langpair=en|${targetLang}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            const translated = data?.responseData?.translatedText?.split('\n');
            return translated && translated.length === texts.length ? translated : texts;
        } catch (e) {
            console.error('Batch translation error:', e);
            return texts;
        }
    }

    restoreOriginalContent() {
        this.originalContent.forEach((content, key) => {
            const element = document.querySelector(`[data-translation-key="${key}"]`);
            if (element) element.innerHTML = content;
        });
    }

    getElementKey(element) {
        if (!element.dataset.translationKey) {
            element.dataset.translationKey = 'elem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        return element.dataset.translationKey;
    }

    showLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'translationLoader';
        indicator.innerHTML = `
            <div class="translation-loader">
                <div class="loader-spinner"></div>
                <span>Translating...</span>
            </div>
        `;
        document.body.appendChild(indicator);
    }

    hideLoadingIndicator() {
        const indicator = document.getElementById('translationLoader');
        if (indicator) indicator.remove();
    }
}

// Initialize translator
new WikiTranslator();
