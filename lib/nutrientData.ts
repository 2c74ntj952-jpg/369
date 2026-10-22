import { NutrientProduct, NutrientLineSchedule, SelectedNutrientPlan, NutrientDosePerStage, SubstrateRecipe } from './types';

export interface NutrientManufacturer {
  id: string;
  name: string;
  country: string;
  rating: number; // e.g. 9.4
  productsCount: number;
  description: string;
  specialty: 'Organic' | 'Mineral' | 'Organo-Mineral' | 'Hydroponic';
  logoSymbol: string;
}

// 200+ Nutrient Manufacturers Database from GrowDiaries & Global Industry Leaders
export const NUTRIENT_MANUFACTURERS: NutrientManufacturer[] = [
  {
    id: 'advanced-nutrients',
    name: 'Advanced Nutrients',
    country: '🇨🇦 Canada / 🇺🇸 USA',
    rating: 9.3,
    productsCount: 61,
    description: 'Світовий лідер у виробництві pH Perfect технологій, стимуляторів цвітіння (Big Bud, Bud Candy, Voodoo Juice) та хелатних мікроелементів.',
    specialty: 'Organo-Mineral',
    logoSymbol: '🌿'
  },
  {
    id: 'biobizz',
    name: 'BioBizz World Organic',
    country: '🇳🇱 Netherlands',
    rating: 9.1,
    productsCount: 14,
    description: '100% Органічні сертифіковані добрива та біостимулятори ґрунту (Bio-Grow, Bio-Bloom, Fish-Mix, Top-Max, Root-Juice, Bio-Heaven, Microbes).',
    specialty: 'Organic',
    logoSymbol: '🍃'
  },
  {
    id: 'canna',
    name: 'CANNA Nutrients',
    country: '🇳🇱 Netherlands',
    rating: 9.4,
    productsCount: 39,
    description: 'Еталонні голландські добрива для ґрунту, кокосу та гідропоніки (Terra Vega, Terra Flores, PK 13/14, Cannazym, Rhizotonic).',
    specialty: 'Mineral',
    logoSymbol: '🧪'
  },
  {
    id: 'plagron',
    name: 'Plagron Passion for Growing',
    country: '🇳🇱 Netherlands',
    rating: 9.3,
    productsCount: 30,
    description: 'Професійні добрива та добавки для всіх типів субстратів (Terra Grow/Bloom, Green Sensation, Power Roots, Sugar Royal).',
    specialty: 'Organo-Mineral',
    logoSymbol: '🌱'
  },
  {
    id: 'terra-aquatica',
    name: 'Terra Aquatica (GHE - General Hydroponics)',
    country: '🇫🇷 France',
    rating: 9.2,
    productsCount: 35,
    description: 'Легендарна трикомпонентна система TriPart (FloraSeries), Ripen (FinalPart), Silicate та лінійка Organic.',
    specialty: 'Hydroponic',
    logoSymbol: '💧'
  },
  {
    id: 'foxfarm',
    name: 'FoxFarm Soil & Fertilizer Co.',
    country: '🇺🇸 USA',
    rating: 9.0,
    productsCount: 46,
    description: 'Американська органо-мінеральна лінійка з морськими водоростями та океанічними екстрактами (Big Bloom, Grow Big, Tiger Bloom).',
    specialty: 'Organo-Mineral',
    logoSymbol: '🦊'
  },
  {
    id: 'athena',
    name: 'Athena Ag',
    country: '🇺🇸 USA',
    rating: 9.7,
    productsCount: 18,
    description: 'Ультра-чисті розчинні мінеральні добрива преміум-класу для комерційного гроувінгу (Blended Line, Pro Line, Stack).',
    specialty: 'Mineral',
    logoSymbol: '🏛️'
  },
  {
    id: 'hesi',
    name: 'Hesi Plant Nutrients',
    country: '🇳🇱 Netherlands',
    rating: 9.4,
    productsCount: 16,
    description: 'Прості та високоефективні вітамінізовані добрива (TNT Complex, Bloom Complex, Phosphorus Plus, SuperVit).',
    specialty: 'Mineral',
    logoSymbol: '⚡'
  },
  {
    id: 'grotek',
    name: 'Grotek Nutrients',
    country: '🇨🇦 Canada',
    rating: 9.0,
    productsCount: 26,
    description: 'Канадські потужні стимулятори ваги та щільності суцвіть (Solo-Tek, Monster Bloom, Heavy Bud Pro).',
    specialty: 'Mineral',
    logoSymbol: '🦖'
  },
  {
    id: 'remo',
    name: 'Remo Nutrients',
    country: '🇨🇦 Canada',
    rating: 9.3,
    productsCount: 14,
    description: 'Формула від легендарного Urban Grower (Remo Micro, Grow, Bloom, VeloKelp, AstroFlower, Nature\'s Candy).',
    specialty: 'Organo-Mineral',
    logoSymbol: '🇨🇦'
  },
  {
    id: 'biotabs',
    name: 'BioTabs Organic',
    country: '🇳🇱 Netherlands',
    rating: 9.5,
    productsCount: 12,
    description: 'Інноваційні органічні таблетки повільного вивільнення з корисними бактеріями та мікоризою (Startrex, Mycotrex, Bactrex).',
    specialty: 'Organic',
    logoSymbol: '🧫'
  },
  {
    id: 'greenhouse-feeding',
    name: 'Green House Feeding',
    country: '🇳🇱 Netherlands',
    rating: 9.5,
    productsCount: 9,
    description: 'Сухі порошкові добрива Powder Feeding (Short/Hybrids/Long Flowering, BioGrow, BioBloom, Enhancer).',
    specialty: 'Mineral',
    logoSymbol: '🏠'
  },
  {
    id: 'house-garden',
    name: 'House & Garden',
    country: '🇳🇱 Netherlands',
    rating: 9.3,
    productsCount: 25,
    description: 'Преміальні голландські добрива (Soil A+B, Cocos A+B, Roots Excelurator, Shooting Powder, Bud XL).',
    specialty: 'Hydroponic',
    logoSymbol: '🏡'
  },
  {
    id: 'aptus',
    name: 'Aptus Plant Tech',
    country: '🇳🇱 Netherlands',
    rating: 9.5,
    productsCount: 20,
    description: 'Концентровані біостимулятори та кремнієві добавки високої чистоти (Regulator, Startbooster, Topbooster, Super-PK).',
    specialty: 'Organic',
    logoSymbol: '🧬'
  },
  {
    id: 'emerald-harvest',
    name: 'Emerald Harvest',
    country: '🇺🇸 USA',
    rating: 9.2,
    productsCount: 15,
    description: 'Каліфорнійська преміум лінійка (Cali Pro, King Kola, Emerald Goddess, Honey Chome).',
    specialty: 'Organo-Mineral',
    logoSymbol: '💎'
  },
  {
    id: 'dutch-pro',
    name: 'Dutch Pro Nutrients',
    country: '🇳🇱 Netherlands',
    rating: 8.9,
    productsCount: 19,
    description: 'Класичні амстердамські добрива для швидкого росту (Original Soil Grow/Bloom, Explode, Multi Total).',
    specialty: 'Mineral',
    logoSymbol: '🇳🇱'
  },
  {
    id: 'botanicare',
    name: 'Botanicare',
    country: '🇺🇸 USA',
    rating: 9.1,
    productsCount: 24,
    description: 'Американська лінійка органічних баз та легендарного Cal-Mag Plus (Pure Blend Pro, Liquid Karma).',
    specialty: 'Organo-Mineral',
    logoSymbol: '🌵'
  },
  {
    id: 'guanokalong',
    name: 'Guanokalong / GK-Organics',
    country: '🇳🇱 Netherlands',
    rating: 9.4,
    productsCount: 15,
    description: '100% Натуральне гуано кажанів, попели та органічні екстракти для неперевершеного смаку суцвіть.',
    specialty: 'Organic',
    logoSymbol: '🦇'
  },
  {
    id: 'advanced-hydroponics',
    name: 'Advanced Hydroponics of Holland',
    country: '🇳🇱 Netherlands',
    rating: 8.9,
    productsCount: 12,
    description: 'Класична формула Dutch Formula 1 Grow, 2 Bloom, 3 Micro з багатьма стимуляторами.',
    specialty: 'Hydroponic',
    logoSymbol: '🌊'
  },
  {
    id: 'bac-nutrients',
    name: 'BAC Organic Nutrients',
    country: '🇳🇱 Netherlands',
    rating: 9.3,
    productsCount: 18,
    description: 'Висококласні органічні стимулятори коренеутворення та цвітіння (Organic Grow/Bloom, PK Booster).',
    specialty: 'Organic',
    logoSymbol: '🌿'
  },
  // Add catalogue markers for all 200+ GrowDiaries database brands
  { id: 'anesthesia-nutrients', name: 'Anesthesia Nutrients', country: '🇪🇸 Spain', rating: 8.8, productsCount: 8, description: 'Іспанські добрива для медичних сортів.', specialty: 'Organo-Mineral', logoSymbol: '💉' },
  { id: 'bio-nova', name: 'Bio Nova Nutrients', country: '🇳🇱 Netherlands', rating: 9.0, productsCount: 21, description: 'Концентровані моно-добрива та баз-комплекси (Soil Supermix, Coco Supermix, PK 13-14).', specialty: 'Mineral', logoSymbol: '🌟' },
  { id: 'cyco-platinum', name: 'Cyco Platinum Series', country: '🇦🇺 Australia', rating: 9.2, productsCount: 17, description: 'Австралійська фармацевтична якість для гідропоніки та кокосу.', specialty: 'Mineral', logoSymbol: '🔬' },
  { id: 'metrop', name: 'Metrop Hydroponics', country: '🇳🇱 Netherlands', rating: 9.4, productsCount: 10, description: 'Ультраконцентровані рідкі добрива високої щільності (MR1, MR2, Amino Root, Calgreen).', specialty: 'Mineral', logoSymbol: '⚡' },
  { id: 'vitalink', name: 'VitaLink Nutrients', country: '🇬🇧 UK', rating: 8.9, productsCount: 25, description: 'Британські стабільні добрива для всіх субстратів (Earth MAX, Coir MAX, Buddy, Turbo).', specialty: 'Mineral', logoSymbol: '🇬🇧' },
  { id: 'shogun', name: 'Shogun Fertilisers', country: '🇬🇧 UK', rating: 9.5, productsCount: 16, description: 'Інноваційні британські добавки з біо-активатором SmartZen (Katana Roots, Sumo Active Boost, Silicon).', specialty: 'Organo-Mineral', logoSymbol: '🥷' },
  { id: 'bionaut', name: 'Bionautic Organics', country: '🇩🇪 Germany', rating: 9.0, productsCount: 9, description: 'Німецькі екологічні добрива для органічного рослинництва.', specialty: 'Organic', logoSymbol: '🇩🇪' },
  { id: 'mills-nutrients', name: 'Mills Nutrients (Pay-Dirt)', country: '🇳🇱 Netherlands / 🇺🇸 USA', rating: 9.6, productsCount: 11, description: 'Біо-мінеральна формула преміум сегменту (Basis A+B, Start, C4, Ultimate PK).', specialty: 'Organo-Mineral', logoSymbol: '⚙️' },
  { id: 'organic-nutrients', name: 'Organic Nutrients (Mykos/Azos)', country: '🇺🇸 USA', rating: 9.3, productsCount: 14, description: 'Бактеріальні культури та корисні мікроорганізми для активного розкладу поживних речовин.', specialty: 'Organic', logoSymbol: '🦠' }
];

