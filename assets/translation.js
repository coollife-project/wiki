// EU Language Translation for CoolLIFE Wiki
class WikiTranslator {
    constructor() {
        this.euLanguages = [
            { code: 'en', name: 'English', flag: 'EN' },
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

    init() {
        // Wait for page to be fully loaded
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
    }

    addLanguageDropdown() {
        // Find the header navigation
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

        // Close dropdown when clicking outside
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
        }
    }

    async translateContent(targetLang) {
        if (targetLang === 'en') {
            this.restoreOriginalContent();
            return;
        }

        this.showLoadingIndicator();

        try {
            // Get ALL text nodes in the page (more comprehensive approach)
            this.translateAllTextNodes(document.body, targetLang);
        } catch (error) {
            console.error('Translation failed:', error);
            alert('Translation failed. Please try again.');
        } finally {
            this.hideLoadingIndicator();
        }
    }

    async translateAllTextNodes(element, targetLang) {
        // Skip the language dropdown itself
        if (element.closest && element.closest('.language-dropdown')) {
            return;
        }

        // If this is a text node with actual content
        if (element.nodeType === Node.TEXT_NODE) {
            const text = element.textContent.trim();
            if (text && text.length > 0 && !this.shouldSkipText(text)) {
                const key = 'text_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                
                // Store original
                if (!this.originalContent.has(key)) {
                    this.originalContent.set(key, text);
                    element.setAttribute('data-translation-key', key);
                }
                
                // Translate
                const translatedText = await this.translateText(text, targetLang);
                element.textContent = translatedText;
            }
        } else if (element.nodeType === Node.ELEMENT_NODE) {
            // For element nodes, recursively process child nodes
            const children = Array.from(element.childNodes);
            for (const child of children) {
                await this.translateAllTextNodes(child, targetLang);
            }
        }
    }

    shouldSkipText(text) {
        // Skip very short text, numbers only, or common UI elements that shouldn't be translated
        if (text.length < 2) return true;
        if (/^\d+$/.test(text)) return true;
        if (/^[^\w\s]+$/.test(text)) return true; // Only symbols
        return false;
    }

    async translateElement(element, targetLang) {
        // This function is now replaced by translateAllTextNodes
        // Keep for compatibility but make it simpler
        const text = element.textContent.trim();
        if (text && text.length > 0) {
            const key = this.getElementKey(element);
            
            if (!this.originalContent.has(key)) {
                this.originalContent.set(key, text);
            }
            
            const translatedText = await this.translateText(text, targetLang);
            element.textContent = translatedText;
        }
    }

    restoreOriginalContent() {
        // Find all elements with translation keys and restore them
        document.querySelectorAll('[data-translation-key]').forEach(element => {
            const key = element.getAttribute('data-translation-key');
            const originalText = this.originalContent.get(key);
            if (originalText) {
                element.textContent = originalText;
            }
        });
    }

    async translateText(text, targetLang) {
        const GOOGLE_API_KEY = 'AIzaSyDXeNiXYoHsugjBY0GjDF5R0NQF_sq_5lU'; // Replace with real key
        
        // Skip translation for English or empty text
        if (targetLang === 'en' || !text.trim()) {
            return text;
        }

        try {
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
                console.log(`✅ Translated "${text}" to "${translatedText}"`);
                return translatedText;
            } else {
                console.error('Google Translate API error:', response.status, response.statusText);
                return text; // Return original if API fails
            }
        } catch (error) {
            console.error('Translation API error:', error);
            return text; // Return original if API fails
        }
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