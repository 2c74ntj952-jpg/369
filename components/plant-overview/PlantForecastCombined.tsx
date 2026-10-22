'use client';

import React, { useState, useEffect } from 'react';
import { Plant, GrowthPrediction } from '@/lib/types';
import { getPlantMetricsAnalytics, calculatePlantVitalityAndHealth, getEstimatedCurrentMoisture } from '@/lib/metricsLogger';
import {
  Sparkles,
  RefreshCw,
  FlaskConical,
  Zap,
  Droplets,
  Brain,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Sun,
  Thermometer,
  Calendar,
  Layers,
  ChevronRight,
  AlertTriangle,
  Skull
} from 'lucide-react';
import { PlantMetricsChart } from '@/components/PlantMetricsChart';
import { motion } from 'motion/react';
import { safeFetchJson } from '@/lib/utils';

interface PlantForecastCombinedProps {
  plant: Plant;
}

interface InsightsData {
  phInsight: {
    status: string;
    delta: string;
    analysis: string;
  };
  ppmInsight: {
    status: string;
    delta: string;
    analysis: string;
  };
  moistureInsight: {
    dryingRateDays: string;
    aerationQuality: string;
    analysis: string;
  };
  aiLearningLevel: {
    level: number;
    levelTitle: string;
    accuracyPercent: number;
    totalDataPoints: number;
    summary: string;
  };
}

const stageLabelUk = (stage?: string) => {
  switch (stage) {
    case 'germination': return 'Пророщування';
    case 'seedling': return 'Розсада';
    case 'vegetative': return 'Вегетація';
    case 'flowering': return 'Цвітіння';
    case 'harvest': return 'Врожай';
    default: return stage || 'Вегетація';
  }
};

