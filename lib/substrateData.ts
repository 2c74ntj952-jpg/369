import { SubstrateRecipe, SubstrateIngredient } from './types';

export interface SubstrateManufacturer {
  id: string;
  name: string;
  logoUrl?: string;
  country?: string;
  description: string;
}

export const SUBSTRATE_MANUFACTURERS: SubstrateManufacturer[] = [
  {
    id: 'BioBizz',
    name: 'BioBizz World Organic',
    description: '100% Органічні ґрунти та кокосові субстрати з сертифікованим біо-складом'
  },
  {
    id: 'Plagron',
    name: 'Plagron Passion for Growing',
    description: 'Преміальні торф\'яні та кокосові мікси з додаванням гуано та розпушувачів'
  },
  {
    id: 'Canna',
    name: 'CANNA Hydro & Terra',
    description: 'Професійні кокосові волокна та торф\'яні субстрати високої чистоти'
  },
  {
    id: 'FoxFarm',
    name: 'FoxFarm Soil & Fertilizer Co.',
    description: 'Багаті лісові мікси з морськими водоростями, рибним борошном та виливками черв\'яків'
  },
  {
    id: 'Westland',
    name: 'Westland Horticulture',
    description: 'Традиційні універсальні ґрунтосуміші з збалансованим PH'
  },
  {
    id: 'FloraGuard',
    name: 'Floragard Vertriebs GmbH',
    description: 'Німецька точність: очищений верховий та низинний торф з перлітом'
  }
];

export const AVAILABLE_INGREDIENTS: { id: string; name: string; category: string }[] = [
  { id: 'ing-soil-base', name: 'Базовий ґрунт / Торфосуміш', category: 'Основа' },
  { id: 'ing-coco-coir', name: 'Кокосове волокно (Coco Coir)', category: 'Основа' },
  { id: 'ing-perlite', name: 'Перліт (Perlite 2-4мм)', category: 'Розпушувач' },
  { id: 'ing-vermiculite', name: 'Вермикуліт (Vermiculite)', category: 'Утримання вологи' },
  { id: 'ing-worm-castings', name: 'Біогумус (Worm Castings)', category: 'Органічна пожива' },
  { id: 'ing-sphagnum', name: 'Мох Сфагнум', category: 'Органіка' },
  { id: 'ing-hydroton', name: 'Керамзит (Hydroton)', category: 'Дренаж' },
  { id: 'ing-mycorrhiza', name: 'Мікориза та корисні бактерії', category: 'Біодобавка' },
  { id: 'ing-dolomite', name: 'Доломітове борошно (pH Буфер)', category: 'Мінерали' },
  { id: 'ing-bat-guano', name: 'Гуано кажанів (Bat Guano)', category: 'Пожива' },
];

