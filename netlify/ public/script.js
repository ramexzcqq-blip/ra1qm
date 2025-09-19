document.addEventListener('DOMContentLoaded', function() {
    const logoBtn = document.getElementById('logo-btn');
    const modal = document.getElementById('modal');
    const closeButton = document.getElementById('close-modal');
    const serverInfo = document.getElementById('server-info');
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = statusIndicator.querySelector('.status-text');
    const statusPulse = statusIndicator.querySelector('.status-pulse');
    const playersOnline = document.getElementById('players-online');
    const refreshButton = document.getElementById('refresh-status');
    const serverVersion = document.getElementById('server-version');
    const copyIpButton = document.getElementById('copy-ip');
    const modsButton = document.getElementById('mods-btn');
    const tabButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Инициализация вкладок
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок и контента
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс к текущей кнопке и контенту
            button.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Обработчик клика по логотипу
    logoBtn.addEventListener('click', function() {
        modal.classList.add('active');
        fetchServerInfo();
    });
    
    // Закрытие модального окна
    closeButton.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    // Закрытие при клике вне области контента
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Копирование IP адреса
    copyIpButton.addEventListener('click', function() {
        navigator.clipboard.writeText('tcp.cloudpub.ru:27271')
            .then(() => {
                const originalHtml = copyIpButton.innerHTML;
                copyIpButton.innerHTML = '<i class="fas fa-check"></i>';
                
                setTimeout(() => {
                    copyIpButton.innerHTML = originalHtml;
                }, 2000);
            })
            .catch(err => {
                console.error('Ошибка при копировании:', err);
            });
    });
    
    // Ссылка на моды и ресурспаки
    modsButton.addEventListener('click', function() {
        window.open('https://drive.google.com/drive/folders/1BvSirvr12NUAvp7X2uIQ7J6LNANdZBON?usp=sharing', '_blank');
    });
    
    // Проверка статуса сервера
    async function checkServerStatus() {
        try {
            statusText.textContent = 'Проверка...';
            statusPulse.style.backgroundColor = '#58a6ff';
            
            // Для Netlify используем путь к функции
            const response = await fetch('/.netlify/functions/server-status');
            const data = await response.json();
            
            if (data.online) {
                statusText.textContent = 'Онлайн';
                statusPulse.style.backgroundColor = '#3fb950';
                playersOnline.textContent = `${data.players}/${data.maxPlayers}`;
                serverVersion.textContent = data.version;
            } else {
                statusText.textContent = 'Оффлайн';
                statusPulse.style.backgroundColor = '#f85149';
                playersOnline.textContent = '0/20';
            }
        } catch (error) {
            statusText.textContent = 'Ошибка';
            statusPulse.style.backgroundColor = '#ff9c1a';
            console.error('Ошибка при проверке статуса:', error);
        }
    }
    
    // Обновление статуса по кнопке
    refreshButton.addEventListener('click', checkServerStatus);
    
    // Функция для получения информации о сервере
    async function fetchServerInfo() {
        serverInfo.innerHTML = '<div class="loading">Загрузка информации о сервере...</div>';
        
        try {
            // Для Netlify используем путь к функции
            const response = await fetch('/.netlify/functions/server-status');
            const data = await response.json();
            
            const serverData = [
                { title: "Статус сервера", value: data.online ? "Онлайн" : "Оффлайн" },
                { title: "IP адрес", value: `${data.host}:${data.port}` },
                { title: "Игроков онлайн", value: `${data.players}/${data.maxPlayers}` },
                { title: "Версия", value: data.version },
                { title: "Сообщение", value: data.message },
                { title: "Описание", value: "Добро пожаловать на наш сервер! Здесь вы найдёте интересный геймплей и дружное сообщество." }
            ];
            
            displayServerInfo(serverData);
        } catch (error) {
            serverInfo.innerHTML = '<div class="error">Ошибка при загрузке информации о сервере</div>';
            console.error('Error:', error);
        }
    }
    
    // Функция для отображения информации о сервере
    function displayServerInfo(data) {
        if (!data || data.length === 0) {
            serverInfo.innerHTML = '<div class="error">Не удалось загрузить информацию о сервере</div>';
            return;
        }
        
        let html = '';
        data.forEach((item, index) => {
            html += `
                <div class="info-item">
                    <h3>${item.title}</h3>
                    <p>${item.value}</p>
                </div>
            `;
        });
        
        serverInfo.innerHTML = html;
    }
    
    // Инициализация проверки статуса при загрузке
    checkServerStatus();
    
    // Автоматическое обновление статуса каждые 30 секунд
    setInterval(checkServerStatus, 30000);
});
