class WritingAssistant {
    constructor(authManager) {
        this.authManager = authManager;
        this.apiKey = '';
        this.currentTool = 'spell-check';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadApiKey();
        this.updateWordCount();
    }

    setupEventListeners() {
        // API Key management
        document.getElementById('saveApiKey').addEventListener('click', () => this.saveApiKey());
        document.getElementById('apiKey').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveApiKey();
        });

        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectTool(e.target.closest('.tool-btn')));
        });

        // Text processing
        document.getElementById('processText').addEventListener('click', () => this.processText());
        document.getElementById('clearInput').addEventListener('click', () => this.clearInput());
        
        // Output actions
        document.getElementById('copyOutput').addEventListener('click', () => this.copyOutput());
        document.getElementById('downloadOutput').addEventListener('click', () => this.downloadOutput());

        // Input text monitoring
        document.getElementById('inputText').addEventListener('input', () => this.updateWordCount());

        // Enter key processing
        document.getElementById('inputText').addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.processText();
            }
        });
    }

    loadApiKey() {
        const saved = sessionStorage.getItem('gemini_api_key');
        if (saved) {
            this.apiKey = saved;
            this.updateApiStatus(true);
        }
    }

    saveApiKey() {
        const input = document.getElementById('apiKey');
        const key = input.value.trim();
        
        if (!key) {
            this.showError('Please enter an API key');
            return;
        }

        if (key.length < 20) {
            this.showError('API key seems too short');
            return;
        }

        this.apiKey = key;
        sessionStorage.setItem('gemini_api_key', key);
        this.updateApiStatus(true);
        input.value = '';
        this.showSuccess('API key saved successfully');
    }

    updateApiStatus(isValid) {
        const status = document.getElementById('apiStatus');
        if (isValid) {
            status.innerHTML = '<i class="fas fa-check-circle"></i> API key configured';
            status.className = 'api-status success';
        } else {
            status.innerHTML = '<i class="fas fa-exclamation-circle"></i> API key not configured';
            status.className = 'api-status error';
        }
    }

    selectTool(btn) {
        // Check if premium tool and user doesn't have premium
        if (btn.classList.contains('premium-only') && !btn.classList.contains('unlocked')) {
            this.showError('This feature requires a Premium subscription. Please upgrade to continue.');
            return;
        }

        // Remove active class from all buttons
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this.currentTool = btn.dataset.tool;
        this.showToolOptions();
    }

    showToolOptions() {
        // Hide all option groups
        document.querySelectorAll('.option-group').forEach(group => {
            group.style.display = 'none';
        });

        // Show relevant options
        if (this.currentTool === 'tone') {
            document.getElementById('toneOptions').style.display = 'flex';
        } else if (this.currentTool === 'goal-based') {
            document.getElementById('goalOptions').style.display = 'flex';
        }
    }

    updateWordCount() {
        const text = document.getElementById('inputText').value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        
        document.getElementById('wordCount').textContent = words;
        document.getElementById('charCount').textContent = chars;
    }

    async processText() {
        if (!this.apiKey) {
            this.showError('Please configure your Gemini API key first');
            return;
        }

        const inputText = document.getElementById('inputText').value.trim();
        if (!inputText) {
            this.showError('Please enter some text to process');
            return;
        }

        // Check if user has access to the selected tool
        const toolBtn = document.querySelector(`[data-tool="${this.currentTool}"]`);
        if (toolBtn && toolBtn.classList.contains('premium-only') && !toolBtn.classList.contains('unlocked')) {
            this.showError('This feature requires a Premium subscription. Please upgrade to continue.');
            return;
        }

        this.showLoading(true);
        
        try {
            const prompt = this.generatePrompt(inputText);
            const result = await this.callGeminiAPI(prompt);
            this.displayResult(result);
            this.enableOutputActions();
        } catch (error) {
            this.showError('Failed to process text: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    generatePrompt(text) {
        const prompts = {
            'spell-check': `Please check and correct any spelling errors in the following text. Return only the corrected text without explanations:\n\n${text}`,
            
            'grammar': `Please correct the grammar and improve sentence structure in the following text. Maintain the original meaning and tone. Return only the corrected text:\n\n${text}`,
            
            'tone': `Please rewrite the following text in a ${document.getElementById('toneSelect').value} tone. Maintain the core message but adjust the style accordingly:\n\n${text}`,
            
            'vocab': `Please enhance the vocabulary in the following text by replacing simple words with more sophisticated alternatives while maintaining clarity and readability:\n\n${text}`,
            
            'goal-based': `Please rewrite the following text to be optimized for ${document.getElementById('goalSelect').value} format. Adjust structure, tone, and content appropriately:\n\n${text}`,

            'creative': `Please enhance the following text with creative writing techniques, vivid descriptions, and engaging language while maintaining the original message:\n\n${text}`
        };

        return prompts[this.currentTool] || prompts['spell-check'];
    }

    async callGeminiAPI(prompt) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API request failed');
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0]) {
            throw new Error('No response generated');
        }

        return data.candidates[0].content.parts[0].text;
    }

    displayResult(result) {
        const outputArea = document.getElementById('outputText');
        outputArea.innerHTML = '';
        outputArea.textContent = result;
        outputArea.style.color = '#333';
    }

    clearInput() {
        document.getElementById('inputText').value = '';
        this.updateWordCount();
    }

    async copyOutput() {
        const outputText = document.getElementById('outputText').textContent;
        try {
            await navigator.clipboard.writeText(outputText);
            this.showSuccess('Text copied to clipboard');
        } catch (error) {
            this.showError('Failed to copy text');
        }
    }

    downloadOutput() {
        const outputText = document.getElementById('outputText').textContent;
        const blob = new Blob([outputText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `enhanced-text-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccess('File downloaded successfully');
    }

    enableOutputActions() {
        document.getElementById('copyOutput').disabled = false;
        document.getElementById('downloadOutput').disabled = false;
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'flex' : 'none';
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1001',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: '300px',
            backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

window.WritingAssistant = WritingAssistant;