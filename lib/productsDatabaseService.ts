import { NutrientManufacturer } from './nutrientData';
import { SubstrateManufacturer, SUBSTRATE_MANUFACTURERS } from './substrateData';
import { ProductCategory61, NutrientProduct } from './types';

// ============================================================================
// FULL 61 PRODUCT CATEGORIES DATABASE (GrowDiaries & Global Industry Standard)
// ============================================================================
export const PRODUCT_CATEGORIES_61: ProductCategory61[] = [
  // 1-8: BASE NUTRIENTS & MAIN FORMULAS
  {
    id: 'cat-01-base-soil',
    codeNumber: 1,
    nameUk: 'Базові добрива для Ґрунту (Soil Base)',
    nameEn: 'Soil Base Nutrients',
    group: 'Nutrients',
    description: 'Основа живлення у торф’яних та ґрунтових субстратах для вегетації й цвітіння (Terra Vega, Bio-Grow, Soil A+B).',
    icon: '🪴'
  },
  {
    id: 'cat-02-base-coco',
    codeNumber: 2,
    nameUk: 'Базові добрива для Кокосу (Coco Base)',
    nameEn: 'Coco Coir Base Nutrients',
    group: 'Nutrients',
    description: 'Спеціалізовані комплекси для кокосового волокна з компенсацією зв’язування Ca/Mg (Sensi Coco, Coco A+B).',
    icon: '🥥'
  },
  {
    id: 'cat-03-base-hydro',
    codeNumber: 3,
    nameUk: 'Базові добрива для Гідропоніки (Hydro Base)',
    nameEn: 'Hydroponic Base Nutrients',
    group: 'Nutrients',
    description: 'Ультрачисті мінеральні комплекси для DWC, NFT, аеропоніки та рециркуляційних систем без осаду (TriPart, Hydro A+B).',
    icon: '💧'
  },
  {
    id: 'cat-04-1part-base',
    codeNumber: 4,
    nameUk: 'Однокомпонентні базові добрива (1-Part Base)',
    nameEn: '1-Part Base Nutrients',
    group: 'Nutrients',
    description: 'Зручні рідкі або порошкові формули "все в одному ботлі" для простих схем живлення.',
    icon: '🧪'
  },
  {
    id: 'cat-05-2part-ab-base',
    codeNumber: 5,
    nameUk: 'Двокомпонентні базові добрива A+B (2-Part Base)',
    nameEn: '2-Part A+B Base Nutrients',
    group: 'Nutrients',
    description: 'Класичні роздільні бакові суміші Part A та Part B для запобігання випаданню кальцію та фосфору в осад.',
    icon: '🅰️'
  },
  {
    id: 'cat-06-3part-micro-grow-bloom',
    codeNumber: 6,
    nameUk: 'Трикомпонентна база Micro-Grow-Bloom (3-Part)',
    nameEn: '3-Part Micro-Grow-Bloom',
    group: 'Nutrients',
    description: 'Гнучкі трикомпонентні системи для точного контролю пропорцій N-P-K на будь-якому етапі життя.',
    icon: '📐'
  },
  {
    id: 'cat-07-organic-base',
    codeNumber: 7,
    nameUk: 'Органічні базові добрива (Organic Base)',
    nameEn: '100% Organic Base Nutrients',
    group: 'Nutrients',
    description: 'Сертифіковані біологічні добрива на основі екстрактів цукрового буряка, барди та рибних гідролізатів (BioBizz Bio-Grow, Iguana Juice).',
    icon: '🍃'
  },
  {
    id: 'cat-08-powder-dry-base',
    codeNumber: 8,
    nameUk: 'Сухі водорозчинні добрива (Dry/Powder Base)',
    nameEn: 'Powder & Soluble Dry Base',
    group: 'Nutrients',
    description: 'Висококонцентровані суходози та порошки для великих об’ємів та комерційних теплиць (Green House Powder Feeding, Athena Pro Line).',
    icon: '📦'
  },

  // 9-16: ROOT & VEGETATIVE STIMULATORS
  {
    id: 'cat-09-root-boosters',
    codeNumber: 9,
    nameUk: 'Стимулятори Коренеутворення (Root Boosters)',
    nameEn: 'Root Growth Boosters',
    group: 'Additives',
    description: 'Гормональні та вітамінні препарати для швидкого формування масивної кореневої системи (Voodoo Juice, Rhizotonic, Power Roots).',
    icon: '🌱'
  },
  {
    id: 'cat-10-root-inoculants-mycorrhizae',
    codeNumber: 10,
    nameUk: 'Мікориза та Кореневі Іннокулянти (Mycorrhizae)',
    nameEn: 'Mycorrhizae & Fungal Inoculants',
    group: 'Additives',
    description: 'Спори ендо- та ектомікоризних грибів, що утворюють симбіоз із корінням для покращення поглинання води й фосфору (Piranha, Mykos, Great White).',
    icon: '🍄'
  },
  {
    id: 'cat-11-seedling-early-boosters',
    codeNumber: 11,
    nameUk: 'Стимулятори Розсади та Сходів (Seedling Boost)',
    nameEn: 'Seedling & Propagator Boosters',
    group: 'Additives',
    description: 'Делікатні антистресові розчини для паростків та вкорінення клонів.',
    icon: '🌱'
  },
  {
    id: 'cat-12-foliar-sprays',
    codeNumber: 12,
    nameUk: 'Позакореневе Підживлення (Foliar Nutrition)',
    nameEn: 'Foliar Sprays & Leaf Feed',
    group: 'Additives',
    description: 'Спреї для обприскування по листу для миттєвого усунення дефіцитів мікроелементів та активації фотосинтезу (Alg-A-Mic, Vita Race).',
    icon: '💦'
  },
  {
    id: 'cat-13-veg-enhancers',
    codeNumber: 13,
    nameUk: 'Активатори Вегетативного Росту (Veg Enhancers)',
    nameEn: 'Vegetative Growth Enhancers',
    group: 'Additives',
    description: 'Препарати з підвищеним азотом, амінокислотами та гормонами росту для потовщення стебел та нарощування зелені.',
    icon: '🌿'
  },
  {
    id: 'cat-14-bloom-pk-boosters',
    codeNumber: 14,
    nameUk: 'Бустери Цвітіння та PK Комплекси (PK Boosters)',
    nameEn: 'Bloom & PK Boosters',
    group: 'Additives',
    description: 'Висококонцентровані джерела фосфору та калію для формування ваги та щільності суцвіть (Big Bud, PK 13/14, Green Sensation, Monster Bloom).',
    icon: '💥'
  },
  {
    id: 'cat-15-autoflower-bloom-boosters',
    codeNumber: 15,
    nameUk: 'Стимулятори Цвітіння для Автоквітів (Auto Boosters)',
    nameEn: 'Autoflower Specific Boosters',
    group: 'Additives',
    description: 'М’які біо-стимулятори без загрози хімічного опіку швидких автоквітучих сортів.',
    icon: '⚡'
  },
  {
    id: 'cat-16-terpene-resin-enhancers',
    codeNumber: 16,
    nameUk: 'Підсилювачі Терпенів та Смоли (Terpene Boosters)',
    nameEn: 'Terpene & Trichome Enhancers',
    group: 'Additives',
    description: 'Стимулятори залозистих трихом та системи SAR для накопичення ефірних олій та канабіноїдів (Bud Factor X, Tasty Terpenes, Terpinator).',
    icon: '✨'
  },

  // 17-24: ORGANIC, SUGARS, SILICON, CALMAG
  {
    id: 'cat-17-carbs-sugars-molasses',
    codeNumber: 17,
    nameUk: 'Вуглеводи, Цукри та Меласа (Carbohydrates & Sugars)',
    nameEn: 'Carbohydrates & Molasses',
    group: 'Additives',
    description: 'Джерела простих та складних цукрів для живлення корисної мікрофлори та насичення суцвіть солодом (Bud Candy, CarboLoad, Top-Max).',
    icon: '🍬'
  },
  {
    id: 'cat-18-bat-guano-animal-meal',
    codeNumber: 18,
    nameUk: 'Гуано Кажанів та Суха Органіка (Bat Guano & Meal)',
    nameEn: 'Bat Guano & Organic Powders',
    group: 'Additives',
    description: '100% Натуральне фосфорно-калійне гуано кажанів, кісткове та рибне борошно для органічного смаку (Guanokalong, Plagron Batmix).',
    icon: '🦇'
  },
  {
    id: 'cat-19-enzyme-cleaners',
    codeNumber: 19,
    nameUk: 'Ензимні Препарати (Enzymes)',
    nameEn: 'Enzymes & Substrate Cleaners',
    group: 'Additives',
    description: 'Ферментні комплекси для розщеплення відмерлих коренів на корисні цукри та розблокування накопичених солей (Sensizym, Cannazym, Pure Zym).',
    icon: '🧬'
  },
  {
    id: 'cat-20-silicon-silica-additives',
    codeNumber: 20,
    nameUk: 'Кремній та Силікати (Silica & Silicon)',
    nameEn: 'Silicon & Silica Supplements',
    group: 'Additives',
    description: 'Силікат калію та монокремнієва кислота для загартування клітинних стінок, товстих стебел та захисту від спеки (Rhino Skin, Silicate, Liquid Silicon).',
    icon: '🛡️'
  },
  {
    id: 'cat-21-calmag-supplements',
    codeNumber: 21,
    nameUk: 'Кальцій-Магній Добавки (Cal-Mag)',
    nameEn: 'Cal-Mag Supplements',
    group: 'Additives',
    description: 'Незамінні добавки для м’якої/осмотичної води та кокосового субстрату проти міжжилкового хлорозу (Cal-Mag Xtra, CANNA Calmag, BioBizz Calmag).',
    icon: '🧱'
  },
  {
    id: 'cat-22-iron-micronutrients',
    codeNumber: 22,
    nameUk: 'Хелати Заліза та Мікроелементи (Iron & Trace Elements)',
    nameEn: 'Chelated Iron & Trace Minerals',
    group: 'Additives',
    description: 'Хелатовані формули Fe-EDTA/DTPA/EDDHA, Zinc, Boron, Manganese для яскраво-зеленого листя.',
    icon: '🧲'
  },
  {
    id: 'cat-23-humic-fulvic-acids',
    codeNumber: 23,
    nameUk: 'Гумінові та Фульвокислоти (Humic & Fulvic)',
    nameEn: 'Humic & Fulvic Acid Complexes',
    group: 'Additives',
    description: 'Природні хелатори з леонардиту для кращого транспортування поживних речовин через мембрани клітин (Ancient Earth, Diamond Nectar, Fulvic).',
    icon: '🪵'
  },
  {
    id: 'cat-24-nitrogen-boosters',
    codeNumber: 24,
    nameUk: 'Азотні Моно-Добрива (Nitrogen Boosters)',
    nameEn: 'Mono-Nitrogen Boosters',
    group: 'Nutrients',
    description: 'Чистий рідкий або суходозовий азот N-27% для швидкого усунення пожовтіння листя на вегетації.',
    icon: '🟢'
  },

  // 25-32: MONO-NUTRIENTS, VITAMINS, FLUSH, PH
  {
    id: 'cat-25-phosphorus-boosters',
    codeNumber: 25,
    nameUk: 'Фосфорні Моно-Добрива (Phosphorus Boosters)',
    nameEn: 'Mono-Phosphorus Additives',
    group: 'Nutrients',
    description: 'Чистий розчинний фосфор P-20% для стимуляції закладання бутонів.',
    icon: '🟣'
  },
  {
    id: 'cat-26-potassium-boosters',
    codeNumber: 26,
    nameUk: 'Калійні Моно-Добрива (Potassium Boosters)',
    nameEn: 'Mono-Potassium Additives',
    group: 'Nutrients',
    description: 'Чистий калій K-20% для фінального визрівання та накопичення смол.',
    icon: '🟠'
  },
  {
    id: 'cat-27-sulphur-trace-boosters',
    codeNumber: 27,
    nameUk: 'Сірка та Силікати Мікроелементів',
    nameEn: 'Sulphur & Micro Trace Additives',
    group: 'Additives',
    description: 'Джерела розчинної сірки для синтезу амінокислот та терпеноїдів.',
    icon: '🟡'
  },
  {
    id: 'cat-28-vitamin-antistress',
    codeNumber: 28,
    nameUk: 'Вітамінні та Антистрес Комплекси (Vitamins)',
    nameEn: 'Vitamin B & Stress Relief',
    group: 'Additives',
    description: 'Комплекси вітамінів групи B (B1, B2, B6), фолієвої кислоти та гормонів для відновлення після переливу, засухи чи обрізки (B-52, SuperVit).',
    icon: '💊'
  },
  {
    id: 'cat-29-flush-clearing-solutions',
    codeNumber: 29,
    nameUk: 'Препарати для Промивки перед Збором (Flush)',
    nameEn: 'Flush & Final Cleansing Solutions',
    group: 'Protection & Regulators',
    description: 'Хелатуючі засоби для зв’язування та виведення надлишку нітратів і солей перед харвестом (Flawless Finish, Ripen / FinalPart, Canna Flush).',
    icon: '🚿'
  },
  {
    id: 'cat-30-ph-up-regulators',
    codeNumber: 30,
    nameUk: 'Регулятори pH Up (Підвищення pH)',
    nameEn: 'pH Up Adjusters',
    group: 'Protection & Regulators',
    description: 'Концентровані розчини гідроксиду калію (KOH) для безпечного підвищення pH розчину.',
    icon: '📈'
  },
  {
    id: 'cat-31-ph-down-regulators',
    codeNumber: 31,
    nameUk: 'Регулятори pH Down (Зниження pH)',
    nameEn: 'pH Down Adjusters',
    group: 'Protection & Regulators',
    description: 'Фосфорна та лимонна кислота для точного зниження pH розчину до 5.8 - 6.5.',
    icon: '📉'
  },
  {
    id: 'cat-32-organic-biotabs-slow-release',
    codeNumber: 32,
    nameUk: 'Органічні Таблетки Повільного Вивільнення (BioTabs)',
    nameEn: 'Organic Slow-Release Tablets',
    group: 'Nutrients',
    description: 'Інноваційні органічні таблетки та драже для внесення в субстрат на весь цикл без проливу добривами (BioTabs, Guerilla Tabs).',
    icon: '🧫'
  },

  // 33-40: COMPOST TEAS, MICROBES, SUBSTRATES
  {
    id: 'cat-33-compost-teas-brews',
    codeNumber: 33,
    nameUk: 'Компостні Чаї та Біо-Настої (Compost Teas)',
    nameEn: 'Compost Teas & Aerated Brews',
    group: 'Additives',
    description: 'Настояні аеровані компостні чаї з гуано, водоростями та біогумусом (Mother Earth Super Tea, PK Booster Tea).',
    icon: '☕'
  },
  {
    id: 'cat-34-surfactants-wetting-agents',
    codeNumber: 34,
    nameUk: 'Прилипачі та Змочувальні Агенти (Wetting Agents)',
    nameEn: 'Wetting Agents & Surfactants',
    group: 'Additives',
    description: 'Органічні сурфактанти з екстракту юкки для рівномірного просочування сухого торфу чи кокосу без утворення сухих плям (Wet Betty).',
    icon: '🫧'
  },
  {
    id: 'cat-35-beneficial-rhizobacteria',
    codeNumber: 35,
    nameUk: 'Корисні Ризобактерії (Beneficial Bacteria)',
    nameEn: 'Rhizosphere Bacteria Inoculants',
    group: 'Additives',
    description: 'Штами Bacillus subtilis, Azotobacter, Pseudomonas для фіксації азоту та захисту кореневої зони від кореневої гнилі (Tarantula, Bactrex).',
    icon: '🦠'
  },
  {
    id: 'cat-36-trichoderma-fungal',
    codeNumber: 36,
    nameUk: 'Триходерма та Біо-Фітоспорин (Trichoderma)',
    nameEn: 'Trichoderma Bio-Fungicides',
    group: 'Protection & Regulators',
    description: 'Корисний гриб Trichoderma harzianum, що витісняє чорну ніжку, пітіум та фузаріоз у субстраті.',
    icon: '🌾'
  },
  {
    id: 'cat-37-substrates-peat-soil',
    codeNumber: 37,
    nameUk: 'Субстрати - Торф’яні Ґрунтосуміші (Peat Soils)',
    nameEn: 'Peat Substrates & Potting Soil',
    group: 'Substrates',
    description: 'Готові суміші верхового та низинного торфу різного ступеня заправки (BioBizz All-Mix, Plagron Growmix, Canna Terra Professional).',
    icon: '🪴'
  },
  {
    id: 'cat-38-substrates-coco-coir',
    codeNumber: 38,
    nameUk: 'Субстрати - Кокосове Волокно та Чипси (Coco Coir)',
    nameEn: 'Coco Coir & Chips Substrates',
    group: 'Substrates',
    description: 'Промиті та буферизовані кокосові волокна, чипси та мати низького EC (Canna Coco Plus, Plagron Cocos Premium, BioBizz Coco-Mix).',
    icon: '🥥'
  },
  {
    id: 'cat-39-substrates-rockwool',
    codeNumber: 39,
    nameUk: 'Субстрати - Мінеральна Вата (Rockwool / Cultilene)',
    nameEn: 'Rockwool & Mineral Wool Blocks',
    group: 'Substrates',
    description: 'Стерильні блоки та кубики з базальтового волокна для крапельного поливу та гідропоніки (Grodan, Cultilene).',
    icon: '🧱'
  },
  {
    id: 'cat-40-substrates-expanded-clay',
    codeNumber: 40,
    nameUk: 'Субстрати - Керамзит для Гідропоніки (Hydroton)',
    nameEn: 'Expanded Clay Pebbles (Hydroton)',
    group: 'Substrates',
    description: 'Нейтральний керамзит високого випалу для DWC систем, сітчастих горщиків та нижнього дренажу (Plagron Euro Foils).',
    icon: '🪨'
  },

  // 41-48: SUBSTRATE AMENDMENTS, WATER PURIFICATION, PEST CONTROL
  {
    id: 'cat-41-substrates-perlite-vermiculite',
    codeNumber: 41,
    nameUk: 'Розпушувачі - Агроперліт та Вермикуліт',
    nameEn: 'Perlite & Vermiculite Aeration',
    group: 'Substrates',
    description: 'Спучений перліт фракції 2-6мм та вермикуліт для оптимізації аерації й вологоємності.',
    icon: '⚪'
  },
  {
    id: 'cat-42-substrates-worm-castings',
    codeNumber: 42,
    nameUk: 'Органіка - Біогумус та Вермікомпост (Worm Castings)',
    nameEn: 'Worm Castings & Vermicompost',
    group: 'Substrates',
    description: '100% Натуральний хробачий біогумус для приготування Super Soil та оживлення виснаженого ґрунту.',
    icon: '🪱'
  },
  {
    id: 'cat-43-substrates-moss-sphagnum',
    codeNumber: 43,
    nameUk: 'Органіка - Мох Сфагнум (Sphagnum Moss)',
    nameEn: 'Sphagnum Moss Amendments',
    group: 'Substrates',
    description: 'Натуральний сушений та живий мох сфагнум для пророщування та утримання вологи.',
    icon: '🟢'
  },
  {
    id: 'cat-44-substrates-buffers-lime',
    codeNumber: 44,
    nameUk: 'Буфери Substrate pH - Доломітове Борошно та Вапно',
    nameEn: 'Dolomite Lime & Substrate pH Buffers',
    group: 'Substrates',
    description: 'Природний доломіт для стабілізації pH ґрунту та поступового вивільнення Ca/Mg.',
    icon: '⚪'
  },
  {
    id: 'cat-45-water-purifiers-dechlorinators',
    codeNumber: 45,
    nameUk: 'Очищувачі Води та Дехлоратори (Dechlorinators)',
    nameEn: 'Water Conditioners & Dechlorinators',
    group: 'Protection & Regulators',
    description: 'Нейтралізатори хлору та хлорамінів у водопровідній воді для захисту корисних мікроорганізмів.',
    icon: '🚰'
  },
  {
    id: 'cat-46-drip-system-cleaners',
    codeNumber: 46,
    nameUk: 'Очищувачі Крапельних Систем (Drip Cleaners)',
    nameEn: 'Drip System & Reservoir Cleaners',
    group: 'Protection & Regulators',
    description: 'Препарати проти вапняного та сольового нальоту у форсунках крапельного поливу (Aptus System Clean, Drip Clean).',
    icon: '⚙️'
  },
  {
    id: 'cat-47-organic-pesticides-protection',
    codeNumber: 47,
    nameUk: 'Захист від Шкідників - Органічні Пестициди (Neem)',
    nameEn: 'Organic Pest Protection & Neem Oil',
    group: 'Protection & Regulators',
    description: 'Масло Німу, зелене мило та натуральні інсектициди проти павутинного кліща, трипсів та попелиці (Leaf Coat, Neem Oil).',
    icon: '🐞'
  },
  {
    id: 'cat-48-anti-mold-mildew-control',
    codeNumber: 48,
    nameUk: 'Захист від Плісняви та Борошнистої Роси (Fungi Control)',
    nameEn: 'Mold, Mildew & Botrytis Control',
    group: 'Protection & Regulators',
    description: 'Біо-фунгіциди та антисептичні спреї для профілактики сірої гнилі (Botrytis) на шишках під час цвітіння.',
    icon: '🧼'
  },

  // 49-61: CLONING, KELP, AMINO ACIDS, SPECIALTY & DUST PROTECTORS
  {
    id: 'cat-49-cloning-gels-hormones',
    codeNumber: 49,
    nameUk: 'Гелі для Клонування та Вкорінення (Cloning Gels)',
    nameEn: 'Cloning Gels & Rooting Hormones',
    group: 'Additives',
    description: 'Гелі з індолілмасляною кислотою (IBA) для 100% приживлюваності живців (Clonex, Root Riot).',
    icon: '✂️'
  },
  {
    id: 'cat-50-seaweed-kelp-extracts',
    codeNumber: 50,
    nameUk: 'Екстракти Морських Водоростей (Seaweed/Kelp)',
    nameEn: 'Seaweed & Ascophyllum Nodosum',
    group: 'Additives',
    description: 'Натуральні екстракти канадської бурої водорості Ascophyllum nodosum із ауксинами та цитокінінами.',
    icon: '🌊'
  },
  {
    id: 'cat-51-plant-immunity-sar',
    codeNumber: 51,
    nameUk: 'Активатори Природного Імунітету (SAR Activators)',
    nameEn: 'Systemic Acquired Resistance (SAR)',
    group: 'Additives',
    description: 'Препарати на основі хітозану та біопротеїнів, що стимулюють рослину активно захищатися від патогенів (Bud Factor X, Scorpion Juice).',
    icon: '🛡️'
  },
  {
    id: 'cat-52-amino-acid-hydrolysates',
    codeNumber: 52,
    nameUk: 'Амінокислотні Гідролізати (Amino Acids)',
    nameEn: 'L-Amino Acid Hydrolysates',
    group: 'Additives',
    description: 'Формули з 18+ вільними L-амінокислотами для прискорення обміну речовин та подолання стресів (Bio-Heaven, Amino Root).',
    icon: '🧪'
  },
  {
    id: 'cat-53-dry-bio-powders',
    codeNumber: 53,
    nameUk: 'Сухі Органічні Біо-Порошки (Dry Bio Mixes)',
    nameEn: 'Dry Bio Mixes & Amendments',
    group: 'Nutrients',
    description: 'Комплексні сухі біо-порошки для заправки ґрунту (BioGrow, BioBloom від Green House Feeding).',
    icon: '🪵'
  },
  {
    id: 'cat-54-reverse-osmosis-minerals',
    codeNumber: 54,
    nameUk: 'Мінералізатори Осмотичної Води (RO Minerals)',
    nameEn: 'Reverse Osmosis Re-mineralizers',
    group: 'Protection & Regulators',
    description: 'Спеціальні солі для відновлення вихідного EC чистої зворотньоосмотичної води до EC 0.3-0.4.',
    icon: '🚰'
  },
  {
    id: 'cat-55-foliar-film-protectors',
    codeNumber: 55,
    nameUk: 'Захисні Латексні та Органічні Плівки (LeafCoat)',
    nameEn: 'Foliar Protective Films',
    group: 'Protection & Regulators',
    description: 'Натуральні латексні плівки для обприскування по листу, що запобігають випаровуванню вологи та проникненню шкідників (BioBizz Leaf-Coat).',
    icon: '🍃'
  },
  {
    id: 'cat-56-soil-amendments-dry-charge',
    codeNumber: 56,
    nameUk: 'Заправки для Сухих Субстратів (Soil Amendments)',
    nameEn: 'Dry Soil Amendments & Charges',
    group: 'Substrates',
    description: 'Сухі органічні суміші (Startrex, Pre-Mix) для збагачення бідних субстратів перед посадкою.',
    icon: '📦'
  },
  {
    id: 'cat-57-hydro-reservoir-conditioners',
    codeNumber: 57,
    nameUk: 'Кондиціонери для Баків Гідропоніки (Reservoir Keepers)',
    nameEn: 'Hydroponic Reservoir Conditioners',
    group: 'Protection & Regulators',
    description: 'Препарати на основі перекису водню (H2O2) або срібла для запобігання цвітінню води та слизу в баці.',
    icon: '🧪'
  },
  {
    id: 'cat-58-aroma-flavor-boosters',
    codeNumber: 58,
    nameUk: 'Ароматичні Підсилювачі Смаку (Flavor Boosters)',
    nameEn: 'Organic Flavor & Aroma Boosters',
    group: 'Additives',
    description: 'Спеціалізовані витяги з фруктів та ягід для підсолоджування та насичення смаку врожаю (AstroFlower, Honey Chome).',
    icon: '🍓'
  },
  {
    id: 'cat-59-drought-cold-protectors',
    codeNumber: 59,
    nameUk: 'Захист від Посухи та Холоду (Climate Stress Protect)',
    nameEn: 'Drought & Extreme Cold Protectors',
    group: 'Additives',
    description: 'Антитранспіранти та кріопротектори для збереження рослин при різких температурних стрибках.',
    icon: '❄️'
  },
  {
    id: 'cat-60-natural-pest-repellents',
    codeNumber: 60,
    nameUk: 'Натуральні Біо-Репеленти (Natural Repellents)',
    nameEn: 'Natural Botanical Pest Repellents',
    group: 'Protection & Regulators',
    description: 'Рослинні екстракти часнику, гірчиці та кориці для відлякування грибних комариків (сціарид) та хробаків.',
    icon: '🧄'
  },
  {
    id: 'cat-61-all-in-one-organic-powders',
    codeNumber: 61,
    nameUk: 'Комплексні Органічні Порошки All-In-One (Organic Dry)',
    nameEn: 'All-In-One Organic Soluble Powders',
    group: 'Nutrients',
    description: 'Універсальні водорозчинні органічні порошки для розведення у воді на будь-якій стадії росту.',
    icon: '⚡'
  }
];