export const PRESET_SUBSTRATE_RECIPES: SubstrateRecipe[] = [
  // BIOBIZZ
  {
    id: 'biobizz-allmix',
    name: 'BioBizz All-Mix (Преміум Органічний Ґрунт)',
    manufacturer: 'BioBizz',
    mediumType: 'Soil',
    ingredients: [
      { id: '1', name: 'BioBizz Торф\'яний базовий ґрунт', percentage: 55, buyGuide: '🛒 Готова суміш верхового та низинного торфу BioBizz. Органічно заправлений субстрат.' },
      { id: '2', name: 'Перліт (Perlite)', percentage: 30, buyGuide: '🛒 Агроперліт фракції 2–4 мм. Промити від пилу перед змішуванням.' },
      { id: '3', name: 'Біогумус (Worm Castings)', percentage: 10, buyGuide: '🛒 100% чистий вермікомпост. Шукайте свіжий біогумус без хімічних добавок.' },
      { id: '4', name: 'Мікориза Преміум', percentage: 5, buyGuide: '🛒 Спори ендомікоризних грибів (Great White, MycoMadness або аналоги) для коренів.' }
    ],
    targetPhMin: 6.2,
    targetPhMax: 6.6,
    targetPpmMin: 650,
    targetPpmMax: 950,
    phTargetInfo: 'Цільовий pH субстрату: 6.2 – 6.6. Полив відстояною водою або розчином з pH 6.3 – 6.5.',
    aerationRating: '35% розпушувачів (Відмінне кореневе дихання)',
    waterRetention: 'Оптимальна (полив кожні 2–3 дні)',
    nutrientBufferWeeks: 4,
    notes: 'Заряджений органічними добривами на 4 тижні вегетації. Не потребує додаткового живлення в перший місяць.'
  },
  {
    id: 'biobizz-lightmix',
    name: 'BioBizz Light-Mix (Легкий Торф\'яний Ґрунт)',
    manufacturer: 'BioBizz',
    mediumType: 'Soil',
    ingredients: [
      { id: '1', name: 'BioBizz Light-Mix ґрунт', percentage: 75, buyGuide: '🛒 Легкий нейтралізований верховий торф із низькою солоністю (EC 1.2).' },
      { id: '2', name: 'Перліт (Perlite)', percentage: 25, buyGuide: '🛒 Вспучений перліт фракції 2–5 мм для максимального дихання.' }
    ],
    targetPhMin: 6.2,
    targetPhMax: 6.5,
    targetPpmMin: 300,
    targetPpmMax: 500,
    phTargetInfo: 'Цільовий pH субстрату: 6.2 – 6.5. Для поливу рекомендовано розчин з pH 6.2 – 6.4.',
    aerationRating: '25% Перліту (Висока аерація)',
    waterRetention: 'Легка (потрібен частіший полив)',
    nutrientBufferWeeks: 2,
    notes: 'Легкий субстрат для розсади та точного контролю добрив гровером.'
  },
  {
    id: 'biobizz-cocomix',
    name: 'BioBizz Coco-Mix (100% Кокосове волокно)',
    manufacturer: 'BioBizz',
    mediumType: 'Coco',
    ingredients: [
      { id: '1', name: 'Очищене кокосове волокно BioBizz', percentage: 80, buyGuide: '🛒 Промитий кокосовий субстрат із низьким EC (< 0.4). Купувати у герметичних мішках або брикетах.' },
      { id: '2', name: 'Агроекологічний перліт', percentage: 20, buyGuide: '🛒 Агроперліт крупний (3–6 мм) без хімічної обробки.' }
    ],
    targetPhMin: 5.8,
    targetPhMax: 6.2,
    targetPpmMin: 400,
    targetPpmMax: 700,
    phTargetInfo: 'Цільовий pH інертного кокосу: 5.8 – 6.2. Всі поливи мають бути строго в діапазоні pH 5.8 – 6.0.',
    aerationRating: 'Максимальна аерація (кокос + перліт)',
    waterRetention: 'Швидке висихання (щоденний або через день полив)',
    nutrientBufferWeeks: 0,
    notes: 'Інертний кокосовий субстрат. Потребує внесення CalMag та рідких добрив з першого поливу.'
  },

  // PLAGRON
  {
    id: 'plagron-lightmix',
    name: 'Plagron Lightmix (Торф з Перлітом)',
    manufacturer: 'Plagron',
    mediumType: 'Soil',
    ingredients: [
      { id: '1', name: 'Plagron Lightmix верховий торф', percentage: 80, buyGuide: '🛒 Торф білий верховий якісного очищення (pH 6.0).' },
      { id: '2', name: 'Перліт 2-4мм', percentage: 20, buyGuide: '🛒 Агроперліт середньої фракції 2-4 мм.' }
    ],
    targetPhMin: 6.0,
    targetPhMax: 6.5,
    targetPpmMin: 400,
    targetPpmMax: 650,
    phTargetInfo: 'Цільовий pH субстрату: 6.0 – 6.5. Полив розчином pH 6.2 – 6.4.',
    aerationRating: 'Збалансована аерація',
    waterRetention: 'Помірна',
    nutrientBufferWeeks: 1,
    notes: 'Універсальний стартовий мікс з м\'яким початковим запасом добрив на 1 тиждень.'
  },
  {
    id: 'plagron-growmix',
    name: 'Plagron Growmix (Збагачений Ґрунт)',
    manufacturer: 'Plagron',
    mediumType: 'Soil',
    ingredients: [
      { id: '1', name: 'Plagron Верховий та низинний торф', percentage: 70, buyGuide: '🛒 Суміш верхового білого та низинного чорного торфу.' },
      { id: '2', name: 'Перліт', percentage: 20, buyGuide: '🛒 Перліт фракції 2–5 мм.' },
      { id: '3', name: 'Біогумус та мінерали', percentage: 10, buyGuide: '🛒 Натуральний вермікомпост та біологічні мінерали.' }
    ],
    targetPhMin: 6.0,
    targetPhMax: 6.5,
    targetPpmMin: 600,
    targetPpmMax: 900,
    phTargetInfo: 'Цільовий pH субстрату: 6.0 – 6.5. Оптимальний pH поливальної води: 6.3.',
    aerationRating: '20% Перліту',
    waterRetention: 'Оптимальна вологоємність',
    nutrientBufferWeeks: 3,
    notes: 'Повністю підготовлений ґрунт із заправкою добрив на 3 тижні активного росту.'
  },
  {
    id: 'plagron-batmix',
    name: 'Plagron Batmix (Гуано кажанів & Органіка)',
    manufacturer: 'Plagron',
    mediumType: 'Soil',
    ingredients: [
      { id: '1', name: 'Plagron Верховий торф', percentage: 60, buyGuide: '🛒 Очищений верховий сфагновий торф.' },
      { id: '2', name: 'Перліт', percentage: 25, buyGuide: '🛒 Агроперліт 3–5 мм.' },
      { id: '3', name: 'Гуано кажанів (Bat Guano)', percentage: 15, buyGuide: '🛒 Натуральне сухе гуано кажанів. Заряджає фосфором та органікою.' }
    ],
    targetPhMin: 6.2,
    targetPhMax: 6.7,
    targetPpmMin: 750,
    targetPpmMax: 1100,
    phTargetInfo: 'Цільовий pH органіки: 6.2 – 6.7. Полив відстояною водою pH 6.4 – 6.6.',
    aerationRating: '25% розпушування',
    waterRetention: 'Висока (утримує вологу)',
    nutrientBufferWeeks: 6,
    notes: 'Насичений натуральним гуано для неперевершеного смаку та аромату суцвіть.'
  },
  {
    id: 'plagron-cocos-premium',
    name: 'Plagron Cocos Premium (100% Буферизований Кокос)',
    manufacturer: 'Plagron',
    mediumType: 'Coco',
    ingredients: [
      { id: '1', name: 'Промитий та буферизований кокос Plagron', percentage: 85, buyGuide: '🛒 Буферизоване кокосове волокно низької солоності з додаванням триходерми.' },
      { id: '2', name: 'Перліт', percentage: 15, buyGuide: '🛒 Крупний перліт 3-6мм.' }
    ],
    targetPhMin: 5.6,
    targetPhMax: 6.0,
    targetPpmMin: 400,
    targetPpmMax: 700,
    phTargetInfo: 'Цільовий pH для кокосу: 5.6 – 6.0. Полив розчином pH 5.8.',
    aerationRating: 'Висока коренева аерація',
    waterRetention: 'Швидке висихання',
    nutrientBufferWeeks: 0,
    notes: 'Преміальний кокосовий субстрат низької електропровідності (EC).'
  },

  // CANNA
  {
    id: 'canna-terra-pro',
    name: 'CANNA Terra Professional',
    manufacturer: 'Canna',
    mediumType: 'Soil',
    ingredients: [
      { id: '1', name: 'Canna Чорний торф та мох', percentage: 75, buyGuide: '🛒 Професійний верховий торф від бренду CANNA.' },
      { id: '2', name: 'Перліт високої фракції', percentage: 25, buyGuide: '🛒 Агроперліт 3–5 мм.' }
    ],
    targetPhMin: 6.0,
    targetPhMax: 6.5,
    targetPpmMin: 500,
    targetPpmMax: 800,
    phTargetInfo: 'Цільовий pH субстрату: 6.0 – 6.5. Полив розчином з pH 6.2 – 6.4.',
    aerationRating: '25% Перліту',
    waterRetention: 'Помірно-висока',
    nutrientBufferWeeks: 3,
    notes: 'Професійний стандарт європейських гроверів з високим ступенем очищення.'
  },
  {
    id: 'canna-terra-pro-plus',
    name: 'CANNA Terra Professional Plus (Органічний Чорний Торф)',
    manufacturer: 'Canna',
    mediumType: 'Soil',
    ingredients: [
      { id: '1', name: 'Canna Спеціальний біо-торф', percentage: 70, buyGuide: '🛒 Спеціальний добірний чорний торф високої вологоємності.' },
      { id: '2', name: 'Перліт та кора сосни', percentage: 30, buyGuide: '🛒 Перліт та компостована кора для аерації.' }
    ],
    targetPhMin: 6.0,
    targetPhMax: 6.6,
    targetPpmMin: 600,
    targetPpmMax: 900,
    phTargetInfo: 'Цільовий pH субстрату: 6.0 – 6.6. Полив pH 6.3 – 6.5.',
    aerationRating: '30% Аерація',
    waterRetention: 'Висока',
    nutrientBufferWeeks: 4,
    notes: 'Вищого ґатунку органіка для потужного нарощування кореневої маси.'
  },
  {
    id: 'canna-coco-plus',
    name: 'CANNA Coco Professional Plus (Буферизоване Волокно)',
    manufacturer: 'Canna',
    mediumType: 'Coco',
    ingredients: [
      { id: '1', name: 'Canna Буферизований Кокос', percentage: 70, buyGuide: '🛒 100% буферизований та промитий кокос CANNA.' },
      { id: '2', name: 'Перліт 3-6мм', percentage: 30, buyGuide: '🛒 Крупний перліт для насичення киснем.' }
    ],
    targetPhMin: 5.6,
    targetPhMax: 6.0,
    targetPpmMin: 450,
    targetPpmMax: 750,
    phTargetInfo: 'Цільовий pH для кокосу: 5.6 – 6.0. Полив строго pH 5.8.',
    aerationRating: 'Супер-аерація (30% Перліт)',
    waterRetention: 'Швидке промивання',
    nutrientBufferWeeks: 0,
    notes: 'Промитий від солей та буферизований кальцієм кокос преміум якості.'
  },

  // FOXFARM
  {
    id: 'foxfarm-ocean-forest',
    name: 'FoxFarm Ocean Forest (Багатий Органічний Ґрунт)',
    manufacturer: 'FoxFarm',
    mediumType: 'Soil',
    ingredients: [
      { id: '1', name: 'FoxFarm Торф та лісовий гумус', percentage: 60, buyGuide: '🛒 Торф\'яна лісова основа з листяним перегноєм.' },
      { id: '2', name: 'Рибне борошно та крабова молюска', percentage: 20, buyGuide: '🛒 Морська органічна заправка FoxFarm.' },
      { id: '3', name: 'Перліт та вермикуліт', percentage: 20, buyGuide: '🛒 Дренажний мікс 50/50.' }
    ],
    targetPhMin: 6.3,
    targetPhMax: 6.8,
    targetPpmMin: 800,
    targetPpmMax: 1100,
    phTargetInfo: 'Цільовий pH субстрату: 6.3 – 6.8. Полив pH 6.4 – 6.6.',
    aerationRating: 'Помірна аерація',
    waterRetention: 'Висока вологоємність',
    nutrientBufferWeeks: 5,
    notes: 'Багатий поживними речовинами ґрунт з морськими екстрактами.'
  },
  {
    id: 'foxfarm-happy-frog',
    name: 'FoxFarm Happy Frog (М\'який Торф з Мікоризою)',
    manufacturer: 'FoxFarm',
    mediumType: 'Soil',
    ingredients: [
      { id: '1', name: 'Happy Frog верховий торф', percentage: 70, buyGuide: '🛒 М\'який верховий торф для молодого коріння.' },
      { id: '2', name: 'Біогумус та мікориза', percentage: 15, buyGuide: '🛒 Біогумус та 20 видів корисних ґрунтових бактерій.' },
      { id: '3', name: 'Перліт', percentage: 15, buyGuide: '🛒 Перліт фракції 2–4 мм.' }
    ],
    targetPhMin: 6.2,
    targetPhMax: 6.7,
    targetPpmMin: 450,
    targetPpmMax: 700,
    phTargetInfo: 'Цільовий pH субстрату: 6.2 – 6.7. Полив pH 6.3 – 6.5.',
    aerationRating: 'Добре дихання',
    waterRetention: 'Збалансована',
    nutrientBufferWeeks: 3,
    notes: 'М\'який склад з корисними ґрунтовими мікроорганізмами для розсади.'
  },
  {
    id: 'foxfarm-ocean-frog',
    name: 'FoxFarm Ocean Forest + Happy Frog (50/50)',
    manufacturer: 'FoxFarm',
    mediumType: 'Soil',
    ingredients: [
      { id: '1', name: 'FoxFarm Ocean Forest', percentage: 45, buyGuide: '🛒 Ґрунт FoxFarm Ocean Forest.' },
      { id: '2', name: 'FoxFarm Happy Frog', percentage: 45, buyGuide: '🛒 Ґрунт FoxFarm Happy Frog.' },
      { id: '3', name: 'Агроперліт', percentage: 10, buyGuide: '🛒 Перліт 3-5 мм.' }
    ],
    targetPhMin: 6.3,
    targetPhMax: 6.8,
    targetPpmMin: 700,
    targetPpmMax: 1000,
    phTargetInfo: 'Цільовий pH субстрату: 6.3 – 6.8. Полив pH 6.4 – 6.6.',
    aerationRating: 'Помірна аерація',
    waterRetention: 'Висока вологоємність',
    nutrientBufferWeeks: 4,
    notes: 'Легендарний американський мікс 50/50 для ідеального балансу поживних речовин.'
  },

  // WESTLAND
  {
    id: 'westland-universal',
    name: 'Westland Торфосуміш + Перліт (80/20)',
    manufacturer: 'Westland',
    mediumType: 'Soil',
    ingredients: [
      { id: '1', name: 'Westland Торфосуміш', percentage: 80, buyGuide: '🛒 Універсальна торфосуміш Westland для рослин.' },
      { id: '2', name: 'Агроперліт', percentage: 20, buyGuide: '🛒 Агроперліт 2-4 мм.' }
    ],
    targetPhMin: 6.0,
    targetPhMax: 6.5,
    targetPpmMin: 400,
    targetPpmMax: 700,
    phTargetInfo: 'Цільовий pH субстрату: 6.0 – 6.5. Полив pH 6.2 – 6.4.',
    aerationRating: '20% Перліту',
    waterRetention: 'Стандартна',
    nutrientBufferWeeks: 3,
    notes: 'Доступний та надійний базовий торф\'яний субстрат.'
  },

  // FLORAGARD
  {
    id: 'floragard-tks2',
    name: 'Floragard TKS 2 Instant Plus (Німецький Торф)',
    manufacturer: 'FloraGuard',
    mediumType: 'Soil',
    ingredients: [
      { id: '1', name: 'Floragard Верховий білий торф', percentage: 80, buyGuide: '🛒 Професійний німецький білий верховий торф TKS 2.' },
      { id: '2', name: 'Перліт та смачувальний агент', percentage: 20, buyGuide: '🛒 Агроперліт + водний смачувальний агент Instant Plus.' }
    ],
    targetPhMin: 5.8,
    targetPhMax: 6.4,
    targetPpmMin: 500,
    targetPpmMax: 800,
    phTargetInfo: 'Цільовий pH субстрату: 5.8 – 6.4. Полив pH 6.2 – 6.4.',
    aerationRating: 'Німецька точність фракції',
    waterRetention: 'Висока утримуваність',
    nutrientBufferWeeks: 3,
    notes: 'Професійний субстрат зі зволожувальним агентом для рівномірного просочення вологою.'
  },

  // DIY CUSTOM
  {
    id: 'diy-living-soil',
    name: 'Super Soil Living Organic (Крафтовий Живий Ґрунт)',
    manufacturer: 'DIY',
    mediumType: 'Soil',
    ingredients: [
      { id: '1', name: 'Базовий торф', percentage: 40, buyGuide: '🛒 Нейтралізований верховий торф pH 5.5-6.2 (напр. Klasmann TS1 або BioBizz Lightmix).' },
      { id: '2', name: 'Кокосове волокно', percentage: 25, buyGuide: '🛒 Промитий кокосовий волокнистий субстрат.' },
      { id: '3', name: 'Перліт & Вермикуліт', percentage: 20, buyGuide: '🛒 Суміш агроперліту 3-5мм та вермикуліту (підвищує вологоємність).' },
      { id: '4', name: 'Біогумус та мікориза', percentage: 15, buyGuide: '🛒 Свіжий якісний біогумус + сухі спори ендомікоризи (Glomus intraradices).' }
    ],
    targetPhMin: 6.2,
    targetPhMax: 6.7,
    targetPpmMin: 600,
    targetPpmMax: 900,
    phTargetInfo: 'Цільовий pH живого ґрунту: 6.2 – 6.7. Полив відстояною водою pH 6.4 – 6.6.',
    aerationRating: '20% Розпушувачів (Висока)',
    waterRetention: 'Оптимальне утримання',
    nutrientBufferWeeks: 4,
    notes: 'Крафтовий органічний живий ґрунт з активною мікрофлорою.'
  },
  {
    id: 'diy-coco-perlite',
    name: 'DIY Coco + Perlite 70/30 (Авторський Кокосовий Мікс)',
    manufacturer: 'DIY',
    mediumType: 'Coco',
    ingredients: [
      { id: '1', name: 'Промитий Кокос', percentage: 70, buyGuide: '🛒 Кокосовий брикет або готовий кокос. Обов\'язково промити від солей (EC < 0.3) та обробити CalMag!' },
      { id: '2', name: 'Агроперліт 3-6мм', percentage: 30, buyGuide: '🛒 Великий спучений перліт для кокосового субстрату.' }
    ],
    targetPhMin: 5.7,
    targetPhMax: 6.1,
    targetPpmMin: 400,
    targetPpmMax: 700,
    phTargetInfo: 'Цільовий pH кокосового міксу: 5.7 – 6.1. Усі поливи строго з pH 5.8 – 6.0.',
    aerationRating: 'Висока киснева проникність',
    waterRetention: 'Швидке промивання',
    nutrientBufferWeeks: 0,
    notes: 'Класичний крафтовий кокосовий субстрат.'
  }
];

