export type MediumType = 'Soil' | 'Coco' | 'Hydro' | 'All';
export type NutrientCategory =
  | 'base'
  | 'root'
  | 'bloom'
  | 'calmag'
  | 'enzymes'
  | 'silica'
  | 'flushing'
  | 'microbes'
  | 'terpenes'
  | 'foliar'
  | 'ph_control'
  | 'booster';

export type TargetStage = 'all' | 'seedling' | 'vegetative' | 'early_bloom' | 'late_bloom' | 'flush';

export interface NutrientProduct {
  id: string;
  name: string;
  category: NutrientCategory;
  categoryLabelUk: string;
  npk?: string;
  descriptionUk: string;
  dosageGuide: string; // e.g. "1 - 2 мл/л"
  targetMedium: MediumType;
  recommendedStages: TargetStage[];
  bestUsedForUk: string; // Для чого призначений
  phImpactUk?: string;
}

export interface WeeklyFeedDose {
  week: number;
  stage: TargetStage;
  stageLabelUk: string;
  dosageMlPerLiter: Record<string, number>; // productId -> ml/L
  targetPpm: number;
  targetEc: number;
  targetPh: string;
}

export interface FeedChart {
  id: string;
  nameUk: string;
  medium: MediumType;
  scheduleType: 'weekly';
  weeks: WeeklyFeedDose[];
}

export interface BrandPartnerPlan {
  tier: 'free' | 'verified' | 'premium_cabinet';
  isOfficialPartner: boolean;
  sponsorBannerUrl?: string;
  contactEmail?: string;
  websiteUrl?: string;
  directShopUrl?: string;
  promoCode?: string;
  discountPercent?: number;
}

export interface ManufacturerBrand {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  foundedYear?: number;
  logoUrl: string;
  badgeTag: string; // e.g. "#1 за версією GrowDiaries", "100% Organic", "Ultra-Pure Mineral"
  categoryType: 'Organic' | 'Mineral' | 'Bio-Mineral' | 'Specialized';
  rating: number; // 4.8 - 5.0
  growDiariesRating: number; // e.g. 9.4
  growReportsCount: number; // e.g. 10842+
  growDiariesProductsCount: number; // Офіційна кількість зареєстрованих продуктів на GrowDiaries (наприклад 61, 14, 35...)
  shortBioUk: string;
  fullDescriptionUk: string;
  headquarters: string;
  partnerPlan: BrandPartnerPlan;
  keyAdvantagesUk: string[];
  products: NutrientProduct[];
  feedCharts: FeedChart[];
}