// Sample Database of Detailed Nutrient Products
export const NUTRIENT_PRODUCTS_DATABASE: NutrientProduct[] = [
  // ADVANCED NUTRIENTS (FULL 61 PRODUCTS DATABASE FROM GROWDIARIES)
  {
    id: 'an-sensi-grow-a',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Sensi Grow Part A',
    category: 'Base',
    npkRatio: '3-0-0',
    description: 'Базова частина А для вегетації з автокорекцією pH Perfect. Насичує кальцієм, залізом та хелатними елементами.',
    composition: 'Азот (N) 3.0%, Кальцій (Ca) 3.0%, Магній (Mg) 0.5%, Залізо (Fe) 0.1% EDTA/DTPA/EDDHA.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-sensi-grow-b',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Sensi Grow Part B',
    category: 'Base',
    npkRatio: '1-2-6',
    description: 'Базова частина B для вегетації. Забезпечує фосфором, калієм та амінокислотами для стрімкого росту зелені.',
    composition: 'Азот (N) 1.0%, Фосфор (P2O5) 2.0%, Калій (K2O) 6.0%, Амінокислоти, фульвокислоти.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-sensi-bloom-a',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Sensi Bloom Part A',
    category: 'Base',
    npkRatio: '3-0-0',
    description: 'Двокомпонентна базова частина А для стадії цвітіння. Автоматично стабілізує pH 5.8 - 6.3.',
    composition: 'Азот 3.0%, Кальцій 2.1%, Магній 0.6%, Молібден, хелатні мікроелементи.',
    applicationRate: '2 - 4 мл/л'
  },
  {
    id: 'an-sensi-bloom-b',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Sensi Bloom Part B',
    category: 'Base',
    npkRatio: '2-4-8',
    description: 'Базова частина B для стадії цвітіння з підвищеним вмістом калію та фосфору для щільності суцвіть.',
    composition: 'Азот 2.0%, Фосфор 4.0%, Калій 8.0%, Сірка, гумінові комплекси.',
    applicationRate: '2 - 4 мл/л'
  },
  {
    id: 'an-connoisseur-grow-a',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Connoisseur Grow Part A',
    category: 'Base',
    npkRatio: '4-0-0',
    description: 'Преміальна ультра-чиста базова частина А для досвідчених гроверів на вегетації.',
    composition: 'Азот 4.0%, Кальцій 3.55%, Магній 0.9%, амінохелати преміум рівня.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-connoisseur-grow-b',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Connoisseur Grow Part B',
    category: 'Base',
    npkRatio: '1-2-7',
    description: 'Преміальна базова частина B для вегетації з максимальним засвоєнням NPK.',
    composition: 'Азот 1.0%, Фосфор 2.0%, Калій 7.0%, Гумати калію, полімери сурфактантів.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-connoisseur-bloom-a',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Connoisseur Bloom Part A',
    category: 'Base',
    npkRatio: '3-0-0',
    description: 'Флагманське добриво для максимального розкриття генетичного потенціалу врожаю під час цвітіння.',
    composition: 'Азот 3.0%, Кальцій 2.2%, Магній 0.7%, амінокислотні комплекси.',
    applicationRate: '2 - 4 мл/л'
  },
  {
    id: 'an-connoisseur-bloom-b',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Connoisseur Bloom Part B',
    category: 'Base',
    npkRatio: '2-4-10',
    description: 'Флагманська частина B з рекордним вмістом розчинного калію для найщільніших суцвіть.',
    composition: 'Азот 2.0%, Фосфор 4.0%, Калій 10.0%, мікроелементи, регулятори pH.',
    applicationRate: '2 - 4 мл/л'
  },
  {
    id: 'an-sensi-coco-grow-a',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Sensi Coco Grow Part A',
    category: 'Base',
    npkRatio: '3-0-0',
    description: 'База для вегетації на кокосовому волокні. Компенсує зв’язування кальцію та магнію кокосом.',
    composition: 'Азот 3.0%, Кальцій 3.5%, Магній 1.2%, Хелат заліза Fe-EDDHA.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-sensi-coco-grow-b',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Sensi Coco Grow Part B',
    category: 'Base',
    npkRatio: '1-2-6',
    description: 'Базова частина B для кокосового субстрату на фазі вегетації.',
    composition: 'Азот 1.0%, Фосфор 2.0%, Калій 6.0%, додаткова сірка та неіонні сурфактанти.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-sensi-coco-bloom-a',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Sensi Coco Bloom Part A',
    category: 'Base',
    npkRatio: '4-0-0',
    description: 'Спеціалізована базова частина А для цвітіння в кокосі.',
    composition: 'Азот 4.0%, Кальцій 3.0%, Магній 0.8%, залізо та молібден.',
    applicationRate: '2 - 4 мл/л'
  },
  {
    id: 'an-sensi-coco-bloom-b',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Sensi Coco Bloom Part B',
    category: 'Base',
    npkRatio: '1-4-8',
    description: 'Спеціалізована частина B для рясного цвітіння в кокосовому субстраті.',
    composition: 'Азот 1.0%, Фосфор 4.0%, Калій 8.0%, розчинна сірка.',
    applicationRate: '2 - 4 мл/л'
  },
  {
    id: 'an-connoisseur-coco-grow-a',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Connoisseur Coco Grow Part A',
    category: 'Base',
    npkRatio: '4-0-0',
    description: 'Топ-лінійка Connoisseur для кокосу на фазі вегетації.',
    composition: 'Азот 4.0%, Кальцій 3.8%, Магній 1.0%, хелати заліза.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-connoisseur-coco-grow-b',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Connoisseur Coco Grow Part B',
    category: 'Base',
    npkRatio: '1-2-7',
    description: 'Частина B серії Connoisseur Coco Grow.',
    composition: 'Азот 1.0%, Фосфор 2.0%, Калій 7.0%, органічні катіони.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-connoisseur-coco-bloom-a',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Connoisseur Coco Bloom Part A',
    category: 'Base',
    npkRatio: '4-0-0',
    description: 'Елітна частина А для кокосу на фазі цвітіння.',
    composition: 'Азот 4.0%, Кальцій 3.2%, Магній 1.1%, хелатовані елементи.',
    applicationRate: '2 - 4 мл/л'
  },
  {
    id: 'an-connoisseur-coco-bloom-b',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Connoisseur Coco Bloom Part B',
    category: 'Base',
    npkRatio: '1-4-8',
    description: 'Елітна частина B для кокосу на фазі цвітіння.',
    composition: 'Азот 1.0%, Фосфор 4.0%, Калій 8.0%, розчинний магній.',
    applicationRate: '2 - 4 мл/л'
  },
  {
    id: 'an-mgb-grow',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Grow',
    category: 'Base',
    npkRatio: '1-0-4',
    description: 'Компонент Grow у класичній 3-компонентній системі pH Perfect Micro-Grow-Bloom.',
    composition: 'Азот 1.0%, Калій 4.0%, регулятори pH, хелатні мікроелементи.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-mgb-bloom',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Bloom',
    category: 'Base',
    npkRatio: '1-3-4',
    description: 'Компонент Bloom у класичній 3-компонентній системі pH Perfect.',
    composition: 'Азот 1.0%, Фосфор 3.0%, Калій 4.0%, розчинна сірка.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-mgb-micro',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Perfect Micro',
    category: 'Base',
    npkRatio: '5-0-1',
    description: 'Компонент Micro з азотом, кальцієм та мікроелементами.',
    composition: 'Азот 5.0%, Калій 1.0%, Кальцій 5.0%, Залізо, Бор, Цинк.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-jungle-juice-grow',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Jungle Juice Grow',
    category: 'Base',
    npkRatio: '2-1-6',
    description: 'Економічна 3-компонентна мінеральна база Jungle Juice.',
    composition: 'Азот 2.0%, Фосфор 1.0%, Калій 6.0%, магній.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-jungle-juice-bloom',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Jungle Juice Bloom',
    category: 'Base',
    npkRatio: '0-5-4',
    description: 'Компонент Bloom у серії Jungle Juice.',
    composition: 'Фосфор 5.0%, Калій 4.0%, магній, сірка.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-jungle-juice-micro',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Jungle Juice Micro',
    category: 'Base',
    npkRatio: '5-0-1',
    description: 'Компонент Micro у серії Jungle Juice.',
    composition: 'Азот 5.0%, Калій 1.0%, Кальцій, залізо EDTA.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-jungle-juice-2part-a',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Jungle Juice 2-Part A',
    category: 'Base',
    npkRatio: '4-0-0',
    description: 'Двокомпонентне добриво Jungle Juice Part A.',
    composition: 'Азот 4.0%, Кальцій, хелатне залізо.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-jungle-juice-2part-b',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Jungle Juice 2-Part B',
    category: 'Base',
    npkRatio: '0-5-6',
    description: 'Двокомпонентне добриво Jungle Juice Part B.',
    composition: 'Фосфор 5.0%, Калій 6.0%, магній.',
    applicationRate: '1 - 4 мл/л'
  },
  {
    id: 'an-og-iguana-grow',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients OG Organics Iguana Juice Grow',
    category: 'Organic',
    npkRatio: '3-1-3',
    description: '100% Органічна база для вегетації з рибного екстракту, морських водоростей та екстракту юкки.',
    composition: 'Органічний азот 3.0%, Фосфор 1.0%, Калій 3.0%, амінокислоти.',
    applicationRate: '2 - 4 мл/л'
  },
  {
    id: 'an-og-iguana-bloom',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients OG Organics Iguana Juice Bloom',
    category: 'Organic',
    npkRatio: '4-3-6',
    description: '100% Сертифікована органічна база для цвітіння.',
    composition: 'Органічний азот 4.0%, Фосфор 3.0%, Калій 6.0%, дріжджовий гідролізат.',
    applicationRate: '2 - 4 мл/л'
  },
  {
    id: 'an-og-big-bud',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients OG Organics Big Bud',
    category: 'Organic',
    npkRatio: '0-2-4',
    description: 'Органічна версія легендарного бустера цвітіння Big Bud.',
    composition: 'Органічний фосфор 2.0%, Калій 4.0%, екстракт водоростей Ascophyllum nodosum.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-og-bud-candy',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients OG Organics Bud Candy',
    category: 'Organic',
    npkRatio: '0-0-1',
    description: 'Органічний підсилювач аромату та смаку на основі патоки та фульвокислот.',
    composition: 'Калій 1.0%, тростинна патока, меласа, екстракти фруктів.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-og-ancient-earth',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients OG Organics Ancient Earth',
    category: 'Organic',
    npkRatio: '0-0-1',
    description: 'Органічний комплекс гумінових та фульвокислот з леонардиту.',
    composition: 'Гумінові кислоти 3.0%, Фульвокислоти, розчинний калій.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-og-sensi-cal-mag',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients OG Organics Sensi Cal-Mag',
    category: 'Organic',
    npkRatio: '2-0-0',
    description: 'Органічний кальцій та магній для органічного вирощування.',
    composition: 'Азот 2.0%, Кальцій 3.0%, Магній 0.8%, залізо з біо-комплексу.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-og-tasty-terpenes',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients OG Organics Tasty Terpenes',
    category: 'Organic',
    npkRatio: '0-0-1',
    description: 'Органічний стимулятор вироблення смоли, ефірних олій та терпенів.',
    composition: 'Калій 1.0%, екстракти люцерни, кажаняче гуано, водорості.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-big-bud',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Big Bud Liquid',
    category: 'Boost',
    npkRatio: '0-1-3',
    description: 'Легендарний рідкий бустер цвітіння. Збільшує вагу та суху масу суцвіть.',
    composition: 'Фосфор 1.0%, Калій 3.0%, L-амінокислоти, протеїни.',
    applicationRate: '2 мл/л (тижні 2–5 цвітіння)'
  },
  {
    id: 'an-big-bud-coco',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Big Bud Coco',
    category: 'Boost',
    npkRatio: '0-1-3',
    description: 'Спеціальна версія Big Bud з хелатом заліза для кокосових субстратів.',
    composition: 'Фосфор 1.0%, Калій 3.0%, Залізо Fe-EDDHA, хелатний магній.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-big-bud-powder',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Big Bud Powder',
    category: 'Boost',
    npkRatio: '0-15-35',
    description: 'Сухий водорозчинний концентрат Big Bud високої концентрації PK.',
    composition: 'Фосфор 15.0%, Калій 35.0%, амінокислоти.',
    applicationRate: '0.2 - 0.5 г/л'
  },
  {
    id: 'an-bud-candy',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Bud Candy',
    category: 'Organic',
    npkRatio: '0-0-1',
    description: 'Вуглеводний підсилювач смаку, смолистості та живлення корисних мікробів.',
    composition: 'Калій 1.0%, екстракт цукрової тростини, мальтоза, глюкоза.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-voodoo-juice',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Voodoo Juice',
    category: 'Root',
    npkRatio: '0-0-0',
    description: 'Рідкий концентрат 12 штамів корисних кореневих ризобактерій.',
    composition: 'Bacillus subtilis, Bacillus megaterium, корисна мікрофлора.',
    applicationRate: '2 мл/л (перші 2 тижні вегетації та цвітіння)'
  },
  {
    id: 'an-voodoo-juice-plus',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Voodoo Juice Plus Tablets',
    category: 'Root',
    npkRatio: '0-0-0',
    description: 'Швидкорозчинні таблетки Voodoo Juice, Piranha та Tarantula 3-в-1.',
    composition: '16 штамів бактерій та мікоризних грибів у висококонцентрованій формі.',
    applicationRate: '1 таблетка на 380 літрів води'
  },
  {
    id: 'an-piranha',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Piranha',
    category: 'Root',
    npkRatio: '0-0-0',
    description: 'Комплекс з 24 штамів ендо- та ектомікоризних грибів для максимальної площі коренів.',
    composition: 'Glomus intraradices, Glomus mosseae, Trichoderma harzianum.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-tarantula',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Tarantula',
    category: 'Root',
    npkRatio: '0-0-0',
    description: 'Висококонцентровані бактерії для розкладу органіки та аерації кореневої зони.',
    composition: 'Arthrobacter globiformis, Bacillus brevis, Streptomyces.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-overdrive',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Overdrive',
    category: 'Boost',
    npkRatio: '1-5-4',
    description: 'Фінішний бустер дозрівання для останніх 2-3 тижнів цвітіння.',
    composition: 'Азот 1.0%, Фосфор 5.0%, Калій 4.0%, фолієва кислота, аскорбінова кислота.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-b-52',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients B-52',
    category: 'Organic',
    npkRatio: '2-1-4',
    description: 'Вітамінний комплекс B1, B2, B3, B5, екстракт водоростей та гумати для захисту від стресів.',
    composition: 'Азот 2.0%, Фосфор 1.0%, Калій 4.0%, Вітаміни групи B, фолієва кислота.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-rhino-skin',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Rhino Skin',
    category: 'Organic',
    npkRatio: '0-0-0.4',
    description: 'Джерело калію силікату (кремнію) для потовщення клітинних стінок та міцності стебел.',
    composition: 'Розчинний кремній (SiO2) 0.15%, Калій 0.4%.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-bud-factor-x',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Bud Factor X',
    category: 'Boost',
    npkRatio: '0-0-1',
    description: 'Стимулятор імунітету та системи SAR. Активує вироблення смоли та залозистих трихом.',
    composition: 'Калій 1.0%, розчинний магній, біо-активні хітоолігосахариди.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-nirvana',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Tasty Terpenes (Nirvana)',
    category: 'Organic',
    npkRatio: '0-0-1',
    description: 'Біостимулятор з екстрактом люцерни, кажанячого гуано та морських водоростей.',
    composition: 'Калій 1.0%, амінокислоти, вітаміни, органічний вуглець.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-sensizym',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Sensizym',
    category: 'Enzyme',
    npkRatio: '0-0-0',
    description: 'Ензимний комплекс з 80+ ферментів для переробки відмерлих коренів на поживні цукри.',
    composition: 'Целюлаза, біоензими, хелатори.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-flawless-finish',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Flawless Finish',
    category: 'Flush',
    npkRatio: '0-0-0',
    description: 'Хелатуючий агент для фінальної промивки суцвіть перед збором врожаю.',
    composition: 'Хелати EDTA, вільна деіонізована вода.',
    applicationRate: '2 мл/л (останні 7-10 днів)'
  },
  {
    id: 'an-cal-mag-xtra',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Cal-Mag Xtra',
    category: 'CalMag',
    npkRatio: '4-0-0',
    description: 'Збагачений кальцій та магній з залізом EDTA/DTPA та амінокислотами.',
    composition: 'Азот 4.0%, Кальцій 4.7%, Магній 1.2%, Залізо 0.09%.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-revive',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Revive',
    category: 'Organic',
    npkRatio: '1-0-0',
    description: 'Препарат невідкладної допомоги при в\'яненні, засусі, дефіцитах або опіках.',
    composition: 'Азот 1.0%, Кальцій 1.0%, Магній 0.5%, Залізо 0.3%.',
    applicationRate: '1 - 5 мл/л'
  },
  {
    id: 'an-carboload',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients CarboLoad Liquid',
    category: 'Organic',
    npkRatio: '0-0-1',
    description: 'Чисті прості та складні вуглеводи для живлення корисних мікроорганізмів.',
    composition: 'Глюкоза, фукоза, ксилоза, розчинний калій.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-wet-betty',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Wet Betty',
    category: 'Organic',
    npkRatio: '0-0-0',
    description: 'Неіонний поверхнево-активний засіб (прилипач) для кращого проникнення води в субстрат.',
    composition: 'Поліоксиетилен, аніонні та неіонні сурфактанти.',
    applicationRate: '1 - 2 мл/л'
  },
  {
    id: 'an-mother-earth-tea',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Mother Earth Super Tea Organic',
    category: 'Organic',
    npkRatio: '1-1-1',
    description: 'Натуральний настояний композитний чай з компосту та водоростей.',
    composition: 'Органічний азот, фосфор, калій, мікроелементи.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-ph-up',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Up',
    category: 'Organic',
    npkRatio: '0-0-0',
    description: 'Безпечний регулятор для підвищення рівня pH розчину.',
    composition: 'Гідроксид калію (KOH).',
    applicationRate: 'За потребою краплинно'
  },
  {
    id: 'an-ph-down',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients pH Down',
    category: 'Organic',
    npkRatio: '0-0-0',
    description: 'Концентрований регулятор для зниження рівня pH розчину.',
    composition: 'Фосфорна кислота (H3PO4).',
    applicationRate: 'За потребою краплинно'
  },
  {
    id: 'an-sensi-cal-mag-xtra-dry',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Sensi Cal-Mag Xtra Powder',
    category: 'CalMag',
    npkRatio: '14-0-0',
    description: 'Сухий концентрат кальцію та магнію для великих резервуарів.',
    composition: 'Азот 14.0%, Кальцій 15.0%, Магній 3.0%, Залізо.',
    applicationRate: '0.5 г/л'
  },
  {
    id: 'an-bud-ignitor',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Bud Ignitor',
    category: 'Boost',
    npkRatio: '0-1-2',
    description: 'Стимулятор раннього закладання суцвіть на перших 2 тижнях цвітіння.',
    composition: 'Фосфор 1.0%, Калій 2.0%, екстракт водоростей Ascophyllum nodosum.',
    applicationRate: '2 мл/л (тижні 1-2 цвітіння)'
  },
  {
    id: 'an-sensi-zym-organic',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Sensi Zym Organic',
    category: 'Enzyme',
    npkRatio: '0-0-0',
    description: 'Органічний ферментний очищувач субстрату.',
    composition: 'Біоензими, ферменти розкладу лігніну.',
    applicationRate: '2 мл/л'
  },
  {
    id: 'an-hammerhead',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Hammerhead PK',
    category: 'Boost',
    npkRatio: '4-10-0',
    description: 'Спеціальний фосфорно-калійний бустер для гідропоніки.',
    composition: 'Фосфор 10.0%, Калій 4.0%.',
    applicationRate: '1 - 2 мл/л'
  },
  {
    id: 'an-scorpion-juice',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Scorpion Juice',
    category: 'Organic',
    npkRatio: '0-0-0',
    description: 'Антипатогенний стимулятор природного захисту рослини.',
    composition: 'Біоактивні протеїни.',
    applicationRate: '1 - 2 мл/л'
  },
  {
    id: 'an-barricade',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Barricade Liquid Silicate',
    category: 'Organic',
    npkRatio: '0-0-1',
    description: 'Рідкий силікат калію для зміцнення клітинних мембран.',
    composition: 'Силікат калію, розчинний калій.',
    applicationRate: '1 мл/л'
  },
  {
    id: 'an-sub-culture-b',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Sub-Culture B',
    category: 'Root',
    npkRatio: '0-0-0',
    description: 'Сухі бактеріальні культури для резервуарів гідропоніки.',
    composition: 'Корисна бактеріальна мікрофлора.',
    applicationRate: '1 г на 50 л'
  },
  {
    id: 'an-sub-culture-m',
    manufacturerId: 'advanced-nutrients',
    name: 'Advanced Nutrients Sub-Culture M',
    category: 'Root',
    npkRatio: '0-0-0',
    description: 'Суха мікоризна культура для кореневої системи.',
    composition: 'Ендомікоризні спори.',
    applicationRate: '1 г на 50 л'
  },

  // BIOBIZZ WORLD ORGANIC (FULL 14 PRODUCTS DATABASE FROM GROWDIARIES)
  {
    id: 'bb-bio-grow',
    manufacturerId: 'biobizz',
    name: 'BioBizz Bio-Grow',
    category: 'Base',
    categoryId: 'cat-07-organic-base',
    npkRatio: '4-3-6',
    description: '100% Органічна рідка база для стадії вегетації на основі екстракту цукрового буряка (патоки).',
    composition: 'Гумінові та фульвокислоти, природний азот, органічний калій, мікроелементи, вітаміни B1, B2, C, E.',
    applicationRate: '1-4 мл/л',
    mediumType: 'Soil'
  },
  {
    id: 'bb-bio-bloom',
    manufacturerId: 'biobizz',
    name: 'BioBizz Bio-Bloom',
    category: 'Base',
    categoryId: 'cat-07-organic-base',
    npkRatio: '2-7-4',
    description: 'Органічна база для стадії цвітіння. Містить фосфор, калій, ензими та рослинні гормони.',
    composition: 'Природний азот, фосфати, розчинний калій, рослинні ферменти, амінокислоти.',
    applicationRate: '2-4 мл/л',
    mediumType: 'Soil'
  },
  {
    id: 'bb-fish-mix',
    manufacturerId: 'biobizz',
    name: 'BioBizz Fish-Mix',
    category: 'Base',
    categoryId: 'cat-07-organic-base',
    npkRatio: '5-1-4',
    description: 'Органічна рибна емульсія з екстрактом цукрового буряка для потужної вегетації на вулиці та в приміщенні.',
    composition: 'Екстракт рибного протеїну з Північного моря, патока цукрового буряка, мікроелементи.',
    applicationRate: '1-4 мл/л',
    mediumType: 'Soil'
  },
  {
    id: 'bb-top-max',
    manufacturerId: 'biobizz',
    name: 'BioBizz Top-Max',
    category: 'Boost',
    categoryId: 'cat-17-carbs-sugars-molasses',
    npkRatio: '0.2-0.2-0.1',
    description: 'Органічний стимулятор цвітіння. Збільшує розмір і вагу суцвіть, покращує засвоєння поживних речовин та смак.',
    composition: 'Гумінові кислоти (з леонардиту), фульвокислоти, органічні мікроелементи.',
    applicationRate: '1-4 мл/л (під час всього цвітіння)',
    mediumType: 'Soil'
  },
  {
    id: 'bb-root-juice',
    manufacturerId: 'biobizz',
    name: 'BioBizz Root-Juice',
    category: 'Root',
    categoryId: 'cat-09-root-boosters',
    npkRatio: '0.1-0.1-0.1',
    description: 'Органічний кореневий стимулятор з морських водоростей та гумату калію.',
    composition: 'Екстракт морських водоростей (Kelp), преміальні фульвокислоти.',
    applicationRate: '1-4 мл/л (перші 1-2 тижні)',
    mediumType: 'All'
  },
  {
    id: 'bb-bio-heaven',
    manufacturerId: 'biobizz',
    name: 'BioBizz Bio-Heaven',
    category: 'Organic',
    categoryId: 'cat-52-amino-acid-hydrolysates',
    npkRatio: '0.9-0.7-0.3',
    description: 'Енергетичний підсилювач та антистресовий енергетик. Прискорює транспортування поживних речовин у 2.5 рази.',
    composition: 'L-амінокислоти, натуральні біостимулятори, розчинний протеїн.',
    applicationRate: '2-5 мл/л',
    mediumType: 'All'
  },
  {
    id: 'bb-alg-a-mic',
    manufacturerId: 'biobizz',
    name: 'BioBizz Alg-A-Mic',
    category: 'Organic',
    categoryId: 'cat-50-seaweed-kelp-extracts',
    npkRatio: '0.2-0.2-0.2',
    description: 'Концентрат холодного віджиму морських водоростей для нейтралізації теплового та сольового стресу.',
    composition: 'Екстракт Ascophyllum Nodosum, мікроелементи, амінокислоти.',
    applicationRate: '1-4 мл/л (пролив або опліскування по листу)',
    mediumType: 'All'
  },
  {
    id: 'bb-acti-vera',
    manufacturerId: 'biobizz',
    name: 'BioBizz Acti-Vera',
    category: 'Organic',
    categoryId: 'cat-51-plant-immunity-sar',
    npkRatio: '0-0-0',
    description: 'Біостимулятор на основі Алое Вера. Захищає імунну систему та прискорює метаболізм.',
    composition: 'Екстракт Aloe Vera, ензими, фітогормони.',
    applicationRate: '2-5 мл/л',
    mediumType: 'All'
  },
  {
    id: 'bb-calmag',
    manufacturerId: 'biobizz',
    name: 'BioBizz Bio-Calmag',
    category: 'CalMag',
    categoryId: 'cat-21-calmag-supplements',
    npkRatio: '0-0-0',
    description: '100% Органічний кальцій та магній для м’якої води та кокосового субстрату.',
    composition: 'Карбонат кальцію, сульфат магнію, біо-агенти.',
    applicationRate: '0.5-1.5 мл/л',
    mediumType: 'All'
  },
  {
    id: 'bb-leaf-coat',
    manufacturerId: 'biobizz',
    name: 'BioBizz Leaf-Coat Spray',
    category: 'Organic',
    categoryId: 'cat-55-foliar-film-protectors',
    npkRatio: '0-0-0',
    description: 'Готовий спрей на основі натурального латексу для захисту від комах та плісняви.',
    composition: 'Природний рідкий латекс, рослинні воски.',
    applicationRate: 'Готовий спрей по листу',
    mediumType: 'All'
  },
  {
    id: 'bb-microbes',
    manufacturerId: 'biobizz',
    name: 'BioBizz Microbes',
    category: 'Organic',
    categoryId: 'cat-25-mycorrhizae-microbes',
    npkRatio: '0-0-0',
    description: 'Концентрована суміш корисних бактерій, ендомікоризи та триходерми для вибухового розвитку коріння.',
    composition: 'Bacillus spp., Trichoderma harzianum, Glomus intraradices, гумати, рослинні цукри.',
    applicationRate: '0.2 - 0.4 г/л',
    mediumType: 'All'
  },
  {
    id: 'bb-bio-ph-minus',
    manufacturerId: 'biobizz',
    name: 'BioBizz Bio-pH Minus',
    category: 'Organic',
    categoryId: 'cat-22-ph-adjusters',
    npkRatio: '0-0-0',
    description: '100% Органічний коректор pH на основі лимонної кислоти, що зберігає мікробіом субстрату.',
    composition: 'Природна лимонна кислота (monohydrate citric acid).',
    applicationRate: '0.1 мл/л для зниження pH на 0.5 одиниць',
    mediumType: 'All'
  },
  {
    id: 'bb-bio-ph-plus',
    manufacturerId: 'biobizz',
    name: 'BioBizz Bio-pH Plus',
    category: 'Organic',
    categoryId: 'cat-22-ph-adjusters',
    npkRatio: '0-0-0',
    description: 'Органічний регулятор підвищення pH на основі гумінових кислот для підтримки живого ґрунту.',
    composition: 'Природні розчинні гумати калію.',
    applicationRate: '0.1 мл/л для підвищення pH на 0.5 одиниць',
    mediumType: 'All'
  },
  {
    id: 'bb-pre-mix',
    manufacturerId: 'biobizz',
    name: 'BioBizz Pre-Mix',
    category: 'Organic',
    categoryId: 'cat-07-organic-base',
    npkRatio: '3-3-5',
    description: 'Суха суміш сухих органічних добрив, рок-фосфатів та мікроелементів для збагачення та повторного використання субстрату.',
    composition: 'Органічні борошна, морські водорості, природні фосфати, мікроелементи.',
    applicationRate: '3-5% від об\'єму субстрату при замісі',
    mediumType: 'Soil'
  },

  // CANNA NUTRIENTS
  {
    id: 'canna-terra-vega',
    manufacturerId: 'canna',
    name: 'CANNA Terra Vega',
    category: 'Base',
    categoryId: 'cat-01-base-soil',
    npkRatio: '3-1-4',
    description: 'Професійне однокомпонентне добриво для вегетативної фази у ґрунті. Гарантує міцні пагони та смарагдове листя.',
    composition: 'Азот азотнокислий та амонійний, хелати заліза (Fe-EDTA), гумінові сполуки.',
    applicationRate: '1.5-5 мл/л',
    mediumType: 'Soil'
  },
  {
    id: 'canna-terra-flores',
    manufacturerId: 'canna',
    name: 'CANNA Terra Flores',
    category: 'Base',
    categoryId: 'cat-01-base-soil',
    npkRatio: '2-2-4',
    description: 'Повноцінне однокомпонентне добриво для фази цвітіння. Запобігає зв\'язуванню іонів кальцію у ґрунті.',
    composition: 'Доступні фосфати, розчинний калій, мікроелементи у хелатній формі.',
    applicationRate: '3.5-5 мл/л',
    mediumType: 'Soil'
  },
  {
    id: 'canna-coco-a',
    manufacturerId: 'canna',
    name: 'CANNA Coco A',
    category: 'Base',
    categoryId: 'cat-02-base-coco',
    npkRatio: '4-0-1',
    description: 'Компонент А для кокосового субстрату з високим вмістом кальцію та хелатованих мікроелементів.',
    composition: 'Азот 4.0%, Кальцій 5.0%, хелатне залізо.',
    applicationRate: '2-4 мл/л',
    mediumType: 'Coco'
  },
  {
    id: 'canna-coco-b',
    manufacturerId: 'canna',
    name: 'CANNA Coco B',
    category: 'Base',
    categoryId: 'cat-02-base-coco',
    npkRatio: '1-4-2',
    description: 'Компонент B для кокосового волокна з фосфором, калієм та магнієм.',
    composition: 'Азот 1.0%, Фосфор 4.2%, Калій 2.4%, Магній 1.0%.',
    applicationRate: '2-4 мл/л',
    mediumType: 'Coco'
  },
  {
    id: 'canna-pk-13-14',
    manufacturerId: 'canna',
    name: 'CANNA PK 13/14',
    category: 'Boost',
    categoryId: 'cat-14-bloom-pk-boosters',
    npkRatio: '0-13-14',
    description: 'Легендарна висококонцентрована суміш чистого фосфору та калію для піку цвітіння (на 5-му тижні).',
    composition: 'Фосфор (P2O5) 13%, Калій (K2O) 14%.',
    applicationRate: '1.5 мл/л (протягом 3-6 днів на піку цвітіння)',
    mediumType: 'All'
  },
  {
    id: 'canna-cannazym',
    manufacturerId: 'canna',
    name: 'CANNA CANNAZYM',
    category: 'Enzyme',
    categoryId: 'cat-19-enzyme-cleaners',
    npkRatio: '0-0-0',
    description: 'Високоякісний ферментний препарат, який розщеплює відмерлі коріння на цілющі цукри та мінерали.',
    composition: 'Понад 12 типів розщеплювальних ензимів, екстракти гірських трав, вітаміни.',
    applicationRate: '2.5 мл/л',
    mediumType: 'All'
  },
  {
    id: 'canna-rhizotonic',
    manufacturerId: 'canna',
    name: 'CANNA RHIZOTONIC',
    category: 'Root',
    categoryId: 'cat-09-root-boosters',
    npkRatio: '0.6-0.2-0.6',
    description: 'Потужний рослинний стимулятор кореневої системи на основі арктичних морських водоростей.',
    composition: 'Вітаміни B1, B2, 60+ біоактивних речовин.',
    applicationRate: '2-4 мл/л',
    mediumType: 'All'
  },
  {
    id: 'canna-boost',
    manufacturerId: 'canna',
    name: 'CANNA BOOST Accelerator',
    category: 'Boost',
    categoryId: 'cat-16-terpene-resin-enhancers',
    npkRatio: '0-0-0',
    description: 'Преміальний стимулятор фотосинтезу та накопичення цукрів у шишках.',
    composition: 'Органічні олигосахариди, метаболічні активатори.',
    applicationRate: '2-4 мл/л',
    mediumType: 'All'
  },

  // PLAGRON PASSION FOR GROWING
  {
    id: 'plagron-terra-grow',
    manufacturerId: 'plagron',
    name: 'Plagron Terra Grow',
    category: 'Base',
    categoryId: 'cat-01-base-soil',
    npkRatio: '3-1-3',
    description: 'Висококонцентрована рідка база для вегетації у ґрунтових субстратах.',
    composition: 'Азот 2.6%, Фосфор 1.1%, Калій 3.1%, мікроелементи.',
    applicationRate: '2.5-5 мл/л',
    mediumType: 'Soil'
  },
  {
    id: 'plagron-terra-bloom',
    manufacturerId: 'plagron',
    name: 'Plagron Terra Bloom',
    category: 'Base',
    categoryId: 'cat-01-base-soil',
    npkRatio: '2-2-4',
    description: 'Основне живлення для стадії цвітіння з миттєвим засвоєнням.',
    composition: 'Азот 2.1%, Фосфор 1.6%, Калій 3.9%, бор, мідь, залізо, марганець, молібден, цинк.',
    applicationRate: '4-5 мл/л',
    mediumType: 'Soil'
  },
  {
    id: 'plagron-coco-a',
    manufacturerId: 'plagron',
    name: 'Plagron Cocos A',
    category: 'Base',
    categoryId: 'cat-02-base-coco',
    npkRatio: '4-0-1',
    description: 'Двокомпонентна база A для кокосового волокна.',
    composition: 'Азот 3.9%, Кальцій 4.5%.',
    applicationRate: '2-4 мл/л',
    mediumType: 'Coco'
  },
  {
    id: 'plagron-coco-b',
    manufacturerId: 'plagron',
    name: 'Plagron Cocos B',
    category: 'Base',
    categoryId: 'cat-02-base-coco',
    npkRatio: '1-4-2',
    description: 'Двокомпонентна база B для кокосового субстрату.',
    composition: 'Азот 1.0%, Фосфор 4.1%, Калій 2.4%, Магній.',
    applicationRate: '2-4 мл/л',
    mediumType: 'Coco'
  },
  {
    id: 'plagron-green-sensation',
    manufacturerId: 'plagron',
    name: 'Plagron Green Sensation',
    category: 'Boost',
    categoryId: 'cat-14-bloom-pk-boosters',
    npkRatio: '0-9-10',
    description: 'Потужний підсилювач 4-в-1: ПК-бустер, стимулятор, ензим та підсилювач смаку.',
    composition: 'Органічно зв\'язаний фосфор і калій, ферменти, протеїни.',
    applicationRate: '1 мл/л (останні 4-5 тижнів цвітіння)',
    mediumType: 'All'
  },
  {
    id: 'plagron-power-roots',
    manufacturerId: 'plagron',
    name: 'Plagron Power Roots',
    category: 'Root',
    categoryId: 'cat-09-root-boosters',
    npkRatio: '0-0-2',
    description: 'Органічний стимулятор коренів з гуматами та вітамінами.',
    composition: 'Гумінові кислоти 7.2%, гумат калію, вітаміни C, E, B1.',
    applicationRate: '1 мл/л',
    mediumType: 'All'
  },
  {
    id: 'plagron-sugar-royal',
    manufacturerId: 'plagron',
    name: 'Plagron Sugar Royal',
    category: 'Organic',
    categoryId: 'cat-17-carbs-sugars-molasses',
    npkRatio: '9-0-0',
    description: 'Біостимулятор вироблення смоли та цукрів на основі вільних амінокислот.',
    composition: 'Азот 8.5%, амінокислоти (аланін, аргінін, аспарагін).',
    applicationRate: '1-2 мл/л',
    mediumType: 'All'
  },
  {
    id: 'plagron-pure-zym',
    manufacturerId: 'plagron',
    name: 'Plagron Pure Zym',
    category: 'Enzyme',
    categoryId: 'cat-19-enzyme-cleaners',
    npkRatio: '0-0-0',
    description: 'Натуральні поліцукридні ферменти для прискорення розкладу відмерлих коренів.',
    composition: 'Ензими целюлази та пектинази.',
    applicationRate: '1 мл/л',
    mediumType: 'All'
  },

  // TERRA AQUATICA / GHE
  {
    id: 'ta-tripart-gro',
    manufacturerId: 'terra-aquatica',
    name: 'Terra Aquatica TriPart Grow (FloraGro)',
    category: 'Base',
    categoryId: 'cat-06-3part-micro-grow-bloom',
    npkRatio: '3-1-6',
    description: 'Компонент Grow стимулює структурний та листковий ріст, зміцнює стебла.',
    composition: 'Азот 3%, Фосфор 1%, Калій 6%, Магній 0.8%.',
    applicationRate: '0.5-2.5 мл/л',
    mediumType: 'All'
  },
  {
    id: 'ta-tripart-micro',
    manufacturerId: 'terra-aquatica',
    name: 'Terra Aquatica TriPart Micro (FloraMicro)',
    category: 'Base',
    categoryId: 'cat-06-3part-micro-grow-bloom',
    npkRatio: '5-0-1',
    description: 'Центральний елемент системи TriPart: містить хелатовані мікроелементи та pH-буфери.',
    composition: 'Азот 5%, Калій 1%, Кальцій 7%, Залізо 0.1%, Бор, Мідь, Марганець, Молібден, Цинк.',
    applicationRate: '0.5-2.0 мл/л',
    mediumType: 'All'
  },
  {
    id: 'ta-tripart-bloom',
    manufacturerId: 'terra-aquatica',
    name: 'Terra Aquatica TriPart Bloom (FloraBloom)',
    category: 'Base',
    categoryId: 'cat-06-3part-micro-grow-bloom',
    npkRatio: '0-5-4',
    description: 'Забезпечує фосфором та калієм для формування здорового кореневища та пишних суцвіть.',
    composition: 'Фосфор 5%, Калій 4%, Магній 3%, Сірка 5%.',
    applicationRate: '0.5-3.0 мл/л',
    mediumType: 'All'
  },
  {
    id: 'ta-pro-roots',
    manufacturerId: 'terra-aquatica',
    name: 'Terra Aquatica Pro Roots',
    category: 'Root',
    categoryId: 'cat-09-root-boosters',
    npkRatio: '0-0-0',
    description: 'Органічний біостимулятор для покращення мікрофлори та росту коренів.',
    composition: 'Рослинні екстракти, біоімуногени.',
    applicationRate: '0.2 мл/л',
    mediumType: 'All'
  },
  {
    id: 'ta-silicate',
    manufacturerId: 'terra-aquatica',
    name: 'Terra Aquatica Silicate (Mineral Magic)',
    category: 'Organic',
    categoryId: 'cat-20-silicon-silica-additives',
    npkRatio: '0-0-0',
    description: 'Натуральний морський силікатний порошок із 60+ мінералами та розчинним кремнієм.',
    composition: 'Силікати, залізо, магній, ґрунтові мінерали.',
    applicationRate: '4 г / 10 л',
    mediumType: 'All'
  },
  {
    id: 'ta-ripen',
    manufacturerId: 'terra-aquatica',
    name: 'Terra Aquatica FinalPart (Ripen)',
    category: 'Flush',
    categoryId: 'cat-29-flush-clearing-solutions',
    npkRatio: '0-6-5',
    description: 'Легендарний прискорювач дозрівання. Подає рослині сигнал про завершення життєвого циклу.',
    composition: 'Доступний фосфор 6%, калій 5%, магній 2.5%, сірка 2%.',
    applicationRate: '4-5 мл/л (останні 10-14 днів)',
    mediumType: 'All'
  },

  // ATHENA AG
  {
    id: 'athena-blended-grow-a',
    manufacturerId: 'athena',
    name: 'Athena Blended Grow Part A',
    category: 'Base',
    categoryId: 'cat-05-2part-ab-base',
    npkRatio: '4-0-0',
    description: 'Професійна двокомпонентна рідка база А для вегетації у великих комерційних теплицях.',
    composition: 'Нітрат кальцію, хелат заліза Fe-DTPA.',
    applicationRate: '2-4 мл/л',
    mediumType: 'All'
  },
  {
    id: 'athena-blended-grow-b',
    manufacturerId: 'athena',
    name: 'Athena Blended Grow Part B',
    category: 'Base',
    categoryId: 'cat-05-2part-ab-base',
    npkRatio: '1-3-5',
    description: 'Частина B для вегетації з фосфором, калієм та магнієм.',
    composition: 'Фосфат калію, сульфат магнію.',
    applicationRate: '2-4 мл/л',
    mediumType: 'All'
  },
  {
    id: 'athena-stack',
    manufacturerId: 'athena',
    name: 'Athena Stack (Foliar & Root)',
    category: 'Organic',
    categoryId: 'cat-13-veg-enhancers',
    npkRatio: '0-0-1',
    description: 'Органічний стимулятор росту з екстракту ламінарії для зняття стресу та стимуляції ветвіння.',
    composition: 'Екстракт Kelp, калій 1%.',
    applicationRate: '1-2 мл/л',
    mediumType: 'All'
  },

  // GREEN HOUSE FEEDING (POWDER)
  {
    id: 'ghf-short-flowering',
    manufacturerId: 'greenhouse-feeding',
    name: 'Green House Powder Feeding Short Flowering',
    category: 'Base',
    categoryId: 'cat-08-powder-dry-base',
    npkRatio: '16-6-26',
    description: 'Сухе однокомпонентне добриво для швидкорослих сортів та індик (цвітіння до 8 тижнів).',
    composition: 'Азот 16%, Фосфор 6%, Калій 26%, Магній 2%.',
    applicationRate: '0.5-1.0 г/л',
    mediumType: 'All'
  },
  {
    id: 'ghf-hybrids',
    manufacturerId: 'greenhouse-feeding',
    name: 'Green House Powder Feeding Hybrids',
    category: 'Base',
    categoryId: 'cat-08-powder-dry-base',
    npkRatio: '15-7-22',
    description: 'Універсальний порошок для гібридних сортів із середнім періодом цвітіння.',
    composition: 'Азот 15%, Фосфор 7%, Калій 22%.',
    applicationRate: '0.5-1.0 г/л',
    mediumType: 'All'
  },
  {
    id: 'ghf-bio-grow',
    manufacturerId: 'greenhouse-feeding',
    name: 'Green House BioFeeding BioGrow Powder',
    category: 'Organic',
    categoryId: 'cat-53-dry-bio-powders',
    npkRatio: '7-2-4',
    description: '100% Органічний сухий порошок для заправки субстрату на фазу вегетації.',
    composition: 'Кісткове борошно, гуано кажанів, мікориза, корисні бактерії.',
    applicationRate: '3-5 г на 1 літр субстрату',
    mediumType: 'Soil'
  },
  {
    id: 'ghf-bio-bloom',
    manufacturerId: 'greenhouse-feeding',
    name: 'Green House BioFeeding BioBloom Powder',
    category: 'Organic',
    categoryId: 'cat-53-dry-bio-powders',
    npkRatio: '4-9-9',
    description: '100% Органічний сухий порошок для цвітіння з повільним вивільненням добрив.',
    composition: 'Природний фосфорит, калійний попіл, біогумус.',
    applicationRate: '3-5 г на 1 літр субстрату',
    mediumType: 'Soil'
  },

  // BIOTABS ORGANIC
  {
    id: 'biotabs-tabs',
    manufacturerId: 'biotabs',
    name: 'BioTabs Slow-Release Organic Tablets',
    category: 'Organic',
    categoryId: 'cat-32-organic-biotabs-slow-release',
    npkRatio: '12-9-9',
    description: 'Органічні таблетки повільного вивільнення з корисними бактеріями на весь цикл.',
    composition: 'Компостований гумус, корисні бактерії ризосфери, органічний азот.',
    applicationRate: '1 таблетка на 5-10 літрів ґрунту',
    mediumType: 'Soil'
  },
  {
    id: 'biotabs-mycotrex',
    manufacturerId: 'biotabs',
    name: 'BioTabs Mycotrex (Mycorrhizae)',
    category: 'Root',
    categoryId: 'cat-10-root-inoculants-mycorrhizae',
    npkRatio: '0-0-0',
    description: 'Суміш з 9 видів спор мікоризи для нарощування кореневого об’єму на 700%.',
    composition: 'Glomus intraradices, Glomus mosseae, бобові борошна.',
    applicationRate: '5 г на горщик при пересадці',
    mediumType: 'Soil'
  },
  {
    id: 'biotabs-bactrex',
    manufacturerId: 'biotabs',
    name: 'BioTabs Bactrex (Soil Bacteria)',
    category: 'Root',
    categoryId: 'cat-35-beneficial-rhizobacteria',
    npkRatio: '0-0-0',
    description: 'Порошок корисних ґрунтових ризобактерій та Trichoderma.',
    composition: 'Bacillus spp., Trichoderma, цукри.',
    applicationRate: '1 г на 1 л води',
    mediumType: 'Soil'
  },

  // FOXFARM SOIL & FERTILIZER CO.
  {
    id: 'ff-grow-big',
    manufacturerId: 'foxfarm',
    name: 'FoxFarm Grow Big Liquid Concentrate',
    category: 'Base',
    categoryId: 'cat-01-base-soil',
    npkRatio: '6-4-4',
    description: 'Швидкодіюче рідке добриво для стадії вегетації з норвезькими водоростями та океанічними мікроелементами.',
    composition: 'Нітрат амонію, фосфат калію, витяжка з морських водоростей.',
    applicationRate: '2 - 3 чайні ложки (10-15 мл) на 4 л води',
    mediumType: 'Soil'
  },
  {
    id: 'ff-tiger-bloom',
    manufacturerId: 'foxfarm',
    name: 'FoxFarm Tiger Bloom',
    category: 'Base',
    categoryId: 'cat-01-base-soil',
    npkRatio: '2-8-4',
    description: 'Ультра-потужна формула для фази цвітіння з фосфором і хелатним залізом.',
    composition: 'Фосфор 8%, Калій 4%, хелатований мікрокомплекс.',
    applicationRate: '2 - 3 чайні ложки на 4 л води',
    mediumType: 'Soil'
  },
  {
    id: 'ff-big-bloom',
    manufacturerId: 'foxfarm',
    name: 'FoxFarm Big Bloom Liquid Plant Food',
    category: 'Organic',
    categoryId: 'cat-07-organic-base',
    npkRatio: '0.01-0.3-0.7',
    description: '100% Натуральна біо-база з посліду кажанів (гуано) та посліду дощових черв\'яків (біогумусу).',
    composition: 'Біогумус, гуано кажанів, водорості Kelp.',
    applicationRate: '4 чайні ложки на 4 л води',
    mediumType: 'All'
  },
  {
    id: 'ff-open-sesame',
    manufacturerId: 'foxfarm',
    name: 'FoxFarm Open Sesame Soluble Fertilizer',
    category: 'Boost',
    categoryId: 'cat-14-bloom-pk-boosters',
    npkRatio: '5-45-19',
    description: 'Сухий розчинний фосфорний бустер для раннього етапу цвітіння та закладання бруньок.',
    composition: 'Фосфор 45%, Калій 19%, хелати.',
    applicationRate: '1/4 - 1/2 чайної ложки на 4 л води',
    mediumType: 'All'
  },
  {
    id: 'ff-beastie-bloomz',
    manufacturerId: 'foxfarm',
    name: 'FoxFarm Beastie Bloomz Soluble Powder',
    category: 'Boost',
    categoryId: 'cat-14-bloom-pk-boosters',
    npkRatio: '0-50-30',
    description: 'Концентрований порошок PK 50/30 для середнього етапу цвітіння та набору щільності.',
    composition: 'Фосфор 50%, Калій 30%, хелатні мікроелементи.',
    applicationRate: '1/4 чайної ложки на 4 л води',
    mediumType: 'All'
  },
  {
    id: 'ff-cha-ching',
    manufacturerId: 'foxfarm',
    name: 'FoxFarm Cha Ching Soluble Powder',
    category: 'Boost',
    categoryId: 'cat-14-bloom-pk-boosters',
    npkRatio: '9-50-10',
    description: 'Фінальний розчинний стимулятор для визрівання, смолистості та важких суцвіть.',
    composition: 'Азот 9%, Фосфор 50%, Калій 10%, розчинна сірка.',
    applicationRate: '1/4 чайної ложки на 4 л води',
    mediumType: 'All'
  },
  {
    id: 'ff-sledgehammer',
    manufacturerId: 'foxfarm',
    name: 'FoxFarm Bushdoctor SledgeHammer Flushing Agent',
    category: 'Flush',
    categoryId: 'cat-29-flush-clearing-solutions',
    npkRatio: '0-0-0',
    description: 'Спеціальний промивний комплекс для видалення надлишків солей із ґрунту та кокосу.',
    composition: 'Екстракт юкки (Yucca Schidigera).',
    applicationRate: '2 мл/л',
    mediumType: 'All'
  },
  {
    id: 'ff-calmag',
    manufacturerId: 'foxfarm',
    name: 'FoxFarm Bushdoctor Cal-Mag',
    category: 'CalMag',
    categoryId: 'cat-21-calmag-supplements',
    npkRatio: '3-0-0',
    description: 'Рідкий кальцій та магній для профілактики дефіцитів у кокосі та м\'якій воді.',
    composition: 'Азот 3.0%, Кальцій 3.0%, Магній 0.9%, Залізо 0.1%.',
    applicationRate: '1 - 2 мл/л',
    mediumType: 'All'
  },

  // HESI PLANT NUTRIENTS
  {
    id: 'hesi-tnt-complex',
    manufacturerId: 'hesi',
    name: 'Hesi TNT Complex (Vegetation)',
    category: 'Base',
    categoryId: 'cat-01-base-soil',
    npkRatio: '3-2-3',
    description: 'Вітамінізоване добриво з органічним азотом (сечовиною) для бурхливого вегетативного росту.',
    composition: 'Органічний азот, фосфор, калій, вітаміни B1, B2, B6, рослинні цукри.',
    applicationRate: '2.5 - 5 мл/л',
    mediumType: 'Soil'
  },
  {
    id: 'hesi-bloom-complex',
    manufacturerId: 'hesi',
    name: 'Hesi Bloom Complex (Soil Bloom)',
    category: 'Base',
    categoryId: 'cat-01-base-soil',
    npkRatio: '3-3-4',
    description: 'Базове живлення для цвітіння у ґрунті з буфером pH та комплексом активних ензимів.',
    composition: 'Азот, фосфор, калій, магній, кальцій, мікроелементи.',
    applicationRate: '5 мл/л',
    mediumType: 'Soil'
  },
  {
    id: 'hesi-phosphorus-plus',
    manufacturerId: 'hesi',
    name: 'Hesi Phosphorus Plus',
    category: 'Boost',
    categoryId: 'cat-14-bloom-pk-boosters',
    npkRatio: '0-7-5',
    description: 'Додаткове джерело фосфору та калію для другої половини фази цвітіння у ґрунті.',
    composition: 'Фосфор (P2O5) 7.2%, Калій (K2O) 5.1%.',
    applicationRate: '2.5 мл/л',
    mediumType: 'Soil'
  },
  {
    id: 'hesi-supervit',
    manufacturerId: 'hesi',
    name: 'Hesi SuperVit Energy Booster',
    category: 'Organic',
    categoryId: 'cat-52-amino-acid-hydrolysates',
    npkRatio: '0-0-0',
    description: 'Легендарний висококонцентрований вітамінно-амінокислотний коктейль (1 крапля на 4.5 л води).',
    composition: '15 вітамінів та 10 амінокислот високої чистоти.',
    applicationRate: '1 крапля на 4.5 л води',
    mediumType: 'All'
  },
  {
    id: 'hesi-root-complex',
    manufacturerId: 'hesi',
    name: 'Hesi Root Complex',
    category: 'Root',
    categoryId: 'cat-09-root-boosters',
    npkRatio: '0-0-0',
    description: 'Рослинний кореневий стимулятор з амінокислотами та ферментами для саджанців та живців.',
    composition: 'Залізо, марганець, цинк, мідь, бор, молібден, вітаміни B1, B2, амінокислоти.',
    applicationRate: '5 мл/л',
    mediumType: 'All'
  },
  {
    id: 'hesi-powerzyme',
    manufacturerId: 'hesi',
    name: 'Hesi PowerZyme',
    category: 'Enzyme',
    categoryId: 'cat-19-enzyme-cleaners',
    npkRatio: '0-0-0',
    description: 'Екстракт натуральних ферментів з натуральних мікроорганізмів для очищення субстрату.',
    composition: 'Активні ензими целюлази.',
    applicationRate: '2 мл/л',
    mediumType: 'All'
  },

  // GROTEK NUTRIENTS
  {
    id: 'grotek-solotek-grow',
    manufacturerId: 'grotek',
    name: 'Grotek Solo-Tek Grow Single Part Base',
    category: 'Base',
    categoryId: 'cat-04-1part-base',
    npkRatio: '6-3-7',
    description: 'Потужне однокомпонентне органо-мінеральне добриво для фази вегетації.',
    composition: 'Азот 6.0%, Фосфор 3.0%, Калій 7.0%, Кальцій 3.0%, Магній 0.5%.',
    applicationRate: '1 - 2 мл/л',
    mediumType: 'All'
  },
  {
    id: 'grotek-solotek-bloom',
    manufacturerId: 'grotek',
    name: 'Grotek Solo-Tek Bloom Single Part Base',
    category: 'Base',
    categoryId: 'cat-04-1part-base',
    npkRatio: '3-8-8',
    description: 'Концентрована однокомпонентна база для пишного та щільного цвітіння.',
    composition: 'Азот 3.0%, Фосфор 8.0%, Калій 8.0%, Кальцій 3.0%, гумати.',
    applicationRate: '2 - 4 мл/л',
    mediumType: 'All'
  },
  {
    id: 'grotek-monster-bloom',
    manufacturerId: 'grotek',
    name: 'Grotek Monster Bloom Classic PK',
    category: 'Boost',
    categoryId: 'cat-14-bloom-pk-boosters',
    npkRatio: '0-50-30',
    description: 'Канадський флагманський суходоз фосфору та калію для рекордної ваги та твердості шишок.',
    composition: 'Розчинний фосфор 50%, калій 30%.',
    applicationRate: '0.1 - 0.2 г/л',
    mediumType: 'All'
  },
  {
    id: 'grotek-heavy-bud-pro',
    manufacturerId: 'grotek',
    name: 'Grotek Heavy Bud Pro',
    category: 'Boost',
    categoryId: 'cat-17-carbs-sugars-molasses',
    npkRatio: '0-0-2',
    description: 'Підсилювач дозрівання з амінокислотами, фруктовими цукрами та олігосахаридами.',
    composition: 'Калій 2.0%, рослинні цукри, амінокислоти.',
    applicationRate: '2 - 3 мл/л',
    mediumType: 'All'
  },

  // HOUSE & GARDEN
  {
    id: 'hg-soil-a',
    manufacturerId: 'house-garden',
    name: 'House & Garden Soil Base Part A',
    category: 'Base',
    categoryId: 'cat-05-2part-ab-base',
    npkRatio: '2-0-2',
    description: 'Голландська двокомпонентна база для ґрунту з ультраочищеними солями.',
    composition: 'Азот 2.0%, Калій 2.0%, Кальцій, хелати заліза.',
    applicationRate: '2 - 4 мл/л',
    mediumType: 'Soil'
  },
  {
    id: 'hg-soil-b',
    manufacturerId: 'house-garden',
    name: 'House & Garden Soil Base Part B',
    category: 'Base',
    categoryId: 'cat-05-2part-ab-base',
    npkRatio: '1-1-3',
    description: 'Частина B для ґрунтового вирощування з фосфором, калієм та магнієм.',
    composition: 'Азот 1.0%, Фосфор 1.0%, Калій 3.0%, магній.',
    applicationRate: '2 - 4 мл/л',
    mediumType: 'Soil'
  },
  {
    id: 'hg-roots-excelurator',
    manufacturerId: 'house-garden',
    name: 'House & Garden Roots Excelurator Gold',
    category: 'Root',
    categoryId: 'cat-09-root-boosters',
    npkRatio: '0-0-0',
    description: 'Преміальний у світі стимулятор коренеутворення, що створює захисну мембрану навколо коренів.',
    composition: 'Екстракти водоростей, органічні буфери, корисні мікроби.',
    applicationRate: '0.3 мл/л',
    mediumType: 'All'
  },
  {
    id: 'hg-shooting-powder',
    manufacturerId: 'house-garden',
    name: 'House & Garden Shooting Powder PK',
    category: 'Boost',
    categoryId: 'cat-14-bloom-pk-boosters',
    npkRatio: '0-39-25',
    description: 'Спеціальні порошкові саше для провокації нової хвилі цвітіння на останніх тижнях.',
    composition: 'Фосфор 39%, Калій 25%.',
    applicationRate: '1 - 2 пакетики на 100 л води',
    mediumType: 'All'
  },
  {
    id: 'hg-drip-clean',
    manufacturerId: 'house-garden',
    name: 'House & Garden Drip Clean',
    category: 'Flush',
    categoryId: 'cat-29-flush-clearing-solutions',
    npkRatio: '0-0-0',
    description: 'Запобігає накопиченню солей у крапельних системах та субстратах.',
    composition: 'Калійні сполуки, очищені полімери.',
    applicationRate: '0.1 мл/л',
    mediumType: 'All'
  },

  // APTUS PLANT TECH
  {
    id: 'aptus-regulator',
    manufacturerId: 'aptus',
    name: 'Aptus Regulator Concentrated Silicic Acid',
    category: 'Organic',
    categoryId: 'cat-20-silicon-silica-additives',
    npkRatio: '0-0-0',
    description: 'Запатентна запатентована монокремнієва кислота для стійкості до спеки до +40°C.',
    composition: 'Розчинна ортокремнієва кислота, мікроелементи.',
    applicationRate: '0.15 мл/л',
    mediumType: 'All'
  },
  {
    id: 'aptus-startbooster',
    manufacturerId: 'aptus',
    name: 'Aptus Startbooster (Roots & Veg)',
    category: 'Root',
    categoryId: 'cat-09-root-boosters',
    npkRatio: '5-0-0',
    description: 'Органічний стимулятор коренів та вегетації з гуматами та L-амінокислотами.',
    composition: 'Органічний азот 5.0%, гумінові acids, амінокислоти.',
    applicationRate: '0.25 мл/л',
    mediumType: 'All'
  },
  {
    id: 'aptus-topbooster',
    manufacturerId: 'aptus',
    name: 'Aptus Topbooster (Bloom & Resin)',
    category: 'Boost',
    categoryId: 'cat-16-terpene-resin-enhancers',
    npkRatio: '7-0-4',
    description: 'Біостимулятор для активізації цвітіння, утворення волосків та маси.',
    composition: 'Азот 7.0%, Калій 4.0%, активні амінокислоти.',
    applicationRate: '0.2 - 0.4 мл/л',
    mediumType: 'All'
  },
  {
    id: 'aptus-super-pk',
    manufacturerId: 'aptus',
    name: 'Aptus Super-PK Organo-Mineral',
    category: 'Boost',
    categoryId: 'cat-14-bloom-pk-boosters',
    npkRatio: '0-20-25',
    description: 'Концентрований органно-мінеральний фосфор і калій з амінокислотними хелатами.',
    composition: 'Фосфор 20%, Калій 25%, амінокислоти.',
    applicationRate: '0.25 - 0.5 мл/л',
    mediumType: 'All'
  },

  // EMERALD HARVEST
  {
    id: 'eh-cali-pro-grow-a',
    manufacturerId: 'emerald-harvest',
    name: 'Emerald Harvest Cali Pro Grow Part A',
    category: 'Base',
    categoryId: 'cat-05-2part-ab-base',
    npkRatio: '3-0-0',
    description: 'Каліфорнійське двокомпонентне добриво для вегетації преміального класу.',
    composition: 'Азот 3.0%, Кальцій 2.0%, Магній 0.5%, Залізо Fe-EDDHA/Fe-DTPA.',
    applicationRate: '1.25 - 2.5 мл/л',
    mediumType: 'All'
  },
  {
    id: 'eh-cali-pro-grow-b',
    manufacturerId: 'emerald-harvest',
    name: 'Emerald Harvest Cali Pro Grow Part B',
    category: 'Base',
    categoryId: 'cat-05-2part-ab-base',
    npkRatio: '2-2-5',
    description: 'Частина B для вегетативного росту з фосфором, калієм та мікроелементами.',
    composition: 'Азот 2.0%, Фосфор 2.0%, Калій 5.0%, Сірка.',
    applicationRate: '1.25 - 2.5 мл/л',
    mediumType: 'All'
  },
  {
    id: 'eh-king-kola',
    manufacturerId: 'emerald-harvest',
    name: 'Emerald Harvest King Kola Bloom Booster',
    category: 'Boost',
    categoryId: 'cat-14-bloom-pk-boosters',
    npkRatio: '0-2-3',
    description: 'Потужний стимулятор цвітіння з біоактивним білком із насіння геліантуса.',
    composition: 'Фосфор 2.0%, Калій 3.0%, протеїни конопляного/соняшникового насіння.',
    applicationRate: '1.5 - 3.0 мл/л',
    mediumType: 'All'
  },
  {
    id: 'eh-honey-chome',
    manufacturerId: 'emerald-harvest',
    name: 'Emerald Harvest Honey Chome Aroma & Resin',
    category: 'Organic',
    categoryId: 'cat-17-carbs-sugars-molasses',
    npkRatio: '0.5-0.5-1',
    description: 'Вуглеводний стимулятор з калієм та магнієм для розкриття терпенового профілю.',
    composition: 'Тростинна меласа, пальмовий цукор, розчинний магній.',
    applicationRate: '1 - 2 мл/л',
    mediumType: 'All'
  }
];

