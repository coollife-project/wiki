// ⚡ CoolLIFE Wiki – Optimized Full-Page Translator (MyMemory API)
// ✅ Uses image-based flags (FlagCDN) so they display on all systems

class WikiTranslator {
    constructor() {
        this.euLanguages = [
            { code: 'en', name: 'English', flag: 'gb' },
            { code: 'bg', name: 'Български', flag: 'bg' },
            { code: 'hr', name: 'Hrvatski', flag: 'hr' },
            { code: 'cs', name: 'Čeština', flag: 'cz' },
            { code: 'da', name: 'Dansk', flag: 'dk' },
            { code: 'nl', name: 'Nederlands', flag: 'nl' },
            { code: 'et', name: 'Eesti', flag: 'ee' },
            { code: 'fi', name: 'Suomi', flag: 'fi' },
            { code: 'fr', name: 'Français', flag: 'fr' },
            { code: 'de', name: 'Deutsch', flag: 'de' },
            { code: 'el', name: 'Ελληνικά', flag: 'gr' },
            { code: 'hu', name: 'Magyar', flag: 'hu' },
            { code: 'ga', name: 'Gaeilge', flag: 'ie' },
            { code: 'it', name: 'Italiano', flag: 'it' },
            { code: 'lv', name: 'Latviešu', flag: 'lv' },
            { code: 'lt', name: 'Lietuvių', flag: 'lt' },
            { code: 'mt', name: 'Malti', flag: 'mt' },
            { code: 'pl', name: 'Polski', flag: 'pl' },
            { code: 'pt', name: 'Português', flag: 'pt' },
            { code: 'ro', name: 'Română', flag: 'ro' },
            { code: 'sk', name: 'Slovenčina', flag: 'sk' },
            { code: 'sl', name: 'Slovenščina', flag: 'si' },
            { code: 'es', name: 'Español', flag: 'es' },
            { code: 'sv', name: 'Svenska', flag: 'se' }
        ];

        this.currentLanguage = 'en';
        this.cache = new Map();
        this.textNodes = [];
        this.originalTexts = [];
        this.progressInterval = null;
        this.init();
    }

    getFlagImage(flagCode) {
        return `https://flagcdn.com/24x18/${flagCode.toLowerCase()}.png`;
    }

    saveCurrentLanguage() {
        localStorage.setItem('coollife-wiki-language', this.currentLanguage);
    }

    loadSavedLanguage() {
        const saved = localStorage.getItem('coollife-wiki-language');
        if (saved && saved !== 'en') {
            const lang = this.euLanguages.find(l => l.code === saved);
            if (lang) {
                const flagEl = document.getElementById('currentFlag');
                flagEl.src = this.getFlagImage(lang.flag);
                flagEl.alt = lang.flag.toUpperCase();

                document.getElementById('currentLanguage').textContent = lang.name;
                this.currentLanguage = saved;
                setTimeout(() => this.translateWholePage(lang.code), 500);
            }
        }
    }

    init() {
        if (document.readyState === 'loading')
            document.addEventListener('DOMContentLoaded', () => this.setup());
        else
            this.setup();
    }

