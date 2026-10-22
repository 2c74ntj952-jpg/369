'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plant, HarvestTrophy, GrowJournalDayEntry } from '@/lib/types';
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
  Award,
  ChevronDown,
  ChevronUp,
  Droplets,
  Thermometer,
  Activity,
  Wind,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  Leaf
} from 'lucide-react';

interface TrophyWidgetCardProps {
  trophy: HarvestTrophy;
  plant?: Plant;
  onOpenCertificate?: () => void;
  showActions?: boolean;
  defaultExpanded?: boolean;
}

export const TrophyWidgetCard: React.FC<TrophyWidgetCardProps> = ({
  trophy,
  plant,
  onOpenCertificate,
  showActions = true,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');

  // Format harvest date (e.g. 06-15, 2026)
  const formattedDate = trophy.harvestDate ? trophy.harvestDate.slice(5) : '06-15';
  const yearStr = trophy.harvestDate ? trophy.harvestDate.slice(0, 4) : '2026';

  // Extract or synthesize rich grow journal entries if not provided
  const journalEntries: GrowJournalDayEntry[] = plant?.growJournal && plant.growJournal.length > 0
    ? plant.growJournal
    : [
        {
          id: 'j-1',
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
          notes: 'Насінина відмінної кондиції. Проклюнулася за 24 години, з\'явився здоровий білий корінець.'
        },
        {
          id: 'j-10',
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
          actionsDone: ['Пересадка у 15L Air-Pot', 'Перший полив з Root Stimulator 2 мл/л'],
          notes: 'Пересадка пройшла ідеально, без ознак стресу. Листя має здорове соковите забарвлення.'
        },
        {
          id: 'j-28',
          dayNumber: 28,
          date: '2026-04-28',
          stage: 'vegetative',
          stageLabelUk: 'Вегетація',
          moisturePercent: 75,
          phBefore: 6.5,
          phAfter: 6.3,
          ppm: 680,
          ppfd: 520,
          heightCm: 32,
          tempC: 24.0,
          humidityRH: 62,
          vpd: 0.98,
          lightSchedule: '18/6',
          actionsDone: ['LST тренування головного стебла', 'Підживлення Grow A+B + B-52'],
          notes: 'Сформовано 8 рівномірних бічних кол. Стовбур товстий, розвинена коренева система.'
        },
        {
          id: 'j-56',
          dayNumber: 56,
          date: '2026-05-26',
          stage: 'flowering',
          stageLabelUk: 'Цвітіння',
          moisturePercent: 70,
          phBefore: 6.3,
          phAfter: 6.1,
          ppm: 950,
          ppfd: 820,
          heightCm: 68,
          tempC: 23.5,
          humidityRH: 46,
          vpd: 1.28,
          lightSchedule: '12/12',
          actionsDone: ['Підживлення Big Bud + Overdrive', 'Дефоліація нижнього затіненого ярусу'],
          notes: 'Суцвіття вкрилися щільним білим шаром смолистих трихом. Виразний терпеновий аромат.'
        },
        {
          id: 'j-75',
          dayNumber: 75,
          date: '2026-06-12',
          stage: 'flowering',
          stageLabelUk: 'Промивка (Flush)',
          moisturePercent: 65,
          phBefore: 6.5,
          phAfter: 6.4,
          ppm: 140,
          ppfd: 600,
          heightCm: 70,
          tempC: 22.0,
          humidityRH: 42,
          vpd: 1.35,
          lightSchedule: '12/12',
          actionsDone: ['Промивка чистою водою Flawless Finish', 'Контроль трихом під мікроскопом'],
          notes: 'Трихоми: 80% молочні, 20% бурштинові. Рослина вивільнила всі надлишки солей.'
        },
        {
          id: 'j-78',
          dayNumber: 78,
          date: '2026-06-15',
          stage: 'harvested',
          stageLabelUk: 'Врожай зібрано',
          moisturePercent: 12,
          tempC: 18.5,
          humidityRH: 55,
          vpd: 0.95,
          actionsDone: ['Зрізка та манікюринг суцвіть', 'Сушка в темному боксі при 18°C/55% RH (12 днів)'],
          notes: `Сухий врожай: ${trophy.totalYieldGrams} грамів першокласних щільних шишок. Аромат хвої, цитрусу та сандалу.`
        }
      ];

  const filteredJournal = journalEntries.filter(entry => {
    if (selectedStageFilter === 'all') return true;
    return entry.stage === selectedStageFilter;
  });

  const avatarUrl = getTrophyAvatarUrl(trophy);

  return (
    <div
      id={`trophy-card-${trophy.id}`}
      className="bg-[#0c0d10] border border-neutral-800/90 rounded-[26px] p-2.5 sm:p-3 shadow-xl transition-all duration-200 hover:border-neutral-700 text-neutral-200 select-none overflow-hidden"
    >
      {/* 1. COMPACT / SMALL HEADER CAPSULE */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer group flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5"
      >
        {/* Left: Signature Yellow High-Contrast Badge */}
        <div className="bg-[#FFCC00] rounded-[20px] px-3.5 py-2.5 sm:py-3 flex items-center justify-between sm:justify-start gap-3 text-neutral-950 min-w-[220px] sm:min-w-[260px] shadow-sm transition-transform group-hover:scale-[1.01]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4 text-neutral-950 fill-neutral-950 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-tight text-neutral-950/80">
                  Врожай зібрано
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-black/10 text-neutral-950">
                  {trophy.trophyLevel}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-neutral-950">
                  {trophy.totalYieldGrams}
                </span>
                <span className="text-sm font-black text-neutral-950/80">г</span>
                <span className="text-[10px] font-bold uppercase text-neutral-950/60 ml-0.5">сухе суцвіття</span>
              </div>
            </div>
          </div>

          <div className="text-right sm:text-left sm:ml-auto">
            <h4 className="text-xs sm:text-sm font-black text-neutral-950 tracking-tight leading-tight max-w-[140px] truncate">
              {trophy.strain || trophy.plantName}
            </h4>
            <p className="text-[10px] font-bold text-neutral-950/70 truncate max-w-[140px]">
              {trophy.breeder || 'Sensi Seeds'}
            </p>
          </div>
        </div>

        {/* Middle: Sleek Dark Weather-Style Metrics (Compact layout) */}
        <div className="flex-1 bg-[#141519] rounded-[18px] px-3 py-2 flex items-center justify-between sm:justify-around gap-2 text-xs border border-neutral-800/60 overflow-x-auto">
          {/* Cycle Days */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Sun className="w-3.5 h-3.5 text-[#FFCC00] fill-[#FFCC00]" />
            <div className="leading-tight">
              <span className="text-[9px] font-bold uppercase text-neutral-500 block">Цикл</span>
              <span className="font-mono font-black text-white text-xs">{trophy.totalDays} дн.</span>
            </div>
          </div>

          <div className="w-px h-6 bg-neutral-800 shrink-0" />

          {/* Dry Weight */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <div className="leading-tight">
              <span className="text-[9px] font-bold uppercase text-neutral-500 block">Вага</span>
              <span className="font-mono font-black text-emerald-300 text-xs">{trophy.totalYieldGrams} г</span>
            </div>
          </div>

          <div className="w-px h-6 bg-neutral-800 shrink-0" />

          {/* Rating */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <div className="leading-tight">
              <span className="text-[9px] font-bold uppercase text-neutral-500 block">Якість</span>
              <span className="font-mono font-black text-amber-300 text-xs">{trophy.rating}/5</span>
            </div>
          </div>

          <div className="w-px h-6 bg-neutral-800 shrink-0" />

          {/* Date */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <div className="leading-tight">
              <span className="text-[9px] font-bold uppercase text-neutral-500 block">{yearStr}</span>
              <span className="font-mono font-bold text-neutral-300 text-xs">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Right: Expand Toggle Button */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isExpanded
                ? 'bg-[#FFCC00] text-neutral-950 font-black shadow-xs'
                : 'bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isExpanded ? 'Згорнути' : 'Журнал та фото'}</span>
            <span className="sm:hidden">{isExpanded ? 'Закрити' : 'Журнал'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. EXPANDED DETAIL VIEW (Розгортається у невелике охайне вікно з журналом та фото) */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-3.5 animate-fadeIn">
          {/* Top Info Banner: Plant Photo & Key Genetics */}
          <div className="bg-[#141519] border border-neutral-800/70 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Plant Photo / Crystal Trichome Avatar */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-b from-neutral-900 to-black border-2 border-[#FFCC00]/40 shrink-0 shadow-lg flex items-center justify-center group">
              <Image
                src={avatarUrl}
                alt={trophy.strain || 'Harvest Plant'}
                fill
                unoptimized
                referrerPolicy="no-referrer"
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-1.5 left-1.5 right-1.5 text-center">
                <span className="text-[9px] font-black uppercase text-amber-300 bg-black/70 px-2 py-0.5 rounded-full border border-amber-400/30">
                  {trophy.strainType || 'Sativa'}
                </span>
              </div>
            </div>

            {/* Plant & Strain Stats Details */}
            <div className="flex-1 w-full space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-between gap-1.5">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                    {trophy.strain}
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium">
                    Брідер: <strong className="text-neutral-200">{trophy.breeder || 'Sensi Seeds'}</strong> • {trophy.strainType || 'Sativa-Dominant'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-[#FFCC00] bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    ★ {trophy.rating}/5 Оцінка якості
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    {trophy.totalYieldGrams} г сухий врожай
                  </span>
                </div>
              </div>

              {/* Grower / AI Review Note */}
              <div className="bg-neutral-900/90 border border-neutral-800/80 rounded-xl p-2.5 text-xs text-neutral-300 italic leading-relaxed">
                &quot;{trophy.summaryNotes || `Успішно зібрано ${trophy.totalYieldGrams}г сухого суцвіття найвищої якості! Оптимальний VPD та своєчасний полив забезпечили максимальну щільність суцвіть.`}&quot;
              </div>

              {/* Quick Genetics & Environmental Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5 text-[11px] text-neutral-300">
                <span className="bg-neutral-800/70 px-2 py-0.5 rounded-lg border border-neutral-700/50">
                  🧬 <strong>THC:</strong> ~22%
                </span>
                <span className="bg-neutral-800/70 px-2 py-0.5 rounded-lg border border-neutral-700/50">
                  🌿 <strong>CBD:</strong> ~1.2%
                </span>
                <span className="bg-neutral-800/70 px-2 py-0.5 rounded-lg border border-neutral-700/50">
                  ☀️ <strong>Світло:</strong> 18/6 & 12/12 LED
                </span>
                <span className="bg-neutral-800/70 px-2 py-0.5 rounded-lg border border-neutral-700/50">
                  💧 <strong>Субстрат:</strong> Ґрунт/Перліт 15L
                </span>
              </div>
            </div>
          </div>

          {/* Full Grow Journal Section Header & Filter Tabs */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-sm font-black text-white">
                  Повний Журнал Вирощування (Щоденник циклу)
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

                  {/* Actions & Grower Notes */}
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

          {/* Action Footer Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-neutral-800/70">
            <span className="text-[11px] text-neutral-400 font-medium">
              🏆 {trophy.trophyTitle || 'Золота Нагорода за Врожай'}
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onOpenCertificate && (
                <button
                  type="button"
                  onClick={onOpenCertificate}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-[#FFCC00] hover:bg-[#e6b800] text-neutral-950 font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Сертифікат врожаю</span>
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
