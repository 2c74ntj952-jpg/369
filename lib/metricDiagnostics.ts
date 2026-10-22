import { Plant, PlantStage } from './types';

export type DiagnosticSeverity = 'normal' | 'warning' | 'danger';

export interface MetricDiagnostic {
  isAbnormal: boolean;
  severity: DiagnosticSeverity;
  metricName: string;
  currentValue: string | number;
  optimalRange: string;
  problemTitle: string;
  consequence: string;
  recommendation: string;
}

/**
 * 1. Діагностика вологості субстрату (До поливу)
 */
export function diagnoseMoisture(moisture: number): MetricDiagnostic {
  if (moisture <= 20) {
    return {
      isAbnormal: true,
      severity: 'danger',
      metricName: 'Вологість субстрату',
      currentValue: `${moisture}%`,
      optimalRange: '30% – 70%',
      problemTitle: 'Критична посуха субстрату (≤ 20%)',
      consequence: 'Спричиняє відмирання мікроскопічних кореневих волосків, втрату клітинного тургору (в\'янення), повну зупинку живлення та важкий стрес із затримкою розвитку.',
      recommendation: 'Терміново напоїть рослину відстояною водою або живильним розчином відповідно до об\'єму горщика.',
    };
  }

  if (moisture <= 30) {
    return {
      isAbnormal: true,
      severity: 'warning',
      metricName: 'Вологість субстрату',
      currentValue: `${moisture}%`,
      optimalRange: '30% – 70%',
      problemTitle: 'Субстрат просох (Час поливу)',
      consequence: 'Досягнуто цільову фазу dry-back. Якщо затягнути полив ще на добу, корінці почнуть підсихати, а концентрація солей біля коренів різко зросте.',
      recommendation: 'Заплануйте полив живильним розчином сьогодні для підтримання стабільного росту.',
    };
  }

  if (moisture > 85) {
    return {
      isAbnormal: true,
      severity: 'danger',
      metricName: 'Вологість субстрату',
      currentValue: `${moisture}%`,
      optimalRange: '30% – 70%',
      problemTitle: 'Критичне перезволоження (> 85%)',
      consequence: 'Перекриває доступ кисню до коренів (коренева асфіксія). Викликає загнивання кореневої системи (Pythium), анаеробне бродіння та токсичний хлороз листя.',
      recommendation: 'Повністю зупиніть будь-які поливи, підсильте обдув поверхні субстрату і дайте йому просохнути до ≤ 30%.',
    };
  }

  if (moisture > 75) {
    return {
      isAbnormal: true,
      severity: 'warning',
      metricName: 'Вологість субстрату',
      currentValue: `${moisture}%`,
      optimalRange: '30% – 70%',
      problemTitle: 'Субстрат ще занадто вологий (76%–85%)',
      consequence: 'Передчасний полив витіснить повітря з пор ґрунту, що сповільнить дихання коренів і засвоєння мікроелементів.',
      recommendation: 'Зачекайте 1–2 дні природного випаровування та просихання.',
    };
  }

  return {
    isAbnormal: false,
    severity: 'normal',
    metricName: 'Вологість субстрату',
    currentValue: `${moisture}%`,
    optimalRange: '30% – 70%',
    problemTitle: 'Оптимальна вологість',
    consequence: 'Коріння дихає вільно, волога і кисень збалансовані в порах субстрату.',
    recommendation: 'Продовжуйте регулярний моніторинг.',
  };
}

/**
 * 2. Діагностика вологості ПІСЛЯ поливу
 */
export function diagnosePostMoisture(moisture: number): MetricDiagnostic {
  if (moisture < 65) {
    return {
      isAbnormal: true,
      severity: 'warning',
      metricName: 'Вологість після поливу',
      currentValue: `${moisture}%`,
      optimalRange: '70% – 85%',
      problemTitle: 'Недостатній об\'єм поливу (< 65%)',
      consequence: 'У субстраті утворюються сухі гідрофобні кишені. Коріння в цих зонах не отримує внесених добрив і відмирає.',
      recommendation: 'Збільшіть об\'єм води при поливі, проливаючи горщик рівномірно по периметру до виходу 10–20% дренажу.',
    };
  }

  if (moisture > 88) {
    return {
      isAbnormal: true,
      severity: 'danger',
      metricName: 'Вологість після поливу',
      currentValue: `${moisture}%`,
      optimalRange: '70% – 85%',
      problemTitle: 'Надлишкове зволоження після поливу (> 88%)',
      consequence: 'Спричиняє заболочування нижнього шару субстрату та кисневе голодування коренів при дні горщика.',
      recommendation: 'Обов\'язково злийте залишки дренажної води з піддона і переконайтеся у вільному дренажному відтоку.',
    };
  }

  return {
    isAbnormal: false,
    severity: 'normal',
    metricName: 'Вологість після поливу',
    currentValue: `${moisture}%`,
    optimalRange: '70% – 85%',
    problemTitle: 'Оптимальне зволоження після поливу',
    consequence: 'Субстрат рівномірно насичений вологою та розчиненими поживними речовинами.',
    recommendation: 'Злийте дренаж із піддона через 15–20 хвилин.',
  };
}

