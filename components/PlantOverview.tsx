'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plant, MoistureLogEntry, MetricLogEntry, ReminderTask, UserStats, HarvestTrophy, SubstrateRecipe, SubstrateIngredient } from '@/lib/types';
import { calculateVPD, stageLabelUk } from '@/lib/growData';
import { getTrophyAvatarUrl } from '@/lib/trophyAvatars';
import { logPlantMetrics, autoForecastPlantState, getPlantMetricsAnalytics, calculateDailyDryingRate, getEstimatedCurrentMoisture, calculatePlantVitalityAndHealth, MetricEntryType } from '@/lib/metricsLogger';
import { GrowJournal } from '@/components/GrowJournal';
import { PlantDoctor } from '@/components/PlantDoctor';
import { SubstrateRecipeModal } from '@/components/SubstrateRecipeModal';
import { NutrientFeedCalculator } from '@/components/NutrientFeedCalculator';
import { RoomHeader } from '@/components/plant-overview/RoomHeader';
import { RoomClimateCard } from '@/components/plant-overview/RoomClimateCard';
import { TaskMeasurementControls } from '@/components/plant-overview/TaskMeasurementControls';
import { MetricWarningBox } from '@/components/plant-overview/MetricWarningBox';
import { PlantChat } from '@/components/plant-overview/PlantChat';
import {
  diagnoseMoisture,
  diagnosePh,
  diagnosePpm,
  diagnosePpfd,
  getPlantActiveWarnings,
} from '@/lib/metricDiagnostics';
import { metricsStateService } from '@/lib/metricsStateService';
import { getDefaultRecipeForMedium, getAdaptedSubstrateRecommendations, SUBSTRATE_MANUFACTURERS, PRESET_SUBSTRATE_RECIPES, WORLD_GROWER_RECIPES, WorldGrowerRecipe, getRecommendedGrowerRecipes } from '@/lib/substrateData';
import { calculateEstimatedMoisture } from '@/lib/substrateUtils';
import confetti from 'canvas-confetti';
import { Thermometer, Droplets, Droplet, Sun, Activity, Heart, Clock, Calendar, Edit3, Save, Sparkles, AlertTriangle, ShieldCheck, Zap, Plus, Sprout, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Stethoscope, FlaskConical, CheckCircle2, Trophy, BookOpen, X, CheckSquare, Square, RefreshCw, Layers, Trash2, Maximize2, Minimize2, Brain, Sliders, Skull, TrendingUp, MessageSquare, Bot, Send, Building2 } from 'lucide-react';

interface PlantOverviewProps {
  plant: Plant;
  plants?: Plant[];
  activePlantId?: string;
  onSelectPlant?: (id: string) => void;
  onOpenAddPlant?: () => void;
  onDeletePlant?: (plantId: string) => void;
  onUpdatePlant: (updated: Plant) => void;
  onOpenDoctorWithPlant: () => void;
  onOpenReminders: () => void;
  tasks?: ReminderTask[];
  userStats?: UserStats;
  onCompleteTask?: (taskId: string, xpReward: number) => void;
  onAddTask?: (task: ReminderTask) => void;
  onAwardTrophy?: (trophy: HarvestTrophy) => void;
  onAwardXP?: (xp: number, reason: string) => void;
  onNavigateToAccount?: () => void;
}

export function getRemainingDaysToHarvest(plant: Plant): number {
  if (plant.isHarvested || plant.stage === 'harvested') {
    return 99999;
  }

  const stageDay = plant.stageDay || 1;
  const totalStageDays = plant.totalStageDays || 28;
  const stageRemaining = Math.max(0, totalStageDays - stageDay);

  switch (plant.stage) {
    case 'flowering':
      return stageRemaining;
    case 'vegetative':
      return stageRemaining + 56;
    case 'seedling':
      return stageRemaining + 21 + 56;
    case 'germination':
      return stageRemaining + 7 + 21 + 56;
    default:
      return stageRemaining + 50;
  }
}

export function getWaterPpmTypeLabel(ppm: number): string {
  if (ppm <= 30) return 'Осмос / RO';
  if (ppm <= 80) return 'Фільтрована';
  if (ppm <= 180) return 'Водопровід';
  if (ppm <= 300) return 'Жорстка';
  return 'Криниця';
}

interface SinglePlantCardWindowProps {
  plant: Plant;
  defaultExpanded?: boolean;
  isExpandedControlled?: boolean;
  onToggleExpandControlled?: () => void;
  onSetExpandedControlled?: (expand: boolean) => void;
  onUpdatePlant: (updated: Plant) => void;
  onOpenDoctorWithPlant: () => void;
  onOpenReminders: () => void;
  tasks?: ReminderTask[];
  userStats?: UserStats;
  onCompleteTask?: (taskId: string, xpReward: number) => void;
  onAddTask?: (task: ReminderTask) => void;
  onAwardTrophy?: (trophy: HarvestTrophy) => void;
  onAwardXP?: (xp: number, reason: string) => void;
  onNavigateToAccount?: () => void;
  onRequestDeletePlant?: (plantId: string) => void;
}

