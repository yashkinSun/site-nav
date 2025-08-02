// PalmBit Cosmic Site - Cosmic Background Manager

class CosmicBackground {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.stars = [];
    this.animationId = null;
    this.isInitialized = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.parallaxFactor = 0.02;
    
    this.init();
  }
  
  init() {
    this.canvas = document.getElementById('starsCanvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.setupCanvas();
    this.createStars();
    this.bindEvents();
    this.animate();
    this.isInitialized = true;
  }
  
  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }
  
  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    this.ctx.scale(dpr, dpr);
    
    // Recreate stars when canvas is resized
    if (this.isInitialized) {
      this.createStars();
    }
  }
  
  createStars() {
    this.stars = [];
    const numStars = this.getStarCount();
    const rect = this.canvas.getBoundingClientRect();
    
    for (let i = 0; i < numStars; i++) {
      this.stars.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        parallaxLayer: Math.random() * 3 + 1 // 1-4 layers for parallax
      });
    }
  }
  
  getStarCount() {
    const rect = this.canvas.getBoundingClientRect();
    const area = rect.width * rect.height;
    const density = window.innerWidth < 768 ? 0.0001 : 0.0002; // Fewer stars on mobile
    return Math.min(Math.max(Math.floor(area * density), 50), 300);
  }
  
  bindEvents() {
    // Mouse movement for parallax effect
    document.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX - window.innerWidth / 2) * this.parallaxFactor;
      this.mouseY = (e.clientY - window.innerHeight / 2) * this.parallaxFactor;
    });
    
    // Touch events for mobile parallax
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        this.mouseX = (touch.clientX - window.innerWidth / 2) * this.parallaxFactor;
        this.mouseY = (touch.clientY - window.innerHeight / 2) * this.parallaxFactor;
      }
    }, { passive: true });
    
    // Device orientation for mobile parallax
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        this.mouseX = (e.gamma || 0) * 0.5;
        this.mouseY = (e.beta || 0) * 0.5;
      });
    }
  }
  
  animate() {
    this.clear();
    this.updateStars();
    this.drawStars();
    
    this.animationId = performanceManager.limitRAF(() => this.animate());
  }
  
  clear() {
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);
  }
  
  updateStars() {
    const time = Date.now() * 0.001;
    
    this.stars.forEach(star => {
      // Twinkle effect
      star.opacity = 0.3 + 0.5 * (Math.sin(time * star.twinkleSpeed + star.twinklePhase) + 1) / 2;
      
      // Subtle movement
      star.x += Math.sin(time * 0.1 + star.twinklePhase) * 0.1;
      star.y += Math.cos(time * 0.08 + star.twinklePhase) * 0.1;
      
      // Keep stars within bounds
      const rect = this.canvas.getBoundingClientRect();
      if (star.x < 0) star.x = rect.width;
      if (star.x > rect.width) star.x = 0;
      if (star.y < 0) star.y = rect.height;
      if (star.y > rect.height) star.y = 0;
    });
  }
  
  drawStars() {
    this.stars.forEach(star => {
      // Apply parallax offset based on layer
      const parallaxX = this.mouseX * star.parallaxLayer;
      const parallaxY = this.mouseY * star.parallaxLayer;
      
      const x = star.x + parallaxX;
      const y = star.y + parallaxY;
      
      // Create gradient for star glow
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, star.size * 2);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 255, ${star.opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, star.size * 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw bright center
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, star.size * 0.5, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
  
  // Add shooting star effect
  createShootingStar() {
    if (Math.random() < 0.001) { // Very rare
      const rect = this.canvas.getBoundingClientRect();
      const shootingStar = {
        x: Math.random() * rect.width,
        y: Math.random() * rect.height * 0.3, // Top third of screen
        vx: Math.random() * 3 + 2,
        vy: Math.random() * 2 + 1,
        life: 1,
        decay: 0.02
      };
      
      this.drawShootingStar(shootingStar);
    }
  }
  
  drawShootingStar(star) {
    const gradient = this.ctx.createLinearGradient(
      star.x, star.y,
      star.x - star.vx * 10, star.y - star.vy * 10
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${star.life})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(star.x, star.y);
    this.ctx.lineTo(star.x - star.vx * 10, star.y - star.vy * 10);
    this.ctx.stroke();
  }
  
  // Performance optimization
  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  resume() {
    if (!this.animationId && this.isInitialized) {
      this.animate();
    }
  }
  
  destroy() {
    this.pause();
    window.removeEventListener('resize', this.resizeCanvas);
    this.stars = [];
    this.isInitialized = false;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.cosmicBackground = new CosmicBackground();
});

// Pause animation when page is not visible (performance optimization)
document.addEventListener('visibilitychange', () => {
  if (window.cosmicBackground) {
    if (document.hidden) {
      window.cosmicBackground.pause();
    } else {
      window.cosmicBackground.resume();
    }
  }
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.cosmicBackground) {
      window.cosmicBackground.destroy();
    }
  });
}

