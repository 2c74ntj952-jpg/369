import { Plant, MetricLogEntry, MoistureLogEntry, GrowJournalDayEntry, PlantStage } from './types';
import { calculateVPD } from './growData';

/**
 * Сервіс для автоматичного логування вхідних параметрів рослини (вологість, pH, PPM, PPFD, температура, вологість повітря)
 * у масив історії та автоматичного формування Журналу вирощування на основі дій та замірів користувача.
 */

const STAGE_LABELS_UK: Record<PlantStage, string> = {
  germination: 'Пророщування',
  seedling: 'Розсада',
  vegetative: 'Вегетація',
  flowering: 'Цвітіння',
  harvested: 'Врожай зібрано'
};

export type MetricEntryType = 'dry_check' | 'post_watering' | 'general_update' | 'light_adjustment';

export interface LogMetricsParams {
  type: MetricEntryType;
  moistureSubstrate?: number;
  phSubstrateBefore?: number;
  phSubstrateAfter?: number;
  ppmSubstrate?: number;
  ppfdTop?: number;
  tempC?: number;
  humidityRH?: number;
  notes?: string;
  isPredicted?: boolean;
  source?: 'user' | 'predicted';
}

/**
 * Логує новий замір параметрів до об'єкта рослини.
 * Оновлює `metricsHistory`, `moistureHistory` та автоматично поповнює/синхронізує `growJournal`.
 */
export function logPlantMetrics(plant: Plant, params: LogMetricsParams): Plant {
  const now = Date.now();
  const dateStr = new Date(now).toISOString().split('T')[0];

  const moistureVal = params.moistureSubstrate ?? plant.moistureAfterWatering ?? plant.moistureBeforeWatering ?? 50;
  const phBefore = params.phSubstrateBefore ?? plant.phBeforeWatering;
  const phAfter = params.phSubstrateAfter ?? plant.phAfterWatering ?? plant.currentPH;
  const ppm = params.ppmSubstrate ?? plant.ppmAfterWatering;
  const ppfd = params.ppfdTop ?? plant.lightPPFD;
  const temp = params.tempC ?? plant.currentTemp;
  const humidity = params.humidityRH ?? plant.currentHumidity;
  const isPredictedVal = params.isPredicted ?? (params.source === 'predicted' ? true : false);
  const sourceVal = params.source ?? (isPredictedVal ? 'predicted' : 'user');

  const newMetricEntry: MetricLogEntry = {
    id: `metric-${now}-${Math.random().toString(36).slice(2, 7)}`,
    date: dateStr,
    timestamp: now,
    type: params.type,
    moistureSubstrate: moistureVal,
    phSubstrateBefore: phBefore,
    phSubstrateAfter: phAfter,
    ppmSubstrate: ppm,
    ppfdTop: ppfd,
    tempC: temp,
    humidityRH: humidity,
    stage: plant.stage,
    stageDay: plant.stageDay,
    strain: plant.strain,
    breeder: plant.breeder,
    notes: params.notes,
    isPredicted: isPredictedVal,
    source: sourceVal
  };

  const newMoistureLog: MoistureLogEntry = {
    id: `moisture-${now}-${Math.random().toString(36).slice(2, 7)}`,
    date: dateStr,
    timestamp: now,
    moisture: moistureVal,
    type: params.type === 'post_watering' ? 'post_watering' : 'dry_check',
    ph: phAfter ?? phBefore,
    ppm: ppm,
    notes: params.notes,
    isPredicted: isPredictedVal,
    source: sourceVal
  };

  const existingHistory = plant.history || plant.metricsHistory || [];
  const updatedHistory = [...existingHistory, newMetricEntry];
  const updatedMoistureHistory = [...(plant.moistureHistory || []), newMoistureLog];

  // Автоматичне формування або оновлення денного запису в Журналі вирощування
  const existingJournal = [...(plant.growJournal || [])];
  const currentDayNumber = plant.stageDay || 1;
  const vpdInfo = calculateVPD(temp || 24, humidity || 55, plant.stage);

  // Створюємо дію для списку дій у журналі на основі типу та нотаток
  const actionDescription = params.notes
    ? params.notes.replace(/^Фіксація вимірів через AI Контроль дій:\s*"?/, '').replace(/"?$/, '')
    : params.type === 'post_watering'
      ? `Полив субстрату (Вологість ${moistureVal}%, pH ${phAfter || 6.3})`
      : `Контрольний замір параметрів (Вологість ${moistureVal}%, pH ${phBefore || phAfter || 6.5})`;

  // Шукаємо, чи є вже запис на сьогодні або на цей же день циклу
  const existingEntryIndex = existingJournal.findIndex(
    entry => entry.date === dateStr || entry.dayNumber === currentDayNumber
  );

  if (existingEntryIndex >= 0) {
    const existingEntry = existingJournal[existingEntryIndex];
    const prevActions = existingEntry.actionsDone || [];
    const combinedActions = prevActions.includes(actionDescription)
      ? prevActions
      : [...prevActions, actionDescription];

    const updatedEntry: GrowJournalDayEntry = {
      ...existingEntry,
      dayNumber: currentDayNumber,
      date: dateStr,
      stage: plant.stage,
      stageLabelUk: STAGE_LABELS_UK[plant.stage],
      moisturePercent: moistureVal,
      phBefore: phBefore ?? existingEntry.phBefore,
      phAfter: phAfter ?? existingEntry.phAfter,
      ppm: ppm ?? existingEntry.ppm,
      ppfd: ppfd ?? existingEntry.ppfd,
      tempC: temp || existingEntry.tempC || 24,
      humidityRH: humidity || existingEntry.humidityRH || 55,
      vpd: vpdInfo.vpd,
      lightSchedule: plant.lightSchedule || '18/6',
      lightDistanceCm: plant.lightDistanceCm,
      actionsDone: combinedActions,
      notes: params.notes ? `${existingEntry.notes ? existingEntry.notes + ' • ' : ''}${params.notes}` : existingEntry.notes,
      healthScoreAtDay: plant.healthScore
    };
    existingJournal[existingEntryIndex] = updatedEntry;
  } else {
    const newJournalEntry: GrowJournalDayEntry = {
      id: `journal-auto-${now}-${Math.random().toString(36).slice(2, 6)}`,
      dayNumber: currentDayNumber,
      date: dateStr,
      stage: plant.stage,
      stageLabelUk: STAGE_LABELS_UK[plant.stage],
      moisturePercent: moistureVal,
      phBefore: phBefore,
      phAfter: phAfter,
      ppm: ppm,
      ppfd: ppfd,
      tempC: temp || 24,
      humidityRH: humidity || 55,
      vpd: vpdInfo.vpd,
      lightSchedule: plant.lightSchedule || '18/6',
      lightDistanceCm: plant.lightDistanceCm,
      actionsDone: [actionDescription],
      notes: params.notes || `Автоматично збережено AI-асистентом при виконанні дій у кімнаті.`,
      healthScoreAtDay: plant.healthScore
    };
    existingJournal.push(newJournalEntry);
  }

  // Оновлюємо об'єкт рослини
  const updatedPlant: Plant = {
    ...plant,
    currentTemp: temp,
    currentHumidity: humidity,
    currentPH: phAfter ?? phBefore ?? plant.currentPH,
    currentEC: ppm ? Number((ppm / 500).toFixed(1)) : plant.currentEC,
    moistureBeforeWatering: params.type === 'post_watering' ? moistureVal : (params.moistureSubstrate ?? plant.moistureBeforeWatering),
    moistureAfterWatering: params.type === 'post_watering' ? moistureVal : plant.moistureAfterWatering,
    phBeforeWatering: phBefore ?? plant.phBeforeWatering,
    phAfterWatering: phAfter ?? plant.phAfterWatering,
    ppmAfterWatering: ppm ?? plant.ppmAfterWatering,
    lightPPFD: ppfd ?? plant.lightPPFD,
    history: updatedHistory,
    metricsHistory: updatedHistory,
    moistureHistory: updatedMoistureHistory,
    growJournal: existingJournal
  };

  if (params.type === 'post_watering') {
    updatedPlant.lastWatered = dateStr;
    updatedPlant.healthScore = Math.min(100, updatedPlant.healthScore + 2);
  }

  return updatedPlant;
}

