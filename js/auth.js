class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        // Simulate API call
        try {
            this.showLoading(true);
            
            // In a real app, this would be an API call
            await this.simulateAPICall();
            
            const user = {
                id: Date.now(),
                name: email.split('@')[0],
                email: email,
                isPremium: false,
                createdAt: new Date().toISOString()
            };

            this.setCurrentUser(user);
            this.closeModal();
            this.showMainApp();
            this.showSuccess('Welcome back! You have been logged in successfully.');
            
        } catch (error) {
            this.showError('Login failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        if (!name || !email || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters long');
            return;
        }

        try {
            this.showLoading(true);
            
            // Simulate API call
            await this.simulateAPICall();
            
            const user = {
                id: Date.now(),
                name: name,
                email: email,
                isPremium: false,
                createdAt: new Date().toISOString()
            };

            this.setCurrentUser(user);
            this.closeModal();
            this.showMainApp();
            this.showSuccess('Account created successfully! Welcome to AI Writer Pro.');
            
        } catch (error) {
            this.showError('Registration failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('ai_writer_user', JSON.stringify(user));
        this.updateUI();
    }

    loadUserFromStorage() {
        const stored = localStorage.getItem('ai_writer_user');
        if (stored) {
            this.currentUser = JSON.parse(stored);
        }
    }

    updateUI() {
        const isLoggedIn = !!this.currentUser;
        
        // Navigation buttons
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const userInfo = document.getElementById('userInfo');
        const upgradeBtn = document.getElementById('upgradeBtn');

        if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'inline-flex';
        if (registerBtn) registerBtn.style.display = isLoggedIn ? 'none' : 'inline-flex';
        if (userInfo) userInfo.style.display = isLoggedIn ? 'flex' : 'none';
        if (upgradeBtn) upgradeBtn.style.display = isLoggedIn && !this.currentUser?.isPremium ? 'inline-flex' : 'none';

        if (isLoggedIn) {
            // Update user name in navigation
            const userName = document.getElementById('userName');
            if (userName) userName.textContent = `Welcome, ${this.currentUser.name}!`;

            // Update premium badge
            const premiumBadge = document.getElementById('premiumBadge');
            if (premiumBadge) {
                premiumBadge.style.display = this.currentUser.isPremium ? 'inline-flex' : 'none';
            }

            // Update app header user info
            const appUserName = document.getElementById('appUserName');
            if (appUserName) appUserName.textContent = this.currentUser.name;

            const appPremiumBadge = document.getElementById('appPremiumBadge');
            if (appPremiumBadge) {
                appPremiumBadge.style.display = this.currentUser.isPremium ? 'inline-flex' : 'none';
            }

            // Update premium tools
            this.updatePremiumTools();
        }
    }

    updatePremiumTools() {
        const premiumTools = document.querySelectorAll('.tool-btn.premium-only');
        premiumTools.forEach(tool => {
            if (this.currentUser?.isPremium) {
                tool.classList.add('unlocked');
                tool.style.opacity = '1';
                const lock = tool.querySelector('.premium-lock');
                if (lock) lock.style.display = 'none';
            } else {
                tool.classList.remove('unlocked');
                tool.style.opacity = '0.6';
                const lock = tool.querySelector('.premium-lock');
                if (lock) lock.style.display = 'block';
            }
        });
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('ai_writer_user');
        this.updateUI();
        this.showLanding();
        this.showSuccess('You have been logged out successfully.');
    }

    showLanding() {
        document.getElementById('landingPage').classList.add('active');
        document.getElementById('mainApp').classList.remove('active');
    }

    showMainApp() {
        document.getElementById('landingPage').classList.remove('active');
        document.getElementById('mainApp').classList.add('active');
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = show ? 'flex' : 'none';
        }
    }

    async simulateAPICall() {
        return new Promise(resolve => setTimeout(resolve, 1500));
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

// Export for use in other modules
window.AuthManager = AuthManager;