/**
 * 3. Діагностика pH (субстрату, розчину або дренажу)
 */
export function diagnosePh(
  ph: number,
  medium: string = 'soil',
  context: 'substrate' | 'solution' | 'drainage' = 'substrate'
): MetricDiagnostic {
  const isCocoOrHydro = medium.toLowerCase().includes('кокос') ||
    medium.toLowerCase().includes('coco') ||
    medium.toLowerCase().includes('гідро') ||
    medium.toLowerCase().includes('hydro');

  const minBound = isCocoOrHydro ? 5.5 : 6.0;
  const maxBound = isCocoOrHydro ? 6.2 : 6.8;
  const optRangeStr = `${minBound.toFixed(1)} – ${maxBound.toFixed(1)} pH`;
  const contextName = context === 'solution' ? 'pH розчину' : context === 'drainage' ? 'pH дренажу' : 'pH субстрату';

  if (ph < minBound - 0.4) {
    return {
      isAbnormal: true,
      severity: 'danger',
      metricName: contextName,
      currentValue: `pH ${ph.toFixed(1)}`,
      optimalRange: optRangeStr,
      problemTitle: `Критичне закислення (${contextName} < ${(minBound - 0.4).toFixed(1)})`,
      consequence: 'Кислотний блок (Acid Lockout): пригнічується засвоєння кальцію (Ca), магнію (Mg) та фосфору (P). Призводить до хімічного опіку кінчиків корінців, ламкості гілок і некротичних іржавих плям на листі.',
      recommendation: 'Використайте коректор pH-Up або промийте субстрат водою зі збалансованим pH, щоб підняти показник у зону норми.',
    };
  }

  if (ph < minBound) {
    return {
      isAbnormal: true,
      severity: 'warning',
      metricName: contextName,
      currentValue: `pH ${ph.toFixed(1)}`,
      optimalRange: optRangeStr,
      problemTitle: `Занижений ${contextName} (${ph.toFixed(1)})`,
      consequence: 'Уповільнюється поглинання фосфору та калію, що гальмує фотосинтез і знижує енергію росту рослини.',
      recommendation: 'Підкоригуйте розчин до норми за допомогою препарату pH-Up перед поливом.',
    };
  }

  if (ph > maxBound + 0.4) {
    return {
      isAbnormal: true,
      severity: 'danger',
      metricName: contextName,
      currentValue: `pH ${ph.toFixed(1)}`,
      optimalRange: optRangeStr,
      problemTitle: `Критичне залуження (${contextName} > ${(maxBound + 0.4).toFixed(1)})`,
      consequence: 'Лужний блок (Alkaline Lockout): блокується засвоєння заліза (Fe), цинку (Zn), марганцю (Mn) та бору (B). Викликає сильний міжжилковий хлороз верхівок, засихання зав\'язей та різку зупинку цвітіння.',
      recommendation: 'Знизьте pH за допомогою препарату pH-Down і пролийте субстрат коректним розчином.',
    };
  }

  if (ph > maxBound) {
    return {
      isAbnormal: true,
      severity: 'warning',
      metricName: contextName,
      currentValue: `pH ${ph.toFixed(1)}`,
      optimalRange: optRangeStr,
      problemTitle: `Завищений ${contextName} (${ph.toFixed(1)})`,
      consequence: 'Починається погане засвоєння мікроелементів (Fe/Zn), молоде верхнє листя може світлішати.',
      recommendation: 'Знизьте pH живильного розчину ближче до середини норми.',
    };
  }

  return {
    isAbnormal: false,
    severity: 'normal',
    metricName: contextName,
    currentValue: `pH ${ph.toFixed(1)}`,
    optimalRange: optRangeStr,
    problemTitle: 'pH у межах оптимуму',
    consequence: 'Усі макро- та мікроелементи знаходяться у біодоступній для коренів іонній формі.',
    recommendation: 'Підтримуйте стабільність даного значення.',
  };
}

