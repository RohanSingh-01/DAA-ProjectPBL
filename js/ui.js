class UIManager {
    constructor(authManager, paymentManager) {
        this.authManager = authManager;
        this.paymentManager = paymentManager;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupModalHandlers();
    }

    setupEventListeners() {
        // Logo click
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLanding();
            });
        }

        // Modal triggers
        const loginBtns = document.querySelectorAll('[onclick="showLoginModal()"]');
        loginBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        });

        const registerBtns = document.querySelectorAll('[onclick="showRegisterModal()"]');
        registerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterModal();
            });
        });

        const premiumBtns = document.querySelectorAll('[onclick="showPremiumModal()"]');
        premiumBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPremiumModal();
            });
        });

        // Logout button
        const logoutBtns = document.querySelectorAll('[onclick="logout()"]');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.authManager.logout();
            });
        });

        // Payment proceed button
        const proceedBtn = document.getElementById('proceedPayment');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => {
                this.paymentManager.proceedWithPayment();
            });
        }

        // Get started buttons that should show main app if logged in
        const getStartedBtns = document.querySelectorAll('.hero-buttons .btn-primary');
        getStartedBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.authManager.currentUser) {
                    this.showMainApp();
                } else {
                    this.showRegisterModal();
                }
            });
        });
    }

    setupModalHandlers() {
        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        });

        // Close modal buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Switch between login and register
        document.querySelectorAll('a[onclick="showRegisterModal()"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterModal();
            });
        });

        document.querySelectorAll('a[onclick="showLoginModal()"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        });
    }

    showLanding() {
        document.getElementById('landingPage').classList.add('active');
        document.getElementById('mainApp').classList.remove('active');
    }

    showMainApp() {
        document.getElementById('landingPage').classList.remove('active');
        document.getElementById('mainApp').classList.add('active');
    }

    showLoginModal() {
        this.closeModal();
        document.getElementById('loginModal').classList.add('active');
    }

    showRegisterModal() {
        this.closeModal();
        document.getElementById('registerModal').classList.add('active');
    }

    showPremiumModal() {
        if (!this.authManager.currentUser) {
            this.showLoginModal();
            return;
        }
        
        this.closeModal();
        document.getElementById('premiumModal').classList.add('active');
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Plan selection for premium modal
    selectPlan(planType) {
        this.paymentManager.selectPlan(planType);
    }
}

// Make functions globally available for onclick handlers
window.showLanding = function() {
    if (window.uiManager) {
        window.uiManager.showLanding();
    }
};

window.showLoginModal = function() {
    if (window.uiManager) {
        window.uiManager.showLoginModal();
    }
};

window.showRegisterModal = function() {
    if (window.uiManager) {
        window.uiManager.showRegisterModal();
    }
};

window.showPremiumModal = function() {
    if (window.uiManager) {
        window.uiManager.showPremiumModal();
    }
};

window.closeModal = function() {
    if (window.uiManager) {
        window.uiManager.closeModal();
    }
};

window.logout = function() {
    if (window.authManager) {
        window.authManager.logout();
    }
};

window.selectPlan = function(planType) {
    if (window.uiManager) {
        window.uiManager.selectPlan(planType);
    }
};

window.proceedWithPayment = function() {
    if (window.paymentManager) {
        window.paymentManager.proceedWithPayment();
    }
};

// Export for use in other modules
window.UIManager = UIManager;