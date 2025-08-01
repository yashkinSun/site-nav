/**
 * Low Motion Detection and Performance Optimization
 * Automatically disables heavy animations on mobile devices and low-performance scenarios
 */

class LowMotionManager {
  constructor() {
    this.isMobile = this.detectMobile();
    this.prefersReducedMotion = this.detectReducedMotion();
    this.isLowPerformance = this.detectLowPerformance();
    this.shouldUseLowMotion = this.isMobile || this.prefersReducedMotion || this.isLowPerformance;
    
    this.init();
  }
  
  detectMobile() {
    // Detect mobile devices
    return window.matchMedia('(max-width: 768px)').matches ||
           /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           'ontouchstart' in window;
  }
  
  detectReducedMotion() {
    // Respect user's motion preferences
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  detectLowPerformance() {
    // Detect potentially low-performance devices
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    const oldDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    return slowConnection || lowMemory || oldDevice;
  }
  
  init() {
    if (this.shouldUseLowMotion) {
      this.enableLowMotionMode();
    }
    
    // Listen for changes in motion preferences
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) {
        this.enableLowMotionMode();
      } else if (!this.isMobile && !this.isLowPerformance) {
        this.disableLowMotionMode();
      }
    });
    
    // Listen for viewport changes
    window.matchMedia('(max-width: 768px)').addEventListener('change', (e) => {
      if (e.matches) {
        this.enableLowMotionMode();
      } else if (!this.prefersReducedMotion && !this.isLowPerformance) {
        this.disableLowMotionMode();
      }
    });
  }
  
  enableLowMotionMode() {
    document.documentElement.classList.add('low-motion');
    document.documentElement.classList.add('mobile-optimized');
    
    // Reduce particle count for cosmic background
    if (window.cosmicBackground) {
      window.cosmicBackground.setParticleCount(50); // Reduced from default
      window.cosmicBackground.setFPS(20); // Reduced FPS
    }
    
    // Disable heavy animations
    this.disableHeavyAnimations();
    
    // Optimize rendering
    this.optimizeRendering();
    
    console.log('Low motion mode enabled for better performance');
  }
  
  disableLowMotionMode() {
    document.documentElement.classList.remove('low-motion');
    document.documentElement.classList.remove('mobile-optimized');
    
    // Restore particle count
    if (window.cosmicBackground) {
      window.cosmicBackground.setParticleCount(150); // Default count
      window.cosmicBackground.setFPS(30); // Default FPS
    }
    
    console.log('Low motion mode disabled');
  }
  
  disableHeavyAnimations() {
    // Disable complex CSS animations
    const style = document.createElement('style');
    style.id = 'low-motion-styles';
    style.textContent = `
      .low-motion .stars-container,
      .low-motion .constellation-lines,
      .low-motion .floating-particles {
        display: none !important;
      }
      
      .low-motion .planet-glow {
        filter: none !important;
        box-shadow: none !important;
      }
      
      .low-motion .orbit {
        animation: none !important;
      }
      
      .low-motion .cosmic-background {
        background: linear-gradient(135deg, #0a0a2e 0%, #16213e 50%, #1a1a3a 100%) !important;
      }
      
      .low-motion *,
      .low-motion *::before,
      .low-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      .low-motion .planet {
        transition: transform 0.2s ease !important;
      }
      
      .low-motion .modal {
        transition: opacity 0.15s ease, transform 0.15s ease !important;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  optimizeRendering() {
    // Force hardware acceleration only where needed
    const planets = document.querySelectorAll('.planet');
    planets.forEach(planet => {
      planet.style.willChange = 'transform';
    });
    
    // Remove will-change from other elements
    const otherElements = document.querySelectorAll('.orbit, .stars-container, .constellation-lines');
    otherElements.forEach(el => {
      el.style.willChange = 'auto';
    });
  }
  
  // Public methods for external use
  isLowMotionEnabled() {
    return this.shouldUseLowMotion;
  }
  
  isMobileDevice() {
    return this.isMobile;
  }
  
  getPerformanceLevel() {
    if (this.isLowPerformance) return 'low';
    if (this.isMobile) return 'medium';
    return 'high';
  }
}

// Initialize low motion manager as soon as possible
document.addEventListener('DOMContentLoaded', () => {
  window.lowMotionManager = new LowMotionManager();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading
} else {
  // DOM is already loaded
  window.lowMotionManager = new LowMotionManager();
}