export const MANUFACTURERS_CATALOG: ManufacturerBrand[] = [
  {
    id: 'advanced-nutrients',
    name: 'Advanced Nutrients',
    country: 'США / Канада',
    countryFlag: '🇺🇸',
    foundedYear: 1999,
    logoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🏆 #1 GrowDiaries (10,842+ врожаїв • 61 продукт)',
    categoryType: 'Mineral',
    rating: 4.9,
    growDiariesRating: 9.4,
    growReportsCount: 10842,
    growDiariesProductsCount: 61,
    headquarters: 'West Hollywood, California, USA',
    shortBioUk: 'Світовий лідер у галузі спеціалізованих добрив для канабісу з запатентованою технологією pH Perfect та найбільшою лінійкою бустерів.',
    fullDescriptionUk: 'Advanced Nutrients — найбільш впізнаваний та результативний бренд у світі гроверів. Завдяки технології pH Perfect розчин автоматично балансує рівень кислотності між 5.5 та 6.3, запобігаючи блокуванню поживних елементів (Nutrient Lockout).',
    partnerPlan: {
      tier: 'premium_cabinet',
      isOfficialPartner: true,
      websiteUrl: 'https://www.advancednutrients.com',
      promoCode: 'PROPAHANDA_AN',
      discountPercent: 10,
      contactEmail: 'partners@advancednutrients.com'
    },
    keyAdvantagesUk: [
      'Технологія pH Perfect (не потребує регуляторів pH-Up / pH-Down)',
      'Спеціалізовані хелатовані мікроелементи ультрависокої чистоти',
      'Легендарні бустери смоли та терпенового профілю (Big Bud, Bud Candy, Overdrive, Bud Factor X)',
      'Потужний біологічний комплекс корисних бактерій та грибів (Voodoo Juice, Piranha, Tarantula)'
    ],
    products: [
      {
        id: 'sensi-grow-ab',
        name: 'pH Perfect Sensi Grow A+B',
        category: 'base',
        categoryLabelUk: 'Базове живлення (Вегетація)',
        npk: 'Part A (3-0-0) + Part B (1-2-6)',
        descriptionUk: 'Двокомпонентне базове добриво для фази активного вегетативного росту, стебла та міцного листя.',
        dosageGuide: '1 - 4 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Швидкий набір зеленої біомаси, формування товстого стовбура без коливань pH.'
      },
      {
        id: 'sensi-bloom-ab',
        name: 'pH Perfect Sensi Bloom A+B',
        category: 'base',
        categoryLabelUk: 'Базове живлення (Цвітіння)',
        npk: 'Part A (3-0-0) + Part B (2-4-8)',
        descriptionUk: 'Двокомпонентне преміум добриво для масивного завʼязування суцвіть і правильного балансу калію та фосфору.',
        dosageGuide: '2 - 4 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Формування щільних суцвіть, максимальний вихід смоли.'
      },
      {
        id: 'connoisseur-grow-ab',
        name: 'pH Perfect Connoisseur Grow A+B',
        category: 'base',
        categoryLabelUk: 'Флагманська база (Вега Преміум)',
        npk: 'Part A (4-0-0) + Part B (1-2-7)',
        descriptionUk: 'Найпотужніша ультрапреміальна база для досвідчених гроверів, які витискають 100% потенціалу генетики.',
        dosageGuide: '1 - 4 мл/л',
        targetMedium: 'All',
        recommendedStages: ['vegetative'],
        bestUsedForUk: 'Максимальний вегетативний старт для елітних материнських рослин та клонів.'
      },
      {
        id: 'connoisseur-bloom-ab',
        name: 'pH Perfect Connoisseur Bloom A+B',
        category: 'base',
        categoryLabelUk: 'Флагманська база (Цвіт Преміум)',
        npk: 'Part A (3-0-0) + Part B (2-4-10)',
        descriptionUk: 'Топова формула для цвітіння з амінокислотами та полімерними хелатами для максимального розміру та ваги суцвіть.',
        dosageGuide: '2 - 4 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Рекордні врожаї найвищої комерційної та медичної якості.'
      },
      {
        id: 'voodoo-juice',
        name: 'Voodoo Juice',
        category: 'microbes',
        categoryLabelUk: 'Кореневі бактерії & Мікориза',
        descriptionUk: 'Комплекс із 8 штамів корисних бактерій, що збільшують активну площу кореневої системи до 117%.',
        dosageGuide: '2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative', 'early_bloom'],
        bestUsedForUk: 'Стимуляція коренів, колонізація ризосфери, захист від кореневої гнилі (Pythium).'
      },
      {
        id: 'piranha',
        name: 'Piranha Liquid',
        category: 'microbes',
        categoryLabelUk: 'Екто- та Ендомікоризні гриби',
        descriptionUk: '24 штами корисних грибів, які обплітають коріння та допомагають поглинати важкодоступний фосфор і кисень.',
        dosageGuide: '2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative', 'early_bloom'],
        bestUsedForUk: 'Спільна дія з Voodoo Juice для створення непробивного кореневого захисного щита.'
      },
      {
        id: 'tarantula',
        name: 'Tarantula Liquid',
        category: 'microbes',
        categoryLabelUk: 'Висококонцентровані ґрунтові бактерії',
        descriptionUk: 'Містить 1.4 мільярда колонієутворюючих одиниць корисних бацил на грам для розщеплення органіки.',
        dosageGuide: '2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['vegetative', 'early_bloom'],
        bestUsedForUk: 'Збагачення субстрату, виділення природних цитокінінів для стимуляції бокового розгалуження.'
      },
      {
        id: 'b-52',
        name: 'B-52 Fertilizer Booster',
        category: 'booster',
        categoryLabelUk: 'Вітамінний комплекс B1-B7 & Водорості',
        npk: '2-1-4',
        descriptionUk: 'Спеціальний комплекс вітамінів групи B, екстракту водоростей келп та гумінових кислот для захисту від стресів.',
        dosageGuide: '2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Антистрес при пересадці, перепадах температур, LST/HST тренуваннях та дефоліації.'
      },
      {
        id: 'rhino-skin',
        name: 'Rhino Skin (Силікат Калію)',
        category: 'silica',
        categoryLabelUk: 'Біодоступний Кремній (Silica)',
        npk: '0-0-0.4 + 0.15% Si',
        descriptionUk: 'Захищає рослини від теплового стресу, шкідників і зміцнює клітинні стінки стебел, щоб утримувати важкі шишки.',
        dosageGuide: '2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['vegetative', 'early_bloom', 'late_bloom'],
        bestUsedForUk: 'Товсті, немов деревʼяні гілки та стійкість до спеки вище 28°C.'
      },
      {
        id: 'bud-ignitor',
        name: 'Bud Ignitor',
        category: 'bloom',
        categoryLabelUk: 'Стартер цвітіння (1-2 тижні)',
        npk: '0-1-2',
        descriptionUk: 'Застосовується в перші 2 тижні цвітіння. Змушує рослину закладати суцвіття на кожному міжвузлі.',
        dosageGuide: '2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom'],
        bestUsedForUk: 'Збільшення кількості сайтів цвітіння (бутонів) на 70%.'
      },
      {
        id: 'big-bud',
        name: 'Big Bud Liquid / Coco',
        category: 'bloom',
        categoryLabelUk: 'Бустер цвітіння & Маси #1',
        npk: '0-1-3',
        descriptionUk: 'Культовий стимулятор цвітіння з оптимізованим співвідношенням фосфору, калію та амінокислот L-форми.',
        dosageGuide: '2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Збільшення розміру та щільності суцвіть на 2-4 тижнях цвітіння.'
      },
      {
        id: 'bud-candy',
        name: 'Bud Candy',
        category: 'terpenes',
        categoryLabelUk: 'Вуглеводи & Аромат (Меляса)',
        npk: '0-0-0 + 0.5% Mg',
        descriptionUk: 'Комплекс простих та складних вуглеводів для підживлення корисних мікробів та вибухового аромату суцвіть.',
        dosageGuide: '2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Посилення запаху, солодкості та маслянистості трихом.'
      },
      {
        id: 'bud-factor-x',
        name: 'Bud Factor X',
        category: 'terpenes',
        categoryLabelUk: 'Максимізатор смоли та терпенів',
        npk: '0-0-0 + 0.5% Mg',
        descriptionUk: 'Стимулює імунну систему рослини виділяти смолу, терпени та канабіноїди для захисту від ультрафіолету.',
        dosageGuide: '2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Екстремальний терпеновий профіль та білосніжний шар трихом на шишках.'
      },
      {
        id: 'nirvana',
        name: 'Nirvana Organics',
        category: 'booster',
        categoryLabelUk: '100% Органічний біо-активатор',
        npk: '0-0-1',
        descriptionUk: 'Містить екстракт люцерни (триаконтанол), гуано кажанів, морські водорості та дріжджовий екстракт.',
        dosageGuide: '2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['vegetative', 'early_bloom', 'late_bloom'],
        bestUsedForUk: 'Природне прискорення метаболізму та підвищення імунітету.'
      },
      {
        id: 'sensizym',
        name: 'Sensizym',
        category: 'enzymes',
        categoryLabelUk: 'Ферменти & Очищення ризосфери',
        descriptionUk: 'Розщеплює відмерлу кореневу тканину та сольовий наліт на біодоступні цукри та поживні елементи.',
        dosageGuide: '2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Очищення кореневої зони від залишків добрив та запобігання загниванню.'
      },
      {
        id: 'cal-mag-xtra',
        name: 'Sensi Cal-Mag Xtra',
        category: 'calmag',
        categoryLabelUk: 'Кальцій, Магній, Залізо & Хелати',
        npk: '4-0-0 + 3.2% Ca + 1.1% Mg + 0.09% Fe',
        descriptionUk: 'Преміальний Cal-Mag збагачений залізом у формі DTPA, цинком, марганцем та амінокислотами.',
        dosageGuide: '2 мл/л (полив) або 1 мл/л (по листу)',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Миттєве усунення міжжилкового хлорозу, плямистості на LED та робота з осмотичною водою.'
      },
      {
        id: 'revive',
        name: 'Revive (Реаніматор Рослин)',
        category: 'booster',
        categoryLabelUk: 'Екстрена допомога при стресах',
        npk: '1.5-0-0 + 1% Ca + 0.5% Mg + 0.3% Fe',
        descriptionUk: 'Швидка допомога для пожовклих, перелитих, перегодованих або висохлих рослин.',
        dosageGuide: '2 - 5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Повернення до життя за 24–48 годин після сильного стресу.'
      },
      {
        id: 'overdrive',
        name: 'Overdrive',
        category: 'bloom',
        categoryLabelUk: 'Фінішний бустер дозрівання',
        npk: '1-5-4',
        descriptionUk: 'Препарат для останніх 2-3 тижнів цвітіння перед промивкою, що відновлює ріст шишок коли рослина втомлена.',
        dosageGuide: '2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['late_bloom'],
        bestUsedForUk: 'Фінальний сплеск набору маси та щільності перед харвестом.'
      },
      {
        id: 'flawless-finish',
        name: 'Flawless Finish',
        category: 'flushing',
        categoryLabelUk: 'Промивка (Флеш)',
        descriptionUk: 'Хелатуючий агент, який вимиває надлишок солей та важких металів з тканин рослини за 7–10 днів.',
        dosageGuide: '2 мл/л чистої води',
        targetMedium: 'All',
        recommendedStages: ['flush'],
        bestUsedForUk: 'Мʼякий дим, чистий білий попіл та покращення смакових якостей суцвіть.'
      }
    ],
    feedCharts: [
      {
        id: 'an-sensi-weekly',
        nameUk: 'Таблиця живлення pH Perfect Sensi (Ґрунт / Кокос)',
        medium: 'Soil',
        scheduleType: 'weekly',
        weeks: [
          { week: 1, stage: 'seedling', stageLabelUk: 'Тиждень 1: Розсада', dosageMlPerLiter: { 'sensi-grow-ab': 1, 'voodoo-juice': 2, 'b-52': 2 }, targetPpm: 350, targetEc: 0.7, targetPh: '5.8 - 6.2' },
          { week: 2, stage: 'vegetative', stageLabelUk: 'Тиждень 2: Рання Вега', dosageMlPerLiter: { 'sensi-grow-ab': 2, 'voodoo-juice': 2, 'b-52': 2, 'rhino-skin': 2 }, targetPpm: 550, targetEc: 1.1, targetPh: '5.8 - 6.2' },
          { week: 3, stage: 'vegetative', stageLabelUk: 'Тиждень 3: Активна Вега', dosageMlPerLiter: { 'sensi-grow-ab': 4, 'b-52': 2, 'rhino-skin': 2 }, targetPpm: 750, targetEc: 1.5, targetPh: '5.8 - 6.3' },
          { week: 4, stage: 'early_bloom', stageLabelUk: 'Тиждень 4: Перехід на цвіт (Bud Ignitor)', dosageMlPerLiter: { 'sensi-bloom-ab': 2, 'bud-ignitor': 2, 'bud-candy': 2 }, targetPpm: 800, targetEc: 1.6, targetPh: '6.0 - 6.4' },
          { week: 5, stage: 'early_bloom', stageLabelUk: 'Тиждень 5: Бутони (Big Bud)', dosageMlPerLiter: { 'sensi-bloom-ab': 4, 'big-bud': 2, 'bud-candy': 2, 'b-52': 2 }, targetPpm: 950, targetEc: 1.9, targetPh: '6.0 - 6.5' },
          { week: 6, stage: 'early_bloom', stageLabelUk: 'Тиждень 6: Налив шишок (Bud Factor X)', dosageMlPerLiter: { 'sensi-bloom-ab': 4, 'big-bud': 2, 'bud-candy': 2, 'bud-factor-x': 2 }, targetPpm: 1000, targetEc: 2.0, targetPh: '6.0 - 6.5' },
          { week: 7, stage: 'late_bloom', stageLabelUk: 'Тиждень 7: Пік (Overdrive)', dosageMlPerLiter: { 'sensi-bloom-ab': 4, 'overdrive': 2, 'bud-candy': 2, 'bud-factor-x': 2 }, targetPpm: 900, targetEc: 1.8, targetPh: '6.2 - 6.5' },
          { week: 8, stage: 'flush', stageLabelUk: 'Тиждень 8: Промивка (Flush)', dosageMlPerLiter: { 'flawless-finish': 2 }, targetPpm: 150, targetEc: 0.3, targetPh: '6.0 - 6.2' }
        ]
      }
    ]
  },
  {
    id: 'biobizz',
    name: 'BioBizz World Wide Organics',
    country: 'Нідерланди / Іспанія',
    countryFlag: '🇳🇱',
    foundedYear: 1992,
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🌱 #2 GrowDiaries (8,711+ врожаїв • 14 продуктів)',
    categoryType: 'Organic',
    rating: 4.8,
    growDiariesRating: 9.1,
    growReportsCount: 8711,
    growDiariesProductsCount: 14,
    headquarters: 'Groningen, Netherlands / Estella, Spain',
    shortBioUk: 'Найпопулярніший у Європі виробник 100% органічних добрив, субстратів та біо-стимуляторів для чистісінького медичного вирощування.',
    fullDescriptionUk: 'BioBizz створює екологічно чисті добрива на основі екстрактів бурякової меляси, норвезьких водоростей та гумінових кислот. Підтримує ґрунтову мікробіоту та забезпечує неперевершений натуральний солодкий терпеновий профіль.',
    partnerPlan: {
      tier: 'premium_cabinet',
      isOfficialPartner: true,
      websiteUrl: 'https://www.biobizz.com',
      promoCode: 'PROPAHANDA_BIO',
      discountPercent: 12,
      contactEmail: 'contact@biobizz.com'
    },
    keyAdvantagesUk: [
      '100% органічний склад без синтетичних мінеральних солей',
      'Неможливо обпалити коріння при дотриманні таблиці внесення',
      'Екологічні сертифікати OMRI, Point Vert та Clean Green',
      'Найкраще розкриває генетичний смак і запах медичних суцвіть'
    ],
    products: [
      {
        id: 'bio-grow',
        name: 'Bio-Grow',
        category: 'base',
        categoryLabelUk: 'Органічна Вегетація',
        npk: '4-3-6',
        descriptionUk: 'Органічне рідке добриво на основі 100% голландського цукрового буряка для росту та кореневої системи.',
        dosageGuide: '1 - 4 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['vegetative', 'early_bloom', 'late_bloom'],
        bestUsedForUk: 'Базове підживлення ґрунтових бактерій і забезпечення органічним азотом та калієм.'
      },
      {
        id: 'bio-bloom',
        name: 'Bio-Bloom',
        category: 'base',
        categoryLabelUk: 'Органічне Цвітіння',
        npk: '2-7-4',
        descriptionUk: 'Повноцінне органічне добриво для фази цвітіння, збагачене природними мікроелементами та рослинними гормонами.',
        dosageGuide: '2 - 4 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Рясне цвітіння, стимуляція пишних суцвіть та натурального аромату.'
      },
      {
        id: 'top-max',
        name: 'Top-Max',
        category: 'bloom',
        categoryLabelUk: 'Біо-стимулятор цвітіння',
        npk: '0.2-0.2-0.1',
        descriptionUk: '100% органічний стимулятор, що містить гумінові та фульвокислоти для кращого транспортування цукрів.',
        dosageGuide: '1 - 4 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Збільшення розміру шишок та підвищення засвоєння кальцію й магнію.'
      },
      {
        id: 'root-juice',
        name: 'Root-Juice',
        category: 'root',
        categoryLabelUk: 'Стимулятор коренів',
        npk: '0.1-0.1-0.1',
        descriptionUk: 'Гармонійне поєднання преміальної гумінової кислоти та водоростей для вибухового росту кореневих волосків.',
        dosageGuide: '1 - 4 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Перші 1-2 тижні життя саджанця для створення потужного кореневого кому.'
      },
      {
        id: 'alg-a-mic',
        name: 'Alg-A-Mic',
        category: 'booster',
        categoryLabelUk: 'Екстракт холодних водоростей',
        npk: '0.2-0.2-0.2',
        descriptionUk: 'Органічний антистресовий еліксир із морських водоростей, збагачений мікроелементами.',
        dosageGuide: '1 - 4 мл/л (полив або по листу)',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Порятунок від перегріву, перепадів вологості та надлишку солей.'
      },
      {
        id: 'bio-heaven',
        name: 'Bio-Heaven (Енергетичний Бустер)',
        category: 'booster',
        categoryLabelUk: 'Рослинний енергетик з L-амінокислотами',
        npk: '1.2-0.03-0.02',
        descriptionUk: 'Потужний біостимулятор, що покращує засвоєння поживних речовин на 95% та очищає від токсинів.',
        dosageGuide: '2 - 5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Максимальний метаболізм, посилене вироблення хлорофілу та щільність суцвіть.'
      },
      {
        id: 'acti-vera',
        name: 'Acti-Vera',
        category: 'booster',
        categoryLabelUk: 'Органічний екстракт Алое Вера',
        descriptionUk: 'Стимулює імунну систему рослини зсередини, підсилює розщеплення цукрів та захищає від інфекцій.',
        dosageGuide: '2 - 5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Підвищення природного імунітету та захист рослини від захворювань.'
      },
      {
        id: 'fish-mix',
        name: 'Fish-Mix',
        category: 'base',
        categoryLabelUk: 'Органічна рибна емульсія',
        npk: '5-1-4',
        descriptionUk: 'Органічна емульсія північноморської риби та бурякового екстракту для вибухового росту на відкритому повітрі або в боксі.',
        dosageGuide: '1 - 4 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Швидке пробудження ґрунтових мікробів та пишний ріст листя.'
      },
      {
        id: 'calmag-biobizz',
        name: 'Biobizz Calmag',
        category: 'calmag',
        categoryLabelUk: 'Органічний Кальцій / Магній',
        descriptionUk: '100% органічний коректор кальцію та магнію для мʼякої або осмотичної води (RO).',
        dosageGuide: '0.5 - 1.5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Профілактика дефіциту Cal-Mag на LED-освітленні та при використанні осмосу.'
      },
      {
        id: 'bio-microbes',
        name: 'Biobizz Microbes',
        category: 'microbes',
        categoryLabelUk: 'Порошкові бактерії, ензими та гриби',
        descriptionUk: 'Повний біологічний комплекс корисних мікроорганізмів, які покращують засвоєння фосфору та коренеутворення.',
        dosageGuide: '0.2 - 0.4 г/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative', 'early_bloom'],
        bestUsedForUk: 'Створення живої симбіотичної екосистеми в субстраті.'
      },
      {
        id: 'leaf-coat',
        name: 'Leaf-Coat (Захисний спрей)',
        category: 'foliar',
        categoryLabelUk: 'Біополімерний захисний барʼєр',
        descriptionUk: '100% натуральний латексний спрей по листу, який створює повітропроникний барʼєр проти комах та грибків.',
        dosageGuide: 'Готовий спрей (обприскування листя 2 рази на тиждень)',
        targetMedium: 'All',
        recommendedStages: ['vegetative', 'early_bloom'],
        bestUsedForUk: 'Захист від павутинного кліща, борошнистої роси та надмірної втрати вологи.'
      },
      {
        id: 'bio-ph-down',
        name: 'Biobizz Bio-pH Minus',
        category: 'ph_control',
        categoryLabelUk: 'Органічний коректор pH Down (Лимонна кислота)',
        descriptionUk: 'Натуральний регулятор кислотності на основі лимонної кислоти, який не шкодить ґрунтовій мікробіоті.',
        dosageGuide: '0.1 - 0.5 мл/л за потреби',
        targetMedium: 'Soil',
        recommendedStages: ['all'],
        bestUsedForUk: 'Мʼяке зниження pH без агресивних мінеральних кислот.'
      },
      {
        id: 'bio-ph-up',
        name: 'Biobizz Bio-pH Plus',
        category: 'ph_control',
        categoryLabelUk: 'Органічний коректор pH Up (Гумати)',
        descriptionUk: 'Органічний розчин на основі гумінових кислот для безпечного підвищення рівня pH.',
        dosageGuide: '0.1 - 0.5 мл/л за потреби',
        targetMedium: 'Soil',
        recommendedStages: ['all'],
        bestUsedForUk: 'Підвищення pH живильного розчину.'
      },
      {
        id: 'biobizz-pre-mix',
        name: 'Biobizz Pre-Mix',
        category: 'base',
        categoryLabelUk: 'Сухий ґрунтовий кондиціонер (100% Органіка)',
        npk: '3-3-5',
        descriptionUk: 'Сухе органічне добриво зі 100% натуральних компонентів для заправки та регенерації виснаженого субстрату.',
        dosageGuide: '3-5% від загального обʼєму субстрату (30-50 г на 1 л ґрунту)',
        targetMedium: 'Soil',
        recommendedStages: ['all'],
        bestUsedForUk: 'Підготовка живильного ґрунту перед посадкою та відновлення повторно використовуваного субстрату.'
      }
    ],
    feedCharts: [
      {
        id: 'biobizz-lightmix-schedule',
        nameUk: 'Таблиця BioBizz для субстрату Light-Mix',
        medium: 'Soil',
        scheduleType: 'weekly',
        weeks: [
          { week: 1, stage: 'seedling', stageLabelUk: 'Тиждень 1: Вкорінення', dosageMlPerLiter: { 'root-juice': 4, 'bio-heaven': 2 }, targetPpm: 300, targetEc: 0.6, targetPh: '6.2 - 6.5' },
          { week: 2, stage: 'vegetative', stageLabelUk: 'Тиждень 2: Вегетація', dosageMlPerLiter: { 'bio-grow': 2, 'root-juice': 2, 'bio-heaven': 2, 'acti-vera': 2 }, targetPpm: 500, targetEc: 1.0, targetPh: '6.2 - 6.5' },
          { week: 3, stage: 'vegetative', stageLabelUk: 'Тиждень 3: Пишна Вега', dosageMlPerLiter: { 'bio-grow': 2, 'bio-heaven': 2, 'acti-vera': 2, 'alg-a-mic': 1 }, targetPpm: 650, targetEc: 1.3, targetPh: '6.2 - 6.8' },
          { week: 4, stage: 'early_bloom', stageLabelUk: 'Тиждень 4: Початок цвіту', dosageMlPerLiter: { 'bio-grow': 2, 'bio-bloom': 2, 'top-max': 1, 'bio-heaven': 2 }, targetPpm: 800, targetEc: 1.6, targetPh: '6.3 - 6.8' },
          { week: 5, stage: 'early_bloom', stageLabelUk: 'Тиждень 5: Формування чашечок', dosageMlPerLiter: { 'bio-grow': 3, 'bio-bloom': 3, 'top-max': 1, 'bio-heaven': 3 }, targetPpm: 900, targetEc: 1.8, targetPh: '6.3 - 6.8' },
          { week: 6, stage: 'late_bloom', stageLabelUk: 'Тиждень 6: Наливання суцвіть', dosageMlPerLiter: { 'bio-grow': 4, 'bio-bloom': 4, 'top-max': 4, 'bio-heaven': 4 }, targetPpm: 1000, targetEc: 2.0, targetPh: '6.3 - 6.8' },
          { week: 7, stage: 'late_bloom', stageLabelUk: 'Тиждень 7: Дозрівання', dosageMlPerLiter: { 'bio-grow': 3, 'bio-bloom': 4, 'top-max': 4, 'bio-heaven': 4 }, targetPpm: 950, targetEc: 1.9, targetPh: '6.3 - 6.8' },
          { week: 8, stage: 'flush', stageLabelUk: 'Тиждень 8: Чистий полив (Вода)', dosageMlPerLiter: {}, targetPpm: 100, targetEc: 0.2, targetPh: '6.2 - 6.5' }
        ]
      }
    ]
  },
  {
    id: 'canna',
    name: 'CANNA Nutrients',
    country: 'Нідерланди',
    countryFlag: '🇳🇱',
    foundedYear: 1979,
    logoUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=150&q=80',
    badgeTag: '⚡ #4 GrowDiaries (4,353+ врожаїв • 39 продуктів)',
    categoryType: 'Mineral',
    rating: 4.9,
    growDiariesRating: 9.4,
    growReportsCount: 4353,
    growDiariesProductsCount: 39,
    headquarters: 'Oosterhout, Netherlands',
    shortBioUk: 'Найстаріший і найбільш авторитетний голландський бренд, що створив золотий стандарт вирощування на кокосі (CANNA Coco) та гідропоніці.',
    fullDescriptionUk: 'CANNA виготовляє ультрачисті мінеральні та біологічні добрива. Їхня лінійка CANNA Coco є світовим еталоном для буферизованого кокосового субстрату, що не вимагає поділу на окремі Veg/Bloom пляшки завдяки унікальній хелатній матриці.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.canna.com',
      promoCode: 'CANNA_PROPAHANDA',
      discountPercent: 10,
      contactEmail: 'info@canna.com'
    },
    keyAdvantagesUk: [
      'Ідеальний кокосовий баланс (Coco A+B використовується від старту до промивки)',
      'Ензими Cannazym переробляють відмерлі корені на корисні цукри',
      'Легендарний фосфорно-калієвий бустер PK 13/14 для вибухового росту шишок',
      'Спеціальні лінійки для гідропоніки (Aqua) та ґрунту (Terra)'
    ],
    products: [
      {
        id: 'canna-coco-ab',
        name: 'CANNA Coco A+B',
        category: 'base',
        categoryLabelUk: 'Універсальна база для Кокосу',
        npk: 'Part A (4-0-1) + Part B (0-4-2)',
        descriptionUk: 'Двокомпонентне поживне середовище, оптимізоване для буферизованого кокосу. Працює на вегетації та цвітінні.',
        dosageGuide: '1.5 - 4 мл/л',
        targetMedium: 'Coco',
        recommendedStages: ['all'],
        bestUsedForUk: 'Базове щоденне живлення на кокосовому волокні з ідеальним звʼязуванням кальцію.'
      },
      {
        id: 'canna-terra-vega',
        name: 'CANNA Terra Vega',
        category: 'base',
        categoryLabelUk: 'База Вегетації для Ґрунту',
        npk: '3-1-3',
        descriptionUk: 'Однокомпонентне добриво для швидкого розвитку кореневої системи та міцних пагонів у ґрунтових сумішах.',
        dosageGuide: '1.5 - 4 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Інтенсивний вегетативний ріст у ґрунті.'
      },
      {
        id: 'canna-terra-flores',
        name: 'CANNA Terra Flores',
        category: 'base',
        categoryLabelUk: 'База Цвітіння для Ґрунту',
        npk: '2-2-4',
        descriptionUk: 'Повне мінеральне добриво для фази цвітіння в ґрунті, збагачене хелатованими мікроелементами.',
        dosageGuide: '2 - 5 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Рясне закладення бутонів та правильний баланс NPK під час цвітіння.'
      },
      {
        id: 'rhizotonic',
        name: 'CANNA Rhizotonic',
        category: 'root',
        categoryLabelUk: 'Преміум біо-стимулятор коренів',
        npk: '0.6-0.2-0.6',
        descriptionUk: 'Екстракт водоростей з понад 60 мікробіологічними компонентами для шаленого росту кореневих волосків.',
        dosageGuide: '2 - 4 мл/л (полив або обприскування листя)',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Стрімке вкорінення клонів, саджанців та зняття стресу після пересадки.'
      },
      {
        id: 'cannazym',
        name: 'Cannazym',
        category: 'enzymes',
        categoryLabelUk: 'Ензими & Очищення коріння',
        descriptionUk: 'Високоякісний ферментний препарат, що розщеплює целюлозу мертвого коріння на поживні речовини.',
        dosageGuide: '2.5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Запобігання загниванню коріння та покращення аерації субстрату.'
      },
      {
        id: 'canna-pk-13-14',
        name: 'CANNA PK 13/14',
        category: 'bloom',
        categoryLabelUk: 'Ударний PK Бустер',
        npk: '0-13-14',
        descriptionUk: 'Чистий концентрат фосфору та калію. Вноситься одноразово протягом 1 тижня в пік цвітіння.',
        dosageGuide: '1.5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Миттєве ущільнення суцвіть на 4-5 тижні цвітіння.'
      },
      {
        id: 'canna-boost',
        name: 'CANNA Boost Accelerator',
        category: 'terpenes',
        categoryLabelUk: 'Метаболічний стимулятор',
        descriptionUk: 'Спеціальний стимулятор фотосинтезу та обміну речовин, що робить суцвіття солодшими та важчими.',
        dosageGuide: '2 - 4 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Прискорення дозрівання, зміцнення імунітету та посилення вироблення смоли.'
      },
      {
        id: 'canna-flush',
        name: 'CANNA Flush',
        category: 'flushing',
        categoryLabelUk: 'Очищення субстрату від солей',
        descriptionUk: 'Вимиває надлишок солей з ґрунту, кокосу чи гідропоніки без знищення корисної мікрофлори.',
        dosageGuide: '2 - 4 мл/л',
        targetMedium: 'All',
        recommendedStages: ['flush'],
        bestUsedForUk: 'Фінальна промивка та очищення при перегодовуванні.'
      },
      {
        id: 'canna-calmag-agent',
        name: 'CANNA Calmag Agent',
        category: 'calmag',
        categoryLabelUk: 'Коректор води Cal-Mag',
        npk: '6-0-0 + 7% Ca + 2.5% Mg',
        descriptionUk: 'Спеціальний розчин для підготовки мʼякої води або осмосу перед додаванням добрив (доводить EC води до 0.4).',
        dosageGuide: '0.5 - 1.0 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Буферизація осмотичної води для кокосового волокна.'
      }
    ],
    feedCharts: [
      {
        id: 'canna-coco-schedule',
        nameUk: 'Графік CANNA Coco A+B (Професійний)',
        medium: 'Coco',
        scheduleType: 'weekly',
        weeks: [
          { week: 1, stage: 'seedling', stageLabelUk: 'Тиждень 1: Саджанці', dosageMlPerLiter: { 'canna-coco-ab': 1.5, 'rhizotonic': 4.0, 'cannazym': 2.5 }, targetPpm: 500, targetEc: 1.0, targetPh: '5.6 - 6.0' },
          { week: 2, stage: 'vegetative', stageLabelUk: 'Тиждень 2: Вегетація', dosageMlPerLiter: { 'canna-coco-ab': 2.5, 'rhizotonic': 2.0, 'cannazym': 2.5 }, targetPpm: 750, targetEc: 1.5, targetPh: '5.8 - 6.1' },
          { week: 3, stage: 'vegetative', stageLabelUk: 'Тиждень 3: Вега пік', dosageMlPerLiter: { 'canna-coco-ab': 3.0, 'cannazym': 2.5 }, targetPpm: 850, targetEc: 1.7, targetPh: '5.8 - 6.2' },
          { week: 4, stage: 'early_bloom', stageLabelUk: 'Тиждень 4: Перевід 12/12', dosageMlPerLiter: { 'canna-coco-ab': 3.5, 'canna-boost': 2.0, 'cannazym': 2.5 }, targetPpm: 950, targetEc: 1.9, targetPh: '5.8 - 6.2' },
          { week: 5, stage: 'early_bloom', stageLabelUk: 'Тиждень 5: PK 13/14 Удар', dosageMlPerLiter: { 'canna-coco-ab': 3.5, 'canna-pk-13-14': 1.5, 'canna-boost': 2.0 }, targetPpm: 1150, targetEc: 2.3, targetPh: '5.9 - 6.3' },
          { week: 6, stage: 'late_bloom', stageLabelUk: 'Тиждень 6: Дозрівання', dosageMlPerLiter: { 'canna-coco-ab': 3.0, 'canna-boost': 3.0, 'cannazym': 2.5 }, targetPpm: 950, targetEc: 1.9, targetPh: '6.0 - 6.3' },
          { week: 7, stage: 'flush', stageLabelUk: 'Тиждень 7: Промивка', dosageMlPerLiter: { 'canna-flush': 2.0 }, targetPpm: 150, targetEc: 0.3, targetPh: '5.8 - 6.0' }
        ]
      }
    ]
  },
  {
    id: 'terra-aquatica',
    name: 'Terra Aquatica (ex. GHE)',
    country: 'Франція',
    countryFlag: '🇫🇷',
    foundedYear: 1995,
    logoUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=150&q=80',
    badgeTag: '💧 #3 GrowDiaries (7,452+ врожаїв • 35 продуктів)',
    categoryType: 'Mineral',
    rating: 4.8,
    growDiariesRating: 9.2,
    growReportsCount: 7452,
    growDiariesProductsCount: 35,
    headquarters: 'Fleurance, France',
    shortBioUk: 'Творці оригінальної формули General Hydroponics Europe (GHE). Світовий еталон гідропоніки та мінерального живлення.',
    fullDescriptionUk: 'TriPart (Grow, Micro, Bloom) була розроблена засновником доктором Келом Германом спільно з дослідниками NASA для космічних оранжерей. Дозволяє гнучко регулювати співвідношення N-P-K під будь-яку стадію розвитку рослини.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.terraaquatica.com',
      promoCode: 'TERRA_PROPA',
      discountPercent: 10
    },
    keyAdvantagesUk: [
      'Універсальна 3-компонентна система під будь-яку воду (Hard/Soft water)',
      'Культовий препарат FinalPart (Ripen) для прискореного дозрівання',
      'FlashClean для швидкого вимивання надлишкових солей'
    ],
    products: [
      {
        id: 'tripart-micro',
        name: 'TriPart Micro (GHE FloraMicro)',
        category: 'base',
        categoryLabelUk: 'Основа з мікроелементами',
        npk: '5-0-1',
        descriptionUk: 'Основа 3-компонентної формули з азотом, калієм та повним спектром хелатованих мікроелементів (EDDHA, DPTA).',
        dosageGuide: '0.5 - 3 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Постійне джерело кальцію, заліза та мікроелементів.'
      },
      {
        id: 'tripart-grow',
        name: 'TriPart Grow (GHE FloraGrow)',
        category: 'base',
        categoryLabelUk: 'Азотно-калійний стимулятор росту',
        npk: '3-1-6',
        descriptionUk: 'Забезпечує структурний ріст пагонів та листя під час вегетативної стадії.',
        dosageGuide: '0.5 - 3 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Нарощування потужної біомаси.'
      },
      {
        id: 'tripart-bloom',
        name: 'TriPart Bloom (GHE FloraBloom)',
        category: 'base',
        categoryLabelUk: 'Фосфорно-калієва основа цвіту',
        npk: '0-5-4',
        descriptionUk: 'Постачає потрібний обсяг фосфору та магнію для закладення бутонів та росту коренів.',
        dosageGuide: '0.5 - 4 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Стимуляція цвітіння та міцного здоровʼя кореневої системи.'
      },
      {
        id: 'finalpart-ripen',
        name: 'FinalPart (Легендарний Ripen)',
        category: 'bloom',
        categoryLabelUk: 'Фінішний стимулятор дозрівання',
        npk: '0-6-5 + 5% Mg + 2.5% S',
        descriptionUk: 'Подає рослині сигнал про завершення життєвого циклу, активізуючи скидання всіх ресурсів у суцвіття.',
        dosageGuide: '4 - 5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['late_bloom'],
        bestUsedForUk: 'Прискорення дозрівання на 10-14 днів та збільшення активних речовин.'
      },
      {
        id: 'flashclean',
        name: 'FlashClean (ex. FloraKleen)',
        category: 'flushing',
        categoryLabelUk: 'Промивка та розблокування солей',
        descriptionUk: 'Унікальний агент для очищення субстрату та гідропонних систем від сольового осаду без стресу для рослини.',
        dosageGuide: '1.5 - 3 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Термінова допомога при перегодовуванні та фінальна промивка перед збором.'
      },
      {
        id: 'ta-roots-booster',
        name: 'Roots Booster (ex. GO Bio Roots)',
        category: 'root',
        categoryLabelUk: '100% Органічний активатор коріння',
        descriptionUk: 'Природний кореневий активатор, що стимулює розвиток мікроорганізмів у ризосфері.',
        dosageGuide: '0.2 - 0.5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Швидкий старт розсади та зміцнення кореневих кінчиків.'
      },
      {
        id: 'ta-silicate',
        name: 'Silicate (ex. Mineral Magic)',
        category: 'silica',
        categoryLabelUk: 'Натуральний силікатний порошок',
        descriptionUk: 'Містить стародавні відкладення морської глини та розчинний кремній, стабілізує pH і захищає від гнилей.',
        dosageGuide: '4 г на 10 л води або присипка в ґрунт',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Стабілізація електропровідності та захист від кореневої гнилі.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'athena',
    name: 'Athena Nutrients',
    country: 'США',
    countryFlag: '🇺🇸',
    foundedYear: 2018,
    logoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🚀 #10 GrowDiaries (1,950+ врожаїв • 11 продуктів)',
    categoryType: 'Mineral',
    rating: 4.9,
    growDiariesRating: 9.5,
    growReportsCount: 1950,
    growDiariesProductsCount: 11,
    headquarters: 'Los Angeles, California, USA',
    shortBioUk: 'Найшвидше зростаючий бренд комерційного та домашнього гровінгу в США з акцентом на ультрачисті розчини без осаду.',
    fullDescriptionUk: 'Athena розроблена професійними гроверами Лос-Анджелеса. Вони відмовились від зайвих добавок і створили чисту, стабільну формулу (Grow, Bloom, Cleanse, CaMg, Stack, Fade), яка забезпечує камʼяну щільність суцвіть під потужними LED.',
    partnerPlan: {
      tier: 'premium_cabinet',
      isOfficialPartner: true,
      websiteUrl: 'https://www.athenaproducts.com',
      promoCode: 'ATHENA_UKRAINE',
      discountPercent: 15,
      contactEmail: 'support@athenaproducts.com'
    },
    keyAdvantagesUk: [
      'Мінімальна кількість пляшок — максимальна ефективність та повторюваність',
      'Cleanse на основі хлорнуватистої кислоти захищає коріння та крапельниці від біоплівки',
      'Найкращі показники розчинності без жодного осаду в баках поливу',
      'Fade — безнітратна формула промивки для збереження терпенів'
    ],
    products: [
      {
        id: 'athena-grow-ab',
        name: 'Athena Blended Grow A+B',
        category: 'base',
        categoryLabelUk: 'База Вегетації',
        descriptionUk: 'Проста та надчиста рідка формула для вегетативної фази з оптимальним співвідношенням нітратного азоту.',
        dosageGuide: '2 - 5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Інтенсивний ріст без міжвузлового витягування.'
      },
      {
        id: 'athena-bloom-ab',
        name: 'Athena Blended Bloom A+B',
        category: 'base',
        categoryLabelUk: 'База Цвітіння',
        descriptionUk: 'Оптимізована під високі показники PPFD формула цвітіння для потужного збільшення ваги.',
        dosageGuide: '3 - 6 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Тверді як камінь суцвіття на потужному освітленні.'
      },
      {
        id: 'athena-cleanse',
        name: 'Athena Cleanse',
        category: 'ph_control',
        categoryLabelUk: 'Захист коренів & Очищення (HOCl)',
        descriptionUk: 'Хлорнуватиста кислота (HOCl) безпечно усуває патогени, мінеральні солі та стимулює здоровʼя ризосфери.',
        dosageGuide: '0.5 - 1.5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Запобігання пітіуму (Pythium) та підтримка білосніжного коріння.'
      },
      {
        id: 'athena-stack',
        name: 'Athena Stack',
        category: 'booster',
        categoryLabelUk: 'Біо-стимулятор з екстракту бурих водоростей',
        descriptionUk: 'Натуральний рослинний екстракт келп, що стимулює поділ клітин, закладення суцвіть та знімає стрес.',
        dosageGuide: '1 - 2 мл/л (полив або по листу)',
        targetMedium: 'All',
        recommendedStages: ['vegetative', 'early_bloom'],
        bestUsedForUk: 'Закладення більшої кількості бутонів під час переходу на цвітіння.'
      },
      {
        id: 'athena-fade',
        name: 'Athena Fade',
        category: 'flushing',
        categoryLabelUk: 'Безнітратна формула дозрівання',
        descriptionUk: 'Замінює базу Bloom в останні 3 тижні цвітіння. Повністю прибирає азот, змушуючи шишки спалювати залишковий хлорофіл.',
        dosageGuide: '4 - 7 мл/л',
        targetMedium: 'All',
        recommendedStages: ['late_bloom', 'flush'],
        bestUsedForUk: 'Чистіший смак, яскраві осінні кольори листя та ідеальний білий попіл.'
      },
      {
        id: 'athena-camg',
        name: 'Athena CaMg',
        category: 'calmag',
        categoryLabelUk: 'Коректор Кальцій / Магній',
        descriptionUk: 'Очищений комплекс кальцію та магнію, створений для доповнення лінійки Blended на осмотичній воді.',
        dosageGuide: '0.5 - 1.5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Підтримка ідеального балансу Cal-Mag на кокосі під LED.'
      },
      {
        id: 'athena-balance',
        name: 'Athena Balance',
        category: 'silica',
        categoryLabelUk: 'Кремнієвий буфер pH',
        descriptionUk: 'Силікат калію та деіонизована вода. Підвищує стійкість до стресів і стабілізує розчин.',
        dosageGuide: '0.5 - 1.0 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Зміцнення стовбурів і захист від коливань температури.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'plagron',
    name: 'Plagron',
    country: 'Нідерланди',
    countryFlag: '🇳🇱',
    foundedYear: 1992,
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
    badgeTag: '👑 #5 GrowDiaries (4,222+ врожаїв • 30 продуктів)',
    categoryType: 'Bio-Mineral',
    rating: 4.8,
    growDiariesRating: 9.3,
    growReportsCount: 4222,
    growDiariesProductsCount: 30,
    headquarters: 'Ospel, Netherlands',
    shortBioUk: 'Провідний виробник субстратів (Batmix, Royalmix) та добрив із культовим 4-в-1 стимулятором Green Sensation.',
    fullDescriptionUk: 'Plagron пропонує рішення як для фанатів 100% органіки (Alga Grow/Bloom), так і для мінерального швидкого росту (Terra Grow/Bloom, Coco, Hydro). Їхній стимулятор Green Sensation визнаний одним із найкращих бустерів у світі.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.plagron.com',
      promoCode: 'PLAGRON_GROW'
    },
    keyAdvantagesUk: [
      'Культовий бустер Green Sensation 4-в-1 (замінює PK, ензими, бустер цукрів та імуностимулятор)',
      'Преміальні субстрати Batmix з гуано кажанів',
      'Sugar Royal для шаленого виділення трихом та терпенів'
    ],
    products: [
      {
        id: 'green-sensation',
        name: 'Plagron Green Sensation',
        category: 'bloom',
        categoryLabelUk: '4-в-1 Преміум Бустер Цвітіння',
        npk: '0-9-10',
        descriptionUk: 'Підсилювач цвітіння, що одночасно покращує смак, підвищує імунітет, додає фосфор/калій та стимулює вироблення цукру.',
        dosageGuide: '1 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Максимальний врожай, щільність та цукристість суцвіть на останніх 4-6 тижнях.'
      },
      {
        id: 'sugar-royal',
        name: 'Plagron Sugar Royal',
        category: 'terpenes',
        categoryLabelUk: 'Стимулятор смоли та трихом',
        npk: '9-0-0',
        descriptionUk: 'Органічний стимулятор на основі амінокислот, що викликає контрольований стрес посухи для захисного виділення трихом.',
        dosageGuide: '1 - 2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['vegetative', 'early_bloom', 'late_bloom'],
        bestUsedForUk: 'Шалена кількість білих трихом та скорочення часу дозрівання.'
      },
      {
        id: 'power-roots',
        name: 'Plagron Power Roots',
        category: 'root',
        categoryLabelUk: 'Органічний кореневий стимулятор',
        npk: '0.7-0.5-0.9',
        descriptionUk: 'Містить екстракт морських водоростей та вітаміни для швидкого розгалуження корінців.',
        dosageGuide: '1 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Стресостійкість після пересадки та швидке освоєння горщика.'
      },
      {
        id: 'pure-zym',
        name: 'Plagron Pure Zym',
        category: 'enzymes',
        categoryLabelUk: 'Ферменти для ґрунту та кокосу',
        descriptionUk: 'Прискорює розкладання мертвого рослинного матеріалу і перетворює його на додаткові поживні елементи.',
        dosageGuide: '1 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Запобігання закисанню субстрату.'
      },
      {
        id: 'plagron-terra-grow',
        name: 'Plagron Terra Grow',
        category: 'base',
        categoryLabelUk: 'Мінеральна база Вегетації',
        npk: '3-1-3',
        descriptionUk: 'Висококонцентроване мінеральне добриво для фази росту в ґрунті.',
        dosageGuide: '2 - 5 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['vegetative'],
        bestUsedForUk: 'Швидкий набір вегетативної маси.'
      },
      {
        id: 'plagron-terra-bloom',
        name: 'Plagron Terra Bloom',
        category: 'base',
        categoryLabelUk: 'Мінеральна база Цвітіння',
        npk: '2-2-4',
        descriptionUk: 'Мінеральне рідке добриво для рясного цвітіння в ґрунті.',
        dosageGuide: '3 - 5 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Повноцінне живлення бутонів.'
      },
      {
        id: 'plagron-alga-bloom',
        name: 'Plagron Alga Bloom (100% BIO)',
        category: 'base',
        categoryLabelUk: '100% Органічне цвітіння на водоростях',
        npk: '3-2-5',
        descriptionUk: 'Органічне рідке добриво на основі водоростей для вирощування в органічному ґрунті.',
        dosageGuide: '2 - 4 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Органічне чисте цвітіння.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'green-house-feeding',
    name: 'Green House Feeding (GHF)',
    country: 'Нідерланди',
    countryFlag: '🇳🇱',
    foundedYear: 2012,
    logoUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=150&q=80',
    badgeTag: '💎 #8 GrowDiaries (2,800+ врожаїв • 9 продуктів)',
    categoryType: 'Mineral',
    rating: 4.8,
    growDiariesRating: 9.3,
    growReportsCount: 2800,
    growDiariesProductsCount: 9,
    headquarters: 'Amsterdam, Netherlands',
    shortBioUk: 'Підрозділ культового сідбанку Green House Seeds. Світові експерти у водорозчинних порошкових концентратах.',
    fullDescriptionUk: 'GHF створив революційну систему порошкових мінеральних та органічних добрив, адаптованих під генетику сорту: Short Flowering (індика), Long Flowering (сатіва), Hybrids (гібриди) та лінійку 100% Bio.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.greenhousefeeding.com',
      promoCode: 'GHF_COMMUNITY'
    },
    keyAdvantagesUk: [
      'Порошкова форма: ви платите за діючу речовину, а не за воду в пляшках',
      'Спеціальні формули під індику, сатіву та гібриди',
      'Просте дозування в грамах на літр води'
    ],
    products: [
      {
        id: 'ghf-short-flowering',
        name: 'Feeding Short Flowering',
        category: 'base',
        categoryLabelUk: 'Для скороквітучих та Індики',
        npk: '16-6-26',
        descriptionUk: 'Спеціально розроблено для сортів із періодом цвітіння до 8-9 тижнів та автоквітів.',
        dosageGuide: '0.5 - 1.5 г/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Швидкі індико-домінантні сорти та автоквіти.'
      },
      {
        id: 'ghf-hybrids',
        name: 'Feeding Hybrids',
        category: 'base',
        categoryLabelUk: 'Для збалансованих Гібридів',
        npk: '15-7-22',
        descriptionUk: 'Оптимальний баланс для гібридних сортів із періодом цвітіння 8–10 тижнів.',
        dosageGuide: '0.5 - 1.5 г/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Гібридні стрени середнього терміну дозрівання.'
      },
      {
        id: 'ghf-grow',
        name: 'Feeding Grow',
        category: 'base',
        categoryLabelUk: 'Для маточних кущів та вегетації',
        npk: '24-6-12',
        descriptionUk: 'Високий вміст азоту для клонів, саджанців та активного нарощування гілок.',
        dosageGuide: '0.5 - 1.0 г/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Вегетація та тривале утримання материнських рослин.'
      },
      {
        id: 'ghf-booster-pk',
        name: 'Feeding Booster PK+',
        category: 'bloom',
        categoryLabelUk: 'Порошковий PK + Магній',
        npk: '0-30-27 + 9% Mg',
        descriptionUk: 'Потужний розчинний концентрат фосфору, калію та магнію для вибухового росту шишок.',
        dosageGuide: '0.2 - 0.5 г/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Додаткове фосфорно-калієве живлення на цвітінні.'
      },
      {
        id: 'ghf-bio-grow',
        name: 'BioGrow (100% Органічний порошок в ґрунт)',
        category: 'base',
        categoryLabelUk: 'Сухе органічне добриво веги',
        npk: '7-2-4',
        descriptionUk: 'Суміш природних мінералів та органічних компонентів, що повільно живлять ґрунт протягом 8 тижнів.',
        dosageGuide: '3 - 5 г на літр субстрату',
        targetMedium: 'Soil',
        recommendedStages: ['vegetative'],
        bestUsedForUk: 'Органічне вирощування без рідких добрив.'
      },
      {
        id: 'ghf-bio-bloom',
        name: 'BioBloom (100% Органічний порошок цвіту)',
        category: 'base',
        categoryLabelUk: 'Сухе органічне добриво цвітіння',
        npk: '4-9-9',
        descriptionUk: 'Органічний порошок для поверхневого внесення (Top-dress) на цвітінні.',
        dosageGuide: '3 г на літр субстрату',
        targetMedium: 'Soil',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Забезпечення фосфором та калієм на весь період цвітіння.'
      },
      {
        id: 'ghf-bio-enhancer',
        name: 'BioEnhancer (Гумати, Водорості & Триходерма)',
        category: 'microbes',
        categoryLabelUk: 'Біо-активатор та ґрунтові гриби',
        descriptionUk: 'Водорозчинні гумінові кислоти, екстракт водоростей та спори Trichoderma harzianum.',
        dosageGuide: '0.5 - 1.0 г/л (кожні 2 тижні)',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Поліпшення структури ґрунту та захист від кореневих патогенів.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'biotabs',
    name: 'BioTabs Organic',
    country: 'Нідерланди',
    countryFlag: '🇳🇱',
    foundedYear: 2011,
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
    badgeTag: '💊 #11 GrowDiaries (1,420+ врожаїв • 10 продуктів)',
    categoryType: 'Organic',
    rating: 4.9,
    growDiariesRating: 9.3,
    growReportsCount: 1420,
    growDiariesProductsCount: 10,
    headquarters: 'Haarlem, Netherlands',
    shortBioUk: 'Революційний метод повільного вивільнення. Вставляєте таблетки в горщик і поливаєте тільки чистою водою без вимірювання pH/PPM.',
    fullDescriptionUk: 'BioTabs використовує симбіотичні ґрунтові мікоризні гриби та бактерії (Bactrex, Mycotrex, Startrex) разом зі спресованими повільнорозчинними таблетками NPK. Бактерії самі годують рослину за запитом коренів.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.biotabs.nl',
      promoCode: 'BIOTABS_EASY'
    },
    keyAdvantagesUk: [
      'Полив лише чистою водою без вимірювання pH та EC',
      'Ідеально для автополиву типу AutoPot',
      '100% природний солодкий смак та медична чистота шишок'
    ],
    products: [
      {
        id: 'biotabs-tablets',
        name: 'BioTabs Slow-Release Tablets',
        category: 'base',
        categoryLabelUk: 'Таблетки повільного вивільнення NPK',
        npk: '12-9-9',
        descriptionUk: 'Спресовані таблетки з органічним кістковим, кровʼяним борошном та корисними бактеріями.',
        dosageGuide: '1-2 таблетки на 10-15 л горщик',
        targetMedium: 'Soil',
        recommendedStages: ['all'],
        bestUsedForUk: 'Повне забезпечення базовим живленням на весь цикл від насінини до харвесту.'
      },
      {
        id: 'biotabs-startrex',
        name: 'Startrex',
        category: 'microbes',
        categoryLabelUk: 'Органічний кондиціонер субстрату',
        descriptionUk: 'Багатий на гумінові кислоти та ґрунтові бактерії субстратний кондиціонер для швидкого старту.',
        dosageGuide: '25 г на кожні 5 л субстрату',
        targetMedium: 'Soil',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Підготовка ґрунту або кокосу перед посадкою.'
      },
      {
        id: 'biotabs-mycotrex',
        name: 'Mycotrex',
        category: 'microbes',
        categoryLabelUk: 'Комплекс 9 видів мікоризи',
        descriptionUk: 'Збільшує обʼєм кореневої системи на 700%, покращує поглинання води та фосфору.',
        dosageGuide: '5 г у лунку при пересадці',
        targetMedium: 'Soil',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Прямий контакт з корінням при посадці.'
      },
      {
        id: 'biotabs-bactrex',
        name: 'Bactrex',
        category: 'microbes',
        categoryLabelUk: 'Корисні бактерії ризосфери та триходерма',
        descriptionUk: 'Захищає коріння від кореневих гнилей і перетворює органіку на доступні іони живлення.',
        dosageGuide: '1 г на 1 л води (1 раз на місяць)',
        targetMedium: 'Soil',
        recommendedStages: ['all'],
        bestUsedForUk: 'Підтримка активності ґрунтової біоти.'
      },
      {
        id: 'biotabs-orgatrex',
        name: 'Orgatrex Liquid',
        category: 'base',
        categoryLabelUk: 'Рідкий органічний прискорювач',
        npk: '5-1-5',
        descriptionUk: 'Органічне рідке добриво та живлення для мікоризи під час цвітіння.',
        dosageGuide: '2 мл/л води',
        targetMedium: 'Soil',
        recommendedStages: ['all'],
        bestUsedForUk: 'Додатковий органічний сплеск калію та мікроелементів на 5 тижні.'
      },
      {
        id: 'biotabs-boom-boom',
        name: 'Boom Boom Spray',
        category: 'foliar',
        categoryLabelUk: '100% Органічний спрей антистрес',
        descriptionUk: 'Містить 57% рослинних амінокислот. Швидко знімає стрес від холоду, спеки чи пересадки.',
        dosageGuide: '5 мл на 1 л води (по листу)',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Миттєве відновлення після шоку.'
      },
      {
        id: 'biotabs-bio-pk',
        name: 'Bio PK 5-8',
        category: 'bloom',
        categoryLabelUk: 'Органічний бустер цвітіння',
        npk: '2-5-8',
        descriptionUk: 'Органічний фосфорно-калієвий бустер з морськими водоростями, вітамінами та ауксинами.',
        dosageGuide: '1 - 3 мл/л на 3-6 тижнях цвіту',
        targetMedium: 'Soil',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Збільшення розміру та аромату шишок.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'aptus',
    name: 'Aptus Plant Tech',
    country: 'Нідерланди',
    countryFlag: '🇳🇱',
    foundedYear: 2008,
    logoUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🔬 #12 GrowDiaries (1,180+ врожаїв • 14 продуктів)',
    categoryType: 'Specialized',
    rating: 4.9,
    growDiariesRating: 9.4,
    growReportsCount: 1180,
    growDiariesProductsCount: 14,
    headquarters: 'Wateringen, Netherlands',
    shortBioUk: 'Преміум голландська біотехнологічна лабораторія. Їхній препарат Regulator на основі мономерної кремнієвої кислоти захищає рослини при спеці до 40°C.',
    fullDescriptionUk: 'Aptus створює ультраконцентровані бустери (дозування 1:10000). Їхня продукція повністю сумісна з будь-якими базовими добривами інших виробників для суттєвого підвищення врожайності.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.aptus-holland.com',
      promoCode: 'APTUS_TECH'
    },
    keyAdvantagesUk: [
      'Regulator робить рослину стійкою до спеки, посухи та шкідників',
      'Екстремальна концентрація (вистачає 1.5 мл на 10 л води)',
      'Покращує засвоєння будь-яких базових добрив на 30–50%'
    ],
    products: [
      {
        id: 'aptus-regulator',
        name: 'Aptus Regulator',
        category: 'silica',
        categoryLabelUk: 'Мономерна Кремнієва Кислота (Si)',
        descriptionUk: 'Запатентована біодоступна форма кремнію. Потовщує клітинні стінки, робить стебла як дерево та контролює транспірацію.',
        dosageGuide: '1.5 мл на 10 л води (0.15 мл/л)',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Захист від перегріву вище 28°C, товсті гілки для важких шишок.'
      },
      {
        id: 'aptus-startbooster',
        name: 'Aptus Startbooster',
        category: 'root',
        categoryLabelUk: 'Кореневий та вегетативний біостимулятор',
        descriptionUk: 'Органічний концентрат L-амінокислот, гумінових кислот та бактерій для потужного розвитку коренів.',
        dosageGuide: '2.5 мл на 10 л води (0.25 мл/л)',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Стрімкий старт і біле розгалужене коріння.'
      },
      {
        id: 'aptus-topbooster',
        name: 'Aptus Topbooster',
        category: 'bloom',
        categoryLabelUk: '100% Органічний стимулятор цвітіння',
        descriptionUk: 'Стимулює перехід до цвітіння, активізує фотосинтез і налив суцвіть.',
        dosageGuide: '2 мл на 10 л води (0.2 мл/л)',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Збільшення вмісту клітковини та маси суцвіть.'
      },
      {
        id: 'aptus-super-pk',
        name: 'Aptus Super-PK',
        category: 'bloom',
        categoryLabelUk: 'Ультраконцентрат PK 20/25',
        npk: '0-20-25',
        descriptionUk: 'Один із найпотужніших PK бустерів у світі з високим вмістом сірки та магнію.',
        dosageGuide: '2.5 - 5 мл на 10 л води (0.25 - 0.5 мл/л)',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Шоковий набір ваги та щільності суцвіть.'
      },
      {
        id: 'aptus-k-boost',
        name: 'Aptus K-Boost',
        category: 'bloom',
        categoryLabelUk: 'Фінішний Калієвий Бустер',
        npk: '5-0-20',
        descriptionUk: 'Органічний концентрат калію та L-амінокислот для фінального дозрівання.',
        dosageGuide: '3 - 5 мл на 10 л води',
        targetMedium: 'All',
        recommendedStages: ['late_bloom'],
        bestUsedForUk: 'Фінальне ущільнення шишок перед збором.'
      },
      {
        id: 'aptus-camg-boost',
        name: 'Aptus CaMg-Boost',
        category: 'calmag',
        categoryLabelUk: 'Хелатний Органо-Мінеральний Cal-Mag',
        descriptionUk: 'Хелатовані форми кальцію та магнію, збагачені L-амінокислотами, не блокують фосфор у розчині.',
        dosageGuide: '2.5 - 5 мл на 10 л води',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Ідеальний кальцій без ризику випадання в осад.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'hesi',
    name: 'Hesi Plant Nutrition',
    country: 'Нідерланди',
    countryFlag: '🇳🇱',
    foundedYear: 1996,
    logoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🧪 #9 GrowDiaries (2,450+ врожаїв • 14 продуктів)',
    categoryType: 'Bio-Mineral',
    rating: 4.7,
    growDiariesRating: 9.2,
    growReportsCount: 2450,
    growDiariesProductsCount: 14,
    headquarters: 'Roermond, Netherlands',
    shortBioUk: 'Голландська класика з вітамінним комплексом SuperVit, де 1 крапля оживляє 4.5 л води.',
    fullDescriptionUk: 'Hesi відомий своїм мʼяким підходом до живлення рослин та використанням комплексонів (хелатів), що роблять pH розчину стабільним без агресивних коливань.',
    partnerPlan: {
      tier: 'free',
      isOfficialPartner: false,
      websiteUrl: 'https://www.hesi.nl'
    },
    keyAdvantagesUk: [
      'SuperVit містить 25 рослинних вітамінів та амінокислот',
      'TNT Complex містить органічний азот, який не викликає пересолу',
      'Дуже доступна ціна та простота для першого грову'
    ],
    products: [
      {
        id: 'hesi-supervit',
        name: 'Hesi SuperVit',
        category: 'terpenes',
        categoryLabelUk: 'Вітамінний концентрат 25-в-1',
        descriptionUk: 'Висококонцентрована суміш 15 вітамінів і 10 амінокислот. Енергетичний стимулятор клітинного метаболізму.',
        dosageGuide: '1 крапля на 4.5 л води (або 1 мл на 65 л)',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Зміцнення імунітету, швидкий метаболізм, насичений зелений колір листя.'
      },
      {
        id: 'hesi-tnt-complex',
        name: 'Hesi TNT Complex',
        category: 'base',
        categoryLabelUk: 'Органо-мінеральна вегетація',
        npk: '3-2-3',
        descriptionUk: 'Містить 100% органічний азот, який легко засвоюється навіть молодими рослинами без сольового стресу.',
        dosageGuide: '2.5 - 5 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Пишний вегетативний ріст без підвищення EC.'
      },
      {
        id: 'hesi-bloom-complex',
        name: 'Hesi Bloom Complex',
        category: 'base',
        categoryLabelUk: 'База Цвітіння для Ґрунту',
        npk: '3-3-4',
        descriptionUk: 'Збагачене залізом, магнієм та амінокислотами добриво для рясного цвітіння.',
        dosageGuide: '5 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Основне живлення у ґрунті на цвітінні.'
      },
      {
        id: 'hesi-phosphor-plus',
        name: 'Hesi Phosphor Plus',
        category: 'bloom',
        categoryLabelUk: 'Додатковий PK для ґрунту',
        npk: '0-9-7',
        descriptionUk: 'Додаткове фосфорно-калієве підживлення з другої половини цвітіння.',
        dosageGuide: '2.5 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Ущільнення шишок у другій половині цвіту.'
      },
      {
        id: 'hesi-root-complex',
        name: 'Hesi Root Complex',
        category: 'root',
        categoryLabelUk: 'Стимулятор коренів без солей',
        descriptionUk: 'Еліксир для коренів з мікроелементами та рослинними цукрами.',
        dosageGuide: '5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Швидке розростання коренів.'
      },
      {
        id: 'hesi-boost',
        name: 'Hesi Boost',
        category: 'bloom',
        categoryLabelUk: 'Органічний прискорювач цвітіння',
        descriptionUk: 'Фруктові ензими та рослинні екстракти роблять суцвіття солодшими та важчими.',
        dosageGuide: '1 - 2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Посилення цукристості та аромату.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'fox-farm',
    name: 'FoxFarm Soil & Hydroponics',
    country: 'США',
    countryFlag: '🇺🇸',
    foundedYear: 1984,
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🦊 #6 GrowDiaries (3,550+ врожаїв • 46 продуктів)',
    categoryType: 'Bio-Mineral',
    rating: 4.8,
    growDiariesRating: 9.1,
    growReportsCount: 3550,
    growDiariesProductsCount: 46,
    headquarters: 'Samoa, California, USA',
    shortBioUk: 'Легендарний каліфорнійський бренд субстратів (Ocean Forest, Happy Frog) та культового рідкого живлення Trio.',
    fullDescriptionUk: 'FoxFarm з Каліфорнії є одним з найулюбленіших брендів американських гроверів завдяки поєднанню органічних витяжок норвезьких водоростей, дощових червʼяків та мінеральних солей високої чистоти.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.foxfarm.com'
    },
    keyAdvantagesUk: [
      'Культове тріо рідких добрив (Grow Big, Big Bloom, Tiger Bloom)',
      'Потужні порошкові бустери цвітіння (Open Sesame, Beastie Bloomz, Cha Ching)',
      'Промивка Sledgehammer для вимивання накопичених солей'
    ],
    products: [
      {
        id: 'foxfarm-big-bloom',
        name: 'FoxFarm Big Bloom Liquid',
        category: 'base',
        categoryLabelUk: '100% Органічна витяжка водоростей та гуано',
        npk: '0.01-0.3-0.7',
        descriptionUk: 'Органічний настій з гуано кажанів, біогумусу та ламінарії для насиченого аромату.',
        dosageGuide: '2 - 5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Підтримка мікробіоти та покращення смакових якостей.'
      },
      {
        id: 'foxfarm-grow-big',
        name: 'FoxFarm Grow Big',
        category: 'base',
        categoryLabelUk: 'Концентрат вегетації',
        npk: '6-4-4',
        descriptionUk: 'Швидкодіюче добриво для міцних стебел та соковитого зеленого листя.',
        dosageGuide: '2 - 3 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Швидкий ріст рослини на везі.'
      },
      {
        id: 'foxfarm-tiger-bloom',
        name: 'FoxFarm Tiger Bloom',
        category: 'bloom',
        categoryLabelUk: 'Ударний бустер цвітіння',
        npk: '2-8-4',
        descriptionUk: 'Потужне фосфорне добриво з мікроелементами для закладки великих суцвіть.',
        dosageGuide: '2 - 3 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Формування масивних шишок.'
      },
      {
        id: 'foxfarm-cha-ching',
        name: 'FoxFarm Cha Ching',
        category: 'bloom',
        categoryLabelUk: 'Фінішний бустер смоли та ваги',
        npk: '9-50-10',
        descriptionUk: 'Висококонцентрований порошок для останніх тижнів цвітіння для набору екстремальної маси.',
        dosageGuide: '0.3 - 0.5 г/л',
        targetMedium: 'All',
        recommendedStages: ['late_bloom'],
        bestUsedForUk: 'Максимальний вміст канабіноїдів та терпеноїдів.'
      },
      {
        id: 'foxfarm-sledgehammer',
        name: 'FoxFarm Sledgehammer',
        category: 'flushing',
        categoryLabelUk: 'Органічний екстракт Юкки (Промивка)',
        descriptionUk: 'Природний екстракт Yucca schidigera для розмʼякшення субстрату та вимивання надлишкових солей.',
        dosageGuide: '1 - 2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Покращення водопроникності та фінальний флеш.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'botanicare',
    name: 'Botanicare Nutrients',
    country: 'США',
    countryFlag: '🇺🇸',
    foundedYear: 1996,
    logoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🌿 #7 GrowDiaries (3,070+ врожаїв • 33 продукти)',
    categoryType: 'Bio-Mineral',
    rating: 4.8,
    growDiariesRating: 9.3,
    growReportsCount: 3070,
    growDiariesProductsCount: 33,
    headquarters: 'Chandler, Arizona, USA',
    shortBioUk: 'Творці оригінального легендарного Cal-Mag Plus, Hydroguard та органічної біо-мінеральної серії Pure Blend Pro.',
    fullDescriptionUk: 'Botanicare з Арізони розробив золотий стандарт добавок для гідропоніки та кокосу. Їхній препарат Hydroguard є найвідомішим засобом у світі для захисту гідропонних коренів від кореневої гнилі (Pythium).',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.botanicare.com',
      promoCode: 'BOTANICARE_USA',
      discountPercent: 10
    },
    keyAdvantagesUk: [
      'Легендарний оригінальний Cal-Mag Plus, створений у 1996 році',
      'Hydroguard — золотий стандарт бактеріального захисту коренів у гідропоніці',
      'Органічно-мінеральна серія Pure Blend Pro для преміального смаку та врожайності',
      'Лінійка CNS17 для високопродуктивних комерційних систем'
    ],
    products: [
      {
        id: 'botanicare-cal-mag-plus',
        name: 'Botanicare Cal-Mag Plus',
        category: 'calmag',
        categoryLabelUk: 'Оригінальний кальцієво-магнієвий коректор + залізо',
        npk: '2-0-0 + 3.2% Ca + 1.2% Mg + 0.1% Fe',
        descriptionUk: 'Культова добавка, розроблена для усунення дефіциту кальцію, магнію та заліза при використанні осмосу або кокосу.',
        dosageGuide: '1 - 2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Профілактика некрозу листя та вершинної гнилі при потужному LED-освітленні.'
      },
      {
        id: 'botanicare-hydroguard',
        name: 'Botanicare Hydroguard (Root Inoculant)',
        category: 'microbes',
        categoryLabelUk: 'Бактеріальний біозахист коренів (Bacillus amyloliquefaciens)',
        descriptionUk: 'Високоефективний ізолят корисних бактерій, який ізолює та розщеплює відмерлу органіку в ризосфері, запобігаючи Pythium.',
        dosageGuide: '0.5 мл/л (2 мл на галон)',
        targetMedium: 'Hydro',
        recommendedStages: ['all'],
        bestUsedForUk: 'Кришталево чисте біле коріння в DWC, RDWC та крапельному поливі без гнилей.'
      },
      {
        id: 'botanicare-pure-blend-grow',
        name: 'Pure Blend Pro Grow',
        category: 'base',
        categoryLabelUk: 'Біо-органічна база вегетації',
        npk: '3-2-4',
        descriptionUk: 'Органо-мінеральне рідке добриво з екстрактами водоростей, рибного борошна та гумінових кислот для пишного росту.',
        dosageGuide: '2 - 4 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Здоровий, швидкий ріст рослин з насиченим смаком.'
      },
      {
        id: 'botanicare-pure-blend-bloom-soil',
        name: 'Pure Blend Pro Bloom (Soil)',
        category: 'base',
        categoryLabelUk: 'Біо-органічна база цвітіння для ґрунту',
        npk: '1-4-5',
        descriptionUk: 'Спеціально збалансоване для ґрунтових сумішей органічно-мінеральне добриво цвітіння.',
        dosageGuide: '3 - 5 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Формування щільних суцвіть із природним солодким смаком.'
      },
      {
        id: 'botanicare-liquid-karma',
        name: 'Liquid Karma (Bio-Catalyst)',
        category: 'booster',
        categoryLabelUk: 'Біо-каталізатор метаболізму',
        npk: '0.1-0.1-0.5',
        descriptionUk: 'Потужний біологічний активатор на основі ферментованого компосту, водоростей, амінокислот та вітамінів групи B.',
        dosageGuide: '2 - 4 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Зняття стресу, прискорення засвоєння добрив та стимуляція росту коренів.'
      },
      {
        id: 'botanicare-silica-blast',
        name: 'Silica Blast',
        category: 'silica',
        categoryLabelUk: 'Кремнієвий зміцнювач клітин (Silicate)',
        npk: '0-0-0.5 + 2% Силікат',
        descriptionUk: 'Зміцнює клітинні стінки, допомагає рослині утримувати важкі суцвіття та витримувати екстремальні температури.',
        dosageGuide: '0.5 - 1.0 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Товсті міцні гілки та стійкість до літньої спеки.'
      },
      {
        id: 'botanicare-sweet-raw',
        name: 'Sweet Raw Carbohydrate Synthesizer',
        category: 'terpenes',
        categoryLabelUk: 'Комплекс вуглеводів та мікроелементів',
        descriptionUk: 'Підсилювач синтезу цукрів і терпенів, покращує щільність шишок і не змінює смаковий профіль сорту.',
        dosageGuide: '2 - 3 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Максимальне вироблення смоли без сторонніх присмаків.'
      },
      {
        id: 'botanicare-clearex',
        name: 'Clearex Salt Leaching Solution',
        category: 'flushing',
        categoryLabelUk: 'Ізотонічний розчин для промивки солей',
        descriptionUk: 'Мʼяко розчиняє накопичені солі на коренях та в субстраті без гідростатичного шоку для рослини.',
        dosageGuide: '1 - 2 мл/л чистої води',
        targetMedium: 'All',
        recommendedStages: ['flush'],
        bestUsedForUk: 'Швидке виведення залишків добрив перед збором врожаю для бездоганного чистого смаку.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'remo-nutrients',
    name: 'Remo Nutrients',
    country: 'Канада',
    countryFlag: '🇨🇦',
    foundedYear: 2014,
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🍁 #13 GrowDiaries (1,150+ врожаїв • 12 продуктів)',
    categoryType: 'Mineral',
    rating: 4.8,
    growDiariesRating: 9.3,
    growReportsCount: 1150,
    growDiariesProductsCount: 12,
    headquarters: 'Maple Ridge, British Columbia, Canada',
    shortBioUk: 'Бренд легендарного канадського гровера UrbanRemo. Проста і надпотужна лінійка добрив фармацевтичної якості.',
    fullDescriptionUk: 'Remo Nutrients розроблений для максимальної простоти: базова трійка (Grow, Bloom, Micro) використовується в однакових легких пропорціях, а преміум-добавки VeloKelp та AstroFlower дають рекордні результати смолистості.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.remonutrients.com',
      promoCode: 'REMO_GROW',
      discountPercent: 10
    },
    keyAdvantagesUk: [
      'Використання виключно медичного класу фармацевтичних мінералів',
      'VeloKelp — легендарний екстракт морських водоростей холодного віджиму',
      'Прості та зрозумілі рівні дозування без складних перерахунків',
      'Ідеально для кокосу, гідропоніки та ґрунту'
    ],
    products: [
      {
        id: 'remo-micro',
        name: 'Remo Micro',
        category: 'base',
        categoryLabelUk: 'Базовий мікроелементний комплекс',
        npk: '3-0-1 + 3% Ca + Хелати Fe, B, Cu, Mn, Zn',
        descriptionUk: 'Основа живлення з кальцієм та хелатованими мікроелементами для швидкого засвоєння.',
        dosageGuide: '1.3 - 2.6 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Фундамент розчину на всіх фазах росту.'
      },
      {
        id: 'remo-grow',
        name: 'Remo Grow',
        category: 'base',
        categoryLabelUk: 'Базове добриво для вегетації',
        npk: '1-3-2',
        descriptionUk: 'Стимулює розвиток міцного стебла, листя та потужної кореневої системи.',
        dosageGuide: '1.3 - 2.6 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Швидкий старт та густа зелена маса.'
      },
      {
        id: 'remo-bloom',
        name: 'Remo Bloom',
        category: 'base',
        categoryLabelUk: 'Базове добриво для цвітіння',
        npk: '1-4-7',
        descriptionUk: 'Збагачене фосфором та калієм для вибухового формування бутонів.',
        dosageGuide: '1.3 - 2.6 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Максимальний розмір та щільність суцвіть.'
      },
      {
        id: 'remo-velokelp',
        name: 'Remo VeloKelp',
        category: 'booster',
        categoryLabelUk: 'Екстракт водоростей та вітамінний біостимулятор',
        npk: '1-1-1',
        descriptionUk: 'Формула з кількох видів морських водоростей та вітамінів B для зняття стресу та стимуляції коренів.',
        dosageGuide: '1.3 - 2.6 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Швидке укорінення живців, зняття пересадкового стресу та посилення метаболізму.'
      },
      {
        id: 'remo-astroflower',
        name: 'Remo AstroFlower',
        category: 'bloom',
        categoryLabelUk: 'Фосфорно-калієвий бустер цвітіння',
        npk: '0-6-11',
        descriptionUk: 'Спеціальний бустер цвітіння, який підсилює вироблення ефірних олій та терпенів.',
        dosageGuide: '1.3 - 2.6 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Важкі, смолисті та ароматні суцвіття.'
      },
      {
        id: 'remo-magnifical',
        name: 'Remo Magnifical',
        category: 'calmag',
        categoryLabelUk: 'Хелатований Cal-Mag з вітамінами',
        npk: '3-0-0 + 3% Ca + 1.1% Mg + Fe',
        descriptionUk: 'Суперчистий хелатований кальцій і магній, готовий до швидкого засвоєння клітинами рослини.',
        dosageGuide: '1.3 - 2.6 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Запобігання кальцієвому некрозу під світлодіодними панелями.'
      },
      {
        id: 'remo-natures-candy',
        name: 'Remo Natureʼs Candy',
        category: 'terpenes',
        categoryLabelUk: 'Вуглеводи, амінокислоти та живлення для мікробіоти',
        npk: '0-0-0 + 10+ видів цукрів',
        descriptionUk: 'Комплекс складних цукрів і амінокислот, що годує корисні ґрунтові бактерії та посилює аромат сорту.',
        dosageGuide: '1.3 - 2.6 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Солодкий смак, багатий терпеновий профіль та підтримка мікоризи.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'mills-nutrients',
    name: 'Mills Nutrients',
    country: 'Нідерланди / США',
    countryFlag: '🇳🇱',
    foundedYear: 2012,
    logoUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🇳🇱 #14 GrowDiaries (980+ врожаїв • 9 продуктів)',
    categoryType: 'Bio-Mineral',
    rating: 4.9,
    growDiariesRating: 9.4,
    growReportsCount: 980,
    growDiariesProductsCount: 9,
    headquarters: 'Aalsmeer, Netherlands',
    shortBioUk: 'Голландсько-американські піонери біо-мінерального живлення з культовим мономерним кремнієм Vitalize.',
    fullDescriptionUk: 'Mills Nutrients поєднує органічні біо-стимулятори з мінеральною чистотою. Їхня лінійка Basis A+B та кремній Vitalize забезпечують рекордну міцність пагонів, стійкість до стресів та неперевершену щільність врожаю.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.mills-nutrients.com',
      promoCode: 'MILLS_PRO',
      discountPercent: 10
    },
    keyAdvantagesUk: [
      'Vitalize — оригінальний стабілізований мономерний кремній від Rexil Agro BV',
      'Біо-мінеральна формула Basis A&B, однакова для вегетації та цвітіння',
      'Стимулятор C4 для раннього цвітіння та Ultimate PK для фінального набору ваги',
      'Знижує потребу в пестицидах завдяки потужному клітинному імунітету'
    ],
    products: [
      {
        id: 'mills-basis-a-b',
        name: 'Mills Basis A & Basis B',
        category: 'base',
        categoryLabelUk: 'Універсальна 2-компонентна база вега/цвіт',
        npk: 'A: 3-0-1 | B: 0-4-3',
        descriptionUk: 'Концентрована біо-мінеральна основа для всього життєвого циклу рослини на будь-якому субстраті.',
        dosageGuide: '1 - 4 мл/л кожного компонента',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Стабільне живлення без необхідності зміни базових пляшок.'
      },
      {
        id: 'mills-vitalize',
        name: 'Mills Vitalize (Silicon)',
        category: 'silica',
        categoryLabelUk: 'Стабілізована мономерна кремнієва кислота',
        npk: '0-0-0 + біодоступний Si',
        descriptionUk: 'Унікальна запатентована форма кремнію, що засвоюється в 1000 разів швидше за звичайні силікати.',
        dosageGuide: '0.1 - 0.2 мл/л (завжди додавати першим у воду!)',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Міцні стовбури, захист від посухи, холоду, плісняви та шкідників.'
      },
      {
        id: 'mills-start-r',
        name: 'Mills Start-R',
        category: 'microbes',
        categoryLabelUk: 'Органічний біостимулятор коренів та росту',
        npk: '0-0-0 + ауксини, вітаміни, гумати',
        descriptionUk: 'Потужний біостимулятор з двома формами азоту та рослинними гормонами для розвитку вторинних корінців.',
        dosageGuide: '1 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative', 'early_bloom'],
        bestUsedForUk: 'Вибуховий ріст білої кореневої маси та швидка вегетація.'
      },
      {
        id: 'mills-c4',
        name: 'Mills C4 (Bloom Enhancer)',
        category: 'bloom',
        categoryLabelUk: 'Органо-мінеральний активатор раннього цвітіння',
        npk: '0-4-3 + вуглеводи та мікроелементи',
        descriptionUk: 'Стимулює закладання максимальної кількості суцвіть та запускає вироблення смоли.',
        dosageGuide: '0.5 - 1.5 мл/л (тижні 2-4 цвітіння)',
        targetMedium: 'All',
        recommendedStages: ['early_bloom'],
        bestUsedForUk: 'Короткі міжвузля та велика кількість бутонів.'
      },
      {
        id: 'mills-ultimate-pk',
        name: 'Mills Ultimate PK',
        category: 'bloom',
        categoryLabelUk: 'Глибокоочищений фосфорно-калієвий фінішер',
        npk: '0-7-6',
        descriptionUk: 'Фінішний бустер на фосфітах для останніх тижнів цвітіння, який ущільнює структуру суцвіть.',
        dosageGuide: '1.5 - 2 мл/л (останні 3-4 тижні)',
        targetMedium: 'All',
        recommendedStages: ['late_bloom'],
        bestUsedForUk: 'Камʼяна щільність та додаткова вага суцвіть.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'atami',
    name: 'Atami / Bʼcuzz / ATA',
    country: 'Нідерланди',
    countryFlag: '🇳🇱',
    foundedYear: 1997,
    logoUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🏆 #15 GrowDiaries (920+ врожаїв • 28 продуктів)',
    categoryType: 'Mineral',
    rating: 4.8,
    growDiariesRating: 9.2,
    growReportsCount: 920,
    growDiariesProductsCount: 28,
    headquarters: 'Rosmalen, Netherlands',
    shortBioUk: 'Творці легендарного стимулятора Bloombastic, світовий еталон підсилювачів цвітіння та мінеральних лінійок.',
    fullDescriptionUk: 'Голландський гігант Atami випускає три спеціалізовані серії: ATA (для початківців та ґрунту), Bʼcuzz (для досвідчених гроверів та кокосу) та легендарну лінійку бустерів Bloombastic, Rootbastic та Rokzbastic.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.atami.com',
      promoCode: 'ATAMI_BLOOM',
      discountPercent: 10
    },
    keyAdvantagesUk: [
      'Культовий стимулятор Bloombastic — багаторазовий переможець кубків',
      'Серія Rokzbastic для додаткового вмісту калію та фосфору без надлишку солей',
      'Rootbastic — ультраконцентрований коренеутворювач (дозування від 0.1 мл/л)',
      'Висока чистота та відсутність баластних солей'
    ],
    products: [
      {
        id: 'atami-bloombastic',
        name: 'Atami Bloombastic',
        category: 'bloom',
        categoryLabelUk: 'Легендарний коктейль біо-мінералів та цукрів 4-в-1',
        npk: '0-14-15 + Fe та вітаміни',
        descriptionUk: 'Один із найвідоміших бустерів цвітіння у світі. Збільшує вміст цукру, смоли та підсилює вагу шишок.',
        dosageGuide: '0.5 - 1.0 мл/л (останні 4-6 тижнів цвітіння)',
        targetMedium: 'All',
        recommendedStages: ['late_bloom'],
        bestUsedForUk: 'Максимальна смолистість, солодкий смак і вибухове ущільнення суцвіть.'
      },
      {
        id: 'atami-rootbastic',
        name: 'Atami Rootbastic',
        category: 'microbes',
        categoryLabelUk: 'Ультраконцентрований стимулятор коренеутворення',
        npk: '4-14-4 + мікроелементи',
        descriptionUk: 'Висококонцентрований препарат, що стимулює розгалуження кореневої системи та підвищує стійкість до стресів.',
        dosageGuide: '0.1 - 0.3 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Густа біла борода коренів у перші тижні життя.'
      },
      {
        id: 'atami-rokzbastic',
        name: 'Atami Rokzbastic',
        category: 'bloom',
        categoryLabelUk: 'Фінішний мінеральний ущільнювач бутонів',
        npk: '0-10-20 + 1% Залізо',
        descriptionUk: 'Спеціальний бустер з подвоєним калієм для фінальної фази для отримання надщільних суцвіть.',
        dosageGuide: '0.5 - 1.0 мл/л',
        targetMedium: 'All',
        recommendedStages: ['late_bloom'],
        bestUsedForUk: 'Камʼяна твердість суцвіть.'
      },
      {
        id: 'atami-silic-boost',
        name: 'Atami Silic Boost',
        category: 'silica',
        categoryLabelUk: 'Висококонцентрований рідкий кремній',
        descriptionUk: 'Рідкий кремнієвий кондиціонер для збільшення товщини стінок клітин та стійкості до спеки.',
        dosageGuide: '0.1 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Міцні гілки, здатні втримати важкі шишки без підвʼязування.'
      },
      {
        id: 'atami-ata-terra-max',
        name: 'ATA Terra Max',
        category: 'base',
        categoryLabelUk: 'Повноцінне базове добриво для ґрунту на цвітіння',
        npk: '2-2-4',
        descriptionUk: 'Збалансоване рідке добриво, створене для підтримки рослин у ґрунтових сумішах під час цвітіння.',
        dosageGuide: '1 - 5 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Рясне цвітіння у відкритому та закритому ґрунті.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'house-and-garden',
    name: 'House & Garden Nutrients',
    country: 'Нідерланди / США',
    countryFlag: '🇳🇱',
    foundedYear: 1990,
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
    badgeTag: '👑 #16 GrowDiaries (840+ врожаїв • 18 продуктів)',
    categoryType: 'Mineral',
    rating: 4.9,
    growDiariesRating: 9.4,
    growReportsCount: 840,
    growDiariesProductsCount: 18,
    headquarters: 'Almere, Netherlands / Santa Rosa, California',
    shortBioUk: 'Творці легендарного Roots Excelurator та порошку для цвітіння Shooting Powder.',
    fullDescriptionUk: 'Преміальний голландський бренд, заснований Вільямом ван де Званом. House & Garden виробляє власну продукцію у високотехнологічних лабораторіях у Каліфорнії та Нідерландах, пропонуючи один із найвідоміших у світі укорінювачів Roots Excelurator.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.house-garden.com',
      promoCode: 'HG_PREMIUM',
      discountPercent: 10
    },
    keyAdvantagesUk: [
      'Roots Excelurator — визнаний багатьма експертами найкращим укорінювачем у світі',
      'Shooting Powder — фінішний порошковий стимулятор для другого циклу цвітіння',
      'Amino Treatment з екстрактами насіння норвезьких рослин',
      'Aqua Flakes та Soil A&B преміум очищення без баластних залишків'
    ],
    products: [
      {
        id: 'hg-roots-excelurator',
        name: 'Roots Excelurator (Gold / Silver)',
        category: 'microbes',
        categoryLabelUk: 'Золотий стандарт світових укорінювачів',
        descriptionUk: 'Створює захисну біо-плівку навколо коренів, запобігає гнилі та стимулює вибуховий ріст білих корінців.',
        dosageGuide: '0.3 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative', 'early_bloom'],
        bestUsedForUk: 'Швидке укорінення розсади та клонів, потужна здорова коренева маса.'
      },
      {
        id: 'hg-shooting-powder',
        name: 'Shooting Powder',
        category: 'bloom',
        categoryLabelUk: 'Порошковий стимулятор повторного цвітіння',
        npk: '0-39-25',
        descriptionUk: 'Запускає новий цикл цвітіння в останні 3 тижні, нарощуючи додатковий шар щільних чашечок.',
        dosageGuide: '1 пакетик на 100 л (0.65 г/л)',
        targetMedium: 'All',
        recommendedStages: ['late_bloom'],
        bestUsedForUk: 'Збільшення кінцевої ваги сухого врожаю на 20-30%.'
      },
      {
        id: 'hg-bud-xl',
        name: 'Bud-XL',
        category: 'terpenes',
        categoryLabelUk: 'Транспортер ензимів та цукрів у суцвіття',
        descriptionUk: 'Витягує цукри з листя та направляє їх безпосередньо у суцвіття для максимізації смоли.',
        dosageGuide: '1 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Кращий колір, насичений аромат та висока концентрація терпенів.'
      },
      {
        id: 'hg-amino-treatment',
        name: 'Amino Treatment',
        category: 'booster',
        categoryLabelUk: 'Комплекс L-амінокислот холодного віджиму',
        descriptionUk: 'Збагачує рослину ферментами з насіння холодного клімату для посилення фотосинтезу та хлорофілу.',
        dosageGuide: '0.2 - 0.5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['vegetative', 'early_bloom'],
        bestUsedForUk: 'Глибоке темно-зелене листя та товсті міцні міжвузля.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'bac-nutrients',
    name: 'BAC (Biological Activated Cocktail)',
    country: 'Нідерланди',
    countryFlag: '🇳🇱',
    foundedYear: 2002,
    logoUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🌱 #17 GrowDiaries (760+ врожаїв • 16 продуктів)',
    categoryType: 'Organic',
    rating: 4.8,
    growDiariesRating: 9.2,
    growReportsCount: 760,
    growDiariesProductsCount: 16,
    headquarters: 'Gouda, Netherlands',
    shortBioUk: 'Елітна голландська 100% органіка з сертифікацією Vegan та унікальними біологічними активаторами.',
    fullDescriptionUk: 'BAC створив революційні біологічні активатори ґрунту, які підсилюють діяльність мікроорганізмів, що забезпечує натуральне живлення коренів без ризику засолення.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.baconline.nl',
      promoCode: 'BAC_ORGANIC',
      discountPercent: 10
    },
    keyAdvantagesUk: [
      '100% натуральні сертифіковані веганські органічні компоненти',
      'Organic PK Booster на основі рослинних екстрактів та цукрової патоки',
      'Синергія з ґрунтовою мікробіотою для солодкого терпенового профілю',
      'Повна відсутність хімічних баластних солей'
    ],
    products: [
      {
        id: 'bac-organic-grow',
        name: 'BAC Organic Grow',
        category: 'base',
        categoryLabelUk: '100% Органічне добриво для вегетації',
        npk: '7-2-3',
        descriptionUk: 'Органічне добриво з високим вмістом природного азоту та амінокислот для активного розвитку.',
        dosageGuide: '1 - 2 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Здоровий натуральний ріст без нітратного перевантаження.'
      },
      {
        id: 'bac-organic-bloom',
        name: 'BAC Organic Bloom',
        category: 'base',
        categoryLabelUk: '100% Органічне добриво для цвітіння',
        npk: '6-5-6',
        descriptionUk: 'Живить ґрунтові мікроорганізми, які постачають рослині необхідний фосфор і калій під час цвітіння.',
        dosageGuide: '2 - 3 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Рясне цвітіння та формування чистих ароматичних суцвіть.'
      },
      {
        id: 'bac-organic-pk-booster',
        name: 'BAC Organic PK Booster',
        category: 'bloom',
        categoryLabelUk: 'Органічний PK бустер з екстрактами Юкки',
        npk: '4-2-8',
        descriptionUk: 'Природний стимулятор цвітіння, що містить екстракт Yucca для кращого проникнення вологи в субстрат.',
        dosageGuide: '1 - 3 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['late_bloom'],
        bestUsedForUk: 'Збільшення щільності шишок при збереженні 100% органічного статусу.'
      },
      {
        id: 'bac-root-stimulator',
        name: 'BAC Root Stimulator',
        category: 'microbes',
        categoryLabelUk: 'Біостимулятор кореневої системи',
        descriptionUk: 'Захищає коріння від ґрунтових хвороб та підтримує мікробіологічний баланс у горщику.',
        dosageGuide: '0.1 - 0.2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Швидке укорінення та максимальне засвоєння поживних речовин.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'bio-nova',
    name: 'Bio Nova Nutrients',
    country: 'Нідерланди',
    countryFlag: '🇳🇱',
    foundedYear: 1993,
    logoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🧪 #18 GrowDiaries (710+ врожаїв • 22 продукти)',
    categoryType: 'Mineral',
    rating: 4.7,
    growDiariesRating: 9.1,
    growReportsCount: 710,
    growDiariesProductsCount: 22,
    headquarters: 'Waalwijk, Netherlands',
    shortBioUk: 'Піонер концепції однокомпонентних міксів Supermix (Autoflower, Soil, Hydro) та спеціальних монодобрив.',
    fullDescriptionUk: 'Bio Nova розробила одну з найзручніших систем Supermix, яка обʼєднує все необхідне для живлення в одній пляшці, а також окрему лінійку монодобрив (N, P, K, Ca, Mg, Micro) для точного коригування розчину.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.bionova.nl',
      promoCode: 'BIONOVA_NL',
      discountPercent: 10
    },
    keyAdvantagesUk: [
      'Autoflower Supermix — спеціалізована формула під життєвий цикл автоквітучих рослин',
      'The Missing Link — унікальний комплекс фульвокислот та рідкісних мікроелементів',
      'Монодобрива для точної корекції будь-якого дефіциту',
      'Екологічні та ультраекономічні дозування'
    ],
    products: [
      {
        id: 'bn-autoflower-supermix',
        name: 'Bio Nova Autoflower Supermix',
        category: 'base',
        categoryLabelUk: 'Спеціальна 1-компонентна база для автоквітів',
        npk: '5-2-5 + мікроелементи',
        descriptionUk: 'Комплексне добриво, оптимізоване під короткий і швидкий життєвий цикл автоквітучих сортів.',
        dosageGuide: '1.5 - 3.5 мл/л',
        targetMedium: 'Soil',
        recommendedStages: ['all'],
        bestUsedForUk: 'Вирощування автоквітів з першого дня до харвесту без складних схем.'
      },
      {
        id: 'bn-the-missing-link',
        name: 'The Missing Link (TML)',
        category: 'booster',
        categoryLabelUk: 'Преміум захисний колоїдний комплекс мікроелементів',
        descriptionUk: 'Очищає тканини рослин від токсинів, підсилює імунну систему та посилює опірність шкідникам.',
        dosageGuide: '0.5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Підвищена стійкість до патогенів та посилений фотосинтез.'
      },
      {
        id: 'bn-pk-13-14',
        name: 'Bio Nova PK 13-14',
        category: 'bloom',
        categoryLabelUk: 'Класичний мінеральний стимулятор цвітіння',
        npk: '0-13-14',
        descriptionUk: 'Швидкозасвоюваний фосфор і калій для фази активного росту квіткових чашечок.',
        dosageGuide: '0.5 - 1.5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['late_bloom'],
        bestUsedForUk: 'Формування щільних суцвіть.'
      },
      {
        id: 'bn-vitasol',
        name: 'Bio Nova Vitasol',
        category: 'terpenes',
        categoryLabelUk: 'Натуральний солодкий стимулятор на основі меляси',
        npk: '1-0-3 + цукри та вітаміни B',
        descriptionUk: 'Покращує засвоєння добрив корінням, робить смак врожаю солодким та мʼяким.',
        dosageGuide: '1 - 2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['late_bloom', 'flush'],
        bestUsedForUk: 'Солодкий насичений смак та швидке відновлення після стресу.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'emerald-harvest',
    name: 'Emerald Harvest',
    country: 'США',
    countryFlag: '🇺🇸',
    foundedYear: 2015,
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
    badgeTag: '💎 #19 GrowDiaries (680+ врожаїв • 14 продуктів)',
    categoryType: 'Mineral',
    rating: 4.8,
    growDiariesRating: 9.3,
    growReportsCount: 680,
    growDiariesProductsCount: 14,
    headquarters: 'Santa Rosa, California, USA',
    shortBioUk: 'Каліфорнійський преміум-бренд, створений командою експертів для максимальної віддачі індорного гровінгу.',
    fullDescriptionUk: 'Emerald Harvest із Північної Каліфорнії створив лінійки живлення Cali Pro (2-компонентна) та професійні добавки King Kola і Honey Chome для досягнення найвищих результатів під сучасними LED-світильниками.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.emeraldharvest.co',
      promoCode: 'EMERALD_CA',
      discountPercent: 10
    },
    keyAdvantagesUk: [
      'King Kola — потужний бустер цвітіння з екстрактом конопляного білка',
      'Honey Chome — комплекс вуглеводів для смолистості та аромату',
      'Emerald Goddess — рослинний тонік з люцерною, водоростями та гуміновими кислотами',
      'Хелати високої чистоти (DTPA, EDDHA) для роботи в ширшому діапазоні pH'
    ],
    products: [
      {
        id: 'eh-cali-pro-grow',
        name: 'Cali Pro Grow A & B',
        category: 'base',
        categoryLabelUk: '2-компонентна база вегетації преміум класу',
        npk: 'A: 3-0-0 | B: 1-2-6',
        descriptionUk: 'Очищена мінеральна основа з високою біодоступністю азоту та кальцію для міцного каркасу рослини.',
        dosageGuide: '1 - 2.5 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Густе соковите листя та міцні стебла.'
      },
      {
        id: 'eh-cali-pro-bloom',
        name: 'Cali Pro Bloom A & B',
        category: 'base',
        categoryLabelUk: '2-компонентна база цвітіння',
        npk: 'A: 3-0-3 | B: 1-4-6',
        descriptionUk: 'Оптимальне співвідношення фосфору, калію та магнію для тривалого продуктивного цвітіння.',
        dosageGuide: '1.5 - 3 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Рясне цвітіння та висока маса суцвіть.'
      },
      {
        id: 'eh-king-kola',
        name: 'King Kola (Bloom Booster)',
        category: 'bloom',
        categoryLabelUk: 'Потужний бустер з конопляним білком',
        npk: '0.3-2-3',
        descriptionUk: 'Спеціальний бустер цвітіння з білками конопляного насіння, що стимулює ріст великих центральних кол.',
        dosageGuide: '1 - 3 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Гігантські щільні верхівки суцвіть.'
      },
      {
        id: 'eh-honey-chome',
        name: 'Honey Chome (Aroma & Resin)',
        category: 'terpenes',
        categoryLabelUk: 'Підсилювач терпенів та смоли',
        npk: '0.5-0.5-1 + цукри з тростини та пальми',
        descriptionUk: 'Суміш трьох видів цукрів, яка живить корисні бактерії та підсилює вироблення трихом.',
        dosageGuide: '1 - 2 мл/л',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Яскравий аромат, липкі трихоми та солодкий смак.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'cyco-platinum',
    name: 'Cyco Platinum Series',
    country: 'Австралія',
    countryFlag: '🇦🇺',
    foundedYear: 2008,
    logoUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🇦🇺 #20 GrowDiaries (590+ врожаїв • 15 продуктів)',
    categoryType: 'Mineral',
    rating: 4.8,
    growDiariesRating: 9.2,
    growReportsCount: 590,
    growDiariesProductsCount: 15,
    headquarters: 'Melbourne, Australia',
    shortBioUk: 'Австралійські добрива фармацевтичного ступеня чистоти (100% Pharmaceutical Grade).',
    fullDescriptionUk: 'Cyco Platinum Series — єдиний бренд у світі, який використовує виключно інгредієнти фармацевтичної чистоти (чистота понад 99.8%), що виключає осад у гідропоніці та блокування поживних речовин.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.cycoflower.com',
      promoCode: 'CYCO_AUS',
      discountPercent: 10
    },
    keyAdvantagesUk: [
      '100% Pharmaceutical Grade інгредієнти — нуль важких металів та домішок',
      'Ryzofuel — австралійський біостимулятор коренів з водоростей та розчинного цинку',
      'Supa Stiky — підсилювач вироблення ефірних олій та терпеноїдів',
      'Dr. Repair — екстрена допомога при хлорозі та пошкодженнях стресом'
    ],
    products: [
      {
        id: 'cyco-grow-a-b',
        name: 'Cyco Grow A & B',
        category: 'base',
        categoryLabelUk: 'Фармацевтична мінеральна база вегетації',
        npk: 'A: 2-0-0 | B: 2-2-6',
        descriptionUk: 'Базове ультрачисте добриво без хлоридів та сульфатних залишків для інтенсивного росту пагонів.',
        dosageGuide: '2 мл/л кожного компонента',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Кришталево чистий розчин у гідропоніці та кокосі.'
      },
      {
        id: 'cyco-bloom-a-b',
        name: 'Cyco Bloom A & B',
        category: 'base',
        categoryLabelUk: 'Фармацевтична мінеральна база цвітіння',
        npk: 'A: 3-0-2 | B: 1-5-6',
        descriptionUk: 'Забезпечує високу концентрацію чистого фосфору і калію для формування великих бутонів.',
        dosageGuide: '2 - 3 мл/л кожного компонента',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Максимальний врожай без накопичення токсичних солей.'
      },
      {
        id: 'cyco-ryzofuel',
        name: 'Cyco Ryzofuel',
        category: 'microbes',
        categoryLabelUk: 'Австралійський укорінювач з водоростей Тасманії',
        descriptionUk: 'Органічний екстракт тасманійських морських водоростей для стимуляції росту нових коренів.',
        dosageGuide: '1 мл/л',
        targetMedium: 'All',
        recommendedStages: ['seedling', 'vegetative'],
        bestUsedForUk: 'Потужне розростання коренів та швидкий ріст.'
      },
      {
        id: 'cyco-supa-stiky',
        name: 'Cyco Supa Stiky',
        category: 'terpenes',
        categoryLabelUk: 'Підсилювач смоли та терпеноїдів',
        npk: '0.6-3-2',
        descriptionUk: 'Збільшує вироблення трихом, роблячи суцвіття липкими та екстремально ароматними.',
        dosageGuide: '1 мл/л (тижні 5-8 цвітіння)',
        targetMedium: 'All',
        recommendedStages: ['late_bloom'],
        bestUsedForUk: 'Рекордна концентрація смоли та трихом.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'guanokalong',
    name: 'Guanokalong & GK-Organics',
    country: 'Нідерланди',
    countryFlag: '🇳🇱',
    foundedYear: 2002,
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🦇 #21 GrowDiaries (540+ врожаїв • 12 продуктів)',
    categoryType: 'Organic',
    rating: 4.8,
    growDiariesRating: 9.3,
    growReportsCount: 540,
    growDiariesProductsCount: 12,
    headquarters: 'Aalten, Netherlands',
    shortBioUk: 'Світовий лідер 100% натурального гуано кажанів з Мадагаскару та Індонезії для неперевершеного смаку.',
    fullDescriptionUk: 'Guanokalong використовує натуральний ферментований послід кажанів, багатий на повільнорозчинний органічний фосфор, ферменти та мікроелементи. Створює неперевершений солодкий смак та аромат.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.guanokalong.nl',
      promoCode: 'GUANO_ORGANIC',
      discountPercent: 10
    },
    keyAdvantagesUk: [
      '100% натуральний природний послід кажанів (Bat Guano)',
      'Високий вміст органічного фосфору без ризику спалити корені',
      'Palm Tree Ash — натуральний попіл масляної пальми з вмістом калію 18%',
      'Надає врожаю найвищу оцінку за смаковими якостями'
    ],
    products: [
      {
        id: 'guano-powder',
        name: 'Guanokalong Powder (Bat Guano)',
        category: 'bloom',
        categoryLabelUk: 'Натуральний сухий порошок гуано кажанів',
        npk: '1-10-1 + багатий комплекс мікроелементів',
        descriptionUk: 'Органічний порошок для замішування в ґрунт або приготування компостного чаю.',
        dosageGuide: '50 г на 15 л субстрату або 10 г на 1 л води для чаю',
        targetMedium: 'Soil',
        recommendedStages: ['all'],
        bestUsedForUk: 'Фантастичний натуральний солодкий смак та щільність шишок.'
      },
      {
        id: 'gk-complete-organics',
        name: 'GK-Organics Complete Organics',
        category: 'base',
        categoryLabelUk: 'Повний 100% органічний мікс для ґрунту',
        npk: '4-3-3 + морські водорості, рибне борошно, гуано',
        descriptionUk: 'Збалансована суха суміш для заправки ґрунту, що повністю забезпечує рослину живленням.',
        dosageGuide: '50-100 мл на 15 л ґрунту',
        targetMedium: 'Soil',
        recommendedStages: ['all'],
        bestUsedForUk: 'Гровінг без рідких добрив — тільки полив водою.'
      },
      {
        id: 'guano-extract',
        name: 'Guanokalong Extract (Taste Improver)',
        category: 'terpenes',
        categoryLabelUk: 'Рідкий екстракт гуано кажанів',
        descriptionUk: 'Рідка витяжка для швидкого підживлення коренів фосфором та ферментами під час цвітіння.',
        dosageGuide: '10 - 20 мл на 10 л води',
        targetMedium: 'All',
        recommendedStages: ['early_bloom', 'late_bloom'],
        bestUsedForUk: 'Поліпшення смакових якостей та аромату.'
      }
    ],
    feedCharts: []
  },
  {
    id: 'mammoth-microbes',
    name: 'Mammoth Microbes',
    country: 'США',
    countryFlag: '🇺🇸',
    foundedYear: 2015,
    logoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&q=80',
    badgeTag: '🐘 #22 GrowDiaries (360+ врожаїв • 5 продуктів)',
    categoryType: 'Specialized',
    rating: 4.9,
    growDiariesRating: 9.5,
    growReportsCount: 360,
    growDiariesProductsCount: 5,
    headquarters: 'Fort Collins, Colorado, USA',
    shortBioUk: 'Бактеріальні біотехнології, розроблені вченими Університету Колорадо для розблокування фосфору.',
    fullDescriptionUk: 'Mammoth P — перший науково доведений бактеріальний інокулянт, який перетворює заблокований у субстраті фосфор у доступну для коренів форму, збільшуючи врожайність на 16%.',
    partnerPlan: {
      tier: 'verified',
      isOfficialPartner: true,
      websiteUrl: 'https://www.mammothmicrobes.com',
      promoCode: 'MAMMOTH_USA',
      discountPercent: 10
    },
    keyAdvantagesUk: [
      'Mammoth P розроблений ґрунтовими мікробіологами Colorado State University',
      'Розблоковує до 30% звʼязаного фосфору та мікроелементів',
      'Mammoth Silica — високоефективний нано-кремній',
      'Сумісний з будь-якими марками добрив та системами вирощування'
    ],
    products: [
      {
        id: 'mammoth-p',
        name: 'Mammoth P Microbial Inoculant',
        category: 'microbes',
        categoryLabelUk: 'Бактеріальний розблоковувач фосфору',
        descriptionUk: 'Консорціум живих корисних бактерій (Pseudomonas putida, Comamonas testosteroni), які вивільняють звʼязаний фосфор.',
        dosageGuide: '0.16 мл/л (0.6 мл на галон)',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Збільшення ваги шишок на 16% та міцність стовбурів.'
      },
      {
        id: 'mammoth-silica',
        name: 'Mammoth Silica',
        category: 'silica',
        categoryLabelUk: 'Ультраконцентрований біодоступний кремній',
        descriptionUk: 'Підсилює клітинну структуру та стійкість рослин до високих температур і перепадів вологості.',
        dosageGuide: '0.1 - 0.25 мл/л',
        targetMedium: 'All',
        recommendedStages: ['all'],
        bestUsedForUk: 'Товсті міцні гілки та стійкість до літньої спеки.'
      }
    ],
    feedCharts: []
  }
];

// Helper search and filter utilities
export function getManufacturerById(id: string): ManufacturerBrand | undefined {
  return MANUFACTURERS_CATALOG.find((m) => m.id === id);
}

export function getAllNutrientProducts(): { product: NutrientProduct; brand: ManufacturerBrand }[] {
  const list: { product: NutrientProduct; brand: ManufacturerBrand }[] = [];
  MANUFACTURERS_CATALOG.forEach((brand) => {
    brand.products.forEach((product) => {
      list.push({ product, brand });
    });
  });
  return list;
}

export function searchManufacturers(query: string): ManufacturerBrand[] {
  const q = query.toLowerCase().trim();
  if (!q) return MANUFACTURERS_CATALOG;
  return MANUFACTURERS_CATALOG.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.country.toLowerCase().includes(q) ||
      m.categoryType.toLowerCase().includes(q) ||
      m.badgeTag.toLowerCase().includes(q) ||
      m.products.some((p) => p.name.toLowerCase().includes(q) || p.bestUsedForUk.toLowerCase().includes(q) || p.categoryLabelUk.toLowerCase().includes(q))
  );
}

export function searchProductsDirectly(query: string, categoryFilter?: string, stageFilter?: string): { product: NutrientProduct; brand: ManufacturerBrand }[] {
  const all = getAllNutrientProducts();
  const q = query.toLowerCase().trim();

  return all.filter(({ product, brand }) => {
    const matchesQuery =
      !q ||
      product.name.toLowerCase().includes(q) ||
      brand.name.toLowerCase().includes(q) ||
      product.categoryLabelUk.toLowerCase().includes(q) ||
      product.bestUsedForUk.toLowerCase().includes(q) ||
      (product.npk && product.npk.toLowerCase().includes(q));

    const matchesCat = !categoryFilter || categoryFilter === 'All' || product.category === categoryFilter;
    const matchesStage = !stageFilter || stageFilter === 'all' || product.recommendedStages.includes('all') || product.recommendedStages.includes(stageFilter as TargetStage);

    return matchesQuery && matchesCat && matchesStage;
  });
}