/**
 * 4. Діагностика PPM (солоності / концентрації солей)
 */
export function diagnosePpm(ppm: number, stage: PlantStage | string): MetricDiagnostic {
  let min = 400;
  let max = 800;

  if (stage === 'germination' || stage === 'seedling') {
    min = 200;
    max = 400;
  } else if (stage === 'vegetative') {
    min = 400;
    max = 800;
  } else {
    min = 800;
    max = 1200;
  }

  const optRangeStr = `${min} – ${max} PPM`;

  if (ppm < min * 0.7) {
    return {
      isAbnormal: true,
      severity: 'danger',
      metricName: 'PPM живлення',
      currentValue: `${ppm} PPM`,
      optimalRange: optRangeStr,
      problemTitle: 'Гострий мінеральний голод (PPM критично низький)',
      consequence: 'Рослина екстрено викачує азот, фосфор і калій зі старого віялового листя для порятунку точки росту. Призводить до пожовтіння і відмирання нижнього ярусу, стоншення пагонів і втрати до 50% маси шишок.',
      recommendation: 'Підвищіть дозування базових добрив у розчині відповідно до рекомендацій таблиці живлення.',
    };
  }

  if (ppm < min) {
    return {
      isAbnormal: true,
      severity: 'warning',
      metricName: 'PPM живлення',
      currentValue: `${ppm} PPM`,
      optimalRange: optRangeStr,
      problemTitle: 'Недостатня концентрація солей (PPM нижче норми)',
      consequence: 'Рослина недоотримує будівельного матеріалу для формування потужних суцвіть, темпи росту падають нижче генетичного потенціалу.',
      recommendation: 'Поступово підніміть PPM розчину на 100–150 одиниць під час наступного поливу.',
    };
  }

  if (ppm > max * 1.25) {
    return {
      isAbnormal: true,
      severity: 'danger',
      metricName: 'PPM живлення',
      currentValue: `${ppm} PPM`,
      optimalRange: optRangeStr,
      problemTitle: 'Токсичний засол субстрату (Overfeeding / Сольовий блок)',
      consequence: 'Осмотичний шок: концентрація солей у ґрунті перевищує тиск у клітинах коренів, рослина втрачає здатність пити воду («зворотний осмос»). Кінчики листя горять і закручуються в «кіготь», ризик повної загибелі куща.',
      recommendation: 'Терміново промийте субстрат чистою водою (або 200 PPM) з великим виходом дренажу (30–40%) для видалення надлишкових солей.',
    };
  }

  if (ppm > max) {
    return {
      isAbnormal: true,
      severity: 'warning',
      metricName: 'PPM живлення',
      currentValue: `${ppm} PPM`,
      optimalRange: optRangeStr,
      problemTitle: 'Підвищена концентрація живлення (PPM вище норми)',
      consequence: 'Надлишок азоту та солей викликає потемніння листя («глянцева зелень») та підсихання країв верхніх листків.',
      recommendation: 'Знизьте концентрацію добрив або розбавте розчин чистою водою.',
    };
  }

  return {
    isAbnormal: false,
    severity: 'normal',
    metricName: 'PPM живлення',
    currentValue: `${ppm} PPM`,
    optimalRange: optRangeStr,
    problemTitle: 'PPM у цільовому діапазоні',
    consequence: 'Рослина отримує ідеальний баланс мінералів без ризику токсикозу чи дефіциту.',
    recommendation: 'Підтримуйте поточний графік та дозування.',
  };
}

/**
 * 5. Діагностика дренажу (PPM та pH виходу)
 */
