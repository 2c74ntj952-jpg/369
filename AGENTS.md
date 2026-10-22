# Project Conventions & Agent Guidelines

## Core Principles

1. **Strict Scope Discipline (No Overengineering)**
   - Build and modify strictly what is requested.
   - Do not add unsolicited UI elements, decorative badges, or extra navigational tabs.
   - Avoid guessing or adding "extra helpful" features that clutter the interface.

2. **User-Facing Transparency vs. System Logic**
   - Keep internal scheduling algorithms, AI prompts, or recurrence calculations clean and backend-focused.
   - Do not display internal system metadata (e.g. interval recurrence tags) on user-facing cards unless explicitly requested.

3. **Communication & Execution**
   - Communicate clearly and directly in Ukrainian, matching the user's style.
   - Focus on practical, clean UI polish, precise data handling for growth metrics (pH, PPM, moisture, lighting, stage tracking), and responsive layout performance.

4. **Grow Room & Plant Cards Structure**
   - All plant card windows in a grow room must always be collapsed by default (`defaultExpanded={false}`) until explicitly clicked/expanded by the user.
   - Room-wide climate controls and metrics (VPD, temperature, humidity, pH, EC) belong to the room once at the top level and must not be duplicated inside individual plant cards.
   - **STRICTLY BANNED UI BANNERS**: Never render or re-add the green recommendation banner "🌱 Вологість ... (≤ 30%) — Потрібно поливати!" or "Субстрат достатньо просох. Настав час поливу!". It was explicitly removed by the user and must NEVER return.

## App Architecture & Functionality Registry

### 1. Substrate & Watering Metrics (До / Після поливу)
- **Заміри До Поливу**:
  - `moisture` (Вологість субстрату до поливу, %)
  - `ph` (pH субстрату до поливу)
  - `ppm` (PPM / EC субстрату до поливу)
- **Заміри Після Поливу (Дренаж / Вихід)**:
  - `moistureAfterWatering` (Вологість після поливу, %)
  - `phAfterWatering` (pH дренажу після поливу)
  - `ppmAfterWatering` (PPM дренажу після поливу)
- **UI структура**: Показники розбиті чіткими горизонтальними роздільниками "(до поливу)" та "🌊 Показники ПІСЛЯ поливу (Дренаж / Вихід)", без зашумлених вкладених контейнерів.

### 2. Grow Room & Plant Structure
- **Grow Room**: Верхній рівень із загальними кліматичними параметрами (Температура, Вологість повітря, VPD, Светний режим).
- **Plant Cards**:
  - Картки рослин згорнуті за замовчуванням (`defaultExpanded={false}`).
  - Розгортаються при кліку для перегляду та редагування фази, показників субстрату, журналу, фотографій та нагадувань.

### 3. Stage & Growth Tracking
- Фази росту: Пророщування (Germination), Розсада (Seedling), Вегетація (Vegetative), Цвітіння (Flowering), Харвест (Harvest).
- Інтерактивні ролери фаз та дат розсади/переводу.

### 4. AI Plant Doctor & Insights
- Інтеграція з Gemini API для діагностики дефіцитів, хвороб та надання порад по догляду за рослинами на основі замiрів pH, PPM та клімату.

### 5. Бази знань AI-помічника (Подвійна архітектура)
- **ОСНОВНА БАЗА (`app_user_best_practices.md`)**: Внутрішня база кращих практик, побудована на реальному практичному досвіді, замірах (вологість до/після, pH/PPM дренажу, поливи, освітлення, тренування) та циклах вирощування користувачів нашого додатку. Слугує першочерговою основою для порад асистента.
- **ДОДАТКОВИЙ МОДУЛЬ (`growdiaries_full_database.md`)**: Додаткова база-довідник GrowDiaries, яка використовується AI-помічником для глибшого порівняльного аналізу, перевірки генетичних паспортів сідбанків та калібрування світових прогнозів врожайності.
- **Врахування будь-якого досвіду (поганого і хорошого)**: AI-помічник аналізує весь спектр досвіду: типові помилки й збої (переливи, опіки, сольові блокування, стреси від підрізання, гниль) та історії успіху (LST, правильний dry-back, помірне живлення). Усі бази підключаються комплексно для повного циклу аналізу, контролю параметрів та прогнозування.
- **UI Принцип**: Обидві бази є суто внутрішніми бекенд-джерелами знань AI і ніколи не відображаються у вигляді сирих текстів, списків або зайвих вкладок в інтерфейсі користувача.