/**
 * Розраховує швидкість просихання субстрату (% вологості на день) на основі:
 * 1. Реальної історії замірів користувача (якщо є)
 * 2. Генетики та типу сорту (автоквіт / фотоперіод, сатіва / індика)
 * 3. Фази росту та віку рослини (пророщування, розсада, вегетація, цвітіння)
 * 4. Типу субстрату (кокос, ґрунт, гідропоніка, мінвата)
 * 5. Мікроклімату та VPD (температура, вологість повітря)
 * 6. Інтенсивності світла (PPFD)
 */
export function calculateDailyDryingRate(plant: Plant): number {
  // 1. Історія замірів користувача (якщо є хоча б 2 записи)
  let userHistoryRate: number | null = null;
  const moistureLogs = plant.moistureHistory || [];
  if (moistureLogs.length >= 2) {
    for (let i = moistureLogs.length - 1; i >= 1; i--) {
      const current = moistureLogs[i];
      const prev = moistureLogs[i - 1];
      const timeDiffDays = (current.timestamp - prev.timestamp) / 86400000;
      if (timeDiffDays > 0.1 && prev.moisture > current.moisture) {
        const dropRate = (prev.moisture - current.moisture) / timeDiffDays;
        if (dropRate >= 3 && dropRate <= 50) {
          userHistoryRate = Number(dropRate.toFixed(1));
          break;
        }
      }
    }
  }

  // 2. Базова швидкість за фазою росту (% на день)
  let stageBase = 16;
  switch (plant.stage) {
    case 'germination':
      stageBase = 8;
      break;
    case 'seedling':
      stageBase = 12;
      break;
    case 'vegetative': {
      const day = plant.stageDay || 1;
      stageBase = day > 15 ? 22 : 17;
      break;
    }
    case 'flowering': {
      const day = plant.stageDay || 1;
      // На піку цвітіння (20–50 дн) рослини транспірують найбільше вологи
      stageBase = (day >= 20 && day <= 50) ? 28 : 23;
      break;
    }
    case 'harvested':
      stageBase = 5;
      break;
    default:
      stageBase = 16;
  }

  // 3. Фактор сорту та генетики (автоквіти мають високий метаболізм)
  let strainMultiplier = 1.0;
  const strainLower = (plant.strain || '').toLowerCase();
  if (strainLower.includes('auto') || strainLower.includes('авто')) {
    strainMultiplier *= 1.15;
  }
  if (strainLower.includes('sativa') || strainLower.includes('сатіва') || strainLower.includes('сатива')) {
    strainMultiplier *= 1.10;
  }

  // 4. Субстрат / Вид вирощування
  let mediumMultiplier = 1.0;
  const mediumLower = (plant.medium || '').toLowerCase();
  if (mediumLower.includes('кокос') || mediumLower.includes('coco')) {
    mediumMultiplier = 1.45; // Кокос просихає ~в 1.45 рази швидше за ґрунт
  } else if (mediumLower.includes('гідро') || mediumLower.includes('hydro') || mediumLower.includes('dwc')) {
    mediumMultiplier = 1.10;
  } else if (mediumLower.includes('мінвата') || mediumLower.includes('rockwool')) {
    mediumMultiplier = 1.35;
  } else if (mediumLower.includes('перліт') || mediumLower.includes('вермикуліт')) {
    mediumMultiplier = 1.25;
  } else {
    mediumMultiplier = 1.0; // Базовий ґрунт
  }

  // 5. Фактор мікроклімату (температура та вологість повітря / VPD)
  let climateMultiplier = 1.0;
  const temp = plant.currentTemp ?? 24;
  const rh = plant.currentHumidity ?? 55;

  if (temp > 25) {
    climateMultiplier += (temp - 25) * 0.04; // Вища температура прискорює випаровування
  } else if (temp < 20) {
    climateMultiplier -= (20 - temp) * 0.03;
  }

  if (rh < 45) {
    climateMultiplier += (45 - rh) * 0.012; // Сухе повітря стимулює високу транспірацію
  } else if (rh > 65) {
    climateMultiplier -= (rh - 65) * 0.01;
  }

  // 6. Фактор освітлення (PPFD)
  if (plant.lightPPFD && plant.lightPPFD > 600) {
    climateMultiplier += Math.min(0.25, (plant.lightPPFD - 600) / 2000);
  }

  const calculatedRate = stageBase * strainMultiplier * mediumMultiplier * climateMultiplier;

  if (userHistoryRate !== null) {
    // Поєднуємо 60% історії користувача + 40% фундаментальної моделі
    return Number((userHistoryRate * 0.6 + calculatedRate * 0.4).toFixed(1));
  }

  return Number(Math.max(5, Math.min(45, calculatedRate)).toFixed(1));
}

