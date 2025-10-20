// ⚡ CoolLIFE Wiki – Optimized Full-Page Translator (MyMemory API, GET-safe version)
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
        this.cache = new Map();
        this.textNodes = [];
        this.originalTexts = [];
        this.init();
    }

    saveCurrentLanguage() {
        localStorage.setItem('coollife-wiki-language', this.currentLanguage);
    }

    loadSavedLanguage() {
        const saved = localStorage.getItem('coollife-wiki-language');
        if (saved && saved !== 'en') {
            const lang = this.euLanguages.find(l => l.code === saved);
            if (lang) {
                document.getElementById('currentFlag').textContent = lang.flag;
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
    }

    addLanguageDropdown() {
        const header = document.querySelector('.md-header__inner') ||
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
                    ${this.euLanguages.map(lang => `
                        <div class="language-option" data-code="${lang.code}">
                            <span class="flag-menu">${lang.flag}</span>
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
        document.getElementById('currentFlag').textContent = language.flag;
        document.getElementById('languageMenu').style.display = 'none';
        if (language.code !== this.currentLanguage) {
            await this.translateWholePage(language.code);
            this.currentLanguage = language.code;
            this.saveCurrentLanguage();
        }
    }

    async translateWholePage(targetLang) {
        if (targetLang === 'en') {
            this.restoreOriginalTexts();
            return;
        }

        this.showProgressBar();

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

            for (const t of uniqueTexts)
                if (this.cache.has(t)) translationsMap.set(t, this.cache.get(t));

            const toTranslate = uniqueTexts.filter(t => !translationsMap.has(t));

            const email = "h85269140@gmail.com"; // For MyMemory quota
            const batches = this.chunkByLength(toTranslate, 4800);
            let completed = 0;

            for (const batch of batches) {
                const joined = batch.join("\n<<<SEP>>>\n");
                const translated = await this.safeFetchTranslation(joined, targetLang, email);
                if (translated) {
                    const parts = translated.split("\n<<<SEP>>>\n");
                    batch.forEach((t, i) => {
                        translationsMap.set(t, parts[i] || t);
                        this.cache.set(t, parts[i] || t);
                    });
                }
                completed++;
                this.updateProgress((completed / batches.length) * 100);
                this.applyTranslations(translationsMap);
                await this.sleep(800); // small delay to respect rate limit
            }

            this.applyTranslations(translationsMap);
            this.updateProgress(100);
        } catch (e) {
            console.error("Translation failed:", e);
        } finally {
            this.hideProgressBar();
        }
    }

    applyTranslations(map) {
        this.textNodes.forEach((node, i) => {
            const original = this.originalTexts[i];
            if (map.has(original)) node.nodeValue = map.get(original);
        });
    }

    // ✅ GET version (safe for GitHub Pages)
    async safeFetchTranslation(text, targetLang, email) {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}&de=${encodeURIComponent(email)}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            return data?.responseData?.translatedText || null;
        } catch (e) {
            console.error("API error:", e);
            return null;
        }
    }

    chunkByLength(texts, maxLen) {
        const batches = [];
        let batch = [], len = 0;
        for (const t of texts) {
            const l = t.length + 13;
            if (len + l > maxLen && batch.length) {
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
        this.textNodes.forEach((node, i) => node.nodeValue = this.originalTexts[i]);
    }

    showProgressBar() {
        const bar = document.createElement("div");
        bar.id = "translationProgress";
        Object.assign(bar.style, {
            position: "fixed", top: "0", left: "0",
            width: "0%", height: "3px", background: "#09f",
            zIndex: "9999", transition: "width 0.3s ease"
        });
        document.body.appendChild(bar);
    }

    updateProgress(percent) {
        const bar = document.getElementById("translationProgress");
        if (bar) bar.style.width = `${Math.min(percent, 100)}%`;
    }

    hideProgressBar() {
        const bar = document.getElementById("translationProgress");
        if (bar) {
            bar.style.width = "100%";
            setTimeout(() => bar.remove(), 600);
        }
    }

    sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
}

new WikiTranslator();
