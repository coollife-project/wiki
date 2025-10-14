// =====================
// 🌍 CoolLIFE WikiTranslator (Free MyMemory API + Batch Translation)
// =====================

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
        this.originalContent = new Map();
        this.init();
    }

    // =====================
    // 🌐 INIT + SETUP
    // =====================

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        console.log('Setting up WikiTranslator...');
        this.addLanguageDropdown();
        this.setupEventListeners();
        this.loadSavedLanguage();
    }

    addLanguageDropdown() {
        const header = document.querySelector('.md-header__inner') ||
                       document.querySelector('.md-header') ||
                       document.querySelector('header');
        if (!header) return console.warn('Header element not found.');

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
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        header.insertAdjacentHTML('beforeend', dropdownHTML);
    }

    setupEventListeners() {
        const button = document.getElementById('languageButton');
        const menu = document.getElementById('languageMenu');
        if (!button || !menu) return;

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });

        menu.addEventListener('click', (e) => {
            const option = e.target.closest('.language-option');
            if (!option) return;
            const code = option.dataset.code;
            const lang = this.euLanguages.find(l => l.code === code);
            if (lang) this.selectLanguage(lang);
        });

        document.addEventListener('click', () => (menu.style.display = 'none'));
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

    // =====================
    // ⚙️ TRANSLATION LOGIC
    // =====================

    async translateContent(targetLang) {
        if (targetLang === 'en') {
            this.restoreOriginalContent();
            return;
        }

        this.showLoadingIndicator();

        try {
            const selectors = [
                '.md-content h1', '.md-content h2', '.md-content h3',
                '.md-content h4', '.md-content h5', '.md-content h6',
                '.md-content p', '.md-content li',
                '.md-nav__title', '.md-nav__link', '.md-toc__link'
            ];

            const allElements = [];
            for (const selector of selectors) {
                document.querySelectorAll(selector).forEach(el => {
                    if (!el.closest('.language-dropdown') && el.textContent.trim().length > 1) {
                        allElements.push(el);
                    }
                });
            }

            console.log(`🈶 Found ${allElements.length} elements to translate.`);

            const batchSize = 15;
            for (let i = 0; i < allElements.length; i += batchSize) {
                const batch = allElements.slice(i, i + batchSize);
                await this.translateBatch(batch, targetLang);
            }

        } catch (error) {
            console.error('❌ Translation failed:', error);
            alert('Translation failed. Please try again.');
        } finally {
            this.hideLoadingIndicator();
        }
    }

    async translateBatch(elements, targetLang) {
        const texts = [];
        const keys = [];

        for (const el of elements) {
            const key = this.getElementKey(el);
            if (!this.originalContent.has(key)) this.originalContent.set(key, el.textContent);
            keys.push(key);
            texts.push(this.originalContent.get(key));
        }

        const translations = await this.translateTexts(texts, targetLang);

        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            const translated = translations[i] || texts[i];
            if (translated === texts[i]) {
                const retry = await this.translateText(texts[i], targetLang);
                el.textContent = retry || texts[i];
            } else {
                el.textContent = translated;
            }
        }
    }

    // 🚀 Batch translation using MyMemory (free API)
    async translateTexts(texts, targetLang) {
        if (!texts.length) return [];
        const joined = texts.join('\n');
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(joined)}&langpair=en|${targetLang}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const raw = data?.responseData?.translatedText;
            if (!raw) return texts;

            const split = raw.split('\n');
            if (split.length === texts.length) return split;
            return texts.map((t, i) => split[i] || t);
        } catch (e) {
            console.error('Batch translation failed:', e);
            return texts;
        }
    }

    // Fallback for single lines
    async translateText(text, targetLang) {
        if (targetLang === 'en' || !text.trim()) return text;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data?.responseData?.translatedText || text;
        } catch {
            return text;
        }
    }

    // =====================
    // 🧩 HELPERS
    // =====================

    restoreOriginalContent() {
        this.originalContent.forEach((content, key) => {
            const element = document.querySelector(`[data-translation-key="${key}"]`);
            if (element) element.textContent = content;
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
        Object.assign(indicator.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '20px 30px',
            borderRadius: '10px',
            fontSize: '16px',
            zIndex: 9999,
        });
        document.body.appendChild(indicator);
    }

    hideLoadingIndicator() {
        const indicator = document.getElementById('translationLoader');
        if (indicator) indicator.remove();
    }
}

// Initialize
new WikiTranslator();
