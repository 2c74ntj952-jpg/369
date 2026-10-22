'use client';

import React, { useState, useEffect } from 'react';
import { Plant, GrowthPrediction } from '@/lib/types';
import { Sparkles, RefreshCw, Droplets, Zap, Gauge, Sun, Thermometer, ShieldCheck } from 'lucide-react';
import { PlantMetricsChart } from '@/components/PlantMetricsChart';
import { safeFetchJson } from '@/lib/utils';

interface PredictionsAndRemindersProps {
  plant: Plant;
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

export const PredictionsAndReminders: React.FC<PredictionsAndRemindersProps> = ({
  plant,
}) => {
  const [prediction, setPrediction] = useState<GrowthPrediction | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState<boolean>(false);

  // Fetch AI Prediction for the active plant
  useEffect(() => {
    let isCancelled = false;
    const loadPrediction = async () => {
      setLoadingPrediction(true);
      try {
        const cleanPlant = {
          id: String(plant?.id || ''),
          name: String(plant?.name || ''),
          strain: String(plant?.strain || ''),
          stage: String(plant?.stage || ''),
          stageDay: Number(plant?.stageDay || 1),
          currentPH: plant?.currentPH ?? null,
          currentHumidity: plant?.currentHumidity ?? null,
          currentTemp: plant?.currentTemp ?? null
        };

        const data = await safeFetchJson<{ success?: boolean; prediction?: GrowthPrediction }>('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'predict_growth',
            plant: cleanPlant
          })
        });

        if (!isCancelled && data?.success && data.prediction) {
          setPrediction(data.prediction);
        }
      } catch {
        // Handled silently
      } finally {
        if (!isCancelled) setLoadingPrediction(false);
      }
    };

