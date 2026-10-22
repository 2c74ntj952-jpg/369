export type PlantStage = 'germination' | 'seedling' | 'vegetative' | 'flowering' | 'harvested';

export interface MoistureLogEntry {
  id: string;
  date: string; // YYYY-MM-DD or formatted
  timestamp: number;
  moisture: number; // %
  type: 'dry_check' | 'post_watering';
  ph?: number;
  ppm?: number;
  notes?: string;
  isPredicted?: boolean; // Позначка чи це розраховані/прогнозовані дані AI
  source?: 'user' | 'predicted'; // Джерело даних: введено користувачем чи AI прогнозом
}

export interface MetricLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  type: 'dry_check' | 'post_watering' | 'general_update' | 'light_adjustment';
  moistureSubstrate?: number; // %
  phSubstrateBefore?: number;
  phSubstrateAfter?: number;
  ppmSubstrate?: number;
  ppfdTop?: number; // мкмоль/м²/с
  tempC?: number;
  humidityRH?: number;
  stage?: PlantStage;
  stageDay?: number;
  heightCm?: number;
  leafColor?: string;
  leafHealthScore?: number;
  strain?: string;
  breeder?: string;
  notes?: string;
  isPredicted?: boolean; // Позначка чи це розраховані/прогнозовані дані AI
  source?: 'user' | 'predicted'; // Джерело даних: введено користувачем чи AI прогнозом
}

export interface GrowJournalDayEntry {
  id: string;
  dayNumber: number; // e.g. 1, 2, 18, 45
  date: string; // YYYY-MM-DD
  stage: PlantStage;
  stageLabelUk?: string;
  // Substrate / Plant parameters
  moisturePercent: number; // %
  phBefore?: number;
  phAfter?: number;
  ppm?: number;
  ppfd?: number;
  heightCm?: number;
  
  photoUrl?: string;
  isPredicted?: boolean;
  
  // Growbox climate parameters
  tempC: number;
  humidityRH: number;
  vpd?: number;
  lightSchedule?: string; // e.g. "18/6"
  lightDistanceCm?: number;
  
  // Actions & Notes
  actionsDone: string[]; // e.g. ["Полив 1.5 л + CalMag", "LST подв'язування"]
  notes?: string;
  healthScoreAtDay?: number;
}

export interface CustomFeedChart {
  id: string;
  name: string;
  medium: 'Soil' | 'Coco' | 'Hydroponics';
  baseWaterPpm: number;
  calMagMlPerL: number;
  baseNutrientMlPerL: number;
  bloomBoosterMlPerL: number;
  additivesMlPerL: number;
  targetPpm: number;
  targetPh: number;
  notes?: string;
  createdAt: string;
}

export interface HarvestTrophy {
  id: string;
  plantId: string;
  plantName: string;
  strain: string;
  breeder?: string;
  strainType: 'Indica' | 'Sativa' | 'Hybrid';
  harvestDate: string; // YYYY-MM-DD
  totalDays: number; // Всього днів від насінини до врожаю
  totalYieldGrams: number; // Вага сухого врожаю в грамах
  rating: number; // 1-5 зірок
  trophyTitle: string; // e.g. "🏆 Золота Шишка Northern Lights", "🌿 Кубок Гровера 2026"
  trophyLevel: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  badgeIcon?: string;
  avatarUrl?: string;
  summaryNotes: string;
  sharedToAccount: boolean;
  sharedAt?: string;
  journalDaysCount?: number;
}

export interface UserProfile {
  name: string;
  avatarUrl?: string;
  bio?: string;
  growExperience?: string;
  memberSince?: string;
  locationRegion?: string;
  email?: string;
  isSeller?: boolean;
  accountType?: 'grower' | 'seller' | 'admin';
}

export interface UserDocData {
  userId: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
  lastCheckInDate?: string;
  points?: number;
  level?: number;
  levelTitle?: string;
  streakDays?: number;
  totalQuestsCompleted?: number;
  accountType?: 'grower' | 'seller' | 'admin';
  isSeller?: boolean;
  profile?: UserProfile;
}

export interface SubstrateIngredient {
  id: string;
  name: string;
  percentage: number;
  buyGuide?: string; // Порада для покупки в садових центрах
}

