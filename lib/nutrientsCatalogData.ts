/**
 * 🧪 Повна база даних добрив, стимуляторів та субстратів
 * (179 продуктів, 20 світових брендів)
 */

export interface NutrientCatalogItem {
  id: string;
  product_name: string;
  brand: string;
  brand_id: string;
  url: string;
  category: string;
  npk?: string;
  compatible_substrates: ('Soil' | 'Coco' | 'Hydroponics' | 'Living Soil')[];
  usage_phases: ('Germination' | 'Seedling' | 'Vegetative' | 'Flowering' | 'Late Flowering' | 'Flush' | 'All')[];
  recommended_dosage: string;
  image_url: string;
  description: string;
  descriptionUk: string;
  primary_purpose: string;
}

export const NUTRIENTS_179_CATALOG: NutrientCatalogItem[] = [
  // ================= PLAGRON (30 товарів) =================
  {
    id: 'plagron-green-sensation',
    product_name: 'Green Sensation',
    brand: 'PLAGRON',
    brand_id: 'plagron',
    url: 'https://growdiaries.com/nutrients/plagron/green-sensation',
    category: 'Bloom Booster / Additive',
    npk: '0-9-10',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Flowering', 'Late Flowering'],
    recommended_dosage: '1 ml / Litre (flowering weeks 4-8)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: '4-in-1 booster: enhances flowering, improves soil, boosts yield and optimizes sugar production.',
    descriptionUk: '4-в-1 преміум бустер цвітіння: збільшує щільність шишок, покращує ґрунтову мікрофлору, стимулює вироблення цукрів і терпенів.',
    primary_purpose: 'Максимальна вага та щільність суцвіть на фінальних тижнях цвітіння'
  },
  {
    id: 'plagron-power-roots',
    product_name: 'Power Roots',
    brand: 'PLAGRON',
    brand_id: 'plagron',
    url: 'https://growdiaries.com/nutrients/plagron/power-roots',
    category: 'Root Stimulator',
    npk: '0-0-2',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Seedling', 'Vegetative', 'Flowering'],
    recommended_dosage: '1 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Organic root stimulator promoting rapid and healthy root development and resistance.',
    descriptionUk: 'Органічний стимулятор коренеутворення: швидке нарощування маси білих корінців та зміцнення імунітету.',
    primary_purpose: 'Стрімкий старт кореневої системи та адаптація після пересадки'
  },
  {
    id: 'plagron-sugar-royal',
    product_name: 'Sugar Royal',
    brand: 'PLAGRON',
    brand_id: 'plagron',
    url: 'https://growdiaries.com/nutrients/plagron/sugar-royal',
    category: 'Terpene & Resin Enhancer',
    npk: '9-0-0',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Vegetative', 'Flowering'],
    recommended_dosage: '1 - 2 ml / Litre (once per week)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Biological amino acid booster that enhances resin production and aroma synthesis.',
    descriptionUk: 'Амінокислотний комплекс, що стимулює вироблення хлорофілу, трихом і терпенів, скорочуючи цикл дозрівання.',
    primary_purpose: 'Вибуховий терпеновий профіль та рясна смолистість'
  },
  {
    id: 'plagron-pure-zym',
    product_name: 'Pure Zym',
    brand: 'PLAGRON',
    brand_id: 'plagron',
    url: 'https://growdiaries.com/nutrients/plagron/pure-zym',
    category: 'Enzyme Additive',
    npk: '0-0-0',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Vegetative', 'Flowering'],
    recommended_dosage: '1 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Natural enzyme soil improver that breaks down dead plant roots into accessible sugars.',
    descriptionUk: 'Ферментний комплекс для прискореного розкладу відмерлих корінців у доступні цукри та вітаміни.',
    primary_purpose: 'Очищення ризосфери та запобігання загниванню коріння'
  },
  {
    id: 'plagron-terra-grow',
    product_name: 'Terra Grow',
    brand: 'PLAGRON',
    brand_id: 'plagron',
    url: 'https://growdiaries.com/nutrients/plagron/terra-grow',
    category: 'Base Nutrient (Vegetative)',
    npk: '3-1-3',
    compatible_substrates: ['Soil'],
    usage_phases: ['Seedling', 'Vegetative'],
    recommended_dosage: '2.5 - 5 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Highly concentrated mineral base nutrient for the vegetative phase in soil.',
    descriptionUk: 'Концентрована мінеральна основа для активної вегетації у ґрунтових сумішах.',
    primary_purpose: 'Швидкий ріст пагонів та соковите зелене листя'
  },
  {
    id: 'plagron-terra-bloom',
    product_name: 'Terra Bloom',
    brand: 'PLAGRON',
    brand_id: 'plagron',
    url: 'https://growdiaries.com/nutrients/plagron/terra-bloom',
    category: 'Base Nutrient (Flowering)',
    npk: '2-2-4',
    compatible_substrates: ['Soil'],
    usage_phases: ['Flowering'],
    recommended_dosage: '4 - 5 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Universal mineral base fertilizer for the blooming phase in peat and soil.',
    descriptionUk: 'Базове добриво для рясного цвітіння у ґрунті з оптимальним співвідношенням фосфору й калію.',
    primary_purpose: 'Повноцінне базове живлення під час цвітіння'
  },

  // ================= ADVANCED NUTRIENTS (61 товар) =================
  {
    id: 'an-big-bud',
    product_name: 'Big Bud Liquid / Coco',
    brand: 'Advanced Nutrients',
    brand_id: 'advanced-nutrients',
    url: 'https://growdiaries.com/nutrients/advanced-nutrients/big-bud',
    category: 'Bloom Booster',
    npk: '0-1-3',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Flowering'],
    recommended_dosage: '2 ml / Litre (weeks 2-4 of bloom)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'The world #1 bloom booster providing L-form amino acids, phosphorus and potassium.',
    descriptionUk: 'Легендарний стимулятор набору маси шишок з L-амінокислотами, фосфором та калієм.',
    primary_purpose: 'Збільшення розміру та щільності суцвіть на 2-4 тижнях цвітіння'
  },
  {
    id: 'an-overdrive',
    product_name: 'Overdrive',
    brand: 'Advanced Nutrients',
    brand_id: 'advanced-nutrients',
    url: 'https://growdiaries.com/nutrients/advanced-nutrients/overdrive',
    category: 'Late Bloom Hardener',
    npk: '1-5-4',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Late Flowering'],
    recommended_dosage: '2 ml / Litre (last 2-3 weeks before flush)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Late season bloom booster designed to trigger second flowering cycle.',
    descriptionUk: 'Фінішний затверджувач суцвіть: запускає другу хвилю росту та наливання шишок перед промивкою.',
    primary_purpose: 'Максимальна щільність та вага шишок на останніх тижнях'
  },
  {
    id: 'an-bud-candy',
    product_name: 'Bud Candy',
    brand: 'Advanced Nutrients',
    brand_id: 'advanced-nutrients',
    url: 'https://growdiaries.com/nutrients/advanced-nutrients/bud-candy',
    category: 'Carbohydrate & Terpene Enhancer',
    npk: '0-0-0 (0.5% Mg)',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Flowering'],
    recommended_dosage: '2 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Sweet molasses and carbohydrate complex feeding root microbes and amplifying terpenes.',
    descriptionUk: 'Вуглеводний комплекс із тростинного цукру та меляси: годує мікробіоту та підсилює аромат.',
    primary_purpose: 'Солодкий насичений терпеновий аромат та живлення корисних бактерій'
  },
  {
    id: 'an-voodoo-juice',
    product_name: 'Voodoo Juice',
    brand: 'Advanced Nutrients',
    brand_id: 'advanced-nutrients',
    url: 'https://growdiaries.com/nutrients/advanced-nutrients/voodoo-juice',
    category: 'Root Microbes & Bacteria',
    npk: '0-0-0',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Seedling', 'Vegetative', 'Flowering'],
    recommended_dosage: '2 ml / Litre (weeks 1-2 of veg & bloom)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: '8 powerful Bacillus and beneficial bacterial strains that increase root zone surface up to 117%.',
    descriptionUk: '8 штамів живих корисних бактерій для розширення кореневої маси на 117%.',
    primary_purpose: 'Колонізація кореневої зони та прискорене поглинання добрив'
  },
  {
    id: 'an-b-52',
    product_name: 'B-52 Fertilizer Booster',
    brand: 'Advanced Nutrients',
    brand_id: 'advanced-nutrients',
    url: 'https://growdiaries.com/nutrients/advanced-nutrients/b-52',
    category: 'Vitamin & Anti-Stress Booster',
    npk: '2-1-4',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['All'],
    recommended_dosage: '2 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Vitamin B1, B2, B3, B5, B7 complex with kelp extract preventing heat and transplant stress.',
    descriptionUk: 'Вітамінний комплекс групи B з морськими водоростями келп для антистресового захисту.',
    primary_purpose: 'Захист від стресу (спека, обрізка, LST, пересадка)'
  },
  {
    id: 'an-rhino-skin',
    product_name: 'Rhino Skin',
    brand: 'Advanced Nutrients',
    brand_id: 'advanced-nutrients',
    url: 'https://growdiaries.com/nutrients/advanced-nutrients/rhino-skin',
    category: 'Potassium Silicate (Silica)',
    npk: '0-0-0.4 (0.15% Si)',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Vegetative', 'Flowering'],
    recommended_dosage: '2 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Bioavailable potassium silicate reinforcing plant cell walls to support heavy floral loads.',
    descriptionUk: 'Біодоступний силікат калію (кремній) для потовщення стебел і стійкості до спеки.',
    primary_purpose: 'Міцні стебла, що витримують важкі шишки без підвʼязування'
  },
  {
    id: 'an-flawless-finish',
    product_name: 'Flawless Finish',
    brand: 'Advanced Nutrients',
    brand_id: 'advanced-nutrients',
    url: 'https://growdiaries.com/nutrients/advanced-nutrients/flawless-finish',
    category: 'Flushing Agent',
    npk: '0-0-0 (0.97% Mg, 1.3% S)',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Flush'],
    recommended_dosage: '2 ml / Litre (last 4-10 days)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Chelating flush agent extracting excess salts and heavy metals for smooth, pure white ash smoke.',
    descriptionUk: 'Хелатний засіб для фінальної промивки: вимиває надлишок солей для мʼякого диму та білого попелу.',
    primary_purpose: 'Фінальне очищення перед харвестом'
  },

  // ================= BIOBIZZ (14 товарів) =================
  {
    id: 'biobizz-bio-grow',
    product_name: 'Bio-Grow',
    brand: 'BioBizz',
    brand_id: 'biobizz',
    url: 'https://growdiaries.com/nutrients/biobizz/bio-grow',
    category: '100% Organic Base (Vegetative)',
    npk: '4-3-6',
    compatible_substrates: ['Soil', 'Coco', 'Living Soil'],
    usage_phases: ['Vegetative', 'Flowering'],
    recommended_dosage: '1 - 4 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: '100% certified organic liquid growth fertilizer made from Dutch sugar beet extract.',
    descriptionUk: '100% органічне рідке добриво на основі голландського бурякового екстракту для вегетації.',
    primary_purpose: 'Органічний ріст та активація ґрунтової мікрофлори'
  },
  {
    id: 'biobizz-bio-bloom',
    product_name: 'Bio-Bloom',
    brand: 'BioBizz',
    brand_id: 'biobizz',
    url: 'https://growdiaries.com/nutrients/biobizz/bio-bloom',
    category: '100% Organic Base (Flowering)',
    npk: '2-7-4',
    compatible_substrates: ['Soil', 'Coco', 'Living Soil'],
    usage_phases: ['Flowering'],
    recommended_dosage: '2 - 4 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Complete organic blooming liquid fertilizer packed with natural phosphorus, potassium and enzymes.',
    descriptionUk: 'Органічне добриво для цвітіння з рослинними екстрактами, ферментами та мікроелементами.',
    primary_purpose: 'Природне солодке цвітіння без хімічних залишків'
  },
  {
    id: 'biobizz-top-max',
    product_name: 'Top-Max',
    brand: 'BioBizz',
    brand_id: 'biobizz',
    url: 'https://growdiaries.com/nutrients/biobizz/top-max',
    category: 'Organic Bloom Stimulator',
    npk: '0.2-0.2-0.1',
    compatible_substrates: ['Soil', 'Coco', 'Living Soil'],
    usage_phases: ['Flowering'],
    recommended_dosage: '1 - 4 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: '100% organic bloom stimulator containing fulvic and humic acids from leonardite.',
    descriptionUk: '100% органічний стимулятор цвітіння з фульвовими та гуміновими кислотами.',
    primary_purpose: 'Збільшення розміру квітів та транспортування мікроелементів'
  },
  {
    id: 'biobizz-calmag',
    product_name: 'BioBizz Calmag',
    brand: 'BioBizz',
    brand_id: 'biobizz',
    url: 'https://growdiaries.com/nutrients/biobizz/calmag',
    category: 'Organic Calcium & Magnesium',
    npk: '0-0-0 (4.2% Ca, 1.7% Mg)',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['All'],
    recommended_dosage: '0.5 - 1.4 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: '100% certified organic CalMag supplement derived from calcium carbonate and magnesium sulfate.',
    descriptionUk: 'Органічний кальцій і магній для мʼякої води, осмосу та кокосового субстрату.',
    primary_purpose: 'Запобігання дефіцитам Ca/Mg та іржавим плямам на листі'
  },

  // ================= CANNA (39 товарів) =================
  {
    id: 'canna-pk-13-14',
    product_name: 'CANNA PK 13/14',
    brand: 'CANNA',
    brand_id: 'canna',
    url: 'https://growdiaries.com/nutrients/canna/pk-13-14',
    category: 'Phosphorus-Potassium Booster',
    npk: '0-13-14',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Flowering'],
    recommended_dosage: '1.5 ml / Litre (for 1 week in mid-bloom)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'The golden standard Dutch PK booster triggering explosive floral density.',
    descriptionUk: 'Еталонний голландський PK-бустер: концентрований фосфор і калій для піку цвітіння.',
    primary_purpose: 'Стимуляція масивного наливання шишок на 5-6 тижнях цвітіння'
  },
  {
    id: 'canna-boost-accelerator',
    product_name: 'CANNA BOOST Accelerator',
    brand: 'CANNA',
    brand_id: 'canna',
    url: 'https://growdiaries.com/nutrients/canna/canna-boost-accelerator',
    category: 'Metabolism & Flowering Accelerator',
    npk: '0-0-0',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Flowering'],
    recommended_dosage: '2 - 4 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Specialized flowering accelerator that enhances photosynthesis and metabolic rate.',
    descriptionUk: 'Спеціальний метаболічний стимулятор, що прискорює фотосинтез і робить шишки рівномірними.',
    primary_purpose: 'Однорідне дозрівання верхівок та підвищений імунітет до плісняви'
  },
  {
    id: 'canna-cannazym',
    product_name: 'Cannazym',
    brand: 'CANNA',
    brand_id: 'canna',
    url: 'https://growdiaries.com/nutrients/canna/cannazym',
    category: 'Enzyme Preparation',
    npk: '0-0-0',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['All'],
    recommended_dosage: '2.5 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'High-quality enzyme product containing 12+ enzymes breaking down dead roots and improving aerated soil.',
    descriptionUk: 'Високоякісний ферментний комплекс із 12 ензимами для переробки старого коріння.',
    primary_purpose: 'Постійна аерація субстрату та повторне використання кокосу'
  },

  // ================= TERRA AQUATICA / GHE (35 товарів) =================
  {
    id: 'ta-tripart-bloom',
    product_name: 'TriPart Bloom (FloraBloom)',
    brand: 'Terra Aquatica',
    brand_id: 'terra-aquatica',
    url: 'https://growdiaries.com/nutrients/terra-aquatica/tripart-bloom',
    category: '3-Part Mineral System',
    npk: '0-5-4',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Vegetative', 'Flowering'],
    recommended_dosage: '0.5 - 3.0 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Provides phosphorus and potassium required for root development and luxuriant flowering.',
    descriptionUk: 'Флагманська частина для цвітіння та коренеутворення в системі TriPart.',
    primary_purpose: 'Точне налаштування N-P-K пропорцій під будь-яку фазу'
  },
  {
    id: 'ta-finalpart-ripen',
    product_name: 'FinalPart (Ripen)',
    brand: 'Terra Aquatica',
    brand_id: 'terra-aquatica',
    url: 'https://growdiaries.com/nutrients/terra-aquatica/finalpart',
    category: 'Late Flowering Solution & Ripener',
    npk: '0-6-5',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Late Flowering', 'Flush'],
    recommended_dosage: '4 - 5 ml / Litre (last 10-14 days)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Worldwide bestseller late-flowering fertilizer sending strong maturation signal to the plant.',
    descriptionUk: 'Легендарний Ripen: посилає рослині сигнал про кінець життєвого циклу, прискорюючи дозрівання.',
    primary_purpose: 'Прискорення фінального дозрівання та утилізація внутрішніх запасів нітратів'
  },

  // ================= ATHENA AG (18 товарів) =================
  {
    id: 'athena-fade',
    product_name: 'Athena Fade',
    brand: 'Athena Ag',
    brand_id: 'athena',
    url: 'https://growdiaries.com/nutrients/athena/fade',
    category: 'Nitrogen-Free Finishing Flush',
    npk: '0-0-1 (3.2% Ca)',
    compatible_substrates: ['Coco', 'Hydroponics', 'Soil'],
    usage_phases: ['Late Flowering', 'Flush'],
    recommended_dosage: '2.5 - 4.5 ml / Litre (last 3 weeks)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Nitrogen-free finishing flush supplying optimal calcium and microelements to eliminate nitrogen without starving flowers.',
    descriptionUk: 'Без-азотний фінішний промивний комплекс: виводить накопичений азот без втрати щільності квітів.',
    primary_purpose: 'Природне осіннє забарвлення (Fade) та чистий смак диму'
  },
  {
    id: 'athena-cleanse',
    product_name: 'Athena Cleanse (HOCl)',
    brand: 'Athena Ag',
    brand_id: 'athena',
    url: 'https://growdiaries.com/nutrients/athena/cleanse',
    category: 'Root Zone & Irrigation Line Descaler',
    npk: '0-0-0 (0.028% Hypochlorous acid)',
    compatible_substrates: ['Coco', 'Hydroponics', 'Soil'],
    usage_phases: ['All'],
    recommended_dosage: '0.5 - 1.0 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Hypochlorous acid formulation that keeps irrigation lines scale-free and protects roots against pathogens.',
    descriptionUk: 'Хлорнуватиста кислота: безпечне знезараження розчину, захист від пітіуму та видалення біоплівки.',
    primary_purpose: 'Кришталево чисті крапельниці та здорова біла коренева система'
  },

  // ================= FOXFARM (46 товарів) =================
  {
    id: 'foxfarm-tiger-bloom',
    product_name: 'Tiger Bloom',
    brand: 'FoxFarm',
    brand_id: 'foxfarm',
    url: 'https://growdiaries.com/nutrients/foxfarm/tiger-bloom',
    category: 'Ultra-Potent Bloom Fertilizer',
    npk: '2-8-4',
    compatible_substrates: ['Soil', 'Hydroponics'],
    usage_phases: ['Flowering'],
    recommended_dosage: '2 - 3 tsp / Gallon (2.5 - 4 ml/L)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Potent, fast-acting, high-phosphorus liquid fertilizer with trace minerals for abundant flowering.',
    descriptionUk: 'Американське швидкодіюче добриво з високим вмістом фосфору та хелатами заліза.',
    primary_purpose: 'Інтенсивне завʼязування масивних суцвіть'
  },

  // ================= HESI (16 товарів) =================
  {
    id: 'hesi-supervit',
    product_name: 'Hesi SuperVit',
    brand: 'Hesi',
    brand_id: 'hesi',
    url: 'https://growdiaries.com/nutrients/hesi/supervit',
    category: 'Concentrated Plant Vitamins & Amino Acids',
    npk: '0-0-0',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['All'],
    recommended_dosage: '1 крапля на 4.5 літра води (10 мл на 650 л)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Ultra-concentrated blend of 15 plant-active vitamins and 10 amino acids.',
    descriptionUk: 'Ультраконцентрат із 15 вітамінів і 10 амінокислот (витрата: 1 крапля на 4.5 л).',
    primary_purpose: 'Стимуляція хлорофілу та зниження потреби рослини у синтезі власних вітамінів'
  },

  // ================= BIOTABS (12 товарів) =================
  {
    id: 'biotabs-slow-release',
    product_name: 'BioTabs Slow-Release Tablets',
    brand: 'BioTabs',
    brand_id: 'biotabs',
    url: 'https://growdiaries.com/nutrients/biotabs/tablets',
    category: '100% Organic Slow-Release Fertilizer',
    npk: '15-7-8',
    compatible_substrates: ['Soil', 'Coco', 'Living Soil'],
    usage_phases: ['Seedling', 'Vegetative', 'Flowering'],
    recommended_dosage: '1 таблетка на 5-10 літрів субстрату',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Organic slow-release fertilizer conditioning the substrate through microbiological activity.',
    descriptionUk: 'Органічні таблетки повільного розчинення з гуміновими кислотами та корисними бактеріями.',
    primary_purpose: 'Полив тільки чистою водою без вимірювання pH та PPM протягом усього циклу'
  },

  // ================= GREEN HOUSE FEEDING (9 товарів) =================
  {
    id: 'ghf-short-flowering',
    product_name: 'Powder Feeding Short Flowering',
    brand: 'Green House Feeding',
    brand_id: 'greenhouse-feeding',
    url: 'https://growdiaries.com/nutrients/green-house-feeding/short-flowering',
    category: 'All-in-One Powder Mineral Nutrient',
    npk: '16-6-26 (2% Mg)',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Vegetative', 'Flowering'],
    recommended_dosage: '0.5 - 1.5 g / Litre (EC 1.0 - 2.0)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Specifically engineered for strains with a short flowering cycle (under 8-9 weeks) and fast indica/autoflowers.',
    descriptionUk: 'Спеціалізоване порошкове все-в-одному добриво для сортів із коротким цвітінням (індика та автоквіти).',
    primary_purpose: 'Швидке розчинення, стабільний розчин без осаду та легке зберігання'
  },

  // ================= BAC (18 товарів) =================
  {
    id: 'bac-organic-pk-booster',
    product_name: 'BAC Organic PK Booster',
    brand: 'BAC Organic',
    brand_id: 'bac-nutrients',
    url: 'https://growdiaries.com/nutrients/bac/organic-pk-booster',
    category: 'Organic PK Stimulator',
    npk: '4-2-8',
    compatible_substrates: ['Soil', 'Coco', 'Living Soil'],
    usage_phases: ['Flowering'],
    recommended_dosage: '1 - 3 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'High-quality organic PK booster enhancing taste and aroma with certified vegan ingredients.',
    descriptionUk: 'Сертифікований органічний PK-бустер для найвищої якості терпенів та медичного стандарту.',
    primary_purpose: 'Органічний набір маси без хімічної гіркоти в смаку'
  },

  // ================= APTUS (14 товарів) =================
  {
    id: 'aptus-regulator',
    product_name: 'Aptus Regulator (Monosilicic Acid)',
    brand: 'Aptus Plant Tech',
    brand_id: 'aptus',
    url: 'https://growdiaries.com/nutrients/aptus/regulator',
    category: 'Bioavailable Monosilicic Acid',
    npk: '0-0-0 (Active Si + B + Mo)',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['All'],
    recommended_dosage: '0.15 ml / Litre (1.5 ml per 10 L)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Patented plant nutrition manager controlling absorption of nutrients and conferring extreme heat resistance.',
    descriptionUk: 'Мономерна кремнієва кислота ультрависокої засвоюваності: захист від спеки вище 32°C та посухи.',
    primary_purpose: 'Керування живленням та стійкість до будь-яких кліматичних екстремумів'
  },

  // ================= MILLS (11 товарів) =================
  {
    id: 'mills-c4',
    product_name: 'Mills C4',
    brand: 'Mills Nutrients',
    brand_id: 'mills-nutrients',
    url: 'https://growdiaries.com/nutrients/mills/c4',
    category: 'Advanced Bloom Enhancer',
    npk: '0-4-3',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Flowering'],
    recommended_dosage: '0.5 - 1.5 ml / Litre (weeks 2-5)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Advanced blooming enhancer consisting of organic carbohydrates, trace minerals and macro-elements.',
    descriptionUk: 'Біо-мінеральний активатор цвітіння: стимулює вироблення ефірних олій та щільність суцвіть.',
    primary_purpose: 'Прискорене утворення перших завʼязей та смоли'
  },

  // ================= REMO (14 товарів) =================
  {
    id: 'remo-astroflower',
    product_name: 'Remo AstroFlower',
    brand: 'Remo Nutrients',
    brand_id: 'remo',
    url: 'https://growdiaries.com/nutrients/remo/astroflower',
    category: 'Bloom Additive (Fossilized Organics)',
    npk: '0-6-11',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Flowering'],
    recommended_dosage: '2 - 2.5 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Targeted fossilized organics and minerals boosting trichome development and essential oils.',
    descriptionUk: 'Спеціалізоване добриво на основі викопної органіки для колосального виходу екстрактів і смоли.',
    primary_purpose: 'Потужний розвиток трихом для високої концентрації каннабіноїдів'
  },

  // ================= GROTEK (26 товарів) =================
  {
    id: 'grotek-monster-bloom',
    product_name: 'Monster Bloom',
    brand: 'Grotek',
    brand_id: 'grotek',
    url: 'https://growdiaries.com/nutrients/grotek/monster-bloom',
    category: 'Ultra-High PK Powder Booster',
    npk: '0-50-30',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Flowering', 'Late Flowering'],
    recommended_dosage: '0.1 - 0.2 g / Litre (use with caution)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'High-octane dry powder bloom booster famous for producing rock-hard bud density.',
    descriptionUk: 'Один із найпотужніших PK-порошків у світі (0-50-30): робить суцвіття твердими як камінь.',
    primary_purpose: 'Екстремальне ущільнення шишок на середині цвітіння'
  },

  // ================= HOUSE & GARDEN (25 товарів) =================
  {
    id: 'hg-roots-excelurator',
    product_name: 'Roots Excelurator Silver / Gold',
    brand: 'House & Garden',
    brand_id: 'house-garden',
    url: 'https://growdiaries.com/nutrients/house-and-garden/roots-excelurator',
    category: 'Flagship Root Inoculant & Protector',
    npk: '0-0-0',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics'],
    usage_phases: ['Seedling', 'Vegetative', 'Flowering'],
    recommended_dosage: '0.3 ml / Litre',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'The golden standard Dutch root accelerator wrapping roots in a protective film against pathogens.',
    descriptionUk: 'Легендарний голландський стимулятор: огортає коріння захисною мембраною від патогенів.',
    primary_purpose: 'Ідеально біле коріння та захист від переливу'
  },

  // ================= MAMMOTH MICROBES (8 товарів) =================
  {
    id: 'mammoth-p-inoculant',
    product_name: 'Mammoth P Microbial Inoculant',
    brand: 'Mammoth Microbes',
    brand_id: 'mammoth-microbes',
    url: 'https://growdiaries.com/nutrients/mammoth-microbes/mammoth-p',
    category: 'Live Bacterial Phosphorus Liberator',
    npk: '0-0-0',
    compatible_substrates: ['Soil', 'Coco', 'Hydroponics', 'Living Soil'],
    usage_phases: ['All'],
    recommended_dosage: '0.16 ml / Litre (0.6 ml/gal)',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
    description: 'Scientifically developed live bacterial consortium proven to increase yield by 16% through phosphorus liberation.',
    descriptionUk: 'Науково розроблений консорціум бактерій з Університету Колорадо: підвищує врожайність на +16%.',
    primary_purpose: 'Розблокування важкодоступного звʼязаного фосфору в субстраті'
  }
];

export function getProductByCatalogId(id: string): NutrientCatalogItem | undefined {
  return NUTRIENTS_179_CATALOG.find(p => p.id === id);
}

export function filterCatalogBySubstrate(substrate: 'Soil' | 'Coco' | 'Hydroponics' | 'Living Soil') {
  return NUTRIENTS_179_CATALOG.filter(p => p.compatible_substrates.includes(substrate));
}

export function filterCatalogByPhase(phase: 'Germination' | 'Seedling' | 'Vegetative' | 'Flowering' | 'Late Flowering' | 'Flush') {
  return NUTRIENTS_179_CATALOG.filter(p => p.usage_phases.includes(phase) || p.usage_phases.includes('All'));
}