/**
 * Розраховує очікувану поточну вологість субстрату (%) на цей момент часу
 * на основі реального часу останнього поливу/заміру та комбінованої швидкості просихання.
 * Вологість субстрату може падати аж до 0% (повне висихання).
 */
export function getEstimatedCurrentMoisture(plant: Plant): number {
  if (!plant) return 50;

  const now = Date.now();
  let referenceTimestamp: number | null = null;
  let startMoisture = plant.moistureAfterWatering ?? 80;

  // Шукаємо останній РЕАЛЬНИЙ замір користувача (виключаємо синтетичні auto-predicted логи)
  const realLogs = (plant.moistureHistory || []).filter(
    h => !h.isPredicted && h.source !== 'predicted' && typeof h.moisture === 'number'
  );

  if (realLogs.length > 0) {
    const lastRealLog = realLogs[realLogs.length - 1];
    if (lastRealLog.timestamp) {
      referenceTimestamp = lastRealLog.timestamp;
      startMoisture = lastRealLog.moisture;
    }
  }

  // Якщо є дата останнього поливу і вона актуальніша
  if (plant.lastWatered) {
    const lwTime = new Date(plant.lastWatered).getTime();
    if (!isNaN(lwTime) && (!referenceTimestamp || lwTime >= referenceTimestamp)) {
      referenceTimestamp = lwTime;
      startMoisture = plant.moistureAfterWatering ?? 80;
    }
  }

  if (!referenceTimestamp) {
    // Якщо немає жодних точок відліку, беремо початок поточної доби
    referenceTimestamp = now;
    startMoisture = plant.moistureBeforeWatering ?? 25;
  }

  const timeDiffHours = Math.max(0, (now - referenceTimestamp) / 3600000);
  const dailyRate = calculateDailyDryingRate(plant);
  const hourlyRate = dailyRate / 24;

  const estimatedMoisture = startMoisture - (timeDiffHours * hourlyRate);

  // Субстрат висихає до 0% (повне висихання). Максимум 95%.
  return Math.max(0, Math.min(95, Math.round(estimatedMoisture)));
}

