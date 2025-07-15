// EU Language Translation for CoolLIFE Wiki
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
        saveCurrentLanguage() {
            localStorage.setItem('coollife-wiki-language', this.currentLanguage);
    }

        loadSavedLanguage() {
            const savedLang = localStorage.getItem('coollife-wiki-language');
            if (savedLang && savedLang !== 'en') {
                const language = this.euLanguages.find(lang => lang.code === savedLang);
                if (language) {
                    // Update UI to show saved language
                    document.getElementById('currentLanguage').textContent = language.code.toUpperCase();
                    document.getElementById('currentFlag').textContent = language.flag;
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
                    <span id="currentLanguage">EN</span>
                    <span class="arrow">▼</span>
                </button>
                <div class="language-menu" id="languageMenu">
                    ${this.euLanguages.map(lang => `
                        <div class="language-option" data-code="${lang.code}">
                            <span>${lang.flag}</span>
                            <span>${lang.name}</span>
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
        document.getElementById('currentLanguage').textContent = language.code.toUpperCase();
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