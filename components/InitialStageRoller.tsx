'use client';

import React, { useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sprout, Leaf, Flower2, Scissors, Info, Sparkles } from 'lucide-react';
import { StrainInfo } from '@/lib/growData';
import { PlantStage } from '@/lib/types';

interface InitialStageRollerProps {
  selectedDays: number; // 0 to 120
  onChangeDays: (days: number) => void;
  strain: StrainInfo | null;
  breederName: string;
}

export interface StageCalculationResult {
  stage: PlantStage;
  stageDay: number;
  totalStageDays: number;
  stageNameUk: string;
  floweringStartDay: number;
  estimatedHarvestDay: number;
  daysRemainingToHarvest: number;
  estimatedHarvestDate: string;
  icon: React.ReactNode;
}

export function calculatePlantStage(
  days: number,
  strain: StrainInfo | null
): StageCalculationResult {
  const isAuto = strain?.isAuto ?? true;
  const floweringWeeks = strain?.floweringWeeks ?? (isAuto ? 8 : 9);
  const floweringDays = floweringWeeks * 7;

  // Auto strains switch to flowering earlier (~22 days), Photoperiod later (~35 days)
  const floweringStartDay = isAuto ? 22 : 35;
  const estimatedHarvestDay = floweringStartDay + floweringDays;

  let stage: PlantStage = 'seedling';
  let stageDay = 1;
  let totalStageDays = 14;
  let stageNameUk = 'Розсада';
  let icon = <Leaf className="w-4 h-4 text-emerald-600" />;

  if (days <= 6) {
    stage = 'germination';
    stageDay = Math.max(1, days + 1);
    totalStageDays = 7;
    stageNameUk = 'Пророщування';
    icon = <Sprout className="w-4 h-4 text-emerald-500" />;
  } else if (days < floweringStartDay) {
    if (days <= 20) {
      stage = 'seedling';
      stageDay = days - 6;
      totalStageDays = 14;
      stageNameUk = 'Розсада';
      icon = <Leaf className="w-4 h-4 text-emerald-600" />;
    } else {
      stage = 'vegetative';
      stageDay = days - 20;
      totalStageDays = floweringStartDay - 21;
      stageNameUk = 'Вегетація';
      icon = <Leaf className="w-4 h-4 text-emerald-700" />;
    }
  } else if (days <= estimatedHarvestDay) {
    stage = 'flowering';
    stageDay = days - floweringStartDay + 1;
    totalStageDays = floweringDays;
    stageNameUk = 'Цвітіння';
    icon = <Flower2 className="w-4 h-4 text-amber-500" />;
  } else {
    stage = 'harvested';
    stageDay = days - estimatedHarvestDay + 1;
    totalStageDays = 14;
    stageNameUk = 'Дозрівання / Харвест';
    icon = <Scissors className="w-4 h-4 text-purple-600" />;
  }

  const daysRemainingToHarvest = Math.max(0, estimatedHarvestDay - days);
  const harvestDateObj = new Date(Date.now() + daysRemainingToHarvest * 24 * 60 * 60 * 1000);
  
  // Format Ukrainian short date, e.g. "12 жовт."
  const monthNamesUk = ['січ.', 'лют.', 'берез.', 'квіт.', 'трав.', 'черв.', 'лип.', 'серп.', 'верес.', 'жовт.', 'листоп.', 'груд.'];
  const estimatedHarvestDate = `${harvestDateObj.getDate()} ${monthNamesUk[harvestDateObj.getMonth()]}`;

  return {
    stage,
    stageDay,
    totalStageDays,
    stageNameUk,
    floweringStartDay,
    estimatedHarvestDay,
    daysRemainingToHarvest,
    estimatedHarvestDate,
    icon
  };
}

