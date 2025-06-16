// Main application initialization
class App {
    constructor() {
        this.authManager = null;
        this.paymentManager = null;
        this.uiManager = null;
        this.writingAssistant = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        // Initialize managers in correct order
        this.authManager = new AuthManager();
        this.paymentManager = new PaymentManager(this.authManager);
        this.uiManager = new UIManager(this.authManager, this.paymentManager);
        this.writingAssistant = new WritingAssistant(this.authManager);

        // Make managers globally available
        window.authManager = this.authManager;
        window.paymentManager = this.paymentManager;
        window.uiManager = this.uiManager;
        window.writingAssistant = this.writingAssistant;

        // Show appropriate page based on login status
        this.showInitialPage();

        // Add some welcome animations
        this.addWelcomeAnimations();
    }

    showInitialPage() {
        if (this.authManager.currentUser) {
            // User is logged in, show main app
            this.uiManager.showMainApp();
        } else {
            // User not logged in, show landing page
            this.uiManager.showLanding();
        }
    }

    addWelcomeAnimations() {
        // Add subtle animations to enhance user experience
        const cards = document.querySelectorAll('.feature-card, .pricing-card, .floating-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
}

// Initialize the application
new App();