'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import Image from 'next/image';
import { Plant, GrowJournalDayEntry, HarvestTrophy, PlantStage } from '@/lib/types';
import { calculateVPD } from '@/lib/growData';
import { getTrophyAvatarUrl } from '@/lib/trophyAvatars';
import { getEstimatedCurrentMoisture } from '@/lib/metricsLogger';
import { TrophyWidgetCard } from '@/components/TrophyWidgetCard';
import confetti from 'canvas-confetti';
import { LightSchedulePicker } from '@/components/LightSchedulePicker';
import {
  BookOpen,
  Plus,
  Calendar,
  Sparkles,
  Droplets,
  Thermometer,
  Sun,
  Ruler,
  CheckCircle2,
  Trophy,
  ArrowRight,
  TrendingUp,
  Share2,
  X,
  Layers,
  ChevronRight,
  Sliders,
  Award,
  Camera,
  Printer,
  FileText,
  Copy,
  ExternalLink
} from 'lucide-react';

interface GrowJournalProps {
  plant: Plant;
  onUpdatePlant: (updated: Plant) => void;
  onAwardTrophy?: (trophy: HarvestTrophy) => void;
  onNavigateToAccount?: () => void;
}

export const GrowJournal: React.FC<GrowJournalProps> = ({
  plant,
  onUpdatePlant,
  onAwardTrophy,
  onNavigateToAccount
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showHarvestModal, setShowHarvestModal] = useState<boolean>(false);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [showPassportModal, setShowPassportModal] = useState<boolean>(false);
  const [createdTrophy, setCreatedTrophy] = useState<HarvestTrophy | null>(null);

  // Form State for new journal entry
  const [dayNum, setDayNum] = useState<number>(plant.stageDay || 1);
  const [dateStr, setDateStr] = useState<string>('2026-08-01');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDateStr(new Date().toISOString().split('T')[0]);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const [entryStage, setEntryStage] = useState<PlantStage>(plant.stage || 'vegetative');
  const [moisture, setMoisture] = useState<number>(() => getEstimatedCurrentMoisture(plant));
  const [phBefore, setPhBefore] = useState<number>(plant.phBeforeWatering || 6.5);
  const [phAfter, setPhAfter] = useState<number>(plant.phAfterWatering || 6.3);
  const [ppm, setPpm] = useState<number>(plant.ppmAfterWatering || 650);
  const [ppfd, setPpfd] = useState<number>(plant.lightPPFD || 520);
  const [height, setHeight] = useState<number>(25);
  const [temp, setTemp] = useState<number>(plant.currentTemp || 24);
  const [humidity, setHumidity] = useState<number>(plant.currentHumidity || 60);
  const [lightSched, setLightSched] = useState<string>(plant.lightSchedule || '18/6');
  const [actionsInput, setActionsInput] = useState<string>('Полив 1.5 л + CalMag, замір pH дренажу');
  const [notesInput, setNotesInput] = useState<string>('Рослина почувається добре, без ознак дефіцитів.');
  const [photoInput, setPhotoInput] = useState<string>('');

  // Form state for harvest trophy
  const [harvestYield, setHarvestYield] = useState<number>(85);
  const [harvestRating, setHarvestRating] = useState<number>(5);
  const [harvestNotes, setHarvestNotes] = useState<string>(`Чудовий результат вирощування сорту ${plant.strain}! Щільні засмолені суцвіття з насиченим терпеновим ароматом.`);

  // Comparison selections & Slider
  const journalList = plant.growJournal || [];
  const [compareDayA, setCompareDayA] = useState<string>(journalList[0]?.id || '');
  const [compareDayB, setCompareDayB] = useState<string>(journalList[journalList.length - 1]?.id || '');
  const [splitSliderPos, setSplitSliderPos] = useState<number>(50);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Filtered entries
  const filteredEntries = journalList.filter(entry => {
    if (selectedStage === 'all') return true;
    return entry.stage === selectedStage;
  }).sort((a, b) => b.dayNumber - a.dayNumber);

  const stageLabels: Record<PlantStage, string> = {
    germination: 'Пророщування',
    seedling: 'Розсада',
    vegetative: 'Вегетація',
    flowering: 'Цвітіння',
    harvested: 'Врожай зібрано'
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setPhotoInput(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDayEntry = (e: React.FormEvent) => {
    e.preventDefault();

    const actionsArray = actionsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const vpdRes = calculateVPD(temp, humidity, entryStage);

    const newEntry: GrowJournalDayEntry = {
      id: `journal-${Date.now()}`,
      dayNumber: Number(dayNum),
      date: dateStr,
      stage: entryStage,
      stageLabelUk: stageLabels[entryStage],
      moisturePercent: Number(moisture),
      phBefore: Number(phBefore),
      phAfter: Number(phAfter),
      ppm: Number(ppm),
      ppfd: Number(ppfd),
      heightCm: Number(height),
      photoUrl: photoInput || undefined,
      tempC: Number(temp),
      humidityRH: Number(humidity),
      vpd: vpdRes.vpd,
      lightSchedule: lightSched,
      lightDistanceCm: plant.lightDistanceCm,
      actionsDone: actionsArray.length > 0 ? actionsArray : ['Плановий огляд та замір'],
      notes: notesInput,
      healthScoreAtDay: plant.healthScore
    };

    const updatedJournal = [...journalList, newEntry];

    const updatedPlant: Plant = {
      ...plant,
      currentTemp: temp,
      currentHumidity: humidity,
      currentPH: phAfter,
      currentEC: Number((ppm / 500).toFixed(1)),
      lightPPFD: ppfd,
      stage: entryStage,
      stageDay: Number(dayNum),
      growJournal: updatedJournal
    };

    onUpdatePlant(updatedPlant);
    setShowAddModal(false);
    setPhotoInput('');
  };

  const handleCompleteHarvest = (e: React.FormEvent) => {
    e.preventDefault();

    const trophyLevel: 'Bronze' | 'Silver' | 'Gold' | 'Diamond' = 
      harvestRating === 5 ? 'Diamond' : harvestRating >= 4 ? 'Gold' : harvestRating >= 3 ? 'Silver' : 'Bronze';

    const trophy: HarvestTrophy = {
      id: `trophy-${Date.now()}`,
      plantId: plant.id,
      plantName: plant.name,
      strain: plant.strain,
      breeder: plant.breeder,
      strainType: (plant.strainType as 'Indica' | 'Sativa' | 'Hybrid') || 'Hybrid',
      harvestDate: new Date().toISOString().split('T')[0],
      totalDays: plant.stageDay || 65,
      totalYieldGrams: Number(harvestYield),
      rating: Number(harvestRating),
      trophyTitle: `🏆 Золотий Врожай ${plant.strain}`,
      trophyLevel: trophyLevel,
      avatarUrl: getTrophyAvatarUrl({
        strain: plant.strain,
        trophyLevel,
        totalYieldGrams: Number(harvestYield),
        strainType: (plant.strainType as 'Indica' | 'Sativa' | 'Hybrid') || 'Hybrid'
      }),
      summaryNotes: harvestNotes,
      sharedToAccount: true,
      sharedAt: new Date().toISOString(),
      journalDaysCount: journalList.length
    };

    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    const updatedPlant: Plant = {
      ...plant,
      isHarvested: true,
      stage: 'harvested',
      harvestTrophy: trophy
    };

    onUpdatePlant(updatedPlant);
    if (onAwardTrophy) {
      onAwardTrophy(trophy);
    }
    setCreatedTrophy(trophy);
    setShowHarvestModal(false);
  };

  const entryA = journalList.find(e => e.id === compareDayA) || journalList[0];
  const entryB = journalList.find(e => e.id === compareDayB) || journalList[journalList.length - 1];

  const defaultPhotoA = entryA?.photoUrl || plant.avatarUrl || '/avatars/strain_default.png';
  const defaultPhotoB = entryB?.photoUrl || plant.avatarUrl || '/avatars/strain_default.png';

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <BookOpen className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
                Журнал вирощування: <span className="text-emerald-700">{plant.name}</span>
              </h3>
              <p className="text-xs text-neutral-500 font-medium flex items-center gap-1.5 pt-0.5">
                <span>Закріплено за сортом</span>
                <span className="font-bold text-neutral-700">{plant.strain}</span>
                <span>({plant.breeder || 'Колекційний'})</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-300/80 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-emerald-700" />
                  Авто-фіксація AI
                </span>
              </p>
            </div>
          </div>
          <p className="text-xs text-neutral-600 font-medium leading-relaxed max-w-2xl pt-1">
            База історії грову формується автоматично: кожен замір, полив та дія структурується в щоденні звіти з фотофіксацією.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCompareModal(true)}
            className="flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Порівняти До / Після</span>
          </button>

          <button
            onClick={() => setShowPassportModal(true)}
            className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Паспорт грову</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-2xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Додати запис</span>
          </button>

          {!plant.isHarvested && (
            <button
              onClick={() => setShowHarvestModal(true)}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold px-4 py-2.5 rounded-2xl transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Trophy className="w-4 h-4 text-amber-100 fill-amber-100" />
              <span>Зібрати врожай</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-2xl flex items-center gap-3">
          <Calendar className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase block">Записів у журналі</span>
            <span className="text-sm font-black text-neutral-800">{journalList.length} днів</span>
          </div>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-2xl flex items-center gap-3">
          <Layers className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase block">Поточна Фаза</span>
            <span className="text-sm font-black text-neutral-800">{stageLabels[plant.stage]} (день {plant.stageDay})</span>
          </div>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-2xl flex items-center gap-3">
          <Droplets className="w-5 h-5 text-cyan-600 shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase block">Середній pH / PPM</span>
            <span className="text-sm font-black text-neutral-800">{plant.currentPH} pH / {plant.ppmAfterWatering || 650} PPM</span>
          </div>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-2xl flex items-center gap-3">
          <Thermometer className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase block">Клімат Боксу</span>
            <span className="text-sm font-black text-neutral-800">{plant.currentTemp}°C / {plant.currentHumidity}%</span>
          </div>
        </div>
      </div>

      {/* Stage Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
        {[
          { id: 'all', label: 'Всі дні' },
          { id: 'germination', label: '🌱 Пророщування' },
          { id: 'seedling', label: '🌿 Розсада' },
          { id: 'vegetative', label: '🌳 Вегетація' },
          { id: 'flowering', label: '🌺 Цвітіння' },
          { id: 'harvested', label: '🌾 Врожай' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedStage(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedStage === tab.id
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Daily Entries Timeline */}
      <div className="space-y-4 pt-2">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-10 bg-neutral-50 rounded-3xl border border-dashed border-neutral-300 p-6 space-y-3">
            <BookOpen className="w-8 h-8 text-neutral-400 mx-auto" />
            <h4 className="text-sm font-bold text-neutral-700">Записів у цьому розділі поки немає</h4>
            <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
              Журнал формується автоматично. Виконуйте щоденні завдання та фіксуйте показники поливу чи клімату в кімнаті рослини — AI-асистент сам створить щоденний запис у журналі.
            </p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div
              key={entry.id}
              className="bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-200 rounded-2xl p-4 sm:p-5 transition-all space-y-3.5"
            >
              {/* Card Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="bg-emerald-700 text-white text-xs font-extrabold px-3 py-1 rounded-xl shadow-2xs">
                    ДЕНЬ {entry.dayNumber}
                  </span>
                  <span className="text-xs font-bold text-neutral-800">
                    {entry.date}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {entry.stageLabelUk || stageLabels[entry.stage]}
                  </span>
                </div>

                {entry.healthScoreAtDay && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600">
                    <span>Здоров&apos;я:</span>
                    <span className="text-emerald-700 font-black">{entry.healthScoreAtDay}%</span>
                  </div>
                )}
              </div>

              {/* Grid Metrics Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Left: Plant & Substrate Parameters */}
                <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/90 space-y-2">
                  <h5 className="font-extrabold text-neutral-800 flex items-center gap-1.5 border-b border-neutral-100 pb-1.5 text-[11px] uppercase tracking-wider">
                    <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                    Параметри Субстрату & Рослини
                  </h5>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-neutral-500 font-medium block">Вологість:</span>
                      <span className="font-bold text-cyan-800">{entry.moisturePercent}%</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 font-medium block">pH (до → після):</span>
                      <span className="font-bold text-purple-800">
                        {entry.phBefore ? `${entry.phBefore} → ` : ''}{entry.phAfter ?? '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-500 font-medium block">PPM Субстрату:</span>
                      <span className="font-bold text-amber-800">{entry.ppm ?? '—'} PPM</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 font-medium block">PPFD Світла:</span>
                      <span className="font-bold text-yellow-800">{entry.ppfd ?? '—'} мкмоль</span>
                    </div>

                    {entry.heightCm && (
                      <div className="col-span-2 flex items-center gap-1 text-emerald-800 font-bold">
                        <Ruler className="w-3 h-3 text-emerald-600" />
                        <span>Висота куща: {entry.heightCm} см</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Growbox Climate Parameters */}
                <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/90 space-y-2">
                  <h5 className="font-extrabold text-neutral-800 flex items-center gap-1.5 border-b border-neutral-100 pb-1.5 text-[11px] uppercase tracking-wider">
                    <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                    Клімат Гроубоксу
                  </h5>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-neutral-500 font-medium block">Температура:</span>
                      <span className="font-bold text-neutral-800">{entry.tempC}°C</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 font-medium block">Вологість RH:</span>
                      <span className="font-bold text-teal-800">{entry.humidityRH}%</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 font-medium block">Індекс VPD:</span>
                      <span className="font-bold text-emerald-700">{entry.vpd ? `${entry.vpd} kPa` : 'Оптимальний'}</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 font-medium block">Режим Світла:</span>
                      <span className="font-bold text-amber-700">{entry.lightSchedule || plant.lightSchedule}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo preview if present */}
              {entry.photoUrl && (
                <div className="bg-white p-2.5 rounded-2xl border border-neutral-200 flex items-center gap-3">
                  <div className="w-16 h-16 relative rounded-xl overflow-hidden shrink-0 border border-neutral-200">
                    <img src={entry.photoUrl} alt={`День ${entry.dayNumber}`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-800 block">Фотофіксація дня {entry.dayNumber}</span>
                    <span className="text-[10px] text-neutral-500 font-medium">Додано до порівняння динаміки росту</span>
                  </div>
                </div>
              )}

              {/* Actions & Notes Footer */}
              <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 space-y-2 text-xs">
                {entry.actionsDone && entry.actionsDone.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-neutral-500 mr-1">Проведені дії:</span>
                    {entry.actionsDone.map((act, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {act}
                      </span>
                    ))}
                  </div>
                )}

                {entry.notes && (
                  <p className="text-neutral-700 text-xs font-medium leading-relaxed italic bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                    &quot;{entry.notes}&quot;
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Day Record Modal with Photo Attachment */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto">
          <div className="bg-[#121316] border-0 sm:border border-neutral-800 rounded-none sm:rounded-3xl p-3 sm:p-6 w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#d8f087]" />
                Новий замір у Журнал вирощування ({plant.name})
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDayEntry} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">День вирощування</label>
                  <input
                    type="number"
                    value={dayNum}
                    onChange={(e) => setDayNum(Number(e.target.value))}
                    className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2.5 font-bold text-white focus:outline-none focus:border-[#d8f087]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Дата</label>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2.5 font-bold text-white focus:outline-none focus:border-[#d8f087]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Фаза розвитку</label>
                  <select
                    value={entryStage}
                    onChange={(e) => setEntryStage(e.target.value as PlantStage)}
                    className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2.5 font-bold text-white focus:outline-none focus:border-[#d8f087]"
                  >
                    <option value="germination">🌱 Пророщування</option>
                    <option value="seedling">🌿 Розсада</option>
                    <option value="vegetative">🌳 Вегетація</option>
                    <option value="flowering">🌺 Цвітіння</option>
                    <option value="harvested">🌾 Збір врожаю</option>
                  </select>
                </div>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Вологість (%)</label>
                  <input
                    type="number"
                    value={moisture}
                    onChange={(e) => setMoisture(Number(e.target.value))}
                    className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2 font-bold text-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">pH після поливу</label>
                  <input
                    type="number"
                    step={0.1}
                    value={phAfter}
                    onChange={(e) => setPhAfter(Number(e.target.value))}
                    className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2 font-bold text-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">PPM</label>
                  <input
                    type="number"
                    value={ppm}
                    onChange={(e) => setPpm(Number(e.target.value))}
                    className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2 font-bold text-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Висота (см)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2 font-bold text-emerald-400"
                  />
                </div>
              </div>

              {/* Photo attachment */}
              <div className="bg-[#18191c] p-3 rounded-2xl border border-neutral-800 space-y-2">
                <label className="block text-neutral-300 font-bold flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Фотофіксація дня (для порівняння росту До / Після)</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-neutral-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700 cursor-pointer"
                  />
                  {photoInput && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-500 shrink-0">
                      <img src={photoInput} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Виконані дії (через кому)</label>
                <input
                  type="text"
                  value={actionsInput}
                  onChange={(e) => setActionsInput(e.target.value)}
                  placeholder="напр., Полив 1.5 л + CalMag, LST підв'язка"
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2.5 font-medium text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d8f087]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Нотатки гровера</label>
                <textarea
                  rows={2}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2.5 font-medium text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d8f087]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#18191c] hover:bg-neutral-800 text-neutral-300 rounded-xl font-bold cursor-pointer transition-colors border border-neutral-800"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d8f087] hover:bg-[#cbe37a] text-[#18181b] font-black rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Зберегти в журнал
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Side-by-Side & Split Slider Photo Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto">
          <div className="bg-[#121316] border-0 sm:border border-neutral-800 rounded-none sm:rounded-3xl p-3 sm:p-6 w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#d8f087]" />
                Фото та Метрики: Порівняння До / Після ({plant.strain})
              </h3>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Day A vs Day B */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">День А (Початок / До)</label>
                <select
                  value={compareDayA}
                  onChange={(e) => setCompareDayA(e.target.value)}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2.5 font-bold text-white focus:outline-none focus:border-[#d8f087]"
                >
                  {journalList.map(e => (
                    <option key={e.id} value={e.id}>
                      День {e.dayNumber} ({e.stageLabelUk || stageLabels[e.stage]}) - {e.date}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">День B (Фінал / Після)</label>
                <select
                  value={compareDayB}
                  onChange={(e) => setCompareDayB(e.target.value)}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2.5 font-bold text-white focus:outline-none focus:border-[#d8f087]"
                >
                  {journalList.map(e => (
                    <option key={e.id} value={e.id}>
                      День {e.dayNumber} ({e.stageLabelUk || stageLabels[e.stage]}) - {e.date}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Side-by-side / Interactive Photo Split Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-[#18191c] p-3 rounded-2xl border border-neutral-800 space-y-2 text-center">
                <span className="text-[11px] font-black uppercase text-neutral-400 block">
                  День {entryA?.dayNumber || 1} ({entryA?.stageLabelUk || 'Початок'})
                </span>
                <div className="h-44 sm:h-52 rounded-xl overflow-hidden relative bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <img
                    src={defaultPhotoA}
                    alt="Day A"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold">
                    {entryA?.date}
                  </span>
                </div>
              </div>

              <div className="bg-[#18191c] p-3 rounded-2xl border border-neutral-800 space-y-2 text-center">
                <span className="text-[11px] font-black uppercase text-emerald-400 block">
                  День {entryB?.dayNumber || 10} ({entryB?.stageLabelUk || 'Результат'})
                </span>
                <div className="h-44 sm:h-52 rounded-xl overflow-hidden relative bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <img
                    src={defaultPhotoB}
                    alt="Day B"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                    {entryB?.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Numeric Delta Breakdown */}
            {entryA && entryB ? (
              <div className="bg-[#18191c] p-4 rounded-2xl border border-neutral-800 space-y-3 text-xs">
                <div className="grid grid-cols-4 gap-2 font-bold text-center border-b border-neutral-800 pb-2 text-[11px] uppercase text-neutral-400">
                  <span>Показник</span>
                  <span>День {entryA.dayNumber}</span>
                  <span>День {entryB.dayNumber}</span>
                  <span>Зміна (Δ)</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center py-1 border-b border-neutral-800/80">
                  <span className="font-bold text-neutral-300 text-left">Висота рослини:</span>
                  <span className="font-extrabold text-white">{entryA.heightCm ?? '—'} см</span>
                  <span className="font-extrabold text-white">{entryB.heightCm ?? '—'} см</span>
                  <span className="font-extrabold text-emerald-400">
                    {entryA.heightCm && entryB.heightCm ? `+${entryB.heightCm - entryA.heightCm} см` : '—'}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center py-1 border-b border-neutral-800/80">
                  <span className="font-bold text-neutral-300 text-left">PPM Живлення:</span>
                  <span className="font-extrabold text-amber-400">{entryA.ppm ?? '—'} PPM</span>
                  <span className="font-extrabold text-amber-400">{entryB.ppm ?? '—'} PPM</span>
                  <span className="font-extrabold text-amber-300">
                    {entryA.ppm && entryB.ppm ? `${entryB.ppm - entryA.ppm >= 0 ? '+' : ''}${entryB.ppm - entryA.ppm} PPM` : '—'}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center py-1 border-b border-neutral-800/80">
                  <span className="font-bold text-neutral-300 text-left">pH Субстрату:</span>
                  <span className="font-extrabold text-purple-400">{entryA.phAfter ?? '—'}</span>
                  <span className="font-extrabold text-purple-400">{entryB.phAfter ?? '—'}</span>
                  <span className="font-extrabold text-purple-300">
                    {entryA.phAfter && entryB.phAfter ? `${(entryB.phAfter - entryA.phAfter).toFixed(1)} pH` : '—'}
                  </span>
                </div>

                <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40 text-emerald-200 text-xs font-medium">
                  <strong>💡 Висновок AI 2026:</strong> Рослина показує стабільний ріст без блокування елементів. Зафіксовано приріст висоти та стабілізацію кореневої системи.
                </div>
              </div>
            ) : null}

            <div className="flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-5 py-2.5 bg-[#18191c] hover:bg-neutral-800 border border-neutral-800 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Закрити порівняння
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grow Passport & Export Modal */}
      {showPassportModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto">
          <div className="bg-white border-0 sm:border border-neutral-200 rounded-none sm:rounded-3xl p-3 sm:p-8 w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] shadow-2xl space-y-6 text-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Офіційний Паспорт Вирощування (Grow Passport)
                </span>
                <h3 className="text-xl font-black text-neutral-900 pt-1 flex items-center gap-2">
                  <span>{plant.strain}</span>
                  <span className="text-xs font-bold text-neutral-500">({plant.name})</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-black px-3.5 py-2 rounded-xl cursor-pointer transition-all shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Друкувати / PDF</span>
                </button>
                <button
                  onClick={() => setShowPassportModal(false)}
                  className="text-neutral-400 hover:text-neutral-800 p-1.5 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Passport Core Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-500 block">Генетика / Сорт:</span>
                <strong className="text-sm text-neutral-900 block pt-0.5">{plant.strain}</strong>
                <span className="text-[10px] text-emerald-700 font-semibold">{plant.strainType || 'Hybrid'}</span>
              </div>

              <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-500 block">Сідбанк / Брідер:</span>
                <strong className="text-sm text-neutral-900 block pt-0.5">{plant.breeder || 'Колекційний'}</strong>
                <span className="text-[10px] text-neutral-500">Оригінальна лінія</span>
              </div>

              <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-500 block">Субстрат & Горщик:</span>
                <strong className="text-sm text-neutral-900 block pt-0.5">{plant.medium || 'Ґрунт'}</strong>
                <span className="text-[10px] text-neutral-500">{plant.potSize || 10} Літрів</span>
              </div>

              <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-500 block">Тривалість циклу:</span>
                <strong className="text-sm text-neutral-900 block pt-0.5">{plant.stageDay || 1} днів</strong>
                <span className="text-[10px] text-emerald-700 font-semibold">{stageLabels[plant.stage]}</span>
              </div>
            </div>

            {/* Agronomic Summary Table */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-3 text-xs">
              <h4 className="font-black text-neutral-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Агрономічний звіт та середні показники
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80">
                  <span className="text-[10px] text-neutral-500 font-bold block">Сер. pH:</span>
                  <span className="text-sm font-black text-purple-800">{plant.currentPH} pH</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80">
                  <span className="text-[10px] text-neutral-500 font-bold block">Сер. PPM:</span>
                  <span className="text-sm font-black text-amber-800">{plant.ppmAfterWatering || 650} PPM</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80">
                  <span className="text-[10px] text-neutral-500 font-bold block">Температура:</span>
                  <span className="text-sm font-black text-neutral-800">{plant.currentTemp}°C</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80">
                  <span className="text-[10px] text-neutral-500 font-bold block">Вологість:</span>
                  <span className="text-sm font-black text-teal-800">{plant.currentHumidity}%</span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-600 font-medium leading-relaxed pt-1">
                Гров проведено за стандартами органічного/мінерального живлення з регулярним контролем засолення субстрату (Delta PPM) та стабілізацією мікроклімату через VPD індекс.
              </p>
            </div>

            {/* Share link & Close */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={copyShareLink}
                className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer w-full sm:w-auto justify-center"
              >
                <Copy className="w-3.5 h-3.5 text-neutral-500" />
                <span>{copiedLink ? '✓ Посилання скопійовано!' : 'Копіювати веб-посилання'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPassportModal(false)}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white font-bold rounded-xl text-xs cursor-pointer transition-colors w-full sm:w-auto"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Harvest Trophy Modal */}
      {showHarvestModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto">
          <div className="bg-[#121316] border-0 sm:border border-neutral-800 rounded-none sm:rounded-3xl p-3 sm:p-6 w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FFCC00] fill-[#FFCC00]" />
                Фінал Вирощування: Отримання Нагороди Врожаю!
              </h3>
              <button
                onClick={() => setShowHarvestModal(false)}
                className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 font-medium leading-relaxed">
              Вітаємо! Ви пройшли повний шлях вирощування сорту <strong className="text-[#d8f087]">{plant.strain}</strong> від насінини до збору сухих суцвіть. Внесіть фінальні дані для формування віртуальної нагороди у ваш акаунт!
            </p>

            <form onSubmit={handleCompleteHarvest} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Вага сухого врожаю (грами)</label>
                <input
                  type="number"
                  value={harvestYield}
                  onChange={(e) => setHarvestYield(Number(e.target.value))}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-3 font-extrabold text-emerald-400 text-sm focus:outline-none focus:border-emerald-400"
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
                  <option value={5}>⭐⭐⭐⭐⭐ 5/5 - Вища медична якість (Преміум)</option>
                  <option value={4}>⭐⭐⭐⭐ 4/5 - Дуже гарний врожай</option>
                  <option value={3}>⭐⭐⭐ 3/5 - Нормальний результат</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Підсумковий коментар гровера</label>
                <textarea
                  rows={3}
                  value={harvestNotes}
                  onChange={(e) => setHarvestNotes(e.target.value)}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-3 font-medium text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d8f087]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowHarvestModal(false)}
                  className="px-4 py-2.5 bg-[#18191c] hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>Отримати Нагороду та Зберегти в Акаунт</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Harvest Award Success Modal */}
      {createdTrophy && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto">
          <div className="bg-[#121316] border-0 sm:border border-neutral-800 rounded-none sm:rounded-[34px] p-3 sm:p-6 w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] shadow-2xl space-y-4 text-white animate-scale-up">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/70 border border-amber-500/40 px-3 py-1 rounded-full inline-block">
                🏆 Нова Нагорода у Вашому Акаунті!
              </span>
              <h3 className="text-lg font-black text-white pt-1">
                {createdTrophy.trophyTitle}
              </h3>
              <p className="text-xs text-neutral-400 font-medium">
                Сорт {createdTrophy.strain} • Врожай: <strong className="text-[#FFCC00] font-extrabold">{createdTrophy.totalYieldGrams}г</strong>
              </p>
            </div>

            {/* Widget Card replica from reference image */}
            <TrophyWidgetCard
              trophy={createdTrophy}
              showActions={false}
            />

            <div className="flex flex-col gap-2 pt-2">
              {onNavigateToAccount && (
                <button
                  onClick={() => {
                    setCreatedTrophy(null);
                    onNavigateToAccount();
                  }}
                  className="w-full bg-[#FFCC00] hover:bg-[#e6b800] text-neutral-950 font-black text-xs py-3 rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Перейти в Акаунт та переглянути Нагороди</span>
                </button>
              )}

              <button
                onClick={() => setCreatedTrophy(null)}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs py-2.5 rounded-2xl cursor-pointer transition-colors"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
