import React from 'react';
import { Sun, Moon, Sparkles, Lightbulb, Zap, Ruler } from 'lucide-react';
import { StrainInfo } from '@/lib/growData';

interface LightSchedulePickerProps {
  value: string; // format "18/6", "12/12", etc.
  onChange: (value: string) => void;
  label?: string;
  strain?: StrainInfo | null;
  stageName?: string;
}

function getLightRecommendation(
  strain: StrainInfo | null | undefined,
  stageName: string | undefined
): {
  recommendedPreset: string;
  recommendedHours: number;
  title: string;
  text: string;
  isAuto: boolean;
  ppfdRange: string;
  distanceRange: string;
} {
  const isAuto = strain?.isAuto ?? true;
  const strainName = strain?.name || 'Кущ';
  const stage = stageName || 'Вегетація';

  // Determine stage-specific PPFD and Distance from plant top to lamp
  let ppfdRange = '400 – 600 µmol/m²/s';
  let distanceRange = '40 – 50 см від верхівки';

  if (stage === 'Пророщування') {
    ppfdRange = '100 – 200 µmol/m²/s';
    distanceRange = '60 – 75 см від верхівки';
  } else if (stage === 'Розсада') {
    ppfdRange = '200 – 400 µmol/m²/s';
    distanceRange = '50 – 65 см від верхівки';
  } else if (stage === 'Вегетація') {
    ppfdRange = '400 – 600 µmol/m²/s';
    distanceRange = '40 – 50 см від верхівки';
  } else if (stage === 'Цвітіння') {
    ppfdRange = '600 – 900 µmol/m²/s';
    distanceRange = '30 – 40 см від верхівки';
  } else if (stage.includes('Дозрівання') || stage.includes('Харвест') || stage.includes('Збір')) {
    ppfdRange = '500 – 700 µmol/m²/s';
    distanceRange = '35 – 45 см від верхівки';
  }

  if (isAuto) {
    if (stage === 'Пророщування' || stage === 'Розсада') {
      return {
        recommendedPreset: '18/6',
        recommendedHours: 18,
        title: `Порада: Автоквіт (${strainName}) • ${stage}`,
        text: 'Для розсади автоквітів оптимальний режим 18/6 або 20/4. Це стимулює розвиток міцного коріння та перших листків.',
        isAuto: true,
        ppfdRange,
        distanceRange
      };
    } else if (stage === 'Цвітіння' || stage.includes('Дозрівання')) {
      return {
        recommendedPreset: '20/4',
        recommendedHours: 20,
        title: `Порада: Автоквіт (${strainName}) • ${stage}`,
        text: 'Автоквітам підходить 18/6 або 20/4 на цвітінні. Оскільки вони зацвітають автоматично, більше світла збільшує врожай!',
        isAuto: true,
        ppfdRange,
        distanceRange
      };
    } else {
      // Вегетація
      return {
        recommendedPreset: '18/6',
        recommendedHours: 18,
        title: `Порада: Автоквіт (${strainName}) • ${stage}`,
        text: 'На вегетації рекомендується 18/6 або 20/4. Світловий режим не потрібно змінювати для переходу на цвітіння.',
        isAuto: true,
        ppfdRange,
        distanceRange
      };
    }
  } else {
    // Photoperiod
    if (stage === 'Цвітіння' || stage.includes('Дозрівання')) {
      return {
        recommendedPreset: '12/12',
        recommendedHours: 12,
        title: `Порада: Фотоперіод (${strainName}) • ${stage}`,
        text: '⚠️ Для цвітіння фотоперіодного сорту обов’язковий режим 12/12 (12г світла / 12г суцільної темряви)!',
        isAuto: false,
        ppfdRange,
        distanceRange
      };
    } else {
      // Пророщування, Розсада, Вегетація
      return {
        recommendedPreset: '18/6',
        recommendedHours: 18,
        title: `Порада: Фотоперіод (${strainName}) • ${stage}`,
        text: 'На фазі вегетації тримайте режим 18/6. Перехід на 12/12 буде потрібен пізніше для запуску цвітіння.',
        isAuto: false,
        ppfdRange,
        distanceRange
      };
    }
  }
}

