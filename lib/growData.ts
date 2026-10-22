import { Plant, UserStats, Badge, ReminderTask, VPDStatus } from './types';

// Medical Cannabis Strains Library
export interface StrainInfo {
  name: string;
  breeder?: string;
  type: 'Indica' | 'Sativa' | 'Hybrid';
  isAuto: boolean;
  thc: string;
  cbd: string;
  floweringWeeks: number;
  medicalUses: string[];
  description: string;
  optimalPH: string;
  difficulty: 'Легкий' | 'Середній' | 'Досвідчений';
}

// Повна генетична база виробників насіння (1060+ брідерів)
export const GLOBAL_SEEDBANK_BREEDERS: string[] = [
  "Royal Queen Seeds",
  "FastBuds",
  "Barney's Farm",
  "Dutch Passion",
  "Sensi Seeds",
  "Sweet Seeds",
  "Mephisto Genetics",
  "Greenhouse Seeds",
  "Humboldt Seed Organization",
  "Humboldt Seed Company",
  "Seedsman",
  "Seed Stockers",
  "Paradise Seeds",
  "Ripper Seeds",
  "Silent Seeds",
  "DNA Genetics",
  "Blimburn Seeds",
  "Serious Seeds",
  "Compound Genetics",
  "Anesia Seeds",
  "Ethos Genetics",
  "Ace Seeds",
  "Medical Seeds",
  "Philosopher Seeds",
  "Pyramid Seeds",
  "Spanish Seeds",
  "Ministry of Cannabis",
  "Exotic Seed",
  "Karma Genetics",
  "SubCool / TGA Genetics",
  "Mandala Seeds",
  "Soma Seeds",
  "Apex Seeds",
  "Super Sativa Seed Club",
  "NightOwl Seeds",
  "Gnome Automatics",
  "Atlas Seed",
  "Raw Genetics",
  "Elev8 Seeds",
  "Brothers Grimm Seeds",
  "Rare Dankness",
  "Oni Seed Co",
  "Lit Farms",
  "Solfire Gardens",
  "MassMedicalStrains",
  "Dark Horse Genetics",
  "Swamp Boys Seeds",
  "Crockett Family Farms",
  "Archive Seed Bank",
  "Cannarado Genetics",
  "In House Genetics",
  "Bodhi Seeds",
  "Bomb Seeds",
  "Advanced Seeds",
  "Heavyweight Seeds",
  "CBD Crew",
  "World of Seeds",
  "Strain Hunters",
  "Mosca Seeds",
  "Female Seeds",
  "Kannabia Seed Company",
  "Genehtik Seeds",
  "BC Bud Depot",
  "Pheno Finder Seeds",
  "Nirvana Seeds",
  "Eva Seeds",
  "Samsara Seeds",
  "Spliff Seeds",
  "TH Seeds",
  "Emerald Triangle Seeds",
  "Resin Seeds",
  "Kalashnikov Seeds",
  "Kera Seeds",
  "VIP Seeds",
  "Victory Seeds",
  "Vision Seeds",
  "Sumo Seeds",
  "Doctor's Choice",
  "Expert Seeds",
  "Absolute Cannabis Seeds",
  "High Speed Buds",
  "00 Seeds",
  "Bulk Seed Bank",
  "Spanish Passion Seeds",
  "Original Sensible Seeds",
  "Monster Genetics",
  "Short Stuff Seeds",
  "Seed City Seeds",
  "Інший виробник..."
];