    setup() {
        this.addLanguageDropdown();
        this.setupEventListeners();
        this.loadSavedLanguage();

        // 🧹 Hide any old overlay
        const style = document.createElement('style');
        style.textContent = `
            #translationLoader, .translation-loader {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }
            .language-dropdown img.flag-menu {
                width: 20px;
                height: 15px;
                margin-right: 8px;
                vertical-align: middle;
                border-radius: 2px;
            }
            #currentFlag {
                width: 20px;
                height: 15px;
                margin-right: 6px;
                vertical-align: middle;
                border-radius: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    addLanguageDropdown() {
        const header = document.querySelector('.md-header__inner') ||
            document.querySelector('.md-header') ||
            document.querySelector('header');
        if (!header) return;

        const dropdownHTML = `
            <div class="language-dropdown">
                <button class="language-button" id="languageButton">
                    <img id="currentFlag" src="${this.getFlagImage('gb')}" alt="GB" />
                    <span id="currentLanguage">English</span>
                    <span class="arrow">▼</span>
                </button>
                <div class="language-menu" id="languageMenu">
                    ${this.euLanguages.map(lang => `
                        <div class="language-option" data-code="${lang.code}">
                            <img class="flag-menu" src="${this.getFlagImage(lang.flag)}" alt="${lang.flag.toUpperCase()}" />
                            <span class="language-name">${lang.name}</span>
                        </div>`).join('')}
                </div>
            </div>`;
        header.insertAdjacentHTML('beforeend', dropdownHTML);
    }

    setupEventListeners() {
        const btn = document.getElementById('languageButton');
        const menu = document.getElementById('languageMenu');
        if (!btn || !menu) return;

        btn.addEventListener('click', e => {
            e.stopPropagation();
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });

        menu.addEventListener('click', e => {
            const opt = e.target.closest('.language-option');
            if (!opt) return;
            const code = opt.dataset.code;
            const lang = this.euLanguages.find(l => l.code === code);
            if (lang) this.selectLanguage(lang);
        });

        document.addEventListener('click', () => (menu.style.display = 'none'));
    }

    async selectLanguage(language) {
        document.getElementById('currentLanguage').textContent = language.name;
        const flagEl = document.getElementById('currentFlag');
        flagEl.src = this.getFlagImage(language.flag);
        flagEl.alt = language.flag.toUpperCase();
        document.getElementById('languageMenu').style.display = 'none';

        if (language.code !== this.currentLanguage) {
            await this.translateWholePage(language.code);
            this.currentLanguage = language.code;
            this.saveCurrentLanguage();
        }
    }

    // 🧠 Full-page translation
    async translateWholePage(targetLang) {
        if (targetLang === 'en') {
            this.restoreOriginalTexts();
            return;
        }

        this.showLoadingIndicator();

        try {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
                acceptNode: node => {
                    const txt = node.nodeValue.trim();
                    if (!txt) return NodeFilter.FILTER_REJECT;
                    const parent = node.parentNode;
                    if (!parent || parent.closest('.language-dropdown')) return NodeFilter.FILTER_REJECT;
                    const style = parent.nodeType === 1 ? window.getComputedStyle(parent) : null;
                    if (style && (style.display === 'none' || style.visibility === 'hidden')) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            });

            this.textNodes = [];
            this.originalTexts = [];

            while (walker.nextNode()) {
                const node = walker.currentNode;
                this.textNodes.push(node);
                this.originalTexts.push(node.nodeValue);
            }

            const uniqueTexts = [...new Set(this.originalTexts)];
            const translationsMap = new Map();

            for (const text of uniqueTexts) {
                if (this.cache.has(text)) translationsMap.set(text, this.cache.get(text));
            }

            const toTranslate = uniqueTexts.filter(t => !translationsMap.has(t));
            if (toTranslate.length === 0) {
                this.applyTranslations(translationsMap);
                this.hideLoadingIndicator();
                return;
            }

            const batches = this.chunkByLength(toTranslate, 4800);
            const totalBatches = batches.length;
            let completed = 0;

            for (const batch of batches) {
                const joined = batch.join('\n<<<SEP>>>\n');
                const translated = await this.safeFetchTranslation(joined, targetLang);
                if (!translated) continue;
                const parts = translated.split('\n<<<SEP>>>\n');
                batch.forEach((t, i) => {
                    translationsMap.set(t, parts[i] || t);
                    this.cache.set(t, parts[i] || t);
                });
                completed++;
                this.updateProgress((completed / totalBatches) * 100);
                this.applyTranslations(translationsMap);
                await this.sleep(1000);
            }

            this.applyTranslations(translationsMap);
            this.updateProgress(100);
        } catch (err) {
            console.error('Translation failed:', err);
            alert('Translation failed. Please try again.');
        } finally {
            this.hideLoadingIndicator();
        }
    }

    applyTranslations(translationsMap) {
        this.textNodes.forEach((node, i) => {
            const original = this.originalTexts[i];
            if (translationsMap.has(original)) {
                node.nodeValue = translationsMap.get(original);
            }
        });
    }

    async safeFetchTranslation(text, targetLang) {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            return data?.responseData?.translatedText || null;
        } catch (e) {
            console.error('API error:', e);
            return null;
        }
    }

    chunkByLength(texts, maxLen) {
        const batches = [];
        let batch = [], len = 0;
        for (const t of texts) {
            const l = t.length + 13;
            if (len + l > maxLen && batch.length > 0) {
                batches.push(batch);
                batch = [];
                len = 0;
            }
            batch.push(t);
            len += l;
        }
        if (batch.length) batches.push(batch);
        return batches;
    }

    restoreOriginalTexts() {
        this.textNodes.forEach((node, i) => {
            node.nodeValue = this.originalTexts[i];
        });
    }

    showLoadingIndicator() {
        const old = document.querySelector('#translationLoader, .translation-loader');
        if (old) old.remove();

        const bar = document.createElement('div');
        bar.id = 'translationProgress';
        Object.assign(bar.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '0%',
            height: '3px',
            background: '#09f',
            zIndex: '9999',
            transition: 'width 0.3s ease'
        });
        document.body.appendChild(bar);

        let progress = 0;
        this.progressInterval = setInterval(() => {
            progress = Math.min(progress + Math.random() * 10, 90);
            bar.style.width = progress + '%';
        }, 300);
    }

    updateProgress(percent) {
        const bar = document.getElementById('translationProgress');
        if (bar) bar.style.width = `${Math.min(percent, 100)}%`;
    }

    hideLoadingIndicator() {
        const bar = document.getElementById('translationProgress');
        if (bar) {
            bar.style.width = '100%';
            setTimeout(() => bar.remove(), 500);
        }
        clearInterval(this.progressInterval);
    }

    sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
}

// Initialize
new WikiTranslator();