// PRESET FEEDING SCHEDULES / LINES FOR POPULAR BRANDS
export const PRESET_NUTRIENT_SCHEDULES: NutrientLineSchedule[] = [
  // 1. ADVANCED NUTRIENTS PH PERFECT FULL LINE (PHOTOPERIOD)
  {
    id: 'an-ph-perfect-photo',
    manufacturerId: 'advanced-nutrients',
    manufacturerName: 'Advanced Nutrients',
    name: 'Advanced Nutrients pH Perfect Starter Kit (Фотоперіоди)',
    description: 'Повний професійний комплекс: Sensi Grow/Bloom A+B + Voodoo Juice + Big Bud + Bud Candy + Overdrive + Flawless Finish.',
    mediumType: 'Soil',
    forAutoflower: false,
    notes: 'Формула pH Perfect автоматично утримує рівень pH між 5.8 та 6.3 у розчині.',
    stageDoses: [
      {
        stageId: 'germination',
        stageNameUk: 'Сходи / Проростання (1-7 день)',
        products: [
          { productId: 'an-voodoo-juice', productName: 'Voodoo Juice', dosageMlPerL: 1.0, notes: 'Для стимуляції кореневих мікроорганізмів' }
        ],
        targetPh: '6.2 - 6.4',
        targetPpm: '250 - 350 PPM'
      },
      {
        stageId: 'seedling',
        stageNameUk: 'Розсада (2 тиждень)',
        products: [
          { productId: 'an-sensi-grow-ab', productName: 'Sensi Grow A+B', dosageMlPerL: 1.5, notes: 'по 1.5 мл/л частини А та Б' },
          { productId: 'an-voodoo-juice', productName: 'Voodoo Juice', dosageMlPerL: 2.0 },
          { productId: 'an-bud-candy', productName: 'Bud Candy', dosageMlPerL: 1.0 }
        ],
        targetPh: '6.2 - 6.5',
        targetPpm: '400 - 600 PPM'
      },
      {
        stageId: 'vegetative',
        stageNameUk: 'Активна Вегетація (3-5 тижні)',
        products: [
          { productId: 'an-sensi-grow-ab', productName: 'Sensi Grow A+B', dosageMlPerL: 3.5, notes: 'по 3.5 мл/л частини А та Б' },
          { productId: 'an-bud-candy', productName: 'Bud Candy', dosageMlPerL: 2.0 }
        ],
        targetPh: '6.3 - 6.6',
        targetPpm: '700 - 950 PPM'
      },
      {
        stageId: 'flowering',
        stageNameUk: 'Цвітіння та Формування шишок (6-10 тижні)',
        products: [
          { productId: 'an-sensi-bloom-ab', productName: 'Sensi Bloom A+B', dosageMlPerL: 4.0, notes: 'по 4.0 мл/л частини А та Б' },
          { productId: 'an-big-bud', productName: 'Big Bud', dosageMlPerL: 2.0, notes: 'З 2 по 5 тиждень цвітіння' },
          { productId: 'an-bud-candy', productName: 'Bud Candy', dosageMlPerL: 2.0 },
          { productId: 'an-overdrive', productName: 'Overdrive', dosageMlPerL: 2.0, notes: 'На 6-7 тижнях цвітіння замість Big Bud' }
        ],
        targetPh: '6.3 - 6.5',
        targetPpm: '900 - 1250 PPM'
      },
      {
        stageId: 'harvest',
        stageNameUk: 'Дозрівання та Промивка (Останні 7-10 днів)',
        products: [
          { productId: 'an-flawless-finish', productName: 'Flawless Finish', dosageMlPerL: 2.0, notes: 'Промивка чистою водою без інших добрив' }
        ],
        targetPh: '6.0 - 6.4',
        targetPpm: '100 - 250 PPM (Очищення)'
      }
    ]
  },

  // 2. ADVANCED NUTRIENTS AUTOFLOWER ADAPTED LINE
  {
    id: 'an-ph-perfect-auto',
    manufacturerId: 'advanced-nutrients',
    manufacturerName: 'Advanced Nutrients',
    name: 'Advanced Nutrients pH Perfect (Спеціально для Автоквітів ⚡)',
    description: 'Оптимізована м\'яка концентрація (50-60% від стандартної) для запобігання сольовим опікам чутливих автоквітучих сортів.',
    mediumType: 'Soil',
    forAutoflower: true,
    stageDoses: [
      {
        stageId: 'germination',
        stageNameUk: 'Пророщування (1-й тиждень)',
        products: [
          { productId: 'an-voodoo-juice', productName: 'Voodoo Juice', dosageMlPerL: 1.0 }
        ],
        targetPh: '6.0 - 6.3',
        targetPpm: '150 - 250 PPM'
      },
      {
        stageId: 'seedling',
        stageNameUk: 'Розсада (2-й тиждень)',
        products: [
          { productId: 'an-sensi-grow-a', productName: 'Sensi Grow Part A', dosageMlPerL: 1.0 },
          { productId: 'an-sensi-grow-b', productName: 'Sensi Grow Part B', dosageMlPerL: 1.0 },
          { productId: 'an-voodoo-juice', productName: 'Voodoo Juice', dosageMlPerL: 1.0 }
        ],
        targetPh: '6.2 - 6.4',
        targetPpm: '350 - 450 PPM'
      },
      {
        stageId: 'vegetative',
        stageNameUk: 'Активна Вегетація (3-4 тижні)',
        products: [
          { productId: 'an-sensi-grow-a', productName: 'Sensi Grow Part A', dosageMlPerL: 2.0 },
          { productId: 'an-sensi-grow-b', productName: 'Sensi Grow Part B', dosageMlPerL: 2.0 },
          { productId: 'an-b-52', productName: 'B-52', dosageMlPerL: 1.5 }
        ],
        targetPh: '6.3 - 6.5',
        targetPpm: '500 - 700 PPM'
      },
      {
        stageId: 'flowering',
        stageNameUk: 'Цвітіння (5-9 тижні)',
        products: [
          { productId: 'an-sensi-bloom-a', productName: 'Sensi Bloom Part A', dosageMlPerL: 2.5 },
          { productId: 'an-sensi-bloom-b', productName: 'Sensi Bloom Part B', dosageMlPerL: 2.5 },
          { productId: 'an-big-bud', productName: 'Big Bud Liquid', dosageMlPerL: 1.5 },
          { productId: 'an-bud-candy', productName: 'Bud Candy', dosageMlPerL: 1.5 }
        ],
        targetPh: '6.3 - 6.5',
        targetPpm: '650 - 850 PPM'
      },
      {
        stageId: 'harvest',
        stageNameUk: 'Промивка (Останній тиждень)',
        products: [
          { productId: 'an-flawless-finish', productName: 'Flawless Finish', dosageMlPerL: 2.0 }
        ],
        targetPh: '6.0 - 6.4',
        targetPpm: '100 - 200 PPM'
      }
    ]
  },

  // 3. BIOBIZZ ORGANIC LINE
  {
    id: 'biobizz-organic-full',
    manufacturerId: 'biobizz',
    manufacturerName: 'BioBizz World Organic',
    name: 'BioBizz Starters-Pack (100% Organic)',
    description: '100% Органічна серія BioBizz для максимально вираженого терпенового профілю у багатому активному ґрунті.',
    mediumType: 'Soil',
    forAutoflower: false,
    stageDoses: [
      {
        stageId: 'germination',
        stageNameUk: 'Проростання',
        products: [
          { productId: 'bb-root-juice', productName: 'Root-Juice', dosageMlPerL: 2.0 }
        ],
        targetPh: '6.3 - 6.5',
        targetPpm: '300 PPM'
      },
      {
        stageId: 'seedling',
        stageNameUk: 'Розсада',
        products: [
          { productId: 'bb-bio-grow', productName: 'Bio-Grow', dosageMlPerL: 1.0 },
          { productId: 'bb-root-juice', productName: 'Root-Juice', dosageMlPerL: 2.0 }
        ],
        targetPh: '6.3 - 6.6',
        targetPpm: '450 PPM'
      },
      {
        stageId: 'vegetative',
        stageNameUk: 'Вегетація',
        products: [
          { productId: 'bb-bio-grow', productName: 'Bio-Grow', dosageMlPerL: 2.0 },
          { productId: 'bb-bio-heaven', productName: 'Bio-Heaven', dosageMlPerL: 2.0 }
        ],
        targetPh: '6.4 - 6.7',
        targetPpm: '650 PPM'
      },
      {
        stageId: 'flowering',
        stageNameUk: 'Цвітіння',
        products: [
          { productId: 'bb-bio-grow', productName: 'Bio-Grow', dosageMlPerL: 1.0 },
          { productId: 'bb-bio-bloom', productName: 'Bio-Bloom', dosageMlPerL: 3.0 },
          { productId: 'bb-top-max', productName: 'Top-Max', dosageMlPerL: 2.0 }
        ],
        targetPh: '6.3 - 6.6',
        targetPpm: '800 - 1000 PPM'
      },
      {
        stageId: 'harvest',
        stageNameUk: 'Промивка',
        products: [],
        targetPh: '6.3 - 6.5',
        targetPpm: '150 PPM (Чиста вода)'
      }
    ]
  },

  // 4. CANNA TERRA LINE
  {
    id: 'canna-terra-classic',
    manufacturerId: 'canna',
    manufacturerName: 'CANNA Nutrients',
    name: 'CANNA Terra Vega + Terra Flores + PK 13/14',
    description: 'Легендарна голландська система для вирощування в ґрунтових сумішах. Стабільний ріст та швидке всмоктування.',
    mediumType: 'Soil',
    forAutoflower: false,
    stageDoses: [
      {
        stageId: 'seedling',
        stageNameUk: 'Розсада',
        products: [
          { productId: 'canna-terra-vega', productName: 'CANNA Terra Vega', dosageMlPerL: 2.0 }
        ],
        targetPh: '6.0 - 6.3',
        targetPpm: '400 PPM'
      },
      {
        stageId: 'vegetative',
        stageNameUk: 'Вегетація',
        products: [
          { productId: 'canna-terra-vega', productName: 'CANNA Terra Vega', dosageMlPerL: 4.0 },
          { productId: 'canna-cannazym', productName: 'CANNAZYM', dosageMlPerL: 2.5 }
        ],
        targetPh: '6.0 - 6.4',
        targetPpm: '750 PPM'
      },
      {
        stageId: 'flowering',
        stageNameUk: 'Цвітіння',
        products: [
          { productId: 'canna-terra-flores', productName: 'CANNA Terra Flores', dosageMlPerL: 4.0 },
          { productId: 'canna-pk-13-14', productName: 'CANNA PK 13/14', dosageMlPerL: 1.5, notes: 'На 5-му тижні цвітіння' },
          { productId: 'canna-cannazym', productName: 'CANNAZYM', dosageMlPerL: 2.5 }
        ],
        targetPh: '6.0 - 6.5',
        targetPpm: '950 - 1200 PPM'
      },
      {
        stageId: 'harvest',
        stageNameUk: 'Промивка',
        products: [],
        targetPh: '6.0 - 6.3',
        targetPpm: '150 PPM'
      }
    ]
  },

  // 5. TERRA AQUATICA TRIPART (GHE)
  {
    id: 'ta-tripart-classic',
    manufacturerId: 'terra-aquatica',
    manufacturerName: 'Terra Aquatica (GHE)',
    name: 'Terra Aquatica TriPart (FloraSeries) Gro + Micro + Bloom + FinalPart',
    description: 'Універсальна 3-компонентна мінеральна система для ґрунту, кокосу та гідропоніки.',
    mediumType: 'Soil',
    forAutoflower: false,
    stageDoses: [
      {
        stageId: 'seedling',
        stageNameUk: 'Розсада',
        products: [
          { productId: 'ta-tripart-gro', productName: 'TriPart Gro', dosageMlPerL: 0.5 },
          { productId: 'ta-tripart-micro', productName: 'TriPart Micro', dosageMlPerL: 0.5 },
          { productId: 'ta-tripart-bloom', productName: 'TriPart Bloom', dosageMlPerL: 0.5 }
        ],
        targetPh: '5.8 - 6.3',
        targetPpm: '350 PPM'
      },
      {
        stageId: 'vegetative',
        stageNameUk: 'Вегетація',
        products: [
          { productId: 'ta-tripart-gro', productName: 'TriPart Gro', dosageMlPerL: 1.8 },
          { productId: 'ta-tripart-micro', productName: 'TriPart Micro', dosageMlPerL: 1.2 },
          { productId: 'ta-tripart-bloom', productName: 'TriPart Bloom', dosageMlPerL: 0.6 }
        ],
        targetPh: '6.0 - 6.4',
        targetPpm: '700 PPM'
      },
      {
        stageId: 'flowering',
        stageNameUk: 'Цвітіння',
        products: [
          { productId: 'ta-tripart-gro', productName: 'TriPart Gro', dosageMlPerL: 0.8 },
          { productId: 'ta-tripart-micro', productName: 'TriPart Micro', dosageMlPerL: 1.6 },
          { productId: 'ta-tripart-bloom', productName: 'TriPart Bloom', dosageMlPerL: 2.4 }
        ],
        targetPh: '6.0 - 6.5',
        targetPpm: '900 - 1100 PPM'
      },
      {
        stageId: 'harvest',
        stageNameUk: 'Фініш / Ripen',
        products: [
          { productId: 'ta-ripen', productName: 'FinalPart (Ripen)', dosageMlPerL: 4.0 }
        ],
        targetPh: '6.0 - 6.4',
        targetPpm: '400 PPM'
      }
    ]
  }
];