export function getDefaultRecipeForMedium(medium: 'Soil' | 'Coco' | 'Hydroponics', manufacturer?: string): SubstrateRecipe {
  if (manufacturer) {
    const found = PRESET_SUBSTRATE_RECIPES.find(r => r.manufacturer === manufacturer && r.mediumType === medium);
    if (found) return JSON.parse(JSON.stringify(found));
  }

  const defaultForMedium = PRESET_SUBSTRATE_RECIPES.find(r => r.mediumType === medium);
  if (defaultForMedium) return JSON.parse(JSON.stringify(defaultForMedium));

  return JSON.parse(JSON.stringify(PRESET_SUBSTRATE_RECIPES[0]));
}

export interface WorldGrowerRecipe extends SubstrateRecipe {
  author: string;
  recommendedFor: string;
  matchingBreeders?: string[];
  isAutoflowerOptimized?: boolean;
}

export const WORLD_GROWER_RECIPES: WorldGrowerRecipe[] = [
  {
    id: 'world-subcool-super-soil',
    name: 'Super Soil Subcool (Легендарний Living Soil)',
    author: 'Subcool / The Rev (США 🇺🇸)',
    recommendedFor: 'Органічне вирощування, підходить для автоквітів та фотоперіодів від Royal Queen Seeds, FastBuds, Humboldt',
    manufacturer: 'DIY',
    mediumType: 'Soil',
    matchingBreeders: ['Royal Queen Seeds', 'FastBuds', 'Humboldt Seed Organization', 'Barney\'s Farm'],
    isAutoflowerOptimized: true,
    ingredients: [
      { id: '1', name: 'Базовий органічний торфо-ґрунт', percentage: 40, buyGuide: '🛒 Якісний нейтралізований верховий торф\'яний субстрат (напр. BioBizz Light-Mix або Klasmann TS1). Фракція 0–10 мм.' },
      { id: '2', name: 'Біогумус (Worm Castings)', percentage: 25, buyGuide: '🛒 Свіжий 100% хробачий біогумус (вермікомпост). Джерело гумінових кислот та корисної мікрофлори.' },
      { id: '3', name: 'Перліт & Вермикуліт 50/50', percentage: 20, buyGuide: '🛒 Суміш агроперліту (3–5 мм) та спученого вермикуліту для дренажу та рівномірного утримання влаги.' },
      { id: '4', name: 'Гуано кажанів & Кісткове борошно', percentage: 10, buyGuide: '🛒 Органічний порошок Bat Guano (для фосфору) + подрібнене кісткове борошно для калію й кальцію.' },
      { id: '5', name: 'Доломітове борошно & Біо-мікориза', percentage: 5, buyGuide: '🛒 Природний доломіт (буфер pH та джерело Mg/Ca: ~1 ст.л. на 10л) + спори ендомікоризних грибів.' }
    ],
    targetPhMin: 6.3,
    targetPhMax: 6.8,
    targetPpmMin: 750,
    targetPpmMax: 1050,
    phTargetInfo: 'Цільовий pH живого ґрунту: 6.3 – 6.8. Мікробіом сам регулює баланс, поливайте чистою водою pH 6.4 – 6.6.',
    aerationRating: '20% Перліту/Вермикуліту (Оптимальна)',
    waterRetention: 'Висока натуральна вологоємність',
    nutrientBufferWeeks: 6,
    notes: 'Легендарна каліфорнійська рецептура «No-Till Super Soil». Забезпечує рослину повним спектром живильних елементів від насінини до харвесту без використання хімічних мінеральних добрив.'
  },
  {
    id: 'world-coco-auto-master',
    name: 'Auto-Master Coco 70/30 (Аеро-Кокос)',
    author: 'Coco For Cannabis Pro Team (Канада 🇨🇦)',
    recommendedFor: 'Швидкорослі автоквіти від FastBuds, Royal Queen Seeds, Sweet Seeds',
    manufacturer: 'DIY',
    mediumType: 'Coco',
    matchingBreeders: ['FastBuds', 'Royal Queen Seeds', 'Sweet Seeds', 'Dutch Passion'],
    isAutoflowerOptimized: true,
    ingredients: [
      { id: '1', name: 'Промитий та буферизований Кокос', percentage: 70, buyGuide: '🛒 Кокосовий субстрат (Plagron/Canna/BioBizz). Обов\'язково промити від солей (EC < 0.4) та забуферити CalMag!' },
      { id: '2', name: 'Агроперліт крупної фракції (3-6мм)', percentage: 30, buyGuide: '🛒 Великий спучений перліт без дрібного пилу. Створює аераційні кишені для миттєвого розвитку коренів.' }
    ],
    targetPhMin: 5.7,
    targetPhMax: 6.1,
    targetPpmMin: 450,
    targetPpmMax: 750,
    phTargetInfo: 'Цільовий pH кокосу: 5.7 – 6.1. Полив поживним розчином строго pH 5.8 – 6.0.',
    aerationRating: '30% Агроперліт (Супер-аерація коренів)',
    waterRetention: 'Швидка просушуваність (полив 1-2 рази на день)',
    nutrientBufferWeeks: 0,
    notes: 'Найпопулярніший у світі рецепт для вирощування швидкорослих автоквітів. Забезпечує масивне насичення коренів киснем та вибуховий ріст.'
  },
  {
    id: 'world-amsterdam-coffeeshop',
    name: 'Amsterdam CoffeeShop Heavy Mix (Нідерланди)',
    author: 'Amsterdam Breeders Guild (Нідерланди 🇳🇱)',
    recommendedFor: 'Класичні амстердамські сортові лінії від Sensi Seeds, Dutch Passion, Barney\'s Farm',
    manufacturer: 'DIY',
    mediumType: 'Soil',
    matchingBreeders: ['Sensi Seeds', 'Dutch Passion', 'Barney\'s Farm', 'Greenhouse Seed Co.'],
    isAutoflowerOptimized: false,
    ingredients: [
      { id: '1', name: 'Чорний низинний торф', percentage: 50, buyGuide: '🛒 Зрілий низинний чорний торф високої вологоємності з гуматами.' },
      { id: '2', name: 'Верховий білий торф', percentage: 20, buyGuide: '🛒 Легкий білий торф фракції 0-10 мм для пухкості та аерації.' },
      { id: '3', name: 'Перліт високої фракції', percentage: 20, buyGuide: '🛒 Агроперліт крупної фракції 3-6 мм.' },
      { id: '4', name: 'Біогумус та подрібнена кора сосни', percentage: 10, buyGuide: '🛒 Натуральний вермікомпост + закомпостована подрібнена соснова кора (2-5 мм).' }
    ],
    targetPhMin: 6.0,
    targetPhMax: 6.5,
    targetPpmMin: 600,
    targetPpmMax: 900,
    phTargetInfo: 'Цільовий pH суміші: 6.0 – 6.5. Полив розчином або водою з pH 6.2 – 6.4.',
    aerationRating: '20% Перліту',
    waterRetention: 'Оптимально збалансована',
    nutrientBufferWeeks: 4,
    notes: 'Перевірений часом нідерландський рецепт для формування щільних суцвіть та яскравого терпенного аромату.'
  },
  {
    id: 'world-california-living-organic',
    name: 'Emerald Triangle Living Organic (Каліфорнія)',
    author: 'Emerald Triangle Master Growers (США 🇺🇸)',
    recommendedFor: 'Органічні фотоперіоди та автоквіти від Humboldt Seed Org, FastBuds, Barney\'s Farm',
    manufacturer: 'DIY',
    mediumType: 'Soil',
    matchingBreeders: ['Humboldt Seed Organization', 'FastBuds', 'Barney\'s Farm'],
    isAutoflowerOptimized: true,
    ingredients: [
      { id: '1', name: 'Лісовий компресований гумус та торф', percentage: 50, buyGuide: '🛒 Компостований лісовий перегній з верховим торфом pH 6.0-6.5.' },
      { id: '2', name: 'Кокосовий чипс & Перліт', percentage: 25, buyGuide: '🛒 Подрібнений кокосовий чипс 5-10 мм + агроперліт 3-6 мм.' },
      { id: '3', name: 'Біогумус та жива мікориза', percentage: 15, buyGuide: '🛒 Якісний біогумус із бактеріями ризосфери та мікоризою.' },
      { id: '4', name: 'Морські водорості & Доломітове борошно', percentage: 10, buyGuide: '🛒 Борошно з бурих водоростей Kelp Meal + тонко подрібнений доломіт Ca/Mg.' }
    ],
    targetPhMin: 6.2,
    targetPhMax: 6.7,
    targetPpmMin: 650,
    targetPpmMax: 950,
    phTargetInfo: 'Цільовий pH каліфорнійської органіки: 6.2 – 6.7. Полив водой pH 6.4 – 6.6.',
    aerationRating: '25% Розпушувачів',
    waterRetention: 'Висока біологічна ємність',
    nutrientBufferWeeks: 5,
    notes: 'Каліфорнійський крафтовий живий ґрунт з активною мікрофлорою, який розкриває максимум ТГК та ароматичного профілю.'
  },
  {
    id: 'world-bio-aerated-express',
    name: 'Bio-Aerated Express Mix (Іспанія)',
    author: 'Spanish Organic Growers (Іспанія 🇪🇸)',
    recommendedFor: 'Легкий та швидкий старт для сортів від Sweet Seeds, Royal Queen Seeds, Dinafem',
    manufacturer: 'DIY',
    mediumType: 'Soil',
    matchingBreeders: ['Sweet Seeds', 'Royal Queen Seeds', 'Dinafem'],
    isAutoflowerOptimized: true,
    ingredients: [
      { id: '1', name: 'Легкий верховий торф', percentage: 50, buyGuide: '🛒 Світлий верховий сфагновий торф (pH 5.5–6.2, фракція 0–10 мм). Позначка "для розсади" або "нейтралізований".' },
      { id: '2', name: 'Перліт високої фракції', percentage: 30, buyGuide: '🛒 Спучений агроперліт крупної фракції 3–6 мм. Промийте водою від білого пилу!' },
      { id: '3', name: 'Мох сфагнум та біогумус', percentage: 20, buyGuide: '🛒 Сушений подрібнений Сфагнум + свіжий хробачий біогумус (вермікомпост) 100% чистоти.' }
    ],
    targetPhMin: 6.0,
    targetPhMax: 6.5,
    targetPpmMin: 400,
    targetPpmMax: 700,
    phTargetInfo: 'Цільовий pH іспанського легкого міксу: 6.0 – 6.5. Полив розчином або водою з pH 6.2 – 6.4.',
    aerationRating: '30% Перліту (Максимальне кореневе дихання)',
    waterRetention: 'Легка, запобігає переливу',
    nutrientBufferWeeks: 2,
    notes: 'Іспанська легка суміш з підвищеним аеаційним об\'ємом. Запобігає загниванню коренів у початківців та прискорює ріст.'
  }
];

