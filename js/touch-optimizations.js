/**
 * Touch Optimizations for Mobile Devices
 * Improves touch responsiveness and user experience
 */

class TouchOptimizations {
  constructor() {
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    this.isAndroid = /Android/.test(navigator.userAgent);
    
    if (this.isTouchDevice) {
      this.init();
    }
  }
  
  init() {
    this.optimizeViewport();
    this.preventZoom();
    this.optimizeScrolling();
    this.addTouchStyles();
    this.optimizeModals();
  }
  
  optimizeViewport() {
    // Ensure proper viewport settings for mobile
    let viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }
  }
  
  preventZoom() {
    // Prevent double-tap zoom on touch devices
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }
  
  optimizeScrolling() {
    // Improve scrolling performance on mobile
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Prevent rubber band scrolling on iOS
    if (this.isIOS) {
      document.body.addEventListener('touchmove', (e) => {
        if (e.target === document.body) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  }
  
  addTouchStyles() {
    // Add touch-specific styles
    const style = document.createElement('style');
    style.id = 'touch-optimizations';
    style.textContent = `
      /* Touch-specific styles */
      @media (hover: none) and (pointer: coarse) {
        /* Remove hover effects on touch devices */
        .planet:hover {
          transform: none !important;
        }
        
        /* Improve touch targets */
        .planet {
          min-width: 44px;
          min-height: 44px;
          touch-action: manipulation;
        }
        
        /* Better touch feedback */
        .planet:active {
          transform: scale(1.05) !important;
          transition: transform 0.1s ease !important;
        }
        
        /* Hide tooltips on touch devices */
        .planet-tooltip {
          display: none !important;
        }
        
        /* Optimize modal close buttons for touch */
        .modal-close {
          min-width: 44px;
          min-height: 44px;
          padding: 12px;
        }
        
        /* Improve button touch targets */
        button {
          min-height: 44px;
          touch-action: manipulation;
        }
        
        /* Prevent text selection on touch */
        .planet,
        .modal-content h2,
        .modal-content h3 {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Optimize scrolling areas */
        .modal-content {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
      }
      
      /* iOS specific optimizations */
      @supports (-webkit-touch-callout: none) {
        .planet {
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        .modal {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      }
      
      /* Android specific optimizations */
      @media screen and (-webkit-min-device-pixel-ratio: 0) {
        .planet {
          -webkit-tap-highlight-color: rgba(74, 158, 255, 0.2);
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  optimizeModals() {
    // Improve modal behavior on touch devices
    document.addEventListener('DOMContentLoaded', () => {
      const modals = document.querySelectorAll('.modal');
      
      modals.forEach(modal => {
        // Prevent background scroll when modal is open
        modal.addEventListener('touchmove', (e) => {
          if (e.target === modal) {
            e.preventDefault();
          }
        }, { passive: false });
        
        // Close modal on background tap
        modal.addEventListener('touchend', (e) => {
          if (e.target === modal) {
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
              closeBtn.click();
            }
          }
        });
      });
    });
  }
  
  // Public methods
  addTouchFeedback(element, options = {}) {
    const {
      scale = 1.05,
      duration = 100,
      color = 'rgba(74, 158, 255, 0.2)'
    } = options;
    
    element.addEventListener('touchstart', () => {
      element.style.transform = `scale(${scale})`;
      element.style.backgroundColor = color;
      element.style.transition = `transform ${duration}ms ease, background-color ${duration}ms ease`;
    });
    
    element.addEventListener('touchend', () => {
      element.style.transform = '';
      element.style.backgroundColor = '';
    });
    
    element.addEventListener('touchcancel', () => {
      element.style.transform = '';
      element.style.backgroundColor = '';
    });
  }
  
  optimizeElement(element) {
    if (!this.isTouchDevice) return;
    
    element.style.touchAction = 'manipulation';
    element.style.webkitTapHighlightColor = 'transparent';
    element.style.webkitTouchCallout = 'none';
    element.style.webkitUserSelect = 'none';
    element.style.userSelect = 'none';
  }
}

// Initialize touch optimizations
document.addEventListener('DOMContentLoaded', () => {
  window.touchOptimizations = new TouchOptimizations();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading
} else {
  // DOM is already loaded
  window.touchOptimizations = new TouchOptimizations();
}