export interface SubstrateRecipe {
  id: string;
  name: string;
  manufacturer: string;
  mediumType: 'Soil' | 'Coco' | 'Hydroponics';
  ingredients: SubstrateIngredient[];
  targetPhMin: number;
  targetPhMax: number;
  targetPpmMin: number;
  targetPpmMax: number;
  aerationRating: string;
  waterRetention: string;
  nutrientBufferWeeks: number;
  confirmed?: boolean;
  notes?: string;
  phTargetInfo?: string; // Рекомендація щодо pH (напр., pH води та самого субстрату)
}

export interface Plant {
  id: string;
  name: string; // e.g. "Медична №1"
  strain: string; // e.g. "Northern Lights Auto"
  avatarUrl?: string; // Аватар/фото рослини
  imageUrl?: string;
  breeder?: string; // e.g. "Royal Queen Seeds", "Barney's Farm", "FastBuds"
  strainType: 'Indica' | 'Sativa' | 'Hybrid';
  isAuto: boolean;
  thcContent: string; // e.g. "18%"
  cbdContent: string; // e.g. "1.5%"
  medicalBenefits: string[]; // e.g. ["Біль", "Безсоння", "Тривожність"]
  stage: PlantStage;
  stageDay: number;
  totalStageDays: number;
  germinationDate: string;
  
  // Environment & Care
  currentTemp: number; // °C
  currentHumidity: number; // %
  currentPH: number; // e.g. 6.2
  currentEC: number; // mS/cm or PPM, e.g. 1.4
  lightSchedule: '18/6' | '12/12' | '20/4' | '24/0';
  lightDistanceCm: number;
  lightPowerWatts: number;
  lampType?: string;
  lampWattage?: number;
  medium: 'Soil' | 'Coco' | 'Hydroponics'; // 'Ґрунт' | 'Кокос' | 'Гідропоніка'
  substrateRecipe?: SubstrateRecipe;
  potSize?: number; // Об'єм горщика в літрах (напр., 3, 7, 10, 15, 20)
  potType?: 'plastic' | 'fabric' | 'airpot'; // Тип горщика: plastic, fabric, airpot
  lastTransplantedStage?: string; // Фаза росту, в якій востаннє проводилась пересадка
  nutrientBrand?: string; // Бранд добрив (напр., "Advanced Nutrients")
  nutrientPlan?: SelectedNutrientPlan; // Схема дозування добрив по фазах росту
  
  // Specific Plant Substrate & Light Parameters
  moistureBeforeWatering?: number; // Вологість субстрату перед поливом (%)
  moistureAfterWatering?: number; // Вологість субстрату після поливу (%)
  ppmAfterWatering?: number; // PPM субстрату після поливу
  ppmBeforeWatering?: number; // PPM субстрату перед поливом (не обов'язково)
  lightPPFD?: number; // PPFD світла над верхом рослини (мкмоль/м²/с)
  ppfdPoints?: {
    topLeft: number;
    topRight: number;
    center: number;
    bottomLeft: number;
    bottomRight: number;
  }; // PPFD заміри над верхівкою: 4 за кутами та 1 в Центрі
  phAfterWatering?: number; // pH субстрату після поливу
  phBeforeWatering?: number; // pH субстрату перед поливом (не обов'язково)
  cleanWaterPPM?: number; // PPM чистої води перед додаванням добрив (початкова мінералізація)
  moistureHistory?: MoistureLogEntry[]; // Історія замірів вологості субстрату та поливів
  history?: MetricLogEntry[]; // Сервісний масив історії вхідних параметрів (вологість, pH, PPM, PPFD) для аналітики та AI
  metricsHistory?: MetricLogEntry[]; // Прихована система логування всіх показників
  
  // Structured Daily Grow Journal & Harvest Status
  growJournal?: GrowJournalDayEntry[];
  isHarvested?: boolean;
  harvestTrophy?: HarvestTrophy;

  // Approved Watering Solution State
  approvedSolution?: {
    volume: number;
    recipeName?: string;
    targetPpm?: number;
    cleanWaterPpm?: number;
    approvedAt: string;
    items: { id?: string; name: string; amount: string; numAmount?: number; checked: boolean }[];
  };

