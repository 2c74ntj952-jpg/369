'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plant, HarvestTrophy, GrowJournalDayEntry, PlantStage } from '@/lib/types';
import { getTrophyAvatarUrl } from '@/lib/trophyAvatars';
import {
  Sun,
  Trophy,
  Calendar,
  Star,
  Scale,
  Sparkles,
  BookOpen,
  Share2,
  ChevronDown,
  ChevronUp,
  Droplets,
  Thermometer,
  Wind,
  Layers,
  Leaf,
  Clock,
  ExternalLink,
  FlaskConical,
  Zap,
  Activity
} from 'lucide-react';

export interface DiaryItem {
  id: string;
  plant: Plant;
  isHarvested: boolean;
  title: string;
  strain: string;
  breeder: string;
  strainType: string;
  isAuto: boolean;
  currentStage: PlantStage | string;
  stageDay: number;
  totalDays: number;
  weeks: number;
  light: string;
  nutrients: string;
  medium: string;
  temp: number;
  humidity: number;
  vpd: number;
  yieldEstimate: string;
  rating: number;
  coverUrl: string;
  likes: number;
  comments: number;
  journalEntriesCount: number;
  lastUpdateDate: string;
  trophy?: HarvestTrophy;
}

interface DiaryWidgetCardProps {
  diary: DiaryItem;
  onNavigateToPlant?: (plantId: string) => void;
  onOpenCertificate?: (trophy: HarvestTrophy) => void;
  onOpenFullJournal?: (plant: Plant) => void;
  defaultExpanded?: boolean;
}

