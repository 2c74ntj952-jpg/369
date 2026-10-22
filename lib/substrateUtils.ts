import { Plant } from './types';

export interface EstimatedMoistureResult {
  estimatedMoisture: number;
  daysSinceWatered: number;
  dailyRate: number;
  potMultiplier: number;
  explanation: string;
}

/**
 * Автоматичний розрахунок просихання субстрату відповідно до фази зростання рослини,
 * типу горщика, об'єму горщика та клімату (коли гровер обирає «Не хочу вимірювати»).
 */
export function calculateEstimatedMoisture(plant: Plant): EstimatedMoistureResult {
  const now = Date.now();
  let daysSinceWatered = 1;

  if (plant.lastWatered) {
    const lastDate = new Date(plant.lastWatered).getTime();
    if (!isNaN(lastDate)) {
      daysSinceWatered = Math.max(0.5, Number(((now - lastDate) / (1000 * 60 * 60 * 24)).toFixed(1)));
    }
  }

  // Базова вологість після якісного поливу (за замовчуванням 78%)
  const baseline = plant.moistureAfterWatering ?? 78;

  // Добова швидкість просихання залежно від фази росту (% вологості за 24 години)
  let stageRate = 12; // Вегетація
  let stageLabel = 'Вегетація';

  if (plant.stage === 'germination') {
    stageRate = 3;
    stageLabel = 'Пророщування';
  } else if (plant.stage === 'seedling') {
    stageRate = 5;
    stageLabel = 'Розсада';
  } else if (plant.stage === 'vegetative') {
    stageRate = 12;
    stageLabel = 'Вегетація';
  } else if (plant.stage === 'flowering') {
    stageRate = 18;
    stageLabel = 'Цвітіння';
  } else if (plant.stage === 'harvested') {
    stageRate = 8;
    stageLabel = 'Передхарвест';
  }

  // Коефіцієнт типу горщика (бокова аерація прискорює dry-back)
  let potMultiplier = 1.0;
  let potLabel = 'Стандартний горщик';

  if (plant.potType === 'fabric') {
    potMultiplier = 1.25;
    potLabel = 'Текстильний SmartPot (аерація)';
  } else if (plant.potType === 'airpot') {
    potMultiplier = 1.30;
    potLabel = 'AirPot (перфорований)';
  } else if (plant.potType === 'plastic') {
    potMultiplier = 0.85;
    potLabel = 'Пластиковий горщик';
  }

  // Коефіцієнт об'єму горщика (менший горщик висихає швидше)
  const potSize = plant.potSize || 10;
  let sizeMultiplier = 1.0;
  if (potSize <= 5) sizeMultiplier = 1.35;
  else if (potSize <= 10) sizeMultiplier = 1.0;
  else if (potSize <= 15) sizeMultiplier = 0.85;
  else sizeMultiplier = 0.70;

  // Кліматичні корекції (висока температура та низька вологість повітря збільшують випаровування)
  let climateAdj = 0;
  if ((plant.currentTemp ?? 24) > 26) climateAdj += 1.5;
  if ((plant.currentHumidity ?? 50) < 45) climateAdj += 1.5;

  const totalDailyRate = Number(((stageRate * potMultiplier * sizeMultiplier) + climateAdj).toFixed(1));
  const totalDrop = totalDailyRate * daysSinceWatered;
  const estimatedMoisture = Math.max(12, Math.min(85, Math.round(baseline - totalDrop)));

  const explanation = `Розраховано за фазою "${stageLabel}": просихання ~${totalDailyRate}%/добу (${daysSinceWatered} дн. після поливу, ${potLabel} ${potSize} л).`;

  return {
    estimatedMoisture,
    daysSinceWatered,
    dailyRate: totalDailyRate,
    potMultiplier,
    explanation
  };
}