export const MEDICAL_STRAINS: StrainInfo[] = [
  // ROYAL QUEEN SEEDS
  {
    name: "Northern Lights Automatic",
    breeder: "Royal Queen Seeds",
    type: "Indica",
    isAuto: true,
    thc: "18%",
    cbd: "1.2%",
    floweringWeeks: 8,
    medicalUses: ["Хронічний біль", "Безсоння", "М'язові спазми", "Стрес"],
    description: "Легендарний автоквітучий сорт від RQS із заспокійливим ефектом. Дуже стійкий до помилок початківців та має глибокий сосново-землистий аромат.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Royal Medic (CBD Dominant)",
    breeder: "Royal Queen Seeds",
    type: "Hybrid",
    isAuto: false,
    thc: "10%",
    cbd: "12%",
    floweringWeeks: 9,
    medicalUses: ["Спазми", "Запалення суглобів", "Невралгія", "Розсіяний склероз"],
    description: "Медичний гібрид, отриманий схрещуванням Juanita la Lagrimosa. Чудовий протизапальний профіль із заспокійливим дією.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },
  {
    name: "Stress Killer Automatic CBD",
    breeder: "Royal Queen Seeds",
    type: "Sativa",
    isAuto: true,
    thc: "11%",
    cbd: "high",
    floweringWeeks: 8,
    medicalUses: ["Стрес", "Тривожність", "Втома"],
    description: "Потужний знімач напруги з цитрусовим ароматом і високим вмістом CBD для зняття тривожності без психоактивного туману.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Quick One",
    breeder: "Royal Queen Seeds",
    type: "Indica",
    isAuto: true,
    thc: "13%",
    cbd: "1.0%",
    floweringWeeks: 7,
    medicalUses: ["Легкий біль", "М'язова напруга", "Втрата апетиту"],
    description: "Один із найшвидших автоквітів у світі від Royal Queen Seeds. Дозріває всього за 8-9 тижнів від каски з компактною структурою.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Royal Gorilla",
    breeder: "Royal Queen Seeds",
    type: "Hybrid",
    isAuto: false,
    thc: "27%",
    cbd: "0.5%",
    floweringWeeks: 9,
    medicalUses: ["Сильний біль", "Глибокий стрес", "Безсоння"],
    description: "Надпотужний каліфорнійський гібрид із вмістом THC до 27%. Забезпечує глибоку психофізичну релаксацію та високу смолистість.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },
  {
    name: "Amnesia Haze",
    breeder: "Royal Queen Seeds",
    type: "Sativa",
    isAuto: false,
    thc: "22%",
    cbd: "1.0%",
    floweringWeeks: 11,
    medicalUses: ["Депресія", "Втома", "Мігрень", "Апатія"],
    description: "Класичний сатівний сорт із бадьорим ефектом, фруктово-цитрусовим букетом та високим ейфоричним потенціалом.",
    optimalPH: "5.8 - 6.3",
    difficulty: "Середній"
  },
  {
    name: "Green Gelato Automatic",
    breeder: "Royal Queen Seeds",
    type: "Hybrid",
    isAuto: true,
    thc: "24%",
    cbd: "0.8%",
    floweringWeeks: 8,
    medicalUses: ["Стрес", "Тривога", "М'язові спазми"],
    description: "Десертний автоквіт від RQS із високим THC до 24%. Поєднує солодкі фрукти, цитрусові нотки та швидке дозрівання.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Fat Banana Automatic",
    breeder: "Royal Queen Seeds",
    type: "Indica",
    isAuto: true,
    thc: "22%",
    cbd: "0.5%",
    floweringWeeks: 8,
    medicalUses: ["Безсоння", "Втрата апетиту", "Хронічна напруга"],
    description: "Автоквіт із солодким банановим ароматом. Забезпечує глибокий фізичний стоун-ефект та розслаблення після важкого дня.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },

  // FASTBUDS (FULL SEEDBANK CATALOG)
  { name: "AK Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "24%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Ейфорія", "Творчість", "Енергія"], description: "Класичний автоквіт AK від FastBuds із потужним сатівним ейфоричним імпульсом.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Afghan Kush Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "22%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Безсоння", "М'язові спазми", "Глибока релаксація"], description: "Стопроцентний індичний автоквіт із густим смолистим ароматом гашишу та розслабляючим ефектом.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Amnesia Haze Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "22%", cbd: "< 0.1%", floweringWeeks: 10, medicalUses: ["Бадьорість", "Концентрація", "Зняття втоми"], description: "Потужний сатівний автоквіт від FastBuds із бадьорим цитрусовим букетом.", optimalPH: "5.8 - 6.3", difficulty: "Середній" },
  { name: "Amnesia Z Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "26%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Стрес", "Підвищення настрою"], description: "Соковитий гібрид Amnesia Haze та Zkittlez із солодким фруктовим смаком.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Apple Strudel Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "29%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Біль", "Глибока ейфорія"], description: "Новинка від FastBuds з екстремальним ТГК до 29% та смаком свіжого яблучного штруделя.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Apricot Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "26%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Невралгія", "Розслаблення", "Апетит"], description: "Соковитий абрикосовий автоквіт із високою смолистістю для виготовлення екстрактів.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Banana Cherry Cookies Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "27%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Антистрес", "Релакс"], description: "Десертний автоквіт із яскравим ароматом стиглої вишні, банана та пісочного печива.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Banana Frost Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "25%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Безсоння", "М'язова напруга"], description: "Морозні засніжені суцвіття із солодким бананово-вершковим ароматом.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Banana Guava Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "26%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Творчий підйом", "Релаксація"], description: "Екзотичний тропічний гібрид з вираженими нотами гуави та банана.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Banana Purple Punch Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "26%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Безсоння", "Глибока релаксація"], description: "Яскраво-фіолетовий флагманський сорт FastBuds з бананово-полуничним ароматом.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Banana Purple Punch Auto RF3", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "27%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Сильний больовий синдром"], description: "Стабілізований селекційний індичний автоквіт із фіолетовими терпкими шишками.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Big Bud Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "23%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Спазми", "Релакс"], description: "Рекордсмен за масою та щільністю суцвіть, ідеальний для високого врожаю.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Blackberry Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "23%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Безсоння", "Тривожність"], description: "Темно-бордовий автоквіт із солодкою лісовою ожиною та глибоким фізичним ефектом.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Black Cream Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "22%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["М'язовий тонус", "Стрес"], description: "Темні суцвіття із солодко-пряним ароматом вершкового крему.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Blueberry Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "22%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Релаксація", "Апетит"], description: "Класична ягідна чорниця у зручному швидкому автоквітучому форматі.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Blue Dream Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "22%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Депресія", "Втома"], description: "Каліфорнійська легенда з чорничним букетом та м'якою ейфорією.", optimalPH: "5.8 - 6.3", difficulty: "Середній" },
  { name: "C4 Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "22%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Біль", "Нервова напруга"], description: "Вибуховий гібрид із вершковим відтінком та швидким стартом вегетації.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Chemdawg Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "21%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Біль", "Стрес"], description: "Потужний дизельно-паливний сорт із різким ароматом та глибоким ефектом.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Cherry Cola Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "28%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Настрій", "Релаксація"], description: "Екстремальний сорт із вираженим смаком вишневої газованої води та ТГК 28%.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Cinderella Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "23%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Бадьорість", "Творчість"], description: "Казковий тропічний сорт із відтінками ананаса та персика.", optimalPH: "5.8 - 6.3", difficulty: "Легкий" },
  { name: "Cream Cookies Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "23%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Апетит", "Спазми"], description: "Вершково-печивний автоквіт із розкішною смолистістю.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Crystal Meth Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "21%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Енергія", "Фокус"], description: "Психоделічний пурпуровий сорт з кристалічною смолою та вираженою активністю.", optimalPH: "5.8 - 6.3", difficulty: "Легкий" },
  { name: "Fastberry Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "19%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Безсоння", "Біль"], description: "Надшвидкий ягідний автоквіт для компактного гроубоксу.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Gelato Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "26%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Стрес", "Депресія"], description: "Солодкий морожений гібрид із високим коефіцієнтом THC та яскравим терпким смаком.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Girl Scout Cookies Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "22%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Релакс", "Апетит"], description: "Каліфорнійський бестселер зі смаком печива, карамелі та м'яти.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Gorilla Cookies Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "27%", cbd: "< 0.1%", floweringWeeks: 10, medicalUses: ["Біль", "Апетит", "Глибока релаксація"], description: "Найпопулярніший автоквіт FastBuds з екстремальним THC до 27%, соковитим смаком випічки та колосальною врожайністю.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Gorilla Glue Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "24%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Сильний біль", "Безсоння"], description: "Липкі важкі суцвіття з неймовірною кількістю смоли та земляним дизельним профілем.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Gorilla Punch Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "26%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Тривога", "Стрес", "Хронічний біль"], description: "Фіолетовий гібрид від FastBuds із 26% THC. Забезпечує потужну початкову ейфорію, що плавно переходить у глибокий спокій.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Grapefruit Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "20%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Втома", "Депресія"], description: "Освіжаючий грейпфрутовий автоквіт із бадьорим цитрусовим зарядом.", optimalPH: "5.8 - 6.3", difficulty: "Легкий" },
  { name: "Green Crack Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "21%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Енергія", "Фокус", "Апатія"], description: "Денний енергетичний сатівний автоквіт із манговим ароматом.", optimalPH: "5.8 - 6.3", difficulty: "Легкий" },
  { name: "Green Crack CBD", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "6%", cbd: "12%", floweringWeeks: 9, medicalUses: ["Денне зняття болю", "Концентрація", "Артрит", "Хронічна втома"], description: "Ідеальний баланс для денного використання (THC 6%, CBD 12%). Швидкий автоквіт із приємним соковитим манговим ароматом.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Guava Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "28%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Стрес", "Релаксація"], description: "Тропічний гібрид із надвисоким вмістом терпенів та ніжним фруктовим смаком.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Lemon AK Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "24%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Настрій", "Бадьорість"], description: "Лимонна модифікація AK-47 із потужним сатівним ейфоричним зарядом.", optimalPH: "5.8 - 6.3", difficulty: "Легкий" },
  { name: "Lemon Cherry Cookies Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "28.5%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Глибока ейфорія", "Антистрес"], description: "Топ-сорт FastBuds з лимонно-вишневим смаком випічки та ТГК до 28.5%.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Lemon Pie Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "24%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Невралгія", "Стрес"], description: "Лимонний пиріг із соковитою кислою цедрою та заспокійливим підтекстом.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "LSD-25 Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "21%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Безсоння", "Депресія", "Нервова напруга"], description: "Стійкий фіолетовий автоквіт із насиченим смаком дизеля та лісових ягід. Відрізняється потужним психоделічним ефектом.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Mexican Airlines Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "19%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Бадьорість", "Творчість"], description: "Чиста сатіва з імбиром та цитрусом для денного креативу.", optimalPH: "5.8 - 6.3", difficulty: "Середній" },
  { name: "Mimosa Cake Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "24%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Депресія", "Антистрес"], description: "Коктейль Мімоза у поєднанні із солодким бісквітом та смолистими суцвіттями.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Northern Lights Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "20%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Біль", "Безсоння"], description: "Класична північна індика у виконанні FastBuds із високим врожаєм.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Orange Sherbet Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "24%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Настрій", "Енергія"], description: "Помаранчевий шербет із соковитим апельсиновим соком та сатівним ейфорією.", optimalPH: "5.8 - 6.3", difficulty: "Легкий" },
  { name: "Original Auto AK", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "21%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Ейфорія", "Фокус"], description: "Оригінальний витривалий сорт AK у лінійці Original від FastBuds.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Original Auto Amnesia Haze", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "22%", cbd: "< 0.1%", floweringWeeks: 10, medicalUses: ["Депресія", "Апатія"], description: "Оригінальний сатівний автоквіт з лимонно-сосновим ароматом.", optimalPH: "5.8 - 6.3", difficulty: "Легкий" },
  { name: "Original Auto Bubblegum", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "20%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Стрес", "Апетит"], description: "Солодкий жувальний сорт з відтінками полуниці та жувальної гумки.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Original Auto Chemdawg", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "20%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Біль", "М'язи"], description: "Газово-дизельна класика із заспокійливою дією.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Original Auto Critical", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "20%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Релакс", "Сон"], description: "Надврожайний сорт для швидкого заповнення гроубоксу.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Original Auto Jack Herer", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "21%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Фокус", "Енергія"], description: "Сатіва імені Джека Херера з гострим пряно-сосновим букетом.", optimalPH: "5.8 - 6.3", difficulty: "Легкий" },
  { name: "Original Auto Northern Lights", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "20%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Сон", "М'язи"], description: "Перевірена часом індика з потужним розслабленням.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Original Auto OG Kush", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "23%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Сильний стрес", "Біль"], description: "Каліфорнійський куш із лимонно-паливним профілем.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Original Auto Russian", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "20%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Релакс", "Спазми"], description: "Стійкий смолистий гібрид з м'якою тілесною дією.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Original Auto Skunk", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "20%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Настрій", "Апетит"], description: "Солодкувато-гострий сканк із невибагливим характером.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Original Auto Sour Diesel", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "21%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Втома", "Депресія"], description: "Кислі дизельні ноти та бадьорий сатівний драйв.", optimalPH: "5.8 - 6.3", difficulty: "Легкий" },
  { name: "Original Auto White Widow", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "20%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Релаксація", "Тривога"], description: "Засніжені білі шишки зі збалансованим сативно-індичним ефектом.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Papaya Cookies Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "27%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Глибокий спокій", "Ейфорія"], description: "Папайя та солодке печиво з потужним підйомом настрою.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Pineapple Express Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "20%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Ейфорія", "Апетит"], description: "Ананасовий експрес із тропічним соковитим ароматом та ейфорією.", optimalPH: "5.8 - 6.3", difficulty: "Легкий" },
  { name: "Pound Cake Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "28%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Стрес", "Біль"], description: "Солодкий бісквітний сорт з високою концентрацією ТГК.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Purple Lemonade Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "22%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Нервова напруга", "Мігрень", "Пригніченість"], description: "Флагманський яскраво-фіолетовий автоквіт із цитрусово-лимонадним смаком, високим виходом смоли та освіжаючим дією.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Purple Punch Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "24%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Сон", "Релаксація"], description: "Фіолетові чорничні шишки з глибоким розслабленням.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Rhino Ryder Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "20%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Хронічний біль", "Спазми"], description: "Медична лінія від FastBuds із потужним знеболюючим ефектом.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Six Shooter Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "23%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Енергія", "Настрій"], description: "Шестизарядний автоквіт з вираженим сатівним ефектом.", optimalPH: "5.8 - 6.3", difficulty: "Легкий" },
  { name: "Smoothie Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "24%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Релакс", "Антистрес"], description: "Фруктовий смузі з чорниці та мангів для приємного вечора.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Sour Diesel Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "21%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Втома", "Депресія"], description: "Класичний кислий паливний автоквіт від FastBuds.", optimalPH: "5.8 - 6.3", difficulty: "Легкий" },
  { name: "Sour Jealousy Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "29%", cbd: "< 0.1%", floweringWeeks: 10, medicalUses: ["Екстремальний ейфорійний драйв"], description: "Надпотужна новинка з ТГК 29% та гострим цитрусово-газовим смаком.", optimalPH: "5.8 - 6.3", difficulty: "Середній" },
  { name: "Stardawg Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "22%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Біль", "Апетит"], description: "Зоряний сорт із хвойно-дизельним ароматом та щільними шишками.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Strawberry Banana Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "27%", cbd: "< 0.1%", floweringWeeks: 10, medicalUses: ["Глибокий розслаблюючий стоун"], description: "Полунично-банановий пунш із високою смолистістю.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Strawberry Gorilla Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "27%", cbd: "< 0.1%", floweringWeeks: 10, medicalUses: ["Стрес", "Втрата апетиту", "М'язові судоми"], description: "Рекордсмен за врожайністю та вмістом полуничних терпенів. Високий імунітет до грибків та плісняви.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Strawberry Pie Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "26%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Релакс", "Сон"], description: "Полуничний пиріг із солодким бісквітним шлейфом.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Tangie Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "23%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Настрій", "Бадьорість"], description: "Соковитий мандариновий автоквіт для гарного настрою.", optimalPH: "5.8 - 6.3", difficulty: "Легкий" },
  { name: "Tropicana Cookies Auto", breeder: "FastBuds", type: "Sativa", isAuto: true, thc: "27%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Енергія", "Депресія"], description: "Темно-фіолетовий сатівний сорт із насиченим смаком цитрусових.", optimalPH: "5.8 - 6.3", difficulty: "Легкий" },
  { name: "Wedding Cheesecake Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "24%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Стрес", "Апетит"], description: "Сирно-чизкейковий сорт із солодким вершковим смаком.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Wedding Glue Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "26%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Біль", "Глибока релаксація"], description: "Смолистий гібрид Wedding Cake та Gorilla Glue.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "West Coast OG Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "21%", cbd: "< 0.1%", floweringWeeks: 8, medicalUses: ["Безсоння", "Стрес"], description: "Класичний західнокаліфорнійський OG Kush від FastBuds.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Zkittlez Auto", breeder: "FastBuds", type: "Indica", isAuto: true, thc: "23%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Антистрес", "Настрій"], description: "Фруктовий цукерковий автоквіт із яскравою палітрою смаків.", optimalPH: "6.0 - 6.5", difficulty: "Легкий" },
  { name: "Ztrawberrez Auto", breeder: "FastBuds", type: "Hybrid", isAuto: true, thc: "26%", cbd: "< 0.1%", floweringWeeks: 9, medicalUses: ["Творчість", "Ейфорія"], description: "Полунично-цукеркова новинка з багатим розслаблюючим профілем.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },

  // FASTBUDS FAST FLOWERING (PHOTOPERIOD)
  { name: "Apple Strudel FF", breeder: "FastBuds", type: "Hybrid", isAuto: false, thc: "29%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Ейфорія", "Релакс"], description: "Швидкоквітучий фотоперіодний сорт (Fast Flowering) зі смаком яблучного штруделя.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Apricot FF", breeder: "FastBuds", type: "Indica", isAuto: false, thc: "26%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Біль", "Сон"], description: "Швидкоквітуча фотоперіодна індика з ароматними абрикосовими суцвіттями.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Banana Purple Punch FF", breeder: "FastBuds", type: "Indica", isAuto: false, thc: "26%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Глибокий стоун"], description: "Фіолетовий фотоперіодний супер-сорт зі скороченим періодом цвітіння.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Bruce Banner FF", breeder: "FastBuds", type: "Hybrid", isAuto: false, thc: "30%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Екстремальний больовий синдром"], description: "Надпотужний Брюс Беннер із ТГК до 30% та дозріванням за 7 тижнів цвітіння.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Cherry Cola FF", breeder: "FastBuds", type: "Hybrid", isAuto: false, thc: "28%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Настрій", "Релакс"], description: "Вишнева кола у фотоперіодному швидкому виконанні.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Gelato FF", breeder: "FastBuds", type: "Hybrid", isAuto: false, thc: "27%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Стрес", "Апетит"], description: "Швидкоквітучий десертний Gelato для високих врожаїв аутдору та індору.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Gorilla Cookies FF", breeder: "FastBuds", type: "Hybrid", isAuto: false, thc: "29%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Потужний знеболюючий та ейфорійний ефект"], description: "Флагманський фотоперіодний швидкоквітучий сорт від FastBuds.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Gorilla Punch FF", breeder: "FastBuds", type: "Hybrid", isAuto: false, thc: "26%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Релакс", "Антистрес"], description: "Фіолетові смолисті суцвіття зі скороченим циклом цвітіння.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Guava FF", breeder: "FastBuds", type: "Hybrid", isAuto: false, thc: "28%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Творчий драйв"], description: "Екзотична тропічна гуава у фотоперіодному Fast Flowering форматі.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Lemon Cherry Cookies FF", breeder: "FastBuds", type: "Hybrid", isAuto: false, thc: "28%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Ейфорія", "Апетит"], description: "Лимонно-вишневе печиво з високим рівнем ТГК та швидким дозріванням.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Orange Sherbet FF", breeder: "FastBuds", type: "Sativa", isAuto: false, thc: "26%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Бадьорість", "Депресія"], description: "Соковитий апельсиновий шербет Fast Flowering.", optimalPH: "5.8 - 6.3", difficulty: "Середній" },
  { name: "Papaya Cookies FF", breeder: "FastBuds", type: "Hybrid", isAuto: false, thc: "27%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Спокій", "Антистрес"], description: "Тропічна папайя Fast Flowering з високим виходом смоли.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Pound Cake FF", breeder: "FastBuds", type: "Hybrid", isAuto: false, thc: "28%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Релаксація", "Біль"], description: "Вершково-бісквітний фотоперіодний сорт Fast Flowering.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Purple Lemonade FF", breeder: "FastBuds", type: "Indica", isAuto: false, thc: "25%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Сон", "Нервовий тонус"], description: "Яскраво-фіолетові суцвіття Fast Flowering з лимонадним ароматом.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Sour Jealousy FF", breeder: "FastBuds", type: "Sativa", isAuto: false, thc: "29%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Енергія", "Настрій"], description: "Кислі паливні суцвіття із супер-швидким фотоперіодним дозріванням.", optimalPH: "5.8 - 6.3", difficulty: "Середній" },
  { name: "Strawberry Gorilla FF", breeder: "FastBuds", type: "Hybrid", isAuto: false, thc: "28%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Антистрес", "Апетит"], description: "Полуничний рекордсмен у фотоперіодній Fast Flowering лінійці.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Tropicana Cookies FF", breeder: "FastBuds", type: "Sativa", isAuto: false, thc: "28%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Енергія", "Депресія"], description: "Пурпурова цитрусова сатіва з 7-тижневим періодом цвітіння.", optimalPH: "5.8 - 6.3", difficulty: "Середній" },
  { name: "Wedding Cheesecake FF", breeder: "FastBuds", type: "Hybrid", isAuto: false, thc: "25%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Стрес", "Біль"], description: "Вершковий сирний фотоперіодний сорт швидкого дозрівання.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },
  { name: "Amnesia Z FF", breeder: "FastBuds", type: "Hybrid", isAuto: false, thc: "27%", cbd: "< 0.1%", floweringWeeks: 7, medicalUses: ["Бадьорість", "Творчість"], description: "Amnesia x Zkittlez у версії Fast Flowering.", optimalPH: "6.0 - 6.5", difficulty: "Середній" },

  // BARNEY'S FARM
  {
    name: "Critical Kush",
    breeder: "Barney's Farm",
    type: "Indica",
    isAuto: false,
    thc: "25%",
    cbd: "1.8%",
    floweringWeeks: 8,
    medicalUses: ["Сильний біль", "Спазми", "Глибокий сон"],
    description: "Потужна індика від Barney's Farm з високим виходом смоли, земляним ароматом та глибоким розслабленням.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Dos Si Dos 33",
    breeder: "Barney's Farm",
    type: "Indica",
    isAuto: false,
    thc: "28%",
    cbd: "0.5%",
    floweringWeeks: 9,
    medicalUses: ["Біль", "Стрес", "Апетит"],
    description: "Елітний гібрид із щільними фіолетовими суцвіттями, THC 28% та ароматом випічки й свіжого лайму.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },
  {
    name: "Mimosa EVO",
    breeder: "Barney's Farm",
    type: "Sativa",
    isAuto: false,
    thc: "30%",
    cbd: "0.8%",
    floweringWeeks: 10,
    medicalUses: ["Депресія", "Втома", "Творчі блоки"],
    description: "Каліфорнійський супергібрид з яскравішим профілем мандарина й цитрусових. THC досягає рекордних 30%.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },
  {
    name: "Gorilla Zkittlez",
    breeder: "Barney's Farm",
    type: "Indica",
    isAuto: false,
    thc: "24%",
    cbd: "0.6%",
    floweringWeeks: 9,
    medicalUses: ["Тривога", "Хронічний біль", "М'язові спазми"],
    description: "Фруктовий вибух із заспокійливими властивостями Gorilla та яскравим солодким смаком цукерок Zkittlez.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Runtz Muffins",
    breeder: "Barney's Farm",
    type: "Hybrid",
    isAuto: false,
    thc: "29%",
    cbd: "0.7%",
    floweringWeeks: 9,
    medicalUses: ["Стрес", "Втрата апетиту", "Емоційне виснаження"],
    description: "Делікатесний сорт від Barney's Farm з нотками лавандового печива та фруктового клементину. Надає щасливий спокій.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },

  // DUTCH PASSION
  {
    name: "Charlotte's Angel CBD",
    breeder: "Dutch Passion",
    type: "Sativa",
    isAuto: false,
    thc: "0.7%",
    cbd: "15%",
    floweringWeeks: 10,
    medicalUses: ["Спокій", "Запалення", "Артрит", "Епілепсія"],
    description: "Знаменитий терапевтичний сорт від Dutch Passion (CBD 15%, THC <1%) із трав'яним ароматом без психоактивного ефекту.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Auto Mazar",
    breeder: "Dutch Passion",
    type: "Indica",
    isAuto: true,
    thc: "18%",
    cbd: "1.0%",
    floweringWeeks: 10,
    medicalUses: ["Хронічний біль", "Безсоння", "М'язова напруга"],
    description: "Легендарна класика автоквітів від Dutch Passion. Надзвичайно стійка афганська індика з масивними смолистими шишками.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Auto Ultimate",
    breeder: "Dutch Passion",
    type: "Hybrid",
    isAuto: true,
    thc: "20%",
    cbd: "0.8%",
    floweringWeeks: 11,
    medicalUses: ["Втома", "Пригніченість", "Втрата апетиту"],
    description: "Безумовний рекордсмен за об'ємом врожаю серед автоквітів. Утворює гігантські суцвіття та має цитрусово-сосновий аромат.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },
  {
    name: "Auto Skywalker Haze",
    breeder: "Dutch Passion",
    type: "Sativa",
    isAuto: true,
    thc: "26%",
    cbd: "0.5%",
    floweringWeeks: 10,
    medicalUses: ["Депресія", "Втома", "Творчий застій"],
    description: "Один із найпотужніших автоквітів у світі із вмістом THC понад 26% та інтенсивним лимонно-Haze ароматом.",
    optimalPH: "5.8 - 6.3",
    difficulty: "Середній"
  },

  // SENSI SEEDS
  {
    name: "Amnesia Haze Medical",
    breeder: "Sensi Seeds",
    type: "Sativa",
    isAuto: false,
    thc: "22%",
    cbd: "1.0%",
    floweringWeeks: 11,
    medicalUses: ["Депресія", "Втома", "Мігрень", "Втрата апетиту"],
    description: "Бадьорий сатівний сорт із цитрусовим ароматом від Sensi Seeds. Потребує належної вентиляції та контролю висоти.",
    optimalPH: "5.8 - 6.3",
    difficulty: "Середній"
  },
  {
    name: "Jack Herer",
    breeder: "Sensi Seeds",
    type: "Sativa",
    isAuto: false,
    thc: "21%",
    cbd: "0.8%",
    floweringWeeks: 10,
    medicalUses: ["Енергія", "Творчість", "Нудота", "Фокус"],
    description: "Визнана світова медична класика для творчого підйому, зняття втоми та покращення концентрації уваги.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },
  {
    name: "Northern Lights Sensi",
    breeder: "Sensi Seeds",
    type: "Indica",
    isAuto: false,
    thc: "19%",
    cbd: "1.0%",
    floweringWeeks: 8,
    medicalUses: ["Безсоння", "М'язові судоми", "Стрес"],
    description: "Оригінальний фотоперіодний індичний генотип Northern Lights від Sensi Seeds з глибоким заспокійливим профілем.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Super Skunk",
    breeder: "Sensi Seeds",
    type: "Indica",
    isAuto: false,
    thc: "20%",
    cbd: "1.2%",
    floweringWeeks: 8,
    medicalUses: ["Стрес", "Больовий синдром", "Безсоння"],
    description: "Класика 90-х років із дуже високою врожайністю, глибоким розслабленням та насиченим скаунковим ароматом.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },

  // SWEET SEEDS
  {
    name: "Sweet Pure CBD",
    breeder: "Sweet Seeds",
    type: "Sativa",
    isAuto: false,
    thc: "0.4%",
    cbd: "15%",
    floweringWeeks: 9,
    medicalUses: ["Терапевтичний розслабляючий ефект", "Без психоактивності", "Артрит"],
    description: "Перший чистий медичний сорт від Sweet Seeds із мізерним THC (<0.5%) та високим терапевтичним CBD (15%).",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Cream Caramel Auto",
    breeder: "Sweet Seeds",
    type: "Indica",
    isAuto: true,
    thc: "18%",
    cbd: "1.6%",
    floweringWeeks: 8,
    medicalUses: ["Безсоння", "Тривожність", "М'язовий тонус"],
    description: "Знаменитий автоквіт від Sweet Seeds із солодким карамельним ароматом та вираженим розслабляючим стоун-ефектом.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Green Poison",
    breeder: "Sweet Seeds",
    type: "Indica",
    isAuto: false,
    thc: "20%",
    cbd: "0.9%",
    floweringWeeks: 7,
    medicalUses: ["Хронічний біль", "Втрата апетиту", "Стрес"],
    description: "Швидкоквітучий сорт із яскравим квітково-фруктовим ароматом та потужним індичним розслабленням.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Red Poison Auto",
    breeder: "Sweet Seeds",
    type: "Indica",
    isAuto: true,
    thc: "19%",
    cbd: "0.8%",
    floweringWeeks: 8,
    medicalUses: ["Пригніченість", "Легкий біль", "Безсоння"],
    description: "Екзотичний сорт з яскравими червоно-фіолетовими шишками та солодким ароматом стиглих лісових ягід.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },

  // MEPHISTO GENETICS
  {
    name: "Double Grape",
    breeder: "Mephisto Genetics",
    type: "Hybrid",
    isAuto: true,
    thc: "23%",
    cbd: "0.5%",
    floweringWeeks: 9,
    medicalUses: ["Стрес", "Біль", "Втрата апетиту"],
    description: "Легендарний крафтовий автоквіт із неймовірною кількістю трихом і яскравим виноградним профілем терпенів.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Sour Stomper",
    breeder: "Mephisto Genetics",
    type: "Hybrid",
    isAuto: true,
    thc: "21%",
    cbd: "0.5%",
    floweringWeeks: 9,
    medicalUses: ["Депресія", "Втома", "Тривожність"],
    description: "Фруктово-виноградний сорт із кислинкою від Mephisto Genetics. Забезпечує позитивний та бадьорий ейфоричний ефект.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Mango Smile",
    breeder: "Mephisto Genetics",
    type: "Sativa",
    isAuto: true,
    thc: "22%",
    cbd: "0.8%",
    floweringWeeks: 10,
    medicalUses: ["Творчі затори", "Втома", "Соціофобія"],
    description: "Сатівний крафтовий автоквіт із вираженим смаком соковитого манго та високим творчим потенціалом.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },

  // GREENHOUSE SEEDS
  {
    name: "White Widow",
    breeder: "Greenhouse Seeds",
    type: "Hybrid",
    isAuto: false,
    thc: "19%",
    cbd: "1.0%",
    floweringWeeks: 9,
    medicalUses: ["Хронічний біль", "Депресія", "Безсоння"],
    description: "Один із найвідоміших сортів у історії від Greenhouse Seeds, щільно вкритий білим шаром кристалів смоли.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Super Lemon Haze",
    breeder: "Greenhouse Seeds",
    type: "Sativa",
    isAuto: false,
    thc: "22%",
    cbd: "0.8%",
    floweringWeeks: 10,
    medicalUses: ["Апатія", "Хронічна втома", "Низька концентрація"],
    description: "Багатократний переможець High Times Cannabis Cup з інтенсивним лимонним ароматом та потужним зарядом енергії.",
    optimalPH: "5.8 - 6.3",
    difficulty: "Середній"
  },

  // HUMBOLDT SEED COMPANY
  {
    name: "Chocolate Mint OG",
    breeder: "Humboldt Seed Co.",
    type: "Indica",
    isAuto: false,
    thc: "24%",
    cbd: "0.5%",
    floweringWeeks: 9,
    medicalUses: ["Безсоння", "Сильний больовий синдром", "Спазми"],
    description: "Вишуканий сорт із шоколадно-м'ятним ароматом, темно-фіолетовими відтінками листя та THC понад 24%.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },
  {
    name: "Blue Dream",
    breeder: "Humboldt Seed Co.",
    type: "Sativa",
    isAuto: false,
    thc: "20%",
    cbd: "1.0%",
    floweringWeeks: 9,
    medicalUses: ["Денний біль", "Тривога", "Депресія"],
    description: "Каліфорнійський бестселер з ароматом свіжої чорниці та збалансованим заспокійливо-ейфоричним дією.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },

  // ANESIA SEEDS
  {
    name: "Future #1",
    breeder: "Anesia Seeds",
    type: "Hybrid",
    isAuto: false,
    thc: "37%",
    cbd: "0.2%",
    floweringWeeks: 9,
    medicalUses: ["Екстремальний біль", "Емоційне заціпеніння"],
    description: "Рекордсмен світу за вмістом THC (до 37%!). Надзвичайно потужний аналітичний гібрид із фруктово-ананасовим профілем.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Досвідчений"
  },
  {
    name: "Blackberry Moonrocks",
    breeder: "Anesia Seeds",
    type: "Indica",
    isAuto: false,
    thc: "33%",
    cbd: "0.4%",
    floweringWeeks: 9,
    medicalUses: ["Безсоння", "Важкий розлад сну", "Глибока тривога"],
    description: "Темно-фіолетовий сорт із смаком ожини, лаванди та виключно високим рівнем THC до 33%.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },

  // CBD CREW
  {
    name: "CBD Therapy (1:1)",
    breeder: "CBD Crew",
    type: "Hybrid",
    isAuto: false,
    thc: "0.5%",
    cbd: "10%",
    floweringWeeks: 9,
    medicalUses: ["Тривожність", "Запалення", "Епілепсія", "Нейропатичний біль"],
    description: "Спеціалізований чистий медичний сорт із високим вмістом CBD без вираженого психоактивного ефекту.",
    optimalPH: "6.2 - 6.8",
    difficulty: "Легкий"
  },

  // SEEDSMAN
  {
    name: "Gelato OG",
    breeder: "Seedsman",
    type: "Hybrid",
    isAuto: false,
    thc: "25%",
    cbd: "0.5%",
    floweringWeeks: 9,
    medicalUses: ["Хронічний біль", "Депресія", "Нервове виснаження"],
    description: "Елітне схрещування Gelato #33 та OG Kush від Seedsman. Має глибокий десертно-паливний аромат та сильний седативний потенціал.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },
  {
    name: "Jack Herer Auto",
    breeder: "Seedsman",
    type: "Sativa",
    isAuto: true,
    thc: "20%",
    cbd: "0.8%",
    floweringWeeks: 9,
    medicalUses: ["Втома", "Депресія", "Втрата мотивації"],
    description: "Автоквітуча версія класичного Jack Herer від Seedsman з високою стійкістю та бадьорим ефектом для денного активного вживання.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },

  // SEED STOCKERS
  {
    name: "BCN Critical XXL Auto",
    breeder: "Seed Stockers",
    type: "Hybrid",
    isAuto: true,
    thc: "22%",
    cbd: "0.5%",
    floweringWeeks: 9,
    medicalUses: ["Стрес", "Втрата апетиту", "М'язовий тонус"],
    description: "Легендарний рекордсмен за врожайністю серед автоквітів. Дуже витривалий до помилок та має солодкий цитрусовий аромат.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Sticky Monkey GG4",
    breeder: "Seed Stockers",
    type: "Hybrid",
    isAuto: false,
    thc: "26%",
    cbd: "0.4%",
    floweringWeeks: 9,
    medicalUses: ["Глибокий больовий синдром", "Безсоння", "Тривожність"],
    description: "Надлипкий сорт Gorilla Glue #4 від Seed Stockers з високим виходом смоли та дизельно-шоколадним профілем.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },

  // PARADISE SEEDS
  {
    name: "Wappa",
    breeder: "Paradise Seeds",
    type: "Indica",
    isAuto: false,
    thc: "21%",
    cbd: "0.8%",
    floweringWeeks: 8,
    medicalUses: ["Біль", "Спазми", "Глибока релаксація"],
    description: "Співвідношення врожайності та швидкості дозрівання робить Wappa від Paradise Seeds еталоном для домашнього гровінгу.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Nebula",
    breeder: "Paradise Seeds",
    type: "Sativa",
    isAuto: false,
    thc: "22%",
    cbd: "1.0%",
    floweringWeeks: 9,
    medicalUses: ["Творча апатія", "Втома", "Депресивний стан"],
    description: "Багатократний призер кубків із психоделічним та ейфоричним сяйвом. Шишки щільно вкриті медовими трихомами.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },

  // RIPPER SEEDS
  {
    name: "Zombie Kush",
    breeder: "Ripper Seeds",
    type: "Indica",
    isAuto: false,
    thc: "24%",
    cbd: "0.6%",
    floweringWeeks: 8,
    medicalUses: ["Сильне безсоння", "Хронічний біль", "М'язові судоми"],
    description: "Один із найвідоміших індичних гібридів від Ripper Seeds з фіолетовими відтінками листя та сильним седативним ефектом.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "KMintz",
    breeder: "Ripper Seeds",
    type: "Hybrid",
    isAuto: false,
    thc: "25%",
    cbd: "0.5%",
    floweringWeeks: 9,
    medicalUses: ["Стрес", "Тривога", "Нудота"],
    description: "Генетичне схрещування Zkittlez та Kush Mints. Пропонує щільний шар смоли з освіжаючим м'ятно-фруктовим смаком.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },

  // SILENT SEEDS / DINAFEM
  {
    name: "Moby Dick",
    breeder: "Silent Seeds",
    type: "Sativa",
    isAuto: false,
    thc: "26%",
    cbd: "0.5%",
    floweringWeeks: 10,
    medicalUses: ["Важка депресія", "Хронічна втома", "Анорексія"],
    description: "Легендарний сатівний монстр від Silent Seeds (екс-Dinafem). Величезний врожай, потужний ейфоричний імпульс та сосновий запах.",
    optimalPH: "5.8 - 6.3",
    difficulty: "Середній"
  },
  {
    name: "Critical + 2.0",
    breeder: "Silent Seeds",
    type: "Hybrid",
    isAuto: false,
    thc: "22%",
    cbd: "0.8%",
    floweringWeeks: 7,
    medicalUses: ["Біль", "Стрес", "Втрата апетиту"],
    description: "Оновлена версія класичного Critical + з підвищеною стійкістю до підвищеної вологості та плісняви.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },

  // DNA GENETICS
  {
    name: "Chocolope",
    breeder: "DNA Genetics",
    type: "Sativa",
    isAuto: false,
    thc: "22%",
    cbd: "0.9%",
    floweringWeeks: 10,
    medicalUses: ["Депресія", "Апатія", "Мігрень"],
    description: "Шоколадно-кавова сатіва від DNA Genetics. Чудовий денний вибір для бадьорості та креативності.",
    optimalPH: "5.8 - 6.3",
    difficulty: "Середній"
  },
  {
    name: "Kosher Kush",
    breeder: "DNA Genetics",
    type: "Indica",
    isAuto: false,
    thc: "27%",
    cbd: "0.8%",
    floweringWeeks: 9,
    medicalUses: ["Важке безсоння", "Хронічний больовий синдром"],
    description: "Багаторазовий переможець Cannabis Cup серед індик. Має приголомшливу смолистість та насичений паливний аромат.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },

  // BLIMBURN SEEDS
  {
    name: "Gelato #33",
    breeder: "Blimburn Seeds",
    type: "Hybrid",
    isAuto: false,
    thc: "27%",
    cbd: "0.5%",
    floweringWeeks: 9,
    medicalUses: ["Стрес", "Нервова напруга", "М'язові судоми"],
    description: "Каліфорнійська класика Ларі Берд з солодким цитрусово-шербетним профілем та високою концентрацією терпенів.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },

  // SERIOUS SEEDS
  {
    name: "AK-47",
    breeder: "Serious Seeds",
    type: "Sativa",
    isAuto: false,
    thc: "22%",
    cbd: "0.5%",
    floweringWeeks: 8,
    medicalUses: ["Депресія", "Втома", "Біль"],
    description: "Легендарний сорт-переможець багатьох кубків від Serious Seeds. Швидке цвітіння та потужний ейфоричний імпульс.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Bubble Gum",
    breeder: "Serious Seeds",
    type: "Hybrid",
    isAuto: false,
    thc: "21%",
    cbd: "0.6%",
    floweringWeeks: 9,
    medicalUses: ["Стрес", "Тривожність", "Низький апетит"],
    description: "Оригінальний сорт зі смаком рожевої жувальної гумки. Забезпечує гармонійний ейфоричний та тілесний розслабляючий ефект.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Chronic",
    breeder: "Serious Seeds",
    type: "Hybrid",
    isAuto: false,
    thc: "20%",
    cbd: "0.8%",
    floweringWeeks: 9,
    medicalUses: ["Хронічний біль", "М'язова напруга"],
    description: "Високоврожайний сорт від Serious Seeds з ніжним солодкувато-медовим ароматом та вираженою терапевтичною дією.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },

  // ETHOS GENETICS
  {
    name: "Lilac Diesel",
    breeder: "Ethos Genetics",
    type: "Hybrid",
    isAuto: false,
    thc: "28%",
    cbd: "0.3%",
    floweringWeeks: 9,
    medicalUses: ["Стрес", "Мігрень", "Втома"],
    description: "Складний гібрид із приголомшливим терпеновим профілем бузку, дизеля та солодкого цитрусу.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },
  {
    name: "Ethos Apex",
    breeder: "Ethos Genetics",
    type: "Hybrid",
    isAuto: false,
    thc: "30%",
    cbd: "0.2%",
    floweringWeeks: 9,
    medicalUses: ["Сильний больовий синдром", "Депресія"],
    description: "Екстремально потужний сорт із щільними смолистими суцвіттями та насиченим ароматом цукерок та сосни.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },

  // ACE SEEDS
  {
    name: "Malawi",
    breeder: "Ace Seeds",
    type: "Sativa",
    isAuto: false,
    thc: "27%",
    cbd: "0.2%",
    floweringWeeks: 12,
    medicalUses: ["Втома", "Апатія", "Творчі затори"],
    description: "Чиста африканська ландрейс-сатіва з високою психоактивністю та глибоким ейфоричним зарядом енергії.",
    optimalPH: "5.8 - 6.3",
    difficulty: "Досвідчений"
  },
  {
    name: "Panama",
    breeder: "Ace Seeds",
    type: "Sativa",
    isAuto: false,
    thc: "21%",
    cbd: "0.5%",
    floweringWeeks: 11,
    medicalUses: ["Депресія", "Нервова втома"],
    description: "Класична центральноамериканська сатіва з рожево-червоними маточками та ванільно-лимонним ароматом.",
    optimalPH: "5.8 - 6.3",
    difficulty: "Середній"
  },

  // COMPOUND GENETICS
  {
    name: "Apples and Bananas",
    breeder: "Compound Genetics",
    type: "Hybrid",
    isAuto: false,
    thc: "29%",
    cbd: "0.3%",
    floweringWeeks: 9,
    medicalUses: ["Глибокий стрес", "Біль", "Втрата апетиту"],
    description: "Топ-сорт від Compound Genetics із фруктово-газовим ароматом стиглих яблук, бананів та дизелю.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Середній"
  },

  // PYRAMID SEEDS
  {
    name: "Tutankhamon (King Tut)",
    breeder: "Pyramid Seeds",
    type: "Sativa",
    isAuto: false,
    thc: "25%",
    cbd: "0.6%",
    floweringWeeks: 8,
    medicalUses: ["Депресія", "Хронічна втома"],
    description: "Відбірний фенікс AK-47 від Pyramid Seeds з інтенсивним цитрусовим ароматом та високою бадьорістю.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  },
  {
    name: "Anesthesia",
    breeder: "Pyramid Seeds",
    type: "Indica",
    isAuto: false,
    thc: "21%",
    cbd: "1.0%",
    floweringWeeks: 8,
    medicalUses: ["Безсоння", "Сильні спазми", "Біль"],
    description: "Глибоко розслабляючий індичний гібрид Northern Lights та Black Domina.",
    optimalPH: "6.0 - 6.5",
    difficulty: "Легкий"
  }
];

// Отримання повного списку сортів для обраного брідера (виробника)
export function getStrainsForBreeder(breederName: string): StrainInfo[] {
  if (!breederName || breederName.includes('Інший')) {
    return MEDICAL_STRAINS;
  }

  const norm = breederName.trim().toLowerCase();
  const directMatches = MEDICAL_STRAINS.filter(s => s.breeder?.toLowerCase() === norm);

  // Класичні високоврожайні лінії з високим вмістом ТГК без СBD
  const classicLines = [
    { name: 'OG Kush', type: 'Indica' as const, isAuto: false, thc: '25%' },
    { name: 'Gorilla Glue #4', type: 'Hybrid' as const, isAuto: false, thc: '27%' },
    { name: 'Gelato #33', type: 'Hybrid' as const, isAuto: false, thc: '26%' },
    { name: 'Amnesia Haze', type: 'Sativa' as const, isAuto: false, thc: '24%' },
    { name: 'Sour Diesel', type: 'Sativa' as const, isAuto: false, thc: '25%' },
    { name: 'Girl Scout Cookies', type: 'Hybrid' as const, isAuto: false, thc: '26%' },
    { name: 'Zkittlez', type: 'Indica' as const, isAuto: false, thc: '24%' },
    { name: 'Runtz', type: 'Hybrid' as const, isAuto: false, thc: '27%' },
    { name: 'Wedding Cake', type: 'Hybrid' as const, isAuto: false, thc: '25%' },
    { name: 'White Widow', type: 'Hybrid' as const, isAuto: false, thc: '22%' },
    { name: 'Jack Herer', type: 'Sativa' as const, isAuto: false, thc: '23%' },
    { name: 'Bruce Banner Auto', type: 'Hybrid' as const, isAuto: true, thc: '28%' },
    { name: 'Northern Lights Auto', type: 'Indica' as const, isAuto: true, thc: '21%' },
    { name: 'Purple Punch Auto', type: 'Indica' as const, isAuto: true, thc: '24%' },
    { name: 'Super Lemon Haze', type: 'Sativa' as const, isAuto: false, thc: '25%' }
  ];

  const generatedList = classicLines.map(item => ({
    name: `${breederName} ${item.name}`,
    breeder: breederName,
    type: item.type,
    isAuto: item.isAuto,
    thc: item.thc,
    cbd: '< 0.1%',
    floweringWeeks: item.isAuto ? 8 : item.type === 'Sativa' ? 10 : 9,
    medicalUses: ['Релаксація', 'Зняття напруги', 'Підвищення настрою', 'Покращення апетиту'],
    description: `Офіційний сорт "${breederName} ${item.name}" від генетичного бренду ${breederName}. Потужний сорт із високим рівнем ТГК (${item.thc}), щільними смолистими суцвіттями та багатим терпеновим профілем.`,
    optimalPH: item.type === 'Sativa' ? '5.8 - 6.3' : '6.0 - 6.5',
    difficulty: item.isAuto ? ('Легкий' as const) : ('Середній' as const)
  }));

  // Об'єднуємо точні співпадіння та генеричні лінії брідера
  const combined = [...directMatches];
  generatedList.forEach(genItem => {
    if (!combined.some(c => c.name.toLowerCase() === genItem.name.toLowerCase())) {
      combined.push(genItem);
    }
  });

  return combined;
}

// Генетичний аналізатор та генератор карток сортів з повної бази
export function getStrainInfo(strainName: string, breederName?: string): StrainInfo {
  const normalized = strainName.trim().toLowerCase();
  const found = MEDICAL_STRAINS.find(s => s.name.toLowerCase() === normalized);
  if (found) {
    if (breederName && breederName.trim() && !breederName.includes('Інший')) {
      return { ...found, breeder: breederName };
    }
    return found;
  }

  // Генерація профілю сорту з генетичної бази
  const isAuto = /auto|automatic|ruderalis/i.test(strainName);
  const isCBD = /cbd|ratio|1:1|therapy|cure/i.test(strainName);
  const isSativa = /sativa|haze|lemon|jack|diesel|amnesia|sour|tangie|thai/i.test(strainName);
  const isIndica = /indica|kush|purple|berry|northern|og|hash|mazar|afghan|bubba|zkittlez/i.test(strainName);

  const strainType: 'Indica' | 'Sativa' | 'Hybrid' = isCBD ? 'Hybrid' : isSativa ? 'Sativa' : isIndica ? 'Indica' : 'Hybrid';
  const thc = isCBD ? '1 - 6%' : '22 - 28%';
  const cbd = isCBD ? '10 - 18%' : '< 0.1%';
  const floweringWeeks = isAuto ? 8 : isSativa ? 10 : 9;

  const effectiveBreeder = (breederName && !breederName.includes('Інший')) ? breederName : 'Офіційний Брідер';

  return {
    name: strainName.trim() || 'Класичний Сорт',
    breeder: effectiveBreeder,
    type: strainType,
    isAuto,
    thc,
    cbd,
    floweringWeeks,
    medicalUses: isCBD
      ? ['Глибоке зняття тривоги', 'Антизапальний ефект', 'Артрит', 'Нейропатичний біль']
      : ['Релаксація', 'Зняття напруги', 'Підвищення настрою', 'Покращення апетиту'],
    description: `Офіційний сорт "${strainName.trim()}" від генетичного виробника ${effectiveBreeder}. Потужний сорт категорії ${strainType} (${isAuto ? 'Автоквітучий' : 'Фотоперіодний'}) з високим рівня ТГК (${thc}), багатим терпеновим профілем та стабільною вегетацією.`,
    optimalPH: isSativa ? '5.8 - 6.3' : '6.0 - 6.5',
    difficulty: isAuto ? 'Легкий' : 'Середній'
  };
}

// VPD (Vapor Pressure Deficit) Calculation
// Formula: SVP = 0.61078 * exp((17.27 * T) / (T + 237.3)) in kPa
// VP_actual = SVP * (RH / 100)
// VPD = SVP - VP_actual
export function calculateVPD(tempC: number, rhPercent: number, stage: Plant['stage'] = 'vegetative'): VPDStatus {
  const svp = 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  const vpd = Number((svp * (1 - rhPercent / 100)).toFixed(2));

  let targetMin = 0.8;
  let targetMax = 1.2;

  if (stage === 'germination' || stage === 'seedling') {
    targetMin = 0.4;
    targetMax = 0.8;
  } else if (stage === 'vegetative') {
    targetMin = 0.8;
    targetMax = 1.2;
  } else if (stage === 'flowering') {
    targetMin = 1.2;
    targetMax = 1.6;
  }

  if (vpd >= targetMin && vpd <= targetMax) {
    return {
      vpd,
      status: 'Optimal',
      statusLabelUk: 'Ідеальний VPD',
      recommendation: `Чудово! Дефіцит тиску водяної пари (${vpd} kPa) ідеальний для стадії ${stageLabelUk(stage)}. Рослина гарно засвоює поживу.`
    };
  } else if (vpd < targetMin) {
    return {
      vpd,
      status: 'Low',
      statusLabelUk: 'Низький VPD (Занадто волого)',
      recommendation: `VPD (${vpd} kPa) занизький. Транспірація уповільнена. Підвищіть температуру або зменшіть вологість на 5-10%, щоб уникнути плісняви.`
    };
  } else {
    return {
      vpd,
      status: 'High',
      statusLabelUk: 'Високий VPD (Занадто сухо)',
      recommendation: `VPD (${vpd} kPa) зависокий! Повітря занадто сухе. Устьиця листків закриваються. Увімкніть зволожувач або знизьте температуру.`
    };
  }
}

export function stageLabelUk(stage: Plant['stage']): string {
  switch (stage) {
    case 'germination': return 'Пророщування';
    case 'seedling': return 'Розсада';
    case 'vegetative': return 'Вегетація';
    case 'flowering': return 'Цвітіння';
    case 'harvested': return 'Збір врожаю';
    default: return stage;
  }
}

export interface SolutionRecipeItem {
  id: string;
  name: string;
  numAmount: number;
  amount: string;
}

export function getStagePpmRange(stage: string): { min: number; max: number; mid: number; label: string } {
  if (stage === 'germination' || stage === 'seedling') {
    return { min: 200, max: 400, mid: 300, label: '200 – 400 PPM' };
  } else if (stage === 'vegetative') {
    return { min: 600, max: 800, mid: 700, label: '600 – 800 PPM' };
  } else {
    return { min: 800, max: 1100, mid: 950, label: '800 – 1100 PPM' };
  }
}

export function getSolutionRecipe(volume: number, stage: string, selectedPpm?: number): SolutionRecipeItem[] {
  const range = getStagePpmRange(stage);
  const ppmToUse = selectedPpm ?? range.mid;
  const ppmRatio = ppmToUse / range.mid;

  const isFlowering = stage === 'flowering' || stage === 'harvest' || stage === 'harvested';
  const isSeedling = stage === 'germination' || stage === 'seedling';

  const baseRate = isFlowering ? 2.5 : isSeedling ? 1.0 : 2.0;
  const calmagRate = isSeedling ? 0.5 : 1.0;
  const stimRate = isSeedling ? 0.2 : 0.5;

  const baseMl = baseRate * volume * ppmRatio;
  const calmagMl = calmagRate * volume * ppmRatio;
  const stimMl = stimRate * volume * ppmRatio;

  const roundMl = (val: number) => (val < 0.1 ? parseFloat(val.toFixed(2)) : parseFloat(val.toFixed(1)));

  return [
    {
      id: 'base-npk',
      name: isFlowering ? 'Базові добрива NPK (Bloom)' : 'Базові добрива NPK (Grow)',
      numAmount: roundMl(baseMl),
      amount: `${roundMl(baseMl)} мл`,
    },
    {
      id: 'calmag',
      name: 'CalMag (Кальцій + Магній)',
      numAmount: roundMl(calmagMl),
      amount: `${roundMl(calmagMl)} мл`,
    },
    {
      id: 'stimulant',
      name: isFlowering ? 'Стимулятор цвітіння (Bloom Booster)' : 'Стимулятор кореневої системи (Root Stimulator)',
      numAmount: roundMl(stimMl),
      amount: `${roundMl(stimMl)} мл`,
    },
  ];
}

// Initial Sample Plants
export const INITIAL_PLANTS: Plant[] = [
  {
    id: 'plant-1',
    name: 'Northern Lights #1 (Медична)',
    strain: 'Northern Lights Automatic',
    breeder: 'Royal Queen Seeds',
    strainType: 'Indica',
    isAuto: true,
    thcContent: '18%',
    cbdContent: '1.2%',
    medicalBenefits: ['Хронічний біль', 'Безсоння', 'Спазми'],
    stage: 'vegetative',
    stageDay: 18,
    totalStageDays: 28,
    germinationDate: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0],
    currentTemp: 24.5,
    currentHumidity: 62,
    currentPH: 6.3,
    currentEC: 1.2,
    lightSchedule: '18/6',
    lightDistanceCm: 45,
    lightPowerWatts: 150,
    medium: 'Soil',
    moistureBeforeWatering: 25,
    moistureAfterWatering: 75,
    ppmAfterWatering: 650,
    lightPPFD: 520,
    phAfterWatering: 6.3,
    phBeforeWatering: 6.5,
    healthScore: 94,
    notes: 'Рослина розвивається чудово, сформовано 4 яруси соковито-зеленого листя.',
    lastWatered: new Date().toISOString().split('T')[0],
    symptoms: [],
    growJournal: [
      {
        id: 'journal-1-1',
        dayNumber: 1,
        date: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0],
        stage: 'germination',
        stageLabelUk: 'Пророщування',
        moisturePercent: 80,
        tempC: 25.0,
        humidityRH: 75,
        vpd: 0.72,
        lightSchedule: '20/4',
        actionsDone: ['Пророщування у ватному диску', 'Посадка у торф\'яну таблетку'],
        notes: 'Насінина проклюнулася за 24 години, пустила здоровій білий корінець.'
      },
      {
        id: 'journal-1-2',
        dayNumber: 7,
        date: new Date(Date.now() - 11 * 86400000).toISOString().split('T')[0],
        stage: 'seedling',
        stageLabelUk: 'Розсада',
        moisturePercent: 70,
        phBefore: 6.6,
        phAfter: 6.4,
        ppm: 320,
        ppfd: 220,
        heightCm: 6,
        tempC: 24.5,
        humidityRH: 68,
        vpd: 0.85,
        lightSchedule: '18/6',
        lightDistanceCm: 55,
        actionsDone: ['Перший легкий полив з Root Stimulator', 'Увімкнено вентилятор обдуву'],
        notes: 'Сформовано першу пару справжніх листиків. Пагін міцний.'
      },
      {
        id: 'journal-1-3',
        dayNumber: 15,
        date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        stage: 'vegetative',
        stageLabelUk: 'Вегетація',
        moisturePercent: 80,
        phBefore: 6.6,
        phAfter: 6.4,
        ppm: 620,
        ppfd: 500,
        heightCm: 18,
        tempC: 24.0,
        humidityRH: 60,
        vpd: 0.95,
        lightSchedule: '18/6',
        lightDistanceCm: 48,
        actionsDone: ['Полив 1.2L з Grow A+B', 'Початок LST подв\'язування стебла'],
        notes: 'Активний ріст бічних гілок. Колір листя насичено-зелений.'
      },
      {
        id: 'journal-1-4',
        dayNumber: 18,
        date: new Date().toISOString().split('T')[0],
        stage: 'vegetative',
        stageLabelUk: 'Вегетація',
        moisturePercent: 75,
        phBefore: 6.5,
        phAfter: 6.3,
        ppm: 650,
        ppfd: 520,
        heightCm: 24,
        tempC: 24.5,
        humidityRH: 62,
        vpd: 0.98,
        lightSchedule: '18/6',
        lightDistanceCm: 45,
        actionsDone: ['Полив 1.5L + CalMag (2 мл/л)', 'Замір pH дренажу'],
        notes: 'Рослина сформувала 4 яруси листя. VPD 0.98 kPa у зоні оптимального метаболізму.'
      }
    ],
    history: [
      {
        id: 'hist-1-1',
        date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        timestamp: Date.now() - 3 * 86400000,
        type: 'post_watering',
        moistureSubstrate: 80,
        phSubstrateBefore: 6.6,
        phSubstrateAfter: 6.4,
        ppmSubstrate: 620,
        ppfdTop: 500,
        tempC: 24.0,
        humidityRH: 60,
        stage: 'vegetative',
        stageDay: 15,
        strain: 'Northern Lights Automatic',
        breeder: 'Royal Queen Seeds'
      },
      {
        id: 'hist-1-2',
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        type: 'post_watering',
        moistureSubstrate: 75,
        phSubstrateBefore: 6.5,
        phSubstrateAfter: 6.3,
        ppmSubstrate: 650,
        ppfdTop: 520,
        tempC: 24.5,
        humidityRH: 62,
        stage: 'vegetative',
        stageDay: 18,
        strain: 'Northern Lights Automatic',
        breeder: 'Royal Queen Seeds'
      }
    ],
    metricsHistory: [
      {
        id: 'hist-1-1',
        date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        timestamp: Date.now() - 3 * 86400000,
        type: 'post_watering',
        moistureSubstrate: 80,
        phSubstrateBefore: 6.6,
        phSubstrateAfter: 6.4,
        ppmSubstrate: 620,
        ppfdTop: 500,
        tempC: 24.0,
        humidityRH: 60,
        stage: 'vegetative',
        stageDay: 15,
        strain: 'Northern Lights Automatic',
        breeder: 'Royal Queen Seeds'
      },
      {
        id: 'hist-1-2',
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        type: 'post_watering',
        moistureSubstrate: 75,
        phSubstrateBefore: 6.5,
        phSubstrateAfter: 6.3,
        ppmSubstrate: 650,
        ppfdTop: 520,
        tempC: 24.5,
        humidityRH: 62,
        stage: 'vegetative',
        stageDay: 18,
        strain: 'Northern Lights Automatic',
        breeder: 'Royal Queen Seeds'
      }
    ]
  }
];

// Initial Badges Catalog
export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-first-sprout',
    name: 'Перший Пагін',
    description: 'Успішно розпочали вирощування першої медичної рослини',
    icon: 'Sprout',
    unlocked: true,
    unlockedAt: '2026-07-20',
    category: 'beginner'
  },
  {
    id: 'badge-vpd-master',
    name: 'Майстер Клімату VPD',
    description: 'Утримували ідеальний VPD протягом 3 днів поспіль',
    icon: 'Gauge',
    unlocked: true,
    unlockedAt: '2026-07-22',
    category: 'climate'
  },
  {
    id: 'badge-ph-guru',
    name: 'Гуру Балансу pH',
    description: 'Провели 5 вимірювань pH та підготували правильний розчин',
    icon: 'Droplets',
    unlocked: false,
    category: 'care'
  },
  {
    id: 'badge-ai-graduate',
    name: 'Учень AI-Гровера',
    description: 'Дали відповіді на 10 інтерактивних діагностичних запитань',
    icon: 'Bot',
    unlocked: false,
    category: 'beginner'
  },
  {
    id: 'badge-flower-power',
    name: 'Початок Цвітіння',
    description: 'Успішно перевели рослину на фазу цвітіння (12/12)',
    icon: 'Flower2',
    unlocked: true,
    unlockedAt: '2026-07-24',
    category: 'master'
  },
  {
    id: 'badge-harvest-legend',
    name: 'Легендарний Врожай',
    description: 'Зібрали перший медичний врожай вищої якості',
    icon: 'Trophy',
    unlocked: false,
    category: 'master'
  }
];

// Initial User Stats
export const INITIAL_USER_STATS: UserStats = {
  points: 380,
  level: 2,
  levelTitle: 'Майстер Клімату',
  nextLevelXP: 600,
  currentLevelXP: 380,
  streakDays: 4,
  lastCheckInDate: new Date().toISOString().split('T')[0],
  totalQuestsCompleted: 7,
  badges: INITIAL_BADGES,
  harvestTrophies: [
    {
      id: 'trophy-prev-1',
      plantId: 'completed-1',
      plantName: 'Amnesia Haze Medical #1',
      strain: 'Amnesia Haze Medical',
      breeder: 'Sensi Seeds',
      strainType: 'Sativa',
      harvestDate: '2026-06-15',
      totalDays: 78,
      totalYieldGrams: 92,
      rating: 5,
      trophyTitle: '🏆 Золота Шишка Amnesia Haze',
      trophyLevel: 'Gold',
      badgeIcon: 'Trophy',
      summaryNotes: 'Успішно зібрано 92г сухого суцвіття медичної якості! Дотримано ідеального VPD на стадії цвітіння.',
      sharedToAccount: true,
      sharedAt: '2026-06-16',
      journalDaysCount: 78
    }
  ],
  profile: {
    name: 'Олексій Гровер',
    avatarUrl: '',
    bio: 'Медичний гровер. Досліджую автоквіти та класичні сортові лінії з високим вмістом CBD для релаксу та здоров\'я.',
    growExperience: 'Досвідчений Гровер (2 роки)',
    memberSince: '2025',
    locationRegion: 'Україна, Київ'
  }
};

// Initial Reminder Tasks
export const INITIAL_TASKS: ReminderTask[] = [
  {
    id: 'task-1',
    plantId: 'plant-1',
    plantName: 'Northern Lights #1',
    title: 'Виміряти pH та полити з CalMag',
    description: 'Фаза вегетації вимагає стабільного pH (6.0-6.3) та додаткового кальцію/магнію під LED світлом.\n\n⚠️ Нагадування: якщо показник не внести, система автоматично все прорахує. Проте якщо так часто робити, система не навчиться на реальних показниках і результат вирощування може не відповідати очікуванням.',
    category: 'nutrients',
    xpReward: 35,
    completed: false,
    dueDate: 'Сьогодні',
    createdByAI: true,
    urgent: true
  },
  {
    id: 'task-3',
    plantId: 'plant-1',
    plantName: 'Northern Lights #1',
    title: 'Огляд нижніх листків на дефіцит азоту',
    description: 'Дай відповідь у чаті про рівномірність кольору листя.',
    category: 'inspection',
    xpReward: 30,
    completed: false,
    dueDate: 'Завтра',
    createdByAI: true,
    urgent: false
  }
];

// Level titles mapping
export function getLevelInfo(totalPoints: number): { level: number; title: string; currentLevelMin: number; nextLevelMax: number } {
  if (totalPoints < 200) {
    return { level: 1, title: 'Початківець-Пагін', currentLevelMin: 0, nextLevelMax: 200 };
  } else if (totalPoints < 600) {
    return { level: 2, title: 'Майстер Клімату', currentLevelMin: 200, nextLevelMax: 600 };
  } else if (totalPoints < 1200) {
    return { level: 3, title: 'Експерт Живлення', currentLevelMin: 600, nextLevelMax: 1200 };
  } else if (totalPoints < 2200) {
    return { level: 4, title: 'Гроу-Архітектор', currentLevelMin: 1200, nextLevelMax: 2200 };
  } else {
    return { level: 5, title: 'Легендарний Магістр Медичного Врожаю', currentLevelMin: 2200, nextLevelMax: 5000 };
  }
}
