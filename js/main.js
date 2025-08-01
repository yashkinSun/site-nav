// PalmBit Cosmic Site - Main Application Controller

class CosmicApp {
  constructor() {
    this.isLoaded = false;
    this.loadingScreen = null;
    this.cosmicContainer = null;
    this.components = {};
    this.performanceMetrics = {
      loadStart: performance.now(),
      loadEnd: null,
      firstPaint: null,
      firstContentfulPaint: null
    };
    
    this.init();
  }
  
  init() {
    this.setupLoadingScreen();
    this.bindEvents();
    this.startLoadingSequence();
  }
  
  setupLoadingScreen() {
    this.loadingScreen = document.getElementById('loadingScreen');
    this.cosmicContainer = document.getElementById('cosmicContainer');
    
    if (!this.loadingScreen || !this.cosmicContainer) {
      console.error('Required elements not found');
      return;
    }
    
    // Hide cosmic container initially
    this.cosmicContainer.style.opacity = '0';
    this.cosmicContainer.style.visibility = 'hidden';
  }
  
  startLoadingSequence() {
    // Simulate loading process
    const loadingSteps = [
      { message: 'Initializing Cosmic Navigator...', duration: 800 },
      { message: 'Mapping Star Systems...', duration: 600 },
      { message: 'Calibrating Planet Orbits...', duration: 700 },
      { message: 'Establishing Connections...', duration: 500 },
      { message: 'Ready for Exploration!', duration: 400 }
    ];
    
    let currentStep = 0;
    const loadingText = this.loadingScreen.querySelector('.loading-text');
    
    const nextStep = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        if (loadingText) {
          loadingText.textContent = step.message;
        }
        
        setTimeout(() => {
          currentStep++;
          nextStep();
        }, step.duration);
      } else {
        this.completeLoading();
      }
    };
    
    // Start loading sequence after a short delay
    setTimeout(nextStep, 500);
  }
  
  completeLoading() {
    // Record performance metrics
    this.performanceMetrics.loadEnd = performance.now();
    
    // Hide loading screen
    this.loadingScreen.style.transition = 'opacity 0.8s ease, visibility 0.8s ease';
    this.loadingScreen.style.opacity = '0';
    this.loadingScreen.style.visibility = 'hidden';
    
    // Show cosmic container
    setTimeout(() => {
      this.cosmicContainer.style.transition = 'opacity 1s ease, visibility 1s ease';
      this.cosmicContainer.style.opacity = '1';
      this.cosmicContainer.style.visibility = 'visible';
      
      // Start cosmic animations
      this.startCosmicAnimations();
      
      // Mark as loaded
      this.isLoaded = true;
      
      // Dispatch loaded event
      this.dispatchLoadedEvent();
      
      // Remove loading screen from DOM after animation
      setTimeout(() => {
        if (this.loadingScreen && this.loadingScreen.parentNode) {
          this.loadingScreen.parentNode.removeChild(this.loadingScreen);
        }
      }, 1000);
    }, 200);
  }
  
  startCosmicAnimations() {
    // Trigger entrance animations
    this.animateElementsEntrance();
    
    // Start navigation hint animation
    setTimeout(() => {
      this.showNavigationHint();
    }, 8000);
  }
  
  animateElementsEntrance() {
    const elements = [
      { selector: '.central-sun', delay: 0 },
      { selector: '.orbit-dev', delay: 2000 },
      { selector: '.orbit-media', delay: 2500 },
      { selector: '.orbit-learn', delay: 3000 },
      { selector: '.planet-dev', delay: 4000 },
      { selector: '.planet-media', delay: 4500 },
      { selector: '.planet-learn', delay: 5000 }
    ];
    
    elements.forEach(({ selector, delay }) => {
      setTimeout(() => {
        const element = document.querySelector(selector);
        if (element) {
          element.classList.add('fade-in');
        }
      }, delay);
    });
  }
  
  showNavigationHint() {
    const hint = document.getElementById('navigationHint');
    if (hint) {
      hint.style.opacity = '1';
      hint.style.transform = 'translateX(-50%) translateY(0)';
      
      // Hide hint after 5 seconds
      setTimeout(() => {
        hint.style.opacity = '0';
        hint.style.transform = 'translateX(-50%) translateY(20px)';
      }, 5000);
    }
  }
  
  bindEvents() {
    // Window events
    window.addEventListener('load', () => this.handleWindowLoad());
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('orientationchange', () => this.handleOrientationChange());
    
    // Performance monitoring
    this.setupPerformanceMonitoring();
    
    // Error handling
    this.setupErrorHandling();
    
    // Accessibility
    this.setupAccessibility();
    
    // SEO and Analytics
    this.setupAnalytics();
  }
  
  handleWindowLoad() {
    // Additional load handling if needed
    this.optimizePerformance();
  }
  
  handleResize() {
    // Debounce resize events
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.updateLayout();
    }, 250);
  }
  
  handleOrientationChange() {
    // Handle mobile orientation changes
    setTimeout(() => {
      this.updateLayout();
    }, 100);
  }
  
  updateLayout() {
    // Update layout calculations if needed
    if (window.cosmicBackground) {
      window.cosmicBackground.resizeCanvas();
    }
    
    // Update planet positions for mobile if needed
    this.updatePlanetPositions();
  }
  
  updatePlanetPositions() {
    // Adjust planet positions based on screen size
    const isMobile = window.innerWidth < 768;
    const planets = document.querySelectorAll('.planet');
    
    planets.forEach(planet => {
      if (isMobile) {
        planet.classList.add('mobile-layout');
      } else {
        planet.classList.remove('mobile-layout');
      }
    });
  }
  
  setupPerformanceMonitoring() {
    // Monitor performance metrics
    if ('PerformanceObserver' in window) {
      // First Paint
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-paint') {
            this.performanceMetrics.firstPaint = entry.startTime;
          }
          if (entry.name === 'first-contentful-paint') {
            this.performanceMetrics.firstContentfulPaint = entry.startTime;
          }
        });
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.performanceMetrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }
  
  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
      this.handleError(e.error);
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      this.handleError(e.reason);
    });
  }
  
  handleError(error) {
    // Error reporting and fallback handling
    console.error('Application error:', error);
    
    // Show user-friendly error message if critical error
    if (this.isCriticalError(error)) {
      this.showErrorMessage();
    }
  }
  
  isCriticalError(error) {
    // Determine if error is critical
    const criticalErrors = [
      'Cannot read property',
      'is not a function',
      'Network Error'
    ];
    
    return criticalErrors.some(critical => 
      error.message && error.message.includes(critical)
    );
  }
  
  showErrorMessage() {
    // Create error message overlay
    const errorOverlay = document.createElement('div');
    errorOverlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-family: Inter, sans-serif;
      ">
        <div style="text-align: center; max-width: 400px; padding: 2rem;">
          <h2>Oops! Something went wrong</h2>
          <p>We're experiencing technical difficulties. Please refresh the page to try again.</p>
          <button onclick="window.location.reload()" style="
            background: linear-gradient(135deg, #00F5FF, #B100FF);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1rem;
          ">Refresh Page</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(errorOverlay);
  }
  
  setupAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });
    
    // Screen reader announcements
    this.setupScreenReaderSupport();
    
    // Focus management
    this.setupFocusManagement();
  }
  
  handleKeyboardNavigation(e) {
    // Handle global keyboard shortcuts
    if (e.key === 'Tab') {
      // Ensure proper tab order
      this.manageFocusOrder(e);
    }
    
    if (e.key === 'Enter' || e.key === ' ') {
      // Handle activation of focused elements
      const focused = document.activeElement;
      if (focused && focused.classList.contains('planet')) {
        e.preventDefault();
        focused.click();
      }
    }
  }
  
  manageFocusOrder(e) {
    // Ensure logical focus order
    const focusableElements = document.querySelectorAll(
      '.planet, .modal-close, .modal-btn, .social-link, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Custom focus order logic if needed
  }
  
  setupScreenReaderSupport() {
    // Add ARIA labels and descriptions
    const planets = document.querySelectorAll('.planet');
    planets.forEach(planet => {
      const type = planet.dataset.planet;
      planet.setAttribute('aria-label', `Explore ${type} services`);
      planet.setAttribute('aria-describedby', `${type}-description`);
    });
  }
  
  setupFocusManagement() {
    // Skip links for accessibility
    this.createSkipLinks();
    
    // Focus indicators
    this.enhanceFocusIndicators();
  }
  
  createSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
    `;
    skipLinks.className = 'skip-links';
    
    // Add CSS for skip links
    const style = document.createElement('style');
    style.textContent = `
      .skip-links {
        position: absolute;
        top: -100px;
        left: 0;
        z-index: 10000;
      }
      .skip-link {
        position: absolute;
        top: 0;
        left: 0;
        background: var(--dev-primary);
        color: var(--cosmic-bg-start);
        padding: 0.5rem 1rem;
        text-decoration: none;
        font-weight: 600;
        border-radius: 0 0 8px 0;
        transition: top 0.3s ease;
      }
      .skip-link:focus {
        top: 0;
      }
    `;
    
    document.head.appendChild(style);
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }
  
  enhanceFocusIndicators() {
    // Enhanced focus styles are already in CSS
    // This method can add dynamic focus enhancements if needed
  }
  
  setupAnalytics() {
    // Setup analytics tracking
    this.trackPageView();
    this.setupInteractionTracking();
  }
  
  trackPageView() {
    // Track page view (implement with your analytics service)
    console.log('Page view tracked');
  }
  
  setupInteractionTracking() {
    // Track user interactions
    document.addEventListener('click', (e) => {
      if (e.target.closest('.planet')) {
        const planet = e.target.closest('.planet');
        this.trackInteraction('planet_click', planet.dataset.planet);
      }
    });
  }
  
  trackInteraction(action, label) {
    // Track interaction (implement with your analytics service)
    console.log(`Interaction tracked: ${action} - ${label}`);
  }
  
  optimizePerformance() {
    // Performance optimizations
    this.lazyLoadImages();
    this.optimizeAnimations();
    this.setupIntersectionObservers();
  }
  
  lazyLoadImages() {
    // Lazy load images if needed
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }
  
  optimizeAnimations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.body.classList.add('reduced-animations');
    }
    
    // Pause animations when page is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
  }
  
  pauseAnimations() {
    document.body.classList.add('paused-animations');
  }
  
  resumeAnimations() {
    document.body.classList.remove('paused-animations');
  }
  
  setupIntersectionObservers() {
    // Setup observers for performance optimization
    const elements = document.querySelectorAll('.planet, .central-sun');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
  }
  
  dispatchLoadedEvent() {
    // Dispatch custom event when app is fully loaded
    const event = new CustomEvent('cosmicAppLoaded', {
      detail: {
        loadTime: this.performanceMetrics.loadEnd - this.performanceMetrics.loadStart,
        metrics: this.performanceMetrics
      }
    });
    
    document.dispatchEvent(event);
  }
  
  // Public API
  getPerformanceMetrics() {
    return this.performanceMetrics;
  }
  
  isAppLoaded() {
    return this.isLoaded;
  }
  
  destroy() {
    // Cleanup
    if (this.components.cosmicBackground) {
      this.components.cosmicBackground.destroy();
    }
    if (this.components.planetAnimations) {
      this.components.planetAnimations.destroy();
    }
    if (this.components.modalSystem) {
      this.components.modalSystem.destroy();
    }
    
    this.isLoaded = false;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.cosmicApp = new CosmicApp();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (window.cosmicApp) {
    window.cosmicApp.destroy();
  }
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CosmicApp;
}