// ============================================================================
// SERVICE CLASS & UTILITIES
// ============================================================================

export class ProductsDatabaseService {
  /**
   * Get all 61 categories defined in the GrowDiaries & Industry specification
   */
  static get61Categories(): ProductCategory61[] {
    return PRODUCT_CATEGORIES_61;
  }

  /**
   * Find a category by its ID (e.g. 'cat-01-base-soil') or code number (1..61)
   */
  static getCategoryById(idOrCode: string | number): ProductCategory61 | undefined {
    if (typeof idOrCode === 'number') {
      return PRODUCT_CATEGORIES_61.find(c => c.codeNumber === idOrCode);
    }
    return PRODUCT_CATEGORIES_61.find(c => c.id === idOrCode || c.codeNumber.toString() === idOrCode);
  }

  /**
   * Get all categories grouped by functional group ('Nutrients', 'Substrates', 'Additives', 'Protection & Regulators')
   */
  static getCategoriesByGroup(group: 'Nutrients' | 'Substrates' | 'Additives' | 'Protection & Regulators'): ProductCategory61[] {
    return PRODUCT_CATEGORIES_61.filter(c => c.group === group);
  }

  /**
   * Map old 7 categories ('Base', 'Boost', 'Root', 'Enzyme', 'CalMag', 'Flush', 'Organic') to 61 categories
   */
  static mapLegacyCategoryTo61(legacyCategory: string): ProductCategory61[] {
    const term = legacyCategory.toLowerCase();
    if (term.includes('base')) {
      return PRODUCT_CATEGORIES_61.filter(c => c.codeNumber >= 1 && c.codeNumber <= 8);
    }
    if (term.includes('root')) {
      return PRODUCT_CATEGORIES_61.filter(c => [9, 10, 11, 35, 36, 49].includes(c.codeNumber));
    }
    if (term.includes('boost')) {
      return PRODUCT_CATEGORIES_61.filter(c => [14, 15, 16, 17, 24, 25, 26].includes(c.codeNumber));
    }
    if (term.includes('enzyme')) {
      return PRODUCT_CATEGORIES_61.filter(c => c.codeNumber === 19);
    }
    if (term.includes('calmag')) {
      return PRODUCT_CATEGORIES_61.filter(c => c.codeNumber === 21);
    }
    if (term.includes('flush')) {
      return PRODUCT_CATEGORIES_61.filter(c => c.codeNumber === 29);
    }
    if (term.includes('organic')) {
      return PRODUCT_CATEGORIES_61.filter(c => [7, 18, 32, 33, 53, 61].includes(c.codeNumber));
    }
    return PRODUCT_CATEGORIES_61;
  }