export interface PlantVitalityResult {
  healthScore: number; // 0-100
  status: 'excellent' | 'good' | 'warning' | 'danger' | 'critical' | 'dead';
  statusLabelUk: string;
  statusBadgeColor: string; // Tailwind class
  heartColor: string;
  daysSinceWatered: number;
  daysBoneDry: number; // Днів при 0% вологості
  expectedDryDays: number; // Очікуваний термін просихання
  overdueDays: number; // Скільки днів прострочено полив
  isOverdueWatering: boolean;
  estimatedMoisture: number;
  primaryRiskUk: string;
  reasons: string[];
  actionRecommendationUk: string;
}

/**
 * Комплексна фізіологічна оцінка життєздатності рослини.
 * Враховує: реальний час без поливу, швидкість висихання до 0%,
 * ризик загибелі від зневоднення, блокування елементів (pH) та засолення (PPM).
 */
export function calculatePlantVitalityAndHealth(plant: Plant): PlantVitalityResult {
  const now = Date.now();
  const estimatedMoisture = getEstimatedCurrentMoisture(plant);
  const dailyRate = calculateDailyDryingRate(plant);

  // 1. Час з останнього поливу
  let daysSinceWatered = 0;
  let hoursSinceWatered = 0;
  if (plant.lastWatered) {
    const lwTime = new Date(plant.lastWatered).getTime();
    if (!isNaN(lwTime)) {
      hoursSinceWatered = Math.max(0, (now - lwTime) / 3600000);
      daysSinceWatered = Math.floor(hoursSinceWatered / 24);
    }
  }

  const startMoisture = plant.moistureAfterWatering ?? 80;
  const hourlyRate = dailyRate / 24;
  
  // Час до досягнення критичної позначки поливу (25%) та повного висихання (0%)
  const hoursToWaterThreshold = Math.max(0, (startMoisture - 25) / hourlyRate);
  const expectedDryDays = Math.max(1, Math.ceil(hoursToWaterThreshold / 24));
  const overdueDays = Math.max(0, Math.floor((hoursSinceWatered - hoursToWaterThreshold) / 24));

  const hoursToZeroMoisture = startMoisture / hourlyRate;
  const hoursBoneDry = Math.max(0, hoursSinceWatered - hoursToZeroMoisture);
  const daysBoneDry = Math.floor(hoursBoneDry / 24);

  let score = 100;
  const reasons: string[] = [];
  let primaryRiskUk = 'Параметри в ідеальній нормі';
  let actionRecommendationUk = 'Підтримуйте поточний режим догляду.';

  // 2. Вплив посухи та відсутності поливу (Агрономічний закон виживання канабісу)
  if (daysBoneDry >= 5 || daysSinceWatered >= 10) {
    // Більше 5 днів при 0% або 10+ днів без поливу -> незворотний колапс клітин, рослина загинула
    score = 0;
    primaryRiskUk = '💀 Загибель рослини (Повне висихання)';
    reasons.push(`Рослина не поливалася понад ${daysSinceWatered} дн. Субстрат висох до 0% понад ${daysBoneDry} дн. тому.`);
    reasons.push('Кореневі волоски відмерли, клітинний тургор втрачено незворотно, листя висохло в солому.');
    actionRecommendationUk = 'Рослина загинула від зневоднення. Потрібна утилізація та початок нового циклу.';
  } else if (daysBoneDry >= 2 || daysSinceWatered >= 7) {
    // 2-4 дні при 0% вологи -> на межі загибелі
    score = Math.max(5, 18 - daysBoneDry * 3);
    primaryRiskUk = '🔴 На межі загибелі: критичне зневоднення';
    reasons.push(`Субстрат повністю висох (0% вологи) понад ${daysBoneDry || 1} дн. тому.`);
    reasons.push('Масове відмирання кореневої системи та нижніх ярусів листя.');
    actionRecommendationUk = 'Екстрена реанімація! Негайно пролийте субстрат теплою водою (pH 6.2, низький PPM 200) з антистресовими стимуляторами.';
  } else if (estimatedMoisture <= 5 || overdueDays >= 3) {
    // Вологість 1-5% або прострочено на 3+ дні
    score = Math.max(15, 35 - overdueDays * 5);
    primaryRiskUk = '🔴 Критичний водний дефіцит';
    reasons.push(`Полив прострочено на ${overdueDays} дн. Вологість субстрату впала до критичних ${estimatedMoisture}%.`);
    reasons.push('Глибоке в\'янення листя, засихання кінчиків, шок кореневої зони.');
    actionRecommendationUk = 'Терміново проведіть полив до появи дренажу.';
  } else if (estimatedMoisture <= 15 || overdueDays >= 1) {
    score = Math.max(35, 58 - overdueDays * 8);
    primaryRiskUk = '🟠 Сильний водний стрес';
    reasons.push(`Субстрат пересох (вологість ${estimatedMoisture}%). Полив прострочено на ${overdueDays} дн.`);
    actionRecommendationUk = 'Проведіть плановий полив рослини.';
  } else if (estimatedMoisture <= 25) {
    score = 75;
    primaryRiskUk = '🟡 Субстрат просох — час поливу';
    reasons.push(`Вологість субстрату досягла ${estimatedMoisture}%. Рослина готова до чергового поливу.`);
    actionRecommendationUk = 'Приготуйте живильний розчин та здійсніть полив.';
  } else if (estimatedMoisture >= 88 && daysSinceWatered >= 4) {
    // Перелив (Overwatering)
    score = Math.max(40, score - 35);
    primaryRiskUk = '🟠 Ризик переливу та задухи коренів';
    reasons.push(`Субстрат залишається надмірно вологим (${estimatedMoisture}%) протягом ${daysSinceWatered} днів.`);
    reasons.push('Нестача кисню в прикореневій зоні (загроза кореневої гнилі Pythium).');
    actionRecommendationUk = 'Припиніть полив та забезпечте активну циркуляцію повітря для просихання.';
  }

  // 3. Вплив pH (лише якщо рослина ще жива)
  if (score > 0) {
    const rawPh = plant.phAfterWatering ?? plant.currentPH ?? 6.3;
    const mediumLower = (plant.medium || '').toLowerCase();
    const isCoco = mediumLower.includes('coco') || mediumLower.includes('кокос') || mediumLower.includes('hydro') || mediumLower.includes('гідро');
    const phMin = isCoco ? 5.5 : 6.0;
    const phMax = isCoco ? 6.2 : 6.8;

    if (rawPh < 4.5 || rawPh > 8.2) {
      score = Math.max(5, score - 45);
      reasons.push(`Екстремальний pH (${rawPh}): хімічний опік коренів та повне блокування більшості елементів живлення.`);
    } else if (rawPh < phMin - 0.4 || rawPh > phMax + 0.5) {
      score = Math.max(20, score - 20);
      reasons.push(`Невідповідний pH (${rawPh}) для ${plant.medium || 'субстрату'}: блокування засвоєння ${rawPh < phMin ? 'фосфору та кальцію' : 'заліза, цинку та марганцю'}.`);
    }
  }

  // 4. Вплив PPM (засолення)
  if (score > 0) {
    const ppm = plant.ppmAfterWatering ?? plant.ppmBeforeWatering;
    if (ppm && ppm > 2000) {
      score = Math.max(10, score - 30);
      reasons.push(`Токсичне засолення субстрату (${ppm} PPM): осмотичний шок та опік коренів.`);
    } else if (ppm && ppm > 1400 && (plant.stage === 'germination' || plant.stage === 'seedling')) {
      score = Math.max(10, score - 35);
      reasons.push(`Смертельна концентрація мінералів для розсади (${ppm} PPM).`);
    }
  }

  // 5. Вплив температури
  if (score > 0) {
    const temp = plant.currentTemp;
    if (temp && (temp > 39 || temp < 7)) {
      score = Math.max(0, score - 40);
      reasons.push(`Екстремальна температура (${temp}°C): ${temp > 39 ? 'денатурація білків та тепловий удар' : 'холодовий параліч росту'}.`);
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let status: PlantVitalityResult['status'] = 'good';
  let statusLabelUk = 'Здорова';
  let statusBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  let heartColor = 'fill-[#fa6e59] text-[#fa6e59]';

  if (score === 0) {
    status = 'dead';
    statusLabelUk = 'Загибель (Висохла)';
    statusBadgeColor = 'bg-neutral-800 text-neutral-300 border-neutral-600';
    heartColor = 'fill-neutral-500 text-neutral-500';
  } else if (score < 25) {
    status = 'critical';
    statusLabelUk = 'Критичний стан';
    statusBadgeColor = 'bg-rose-500/25 text-rose-300 border-rose-500/50 animate-pulse';
    heartColor = 'fill-rose-500 text-rose-500';
  } else if (score < 50) {
    status = 'danger';
    statusLabelUk = 'Небезпечний стан';
    statusBadgeColor = 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    heartColor = 'fill-orange-500 text-orange-500';
  } else if (score < 75) {
    status = 'warning';
    statusLabelUk = 'Потребує уваги';
    statusBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    heartColor = 'fill-amber-400 text-amber-400';
  } else if (score >= 90) {
    status = 'excellent';
    statusLabelUk = 'Відмінний стан';
    statusBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    heartColor = 'fill-emerald-400 text-emerald-400';
  }

  return {
    healthScore: score,
    status,
    statusLabelUk,
    statusBadgeColor,
    heartColor,
    daysSinceWatered,
    daysBoneDry,
    expectedDryDays,
    overdueDays,
    isOverdueWatering: overdueDays > 0 || estimatedMoisture <= 25,
    estimatedMoisture,
    primaryRiskUk,
    reasons: reasons.length ? reasons : ['Рослина отримує необхідну вологу та живлення вчасно.'],
    actionRecommendationUk
  };
}

/**
 * Автоматичний авто-прогноз: динамічно продовжує просихання субстрату
 * та оновлює показники здоров'я та ризиків за реальним часом.
 */
export function autoForecastPlantState(plant: Plant): { updatedPlant: Plant; daysElapsed: number; updatedToday: boolean } {
  if (!plant) return { updatedPlant: plant, daysElapsed: 0, updatedToday: false };

  const now = Date.now();
  const todayStr = new Date(now).toISOString().split('T')[0];

  const liveMoisture = getEstimatedCurrentMoisture(plant);
  const vitality = calculatePlantVitalityAndHealth(plant);

  // Якщо авто-прогноз вже виконувався сьогодні і вологість суттєво не змінилась, оновлюємо лише живий healthScore
  if (plant.lastAutoForecastDate === todayStr) {
    const updatedPlant: Plant = {
      ...plant,
      healthScore: vitality.healthScore,
      vitalityStatus: vitality.status,
      vitalityLabelUk: vitality.statusLabelUk,
      vitalityDetails: vitality.reasons,
      moistureBeforeWatering: liveMoisture
    };
    return { updatedPlant, daysElapsed: vitality.daysSinceWatered, updatedToday: false };
  }

  const lastWateredDateStr = plant.lastWatered || todayStr;
  const lastWateredTime = new Date(lastWateredDateStr).getTime();
  const hoursElapsed = Math.max(0, (now - lastWateredTime) / 3600000);
  const daysElapsed = Math.max(0, Math.floor(hoursElapsed / 24));

  const currentPh = plant.phAfterWatering ?? plant.currentPH ?? 6.2;
  const phDrift = (hoursElapsed / 24) * 0.05;
  const projectedPh = Number((currentPh + phDrift).toFixed(1));
  const boundedPh = Math.min(7.6, Math.max(5.2, projectedPh));

  // Фільтруємо попередній прогноз на сьогодні, щоб не дублювати історію
  const existingHistory = (plant.history || plant.metricsHistory || []).filter(h => !(h.isPredicted && h.date === todayStr));
  const existingMoisture = (plant.moistureHistory || []).filter(h => !(h.isPredicted && h.date === todayStr));

  const predictedMetricEntry: MetricLogEntry = {
    id: `predicted-metric-${todayStr}`,
    date: todayStr,
    timestamp: now,
    type: 'dry_check',
    moistureSubstrate: liveMoisture,
    phSubstrateAfter: boundedPh,
    tempC: plant.currentTemp,
    humidityRH: plant.currentHumidity,
    stage: plant.stage,
    stageDay: plant.stageDay,
    strain: plant.strain,
    breeder: plant.breeder,
    notes: vitality.status === 'dead'
      ? '💀 Авто-прогноз: фіксація загибелі рослини через повне зневоднення'
      : vitality.status === 'critical'
      ? '🔴 Авто-прогноз: критичний водний стрес, прострочено полив'
      : '🤖 Авто-прогноз AI (розрахунок за даними сорту, клімату та фази)',
    isPredicted: true,
    source: 'predicted'
  };

  const predictedMoistureLog: MoistureLogEntry = {
    id: `predicted-moisture-${todayStr}`,
    date: todayStr,
    timestamp: now,
    moisture: liveMoisture,
    type: 'dry_check',
    ph: boundedPh,
    notes: vitality.status === 'dead' ? '💀 0% вологи — рослина засохла' : '🤖 Авто-прогноз AI',
    isPredicted: true,
    source: 'predicted'
  };

  const updatedHistory = [...existingHistory, predictedMetricEntry];
  const updatedMoistureHistory = [...existingMoisture, predictedMoistureLog];

  const updatedPlant: Plant = {
    ...plant,
    healthScore: vitality.healthScore,
    vitalityStatus: vitality.status,
    vitalityLabelUk: vitality.statusLabelUk,
    vitalityDetails: vitality.reasons,
    currentPH: boundedPh,
    moistureBeforeWatering: liveMoisture,
    lastAutoForecastDate: todayStr,
    history: updatedHistory,
    metricsHistory: updatedHistory,
    moistureHistory: updatedMoistureHistory
  };

  return { updatedPlant, daysElapsed, updatedToday: true };
}

/**
 * Розраховує аналітику та тенденції на основі накопиченої історії замірів для рослини
 */
export function getPlantMetricsAnalytics(plant: Plant) {
  const history = plant.history || plant.metricsHistory || [];
  const dailyDryingRate = calculateDailyDryingRate(plant);
  const vitality = calculatePlantVitalityAndHealth(plant);

  const estimatedMoisture = vitality.estimatedMoisture;
  const daysUntilWatering = vitality.overdueDays > 0 ? 0 : Math.max(0, Math.ceil((estimatedMoisture - 25) / dailyDryingRate));

  if (history.length === 0) {
    return {
      totalEntries: 0,
      avgPH: plant.currentPH,
      avgPPM: plant.ppmAfterWatering || 0,
      avgPPFD: plant.lightPPFD || 0,
      dailyDryingRate,
      daysUntilWatering,
      estimatedMoisture,
      daysSinceWatered: vitality.daysSinceWatered,
      overdueDays: vitality.overdueDays,
      isOverdueWatering: vitality.isOverdueWatering,
      vitality,
      phTrend: 'Нічого не зафіксовано',
      ppmTrend: 'Нічого не зафіксовано',
      humidityAvg: plant.currentHumidity,
      tempAvg: plant.currentTemp,
      statusMessage: vitality.status === 'dead'
        ? `💀 УВАГА: Рослина загинула! Полив не проводився понад ${vitality.daysSinceWatered} дн., субстрат повністю висох (0%).`
        : vitality.overdueDays > 0
        ? `⚠️ ПОЛИВ ПРОСТРОЧЕНО НА ${vitality.overdueDays} ДН.! Вологість ${estimatedMoisture}%. Загроза загибелі!`
        : 'Розпочніть фіксувати заміри вологості, pH та PPM для побудови детальної аналітики.',
      historySorted: [] as MetricLogEntry[]
    };
  }

  const validPHs = history.map(h => h.phSubstrateAfter ?? h.phSubstrateBefore).filter((v): v is number => typeof v === 'number');
  const validPPMs = history.map(h => h.ppmSubstrate).filter((v): v is number => typeof v === 'number');
  const validPPFDs = history.map(h => h.ppfdTop).filter((v): v is number => typeof v === 'number');
  const validTemps = history.map(h => h.tempC).filter((v): v is number => typeof v === 'number');
  const validHumidities = history.map(h => h.humidityRH).filter((v): v is number => typeof v === 'number');

  const avg = (arr: number[]) => arr.length ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)) : 0;

  const avgPH = avg(validPHs) || plant.currentPH;
  const avgPPM = Math.round(avg(validPPMs)) || plant.ppmAfterWatering || 0;
  const avgPPFD = Math.round(avg(validPPFDs)) || plant.lightPPFD || 0;
  const avgTemp = avg(validTemps) || plant.currentTemp;
  const avgHumidity = avg(validHumidities) || plant.currentHumidity;

  // Визначення трендів
  let phTrend = 'Стабільний';
  if (validPHs.length >= 2) {
    const diff = validPHs[validPHs.length - 1] - validPHs[0];
    if (diff > 0.3) phTrend = 'Зростає (ЛУЖНІЄ)';
    else if (diff < -0.3) phTrend = 'Падає (ЗАКИСЛЮЄТЬСЯ)';
  }

  let ppmTrend = 'Стабільний';
  if (validPPMs.length >= 2) {
    const diff = validPPMs[validPPMs.length - 1] - validPPMs[0];
    if (diff > 150) ppmTrend = 'Накопичення солей (ЗАСОЛЕННЯ)';
    else if (diff < -150) ppmTrend = 'Рослина активно споживає добрива';
  }

  return {
    totalEntries: history.length,
    avgPH,
    avgPPM,
    avgPPFD,
    avgTemp,
    avgHumidity,
    dailyDryingRate,
    daysUntilWatering,
    estimatedMoisture,
    daysSinceWatered: vitality.daysSinceWatered,
    overdueDays: vitality.overdueDays,
    isOverdueWatering: vitality.isOverdueWatering,
    vitality,
    phTrend,
    ppmTrend,
    statusMessage: vitality.status === 'dead'
      ? `💀 УВАГА: Рослина загинула! Полив не проводився понад ${vitality.daysSinceWatered} дн., субстрат повністю висох (0%).`
      : vitality.overdueDays > 0
      ? `⚠️ ПОЛИВ ПРОСТРОЧЕНО НА ${vitality.overdueDays} ДН.! Вологість ${estimatedMoisture}%. Загроза загибелі!`
      : `Швидкість просихання ~${dailyDryingRate}%/день. Полив ${daysUntilWatering === 0 ? 'сьогодні' : `через ${daysUntilWatering} дн.`}.`,
    latestEntry: history[history.length - 1],
    historySorted: [...history].sort((a, b) => b.timestamp - a.timestamp)
  };
}

