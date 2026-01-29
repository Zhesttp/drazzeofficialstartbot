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
                title: "Начало (первые базовые моменты)",
                lessons: [
                    // Пункт 1: Старт в TON экосистеме
                    {
                        id: 1,
                        type: 'link',
                        title: "Старт в TON экосистеме",
                        description: "Установка TonKeeper, создание кошелька и начало работы с DRAZZE",
                        content: "https://disk.yandex.ru/i/bHa40fNu-o3f1g",
                        external: true
                    },
                    // Пункт 2: Механика заработка
                    {
                        id: 2,
                        type: 'link',
                        title: "Механика заработка",
                        description: "Как можно зарабатывать в DRAZZE - полный обзор",
                        content: "https://disk.yandex.ru/i/BxcAfBRqf-tKYQ",
                        external: true
                    },
                    // Пункт 3: Стейкинг и TON блокчейн (Часть 1)
                    {
                        id: 3,
                        type: 'link',
                        title: "Стейкинг и TON блокчейн (Часть 1)",
                        description: "Принципы пассивного дохода через стейкинг - первая часть",
                        content: "https://disk.yandex.ru/i/L-Fz_tARpC2MTw",
                        external: true
                    },
                    // Пункт 4: Стейкинг и TON блокчейн (Часть 2)
                    {
                        id: 4,
                        type: 'link',
                        title: "Стейкинг и TON блокчейн (Часть 2)",
                        description: "Принципы пассивного дохода через стейкинг - вторая часть",
                        content: "https://disk.yandex.ru/i/ficIkpTXHYQ26g",
                        external: true
                    }
                ]
            },
            2: {
                title: "Активация и закрытие возражений",
                lessons: [
                    {
                        id: 1,
                        type: 'audio',
                        title: "Чаты DRAZZE",
                        description: "Как эффективно работать в команде через чаты",
                        content: "assets/audio/stage2/1-drazze-chats.mp3"
                    },
                    {
                        id: 2,
                        type: 'audio',
                        title: "Наставник в бизнесе",
                        description: "Роль и возможности наставника в сетевом бизнесе",
                        content: "assets/audio/stage2/2-business-mentor.mp3"
                    },
                    {
                        id: 3,
                        type: 'objections',
                        title: "Блоки возражений",
                        description: "10 ключевых ответов на частые возражения",
                        objections: [
                            { id: 1, title: "Это пирамида", audio: "assets/audio/stage2/3-1-this-is-pyramid.mp3" },
                            { id: 2, title: "Крипта — это не серьезно", audio: "assets/audio/stage2/3-2-crypto-not-serious.mp3" },
                            { id: 3, title: "Моему окружению это не интересно", audio: "assets/audio/stage2/3-3-not-interesting.mp3" },
                            { id: 4, title: "У меня нет денег", audio: "assets/audio/stage2/3-4-no-money.mp3" },
                            { id: 5, title: "У меня нет времени", audio: "assets/audio/stage2/3-5-no-time.mp3" },
                            { id: 6, title: "Я не умею приглавать", audio: "assets/audio/stage2/3-6-cant-invite.mp3" },
                            { id: 7, title: "Это слишком рискованно", audio: "assets/audio/stage2/3-7-too-risky.mp3" },
                            { id: 8, title: "Зарабатывает только верхушка", audio: "assets/audio/stage2/3-8-only-top-earns.mp3" },
                            { id: 9, title: "Я не доверяю команде / основателям", audio: "assets/audio/stage2/3-9-dont-trust-team.mp3" },
                            { id: 10, title: "Поздно заходить, я уже опоздал", audio: "assets/audio/stage2/3-10-too-late.mp3" }
                        ]
                    }
                ]
            },
            3: {
                title: "Закрытие статуса Agent",
                lessons: [
                    {
                        id: 1,
                        type: 'link',
                        title: "Закрытие статуса",
                        description: "Практическое видео по закрытию статуса Agent",
                        content: "https://disk.yandex.ru/i/z_wpYsiQ_sYvUQ",
                        external: true
                    },
                    {
                        id: 2,
                        type: 'text',
                        title: "Скрипты первого сообщения",
                        description: "Полный гайд по коммуникации и диалогам",
                        content: `
                            <h3>1️⃣ Как писать людям — скрипты первого сообщения</h3>
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
                            А ты вообще открыт(а) к новым возможностям, если будет что-то интересное и с обучением? И позволит тебе дополнительно зарабатывать? Можно говорить что, Заработать больше чем на основной работе (смотреть по ситуации, если у человека прям мотивация деньги)</p>
                            
                            <h3>3️⃣ Скрипт, когда человек заинтересовался</h3>
                            <p>Тогда давай сделаем так 🙂<br>
                            Я не буду ничего продавать в переписке<br>
                            Лучше покажу суть, а ты спокойно посмотришь и скажешь — откликается или нет, ок?</p>
                            
                            <h3>4️⃣ Скрипты ответов на частые возражения</h3>
                            <p><strong>❓ «У меня нет времени»</strong><br>
                            Понимаю тебя<br>
                            Именно поэтому я и обратил внимание — тут как раз не про 8 часов в день<br>
                            А сколько времени в неделю ты в принципе мог бы выделить, если идея стоящая?</p>
                            
                            <p><strong>❓ «Я не верю в сетевой»</strong><br>
                            Понимаю, у меня раньше было такое же отношение<br>
                            Скажи, а у тебя был личный опыт или больше по рассказам других?</p>
                            
                            <p><strong>❓ «Мне неинтересно»</strong><br>
                            Хорошо, спасибо, что честно сказал 🙂<br>
                            Если вдруг в будущем захочешь вернуться к разговору — я на связи<br>
                            (‼️ Учить: уважать отказ — это повышает доверие)</p>
                            
                            <h3>5️⃣ Главная формула, которую нужно знать</h3>
                            <p><strong>📌 Диалог = 70% вопросы + 20% слушаем + 10% говорим</strong><br>
                            📌 Не продаём — приглашаем посмотреть<br>
                            📌 Человек важнее бизнеса</p>
                        `
                    },
                    {
                        id: 3,
                        type: 'audio',
                        title: "Как звать без впаривания",
                        description: "Естественный подход к приглашению людей",
                        content: "assets/audio/stage3/3-how-to-invite.mp3"
                    },
                    {
                        id: 4,
                        type: 'audio',
                        title: "Короткая голосовая мини презентация",
                        description: "Краткая презентация проекта DRAZZE",
                        content: "assets/audio/stage3/4-mini-presentation.mp3"
                    },
                    {
                        id: 5,
                        type: 'audio',
                        title: "Что такое DRAZZE и зачем этот проект вообще существует",
                        description: "Философия и миссия проекта",
                        content: "assets/audio/stage3/5-what-is-drazze-purpose.mp3"
                    },
                    {
                        id: 6,
                        type: 'audio',
                        title: "Почему DRAZZE это уже не идея",
                        description: "Реализация и текущий статус проекта",
                        content: "assets/audio/stage3/6-not-just-idea.mp3"
                    },
                    {
                        id: 7,
                        type: 'audio',
                        title: "Где мы сейчас и почему листинг — это точка входа",
                        description: "Текущая стадия проекта и возможности",
                        content: "assets/audio/stage3/7-listing-entry-point.mp3"
                    },
                    {
                        id: 8,
                        type: 'audio',
                        title: "Почему это бизнес-возможность, а не просто крипта",
                        description: "Бизнес-модель и перспективы",
                        content: "assets/audio/stage3/8-business-opportunity.mp3"
                    }
                ]
            },
            4: {
                title: "Лидерский уровень (3 по 3)",
                lessons: [
                    // Пункт 1.1
                    {
                        id: 1,
                        type: 'link',
                        title: "Доход от 600$ в неделю (Часть 1)",
                        description: "Стратегия заработка на статусе Commander. Часть 1",
                        content: "https://disk.yandex.ru/i/kH7dVUc8_Sz8Qg",
                        external: true
                    },
                    // Пункт 1.2
                    {
                        id: 2,
                        type: 'link',
                        title: "Как маштабировать свой бизнес",
                        description: "И что важно при построении своей команды",
                        content: "https://disk.yandex.ru/i/ognjyZrKkYx7PA",
                        external: true
                    },
                    {
                        id: 3,
                        type: 'text',
                        title: "Масштабирование бизнеса",
                        description: "Построение команды лидеров",
                        content: `
                            <h2>ИЗ ПАРТНЁРА → В СЕТЕВОГО ПРЕДПРИНИМАТЕЛЯ И ЛИДЕРА КОМАНДЫ</h2>
                            
                            <h3>БЛОК 1. ВСТУПЛЕНИЕ — ФИКСАЦИЯ НОВОГО ЭТАПА</h3>
                            <p>Если ты читаешь это — значит, ты реально прошёл важный этап. И это не про мотивацию. Это про факт.</p>
                            
                            <p>У тебя уже есть команда. Ты уже разобрался в механике проекта. Ты понимаешь, как работает продукт, маркетинг, партнёрская модель. Ты уже не на стадии «разобраться», «посмотреть», «попробовать».</p>
                            <p>И именно здесь происходит ключевой перелом.</p>
                            
                            <p>С этого момента ты перестаёшь быть просто партнёром, который:<br>
                            — зашёл в проект<br>
                            — сделал личный результат<br>
                            — что-то заработал</p>
                            
                            <p>Ты переходишь в другую роль. Ты становишься сетевым предпринимателем.</p>
                            
                            <p>А это значит, что меняется:<br>
                            — твой фокус<br>
                            — твоя ответственность<br>
                            — твой масштаб мышления</p>
                            
                            <p>Это точка, где бизнес перестаёт быть «моим результатом» и становится системой, которая растёт через других людей.</p>
                            
                            <h3>БЛОК 2. КТО ТАКОЙ СЕТЕВОЙ ПРЕДПРИНИМАТЕЛЬ</h3>
                            <p>Очень важно сразу убрать иллюзию.<br>
                            Сетевой предприниматель — это не тот, кто больше всех приглашает. И не тот, кто пишет всем подряд.</p>
                            
                            <p>Сетевой предприниматель — это человек, который:<br>
                            — выстраивает систему<br>
                            — понимает механику масштабирования<br>
                            — и самое главное — умеет масштабировать людей</p>
                            
                            <p>Это ключевая мысль.<br>
                            Ты больше не просто делаешь действия сам. Ты создаёшь условия, при которых другие начинают делать результат.</p>
                            
                            <p>И вот здесь появляется принципиальная разница:<br>
                            • партнёр думает: «Как заработать мне?»<br>
                            • предприниматель думает: «Как вырастить людей, через которых масштабируется бизнес?»</p>
                            
                            <p>Теперь твоя задача — не расти самому, а расти через рост партнёров.</p>
                            
                            <h3>БЛОК 3. СМЕНА ФОКУСА: С СЕБЯ → НА КОМАНДУ</h3>
                            <p>Раньше твой фокус был логичным и правильным:<br>
                            — разобраться<br>
                            — войти<br>
                            — сделать первые деньги<br>
                            — доказать себе, что система работает</p>
                            
                            <p>Это нормальный этап.<br>
                            Но если ты на нём застрянешь — роста не будет.</p>
                            
                            <p>На новом уровне фокус меняется кардинально:<br>
                            ❌ не «что я сделал»<br>
                            ✅ а «кого я довёл до результата»</p>
                            
                            <p>И здесь очень важная мысль, которую многие упускают:<br>
                            Ты становишься лидером не тогда, когда у тебя есть команда. Команда может быть у кого угодно.</p>
                            
                            <p>Ты становишься лидером тогда, когда твоя команда:<br>
                            — зарабатывает<br>
                            — растёт<br>
                            — повторяет твои действия</p>
                            
                            <p>Если люди под тобой не растут — значит, ты всё ещё работаешь как партнёр, а не как лидер.</p>
                            
                            <h3>БЛОК 4. ЧТО КОНКРЕТНО ДЕЛАЕТ ЛИДЕР КОМАНДЫ</h3>
                            <p>Лидерство — это не мотивационные речи и не красивые слова.<br>
                            Лидерство — это конкретные управленческие действия.</p>
                            
                            <h4>1. Давать материалы и структуру</h4>
                            <p>Новичку не нужен поток информации. Ему нужна понятная дорожная карта.</p>
                            
                            <p>Твоя задача — передать:<br>
                            — презентации<br>
                            — обучающие видео<br>
                            — инструкции<br>
                            — чёткое понимание: что делать сначала, что потом и зачем</p>
                            
                            <p>Если у человека в голове хаос — он не будет действовать.</p>
                            
                            <h4>2. Ставить дедлайны</h4>
                            <p>Без дедлайнов нет движения. Есть «потом», которое никогда не наступает.<br>
                            Лидер:<br>
                            — помогает поставить цель<br>
                            — разбивает её на шаги<br>
                            — фиксирует сроки</p>
                            
                            <p><strong>Пример:</strong> не «развивайся», а «до пятницы — 10 диалогов, в воскресенье — разбор».</p>
                            
                            <h4>3. Сопровождать</h4>
                            <p>Сопровождение — это ключ к удержанию людей.<br>
                            Человек должен чувствовать:<br>
                            — что он не брошен<br>
                            — что его путь кому-то важен<br>
                            — что рядом есть опора</p>
                            
                            <p>Большинство уходят не потому, что проект плохой, а потому что остались одни.</p>
                            
                            <h4>4. Помогать в переговорах</h4>
                            <p>На старте почти всем страшно:<br>
                            — писать<br>
                            — созваниваться<br>
                            — закрывать<br>
                            Лидер:<br>
                            — подключается к диалогам<br>
                            — делает трёхсторонние звонки<br>
                            — помогает закрыть первые сделки<br>
                            — показывает механику переговоров</p>
                            
                            <p>Это ускоряет рост человека в разы.</p>
                            
                            <h4>5. Мотивировать правильно</h4>
                            <p>Мотивация — это не «давай, у тебя получится».</p>
                            
                            <p>Настоящая мотивация — это:<br>
                            — поддержка в сложный момент<br>
                            — вера, когда у человека опускаются руки<br>
                            — напоминание, зачем он вообще сюда пришёл</p>
                            
                            <h4>6. Передавать ту же систему, которую дали тебе</h4>
                            <p>Ты не изобретаешь велосипед. Ты копируешь и передаёшь работающую модель.</p>
                            
                            <p>Именно так строятся:<br>
                            — масштабируемые структуры<br>
                            — сильные команды<br>
                            — долгосрочный бизнес</p>
                            
                            <h4>7. Быть точкой контакта</h4>
                            <p>Лидер — это центр коммуникации.<br>
                            Ты:<br>
                            — на связи<br>
                            — делишься новостями<br>
                            — вовлекаешь в процессы<br>
                            — держишь команду в общем ритме</p>
                            
                            <h3>БЛОК 5. КЛЮЧЕВЫЕ ПАРТНЁРЫ — ОСНОВА МАСШТАБА</h3>
                            <p>Важно принять взрослую реальность: ты не можешь вкладываться одинаково во всех.<br>
                            Это не про несправедливость. Это про эффективность.</p>
                            
                            <p>Твоя задача:<br>
                            — найти 3–5 ключевых партнёров<br>
                            — вкладываться в них временем и вниманием<br>
                            — растить их как будущих лидеров</p>
                            
                            <p>Именно через них масштабируется бизнес.</p>
                            
                            <h3>БЛОК 6. РАБОТА С НЕБОЛЬШОЙ КОМАНДОЙ — ТВОЙ САМЫЙ БОЛЬШОЙ ПЛЮС</h3>
                            <p>Пока команда небольшая — у тебя колоссальное преимущество.</p>
                            
                            <p>Ты можешь:<br>
                            — общаться лично<br>
                            — знать людей<br>
                            — понимать их мотивацию<br>
                            — формировать доверие</p>
                            
                            <p>Это закладывает ядро команды, которое потом держит всю структуру.</p>
                            
                            <h3>БЛОК 7. ФИНАЛ — ФИКСАЦИЯ РОЛИ ЛИДЕРА</h3>
                            <p>Поздравляю. Ты прошёл этот этап обучения.</p>
                            
                            <p>С этого момента ты:<br>
                            — не просто участник<br>
                            — не просто партнёр<br>
                            — а лидер, который строит бизнес через людей и систему</p>
                            
                            <p>И запомни главное:<br>
                            Большие деньги приходят не к тем, кто ищет лёгкий путь, а к тем, кто научился создавать ценность для других.</p>
                            
                            <p><strong>Или по-настоящему лидерская формула:</strong><br>
                            Лидером становятся не по статусу, а по количеству людей, которых ты довёл до результата.</p>
                        `
                    }
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
        
        // Reset objections
        const objectionsList = document.getElementById('objectionsList');
        if (objectionsList) {
            objectionsList.classList.remove('active');
        }
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
        } else if (lesson.type === 'objections') {
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
        const objectionsCard = document.querySelector('.lesson-card.expandable');
        const objectionsList = document.getElementById('objectionsList');
        
        if (objectionsCard && objectionsList) {
            objectionsCard.addEventListener('click', function(e) {
                if (this.classList.contains('expandable')) {
                    e.stopPropagation();
                    this.classList.toggle('expanded');
                    objectionsList.classList.toggle('active');
                    
                    const icon = this.querySelector('.lesson-action i');
                    if (icon) {
                        icon.className = this.classList.contains('expanded') ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
                    }
                }
            });
        }
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


