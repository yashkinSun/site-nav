/**
 * Optimized Cosmic Background using Canvas
 * Replaces multiple DOM elements with efficient Canvas rendering
 */

class OptimizedCosmicBackground {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.constellations = [];
    this.animationId = null;
    
    // Performance settings
    this.maxParticles = 150;
    this.targetFPS = 30;
    this.frameInterval = 1000 / this.targetFPS;
    this.lastFrameTime = 0;
    
    // Responsive settings
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    this.isLowMotion = false;
    
    this.init();
  }
  
  init() {
    this.createCanvas();
    this.setupParticles();
    this.setupConstellations();
    this.bindEvents();
    this.startAnimation();
  }
  
  createCanvas() {
    // Remove old canvas if exists
    const oldCanvas = document.getElementById('cosmic-canvas');
    if (oldCanvas) {
      oldCanvas.remove();
    }
    
    // Create new canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'cosmic-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    `;
    
    document.body.insertBefore(this.canvas, document.body.firstChild);
    this.ctx = this.canvas.getContext('2d');
    
    this.resizeCanvas();
  }
  
  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    // Set actual size in memory (scaled for high DPI)
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    // Scale the drawing context so everything draws at the correct size
    this.ctx.scale(dpr, dpr);
    
    // Set display size
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }
  
  setupParticles() {
    this.particles = [];
    const particleCount = this.isMobile ? 50 : this.maxParticles;
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.2,
        driftY: (Math.random() - 0.5) * 0.2
      });
    }
  }
  
  setupConstellations() {
    this.constellations = [];
    const constellationCount = this.isMobile ? 3 : 5;
    
    for (let i = 0; i < constellationCount; i++) {
      const constellation = {
        points: [],
        opacity: Math.random() * 0.3 + 0.1
      };
      
      // Create constellation points
      const pointCount = Math.floor(Math.random() * 4) + 3;
      for (let j = 0; j < pointCount; j++) {
        constellation.points.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight
        });
      }
      
      this.constellations.push(constellation);
    }
  }
  
  updateParticles(deltaTime) {
    if (this.isLowMotion) return;
    
    this.particles.forEach(particle => {
      // Twinkle effect
      particle.twinklePhase += particle.twinkleSpeed * deltaTime;
      particle.opacity = 0.3 + Math.sin(particle.twinklePhase) * 0.5;
      
      // Gentle drift
      particle.x += particle.driftX * deltaTime * 0.01;
      particle.y += particle.driftY * deltaTime * 0.01;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = window.innerWidth;
      if (particle.x > window.innerWidth) particle.x = 0;
      if (particle.y < 0) particle.y = window.innerHeight;
      if (particle.y > window.innerHeight) particle.y = 0;
    });
  }
  
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render particles (stars)
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowBlur = particle.size * 2;
      this.ctx.shadowColor = '#ffffff';
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
    
    // Render constellations
    if (!this.isMobile && !this.isLowMotion) {
      this.constellations.forEach(constellation => {
        this.ctx.save();
        this.ctx.globalAlpha = constellation.opacity;
        this.ctx.strokeStyle = '#4a9eff';
        this.ctx.lineWidth = 1;
        
        this.ctx.beginPath();
        constellation.points.forEach((point, index) => {
          if (index === 0) {
            this.ctx.moveTo(point.x, point.y);
          } else {
            this.ctx.lineTo(point.x, point.y);
          }
        });
        this.ctx.stroke();
        this.ctx.restore();
      });
    }
  }
  
  animate(currentTime) {
    if (currentTime - this.lastFrameTime >= this.frameInterval) {
      const deltaTime = currentTime - this.lastFrameTime;
      
      this.updateParticles(deltaTime);
      this.render();
      
      this.lastFrameTime = currentTime;
    }
    
    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }
  
  startAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.animate(0);
  }
  
  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  bindEvents() {
    // Handle resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.setupParticles();
      this.setupConstellations();
    });
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAnimation();
      } else {
        this.startAnimation();
      }
    });
    
    // Handle low motion changes
    window.addEventListener('lowMotionChange', (e) => {
      this.isLowMotion = e.detail.enabled;
      if (this.isLowMotion) {
        this.setParticleCount(30);
        this.setFPS(15);
      }
    });
  }
  
  // Public methods for external control
  setParticleCount(count) {
    this.maxParticles = count;
    this.setupParticles();
  }
  
  setFPS(fps) {
    this.targetFPS = fps;
    this.frameInterval = 1000 / this.targetFPS;
  }
  
  destroy() {
    this.stopAnimation();
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

// Initialize optimized cosmic background
document.addEventListener('DOMContentLoaded', () => {
  // Remove old cosmic background elements
  const oldElements = document.querySelectorAll('.stars-container, .constellation-lines, .floating-particles');
  oldElements.forEach(el => el.remove());
  
  // Initialize new optimized background
  window.cosmicBackground = new OptimizedCosmicBackground();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading
} else {
  // DOM is already loaded
  const oldElements = document.querySelectorAll('.stars-container, .constellation-lines, .floating-particles');
  oldElements.forEach(el => el.remove());
  window.cosmicBackground = new OptimizedCosmicBackground();
}