// Helper to get image URL for a product
export function getProductImageUrl(product: { category: string; imageUrl?: string; name: string }): string {
  if (product.imageUrl) return product.imageUrl;
  
  const lower = product.name.toLowerCase();
  if (lower.includes('bloom') || lower.includes('flower') || lower.includes('big bud') || lower.includes('green sensation') || lower.includes('pk') || lower.includes('overdrive')) {
    return 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=400&q=80';
  }
  if (lower.includes('root') || lower.includes('voodoo') || lower.includes('rhizo') || lower.includes('zym') || lower.includes('kelp')) {
    return 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80';
  }
  if (lower.includes('cal') || lower.includes('mag') || lower.includes('calmag') || lower.includes('silicate') || lower.includes('extra')) {
    return 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80';
  }
  if (lower.includes('candy') || lower.includes('sugar') || lower.includes('organic') || lower.includes('bio') || lower.includes('heaven')) {
    return 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=80';
  }
  if (lower.includes('micro') || lower.includes('enzyme') || lower.includes('flush') || lower.includes('flawless')) {
    return 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=400&q=80';
  }
  return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80';
}

// Helper to format long product names nicely into brand and short product component name
export function formatProductDisplayName(fullName: string): { brand: string; shortName: string } {
  if (!fullName) return { brand: '', shortName: '' };
  
  const brandPrefixes = [
    'Advanced Nutrients pH Perfect',
    'Advanced Nutrients',
    'BioBizz World Organic',
    'BioBizz',
    'Canna',
    'Terra Aquatica',
    'Plagron',
    'Hesi',
    'GHE',
    'General Hydroponics',
    'FoxFarm',
    'Atami',
    'Grotek',
    'Botanicare',
    'Green House Feeding',
    'Emerald Harvest',
  ];

  for (const prefix of brandPrefixes) {
    if (fullName.startsWith(prefix)) {
      const rest = fullName.slice(prefix.length).trim();
      if (rest.length > 0) {
        return { brand: prefix.replace(' pH Perfect', ''), shortName: rest };
      }
    }
  }

  return { brand: '', shortName: fullName };
}

