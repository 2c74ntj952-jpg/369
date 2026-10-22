'use client';

import React from 'react';
import { Droplets, FlaskConical, Zap, Sun, Thermometer, Stethoscope, Sparkles, CheckCircle2 } from 'lucide-react';
import { Plant, AiControlItem, ReminderTask } from '@/lib/types';
import { calculateVPD, getStagePpmRange, getSolutionRecipe, stageLabelUk } from '@/lib/growData';
import {
  diagnoseMoisture,
  diagnosePostMoisture,
  diagnosePh,
  diagnosePpm,
  diagnoseDrainagePpm,
  diagnosePpfd,
  diagnoseClimate,
} from '@/lib/metricDiagnostics';
import { MetricWarningBox } from './MetricWarningBox';
import { PlantDoctor } from '../PlantDoctor';

interface TaskMeasurementControlsProps {
  item: AiControlItem;
  taskInputValues: Record<string, Record<string, number>>;
  plant: Plant;
  cleanWaterPpm: number;
  onInputChange: (actionId: string, field: string, value: number) => void;
  onOpenSolutionModal: () => void;
  onOpenDoctor?: () => void;
  onAddTask?: (task: ReminderTask) => void;
  onAwardXP?: (xp: number, reason: string) => void;
  solutionVolume?: number;
  onVolumeChange?: (vol: number) => void;
  targetPpm?: number;
  onTargetPpmChange?: (ppm: number) => void;
  onApproveSolution?: () => void;
}

type LightZoneKey = 'center' | 'ppfdTL' | 'ppfdTR' | 'ppfdBL' | 'ppfdBR';

interface LightZoneMeta {
  key: LightZoneKey;
  label: string;
  shortLabel: string;
  icon: string;
}

const LIGHT_ZONES: Record<LightZoneKey, LightZoneMeta> = {
  center: {
    key: 'center',
    label: 'Верхівка (Центр)',
    shortLabel: 'Верхівка',
    icon: '🎯',
  },
  ppfdTL: {
    key: 'ppfdTL',
    label: 'Верх-Ліво (Пн-Зх)',
    shortLabel: 'Верх-Ліво',
    icon: '↖️',
  },
  ppfdTR: {
    key: 'ppfdTR',
    label: 'Верх-Право (Пн-Сх)',
    shortLabel: 'Верх-Право',
    icon: '↗️',
  },
  ppfdBL: {
    key: 'ppfdBL',
    label: 'Низ-Ліво (Пд-Зх)',
    shortLabel: 'Низ-Ліво',
    icon: '↙️',
  },
  ppfdBR: {
    key: 'ppfdBR',
    label: 'Низ-Право (Пд-Сх)',
    shortLabel: 'Низ-Право',
    icon: '↘️',
  },
};

