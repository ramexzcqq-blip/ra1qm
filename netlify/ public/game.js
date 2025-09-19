document.addEventListener('DOMContentLoaded', function() {
    const gameArea = document.getElementById('game-area');
    const scoreElement = document.getElementById('score');
    const timeElement = document.getElementById('time');
    const startButton = document.getElementById('start-game');
    const resetButton = document.getElementById('reset-game');
    
    let gameInterval;
    let spawnInterval;
    let score = 0;
    let timeLeft = 60;
    let gameActive = false;
    
    const resources = [
        { name: 'алмаз', color: '#58a6ff', points: 10, symbol: '💎' },
        { name: 'изумруд', color: '#3fb950', points: 5, symbol: '💚' },
        { name: 'рубин', color: '#f85149', points: 8, symbol: '❤️' },
        { name: 'аметист', color: '#a371f7', points: 3, symbol: '💜' }
    ];
    
    function startGame() {
        if (gameActive) return;
        
        gameActive = true;
        score = 0;
        timeLeft = 60;
        
        scoreElement.textContent = score;
        timeElement.textContent = timeLeft;
        
        gameArea.innerHTML = '';
        startButton.style.display = 'none';
        
        // Запуск таймера
        gameInterval = setInterval(() => {
            timeLeft--;
            timeElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
        
        // Создание ресурсов
        spawnInterval = setInterval(createResource, 800);
    }
    
    function createResource() {
        if (!gameActive) return;
        
        const resourceType = resources[Math.floor(Math.random() * resources.length)];
        const resource = document.createElement('div');
        resource.className = 'resource';
        resource.innerHTML = resourceType.symbol;
        resource.style.color = resourceType.color;
        resource.style.textShadow = `0 0 10px ${resourceType.color}, 0 0 20px ${resourceType.color}`;
        resource.style.fontSize = '30px';
        resource.style.display = 'flex';
        resource.style.alignItems = 'center';
        resource.style.justifyContent = 'center';
        
        const size = 60;
        resource.style.width = `${size}px`;
        resource.style.height = `${size}px`;
        
        const x = Math.random() * (gameArea.offsetWidth - size);
        const y = Math.random() * (gameArea.offsetHeight - size);
        
        resource.style.left = `${x}px`;
        resource.style.top = `${y}px`;
        
        resource.addEventListener('click', () => collectResource(resource, resourceType, x + size/2, y + size/2));
        
        gameArea.appendChild(resource);
        
        // Анимация появления
        resource.style.transform = 'scale(0)';
        resource.style.transition = 'transform 0.3s ease-out';
        setTimeout(() => {
            resource.style.transform = 'scale(1)';
        }, 10);
        
        // Удаление ресурса через 3 секунды
        setTimeout(() => {
            if (resource.parentNode) {
                resource.style.opacity = '0';
                resource.style.transition = 'opacity 0.5s';
                setTimeout(() => {
                    if (resource.parentNode) {
                        gameArea.removeChild(resource);
                    }
                }, 500);
            }
        }, 3000);
    }
    
    function collectResource(resource, resourceType, x, y) {
        if (!gameActive) return;
        
        resource.style.pointerEvents = 'none';
        resource.style.transform = 'scale(1.5)';
        resource.style.opacity = '0';
        resource.style.transition = 'all 0.3s ease-out';
        
        score += resourceType.points;
        scoreElement.textContent = score;
        
        // Создаем эффект опыта
        createExperienceEffect(x, y, resourceType.color);
        
        setTimeout(() => {
            if (resource.parentNode) {
                gameArea.removeChild(resource);
            }
        }, 300);
    }
    
    function createExperienceEffect(x, y, color) {
        const particlesCount = 5;
        
        for (let i = 0; i < particlesCount; i++) {
            const particle = document.createElement('div');
            particle.innerHTML = '✨';
            particle.style.position = 'absolute';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.color = color;
            particle.style.fontSize = '16px';
            particle.style.pointerEvents = 'none';
            particle.style.opacity = '1';
            particle.style.zIndex = '1000';
            particle.style.textShadow = `0 0 5px ${color}`;
            
            gameArea.appendChild(particle);
            
            // Анимация частицы
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            const duration = 800 + Math.random() * 400;
            
            particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance - 50}px) scale(0.5)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
            });
            
            // Удаление частицы после анимации
            setTimeout(() => {
                if (particle.parentNode) {
                    gameArea.removeChild(particle);
                }
            }, duration);
        }
    }
    
    function endGame() {
        gameActive = false;
        clearInterval(gameInterval);
        clearInterval(spawnInterval);
        
        const gameOver = document.createElement('div');
        gameOver.className = 'game-instructions';
        gameOver.innerHTML = `
            <h2>Игра окончена!</h2>
            <p>Ваш счёт: ${score}</p>
            <button class="action-btn" id="play-again">Играть снова</button>
        `;
        
        gameArea.innerHTML = '';
        gameArea.appendChild(gameOver);
        
        document.getElementById('play-again').addEventListener('click', startGame);
    }
    
    function resetGame() {
        if (gameActive) {
            clearInterval(gameInterval);
            clearInterval(spawnInterval);
            gameActive = false;
        }
        
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>Кликай на алмазы и изумруды, чтобы собирать их!</p>
                <button class="action-btn" id="start-game">Начать игру</button>
            </div>
        `;
        
        score = 0;
        timeLeft = 60;
        scoreElement.textContent = score;
        timeElement.textContent = timeLeft;
        
        document.getElementById('start-game').addEventListener('click', startGame);
    }
    
    // Инициализация игры
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
});