export function diagnoseDrainagePpm(drainPpm: number, inputPpm?: number): MetricDiagnostic {
  const benchmark = inputPpm ?? 850;

  if (drainPpm > benchmark + 350 || drainPpm > 1350) {
    return {
      isAbnormal: true,
      severity: 'danger',
      metricName: 'PPM дренажу',
      currentValue: `${drainPpm} PPM`,
      optimalRange: `≤ ${benchmark + 150} PPM`,
      problemTitle: 'Критичне накопичення солей у субстраті (PPM дренажу завищений)',
      consequence: 'PPM вихідного дренажу значно вищий за залитий розчин. У кореневій зоні відклалися невикористані мінеральні солі, що веде до кореневого опіку та блокування споживання води.',
      recommendation: 'Наступний полив проведіть виключно чистою водою з виходом 20–30% дренажу для змивання сольового осаду.',
    };
  }

  if (drainPpm < benchmark - 350 || drainPpm < 450) {
    return {
      isAbnormal: true,
      severity: 'warning',
      metricName: 'PPM дренажу',
      currentValue: `${drainPpm} PPM`,
      optimalRange: `${benchmark - 200} – ${benchmark + 150} PPM`,
      problemTitle: 'Субстрат швидко виснажується (PPM дренажу занизький)',
      consequence: 'Рослина повністю з\'їдає всі внесені мікро- і макроелементи швидше, ніж вони накопичуються. Виникає прихований голод.',
      recommendation: 'Можна збільшити дозу базового живлення на 10–15% у наступному циклі поливу.',
    };
  }

  return {
    isAbnormal: false,
    severity: 'normal',
    metricName: 'PPM дренажу',
    currentValue: `${drainPpm} PPM`,
    optimalRange: `~${benchmark} PPM`,
    problemTitle: 'Збалансований вихід дренажу',
    consequence: 'Субстрат працює як стабільний буфер без сольових заторів.',
    recommendation: 'Продовжуйте поливи за поточною формулою.',
  };
}

/**
 * 6. Діагностика світла PPFD
 */
export function diagnosePpfd(ppfd: number, stage: PlantStage | string): MetricDiagnostic {
  let min = 400;
  let max = 600;

  if (stage === 'germination' || stage === 'seedling') {
    min = 100;
    max = 300;
  } else if (stage === 'vegetative') {
    min = 400;
    max = 600;
  } else {
    min = 600;
    max = 1000;
  }

  const optRangeStr = `${min} – ${max} µmol/m²/s`;

  if (ppfd < min) {
    return {
      isAbnormal: true,
      severity: 'warning',
      metricName: 'PPFD освітлення',
      currentValue: `${ppfd} мкмоль`,
      optimalRange: optRangeStr,
      problemTitle: 'Світлове голодування (PPFD нижче норми)',
      consequence: 'Етіоляція: стебло надмірно витягується, міжвузля стають довгими і слабкими, суцвіття формуються пухкими з низьким вмістом смолистих залоз (трихом).',
      recommendation: 'Опустіть лампу ближче до верхівки рослини або збільшіть потужність димера на світильнику.',
    };
  }

  if (ppfd > max * 1.15) {
    return {
      isAbnormal: true,
      severity: 'danger',
      metricName: 'PPFD освітлення',
      currentValue: `${ppfd} мкмоль`,
      optimalRange: optRangeStr,
      problemTitle: 'Світловий опік та вибілювання (Light Bleaching)',
      consequence: 'Фотохімічне руйнування хлорофілу: верхівки шишок та верхнє листя біліють і втрачають здатність до фотосинтезу. Терпени та канабіноїди руйнуються від надлишкового фотонного опромінення.',
      recommendation: 'Підніміть лампу вище над кроною або зменшіть яскравість світла регулятором.',
    };
  }

  return {
    isAbnormal: false,
    severity: 'normal',
    metricName: 'PPFD освітлення',
    currentValue: `${ppfd} мкмоль`,
    optimalRange: optRangeStr,
    problemTitle: 'PPFD в оптимумі',
    consequence: 'Максимальна швидкість фотосинтезу без ризику світлового стресу.',
    recommendation: 'Підтримуйте стабільну відстань лампи при рості куща у висоту.',
  };
}

/**
 * 7. Діагностика мікроклімату (t° та вологість повітря)
 */
