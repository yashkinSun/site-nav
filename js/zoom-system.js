// PalmBit Cosmic Site - Enhanced Zoom System with Smooth Transitions

class ZoomSystem {
  constructor() {
    this.isActive = false;
    this.currentPlanet = null;
    this.zoomContainer = null;
    this.backButton = null;
    this.isTransitioning = false;
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    this.socialsModal = null;
    
    this.planetData = {
      dev: {
        title: 'PalmBit.dev',
        subtitle: 'Development Studio',
        description: 'Navigate Your Tech Universe',
        color: 'rgba(0, 245, 255, 0.8)',
        items: [
          { label: 'AI Solutions', position: { orbit: 1, angle: 0 } },
          { label: 'Web Development', position: { orbit: 1, angle: 180 } },
          { label: 'Automation', position: { orbit: 2, angle: 90 } },
          { label: 'Custom Development', position: { orbit: 2, angle: 270 } },
          { label: 'Chat Bots', position: { orbit: 3, angle: 45 } },
          { label: 'AI Integrations', position: { orbit: 3, angle: 225 } }
        ],
        actions: [
          { label: 'Visit Studio', url: 'https://palmbit.dev', primary: true },
          { label: 'Socials', action: 'showSocials', primary: false }
        ]
      },
      media: {
        title: 'PalmBit.media',
        subtitle: 'IT/AI/Crypto Media Hub',
        description: 'Navigate Your Tech Universe',
        color: 'rgba(177, 0, 255, 0.8)',
        items: [
          { label: 'Tech News', position: { orbit: 1, angle: 0 } },
          { label: 'AI Insights', position: { orbit: 1, angle: 120 } },
          { label: 'Crypto Updates', position: { orbit: 1, angle: 240 } },
          { label: 'Market Analytics', position: { orbit: 2, angle: 60 } },
          { label: 'Expert Reviews', position: { orbit: 2, angle: 180 } },
          { label: 'Industry Trends', position: { orbit: 2, angle: 300 } }
        ],
        actions: [
          { label: 'Visit Media', url: 'https://palmbit.media', primary: true },
          { label: 'Socials', action: 'showSocials', primary: false }
        ]
      },
      learn: {
        title: 'PalmBit Learn',
        subtitle: 'Educational Platform',
        description: 'Navigate Your Tech Universe',
        color: 'rgba(255, 177, 0, 0.8)',
        items: [
          { label: 'Video Courses', position: { orbit: 1, angle: 0 } },
          { label: 'Certifications', position: { orbit: 1, angle: 180 } },
          { label: 'Expert Training', position: { orbit: 2, angle: 90 } },
          { label: 'Hands-on Projects', position: { orbit: 2, angle: 270 } },
          { label: 'Live Workshops', position: { orbit: 3, angle: 45 } },
          { label: 'Community', position: { orbit: 3, angle: 225 } }
        ],
        actions: [
          { label: 'Coming Soon', action: 'showNotifyForm', primary: true },
          { label: 'Socials', action: 'showSocials', primary: false }
        ]
      }
    };
    
    this.init();
  }
  
  init() {
    if (this.isMobile) {
      // На мобильных устройствах используем модальную систему
      return;
    }
    
    this.createZoomContainer();
    this.bindEvents();
  }
  
  createZoomContainer() {
    // Создаем контейнер для zoom эффекта
    this.zoomContainer = document.createElement('div');
    this.zoomContainer.className = 'zoom-container';
    this.zoomContainer.innerHTML = `
      <div class="zoom-overlay"></div>
      <div class="zoom-content">
        <div class="zoom-planet-wrapper">
          <div class="zoom-planet">
            <img src="" alt="" class="zoom-planet-image">
          </div>
        </div>
        <div class="zoom-planet-info">
          <h2 class="zoom-planet-title"></h2>
          <p class="zoom-planet-subtitle"></p>
        </div>
        <div class="zoom-orbital-system">
          <div class="zoom-orbit zoom-orbit-1"></div>
          <div class="zoom-orbit zoom-orbit-2"></div>
          <div class="zoom-orbit zoom-orbit-3"></div>
          <div class="zoom-orbit-labels"></div>
        </div>
        <div class="zoom-actions"></div>
      </div>
      <button class="zoom-back-btn" aria-label="Back to main view">
        <i class="fas fa-arrow-left"></i>
      </button>
    `;
    
    document.body.appendChild(this.zoomContainer);
    
    this.backButton = this.zoomContainer.querySelector('.zoom-back-btn');
    this.setupBackButton();
  }
  
  setupBackButton() {
    if (this.backButton) {
      this.backButton.addEventListener('click', () => this.closeZoom());
    }
  }
  