  /**
   * Get category counts from current products database
   */
  static getCategoryStats(productsList: NutrientProduct[]): { category: ProductCategory61; count: number }[] {
    return PRODUCT_CATEGORIES_61.map(cat => {
      const count = productsList.filter(p => {
        if (p.categoryId === cat.id) return true;
        // Check fuzzy name matching
        const legacyMatch = this.mapLegacyCategoryTo61(p.category);
        return legacyMatch.some(m => m.id === cat.id);
      }).length;

      return { category: cat, count };
    });
  }

  /**
   * Rich Search & Filter over Products
   */
  static searchProducts(
    productsList: NutrientProduct[],
    query: string,
    filters?: {
      manufacturerId?: string;
      categoryId?: string;
      group?: 'Nutrients' | 'Substrates' | 'Additives' | 'Protection & Regulators';
      mediumType?: 'Soil' | 'Coco' | 'Hydroponics' | 'All';
    }
  ): NutrientProduct[] {
    const cleanQuery = query.toLowerCase().trim();

    return productsList.filter(product => {
      // Manufacturer Filter
      if (filters?.manufacturerId && filters.manufacturerId !== 'All' && product.manufacturerId !== filters.manufacturerId) {
        return false;
      }

      // Medium Filter
      if (filters?.mediumType && filters.mediumType !== 'All') {
        if (product.mediumType && product.mediumType !== 'All' && product.mediumType !== filters.mediumType) {
          return false;
        }
      }

      // Category Filter
      if (filters?.categoryId && filters.categoryId !== 'All') {
        if (product.categoryId && product.categoryId !== filters.categoryId) {
          return false;
        }
      }

      // Group Filter
      if (filters?.group) {
        const cat = PRODUCT_CATEGORIES_61.find(c => c.id === product.categoryId);
        if (cat && cat.group !== filters.group) {
          return false;
        }
      }

      // Text Search Query
      if (cleanQuery.length > 0) {
        const matchName = product.name.toLowerCase().includes(cleanQuery);
        const matchDesc = product.description.toLowerCase().includes(cleanQuery);
        const matchComp = product.composition.toLowerCase().includes(cleanQuery);
        const matchNpk = product.npkRatio ? product.npkRatio.toLowerCase().includes(cleanQuery) : false;
        const matchCat = product.category.toLowerCase().includes(cleanQuery);

        return matchName || matchDesc || matchComp || matchNpk || matchCat;
      }

      return true;
    });
  }
}