export function diagnoseClimate(
  temp: number,
  humidity: number,
  stage: PlantStage | string
): MetricDiagnostic[] {
  const diagnostics: MetricDiagnostic[] = [];

  // Температура
  if (temp > 29) {
    diagnostics.push({
      isAbnormal: true,
      severity: 'danger',
      metricName: 'Температура повітря',
      currentValue: `${temp}°C`,
      optimalRange: '21°C – 26°C',
      problemTitle: 'Тепловий стрес (> 29°C)',
      consequence: 'При температурі вище 29°C продихи листя закриваються для збереження вологи, фотосинтез зупиняється. Суцвіття формуються пухкими («лисячі хвости»), а ароматичні терпени випаровуються.',
      recommendation: 'Підсильте витяжну вентиляцію або увімкніть охолодження боксу.',
    });
  } else if (temp < 18) {
    diagnostics.push({
      isAbnormal: true,
      severity: 'warning',
      metricName: 'Температура повітря',
      currentValue: `${temp}°C`,
      optimalRange: '21°C – 26°C',
      problemTitle: 'Знижена температура повітря (< 18°C)',
      consequence: 'Гальмуються всі метаболічні процеси, коріння гірше засвоює фосфор (фіолетове забарвлення черешків), субстрат просихає дуже повільно.',
      recommendation: 'Підвищіть температуру в приміщенні або встановіть нагрівальний шнур/обігрівач.',
    });
  }

  // Вологість повітря
  const isFlower = stage === 'flowering' || stage === 'harvest' || stage === 'harvested';
  if (isFlower && humidity > 60) {
    diagnostics.push({
      isAbnormal: true,
      severity: 'danger',
      metricName: 'Вологість повітря (RH)',
      currentValue: `${humidity}%`,
      optimalRange: '40% – 50%',
      problemTitle: 'Критична загроза сірої гнилі (Botrytis / Пліснява)',
      consequence: 'Вологість понад 60% на фазі цвітіння спричиняє конденсацію всередині щільних суцвіть. Це призводить до спалаху ботритісу (гнилі шишок), що знищує врожай за 2–3 дні.',
      recommendation: 'Терміново ввімкніть осушувач повітря, підсильте вентилятор обдуву верхівок і знизьте RH до 40–50%.',
    });
  } else if (!isFlower && humidity < 35) {
    diagnostics.push({
      isAbnormal: true,
      severity: 'warning',
      metricName: 'Вологість повітря (RH)',
      currentValue: `${humidity}%`,
      optimalRange: '55% – 70%',
      problemTitle: 'Надмірно сухе повітря на вегетації (< 35%)',
      consequence: 'Молоді рослини втрачають вологу швидше, ніж слабке коріння може її подати. Краї листя скручуються у «човники».',
      recommendation: 'Увімкніть зволожувач повітря для підтримання комфортного мікроклімату.',
    });
  }

  return diagnostics;
}

/**
 * Комплексний збір усіх активних відхилень для рослини
 */
export function getPlantActiveWarnings(
  plant: Plant,
  overrideValues?: {
    moisture?: number;
    ph?: number;
    ppm?: number;
    ppfd?: number;
    temp?: number;
    humidity?: number;
  }
): MetricDiagnostic[] {
  const currentMoisture = overrideValues?.moisture ?? plant.moistureBeforeWatering ?? 25;
  const currentPh = overrideValues?.ph ?? plant.phBeforeWatering ?? plant.currentPH ?? 6.2;
  const currentPpm = overrideValues?.ppm ?? plant.ppmBeforeWatering ?? plant.ppmAfterWatering ?? 650;
  const currentPpfd = overrideValues?.ppfd ?? plant.lightPPFD ?? (plant.stage === 'flowering' ? 750 : 550);
  const currentTemp = overrideValues?.temp ?? plant.currentTemp ?? 24;
  const currentHumidity = overrideValues?.humidity ?? plant.currentHumidity ?? 50;

  const warnings: MetricDiagnostic[] = [];

  const moistDiag = diagnoseMoisture(currentMoisture);
  if (moistDiag.isAbnormal) warnings.push(moistDiag);

  const phDiag = diagnosePh(currentPh, plant.medium || 'soil', 'substrate');
  if (phDiag.isAbnormal) warnings.push(phDiag);

  const ppmDiag = diagnosePpm(currentPpm, plant.stage);
  if (ppmDiag.isAbnormal) warnings.push(ppmDiag);

  const ppfdDiag = diagnosePpfd(currentPpfd, plant.stage);
  if (ppfdDiag.isAbnormal) warnings.push(ppfdDiag);

  const climateDiags = diagnoseClimate(currentTemp, currentHumidity, plant.stage);
  climateDiags.forEach(d => {
    if (d.isAbnormal) warnings.push(d);
  });

  return warnings;
}
