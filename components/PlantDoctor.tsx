'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Plant, ReminderTask } from '@/lib/types';
import { safeFetchJson } from '@/lib/utils';
import {
  Stethoscope,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Zap,
  ArrowLeft,
  Camera,
  UploadCloud,
  ImageIcon,
  Trash2,
  Eye,
  Check
} from 'lucide-react';

interface PlantDoctorProps {
  plant: Plant;
  onAddTask?: (task: ReminderTask) => void;
  onAwardXP?: (xp: number, reason: string) => void;
  onBackToOverview?: () => void;
  transparentMode?: boolean;
}

interface DiagnosisResult {
  hasProblem?: boolean;
  diagnosisTitle: string;
  confidencePercent: number;
  severity?: 'none' | 'low' | 'medium' | 'high' | 'critical';
  visualSymptomsObserved?: string;
  probableCauses: string[];
  recommendations?: string;
  stepsToFix: string[];
  generatedTask?: {
    title: string;
    description: string;
    category?: string;
    xpReward?: number;
  };
}

export const PlantDoctor: React.FC<PlantDoctorProps> = ({
  plant,
  onAddTask,
  onAwardXP,
  onBackToOverview,
  transparentMode = false
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string>('image/jpeg');
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [diagnosedPhoto, setDiagnosedPhoto] = useState<string | null>(null);
  const [appliedAction, setAppliedAction] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const symptomPresets = [
    '🟡 Жовтіють листки',
    '🟤 Коричневі сухі кінчики',
    '🟣 Фіолетові черешки',
    '🌀 Листя скручується ("кіготь")',
    '🌱 Зупинився ріст',
    '💧 Сире коріння / перелив',
    '⚡ Світлі бліді верхівки',
    '⚪ Білі плями / наліт'
  ];

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  // Helper to process & compress selected image file
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setPhotoName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setSelectedPhoto(compressed);
          setPhotoMimeType('image/jpeg');
        } else {
          setSelectedPhoto(src);
          setPhotoMimeType(file.type || 'image/jpeg');
        }
      };
      img.onerror = () => {
        setSelectedPhoto(src);
        setPhotoMimeType(file.type || 'image/jpeg');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleUseExistingPlantPhoto = () => {
    const existing = plant.imageUrl || plant.avatarUrl;
    if (existing) {
      setSelectedPhoto(existing);
      setPhotoName(`Фото ${plant.name}`);
      setPhotoMimeType('image/jpeg');
    }
  };

  const handleClearPhoto = () => {
    setSelectedPhoto(null);
    setPhotoName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Check if plant data is user-confirmed facts vs AI projected
  const hasUserMetrics = plant.history && plant.history.some(h => h.source === 'user' || !h.isPredicted);

  const handleRunDoctor = async () => {
    // Can run with photo, symptoms, or notes
    if (!selectedPhoto && selectedSymptoms.length === 0 && !customText.trim()) return;

    setLoading(true);
    setDiagnosis(null);
    setAppliedAction(false);

    const fullSymptomsText = [...selectedSymptoms, customText].filter(Boolean).join(', ');

    try {
      const cleanPlant = {
        id: String(plant?.id || ''),
        name: String(plant?.name || ''),
        strain: String(plant?.strain || ''),
        breeder: String(plant?.breeder || ''),
        stage: String(plant?.stage || ''),
        stageDay: Number(plant?.stageDay || 1),
        currentPH: plant?.currentPH ?? null,
        currentTemp: plant?.currentTemp ?? null,
        currentHumidity: plant?.currentHumidity ?? null,
        lightPPFD: plant?.lightPPFD ?? null,
        ppmAfterWatering: plant?.ppmAfterWatering ?? null
      };

      const data = await safeFetchJson<{ success?: boolean; diagnosis?: DiagnosisResult }>('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'diagnose_plant',
          plant: cleanPlant,
          symptoms: fullSymptomsText,
          image: selectedPhoto,
          imageMimeType: photoMimeType
        })
      });

      if (data?.success && data.diagnosis) {
        setDiagnosis(data.diagnosis);
        setDiagnosedPhoto(selectedPhoto);
        if (onAwardXP) onAwardXP(20, 'Діагностика рослини з AI Лікарем');

        if (data.diagnosis.generatedTask) {
          const newTask: ReminderTask = {
            id: `doctor-${Date.now()}`,
            plantId: plant.id,
            plantName: plant.name,
            title: data.diagnosis.generatedTask.title || `Лікування: ${data.diagnosis.diagnosisTitle}`,
            description: data.diagnosis.generatedTask.description || 'Виконайте рекомендації лікаря.',
            category: (data.diagnosis.generatedTask.category as any) || 'nutrients',
            xpReward: data.diagnosis.generatedTask.xpReward || 40,
            completed: false,
            dueDate: 'Сьогодні',
            createdByAI: true,
            urgent: data.diagnosis.hasProblem !== false
          };
          if (onAddTask) onAddTask(newTask);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = () => {
    if (!diagnosis) return;

    const actionTitle = diagnosis.generatedTask?.title || `Дія: ${diagnosis.diagnosisTitle}`;
    const actionDesc = diagnosis.stepsToFix?.[0] || diagnosis.recommendations || 'Виконайте кроки по догляду';

    const newTask: ReminderTask = {
      id: `quick-action-${Date.now()}`,
      plantId: plant.id,
      plantName: plant.name,
      title: `⚡ ${actionTitle}`,
      description: actionDesc,
      category: 'nutrients',
      xpReward: 50,
      completed: false,
      dueDate: 'Сьогодні',
      createdByAI: true,
      urgent: diagnosis.hasProblem !== false
    };

    if (onAddTask) onAddTask(newTask);
    if (onAwardXP) onAwardXP(25, 'Застосовано швидку дію від AI Лікаря');
    setAppliedAction(true);
    setTimeout(() => setAppliedAction(false), 4000);
  };

  const existingPlantPhoto = plant.imageUrl || plant.avatarUrl;

  return (
    <div className={transparentMode ? "space-y-3 pt-1" : "space-y-4"}>
      {onBackToOverview && !transparentMode && (
        <button
          type="button"
          onClick={onBackToOverview}
          className="flex items-center gap-2 text-xs font-bold text-neutral-700 hover:text-emerald-800 bg-white hover:bg-neutral-50 px-4 py-2 rounded-2xl border border-neutral-200 shadow-2xs transition-all cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>← До картки рослини ({plant.name})</span>
        </button>
      )}

      {/* Context Badge: Fact vs AI prediction */}
      <div className={`p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs font-bold ${
        transparentMode ? 'bg-transparent border border-black/20' : 'bg-black/5 rounded-2xl border border-black/10'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase text-[#18181b]/70">Вхідний контекст:</span>
          {hasUserMetrics ? (
            <span className="inline-flex items-center gap-1 bg-emerald-800 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              👤 Реальні заміри гровера
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-amber-800 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              🤖 AI Прогноз
            </span>
          )}
        </div>
        <span className="text-[11px] text-[#18181b]/80">
          pH: {plant.currentPH ?? '—'} • PPM: {plant.ppmAfterWatering ?? '—'} • Фаза: {plant.stage}
        </span>
      </div>

      {/* 📸 Photo Upload Section */}
      <div className={`space-y-3 ${
        transparentMode
          ? 'bg-transparent rounded-xl p-3 sm:p-3.5 border border-black/20'
          : 'bg-black/5 backdrop-blur-md rounded-2xl p-4 border border-black/10'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#18181b] stroke-[2.5]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-[#18181b]">
              1. Фотографія рослини для аналізу
            </h4>
          </div>
          {selectedPhoto && (
            <button
              type="button"
              onClick={handleClearPhoto}
              className="flex items-center gap-1 text-[11px] font-black text-rose-800 hover:text-rose-950 bg-rose-200/60 hover:bg-rose-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Зняти фото</span>
            </button>
          )}
        </div>

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        {selectedPhoto ? (
          /* Preview state */
          <div className={`relative rounded-xl overflow-hidden p-3 flex flex-col sm:flex-row items-center gap-4 ${
            transparentMode ? 'bg-transparent border border-black/20' : 'rounded-2xl border border-black/15 bg-black/10'
          }`}>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 border border-black/10 shadow-sm bg-black/20">
              <Image
                src={selectedPhoto}
                alt="Рослина для аналізу"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
              <div className="inline-flex items-center gap-1 bg-emerald-800 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3" />
                <span>Фото завантажено та готове</span>
              </div>
              <p className="text-xs font-black text-[#18181b] truncate">
                {photoName || 'Знімок рослини'}
              </p>
              <p className="text-[11px] text-[#18181b]/70">
                AI Лікар огляне листові пластини, хлороз, кінчики, стебла та суцвіття для виявлення дефіцитів або підтвердження здоров&apos;я.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-[#18181b] bg-white/70 hover:bg-white px-3 py-1 rounded-xl border border-black/10 transition-all cursor-pointer shadow-2xs"
                >
                  Замінити файл
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="text-[11px] font-bold text-[#18181b] bg-white/70 hover:bg-white px-3 py-1 rounded-xl border border-black/10 transition-all cursor-pointer shadow-2xs"
                >
                  Зробити нове фото
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Dropzone / Upload state */
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center transition-all cursor-pointer ${
              transparentMode
                ? isDragging
                  ? 'border-black bg-black/5'
                  : 'border-black/20 hover:border-black/40 bg-transparent hover:bg-black/5'
                : isDragging
                  ? 'border-black bg-black/15 rounded-2xl'
                  : 'border-black/20 hover:border-black/40 bg-black/5 hover:bg-black/10 rounded-2xl'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-[#18181b]">
                <UploadCloud className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-[#18181b]">
                  Перетягніть фото сюди або натисніть для завантаження
                </p>
                <p className="text-[11px] text-[#18181b]/70 mt-0.5">
                  Підтримуються фото листя, куща чи верхівки (JPG, PNG, WEBP)
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-1.5 bg-[#18181b] text-white hover:bg-black text-xs font-black px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5 text-[#d8f087]" />
                  <span>Камера пристрою</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 bg-white/80 hover:bg-white text-[#18181b] text-xs font-bold px-3.5 py-1.5 rounded-full border border-black/15 transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Вибрати з галереї</span>
                </button>

                {existingPlantPhoto && (
                  <button
                    type="button"
                    onClick={handleUseExistingPlantPhoto}
                    className="flex items-center gap-1.5 bg-emerald-800 text-white hover:bg-emerald-900 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>🌿 Взяти поточне фото картки</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Symptom Selection & Notes (Optional Helpers) */}
      <div className="space-y-2.5 pt-1">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#18181b] flex items-center gap-2">
          <span>2. Уточніть помічені симптоми (за бажанням):</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {symptomPresets.map((preset) => {
            const isSelected = selectedSymptoms.includes(preset);
            return (
              <button
                key={preset}
                type="button"
                onClick={() => toggleSymptom(preset)}
                className={`p-2.5 rounded-xl text-[11px] sm:text-xs font-bold text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#18181b] text-white border-black shadow-xs font-black'
                    : transparentMode
                      ? 'bg-transparent hover:bg-black/5 text-[#18181b] border-black/20'
                      : 'bg-black/5 hover:bg-black/15 text-[#18181b] border-black/10 rounded-2xl'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>

        {/* Custom text description */}
        <div className="pt-1">
          <textarea
            rows={2}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Опишіть стан або питання до фото (напр., чи це світловий опік чи нестача кальцію?)..."
            className={`w-full font-bold focus:outline-none placeholder:text-black/50 transition-colors ${
              transparentMode
                ? 'bg-transparent hover:bg-black/5 focus:bg-black/5 border border-black/20 rounded-xl p-2.5 text-xs text-[#18181b]'
                : 'bg-black/5 hover:bg-black/8 focus:bg-black/10 backdrop-blur-sm border border-black/15 rounded-2xl p-3 text-xs sm:text-sm text-[#18181b]'
            }`}
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleRunDoctor}
            disabled={loading || (!selectedPhoto && selectedSymptoms.length === 0 && !customText.trim())}
            className="flex items-center gap-2 bg-[#18181b] hover:bg-black disabled:opacity-50 text-white text-xs font-black px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border border-black/20"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>AI аналізує фотографію та показники...</span>
              </>
            ) : (
              <>
                {selectedPhoto ? (
                  <Camera className="w-4 h-4 text-[#d8f087]" />
                ) : (
                  <Stethoscope className="w-4 h-4 text-[#d8f087]" />
                )}
                <span>
                  {selectedPhoto ? '📸 Аналізувати фото рослини (+20 XP)' : 'Запустити AI Діагностику (+20 XP)'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diagnosis Results Card */}
      {diagnosis && (
        <div className={`space-y-3.5 animate-fade-in ${
          transparentMode
            ? 'bg-transparent border border-black/20 rounded-xl p-3.5 sm:p-4 text-[#18181b]'
            : 'bg-black/5 backdrop-blur-md border border-black/10 rounded-3xl p-4 sm:p-5 text-[#18181b] shadow-xs space-y-4'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/15 pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {diagnosis.hasProblem === false ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-800 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>РОСЛИНА ЗДОРОВА</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-800 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    <span>ВИЯВЛЕНО ПРОБЛЕМУ ({diagnosis.severity || 'середня'})</span>
                  </span>
                )}
                {diagnosedPhoto && (
                  <span className="text-[10px] font-black uppercase text-[#18181b]/70">
                    • Аналіз по фото
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#18181b]">
                {diagnosis.diagnosisTitle}
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="bg-[#18181b] text-white border border-black px-3 py-1 rounded-full text-xs font-bold">
                Впевненість AI: <span className="text-[#d8f087] font-black">{diagnosis.confidencePercent}%</span>
              </div>

              {/* ⚡ Quick Action Button */}
              <button
                type="button"
                onClick={handleQuickAction}
                className="flex items-center gap-1.5 bg-[#18181b] hover:bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-black shadow-md cursor-pointer transition-all active:scale-95 border border-black/20"
              >
                <Zap className="w-3.5 h-3.5 text-[#d8f087] fill-[#d8f087]" />
                <span>⚡ Застосувати пораду</span>
              </button>
            </div>
          </div>

          {appliedAction && (
            <div className="p-2.5 bg-emerald-100/90 border border-emerald-400 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Швидку дію успішно активовано! Створено пріоритетне завдання у вашому розкладі (+25 XP).</span>
            </div>
          )}

          {/* Visual Observations (Detailed Photo Breakdown) */}
          {diagnosis.visualSymptomsObserved && (
            <div className={`flex items-start gap-3 ${
              transparentMode ? 'bg-transparent p-3 rounded-xl border border-black/20' : 'bg-black/5 p-3.5 rounded-2xl border border-black/10'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center text-[#18181b] shrink-0 mt-0.5">
                <Eye className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <h4 className="text-xs font-black text-[#18181b] uppercase tracking-wider">
                  Що виявлено на фото / візуальний огляд:
                </h4>
                <p className="text-xs text-[#18181b] font-medium leading-relaxed">
                  {diagnosis.visualSymptomsObserved}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Probable causes */}
            <div className={`space-y-2 ${
              transparentMode ? 'bg-transparent p-3 rounded-xl border border-black/20' : 'bg-black/5 p-3.5 sm:p-4 rounded-2xl border border-black/10'
            }`}>
              <h4 className="text-xs font-black text-[#18181b] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                {diagnosis.hasProblem === false ? 'Фактори стабільності:' : 'Ймовірні причини:'}
              </h4>
              <ul className="space-y-1.5 text-xs text-[#18181b] font-medium">
                {diagnosis.probableCauses?.map((cause: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-black">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step by step fix / recommendations */}
            <div className={`space-y-2 ${
              transparentMode ? 'bg-transparent p-3 rounded-xl border border-black/20' : 'bg-black/5 p-3.5 sm:p-4 rounded-2xl border border-black/10'
            }`}>
              <h4 className="text-xs font-black text-[#18181b] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                {diagnosis.hasProblem === false ? 'Рекомендації для підтримки росту:' : 'Алгоритм усунення проблеми:'}
              </h4>
              <ol className="space-y-1.5 text-xs text-[#18181b] font-medium">
                {diagnosis.stepsToFix?.map((step: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="bg-[#18181b] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {diagnosis.recommendations && (
            <div className={`text-xs text-[#18181b] font-bold ${
              transparentMode ? 'bg-transparent p-2.5 rounded-xl border border-black/20' : 'bg-black/5 p-3 rounded-2xl border border-black/10'
            }`}>
              <span className="font-black text-emerald-800">💡 Порада агронома: </span>
              <span>{diagnosis.recommendations}</span>
            </div>
          )}

          <div className={`text-xs text-[#18181b] flex items-center justify-between font-bold ${
            transparentMode ? 'bg-transparent p-2.5 rounded-xl border border-black/20' : 'bg-black/5 p-3 rounded-2xl border border-black/10'
          }`}>
            <span>За результатом діагностики сформовано практичне завдання.</span>
            <span className="font-black text-emerald-800">+40 XP за виконання!</span>
          </div>
        </div>
      )}
    </div>
  );
};
