// PalmBit Cosmic Site - Planet Animations Manager

class PlanetAnimations {
  constructor() {
    this.planets = [];
    this.isInitialized = false;
    this.touchDevice = 'ontouchstart' in window;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resizeTimeout = null;
    this.floatingAnimationId = null;

    this.init();
  }
  
  init() {
    this.setupPlanets();
    this.bindEvents();
    this.startAnimations();
    this.isInitialized = true;
  }
  
  setupPlanets() {
    const planetElements = document.querySelectorAll('.planet');
    
    planetElements.forEach(planet => {
      const planetData = {
        element: planet,
        type: planet.dataset.planet,
        tooltip: planet.querySelector('.planet-tooltip'),
        surface: planet.querySelector('.planet-surface'),
        glow: planet.querySelector('.planet-glow'),
        icon: planet.querySelector('.planet-icon'),
        name: planet.querySelector('.planet-name'),
        isHovered: false,
        isActive: false,
        originalTransform: '',
        animationOffset: Math.random() * Math.PI * 2
      };
      
      this.planets.push(planetData);
      this.setupPlanetEvents(planetData);
    });
  }
  
  setupPlanetEvents(planetData) {
    const { element, tooltip } = planetData;
    
    // Mouse events
    element.addEventListener('mouseenter', () => this.handlePlanetHover(planetData, true));
    element.addEventListener('mouseleave', () => this.handlePlanetHover(planetData, false));
    element.addEventListener('click', (e) => this.handlePlanetClick(e, planetData));
    
    // Touch events for mobile
    if (this.touchDevice) {
      let touchStartTime = 0;
      
      element.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartTime = Date.now();

        // Add immediate visual feedback
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.1s ease';
      }, { passive: false });

      element.addEventListener('touchend', (e) => {
        e.preventDefault();
        const touchDuration = Date.now() - touchStartTime;

        // Reset visual feedback
        element.style.transform = '';

        // Only trigger if it was a quick tap (not a long press)
        if (touchDuration < 500) {
          this.handlePlanetTouch(e, planetData);
        }
      }, { passive: false });

