document.addEventListener('DOMContentLoaded', function() {
    // Initialize Telegram Web App
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.BackButton.hide();
    
    // Audio State Management
    let currentAudio = null;
    let isAudioPlaying = false;
    let currentAudioButton = null;
    let currentPlayPauseBtn = null;
    let volumeLevel = 1.0;
    let isMuted = false;
    
    // App State
    const appState = {
        currentStage: 1,
        currentLesson: null,
        currentScreen: 'loading',
        lessonsData: {
            1: {
                title: "Старт и начало",
                lessons: [
                    { id: 1, type: 'audio', title: "Что такое блокчейн и криптовалюты", description: "База для старта в теме", content: "assets/audio/new/01-blockchain-crypto.mp3" },
                    { id: 2, type: 'audio', title: "Чем отличается Web2 и Web3", description: "Ключевые различия подходов", content: "assets/audio/new/02-web2-vs-web3.mp3" },
                    { id: 3, type: 'audio', title: "Чем отличается CEX биржа от DEX биржи", description: "Централизованные и децентрализованные биржи", content: "assets/audio/new/03-cex-vs-dex.mp3" },
                    { id: 4, type: 'audio', title: "Криптокошельки и их виды", description: "Типы кошельков и их назначение", content: "assets/audio/new/04-wallet-types.mp3" },
                    { id: 5, type: 'audio', title: "DeFi инструменты и DeFi стейкинг", description: "Обзор DeFi инструментов", content: "assets/audio/new/05-defi-tools-staking.mp3" },
                    { id: 6, type: 'audio', title: "Преимущества и отличия блокчейна TON от других", description: "Почему TON выделяется на рынке", content: "assets/audio/new/06-ton-advantages.mp3" }
                ]
            },
            2: {
                title: "Старт в DRAZZE",
                lessons: [
                    { id: 1, type: 'link', title: "Презентация DRAZZE", description: "Основной видео-ролик проекта", content: "https://disk.yandex.ru/i/E4Bu5PPDADjTvw", external: true },
                    { id: 2, type: 'link', title: "Старт в DRZ: TonKeeper и кошелек", description: "Установка TonKeeper и создание кошелька. Важно сохранить seed-фразу.", content: "https://disk.yandex.ru/i/bHa40fNu-o3f1g", external: true },
                    { id: 3, type: 'audio', title: "Как работает DeFi стейкинг в DRAZZE", description: "Подробная механика стейкинга", content: "assets/audio/new/07-how-defi-staking-works.mp3" },
                    { id: 4, type: 'audio', title: "KPI бонусы для лидеров", description: "Механика лидерских бонусов и заработка", content: "assets/audio/new/08-kpi-leader-bonuses.mp3" },
                    { id: 5, type: 'audio', title: "Разбор продуктов DRAZZE", description: "Что входит в продуктовую линейку", content: "assets/audio/new/09-drazze-products.mp3" },
                    { id: 6, type: 'audio', title: "Разбор биржи Ston.fi и токена", description: "Главные принципы торгов на DEX", content: "assets/audio/new/10-stonfi-token-review.mp3" }
                ]
            },
            3: {
                title: "Система работы",
                lessons: [
                    { id: 1, type: 'audio', title: "Обучение сетевому бизнесу / рекрутинг / база", description: "Тренинг Влада", content: "assets/audio/new/11-network-business-recruiting-base.mp3" },
                    { id: 2, type: 'audio', title: "Отказы в продажах", description: "Тренинг Влада по работе с отказами", content: "assets/audio/new/12-sales-objections.mp3" },
                    { id: 3, type: 'audio', title: "Система чатов в DRZ", description: "Как правильно и эффективно пользоваться чатами", content: "assets/audio/audio2/01-drazze-chats.mp3" },
                    { id: 4, type: 'audio', title: "Роль наставника в бизнесе", description: "Зачем нужен наставник и как с ним работать", content: "assets/audio/audio2/02-business-mentor.mp3" },
                    { id: 5, type: 'objections', title: "Блоки возражений", description: "Ответы в аудио на типовые возражения", objections: [
                        { id: 1, title: "«Нужно звать людей, у меня нет людей»", audio: "assets/audio/objections/01-need-people-no-people.mp3" },
                        { id: 2, title: "«Боюсь на большие суммы приглашать людей…»", audio: "assets/audio/objections/02-afraid-big-sums-responsibility.mp3" },
                        { id: 3, title: "«В моём окружении нет сетевиков, где искать людей»", audio: "assets/audio/objections/03-no-networkers-in-circle.mp3" },
                        { id: 4, title: "«Это слишком рискованно»", audio: "assets/audio/objections/04-too-risky.mp3" },
                        { id: 5, title: "«Я не знаю как приглашать, я боюсь приглашать»", audio: "assets/audio/objections/05-dont-know-how-to-invite.mp3" },
                        { id: 6, title: "«Не умею пользоваться криптой, карты заблокированы…»", audio: "assets/audio/objections/06-crypto-blocked-cards.mp3" },
                        { id: 7, title: "«Зарабатывает только верхушка»", audio: "assets/audio/objections/07-only-top-earns.mp3" },
                        { id: 8, title: "«Цена монеты может упасть»", audio: "assets/audio/objections/08-coin-price-may-drop.mp3" },
                        { id: 9, title: "«Какие гарантии, а если токен просядет»", audio: "assets/audio/objections/09-guarantees-token-drop.mp3" }
                    ] },
                    { id: 6, type: 'technical', title: "Технические вопросы", description: "Стейкинг, контракт, ликвидность и выплаты", objections: [
                        { id: 1, title: "Как технически работает стейкинг?", audio: "assets/audio/technical/01-how-staking-works.mp3" },
                        { id: 2, title: "Как работает механизм зачисления со стейкинга", audio: "assets/audio/technical/02-claim-crediting.mp3" },
                        { id: 3, title: "Куда отправляются монеты", audio: "assets/audio/technical/03-where-coins-sent.mp3" },
                        { id: 4, title: "Если Telegram не будет работать — как достать монеты со стейкинга", audio: "assets/audio/technical/04-telegram-down-withdraw.mp3" },
                        { id: 5, title: "Почему это не доверительное управление", audio: "assets/audio/technical/05-not-trust-management.mp3" },
                        { id: 6, title: "Есть ли у команды доступ к управлению средствами в контракте", audio: "assets/audio/technical/06-team-access-contract-funds.mp3" },
                        { id: 7, title: "Почему вы не отозвали права на смарт-контракт", audio: "assets/audio/technical/07-why-admin-not-renounced.mp3" },
                        { id: 8, title: "Как реализован механизм сжигания токенов", audio: "assets/audio/technical/08-token-burn-mechanism.mp3" },
                        { id: 9, title: "Есть ли у команды контроль над ликвидностью", audio: "assets/audio/technical/09-team-liquidity-control.mp3" },
                        { id: 10, title: "Почему диапазон цены сейчас такой", audio: "assets/audio/technical/10-why-price-range.mp3" },
                        { id: 11, title: "Может ли контракт остановить выплаты", audio: "assets/audio/technical/11-contract-stop-payouts.mp3" }
                    ] }
                ]
            },
            4: {
                title: "Статус и работа",
                lessons: [
                    { id: 1, type: 'link', title: "Закрытие статуса Агент", description: "Пошаговый разбор закрытия статуса", content: "https://disk.yandex.ru/i/z_wpYsiQ_sYvUQ", external: true },
                    { id: 2, type: 'audio', title: "Как продавать не впаривая", description: "Мягкий и эффективный подход к продажам", content: "assets/audio/stage3/3-how-to-invite.mp3" },
                    { id: 3, type: 'text', title: "Скрипты первых касаний и сообщений", description: "Скрипты первого сообщения и ведения диалога", content: `<h3>1️⃣ Как писать людям — скрипты первого сообщения</h3>
<p><strong>🔹 ВАЖНОЕ ПРАВИЛО:</strong><br>
Никогда не начинать с:<br>
«Привет, есть бизнес-предложение»<br>
«Хочешь заработать?»<br>
«Ищу партнёров»<br>
👉 Задача первого сообщения — начать диалог, а не продать.</p>

<h4>🟢 Скрипт №1: Тёплый контакт (знакомые, подписчики)</h4>
<p><strong>Вариант 1</strong><br>
Привет, Имя!<br>
Давно не общались, решил написать 🙂<br>
Как у тебя сейчас дела?</p>

<p><strong>Вариант 2</strong><br>
Привет, Имя!<br>
Вспомнил про тебя, увидел твой пост / сторис<br>
Как ты сейчас, чем занимаешься?</p>

<h4>🟢 Скрипт №2: Полутёплый контакт (знакомые знакомых)</h4>
<p>Привет, Имя!<br>
Мы с тобой не знакомы лично, но нас связал Имя.<br>
Решил написать и познакомиться 🙂</p>

<h4>🟢 Скрипт №3: Холодный контакт (соцсети)</h4>
<p>Привет!<br>
Случайно попал на твою страницу — откликнулось то, чем ты занимаешься<br>
Решил написать и познакомиться 🙂</p>

<p><strong>Или:</strong><br>
Привет 🙂<br>
Увидел твой профиль, очень откликнулся подход к жизни<br>
Люблю знакомиться с интересными людьми</p>

<h3>2️⃣ Как вести диалог — базовый скрипт общения</h3>
<p><strong>🔹 ЦЕЛЬ ДИАЛОГА</strong><br>
❌ не рассказать про компанию<br>
✅ понять человека и создать интерес</p>

<h4>🟢 ЭТАП 1: Разговор «про человека»</h4>
<p><strong>Примеры вопросов:</strong><br>
Чем сейчас занимаешься?<br>
Нравится то, чем ты занимаешься?<br>
Работаешь на себя или в найме?<br>
Что для тебя сейчас важно в жизни?<br>
👉 УЧИ: больше слушать, меньше говорить</p>

<h4>🟢 ЭТАП 2: Углубление (боли / желания)</h4>
<p>А что тебе больше всего нравится в твоей деятельности?<br>
А что, наоборот, хотелось бы изменить?<br>
Если бы была возможность улучшить доход / график, больше уделять время семье? Больше путешествовать? (многих цепляет, путешествовать практически все любят) больше уделять время хобби? — было бы актуально?</p>

<h4>🟢 ЭТАП 3: МЯГКИЙ ПЕРЕХОД К ТЕМЕ ДЕЯТЕЛЬНОСТИ</h4>
<p><strong>❌ НЕ ТАК:</strong><br>
У меня бизнес, хочешь?</p>

<p><strong>✅ ТАК:</strong><br>
Слушай, ты сейчас так интересно рассказываешь<br>
Можно задам личный вопрос?<br>
(ждём «да»)<br>
А ты вообще открыт(а) к новым возможностям, если будет что-то интересное и с обучением? И позволит тебе дополнительно зарабатывать? Можно говорить что, Заработать больше чем на основной работе (смотреть по ситуации, если у человека прям мотивация деньги)</p>` },
                    { id: 4, type: 'audio', title: "Важность закрытия статуса Commander", description: "Почему важно двигаться в следующий статус", content: "assets/audio/audio2/03-commander-status.mp3" },
                    { id: 5, type: 'audio', title: "Правильное отношение к бизнесу и мышление", description: "Мышление для долгосрочного результата", content: "assets/audio/audio2/04-business-mindset.mp3" },
                    { id: 6, type: 'audio', title: "Список + звонок + встреча", description: "Роль наставника на этом этапе", content: "assets/audio/audio2/05-list-call-meeting-networking.mp3" },
                    { id: 7, type: 'audio', title: "Где брать людей: качественный нетворкинг", description: "Источники трафика и знакомства", content: "assets/audio/audio2/06-quality-networking.mp3" },
                    { id: 8, type: 'audio', title: "Позиционирование в соцсетях", description: "Как упаковать профиль и вести соцсети", content: "assets/audio/audio2/07-social-positioning.mp3" }
                ]
            }
        }
    };
    
    // DOM Elements
    const loadingScreen = document.getElementById('loadingScreen');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const appContainer = document.getElementById('appContainer');
    const startBtn = document.getElementById('startBtn');
    const backBtn = document.getElementById('backBtn');
    const currentStageNum = document.getElementById('currentStageNum');
    const progressDots = document.querySelectorAll('.dot');
    
    // Initialize
    initApp();
    
    function initApp() {
        renderStageContent();

        // Start with loading
        simulateLoading();
        
        // Event Listeners
        startBtn.addEventListener('click', startOnboarding);
        backBtn.addEventListener('click', handleBack);
        
        // Progress dots
        progressDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const stage = parseInt(dot.dataset.stage);
                if (stage !== appState.currentStage) {
                    goToStage(stage);
                }
            });
        });
        
        // Next stage buttons
        document.getElementById('nextStage1').addEventListener('click', () => goToStage(2));
        document.getElementById('nextStage2').addEventListener('click', () => goToStage(3));
        document.getElementById('nextStage3').addEventListener('click', () => goToStage(4));
        document.getElementById('nextStage4').addEventListener('click', showCompletion);
        const nextStage5Btn = document.getElementById('nextStage5');
        if (nextStage5Btn) {
            nextStage5Btn.addEventListener('click', showCompletion);
        }
        
        // Lesson cards
        setupLessonCards();
        
        // Objections expandable
        setupObjections();
        
        // Setup audio buttons for objections in the stage screen
        setupAudioButtons();
        
        function setupAudioButtons() {
            // Обработчик для кнопок воспроизведения аудио в под-уроках
            document.addEventListener('click', function(e) {
                if (e.target.closest('.btn-play-audio')) {
                    const button = e.target.closest('.btn-play-audio');
                    const audioSrc = button.dataset.audio;
                    
                    if (!audioSrc) return;
                    
                    // Получаем заголовок из ближайшей карточки
                    const card = button.closest('.sub-lesson-card');
                    let title = "Возражение";
                    if (card) {
                        const titleElement = card.querySelector('h4');
                        if (titleElement) {
                            title = titleElement.textContent;
                        }
                    }
                    
                    e.stopPropagation();
                    
                    // Если это та же кнопка и аудио играет, остановить
                    if (currentAudioButton === button && isAudioPlaying) {
                        stopAllAudio();
                        return;
                    }
                    
                    // Остановить предыдущее аудио
                    stopAllAudio();
                    
                    // Изменить иконку кнопки
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-pause';
                    }
                    
                    // Запустить новое аудио
                    playAudio(audioSrc, button, null, title);
                }
            });
        }
        // Lesson navigation
        setupLessonNavigation();
        
        // Completion buttons
        document.getElementById('startEarningBtn').addEventListener('click', startEarning);
        document.getElementById('reviewBtn').addEventListener('click', restartOnboarding);
        
        // Handle Telegram back button
        tg.onEvent('backButtonClicked', handleBack);
        
        // Initialize particles
        createParticles();
    }

    function renderStageContent() {
        const iconMap = {
            audio: 'fas fa-headphones',
            link: 'fas fa-external-link-alt',
            text: 'fas fa-file-alt',
            objections: 'fas fa-shield-alt',
            technical: 'fas fa-server'
        };

        const classMap = {
            audio: 'audio',
            link: 'link',
            text: 'text',
            objections: 'audio',
            technical: 'audio'
        };

        for (let stage = 1; stage <= 4; stage++) {
            const screen = document.getElementById(`stage${stage}-main`);
            const stageData = appState.lessonsData[stage];
            if (!screen || !stageData) continue;

            const grid = screen.querySelector('.content-grid');
            if (!grid) continue;

            grid.innerHTML = '';

            stageData.lessons.forEach((lesson, idx) => {
                const lessonCard = document.createElement('div');
                lessonCard.className = `lesson-card${(lesson.type === 'objections' || lesson.type === 'technical') ? ' expandable' : ''}`;
                lessonCard.dataset.lesson = String(lesson.id);
                lessonCard.innerHTML = `
                    <div class="lesson-icon ${classMap[lesson.type] || 'audio'}">
                        <i class="${iconMap[lesson.type] || 'fas fa-headphones'}"></i>
                    </div>
                    <div class="lesson-content">
                        <div class="lesson-number">${String(idx + 1).padStart(2, '0')}</div>
                        <h3>${lesson.title}</h3>
                        <p class="lesson-subtitle">${lesson.description}</p>
                    </div>
                    <div class="lesson-action">
                        <i class="fas ${(lesson.type === 'objections' || lesson.type === 'technical') ? 'fa-chevron-down' : 'fa-chevron-right'}"></i>
                    </div>
                `;
                grid.appendChild(lessonCard);

                if ((lesson.type === 'objections' || lesson.type === 'technical') && Array.isArray(lesson.objections)) {
                    const subLessons = document.createElement('div');
                    subLessons.className = 'sub-lessons';
                    subLessons.id = `subLessons-${stage}-${lesson.id}`;
                    subLessons.innerHTML = lesson.objections.map((obj) => `
                        <div class="sub-lesson-card" data-objection="${obj.id}">
                            <div class="sub-lesson-number">${lesson.id}.${obj.id}</div>
                            <div class="sub-lesson-content">
                                <h4>${obj.title}</h4>
                                <p>Ответ на возражение</p>
                            </div>
                            <button class="btn-play-audio" data-audio="${obj.audio}">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    `).join('');
                    grid.appendChild(subLessons);
                }
            });
        }
    }
    
    function simulateLoading() {
        let progress = 0;
        const progressFill = document.getElementById('progressFill');
        const progressPercent = document.getElementById('progressPercent');
        
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = `${progress}%`;
            progressPercent.textContent = Math.floor(progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    setTimeout(() => {
                        welcomeScreen.classList.add('active');
                        appState.currentScreen = 'welcome';
                    }, 300);
                }, 500);
            }
        }, 100);
    }
    
    function startOnboarding() {
        welcomeScreen.classList.remove('active');
        setTimeout(() => {
            appContainer.classList.add('active');
            goToStage(1);
            appState.currentScreen = 'stage1-main';
        }, 500);
    }
    
    function goToStage(stage) {
        // Остановить аудио при переходе на новый этап
        stopAllAudio();
        
        appState.currentStage = stage;
        appState.currentLesson = null;
        
        // Update stage number
        currentStageNum.textContent = stage;
        
        // Update progress dots
        progressDots.forEach(dot => {
            const dotStage = parseInt(dot.dataset.stage);
            dot.classList.toggle('active', dotStage === stage);
        });
        
        // Update back button
        updateBackButton();
        
        // Hide all screens
        hideAllScreens();
        
        // Show stage screen
        const stageScreen = document.getElementById(`stage${stage}-main`);
        if (stageScreen) {
            stageScreen.classList.add('active');
            appState.currentScreen = `stage${stage}-main`;
        }
        
        document.querySelectorAll('.sub-lessons').forEach((sub) => sub.classList.remove('active'));
        document.querySelectorAll('.lesson-card.expandable').forEach((card) => {
            card.classList.remove('expanded');
            const chevron = card.querySelector('.lesson-action i');
            if (chevron) chevron.className = 'fas fa-chevron-down';
        });
    }
    
    function updateBackButton() {
        if (appState.currentScreen.includes('stage') && 
            appState.currentScreen.includes('-main') && 
            appState.currentStage === 1) {
            backBtn.style.visibility = 'hidden';
            tg.BackButton.hide();
        } else {
            backBtn.style.visibility = 'visible';
            tg.BackButton.show();
        }
    }
    
    function hideAllScreens() {
        document.querySelectorAll('.stage-screen, .lesson-detail-screen, .completion-screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }
    
    function setupLessonCards() {
        // Находим все карточки уроков на всех этапах
        document.querySelectorAll('.lesson-card:not(.expandable)').forEach(card => {
            card.addEventListener('click', function(e) {
                if (this.classList.contains('expandable')) {
                    // Если карточка раскрываемая, не открываем урок
                    return;
                }
                const stage = appState.currentStage;
                const lessonId = parseInt(this.dataset.lesson);
                openLesson(stage, lessonId);
            });
            
            // Добавляем обработчик для touch устройств
            card.addEventListener('touchstart', function() {
                this.classList.add('touching');
            }, { passive: true });
            
            card.addEventListener('touchend', function() {
                this.classList.remove('touching');
            }, { passive: true });
        });
    }
    
    function openLesson(stage, lessonId) {
        const lesson = appState.lessonsData[stage].lessons.find(l => l.id === lessonId);
        if (!lesson) return;
        
        // Остановить аудио при открытии нового урока
        stopAllAudio();
        
        appState.currentLesson = lesson;
        
        // Update lesson detail screen
        updateLessonDetail(lesson);
        
        // Hide current screen
        hideAllScreens();
        
        // Show lesson detail
        const lessonDetail = document.getElementById('lessonDetail');
        lessonDetail.classList.add('active');
        appState.currentScreen = 'lessonDetail';
        
        // Update back button
        backBtn.style.visibility = 'visible';
        tg.BackButton.show();
    }
    
    function updateLessonDetail(lesson) {
        // Update lesson info
        document.getElementById('lessonTitle').textContent = lesson.title;
        document.getElementById('lessonDescription').textContent = lesson.description;
        
        // Update lesson type badge
        const badge = document.getElementById('lessonTypeBadge');
        badge.innerHTML = '';
        
        let icon, text, color;
        switch(lesson.type) {
            case 'audio':
                icon = 'fas fa-headphones';
                text = 'АУДИО';
                color = '#10b981';
                break;
            case 'video':
                icon = 'fas fa-play-circle';
                text = 'ВИДЕО';
                color = '#3b82f6';
                break;
            case 'text':
                icon = 'fas fa-file-alt';
                text = 'ТЕКСТ';
                color = '#f59e0b';
                break;
            case 'link':
                icon = 'fas fa-external-link-alt';
                text = 'ССЫЛКА';
                color = '#ef4444';
                break;
            case 'objections':
                icon = 'fas fa-shield-alt';
                text = 'ВОЗРАЖЕНИЯ';
                color = '#f59e0b';
                break;
            case 'technical':
                icon = 'fas fa-server';
                text = 'ТЕХНИЧЕСКОЕ';
                color = '#38bdf8';
                break;
        }
        
        badge.innerHTML = `<i class="${icon}"></i><span>${text}</span>`;
        badge.style.background = `rgba(${hexToRgb(color)}, 0.2)`;
        badge.style.color = color;
        
        // Show/hide content areas
        document.getElementById('audioPlayerContainer').style.display = lesson.type === 'audio' ? 'block' : 'none';
        document.getElementById('videoPlayerContainer').style.display = lesson.type === 'video' ? 'block' : 'none';
        document.getElementById('textContentContainer').style.display = lesson.type === 'text' ? 'block' : 'none';
        
        // Load content
        if (lesson.type === 'audio') {
            setupAudioPlayer(lesson);
        } else if (lesson.type === 'video') {
            setupVideoPlayer(lesson);
        } else if (lesson.type === 'text') {
            document.querySelector('.text-scroll').innerHTML = lesson.content;
        } else if (lesson.type === 'objections' || lesson.type === 'technical') {
            setupObjectionsContent(lesson);
        } else if (lesson.type === 'link') {
            setupLinkContent(lesson);
        }
        
        // Update navigation info
        const stage = appState.currentStage;
        const totalLessons = appState.lessonsData[stage].lessons.length;
        const currentIndex = appState.lessonsData[stage].lessons.findIndex(l => l.id === lesson.id);
        document.getElementById('navInfo').textContent = `${currentIndex + 1}/${totalLessons}`;
    }
    
    function setupAudioPlayer(lesson) {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const volumeBtn = document.getElementById('volumeBtn');
        const waveBars = document.querySelectorAll('.wave-bar');
        const currentTimeEl = document.querySelector('.current-time');
        const durationEl = document.querySelector('.duration');
        const progressFill = document.querySelector('.audio-progress .progress-fill');
        const audioElement = document.getElementById('audioElement');
        
        // Reset button state
        playPauseBtn.classList.remove('playing');
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        // Reset wave animation
        waveBars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
            bar.style.height = '20px';
        });
        
        // Load audio file
        audioElement.src = lesson.content;
        audioElement.load();
        
        // Wait for metadata to load
        audioElement.addEventListener('loadedmetadata', function() {
            const duration = audioElement.duration;
            durationEl.textContent = formatTime(duration);
            currentTimeEl.textContent = '0:00';
        });
        
        // Update progress while playing
        audioElement.addEventListener('timeupdate', function() {
            if (audioElement.duration) {
                const progress = (audioElement.currentTime / audioElement.duration) * 100;
                progressFill.style.width = `${progress}%`;
                currentTimeEl.textContent = formatTime(audioElement.currentTime);
            }
        });
        
        // Handle audio end
        audioElement.addEventListener('ended', function() {
            stopAllAudio();
        });
        
        // Setup play/pause functionality
        playPauseBtn.onclick = function() {
            if (this.classList.contains('playing')) {
                // Pause audio
                pauseCurrentAudio();
            } else {
                // Play audio
                playAudio(lesson.content, null, this, lesson.title);
            }
        };
        
        // Setup volume button
        if (volumeBtn) {
            volumeBtn.onclick = function(e) {
                e.stopPropagation();
                toggleMute();
            };
            updateVolumeButton();
        }
        
        // Reset progress
        if (progressFill) {
            progressFill.style.width = '0%';
        }
        
        currentPlayPauseBtn = playPauseBtn;
    }
    
    function setupVideoPlayer(lesson) {
        const videoPlayer = document.getElementById('videoPlayerContainer');
        
        // Очищаем предыдущий контент
        videoPlayer.innerHTML = '';
        
        if (lesson.isDoubleVideo && lesson.content2) {
            // Создаем контейнер для двух видео
            videoPlayer.innerHTML = `
                <div class="double-video-container">
                    <div class="video-item">
                        <h4 style="color: var(--gray-light); margin-bottom: 10px;">Видео 1</h4>
                        <video class="lesson-video" controls preload="metadata">
                            <source src="${lesson.content}" type="video/mp4">
                            Ваш браузер не поддерживает воспроизведение видео.
                        </video>
                    </div>
                    <div class="video-item">
                        <h4 style="color: var(--gray-light); margin-bottom: 10px;">Видео 2</h4>
                        <video class="lesson-video" controls preload="metadata">
                            <source src="${lesson.content2}" type="video/mp4">
                            Ваш браузер не поддерживает воспроизведение видео.
                        </video>
                    </div>
                </div>
            `;
        } else {
            // Обычное одно видео
            videoPlayer.innerHTML = `
                <video id="lessonVideo" controls preload="metadata" style="width: 100%; height: auto; border-radius: 16px; background: #000;">
                    <source src="${lesson.content}" type="video/mp4">
                    Ваш браузер не поддерживает воспроизведение видео.
                </video>
            `;
        }
        
        // Добавляем обработчики для всех видео
        videoPlayer.querySelectorAll('video').forEach(videoElement => {
            // Ждем загрузки метаданных
            videoElement.addEventListener('loadedmetadata', function() {
                const duration = videoElement.duration;
                if (duration && isFinite(duration)) {
                    console.log(`Длительность видео: ${formatTime(duration)}`);
                }
            });
            
            // Обработка ошибок
            videoElement.addEventListener('error', function(e) {
                console.error('Ошибка загрузки видео:', e);
                const parent = videoElement.parentElement;
                if (parent && parent.classList.contains('video-item')) {
                    parent.innerHTML = `
                        <div class="video-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Ошибка загрузки видео</p>
                        </div>
                    `;
                } else {
                    // Для обычного видео без контейнера video-item
                    videoPlayer.innerHTML = `
                        <div class="video-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Ошибка загрузки видео</p>
                        </div>
                    `;
                }
            });
            
            // Обработка начала загрузки
            videoElement.addEventListener('loadstart', function() {
                console.log('Начало загрузки видео:', lesson.title);
            });
            
            // Обработка возможности воспроизведения
            videoElement.addEventListener('canplay', function() {
                console.log('Видео готово к воспроизведению:', lesson.title);
            });
            
            // Загружаем видео
            videoElement.load();
        });
    }
    
    function setupLinkContent(lesson) {
        const textContentContainer = document.getElementById('textContentContainer');
        textContentContainer.innerHTML = `
            <div class="text-scroll">
                <div class="link-content">
                    <h3>${lesson.title}</h3>
                    <p>${lesson.description}</p>
                    <p style="color: var(--gray); margin: 1rem 0; font-size: 0.9rem;">
                        <i class="fas fa-external-link-alt"></i> Внешняя ссылка на YouTube
                    </p>
                    <p style="color: var(--gray-light); margin-bottom: 1.5rem;">
                        Для просмотра этого контента вам нужно перейти по внешней ссылке
                    </p>
                    <button class="btn-external-link" id="externalLinkBtn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>Открыть ссылку</span>
                    </button>
                    <p style="color: var(--gray); margin-top: 1rem; font-size: 0.8rem;">
                        <i class="fas fa-info-circle"></i> Ссылка откроется в новой вкладке
                    </p>
                </div>
            </div>
        `;
        textContentContainer.style.display = 'block';
        
        // Add event listener for external link button
        const externalLinkBtn = document.getElementById('externalLinkBtn');
        if (externalLinkBtn) {
            externalLinkBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (lesson.external) {
                    window.open(lesson.content, '_blank');
                    if (tg && tg.showAlert) {
                        tg.showAlert('Ссылка открывается в новой вкладке');
                    }
                }
            });
        }
    }
    
    function setupObjectionsContent(lesson) {
        const objectionsContainer = document.getElementById('textContentContainer');
        let contentHTML = `
            <div class="text-scroll">
                <h3>${lesson.title}</h3>
                <p>${lesson.description}</p>
                <div class="objections-list" style="margin-top: 20px;">
        `;
        
        if (lesson.objections && lesson.objections.length > 0) {
            lesson.objections.forEach(obj => {
                contentHTML += `
                    <div class="objection-item" style="margin-bottom: 15px; padding: 15px; background: rgba(30, 41, 59, 0.3); border-radius: 10px;">
                        <h4 style="margin-bottom: 10px; color: var(--light);">${obj.id}. ${obj.title}</h4>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span class="objection-duration" style="color: var(--gray); font-size: 0.9em;">--:--</span>
                            <button class="objection-play-btn" 
                                    style="background: rgba(124, 58, 237, 0.2); border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); cursor: pointer;"
                                    data-audio="${obj.audio}"
                                    data-title="${obj.title}">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        
        contentHTML += `
                </div>
            </div>
        `;
        
        objectionsContainer.innerHTML = contentHTML;
        objectionsContainer.style.display = 'block';
        
        // Setup audio buttons for objections
        document.querySelectorAll('.objection-play-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const audioSrc = this.dataset.audio;
                const title = this.dataset.title;
                const icon = this.querySelector('i');
                
                // Если это та же кнопка и аудио играет, остановить
                if (currentAudioButton === this && isAudioPlaying) {
                    stopAllAudio();
                    return;
                }
                
                // Остановить предыдущее аудио
                stopAllAudio();
                
                // Загрузить метаданные для определения длительности
                const tempAudio = new Audio(audioSrc);
                tempAudio.addEventListener('loadedmetadata', function() {
                    const duration = tempAudio.duration;
                    const durationSpan = btn.closest('.objection-item').querySelector('.objection-duration');
                    if (durationSpan) {
                        durationSpan.textContent = formatTime(duration);
                    }
                });
                tempAudio.load();
                
                // Изменить иконку кнопки
                icon.className = 'fas fa-pause';
                this.style.background = 'rgba(255, 0, 110, 0.2)';
                this.style.color = 'var(--secondary-light)';
                
                // Запустить новое аудио
                playAudio(audioSrc, this, null, title);
            });
        });
    }
    
    function playAudio(audioSrc, button, playPauseBtn, title) {
        // Остановить текущее аудио
        stopAllAudio();
        
        const audioElement = document.getElementById('audioElement');
        
        // Если это другой файл, загрузить его
        if (audioElement.src !== audioSrc && !audioElement.src.endsWith(audioSrc)) {
            audioElement.src = audioSrc;
            audioElement.load();
        }
        
        // Обновить состояние кнопки
        if (button) {
            if (button.classList.contains('objection-play-btn') || button.classList.contains('btn-play-audio')) {
                const icon = button.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-pause';
                }
                button.style.background = 'rgba(255, 0, 110, 0.2)';
                button.style.color = 'var(--secondary-light)';
            } else {
                button.classList.add('playing');
                button.innerHTML = '<i class="fas fa-pause"></i>';
            }
            currentAudioButton = button;
        }
        
        // Обновить состояние основной кнопки play/pause
        if (playPauseBtn) {
            playPauseBtn.classList.add('playing');
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            currentPlayPauseBtn = playPauseBtn;
        }
        
        // Воспроизвести аудио
        audioElement.play().then(() => {
            isAudioPlaying = true;
            currentAudio = audioElement;
            
            // Анимация волн
            const waveBars = document.querySelectorAll('.wave-bar');
            waveBars.forEach(bar => {
                bar.style.animationPlayState = 'running';
            });
        }).catch(error => {
            console.error('Error playing audio:', error);
            // Сбросить кнопки при ошибке
            stopAllAudio();
        });
    }    
    
    function pauseCurrentAudio() {
        if (currentAudio) {
            currentAudio.pause();
            isAudioPlaying = false;
            
            if (currentPlayPauseBtn) {
                currentPlayPauseBtn.classList.remove('playing');
                currentPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
            
            if (currentAudioButton) {
                currentAudioButton.classList.remove('playing');
                currentAudioButton.innerHTML = '<i class="fas fa-play"></i>';
            }
            
            // Остановить анимацию волн
            const waveBars = document.querySelectorAll('.wave-bar');
            waveBars.forEach(bar => {
                bar.style.animationPlayState = 'paused';
            });
        }
    }
    
    function stopAllAudio() {
        const audioElement = document.getElementById('audioElement');
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
        
        if (currentAudio) {
            isAudioPlaying = false;
            currentAudio = null;
        }
        
        // Сбросить все кнопки воспроизведения
        if (currentPlayPauseBtn) {
            currentPlayPauseBtn.classList.remove('playing');
            currentPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        
        if (currentAudioButton) {
            // Проверить, является ли это кнопкой objection
            if (currentAudioButton.classList.contains('objection-play-btn')) {
                const icon = currentAudioButton.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-play';
                }
                currentAudioButton.style.background = 'rgba(124, 58, 237, 0.2)';
                currentAudioButton.style.color = 'var(--primary)';
            } else {
                currentAudioButton.classList.remove('playing');
                currentAudioButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
        
        // Сбросить все кнопки воспроизведения в интерфейсе objections
        document.querySelectorAll('.objection-play-btn').forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-play';
            }
            btn.style.background = 'rgba(124, 58, 237, 0.2)';
            btn.style.color = 'var(--primary)';
        });
        
        // Остановить анимацию волн
        const waveBars = document.querySelectorAll('.wave-bar');
        waveBars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
            bar.style.height = '20px';
        });
        
        currentAudioButton = null;
        currentPlayPauseBtn = null;
    }
    
    function toggleMute() {
        isMuted = !isMuted;
        
        const audioElement = document.getElementById('audioElement');
        if (audioElement) {
            audioElement.volume = isMuted ? 0 : volumeLevel;
        }
        
        if (currentAudio) {
            currentAudio.volume = isMuted ? 0 : volumeLevel;
        }
        
        updateVolumeButton();
    }
    
    function updateVolumeButton() {
        const volumeBtn = document.getElementById('volumeBtn');
        if (!volumeBtn) return;
        
        const icon = volumeBtn.querySelector('i');
        if (!icon) return;
        
        if (isMuted) {
            icon.className = 'fas fa-volume-mute';
            volumeBtn.style.color = '#ef4444';
        } else if (volumeLevel < 0.5) {
            icon.className = 'fas fa-volume-down';
            volumeBtn.style.color = '#f59e0b';
        } else {
            icon.className = 'fas fa-volume-up';
            volumeBtn.style.color = '#10b981';
        }
    }
    
    function setupObjections() {
        document.querySelectorAll('.stage-screen').forEach((stageScreen) => {
            stageScreen.querySelectorAll('.lesson-card.expandable').forEach((card) => {
                const subList = card.nextElementSibling;
                if (!subList || !subList.classList.contains('sub-lessons')) return;
                card.addEventListener('click', function (e) {
                    e.stopPropagation();
                    this.classList.toggle('expanded');
                    subList.classList.toggle('active');
                    const icon = this.querySelector('.lesson-action i');
                    if (icon) {
                        icon.className = this.classList.contains('expanded') ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
                    }
                });
            });
        });
    }
    
    function setupLessonNavigation() {
        const backLessonBtn = document.querySelector('.btn-back-lesson');
        const prevLessonBtn = document.querySelector('.prev-lesson');
        const nextLessonBtn = document.querySelector('.next-lesson');
        
        if (backLessonBtn) {
            backLessonBtn.addEventListener('click', () => {
                // Остановить аудио при возврате к списку уроков
                stopAllAudio();
                goToStage(appState.currentStage);
            });
        }
        
        if (prevLessonBtn) {
            prevLessonBtn.addEventListener('click', () => {
                // Остановить аудио при переходе к предыдущему уроку
                stopAllAudio();
                goToPrevLesson();
            });
        }
        
        if (nextLessonBtn) {
            nextLessonBtn.addEventListener('click', () => {
                // Остановить аудио при переходе к следующему уроку
                stopAllAudio();
                goToNextLesson();
            });
        }
    }
    
    function goToPrevLesson() {
        if (!appState.currentLesson) return;
        
        const stage = appState.currentStage;
        const lessons = appState.lessonsData[stage].lessons;
        const currentIndex = lessons.findIndex(l => l.id === appState.currentLesson.id);
        
        if (currentIndex > 0) {
            openLesson(stage, lessons[currentIndex - 1].id);
        }
    }
    
    function goToNextLesson() {
        if (!appState.currentLesson) return;
        
        const stage = appState.currentStage;
        const lessons = appState.lessonsData[stage].lessons;
        const currentIndex = lessons.findIndex(l => l.id === appState.currentLesson.id);
        
        if (currentIndex < lessons.length - 1) {
            openLesson(stage, lessons[currentIndex + 1].id);
        }
    }
    
    function showCompletion() {
        // Остановить аудио при завершении обучения
        stopAllAudio();
        
        hideAllScreens();
        document.getElementById('completionScreen').classList.add('active');
        appState.currentScreen = 'completion';
        backBtn.style.visibility = 'hidden';
        tg.BackButton.hide();
    }
    
    function startEarning() {
        // Открыть официальный канал DRAZZE
        const channelUrl = 'https://t.me/drazze_crypto_bot';
        window.open(channelUrl, '_blank');
        
        tg.sendData(JSON.stringify({
            action: 'start_earning',
            stage: 'completed',
            timestamp: new Date().toISOString()
        }));
    }
    
    function restartOnboarding() {
        // Остановить аудио при перезапуске обучения
        stopAllAudio();
        goToStage(1);
        tg.showAlert('Обучение начато заново! Удачи!');
    }
    function stopAllAudio() {
        const audioElement = document.getElementById('audioElement');
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
        
        if (currentAudio) {
            isAudioPlaying = false;
            currentAudio = null;
        }
        
        // Сбросить все кнопки воспроизведения
        if (currentPlayPauseBtn) {
            currentPlayPauseBtn.classList.remove('playing');
            currentPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        
        // Сбросить все кнопки .btn-play-audio и .objection-play-btn
        document.querySelectorAll('.btn-play-audio, .objection-play-btn').forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-play';
            }
            btn.style.background = 'rgba(124, 58, 237, 0.2)';
            btn.style.color = 'var(--primary)';
            
            // Убрать класс playing если есть
            btn.classList.remove('playing');
        });
        
        if (currentAudioButton) {
            // Проверить, является ли это кнопкой objection
            if (currentAudioButton.classList.contains('objection-play-btn') || currentAudioButton.classList.contains('btn-play-audio')) {
                const icon = currentAudioButton.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-play';
                }
                currentAudioButton.style.background = 'rgba(124, 58, 237, 0.2)';
                currentAudioButton.style.color = 'var(--primary)';
            } else {
                currentAudioButton.classList.remove('playing');
                currentAudioButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
        
        // Остановить анимацию волн
        const waveBars = document.querySelectorAll('.wave-bar');
        waveBars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
            bar.style.height = '20px';
        });
        
        currentAudioButton = null;
        currentPlayPauseBtn = null;
    }
    
    function handleBack() {
        // Остановить аудио при нажатии кнопки "Назад"
        stopAllAudio();
        
        if (appState.currentScreen === 'lessonDetail') {
            goToStage(appState.currentStage);
        } else if (appState.currentScreen.includes('stage') && appState.currentStage > 1) {
            goToStage(appState.currentStage - 1);
        } else if (appState.currentScreen === 'completion') {
            goToStage(4);
        }
    }
    
    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '124, 58, 237';
    }
    
    function createParticles() {
        const container = document.querySelector('.particles-container');
        if (!container) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(124, 58, 237, ${Math.random() * 0.5 + 0.1});
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float ${Math.random() * 20 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(particle);
        }
        
        // Add CSS for animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translateY(100vh) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    function showCompletionScreen() {
        // Скрыть все остальные экраны
        document.querySelectorAll('.stage-screen, .lesson-detail-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показать окно завершения
        const completionScreen = document.getElementById('completionScreen');
        completionScreen.classList.add('active');
        
        // Прокрутить вверх окно завершения
        completionScreen.scrollTop = 0;
        
        // Обновить заголовок Telegram Web App
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.setHeaderColor('#0a0a1a');
            window.Telegram.WebApp.MainButton.hide();
        }
    }
    // Initialize Telegram
    tg.ready();
});


