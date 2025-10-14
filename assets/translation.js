// EU Language Translation for CoolLIFE Wiki
class WikiTranslator {
    constructor() {
        this.euLanguages = [
            { code: 'en', name: 'English', flag: '\uD83C\uDDEC\uD83C\uDDE7' }, // 🇬🇧
            { code: 'bg', name: 'Български', flag: '\uD83C\uDDE7\uD83C\uDDEC' }, // 🇧🇬
            { code: 'hr', name: 'Hrvatski', flag: '\uD83C\uDDED\uD83C\uDDF7' }, // 🇭🇷
            { code: 'cs', name: 'Čeština', flag: '\uD83C\uDDE8\uD83C\uDDFF' }, // 🇨🇿
            { code: 'da', name: 'Dansk', flag: '\uD83C\uDDE9\uD83C\uDDF0' }, // 🇩🇰
            { code: 'nl', name: 'Nederlands', flag: '\uD83C\uDDF3\uD83C\uDDF1' }, // 🇳🇱
            { code: 'et', name: 'Eesti', flag: '\uD83C\uDDEA\uD83C\uDDEA' }, // 🇪🇪
            { code: 'fi', name: 'Suomi', flag: '\uD83C\uDDEB\uD83C\uDDEE' }, // 🇫🇮
            { code: 'fr', name: 'Français', flag: '\uD83C\uDDEB\uD83C\uDDF7' }, // 🇫🇷
            { code: 'de', name: 'Deutsch', flag: '\uD83C\uDDE9\uD83C\uDDEA' }, // 🇩🇪
            { code: 'el', name: 'Ελληνικά', flag: '\uD83C\uDDEC\uD83C\uDDF7' }, // 🇬🇷
            { code: 'hu', name: 'Magyar', flag: '\uD83C\uDDED\uD83C\uDDFA' }, // 🇭🇺
            { code: 'ga', name: 'Gaeilge', flag: '\uD83C\uDDEE\uD83C\uDDEA' }, // 🇮🇪
            { code: 'it', name: 'Italiano', flag: '\uD83C\uDDEE\uD83C\uDDF9' }, // 🇮🇹
            { code: 'lv', name: 'Latviešu', flag: '\uD83C\uDDF1\uD83C\uDDFB' }, // 🇱🇻
            { code: 'lt', name: 'Lietuvių', flag: '\uD83C\uDDF1\uD83C\uDDF9' }, // 🇱🇹
            { code: 'mt', name: 'Malti', flag: '\uD83C\uDDF2\uD83C\uDDF9' }, // 🇲🇹
            { code: 'pl', name: 'Polski', flag: '\uD83C\uDDF5\uD83C\uDDF1' }, // 🇵🇱
            { code: 'pt', name: 'Português', flag: '\uD83C\uDDF5\uD83C\uDDF9' }, // 🇵🇹
            { code: 'ro', name: 'Română', flag: '\uD83C\uDDF7\uD83C\uDDF4' }, // 🇷🇴
            { code: 'sk', name: 'Slovenčina', flag: '\uD83C\uDDF8\uD83C\uDDF0' }, // 🇸🇰
            { code: 'sl', name: 'Slovenščina', flag: '\uD83C\uDDF8\uD83C\uDDEE' }, // 🇸🇮
            { code: 'es', name: 'Español', flag: '\uD83C\uDDEA\uD83C\uDDF8' }, // 🇪🇸
            { code: 'sv', name: 'Svenska', flag: '\uD83C\uDDF8\uD83C\uDDEA' } // 🇸🇪
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
                    // Update UI to show saved language flag and name
                    document.getElementById('currentFlag').textContent = language.flag;
                    document.getElementById('currentLanguage').textContent = language.name;
                    this.currentLanguage = savedLang;
                    
                    // Auto-translate the page
                    setTimeout(() => {
                        this.translateContent(savedLang);
                    }, 500);
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
        
        console.log('Header found:', header);
        
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
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        header.insertAdjacentHTML('beforeend', dropdownHTML);
        console.log('Language dropdown added');
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

    async selectLanguage(language) {
        document.getElementById('currentLanguage').textContent = language.name; // Show full name
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

            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                console.log(`Found ${elements.length} elements for selector: ${selector}`);
                
                for (const element of elements) {
                    if (element.closest('.language-dropdown')) continue;
                    await this.translateElement(element, targetLang);
                }
            }
        } catch (error) {
            console.error('Translation failed:', error);
            alert('Translation failed. Please try again.');
        } finally {
            this.hideLoadingIndicator();
        }
    }

    async translateElement(element, targetLang) {
        const key = this.getElementKey(element);
        
        // Skip elements that contain images or other media
        if (element.querySelector('img, figure, iframe, video')) {
            console.log('Skipping element with media content');
            return;
        }
        
        // Handle elements with links differently
        if (element.querySelector('a')) {
            console.log('Translating element with links');
            await this.translateElementWithLinks(element, targetLang, key);
            return;
        }
        
        // Regular translation for elements without links
        if (!this.originalContent.has(key)) {
            this.originalContent.set(key, element.textContent);
        }
        
        const originalText = this.originalContent.get(key);
        if (originalText && originalText.trim() && originalText.length > 1) {
            console.log(`Translating: "${originalText}"`);
            const translatedText = await this.translateText(originalText.trim(), targetLang);
            console.log(`Result: "${translatedText}"`);
            element.textContent = translatedText;
        }
    }

// ADD THIS NEW FUNCTION to handle elements with links:
    async translateElementWithLinks(element, targetLang, key) {
        if (!this.originalContent.has(key)) {
            this.originalContent.set(key, element.innerHTML); // Store HTML, not just text
        }
        
        // Get all text nodes that are not inside links
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Only translate text that's not inside a link
                    return node.parentElement.tagName !== 'A' ? 
                        NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }
        
        // Translate each text node individually
        for (const textNode of textNodes) {
            const originalText = textNode.textContent.trim();
            if (originalText && originalText.length > 1) {
                const translatedText = await this.translateText(originalText, targetLang);
                textNode.textContent = translatedText;
            }
        }
        
        // Also translate link text
        const links = element.querySelectorAll('a');
        for (const link of links) {
            const linkText = link.textContent.trim();
            if (linkText && linkText.length > 1) {
                const translatedLinkText = await this.translateText(linkText, targetLang);
                link.textContent = translatedLinkText;
            }
        }
    }

    async translateText(text, targetLang) {
        const GOOGLE_API_KEY = 'AIzaSyDXeNiXYoHsugjBY0GjDF5R0NQF_sq_5lU'; // Replace with your new restricted key
        
        if (targetLang === 'en' || !text.trim()) {
            return text;
        }

        try {
            console.log(`🌍 Translating "${text}" to ${targetLang}`);
            
            const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: 'en',
                    target: targetLang,
                    format: 'text'
                })
            });

            if (response.ok) {
                const data = await response.json();
                const translatedText = data.data.translations[0].translatedText;
                console.log(`✅ Google Translate: "${translatedText}"`);
                return translatedText;
            } else {
                const errorData = await response.json();
                console.error('❌ Google Translate API error:', response.status, errorData);
                return text;
            }
        } catch (error) {
            console.error('❌ Translation failed:', error);
            return text;
        }
    }

    restoreOriginalContent() {
        this.originalContent.forEach((content, key) => {
            const element = document.querySelector(`[data-translation-key="${key}"]`);
            if (element) {
                // Check if content contains HTML (links)
                if (content.includes('<')) {
                    element.innerHTML = content; // Restore HTML structure
                } else {
                    element.textContent = content; // Restore plain text
                }
            }
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