      element.addEventListener('touchcancel', () => {
        // Reset visual feedback on cancel
        element.style.transform = '';
      }, { passive: true });
    }
    
    // Keyboard accessibility
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handlePlanetClick(e, planetData);
      }
    });
    
    element.addEventListener('focus', () => this.handlePlanetFocus(planetData, true));
    element.addEventListener('blur', () => this.handlePlanetFocus(planetData, false));
    
    // Make planets focusable
    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'button');
    element.setAttribute('aria-label', `Open ${planetData.type} information`);
  }
  
  handlePlanetHover(planetData, isHovered) {
    if (this.touchDevice) return; // Skip hover on touch devices
    
    planetData.isHovered = isHovered;
    
    if (isHovered) {
      this.showPlanetTooltip(planetData);
      this.enhancePlanetGlow(planetData);
      this.pausePlanetOrbitalMotion(planetData);
    } else {
      this.hidePlanetTooltip(planetData);
      this.normalPlanetGlow(planetData);
      this.resumePlanetOrbitalMotion(planetData);
    }
  }
  
  handlePlanetTouch(e, planetData) {
    // On touch devices, directly open modal instead of showing tooltip
    this.handlePlanetClick(e, planetData);
  }
  
  handlePlanetClick(e, planetData) {
    e.preventDefault();
    e.stopPropagation();

    // Add click animation
    this.animatePlanetClick(planetData);

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    setTimeout(() => {
      if (isMobile && window.mobileCardSystem) {
        window.mobileCardSystem.openCard(planetData.type);
      } else if (window.zoomSystem) {
        window.zoomSystem.openZoom(planetData.type, planetData.element);
      } else {
        this.openPlanetModal(planetData.type);
      }
    }, 200);
  }
  
  handlePlanetFocus(planetData, isFocused) {
    if (isFocused) {
      this.showPlanetTooltip(planetData);
      this.enhancePlanetGlow(planetData);
    } else {
      this.hidePlanetTooltip(planetData);
      this.normalPlanetGlow(planetData);
    }
  }
  
  showPlanetTooltip(planetData) {
    if (!planetData.tooltip) return;

    planetData.isActive = true;
    planetData.element.classList.add('active');
    planetData.tooltip.classList.add('tooltip-visible');
  }

  hidePlanetTooltip(planetData) {
    if (!planetData.tooltip) return;

    planetData.isActive = false;
    planetData.element.classList.remove('active');
    planetData.tooltip.classList.remove('tooltip-visible');
  }

  enhancePlanetGlow(planetData) {
    if (!planetData.glow || this.reducedMotion) return;
    planetData.glow.classList.add('glow-active');
  }

  normalPlanetGlow(planetData) {
    if (!planetData.glow || this.reducedMotion) return;
    planetData.glow.classList.remove('glow-active');
  }
  
  animatePlanetClick(planetData) {
    if (this.reducedMotion) return;
    
    const { element } = planetData;
    
    // Scale down animation
    element.style.transition = 'transform 0.1s ease';
    element.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      element.style.transition = 'transform 0.2s ease';
      element.style.transform = 'scale(1.05)';
      
      setTimeout(() => {
        element.style.transition = 'transform 0.3s ease';
        element.style.transform = 'scale(1)';
      }, 100);
    }, 100);
  }
  
  pausePlanetOrbitalMotion(planetData) {
    if (this.reducedMotion) return;
    
    planetData.element.style.animationPlayState = 'paused';
  }
  
  resumePlanetOrbitalMotion(planetData) {
    if (this.reducedMotion) return;
    
    planetData.element.style.animationPlayState = 'running';
  }
  
  openPlanetModal(planetType) {
    // Dispatch custom event for modal system
    const event = new CustomEvent('openPlanetModal', {
      detail: { planet: planetType }
    });
    document.dispatchEvent(event);
  }
  
  startAnimations() {
    if (this.reducedMotion) return;
    this.animateFloating();
  }

  animateFloating(time = 0) {
    const t = time * 0.001;
    this.planets.forEach(planetData => {
      if (planetData.isHovered || planetData.isActive) return;
      const offsetX = Math.sin(t * 0.5 + planetData.animationOffset) * 3;
      const offsetY = Math.cos(t * 0.3 + planetData.animationOffset) * 2;
      if (!planetData.element.style.transform.includes('scale')) {
        planetData.element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    });
    this.floatingAnimationId = performanceManager.limitRAF((ts) => this.animateFloating(ts));
  }
  
  // Intersection Observer for performance
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const planetData = this.planets.find(p => p.element === entry.target);
        if (planetData) {
          if (entry.isIntersecting) {
            this.resumePlanetAnimations(planetData);
          } else {
            this.pausePlanetAnimations(planetData);
          }
        }
      });
    }, { threshold: 0.1 });
    
    this.planets.forEach(planetData => {
      observer.observe(planetData.element);
    });
  }
  
  pausePlanetAnimations(planetData) {
    planetData.element.style.animationPlayState = 'paused';
  }
  
  resumePlanetAnimations(planetData) {
    if (!this.reducedMotion) {
      planetData.element.style.animationPlayState = 'running';
    }
  }
  
  bindEvents() {
    // Handle window resize with throttling
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 200);
    });
    
    // Handle orientation change on mobile
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleResize();
      }, 100);
    });
  }
  
  handleResize() {
    // Recalculate planet positions if needed
    this.planets.forEach(planetData => {
      this.hidePlanetTooltip(planetData);
    });
  }
  
  destroy() {
    this.planets.forEach(planetData => {
      this.hidePlanetTooltip(planetData);
      planetData.element.style.animation = 'none';
      planetData.element.style.transform = '';
    });

    if (this.floatingAnimationId) {
      cancelAnimationFrame(this.floatingAnimationId);
      this.floatingAnimationId = null;
    }

    this.planets = [];
    this.isInitialized = false;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.planetAnimations = new PlanetAnimations();
});

// Handle reduced motion changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
  if (window.planetAnimations) {
    window.planetAnimations.reducedMotion = e.matches;
    if (e.matches) {
      window.planetAnimations.destroy();
    } else {
      window.planetAnimations = new PlanetAnimations();
    }
  }
});