const SinglePlantCardWindow: React.FC<SinglePlantCardWindowProps> = React.memo(({
  plant,
  defaultExpanded = false,
  isExpandedControlled,
  onToggleExpandControlled,
  onSetExpandedControlled,
  onUpdatePlant,
  onOpenDoctorWithPlant,
  onOpenReminders,
  tasks,
  userStats,
  onCompleteTask,
  onAddTask,
  onAwardTrophy,
  onAwardXP,
  onNavigateToAccount,
  onRequestDeletePlant,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isInternalCardExpanded, setIsInternalCardExpanded] = useState(defaultExpanded);
  const isCardExpanded = isExpandedControlled !== undefined ? isExpandedControlled : isInternalCardExpanded;

  const toggleCardExpanded = useCallback(() => {
    const nextVal = !isCardExpanded;
    setIsInternalCardExpanded(nextVal);
    if (onSetExpandedControlled) {
      onSetExpandedControlled(nextVal);
    } else if (onToggleExpandControlled) {
      onToggleExpandControlled();
    }
  }, [isCardExpanded, onSetExpandedControlled, onToggleExpandControlled]);

  const setIsCardExpanded = useCallback((action: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof action === 'function' ? action(isCardExpanded) : action;
    setIsInternalCardExpanded(nextVal);
    if (onSetExpandedControlled) {
      onSetExpandedControlled(nextVal);
    } else if (onToggleExpandControlled) {
      onToggleExpandControlled();
    }
  }, [isCardExpanded, onSetExpandedControlled, onToggleExpandControlled]);
  const [showAfterWateringParams, setShowAfterWateringParams] = useState(false);
  const [isPhBeforeUnknown, setIsPhBeforeUnknown] = useState(false);
  const [isPpmBeforeUnknown, setIsPpmBeforeUnknown] = useState(false);
  const [phChoice, setPhChoice] = useState<'know' | 'unknown'>('know');
  const [ppmChoice, setPpmChoice] = useState<'know' | 'unknown'>('know');
  const [isOverwaterWarningExpanded, setIsOverwaterWarningExpanded] = useState(false);
  const [isPpmHighWarningExpanded, setIsPpmHighWarningExpanded] = useState(false);
  const [isPpmLowWarningExpanded, setIsPpmLowWarningExpanded] = useState(false);
  const [isPhLowWarningExpanded, setIsPhLowWarningExpanded] = useState(false);
  const [isPhHighWarningExpanded, setIsPhHighWarningExpanded] = useState(false);
  const [isSubstrateExpanded, setIsSubstrateExpanded] = useState(false);
  const [isLightExpanded, setIsLightExpanded] = useState(false);
  const [isMoistureQuickAdjustOpen, setIsMoistureQuickAdjustOpen] = useState(false);
  const [isPhQuickAdjustOpen, setIsPhQuickAdjustOpen] = useState(false);
  const [isPpmQuickAdjustOpen, setIsPpmQuickAdjustOpen] = useState(false);
  const [isPpfdQuickAdjustOpen, setIsPpfdQuickAdjustOpen] = useState(false);
  const taskScrollRef = useRef<HTMLDivElement>(null);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);

  // Mouse & Touch Dragging State for Task Carousel
  const [isTaskDragging, setIsTaskDragging] = useState(false);
  const [taskDragStartX, setTaskDragStartX] = useState(0);
  const [taskDragScrollLeft, setTaskDragScrollLeft] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTaskTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTaskTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartXRef.current - touchEndX;
    const diffY = (touchStartYRef.current || 0) - touchEndY;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // Only switch task card if horizontal gesture is predominant
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX > 0) {
        scrollToTask(activeTaskIndex + 1);
      } else {
        scrollToTask(activeTaskIndex - 1);
      }
    }
  };

  const handleTaskMouseDown = (e: React.MouseEvent) => {
    if (!taskScrollRef.current) return;
    setIsTaskDragging(true);
    setTaskDragStartX(e.pageX - taskScrollRef.current.offsetLeft);
    setTaskDragScrollLeft(taskScrollRef.current.scrollLeft);
  };

  const handleTaskMouseMove = (e: React.MouseEvent) => {
    if (!isTaskDragging || !taskScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - taskScrollRef.current.offsetLeft;
    const walk = (x - taskDragStartX) * 1.5;
    taskScrollRef.current.scrollLeft = taskDragScrollLeft - walk;
  };

  const handleTaskMouseUp = () => {
    if (!isTaskDragging) return;
    setIsTaskDragging(false);
    handleTaskScroll();
  };

  const handleTaskScroll = () => {
    if (!taskScrollRef.current) return;
    const container = taskScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    const containerCenter = scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeTaskIndex) {
      setActiveTaskIndex(closestIndex);
    }
  };

  const scrollToTask = useCallback((index: number) => {
    if (!taskScrollRef.current) return;
    const container = taskScrollRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    const targetIndex = Math.max(0, Math.min(index, children.length - 1));
    if (children[targetIndex]) {
      const target = children[targetIndex];
      const scrollLeft = target.offsetLeft - (container.clientWidth - target.clientWidth) / 2;
      container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
      setActiveTaskIndex(targetIndex);
    }
  }, []);

  const scrollTasksLeft = () => {
    scrollToTask(activeTaskIndex - 1);
  };

  const scrollTasksRight = () => {
    scrollToTask(activeTaskIndex + 1);
  };

  const getStagePpmRange = (stage: string) => {
    if (stage === 'germination' || stage === 'seedling') {
      return { min: 200, max: 400, mid: 300, label: '200 – 400 PPM' };
    } else if (stage === 'vegetative') {
      return { min: 600, max: 800, mid: 700, label: '600 – 800 PPM' };
    } else {
      return { min: 800, max: 1100, mid: 950, label: '800 – 1100 PPM' };
    }
  };

  const stagePpmRange = getStagePpmRange(plant.stage);
  const [targetPpm, setTargetPpm] = useState<number>(stagePpmRange.mid);

  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [isNutrientFeedCalcOpen, setIsNutrientFeedCalcOpen] = useState(false);
  const [isSubstrateConfirmModalOpen, setIsSubstrateConfirmModalOpen] = useState(false);

  // Transplant (Пересадка) modal state
  const [isTransplantModalOpen, setIsTransplantModalOpen] = useState(false);
  const [transplantSubstrateMode, setTransplantSubstrateMode] = useState<'same' | 'new'>('same');
  const [transplantChoiceType, setTransplantChoiceType] = useState<'commercial' | 'recipe' | 'custom'>('recipe');
  const [transplantSelectedManufacturer, setTransplantSelectedManufacturer] = useState<string>('BioBizz');
  const [transplantSelectedRecipeId, setTransplantSelectedRecipeId] = useState<string>('biobizz-allmix');
  const recommendedTransplantWorldRecipes = React.useMemo(() => {
    return getRecommendedGrowerRecipes(plant.strain, plant.breeder);
  }, [plant.strain, plant.breeder]);
  const [transplantAuthorRecipe, setTransplantAuthorRecipe] = useState<SubstrateRecipe>(() =>
    JSON.parse(JSON.stringify(WORLD_GROWER_RECIPES[0]))
  );
  const [transplantCustomRecipe, setTransplantCustomRecipe] = useState<SubstrateRecipe>(() => ({
    id: `custom-sub-${plant.id}`,
    name: `Власний мікс для ${plant.name}`,
    manufacturer: 'Власний рецепт (DIY)',
    mediumType: plant.medium === 'Coco' ? 'Coco' : 'Soil',
    targetPhMin: plant.medium === 'Coco' ? 5.8 : 6.2,
    targetPhMax: plant.medium === 'Coco' ? 6.2 : 6.6,
    targetPpmMin: 400,
    targetPpmMax: 750,
    aerationRating: 'Висока (індивідуальний баланс)',
    waterRetention: 'Оптимальна',
    nutrientBufferWeeks: 3,
    phTargetInfo: plant.medium === 'Coco' ? 'Оптимальний pH кокосової суміші: 5.8–6.2' : 'Оптимальний pH ґрунтової суміші: 6.2–6.6',
    notes: 'Індивідуальна суміш для пересадки у більший горщик.',
    confirmed: true,
    ingredients: [
      { id: 'c-ing-1', name: 'Верховий торф / Базовий ґрунт', percentage: 60, buyGuide: 'Пухка основа для кореневої системи' },
      { id: 'c-ing-2', name: 'Агроперліт (фракція 3-5 мм)', percentage: 25, buyGuide: 'Аерація та захист від переливу' },
      { id: 'c-ing-3', name: 'Біогумус (Вермікомпост)', percentage: 15, buyGuide: 'Органічне живлення та мікрофлора' },
    ],
  }));
  const [transplantPotType, setTransplantPotType] = useState<'plastic' | 'fabric' | 'airpot'>(plant.potType || 'fabric');
  const [transplantNewPotSize, setTransplantNewPotSize] = useState<number>(() => {
    const currentSize = plant.potSize || (plant.stage === 'germination' ? 1 : plant.stage === 'seedling' ? 3 : plant.stage === 'vegetative' ? 7 : 15);
    if (currentSize <= 3) return 7;
    if (currentSize <= 7) return 15;
    if (currentSize <= 12) return 20;
    return Math.min(30, currentSize + 5);
  });
  const [solutionVolume, setSolutionVolume] = useState<number>(() => {
    const storedPot = typeof window !== 'undefined' && plant?.id ? Number(localStorage.getItem(`plant_pot_size_${plant.id}`)) : undefined;
    const potVal = plant.potSize ?? (storedPot && !isNaN(storedPot) ? storedPot : 10);
    return Math.max(0.2, Number((potVal * 0.20).toFixed(1)));
  });
  const [cleanWaterPpm, setCleanWaterPpm] = useState<number>(plant.approvedSolution?.cleanWaterPpm ?? plant.cleanWaterPPM ?? 100);
  const [isWaterPpmInfoOpen, setIsWaterPpmInfoOpen] = useState(false);
  const [isQuickMetricsExpanded, setIsQuickMetricsExpanded] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isAiInsightsExpanded, setIsAiInsightsExpanded] = useState(false);

  // Post-watering confirmation modal state
  const [isPostWateringModalOpen, setIsPostWateringModalOpen] = useState(false);
  const [postMoisture, setPostMoisture] = useState<number>(80);
  const [postPpm, setPostPpm] = useState<number>(plant.ppmAfterWatering ?? (plant.stage === 'flowering' ? 950 : 650));
  const [postPh, setPostPh] = useState<number>(plant.phAfterWatering ?? (plant.medium === 'Soil' ? 6.5 : 5.8));
  const [confirmedFertilizers, setConfirmedFertilizers] = useState<Record<string, boolean>>({});
  const [customDosages, setCustomDosages] = useState<Record<string, number>>({});

  // Post-watering collapsible warning states
  const [isPostOverwaterExpanded, setIsPostOverwaterExpanded] = useState(false);
  const [isPostPhLowExpanded, setIsPostPhLowExpanded] = useState(false);
  const [isPostPhHighExpanded, setIsPostPhHighExpanded] = useState(false);
  const [isPostPpmHighExpanded, setIsPostPpmHighExpanded] = useState(false);
  const [isPostPpmLowExpanded, setIsPostPpmLowExpanded] = useState(false);

  useEffect(() => {
    const val = plant.approvedSolution?.cleanWaterPpm ?? plant.cleanWaterPPM;
    if (val !== undefined) {
      setCleanWaterPpm(val);
    }
  }, [plant.cleanWaterPPM, plant.approvedSolution?.cleanWaterPpm]);

  const getSolutionRecipe = (volume: number, stage: string, selectedPpm?: number) => {
    const range = getStagePpmRange(stage);
    const ppmToUse = selectedPpm ?? range.mid;
    const ppmRatio = ppmToUse / range.mid;

    const isFlowering = stage === 'flowering' || stage === 'harvest';
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
  };

  const handleApproveSolution = () => {
    const storedPot = typeof window !== 'undefined' && plant?.id ? Number(localStorage.getItem(`plant_pot_size_${plant.id}`)) : undefined;
    const activePot = taskInputValues['action-water-clean-ppm']?.potSize ?? editForm.potSize ?? plant.potSize ?? (storedPot && !isNaN(storedPot) ? storedPot : 10);
    const calcVol = Math.max(0.2, Number((activePot * 0.20).toFixed(1)));
    setSolutionVolume(calcVol);
    const recipe = getSolutionRecipe(calcVol, plant.stage, targetPpm);
    const approvedData = {
      volume: calcVol,
      targetPpm: targetPpm,
      cleanWaterPpm: cleanWaterPpm,
      approvedAt: new Date().toISOString(),
      items: recipe.map(item => {
        const customDosage = customDosages[item.id];
        const numAmount = customDosage !== undefined ? customDosage : item.numAmount;
        return {
          id: item.id,
          name: item.name,
          amount: `${numAmount} мл`,
          checked: confirmedFertilizers[item.id] ?? true
        };
      })
    };

    const updated = {
      ...plant,
      cleanWaterPPM: cleanWaterPpm,
      approvedSolution: approvedData
    };

    setPostMoisture(80);
    setPostPpm(plant.ppmAfterWatering ?? targetPpm);
    setPostPh(plant.phAfterWatering ?? (plant.medium === 'Soil' ? 6.5 : 5.8));

    const initialConf: Record<string, boolean> = {};
    recipe.forEach(it => {
      initialConf[it.id] = confirmedFertilizers[it.id] ?? true;
    });
    setConfirmedFertilizers(initialConf);

    onUpdatePlant(updated);
    
    // Complete solution prep task in action control
    const now = Date.now();
    setCompletedAiControlActions(prev => ({
      ...prev,
      'action-water-solution-prep': true
    }));
    setCompletedTaskTimestamps(prev => ({
      ...prev,
      'action-water-solution-prep': now
    }));

    setIsSolutionModalOpen(false);
    setIsQuickMetricsExpanded(true);
    setIsPostWateringModalOpen(true);
    setIsEditing(false);
    setIsSubstrateExpanded(false);
  };

  const handleConfirmPostWatering = () => {
    const vol = solutionVolume;
    const recipe = getSolutionRecipe(vol, plant.stage, targetPpm);
    const confirmedItemsSummary = recipe
      .filter(item => confirmedFertilizers[item.id] !== false)
      .map(item => `${item.name}: ${customDosages[item.id] !== undefined ? customDosages[item.id] : item.numAmount} мл`)
      .join(', ');

    const loggedPlant = logPlantMetrics(
      { ...plant, ...editForm },
      {
        type: 'post_watering',
        moistureSubstrate: postMoisture,
        phSubstrateBefore: editForm.phBeforeWatering ?? plant.phBeforeWatering,
        phSubstrateAfter: postPh,
        ppmSubstrate: postPpm,
        ppfdTop: plant.lightPPFD ?? 520,
        tempC: plant.currentTemp,
        humidityRH: plant.currentHumidity,
        notes: `Полив розчином ${vol}л. Добрива: ${confirmedItemsSummary || 'без добрив'}.`,
        isPredicted: false,
        source: 'user'
      }
    );

    const updatedPlant: Plant = {
      ...loggedPlant,
      moistureAfterWatering: postMoisture,
      moistureBeforeWatering: postMoisture,
      phAfterWatering: postPh,
      phBeforeWatering: postPh,
      currentPH: postPh,
      ppmAfterWatering: postPpm,
      ppmBeforeWatering: postPpm,
      cleanWaterPPM: cleanWaterPpm,
      potSize: editForm.potSize ?? plant.potSize ?? (typeof window !== 'undefined' && plant?.id ? (Number(localStorage.getItem(`plant_pot_size_${plant.id}`)) || undefined) : undefined),
      lastWatered: new Date().toISOString(),
      approvedSolution: undefined // Clears approved solution state so button disappears after post watering confirmation!
    };

    if (typeof window !== 'undefined' && plant?.id && updatedPlant.potSize) {
      try {
        localStorage.setItem(`plant_pot_size_${plant.id}`, String(updatedPlant.potSize));
      } catch (e) {}
    }

    onUpdatePlant(updatedPlant);

    // Reset completed actions state so newly triggered tasks appear fresh
    setCompletedAiControlActions({});

    // Check if postPh, postPpm, postMoisture or cleanWaterPpm are out of norm and expand AI Control Checklist
    const medium = (plant.medium || '').toLowerCase();
    const phMin = medium.includes('кокос') || medium.includes('coco') ? 5.5 : medium.includes('гідро') || medium.includes('hydro') ? 5.5 : 6.0;
    const phMax = medium.includes('кокос') || medium.includes('coco') ? 6.2 : medium.includes('гідро') || medium.includes('hydro') ? 6.0 : 6.8;

    const stage = plant.stage || 'vegetative';
    const ppmMin = stage === 'germination' || stage === 'seedling' ? 200 : stage === 'vegetative' ? 400 : 800;
    const ppmMax = stage === 'germination' || stage === 'seedling' ? 400 : stage === 'vegetative' ? 800 : 1200;

    const isPhBad = postPh < phMin || postPh > phMax;
    const isPpmBad = postPpm < ppmMin || postPpm > ppmMax;
    const isMoistureBad = postMoisture < 70 || postMoisture > 80;
    const isWaterPpmBad = cleanWaterPpm > 150;

    if (isPhBad || isPpmBad || isMoistureBad || isWaterPpmBad) {
      setIsQuickMetricsExpanded(true);
      setLastRewardNotice('⚠️ Зафіксовано відхилення показників або високий PPM чистої води! Створено нові завдання AI Контролю.');
    } else {
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      } catch {
        // ignore if confetti fails
      }
      setLastRewardNotice('+15 XP • Полив та всі дані зафіксовано в памʼяті!');
    }

    setTimeout(() => setLastRewardNotice(null), 4500);
    setIsPostWateringModalOpen(false);
    setIsSolutionModalOpen(false);
    setIsEditing(false);
    setIsSubstrateExpanded(false);
  };


  // Action control state for AI Control Checklist
  const [completedAiControlActions, setCompletedAiControlActions] = useState<Record<string, boolean>>({});
  const [completedTaskTimestamps, setCompletedTaskTimestamps] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined' && plant?.id) {
      try {
        const saved = localStorage.getItem(`ai_control_timestamps_${plant.id}`);
        return saved ? JSON.parse(saved) : {};
      } catch (e) {
        return {};
      }
    }
    return {};
  });
  const [lastRewardNotice, setLastRewardNotice] = useState<string | null>(null);

  // Reload plant-specific timestamps when active plant changes
  useEffect(() => {
    if (typeof window !== 'undefined' && plant?.id) {
      try {
        const saved = localStorage.getItem(`ai_control_timestamps_${plant.id}`);
        setCompletedTaskTimestamps(saved ? JSON.parse(saved) : {});
      } catch (e) {
        setCompletedTaskTimestamps({});
      }
    }
  }, [plant?.id]);

  useEffect(() => {
    if (typeof window !== 'undefined' && plant?.id) {
      try {
        localStorage.setItem(`ai_control_timestamps_${plant.id}`, JSON.stringify(completedTaskTimestamps));
      } catch (e) {
        // ignore
      }
    }
  }, [completedTaskTimestamps, plant?.id]);

  interface AiControlItem {
    id: string;
    title: string;
    description?: string;
    subTasks?: string[];
    subActionIds?: string[];
    category: 'watering' | 'ph' | 'nutrients' | 'climate' | 'light' | 'inspection';
    categoryLabel: string;
    badgeValue?: string;
    intervalDays?: number;
    cadenceLabel?: string;
    xpReward: number;
    cardBg: string;
    badgeBg: string;
    borderClass: string;
    textColor: string;
    checkboxColor: string;
    icon: React.ReactNode;
  }

  // Grow Journal & Harvest Modals
  const [showJournalModal, setShowJournalModal] = useState<boolean>(false);
  const [showHarvestDryModal, setShowHarvestDryModal] = useState<boolean>(false);
  const [harvestYieldGrams, setHarvestYieldGrams] = useState<number>(85);
  const [harvestRating, setHarvestRating] = useState<number>(5);
  const [harvestNotes, setHarvestNotes] = useState<string>(`Чудовий сухий врожай сорту ${plant.strain}! Щільні суцвіття з багатим ароматом.`);

  const [editForm, setEditForm] = useState<Plant>(() => {
    const stored = typeof window !== 'undefined' && plant?.id ? Number(localStorage.getItem(`plant_pot_size_${plant.id}`)) : undefined;
    const resolvedPot = plant.potSize ?? (stored && !isNaN(stored) ? stored : undefined);
    return { ...plant, ...(resolvedPot ? { potSize: resolvedPot } : {}) };
  });

  useEffect(() => {
    const stored = typeof window !== 'undefined' && plant?.id ? Number(localStorage.getItem(`plant_pot_size_${plant.id}`)) : undefined;
    const resolvedPot = plant.potSize ?? (stored && !isNaN(stored) ? stored : undefined);
    setEditForm({ ...plant, ...(resolvedPot ? { potSize: resolvedPot } : {}) });
  }, [plant]);

  // Task measurement slider state
  const [taskInputValues, setTaskInputValues] = useState<Record<string, Record<string, any>>>({});

  // Centralized Real-Time Metrics State Service Subscription
  useEffect(() => {
    if (!plant || !plant.id) return;

    metricsStateService.syncWithPlant(plant);

    const unsubscribe = metricsStateService.subscribe(plant.id, (snapshot, payload) => {
      // 1. Update local editForm
      setEditForm(prev => ({
        ...prev,
        ...payload.allUpdatedFields
      }));

      // 2. Synchronize taskInputValues for all AI Control task cards in real time
      setTaskInputValues(prev => {
        const next = { ...prev };
        const field = payload.field;
        const val = payload.value;

        let taskKey = field;
        if (field === 'cleanWaterPPM' || field === 'cleanWaterPpm' || field === 'waterPpm') taskKey = 'cleanWaterPpm';

        Object.keys(next).forEach(tId => {
          if (next[tId]) {
            next[tId] = {
              ...next[tId],
              [taskKey]: val
            };
          }
        });

        if (payload.taskId) {
          next[payload.taskId] = {
            ...(next[payload.taskId] || {}),
            [taskKey]: val
          };
        }

        return next;
      });
    });

    return () => unsubscribe();
  }, [plant.id, plant]);

  const handleTaskInputChange = useCallback((taskId: string, fieldKey: string, val: any) => {
    const { updatedFields } = metricsStateService.updateMetrics(
      plant.id,
      fieldKey,
      val,
      'ai_control_task',
      taskId
    );

    setTaskInputValues(prev => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        [fieldKey]: val
      }
    }));

    if (fieldKey === 'cleanWaterPpm' || fieldKey === 'waterPpm') {
      setCleanWaterPpm(val);
    }

    if (fieldKey === 'potSize') {
      const numVal = typeof val === 'number' ? val : parseFloat(val);
      if (typeof window !== 'undefined' && plant?.id) {
        try {
          localStorage.setItem(`plant_pot_size_${plant.id}`, String(numVal));
        } catch (e) {}
      }
    }

    if (Object.keys(updatedFields).length > 0) {
      setEditForm(prev => ({ ...prev, ...updatedFields }));
      onUpdatePlant({ ...plant, ...editForm, ...updatedFields });
    }
  }, [plant, editForm, onUpdatePlant]);

  const [savedMoistureFeedback, setSavedMoistureFeedback] = useState<boolean>(false);
  const [savedPhFeedback, setSavedPhFeedback] = useState<boolean>(false);
  const [savedPpmFeedback, setSavedPpmFeedback] = useState<boolean>(false);
  const [savedPostWateringFeedback, setSavedPostWateringFeedback] = useState<boolean>(false);
  const [savedLightFeedback, setSavedLightFeedback] = useState<boolean>(false);
  const [savedBeforeWateringFeedback, setSavedBeforeWateringFeedback] = useState<boolean>(false);
  const [selectedPpfdPoint, setSelectedPpfdPoint] = useState<'topLeft' | 'topRight' | 'center' | 'bottomLeft' | 'bottomRight'>('center');

  const handleSaveBeforeWateringMetrics = () => {
    const moistureVal = editForm.moistureBeforeWatering ?? plant.moistureBeforeWatering ?? 25;
    const isDry = moistureVal <= 30;

    const phVal = isDry
      ? (isPhBeforeUnknown ? undefined : (editForm.phBeforeWatering ?? 6.5))
      : (editForm.phAfterWatering ?? editForm.currentPH ?? 6.5);

    const ppmVal = isDry
      ? (isPpmBeforeUnknown ? undefined : (editForm.ppmBeforeWatering ?? (plant.stage === 'flowering' ? 850 : plant.stage === 'vegetative' ? 550 : 300)))
      : (editForm.ppmAfterWatering ?? (plant.stage === 'flowering' ? 950 : plant.stage === 'vegetative' ? 600 : 300));

    const updatedPlantData: Partial<Plant> = {
      moistureBeforeWatering: moistureVal,
      ...(isDry
        ? { phBeforeWatering: phVal, ppmBeforeWatering: ppmVal }
        : { phAfterWatering: phVal, currentPH: phVal, ppmAfterWatering: ppmVal })
    };

    const loggedPlant = logPlantMetrics(
      { ...plant, ...updatedPlantData },
      {
        type: 'dry_check',
        moistureSubstrate: moistureVal,
        phSubstrateBefore: isDry ? phVal : undefined,
        phSubstrateAfter: isDry ? undefined : phVal,
        ppmSubstrate: ppmVal,
        ppfdTop: editForm.lightPPFD ?? plant.lightPPFD,
        tempC: editForm.currentTemp ?? plant.currentTemp,
        humidityRH: editForm.currentHumidity ?? plant.currentHumidity,
        notes: `Збережено показники до поливу: Вологість ${moistureVal}%, pH ${phVal !== undefined ? phVal.toFixed(1) : 'невідомий'}, PPM ${ppmVal !== undefined ? ppmVal : 'невідомий'}`,
        isPredicted: false,
        source: 'user'
      }
    );

    onUpdatePlant(loggedPlant);
    if (onAwardXP) onAwardXP(2, 'Збережено показники до поливу');
    setSavedBeforeWateringFeedback(true);
    setTimeout(() => setSavedBeforeWateringFeedback(false), 2000);
  };



  const handleSaveMoisture = () => {
    const val = editForm.moistureBeforeWatering ?? plant.moistureBeforeWatering ?? 25;
    const loggedPlant = logPlantMetrics(
      { ...plant, moistureBeforeWatering: val },
      {
        type: 'dry_check',
        moistureSubstrate: val,
        ppfdTop: editForm.lightPPFD ?? plant.lightPPFD,
        tempC: editForm.currentTemp ?? plant.currentTemp,
        humidityRH: editForm.currentHumidity ?? plant.currentHumidity,
        notes: `Збережено вологість: ${val}%`,
        isPredicted: false,
        source: 'user'
      }
    );
    onUpdatePlant(loggedPlant);
    if (onAwardXP) onAwardXP(1, 'Збережено вологість субстрату');
    setSavedMoistureFeedback(true);
    setTimeout(() => setSavedMoistureFeedback(false), 2000);
  };

  const handleSavePh = (isBefore: boolean) => {
    const phVal = isBefore
      ? (isPhBeforeUnknown ? undefined : (editForm.phBeforeWatering ?? 6.5))
      : (editForm.phAfterWatering ?? editForm.currentPH ?? 6.5);

    const updatedPlantData: Partial<Plant> = isBefore
      ? { phBeforeWatering: phVal }
      : { phAfterWatering: phVal, currentPH: phVal };

    const loggedPlant = logPlantMetrics(
      { ...plant, ...updatedPlantData },
      {
        type: isBefore ? 'dry_check' : 'post_watering',
        phSubstrateBefore: isBefore ? phVal : undefined,
        phSubstrateAfter: isBefore ? undefined : phVal,
        moistureSubstrate: editForm.moistureBeforeWatering ?? plant.moistureBeforeWatering ?? 25,
        notes: isBefore ? `Збережено pH до поливу: ${phVal !== undefined ? phVal.toFixed(1) : 'невідомий'}` : `Збережено pH: ${phVal !== undefined ? phVal.toFixed(1) : 'невідомий'}`,
        isPredicted: false,
        source: 'user'
      }
    );
    onUpdatePlant(loggedPlant);
    if (onAwardXP) onAwardXP(1, 'Збережено pH');
    setSavedPhFeedback(true);
    setTimeout(() => setSavedPhFeedback(false), 2000);
  };

  const handleSavePpm = (isBefore: boolean) => {
    const ppmVal = isBefore
      ? (isPpmBeforeUnknown ? undefined : (editForm.ppmBeforeWatering ?? (plant.stage === 'flowering' ? 850 : plant.stage === 'vegetative' ? 550 : 300)))
      : (editForm.ppmAfterWatering ?? (plant.stage === 'flowering' ? 950 : plant.stage === 'vegetative' ? 600 : 300));

    const updatedPlantData: Partial<Plant> = isBefore
      ? { ppmBeforeWatering: ppmVal }
      : { ppmAfterWatering: ppmVal };

    const loggedPlant = logPlantMetrics(
      { ...plant, ...updatedPlantData },
      {
        type: isBefore ? 'dry_check' : 'post_watering',
        ppmSubstrate: ppmVal,
        moistureSubstrate: editForm.moistureBeforeWatering ?? plant.moistureBeforeWatering ?? 25,
        notes: isBefore ? `Збережено PPM до поливу: ${ppmVal !== undefined ? ppmVal : 'невідомий'}` : `Збережено PPM: ${ppmVal !== undefined ? ppmVal : 'невідомий'}`,
        isPredicted: false,
        source: 'user'
      }
    );
    onUpdatePlant(loggedPlant);
    if (onAwardXP) onAwardXP(1, 'Збережено PPM');
    setSavedPpmFeedback(true);
    setTimeout(() => setSavedPpmFeedback(false), 2000);
  };

  const handleSavePostWateringMetrics = () => {
    const phVal = editForm.phAfterWatering ?? plant.phAfterWatering ?? (plant.medium === 'Soil' ? 6.5 : 5.8);
    const ppmVal = editForm.ppmAfterWatering ?? plant.ppmAfterWatering ?? (plant.stage === 'flowering' ? 950 : 600);
    const moistureVal = editForm.moistureAfterWatering ?? plant.moistureAfterWatering ?? 80;

    const updatedPlantData: Partial<Plant> = {
      phAfterWatering: phVal,
      ppmAfterWatering: ppmVal,
      moistureAfterWatering: moistureVal,
    };

    const loggedPlant = logPlantMetrics(
      { ...plant, ...updatedPlantData },
      {
        type: 'post_watering',
        phSubstrateAfter: phVal,
        ppmSubstrate: ppmVal,
        moistureSubstrate: moistureVal,
        notes: `Збережено показники після поливу: pH ${phVal.toFixed(1)}, PPM ${ppmVal}, Вологість ${moistureVal}%`,
        isPredicted: false,
        source: 'user'
      }
    );

    onUpdatePlant(loggedPlant);
    if (onAwardXP) onAwardXP(2, 'Збережено показники після поливу');
    setSavedPostWateringFeedback(true);
    setTimeout(() => setSavedPostWateringFeedback(false), 2000);
  };

  const handleSaveLight = () => {
    const points = editForm.ppfdPoints ?? {
      topLeft: Math.round((editForm.lightPPFD ?? 600) * 0.85),
      topRight: Math.round((editForm.lightPPFD ?? 600) * 0.85),
      center: editForm.lightPPFD ?? 600,
      bottomLeft: Math.round((editForm.lightPPFD ?? 600) * 0.85),
      bottomRight: Math.round((editForm.lightPPFD ?? 600) * 0.85)
    };
    const avgPpfd = Math.round(
      (points.topLeft + points.topRight + points.center + points.bottomLeft + points.bottomRight) / 5
    );
    const distance = editForm.lightDistanceCm ?? plant.lightDistanceCm ?? 25;

    const updatedPlantData: Partial<Plant> = {
      lightPPFD: avgPpfd,
      ppfdPoints: points,
      lightDistanceCm: distance
    };

    const loggedPlant = logPlantMetrics(
      { ...plant, ...updatedPlantData },
      {
        type: 'light_adjustment',
        ppfdTop: avgPpfd,
        notes: `Збережено параметри світла: Середній PPFD ${avgPpfd} мкмоль/м²/с (Центр: ${points.center}), Відстань до лампи: ${distance} см`,
        isPredicted: false,
        source: 'user'
      }
    );
    onUpdatePlant(loggedPlant);
    if (onAwardXP) onAwardXP(1, 'Збережено параметри освітлення');
    setSavedLightFeedback(true);
    setTimeout(() => setSavedLightFeedback(false), 2000);
  };

  const handleConfirmDryHarvest = (e: React.FormEvent) => {
    e.preventDefault();

    const trophy: HarvestTrophy = {
      id: `trophy-${Date.now()}`,
      plantId: plant.id,
      plantName: plant.name,
      strain: plant.strain,
      breeder: plant.breeder || 'Колекційний сорт',
      strainType: plant.strainType,
      harvestDate: new Date().toISOString().split('T')[0],
      totalDays: plant.stageDay + 40,
      totalYieldGrams: Number(harvestYieldGrams),
      rating: Number(harvestRating),
      trophyTitle: `🏆 Золота Шишка ${plant.strain}`,
      trophyLevel: harvestYieldGrams >= 100 ? 'Diamond' : harvestYieldGrams >= 70 ? 'Gold' : 'Silver',
      badgeIcon: 'Trophy',
      avatarUrl: getTrophyAvatarUrl({
        strain: plant.strain,
        strainType: plant.strainType,
        totalYieldGrams: Number(harvestYieldGrams),
        trophyLevel: harvestYieldGrams >= 100 ? 'Diamond' : harvestYieldGrams >= 70 ? 'Gold' : 'Silver'
      }),
      summaryNotes: harvestNotes,
      sharedToAccount: true,
      sharedAt: new Date().toISOString().split('T')[0],
      journalDaysCount: plant.growJournal?.length || 0
    };

    const updatedPlant: Plant = {
      ...plant,
      stage: 'harvested',
      isHarvested: true,
      harvestTrophy: trophy
    };

    onUpdatePlant(updatedPlant);
    if (onAwardTrophy) {
      onAwardTrophy(trophy);
    }

    try {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    } catch (err) {}

    setShowHarvestDryModal(false);
  };

  const isSubstrateConfirmed = Boolean(
    plant.substrateRecipe?.confirmed ||
    (typeof window !== 'undefined' && localStorage.getItem(`substrate_confirmed_${plant.id}`) === 'true')
  );

  const currentPotSize = plant.potSize || (plant.stage === 'germination' ? 1 : plant.stage === 'seedling' ? 3 : plant.stage === 'vegetative' ? 7 : 15);
  const isRepotStage = plant.stage === 'germination' || plant.stage === 'seedling' || plant.stage === 'vegetative';
  const hasTransplantedInStage =
    plant.lastTransplantedStage === plant.stage ||
    (typeof window !== 'undefined' && localStorage.getItem(`transplanted_${plant.id}_${plant.stage}`) === 'true');

  const showTransplantButton = !plant.isHarvested && isRepotStage && currentPotSize < 100 && !hasTransplantedInStage;

  const vpdStatus = calculateVPD(plant.currentTemp, plant.currentHumidity, plant.stage);

  const todayStr = new Date().toISOString().split('T')[0];
  const isPlantWateredToday = Boolean(plant.lastWatered && plant.lastWatered.startsWith(todayStr));

  const metricsAnalytics = getPlantMetricsAnalytics(plant);
  const daysSinceWatered = plant.lastWatered
    ? Math.max(0, Math.floor((Date.now() - new Date(plant.lastWatered).getTime()) / 86400000))
    : 0;

  // 1. Автоматичний прогноз та оновлення стану, якщо користувач не вносив замірів 1+ дн.
  const plantIdForForecast = plant?.id;
  const plantForecastDate = plant?.lastAutoForecastDate;
  useEffect(() => {
    if (!plant) return;
    const forecast = autoForecastPlantState(plant);
    if (forecast.updatedToday) {
      const timer = setTimeout(() => {
        onUpdatePlant(forecast.updatedPlant);
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantIdForForecast, plantForecastDate, onUpdatePlant]);

  // 2. Відрахування штрафу (-15 XP) за не виконане завдання догляду/поливу вчасно (2+ дн. без дій)
  const plantLastPenaltyDate = plant?.lastPenaltyDate;
  const plantMoistureBefore = plant?.moistureBeforeWatering;
  useEffect(() => {
    if (!plant || !onAwardXP) return;
    const today = new Date().toISOString().split('T')[0];
    if (daysSinceWatered >= 2 && (plantMoistureBefore ?? 25) <= 30 && plantLastPenaltyDate !== today) {
      const timer = setTimeout(() => {
        onAwardXP(-15, 'Штраф: Прострочено виконання дії з догляду/поливу (2+ дн. без дій)');
        onUpdatePlant({ ...plant, lastPenaltyDate: today });
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantIdForForecast, plantLastPenaltyDate, daysSinceWatered, plantMoistureBefore, onAwardXP, onUpdatePlant]);

  // Active current moisture reading using real-time estimate based on strain, stage, substrate and climate
  const liveMoisture = getEstimatedCurrentMoisture(plant);
  const vitality = calculatePlantVitalityAndHealth(plant);
  const currentMoisture = editForm.moistureBeforeWatering ?? plant.moistureBeforeWatering ?? liveMoisture;
  const currentPPM = editForm.ppmBeforeWatering ?? editForm.ppmAfterWatering ?? plant.ppmBeforeWatering ?? plant.ppmAfterWatering ?? 600;
  const rawPH = editForm.currentPH ?? editForm.phBeforeWatering ?? editForm.phAfterWatering ?? plant.currentPH ?? plant.phBeforeWatering ?? (plant.medium === 'Soil' ? 6.5 : 5.8);
  const currentPHDisplay = typeof rawPH === 'number' ? rawPH.toFixed(1) : rawPH;

  const isWateringNeeded = currentMoisture <= 30;

  const mediumLower = (plant.medium || '').toLowerCase();
  const isHydroOrCoco = mediumLower.includes('кокос') || mediumLower.includes('coco') || mediumLower.includes('гідро') || mediumLower.includes('hydro');
  const phTargetMin = isHydroOrCoco ? 5.5 : 6.0;
  const phTargetMax = isHydroOrCoco ? 6.2 : 6.8;
  const phTargetStr = `${phTargetMin.toFixed(1)}–${phTargetMax.toFixed(1)}`;
  const isPhOk = typeof rawPH === 'number' ? (rawPH >= phTargetMin && rawPH <= phTargetMax) : true;

  const ppmTargetBounds = plant.stage === 'germination' || plant.stage === 'seedling'
    ? { min: 200, max: 400, label: '200–400' }
    : plant.stage === 'vegetative'
    ? { min: 400, max: 800, label: '400–800' }
    : { min: 800, max: 1200, label: '800–1200' };
  const isPpmOk = currentPPM >= ppmTargetBounds.min && currentPPM <= ppmTargetBounds.max;

  const currentPpfd = editForm.lightPPFD || plant.lightPPFD || (plant.stage === 'flowering' ? 750 : plant.stage === 'vegetative' ? 550 : 250);
  const ppfdTargetBounds = plant.stage === 'germination' || plant.stage === 'seedling'
    ? { min: 100, max: 300, label: '100–300' }
    : plant.stage === 'vegetative'
    ? { min: 400, max: 600, label: '400–600' }
    : { min: 600, max: 1000, label: '600–1000' };
  const isPpfdOk = currentPpfd >= ppfdTargetBounds.min && currentPpfd <= ppfdTargetBounds.max;

  const activeWarnings = React.useMemo(() => {
    return getPlantActiveWarnings(plant, {
      moisture: currentMoisture,
      ph: typeof rawPH === 'number' ? rawPH : undefined,
      ppm: currentPPM,
      ppfd: currentPpfd,
      temp: plant.currentTemp,
      humidity: plant.currentHumidity,
    });
  }, [plant, currentMoisture, rawPH, currentPPM, currentPpfd]);

  const forecastYieldGrams = plant.harvestTrophy?.totalYieldGrams || (vitality.status === 'critical' ? 15 : vitality.status === 'dead' ? 0 : 85);

  const getAiControlActions = (): AiControlItem[] => {
    const items: AiControlItem[] = [];
    const currentTime = Date.now();

    const mediumLower = (plant.medium || '').toLowerCase();
    const phMinBound = mediumLower.includes('кокос') || mediumLower.includes('coco') ? 5.5 : mediumLower.includes('гідро') || mediumLower.includes('hydro') ? 5.5 : 6.0;
    const phMaxBound = mediumLower.includes('кокос') || mediumLower.includes('coco') ? 6.2 : mediumLower.includes('гідро') || mediumLower.includes('hydro') ? 6.0 : 6.8;

    const activePh = editForm.phBeforeWatering ?? plant.phBeforeWatering ?? plant.currentPH ?? 6.2;
    const activePpm = editForm.ppmBeforeWatering ?? plant.ppmBeforeWatering ?? plant.ppmAfterWatering;
    const targetPHStr = `${phMinBound.toFixed(1)}–${phMaxBound.toFixed(1)}`;
    const targetPHCenter = Number(((phMinBound + phMaxBound) / 2).toFixed(1));

    const targetPPMBounds = plant.stage === 'germination' || plant.stage === 'seedling'
      ? { min: 200, max: 400 }
      : plant.stage === 'vegetative'
      ? { min: 400, max: 800 }
      : { min: 800, max: 1200 };

    const activeMoisture = editForm.moistureBeforeWatering ?? plant.moistureBeforeWatering ?? 25;
    const storedPotSize = typeof window !== 'undefined' && plant?.id ? Number(localStorage.getItem(`plant_pot_size_${plant.id}`)) : undefined;
    const potSizeL = taskInputValues['action-water-clean-ppm']?.potSize ?? editForm.potSize ?? plant.potSize ?? (storedPotSize && !isNaN(storedPotSize) ? storedPotSize : 10);
    const potTypeStr = plant.potType === 'fabric'
      ? 'Текстильний горщик (SmartPot)'
      : plant.potType === 'airpot'
      ? 'Горщик AirPot'
      : 'Пластиковий горщик';

    // Calculated water requirement based on pot size (20% of pot volume)
    const calculatedWaterVol = Math.max(0.2, Number((potSizeL * 0.20).toFixed(1)));

    // Check if Card 0 (Routine Moisture Check) is completed in current 24h cycle
    const isMoistureCheckDoneToday = Boolean(
      completedTaskTimestamps['action-routine-moisture'] &&
      (currentTime - completedTaskTimestamps['action-routine-moisture'] < 24 * 60 * 60 * 1000)
    );

    // 1. Повсякденний контроль вологості субстрату (з'являється першим раз на добу)
    if (!isMoistureCheckDoneToday) {
      items.push({
        id: 'action-routine-moisture',
        title: 'Контроль вологості субстрату',
        description: `Зафіксуйте поточну вологість субстрату рослини (%) для визначення потреби у поливі чи просушуванні.\n💡 Оптимальний діапазон вологості: 31%–70%.\n\n⚠️ Нагадування: якщо показник не внести, система автоматично все прорахує. Проте якщо так часто робити, система не навчиться на реальних показниках і результат вирощування може не відповідати очікуванням.`,
        category: 'watering',
        categoryLabel: '💧 Вологість',
        badgeValue: `${activeMoisture}% Вологість`,
        intervalDays: 1,
        cadenceLabel: '📅 1 раз на 24 години',
        xpReward: 10,
        cardBg: 'bg-teal-50/90 hover:bg-teal-100/90 text-teal-950',
        badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
        borderClass: 'border-teal-300',
        textColor: 'text-teal-950',
        checkboxColor: 'text-teal-600',
        icon: <Droplets className="w-3.5 h-3.5 text-teal-600 shrink-0" />
      });
      return items;
    }

    // 2. ГІЛКА 2: Якщо вологість низька (<= 30%) — час поливу (покроковий ланцюжок 1 -> 7)
    if (activeMoisture <= 30) {
      if (
        (!completedTaskTimestamps['action-water-measure-before'] && !completedTaskTimestamps['action-water-ph-before']) ||
        (currentTime - (completedTaskTimestamps['action-water-measure-before'] || completedTaskTimestamps['action-water-ph-before'] || 0) >= 24 * 60 * 60 * 1000)
      ) {
        items.push({
          id: 'action-water-measure-before',
          title: 'PH-PPM до поливу',
          description: `Субстрат просох до ${activeMoisture}% (≤ 30%). Рослина готова до поливу.\n💡 Оптимальна норма: pH ${targetPHStr} (${plant.medium || 'Ґрунт'}), ціль PPM: ${targetPPMBounds.min}–${targetPPMBounds.max}.\n\n⚠️ Нагадування: якщо показник не внести, система автоматично все прорахує. Проте якщо так часто робити, система не навчиться на реальних показниках і результат вирощування може не відповідати очікуванням.`,
          category: 'ph',
          categoryLabel: '🧪 Замір до поливу',
          badgeValue: `Норма ${targetPHStr}`,
          xpReward: 15,
          cardBg: 'bg-purple-50/90 hover:bg-purple-100/90 text-purple-950',
          badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
          borderClass: 'border-purple-300',
          textColor: 'text-purple-950',
          checkboxColor: 'text-purple-600',
          icon: <FlaskConical className="w-3.5 h-3.5 text-purple-600 shrink-0" />
        });
        return items;
      }
      if (!completedTaskTimestamps['action-water-clean-ppm'] || (currentTime - completedTaskTimestamps['action-water-clean-ppm'] >= 24 * 60 * 60 * 1000)) {
        items.push({
          id: 'action-water-clean-ppm',
          title: '2. PPM чистої води & об\'єм горщика',
          description: `Крок 2: Вкажіть об'єм вашого горщика (${potSizeL} л) та перевірте PPM вихідної чистої води (0–150 PPM).\n\n💧 Розраховано об'єм поливу: ${calculatedWaterVol} л (для горщика ${potSizeL} л, субстрату ${plant.medium || 'Ґрунт'} та вологості ${activeMoisture}%).\n💾 Виставлений об'єм зберігається до наступного поливу та доступний для зміни при кожному поливі.\n\n⚠️ Нагадування: якщо показник не внести, система автоматично все прорахує. Проте якщо так часто робити, система не навчиться на реальних показниках і результат вирощування може не відповідати очікуванням.`,
          category: 'watering',
          categoryLabel: '💧 Чиста Вода & Об\'єм',
          badgeValue: `Горщик: ${potSizeL} л • Полив: ${calculatedWaterVol} л`,
          xpReward: 15,
          cardBg: 'bg-sky-50/90 hover:bg-sky-100/90 text-sky-950',
          badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
          borderClass: 'border-sky-300',
          textColor: 'text-sky-950',
          checkboxColor: 'text-sky-600',
          icon: <Droplets className="w-3.5 h-3.5 text-teal-600 shrink-0" />
        });
        return items;
      }
      if (!completedTaskTimestamps['action-water-solution-prep'] || (currentTime - completedTaskTimestamps['action-water-solution-prep'] >= 24 * 60 * 60 * 1000)) {
        items.push({
          id: 'action-water-solution-prep',
          title: '3. Розчин для поливу',
          description: `Крок 3: Розрахуйте та приготуйте розчин під ${calculatedWaterVol} л води. Відкрийте [РОЗЧИН] для перегляду та фіксації точних пропорцій добрив.`,
          category: 'nutrients',
          categoryLabel: '🧪 Розрахунок Розчину',
          badgeValue: `Розчин ${calculatedWaterVol} л`,
          xpReward: 20,
          cardBg: 'bg-emerald-50/90 hover:bg-emerald-100/90 text-emerald-950',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          borderClass: 'border-emerald-300',
          textColor: 'text-emerald-950',
          checkboxColor: 'text-emerald-600',
          icon: <FlaskConical className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        });
        return items;
      }
      if (!completedTaskTimestamps['action-water-ph-solution'] || (currentTime - completedTaskTimestamps['action-water-ph-solution'] >= 24 * 60 * 60 * 1000)) {
        items.push({
          id: 'action-water-ph-solution',
          title: '4. pH розчину для поливу',
          description: `Крок 4: Відкоригуйте pH готового компоту (${plant.medium === 'Soil' ? '6.2–6.5' : '5.8–6.0'} pH).\n💡 Якщо pH більше норми: додайте розчин pH Down по 0.5 мл/л.\n💡 Якщо pH менше норми: додайте розчин pH Up по 0.5 мл/л.\n\n⚠️ Нагадування: якщо показник не внести, система автоматично все прорахує. Проте якщо так часто робити, система не навчиться на реальних показниках і результат вирощування може не відповідати очікуванням.`,
          category: 'ph',
          categoryLabel: '🧪 pH Розчину',
          badgeValue: `Ціль ${plant.medium === 'Soil' ? '6.3' : '5.9'} pH`,
          xpReward: 15,
          cardBg: 'bg-purple-50/90 hover:bg-purple-100/90 text-purple-950',
          badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
          borderClass: 'border-purple-300',
          textColor: 'text-purple-950',
          checkboxColor: 'text-purple-600',
          icon: <FlaskConical className="w-3.5 h-3.5 text-purple-600 shrink-0" />
        });
        return items;
      }
      if (!completedTaskTimestamps['action-water-applied'] || (currentTime - completedTaskTimestamps['action-water-applied'] >= 24 * 60 * 60 * 1000)) {
        items.push({
          id: 'action-water-applied',
          title: '5. Розчин приготовано - рослина полита',
          description: `Крок 5: Повільно пролийте субстрат готовим розчином по периметру горщика з виходом 10–20% дренажу знизу.\nПідтвердіть проведення поливу.`,
          category: 'watering',
          categoryLabel: '💧 Полив Виконано',
          badgeValue: 'Полив ✓',
          xpReward: 20,
          cardBg: 'bg-emerald-50/90 hover:bg-emerald-100/90 text-emerald-950',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          borderClass: 'border-emerald-300',
          textColor: 'text-emerald-950',
          checkboxColor: 'text-emerald-600',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        });
        return items;
      }
      if (
        (!completedTaskTimestamps['action-water-drainage-after'] && !completedTaskTimestamps['action-water-ppm-after']) ||
        (currentTime - (completedTaskTimestamps['action-water-drainage-after'] || completedTaskTimestamps['action-water-ppm-after'] || 0) >= 24 * 60 * 60 * 1000)
      ) {
        items.push({
          id: 'action-water-drainage-after',
          title: '6. Контроль виходу (Дренаж): PPM та pH дренажу',
          description: `Крок 6: Виміряйте та внесіть PPM та pH вихідного дренажу після поливу.\n💡 Оптимальний PPM дренажу: ${targetPPMBounds.min}–${targetPPMBounds.max} PPM. Якщо PPM вище норми — ризик засолу субстрату!\n\n⚠️ Нагадування: якщо показник не внести, система автоматично все прорахує. Проте якщо так часто робити, система не навчиться на реальних показниках і результат вирощування може не відповідати очікуванням.`,
          category: 'nutrients',
          categoryLabel: '⚡ PPM & pH Дренажу',
          badgeValue: `Ціль ${targetPPMBounds.min}–${targetPPMBounds.max}`,
          xpReward: 20,
          cardBg: 'bg-amber-50/90 hover:bg-amber-100/90 text-amber-950',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          borderClass: 'border-amber-300',
          textColor: 'text-amber-950',
          checkboxColor: 'text-amber-600',
          icon: <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        });
        return items;
      }
      if (!completedTaskTimestamps['action-water-moisture-after'] || (currentTime - completedTaskTimestamps['action-water-moisture-after'] >= 24 * 60 * 60 * 1000)) {
        items.push({
          id: 'action-water-moisture-after',
          title: '7. Підсумкова вологість субстрату після поливу',
          description: `Крок 7: Зафіксуйте підсумкову вологість субстрату після поливу (цільовий діапазон: 70%–80%).\nПолив буде повністю завершено та зафіксовано в журналі.\n\n⚠️ Нагадування: якщо показник не внести, система автоматично все прорахує. Проте якщо так часто робити, система не навчиться на реальних показниках і результат вирощування може не відповідати очікуванням.`,
          category: 'watering',
          categoryLabel: '💧 Вологість Після Поливу',
          badgeValue: 'Оптимум 70%–80%',
          xpReward: 15,
          cardBg: 'bg-teal-50/90 hover:bg-teal-100/90 text-teal-950',
          badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
          borderClass: 'border-teal-300',
          textColor: 'text-teal-950',
          checkboxColor: 'text-teal-600',
          icon: <Droplets className="w-3.5 h-3.5 text-teal-600 shrink-0" />
        });
        return items;
      }
    }

    // 3. ГІЛКА 3: Вологість занадто висока (> 80%) — просушування
    if (activeMoisture > 80 && (!completedTaskTimestamps['action-overwater-dry'] || (currentTime - completedTaskTimestamps['action-overwater-dry'] >= 24 * 60 * 60 * 1000))) {
      items.push({
        id: 'action-overwater-dry',
        title: 'Потрібно просушити субстрат (Ризик переливу)',
        description: `Вологість субстрату занадто висока: ${activeMoisture}% (>80%).\n\n📌 Регламент просушування (${potTypeStr}, ${potSizeL} л):\n1. Полив суворо заборонено на наступні 2–3 дні.\n2. Направте вентилятор обдуву на нижню частину горщика.\n3. Злийте застійну воду з піддона.`,
        category: 'watering',
        categoryLabel: '🚨 Просушування',
        badgeValue: `${activeMoisture}% > 80%`,
        xpReward: 20,
        cardBg: 'bg-rose-50/90 hover:bg-rose-100/90 text-rose-950',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
        borderClass: 'border-rose-300',
        textColor: 'text-rose-950',
        checkboxColor: 'text-rose-600',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
      });
      return items;
    }

    // 4. ГІЛКА 1: Вологість в нормі (31%–70%) або полив успішно завершено: плановий догляд
    // 4.1. Крок 1 (Мікроклімат): t° та вологість повітря
    if (!completedTaskTimestamps['action-routine-climate'] || (currentTime - completedTaskTimestamps['action-routine-climate'] >= 24 * 60 * 60 * 1000)) {
      items.push({
        id: 'action-routine-climate',
        title: '1. Контроль мікроклімату боксу (t°, RH, VPD)',
        description: `Субстрат у нормі (${activeMoisture}%). Перевір температуру та вологість повітря в боксі.\nПоказники автоматично розрахують VPD для поточної фази росту "${stageLabelUk(plant.stage)}".\n\n⚠️ Нагадування: якщо показник не внести, система автоматично все прорахує. Проте якщо так часто робити, система не навчиться на реальних показниках і результат вирощування може не відповідати очікуванням.`,
        category: 'climate',
        categoryLabel: '🌡️ Клімат & Обдув',
        badgeValue: `${plant.currentTemp}°C / ${plant.currentHumidity}%`,
        intervalDays: 1,
        cadenceLabel: '📅 Повтор через 1 добу',
        xpReward: 10,
        cardBg: 'bg-orange-50/90 hover:bg-orange-100/90 text-orange-950',
        badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
        borderClass: 'border-orange-300',
        textColor: 'text-orange-950',
        checkboxColor: 'text-orange-600',
        icon: <Thermometer className="w-3.5 h-3.5 text-orange-600 shrink-0" />
      });
      return items;
    }

    // 4.2. Крок 2 (Світло): Точки вимірювання PPFD над верхівкою
    if (!completedTaskTimestamps['action-routine-light'] || (currentTime - completedTaskTimestamps['action-routine-light'] >= 3 * 24 * 60 * 60 * 1000)) {
      items.push({
        id: 'action-routine-light',
        title: '2. Точки вимірювання PPFD над верхівкою',
        description: `Перевірте рівень освітленості (PPFD) над верхівкою та по кутах крони, а також відстань до світильника.\n💡 Норма PPFD для фази "${stageLabelUk(plant.stage)}": ${ppfdTargetBounds.min}–${ppfdTargetBounds.max} мкмоль.\n\n⚠️ Нагадування: якщо показник не внести, система автоматично все прорахує. Проте якщо так часто робити, система не навчиться на реальних показниках і результат вирощування може не відповідати очікуванням.`,
        category: 'light',
        categoryLabel: '☀️ Світло & PPFD',
        badgeValue: `${plant.lightPPFD || 520} PPFD`,
        intervalDays: 3,
        cadenceLabel: '📅 Повтор через 3 дні',
        xpReward: 10,
        cardBg: 'bg-yellow-50/90 hover:bg-yellow-100/90 text-yellow-950',
        badgeBg: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        borderClass: 'border-yellow-300',
        textColor: 'text-yellow-950',
        checkboxColor: 'text-yellow-600',
        icon: <Sun className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
      });
      return items;
    }

    // 4.3. Крок 3 (Огляд/Тренування за фазою): як AI лікар рослин
    if (!completedTaskTimestamps['action-routine-inspection'] || (currentTime - completedTaskTimestamps['action-routine-inspection'] >= 3 * 24 * 60 * 60 * 1000)) {
      items.push({
        id: 'action-routine-inspection',
        title: '3. Огляд крони: AI Лікар рослин & Тренування',
        description: `Огляньте стан листя та верхівок. За потреби скористайтеся AI Лікарем для фотодіагностики або проведіть тренування LST (підгинання бічних пагонів).`,
        category: 'inspection',
        categoryLabel: '🔍 Огляд Крони',
        badgeValue: 'Здоров’я',
        intervalDays: 3,
        cadenceLabel: '📅 Повтор через 3 дні',
        xpReward: 10,
        cardBg: 'bg-emerald-50/90 hover:bg-emerald-100/90 text-emerald-950',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        borderClass: 'border-emerald-300',
        textColor: 'text-emerald-950',
        checkboxColor: 'text-emerald-600',
        icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      });
      return items;
    }

    // 5. РЕАКЦІЯ НА АНОМАЛІЇ (Позачергові задачі)
    // 5.1. Засол (PPM дренажу або субстрату > 1400)
    if (
      (plant.ppmAfterWatering && plant.ppmAfterWatering > 1400) &&
      (!completedTaskTimestamps['action-ppm-high-auto'] || (currentTime - completedTaskTimestamps['action-ppm-high-auto'] >= 24 * 60 * 60 * 1000))
    ) {
      items.push({
        id: 'action-ppm-high-auto',
        title: '🚨 Засол субстрату! Наступний полив — промивка чистою водою',
        description: `PPM вихідного дренажу занадто високий (${plant.ppmAfterWatering} PPM > ${targetPPMBounds.max} PPM). У субстраті накопичилися баластні солі. Наступний полив проведіть виключно чистою водою з відкоригованим pH без добрив.`,
        category: 'nutrients',
        categoryLabel: '🚨 Засол Субстрату',
        badgeValue: `${plant.ppmAfterWatering} PPM`,
        xpReward: 20,
        cardBg: 'bg-rose-50/90 hover:bg-rose-100/90 text-rose-950',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
        borderClass: 'border-rose-300',
        textColor: 'text-rose-950',
        checkboxColor: 'text-rose-600',
        icon: <Zap className="w-3.5 h-3.5 text-rose-600 shrink-0" />
      });
      return items;
    }

    // 5.2. Відхилення pH (< 5.5 або > 7.0)
    if (
      activePh < 5.5 &&
      (!completedTaskTimestamps['action-ph-low-auto'] || (currentTime - completedTaskTimestamps['action-ph-low-auto'] >= 24 * 60 * 60 * 1000))
    ) {
      items.push({
        id: 'action-ph-low-auto',
        title: '⚠️ Кислий субстрат (pH < 5.5)! Потрібно підвищити pH',
        description: `pH субстрату занадто низький (${activePh.toFixed(1)} < 5.5). Це блокує засвоєння фосфору та кальцію. Додайте pH Up до поливної води для вирівнювання кислотності до норми ${targetPHStr}.`,
        category: 'ph',
        categoryLabel: '🧪 Низький pH',
        badgeValue: `pH ${activePh.toFixed(1)}`,
        xpReward: 15,
        cardBg: 'bg-purple-50/90 hover:bg-purple-100/90 text-purple-950',
        badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
        borderClass: 'border-purple-300',
        textColor: 'text-purple-950',
        checkboxColor: 'text-purple-600',
        icon: <FlaskConical className="w-3.5 h-3.5 text-purple-600 shrink-0" />
      });
      return items;
    }

    if (
      activePh > 7.0 &&
      (!completedTaskTimestamps['action-ph-high-auto'] || (currentTime - completedTaskTimestamps['action-ph-high-auto'] >= 24 * 60 * 60 * 1000))
    ) {
      items.push({
        id: 'action-ph-high-auto',
        title: '⚠️ Лужний субстрат (pH > 7.0)! Потрібно знизити pH',
        description: `pH субстрату занадто високий (${activePh.toFixed(1)} > 7.0). Це блокує засвоєння заліза та мікроелементів. Додайте pH Down до поливної води для вирівнювання кислотності до норми ${targetPHStr}.`,
        category: 'ph',
        categoryLabel: '🧪 Високий pH',
        badgeValue: `pH ${activePh.toFixed(1)}`,
        xpReward: 15,
        cardBg: 'bg-purple-50/90 hover:bg-purple-100/90 text-purple-950',
        badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
        borderClass: 'border-purple-300',
        textColor: 'text-purple-950',
        checkboxColor: 'text-purple-600',
        icon: <FlaskConical className="w-3.5 h-3.5 text-purple-600 shrink-0" />
      });
      return items;
    }

    // 5.3. Додаткові завдання календаря / нагадувань
    if (tasks && tasks.length > 0) {
      const pendingTask = tasks.find(t => !t.completed && (!t.plantId || t.plantId === plant.id));
      if (pendingTask && (!completedTaskTimestamps[pendingTask.id] || (currentTime - completedTaskTimestamps[pendingTask.id] >= 24 * 60 * 60 * 1000))) {
        items.push({
          id: pendingTask.id,
          title: pendingTask.title,
          description: pendingTask.description || `Завдання за розкладом для рослини "${plant.name}".`,
          category: pendingTask.category as any,
          categoryLabel: pendingTask.category === 'watering' ? '💧 Полив' : pendingTask.category === 'nutrients' ? '⚡ Живлення' : '📋 Догляд',
          badgeValue: 'Календар',
          xpReward: pendingTask.xpReward || 15,
          cardBg: 'bg-sky-50/90 hover:bg-sky-100/90 text-sky-950',
          badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
          borderClass: 'border-sky-300',
          textColor: 'text-sky-950',
          checkboxColor: 'text-sky-600',
          icon: <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
        });
        return items;
      }
    }

    return items;
  };

  const handleToggleAction = (action: AiControlItem) => {
    const actionTime = Date.now();
    const idsToComplete = [action.id, ...(action.subActionIds || [])];

    setCompletedAiControlActions(prev => {
      const next = { ...prev };
      idsToComplete.forEach(id => {
        next[id] = true;
      });
      return next;
    });

    setCompletedTaskTimestamps(prev => {
      const next = { ...prev };
      idsToComplete.forEach(id => {
        next[id] = actionTime;
      });
      if (typeof window !== 'undefined' && plant?.id) {
        try {
          localStorage.setItem(`ai_control_timestamps_${plant.id}`, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    if (onCompleteTask) {
      onCompleteTask(action.id, action.xpReward);
    }

    const noticeText = `+${action.xpReward} XP: "${action.title}" виконано!`;

    setLastRewardNotice(noticeText);
    setTimeout(() => {
      setLastRewardNotice(null);
    }, 3800);
  };

  const handleToggleActionWithData = (action: AiControlItem) => {
    const taskVals = taskInputValues[action.id] || {};
    let updatedFields: Partial<Plant> = {};
    let metricType: MetricEntryType = 'dry_check';

    // 1. Direct harvesting from taskVals if user touched sliders/inputs
    if (taskVals.moisture !== undefined) {
      updatedFields.moistureBeforeWatering = taskVals.moisture;
      updatedFields.moistureAfterWatering = taskVals.moisture;
    }
    if (taskVals.ph !== undefined) {
      updatedFields.phBeforeWatering = taskVals.ph;
      updatedFields.phAfterWatering = taskVals.ph;
      updatedFields.currentPH = taskVals.ph;
    }
    if (taskVals.ppm !== undefined) {
      updatedFields.ppmBeforeWatering = taskVals.ppm;
      updatedFields.ppmAfterWatering = taskVals.ppm;
      updatedFields.currentEC = Number((taskVals.ppm / 500).toFixed(1));
    }
    if (taskVals.temp !== undefined) {
      updatedFields.currentTemp = taskVals.temp;
    }
    if (taskVals.humidity !== undefined) {
      updatedFields.currentHumidity = taskVals.humidity;
    }
    if (taskVals.lightDistance !== undefined) {
      updatedFields.lightDistanceCm = taskVals.lightDistance;
    }
    if (taskVals.ppfd !== undefined) {
      updatedFields.lightPPFD = taskVals.ppfd;
    }
    if (taskVals.cleanWaterPpm !== undefined || taskVals.waterPpm !== undefined) {
      const wPpm = taskVals.cleanWaterPpm ?? taskVals.waterPpm;
      updatedFields.cleanWaterPPM = wPpm;
      setCleanWaterPpm(wPpm);
    }
    if (taskVals.waterPh !== undefined) {
      updatedFields.phBeforeWatering = taskVals.waterPh;
    }
    if (taskVals.potSize !== undefined) {
      updatedFields.potSize = taskVals.potSize;
      if (typeof window !== 'undefined' && plant?.id) {
        try {
          localStorage.setItem(`plant_pot_size_${plant.id}`, String(taskVals.potSize));
        } catch (e) {}
      }
    }

    const titleLower = (action.title || '').toLowerCase();

    // 2. Action ID, category & title fallback checks if taskVals fields were not explicitly moved
    // Moisture / Watering
    if (
      action.id === 'action-routine-moisture' ||
      action.id === 'action-water-soon-warning' ||
      action.id === 'action-overwater-dry' ||
      action.id === 'action-overwater-combined' ||
      action.id === 'action-water-moisture-after' ||
      action.category === 'watering' ||
      titleLower.includes('волог') ||
      titleLower.includes('просушити')
    ) {
      if (updatedFields.moistureBeforeWatering === undefined) {
        const moistureVal = action.id === 'action-water-moisture-after'
          ? (editForm.moistureAfterWatering ?? plant.moistureAfterWatering ?? 80)
          : (editForm.moistureBeforeWatering ?? plant.moistureBeforeWatering ?? 25);
        updatedFields.moistureBeforeWatering = moistureVal;
        updatedFields.moistureAfterWatering = moistureVal;
      }
      if (action.id === 'action-water-moisture-after') {
        metricType = 'post_watering';
      }
    }

    // pH Controls
    if (
      action.id === 'action-routine-ph' ||
      action.id === 'action-ph-low-auto' ||
      action.id === 'action-ph-high-auto' ||
      action.id === 'action-water-measure-before' ||
      action.id === 'action-water-ph-before' ||
      action.id === 'action-water-ph-solution' ||
      action.category === 'ph' ||
      titleLower.includes('ph')
    ) {
      if (updatedFields.currentPH === undefined) {
        const phVal = editForm.phAfterWatering ?? plant.phAfterWatering ?? editForm.phBeforeWatering ?? plant.phBeforeWatering ?? plant.currentPH ?? 6.2;
        updatedFields.phBeforeWatering = phVal;
        updatedFields.phAfterWatering = phVal;
        updatedFields.currentPH = phVal;
      }
    }

    // PPM / Nutrients Controls
    if (
      action.id === 'action-routine-ppm' ||
      action.id === 'action-ppm-high-auto' ||
      action.id === 'action-ppm-low-auto' ||
      action.id === 'action-water-measure-before' ||
      action.id === 'action-water-ppm-before' ||
      action.id === 'action-water-ppm-after' ||
      action.category === 'nutrients' ||
      titleLower.includes('ppm') ||
      titleLower.includes('добрив')
    ) {
      if (updatedFields.ppmAfterWatering === undefined) {
        const ppmVal = editForm.ppmAfterWatering ?? plant.ppmAfterWatering ?? editForm.ppmBeforeWatering ?? plant.ppmBeforeWatering ?? 650;
        updatedFields.ppmBeforeWatering = ppmVal;
        updatedFields.ppmAfterWatering = ppmVal;
        updatedFields.currentEC = Number((ppmVal / 500).toFixed(1));
      }
      if (action.id === 'action-water-ppm-after') {
        metricType = 'post_watering';
      }
    }

    // Clean Water PPM / Water pH / Pot Size
    if (
      action.id === 'action-water-clean-ppm' ||
      action.id === 'action-clean-water-ppm-high' ||
      action.id === 'action-water-ph' ||
      titleLower.includes('чистої води') ||
      titleLower.includes('якість')
    ) {
      if (updatedFields.cleanWaterPPM === undefined) {
        const waterPpmVal = editForm.cleanWaterPPM ?? plant.cleanWaterPPM ?? cleanWaterPpm ?? 100;
        setCleanWaterPpm(waterPpmVal);
        updatedFields.cleanWaterPPM = waterPpmVal;
      }
      if (updatedFields.potSize === undefined) {
        const stored = typeof window !== 'undefined' && plant?.id ? Number(localStorage.getItem(`plant_pot_size_${plant.id}`)) : undefined;
        const finalPot = taskVals.potSize ?? editForm.potSize ?? plant.potSize ?? (stored && !isNaN(stored) ? stored : 10);
        updatedFields.potSize = finalPot;
        if (typeof window !== 'undefined' && plant?.id) {
          try {
            localStorage.setItem(`plant_pot_size_${plant.id}`, String(finalPot));
          } catch (e) {}
        }
      }
    }

    // Solution Prep
    if (action.id === 'action-water-solution-prep') {
      const storedPot = typeof window !== 'undefined' && plant?.id ? Number(localStorage.getItem(`plant_pot_size_${plant.id}`)) : undefined;
      const activePot = taskInputValues['action-water-clean-ppm']?.potSize ?? editForm.potSize ?? plant.potSize ?? (storedPot && !isNaN(storedPot) ? storedPot : 10);
      const calcVol = Math.max(0.2, Number((activePot * 0.20).toFixed(1)));
      setSolutionVolume(calcVol);
      const solutionData = plant.approvedSolution ? {
        ...plant.approvedSolution,
        volume: calcVol
      } : {
        volume: calcVol,
        targetPpm: targetPpm,
        cleanWaterPpm: cleanWaterPpm,
        approvedAt: new Date().toISOString(),
        items: []
      };
      updatedFields.cleanWaterPPM = cleanWaterPpm;
      updatedFields.approvedSolution = solutionData;
      setIsPostWateringModalOpen(true);
    }

    // Water applied / execute
    if (action.id === 'action-water-applied' || action.id === 'action-water-execute') {
      const wateredMoisture = taskVals.moisture ?? 80;
      updatedFields.lastWatered = new Date().toISOString().split('T')[0];
      updatedFields.moistureBeforeWatering = wateredMoisture;
      updatedFields.moistureAfterWatering = wateredMoisture;
      updatedFields.cleanWaterPPM = cleanWaterPpm;
      metricType = 'post_watering';
    }

    // Lighting Controls
    if (
      action.id === 'action-routine-light' ||
      action.category === 'light' ||
      titleLower.includes('ламп') ||
      titleLower.includes('відстань') ||
      titleLower.includes('світло') ||
      titleLower.includes('ppfd')
    ) {
      if (updatedFields.lightDistanceCm === undefined) {
        updatedFields.lightDistanceCm = editForm.lightDistanceCm ?? plant.lightDistanceCm ?? 45;
      }
      if (updatedFields.lightPPFD === undefined) {
        updatedFields.lightPPFD = editForm.lightPPFD ?? plant.lightPPFD ?? 520;
      }
    }

    // Microclimate Controls
    if (
      action.id === 'action-routine-climate' ||
      action.category === 'climate' ||
      (action as any).category === 'environment' ||
      titleLower.includes('мікроклімат') ||
      titleLower.includes('клімат') ||
      titleLower.includes('температур') ||
      titleLower.includes('t°')
    ) {
      if (updatedFields.currentTemp === undefined) {
        updatedFields.currentTemp = editForm.currentTemp ?? plant.currentTemp ?? 24;
      }
      if (updatedFields.currentHumidity === undefined) {
        updatedFields.currentHumidity = editForm.currentHumidity ?? plant.currentHumidity ?? 50;
      }
    }

    if (Object.keys(updatedFields).length > 0) {
      setEditForm(prev => ({
        ...prev,
        ...updatedFields
      }));

      const updatedPlant: Plant = {
        ...plant,
        ...editForm,
        ...updatedFields
      };

      const loggedPlant = logPlantMetrics(
        updatedPlant,
        {
          type: metricType,
          moistureSubstrate: updatedFields.moistureBeforeWatering ?? plant.moistureBeforeWatering ?? 25,
          phSubstrateBefore: updatedFields.phBeforeWatering ?? plant.phBeforeWatering ?? plant.currentPH,
          phSubstrateAfter: updatedFields.phAfterWatering ?? plant.phAfterWatering ?? plant.currentPH,
          ppmSubstrate: updatedFields.ppmAfterWatering ?? updatedFields.ppmBeforeWatering ?? plant.ppmAfterWatering ?? plant.ppmBeforeWatering ?? 650,
          ppfdTop: updatedFields.lightPPFD ?? plant.lightPPFD ?? 520,
          tempC: updatedFields.currentTemp ?? plant.currentTemp ?? 24,
          humidityRH: updatedFields.currentHumidity ?? plant.currentHumidity ?? 50,
          notes: `Фіксація вимірів через AI Контроль дій: "${action.title}"`,
          isPredicted: false,
          source: 'user'
        }
      );

      onUpdatePlant(loggedPlant);
    }

    handleToggleAction(action);
  };

  const handleOpenSolutionModal = useCallback(() => {
    setIsSolutionModalOpen(true);
  }, []);

  const renderTaskMeasurementControls = (item: AiControlItem) => (
    <div className="relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.12),inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.05)] p-3.5 sm:p-4 text-[#18181b] transition-all">
      {/* Specular frosted mirror reflection sheen */}
      <div className="pointer-events-none absolute -top-12 -left-12 w-40 h-40 bg-gradient-to-br from-white/70 to-transparent rounded-full blur-xl opacity-60" />
      <div className="relative z-10">
        <TaskMeasurementControls
          item={item}
          taskInputValues={taskInputValues}
          plant={plant}
          cleanWaterPpm={cleanWaterPpm}
          onInputChange={handleTaskInputChange}
          onOpenSolutionModal={handleOpenSolutionModal}
          onOpenDoctor={onOpenDoctorWithPlant}
          onAddTask={onAddTask}
          onAwardXP={onAwardXP}
          solutionVolume={solutionVolume}
          onVolumeChange={setSolutionVolume}
          targetPpm={targetPpm}
          onTargetPpmChange={setTargetPpm}
          onApproveSolution={handleApproveSolution}
        />
      </div>
    </div>
  );

  const renderTaskCardContent = (item: AiControlItem, idx: number, cardBgClass: string, textDarkClass: string = "text-[#18181b]") => (
    <div className="w-full flex flex-col gap-2">
      {/* Header: Title + XP on top, Badges below */}
      <div className="w-full flex flex-col gap-1.5">
        <div className="w-full flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleActionWithData(item);
            }}
            className="flex items-start gap-2 flex-1 min-w-0 text-left cursor-pointer group"
          >
            <div className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">
              <Square className={`w-4 h-4 ${item.checkboxColor}`} />
            </div>
            <span className={`font-black text-xs sm:text-sm ${textDarkClass} leading-snug`}>
              {idx + 1}. {item.title}
            </span>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-black text-emerald-950 bg-emerald-200 px-2 py-0.5 rounded-md border border-emerald-400/80 shadow-2xs">
              +{item.xpReward} XP
            </span>
          </div>
        </div>

        {/* Indented Badges Row */}
        <div className="flex items-center gap-1.5 pl-6 flex-wrap">
          <span className="text-[10px] font-black px-2 py-0.5 rounded-md border flex items-center gap-1 bg-[#18181b] text-white shadow-2xs">
            {item.icon}
            <span>{item.categoryLabel}</span>
          </span>
          {daysSinceWatered >= 2 && item.category === 'watering' && (
            <span className="text-[10px] font-extrabold text-rose-950 bg-rose-200 border border-rose-400 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse shadow-2xs">
              🚨 -15 XP Штраф
            </span>
          )}
        </div>
      </div>

      {/* Full width description paragraph */}
      {item.description && item.description.trim() !== '' && (
        <p className={`w-full text-[11.5px] ${textDarkClass} font-semibold leading-relaxed pl-6 border-t border-black/10 pt-1.5 mt-0.5 whitespace-pre-line`}>
          {item.description}
        </p>
      )}

      {/* Sub-tasks list window if combined task */}
      {item.subTasks && item.subTasks.length > 0 && (
        <div className="pl-6 pt-2 pb-1 space-y-1.5 border-t border-black/10 mt-1">
          <div className="text-[11px] font-black text-[#18181b] flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-black shrink-0" />
            <span>Кроки комплексного виконання (під-завдання):</span>
          </div>
          <div className="space-y-1.5">
            {item.subTasks.map((sub, sIdx) => (
              <div
                key={sIdx}
                className="flex items-start gap-2 text-[11px] font-bold text-neutral-900 bg-white/90 p-2 rounded-lg border border-black/10 shadow-2xs"
              >
                <span className="shrink-0 w-4 h-4 rounded-full bg-black text-white font-black text-[10px] flex items-center justify-center">
                  {sIdx + 1}
                </span>
                <span className="leading-snug pt-0.5">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive measurement sliders */}
      {renderTaskMeasurementControls(item)}

      {/* Confirmation action button */}
      <div className="pt-2 w-full flex justify-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleActionWithData(item);
          }}
          className="w-full bg-[#18181b] hover:bg-black active:scale-[0.98] text-white font-black text-xs sm:text-sm py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-black"
        >
          <CheckCircle2 className="w-4 h-4 text-[#d8f087] shrink-0" />
          <span>Підтвердити та зберегти виміри (+{item.xpReward} XP)</span>
        </button>
      </div>
    </div>
  );

  const allAiActions = getAiControlActions();
  const activeAiActions = allAiActions.filter(item => !completedAiControlActions[item.id]);

  const expandDataRef = useRef({ getAiControlActions, completedAiControlActions, scrollToTask });
  useEffect(() => {
    expandDataRef.current = { getAiControlActions, completedAiControlActions, scrollToTask };
  });

  // Expand metrics/tasks and scroll into view directly to the task card when navigating from alerts/calendar
  useEffect(() => {
    const handleExpandEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ plantId: string; alertType?: string; taskId?: string }>;
      if (customEvent.detail?.plantId === plant.id) {
        setIsQuickMetricsExpanded(true);

        const targetTaskId = customEvent.detail?.taskId;
        const alertType = customEvent.detail?.alertType;

        const currentAiActions = expandDataRef.current.getAiControlActions().filter(
          item => !expandDataRef.current.completedAiControlActions[item.id]
        );

        let targetIndex = -1;
        if (targetTaskId) {
          targetIndex = currentAiActions.findIndex(
            (item) => item.id === targetTaskId || item.id === `task-${targetTaskId}` || targetTaskId.includes(item.id)
          );
        }

        if (targetIndex === -1 && alertType) {
          if (alertType === 'moisture' || alertType === 'watering') {
            targetIndex = currentAiActions.findIndex((item) =>
              item.id.includes('moisture') || item.id.includes('water') || item.category === 'watering'
            );
          } else if (alertType === 'ph') {
            targetIndex = currentAiActions.findIndex((item) =>
              item.id.includes('ph') || item.category === 'ph'
            );
          } else if (alertType === 'ppm') {
            targetIndex = currentAiActions.findIndex((item) =>
              item.id.includes('ppm') || item.category === 'nutrients'
            );
          } else if (alertType === 'climate') {
            targetIndex = currentAiActions.findIndex((item) =>
              item.id.includes('climate') || item.category === 'climate'
            );
          }
        }

        const resolvedIndex = targetIndex !== -1 ? targetIndex : 0;
        const matchedItem = currentAiActions[resolvedIndex];
        const matchedId = matchedItem?.id || targetTaskId;

        if (matchedId) {
          setHighlightedTaskId(matchedId);
          setTimeout(() => {
            setHighlightedTaskId(null);
          }, 3000);
        }

        const performDirectTaskScroll = () => {
          // 1. Horizontally scroll carousel to the specific task card
          expandDataRef.current.scrollToTask(resolvedIndex);

          // 2. Vertically scroll window directly to the task card element
          let targetEl: HTMLElement | null = null;
          if (matchedId) {
            targetEl = document.getElementById(`plant-${plant.id}-task-card-${matchedId}`);
          }
          if (!targetEl) {
            targetEl = document.getElementById(`plant-${plant.id}-task-section`);
          }
          if (!targetEl) {
            targetEl = document.getElementById(`plant-${plant.id}-task-carousel`);
          }
          if (!targetEl) {
            targetEl = document.getElementById(`plant-card-${plant.id}`);
          }

          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        };

        // Trigger scroll immediately and with staggered delays as accordion animation expands
        setTimeout(performDirectTaskScroll, 60);
        setTimeout(performDirectTaskScroll, 180);
        setTimeout(performDirectTaskScroll, 350);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('select-plant-and-expand', handleExpandEvent);
      return () => {
        window.removeEventListener('select-plant-and-expand', handleExpandEvent);
      };
    }
  }, [plant.id]);

  const handleSave = () => {
    const activeMoisture = editForm.moistureBeforeWatering ?? plant.moistureBeforeWatering ?? 25;
    const postMoisture = editForm.moistureAfterWatering ?? 80;

    const isPostWatering = showAfterWateringParams;
    const moistureVal = isPostWatering ? postMoisture : activeMoisture;

    const plantToLog: Plant = {
      ...plant,
      ...editForm,
      moistureBeforeWatering: moistureVal,
      moistureAfterWatering: isPostWatering ? postMoisture : (editForm.moistureAfterWatering ?? plant.moistureAfterWatering)
    };

    const loggedPlant = logPlantMetrics(
      plantToLog,
      {
        type: isPostWatering ? 'post_watering' : 'dry_check',
        moistureSubstrate: moistureVal,
        phSubstrateBefore: editForm.phBeforeWatering,
        phSubstrateAfter: editForm.phAfterWatering ?? editForm.currentPH,
        ppmSubstrate: editForm.ppmAfterWatering,
        ppfdTop: editForm.lightPPFD,
        tempC: editForm.currentTemp,
        humidityRH: editForm.currentHumidity,
        notes: editForm.notes,
        isPredicted: false,
        source: 'user'
      }
    );

    onUpdatePlant(loggedPlant);
    if (onAwardXP) {
      onAwardXP(3, 'Збережено показники догляду в день поливу');
    }
    setIsEditing(false);
    setShowAfterWateringParams(false);

    // Якщо вологість суха та потребує поливу (<= 30%), пропонуємо перейти до підготовки поливу
    if (!isPostWatering && activeMoisture <= 30) {
      setIsCardExpanded(true);
    }
  };

  const handleQuickWater = () => {
    const postMoisture = editForm.moistureAfterWatering ?? 80;

    const plantToLog: Plant = {
      ...plant,
      ...editForm,
      lastWatered: new Date().toISOString().split('T')[0],
      moistureBeforeWatering: postMoisture,
      moistureAfterWatering: postMoisture
    };

    const loggedPlant = logPlantMetrics(
      plantToLog,
      {
        type: 'post_watering',
        moistureSubstrate: postMoisture,
        phSubstrateBefore: editForm.phBeforeWatering ?? plant.phBeforeWatering,
        phSubstrateAfter: editForm.phAfterWatering ?? plant.phAfterWatering ?? plant.currentPH,
        ppmSubstrate: editForm.ppmAfterWatering ?? plant.ppmAfterWatering ?? 650,
        ppfdTop: plant.lightPPFD ?? 520,
        tempC: plant.currentTemp,
        humidityRH: plant.currentHumidity,
        notes: 'Швидкий полив повноцінним розчином'
      }
    );

    onUpdatePlant(loggedPlant);
  };

  const stages = ['germination', 'seedling', 'vegetative', 'flowering', 'harvested'] as const;
  const currentStageIndex = stages.indexOf(plant.stage);
  const remainingDays = getRemainingDaysToHarvest(plant);

  return (
    <div className="space-y-4 w-full min-w-0 max-w-full overflow-hidden flex flex-col">
      <div
        className="bg-[#000000] border-y sm:border border-white/10 rounded-none sm:rounded-[38px] p-0 sm:p-3.5 shadow-2xl w-full min-w-0 max-w-full overflow-hidden transition-all duration-300 flex flex-col justify-start space-y-3"
      >
        <div className="space-y-2.5 flex-1 flex flex-col justify-start w-full">
          {/* 🟢 Upper Plaque / Ticket */}
          <div
            role="button"
            tabIndex={0}
            onClick={toggleCardExpanded}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCardExpanded();
              }
            }}
            className="relative w-full bg-[#19532B] rounded-[24px] sm:rounded-[28px] px-4 py-5 sm:p-6 shadow-md cursor-pointer select-none overflow-hidden transition-all active:scale-[0.99] group/ticket"
          >
            {/* Top Header Row: Title on Left | Health Heart & Trash Bin on Right */}
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight text-left leading-tight min-w-0 flex-1">
                {plant.name}
              </h2>

              <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {/* Plant Health Heart Badge */}
                  {vitality.status === 'dead' ? (
                    <div className="inline-flex items-center gap-1.5 bg-rose-950 text-rose-200 border border-rose-700/60 font-black text-[11px] sm:text-xs px-2.5 py-1 rounded-full shadow-xs">
                      <Skull className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>0%</span>
                    </div>
                  ) : (
                    <div
                      className="inline-flex items-center gap-1.5 bg-black/40 text-white font-black text-[11px] sm:text-xs px-2.5 py-1 rounded-full shadow-xs border border-white/10"
                      title={`Здоров'я рослини: ${vitality.healthScore}%`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 shrink-0 ${
                          vitality.status === 'critical'
                            ? 'fill-rose-500 text-rose-500 animate-pulse'
                            : 'fill-[#fa6e59] text-[#fa6e59]'
                        }`}
                      />
                      <span>{vitality.healthScore}%</span>
                    </div>
                  )}

                  {/* Delete Plant Trash Button */}
                  {onRequestDeletePlant && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestDeletePlant(plant.id);
                      }}
                      title="Видалити рослину"
                      aria-label="Видалити рослину"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/25 hover:bg-rose-600 text-white hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.3]" />
                    </button>
                  )}
                </div>

                {/* Expand / Collapse Chevron Indicator Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCardExpanded();
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center shrink-0 shadow-sm border border-white/15 transition-transform group-hover/ticket:scale-105 active:scale-95 cursor-pointer"
                  title={isCardExpanded ? 'Згорнути картку' : 'Розгорнути картку'}
                  aria-label={isCardExpanded ? 'Згорнути картку' : 'Розгорнути картку'}
                >
                  {isCardExpanded ? (
                    <ChevronUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.8]" />
                  )}
                </button>
              </div>
            </div>

            {/* Secondary Info Row (Left-aligned) */}
            <div className="mt-3 flex items-center justify-start gap-1.5 sm:gap-2 flex-wrap text-left">
              <span className="inline-flex items-center gap-1 bg-black/30 text-[#e6f7eb] font-extrabold text-xs sm:text-sm px-3 py-1 rounded-full tracking-tight border border-white/10">
                <span>Фаза: {stageLabelUk(plant.stage)}</span>
              </span>

              <span className="inline-flex items-center gap-1 bg-black/30 text-[#e6f7eb] font-extrabold text-xs sm:text-sm px-3 py-1 rounded-full tracking-tight border border-white/10">
                <span>Горщик: {currentPotSize} л ({plant.potType === 'fabric' ? 'Текстиль' : plant.potType === 'airpot' ? 'Air-Pot' : 'Пластик'})</span>
              </span>

              {remainingDays < 99999 && (
                <span className="inline-flex items-center gap-1 bg-black/30 text-[#e6f7eb] font-extrabold text-xs sm:text-sm px-3 py-1 rounded-full tracking-tight border border-white/10">
                  <Clock className="w-3.5 h-3.5 stroke-[2.4] shrink-0" />
                  <span>До врожаю ~{remainingDays} дн.</span>
                </span>
              )}

              {isPlantWateredToday && (
                <span className="inline-flex items-center gap-1 bg-black/40 text-[#7df56c] font-black text-xs sm:text-sm px-3 py-1 rounded-full tracking-tight shadow-xs border border-[#7df56c]/30">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                  <span>Полито сьогодні</span>
                </span>
              )}
            </div>

            {/* Integrated actions inside the green ticket (Left-aligned) */}
            {(!isSubstrateConfirmed || showTransplantButton || vitality.status === 'dead' || vitality.status === 'critical') && (
              <div className="mt-3 flex items-center justify-start gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                {!isSubstrateConfirmed && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSubstrateConfirmModalOpen(true);
                    }}
                    className="bg-black/40 hover:bg-black text-[#7df56c] border border-[#7df56c]/30 font-black text-xs py-1.5 px-3.5 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Підтвердити субстрат</span>
                  </button>
                )}
                {showTransplantButton && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTransplantModalOpen(true);
                    }}
                    className="bg-black/40 hover:bg-black text-[#7df56c] border border-[#7df56c]/30 font-black text-xs py-1.5 px-3.5 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Sprout className="w-3.5 h-3.5" />
                    <span>Пересадити ({currentPotSize} л)</span>
                  </button>
                )}
                {vitality.status === 'dead' && (
                  <div className="bg-rose-950/90 text-rose-200 border border-rose-800/60 font-black text-xs py-1 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-sm">
                    <Skull className="w-3.5 h-3.5 text-rose-400" />
                    <span>Загинула (0%)</span>
                  </div>
                )}
                {vitality.status === 'critical' && (
                  <div className="bg-rose-950/90 text-rose-200 border border-rose-800/60 font-black text-xs py-1 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-sm">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                    <span>Критичний стан ({vitality.healthScore}%)</span>
                  </div>
                )}
              </div>
            )}
          </div>

      {/* Accordion Body: Only shown when isCardExpanded is true */}
      <AnimatePresence>
        {isCardExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-2 pt-1 pb-3 sm:pb-0 overflow-hidden w-full"
          >
            {/* 📊 Модуль: Показники (Розгортається кнопкою у стилі AI Лікар Рослин) */}
            <div id={`plant-${plant.id}-quick-metrics-dashboard`} className="w-full transition-all duration-300">
              <div
                onClick={() => setIsQuickMetricsExpanded(prev => !prev)}
                className="w-full bg-[#9ABC04] text-[#18181b] border border-black/10 p-4 sm:p-4.5 rounded-[24px] sm:rounded-[28px] shadow-lg cursor-pointer select-none group transition-all duration-200 hover:shadow-xl active:scale-[0.99]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-black text-sm sm:text-base tracking-tight text-[#18181b]">
                  <Activity className="w-5 h-5 text-[#18181b] shrink-0 stroke-[2.5]" />
                  <span className="truncate">Показники</span>
                </div>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#18181b] text-white flex items-center justify-center shrink-0 shadow-md transition-transform group-hover:scale-105">
                {isQuickMetricsExpanded ? (
                  <ChevronUp className="w-5 h-5 stroke-[3]" />
                ) : (
                  <ChevronDown className="w-5 h-5 stroke-[3]" />
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
              {isQuickMetricsExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  onClick={(e) => e.stopPropagation()}
                  className="pt-3 text-white overflow-hidden space-y-2.5"
                >
                  <div className="bg-[#14161a] border border-neutral-800/80 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-md space-y-2.5 w-full">
                    {/* Секція 1: 🎯 Поточний контроль (Зараз) */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 px-0.5">
                        <span className="flex items-center gap-1.5 text-teal-300">
                          <span>🎯</span> Поточний контроль (Зараз)
                        </span>
                        <span className="text-[10px] text-neutral-400 font-semibold">натисніть показник для налаштування</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {/* 1. Вологість субстрату */}
                        <button
                          type="button"
                          id={`plant-${plant.id}-quick-moisture-btn`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMoistureQuickAdjustOpen((prev) => !prev);
                            setIsPhQuickAdjustOpen(false);
                            setIsPpmQuickAdjustOpen(false);
                            setIsPpfdQuickAdjustOpen(false);
                          }}
                          className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between select-none ${
                            isMoistureQuickAdjustOpen
                              ? 'bg-teal-950/40 border-teal-500/80 ring-2 ring-teal-500/30'
                              : 'bg-[#1c1e24] hover:bg-[#23262e] border-neutral-700/60'
                          }`}
                          title="Натисніть для зміни вологості субстрату зараз"
                        >
                          <div className="flex items-center justify-between gap-1 text-[11px] text-neutral-400 font-bold">
                            <span className="flex items-center gap-1 truncate">
                              <Droplets className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                              <span>Вологість</span>
                            </span>
                            <span className="text-[9px] text-teal-400 font-extrabold uppercase bg-teal-950/60 px-1 py-0.2 rounded">змінити</span>
                          </div>
                          <div className="mt-1 flex items-baseline justify-between gap-1">
                            <span className={`text-base sm:text-lg font-black ${
                              currentMoisture <= 30 ? 'text-amber-400' : currentMoisture >= 85 ? 'text-sky-400' : 'text-teal-300'
                            }`}>
                              {currentMoisture}%
                            </span>
                            <span className="text-[10px] font-bold text-neutral-400 truncate">
                              {currentMoisture <= 30 ? 'Сухо' : currentMoisture >= 85 ? 'Волого' : 'Оптимум'}
                            </span>
                          </div>
                        </button>

                        {/* 2. pH субстрату / дренажу */}
                        <button
                          type="button"
                          id={`plant-${plant.id}-quick-ph-btn`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPhQuickAdjustOpen((prev) => !prev);
                            setIsMoistureQuickAdjustOpen(false);
                            setIsPpmQuickAdjustOpen(false);
                            setIsPpfdQuickAdjustOpen(false);
                          }}
                          className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between select-none ${
                            isPhQuickAdjustOpen
                              ? 'bg-emerald-950/40 border-emerald-500/80 ring-2 ring-emerald-500/30'
                              : 'bg-[#1c1e24] hover:bg-[#23262e] border-neutral-700/60'
                          }`}
                          title="Натисніть для налаштування pH субстрату"
                        >
                          <div className="flex items-center justify-between gap-1 text-[11px] text-neutral-400 font-bold">
                            <span className="flex items-center gap-1 truncate">
                              <span className="text-emerald-400 text-xs">🧪</span>
                              <span>pH субстрату</span>
                            </span>
                            <span className={`text-[9px] font-black px-1 py-0.2 rounded ${
                              isPhOk ? 'bg-emerald-950/60 text-emerald-400' : 'bg-amber-950/60 text-amber-400'
                            }`}>
                              {isPhOk ? '✓ Норма' : '⚠️ Увага'}
                            </span>
                          </div>
                          <div className="mt-1 flex items-baseline justify-between gap-1">
                            <span className="text-base sm:text-lg font-black text-emerald-300">
                              {currentPHDisplay} <span className="text-[11px] font-bold text-neutral-400">pH</span>
                            </span>
                            <span className="text-[10px] font-bold text-neutral-400 truncate">
                              Ціль {phTargetStr}
                            </span>
                          </div>
                        </button>

                        {/* 3. PPM живлення */}
                        <button
                          type="button"
                          id={`plant-${plant.id}-quick-ppm-btn`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPpmQuickAdjustOpen((prev) => !prev);
                            setIsMoistureQuickAdjustOpen(false);
                            setIsPhQuickAdjustOpen(false);
                            setIsPpfdQuickAdjustOpen(false);
                          }}
                          className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between select-none ${
                            isPpmQuickAdjustOpen
                              ? 'bg-amber-950/40 border-amber-500/80 ring-2 ring-amber-500/30'
                              : 'bg-[#1c1e24] hover:bg-[#23262e] border-neutral-700/60'
                          }`}
                          title="Натисніть для налаштування PPM живлення"
                        >
                          <div className="flex items-center justify-between gap-1 text-[11px] text-neutral-400 font-bold">
                            <span className="flex items-center gap-1 truncate">
                              <span className="text-amber-400 text-xs">⚡</span>
                              <span>PPM живлення</span>
                            </span>
                            <span className={`text-[9px] font-black px-1 py-0.2 rounded ${
                              isPpmOk ? 'bg-amber-950/60 text-amber-400' : 'bg-rose-950/60 text-rose-400'
                            }`}>
                              {isPpmOk ? '✓ Норма' : currentPPM < ppmTargetBounds.min ? 'Низький' : 'Високий'}
                            </span>
                          </div>
                          <div className="mt-1 flex items-baseline justify-between gap-1">
                            <span className="text-base sm:text-lg font-black text-amber-300">
                              {currentPPM} <span className="text-[11px] font-bold text-neutral-400">PPM</span>
                            </span>
                            <span className="text-[10px] font-bold text-neutral-400 truncate">
                              Ціль {ppmTargetBounds.label}
                            </span>
                          </div>
                        </button>

                        {/* 4. PPFD світло */}
                        <button
                          type="button"
                          id={`plant-${plant.id}-quick-ppfd-btn`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPpfdQuickAdjustOpen((prev) => !prev);
                            setIsMoistureQuickAdjustOpen(false);
                            setIsPhQuickAdjustOpen(false);
                            setIsPpmQuickAdjustOpen(false);
                          }}
                          className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between select-none ${
                            isPpfdQuickAdjustOpen
                              ? 'bg-yellow-950/40 border-yellow-500/80 ring-2 ring-yellow-500/30'
                              : 'bg-[#1c1e24] hover:bg-[#23262e] border-neutral-700/60'
                          }`}
                          title="Натисніть для налаштування PPFD освітлення"
                        >
                          <div className="flex items-center justify-between gap-1 text-[11px] text-neutral-400 font-bold">
                            <span className="flex items-center gap-1 truncate">
                              <Sun className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                              <span>PPFD світла</span>
                            </span>
                            <span className={`text-[9px] font-black px-1 py-0.2 rounded ${
                              isPpfdOk ? 'bg-yellow-950/60 text-yellow-400' : 'bg-amber-950/60 text-amber-400'
                            }`}>
                              {isPpfdOk ? '✓ Норма' : 'Коригувати'}
                            </span>
                          </div>
                          <div className="mt-1 flex items-baseline justify-between gap-1">
                            <span className="text-base sm:text-lg font-black text-yellow-300">
                              {currentPpfd} <span className="text-[10px] font-bold text-neutral-400">мкмоль</span>
                            </span>
                            <span className="text-[10px] font-bold text-neutral-400 truncate">
                              Ціль {ppfdTargetBounds.label}
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* 1. Слайдер швидкого регулювання вологості (розгортається по кліку) */}
                    <AnimatePresence>
                      {isMoistureQuickAdjustOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-[#18191c] border border-teal-500/40 rounded-xl p-3 space-y-2 text-white shadow-lg overflow-hidden"
                        >
                          <div className="flex items-center justify-between font-black text-xs">
                            <span className="flex items-center gap-1.5 text-teal-300">
                              <Droplets className="w-3.5 h-3.5 text-teal-400" />
                              <span>Регулювання: Вологість субстрату зараз</span>
                            </span>
                            <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-md font-mono font-bold">
                              {currentMoisture}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={100}
                            step={1}
                            value={currentMoisture}
                            onChange={(e) => {
                              const newMoisture = parseInt(e.target.value, 10);
                              setEditForm((prev) => ({ ...prev, moistureBeforeWatering: newMoisture }));
                              onUpdatePlant({ ...plant, ...editForm, moistureBeforeWatering: newMoisture });
                              setTaskInputValues((prev) => {
                                const next = { ...prev };
                                Object.keys(next).forEach((tId) => {
                                  if (next[tId] && (tId.includes('moisture') || tId.includes('water'))) {
                                    next[tId] = { ...next[tId], moisture: newMoisture };
                                  }
                                });
                                return next;
                              });
                            }}
                            className="w-full accent-teal-400 cursor-pointer h-2 bg-neutral-700 rounded-lg"
                          />
                          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold px-0.5">
                            <span>10% (Сухо)</span>
                            <span className="text-teal-400 font-extrabold">30%–80% (Оптимум)</span>
                            <span>90%+ (Волого)</span>
                          </div>

                          {/* Попередження про наслідок дії в реальному часі */}
                          {(() => {
                            const moistDiag = diagnoseMoisture(currentMoisture);
                            return moistDiag.isAbnormal ? (
                              <MetricWarningBox diagnostic={moistDiag} compact className="mt-2" />
                            ) : null;
                          })()}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 2. Слайдер регулювання pH субстрату */}
                    <AnimatePresence>
                      {isPhQuickAdjustOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-[#18191c] border border-emerald-500/40 rounded-xl p-3 space-y-2 text-white shadow-lg overflow-hidden"
                        >
                          <div className="flex items-center justify-between font-black text-xs">
                            <span className="flex items-center gap-1.5 text-emerald-300">
                              <span className="text-emerald-400 text-sm">🧪</span>
                              <span>Регулювання: pH субстрату</span>
                            </span>
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-mono font-bold">
                              pH {currentPHDisplay}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={5.0}
                            max={8.0}
                            step={0.1}
                            value={typeof rawPH === 'number' ? rawPH : 6.2}
                            onChange={(e) => {
                              const newPh = parseFloat(e.target.value);
                              setEditForm((prev) => ({ ...prev, phBeforeWatering: newPh, currentPH: newPh }));
                              onUpdatePlant({ ...plant, ...editForm, phBeforeWatering: newPh, currentPH: newPh });
                            }}
                            className="w-full accent-emerald-400 cursor-pointer h-2 bg-neutral-700 rounded-lg"
                          />
                          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold px-0.5">
                            <span>5.5 (Кисле)</span>
                            <span className="text-emerald-400 font-extrabold">{phTargetStr} (Оптимум {plant.medium || 'Ґрунт'})</span>
                            <span>7.5 (Лужне)</span>
                          </div>

                          {/* Попередження про закислення або лужність із наслідками */}
                          {(() => {
                            const phDiag = diagnosePh(typeof rawPH === 'number' ? rawPH : 6.2, plant.medium || 'soil', 'substrate');
                            return phDiag.isAbnormal ? (
                              <MetricWarningBox diagnostic={phDiag} compact className="mt-2" />
                            ) : null;
                          })()}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 3. Слайдер регулювання PPM живлення */}
                    <AnimatePresence>
                      {isPpmQuickAdjustOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-[#18191c] border border-amber-500/40 rounded-xl p-3 space-y-2 text-white shadow-lg overflow-hidden"
                        >
                          <div className="flex items-center justify-between font-black text-xs">
                            <span className="flex items-center gap-1.5 text-amber-300">
                              <span className="text-amber-400 text-sm">⚡</span>
                              <span>Регулювання: PPM живлення ({stageLabelUk(plant.stage)})</span>
                            </span>
                            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md font-mono font-bold">
                              {currentPPM} PPM
                            </span>
                          </div>
                          <input
                            type="range"
                            min={100}
                            max={2200}
                            step={25}
                            value={currentPPM}
                            onChange={(e) => {
                              const newPpm = parseInt(e.target.value, 10);
                              setEditForm((prev) => ({ ...prev, ppmBeforeWatering: newPpm }));
                              onUpdatePlant({ ...plant, ...editForm, ppmBeforeWatering: newPpm });
                            }}
                            className="w-full accent-amber-400 cursor-pointer h-2 bg-neutral-700 rounded-lg"
                          />
                          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold px-0.5">
                            <span>200 (Розсада)</span>
                            <span className="text-amber-400 font-extrabold">{ppmTargetBounds.label} PPM (Ціль)</span>
                            <span>1500+ (Засол)</span>
                          </div>

                          {/* Попередження про засол або дефіцит із наслідками */}
                          {(() => {
                            const ppmDiag = diagnosePpm(currentPPM, plant.stage);
                            return ppmDiag.isAbnormal ? (
                              <MetricWarningBox diagnostic={ppmDiag} compact className="mt-2" />
                            ) : null;
                          })()}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 4. Слайдер регулювання PPFD */}
                    <AnimatePresence>
                      {isPpfdQuickAdjustOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-[#18191c] border border-yellow-500/40 rounded-xl p-3 space-y-2 text-white shadow-lg overflow-hidden"
                        >
                          <div className="flex items-center justify-between font-black text-xs">
                            <span className="flex items-center gap-1.5 text-yellow-300">
                              <Sun className="w-3.5 h-3.5 text-yellow-400" />
                              <span>Регулювання: PPFD світла</span>
                            </span>
                            <span className="text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-2 py-0.5 rounded-md font-mono font-bold">
                              {currentPpfd} мкмоль
                            </span>
                          </div>
                          <input
                            type="range"
                            min={50}
                            max={1200}
                            step={25}
                            value={currentPpfd}
                            onChange={(e) => {
                              const newPpfd = parseInt(e.target.value, 10);
                              setEditForm((prev) => ({ ...prev, lightPPFD: newPpfd }));
                              onUpdatePlant({ ...plant, ...editForm, lightPPFD: newPpfd });
                            }}
                            className="w-full accent-yellow-400 cursor-pointer h-2 bg-neutral-700 rounded-lg"
                          />
                          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold px-0.5">
                            <span>150 (Слабке)</span>
                            <span className="text-yellow-400 font-extrabold">{ppfdTargetBounds.label} (Ціль)</span>
                            <span>1000+ (Опік)</span>
                          </div>

                          {/* Попередження про світловий стрес або голод */}
                          {(() => {
                            const ppfdDiag = diagnosePpfd(currentPpfd, plant.stage);
                            return ppfdDiag.isAbnormal ? (
                              <MetricWarningBox diagnostic={ppfdDiag} compact className="mt-2" />
                            ) : null;
                          })()}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Попередження про відхилення показників від норми та їх наслідки */}
                    {activeWarnings.length > 0 && (
                      <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-amber-400 px-0.5">
                          <span className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>⚠️ Попередження: виявлено відхилення від норми ({activeWarnings.length})</span>
                          </span>
                          <span className="text-[10px] text-neutral-400 font-semibold">наслідки для рослини</span>
                        </div>
                        <div className="space-y-2">
                          {activeWarnings.map((warning, idx) => (
                            <MetricWarningBox key={idx} diagnostic={warning} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Секція 2: 🔮 Прогноз та розвиток */}
                    <div className="pt-2 border-t border-neutral-800/80">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 px-0.5">
                        <span className="flex items-center gap-1.5 text-amber-300">
                          <span>🔮</span> Прогноз та розвиток
                        </span>
                        <span className="text-[10px] text-neutral-500 font-medium">розрахунок ШІ та динаміка метрик</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {/* 1. Прогноз поливу */}
                        <div className="p-2 sm:p-2.5 rounded-xl border bg-[#1c1e24] border-neutral-700/60 text-left flex flex-col justify-between">
                          <div className="flex items-center justify-between gap-1 text-[11px] text-neutral-400 font-bold">
                            <span className="flex items-center gap-1 truncate">
                              <Calendar className="w-3.5 h-3.5 text-[#fad277] shrink-0" />
                              <span>Наступний полив</span>
                            </span>
                            <span className="text-[9px] text-[#67e8f9] font-bold">~{metricsAnalytics.dailyDryingRate}%/дн</span>
                          </div>
                          <div className="mt-1 flex items-baseline justify-between gap-1">
                            <span className="text-base sm:text-lg font-black text-[#fad277]">
                              {vitality.status === 'dead'
                                ? 'Загинула'
                                : metricsAnalytics.daysUntilWatering === 0
                                ? 'Сьогодні'
                                : `через ${metricsAnalytics.daysUntilWatering} дн.`}
                            </span>
                            <span className="text-[10px] font-bold text-neutral-400 truncate">
                              просихання
                            </span>
                          </div>
                        </div>

                        {/* 2. Прогноз врожаю */}
                        <div className="p-2 sm:p-2.5 rounded-xl border bg-[#1c1e24] border-neutral-700/60 text-left flex flex-col justify-between">
                          <div className="flex items-center justify-between gap-1 text-[11px] text-neutral-400 font-bold">
                            <span className="flex items-center gap-1 truncate">
                              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>Прогноз врожаю</span>
                            </span>
                            <span className="text-[9px] text-amber-400 font-bold">~{remainingDays} дн.</span>
                          </div>
                          <div className="mt-1 flex items-baseline justify-between gap-1">
                            <span className="text-base sm:text-lg font-black text-amber-300">
                              ~{forecastYieldGrams} <span className="text-[11px] font-bold text-neutral-400">г/кущ</span>
                            </span>
                            <span className="text-[10px] font-bold text-neutral-400 truncate">
                              сухих суцвіть
                            </span>
                          </div>
                        </div>

                        {/* 3. Здоров'я та життєздатність */}
                        <div className="p-2 sm:p-2.5 rounded-xl border bg-[#1c1e24] border-neutral-700/60 text-left flex flex-col justify-between">
                          <div className="flex items-center justify-between gap-1 text-[11px] text-neutral-400 font-bold">
                            <span className="flex items-center gap-1 truncate">
                              <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>Здоров&apos;я</span>
                            </span>
                            <span className={`text-[9px] font-bold uppercase ${
                              vitality.status === 'dead' ? 'text-rose-500' : vitality.status === 'critical' ? 'text-amber-400' : 'text-emerald-400'
                            }`}>
                              {vitality.status === 'dead' ? 'Загинула' : vitality.status === 'critical' ? 'Критично' : 'Відмінно'}
                            </span>
                          </div>
                          <div className="mt-1 flex items-baseline justify-between gap-1">
                            <span className={`text-base sm:text-lg font-black ${
                              vitality.healthScore < 50 ? 'text-rose-400' : vitality.healthScore < 80 ? 'text-amber-300' : 'text-emerald-300'
                            }`}>
                              {vitality.healthScore}%
                            </span>
                            <span className="text-[10px] font-bold text-neutral-400 truncate">
                              вітальний стан
                            </span>
                          </div>
                        </div>

                        {/* 4. VPD транспірації */}
                        <div className="p-2 sm:p-2.5 rounded-xl border bg-[#1c1e24] border-neutral-700/60 text-left flex flex-col justify-between">
                          <div className="flex items-center justify-between gap-1 text-[11px] text-neutral-400 font-bold">
                            <span className="flex items-center gap-1 truncate">
                              <span className="text-cyan-400 text-xs">💨</span>
                              <span>VPD тиск пари</span>
                            </span>
                            <span className={`text-[9px] font-bold ${
                              vpdStatus.status === 'Optimal' ? 'text-cyan-400' : 'text-amber-400'
                            }`}>
                              {vpdStatus.status === 'Optimal' ? 'Оптимум' : vpdStatus.status === 'Low' ? 'Низький' : 'Високий'}
                            </span>
                          </div>
                          <div className="mt-1 flex items-baseline justify-between gap-1">
                            <span className="text-base sm:text-lg font-black text-cyan-300">
                              {vpdStatus.vpd} <span className="text-[11px] font-bold text-neutral-400">kPa</span>
                            </span>
                            <span className="text-[10px] font-bold text-neutral-400 truncate">
                              {plant.currentTemp}°C / {plant.currentHumidity}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 💬 Модуль: Чат */}
          <div id={`plant-${plant.id}-chat-module`} className="w-full transition-all duration-300">
            <div
              onClick={() => setIsChatExpanded(prev => !prev)}
              className="w-full bg-[#FFCA26] text-[#18181b] border border-black/10 p-4 sm:p-4.5 rounded-[24px] sm:rounded-[28px] shadow-lg cursor-pointer select-none group transition-all duration-200 hover:shadow-xl active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base tracking-tight text-[#18181b]">
                    <MessageSquare className="w-5 h-5 text-[#18181b] shrink-0 stroke-[2.5]" />
                    <span className="truncate">Чат</span>
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isChatExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  onClick={(e) => e.stopPropagation()}
                  className="pt-2"
                >
                  <div className="bg-[#FFCA26] border border-black/10 rounded-[24px] sm:rounded-[28px] p-3.5 sm:p-4 shadow-lg text-[#18181b]">
                    <PlantChat plant={plant} onUpdatePlant={onUpdatePlant} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        {/* Expanded Window Card Content (Always Expanded) */}
        <div className="space-y-2 pt-0">
          {/* Cycle Completion Section inside Plant Card */}
              {plant.isHarvested || plant.harvestTrophy ? (
                <div className="bg-emerald-900/10 border border-emerald-300/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 my-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl shrink-0">
                      <Trophy className="w-5 h-5 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-neutral-900">
                        Повний цикл вирощування завершено!
                      </h4>
                      <p className="text-[11px] sm:text-xs text-emerald-800 font-extrabold">
                        Сухий врожай: {plant.harvestTrophy?.totalYieldGrams || 85} г • Оцінка: {plant.harvestTrophy?.rating || 5}/5 ⭐
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowJournalModal(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer shrink-0 active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>📖 Журнал вирощування ({plant.growJournal?.length || 0} дн.)</span>
                  </button>
                </div>
              ) : plant.stage === 'harvested' ? (
                <div className="bg-amber-100/70 border border-amber-300/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 my-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-200/80 text-amber-900 rounded-xl shrink-0">
                      <Trophy className="w-4 h-4 text-amber-800 fill-amber-800" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-amber-950">
                        Завершення циклу вирощування
                      </h4>
                      <p className="text-[11px] font-medium text-amber-900/80">
                        Зібрали та висушили врожай? Зафіксуйте вагу для сертифіката
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowHarvestDryModal(true)}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-xs py-2 px-3.5 rounded-xl shadow-2xs transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5 border border-amber-400 active:scale-95"
                  >
                    <Trophy className="w-3.5 h-3.5 fill-amber-950 text-amber-950" />
                    <span>Завершити цикл 🌾</span>
                  </button>
                </div>
              ) : null}



              {/* Stage Timeline Progress in expanded view */}
              <div className="pt-3 px-3 sm:px-1 border-t border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-2.5 gap-1">
                  <span className="inline-flex items-center gap-1.5 bg-[#0c0c0e]/90 border border-[#FE5B04]/45 text-[#E4EEF0] font-mono uppercase tracking-wider text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg shadow-[0_0_12px_rgba(254,91,4,0.14)] self-start sm:self-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FE5B04] shadow-[0_0_6px_#FE5B04] animate-pulse" />
                    <Clock className="w-3.5 h-3.5 text-[#FE5B04] shrink-0" />
                    <span>Фаза: <span className="text-[#FE5B04] uppercase font-black">{stageLabelUk(plant.stage)}</span></span>
                  </span>
                  <span className="text-[#FE5B04] font-extrabold text-[11px] sm:text-xs">
                    День {plant.stageDay} з {plant.totalStageDays} стадії ({Math.round((plant.stageDay / plant.totalStageDays) * 100)}%)
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {stages.map((stg, idx) => {
                    const isPast = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const shortLabel = stg === 'germination' ? 'Пророщ.' : stg === 'seedling' ? 'Розсада' : stg === 'vegetative' ? 'Вегетація' : stg === 'flowering' ? 'Цвітіння' : 'Врожай';
                    return (
                      <div key={stg} className="flex flex-col gap-1 sm:gap-1.5">
                        <div
                          className={`h-2.5 sm:h-3 rounded-full transition-all ${
                            isCurrent
                              ? 'bg-[#FE5B04] shadow-2xs animate-pulse'
                              : isPast
                              ? 'bg-[#16232B] border border-white/20'
                              : 'bg-[#E4EEF0]'
                          }`}
                        />
                        <span className={`text-[9px] sm:text-[11px] text-center capitalize truncate ${
                          isCurrent ? 'text-[#FE5B04] font-black' : 'text-[#E4EEF0] font-bold'
                        }`}>
                          <span className="hidden sm:inline">{stageLabelUk(stg)}</span>
                          <span className="inline sm:hidden">{shortLabel}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>

      {/* Solution Modal / Calculator */}
      {isSolutionModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto animate-fadeIn">
          <div className="bg-[#121316] border-0 sm:border border-neutral-800 rounded-none sm:rounded-3xl p-3 sm:p-6 shadow-2xl w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] overflow-y-auto space-y-4 sm:space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3.5">
              <div>
                <span className="bg-[#d8f087]/20 text-[#d8f087] text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider border border-[#d8f087]/30 inline-block">
                  Калькулятор Живильного Розчину
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 mt-2">
                  <FlaskConical className="w-5 h-5 text-[#d8f087]" />
                  Розчин для поливу рослини: {plant.name}
                </h3>
                <p className="text-xs text-neutral-400 font-semibold mt-1">
                  Фаза: <strong className="text-[#d8f087] uppercase font-black">{stageLabelUk(plant.stage)}</strong> • Субстрат: <strong className="text-white font-black">{plant.medium}</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSolutionModalOpen(false);
                    setIsNutrientFeedCalcOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-[#22242a] hover:bg-[#2e313a] text-[#d8f087] border border-[#d8f087]/40 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Калькулятор NPK / Рецепти 2026</span>
                </button>
                <button
                  onClick={() => setIsSolutionModalOpen(false)}
                  className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* WINDOW: PPM Чистої води (перед додаванням добрив) */}
            <div className="bg-[#18191c] border border-neutral-800 rounded-2xl p-4 sm:p-5 text-white shadow-md relative space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm text-white">
                  <Droplets className="w-4 h-4 text-[#d8f087] shrink-0" />
                  <span>💧 PPM чистої води (до додавання добрив)</span>
                </div>
              </div>

              <div className="pt-1 pb-9 relative">
                <div className="flex items-center justify-between text-[11px] font-black text-neutral-300 mb-2 px-1">
                  <span>0 PPM (Осмос / RO)</span>
                  <span className="text-[#d8f087] font-bold">Оптимум чистої води: 0 – 150 PPM</span>
                  <span>500+ PPM (Кринична / Жорстка)</span>
                </div>

                <div className="relative h-10 flex items-center px-2 select-none">
                  <div className="absolute left-2 right-2 h-1.5 bg-neutral-800 rounded-full"></div>
                  <div
                    className="absolute left-2 h-1.5 bg-[#d8f087] rounded-full transition-all duration-75"
                    style={{ width: `calc(${Math.min(100, (cleanWaterPpm / 500) * 100)}% * 0.95)` }}
                  ></div>

                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none z-20 transition-all duration-75 flex flex-col items-center"
                    style={{ left: `calc(8px + ${Math.min(100, (cleanWaterPpm / 500) * 100)} * 0.94%)` }}
                  >
                    <div className="text-3xl sm:text-4xl filter drop-shadow-md">
                      {cleanWaterPpm <= 150 ? '💧' : cleanWaterPpm <= 250 ? '🚰' : '⚠️'}
                    </div>
                    <div className="absolute top-[100%] mt-0.5 pointer-events-none z-30">
                      <div className="bg-[#22242a] text-white font-extrabold text-xs px-2.5 py-0.5 rounded-xl shadow-lg border border-neutral-700 flex items-center gap-1 whitespace-nowrap relative">
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-[#22242a]"></div>
                        <span>{cleanWaterPpm} PPM ({getWaterPpmTypeLabel(cleanWaterPpm)})</span>
                      </div>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="5"
                    value={cleanWaterPpm}
                    onChange={(e) => setCleanWaterPpm(parseInt(e.target.value, 10) || 0)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                  />
                </div>
              </div>

              {/* Preset Quick Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-neutral-400 shrink-0">Швидкий вибір води:</span>
                {[
                  { label: '0 (Осмос / RO)', val: 0 },
                  { label: '50 (Фільтрована)', val: 50 },
                  { label: '120 (Водопровід)', val: 120 },
                  { label: '250 (Жорстка)', val: 250 },
                  { label: '350 (Криниця)', val: 350 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setCleanWaterPpm(preset.val)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer border ${
                      cleanWaterPpm === preset.val
                        ? 'bg-[#d8f087] text-[#18181b] border-[#d8f087] shadow-xs'
                        : 'bg-[#22242a] text-neutral-300 border-neutral-700 hover:bg-[#2e313a]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* High Clean Water PPM Warning Notice (Collapsible) */}
              {cleanWaterPpm > 150 && (
                <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl overflow-hidden transition-all mt-1">
                  <button
                    type="button"
                    onClick={() => setIsWaterPpmInfoOpen(!isWaterPpmInfoOpen)}
                    className="w-full flex items-center justify-between p-3 text-amber-200 hover:text-white hover:bg-amber-900/30 font-extrabold text-xs transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Чому високий PPM вихідної води ({cleanWaterPpm} PPM) це погано?</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200 ${isWaterPpmInfoOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isWaterPpmInfoOpen && (
                    <div className="px-3 pb-3.5 pt-1 text-amber-100 text-[11px] space-y-2 leading-relaxed border-t border-amber-500/30">
                      <p>
                        Водопровідна та кринична вода з високим PPM містить баластні солі (кальцій, магній, вапно, хлор). Вони займають &quot;ліміт&quot; PPM у вашому розчині.
                      </p>
                      <p className="text-amber-200 font-medium">
                        Через високий початковий PPM ви змушені зменшувати дозу добрив та стимуляторів, щоб не перевищити загальний допустимий PPM та не спалити коріння. В результаті рослина отримує менше необхідних елементів (NPK) і може виявляти ознаки дефіциту.
                      </p>
                      <div className="bg-black/40 p-2.5 rounded-lg text-amber-300 font-bold text-[10.5px] border border-amber-500/20 space-y-1">
                        <div>💡 <strong>Порада AI:</strong> Використовуйте воду зворотного осмосу (RO), дистильовану воду або розбавляйте вашу чисту воду водою зворотного осмосу або розбавляйте дистильованою водою.</div>
                        <div className="text-amber-200/90 font-semibold text-[10px]">Формула розрахунку (приблизна): Якщо у вас є 1 літр води з PPM 600, і ви хочете знизити його до 300, вам потрібно змішати його в рівних пропорціях з водою, де PPM дорівнює 0.</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Volume Selector - Slider */}
            <div className="bg-[#18191c] border border-neutral-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-black text-neutral-300 uppercase tracking-wider">
                  Оберіть об&apos;єм чистої води:
                </label>
                <div className="flex items-center gap-1.5 bg-[#22242a] border border-neutral-700 rounded-xl px-2.5 py-1">
                  <input
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={solutionVolume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setSolutionVolume(Math.min(100, Math.max(0.1, val)));
                      }
                    }}
                    className="w-16 text-xs font-black text-white text-center focus:outline-none bg-transparent"
                  />
                  <span className="text-xs font-black text-[#d8f087]">л</span>
                </div>
              </div>

              {/* Dynamic Volume Badge */}
              <div className="bg-[#141518] border border-neutral-800 rounded-xl py-2 px-3 text-center">
                <span className="text-lg sm:text-xl font-black text-[#d8f087] tracking-tight">
                  💧 {solutionVolume < 1 
                    ? `${Math.round(solutionVolume * 1000)} грам (${solutionVolume.toFixed(1)} л)`
                    : `${solutionVolume % 1 === 0 ? solutionVolume : solutionVolume.toFixed(1)} л (${Math.round(solutionVolume * 1000).toLocaleString('uk-UA')} г)`}
                </span>
              </div>

              {/* Range Slider */}
              <div className="space-y-1.5 px-1 pt-1">
                <input
                  type="range"
                  min="0.1"
                  max="100"
                  step={solutionVolume <= 1 ? "0.1" : solutionVolume <= 10 ? "0.5" : "1"}
                  value={solutionVolume}
                  onChange={(e) => setSolutionVolume(parseFloat(e.target.value))}
                  className="w-full h-3 bg-[#22242a] rounded-lg appearance-none cursor-pointer accent-[#d8f087] border border-neutral-700"
                />
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-neutral-400">
                  <span>100 г (0.1 л)</span>
                  <span>10 л</span>
                  <span>50 л</span>
                  <span>100 л 🌊</span>
                </div>
              </div>
            </div>

            {/* Target pH Card */}
            <div className="bg-[#18191c] border border-neutral-800 p-3.5 rounded-2xl flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-black flex items-center gap-1.5">
                🎯 Цільовий pH розчину:
              </span>
              <div className="text-right">
                <span className="text-sm font-black text-[#d8f087] block">
                  {plant.medium === 'Soil' ? '6.2 – 6.5 pH' : '5.8 – 6.0 pH'}
                </span>
                <span className="text-[10px] text-neutral-400 font-bold block">Субстрат: {plant.medium}</span>
              </div>
            </div>

            {/* Interactive Target PPM Box */}
            <div className="bg-[#18191c] border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                    🎯 Цільовий PPM розчину (Мінералізація):
                  </span>
                  <span className="text-[11px] sm:text-xs text-neutral-400 font-bold block mt-0.5">
                    Оптимально для стадії <strong className="text-white">{stageLabelUk(plant.stage)}</strong>: <strong className="text-[#d8f087]">{stagePpmRange.min} – {stagePpmRange.max} PPM</strong>
                  </span>
                </div>

                {/* Interactive PPM Display & Direct Input */}
                <div className="flex items-center gap-1.5 bg-[#22242a] px-3 py-1.5 rounded-xl border border-neutral-700 self-start sm:self-auto">
                  <span className="text-xs font-bold text-neutral-400">Задати:</span>
                  <input
                    type="number"
                    min={stagePpmRange.min}
                    max={stagePpmRange.max}
                    step="10"
                    value={targetPpm}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) {
                        setTargetPpm(Math.min(stagePpmRange.max, Math.max(stagePpmRange.min, val)));
                      }
                    }}
                    className="w-16 text-center text-base font-black text-[#d8f087] bg-transparent focus:outline-none"
                  />
                  <span className="text-xs font-black text-white">PPM</span>
                </div>
              </div>

              {/* Slider Control for PPM within Optimal Bounds */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-extrabold text-neutral-400">
                  <span>Мін: {stagePpmRange.min} PPM</span>
                  <span className="text-[#d8f087] font-black text-xs">Обрано рівень: {targetPpm} PPM</span>
                  <span>Макс: {stagePpmRange.max} PPM</span>
                </div>

                <input
                  type="range"
                  min={stagePpmRange.min}
                  max={stagePpmRange.max}
                  step="10"
                  value={targetPpm}
                  onChange={(e) => setTargetPpm(parseInt(e.target.value, 10))}
                  className="w-full h-3.5 bg-[#22242a] rounded-lg appearance-none cursor-pointer accent-[#d8f087] border border-neutral-700"
                />
              </div>

              {/* Quick Preset Buttons within Optimal Range */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setTargetPpm(stagePpmRange.min)}
                  className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer border ${
                    targetPpm === stagePpmRange.min
                      ? 'bg-[#d8f087] text-[#18181b] font-black border-[#d8f087] shadow-xs'
                      : 'bg-[#22242a] text-neutral-300 border-neutral-700 hover:bg-[#2e313a]'
                  }`}
                >
                  <div className="text-[10px] sm:text-[11px] font-bold opacity-90 truncate">Мінімальний</div>
                  <div className="text-xs sm:text-sm font-black mt-0.5">{stagePpmRange.min} PPM</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetPpm(stagePpmRange.mid)}
                  className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer border ${
                    targetPpm === stagePpmRange.mid
                      ? 'bg-[#d8f087] text-[#18181b] font-black border-[#d8f087] shadow-xs'
                      : 'bg-[#22242a] text-neutral-300 border-neutral-700 hover:bg-[#2e313a]'
                  }`}
                >
                  <div className="text-[10px] sm:text-[11px] font-bold opacity-90 truncate">Оптимальний</div>
                  <div className="text-xs sm:text-sm font-black mt-0.5">{stagePpmRange.mid} PPM</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetPpm(stagePpmRange.max)}
                  className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer border ${
                    targetPpm === stagePpmRange.max
                      ? 'bg-[#d8f087] text-[#18181b] font-black border-[#d8f087] shadow-xs'
                      : 'bg-[#22242a] text-neutral-300 border-neutral-700 hover:bg-[#2e313a]'
                  }`}
                >
                  <div className="text-[10px] sm:text-[11px] font-bold opacity-90 truncate">Максимальний</div>
                  <div className="text-xs sm:text-sm font-black mt-0.5">{stagePpmRange.max} PPM</div>
                </button>
              </div>
            </div>

            {/* Recipe Proportions Table dynamically calculated for selected volume and target PPM */}
            {(() => {
              const recipe = getSolutionRecipe(solutionVolume, plant.stage, targetPpm);
              const calmagObj = recipe.find(r => r.id === 'calmag');
              const baseObj = recipe.find(r => r.id === 'base-npk');
              const stimObj = recipe.find(r => r.id === 'stimulant');

              return (
                <>
                  <div className="bg-[#18191c] border border-neutral-800 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sprout className="w-4 h-4 text-[#d8f087]" />
                      Рецепт дозування на {solutionVolume < 1 ? `${Math.round(solutionVolume * 1000)} г (${solutionVolume.toFixed(1)} л)` : `${solutionVolume % 1 === 0 ? solutionVolume : solutionVolume.toFixed(1)} л`} води ({targetPpm} PPM):
                    </h4>

                    <div className="space-y-2 text-xs">
                      {recipe.map((item) => (
                        <div key={item.id} className="bg-[#22242a] p-3.5 rounded-xl border border-neutral-800 flex items-center justify-between">
                          <span className="font-bold text-neutral-200">{item.name}:</span>
                          <span className="font-black text-[#d8f087] text-sm">
                            {item.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Assistant Guidance for mixing */}
                  <div className="bg-[#141518] border border-neutral-800 rounded-2xl p-4 text-xs space-y-2 text-neutral-300">
                    <div className="flex items-center gap-2 font-black text-white text-sm">
                      <Sparkles className="w-4 h-4 text-[#d8f087]" />
                      <span>Інструкція замішування розчину</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-neutral-300 font-medium leading-relaxed pl-1">
                      <li>Наберіть <strong className="text-white font-bold">{solutionVolume < 1 ? `${Math.round(solutionVolume * 1000)} г (${solutionVolume.toFixed(1)} л)` : `${solutionVolume} л`}</strong> відстояної води кімнатної температури (20-22°C).</li>
                      <li>Внесіть <strong className="text-white font-bold">{calmagObj?.amount ?? '1.0 мл'} CalMag</strong> та добре перемішайте.</li>
                      <li>Додайте <strong className="text-white font-bold">{baseObj?.amount ?? '2.0 мл'} {baseObj?.name}</strong> та <strong className="text-white font-bold">{stimObj?.amount ?? '0.5 мл'} стимулятора</strong> для досягнення цільових <strong className="text-[#d8f087] font-bold">{targetPpm} PPM</strong>.</li>
                      <li>Заміряйте pH розчину та відкоригуйте до <strong className="text-white font-bold">{plant.medium === 'Soil' ? '6.3' : '5.9'} pH</strong>.</li>
                    </ol>
                  </div>
                </>
              );
            })()}

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
              <button
                onClick={handleApproveSolution}
                className="px-5 py-2.5 text-xs font-black text-[#18181b] bg-[#d8f087] hover:bg-[#cbe37a] rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Розчин для поливу створено ✓</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nutrient & NPK Feed Calculator 2026 Modal */}
      {isNutrientFeedCalcOpen && (
        <NutrientFeedCalculator
          plant={plant}
          onClose={() => setIsNutrientFeedCalcOpen(false)}
          onAwardXP={onAwardXP}
          onApplySolution={(ppm, notes) => {
            setTargetPpm(ppm);
            setIsNutrientFeedCalcOpen(false);
            if (notes) {
              setLastRewardNotice(`⚡ Застосовано рецепт живлення: ${ppm} PPM`);
              setTimeout(() => setLastRewardNotice(null), 3000);
            }
          }}
        />
      )}

      {/* Dry Harvest Confirmation Modal */}
      {showHarvestDryModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto">
          <div className="bg-[#121316] border-0 sm:border border-neutral-800 rounded-none sm:rounded-3xl p-3 sm:p-6 w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#fce182] fill-[#fce182]" />
                Фінал Вирощування: Підтвердження Сухого Врожаю
              </h3>
              <button onClick={() => setShowHarvestDryModal(false)} className="text-neutral-400 hover:text-white cursor-pointer p-1 rounded-full hover:bg-neutral-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 font-medium leading-relaxed">
              Вітаємо! Ви пройшли повний шлях вирощування сорту <strong className="text-white">{plant.strain}</strong> від насінини до сухого суцвіття. Внесіть суху вагу для відкриття Журналу вирощування в акаунті!
            </p>

            <form onSubmit={handleConfirmDryHarvest} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Вага сухого врожаю (грами)</label>
                <input
                  type="number"
                  value={harvestYieldGrams}
                  onChange={(e) => setHarvestYieldGrams(Number(e.target.value))}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-3 font-extrabold text-[#d8f087] text-sm focus:outline-none focus:border-[#d8f087]"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Оцінка якості суцвіть (зірки 1-5)</label>
                <select
                  value={harvestRating}
                  onChange={(e) => setHarvestRating(Number(e.target.value))}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-3 font-bold text-white focus:outline-none focus:border-[#d8f087]"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5/5 - Преміум якість</option>
                  <option value={4}>⭐⭐⭐⭐ 4/5 - Гарний врожай</option>
                  <option value={3}>⭐⭐⭐ 3/5 - Нормальний результат</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Підсумковий коментар гровера</label>
                <textarea
                  rows={3}
                  value={harvestNotes}
                  onChange={(e) => setHarvestNotes(e.target.value)}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-3 font-medium text-xs text-white focus:outline-none focus:border-[#d8f087]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#d8f087] hover:bg-[#c4e06d] text-[#18181b] font-black rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Trophy className="w-4 h-4 fill-[#18181b] text-[#18181b]" />
                  <span>Підтвердити врожай (+150 XP)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grow Journal Modal Overlay */}
      {showJournalModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto">
          <div className="bg-[#121316] border-0 sm:border border-neutral-800 rounded-none sm:rounded-3xl w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] overflow-y-auto shadow-2xl relative flex flex-col text-white">
            <div className="sticky top-0 bg-[#18191c] border-b border-neutral-800 p-3 sm:p-4 flex items-center justify-between z-10 rounded-none sm:rounded-t-3xl">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#d8f087] text-[#18181b] rounded-xl font-bold">
                  <BookOpen className="w-5 h-5 text-[#18181b]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Журнал вирощування: {plant.name} ({plant.strain})
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium">
                    Повний цикл зафіксовано • Сухий врожай: {plant.harvestTrophy?.totalYieldGrams || 85} г
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowJournalModal(false)}
                className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-xl cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <GrowJournal
                plant={plant}
                onUpdatePlant={onUpdatePlant}
                onAwardTrophy={onAwardTrophy}
                onNavigateToAccount={onNavigateToAccount}
              />
            </div>
          </div>
        </div>
      )}

      {/* Substrate Recipe Confirmation Modal */}
      <SubstrateRecipeModal
        isOpen={isSubstrateConfirmModalOpen}
        onClose={() => setIsSubstrateConfirmModalOpen(false)}
        recipe={plant.substrateRecipe || getDefaultRecipeForMedium(plant.medium)}
        mediumType={plant.medium}
        onConfirmSubstrate={(confirmedRecipe) => {
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(`substrate_confirmed_${plant.id}`, 'true');
            } catch (e) {}
          }
          const updatedPlant: Plant = {
            ...plant,
            substrateRecipe: {
              ...confirmedRecipe,
              confirmed: true
            },
            currentPH: confirmedRecipe.targetPhMin
          };
          onUpdatePlant(updatedPlant);
          setIsSubstrateConfirmModalOpen(false);
          if (onAwardXP) onAwardXP(15, 'Підтверджено рецепт субстрату!');
          setLastRewardNotice('🌱 Субстрат підтверджено! Показники та рекомендації вирощування успішно адаптовано.');
          setTimeout(() => setLastRewardNotice(null), 4500);
        }}
        isConfirmationMode={true}
      />

      {/* Modal for Plant Transplant / Repotting */}
      {isTransplantModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto">
          <div className="bg-[#121316] border-0 sm:border border-neutral-800 rounded-none sm:rounded-3xl w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] overflow-y-auto p-2.5 sm:p-6 text-white space-y-3.5 sm:space-y-4 shadow-2xl animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#d8f087]/20 border border-[#d8f087]/30 rounded-2xl">
                  <Sprout className="w-5 h-5 text-[#d8f087]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                    🪴 Пересадка рослини
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium">
                    {plant.name} • Фаза: <span className="font-bold text-white">{stageLabelUk(plant.stage)}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTransplantModalOpen(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Substrate Selection Mode */}
            <div className="space-y-2.5 sm:space-y-3 w-full">
              <label className="text-xs font-extrabold text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#d8f087]" />
                <span>1. Вибір субстрату для пересадки:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {/* Option 1: Same substrate */}
                <button
                  type="button"
                  onClick={() => setTransplantSubstrateMode('same')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between w-full ${
                    transplantSubstrateMode === 'same'
                      ? 'bg-[#18191c] border-[#d8f087] ring-2 ring-[#d8f087]/30 text-white shadow-md'
                      : 'bg-[#18191c] border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black text-white">Такий самий субстрат</span>
                    {transplantSubstrateMode === 'same' && <CheckCircle2 className="w-4 h-4 text-[#d8f087] shrink-0" />}
                  </div>
                </button>

                {/* Option 2: New / Author / Custom substrate */}
                <button
                  type="button"
                  onClick={() => setTransplantSubstrateMode('new')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between w-full ${
                    transplantSubstrateMode === 'new'
                      ? 'bg-[#18191c] border-[#d8f087] ring-2 ring-[#d8f087]/30 text-white shadow-md'
                      : 'bg-[#18191c] border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black text-white">Інший / Авторський / Власний</span>
                    {transplantSubstrateMode === 'new' && <CheckCircle2 className="w-4 h-4 text-[#d8f087] shrink-0" />}
                  </div>
                </button>
              </div>

              {/* Substrate Selector when 'new' is chosen */}
              {transplantSubstrateMode === 'new' && (
                <div className="bg-[#18191c] border-y sm:border border-neutral-800 rounded-none sm:rounded-2xl -mx-2.5 sm:mx-0 p-2 sm:p-4 space-y-3 mt-1.5 w-[calc(100%+1.25rem)] sm:w-full min-w-0">
                  {/* 3-Tab Switcher: Авторські рецепти | Власний субстрат | Брендовий */}
                  <div className="grid grid-cols-3 gap-1 bg-[#121316] p-1 rounded-xl border border-neutral-800 w-full">
                    <button
                      type="button"
                      onClick={() => setTransplantChoiceType('recipe')}
                      className={`py-2 px-1.5 rounded-lg text-[11px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer w-full ${
                        transplantChoiceType === 'recipe'
                          ? 'bg-[#d8f087] text-[#18181b] shadow-2xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Авторські</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransplantChoiceType('custom')}
                      className={`py-2 px-1.5 rounded-lg text-[11px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer w-full ${
                        transplantChoiceType === 'custom'
                          ? 'bg-[#d8f087] text-[#18181b] shadow-2xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Власний (DIY)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransplantChoiceType('commercial')}
                      className={`py-2 px-1.5 rounded-lg text-[11px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer w-full ${
                        transplantChoiceType === 'commercial'
                          ? 'bg-[#d8f087] text-[#18181b] shadow-2xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Брендовий</span>
                    </button>
                  </div>

                  {/* TAB 1: Авторські субстрати світових гроверів (як у додаванні рослини) */}
                  {transplantChoiceType === 'recipe' && (
                    <div className="bg-[#121316] border-2 border-[#d8f087] rounded-xl sm:rounded-2xl p-2 sm:p-4 space-y-2.5 w-full min-w-0">
                      <div className="pb-1.5 border-b border-neutral-800">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-[#fce182] fill-[#fce182] shrink-0" />
                          <h4 className="text-xs font-black uppercase text-white tracking-wide">
                            Авторські рецепти субстрату
                          </h4>
                        </div>
                      </div>

                      <div>
                        <select
                          value={transplantAuthorRecipe.id}
                          onChange={(e) => {
                            const found = WORLD_GROWER_RECIPES.find(r => r.id === e.target.value);
                            if (found) {
                              setTransplantAuthorRecipe(JSON.parse(JSON.stringify(found)));
                            }
                          }}
                          className="w-full bg-[#18191c] border-2 border-[#d8f087] rounded-xl p-2.5 text-white text-xs font-black focus:outline-none focus:border-[#d8f087] cursor-pointer"
                        >
                          {recommendedTransplantWorldRecipes.map(r => (
                            <option key={r.id} value={r.id} className="bg-[#18191c] text-white">
                              {r.name} — {r.author}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Recipe Details Card */}
                      <div className="bg-[#18191c] border border-neutral-800 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 space-y-2.5 text-white w-full">
                        <div className="border-b border-neutral-800 pb-2 space-y-1.5">
                          <h5 className="text-xs font-black text-white leading-snug w-full">
                            {transplantAuthorRecipe.name}
                          </h5>

                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="text-[10px] text-neutral-300 font-bold truncate">
                              👨‍🌾 {(transplantAuthorRecipe as WorldGrowerRecipe).author || transplantAuthorRecipe.manufacturer}
                            </p>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] font-black bg-purple-900/60 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-md whitespace-nowrap">
                                pH {transplantAuthorRecipe.targetPhMin}–{transplantAuthorRecipe.targetPhMax}
                              </span>
                              <span className="text-[10px] font-black bg-[#fce182]/20 text-[#fce182] border border-[#fce182]/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                                PPM {transplantAuthorRecipe.targetPpmMin}–{transplantAuthorRecipe.targetPpmMax}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#121316] border border-neutral-800 rounded-xl p-2.5 text-white text-[11px] font-bold flex items-center gap-2">
                          <span className="shrink-0 text-base">🧪</span>
                          <div className="flex-1 leading-snug">
                            <span>{transplantAuthorRecipe.phTargetInfo || `Оптимальний pH субстрату: pH ${transplantAuthorRecipe.targetPhMin}–${transplantAuthorRecipe.targetPhMax}`}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-0.5">
                          <p className="text-[10px] font-black text-neutral-300 uppercase tracking-wider">
                            Детальний склад та поради до покупки:
                          </p>
                          {transplantAuthorRecipe.ingredients.map(ing => (
                            <div key={ing.id} className="bg-[#121316] border border-neutral-800 rounded-xl p-2 space-y-0.5">
                              <div className="flex items-center justify-between text-[11px] font-black text-white">
                                <span>{ing.name}</span>
                                <span className="bg-[#d8f087]/20 text-[#d8f087] border border-[#d8f087]/30 px-2 py-0.5 rounded-md text-[10px]">
                                  {ing.percentage}%
                                </span>
                              </div>
                              {ing.buyGuide ? (
                                <p className="text-[10px] text-neutral-300 font-medium leading-relaxed bg-[#18191c] p-1.5 rounded-lg border border-neutral-800">
                                  {ing.buyGuide}
                                </p>
                              ) : (
                                <p className="text-[10px] text-neutral-400 italic">
                                  🛒 Базовий компонент субстратної суміші.
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {transplantAuthorRecipe.notes && (
                          <p className="text-[10px] text-neutral-400 italic border-t border-neutral-800 pt-2 mt-1 leading-relaxed">
                            💡 {transplantAuthorRecipe.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Створення власного субстрату (DIY Конструктор) */}
                  {transplantChoiceType === 'custom' && (() => {
                    const totalPct = transplantCustomRecipe.ingredients.reduce((acc, ing) => acc + (Number(ing.percentage) || 0), 0);
                    return (
                      <div className="bg-[#121316] border-2 border-[#d8f087] rounded-2xl p-2 sm:p-4 space-y-3 w-full min-w-0">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                          <div>
                            <h4 className="text-xs font-black uppercase text-[#d8f087] tracking-wide flex items-center gap-1.5">
                              <Sliders className="w-3.5 h-3.5" />
                              <span>Конструктор власного субстрату</span>
                            </h4>
                            <p className="text-[10px] text-neutral-400 font-medium">
                              Налаштуйте власні пропорції складників, тип основи, pH та PPM
                            </p>
                          </div>
                          <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                            totalPct === 100
                              ? 'bg-[#d8f087]/15 text-[#d8f087] border-[#d8f087]/40'
                              : 'bg-amber-500/15 text-[#fad277] border-amber-500/40'
                          }`}>
                            Сума: {totalPct}%
                          </span>
                        </div>

                        {/* Назва рецепту */}
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-300 uppercase mb-1">
                            Назва вашого рецепту:
                          </label>
                          <input
                            type="text"
                            value={transplantCustomRecipe.name}
                            onChange={(e) => setTransplantCustomRecipe(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Напр.: Мій супер-ґрунт з біогумусом"
                            className="w-full bg-[#18191c] border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#d8f087]"
                          />
                        </div>

                        {/* Складники власного рецепту */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-neutral-300 uppercase tracking-wider">
                              Складники суміші ({transplantCustomRecipe.ingredients.length}):
                            </label>
                            {totalPct !== 100 && transplantCustomRecipe.ingredients.length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const sum = transplantCustomRecipe.ingredients.reduce((a, b) => a + (b.percentage || 1), 0) || 1;
                                  let running = 0;
                                  const normalized = transplantCustomRecipe.ingredients.map((ing, idx, arr) => {
                                    if (idx === arr.length - 1) {
                                      return { ...ing, percentage: Math.max(1, 100 - running) };
                                    }
                                    const scaled = Math.max(1, Math.round(((ing.percentage || 1) / sum) * 100));
                                    running += scaled;
                                    return { ...ing, percentage: scaled };
                                  });
                                  setTransplantCustomRecipe(prev => ({ ...prev, ingredients: normalized }));
                                }}
                                className="text-[10px] font-mono font-bold text-[#d8f087] hover:underline cursor-pointer"
                              >
                                Вирівняти до 100%
                              </button>
                            )}
                          </div>

                          <div className="space-y-1.5 max-h-52 overflow-y-auto overflow-x-hidden pr-0.5">
                            {transplantCustomRecipe.ingredients.map((ing, idx) => (
                              <div key={ing.id} className="bg-[#18191c] border border-neutral-800 rounded-xl p-2 overflow-hidden">
                                <div className="flex items-center gap-1.5 w-full min-w-0">
                                  <input
                                    type="text"
                                    value={ing.name}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setTransplantCustomRecipe(prev => {
                                        const next = [...prev.ingredients];
                                        next[idx] = { ...next[idx], name: val };
                                        return { ...prev, ingredients: next };
                                      });
                                    }}
                                    placeholder="Назва компонента..."
                                    className="flex-1 min-w-0 w-full bg-[#121316] border border-neutral-800 rounded-lg px-2 py-1 text-xs font-bold text-white truncate focus:outline-none focus:border-[#d8f087]"
                                  />
                                  <div className="shrink-0 flex items-center gap-1 bg-[#121316] border border-neutral-700 rounded-lg pl-2 pr-1 py-0.5">
                                    <input
                                      type="number"
                                      min={1}
                                      max={100}
                                      value={ing.percentage}
                                      onChange={(e) => {
                                        const val = Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0));
                                        setTransplantCustomRecipe(prev => {
                                          const next = [...prev.ingredients];
                                          next[idx] = { ...next[idx], percentage: val };
                                          return { ...prev, ingredients: next };
                                        });
                                      }}
                                      className="w-8 text-center text-xs font-black text-[#d8f087] bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="text-[10px] font-bold text-neutral-400">%</span>
                                    <div className="flex flex-col border-l border-neutral-800 pl-1 ml-0.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setTransplantCustomRecipe(prev => {
                                            const next = [...prev.ingredients];
                                            const cur = Number(next[idx].percentage) || 0;
                                            next[idx] = { ...next[idx], percentage: Math.min(100, cur + 1) };
                                            return { ...prev, ingredients: next };
                                          });
                                        }}
                                        className="p-0.5 text-neutral-300 hover:text-[#d8f087] active:scale-95 transition-all cursor-pointer leading-none"
                                        title="Збільшити %"
                                      >
                                        <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setTransplantCustomRecipe(prev => {
                                            const next = [...prev.ingredients];
                                            const cur = Number(next[idx].percentage) || 0;
                                            next[idx] = { ...next[idx], percentage: Math.max(1, cur - 1) };
                                            return { ...prev, ingredients: next };
                                          });
                                        }}
                                        className="p-0.5 text-neutral-300 hover:text-[#d8f087] active:scale-95 transition-all cursor-pointer leading-none"
                                        title="Зменшити %"
                                      >
                                        <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                                      </button>
                                    </div>
                                  </div>
                                  {transplantCustomRecipe.ingredients.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setTransplantCustomRecipe(prev => ({
                                          ...prev,
                                          ingredients: prev.ingredients.filter((_, i) => i !== idx)
                                        }));
                                      }}
                                      className="shrink-0 p-1 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                                      title="Видалити компонент"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Вибір та додавання складників (як у виборі субстрату) */}
                          <div className="pt-1">
                            <select
                              value=""
                              onChange={(e) => {
                                const selectedVal = e.target.value;
                                if (!selectedVal) return;
                                const allPresets: { name: string; pct: number; guide: string; medium?: 'Soil' | 'Coco' }[] = [
                                  { name: '🌱 Базовий торф\'яний ґрунт', pct: 50, guide: 'Базова поживна торф\'яна суміш', medium: 'Soil' },
                                  { name: '🌱 Верховий нейтралізований торф', pct: 40, guide: 'Повітряний верховий торф з вирівняним pH', medium: 'Soil' },
                                  { name: '🌱 Низинний поживний торф', pct: 30, guide: 'Багатий на гумінові кислоти темний торф', medium: 'Soil' },
                                  { name: '🌱 Чорнозем / Садова земля', pct: 40, guide: 'Природна поживна ґрунтова основа', medium: 'Soil' },
                                  { name: '🥥 Кокосове волокно (Coco Coir)', pct: 50, guide: 'Буферизований кокосовий субстрат високої аерації', medium: 'Coco' },
                                  { name: '🥥 Кокосові чіпси (Coco Chips)', pct: 20, guide: 'Крупна фракція кокосу для дренажу та кисню', medium: 'Coco' },
                                  { name: '⚪ Агроперліт (Perlite 2–4 мм)', pct: 20, guide: 'Аерація та дренаж кореневої зони' },
                                  { name: '✨ Вермикуліт (Vermiculite)', pct: 10, guide: 'Утримання вологи, калію та магнію' },
                                  { name: '🪱 Біогумус / Вермікомпост (Worm Castings)', pct: 15, guide: 'Органічний гумус і жива мікрофлора' },
                                  { name: '🍄 Мікориза та триходерма (Mycorrhiza)', pct: 5, guide: 'Симбіотичні гриби для розвитку коріння' },
                                  { name: '🌿 Мох Сфагнум (Sphagnum Moss)', pct: 10, guide: 'Природний антисептик та утримувач вологи' },
                                  { name: '🪨 Керамзит дренажний (Hydroton)', pct: 10, guide: 'Інертний дренаж та розпушувач' },
                                  { name: '🌋 Цеоліт вулканічний (Zeolite)', pct: 10, guide: 'Іонообмінний мінерал проти засолення' },
                                  { name: '🌋 Пемза / Вулканічна лава (Pumice)', pct: 15, guide: 'Довговічний пористий аератор субстрату' },
                                  { name: '🦇 Гуано кажанів (Bat Guano)', pct: 5, guide: 'Органічний фосфор і калій для цвітіння' },
                                  { name: '🪨 Доломітове борошно (Cal-Mag / pH буфер)', pct: 3, guide: 'Стабілізація pH та джерело кальцію і магнію' },
                                  { name: '🔥 Біовугілля / Деревне вугілля (Biochar)', pct: 5, guide: 'Фільтрація токсинів і дім для корисних бактерій' },
                                  { name: '🌾 Рисова лузга (Rice Hulls)', pct: 15, guide: 'Органічний розпушувач та джерело кремнію' },
                                  { name: '🦴 Кісткове борошно (Bone Meal)', pct: 5, guide: 'Повільне джерело фосфору та кальцію' },
                                  { name: '🌊 Борошно морських водоростей (Kelp Meal)', pct: 5, guide: 'Природні фітогормони, амінокислоти та мікроелементи' },
                                  { name: '💎 Діатоміт / Кремнезем (Silica)', pct: 5, guide: 'Зміцнення клітинних стінок та захист від стресу' },
                                  { name: '✏️ Свій складник', pct: 10, guide: 'Додатковий компонент суміші' },
                                ];
                                const chosen = allPresets.find(p => p.name === selectedVal);
                                if (!chosen) return;
                                setTransplantCustomRecipe(prev => ({
                                  ...prev,
                                  ...(chosen.medium === 'Soil' ? {
                                    mediumType: 'Soil',
                                    targetPhMin: 6.2,
                                    targetPhMax: 6.6,
                                    phTargetInfo: 'Оптимальний pH ґрунтової суміші: 6.2–6.6'
                                  } : chosen.medium === 'Coco' ? {
                                    mediumType: 'Coco',
                                    targetPhMin: 5.8,
                                    targetPhMax: 6.2,
                                    phTargetInfo: 'Оптимальний pH кокосової суміші: 5.8–6.2'
                                  } : {}),
                                  ingredients: [
                                    ...prev.ingredients,
                                    {
                                      id: `c-ing-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                                      name: chosen.name === '✏️ Свій складник' ? 'Новий компонент' : chosen.name,
                                      percentage: chosen.pct,
                                      buyGuide: chosen.guide
                                    }
                                  ]
                                }));
                              }}
                              className="w-full bg-[#18191c] border-2 border-[#d8f087] rounded-xl p-2.5 text-white text-xs font-black focus:outline-none focus:border-[#d8f087] cursor-pointer"
                            >
                              <option value="" className="bg-[#18191c] text-neutral-400">
                                + Додати складник у суміш (виберіть зі списку)...
                              </option>
                              <option value="🌱 Базовий торф'яний ґрунт" className="bg-[#18191c] text-white">🌱 Базовий торф&apos;яний ґрунт (50%)</option>
                              <option value="🌱 Верховий нейтралізований торф" className="bg-[#18191c] text-white">🌱 Верховий нейтралізований торф (40%)</option>
                              <option value="🌱 Низинний поживний торф" className="bg-[#18191c] text-white">🌱 Низинний поживний торф (30%)</option>
                              <option value="🌱 Чорнозем / Садова земля" className="bg-[#18191c] text-white">🌱 Чорнозем / Садова земля (40%)</option>
                              <option value="🥥 Кокосове волокно (Coco Coir)" className="bg-[#18191c] text-white">🥥 Кокосове волокно / Coco Coir (50%)</option>
                              <option value="🥥 Кокосові чіпси (Coco Chips)" className="bg-[#18191c] text-white">🥥 Кокосові чіпси / Coco Chips (20%)</option>
                              <option value="⚪ Агроперліт (Perlite 2–4 мм)" className="bg-[#18191c] text-white">⚪ Агроперліт / Perlite 2–4 мм (20%)</option>
                              <option value="✨ Вермикуліт (Vermiculite)" className="bg-[#18191c] text-white">✨ Вермикуліт / Vermiculite (10%)</option>
                              <option value="🪱 Біогумус / Вермікомпост (Worm Castings)" className="bg-[#18191c] text-white">🪱 Біогумус / Вермікомпост (15%)</option>
                              <option value="🍄 Мікориза та триходерма (Mycorrhiza)" className="bg-[#18191c] text-white">🍄 Мікориза та триходерма (5%)</option>
                              <option value="🌿 Мох Сфагнум (Sphagnum Moss)" className="bg-[#18191c] text-white">🌿 Мох Сфагнум / Sphagnum Moss (10%)</option>
                              <option value="🪨 Керамзит дренажний (Hydroton)" className="bg-[#18191c] text-white">🪨 Керамзит дренажний / Hydroton (10%)</option>
                              <option value="🌋 Цеоліт вулканічний (Zeolite)" className="bg-[#18191c] text-white">🌋 Цеоліт вулканічний / Zeolite (10%)</option>
                              <option value="🌋 Пемза / Вулканічна лава (Pumice)" className="bg-[#18191c] text-white">🌋 Пемза / Вулканічна лава (15%)</option>
                              <option value="🦇 Гуано кажанів (Bat Guano)" className="bg-[#18191c] text-white">🦇 Гуано кажанів / Bat Guano (5%)</option>
                              <option value="🪨 Доломітове борошно (Cal-Mag / pH буфер)" className="bg-[#18191c] text-white">🪨 Доломітове борошно / pH буфер (3%)</option>
                              <option value="🔥 Біовугілля / Деревне вугілля (Biochar)" className="bg-[#18191c] text-white">🔥 Біовугілля / Biochar (5%)</option>
                              <option value="🌾 Рисова лузга (Rice Hulls)" className="bg-[#18191c] text-white">🌾 Рисова лузга / Rice Hulls (15%)</option>
                              <option value="🦴 Кісткове борошно (Bone Meal)" className="bg-[#18191c] text-white">🦴 Кісткове борошно / Bone Meal (5%)</option>
                              <option value="🌊 Борошно морських водоростей (Kelp Meal)" className="bg-[#18191c] text-white">🌊 Борошно морських водоростей / Kelp (5%)</option>
                              <option value="💎 Діатоміт / Кремнезем (Silica)" className="bg-[#18191c] text-white">💎 Діатоміт / Кремнезем (5%)</option>
                              <option value="✏️ Свій складник" className="bg-[#18191c] text-[#d8f087]">✏️ Свій складник (ввести вручну)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* TAB 3: Брендовий субстрат виробника */}
                  {transplantChoiceType === 'commercial' && (
                    <div className="bg-[#121316] border-2 border-[#d8f087] rounded-2xl p-2 sm:p-4 space-y-2.5 w-full min-w-0">
                      <div className="pb-1.5 border-b border-neutral-800">
                        <h4 className="text-xs font-black uppercase text-white tracking-wide flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Брендовий субстрат</span>
                        </h4>
                        <p className="text-[10px] text-neutral-400 font-medium">
                          Вибір готової фабричної суміші від виробника
                        </p>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-neutral-300 block mb-1">Виробник субстрату:</label>
                        <select
                          value={transplantSelectedManufacturer}
                          onChange={(e) => {
                            setTransplantSelectedManufacturer(e.target.value);
                            const presets = PRESET_SUBSTRATE_RECIPES.filter(r => r.manufacturer === e.target.value);
                            if (presets.length > 0) setTransplantSelectedRecipeId(presets[0].id);
                          }}
                          className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#d8f087] cursor-pointer"
                        >
                          {SUBSTRATE_MANUFACTURERS.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-neutral-300 block mb-1">Субстрат:</label>
                        <select
                          value={transplantSelectedRecipeId}
                          onChange={(e) => setTransplantSelectedRecipeId(e.target.value)}
                          className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#d8f087] cursor-pointer"
                        >
                          {PRESET_SUBSTRATE_RECIPES.filter(r => r.manufacturer === transplantSelectedManufacturer).map(r => (
                            <option key={r.id} value={r.id}>{r.name} ({r.mediumType === 'Soil' ? '🌱 Ґрунт' : '🥥 Кокос'})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 2: New Pot Size & Type Selection */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between flex-wrap gap-1.5">
                <label className="text-xs font-extrabold text-neutral-300 uppercase tracking-wide">
                  2. Новий об&apos;єм та типаж горщика:
                </label>
                <span className="text-xs font-black text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  Поточний: {currentPotSize < 1 ? `${Math.round(currentPotSize * 1000)}г` : `${currentPotSize}л`} → Новий: {transplantNewPotSize < 1 ? `${Math.round(transplantNewPotSize * 1000)}г (${transplantNewPotSize.toFixed(1)} л)` : `${transplantNewPotSize} л`}
                </span>
              </div>

              {/* Pot Type buttons */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-400 block">Типаж нового горщика:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransplantPotType('fabric')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                      transplantPotType === 'fabric'
                        ? 'bg-[#d8f087] text-[#18181b] border-[#d8f087] font-black shadow-md'
                        : 'bg-[#18191c] text-neutral-300 hover:border-neutral-700 border-neutral-800'
                    }`}
                  >
                    <span>🪴 Тканина (SmartPot)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransplantPotType('plastic')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                      transplantPotType === 'plastic'
                        ? 'bg-[#d8f087] text-[#18181b] border-[#d8f087] font-black shadow-md'
                        : 'bg-[#18191c] text-neutral-300 hover:border-neutral-700 border-neutral-800'
                    }`}
                  >
                    <span>🪣 Пластиковий</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransplantPotType('airpot')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                      transplantPotType === 'airpot'
                        ? 'bg-[#d8f087] text-[#18181b] border-[#d8f087] font-black shadow-md'
                        : 'bg-[#18191c] text-neutral-300 hover:border-neutral-700 border-neutral-800'
                    }`}
                  >
                    <span>💨 Air-Pot</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#18191c] border border-neutral-800 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0.1}
                    max={100}
                    step={transplantNewPotSize < 2 ? 0.1 : transplantNewPotSize < 10 ? 0.5 : 1}
                    value={transplantNewPotSize}
                    onChange={(e) => setTransplantNewPotSize(parseFloat(e.target.value))}
                    className="w-full h-2.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-[#d8f087]"
                  />
                  <div className="shrink-0 bg-[#121316] border border-neutral-800 rounded-xl px-2.5 py-1 text-center min-w-[80px]">
                    <span className="text-xs font-black text-[#d8f087]">
                      {transplantNewPotSize < 1 ? `${Math.round(transplantNewPotSize * 1000)} г` : `${transplantNewPotSize} л`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-[10px] font-bold text-neutral-500 px-1">
                  <span>100 г (0.1л)</span>
                  <span>1 л</span>
                  <span>5 л</span>
                  <span>15 л</span>
                  <span>50 л</span>
                  <span>100 л</span>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  let finalRecipe = plant.substrateRecipe || getDefaultRecipeForMedium(plant.medium);
                  if (transplantSubstrateMode === 'new') {
                    if (transplantChoiceType === 'recipe') {
                      finalRecipe = JSON.parse(JSON.stringify(transplantAuthorRecipe));
                    } else if (transplantChoiceType === 'custom') {
                      finalRecipe = {
                        ...JSON.parse(JSON.stringify(transplantCustomRecipe)),
                        name: transplantCustomRecipe.name.trim() || `Власний мікс (${plant.name})`,
                      };
                    } else {
                      const foundPreset = PRESET_SUBSTRATE_RECIPES.find(r => r.id === transplantSelectedRecipeId);
                      if (foundPreset) finalRecipe = JSON.parse(JSON.stringify(foundPreset));
                    }
                  }
                  finalRecipe = {
                    ...finalRecipe,
                    confirmed: true
                  };

                  if (typeof window !== 'undefined') {
                    try {
                      localStorage.setItem(`substrate_confirmed_${plant.id}`, 'true');
                      localStorage.setItem(`transplanted_${plant.id}_${plant.stage}`, 'true');
                      localStorage.setItem(`plant_pot_size_${plant.id}`, String(transplantNewPotSize));
                    } catch (e) {}
                  }

                  const nextWaterVol = Math.max(0.2, Number((transplantNewPotSize * 0.20).toFixed(1)));
                  setSolutionVolume(nextWaterVol);

                  const updatedPlant: Plant = {
                    ...plant,
                    potSize: transplantNewPotSize,
                    potType: transplantPotType,
                    substrateRecipe: finalRecipe,
                    medium: finalRecipe.mediumType || plant.medium,
                    lastTransplantedStage: plant.stage,
                    currentPH: finalRecipe.targetPhMin || plant.currentPH
                  };

                  onUpdatePlant(updatedPlant);
                  setIsTransplantModalOpen(false);
                  if (onAwardXP) onAwardXP(25, 'Рослину успішно пересаджено!');
                  const displaySize = transplantNewPotSize < 1 ? `${Math.round(transplantNewPotSize * 1000)} г` : `${transplantNewPotSize} л`;
                  setLastRewardNotice(`🌱 Успішно пересаджено ${plant.name} у горщик ${displaySize} (${finalRecipe.name})!`);
                  setTimeout(() => setLastRewardNotice(null), 5000);
                }}
                className="w-full py-3 bg-[#d8f087] hover:bg-[#cbe37a] text-[#18181b] font-black text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sprout className="w-5 h-5 text-[#18181b]" />
                <span>Підтвердити пересадку ({transplantNewPotSize < 1 ? `${Math.round(transplantNewPotSize * 1000)} г` : `${transplantNewPotSize} л`})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

SinglePlantCardWindow.displayName = 'SinglePlantCardWindow';

export const PlantOverview: React.FC<PlantOverviewProps> = ({
  plant,
  plants = [],
  activePlantId,
  onSelectPlant,
  onOpenAddPlant,
  onDeletePlant,
  onUpdatePlant,
  onOpenDoctorWithPlant,
  onOpenReminders,
  tasks,
  userStats,
  onCompleteTask,
  onAddTask,
  onAwardTrophy,
  onAwardXP,
  onNavigateToAccount,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlantToDeleteId, setSelectedPlantToDeleteId] = useState<string>('');
  const [expandedPlantId, setExpandedPlantId] = useState<string | null>(null);

  const allPlants = plants.length > 0 ? plants : [plant];

  // Sort plants so those maturing earlier appear at the top
  const sortedPlants = [...allPlants].sort((a, b) => {
    return getRemainingDaysToHarvest(a) - getRemainingDaysToHarvest(b);
  });

  const [activePlantIndex, setActivePlantIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    const containerCenter = scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activePlantIndex) {
      setActivePlantIndex(closestIndex);
      if (onSelectPlant && sortedPlants[closestIndex]) {
        onSelectPlant(sortedPlants[closestIndex].id);
      }
    }
  };

  const scrollToPlant = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    const targetIndex = Math.max(0, Math.min(index, sortedPlants.length - 1));
    const container = scrollContainerRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    if (children[targetIndex]) {
      const target = children[targetIndex];
      const scrollLeft = target.offsetLeft - (container.clientWidth - target.clientWidth) / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      setActivePlantIndex(targetIndex);
      if (onSelectPlant && sortedPlants[targetIndex]) {
        onSelectPlant(sortedPlants[targetIndex].id);
      }
    }
  }, [sortedPlants, onSelectPlant]);

  useEffect(() => {
    if (!expandedPlantId && scrollContainerRef.current) {
      const timer = setTimeout(() => {
        scrollToPlant(activePlantIndex);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [expandedPlantId, activePlantIndex, scrollToPlant]);

  // Listen to custom event when user clicks "Перейти" in notification bell or selects plant externally
  useEffect(() => {
    const handleExpandEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ plantId: string }>;
      const targetId = customEvent.detail?.plantId;
      if (targetId) {
        const idx = sortedPlants.findIndex((p) => p.id === targetId);
        if (idx !== -1) {
          setActivePlantIndex(idx);
          setTimeout(() => {
            scrollToPlant(idx);
          }, 40);
        }
        setExpandedPlantId(targetId);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('select-plant-and-expand', handleExpandEvent);
      return () => {
        window.removeEventListener('select-plant-and-expand', handleExpandEvent);
      };
    }
  }, [sortedPlants, scrollToPlant]);

  // Sync activePlantIndex when activePlantId changes
  useEffect(() => {
    if (activePlantId) {
      const idx = sortedPlants.findIndex((p) => p.id === activePlantId);
      if (idx !== -1 && idx !== activePlantIndex) {
        const timer = setTimeout(() => {
          setActivePlantIndex(idx);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [activePlantId, sortedPlants, activePlantIndex]);

  const roomPlant = sortedPlants[0] || plant;
  const roomVpdStatus = calculateVPD(roomPlant.currentTemp, roomPlant.currentHumidity, roomPlant.stage);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Shared Room 1 Climate & Growth Metrics (Above Plant Cards) */}
      <RoomClimateCard roomPlant={roomPlant} />

      {/* Horizontal Swipeable Plant Cards Carousel */}
      <div className="space-y-3">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={`flex items-start w-full min-w-0 max-w-full py-1 overflow-x-auto snap-x snap-mandatory no-scrollbar [touch-action:pan-x_pan-y] gap-4 ${
            sortedPlants.length > 1 ? 'scroll-smooth' : ''
          }`}
        >
          {sortedPlants.map((p) => {
            return (
              <div
                key={p.id}
                id={`plant-card-${p.id}`}
                className="w-full min-w-full max-w-full snap-center shrink-0 flex flex-col transition-all duration-200 overflow-hidden"
              >
                <SinglePlantCardWindow
                  key={p.id}
                  plant={p}
                  defaultExpanded={false}
                  isExpandedControlled={expandedPlantId === p.id}
                  onToggleExpandControlled={() => {
                    setExpandedPlantId((prev) => (prev === p.id ? null : p.id));
                  }}
                  onSetExpandedControlled={(expand) => {
                    setExpandedPlantId(expand ? p.id : null);
                  }}
                  onUpdatePlant={onUpdatePlant}
                  onOpenDoctorWithPlant={onOpenDoctorWithPlant}
                  onOpenReminders={onOpenReminders}
                  tasks={tasks}
                  userStats={userStats}
                  onCompleteTask={onCompleteTask}
                  onAddTask={onAddTask}
                  onAwardTrophy={onAwardTrophy}
                  onAwardXP={onAwardXP}
                  onNavigateToAccount={onNavigateToAccount}
                  onRequestDeletePlant={(plantId) => {
                    setSelectedPlantToDeleteId(plantId);
                    setIsDeleteModalOpen(true);
                  }}
                />
              </div>
            );
          })}
        </div>

        {sortedPlants.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {sortedPlants.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => scrollToPlant(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activePlantIndex === idx
                    ? 'w-6 bg-[#d8f087]'
                    : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                }`}
                aria-label={`Кущ ${p.name}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Header Bar for Room 1 */}
      <RoomHeader
        sortedPlants={sortedPlants}
        activePlantId={activePlantId || ''}
        onOpenAddPlant={onOpenAddPlant}
        onOpenDeleteModal={(plantId) => {
          setSelectedPlantToDeleteId(plantId);
          setIsDeleteModalOpen(true);
        }}
      />

      {/* Delete Plant Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto animate-fade-in">
          <div className="bg-[#121316] rounded-none sm:rounded-3xl p-3 sm:p-6 w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] shadow-2xl space-y-4 border-0 sm:border border-neutral-800 text-white">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-rose-500 font-black text-base">
                <Trash2 className="w-5 h-5" />
                <span>Видалення рослини</span>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sortedPlants.length <= 1 ? (
              <div className="space-y-4 text-center py-2">
                <p className="text-sm text-neutral-300 font-medium">
                  В Кімнаті 1 залишилася лише одна рослина (<strong className="text-white">{sortedPlants[0]?.name}</strong>).
                </p>
                <p className="text-xs text-[#fce182] bg-[#fce182]/10 p-3.5 rounded-2xl border border-[#fce182]/20 font-semibold leading-relaxed">
                  ⚠️ У кімнаті завжди має бути принаймні одна рослина. Щоб видалити її, спочатку додайте інший кущ.
                </p>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full bg-[#d8f087] hover:bg-[#c4e06d] text-[#18181b] font-black text-sm py-3 rounded-2xl transition-all cursor-pointer shadow-xs"
                >
                  Зрозуміло
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-neutral-300 font-medium">
                  Оберіть кущ з Кімнати 1, який ви бажаєте видалити:
                </p>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {sortedPlants.map((p) => (
                    <label
                      key={p.id}
                      onClick={() => setSelectedPlantToDeleteId(p.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        selectedPlantToDeleteId === p.id
                          ? 'bg-rose-950/40 border-rose-800 ring-2 ring-rose-500/20 text-white'
                          : 'bg-[#18191c] border-neutral-800 hover:bg-neutral-800 text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🌿</span>
                        <div>
                          <div className="text-sm font-black text-white">{p.name}</div>
                          <div className="text-xs text-neutral-400 font-semibold">
                            {p.strain} • {stageLabelUk(p.stage)}
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="plantToDelete"
                        checked={selectedPlantToDeleteId === p.id}
                        onChange={() => setSelectedPlantToDeleteId(p.id)}
                        className="accent-rose-500 w-4 h-4 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-black text-xs py-3 rounded-2xl transition-all cursor-pointer"
                  >
                    Скасувати
                  </button>
                  <button
                    onClick={() => {
                      if (selectedPlantToDeleteId && onDeletePlant) {
                        onDeletePlant(selectedPlantToDeleteId);
                        setIsDeleteModalOpen(false);
                      }
                    }}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-3 rounded-2xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Видалити</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
