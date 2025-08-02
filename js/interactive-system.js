/**
 * Interactive Planet System for Desktop
 * Handles planet zoom effects and information panel display
 */

class InteractivePlanetSystem {
  constructor() {
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    this.currentZoomedPlanet = null;
    this.infoPanel = document.getElementById('info-panel');
    this.infoPanelTitle = document.getElementById('infoPanelTitle');
    this.infoPanelList = document.getElementById('infoPanelList');
    this.infoPanelClose = document.getElementById('infoPanelClose');
    
    this.planetData = {
      dev: {
        title: 'PalmBit.dev',
        subtitle: 'Development Studio',
        items: [
          'Custom Development',
          'Chat Bots',
          'AI Integrations', 
          'Web Development'
        ]
      },
      media: {
        title: 'PalmBit.media',
        subtitle: 'Media Platform',
        items: [
          'Fast & Reliable',
          'Multilingual',
          'Digital Focused'
        ]
      },
      learn: {
        title: 'PalmBit Learn',
        subtitle: 'Educational Platform',
        items: [
          'Video Courses',
          'Professional Certifications',
          'Expert Training',
          'Hands-on Projects'
        ]
      }
    };
    
    this.init();
  }
  
  init() {
    // Add mobile class if needed
    if (this.isMobile) {
      document.documentElement.classList.add('mobile-view');
      return; // Don't initialize desktop interactions on mobile
    }
    
    this.bindEvents();
    this.setupResponsiveListener();
  }
  
  bindEvents() {
    // Planet click events
    const planets = document.querySelectorAll('.planet');
    planets.forEach(planet => {
      planet.addEventListener('click', (e) => this.handlePlanetClick(e));
    });
    
    // Info panel close button
    if (this.infoPanelClose) {
      this.infoPanelClose.addEventListener('click', () => this.closeInfoPanel());
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeInfoPanel();
      }
    });
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (this.currentZoomedPlanet && 
          !e.target.closest('.planet') && 
          !e.target.closest('.info-panel')) {
        this.closeInfoPanel();
      }
    });
  }
  
  handlePlanetClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const planet = event.currentTarget;
    const planetType = planet.dataset.type;
    
    if (!planetType || !this.planetData[planetType]) {
      console.warn('Unknown planet type:', planetType);
      return;
    }
    
    // If same planet is clicked, close
    if (this.currentZoomedPlanet === planet) {
      this.closeInfoPanel();
      return;
    }
    
    // Close previous if any
    if (this.currentZoomedPlanet) {
      this.resetPlanet(this.currentZoomedPlanet);
    }
    
    // Zoom new planet and show info
    this.zoomPlanet(planet);
    this.showInfoPanel(planetType);
  }
  
  zoomPlanet(planet) {
    planet.classList.add('zoomed');
    this.currentZoomedPlanet = planet;
    
    // Hide tooltip during zoom
    const tooltip = planet.querySelector('.planet-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
      tooltip.style.pointerEvents = 'none';
    }
  }
  
  resetPlanet(planet) {
    planet.classList.remove('zoomed');
    
    // Restore tooltip
    const tooltip = planet.querySelector('.planet-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '';
      tooltip.style.pointerEvents = '';
    }
  }
  
  showInfoPanel(planetType) {
    const data = this.planetData[planetType];
    
    // Set title
    this.infoPanelTitle.textContent = data.title;
    
    // Clear and populate list
    this.infoPanelList.innerHTML = '';
    data.items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      this.infoPanelList.appendChild(li);
    });
    
    // Show panel with animation
    performanceManager.limitRAF(() => {
      this.infoPanel.classList.add('visible');
    });
  }
  
  closeInfoPanel() {
    // Hide panel
    this.infoPanel.classList.remove('visible');
    
    // Reset zoomed planet
    if (this.currentZoomedPlanet) {
      this.resetPlanet(this.currentZoomedPlanet);
      this.currentZoomedPlanet = null;
    }
  }
  
  setupResponsiveListener() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addListener((e) => {
      if (e.matches) {
        // Switched to mobile
        this.isMobile = true;
        document.documentElement.classList.add('mobile-view');
        this.closeInfoPanel();
      } else {
        // Switched to desktop
        this.isMobile = false;
        document.documentElement.classList.remove('mobile-view');
      }
    });
  }
  
  // Public method to check if system is active
  isActive() {
    return !this.isMobile;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for other systems to initialize
  setTimeout(() => {
    window.interactivePlanetSystem = new InteractivePlanetSystem();
  }, 100);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InteractivePlanetSystem;
}

