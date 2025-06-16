// Configuration file for AI Writing Assistant
const CONFIG = {
    // Gemini API Configuration
    GEMINI_API: {
        BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
        MODEL: 'gemini-1.5-flash-latest',
        DEFAULT_PARAMS: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        }
    },

    // Application Settings
    APP: {
        MAX_TEXT_LENGTH: 10000,
        WORD_COUNT_UPDATE_DELAY: 300,
        NOTIFICATION_DURATION: 3000,
        AUTO_SAVE_INTERVAL: 30000, // 30 seconds
    },

    // UI Configuration
    UI: {
        THEMES: {
            light: {
                primary: '#667eea',
                secondary: '#764ba2',
                background: '#ffffff',
                text: '#333333'
            },
            dark: {
                primary: '#667eea',
                secondary: '#764ba2',
                background: '#1a1a1a',
                text: '#ffffff'
            }
        },
        DEFAULT_THEME: 'light',
        ANIMATIONS_ENABLED: true,
    },

    // Tool Configurations
    TOOLS: {
        'spell-check': {
            name: 'Spell Check',
            icon: 'fas fa-spell-check',
            description: 'Check and correct spelling errors',
            maxLength: 5000
        },
        'grammar': {
            name: 'Grammar Check',
            icon: 'fas fa-language',
            description: 'Improve grammar and sentence structure',
            maxLength: 5000
        },
        'tone': {
            name: 'Tone Adjustment',
            icon: 'fas fa-adjust',
            description: 'Change the tone of your writing',
            maxLength: 3000,
            options: [
                { value: 'professional', label: 'Professional' },
                { value: 'casual', label: 'Casual' },
                { value: 'formal', label: 'Formal' },
                { value: 'friendly', label: 'Friendly' },
                { value: 'persuasive', label: 'Persuasive' },
                { value: 'academic', label: 'Academic' },
                { value: 'humorous', label: 'Humorous' },
                { value: 'serious', label: 'Serious' }
            ]
        },
        'vocab': {
            name: 'Vocabulary Enhancement',
            icon: 'fas fa-book',
            description: 'Enhance vocabulary with sophisticated alternatives',
            maxLength: 4000
        },
        'goal-based': {
            name: 'Goal-Based Writing',
            icon: 'fas fa-target',
            description: 'Optimize text for specific writing goals',
            maxLength: 4000,
            options: [
                { value: 'email', label: 'Email' },
                { value: 'essay', label: 'Essay' },
                { value: 'report', label: 'Report' },
                { value: 'creative', label: 'Creative Writing' },
                { value: 'summary', label: 'Summary' },
                { value: 'proposal', label: 'Proposal' },
                { value: 'blog', label: 'Blog Post' },
                { value: 'social-media', label: 'Social Media' }
            ]
        }
    },

    // Error Messages
    ERRORS: {
        NO_API_KEY: 'Please configure your Gemini API key first',
        INVALID_API_KEY: 'Invalid API key format',
        NO_TEXT: 'Please enter some text to process',
        TEXT_TOO_LONG: 'Text is too long for this tool',
        API_ERROR: 'Failed to process text with AI',
        NETWORK_ERROR: 'Network connection error',
        RATE_LIMIT: 'Rate limit exceeded. Please try again later.',
        QUOTA_EXCEEDED: 'API quota exceeded'
    },

    // Success Messages
    SUCCESS: {
        API_KEY_SAVED: 'API key saved successfully',
        TEXT_COPIED: 'Text copied to clipboard',
        FILE_DOWNLOADED: 'File downloaded successfully',
        TEXT_PROCESSED: 'Text processed successfully'
    }
};

// Export configuration if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}