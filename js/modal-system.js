// PalmBit Cosmic Site - Modal System Manager

class ModalSystem {
  constructor() {
    this.modals = new Map();
    this.activeModal = null;
    this.isInitialized = false;
    this.socialFooter = null;
    this.notificationModal = null;
    
    this.init();
  }
  
  init() {
    this.setupModals();
    this.setupSocialFooter();
    this.setupNotificationModal();
    this.bindEvents();
    this.isInitialized = true;
  }
  
  setupModals() {
    // Find all planet modals
    const modalElements = document.querySelectorAll('.planet-modal');
    
    modalElements.forEach(modal => {
      const modalType = modal.dataset.modal;
      const modalData = {
        element: modal,
        type: modalType,
        overlay: modal.querySelector('.modal-overlay'),
        content: modal.querySelector('.modal-content'),
        closeBtn: modal.querySelector('.modal-close'),
        isOpen: false
      };
      
      this.modals.set(modalType, modalData);
      this.setupModalEvents(modalData);
    });
  }
  
  setupModalEvents(modalData) {
    const { element, overlay, closeBtn } = modalData;
    
    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal(modalData.type));
    }
    
    // Overlay click
    if (overlay) {
      overlay.addEventListener('click', () => this.closeModal(modalData.type));
    }
    
    // Prevent modal content clicks from closing modal
    if (modalData.content) {
      modalData.content.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
    
    // Keyboard events
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modalData.type);
      }
    });
  }
  
  setupSocialFooter() {
    this.socialFooter = document.getElementById('socialFooter');
  }
  
  setupNotificationModal() {
    this.notificationModal = document.getElementById('notificationModal');
    if (this.notificationModal) {
      const overlay = this.notificationModal.querySelector('.modal-overlay');
      const closeBtn = this.notificationModal.querySelector('.modal-close');
      const form = this.notificationModal.querySelector('#notifyForm');
      
      // Close events
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeNotifyForm());
      }
      if (overlay) {
        overlay.addEventListener('click', () => this.closeNotifyForm());
      }
      
      // Form submission
      if (form) {
        form.addEventListener('submit', (e) => this.handleNotifyFormSubmit(e));
      }
      
      // Prevent content clicks from closing
      const content = this.notificationModal.querySelector('.modal-content');
      if (content) {
        content.addEventListener('click', (e) => e.stopPropagation());
      }
    }
  }
  
  bindEvents() {
    // Listen for planet modal open events
    document.addEventListener('openPlanetModal', (e) => {
      this.openModal(e.detail.planet);
    });
    
    // Global keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal(this.activeModal);
      }
    });
    
    // Handle browser back button
    window.addEventListener('popstate', () => {
      if (this.activeModal) {
        this.closeModal(this.activeModal);
      }
    });
  }
  
  openModal(modalType) {
    const modalData = this.modals.get(modalType);
    if (!modalData) {
      console.error(`Modal type "${modalType}" not found`);
      return;
    }
    
    // Close any open modal first
    if (this.activeModal && this.activeModal !== modalType) {
      this.closeModal(this.activeModal);
    }
    
    // Open the modal
    modalData.isOpen = true;
    this.activeModal = modalType;
    
    // Add active class
    modalData.element.classList.add('active');
    
    // Show social footer for all modals
    // this.showSocialFooter(); // Disabled - social links now integrated in modals
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    this.trapFocus(modalData.element);
    
    // Add to browser history
    history.pushState({ modal: modalType }, '', `#${modalType}`);
    
    // Announce to screen readers
    this.announceModalOpen(modalType);
    
    // Analytics event (if needed)
    this.trackModalOpen(modalType);
  }
  
  closeModal(modalType) {
    const modalData = this.modals.get(modalType);
    if (!modalData || !modalData.isOpen) return;
    
    // Close the modal
    modalData.isOpen = false;
    modalData.element.classList.remove('active');
    
    // Hide social footer
    // this.hideSocialFooter(); // Disabled - social links now integrated in modals
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Clear active modal
    this.activeModal = null;
    
    // Remove focus trap
    this.removeFocusTrap();
    
    // Update browser history
    if (window.location.hash === `#${modalType}`) {
      history.back();
    }
    
    // Return focus to the planet that opened the modal
    this.returnFocusToPlanet(modalType);
    
    // Analytics event (if needed)
    this.trackModalClose(modalType);
  }
  
  showSocialFooter() {
    if (this.socialFooter) {
      this.socialFooter.classList.add('visible');
    }
  }
  
  hideSocialFooter() {
    if (this.socialFooter) {
      this.socialFooter.classList.remove('visible');
    }
  }
  
  showNotifyForm() {
    if (this.notificationModal) {
      this.notificationModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus on email input
      const emailInput = this.notificationModal.querySelector('input[type="email"]');
      if (emailInput) {
        setTimeout(() => emailInput.focus(), 100);
      }
    }
  }
  
  closeNotifyForm() {
    if (this.notificationModal) {
      this.notificationModal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Clear form
      const form = this.notificationModal.querySelector('#notifyForm');
      if (form) {
        form.reset();
      }
    }
  }
  
  handleNotifyFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    
    if (!this.validateEmail(email)) {
      this.showFormError('Please enter a valid email address');
      return;
    }
    
    // Simulate form submission
    this.submitNotificationForm(email);
  }
  
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  submitNotificationForm(email) {
    const submitBtn = this.notificationModal.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      // Show success message
      this.showNotificationSuccess();
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Close modal after delay
      setTimeout(() => {
        this.closeNotifyForm();
      }, 2000);
      
      // Track conversion
      this.trackNotificationSignup(email);
    }, 1500);
  }
  
  showNotificationSuccess() {
    const form = this.notificationModal.querySelector('.notify-form');
    if (form) {
      form.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--learn-primary); margin-bottom: 1rem;"></i>
          <h3 style="color: var(--learn-primary); margin-bottom: 1rem;">Thank You!</h3>
          <p>We'll notify you as soon as PalmBit Learn launches.</p>
        </div>
      `;
    }
  }
  
  showFormError(message) {
    const form = this.notificationModal.querySelector('.notify-form');
    let errorDiv = form.querySelector('.form-error');
    
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'form-error';
      errorDiv.style.cssText = `
        color: #ff4444;
        background: rgba(255, 68, 68, 0.1);
        border: 1px solid rgba(255, 68, 68, 0.3);
        border-radius: 8px;
        padding: 0.75rem;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      `;
      form.insertBefore(errorDiv, form.querySelector('form'));
    }
    
    errorDiv.textContent = message;
    
    // Remove error after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }
  
  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus first element
    firstElement.focus();
    
    // Trap focus within modal
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }
  
  removeFocusTrap() {
    // Focus traps are automatically removed when modal is closed
    // This is handled by the modal element being removed from active state
  }
  
  returnFocusToPlanet(modalType) {
    const planet = document.querySelector(`[data-planet="${modalType}"]`);
    if (planet) {
      setTimeout(() => planet.focus(), 100);
    }
  }
  
  announceModalOpen(modalType) {
    // Create announcement for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `${modalType} information dialog opened`;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  // Analytics tracking methods
  trackModalOpen(modalType) {
    // Implement analytics tracking if needed
    console.log(`Modal opened: ${modalType}`);
  }
  
  trackModalClose(modalType) {
    // Implement analytics tracking if needed
    console.log(`Modal closed: ${modalType}`);
  }
  
  trackNotificationSignup(email) {
    // Implement analytics tracking if needed
    console.log(`Notification signup: ${email}`);
  }
  
  // Public API methods
  isModalOpen() {
    return this.activeModal !== null;
  }
  
  getCurrentModal() {
    return this.activeModal;
  }
  
  closeAllModals() {
    this.modals.forEach((modalData, modalType) => {
      if (modalData.isOpen) {
        this.closeModal(modalType);
      }
    });
    
    this.closeNotifyForm();
  }
  
  destroy() {
    this.closeAllModals();
    this.modals.clear();
    this.activeModal = null;
    this.isInitialized = false;
    document.body.style.overflow = '';
  }
}

// Global functions for HTML onclick handlers
window.closeModal = function(modalType) {
  if (window.modalSystem) {
    window.modalSystem.closeModal(modalType);
  }
};

window.showNotifyForm = function() {
  if (window.modalSystem) {
    window.modalSystem.showNotifyForm();
  }
};

window.closeNotifyForm = function() {
  if (window.modalSystem) {
    window.modalSystem.closeNotifyForm();
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.modalSystem = new ModalSystem();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (window.modalSystem) {
    window.modalSystem.destroy();
  }
});

