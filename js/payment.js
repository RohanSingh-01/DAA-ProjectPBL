class PaymentManager {
    constructor(authManager) {
        this.authManager = authManager;
        this.selectedPlan = null;
        this.razorpayKey = 'rzp_test_1234567890'; // Replace with your actual Razorpay key
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Plan selection
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.addEventListener('click', () => {
                const plan = card.dataset.plan;
                if (plan) {
                    this.selectPlan(plan);
                }
            });
        });
    }

    selectPlan(planType) {
        this.selectedPlan = planType;
        
        // Update UI to show selected plan
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-plan="${planType}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        // Update proceed button
        const proceedBtn = document.getElementById('proceedPayment');
        if (proceedBtn) {
            proceedBtn.disabled = false;
            proceedBtn.innerHTML = `<i class="fas fa-credit-card"></i> Pay ${this.getPlanPrice(planType)}`;
        }
    }

    getPlanPrice(planType) {
        const prices = {
            'monthly': '₹300',
            'sixmonth': '₹1,500'
        };
        return prices[planType] || '₹300';
    }

    getPlanAmount(planType) {
        const amounts = {
            'monthly': 30000, // Amount in paise (₹300)
            'sixmonth': 150000 // Amount in paise (₹1,500)
        };
        return amounts[planType] || 30000;
    }

    async proceedWithPayment() {
        if (!this.selectedPlan) {
            this.showError('Please select a plan first');
            return;
        }

        if (!this.authManager.currentUser) {
            this.showError('Please login first');
            return;
        }

        try {
            this.showLoading(true);
            
            // Create order (in real app, this would be a backend API call)
            const order = await this.createOrder();
            
            // Initialize Razorpay
            this.initializeRazorpay(order);
            
        } catch (error) {
            this.showError('Failed to initialize payment. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async createOrder() {
        // Simulate API call to create order
        await this.simulateAPICall();
        
        return {
            id: 'order_' + Date.now(),
            amount: this.getPlanAmount(this.selectedPlan),
            currency: 'INR',
            receipt: 'receipt_' + Date.now()
        };
    }

    initializeRazorpay(order) {
        const options = {
            key: this.razorpayKey,
            amount: order.amount,
            currency: order.currency,
            name: 'AI Writer Pro',
            description: `${this.selectedPlan === 'monthly' ? 'Monthly' : '6 Month'} Premium Plan`,
            image: 'https://your-logo-url.com/logo.png', // Replace with your logo
            order_id: order.id,
            handler: (response) => this.handlePaymentSuccess(response),
            prefill: {
                name: this.authManager.currentUser.name,
                email: this.authManager.currentUser.email,
                contact: '9999999999' // You can collect this during registration
            },
            notes: {
                plan: this.selectedPlan,
                user_id: this.authManager.currentUser.id
            },
            theme: {
                color: '#667eea'
            },
            modal: {
                ondismiss: () => {
                    this.showError('Payment cancelled');
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.on('payment.failed', (response) => this.handlePaymentFailure(response));
        rzp.open();
    }

    async handlePaymentSuccess(response) {
        try {
            this.showLoading(true);
            
            // Verify payment (in real app, this would be a backend API call)
            await this.verifyPayment(response);
            
            // Update user to premium
            this.authManager.currentUser.isPremium = true;
            this.authManager.currentUser.premiumPlan = this.selectedPlan;
            this.authManager.currentUser.premiumExpiry = this.calculateExpiryDate();
            
            // Save updated user
            this.authManager.setCurrentUser(this.authManager.currentUser);
            
            // Close modal and show success
            this.closeModal();
            this.showSuccess('🎉 Welcome to Premium! All features are now unlocked.');
            
            // Update UI
            this.authManager.updateUI();
            
        } catch (error) {
            this.showError('Payment verification failed. Please contact support.');
        } finally {
            this.showLoading(false);
        }
    }

    handlePaymentFailure(response) {
        console.error('Payment failed:', response.error);
        this.showError(`Payment failed: ${response.error.description}`);
    }

    async verifyPayment(response) {
        // Simulate payment verification
        await this.simulateAPICall();
        
        // In a real app, you would send the payment details to your backend
        // for verification with Razorpay's API
        console.log('Payment verification:', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
        });
        
        return true;
    }

    calculateExpiryDate() {
        const now = new Date();
        if (this.selectedPlan === 'monthly') {
            now.setMonth(now.getMonth() + 1);
        } else if (this.selectedPlan === 'sixmonth') {
            now.setMonth(now.getMonth() + 6);
        }
        return now.toISOString();
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
        return new Promise(resolve => setTimeout(resolve, 1000));
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
window.PaymentManager = PaymentManager;