    loadPrediction();
    return () => { isCancelled = true; };
  }, [plant]);

  const fetchPrediction = async () => {
    setLoadingPrediction(true);
    try {
      const cleanPlant = {
        id: String(plant?.id || ''),
        name: String(plant?.name || ''),
        strain: String(plant?.strain || ''),
        stage: String(plant?.stage || ''),
        stageDay: Number(plant?.stageDay || 1),
        currentPH: plant?.currentPH ?? null,
        currentHumidity: plant?.currentHumidity ?? null,
        currentTemp: plant?.currentTemp ?? null
      };

      const data = await safeFetchJson<{ success?: boolean; prediction?: GrowthPrediction }>('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'predict_growth',
          plant: cleanPlant
        })
      });

      if (data?.success && data.prediction) {
        setPrediction(data.prediction);
      }
    } catch {
      // Handled silently
    } finally {
      setLoadingPrediction(false);
    }
  };

  const currentMoisture = plant.moistureBeforeWatering ?? plant.moistureAfterWatering ?? 25;
  const targetMoisturePost = plant.moistureAfterWatering ?? 75;
  const targetPpmPost = plant.ppmAfterWatering ?? (plant.stage === 'flowering' ? 950 : 650);
  const targetPpfd = plant.lightPPFD ?? (plant.stage === 'flowering' ? 700 : 520);
  const targetPh = plant.phAfterWatering ?? plant.currentPH ?? 6.3;

  return (
    <div className="space-y-4 pt-1 text-[#18181b]">
      {/* Header */}
      <div className="border-b border-black/15 pb-3 space-y-1.5">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-black/10 border border-black/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#18181b] fill-[#18181b]" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
              <h3 className="text-xs sm:text-base font-black text-[#18181b] leading-tight break-words">
                ⚡ AI Прогноз та Оптимальні Показники
              </h3>
              <span className="text-[10px] bg-[#18181b] text-white px-2 py-0.5 rounded-md font-bold uppercase truncate max-w-[120px]">
                {plant.strain}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchPrediction}
            disabled={loadingPrediction}
            className="flex items-center gap-1 bg-[#18181b] hover:bg-black active:scale-95 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer shrink-0 transition-all shadow-xs"
          >
            <RefreshCw className={`w-3 h-3 ${loadingPrediction ? 'animate-spin text-[#fad277]' : 'text-emerald-300'}`} />
            <span>{loadingPrediction ? 'Оновлення...' : 'Оновити'}</span>
          </button>
        </div>
        <p className="text-[11px] text-[#18181b]/80 font-bold sm:pl-10 leading-snug">
          Прогноз врожаю на основі ваших даних, порівняння з кращими практиками сорту та цільові показники субстрату після поливу
        </p>
      </div>

      {/* Recharts Data Visualization: pH, PPM, Substrate Moisture History */}
      <PlantMetricsChart plant={plant} />

      {/* Loading Spinner or AI Forecast Content */}
      {loadingPrediction ? (
        <div className="py-8 text-center text-xs text-[#18181b] flex flex-col items-center justify-center gap-2 font-bold">
          <RefreshCw className="w-6 h-6 animate-spin text-[#18181b]" />
          <span>Аналіз даних рослини, порівняння з генетикою сорту та розрахунок очікуваного врожаю...</span>
        </div>
      ) : prediction ? (
        <div className="space-y-4">
          {/* 1. Harvest & Yield Forecast Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5">
            <div className="bg-[#fad277] p-2.5 sm:p-3 rounded-xl border border-black/15 shadow-xs">
              <span className="text-[9.5px] uppercase text-[#18181b]/80 font-black block mb-0.5">До Врожаю</span>
              <div className="text-lg sm:text-xl font-black text-[#18181b]">
                ~{prediction.estimatedHarvestWeeks} <span className="text-xs font-bold">тижн.</span>
              </div>
              <span className="text-[9px] text-[#18181b]/70 font-semibold truncate block">Дата збору</span>
            </div>

            <div className="bg-[#fad277] p-2.5 sm:p-3 rounded-xl border border-black/15 shadow-xs">
              <span className="text-[9.5px] uppercase text-[#18181b]/80 font-black block mb-0.5">Прогноз Ваги</span>
              <div className="text-lg sm:text-xl font-black text-emerald-800">
                ~{prediction.estimatedYieldGrams} <span className="text-xs font-bold">г / кущ</span>
              </div>
              <span className="text-[9px] text-[#18181b]/70 font-semibold truncate block">Сухий врожай</span>
            </div>

            <div className="bg-[#fad277] p-2.5 sm:p-3 rounded-xl border border-black/15 shadow-xs">
              <span className="text-[9.5px] uppercase text-[#18181b]/80 font-black block mb-0.5">Генетичний Потенціал</span>
              <div className="text-xs sm:text-sm font-black text-[#18181b] truncate mt-1">
                {prediction.breederPotentialYield || '450–550 г/м²'}
              </div>
              <span className="text-[9px] text-[#18181b]/70 font-semibold truncate block">Стандарт сорту</span>
            </div>

            <div className="bg-[#fad277] p-2.5 sm:p-3 rounded-xl border border-black/15 shadow-xs">
              <span className="text-[9.5px] uppercase text-[#18181b]/80 font-black block mb-0.5">Рівень Ризиків</span>
              <div className="text-xs font-bold text-[#18181b] mt-1 flex items-center gap-1">
                <span className={prediction.moldRiskLevel === 'Високий' ? 'text-rose-700 font-black' : 'text-emerald-800 font-black'}>
                  Пліснява: {prediction.moldRiskLevel}
                </span>
              </div>
              <span className="text-[9px] text-[#18181b]/70 font-semibold truncate block">
                Світло: {prediction.lightBurnRisk ? '⚠️ Ризик опіку' : '✅ Оптимально'}
              </span>
            </div>
          </div>

          {/* AI Custom Advice & Best Practices Box */}
          <div className="bg-[#fad277] p-3 sm:p-3.5 rounded-xl border border-black/15 text-xs text-[#18181b] leading-relaxed font-bold space-y-2 shadow-xs">
            <div className="flex items-center gap-1.5 text-[#18181b] font-black">
              <Sparkles className="w-3.5 h-3.5 fill-[#18181b]" />
              <span>💡 Рекомендація AI-Агронома та порівняння з кращими практиками:</span>
            </div>
            <p className="text-[#18181b] font-semibold">{prediction.aiAdvice}</p>

            {prediction.strainBestPractices && (
              <div className="text-[11px] text-[#18181b] bg-black/5 p-2.5 rounded-lg border border-black/10 space-y-1">
                <strong className="text-[#18181b] flex items-center gap-1 font-black">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                  Кращі техніки вирощування сорту ({plant.strain}):
                </strong>
                <p>{prediction.strainBestPractices}</p>
              </div>
            )}

            <div className="text-[11px] text-[#18181b] font-extrabold bg-black/5 p-2 rounded-lg border border-black/10">
              <strong>Живлення:</strong> {prediction.nutrientRecommendation}
            </div>
          </div>

          {/* 2. Target Substrate & Growth Metrics Forecast */}
          <div className="pt-2 border-t border-black/15">
            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#18181b] uppercase tracking-wide min-w-0 flex-1">
                <Droplets className="w-4 h-4 text-emerald-800 shrink-0" />
                <span className="leading-snug break-words">Правильні показники субстрату після поливу</span>
              </div>
              <span className="text-[10px] text-white font-bold bg-[#18181b] px-2 py-0.5 rounded-md shrink-0">
                {stageLabelUk(plant.stage)}
              </span>
            </div>
            <p className="text-[10.5px] text-[#18181b]/80 mb-2.5 font-bold">
              Прогнозовані цільові орієнтири для субстрату після поливу та мікроклімату на поточний період росту:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Moisture card */}
              <div className="bg-white/90 p-2.5 rounded-xl border border-black/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-700 shrink-0" />
                  <span className="text-[#18181b] font-bold">Вологість субстрату:</span>
                </div>
                <span className="font-black text-[#18181b]">
                  {currentMoisture}% → {targetMoisturePost}%
                </span>
              </div>

              {/* PPM card */}
              <div className="bg-white/90 p-2.5 rounded-xl border border-black/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-[#18181b] font-bold">PPM після поливу:</span>
                </div>
                <span className="font-black text-[#18181b]">
                  {targetPpmPost} PPM
                </span>
              </div>

              {/* PPFD card */}
              <div className="bg-white/90 p-2.5 rounded-xl border border-black/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-[#18181b] font-bold">PPFD над верхівкою:</span>
                </div>
                <span className="font-black text-[#18181b]">
                  {targetPpfd} мкмоль/м²/с
                </span>
              </div>

              {/* pH card */}
              <div className="bg-white/90 p-2.5 rounded-xl border border-black/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-purple-700 shrink-0" />
                  <span className="text-[#18181b] font-bold">pH до / після:</span>
                </div>
                <span className="font-black text-[#18181b]">
                  {plant.phBeforeWatering ? `${plant.phBeforeWatering} → ` : ''}{targetPh} pH
                </span>
              </div>

              {/* Temp & Humidity card */}
              <div className="bg-white/90 p-2.5 rounded-xl border border-black/15 flex items-center justify-between sm:col-span-2">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-[#18181b] font-bold">Мікроклімат у боксі:</span>
                </div>
                <span className="font-black text-[#18181b]">
                  Температура {plant.currentTemp}°C | Вологість {plant.currentHumidity}%
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-[#18181b] font-bold text-center py-4">
          Натисніть кнопку «Оновити» вище для отримання прогнозу
        </div>
      )}
    </div>
  );
};