export const DiaryWidgetCard: React.FC<DiaryWidgetCardProps> = ({
  diary,
  onNavigateToPlant,
  onOpenCertificate,
  onOpenFullJournal,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');

  const plant = diary.plant;
  const isHarvested = diary.isHarvested;

  // Build or synthesize rich daily journal logs
  const journalEntries: GrowJournalDayEntry[] = plant?.growJournal && plant.growJournal.length > 0
    ? plant.growJournal
    : [
        {
          id: `j-${diary.id}-1`,
          dayNumber: 1,
          date: '2026-04-01',
          stage: 'germination',
          stageLabelUk: 'Пророщування',
          moisturePercent: 80,
          tempC: 25.0,
          humidityRH: 75,
          vpd: 0.75,
          lightSchedule: '20/4',
          actionsDone: ['Пророщування у торф\'яній таблетці', 'Підтримка вологості під куполом'],
          notes: 'Насінина відмінної кондиції. Здоровий білий корінець.'
        },
        {
          id: `j-${diary.id}-10`,
          dayNumber: 10,
          date: '2026-04-10',
          stage: 'seedling',
          stageLabelUk: 'Розсада',
          moisturePercent: 70,
          phBefore: 6.4,
          phAfter: 6.2,
          ppm: 350,
          ppfd: 260,
          heightCm: 8,
          tempC: 24.5,
          humidityRH: 68,
          vpd: 0.85,
          lightSchedule: '18/6',
          actionsDone: ['Пересадка у 15L Air-Pot', 'Полив з Root Stimulator 2 мл/л'],
          notes: 'Пересадка пройшла успішно. Рослина швидко рушила в ріст.'
        },
        {
          id: `j-${diary.id}-24`,
          dayNumber: 24,
          date: '2026-04-24',
          stage: 'vegetative',
          stageLabelUk: 'Вегетація',
          moisturePercent: 75,
          phBefore: 6.5,
          phAfter: 6.3,
          ppm: 680,
          ppfd: 520,
          heightCm: 30,
          tempC: 24.0,
          humidityRH: 62,
          vpd: 0.98,
          lightSchedule: '18/6',
          actionsDone: ['LST тренування головного стебла', 'Підживлення Grow A+B + B-52'],
          notes: 'Сформовано симетричний кущ з потужними бічними пагонами.'
        },
        {
          id: `j-${diary.id}-50`,
          dayNumber: 50,
          date: '2026-05-20',
          stage: 'flowering',
          stageLabelUk: 'Цвітіння',
          moisturePercent: 68,
          phBefore: 6.3,
          phAfter: 6.1,
          ppm: 950,
          ppfd: 820,
          heightCm: 65,
          tempC: 23.5,
          humidityRH: 48,
          vpd: 1.25,
          lightSchedule: '12/12',
          actionsDone: ['Підживлення Big Bud + Overdrive', 'Дефоліація затіненого листя'],
          notes: 'Суцвіття активно набирають масу та вкриваються щільними трихомами.'
        }
      ];

  const filteredJournal = journalEntries.filter(entry => {
    if (selectedStageFilter === 'all') return true;
    return entry.stage === selectedStageFilter;
  });

  const getStageBadgeLabel = () => {
    if (isHarvested) return 'Врожай зібрано';
    switch (diary.currentStage) {
      case 'germination': return 'Пророщування';
      case 'seedling': return 'Розсада';
      case 'vegetative': return 'Вегетація';
      case 'flowering': return 'Цвітіння';
      default: return 'Активний цикл';
    }
  };

  const getPhaseBackground = () => {
    if (isHarvested) return 'bg-[#FFCC00] text-[#0c0c0e]';
    switch (diary.currentStage) {
      case 'germination':
      case 'seedling':
        return 'bg-[#d8f087] text-[#0c0c0e]';
      case 'vegetative':
        return 'bg-[#10b981] text-[#0c0c0e]';
      case 'flowering':
        return 'bg-[#22c55e] text-[#0c0c0e]';
      default:
        return 'bg-[#22c55e] text-[#0c0c0e]';
    }
  };

  return (
    <div
      id={`diary-card-${diary.id}`}
      className="bg-[#161618] border border-[rgba(242,242,242,0.08)] hover:border-[#d8f087] rounded-lg transition-all duration-200 text-[#f2f2f2] select-none overflow-hidden shadow-lg"
    >
      {/* 1. VARIATION 3 GRID CAPSULE */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer group grid grid-cols-1 md:grid-cols-[180px_1fr_210px] items-stretch transition-transform group-hover:translate-x-1"
      >
        {/* Left: card-phase */}
        <div className={`p-4 sm:p-5 flex flex-col justify-between ${getPhaseBackground()} transition-colors`}>
          <div>
            <div className="label-tech text-black/60 mb-1">
              {getStageBadgeLabel()}
            </div>
            <div className="font-syne text-xl sm:text-2xl font-extrabold uppercase leading-tight text-black">
              {isHarvested ? (diary.trophy?.trophyLevel || 'ВРОЖАЙ') : `ТИЖДЕНЬ 0${diary.weeks}`}
            </div>
          </div>
          <div className="label-tech text-black/70 mt-3 sm:mt-4 flex items-center justify-between">
            <span>{isHarvested ? `${diary.totalDays} дн. циклу` : `День ${diary.stageDay}`}</span>
            {isHarvested ? (
              <Trophy className="w-4 h-4 text-black shrink-0" />
            ) : (
              <Leaf className="w-4 h-4 text-black shrink-0 animate-pulse" />
            )}
          </div>
        </div>

        {/* Center: card-main */}
        <div className="p-4 sm:p-5 border-y md:border-y-0 md:border-r border-[rgba(242,242,242,0.08)] flex flex-col justify-center">
          <div className="label-tech text-[rgba(242,242,242,0.5)] mb-1">
            {diary.breeder || 'Genetics'}
          </div>
          <h3 className="font-syne text-base sm:text-lg font-bold text-[#f2f2f2] group-hover:text-[#d8f087] transition-colors leading-tight mb-2">
            {diary.strain}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="label-tech text-[#d8f087]">
              {diary.totalDays} дн. циклу
            </span>
            <span className="text-[10px] text-[rgba(242,242,242,0.4)] font-mono">
              • {diary.strainType || (diary.isAuto ? 'Автоквіт' : 'Фотоперіод')}
            </span>
            <span className="text-[10px] text-[rgba(242,242,242,0.4)] font-mono">
              • {journalEntries.length} записів
            </span>
          </div>
        </div>

        {/* Right: card-metrics */}
        <div className="p-4 sm:p-5 flex flex-col justify-around gap-2 bg-white/[0.01]">
          <div className="flex justify-between items-center text-xs">
            <span className="label-tech text-[rgba(242,242,242,0.5)]">Клімат</span>
            <span className="font-mono text-xs font-bold text-[#f2f2f2]">
              {diary.temp}°C / {diary.humidity}%
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="label-tech text-[rgba(242,242,242,0.5)]">VPD</span>
            <span className="font-mono text-xs font-bold text-[#2dd4bf]">
              {diary.vpd} kPa
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="label-tech text-[rgba(242,242,242,0.5)]">Pot</span>
            <span className="font-mono text-xs font-bold text-[#f2f2f2] truncate max-w-[110px]">
              {diary.light ? 'Air-Pot 15L' : '15L Pot'}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="label-tech text-[rgba(242,242,242,0.5)]">Sub</span>
            <span className="font-mono text-xs font-bold text-[#f2f2f2] truncate max-w-[110px]">
              {diary.medium}
            </span>
          </div>
        </div>
      </div>

      {/* 2. EXPANDED DETAIL VIEW (Розгортається у вишукане темне вікно з журналом, параметрами та фото) */}
      {isExpanded && (
        <div className="p-4 sm:p-6 border-t border-[rgba(242,242,242,0.08)] bg-[#0c0c0e] space-y-4 animate-fadeIn">
          {/* Top Banner: Plant Avatar & Genetics Breakdown */}
          <div className="bg-[#141519] border border-neutral-800/70 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Plant Photo / Avatar */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-b from-neutral-900 to-black border-2 border-[#FFCC00]/40 shrink-0 shadow-lg flex items-center justify-center group">
              <Image
                src={diary.coverUrl}
                alt={diary.strain}
                fill
                unoptimized
                referrerPolicy="no-referrer"
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-1.5 left-1.5 right-1.5 text-center">
                <span className="text-[9px] font-black uppercase text-amber-300 bg-black/70 px-2 py-0.5 rounded-full border border-amber-400/30">
                  {diary.isAuto ? '⚡ Auto' : '🌿 Photo'} • {diary.strainType}
                </span>
              </div>
            </div>

            {/* Plant & Strain Stats Details */}
            <div className="flex-1 w-full space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-between gap-1.5">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                    {diary.strain}
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium">
                    Брідер: <strong className="text-neutral-200">{diary.breeder}</strong> • {diary.strainType} ({diary.isAuto ? 'Автоквіт' : 'Фотоперіод'})
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-[#FFCC00] bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    ★ {diary.rating}/5 Оцінка
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    {isHarvested ? `Врожай: ${diary.yieldEstimate}` : `Очікувано: ${diary.yieldEstimate}`}
                  </span>
                </div>
              </div>

              {/* Specs & Hardware Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-0.5 text-[11px] text-neutral-300">
                <span className="bg-neutral-800/80 px-2.5 py-1 rounded-xl border border-neutral-700/50 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-[#FFCC00]" />
                  <span>{diary.light}</span>
                </span>
                <span className="bg-neutral-800/80 px-2.5 py-1 rounded-xl border border-neutral-700/50 flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{diary.nutrients}</span>
                </span>
                <span className="bg-neutral-800/80 px-2.5 py-1 rounded-xl border border-neutral-700/50 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>{diary.medium}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Full Daily Grow Journal Entries */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-sm font-black text-white">
                  Щоденник циклу (Журнал вирощування)
                </h4>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 text-[10px] font-bold overflow-x-auto pb-0.5">
                {[
                  { id: 'all', label: 'Всі дні' },
                  { id: 'germination', label: 'Пророщування' },
                  { id: 'seedling', label: 'Розсада' },
                  { id: 'vegetative', label: 'Вегетація' },
                  { id: 'flowering', label: 'Цвітіння' },
                  { id: 'harvested', label: 'Харвест' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedStageFilter(tab.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                      selectedStageFilter === tab.id
                        ? 'bg-neutral-200 text-neutral-950 font-black'
                        : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Journal Cards Feed */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredJournal.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-[#141519] border border-neutral-800/80 hover:border-neutral-700/90 rounded-xl p-3 space-y-2 transition-all"
                >
                  {/* Entry Header */}
                  <div className="flex items-center justify-between flex-wrap gap-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#FFCC00] bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-md text-[11px]">
                        День {entry.dayNumber}
                      </span>
                      <span className="font-bold text-white text-xs">
                        {entry.stageLabelUk || entry.stage}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {entry.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                      {entry.tempC && (
                        <span className="flex items-center gap-0.5 text-neutral-300">
                          <Thermometer className="w-3 h-3 text-amber-400" />
                          {entry.tempC}°C
                        </span>
                      )}
                      {entry.humidityRH && (
                        <span className="flex items-center gap-0.5 text-neutral-300">
                          <Wind className="w-3 h-3 text-sky-400" />
                          {entry.humidityRH}% RH
                        </span>
                      )}
                      {entry.vpd && (
                        <span className="flex items-center gap-0.5 text-teal-400 font-bold">
                          VPD {entry.vpd} kPa
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Substrate & Feeding Metrics Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] bg-neutral-900/80 p-2 rounded-lg border border-neutral-800/60 font-mono">
                    <div className="flex justify-between sm:justify-start sm:gap-1.5 text-neutral-400">
                      <span>Вологість:</span>
                      <strong className="text-emerald-400 font-bold">{entry.moisturePercent}%</strong>
                    </div>

                    <div className="flex justify-between sm:justify-start sm:gap-1.5 text-neutral-400">
                      <span>pH (до/після):</span>
                      <strong className="text-amber-300 font-bold">
                        {entry.phBefore || 6.4} → {entry.phAfter || 6.2}
                      </strong>
                    </div>

                    <div className="flex justify-between sm:justify-start sm:gap-1.5 text-neutral-400">
                      <span>PPM / EC:</span>
                      <strong className="text-sky-300 font-bold">{entry.ppm || 650} ppm</strong>
                    </div>

                    <div className="flex justify-between sm:justify-start sm:gap-1.5 text-neutral-400">
                      <span>PPFD:</span>
                      <strong className="text-purple-300 font-bold">{entry.ppfd || 520} µmol</strong>
                    </div>
                  </div>

                  {/* Actions & Notes */}
                  {entry.actionsDone && entry.actionsDone.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 text-[11px]">
                      <span className="text-neutral-500 font-bold text-[10px]">Дії:</span>
                      {entry.actionsDone.map((act, idx) => (
                        <span
                          key={idx}
                          className="bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded-md text-[10px] font-medium"
                        >
                          ✓ {act}
                        </span>
                      ))}
                    </div>
                  )}

                  {entry.notes && (
                    <p className="text-[11px] text-neutral-300 italic bg-black/20 p-1.5 rounded border border-neutral-800/40 leading-relaxed">
                      💬 &quot;{entry.notes}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-neutral-800/70">
            <div className="flex items-center gap-3 text-neutral-400 text-xs font-bold">
              <span>❤️ {diary.likes} лайків</span>
              <span>💬 {diary.comments} коментарів</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isHarvested && diary.trophy && onOpenCertificate && (
                <button
                  type="button"
                  onClick={() => onOpenCertificate(diary.trophy!)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-[#FFCC00] hover:bg-[#e6b800] text-neutral-950 font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Сертифікат врожаю</span>
                </button>
              )}

              {!isHarvested && onNavigateToPlant && (
                <button
                  type="button"
                  onClick={() => onNavigateToPlant(diary.id)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Перейти в Гроурум</span>
                </button>
              )}

              {onOpenFullJournal && (
                <button
                  type="button"
                  onClick={() => onOpenFullJournal(diary.plant)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Повний журнал</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Згорнути</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