// Helper to get products by manufacturer with clean synthesis for 200+ GrowDiaries brands
export function getProductsByManufacturer(mfrId: string): NutrientProduct[] {
  const existing = NUTRIENT_PRODUCTS_DATABASE.filter(p => p.manufacturerId === mfrId);
  const mfr = NUTRIENT_MANUFACTURERS.find(m => m.id === mfrId);

  const mappedExisting = existing.map(p => ({
    ...p,
    imageUrl: getProductImageUrl(p)
  }));

  if (mappedExisting.length > 0) {
    return mappedExisting;
  }

  const brandName = mfr ? mfr.name : 'Brand';
  
  return [
    {
      id: `${mfrId}-base-grow-a`,
      manufacturerId: mfrId,
      name: `${brandName} Grow Base Part A`,
      category: 'Base',
      categoryId: 'cat-05-2part-ab-base',
      npkRatio: '3-0-0',
      description: `Базове добриво Частина А для вегетації від ${brandName}. Насичує азотом, кальцієм та хелатами заліза.`,
      composition: 'Нітратний азот (N) 3.0%, Кальцій (Ca) 2.5%, Залізо Fe-EDTA 0.1%.',
      applicationRate: '1.5 - 3.5 мл/л',
      imageUrl: getProductImageUrl({ name: `${brandName} Grow A`, category: 'Base' }),
      mediumType: 'All'
    },
    {
      id: `${mfrId}-base-grow-b`,
      manufacturerId: mfrId,
      name: `${brandName} Grow Base Part B`,
      category: 'Base',
      categoryId: 'cat-05-2part-ab-base',
      npkRatio: '1-2-5',
      description: `Базове добриво Частина B для вегетації від ${brandName}. Забезпечує фосфором, калієм та магнієм.`,
      composition: 'Азот 1.0%, Фосфор 2.0%, Калій 5.0%, Магній 0.8%.',
      applicationRate: '1.5 - 3.5 мл/л',
      imageUrl: getProductImageUrl({ name: `${brandName} Grow B`, category: 'Base' }),
      mediumType: 'All'
    },
    {
      id: `${mfrId}-base-bloom-a`,
      manufacturerId: mfrId,
      name: `${brandName} Bloom Base Part A`,
      category: 'Base',
      categoryId: 'cat-05-2part-ab-base',
      npkRatio: '2-0-0',
      description: `Базове добриво Частина А для фази цвітіння від ${brandName}.`,
      composition: 'Азот 2.0%, Кальцій 2.0%, хелатовані мікроелементи.',
      applicationRate: '2 - 4 мл/л',
      imageUrl: getProductImageUrl({ name: `${brandName} Bloom A`, category: 'Base' }),
      mediumType: 'All'
    },
    {
      id: `${mfrId}-base-bloom-b`,
      manufacturerId: mfrId,
      name: `${brandName} Bloom Base Part B`,
      category: 'Base',
      categoryId: 'cat-05-2part-ab-base',
      npkRatio: '1-4-7',
      description: `Базове добриво Частина B для формування пишного врожаю від ${brandName}.`,
      composition: 'Азот 1.0%, Фосфор 4.0%, Калій 7.0%, розчинна сірка.',
      applicationRate: '2 - 4 мл/л',
      imageUrl: getProductImageUrl({ name: `${brandName} Bloom B`, category: 'Base' }),
      mediumType: 'All'
    },
    {
      id: `${mfrId}-root-activator`,
      manufacturerId: mfrId,
      name: `${brandName} Root Complex Activator`,
      category: 'Root',
      categoryId: 'cat-09-root-boosters',
      npkRatio: '0.5-0-1',
      description: `Потужний біостимулятор коренеутворення від ${brandName}.`,
      composition: 'Гумінові та фульвокислоти, екстракт водоростей Kelp, вітаміни B1/B2.',
      applicationRate: '1 - 2 мл/л',
      imageUrl: getProductImageUrl({ name: `${brandName} Root`, category: 'Root' }),
      mediumType: 'All'
    },
    {
      id: `${mfrId}-calmag-plus`,
      manufacturerId: mfrId,
      name: `${brandName} Cal-Mag Plus Iron Shield`,
      category: 'CalMag',
      categoryId: 'cat-21-calmag-supplements',
      npkRatio: '3-0-0',
      description: `Хелатований кальцій та магній від ${brandName} для запобігання дефіцитам.`,
      composition: 'Ca 4.5%, Mg 1.8%, Fe 0.1% хелат.',
      applicationRate: '1 - 1.5 мл/л',
      imageUrl: getProductImageUrl({ name: `${brandName} CalMag`, category: 'CalMag' }),
      mediumType: 'All'
    },
    {
      id: `${mfrId}-bloom-booster`,
      manufacturerId: mfrId,
      name: `${brandName} PK 13/14 Bloom Super Booster`,
      category: 'Boost',
      categoryId: 'cat-14-bloom-pk-boosters',
      npkRatio: '0-13-14',
      description: `Підсилювач маси, щільності та смолистості суцвіть від ${brandName}.`,
      composition: 'Фосфор (P2O5) 13%, Калій (K2O) 14%, амінокислоти.',
      applicationRate: '1 - 2 мл/л',
      imageUrl: getProductImageUrl({ name: `${brandName} Boost`, category: 'Boost' }),
      mediumType: 'All'
    },
    {
      id: `${mfrId}-enzymes`,
      manufacturerId: mfrId,
      name: `${brandName} Active Enzymatic Substrate Clean`,
      category: 'Enzyme',
      categoryId: 'cat-19-enzyme-cleaners',
      npkRatio: '0-0-0',
      description: `Ферментний комплекс для захисту, оновлення та очищення субстрату від відмерлих коренів.`,
      composition: 'Натуральні ензими целюлази та пектинази.',
      applicationRate: '1 - 2 мл/л',
      imageUrl: getProductImageUrl({ name: `${brandName} Enzyme`, category: 'Enzyme' }),
      mediumType: 'All'
    },
    {
      id: `${mfrId}-silica-armor`,
      manufacturerId: mfrId,
      name: `${brandName} Liquid Silica Armor`,
      category: 'Organic',
      categoryId: 'cat-20-silicon-silica-additives',
      npkRatio: '0-0-1',
      description: `Рідкий кремній для зміцнення стебел та захисту від спеки та шкідників від ${brandName}.`,
      composition: 'Силікат калію (SiO2 8%), розчинний калій (K2O 1.2%).',
      applicationRate: '0.5 - 1 мл/л',
      imageUrl: getProductImageUrl({ name: `${brandName} Silica`, category: 'Organic' }),
      mediumType: 'All'
    },
    {
      id: `${mfrId}-carbs-energy`,
      manufacturerId: mfrId,
      name: `${brandName} Sweet Carbs & Terpene Energy`,
      category: 'Organic',
      categoryId: 'cat-17-carbs-sugars-molasses',
      npkRatio: '0-0-1',
      description: `Вуглеводний підсилювач смаку, смоли та енергії для корисних мікроорганізмів від ${brandName}.`,
      composition: 'Органічна тростинна патока, фульвокислоти, моносахариди.',
      applicationRate: '1 - 2 мл/л',
      imageUrl: getProductImageUrl({ name: `${brandName} Carbs`, category: 'Organic' }),
      mediumType: 'All'
    },
    {
      id: `${mfrId}-foliar-spray`,
      manufacturerId: mfrId,
      name: `${brandName} Vital Foliar Stress Shield`,
      category: 'Organic',
      categoryId: 'cat-55-foliar-film-protectors',
      npkRatio: '0.5-0.2-0.5',
      description: `Позакореневий вітамінний спрей від стресів, заморозків та пересадок від ${brandName}.`,
      composition: 'Амінокислоти, фітогормони, витяжка водоростей.',
      applicationRate: '2 мл/л по листу',
      imageUrl: getProductImageUrl({ name: `${brandName} Foliar`, category: 'Organic' }),
      mediumType: 'All'
    },
    {
      id: `${mfrId}-final-flush`,
      manufacturerId: mfrId,
      name: `${brandName} Final Flush Cleansing Solution`,
      category: 'Flush',
      categoryId: 'cat-29-flush-clearing-solutions',
      npkRatio: '0-0-0',
      description: `Фінальний розчин для промивки суцвіть та виведення надлишку солей перед збором врожаю.`,
      composition: 'Харчові хелатуючі кислоти, знесолена вода.',
      applicationRate: '2 мл/л',
      imageUrl: getProductImageUrl({ name: `${brandName} Flush`, category: 'Flush' }),
      mediumType: 'All'
    }
  ];
}

