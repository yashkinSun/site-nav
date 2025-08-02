/**
 * Mobile Card System
 * Enhanced modal cards for mobile devices with gradients and neon accents
 */

class MobileCardSystem {
  constructor() {
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    this.currentCard = null;
    this.overlay = null;
    
    this.planetData = {
      dev: {
        title: 'PalmBit.dev',
        subtitle: 'Development Studio',
        services: [
          'Custom Development',
          'Chat Bots',
          'AI Integrations', 
          'Web Development'
        ],
        primaryAction: {
          text: 'Visit Studio',
          url: 'https://palmbit.dev',
          icon: 'fas fa-external-link-alt'
        },
        social: {
          telegram: 'https://t.me/PalmBitNavigatorBot',
          instagram: '@palmbit.dev'
        }
      },
      media: {
        title: 'PalmBit.media',
        subtitle: 'Media Platform',
        services: [
          'Fast & Reliable',
          'Multilingual',
          'Digital Focused'
        ],
        primaryAction: {
          text: 'Visit Platform',
          url: 'https://palmbit.media',
          icon: 'fas fa-external-link-alt'
        },
        social: {
          telegram: 'https://t.me/PalmBitNavigatorBot',
          instagram: '@palmbit.media'
        }
      },
      learn: {
        title: 'PalmBit Learn',
        subtitle: 'Educational Platform',
        services: [
          'Video Courses',
          'Professional Certifications',
          'Expert Training',
          'Hands-on Projects'
        ],
        primaryAction: {
          text: 'Notify Me',
          action: 'notify',
          icon: 'fas fa-bell'
        },
        social: {
          telegram: 'https://t.me/PalmBitNavigatorBot',
          instagram: '@palmbit.learn'
        }
      }
    };
    
    this.init();
  }
  
  init() {
    if (!this.isMobile) {
      return; // Only initialize on mobile
    }
    
    this.createOverlay();
    this.bindEvents();
    this.setupResponsiveListener();
  }
  
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-card-overlay';
    this.overlay.addEventListener('click', () => this.closeCard());
    document.body.appendChild(this.overlay);
  }
  
  bindEvents() {
    // Planet click events for mobile
    const planets = document.querySelectorAll('.planet');
    planets.forEach(planet => {
      planet.addEventListener('click', (e) => this.handlePlanetClick(e));
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCard();
      }
    });
  }
  
  handlePlanetClick(event) {
    if (!this.isMobile) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const planet = event.currentTarget;
    const planetType = planet.dataset.type;
    
    if (!planetType || !this.planetData[planetType]) {
      console.warn('Unknown planet type:', planetType);
      return;
    }
    
    this.showCard(planetType);
  }
  
  showCard(planetType) {
    const data = this.planetData[planetType];
    
    // Close existing card if any
    if (this.currentCard) {
      this.closeCard();
    }
    
    // Create card element
    this.currentCard = this.createCardElement(planetType, data);
    document.body.appendChild(this.currentCard);
    
    // Show with animation
    requestAnimationFrame(() => {
      this.overlay.classList.add('visible');
      this.currentCard.classList.add('visible');
    });
  }
  
  createCardElement(planetType, data) {
    const card = document.createElement('div');
    card.className = `modal-card ${planetType}`;
    
    card.innerHTML = `
      <div class="modal-card-header">
        <button class="modal-card-close" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
        <h2 class="modal-card-title">${data.title}</h2>
        <p class="modal-card-subtitle">${data.subtitle}</p>
      </div>
      
      <div class="modal-card-content">
        <ul class="modal-card-services">
          ${data.services.map(service => `
            <li class="modal-card-service">${service}</li>
          `).join('')}
        </ul>
      </div>
      
      <div class="modal-card-footer">
        <div class="modal-card-actions">
          ${this.createPrimaryButton(data.primaryAction)}
          <button class="modal-card-btn secondary">
            <i class="fas fa-arrow-left"></i>
            Back to Space
          </button>
        </div>
        
        <div class="modal-card-social">
          <h4>🤖 Connect</h4>
          <div class="modal-card-social-links">
            <a href="${data.social.telegram}" class="modal-card-social-link" target="_blank">
              <i class="fab fa-telegram-plane"></i>
              Bot Navigator
            </a>
            <a href="https://instagram.com/${data.social.instagram.replace('@', '')}" class="modal-card-social-link" target="_blank">
              <i class="fab fa-instagram"></i>
              ${data.social.instagram}
            </a>
          </div>
        </div>
      </div>
    `;
    
    // Bind events
    const closeBtn = card.querySelector('.modal-card-close');
    const backBtn = card.querySelector('.modal-card-btn.secondary');
    const primaryBtn = card.querySelector('.modal-card-btn.primary');
    
    closeBtn.addEventListener('click', () => this.closeCard());
    backBtn.addEventListener('click', () => this.closeCard());
    
    if (data.primaryAction.action === 'notify') {
      primaryBtn.addEventListener('click', () => this.handleNotifyAction());
    }
    
    return card;
  }
  
  createPrimaryButton(action) {
    if (action.url) {
      return `
        <a href="${action.url}" class="modal-card-btn primary" target="_blank">
          <i class="${action.icon}"></i>
          ${action.text}
        </a>
      `;
    } else {
      return `
        <button class="modal-card-btn primary">
          <i class="${action.icon}"></i>
          ${action.text}
        </button>
      `;
    }
  }
  
  handleNotifyAction() {
    // Close current card
    this.closeCard();
    
    // Show notification form (reuse existing modal)
    if (window.openNotifyForm) {
      window.openNotifyForm();
    }
  }
  
  closeCard() {
    if (!this.currentCard) return;
    
    // Hide with animation
    this.overlay.classList.remove('visible');
    this.currentCard.classList.remove('visible');
    
    // Remove after animation
    setTimeout(() => {
      if (this.currentCard) {
        document.body.removeChild(this.currentCard);
        this.currentCard = null;
      }
    }, 300);
  }
  
  setupResponsiveListener() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addListener((e) => {
      if (e.matches) {
        // Switched to mobile
        this.isMobile = true;
        if (!this.overlay) {
          this.createOverlay();
          this.bindEvents();
        }
      } else {
        // Switched to desktop
        this.isMobile = false;
        this.closeCard();
      }
    });
  }
  
  // Public method to check if system is active
  isActive() {
    return this.isMobile;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for other systems to initialize
  setTimeout(() => {
    window.mobileCardSystem = new MobileCardSystem();
  }, 150);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileCardSystem;
}