const LightTaskMeasurementControls: React.FC<{
  item: AiControlItem;
  taskVals: Record<string, any>;
  plant: Plant;
  onInputChange: (actionId: string, field: string, value: number) => void;
}> = React.memo(({ item, taskVals, plant, onInputChange }) => {
  const [selectedZone, setSelectedZone] = React.useState<LightZoneKey>('center');

  const lightDistVal = taskVals.lightDistance ?? (plant.lightDistanceCm ?? 45);
  const centerPpfd = taskVals.ppfdCenter ?? taskVals.ppfd ?? plant.ppfdPoints?.center ?? (plant.lightPPFD ?? 550);
  const ppfdTL = taskVals.ppfdTL ?? plant.ppfdPoints?.topLeft ?? Math.round(centerPpfd * 0.88);
  const ppfdTR = taskVals.ppfdTR ?? plant.ppfdPoints?.topRight ?? Math.round(centerPpfd * 0.90);
  const ppfdBL = taskVals.ppfdBL ?? plant.ppfdPoints?.bottomLeft ?? Math.round(centerPpfd * 0.86);
  const ppfdBR = taskVals.ppfdBR ?? plant.ppfdPoints?.bottomRight ?? Math.round(centerPpfd * 0.89);

  const avgPpfd = Math.round((centerPpfd + ppfdTL + ppfdTR + ppfdBL + ppfdBR) / 5);
  const minCorner = Math.min(ppfdTL, ppfdTR, ppfdBL, ppfdBR);
  const uniformityPct = centerPpfd > 0 ? Math.round((minCorner / centerPpfd) * 100) : 100;

  const getZoneValue = (zone: LightZoneKey): number => {
    switch (zone) {
      case 'ppfdTL': return ppfdTL;
      case 'ppfdTR': return ppfdTR;
      case 'ppfdBL': return ppfdBL;
      case 'ppfdBR': return ppfdBR;
      case 'center':
      default:
        return centerPpfd;
    }
  };

  const currentZoneValue = getZoneValue(selectedZone);

  const handleUpdateZone = (zone: LightZoneKey, val: number) => {
    const clamped = Math.max(50, Math.min(1500, val));
    const newTL = zone === 'ppfdTL' ? clamped : ppfdTL;
    const newTR = zone === 'ppfdTR' ? clamped : ppfdTR;
    const newBL = zone === 'ppfdBL' ? clamped : ppfdBL;
    const newBR = zone === 'ppfdBR' ? clamped : ppfdBR;
    const newCenter = zone === 'center' ? clamped : centerPpfd;
    const newAvg = Math.round((newCenter + newTL + newTR + newBL + newBR) / 5);

    if (zone === 'center') {
      onInputChange(item.id, 'ppfdCenter', clamped);
      onInputChange(item.id, 'ppfd', clamped);
    } else {
      onInputChange(item.id, zone, clamped);
    }
    onInputChange(item.id, 'avgPpfd', newAvg);
  };

  return (
    <div className="space-y-3.5 text-xs">
      <div className="flex items-center justify-between font-black text-xs text-[#18181b] pb-2 border-b border-black/10">
        <div className="flex items-center gap-1.5">
          <Sun className="w-4 h-4 text-[#18181b] shrink-0" />
          <span>Точки PPFD над верхівкою:</span>
        </div>
        <span className="bg-[#18181b] text-white px-2.5 py-0.5 rounded-lg text-xs font-black shadow-xs">
          Сер: {avgPpfd} μmol
        </span>
      </div>

      {/* Відстань до лампи */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between font-black text-[11px] text-[#18181b]">
          <span>📏 Відстань від лампи до верхівки:</span>
          <span className="bg-[#18181b] text-white font-black px-2.5 py-0.5 rounded-lg text-xs shadow-xs">
            {lightDistVal} см
          </span>
        </div>
        <input
          type="range"
          min={15}
          max={90}
          step={1}
          value={lightDistVal}
          onChange={(e) => onInputChange(item.id, 'lightDistance', parseInt(e.target.value, 10))}
          className="w-full accent-[#18181b] cursor-pointer h-2.5 bg-black/15 hover:bg-black/25 rounded-lg touch-pan-y transition-colors"
        />
      </div>

      {/* Чотирикутник над кроною (Quad Canopy Map) */}
      <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-white/80 space-y-2.5 text-[#18181b] shadow-xs">
        <div className="flex items-center justify-between text-[10px] text-[#18181b]/70 font-bold">
          <span>📐 Сітка PPFD (клікніть вікно для перемикання):</span>
          <span className="text-[#18181b] font-black">Рівномірність: ~{uniformityPct}%</span>
        </div>

        {/* 3x3 Grid with 5 interactive windows & 4 direction labels */}
        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
          {/* 1: Top-Left (div:nth-of-type(1)) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelectedZone('ppfdTL')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedZone('ppfdTL'); } }}
            aria-pressed={selectedZone === 'ppfdTL'}
            title="Клікніть для вибору вікна Верх-Ліво"
            className={`p-1.5 rounded-lg border cursor-pointer transition-all select-none flex flex-col items-center justify-between min-h-[50px] ${
              selectedZone === 'ppfdTL'
                ? 'bg-black/15 border-black ring-2 ring-black shadow-sm scale-[1.02]'
                : 'bg-transparent border-black/20 hover:bg-black/5'
            }`}
          >
            <div className="flex items-center justify-between w-full px-0.5">
              <span className="text-[#18181b]/70 text-[9px] flex items-center gap-0.5">↖️ Верх-Ліво</span>
              {selectedZone === 'ppfdTL' && <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] animate-pulse" />}
            </div>
            <span className="text-[#18181b] font-black text-xs">{ppfdTL}</span>
          </div>

          {/* 2: Top Spacer (div:nth-of-type(2)) */}
          <div className="flex items-center justify-center text-[#18181b]/60 text-[10px] select-none font-semibold">
            ▲ Північ
          </div>

          {/* 3: Top-Right (div:nth-of-type(3)) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelectedZone('ppfdTR')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedZone('ppfdTR'); } }}
            aria-pressed={selectedZone === 'ppfdTR'}
            title="Клікніть для вибору вікна Верх-Право"
            className={`p-1.5 rounded-lg border cursor-pointer transition-all select-none flex flex-col items-center justify-between min-h-[50px] ${
              selectedZone === 'ppfdTR'
                ? 'bg-black/15 border-black ring-2 ring-black shadow-sm scale-[1.02]'
                : 'bg-transparent border-black/20 hover:bg-black/5'
            }`}
          >
            <div className="flex items-center justify-between w-full px-0.5">
              <span className="text-[#18181b]/70 text-[9px] flex items-center gap-0.5">↗️ Верх-Право</span>
              {selectedZone === 'ppfdTR' && <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] animate-pulse" />}
            </div>
            <span className="text-[#18181b] font-black text-xs">{ppfdTR}</span>
          </div>

          {/* 4: Mid Left spacer (div:nth-of-type(4)) */}
          <div className="flex items-center justify-center text-[#18181b]/60 text-[10px] select-none font-semibold">
            ◄ Захід
          </div>

          {/* 5: Center Canopy (div:nth-of-type(5)) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelectedZone('center')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedZone('center'); } }}
            aria-pressed={selectedZone === 'center'}
            title="Клікніть для вибору вікна Верхівка"
            className={`p-1.5 rounded-lg border-2 cursor-pointer transition-all select-none flex flex-col items-center justify-between min-h-[50px] ${
              selectedZone === 'center'
                ? 'bg-black/15 border-black ring-2 ring-black shadow-sm scale-[1.03]'
                : 'bg-transparent border-black/30 hover:bg-black/5'
            }`}
          >
            <div className="flex items-center justify-between w-full px-0.5">
              <span className="text-[#18181b] text-[9px] font-black flex items-center gap-0.5">🎯 Верхівка</span>
              {selectedZone === 'center' && <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] animate-pulse" />}
            </div>
            <span className="text-[#18181b] font-black text-xs">{centerPpfd}</span>
          </div>

          {/* 6: Mid Right spacer (div:nth-of-type(6)) */}
          <div className="flex items-center justify-center text-[#18181b]/60 text-[10px] select-none font-semibold">
            Схід ►
          </div>

          {/* 7: Bottom-Left (div:nth-of-type(7)) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelectedZone('ppfdBL')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedZone('ppfdBL'); } }}
            aria-pressed={selectedZone === 'ppfdBL'}
            title="Клікніть для вибору вікна Низ-Ліво"
            className={`p-1.5 rounded-lg border cursor-pointer transition-all select-none flex flex-col items-center justify-between min-h-[50px] ${
              selectedZone === 'ppfdBL'
                ? 'bg-black/15 border-black ring-2 ring-black shadow-sm scale-[1.02]'
                : 'bg-transparent border-black/20 hover:bg-black/5'
            }`}
          >
            <div className="flex items-center justify-between w-full px-0.5">
              <span className="text-[#18181b]/70 text-[9px] flex items-center gap-0.5">↙️ Низ-Ліво</span>
              {selectedZone === 'ppfdBL' && <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] animate-pulse" />}
            </div>
            <span className="text-[#18181b] font-black text-xs">{ppfdBL}</span>
          </div>

          {/* 8: Bottom Spacer (div:nth-of-type(8)) */}
          <div className="flex items-center justify-center text-[#18181b]/60 text-[10px] select-none font-semibold">
            ▼ Південь
          </div>

          {/* 9: Bottom-Right (div:nth-of-type(9)) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelectedZone('ppfdBR')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedZone('ppfdBR'); } }}
            aria-pressed={selectedZone === 'ppfdBR'}
            title="Клікніть для вибору вікна Низ-Право"
            className={`p-1.5 rounded-lg border cursor-pointer transition-all select-none flex flex-col items-center justify-between min-h-[50px] ${
              selectedZone === 'ppfdBR'
                ? 'bg-black/15 border-black ring-2 ring-black shadow-sm scale-[1.02]'
                : 'bg-transparent border-black/20 hover:bg-black/5'
            }`}
          >
            <div className="flex items-center justify-between w-full px-0.5">
              <span className="text-[#18181b]/70 text-[9px] flex items-center gap-0.5">↘️ Низ-Право</span>
              {selectedZone === 'ppfdBR' && <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] animate-pulse" />}
            </div>
            <span className="text-[#18181b] font-black text-xs">{ppfdBR}</span>
          </div>
        </div>


        {/* Adjustment Controls for Selected Window */}
        <div className="pt-1.5 space-y-2 bg-transparent p-2.5 rounded-lg border border-black/20">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#18181b] font-bold">Налаштувати PPFD:</span>
              <span className="bg-black/10 text-[#18181b] border border-black/20 px-1.5 py-0.5 rounded text-[10px] font-black">
                {LIGHT_ZONES[selectedZone].icon} {LIGHT_ZONES[selectedZone].label}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={50}
                max={1500}
                step={10}
                value={currentZoneValue}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) handleUpdateZone(selectedZone, v);
                }}
                className="w-14 bg-transparent border border-black/30 rounded px-1 py-0.5 text-right text-[#18181b] font-black text-xs focus:border-black focus:outline-none"
              />
              <span className="text-[#18181b]/70 text-[10px]">μmol</span>
            </div>
          </div>

          <input
            type="range"
            min={100}
            max={1200}
            step={10}
            value={currentZoneValue}
            onChange={(e) => handleUpdateZone(selectedZone, parseInt(e.target.value, 10))}
            className="w-full accent-[#18181b] cursor-pointer h-2 bg-black/20 rounded-lg touch-pan-y"
          />

          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleUpdateZone(selectedZone, currentZoneValue - 50)}
                className="px-2 py-0.5 bg-transparent hover:bg-black/10 text-[#18181b] rounded text-[10px] font-bold border border-black/30 active:scale-95 cursor-pointer"
              >
                -50
              </button>
              <button
                type="button"
                onClick={() => handleUpdateZone(selectedZone, currentZoneValue - 10)}
                className="px-2 py-0.5 bg-transparent hover:bg-black/10 text-[#18181b] rounded text-[10px] font-bold border border-black/30 active:scale-95 cursor-pointer"
              >
                -10
              </button>
            </div>
            <span className="text-[9.5px] text-[#18181b]/70 font-medium">Точне коригування</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleUpdateZone(selectedZone, currentZoneValue + 10)}
                className="px-2 py-0.5 bg-transparent hover:bg-black/10 text-[#18181b] rounded text-[10px] font-bold border border-black/30 active:scale-95 cursor-pointer"
              >
                +10
              </button>
              <button
                type="button"
                onClick={() => handleUpdateZone(selectedZone, currentZoneValue + 50)}
                className="px-2 py-0.5 bg-transparent hover:bg-black/10 text-[#18181b] rounded text-[10px] font-bold border border-black/30 active:scale-95 cursor-pointer"
              >
                +50
              </button>
            </div>
          </div>

          {/* PPFD Diagnostic Warning & Consequence */}
          {(() => {
            const ppfdDiag = diagnosePpfd(currentZoneValue, plant.stage);
            return ppfdDiag.isAbnormal ? (
              <MetricWarningBox diagnostic={ppfdDiag} compact className="mt-2" />
            ) : null;
          })()}
        </div>
      </div>
    </div>
  );
});