  bindEvents() {
    // Слушаем клики по планетам
    document.addEventListener('click', (e) => {
      const planet = e.target.closest('.planet');
      if (planet && !this.isTransitioning) {
        const planetType = planet.dataset.planet;
        if (planetType && this.planetData[planetType]) {
          e.preventDefault();
          e.stopPropagation();
          this.openZoom(planetType, planet);
        }
      }
    });
    
    // Обработка клавиши Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isActive) {
        this.closeZoom();
      }
    });
    
    // Обработка истории браузера
    window.addEventListener('popstate', (e) => {
      if (this.isActive) {
        this.closeZoom(false); // false = не добавлять в историю
      }
    });
    
    // Обработка изменения размера экрана
    window.addEventListener('resize', () => {
      const newIsMobile = window.matchMedia('(max-width: 768px)').matches;
      if (newIsMobile !== this.isMobile) {
        this.isMobile = newIsMobile;
        if (this.isActive && this.isMobile) {
          this.closeZoom();
        }
      }
    });
  }
  
  openZoom(planetType, planetElement) {
    if (this.isTransitioning || this.isActive || this.isMobile) return;
    
    this.isTransitioning = true;
    this.currentPlanet = planetType;
    this.currentPlanetElement = planetElement; // Сохраняем ссылку на исходную планету
    const data = this.planetData[planetType];
    
    // Скрываем все tooltip'ы и сбрасываем состояния планет
    this.hideAllTooltips();
    this.resetAllPlanetStates();
    
    // Скрываем исходную планету для эффекта погружения
    this.hideOriginalPlanet(planetElement);
    
    // Получаем позицию планеты для анимации
    const planetRect = planetElement.getBoundingClientRect();
    const planetImage = planetElement.querySelector('.planet-image');
    
    // Настраиваем контент
    this.setupZoomContent(data, planetImage.src);
    
    // Добавляем в историю браузера
    history.pushState({ zoom: planetType }, '', `#${planetType}`);
    
    // Показываем контейнер
    this.zoomContainer.style.display = 'block';
    document.body.classList.add('zoom-active');
    
    // Анимация появления
    requestAnimationFrame(() => {
      this.zoomContainer.classList.add('active');
      this.isActive = true;
      
      // Завершаем переход
      setTimeout(() => {
        this.isTransitioning = false;
      }, 1200);
    });
    
    // Блокируем скролл
    document.body.style.overflow = 'hidden';
    
    // Фокус на кнопке назад для доступности
    setTimeout(() => {
      this.backButton.focus();
    }, 1300);
  }
  
  setupZoomContent(data, imageSrc) {
    const planetImage = this.zoomContainer.querySelector('.zoom-planet-image');
    const planetTitle = this.zoomContainer.querySelector('.zoom-planet-title');
    const planetSubtitle = this.zoomContainer.querySelector('.zoom-planet-subtitle');
    const orbitLabels = this.zoomContainer.querySelector('.zoom-orbit-labels');
    const actions = this.zoomContainer.querySelector('.zoom-actions');
    
    // Устанавливаем изображение и информацию
    planetImage.src = imageSrc;
    planetImage.alt = data.title;
    planetTitle.textContent = data.title;
    planetSubtitle.textContent = data.subtitle;
    
    // Устанавливаем цветовую схему
    this.zoomContainer.className = `zoom-container ${this.currentPlanet}`;
    
    // Создаем орбитальные метки
    orbitLabels.innerHTML = '';
    data.items.forEach((item, index) => {
      const label = document.createElement('div');
      label.className = `zoom-orbit-label orbit-${item.position.orbit}`;
      label.innerHTML = `<span>${item.label}</span>`;
      
      // Позиционируем метку на орбите
      const angle = item.position.angle;
      const radius = this.getOrbitRadius(item.position.orbit);
      const x = Math.cos(angle * Math.PI / 180) * radius;
      const y = Math.sin(angle * Math.PI / 180) * radius;

      label.style.left = `calc(50% + ${x}px)`;
      label.style.top = `calc(50% + ${y}px)`;
      label.style.animationDelay = `${0.5 + index * 0.1}s`;
      
      orbitLabels.appendChild(label);
    });
    
    // Создаем кнопки действий
    actions.innerHTML = '';
    data.actions.forEach(action => {
      const button = document.createElement('button');
      button.className = `zoom-action-btn ${action.primary ? 'primary' : 'secondary'}`;
      button.textContent = action.label;
      
      if (action.url) {
        button.addEventListener('click', () => {
          window.open(action.url, '_blank');
        });
      } else if (action.action === 'showSocials') {
        button.addEventListener('click', () => this.showSocials());
      } else if (action.action === 'showNotifyForm') {
        button.addEventListener('click', () => this.showNotifyForm());
      }
      
      actions.appendChild(button);
    });
  }
  
  getOrbitRadius(orbitNumber) {
    const baseRadius = 180;
    return baseRadius + (orbitNumber - 1) * 82.5;
  }
  
  closeZoom(updateHistory = true) {
    if (this.isTransitioning || !this.isActive) return;
    
    this.isTransitioning = true;
    
    // Анимация исчезновения
    this.zoomContainer.classList.remove('active');
    document.body.classList.remove('zoom-active');
    
    // Восстанавливаем скролл
    document.body.style.overflow = '';
    
    // Показываем исходную планету обратно
    this.showOriginalPlanet();
    
    // Обновляем историю браузера
    if (updateHistory && window.location.hash === `#${this.currentPlanet}`) {
      history.back();
    }
    
    // Скрываем контейнер после анимации
    setTimeout(() => {
      this.zoomContainer.style.display = 'none';
      this.isActive = false;
      this.isTransitioning = false;
      
      // Возвращаем фокус на планету
      if (this.currentPlanetElement) {
        this.currentPlanetElement.focus();
      }
      
      this.currentPlanet = null;
      this.currentPlanetElement = null;
    }, 800);
  }
  
  hideAllTooltips() {
    // Скрываем все tooltip'ы планет
    const tooltips = document.querySelectorAll('.planet-tooltip');
    tooltips.forEach(tooltip => {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      tooltip.style.pointerEvents = 'none';
    });
    
    // Скрываем любые другие всплывающие элементы
    const popups = document.querySelectorAll('.popup, .dropdown, .modal-overlay');
    popups.forEach(popup => {
      popup.style.opacity = '0';
      popup.style.visibility = 'hidden';
      popup.style.pointerEvents = 'none';
    });
  }
  
  resetAllPlanetStates() {
    // Сбрасываем состояния всех планет
    const planets = document.querySelectorAll('.planet');
    planets.forEach(planet => {
      planet.classList.remove('active', 'hovered', 'zoomed');
      planet.style.transform = '';
      planet.style.transition = '';
      
      // Сбрасываем состояние glow эффектов
      const glow = planet.querySelector('.planet-glow');
      if (glow) {
        glow.style.opacity = '0';
        glow.style.transform = '';
      }
    });
    
  }
  
  hideOriginalPlanet(planetElement) {
    // Плавно скрываем исходную планету
    planetElement.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    planetElement.style.opacity = '0';
    planetElement.style.transform = 'scale(0.8)';
    planetElement.style.pointerEvents = 'none';
  }

  showOriginalPlanet() {
    // Плавно показываем исходную планету обратно
    if (this.currentPlanetElement) {
      this.currentPlanetElement.style.transition = 'opacity 0.6s ease-in, transform 0.6s ease-in';
      this.currentPlanetElement.style.opacity = '1';
      this.currentPlanetElement.style.transform = 'scale(1)';
      this.currentPlanetElement.style.pointerEvents = 'auto';
    }
  }

  showSocials() {
    if (this.socialsModal) return;

    const data = this.getSocialsData(this.currentPlanet);
    const modal = document.createElement('div');
    modal.className = 'planet-modal socials-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close" aria-label="Close socials"><i class="fas fa-times"></i></button>
        <div class="modal-body">
          <div class="modal-social">
            <h4>Connect</h4>
            <div class="social-links">
              <a href="${data.telegram}" class="social-link" target="_blank">
                <i class="fab fa-telegram-plane"></i>
                Bot Navigator
              </a>
              <a href="https://instagram.com/${data.instagram.replace('@','')}" class="social-link" target="_blank">
                <i class="fab fa-instagram"></i>
                ${data.instagram}
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('active'));

    const close = () => {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.remove();
        this.socialsModal = null;
      }, 300);
    };

    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.querySelector('.modal-overlay').addEventListener('click', close);

    this.socialsModal = modal;
  }

  showNotifyForm() {
    // Показываем форму уведомлений (можно интегрировать с существующей системой)
    if (window.modalSystem) {
      window.modalSystem.showNotifyForm();
    }
  }
  
  // Публичные методы
  isZoomActive() {
    return this.isActive;
  }
  
  getCurrentPlanet() {
    return this.currentPlanet;
  }
  
  destroy() {
    if (this.zoomContainer && this.zoomContainer.parentNode) {
      this.zoomContainer.parentNode.removeChild(this.zoomContainer);
    }
    
    document.body.classList.remove('zoom-active');
    document.body.style.overflow = '';
    
    this.isActive = false;
    this.currentPlanet = null;
    this.isTransitioning = false;
  }

  getSocialsData(planetType) {
    const data = {
      dev: {
        telegram: 'https://t.me/PalmBitNavigatorBot',
        instagram: '@palmbit.dev'
      },
      media: {
        telegram: 'https://t.me/PalmBitNavigatorBot',
        instagram: '@palmbit.media'
      },
      learn: {
        telegram: 'https://t.me/PalmBitNavigatorBot',
        instagram: '@palmbit.learn'
      }
    };

    return data[planetType] || data.dev;
  }
}

// Автоинициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  window.zoomSystem = new ZoomSystem();
});

// Обработка выгрузки страницы
window.addEventListener('beforeunload', () => {
  if (window.zoomSystem) {
    window.zoomSystem.destroy();
  }
});

