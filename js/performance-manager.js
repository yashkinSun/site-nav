/**
 * Performance Manager
 * Optimizes performance and manages system resources
 */

class PerformanceManager {
  constructor() {
    this.isLowPowerMode = false;
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isVisible = !document.hidden;
    this.frameRate = this.isMobile ? 20 : 30;
    this.particleCount = this.isMobile ? 50 : 150;
    
    this.init();
  }
  
  init() {
    this.detectDeviceCapabilities();
    this.setupVisibilityListener();
    this.setupReducedMotionListener();
    this.optimizeForDevice();
    this.throttleAnimations();
  }
  
  detectDeviceCapabilities() {
    // Check for low-power devices
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      this.isLowPowerMode = connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g';
    }
    
    // Check device memory (if available)
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      this.isLowPowerMode = true;
    }
    
    // Check CPU cores (if available)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      this.isLowPowerMode = true;
    }
    
    // Adjust settings for low-power devices
    if (this.isLowPowerMode) {
      this.frameRate = 15;
      this.particleCount = this.isMobile ? 20 : 50;
    }
  }
  
  setupVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      this.notifyVisibilityChange();
    });
  }
  
  setupReducedMotionListener() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addListener((e) => {
      this.prefersReducedMotion = e.matches;
      this.notifyMotionPreferenceChange();
    });
  }
  
  optimizeForDevice() {
    // Disable heavy effects on mobile
    if (this.isMobile) {
      this.disableHeavyEffects();
    }
    
    // Disable animations if reduced motion is preferred
    if (this.prefersReducedMotion) {
      this.disableAllAnimations();
    }
    
    // Apply low-power optimizations
    if (this.isLowPowerMode) {
      this.applyLowPowerOptimizations();
    }
  }
  
  disableHeavyEffects() {
    // Disable backdrop-filter on mobile
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        .info-panel,
        .modal-card {
          backdrop-filter: none !important;
        }
        
        .stars-background {
          display: none !important;
        }
        
        .constellations {
          display: none !important;
        }
        
        .orbits-container {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  disableAllAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  applyLowPowerOptimizations() {
    // Reduce particle count and frame rate
    this.frameRate = 10;
    this.particleCount = 20;
    
    // Disable complex animations
    const style = document.createElement('style');
    style.textContent = `
      .planet-glow,
      .sun-glow,
      .sun-rays {
        display: none !important;
      }
      
      .planet:hover {
        transform: none !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  throttleAnimations() {
    // Throttle requestAnimationFrame calls
    let lastTime = 0;
    const targetInterval = 1000 / this.frameRate;
    
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = (callback) => {
      return originalRAF((currentTime) => {
        if (currentTime - lastTime >= targetInterval) {
          lastTime = currentTime;
          callback(currentTime);
        }
      });
    };
  }
  
  notifyVisibilityChange() {
    // Pause/resume animations based on visibility
    const event = new CustomEvent('visibilitychange', {
      detail: { isVisible: this.isVisible }
    });
    window.dispatchEvent(event);
  }
  
  notifyMotionPreferenceChange() {
    const event = new CustomEvent('motionpreference', {
      detail: { prefersReducedMotion: this.prefersReducedMotion }
    });
    window.dispatchEvent(event);
  }
  
  // Public getters
  getFrameRate() {
    return this.frameRate;
  }
  
  getParticleCount() {
    return this.particleCount;
  }
  
  shouldUseAnimations() {
    return !this.prefersReducedMotion && this.isVisible;
  }
  
  isLowPower() {
    return this.isLowPowerMode;
  }
  
  isMobileDevice() {
    return this.isMobile;
  }
}

// Initialize performance manager early
window.performanceManager = new PerformanceManager();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceManager;
}