LightTaskMeasurementControls.displayName = 'LightTaskMeasurementControls';

export const TaskMeasurementControls: React.FC<TaskMeasurementControlsProps> = React.memo(({
  item,
  taskInputValues,
  plant,
  cleanWaterPpm,
  onInputChange,
  onOpenSolutionModal,
  onOpenDoctor,
  onAddTask,
  onAwardXP,
  solutionVolume,
  onVolumeChange,
  targetPpm,
  onTargetPpmChange,
  onApproveSolution,
}) => {
  const taskVals = taskInputValues[item.id] || {};
  const [isInlineSolutionOpen, setIsInlineSolutionOpen] = React.useState(false);
  const [localVolume, setLocalVolume] = React.useState<number>(solutionVolume ?? 2);
  const stagePpmBounds = React.useMemo(() => getStagePpmRange(plant.stage), [plant.stage]);
  const [localPpm, setLocalPpm] = React.useState<number>(targetPpm ?? stagePpmBounds.mid);

  // 1. Щоденний контроль вологості субстрату (До поливу)
  if (item.id === 'action-routine-moisture') {
    const currentMoisture = taskVals.moisture ?? (plant.moistureBeforeWatering ?? 25);
    const moistDiag = diagnoseMoisture(currentMoisture);

    return (
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between font-black text-[#18181b] pb-2 border-b border-black/10">
          <span className="flex items-center gap-1.5 text-xs font-black text-[#18181b]">
            <Droplets className="w-4 h-4 text-[#18181b] shrink-0" />
            <span>Замір вологості субстрату:</span>
          </span>
          <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-[#18181b] text-white shadow-xs">
            {currentMoisture}%
          </span>
        </div>
        <div className="space-y-1.5">
          <input
            type="range"
            min={10}
            max={100}
            step={1}
            value={currentMoisture}
            onChange={(e) => onInputChange(item.id, 'moisture', parseInt(e.target.value, 10))}
            className="w-full accent-[#18181b] cursor-pointer h-2.5 bg-black/15 hover:bg-black/25 rounded-lg touch-pan-y transition-colors"
          />
          <div className="flex items-center justify-between text-[10px] text-[#18181b]/70 font-bold px-0.5">
            <span>≤ 30% (Час поливати)</span>
            <span>31%–70% (Норма / Dry-back)</span>
            <span>&gt; 80% (Перелив)</span>
          </div>

          {/* Попередження про наслідки при відхиленні */}
          {moistDiag.isAbnormal && (
            <MetricWarningBox diagnostic={moistDiag} compact className="mt-2" />
          )}
        </div>
      </div>
    );
  }

  // 2. Показники до поливу: pH та PPM субстрату разом
  if (item.id === 'action-water-measure-before' || item.id === 'action-water-ph-before') {
    const phVal = taskVals.ph ?? (plant.phBeforeWatering ?? plant.currentPH ?? 6.2);
    const ppmVal = taskVals.ppm ?? (plant.ppmBeforeWatering ?? 650);
    const phDiag = diagnosePh(phVal, plant.medium || 'soil', 'substrate');
    const ppmDiag = diagnosePpm(ppmVal, plant.stage);

    return (
      <div className="space-y-3.5 text-xs">
        <div className="font-black text-xs text-[#18181b] flex items-center justify-between pb-2 border-b border-black/10">
          <div className="flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-[#18181b] shrink-0" />
            <span>Параметри субстрату до поливу:</span>
          </div>
        </div>

        {/* pH Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-black text-[11px] text-[#18181b]">
            <span>🧪 pH субстрату:</span>
            <span className="bg-[#18181b] text-white font-black px-2.5 py-0.5 rounded-lg text-xs shadow-xs">
              pH {typeof phVal === 'number' ? phVal.toFixed(1) : phVal}
            </span>
          </div>
          <input
            type="range"
            min={5.0}
            max={8.0}
            step={0.1}
            value={phVal}
            onChange={(e) => onInputChange(item.id, 'ph', parseFloat(e.target.value))}
            className="w-full accent-[#18181b] cursor-pointer h-2.5 bg-black/15 hover:bg-black/25 rounded-lg touch-pan-y transition-colors"
          />
          <div className="flex items-center justify-between text-[9.5px] text-[#18181b]/70 font-bold px-0.5">
            <span>5.5 (Кокос/Гідро)</span>
            <span>6.2–6.5 (Ґрунт оптимум)</span>
            <span>7.5 (Лужне)</span>
          </div>

          {/* Попередження про закислення або залуження та наслідки */}
          {phDiag.isAbnormal && (
            <MetricWarningBox diagnostic={phDiag} compact className="mt-1.5" />
          )}
        </div>

        {/* PPM Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-black text-[11px] text-[#18181b]">
            <span>⚡ Солоність (PPM) субстрату:</span>
            <span className="bg-[#18181b] text-white font-black px-2.5 py-0.5 rounded-lg text-xs shadow-xs">
              {ppmVal} PPM
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={2500}
            step={25}
            value={ppmVal}
            onChange={(e) => onInputChange(item.id, 'ppm', parseInt(e.target.value, 10))}
            className="w-full accent-[#18181b] cursor-pointer h-2.5 bg-black/15 hover:bg-black/25 rounded-lg touch-pan-y transition-colors"
          />
          <div className="flex items-center justify-between text-[9.5px] text-[#18181b]/70 font-bold px-0.5">
            <span>300 (Розсада)</span>
            <span>600–800 (Вега)</span>
            <span>1000–1200 (Цвіт)</span>
          </div>

          {/* Попередження про засол або дефіцит та наслідки */}
          {ppmDiag.isAbnormal && (
            <MetricWarningBox diagnostic={ppmDiag} compact className="mt-1.5" />
          )}
        </div>
      </div>
    );
  }

  // 3. PPM чистої води без добрив та вибір об'єму горщика
  if (item.id === 'action-water-clean-ppm') {
    const waterPpmVal = taskVals.cleanWaterPpm ?? (plant.cleanWaterPPM ?? cleanWaterPpm ?? 100);
    const storedPotSize = typeof window !== 'undefined' && plant?.id ? Number(localStorage.getItem(`plant_pot_size_${plant.id}`)) : undefined;
    const currentPotVal = taskVals.potSize ?? (plant.potSize || (storedPotSize && !isNaN(storedPotSize) ? storedPotSize : 10));
    const calcVol = Math.max(0.2, Number((currentPotVal * 0.20).toFixed(1)));

    const handlePotSizeChange = (newVal: number) => {
      const sanitized = Math.max(0.5, Math.min(60, Number(newVal.toFixed(1))));
      onInputChange(item.id, 'potSize', sanitized);
      const nextCalcVol = Math.max(0.2, Number((sanitized * 0.20).toFixed(1)));
      if (onVolumeChange) onVolumeChange(nextCalcVol);
      else setLocalVolume(nextCalcVol);
      if (typeof window !== 'undefined' && plant?.id) {
        try {
          localStorage.setItem(`plant_pot_size_${plant.id}`, String(sanitized));
        } catch (e) {}
      }
    };

    return (
      <div className="space-y-3.5 text-xs">
        {/* Блок вибору об'єму горщика (Frosted sub-card) */}
        <div className="space-y-2.5 bg-white/50 backdrop-blur-sm border border-white/80 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between font-black text-[#18181b]">
            <span className="flex items-center gap-1.5 text-[11.5px] font-black text-[#18181b]">
              <span className="text-sm">🪴</span>
              <span>Об&apos;єм горщика (л):</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePotSizeChange(currentPotVal - 1)}
                className="w-7 h-7 rounded-lg bg-white/80 hover:bg-white border border-black/20 text-[#18181b] font-black text-sm flex items-center justify-center active:scale-95 cursor-pointer shadow-xs transition-all"
                title="Зменшити на 1 л"
              >
                -
              </button>
              <input
                type="number"
                min={0.5}
                max={60}
                step={0.5}
                value={currentPotVal}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) handlePotSizeChange(val);
                }}
                className="w-14 bg-white/90 border border-black/30 text-[#18181b] font-black text-xs text-center py-1 px-1 rounded-lg shadow-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="button"
                onClick={() => handlePotSizeChange(currentPotVal + 1)}
                className="w-7 h-7 rounded-lg bg-white/80 hover:bg-white border border-black/20 text-[#18181b] font-black text-sm flex items-center justify-center active:scale-95 cursor-pointer shadow-xs transition-all"
                title="Збільшити на 1 л"
              >
                +
              </button>
            </div>
          </div>

          {/* Слайдер об'єму горщика */}
          <input
            type="range"
            min={1}
            max={45}
            step={0.5}
            value={currentPotVal}
            onChange={(e) => handlePotSizeChange(parseFloat(e.target.value))}
            className="w-full accent-[#18181b] cursor-pointer h-2.5 bg-black/15 hover:bg-black/25 rounded-lg touch-pan-y transition-colors"
          />

          {/* Розрахований об'єм поливу під горщик */}
          <div className="bg-white/80 border border-white/90 rounded-lg p-2 text-[11px] text-[#18181b] font-bold flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-1">
              <span>💧 Розрахований об&apos;єм поливу під горщик {currentPotVal} л:</span>
            </span>
            <span className="bg-[#18181b] text-white px-2.5 py-0.5 rounded-md font-black shadow-xs">{calcVol} л</span>
          </div>

          <p className="text-[10px] text-[#18181b]/75 font-medium leading-tight">
            💾 Виставлений об&apos;єм {currentPotVal} л зберігається до наступного поливу. При наступному поливі ви зможете змінити його за потреби.
          </p>
        </div>

        {/* PPM вихідної чистої води (без добрив) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between font-black text-[#18181b]">
            <span className="flex items-center gap-1.5 text-[11px] font-black text-[#18181b]">
              <Droplets className="w-3.5 h-3.5 text-[#18181b] shrink-0" />
              <span>PPM вихідної чистої води (без добрив):</span>
            </span>
            <span className="text-xs bg-[#18181b] text-white font-black px-2.5 py-0.5 rounded-lg shadow-xs">
              {waterPpmVal} PPM
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={500}
            step={5}
            value={waterPpmVal}
            onChange={(e) => onInputChange(item.id, 'cleanWaterPpm', parseInt(e.target.value, 10))}
            className="w-full accent-[#18181b] cursor-pointer h-2.5 bg-black/15 hover:bg-black/25 rounded-lg touch-pan-y transition-colors"
          />
          <div className="flex items-center justify-between text-[10px] text-[#18181b]/70 font-bold px-0.5">
            <span>0 PPM (Осмос / RO)</span>
            <span>100–150 PPM (Оптимум)</span>
            <span>300+ PPM (Жорстка вода)</span>
          </div>

          {/* Попередження про високу жорсткість вихідної води */}
          {waterPpmVal > 250 && (
            <MetricWarningBox
              diagnostic={{
                isAbnormal: true,
                severity: 'warning',
                metricName: 'PPM вихідної води',
                currentValue: `${waterPpmVal} PPM`,
                optimalRange: '0 – 150 PPM',
                problemTitle: 'Висока жорсткість вихідної води (> 250 PPM)',
                consequence: 'Надлишок розчиненого вапна та солей ускладнює точне дозування добрив, викликає швидке засолення субстрату та блокування мікроелементів.',
                recommendation: 'Рекомендовано використовувати осмотичну (RO) або відстояну воду для розчину.',
              }}
              compact
              className="mt-2"
            />
          )}
        </div>
      </div>
    );
  }

  // 4. Приготування розчину (Калькулятор добрив прямо у вікні чату)
  if (item.id === 'action-water-solution-prep') {
    const storedPotSize = typeof window !== 'undefined' && plant?.id ? Number(localStorage.getItem(`plant_pot_size_${plant.id}`)) : undefined;
    const currentPotVal = taskInputValues['action-water-clean-ppm']?.potSize ?? (plant.potSize || (storedPotSize && !isNaN(storedPotSize) ? storedPotSize : 10));
    const currentVol = Math.max(0.2, Number((currentPotVal * 0.20).toFixed(1)));
    const currentPpm = targetPpm ?? localPpm;
    const recipe = getSolutionRecipe(currentVol, plant.stage, currentPpm);

    const handleSelectPpm = (val: number) => {
      if (onTargetPpmChange) onTargetPpmChange(val);
      else setLocalPpm(val);
    };

    return (
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/10">
          <span className="font-black text-xs text-[#18181b] flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-[#18181b] shrink-0" />
            <span>Калькулятор живильного розчину:</span>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsInlineSolutionOpen(prev => !prev);
            }}
            className="bg-[#18181b] hover:bg-black active:scale-95 text-white font-black text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer border border-black/20"
          >
            <FlaskConical className="w-3.5 h-3.5 text-white" />
            <span>{isInlineSolutionOpen ? 'Згорнути [РОЗЧИН]' : 'Відкрити [РОЗЧИН]'}</span>
          </button>
        </div>

        {plant.approvedSolution && !isInlineSolutionOpen ? (
          <div className="bg-white/60 backdrop-blur-sm text-[#18181b] border border-white/80 p-2.5 rounded-xl text-[11.5px] font-bold flex items-center justify-between shadow-xs">
            <span>✓ Зафіксовано розчин: {currentVol} л (горщик {currentPotVal} л)</span>
            <span className="bg-[#18181b] text-white px-2 py-0.5 rounded-md font-black text-[11px]">
              Ціль {plant.approvedSolution.targetPpm || 650} PPM
            </span>
          </div>
        ) : !isInlineSolutionOpen ? (
          <p className="text-[11px] text-[#18181b]/80 font-medium">
            Натисніть кнопку вище, щоб відкрити живильний розчин на розрахований об&apos;єм <strong>{currentVol} л</strong> (під горщик {currentPotVal} л).
          </p>
        ) : null}

        {/* Відкритий калькулятор живильного розчину безпосередньо у вікні чату */}
        {isInlineSolutionOpen && (
          <div className="space-y-3 pt-1">
            {/* 1: Цільовий PPM */}
            <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-xl p-3 space-y-2 shadow-xs">
              <div className="flex items-center justify-between font-black text-[#18181b]">
                <span className="text-[11px] flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>Цільовий PPM ({stageLabelUk(plant.stage)}):</span>
                </span>
                <span className="bg-[#18181b] text-white font-black px-2.5 py-0.5 rounded-lg text-xs shadow-xs">
                  {currentPpm} PPM
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => handleSelectPpm(stagePpmBounds.min)}
                  className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer border text-[10px] font-bold ${
                    currentPpm === stagePpmBounds.min
                      ? 'bg-[#18181b] text-white border-[#18181b] shadow-xs font-black'
                      : 'bg-white/70 hover:bg-white text-[#18181b] border-black/20'
                  }`}
                >
                  Мін: {stagePpmBounds.min}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPpm(stagePpmBounds.mid)}
                  className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer border text-[10px] font-bold ${
                    currentPpm === stagePpmBounds.mid
                      ? 'bg-[#18181b] text-white border-[#18181b] shadow-xs font-black'
                      : 'bg-white/70 hover:bg-white text-[#18181b] border-black/20'
                  }`}
                >
                  Опт: {stagePpmBounds.mid}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPpm(stagePpmBounds.max)}
                  className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer border text-[10px] font-bold ${
                    currentPpm === stagePpmBounds.max
                      ? 'bg-[#18181b] text-white border-[#18181b] shadow-xs font-black'
                      : 'bg-white/70 hover:bg-white text-[#18181b] border-black/20'
                  }`}
                >
                  Макс: {stagePpmBounds.max}
                </button>
              </div>
            </div>

            {/* 3: Дозування рецепту */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/90 rounded-xl p-3 space-y-2 shadow-xs">
              <div className="text-[11px] font-black text-[#18181b] flex items-center justify-between pb-1 border-b border-black/10">
                <span>📋 Рецепт дозування на {currentVol} л води:</span>
                <span className="text-[10px] text-[#18181b]/70 font-bold">~{currentPpm} PPM</span>
              </div>
              <div className="space-y-1.5">
                {recipe.map(item => (
                  <div
                    key={item.id}
                    className="bg-white/80 border border-black/10 p-2 rounded-lg flex items-center justify-between shadow-2xs"
                  >
                    <span className="font-bold text-[#18181b] text-[11px]">{item.name}:</span>
                    <span className="font-black text-[#18181b] text-xs bg-black/5 px-2 py-0.5 rounded-md">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4: Порядок замішування */}
            <div className="bg-[#18181b] text-white rounded-xl p-3 space-y-1.5 text-[10.5px] shadow-sm">
              <div className="flex items-center gap-1.5 font-black text-xs text-[#d8f087]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Порядок додавання компонентів:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-neutral-200 font-medium pl-0.5">
                <li>Наберіть <strong className="text-white font-bold">{currentVol} л</strong> відстояної води (20–22°C).</li>
                <li>Спершу додайте <strong className="text-white font-bold">{recipe.find(r => r.id === 'calmag')?.amount ?? '1 мл'} CalMag</strong> і добре розмішайте.</li>
                <li>Додайте <strong className="text-white font-bold">{recipe.find(r => r.id === 'base-npk')?.amount ?? '2 мл'} NPK</strong> та <strong className="text-white font-bold">{recipe.find(r => r.id === 'stimulant')?.amount ?? '0.5 мл'} стимулятора</strong>.</li>
                <li>Перевірте pH та відкоригуйте до <strong className="text-white font-bold">{plant.medium === 'Soil' ? '6.2–6.5' : '5.8–6.0'} pH</strong> на наступному кроці.</li>
              </ol>
            </div>

            {/* 5: Фіксація розчину */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onApproveSolution) {
                  onApproveSolution();
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl font-black text-xs text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all border border-emerald-500"
            >
              <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
              <span>Розчин для поливу створено ✓</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // 5. pH готового розчину для поливу
  if (item.id === 'action-water-ph-solution') {
    const phVal = taskVals.waterPh ?? (plant.phBeforeWatering ?? 6.3);
    const solPhDiag = diagnosePh(phVal, plant.medium || 'soil', 'solution');

    return (
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between font-black text-[#18181b] pb-2 border-b border-black/10">
          <span className="flex items-center gap-1.5 text-xs font-black text-[#18181b]">
            <FlaskConical className="w-4 h-4 text-[#18181b] shrink-0" />
            <span>pH готового розчину:</span>
          </span>
          <span className="text-xs bg-[#18181b] text-white font-black px-2.5 py-0.5 rounded-lg shadow-xs">
            pH {typeof phVal === 'number' ? phVal.toFixed(1) : phVal}
          </span>
        </div>
        <div className="space-y-1.5">
          <input
            type="range"
            min={5.2}
            max={7.5}
            step={0.1}
            value={phVal}
            onChange={(e) => onInputChange(item.id, 'waterPh', parseFloat(e.target.value))}
            className="w-full accent-[#18181b] cursor-pointer h-2.5 bg-black/15 hover:bg-black/25 rounded-lg touch-pan-y transition-colors"
          />
          <div className="flex items-center justify-between text-[10px] text-[#18181b]/70 font-bold px-0.5">
            <span>5.8–6.0 (Кокос)</span>
            <span>6.2–6.5 (Ґрунт ціль)</span>
            <span>6.8 (Верхня межа)</span>
          </div>

          {/* Попередження про закислення або лужність розчину */}
          {solPhDiag.isAbnormal && (
            <MetricWarningBox diagnostic={solPhDiag} compact className="mt-1.5" />
          )}
        </div>
      </div>
    );
  }

  // 6. Внесення поливу (Підтвердження)
  if (item.id === 'action-water-applied') {
    return (
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-[#18181b] font-black text-xs pb-1.5 border-b border-black/10">
          <CheckCircle2 className="w-4 h-4 text-[#18181b] shrink-0" />
          <span>Повільно пролийте субстрат по периметру горщика</span>
        </div>
        <p className="text-[11px] text-[#18181b]/80 font-medium leading-relaxed">
          Забезпечте вихід 10–20% дренажу з дна горщика для оновлення поживного середовища та вимивання баластних солей.
        </p>
      </div>
    );
  }

  // 7. Контроль виходу (Дренаж): PPM та pH дренажу разом
  if (item.id === 'action-water-drainage-after' || item.id === 'action-water-ppm-after') {
    const drainPpmVal = taskVals.ppm ?? (plant.ppmAfterWatering ?? plant.ppmBeforeWatering ?? 750);
    const drainPhVal = taskVals.ph ?? (plant.phAfterWatering ?? plant.currentPH ?? 6.3);
    const drainPpmDiag = diagnoseDrainagePpm(drainPpmVal, plant.ppmBeforeWatering ?? 850);
    const drainPhDiag = diagnosePh(drainPhVal, plant.medium || 'soil', 'drainage');

    return (
      <div className="space-y-3.5 text-xs">
        <div className="font-black text-xs text-[#18181b] flex items-center justify-between pb-2 border-b border-black/10">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#18181b] shrink-0" />
            <span>Заміри вихідного дренажу:</span>
          </div>
        </div>

        {/* Drainage PPM */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-black text-[11px] text-[#18181b]">
            <span>⚡ PPM дренажної води:</span>
            <span className="text-white font-black px-2.5 py-0.5 rounded-lg text-xs bg-[#18181b] shadow-xs">
              {drainPpmVal} PPM
            </span>
          </div>
          <input
            type="range"
            min={200}
            max={2500}
            step={25}
            value={drainPpmVal}
            onChange={(e) => onInputChange(item.id, 'ppm', parseInt(e.target.value, 10))}
            className="w-full accent-[#18181b] cursor-pointer h-2.5 bg-black/15 hover:bg-black/25 rounded-lg touch-pan-y transition-colors"
          />
          <div className="flex items-center justify-between text-[9.5px] text-[#18181b]/70 font-bold px-0.5">
            <span>&lt; 600 (Голод)</span>
            <span>700–1100 (Баланс)</span>
            <span>&gt; 1300 (Ризик засолу)</span>
          </div>

          {/* Попередження про засол у субстраті */}
          {drainPpmDiag.isAbnormal && (
            <MetricWarningBox diagnostic={drainPpmDiag} compact className="mt-1.5" />
          )}
        </div>

        {/* Drainage pH */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-black text-[11px] text-[#18181b]">
            <span>🧪 pH дренажної води:</span>
            <span className="bg-[#18181b] text-white font-black px-2.5 py-0.5 rounded-lg text-xs shadow-xs">
              pH {typeof drainPhVal === 'number' ? drainPhVal.toFixed(1) : drainPhVal}
            </span>
          </div>
          <input
            type="range"
            min={5.0}
            max={8.0}
            step={0.1}
            value={drainPhVal}
            onChange={(e) => onInputChange(item.id, 'ph', parseFloat(e.target.value))}
            className="w-full accent-[#18181b] cursor-pointer h-2.5 bg-black/15 hover:bg-black/25 rounded-lg touch-pan-y transition-colors"
          />
          <div className="flex items-center justify-between text-[9.5px] text-[#18181b]/70 font-bold px-0.5">
            <span>5.5–5.8 (Кисліше норми)</span>
            <span>6.0–6.8 (Оптимум виходу)</span>
            <span>&gt; 7.2 (Лужний дренаж)</span>
          </div>

          {/* Попередження про pH виходу */}
          {drainPhDiag.isAbnormal && (
            <MetricWarningBox diagnostic={drainPhDiag} compact className="mt-1.5" />
          )}
        </div>
      </div>
    );
  }

  // 8. Підсумкова вологість субстрату після поливу
  if (item.id === 'action-water-moisture-after') {
    const currentMoistureAfter = taskVals.moisture ?? (plant.moistureAfterWatering ?? 78);
    const postMoistDiag = diagnosePostMoisture(currentMoistureAfter);

    return (
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between font-black text-[#18181b] pb-2 border-b border-black/10">
          <span className="flex items-center gap-1.5 text-xs font-black text-[#18181b]">
            <Droplets className="w-4 h-4 text-[#18181b] shrink-0" />
            <span>Підсумкова вологість після поливу (%):</span>
          </span>
          <span className="text-xs bg-[#18181b] text-white font-black px-2.5 py-0.5 rounded-lg shadow-xs">
            {currentMoistureAfter}%
          </span>
        </div>
        <div className="space-y-1.5">
          <input
            type="range"
            min={50}
            max={100}
            step={1}
            value={currentMoistureAfter}
            onChange={(e) => onInputChange(item.id, 'moisture', parseInt(e.target.value, 10))}
            className="w-full accent-[#18181b] cursor-pointer h-2.5 bg-black/15 hover:bg-black/25 rounded-lg touch-pan-y transition-colors"
          />
          <div className="flex items-center justify-between text-[10px] text-[#18181b]/70 font-bold px-0.5">
            <span>60% (Мало води)</span>
            <span className="text-[#18181b] font-black">70%–80% (Ідеально)</span>
            <span>90%+ (Надлишок)</span>
          </div>

          {/* Попередження про недолив або перелив після процедури */}
          {postMoistDiag.isAbnormal && (
            <MetricWarningBox diagnostic={postMoistDiag} compact className="mt-2" />
          )}
        </div>
      </div>
    );
  }

  // 9. Крок 1 (Мікроклімат): t° та вологість повітря з розрахунком VPD
  if (
    item.id === 'action-routine-climate' ||
    item.category === 'climate'
  ) {
    const tempVal = taskVals.temp ?? (plant.currentTemp ?? 24);
    const humVal = taskVals.humidity ?? (plant.currentHumidity ?? 50);
    const liveVpd = calculateVPD(tempVal, humVal, plant.stage);
    const climateDiags = diagnoseClimate(tempVal, humVal, plant.stage);

    return (
      <div className="space-y-3.5 text-xs">
        <div className="flex items-center justify-between font-black text-xs text-[#18181b] pb-2 border-b border-black/10">
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-[#18181b] shrink-0" />
            <span>Мікроклімат у боксі:</span>
          </div>
          <span className="bg-[#18181b] text-white px-2.5 py-0.5 rounded-lg text-xs font-black shadow-xs">
            VPD: {liveVpd.vpd} kPa
          </span>
        </div>

        {/* Температура */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-black text-[11px] text-[#18181b]">
            <span>🌡️ Температура повітря:</span>
            <span className="bg-[#18181b] text-white font-black px-2.5 py-0.5 rounded-lg text-xs shadow-xs">
              {tempVal}°C
            </span>
          </div>
          <input
            type="range"
            min={15}
            max={35}
            step={1}
            value={tempVal}
            onChange={(e) => onInputChange(item.id, 'temp', parseInt(e.target.value, 10))}
            className="w-full accent-[#18181b] cursor-pointer h-2.5 bg-black/15 hover:bg-black/25 rounded-lg touch-pan-y transition-colors"
          />
        </div>

        {/* Вологість повітря */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-black text-[11px] text-[#18181b]">
            <span>💧 Вологість повітря (RH):</span>
            <span className="bg-[#18181b] text-white font-black px-2.5 py-0.5 rounded-lg text-xs shadow-xs">
              {humVal}%
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={90}
            step={1}
            value={humVal}
            onChange={(e) => onInputChange(item.id, 'humidity', parseInt(e.target.value, 10))}
            className="w-full accent-[#18181b] cursor-pointer h-2.5 bg-black/15 hover:bg-black/25 rounded-lg touch-pan-y transition-colors"
          />
        </div>

        {/* Попередження про кліматичний стрес або плісняву */}
        {climateDiags.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {climateDiags.map((d, i) => (
              <MetricWarningBox key={i} diagnostic={d} compact />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 10. Крок 2 (Світло): Точки вимірювання PPFD над верхівкою
  if (
    item.id === 'action-routine-light' ||
    item.category === 'light' ||
    item.title.toLowerCase().includes('ppfd') ||
    item.title.toLowerCase().includes('світло')
  ) {
    return (
      <LightTaskMeasurementControls
        item={item}
        taskVals={taskVals}
        plant={plant}
        onInputChange={onInputChange}
      />
    );
  }

  // 11. Крок 3 (Огляд/Тренування за фазою): як AI лікар рослин
  if (
    item.id === 'action-routine-inspection' ||
    item.category === 'inspection' ||
    item.title.toLowerCase().includes('огляд') ||
    item.title.toLowerCase().includes('лікар')
  ) {
    const isVeg = plant.stage === 'vegetative';
    const isFlower = plant.stage === 'flowering';

    return (
      <div className="mt-1 pt-2 border-t border-black/15 space-y-3 bg-transparent rounded-xl p-3 text-xs border border-black/15 shadow-none">
        <div className="flex items-center justify-between font-extrabold text-[11.5px] text-[#18181b] pb-1 border-b border-black/15">
          <div className="flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-[#18181b] shrink-0" />
            <span>AI Лікар рослин & Контроль крони:</span>
          </div>
          <span className="text-[10px] font-black text-emerald-900 border border-emerald-600/30 px-2 py-0.5 rounded-md">
            🩺 Повний функціонал
          </span>
        </div>

        {/* Phase Tip */}
        <div className="bg-transparent border border-black/20 rounded-xl p-2.5 space-y-1.5 text-[#18181b]">
          <div className="font-extrabold text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#18181b]" />
            <span>Порада асистента для фази «{plant.stage === 'vegetative' ? 'Вегетація' : plant.stage === 'flowering' ? 'Цвітіння' : 'Розсада'}»:</span>
          </div>
          <p className="text-[10.5px] font-medium leading-relaxed">
            {isVeg && '📌 Час тренування LST: підгинайте верхівки до країв горщика, щоб сформувати рівний килим кол та відкрити світло бічним пагонам.'}
            {isFlower && '📌 Перевірте нижній ярус листя на пожовтіння (природний відтік азоту) та огляньте цукрові листочки під мікроскопом/лупою на прозорість трихом.'}
            {!isVeg && !isFlower && '📌 Переконайтеся, що колір молодого листя рівномірно-зелений, без скручування країв та ознак перезволоження.'}
          </p>
        </div>

        {/* Full AI Plant Doctor functionality embedded directly here */}
        <div className="pt-1">
          <PlantDoctor
            plant={plant}
            transparentMode={true}
            onAddTask={(task) => {
              if (onAddTask) onAddTask(task);
            }}
            onAwardXP={(xp, reason) => {
              if (onAwardXP) onAwardXP(xp, reason);
            }}
          />
        </div>
      </div>
    );
  }

  // 12. Просушування субстрату (> 80%)
  if (item.id === 'action-overwater-dry') {
    return (
      <div className="mt-1 pt-2 border-t border-black/15 space-y-2 bg-transparent border border-black/20 rounded-xl p-3 text-xs shadow-none text-[#18181b]">
        <div className="font-black text-[11.5px] text-[#18181b] flex items-center gap-1.5">
          <span>🚨 Регламент швидкого просушування:</span>
        </div>
        <ul className="list-disc list-inside text-[11px] space-y-1 text-[#18181b] font-medium">
          <li>Повний стоп поливу на 2–3 дні.</li>
          <li>Вентилятор обдуву направити в зону горщика.</li>
          <li>Злити будь-які залишки води з дренажного піддона.</li>
        </ul>
      </div>
    );
  }

  return null;
});

TaskMeasurementControls.displayName = 'TaskMeasurementControls';