/**
 * Форматує повну історію зафіксованих параметрів у текстовий блок для системного промпта AI
 */
export function formatMetricsHistoryForAI(plant: Plant): string {
  const history = plant.history || plant.metricsHistory || [];
  if (history.length === 0) {
    return 'Історія замірів поки порожня. Поточні параметри: pH ' + plant.currentPH + ', PPM ' + (plant.ppmAfterWatering ?? '—') + ', PPFD ' + (plant.lightPPFD ?? '—');
  }

  return history.map((entry, idx) => {
    return `[Запис #${idx + 1} | ${entry.date} | ${entry.type === 'post_watering' ? 'Після поливу' : 'Перевірка'}] ` +
      `Вологість субстрату: ${entry.moistureSubstrate ?? '—'}%, ` +
      `pH до: ${entry.phSubstrateBefore ?? '—'}, pH після: ${entry.phSubstrateAfter ?? '—'}, ` +
      `PPM: ${entry.ppmSubstrate ?? '—'}, PPFD: ${entry.ppfdTop ?? '—'}, ` +
      `Температура: ${entry.tempC ?? '—'}°C, Вологість повітря: ${entry.humidityRH ?? '—'}%`;
  }).join('\n');
}

export interface SubstrateDeltaAnalysis {
  deltaPpm: number | null;
  ppmStatus: 'buildup' | 'high_uptake' | 'balanced' | 'unknown';
  ppmLabel: string;
  ppmAdvice: string;
  deltaPh: number | null;
  phStatus: 'acidification' | 'alkalization' | 'optimal' | 'unknown';
  phLabel: string;
  phAdvice: string;
  overallHealth: 'optimal' | 'warning' | 'danger' | 'neutral';
  summaryBadge: string;
}