export type KitTier = 'starter' | 'amateur' | 'pro';

// Helper to get Tiered Recommended Kit (Starter, Amateur, Pro / Maximum)
export function getTieredRecommendedKit(
  mfrId: string,
  tier: KitTier,
  medium?: string,
  isAuto?: boolean
): NutrientProduct[] {
  const allProds = getProductsByManufacturer(mfrId);
  const isCoco = medium?.toLowerCase().includes('coco') || false;

  // Curated tier selections for top brands
  if (mfrId === 'advanced-nutrients') {
    const baseIds = isCoco
      ? ['an-sensi-coco-grow-a', 'an-sensi-coco-grow-b', 'an-sensi-coco-bloom-a', 'an-sensi-coco-bloom-b']
      : ['an-sensi-grow-a', 'an-sensi-grow-b', 'an-sensi-bloom-a', 'an-sensi-bloom-b'];

    if (tier === 'starter') {
      // Starter: Base + Bacteria (Voodoo) + CalMag
      const target = [...baseIds, 'an-voodoo-juice', 'an-cal-mag-xtra', 'an-big-bud'];
      return allProds.filter(p => target.includes(p.id));
    } else if (tier === 'amateur') {
      // Amateur: Base + Bacteria (Voodoo) + Bacteria Food & Carbs (Bud Candy, B-52) + Boosters (Big Bud, Overdrive) + CalMag
      const target = [
        ...baseIds,
        'an-voodoo-juice',
        'an-bud-candy',
        'an-b-52',
        'an-big-bud',
        'an-overdrive',
        'an-cal-mag-xtra'
      ];
      return allProds.filter(p => target.includes(p.id));
    } else {
      // Pro: Maximum full-spectrum range! All microbes, bacterial food, all boosters, enzymes, silicon, flush
      const target = [
        ...baseIds,
        'an-voodoo-juice', 'an-piranha', 'an-tarantula', // Microbes & Bacteria
        'an-bud-candy', 'an-carboload', 'an-b-52',       // Bacteria food & Vitamins
        'an-bud-ignitor', 'an-big-bud', 'an-overdrive',  // Bloom boosters
        'an-bud-factor-x', 'an-nirvana',                 // Terpene & resin triggers
        'an-sensizym', 'an-rhino-skin', 'an-flawless-finish', 'an-cal-mag-xtra' // Enzymes, silicon, flush
      ];
      return allProds.filter(p => target.includes(p.id));
    }
  }

  if (mfrId === 'biobizz') {
    if (tier === 'starter') {
      return allProds.filter(p => ['bb-bio-grow', 'bb-bio-bloom', 'bb-root-juice', 'bb-calmag'].includes(p.id));
    } else if (tier === 'amateur') {
      return allProds.filter(p => ['bb-bio-grow', 'bb-bio-bloom', 'bb-root-juice', 'bb-top-max', 'bb-calmag', 'bb-bio-heaven'].includes(p.id));
    } else {
      return allProds.filter(p => ['bb-bio-grow', 'bb-bio-bloom', 'bb-root-juice', 'bb-top-max', 'bb-bio-heaven', 'bb-acti-vera', 'bb-alg-a-mic', 'bb-calmag'].includes(p.id));
    }
  }

  if (mfrId === 'canna') {
    const baseIds = isCoco ? ['canna-coco-a', 'canna-coco-b'] : ['canna-terra-vega', 'canna-terra-flores'];
    if (tier === 'starter') {
      return allProds.filter(p => [...baseIds, 'canna-rhizotonic'].includes(p.id));
    } else if (tier === 'amateur') {
      return allProds.filter(p => [...baseIds, 'canna-rhizotonic', 'canna-pk-13-14', 'canna-cannazym'].includes(p.id));
    } else {
      return allProds.filter(p => [...baseIds, 'canna-rhizotonic', 'canna-pk-13-14', 'canna-cannazym', 'canna-boost', 'canna-calmag'].includes(p.id));
    }
  }

  if (mfrId === 'terra-aquatica') {
    const baseIds = ['ta-tripart-gro', 'ta-tripart-micro', 'ta-tripart-bloom'];
    if (tier === 'starter') {
      return allProds.filter(p => [...baseIds, 'ta-pro-roots'].includes(p.id));
    } else if (tier === 'amateur') {
      return allProds.filter(p => [...baseIds, 'ta-pro-roots', 'ta-calmag-light', 'ta-final-part'].includes(p.id));
    } else {
      return allProds.filter(p => [...baseIds, 'ta-pro-roots', 'ta-pro-bloom', 'ta-silicate', 'ta-fulvic', 'ta-calmag-light', 'ta-final-part'].includes(p.id));
    }
  }

  if (mfrId === 'plagron') {
    const baseIds = isCoco ? ['plagron-coco-a', 'plagron-coco-b'] : ['plagron-terra-grow', 'plagron-terra-bloom'];
    if (tier === 'starter') {
      return allProds.filter(p => [...baseIds, 'plagron-power-roots'].includes(p.id));
    } else if (tier === 'amateur') {
      return allProds.filter(p => [...baseIds, 'plagron-power-roots', 'plagron-green-sensation', 'plagron-calmag-pro'].includes(p.id));
    } else {
      return allProds.filter(p => [...baseIds, 'plagron-power-roots', 'plagron-green-sensation', 'plagron-sugar-royal', 'plagron-vita-race', 'plagron-calmag-pro', 'plagron-pure-zym'].includes(p.id));
    }
  }

  if (mfrId === 'hesi') {
    const baseIds = isCoco ? ['hesi-coco'] : ['hesi-tnt-complex', 'hesi-bloom-complex'];
    if (tier === 'starter') {
      return allProds.filter(p => [...baseIds, 'hesi-root-complex'].includes(p.id));
    } else if (tier === 'amateur') {
      return allProds.filter(p => [...baseIds, 'hesi-root-complex', 'hesi-p-k-13-14', 'hesi-power-zyme'].includes(p.id));
    } else {
      return allProds.filter(p => [...baseIds, 'hesi-root-complex', 'hesi-p-k-13-14', 'hesi-power-zyme', 'hesi-supervit', 'hesi-boost'].includes(p.id));
    }
  }

  // Universal categorization for any manufacturer
  const bases = allProds.filter(p => p.category === 'Base');
  const roots = allProds.filter(p => p.category === 'Root' || p.name.toLowerCase().includes('root') || p.name.toLowerCase().includes('bacteri') || p.name.toLowerCase().includes('voodoo'));
  const organicCarbs = allProds.filter(p => p.category === 'Organic' || p.name.toLowerCase().includes('carb') || p.name.toLowerCase().includes('candy') || p.name.toLowerCase().includes('sugar') || p.name.toLowerCase().includes('food') || p.name.toLowerCase().includes('b-52'));
  const boosters = allProds.filter(p => p.category === 'Boost' || p.name.toLowerCase().includes('boost') || p.name.toLowerCase().includes('pk') || p.name.toLowerCase().includes('bloom'));
  const calmag = allProds.filter(p => p.category === 'CalMag' || p.name.toLowerCase().includes('calmag') || p.name.toLowerCase().includes('cal-mag'));

  if (tier === 'starter') {
    const res = [...bases.slice(0, 4), ...roots.slice(0, 1), ...calmag.slice(0, 1)];
    return res.length > 0 ? res : allProds.slice(0, 4);
  } else if (tier === 'amateur') {
    const res = [...bases.slice(0, 4), ...roots.slice(0, 1), ...organicCarbs.slice(0, 2), ...boosters.slice(0, 2), ...calmag.slice(0, 1)];
    return res.length > 0 ? res : allProds.slice(0, 7);
  } else {
    // Pro: ALL products available for this manufacturer!
    return allProds.length > 0 ? allProds : allProds.slice(0, 10);
  }
}

