'use client';

import React, { useState, useEffect } from 'react';
import { Plant, CustomFeedChart } from '@/lib/types';
import {
  FlaskConical,
  Droplets,
  Zap,
  Sparkles,
  Save,
  CheckCircle2,
  Trash2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface NutrientFeedCalculatorProps {
  plant?: Plant;
  onApplySolution?: (targetPpm: number, notes: string) => void;
  onAwardXP?: (xp: number, reason: string) => void;
  onClose?: () => void;
}

export const NutrientFeedCalculator: React.FC<NutrientFeedCalculatorProps> = ({
  plant,
  onApplySolution,
  onAwardXP,
  onClose
}) => {
  // 1. Water source & CalMag state
  const [waterType, setWaterType] = useState<'ro' | 'soft_tap' | 'hard_tap' | 'custom'>('ro');
  const [baseWaterPpm, setBaseWaterPpm] = useState<number>(20);
  const [medium, setMedium] = useState<'Soil' | 'Coco' | 'Hydroponics'>(
    (plant?.medium as any) || 'Soil'
  );
  const [waterVolumeLiters, setWaterVolumeLiters] = useState<number>(2);

  // 2. Feed recipe components (ml/L)
  const [calMagDose, setCalMagDose] = useState<number>(1.2);
  const [baseNutrientDose, setBaseNutrientDose] = useState<number>(2.0); // Micro/Grow or Part A+B
  const [bloomDose, setBloomDose] = useState<number>(plant?.stage === 'flowering' ? 2.5 : 0.5);
  const [rootBoosterDose, setRootBoosterDose] = useState<number>(plant?.stage === 'seedling' ? 2.0 : 0.5);
  const [pkBoosterDose, setPkBoosterDose] = useState<number>(plant?.stage === 'flowering' ? 1.0 : 0);
  const [targetPhVal, setTargetPhVal] = useState<number>(medium === 'Coco' || medium === 'Hydroponics' ? 5.8 : 6.3);

  // 3. Saved Custom Feed Charts
  const [savedCharts, setSavedCharts] = useState<CustomFeedChart[]>([]);
  const [chartName, setChartName] = useState<string>('');
  const [showSaveForm, setShowSaveForm] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Load custom charts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('custom_grow_feed_charts');
      if (stored) {
        setSavedCharts(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Update base PPM when water type changes
  const handleWaterTypeChange = (type: 'ro' | 'soft_tap' | 'hard_tap' | 'custom') => {
    setWaterType(type);
    if (type === 'ro') {
      setBaseWaterPpm(20);
    } else if (type === 'soft_tap') {
      setBaseWaterPpm(120);
    } else if (type === 'hard_tap') {
      setBaseWaterPpm(320);
    }
  };

  // Recommended CalMag boost calculation
  // Target base water for coco: ~150-200 PPM. For soil: ~120-150 PPM.
  const targetBasePpm = medium === 'Coco' || medium === 'Hydroponics' ? 180 : 130;
  const ppmDeficit = Math.max(0, targetBasePpm - baseWaterPpm);
  // 1 ml of standard CalMag (e.g. Biobizz/Advanced Nutrients) adds ~120-140 PPM per liter
  const recommendedCalMagMlPerL = Number((ppmDeficit / 130).toFixed(1));

  // Calculate estimated total PPM of resulting solution
  const estimatedCalMagPpm = Math.round(calMagDose * 130);
  const estimatedBasePpm = Math.round(baseNutrientDose * 220);
  const estimatedBloomPpm = Math.round(bloomDose * 180);
  const estimatedRootPpm = Math.round(rootBoosterDose * 80);
  const estimatedPkPpm = Math.round(pkBoosterDose * 250);

  const totalCalculatedPpm = baseWaterPpm + estimatedCalMagPpm + estimatedBasePpm + estimatedBloomPpm + estimatedRootPpm + estimatedPkPpm;
  const totalCalculatedEc = (totalCalculatedPpm / 500).toFixed(2);

  // Quick preset stages
  const applyStagePreset = (stage: 'seedling' | 'veg' | 'bloom_early' | 'bloom_peak' | 'flush') => {
    if (stage === 'seedling') {
      setCalMagDose(0.5);
      setBaseNutrientDose(1.0);
      setBloomDose(0);
      setRootBoosterDose(2.0);
      setPkBoosterDose(0);
    } else if (stage === 'veg') {
      setCalMagDose(recommendedCalMagMlPerL || 1.0);
      setBaseNutrientDose(2.5);
      setBloomDose(0.5);
      setRootBoosterDose(1.0);
      setPkBoosterDose(0);
    } else if (stage === 'bloom_early') {
      setCalMagDose(recommendedCalMagMlPerL || 1.2);
      setBaseNutrientDose(2.0);
      setBloomDose(2.0);
      setRootBoosterDose(0.5);
      setPkBoosterDose(0.5);
    } else if (stage === 'bloom_peak') {
      setCalMagDose(recommendedCalMagMlPerL || 1.5);
      setBaseNutrientDose(1.8);
      setBloomDose(3.0);
      setRootBoosterDose(0);
      setPkBoosterDose(1.5);
    } else if (stage === 'flush') {
      setCalMagDose(0);
      setBaseNutrientDose(0);
      setBloomDose(0);
      setRootBoosterDose(0);
      setPkBoosterDose(0);
    }
  };

  // Save chart
  const handleSaveChart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chartName.trim()) return;

    const newChart: CustomFeedChart = {
      id: `chart-${Date.now()}`,
      name: chartName.trim(),
      medium,
      baseWaterPpm,
      calMagMlPerL: calMagDose,
      baseNutrientMlPerL: baseNutrientDose,
      bloomBoosterMlPerL: bloomDose,
      additivesMlPerL: rootBoosterDose + pkBoosterDose,
      targetPpm: totalCalculatedPpm,
      targetPh: targetPhVal,
      notes: `Розраховано на ${waterVolumeLiters} л (${medium})`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newChart, ...savedCharts];
    setSavedCharts(updated);
    try {
      localStorage.setItem('custom_grow_feed_charts', JSON.stringify(updated));
    } catch (err) {}

    setChartName('');
    setShowSaveForm(false);
    setFeedback('Рецепт успішно збережено у ваші персональні карти годування!');
    if (onAwardXP) onAwardXP(15, 'Створено кастомну карту годування NPK');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleApplySavedChart = (chart: CustomFeedChart) => {
    setMedium(chart.medium);
    setBaseWaterPpm(chart.baseWaterPpm);
    setCalMagDose(chart.calMagMlPerL);
    setBaseNutrientDose(chart.baseNutrientMlPerL);
    setBloomDose(chart.bloomBoosterMlPerL);
    setTargetPhVal(chart.targetPh);
    setFeedback(`Застосовано збережену карту «${chart.name}»`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleDeleteChart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = savedCharts.filter(c => c.id !== id);
    setSavedCharts(filtered);
    try {
      localStorage.setItem('custom_grow_feed_charts', JSON.stringify(filtered));
    } catch (err) {}
  };

  const handleApplyToPlant = () => {
    if (onApplySolution) {
      onApplySolution(
        totalCalculatedPpm,
        `Приготовано розчин ${waterVolumeLiters} л: CalMag ${calMagDose} мл/л, Базові ${baseNutrientDose} мл/л, Bloom ${bloomDose} мл/л, PK ${pkBoosterDose} мл/л (pH ${targetPhVal}, ~${totalCalculatedPpm} PPM)`
      );
    }
    if (onAwardXP) onAwardXP(20, 'Приготовано та застосовано розчин живлення NPK');
    if (onClose) onClose();
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 text-neutral-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0">
            <FlaskConical className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-neutral-900 flex items-center gap-2">
              <span>NPK & CalMag Калькулятор живлення</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                2026 Pro
              </span>
            </h3>
            <p className="text-xs text-neutral-500 font-medium">
              Авто-компенсація CalMag за якістю води, розрахунок розчину та власні карти годування
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="self-end sm:self-center text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-xl cursor-pointer transition-all"
          >
            Закрити
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. Water Source & Medium Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Medium */}
        <div className="bg-neutral-50 border border-neutral-200 p-3.5 rounded-2xl space-y-1.5">
          <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500">
            Субстрат
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['Soil', 'Coco', 'Hydroponics'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMedium(m);
                  if (m === 'Coco' || m === 'Hydroponics') setTargetPhVal(5.8);
                  else setTargetPhVal(6.3);
                }}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  medium === m
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {m === 'Soil' ? 'Ґрунт' : m === 'Coco' ? 'Кокос' : 'Гідро'}
              </button>
            ))}
          </div>
        </div>

        {/* Water Source & Base PPM */}
        <div className="bg-neutral-50 border border-neutral-200 p-3.5 rounded-2xl space-y-1.5 sm:col-span-2">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500">
              Базова вода для поливу
            </label>
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              {baseWaterPpm} PPM
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { id: 'ro', label: 'Осмос / Дощ (20 PPM)', ppm: 20 },
              { id: 'soft_tap', label: 'М’яка з крана (120 PPM)', ppm: 120 },
              { id: 'hard_tap', label: 'Тверда (320 PPM)', ppm: 320 },
              { id: 'custom', label: 'Власний замір', ppm: baseWaterPpm }
            ].map(w => (
              <button
                key={w.id}
                type="button"
                onClick={() => handleWaterTypeChange(w.id as any)}
                className={`p-2 rounded-xl text-left text-[11px] font-bold transition-all cursor-pointer border ${
                  waterType === w.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>

          {waterType === 'custom' && (
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-600">Введіть PPM вашої води:</span>
              <input
                type="number"
                min={0}
                max={900}
                value={baseWaterPpm}
                onChange={(e) => setBaseWaterPpm(Number(e.target.value))}
                className="w-24 bg-white border border-neutral-300 rounded-xl p-1.5 text-xs font-black text-center"
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. CalMag Intelligent Auto-Adjuster Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-4 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <h4 className="text-xs sm:text-sm font-black text-teal-950">
                Авто-розрахунок CalMag під {medium === 'Coco' ? 'Кокосовий субстрат' : medium === 'Soil' ? 'Ґрунт' : 'Гідропоніку'}
              </h4>
              <p className="text-[11px] text-teal-800 font-medium">
                {medium === 'Coco'
                  ? 'Кокос зв’язує іони Кальцію та Магнію. Необхідно довести базову воду до 150-180 PPM перед внесенням NPK.'
                  : 'Для запобігання дефіцитам Ca/Mg рекомендовано підтримувати буферний рівень води.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCalMagDose(recommendedCalMagMlPerL || 1.0)}
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
            >
              Застосувати рекомендовані {recommendedCalMagMlPerL || 1.0} мл/л
            </button>
          </div>
        </div>

        <div className="text-[11px] font-bold text-teal-900 bg-white/70 p-2 rounded-xl border border-teal-200/80 flex items-center justify-between">
          <span>Поточна вода: <strong>{baseWaterPpm} PPM</strong> → Цільовий буфер з CalMag: <strong>{targetBasePpm} PPM</strong></span>
          <span className="text-teal-800 font-black">+{ppmDeficit} PPM дефіциту</span>
        </div>
      </div>

      {/* 3. Stage Quick Presets */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-wider text-neutral-500">
            Швидкі пресети фази
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-600">Об’єм поливу:</span>
            <select
              value={waterVolumeLiters}
              onChange={(e) => setWaterVolumeLiters(Number(e.target.value))}
              className="bg-neutral-100 border border-neutral-200 rounded-xl px-2 py-1 text-xs font-black"
            >
              <option value={1}>1 Літр</option>
              <option value={1.5}>1.5 Літри</option>
              <option value={2}>2 Літри</option>
              <option value={5}>5 Літрів</option>
              <option value={10}>10 Літрів</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'seedling', label: '🌱 Розсада' },
            { id: 'veg', label: '🌿 Вегетація' },
            { id: 'bloom_early', label: '🌸 Раннє цвітіння' },
            { id: 'bloom_peak', label: '🌺 Пік цвітіння (PK)' },
            { id: 'flush', label: '🚿 Промивання (Flush)' }
          ].map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyStagePreset(p.id as any)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all cursor-pointer shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Dosage Sliders Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* CalMag */}
        <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-teal-900 font-extrabold flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-teal-600" />
              <span>CalMag добавка (Кальцій + Магній)</span>
            </span>
            <span className="bg-teal-100 text-teal-900 px-2 py-0.5 rounded-md font-black">
              {calMagDose} мл/л ({(calMagDose * waterVolumeLiters).toFixed(1)} мл всього)
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={3.0}
            step={0.1}
            value={calMagDose}
            onChange={(e) => setCalMagDose(Number(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer h-2 bg-neutral-200 rounded-lg"
          />
        </div>

        {/* Base NPK */}
        <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-emerald-900 font-extrabold flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
              <span>Базове живлення (Base NPK / Part A+B)</span>
            </span>
            <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-black">
              {baseNutrientDose} мл/л ({(baseNutrientDose * waterVolumeLiters).toFixed(1)} мл)
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={5.0}
            step={0.1}
            value={baseNutrientDose}
            onChange={(e) => setBaseNutrientDose(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-2 bg-neutral-200 rounded-lg"
          />
        </div>

        {/* Bloom Booster */}
        <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-rose-900 font-extrabold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Бустер цвітіння (Bloom / Стимулятор)</span>
            </span>
            <span className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded-md font-black">
              {bloomDose} мл/л ({(bloomDose * waterVolumeLiters).toFixed(1)} мл)
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={4.0}
            step={0.1}
            value={bloomDose}
            onChange={(e) => setBloomDose(Number(e.target.value))}
            className="w-full accent-rose-600 cursor-pointer h-2 bg-neutral-200 rounded-lg"
          />
        </div>

        {/* PK 13/14 / Ripen */}
        <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-amber-900 font-extrabold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Фосфорно-Калійний бустер (PK 13/14)</span>
            </span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-black">
              {pkBoosterDose} мл/л ({(pkBoosterDose * waterVolumeLiters).toFixed(1)} мл)
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={2.5}
            step={0.1}
            value={pkBoosterDose}
            onChange={(e) => setPkBoosterDose(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer h-2 bg-neutral-200 rounded-lg"
          />
        </div>
      </div>

      {/* 5. Summary Results & Action Buttons */}
      <div className="bg-neutral-900 text-white rounded-3xl p-5 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
              Розрахунок готового поживного розчину
            </span>
            <h4 className="text-xl font-black text-white">
              ~{totalCalculatedPpm} PPM <span className="text-sm font-bold text-neutral-400">({totalCalculatedEc} EC)</span>
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 font-bold block">Цільовий pH:</span>
              <span className="text-sm font-black text-purple-300">pH {targetPhVal.toFixed(1)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 font-bold block">Об&apos;єм розчину:</span>
              <span className="text-sm font-black text-cyan-300">{waterVolumeLiters} л</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setShowSaveForm(prev => !prev)}
            className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Зберегти в мої рецепти</span>
          </button>

          {onApplySolution && (
            <button
              type="button"
              onClick={handleApplyToPlant}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-xs px-5 py-2.5 rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-neutral-950 stroke-[2.5]" />
              <span>💧 Застосувати розчин для сьогоднішнього поливу</span>
            </button>
          )}
        </div>

        {/* Save Form */}
        {showSaveForm && (
          <form onSubmit={handleSaveChart} className="bg-neutral-800/80 p-3.5 rounded-2xl border border-neutral-700 space-y-2.5 animate-fade-in text-xs">
            <label className="block text-neutral-300 font-bold">
              Введіть назву для карти годування:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={chartName}
                onChange={(e) => setChartName(e.target.value)}
                placeholder="напр., BioBizz Кокос Пік Цвітіння 2026"
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold placeholder:text-neutral-500 focus:outline-none focus:border-emerald-400"
                required
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Зберегти (+15 XP)
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 6. Saved User Charts List */}
      {savedCharts.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-neutral-100">
          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5 text-amber-600" />
            <span>Ваші збережені персональні карти годування ({savedCharts.length})</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {savedCharts.map(chart => (
              <div
                key={chart.id}
                onClick={() => handleApplySavedChart(chart)}
                className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 p-3 rounded-2xl flex items-center justify-between gap-2 cursor-pointer transition-all group"
              >
                <div>
                  <h5 className="text-xs font-black text-neutral-900 group-hover:text-emerald-700 transition-colors">
                    {chart.name}
                  </h5>
                  <span className="text-[10px] text-neutral-500 font-bold block">
                    {chart.medium} • ~{chart.targetPpm} PPM • pH {chart.targetPh} • {chart.createdAt}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleDeleteChart(chart.id, e)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Видалити"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