  // Health & Forecast
  healthScore: number; // 0-100
  vitalityStatus?: 'excellent' | 'good' | 'warning' | 'danger' | 'critical' | 'dead';
  vitalityLabelUk?: string;
  vitalityDetails?: string[];
  notes: string;
  lastWatered: string;
  lastAutoForecastDate?: string;
  lastPenaltyDate?: string;
  symptoms: string[];
}

export interface VPDStatus {
  vpd: number; // kPa
  status: 'Optimal' | 'Low' | 'High' | 'Critical';
  recommendation: string;
  statusLabelUk: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'beginner' | 'climate' | 'care' | 'master';
}

export interface UserStats {
  points: number; // Total XP / Points
  level: number;
  levelTitle: string;
  nextLevelXP: number;
  currentLevelXP: number;
  streakDays: number;
  lastCheckInDate: string;
  totalQuestsCompleted: number;
  badges: Badge[];
  harvestTrophies?: HarvestTrophy[]; // Нагороди за вирощені рослини
  profile?: UserProfile; // Профіль гровера
}

export interface ReminderTask {
  id: string;
  plantId: string;
  plantName: string;
  title: string;
  description: string;
  category: 'watering' | 'environment' | 'nutrients' | 'pruning' | 'inspection' | 'climate' | 'light';
  xpReward: number;
  completed: boolean;
  dueDate: string; // ISO date or "Сьогодні", "Завтра"
  createdByAI?: boolean;
  urgent?: boolean;
}

export interface QuizOption {
  id: string;
  label: string;
  xpReward: number;
  effectAlert?: string;
  symptomTag?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  quizOptions?: QuizOption[];
  pointsAwarded?: number;
  generatedTask?: Partial<ReminderTask>;
  plantUpdate?: Partial<Plant>;
  isQuestQuestion?: boolean;
}

export interface GrowthPrediction {
  estimatedHarvestWeeks: number;
  estimatedYieldGrams: number;
  estimatedHarvestDate?: string;
  vpdAssessment?: VPDStatus;
  moldRiskLevel: 'Низький' | 'Середній' | 'Високий';
  lightBurnRisk: boolean;
  nutrientRecommendation: string;
  aiAdvice: string;
  strainBestPractices?: string;
  breederPotentialYield?: string;
}

export interface ProductCategory61 {
  id: string;
  codeNumber: number; // 1 to 61
  nameUk: string;
  nameEn: string;
  group: 'Nutrients' | 'Substrates' | 'Additives' | 'Protection & Regulators';
  description: string;
  icon: string;
}

export interface NutrientProduct {
  id: string;
  manufacturerId: string;
  name: string;
  category: 'Base' | 'Boost' | 'Root' | 'Enzyme' | 'CalMag' | 'Flush' | 'Organic' | string;
  categoryId?: string;
  npkRatio?: string;
  description: string;
  composition: string;
  applicationRate?: string;
  bestPractices?: string; // Кращі практики використання товару для вирощування канабісу
  imageUrl?: string;
  mediumType?: 'Soil' | 'Coco' | 'Hydroponics' | 'All';
}

export interface NutrientDosePerStage {
  stageId: 'germination' | 'seedling' | 'vegetative' | 'flowering' | 'harvest';
  stageNameUk: string;
  products: {
    productId: string;
    productName: string;
    dosageMlPerL: number;
    notes?: string;
  }[];
  targetPh: string;
  targetPpm: string;
}

export interface NutrientLineSchedule {
  id: string;
  manufacturerId: string;
  manufacturerName: string;
  name: string;
  description: string;
  mediumType: 'Soil' | 'Coco' | 'Hydroponics' | 'All';
  forAutoflower: boolean;
  stageDoses: NutrientDosePerStage[];
  notes?: string;
}

export interface SelectedNutrientPlan {
  brandId: string;
  brandName: string;
  lineId?: string;
  lineName: string;
  customProducts?: NutrientProduct[];
  stageDoses?: NutrientDosePerStage[];
  notes?: string;
}

export interface AiControlItem {
  id: string;
  title: string;
  category?: string;
  description?: string;
  badge?: string;
  status?: string;
  xpReward?: number;
  [key: string]: any;
}