export function getRecommendedGrowerRecipes(strainName?: string, breederName?: string): WorldGrowerRecipe[] {
  if (!breederName && !strainName) return WORLD_GROWER_RECIPES;

  const isAuto = strainName?.toLowerCase().includes('auto') || strainName?.toLowerCase().includes('авто');

  return [...WORLD_GROWER_RECIPES].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (breederName) {
      if (a.matchingBreeders?.some(b => b.toLowerCase() === breederName.toLowerCase())) scoreA += 10;
      if (b.matchingBreeders?.some(b => b.toLowerCase() === breederName.toLowerCase())) scoreB += 10;
    }

    if (isAuto) {
      if (a.isAutoflowerOptimized) scoreA += 5;
      if (b.isAutoflowerOptimized) scoreB += 5;
    }

    return scoreB - scoreA;
  });
}

export function getAdaptedSubstrateRecommendations(recipe: SubstrateRecipe) {
  const phTargetStr = `${recipe.targetPhMin.toFixed(1)} – ${recipe.targetPhMax.toFixed(1)}`;
  const ppmTargetStr = `${recipe.targetPpmMin} – ${recipe.targetPpmMax} PPM`;

  let wateringAdvice = 'Полив кожні 2-3 дні при висиханні верху на 2-3 см.';
  if (recipe.mediumType === 'Coco') {
    wateringAdvice = 'Частий полив (щодня або через день) з виходом 10-20% дренажу.';
  } else if (recipe.mediumType === 'Hydroponics') {
    wateringAdvice = 'Постійний контроль рівня та аерації розчину. Заміна розчину кожні 7-10 днів.';
  } else if (recipe.waterRetention.includes('Висока')) {
    wateringAdvice = 'Помірний полив раз на 3-4 дні. Обов\'язково перевіряйте просушування!';
  }

  let nutrientAdvice = `Живлення: початковий буфер ${recipe.nutrientBufferWeeks} тижні.`;
  if (recipe.nutrientBufferWeeks === 0) {
    nutrientAdvice = 'Інертний субстрат: вносьте добрива та CalMag з першого поливу!';
  } else if (recipe.nutrientBufferWeeks >= 4) {
    nutrientAdvice = 'Багатий субстрат: чиста вода перші 3-4 тижні вегетації.';
  }

  return {
    phTargetStr,
    ppmTargetStr,
    wateringAdvice,
    nutrientAdvice,
    aeration: recipe.aerationRating,
    bufferWeeks: recipe.nutrientBufferWeeks
  };
}