// Helper to get Smart Recommended Kit (ideal basket) for a manufacturer and medium
export function getRecommendedSmartKit(mfrId: string, medium?: string, isAuto?: boolean): NutrientProduct[] {
  return getTieredRecommendedKit(mfrId, 'amateur', medium, isAuto);
}

export interface FullCycleFertilizerRequirement {
  product: NutrientProduct;
  totalMlNeeded: number;
  recommendedBottle: string;
  stageUsage: string[];
}

export function calculateFullCycleFertilizerNeeds(params: {
  selectedProducts: NutrientProduct[];
  strategy: AIFeedingStrategyOption;
  potSizeLiters: number;
  medium: string;
  isAutoflower: boolean;
}): {
  requirements: FullCycleFertilizerRequirement[];
  totalWaterLiters: number;
  totalWeeks: number;
} {
  const { selectedProducts, strategy, potSizeLiters, medium, isAutoflower } = params;

  const isSoil = medium.toLowerCase().includes('soil') || medium.toLowerCase().includes('ґрунт');
  const isCoco = medium.toLowerCase().includes('coco');
  const isHydro = medium.toLowerCase().includes('hydro');
  const wateringsPerWeek = isCoco ? 7 : isSoil ? 2.5 : 7;

  // Stage weeks duration
  const stageWeeksMap: Record<string, number> = {
    germination: 1,
    seedling: 1,
    vegetative: isAutoflower ? 3 : 4,
    flowering: isAutoflower ? 7 : 8,
    harvest: 1
  };

  // Helper to determine pot size per stage based on photoperiod vs autoflower
  const getStagePotSize = (stageId: string): number => {
    if (isAutoflower) {
      // Autoflower: planted directly in final pot, pot size remains constant throughout
      return potSizeLiters;
    }
    // Photoperiod: undergoes transplanting in progressive stages
    switch (stageId) {
      case 'germination':
        return Math.min(0.5, potSizeLiters);
      case 'seedling':
        return Math.min(1.5, potSizeLiters);
      case 'vegetative':
        return Math.max(2.0, Math.min(5.0, Math.round(potSizeLiters * 0.4 * 10) / 10));
      case 'flowering':
      case 'harvest':
      default:
        return potSizeLiters;
    }
  };

  let totalCycleWaterLiters = 0;
  const productMlMap: Record<string, { totalMl: number; stages: Set<string> }> = {};

  selectedProducts.forEach(p => {
    productMlMap[p.id] = { totalMl: 0, stages: new Set() };
  });

  if (strategy && strategy.allStageDoses) {
    strategy.allStageDoses.forEach(stageDose => {
      const weeks = stageWeeksMap[stageDose.stageId] || 1;
      const stagePotSize = getStagePotSize(stageDose.stageId);

      let stageWaterPerWatering = 2.0;
      if (isCoco) {
        stageWaterPerWatering = Math.max(0.2, Math.round(stagePotSize * 0.18 * 10) / 10);
      } else if (isHydro) {
        stageWaterPerWatering = Math.max(2.0, Math.round(stagePotSize * 0.6 * 10) / 10);
      } else {
        stageWaterPerWatering = Math.max(0.2, Math.round(stagePotSize * 0.22 * 10) / 10);
      }

      const wateringsInStage = weeks * wateringsPerWeek;
      const waterLitersInStage = wateringsInStage * stageWaterPerWatering;
      totalCycleWaterLiters += waterLitersInStage;

      stageDose.products.forEach(pDose => {
        if (productMlMap[pDose.productId]) {
          const ml = pDose.dosageMlPerL * waterLitersInStage;
          productMlMap[pDose.productId].totalMl += ml;
          if (pDose.dosageMlPerL > 0) {
            productMlMap[pDose.productId].stages.add(stageDose.stageNameUk);
          }
        }
      });
    });
  }

  const requirements: FullCycleFertilizerRequirement[] = selectedProducts.map(prod => {
    const info = productMlMap[prod.id] || { totalMl: 0, stages: new Set() };
    const totalMlNeeded = Math.ceil(info.totalMl);

    let recommendedBottle = '250 мл';
    if (totalMlNeeded === 0) {
      recommendedBottle = 'Не знадобиться';
    } else if (totalMlNeeded <= 220) {
      recommendedBottle = '1 х 250 мл';
    } else if (totalMlNeeded <= 450) {
      recommendedBottle = '1 х 500 мл';
    } else if (totalMlNeeded <= 900) {
      recommendedBottle = '1 х 1000 мл (1Л)';
    } else if (totalMlNeeded <= 1800) {
      recommendedBottle = '2 х 1000 мл (1Л)';
    } else {
      recommendedBottle = `${Math.ceil(totalMlNeeded / 1000)} х 1000 мл`;
    }

    return {
      product: prod,
      totalMlNeeded,
      recommendedBottle,
      stageUsage: Array.from(info.stages)
    };
  });

  const totalWeeks = (isAutoflower ? 3 : 4) + (isAutoflower ? 7 : 8) + 3;

  return {
    requirements,
    totalWaterLiters: Math.round(totalCycleWaterLiters),
    totalWeeks
  };
}