export const LightSchedulePicker: React.FC<LightSchedulePickerProps> = React.memo(({
  value,
  onChange,
  label = 'Світловий режим',
  strain,
  stageName
}) => {
  // Parse day and night hours
  const parseSchedule = (val: string): { day: number; night: number } => {
    if (!val || typeof val !== 'string') return { day: 18, night: 6 };
    const parts = val.split('/');
    const d = parseInt(parts[0], 10);
    const n = parseInt(parts[1], 10);
    if (isNaN(d) || isNaN(n)) return { day: 18, night: 6 };
    return { day: Math.min(24, Math.max(0, d)), night: Math.min(24, Math.max(0, 24 - d)) };
  };

  const { day, night } = parseSchedule(value);

  const handleSetDay = (newDay: number) => {
    const clampedDay = Math.min(24, Math.max(0, newDay));
    const newNight = 24 - clampedDay;
    onChange(`${clampedDay}/${newNight}`);
  };

  const presets = [
    { label: '18/6', day: 18, desc: 'Вегетація' },
    { label: '12/12', day: 12, desc: 'Цвітіння' },
    { label: '20/4', day: 20, desc: 'Автоквіт' },
    { label: '24/0', day: 24, desc: 'Постійне' },
  ];

  const recommendation = getLightRecommendation(strain, stageName);

  return (
    <div className="space-y-3 bg-[#18191c] border border-neutral-800 p-3.5 rounded-2xl">
      {label && (
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-1">
          <label className="text-white font-black text-xs uppercase tracking-wide flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-[#fce182] shrink-0 fill-[#fce182]" />
            <span>3. {label}</span>
          </label>
          <span className="text-[10.5px] font-black px-2.5 py-0.5 bg-[#fce182]/20 text-[#fce182] rounded-full border border-[#fce182]/30">
            {day}/{night} ({day}г день)
          </span>
        </div>
      )}

      {/* Day / Night Visual Indicators */}
      <div className="grid grid-cols-2 gap-2">
        {/* День Card */}
        <div className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
          day > 0 
            ? 'bg-[#121316] border-neutral-800 text-white' 
            : 'bg-[#121316]/50 border-neutral-800/50 text-neutral-500'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${day > 0 ? 'bg-[#fce182] text-[#18181b]' : 'bg-neutral-800 text-neutral-500'}`}>
              <Sun className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold block text-neutral-400">День</span>
              <span className="text-xs font-black">{day} год</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#fce182] bg-[#fce182]/10 px-2 py-0.5 rounded-md border border-[#fce182]/20">
            {Math.round((day / 24) * 100)}%
          </span>
        </div>

        {/* Ніч Card */}
        <div className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
          night > 0 
            ? 'bg-[#121316] border-neutral-800 text-white' 
            : 'bg-[#121316]/50 border-neutral-800/50 text-neutral-500'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${night > 0 ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-500'}`}>
              <Moon className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold block text-neutral-400">Ніч</span>
              <span className="text-xs font-black">{night} год</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-800">
            {Math.round((night / 24) * 100)}%
          </span>
        </div>
      </div>

      {/* Slider & Presets */}
      <div className="pt-2 space-y-2.5">
        {/* Smooth Range Slider */}
        <input
          type="range"
          min={0}
          max={24}
          step={1}
          value={day}
          onChange={(e) => handleSetDay(Number(e.target.value))}
          className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#fce182]"
        />

        {/* Preset Quick Buttons */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {presets.map((p) => {
            const isActive = day === p.day;
            const isRecommended = recommendation?.recommendedPreset === p.label;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handleSetDay(p.day)}
                className={`py-1.5 px-2 rounded-xl text-center text-[11px] transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-[#fce182] text-[#18181b] font-black shadow-xs ring-1 ring-[#fce182]'
                    : isRecommended
                    ? 'bg-[#121316] border-2 border-[#fce182] text-white font-bold hover:bg-neutral-800'
                    : 'bg-[#121316] border border-neutral-800 text-neutral-300 hover:bg-neutral-800 font-bold'
                }`}
              >
                <div className="font-bold flex items-center justify-center gap-0.5">
                  {p.label}
                </div>
                <div className={`text-[9px] ${isActive ? 'text-[#18181b]/80' : 'text-neutral-400'}`}>
                  {p.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Light Cycle Recommendation Box */}
        {recommendation && (
          <div className="mt-2.5 p-3 bg-[#121316] border border-neutral-800 rounded-2xl text-white space-y-2">
            <div className="flex items-center justify-between gap-1.5 border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-1.5 font-black text-xs text-white">
                <Sparkles className="w-3.5 h-3.5 text-[#fce182] shrink-0 fill-[#fce182]" />
                <span>{recommendation.title}</span>
              </div>
              {day !== recommendation.recommendedHours && (
                <button
                  type="button"
                  onClick={() => handleSetDay(recommendation.recommendedHours)}
                  className="text-[10px] font-black bg-[#fce182] hover:bg-amber-400 text-[#18181b] px-2.5 py-1 rounded-lg shadow-2xs cursor-pointer transition-colors shrink-0"
                >
                  Застосувати {recommendation.recommendedPreset}
                </button>
              )}
            </div>

            <p className="text-[11px] text-neutral-300 leading-relaxed font-medium">
              {recommendation.text}
            </p>

            {/* PPFD & Lamp Distance Indicators */}
            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-neutral-800">
              <div className="bg-[#18191c] border border-neutral-800 rounded-xl p-2 flex items-center gap-2">
                <div className="p-1.5 bg-[#121316] border border-neutral-800 rounded-lg shrink-0">
                  <Zap className="w-3.5 h-3.5 text-[#fce182] fill-[#fce182]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase block leading-tight">Потік (PPFD)</span>
                  <span className="text-[10px] sm:text-[11px] font-black text-white block truncate leading-tight mt-0.5">{recommendation.ppfdRange}</span>
                </div>
              </div>

              <div className="bg-[#18191c] border border-neutral-800 rounded-xl p-2 flex items-center gap-2">
                <div className="p-1.5 bg-[#121316] border border-neutral-800 rounded-lg shrink-0">
                  <Ruler className="w-3.5 h-3.5 text-[#fce182]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase block leading-tight">Відстань до верхівки</span>
                  <span className="text-[10px] sm:text-[11px] font-black text-white block truncate leading-tight mt-0.5">{recommendation.distanceRange}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

LightSchedulePicker.displayName = 'LightSchedulePicker';