export const PlantForecastCombined: React.FC<PlantForecastCombinedProps> = ({ plant }) => {
  const [prediction, setPrediction] = useState<GrowthPrediction | null>(null);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Local metrics analytics & dynamic vitality
  const localAnalytics = getPlantMetricsAnalytics(plant);
  const vitality = calculatePlantVitalityAndHealth(plant);
  const liveMoisture = getEstimatedCurrentMoisture(plant);
  const historyEntries = plant.history || plant.metricsHistory || [];

  // Values calculation
  const currentPh = plant.phAfterWatering ?? plant.currentPH ?? 6.3;
  const prePh = plant.phBeforeWatering ?? 6.5;
  const phDiff = Number((currentPh - prePh).toFixed(1));

  const currentPpm = plant.ppmAfterWatering ?? plant.ppmBeforeWatering ?? 650;
  const prePpm = plant.ppmBeforeWatering;
  const ppmDiff = prePpm ? currentPpm - prePpm : -120;

  const currentMoisture = liveMoisture;
  const targetMoisturePost = plant.moistureAfterWatering ?? 75;
  const targetPpmPost = plant.ppmAfterWatering ?? (plant.stage === 'flowering' ? 950 : 650);
  const targetPpfd = plant.lightPPFD ?? (plant.stage === 'flowering' ? 700 : 520);
  const targetPh = plant.phAfterWatering ?? plant.currentPH ?? 6.3;

  const totalPoints = Math.max(1, historyEntries.length);
  const currentLevel = Math.min(4, Math.max(1, Math.floor(totalPoints / 2) + 1));
  const accuracy = Math.min(98, 70 + totalPoints * 5);

  const fallbackInsights: InsightsData = vitality.status === 'dead' ? {
    phInsight: {
      status: 'Метаболізм зупинено',
      delta: '—',
      analysis: `Рослина висохла через відсутність поливу (${vitality.daysSinceWatered} дн. без води). Іонний обмін та дихання коренів повністю припинено.`
    },
    ppmInsight: {
      status: 'Всмоктування припинено',
      delta: '0 PPM',
      analysis: 'Коренева система відмерла від тривалої посухи. Поглинання мінералів неможливе.'
    },
    moistureInsight: {
      dryingRateDays: 'Субстрат висох (0%)',
      aerationQuality: 'Критична посуха',
      analysis: `Вологість субстрату 0% понад критичний поріг виживання (${vitality.daysBoneDry} дн. повної сухості). Рослина загинула.`
    },
    aiLearningLevel: {
      level: 4,
      levelTitle: 'Критичний аналіз: Загибель',
      accuracyPercent: 99,
      totalDataPoints: totalPoints,
      summary: `ШІ зафіксував повне висихання субстрату та загибель рослини через прострочення поливу на ${vitality.daysSinceWatered} днів.`
    }
  } : vitality.status === 'critical' ? {
    phInsight: {
      status: 'Увага: Водний колапс',
      delta: `ΔpH ${phDiff >= 0 ? '+' : ''}${phDiff}`,
      analysis: `Через екстремальну сухість (${liveMoisture}%) солі в субстраті концентруються, спричиняючи опік коренів.`
    },
    ppmInsight: {
      status: 'Дефіцит вологи',
      delta: 'Критична концентрація',
      analysis: 'Коріння блокується через відсутність рідкої фази. Необхідний терміновий полив чистою водою.'
    },
    moistureInsight: {
      dryingRateDays: '0-1 дні до загибелі',
      aerationQuality: 'Потрібен терміновий полив',
      analysis: `Вологість впала до критичних ${liveMoisture}%. Тургор втрачається, терміново врятуйте рослину!`
    },
    aiLearningLevel: {
      level: currentLevel,
      levelTitle: 'Екстрений моніторинг',
      accuracyPercent: 90,
      totalDataPoints: totalPoints,
      summary: `Критична небезпека: вологість ${liveMoisture}%, прострочено полив. Потрібна негайна дія для збереження рослини.`
    }
  } : {
    phInsight: {
      status: currentPh < 6.0 ? 'Увага: Закислення' : currentPh > 6.8 ? 'Увага: Підлущення' : 'Оптимальний pH',
      delta: `ΔpH ${phDiff >= 0 ? '+' : ''}${phDiff} (між розчином та субстратом)`,
      analysis: `Поточний pH ${currentPh} у межах ${currentPh >= 6.0 && currentPh <= 6.5 ? 'ідеального коридору засвоєння N-P-K' : 'нормальної зони росту'}. ШІ оптимізує баланс елементів.`
    },
    ppmInsight: {
      status: ppmDiff > 150 ? 'Накопичення солей' : 'Активне споживання',
      delta: `ΔPPM ${ppmDiff >= 0 ? '+' : ''}${ppmDiff} PPM`,
      analysis: `Рослина ${plant.strain} демонструє ${ppmDiff < 0 ? 'інтенсивний апетит та здорове всмоктування мінералів' : 'помірний сольовий баланс у субстраті'}.`
    },
    moistureInsight: {
      dryingRateDays: `${localAnalytics.dailyDryingRate > 0 ? (25 / localAnalytics.dailyDryingRate).toFixed(1) : '2-3'} дні`,
      aerationQuality: 'Відмінна',
      analysis: `Швидкість висихання субстрату (~${localAnalytics.dailyDryingRate}%/день) свідчить про хорошу аерацію та активне дихання коріння.`
    },
    aiLearningLevel: {
      level: currentLevel,
      levelTitle: currentLevel === 1 ? 'Фаза 1: Базове калібрування' : currentLevel === 2 ? 'Фаза 2: Аналіз динаміки' : currentLevel === 3 ? 'Фаза 3: Предиктивна рецептура' : 'Фаза 4: Персоналізована AI-модель',
      accuracyPercent: accuracy,
      totalDataPoints: totalPoints,
      summary: `Проаналізовано ${totalPoints} замірів. Динаміка pH та PPM відповідає фазі "${stageLabelUk(plant.stage)}".`
    }
  };

  const displayInsights = insights || fallbackInsights;

  // Unified data fetching (both prediction and insights in single flow)
  const refreshAllForecastData = async () => {
    setLoading(true);
    try {
      const cleanPlant = {
        id: String(plant?.id || ''),
        name: String(plant?.name || ''),
        strain: String(plant?.strain || ''),
        breeder: String(plant?.breeder || ''),
        stage: String(plant?.stage || ''),
        stageDay: Number(plant?.stageDay || 1),
        medium: String(plant?.medium || ''),
        potSize: Number(plant?.potSize || 10),
        lastWatered: plant?.lastWatered || null,
        healthScore: vitality.healthScore,
        vitalityStatus: vitality.status,
        vitalityScore: vitality.healthScore,
        estimatedCurrentMoisture: liveMoisture,
        daysSinceWatered: vitality.daysSinceWatered,
        overdueDays: vitality.overdueDays,
        phBeforeWatering: plant?.phBeforeWatering ?? null,
        phAfterWatering: plant?.phAfterWatering ?? null,
        currentPH: plant?.currentPH ?? null,
        ppmBeforeWatering: plant?.ppmBeforeWatering ?? null,
        ppmAfterWatering: plant?.ppmAfterWatering ?? null,
        moistureBeforeWatering: liveMoisture,
        moistureAfterWatering: plant?.moistureAfterWatering ?? null,
        lightPPFD: plant?.lightPPFD ?? null,
        currentTemp: plant?.currentTemp ?? null,
        currentHumidity: plant?.currentHumidity ?? null,
        history: Array.isArray(plant?.history) ? plant.history.slice(-20) : []
      };

      const [predData, insData] = await Promise.all([
        safeFetchJson<{ success?: boolean; prediction?: GrowthPrediction }>('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'predict_growth', plant: cleanPlant })
        }),
        safeFetchJson<{ success?: boolean; insights?: any }>('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'analyze_insights', plant: cleanPlant })
        })
      ]);

      if (predData?.success && predData.prediction) {
        setPrediction(predData.prediction);
      }

      if (insData?.success && insData.insights) {
        setInsights(insData.insights);
      }
    } catch {
      // Safe fallback already active
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllForecastData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plant.id, plant.stage, plant.stageDay, plant.history?.length]);

  return (
    <div className="space-y-4 pt-1 text-[#18181b]">
      {/* 1. Header Bar */}
      <div className="border-b border-black/15 pb-3 space-y-1.5">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-black/10 border border-black/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#18181b] fill-[#18181b]" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
              <h3 className="text-xs sm:text-base font-black text-[#18181b] leading-tight break-words">
                ⚡ Прогноз та Аналітика Росту
              </h3>
              <span className="text-[10px] bg-[#18181b] text-white px-2 py-0.5 rounded-md font-bold uppercase truncate max-w-[120px]">
                {plant.strain}
              </span>
              <span className="text-[10px] bg-black/10 text-[#18181b] px-2 py-0.5 rounded-md font-extrabold">
                {stageLabelUk(plant.stage)} ({plant.stageDay || 1} дн.)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={refreshAllForecastData}
            disabled={loading}
            className="flex items-center gap-1.5 bg-[#18181b] hover:bg-black active:scale-95 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer shrink-0 transition-all shadow-xs"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-[#fad277]' : 'text-emerald-300'}`} />
            <span>{loading ? 'Оновлення...' : 'Оновити прогноз'}</span>
          </button>
        </div>
        <p className="text-[11px] text-[#18181b]/80 font-bold sm:pl-10 leading-snug">
          Єдиний центр аналітики: прогноз врожаю, здоров&apos;я коріння (pH/PPM/вологість), цільові орієнтири та графік динаміки
        </p>
      </div>

      {/* 2. Key Forecast Metrics: Harvest & Potential (Non-duplicated, high-level summary) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5">
        <div className="bg-[#fad277] p-2.5 sm:p-3 rounded-xl border border-black/15 shadow-xs">
          <span className="text-[9.5px] uppercase text-[#18181b]/80 font-black block mb-0.5">До Врожаю</span>
          <div className="text-lg sm:text-xl font-black text-[#18181b]">
            {vitality.status === 'dead' ? (
              <span className="text-rose-800 font-black">0 тижн.</span>
            ) : (
              <>~{prediction?.estimatedHarvestWeeks || Math.max(1, Math.round((plant.totalStageDays - plant.stageDay) / 7))} <span className="text-xs font-bold">тижн.</span></>
            )}
          </div>
          <span className="text-[9px] text-[#18181b]/70 font-semibold truncate block">
            {vitality.status === 'dead' ? 'Цикл припинено' : 'Орієнтовний збір'}
          </span>
        </div>

        <div className="bg-[#fad277] p-2.5 sm:p-3 rounded-xl border border-black/15 shadow-xs">
          <span className="text-[9.5px] uppercase text-[#18181b]/80 font-black block mb-0.5">Прогноз Ваги</span>
          <div className={`text-lg sm:text-xl font-black ${vitality.status === 'dead' ? 'text-rose-800' : vitality.status === 'critical' ? 'text-amber-800' : 'text-emerald-800'}`}>
            {vitality.status === 'dead' ? (
              <span>0 г (Втрачено)</span>
            ) : (
              <>~{prediction?.estimatedYieldGrams || (vitality.status === 'critical' ? 10 : 75)} <span className="text-xs font-bold">г / кущ</span></>
            )}
          </div>
          <span className="text-[9px] text-[#18181b]/70 font-semibold truncate block">
            {vitality.status === 'dead' ? 'Урожай загинув' : 'Сухий врожай'}
          </span>
        </div>

        <div className="bg-[#fad277] p-2.5 sm:p-3 rounded-xl border border-black/15 shadow-xs">
          <span className="text-[9.5px] uppercase text-[#18181b]/80 font-black block mb-0.5">Потенціал Сорту</span>
          <div className="text-xs sm:text-sm font-black text-[#18181b] truncate mt-1">
            {vitality.status === 'dead' ? '0 г (Загибель)' : (prediction?.breederPotentialYield || '450–550 г/м²')}
          </div>
          <span className="text-[9px] text-[#18181b]/70 font-semibold truncate block">Паспорт генетики</span>
        </div>

        <div className="bg-[#fad277] p-2.5 sm:p-3 rounded-xl border border-black/15 shadow-xs">
          <span className="text-[9.5px] uppercase text-[#18181b]/80 font-black block mb-0.5">Статус Ризиків</span>
          <div className="text-xs font-bold text-[#18181b] mt-1 flex items-center gap-1">
            {vitality.status === 'dead' ? (
              <span className="text-rose-800 font-black flex items-center gap-1">
                <Skull className="w-3.5 h-3.5" /> Загибель рослини
              </span>
            ) : vitality.status === 'critical' ? (
              <span className="text-rose-700 font-black flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Критичний дефіцит
              </span>
            ) : (
              <span className={prediction?.moldRiskLevel === 'Високий' ? 'text-rose-700 font-black' : 'text-emerald-800 font-black'}>
                Пліснява: {prediction?.moldRiskLevel || 'Низький'}
              </span>
            )}
          </div>
          <span className="text-[9px] text-[#18181b]/70 font-semibold truncate block">
            {vitality.status === 'dead' ? `${vitality.daysSinceWatered} дн. без поливу` : prediction?.lightBurnRisk ? '⚠️ Ризик опіку' : '✅ Оптимально'}
          </span>
        </div>
      </div>

      {/* 3. Combined Root Dynamics (pH, PPM, Moisture) - Об'єднано без дублювання */}
      <div className="bg-[#fad277] rounded-2xl border border-black/15 p-3.5 sm:p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between gap-2 border-b border-black/10 pb-2">
          <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm text-[#18181b]">
            <Brain className="w-4 h-4 text-purple-700 stroke-[2.5]" />
            <span>Аналітика споживання коріння та цільові орієнтири</span>
          </div>
          <span className="text-[10px] font-black bg-purple-100/90 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-full">
            Точність моделі: {displayInsights.aiLearningLevel.accuracyPercent}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* pH Cell */}
          <div className="bg-[#fad277] border border-purple-300/90 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-purple-950 flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5 text-purple-700" />
                  Баланс pH
                </span>
                <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded bg-purple-200/80 text-purple-950">
                  {displayInsights.phInsight.status}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-base font-black text-purple-950">pH {currentPh}</span>
                <span className="text-[10px] font-black text-purple-900 bg-[#fad277] px-1.5 py-0.5 rounded border border-purple-300">
                  {displayInsights.phInsight.delta}
                </span>
              </div>
              <p className="text-[10.5px] font-semibold text-purple-900/90 leading-tight pt-1">
                {displayInsights.phInsight.analysis}
              </p>
            </div>
            <div className="mt-2 pt-1.5 border-t border-purple-300/80 text-[10px] text-purple-900 font-bold flex justify-between">
              <span>Ціль після поливу:</span>
              <span className="font-black">{targetPh} pH</span>
            </div>
          </div>

          {/* PPM Cell */}
          <div className="bg-[#fad277] border border-amber-300/90 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-amber-950 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-700" />
                  Апетит & PPM
                </span>
                <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950">
                  {displayInsights.ppmInsight.status}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-base font-black text-amber-950">{currentPpm} PPM</span>
                <span className="text-[10px] font-black text-amber-900 bg-[#fad277] px-1.5 py-0.5 rounded border border-amber-300">
                  {displayInsights.ppmInsight.delta}
                </span>
              </div>
              <p className="text-[10.5px] font-semibold text-amber-900/90 leading-tight pt-1">
                {displayInsights.ppmInsight.analysis}
              </p>
            </div>
            <div className="mt-2 pt-1.5 border-t border-amber-300/80 text-[10px] text-amber-900 font-bold flex justify-between">
              <span>Ціль після поливу:</span>
              <span className="font-black">{targetPpmPost} PPM</span>
            </div>
          </div>

          {/* Moisture & Aeration Cell */}
          <div className="bg-[#fad277] border border-sky-300/90 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-sky-950 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-700" />
                  Вологість & Просихання
                </span>
                <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded ${vitality.status === 'dead' ? 'bg-rose-200 text-rose-950 font-black' : vitality.status === 'critical' ? 'bg-amber-200 text-amber-950 font-black' : 'bg-sky-200/80 text-sky-950'}`}>
                  {vitality.status === 'dead' ? 'Субстрат 0%' : vitality.status === 'critical' ? 'Критично сухо' : `~${localAnalytics.dailyDryingRate.toFixed(1)}%/дн.`}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className={`text-base font-black ${vitality.status === 'dead' ? 'text-rose-900' : vitality.status === 'critical' ? 'text-amber-950' : 'text-sky-950'}`}>
                  {currentMoisture}%
                </span>
                <span className="text-[10px] font-black text-sky-900 bg-[#fad277] px-1.5 py-0.5 rounded border border-sky-300">
                  Цикл: {displayInsights.moistureInsight.dryingRateDays}
                </span>
              </div>
              <p className="text-[10.5px] font-semibold text-sky-900/90 leading-tight pt-1">
                {displayInsights.moistureInsight.analysis}
              </p>
            </div>
            <div className="mt-2 pt-1.5 border-t border-sky-300/80 text-[10px] text-sky-900 font-bold flex justify-between">
              <span>Ціль після поливу:</span>
              <span className="font-black">{targetMoisturePost}%</span>
            </div>
          </div>
        </div>

        {/* Microclimate & Lighting Context Bar */}
        <div className="bg-[#fad277] border border-black/15 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-[#18181b] shadow-2xs">
          <div className="flex items-center gap-2">
            <Thermometer className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>Мікроклімат: <strong>{plant.currentTemp}°C</strong> | <strong>{plant.currentHumidity}% RH</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>PPFD над верхівкою: <strong>{targetPpfd} мкмоль/м²/с</strong></span>
          </div>
        </div>
      </div>

      {/* 4. Interactive History Chart */}
      <div className="space-y-1.5">
        <PlantMetricsChart plant={plant} />
      </div>

      {/* 5. AI Recommendations & Best Practices */}
      {(prediction?.aiAdvice || prediction?.strainBestPractices) && (
        <div className="bg-[#fad277] p-3 sm:p-3.5 rounded-xl border border-black/15 text-xs text-[#18181b] leading-relaxed font-bold space-y-2 shadow-xs">
          {prediction.aiAdvice && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[#18181b] font-black">
                <Sparkles className="w-3.5 h-3.5 fill-[#18181b]" />
                <span>Рекомендація AI-Агронома:</span>
              </div>
              <p className="text-[#18181b] font-semibold">{prediction.aiAdvice}</p>
            </div>
          )}

          {prediction.strainBestPractices && (
            <div className="text-[11px] text-[#18181b] bg-[#fad277] p-2.5 rounded-lg border border-black/15 space-y-1">
              <strong className="text-[#18181b] flex items-center gap-1 font-black">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                Кращі практики для сорту ({plant.strain}):
              </strong>
              <p>{prediction.strainBestPractices}</p>
            </div>
          )}

          {prediction.nutrientRecommendation && (
            <div className="text-[11px] text-[#18181b] font-extrabold bg-[#fad277] p-2 rounded-lg border border-black/15">
              <strong>Живлення:</strong> {prediction.nutrientRecommendation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