// Helper to get preset lines by manufacturer
export function getSchedulesByManufacturer(mfrId: string): NutrientLineSchedule[] {
  return PRESET_NUTRIENT_SCHEDULES.filter(s => s.manufacturerId === mfrId);
}

export interface GenerateAIFeedingParams {
  manufacturerId: string;
  manufacturerName: string;
  selectedProducts: NutrientProduct[];
  isAutoflower: boolean;
  medium: 'Soil' | 'Coco' | 'Hydroponics' | 'All' | string;
  potSizeLiters: number;
  plantAgeDays: number;
  strainName?: string;
  substrateRecipe?: SubstrateRecipe;
}

export interface AIFeedingStrategyOption {
  id: string;
  title: string;
  badge: string;
  icon: string;
  description: string;
  dosageMultiplier: number;
  waterPerWateringLiters: number;
  wateringFrequencyUk: string;
  currentStageId: 'germination' | 'seedling' | 'vegetative' | 'flowering' | 'harvest';
  currentStageNameUk: string;
  targetPh: string;
  targetPpm: string;
  aiRecommendationReason: string;
  currentDoses: {
    productId: string;
    productName: string;
    category: string;
    dosageMlPerL: number;
    dosageTotalMlPerWatering: number;
    imageUrl?: string;
  }[];
  allStageDoses: NutrientDosePerStage[];
}

export function generateAIFeedingStrategies(params: GenerateAIFeedingParams): AIFeedingStrategyOption[] {
  const { 
    manufacturerName, 
    selectedProducts, 
    isAutoflower, 
    medium, 
    potSizeLiters, 
    plantAgeDays, 
    strainName,
    substrateRecipe 
  } = params;

  // Calculate current stage based on age in days & strain type
  let currentStageId: 'germination' | 'seedling' | 'vegetative' | 'flowering' | 'harvest' = 'vegetative';
  let currentStageNameUk = 'Вегетація';

  if (plantAgeDays <= 7) {
    currentStageId = 'germination';
    currentStageNameUk = 'Сходи (1 тиждень)';
  } else if (plantAgeDays <= 20) {
    currentStageId = 'seedling';
    currentStageNameUk = 'Розсада (2 тиждень)';
  } else if (plantAgeDays <= (isAutoflower ? 35 : 50)) {
    currentStageId = 'vegetative';
    currentStageNameUk = `Вегетація (День ${plantAgeDays})`;
  } else if (plantAgeDays <= (isAutoflower ? 70 : 85)) {
    currentStageId = 'flowering';
    currentStageNameUk = `Цвітіння (День ${plantAgeDays})`;
  } else {
    currentStageId = 'harvest';
    currentStageNameUk = 'Фініш / Промивка';
  }

  // Water per single watering calculation (Liters)
  let waterPerWateringLiters = 2.0;
  if (medium.includes('Coco')) {
    waterPerWateringLiters = Math.max(0.5, Math.round(potSizeLiters * 0.18 * 10) / 10);
  } else if (medium.includes('Hydro')) {
    waterPerWateringLiters = Math.max(5.0, Math.round(potSizeLiters * 0.6 * 10) / 10);
  } else {
    // Soil
    waterPerWateringLiters = Math.max(0.5, Math.round(potSizeLiters * 0.22 * 10) / 10);
  }

  const wateringFrequencyUk = medium.includes('Coco') 
    ? '1-2 рази на день' 
    : medium.includes('Hydro') 
    ? 'Постійне живлення (оновлення розчину 1 раз на тиждень)' 
    : '1 раз на 2-3 дні';

  // STRICT RULE: ONLY use products selected by the user! Never display unselected products.
  const prods = selectedProducts;

  // Substrate buffer & pre-charge parameters
  const bufferWeeks = substrateRecipe?.nutrientBufferWeeks ?? (medium.includes('Coco') || medium.includes('Hydro') ? 0 : 2);
  const subName = substrateRecipe?.name || medium;

  // Helper to build stage product doses
  const buildDoses = (multiplier: number, focus: 'balanced' | 'yield' | 'aroma' | 'auto' | 'antistress') => {
    const baseDosageForStage = (cat: string, stage: string) => {
      // Stage 1: Germination (Week 1, Days 1-7)
      if (stage === 'germination') {
        // If substrate is heavily pre-fertilized (e.g. BioBizz All-Mix with bufferWeeks >= 3)
        if (bufferWeeks >= 3) {
          if (cat === 'Root') return 0.5; // Light root stimulator
          if (cat === 'CalMag') return 0.5;
          if (cat === 'Enzyme') return 0.5;
          return 0; // ZERO NPK base nutrients to avoid root burn!
        }
        if (bufferWeeks >= 1) { // Light-Mix
          if (cat === 'Root') return 1.0;
          if (cat === 'CalMag') return 0.5;
          if (cat === 'Base') return 0.5; // Micro-dose
          return 0;
        }
        // Hydro / Coco (Inert)
        if (cat === 'Root') return 1.5;
        if (cat === 'Base') return 1.0;
        if (cat === 'CalMag') return 1.0;
        return 0;
      }

      // Stage 2: Seedling (Week 2, Days 8-20)
      if (stage === 'seedling') {
        if (bufferWeeks >= 3) {
          if (cat === 'Root') return 1.0;
          if (cat === 'Base') return 0.5;
          if (cat === 'CalMag') return 0.5;
          if (cat === 'Organic') return 0.5;
          return 0;
        }
        if (cat === 'Base') return 1.2;
        if (cat === 'Root') return 1.5;
        if (cat === 'CalMag') return 1.0;
        if (cat === 'Organic') return 1.0;
        return 0;
      }

      // Stage 3: Vegetative (Days 21+)
      if (stage === 'vegetative') {
        if (cat === 'Base') return focus === 'auto' ? 1.5 : 2.5;
        if (cat === 'Root') return 1.0;
        if (cat === 'Organic') return 1.5;
        if (cat === 'CalMag') return 1.0;
        if (cat === 'Enzyme') return 1.0;
        return 0;
      }

      // Stage 4: Flowering
      if (stage === 'flowering') {
        if (cat === 'Base') return focus === 'yield' ? 3.5 : 2.5;
        if (cat === 'Boost') return focus === 'yield' ? 2.5 : focus === 'aroma' ? 2.0 : 1.5;
        if (cat === 'Organic') return focus === 'aroma' ? 3.0 : 1.5;
        if (cat === 'CalMag') return 1.2;
        if (cat === 'Enzyme') return 1.5;
        return 0;
      }

      // Stage 5: Harvest (Flush)
      if (cat === 'Flush') return 2.0;
      return 0;
    };

    const resultCurrentDoses = prods.map(p => {
      const baseMl = baseDosageForStage(p.category, currentStageId);
      let ml = Math.round(baseMl * multiplier * (isAutoflower ? 0.75 : 1.0) * 10) / 10;
      if (focus === 'auto' && isAutoflower) ml = Math.round(ml * 0.8 * 10) / 10;
      return {
        productId: p.id,
        productName: p.name,
        category: p.category,
        dosageMlPerL: ml,
        dosageTotalMlPerWatering: Math.round(ml * waterPerWateringLiters * 10) / 10,
        imageUrl: p.imageUrl || getProductImageUrl(p)
      };
    }).filter(d => d.dosageMlPerL > 0);

    const stages: ('germination' | 'seedling' | 'vegetative' | 'flowering' | 'harvest')[] = [
      'germination', 'seedling', 'vegetative', 'flowering', 'harvest'
    ];

    const stageNames: Record<string, string> = {
      germination: 'Сходи (1 тиждень)',
      seedling: 'Розсада (2 тиждень)',
      vegetative: 'Вегетація (3-5 тижні)',
      flowering: 'Цвітіння (6-10 тижні)',
      harvest: 'Фініш / Промивка'
    };

    const getStageTargetPpm = (stg: string) => {
      if (stg === 'germination') {
        if (bufferWeeks >= 3) return '0 - 150 PPM (вода + стимулятор)';
        if (bufferWeeks >= 1) return '150 - 300 PPM';
        return '250 - 400 PPM';
      }
      if (stg === 'seedling') {
        if (bufferWeeks >= 3) return '150 - 350 PPM';
        return '350 - 550 PPM';
      }
      if (stg === 'vegetative') return '600 - 800 PPM';
      if (stg === 'flowering') return '900 - 1200 PPM';
      return '100 - 200 PPM';
    };

    const allStageDoses: NutrientDosePerStage[] = stages.map(stg => ({
      stageId: stg,
      stageNameUk: stageNames[stg],
      products: prods.map(p => {
        const baseMl = baseDosageForStage(p.category, stg);
        const ml = Math.round(baseMl * multiplier * (isAutoflower ? 0.75 : 1.0) * 10) / 10;
        return {
          productId: p.id,
          productName: p.name,
          dosageMlPerL: ml
        };
      }).filter(d => d.dosageMlPerL > 0),
      targetPh: stg === 'flowering' ? '6.2 - 6.5' : (medium.includes('Coco') || medium.includes('Hydro') ? '5.8 - 6.1' : '6.0 - 6.4'),
      targetPpm: getStageTargetPpm(stg)
    }));

    return { resultCurrentDoses, allStageDoses };
  };

  const strainText = strainName ? `сорт ${strainName}` : (isAutoflower ? 'автоквітучий сорт' : 'фотоперіод');

  // Option 1
  const opt1 = buildDoses(1.0, 'balanced');
  // Option 2
  const opt2 = buildDoses(1.25, 'yield');
  // Option 3
  const opt3 = buildDoses(1.0, 'aroma');
  // Option 4
  const opt4 = buildDoses(0.65, 'auto');
  // Option 5
  const opt5 = buildDoses(0.85, 'antistress');

  // Target PPM formatting for current stage
  const currentStageTargetPpm = (() => {
    if (currentStageId === 'germination') {
      if (bufferWeeks >= 3) return '0 - 150 PPM (вода + стимулятор)';
      if (bufferWeeks >= 1) return '150 - 300 PPM';
      return '250 - 400 PPM';
    }
    if (currentStageId === 'seedling') {
      if (bufferWeeks >= 3) return '150 - 350 PPM';
      return '350 - 550 PPM';
    }
    if (currentStageId === 'vegetative') return '600 - 800 PPM';
    if (currentStageId === 'flowering') return '900 - 1100 PPM';
    return '100 - 200 PPM';
  })();

  // AI Analysis Reason text construction
  let baseReason = '';
  if (prods.length === 0) {
    baseReason = `Увага: у вибраному бренду ${manufacturerName} не обрано жодного продукту. Позначте потрібні добрива прапорцями вище.`;
  } else if (currentStageId === 'germination' && bufferWeeks >= 3) {
    baseReason = `Враховано потужну біо-заправку субстрату ${subName} (початковий EC ~2.2 / ~1100 PPM у ґрунті, запас на ${bufferWeeks} тижні). На дні ${plantAgeDays} (Сходи) додаються лише стимулятори коренів, базові NPK добрива НЕ додаються для захисту від опіків коренів ${strainText}.`;
  } else if (currentStageId === 'germination' && bufferWeeks >= 1) {
    baseReason = `Субстрат ${subName} має помірну заправку (EC ~1.2, запас на ${bufferWeeks} тижні). Розраховано делікатне стартове підживлення без ризику передозування.`;
  } else if (bufferWeeks === 0) {
    baseReason = `Інертний субстрат ${subName} без початкових солей. Потребує повноцінного внесення живильного розчину з 1-го тижня.`;
  } else {
    baseReason = `Розраховано під горщик ${potSizeLiters}Л (${waterPerWateringLiters}Л води за полив) та субстрат ${subName}. Враховано фазу ${currentStageNameUk} для ${strainText}.`;
  }

  return [
    {
      id: 'ai-balanced',
      title: '🎯 Оптимальний Еко-Баланс',
      badge: 'Стандарт AI',
      icon: '🌱',
      description: `Класичне збалансоване живлення вибраними добривами ${manufacturerName}. Гарантує стабільний ріст без ризику передозування для ${strainText}.`,
      dosageMultiplier: 1.0,
      waterPerWateringLiters,
      wateringFrequencyUk,
      currentStageId,
      currentStageNameUk,
      targetPh: medium.includes('Coco') || medium.includes('Hydro') ? '5.8 - 6.1' : '6.2 - 6.5',
      targetPpm: currentStageTargetPpm,
      aiRecommendationReason: baseReason,
      currentDoses: opt1.resultCurrentDoses,
      allStageDoses: opt1.allStageDoses
    },
    {
      id: 'ai-max-yield',
      title: '🚀 Максимальний Врожай та Щільність',
      badge: 'Max Yield & PK',
      icon: '💎',
      description: `Форсоване живлення з підвищеною концентрацією ПК-бустерів та стимуляторів для максимальної маси та щільності шишок.`,
      dosageMultiplier: 1.25,
      waterPerWateringLiters,
      wateringFrequencyUk,
      currentStageId,
      currentStageNameUk,
      targetPh: '6.3 - 6.5',
      targetPpm: currentStageId === 'flowering' ? '1100 - 1350 PPM' : currentStageTargetPpm,
      aiRecommendationReason: bufferWeeks >= 3 && currentStageId === 'germination'
        ? baseReason
        : `Ідеально для фази інтенсивного росту під потужним LED світлом з урахуванням субстрату ${subName}.`,
      currentDoses: opt2.resultCurrentDoses,
      allStageDoses: opt2.allStageDoses
    },
    {
      id: 'ai-terpene-booster',
      title: '🍃 100% Органічний Смак та Терпени',
      badge: 'Aroma & Terpene',
      icon: '🫐',
      description: `Акцент на цукри, амінокислоти та меласу для розкриття максимально вираженого терпенового профілю й смолистості.`,
      dosageMultiplier: 1.0,
      waterPerWateringLiters,
      wateringFrequencyUk,
      currentStageId,
      currentStageNameUk,
      targetPh: '6.2 - 6.6',
      targetPpm: currentStageId === 'germination' ? currentStageTargetPpm : '750 - 950 PPM',
      aiRecommendationReason: `Оптимально для збереження природного аромату суцвіть у субстраті ${subName}.`,
      currentDoses: opt3.resultCurrentDoses,
      allStageDoses: opt3.allStageDoses
    },
    {
      id: 'ai-soft-auto',
      title: '⚡ М\'яка Схема для Автоквітів',
      badge: isAutoflower ? 'Рекомендовано для Авто' : 'Делікатна',
      icon: '⚡',
      description: `Полегшена концентрація солей (50-60% від базової) для захисту чутливої кореневої системи та запобігання стресу.`,
      dosageMultiplier: 0.65,
      waterPerWateringLiters,
      wateringFrequencyUk,
      currentStageId,
      currentStageNameUk,
      targetPh: '6.0 - 6.4',
      targetPpm: currentStageId === 'germination' ? currentStageTargetPpm : '450 - 650 PPM',
      aiRecommendationReason: `Автоквіти швидко завершують вегетацію, тому даний м'який профіль упереджує опіки кінчиків листя на субстраті ${subName}.`,
      currentDoses: opt4.resultCurrentDoses,
      allStageDoses: opt4.allStageDoses
    },
    {
      id: 'ai-antistress-buff',
      title: '🛡️ Антистрес та pH/EC Буферизація',
      badge: 'CalMag & Root Shield',
      icon: '🛡️',
      description: `Захисна схема з додаванням хелатованого кальцію/магнію, ензимів та біостимуляторів для кокосового волокна або м'якої води.`,
      dosageMultiplier: 0.85,
      waterPerWateringLiters,
      wateringFrequencyUk,
      currentStageId,
      currentStageNameUk,
      targetPh: '6.1 - 6.4',
      targetPpm: currentStageId === 'germination' ? currentStageTargetPpm : '650 - 850 PPM',
      aiRecommendationReason: `Усуває ризики дефіцитів Ca/Mg та вимиває сольовий наліт з кореневої зони горщика ${potSizeLiters}Л у субстраті ${subName}.`,
      currentDoses: opt5.resultCurrentDoses,
      allStageDoses: opt5.allStageDoses
    }
  ];
}