/**
 * Розраховує дельту PPM та pH (Дренаж / вихід мінус Вхідний розчин / до поливу)
 * для діагностики засолу субстрату проти активного споживання поживних речовин.
 */
export function calculateSubstrateDelta(
  plant: Plant,
  inputPpmOverride?: number,
  drainagePpmOverride?: number,
  inputPhOverride?: number,
  drainagePhOverride?: number
): SubstrateDeltaAnalysis {
  const inputPpm = inputPpmOverride ?? plant.ppmBeforeWatering;
  const drainagePpm = drainagePpmOverride ?? plant.ppmAfterWatering;

  const inputPh = inputPhOverride ?? plant.phBeforeWatering;
  const drainagePh = drainagePhOverride ?? plant.phAfterWatering ?? plant.currentPH;

  let deltaPpm: number | null = null;
  let ppmStatus: 'buildup' | 'high_uptake' | 'balanced' | 'unknown' = 'unknown';
  let ppmLabel = 'Заміри PPM не повні';
  let ppmAdvice = 'Для розрахунку дельти вкажіть PPM поживного розчину та PPM дренажу.';

  if (inputPpm !== undefined && drainagePpm !== undefined && inputPpm > 0 && drainagePpm > 0) {
    deltaPpm = drainagePpm - inputPpm;
    if (deltaPpm > 250) {
      ppmStatus = 'buildup';
      ppmLabel = `🧂 Накопичення солей / Засол (+${deltaPpm} PPM)`;
      ppmAdvice = 'Дренаж набагато концентрованіший за вхідний розчин. Рослина п’є воду швидше ніж їсть солі. Наступний полив: чиста вода або легкий розчин (-30% PPM) з виходом дренажу 20-30%.';
    } else if (deltaPpm < -180) {
      ppmStatus = 'high_uptake';
      ppmLabel = `🌿 Активне поглинання / Апетит (${deltaPpm} PPM)`;
      ppmAdvice = 'Рослина активно споживає поживні елементи. Субстрат чистий від накопичень. Можна плавно підняти концентрацію добрив на 10-15% (+100 PPM).';
    } else {
      ppmStatus = 'balanced';
      ppmLabel = `⚖️ Збалансоване живлення (${deltaPpm >= 0 ? '+' : ''}${deltaPpm} PPM)`;
      ppmAdvice = 'Ідеальна рівновага між внесенням добрив та споживанням. Субстрат у безпечній зоні.';
    }
  }

  let deltaPh: number | null = null;
  let phStatus: 'acidification' | 'alkalization' | 'optimal' | 'unknown' = 'unknown';
  let phLabel = 'Заміри pH не повні';
  let phAdvice = 'Контролюйте pH вхідного розчину та дренажу для уникнення блокування мікроелементів.';

  if (inputPh !== undefined && drainagePh !== undefined && inputPh > 0 && drainagePh > 0) {
    deltaPh = Number((drainagePh - inputPh).toFixed(1));
    if (deltaPh < -0.5) {
      phStatus = 'acidification';
      phLabel = `⚠️ Закислення субстрату (Δ ${deltaPh} pH, вихід ${drainagePh})`;
      phAdvice = 'Субстрат закислюється через відкладення солей або діяльність коренів. Підвищіть pH вхідного розчину на 0.3-0.5.';
    } else if (deltaPh > 0.6) {
      phStatus = 'alkalization';
      phLabel = `⚠️ Залуження субстрату (Δ +${deltaPh} pH, вихід ${drainagePh})`;
      phAdvice = 'Субстрат лужніє. Це може заблокувати засвоєння фосфору, заліза та цинку. Відкоригуйте pH поливу.';
    } else {
      phStatus = 'optimal';
      phLabel = `✅ Стабільний pH коридор (Δ ${deltaPh >= 0 ? '+' : ''}${deltaPh} pH)`;
      phAdvice = 'Буферна ємність субстрату працює відмінно, блокування елементів відсутнє.';
    }
  }

  let overallHealth: 'optimal' | 'warning' | 'danger' | 'neutral' = 'neutral';
  let summaryBadge = 'Очікує замірів';

  if (ppmStatus === 'buildup' || phStatus === 'acidification' || phStatus === 'alkalization') {
    overallHealth = 'warning';
    summaryBadge = 'Потребує уваги (Дисбаланс субстрату)';
  } else if (ppmStatus === 'balanced' && (phStatus === 'optimal' || phStatus === 'unknown')) {
    overallHealth = 'optimal';
    summaryBadge = 'Ідеальний баланс живлення';
  } else if (ppmStatus === 'high_uptake') {
    overallHealth = 'optimal';
    summaryBadge = 'Активний апетит рослини';
  }

  return {
    deltaPpm,
    ppmStatus,
    ppmLabel,
    ppmAdvice,
    deltaPh,
    phStatus,
    phLabel,
    phAdvice,
    overallHealth,
    summaryBadge
  };
}