export const InitialStageRoller: React.FC<InitialStageRollerProps> = React.memo(({
  selectedDays,
  onChangeDays,
  strain,
  breederName
}) => {
  const rollerRef = useRef<HTMLDivElement>(null);
  const calc = calculatePlantStage(selectedDays, strain);

  // Auto scroll current selected day to center of roller
  useEffect(() => {
    if (rollerRef.current) {
      const selectedEl = rollerRef.current.querySelector(`[data-day="${selectedDays}"]`) as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedDays]);

  const handleSetDays = (val: number) => {
    const clamped = Math.min(120, Math.max(0, val));
    onChangeDays(clamped);
  };

  // Milestone Presets
  const milestones = [
    { day: 1, label: '1 дн.', desc: 'Пророщування' },
    { day: 10, label: '10 дн.', desc: 'Розсада' },
    { day: 28, label: '28 дн.', desc: 'Вегетація' },
    { day: 50, label: '50 дн.', desc: 'Цвітіння' },
    { day: 80, label: '80 дн.', desc: 'Дозрівання' }
  ];

  // Array of days 0..120
  const daysArray = Array.from({ length: 121 }, (_, i) => i);

  return (
    <div className="space-y-3 bg-[#18191c] border border-neutral-800 p-3.5 rounded-2xl">
      {/* Header & Stage Status Badge */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <label className="text-white font-black text-xs uppercase tracking-wide flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[#d8f087] shrink-0" />
          <span>2. Фаза рослини</span>
        </label>
        <span className="text-[10.5px] font-black px-2.5 py-0.5 bg-[#d8f087]/20 text-[#d8f087] rounded-full border border-[#d8f087]/30 flex items-center gap-1">
          {calc.icon}
          <span>{calc.stageNameUk} ({selectedDays} дн.)</span>
        </span>
      </div>

      {/* Interactive Roller Wheel Drum */}
      <div className="relative flex items-center gap-1 bg-[#121316] border border-neutral-800 rounded-2xl p-2 shadow-inner">
        <button
          type="button"
          onClick={() => handleSetDays(selectedDays - 1)}
          disabled={selectedDays <= 0}
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl disabled:opacity-30 cursor-pointer shrink-0"
          title="Зменшити на 1 день"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="relative flex-1 overflow-hidden py-1">
          <div
            ref={rollerRef}
            className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth px-1 py-1"
          >
            {daysArray.map((d) => {
              const isSelected = d === selectedDays;
              const isFloweringStart = d === calc.floweringStartDay;
              const isHarvestDay = d === calc.estimatedHarvestDay;

              return (
                <button
                  key={d}
                  data-day={d}
                  type="button"
                  onClick={() => handleSetDays(d)}
                  className={`flex flex-col items-center justify-center min-w-[32px] h-11 rounded-xl transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#d8f087] text-[#18181b] font-black scale-110 shadow-md ring-2 ring-[#d8f087]/50'
                      : isFloweringStart
                      ? 'bg-[#fce182]/20 text-[#fce182] font-bold border border-[#fce182]/40 hover:bg-[#fce182]/30'
                      : isHarvestDay
                      ? 'bg-purple-950/50 text-purple-300 font-bold border border-purple-800 hover:bg-purple-900/60'
                      : 'bg-[#18191c] text-neutral-300 font-medium hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  <span className="text-[11px] leading-none">{d}</span>
                  <span className="text-[8px] opacity-80 leading-none mt-0.5">дн</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSetDays(selectedDays + 1)}
          disabled={selectedDays >= 120}
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl disabled:opacity-30 cursor-pointer shrink-0"
          title="Збільшити на 1 день"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Milestone Buttons */}
      <div className="grid grid-cols-5 gap-1 pt-0.5">
        {milestones.map((m) => {
          const isActive = Math.abs(selectedDays - m.day) <= 2;
          return (
            <button
              key={m.day}
              type="button"
              onClick={() => handleSetDays(m.day)}
              className={`py-1.5 px-1 rounded-xl text-center text-[10px] transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#d8f087] text-[#18181b] font-black shadow-xs ring-1 ring-[#d8f087]'
                  : 'bg-[#121316] border border-neutral-800 text-neutral-300 hover:bg-neutral-800 font-bold'
              }`}
            >
              <div className="font-black text-[10px]">{m.label}</div>
              <div className={`text-[8px] truncate ${isActive ? 'text-[#18181b]/80' : 'text-neutral-400'}`}>
                {m.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Forecast & Breeder Analysis Banner */}
      <div className="p-3 bg-[#121316] border border-neutral-800 rounded-xl text-[11px] space-y-1.5 text-white">
        <div className="flex items-center justify-between font-black text-white border-b border-neutral-800 pb-1.5">
          <span className="flex items-center gap-1.5 text-white">
            <Sparkles className="w-3.5 h-3.5 text-[#fce182] fill-[#fce182]" />
            Прогноз за даними {breederName || 'виробника'}:
          </span>
          <span className="text-[10px] bg-[#d8f087]/20 text-[#d8f087] border border-[#d8f087]/30 px-2.5 py-0.5 rounded-full font-black">
            {strain?.isAuto ? '⚡ Автоквіт' : '☀️ Фотоперіод'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-0.5 text-[10px]">
          <div>
            <span className="text-neutral-400 block font-bold">Початок цвітіння:</span>
            <span className="font-black text-white">
              ~День {calc.floweringStartDay} ({selectedDays >= calc.floweringStartDay ? 'Вже у цвітінні' : `через ${calc.floweringStartDay - selectedDays} дн.`})
            </span>
          </div>
          <div>
            <span className="text-neutral-400 block font-bold">Прогноз врожаю:</span>
            <span className="font-black text-[#d8f087]">
              ~{calc.estimatedHarvestDate} ({calc.daysRemainingToHarvest > 0 ? `ще ~${calc.daysRemainingToHarvest} дн.` : 'Готово!'})
            </span>
          </div>
        </div>

        <div className="text-[10px] text-neutral-300 pt-1 flex items-center gap-1 font-medium border-t border-neutral-800">
          <Info className="w-3.5 h-3.5 text-[#d8f087] shrink-0" />
          <span>
            {strain ? strain.name : 'Обраний сорт'}: фаза <strong className="text-white font-black">{calc.stageNameUk}</strong> (день {calc.stageDay} фази).
          </span>
        </div>
      </div>
    </div>
  );
});

InitialStageRoller.displayName = 'InitialStageRoller';
