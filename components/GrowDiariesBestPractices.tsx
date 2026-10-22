'use client';

import React, { useState, useEffect } from 'react';
import { Plant, ReminderTask } from '@/lib/types';
import {
  GROWDIARIES_DATASET_SUMMARY,
  CULTIVATION_TECHNIQUES,
  MEDIUM_PROTOCOLS,
  NUTRIENT_BRAND_PROTOCOLS,
  LIGHTING_PPFD_CURVES,
  GROWDIARIES_STRAIN_BENCHMARKS,
  getGrowDiariesBestPractices,
  CultivationTechniqueInfo,
  MediumProtocol,
  NutrientBrandProtocol
} from '@/lib/growdiariesKnowledgeBase';
import { safeFetchJson } from '@/lib/utils';
import {
  BookOpen,
  Sparkles,
  Award,
  Layers,
  Zap,
  Sun,
  Droplets,
  FlaskConical,
  Scale,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GrowDiariesBestPracticesProps {
  plant?: Plant;
  onAddTask?: (task: ReminderTask) => void;
  onAwardXP?: (xp: number, reason: string) => void;
}

export const GrowDiariesBestPractices: React.FC<GrowDiariesBestPracticesProps> = ({
  plant,
  onAddTask,
  onAwardXP
}) => {
  const [activeTab, setActiveTab] = useState<'plant_playbook' | 'techniques' | 'mediums' | 'nutrients' | 'lighting' | 'database'>('plant_playbook');
  const [selectedTechnique, setSelectedTechnique] = useState<CultivationTechniqueInfo | null>(CULTIVATION_TECHNIQUES[0]);
  const [selectedMedium, setSelectedMedium] = useState<MediumProtocol | null>(MEDIUM_PROTOCOLS[0]);
  const [selectedNutrient, setSelectedNutrient] = useState<NutrientBrandProtocol | null>(NUTRIENT_BRAND_PROTOCOLS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Synthesized Best Practices
  const [aiPlaybook, setAiPlaybook] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Local calculation from the 3,637 dataset
  const currentPlantPractices = getGrowDiariesBestPractices({
    strain: plant?.strain || 'Медичний сорт',
    breeder: plant?.breeder || 'Breeder',
    stage: plant?.stage || 'vegetative',
    medium: plant?.medium || 'Soil',
    potSize: plant?.potSize || 10,
    lightPowerWatts: plant?.lightPowerWatts || 150,
    lightDistanceCm: plant?.lightDistanceCm || 45,
    currentPH: plant?.currentPH || 6.3,
    currentEC: plant?.currentEC || 1.2
  });

  const fetchAiPlaybook = async () => {
    if (!plant) return;
    setLoadingAi(true);
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
        currentPH: plant?.currentPH ?? null,
        currentEC: plant?.currentEC ?? null
      };

      const data = await safeFetchJson<{ success?: boolean; bestPractices?: any }>('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'growdiaries_best_practices',
          plant: cleanPlant,
          userMessage: `Скласти кращі практики вирощування для ${plant.name} (${plant.strain}) у фазі ${plant.stage}`
        })
      });
      if (data?.success && data.bestPractices) {
        setAiPlaybook(data.bestPractices);
        if (onAwardXP) {
          onAwardXP(25, 'Отримання AI Кращих практик з бази GrowDiaries');
        }
      }
    } catch {
      // Safe fallback
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCreateTechniqueTask = (technique: CultivationTechniqueInfo) => {
    if (!onAddTask || !plant) return;
    const task: ReminderTask = {
      id: `gd-tech-${Date.now()}`,
      plantId: plant.id,
      plantName: plant.name,
      title: `Тренування: ${technique.nameUk}`,
      description: `Виконати кроки техніки ${technique.name} для збільшення врожайності на ${technique.avgYieldIncrease}`,
      category: 'pruning',
      xpReward: 35,
      completed: false,
      dueDate: 'Сьогодні',
      createdByAI: true,
      urgent: false
    };
    onAddTask(task);
  };

  return (
    <div className="bg-black/5 backdrop-blur-md text-[#18181b] border border-black/10 rounded-3xl p-4 sm:p-6 space-y-6 shadow-xs">
      {/* Header with Dataset Credentials */}
      <div className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-slate-950 text-white rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> База знань вирощування
              </span>
              <span className="text-[10px] font-extrabold text-neutral-300">
                3,637 перевірених циклів
              </span>
            </div>
            <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Кращі практики та методики вирощування
            </h3>
            <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
              Емпірична база знань: перевірені методики LST/ScROG, рецепти субстратів, лінійки живлення, криві PPFD/DLI та оптимізація врожайності.
            </p>
          </div>

          {/* Key Dataset Stats Badges */}
          <div className="grid grid-cols-3 gap-2 shrink-0 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/15">
            <div className="text-center px-1">
              <span className="text-base font-black text-emerald-400 block">
                {GROWDIARIES_DATASET_SUMMARY.totalJournals}
              </span>
              <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-tighter block">
                Щоденників
              </span>
            </div>
            <div className="text-center px-1 border-x border-white/10">
              <span className="text-base font-black text-[#d8f087] block">
                {GROWDIARIES_DATASET_SUMMARY.totalBreeders}+
              </span>
              <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-tighter block">
                Брідерів
              </span>
            </div>
            <div className="text-center px-1">
              <span className="text-base font-black text-sky-400 block">
                {GROWDIARIES_DATASET_SUMMARY.avgGramsPerWattLED} г/Вт
              </span>
              <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-tighter block">
                LED Сер. Врожай
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-black/10">
        <button
          type="button"
          onClick={() => setActiveTab('plant_playbook')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'plant_playbook'
              ? 'bg-[#18181b] text-white shadow-xs'
              : 'bg-black/5 text-[#18181b] hover:bg-black/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>План для {plant?.name || 'поточної рослини'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('techniques')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'techniques'
              ? 'bg-[#18181b] text-white shadow-xs'
              : 'bg-black/5 text-[#18181b] hover:bg-black/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Техніки тренування (LST/ScROG)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mediums')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'mediums'
              ? 'bg-[#18181b] text-white shadow-xs'
              : 'bg-black/5 text-[#18181b] hover:bg-black/10'
          }`}
        >
          <Droplets className="w-3.5 h-3.5 text-sky-400" />
          <span>Субстрати & Дренаж</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('nutrients')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'nutrients'
              ? 'bg-[#18181b] text-white shadow-xs'
              : 'bg-black/5 text-[#18181b] hover:bg-black/10'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
          <span>Добрива & Протоколи</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lighting')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'lighting'
              ? 'bg-[#18181b] text-white shadow-xs'
              : 'bg-black/5 text-[#18181b] hover:bg-black/10'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Світло PPFD & DLI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'database'
              ? 'bg-[#18181b] text-white shadow-xs'
              : 'bg-black/5 text-[#18181b] hover:bg-black/10'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-500" />
          <span>Бенчмарки сортів</span>
        </button>
      </div>

      {/* Tab 1: Plant-Specific AI Playbook */}
      {activeTab === 'plant_playbook' && (
        <div className="space-y-5 animate-fade-in">
          {/* Action Header with AI Generator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                Персоналізований синтез практик
              </span>
              <h4 className="text-sm font-black text-emerald-950 mt-0.5">
                Генетичний профіль: {plant?.strain || 'Медичний канабіс'} ({plant?.breeder || 'Breeder'})
              </h4>
              <p className="text-xs font-bold text-emerald-900/80 mt-0.5">
                Фаза: {plant?.stage || 'Вегетація'} • Субстрат: {plant?.medium || 'Ґрунт'} • Світло: {plant?.lightPowerWatts || 150}W
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAiPlaybook}
              disabled={loadingAi}
              className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin' : ''}`} />
              <span>{loadingAi ? 'Синтез з 3,637 щоденників...' : 'Оновити AI План'}</span>
            </button>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Training Recommendation */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black text-neutral-900">Рекомендоване тренування</span>
                </div>
                <span className="text-[10px] font-black bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md border border-indigo-200">
                  {aiPlaybook?.recommendedTrainingUk?.yieldImpactPercent || currentPlantPractices.matchedBenchmark.topTechniques.join(' + ')}
                </span>
              </div>

              <p className="text-xs font-bold text-neutral-800">
                {aiPlaybook?.recommendedTrainingUk?.technique || `Техніка: ${currentPlantPractices.matchedBenchmark.topTechniques.join(' + ')}`}
              </p>
              <p className="text-[11px] font-medium text-neutral-600">
                {aiPlaybook?.recommendedTrainingUk?.timingStage || `Оптимально починати на 2-3 тижні вегетації для формування рівномірного пологу.`}
              </p>

              {aiPlaybook?.recommendedTrainingUk?.actionSteps && (
                <ul className="space-y-1 pt-1 border-t border-neutral-200">
                  {aiPlaybook.recommendedTrainingUk.actionSteps.map((step: string, idx: number) => (
                    <li key={idx} className="text-[11px] font-medium text-neutral-700 flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 2. Substrate & Nutrients */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center">
                    <Droplets className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black text-neutral-900">Субстрат & Живлення</span>
                </div>
                <span className="text-[10px] font-black bg-sky-100 text-sky-900 px-2 py-0.5 rounded-md border border-sky-200">
                  {currentPlantPractices.matchedMedium.phRange}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-neutral-900 block">
                  PPM крива: {aiPlaybook?.substrateAndNutrientsUk?.optimalPpmCurve || currentPlantPractices.matchedMedium.optimalEC}
                </span>
                <span className="text-[11px] font-medium text-neutral-600 block">
                  Правило: {aiPlaybook?.substrateAndNutrientsUk?.wateringRule || currentPlantPractices.matchedMedium.wateringFrequencyUk}
                </span>
              </div>

              <p className="text-[11px] font-bold text-sky-900 bg-sky-50 p-2 rounded-xl border border-sky-200">
                💡 {aiPlaybook?.substrateAndNutrientsUk?.proTips?.[0] || currentPlantPractices.topActionableAdvice[0]}
              </p>
            </div>

            {/* 3. Lighting & DLI Protocol */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                    <Sun className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black text-neutral-900">Світловий протокол</span>
                </div>
                <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                  {currentPlantPractices.recommendedLighting.optimalPPFD}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-neutral-900 block">
                  DLI Ціль: {aiPlaybook?.lightingDliProtocolUk?.optimalDLI || currentPlantPractices.recommendedLighting.optimalDLI}
                </span>
                <span className="text-[11px] font-medium text-neutral-600 block">
                  Відстань LED: {aiPlaybook?.lightingDliProtocolUk?.lampDistanceAdjustment || currentPlantPractices.recommendedLighting.distanceLED}
                </span>
              </div>

              <p className="text-[11px] font-medium text-neutral-700">
                {currentPlantPractices.recommendedLighting.proTipUk}
              </p>
            </div>

            {/* 4. Empirical Yield Forecast */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <Scale className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black text-neutral-900">Емпіричний бенчмарк врожаю</span>
                </div>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-200">
                  {currentPlantPractices.yieldForecast.yieldCategory}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-black/5 backdrop-blur-xs p-2.5 rounded-xl border border-black/10 text-center">
                  <span className="text-[10px] font-bold text-neutral-600 block">Очікуваний сухий:</span>
                  <span className="text-base font-black text-emerald-800">
                    ~{aiPlaybook?.empiricalYieldBenchmark?.avgDryYieldGrams || currentPlantPractices.yieldForecast.estimatedDryYieldGrams} г
                  </span>
                </div>
                <div className="bg-black/5 backdrop-blur-xs p-2.5 rounded-xl border border-black/10 text-center">
                  <span className="text-[10px] font-bold text-neutral-600 block">Топ-гровер врожай:</span>
                  <span className="text-base font-black text-[#18181b]">
                    ~{aiPlaybook?.empiricalYieldBenchmark?.topGrowerYieldGrams || currentPlantPractices.matchedBenchmark.topYieldGrams} г
                  </span>
                </div>
              </div>

              <p className="text-[10px] font-extrabold text-neutral-600 text-center">
                Сухий/Сирий розрахунок: 22% суха вага (78% втрата вологи при сушінні)
              </p>
            </div>
          </div>

          {/* AI Summary Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d8f087]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#d8f087]">
                Висновок AI на основі 3,637 щоденників:
              </span>
            </div>
            <p className="text-xs font-medium text-neutral-200 leading-relaxed">
              {aiPlaybook?.summaryUk || `Сорт ${plant?.strain || 'канабісу'} демонструє максимальну смолистість та віддачу за умови суворого дотримання температурного режиму (24-26°C вдень, 19-21°C вночі) та регулярного контролю закислення субстрату.`}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Cultivation Techniques */}
      {activeTab === 'techniques' && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Techniques List */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-neutral-800 tracking-wider block">
                Каталог методик тренування:
              </span>
              <div className="space-y-2">
                {CULTIVATION_TECHNIQUES.map((tech) => {
                  const isSelected = selectedTechnique?.id === tech.id;
                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => setSelectedTechnique(tech)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#18181b] text-white border-black shadow-sm'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-[#18181b] border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black">{tech.nameUk}</span>
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {tech.avgYieldIncrease}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px]">
                        <span className={isSelected ? 'text-neutral-300' : 'text-neutral-600'}>
                          Складність: {tech.difficulty}
                        </span>
                        <span>•</span>
                        <span className={isSelected ? 'text-emerald-300' : 'text-emerald-700 font-bold'}>
                          Успішність {tech.successRate}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Technique Details */}
            {selectedTechnique && (
              <div className="lg:col-span-2 bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
                  <div>
                    <h4 className="text-base font-black text-neutral-900">{selectedTechnique.name}</h4>
                    <span className="text-xs font-bold text-indigo-700">{selectedTechnique.nameUk}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black px-2.5 py-1 rounded-full">
                      Врожай: {selectedTechnique.avgYieldIncrease}
                    </span>
                    {plant && onAddTask && (
                      <button
                        type="button"
                        onClick={() => handleCreateTechniqueTask(selectedTechnique)}
                        className="bg-[#18181b] hover:bg-black text-white text-xs font-black px-3 py-1.5 rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer"
                      >
                        + Додати завдання
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs font-medium text-neutral-700 leading-relaxed">
                  {selectedTechnique.description}
                </p>

                {/* Step-by-Step */}
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Покроковий алгоритм виконання:
                  </span>
                  <ol className="space-y-1.5 text-xs text-neutral-800">
                    {selectedTechnique.stepByStepUk.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-black/5 backdrop-blur-xs p-2.5 rounded-xl border border-black/10">
                        <span className="bg-[#18181b] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-[#18181b]">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Best Practices vs Mistakes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 space-y-1.5">
                    <span className="text-[11px] font-black text-emerald-950 uppercase flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Кращі поради гроверів:
                    </span>
                    <ul className="space-y-1 text-[11px] text-emerald-900">
                      {selectedTechnique.bestPracticesUk.map((bp, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50/80 p-3 rounded-xl border border-red-200 space-y-1.5">
                    <span className="text-[11px] font-black text-red-950 uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Типові помилки:
                    </span>
                    <ul className="space-y-1 text-[11px] text-red-900">
                      {selectedTechnique.commonMistakesUk.map((cm, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{cm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Mediums & Substrates */}
      {activeTab === 'mediums' && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MEDIUM_PROTOCOLS.map((med) => (
              <div key={med.id} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-neutral-900">{med.name}</h4>
                  <span className="text-[10px] font-black bg-sky-100 text-sky-900 px-2 py-0.5 rounded border border-sky-200">
                    pH {med.phRange}
                  </span>
                </div>

                <p className="text-xs font-medium text-neutral-700">
                  {med.descriptionUk}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-black/5 backdrop-blur-xs p-2.5 rounded-xl border border-black/10">
                  <div>
                    <span className="text-neutral-500 font-bold block">EC Діапазон:</span>
                    <span className="font-black text-neutral-900">{med.optimalEC}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-bold block">Дренаж:</span>
                    <span className="font-black text-neutral-900">{med.runoffTarget}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-neutral-100">
                    <span className="text-neutral-500 font-bold block">Потреба в CalMag:</span>
                    <span className="font-extrabold text-amber-700">{med.calMagRequirement}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-neutral-800 tracking-wider">
                    Кращі практики поливу:
                  </span>
                  <ul className="space-y-1 text-xs text-neutral-700">
                    {med.bestPracticesUk.map((bp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-sky-600 font-bold">•</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Nutrient Brands */}
      {activeTab === 'nutrients' && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NUTRIENT_BRAND_PROTOCOLS.map((nut) => (
              <div key={nut.id} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-neutral-900">{nut.name}</h4>
                      <span className="text-[10px] font-bold text-neutral-500">{nut.country} ({nut.type})</span>
                    </div>
                    <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                      pH: {nut.targetPh}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-neutral-700 block">Базове живлення:</span>
                    <p className="text-[11px] font-medium text-neutral-800">{nut.baseNutrientsUk.join(', ')}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-neutral-700 block">Ключові стимулятори:</span>
                    <p className="text-[11px] font-medium text-neutral-800">{nut.keyAdditivesUk.join(', ')}</p>
                  </div>

                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <span className="text-[10px] font-black text-amber-950 block">Промивання (Flushing):</span>
                    <p className="text-[11px] font-medium text-amber-900">{nut.flushingProtocolUk}</p>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-neutral-200">
                  <span className="text-[10px] font-black uppercase text-neutral-800 tracking-wider">
                    Гроверські поради:
                  </span>
                  <ul className="space-y-1 text-[11px] text-neutral-700">
                    {nut.proTipsUk.slice(0, 2).map((tip, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Lighting PPFD / DLI Curves */}
      {activeTab === 'lighting' && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-3">
            {LIGHTING_PPFD_CURVES.map((curve, idx) => (
              <div key={idx} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-2">
                  <div>
                    <h4 className="text-sm font-black text-neutral-900">{curve.stage}</h4>
                    <span className="text-[11px] font-bold text-neutral-500">{curve.days}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black px-2.5 py-0.5 rounded-lg">
                      PPFD: {curve.optimalPPFD}
                    </span>
                    <span className="bg-sky-100 text-sky-900 border border-sky-200 text-xs font-black px-2.5 py-0.5 rounded-lg">
                      DLI: {curve.optimalDLI}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-neutral-600">Світловий режим:</span>{' '}
                    <span className="font-black text-neutral-900">{curve.lightSchedule}</span>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-600">Відстань LED лампи:</span>{' '}
                    <span className="font-black text-neutral-900">{curve.distanceLED}</span>
                  </div>
                </div>

                <p className="text-[11px] font-medium text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  💡 {curve.proTipUk}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Strain Benchmarks Database */}
      {activeTab === 'database' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Пошук сорту в базі GrowDiaries (напр., Critical XXL, Gorilla, Mimosa)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GROWDIARIES_STRAIN_BENCHMARKS
              .filter(b => b.strain.toLowerCase().includes(searchQuery.toLowerCase()) || b.breeder.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((b, i) => (
                <div key={i} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-neutral-900">{b.strain}</h4>
                      <span className="text-[11px] font-bold text-neutral-500">{b.breeder} ({b.type})</span>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200">
                      {b.journalCount} щоденників
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-black/5 backdrop-blur-xs p-2.5 rounded-xl border border-black/10 text-center">
                    <div>
                      <span className="text-[9px] font-bold text-neutral-500 block">Сер. Врожай</span>
                      <span className="text-xs font-black text-emerald-700">{b.avgDryYieldGrams} г</span>
                    </div>
                    <div className="border-x border-neutral-100">
                      <span className="text-[9px] font-bold text-neutral-500 block">Топ-Врожай</span>
                      <span className="text-xs font-black text-neutral-900">{b.topYieldGrams} г</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-neutral-500 block">Цикл (днів)</span>
                      <span className="text-xs font-black text-indigo-700">{b.avgCycleDays} дн</span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-neutral-700 leading-relaxed">
                    {b.notesUk}
                  </p>

                  <div className="text-[10px] font-extrabold text-neutral-600 flex items-center justify-between border-t border-neutral-200 pt-2">
                    <span>Топ-техніка: {b.topTechniques.join(', ')}</span>
                    <span className="text-amber-800">THC: {b.thcRange}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
