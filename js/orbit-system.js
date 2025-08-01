// Orbit System - Система орбит с блоками информации
class OrbitSystem {
    constructor() {
        this.currentPlanet = null;
        this.isActive = false;
        this.socialsPopup = null;
        this.init();
    }

    init() {
        this.createOrbitContainer();
        this.setupEventListeners();
    }

    createOrbitContainer() {
        // Создаем контейнер для орбитальной системы
        const container = document.createElement('div');
        container.className = 'zoom-container';
        container.id = 'orbit-container';
        
        container.innerHTML = `
            <button class="back-button" id="orbit-back-btn">←</button>
            <div class="zoom-planet" id="orbit-planet"></div>
            <div class="orbit orbit-1" id="orbit-1"></div>
            <div class="orbit orbit-2" id="orbit-2"></div>
            <div class="orbit orbit-3" id="orbit-3"></div>
            <div class="action-buttons" id="action-buttons"></div>
        `;
        
        document.body.appendChild(container);
    }

    setupEventListeners() {
        // Кнопка возврата
        document.getElementById('orbit-back-btn').addEventListener('click', () => {
            this.closeOrbitView();
        });

        // Клавиша Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.closeOrbitView();
            }
        });
    }

    openOrbitView(planetType) {
        this.currentPlanet = planetType;
        this.isActive = true;
        
        const container = document.getElementById('orbit-container');
        const planet = document.getElementById('orbit-planet');
        
        // Устанавливаем изображение планеты
        planet.innerHTML = `<img src="images/planet-${planetType}.png" alt="${planetType} planet">`;
        
        // Очищаем орбиты
        document.getElementById('orbit-1').innerHTML = '';
        document.getElementById('orbit-2').innerHTML = '';
        document.getElementById('orbit-3').innerHTML = '';
        
        // Добавляем информационные блоки
        this.addOrbitItems(planetType);
        
        // Добавляем кнопки действий
        this.addActionButtons(planetType);
        
        // Показываем контейнер
        container.classList.add('active');
        
        // Скрываем основной интерфейс
        document.querySelector('.space-container').style.opacity = '0.1';
    }

    addOrbitItems(planetType) {
        const orbitData = this.getOrbitData(planetType);
        
        // Орбита 1 - ближняя (2 элемента)
        const orbit1 = document.getElementById('orbit-1');
        orbitData.orbit1.forEach((item, index) => {
            const element = document.createElement('div');
            element.className = 'orbit-item';
            element.textContent = item;
            orbit1.appendChild(element);
        });

        // Орбита 2 - средняя (2 элемента)
        const orbit2 = document.getElementById('orbit-2');
        orbitData.orbit2.forEach((item, index) => {
            const element = document.createElement('div');
            element.className = 'orbit-item';
            element.textContent = item;
            orbit2.appendChild(element);
        });
    }

    addActionButtons(planetType) {
        const buttonsContainer = document.getElementById('action-buttons');
        const buttonData = this.getButtonData(planetType);
        
        buttonsContainer.innerHTML = `
            <a href="${buttonData.visitUrl}" class="action-btn visit" target="_blank">
                ${buttonData.visitText}
            </a>
            <button class="action-btn socials" id="socials-btn">
                Socials
            </button>
        `;

        // Создаем popup для социальных сетей
        this.createSocialsPopup(planetType);
        
        // Обработчик для кнопки Socials
        document.getElementById('socials-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSocialsPopup();
        });
    }

    createSocialsPopup(planetType) {
        const socialsData = this.getSocialsData(planetType);
        const buttonsContainer = document.getElementById('action-buttons');
        
        // Удаляем старый popup если есть
        const oldPopup = buttonsContainer.querySelector('.socials-popup');
        if (oldPopup) oldPopup.remove();
        
        const popup = document.createElement('div');
        popup.className = 'socials-popup';
        popup.innerHTML = `
            <h4>Follow Us</h4>
            <div class="social-links">
                <a href="${socialsData.telegram}" class="social-link" target="_blank">
                    🤖 Telegram Bot Navigator
                </a>
                <a href="${socialsData.instagram}" class="social-link" target="_blank">
                    📱 Instagram ${socialsData.handle}
                </a>
            </div>
        `;
        
        buttonsContainer.appendChild(popup);
        this.socialsPopup = popup;
        
        // Закрытие popup при клике вне его
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.socials-popup') && !e.target.closest('#socials-btn')) {
                this.closeSocialsPopup();
            }
        });
    }

    toggleSocialsPopup() {
        if (this.socialsPopup) {
            this.socialsPopup.classList.toggle('active');
        }
    }

    closeSocialsPopup() {
        if (this.socialsPopup) {
            this.socialsPopup.classList.remove('active');
        }
    }

    closeOrbitView() {
        this.isActive = false;
        this.currentPlanet = null;
        
        const container = document.getElementById('orbit-container');
        container.classList.remove('active');
        
        // Показываем основной интерфейс
        document.querySelector('.space-container').style.opacity = '1';
        
        // Закрываем socials popup
        this.closeSocialsPopup();
    }

    getOrbitData(planetType) {
        const data = {
            dev: {
                orbit1: ['Custom Development', 'AI Integrations'],
                orbit2: ['Chat Bots', 'Web Development']
            },
            media: {
                orbit1: ['Fast & Reliable', 'Digital Focused'],
                orbit2: ['Multilingual', 'Expert Analysis']
            },
            learn: {
                orbit1: ['Video Courses', 'Expert Training'],
                orbit2: ['Certifications', 'Hands-on Projects']
            }
        };
        
        return data[planetType] || data.dev;
    }

    getButtonData(planetType) {
        const data = {
            dev: {
                visitText: 'Visit Studio',
                visitUrl: 'https://palmbit.dev'
            },
            media: {
                visitText: 'Visit Media',
                visitUrl: 'https://palmbit.media'
            },
            learn: {
                visitText: 'Coming Soon',
                visitUrl: '#'
            }
        };
        
        return data[planetType] || data.dev;
    }

    getSocialsData(planetType) {
        const data = {
            dev: {
                telegram: 'https://t.me/PalmBitBot',
                instagram: 'https://instagram.com/palmbit.dev',
                handle: '@palmbit.dev'
            },
            media: {
                telegram: 'https://t.me/PalmBitBot',
                instagram: 'https://instagram.com/palmbit.media',
                handle: '@palmbit.media'
            },
            learn: {
                telegram: 'https://t.me/PalmBitBot',
                instagram: 'https://instagram.com/palmbit.learn',
                handle: '@palmbit.learn'
            }
        };
        
        return data[planetType] || data.dev;
    }
}

// Инициализация орбитальной системы
let orbitSystem;

document.addEventListener('DOMContentLoaded', () => {
    orbitSystem = new OrbitSystem();
    // Делаем доступным глобально
    window.orbitSystem = orbitSystem;
});

// Экспорт для использования в других модулях
window.OrbitSystem = OrbitSystem;

