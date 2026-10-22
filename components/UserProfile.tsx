'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UserStats, HarvestTrophy, Plant } from '@/lib/types';
import { getLevelInfo, MEDICAL_STRAINS, StrainInfo } from '@/lib/growData';
import { getTrophyAvatarUrl } from '@/lib/trophyAvatars';
import { GrowJournal } from '@/components/GrowJournal';
import { TrophyWidgetCard } from '@/components/TrophyWidgetCard';
import { DiaryWidgetCard, DiaryItem } from '@/components/DiaryWidgetCard';
import confetti from 'canvas-confetti';
import {
  User,
  Trophy,
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  Share2,
  Calendar,
  BookOpen,
  MapPin,
  Edit3,
  Copy,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Star,
  RefreshCw,
  Sun,
  Droplets,
  Layers,
  Activity,
  Zap,
  Leaf,
  Sliders,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Thermometer,
  Wind,
  Search,
  Filter,
  CheckCircle,
  Radio,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  Sprout,
  Gauge,
  Bot,
  Flower2,
  Plus
} from 'lucide-react';

interface UserProfileProps {
  userStats: UserStats;
  plants: Plant[];
  onUpdateUserStats: (updated: UserStats) => void;
  onNavigateToPlant?: (plantId: string) => void;
  onAddPlantFromStrain?: (strain: StrainInfo) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userStats,
  plants,
  onUpdateUserStats,
  onNavigateToPlant,
  onAddPlantFromStrain
}) => {
  // Navigation tabs within grower home / cabinet
  const [activeCabinetTab, setActiveCabinetTab] = useState<'diaries' | 'badges' | 'preferences' | 'setup' | 'qa'>('diaries');
  const [badgesSubView, setBadgesSubView] = useState<'badges' | 'strains'>('badges');
  const [diaryFilter, setDiaryFilter] = useState<'active' | 'harvested'>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedTrophy, setSelectedTrophy] = useState<HarvestTrophy | null>(null);
  const [selectedJournalPlant, setSelectedJournalPlant] = useState<Plant | null>(null);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Photo Upload Modal State
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isDraggingPhoto, setIsDraggingPhoto] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Harvested plants with confirmed dry yield
  const harvestedPlants = plants.filter(p => p.isHarvested || p.stage === 'harvested' || p.harvestTrophy);
  const activePlants = plants.filter(p => !p.isHarvested && p.stage !== 'harvested' && !p.harvestTrophy);

  // Edit profile state
  const profile = userStats.profile || {
    name: 'Олексій Гровер',
    bio: 'Медичний гровер. Досліджую автоквіти та класичні сортові лінії з високим вмістом CBD. Фокусуюся на оптимізації VPD, LST та органічному живленні для максимального вмісту терпенів.',
    growExperience: 'Досвідчений Гровер (3 роки)',
    memberSince: '2025',
    locationRegion: 'Україна, Київ',
    avatarUrl: ''
  };

  const [editName, setEditName] = useState(profile.name);
  const [editBio, setEditBio] = useState(profile.bio || '');
  const [editExp, setEditExp] = useState(profile.growExperience || '');
  const [editLocation, setEditLocation] = useState(profile.locationRegion || 'Україна, Київ');
  const [editAvatarUrl, setEditAvatarUrl] = useState(profile.avatarUrl || '');

  // File Upload Helper
  const handleFileSelect = (file: File, isEditForm = false) => {
    if (!file.type.startsWith('image/')) {
      alert('Будь ласка, оберіть файл зображення (JPEG, PNG, WebP тощо)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (isEditForm) {
        setEditAvatarUrl(result);
      } else {
        setPhotoPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhotoModal = () => {
    const finalUrl = photoPreview || urlInput.trim();
    const updatedStats: UserStats = {
      ...userStats,
      profile: {
        ...profile,
        avatarUrl: finalUrl
      }
    };
    onUpdateUserStats(updatedStats);
    setEditAvatarUrl(finalUrl);
    setShowPhotoModal(false);
    setPhotoPreview('');
    setUrlInput('');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleRemovePhoto = () => {
    const updatedStats: UserStats = {
      ...userStats,
      profile: {
        ...profile,
        avatarUrl: ''
      }
    };
    onUpdateUserStats(updatedStats);
    setEditAvatarUrl('');
    setPhotoPreview('');
    setUrlInput('');
    setShowPhotoModal(false);
  };

  const levelInfo = getLevelInfo(userStats.points);
  const trophiesList = userStats.harvestTrophies || [];
  const badgesList = userStats.badges || [];
  const unlockedBadgesCount = badgesList.filter(b => b.unlocked).length;

  const getCompactBadgeIcon = (iconName: string, sizeClass = 'w-4 h-4') => {
    switch (iconName) {
      case 'Sprout': return <Sprout className={`${sizeClass} text-emerald-400 shrink-0`} />;
      case 'Gauge': return <Gauge className={`${sizeClass} text-amber-400 shrink-0`} />;
      case 'Droplets': return <Droplets className={`${sizeClass} text-sky-400 shrink-0`} />;
      case 'Bot': return <Bot className={`${sizeClass} text-teal-400 shrink-0`} />;
      case 'Flower2': return <Flower2 className={`${sizeClass} text-pink-400 shrink-0`} />;
      default: return <Trophy className={`${sizeClass} text-[#fad277] shrink-0`} />;
    }
  };

  // Calculate total harvests dry grams
  const totalHarvestGrams = trophiesList.reduce((acc, t) => acc + (t.totalYieldGrams || 0), 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStats: UserStats = {
      ...userStats,
      profile: {
        ...profile,
        name: editName,
        bio: editBio,
        growExperience: editExp,
        locationRegion: editLocation,
        avatarUrl: editAvatarUrl
      }
    };
    onUpdateUserStats(updatedStats);
    setShowEditProfile(false);
  };

  const handleCopyTrophyShare = (trophy: HarvestTrophy) => {
    const textToCopy = `🌿 Мій Щоденник Врожаю у PROPAHANDA GROW: ${trophy.trophyTitle}! Зібрано ${trophy.totalYieldGrams}г сухого суцвіття сорту ${trophy.strain} (${trophy.breeder}) за ${trophy.totalDays} днів.`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // GrowDiaries Synthesized Diary Records (combining active and harvested plants)
  const allDiaries = [
    ...activePlants.map(p => ({
      id: p.id,
      plant: p,
      isHarvested: false,
      title: p.name,
      strain: p.strain,
      breeder: p.breeder || 'Royal Queen Seeds',
      strainType: p.strainType || 'Indica',
      isAuto: p.isAuto ?? true,
      currentStage: p.stage,
      stageDay: p.stageDay,
      totalDays: p.stageDay + 18,
      weeks: Math.max(1, Math.ceil(p.stageDay / 7)),
      light: `${p.lightPowerWatts || 150}W LED (${p.lightSchedule || '18/6'})`,
      nutrients: 'Advanced Nutrients pH Perfect',
      medium: `${p.medium || 'Soil'} 15L Air-Pot`,
      temp: p.currentTemp || 24.5,
      humidity: p.currentHumidity || 62,
      vpd: 0.98,
      yieldEstimate: '80–110г / рослина',
      rating: 5,
      coverUrl: 'https://images.unsplash.com/photo-1536939459926-301728717817?w=600&auto=format&fit=crop&q=80',
      likes: 42,
      comments: 18,
      journalEntriesCount: p.growJournal?.length || 4,
      lastUpdateDate: 'Сьогодні'
    })),
    ...trophiesList.map(t => {
      const matchingPlant = plants.find(p => p.id === t.plantId);
      return {
        id: t.id,
        plant: matchingPlant || ({
          id: t.plantId,
          name: t.plantName,
          strain: t.strain,
          breeder: t.breeder,
          strainType: t.strainType,
          stage: 'harvested',
          isHarvested: true,
          harvestTrophy: t,
          growJournal: []
        } as unknown as Plant),
        isHarvested: true,
        title: t.plantName,
        strain: t.strain,
        breeder: t.breeder || 'Sensi Seeds',
        strainType: t.strainType || 'Sativa',
        isAuto: true,
        currentStage: 'harvested',
        stageDay: t.totalDays,
        totalDays: t.totalDays,
        weeks: Math.ceil(t.totalDays / 7),
        light: 'LED 240W Mars Hydro (12/12 & 18/6)',
        nutrients: 'Advanced Nutrients + Big Bud + Overdrive',
        medium: 'BioBizz Light-Mix 15L Air-Pot',
        temp: 23.5,
        humidity: 48,
        vpd: 1.25,
        yieldEstimate: `${t.totalYieldGrams}г сухе суцвіття`,
        rating: t.rating || 5,
        coverUrl: getTrophyAvatarUrl(t),
        likes: 128,
        comments: 34,
        journalEntriesCount: t.journalDaysCount || t.totalDays || 78,
        lastUpdateDate: t.harvestDate || '2026-06-15',
        trophy: t
      };
    })
  ];

  // Filtered Diaries
  const filteredDiaries = allDiaries.filter(diary => {
    if (diaryFilter === 'active' && diary.isHarvested) return false;
    if (diaryFilter === 'harvested' && !diary.isHarvested) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        diary.strain.toLowerCase().includes(query) ||
        diary.breeder.toLowerCase().includes(query) ||
        diary.title.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-full mx-auto select-none">
      {/* VARIATION 3 MAIN 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* LEFT SIDEBAR */}
        <aside className="space-y-4">
          {/* Profile Card */}
          <div className="bg-[#161618] border border-[rgba(242,242,242,0.08)] rounded-xl p-5 sm:p-6 relative overflow-hidden text-[#f2f2f2] shadow-xl before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-[#d8f087] before:to-transparent">
            {/* Avatar */}
            <div
              onClick={() => {
                setPhotoPreview(profile.avatarUrl || '');
                setUrlInput(profile.avatarUrl || '');
                setShowPhotoModal(true);
              }}
              className="relative group w-20 h-20 rounded-lg overflow-hidden bg-[#222] border border-[rgba(242,242,242,0.08)] mb-4 flex items-center justify-center cursor-pointer shadow-md"
            >
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  fill
                  unoptimized
                  referrerPolicy="no-referrer"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <User className="w-10 h-10 text-[#d8f087]" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[9px] font-bold text-white">
                <Camera className="w-4 h-4 text-[#d8f087]" />
                <span>Змінити</span>
              </div>
            </div>

            {/* Handle & Name */}
            <div className="label-tech mb-1 text-[rgba(242,242,242,0.5)]">
              @{profile.name.toLowerCase().replace(/\s+/g, '_')}
            </div>
            <h2 className="font-syne text-2xl font-black mb-1 flex items-center gap-1.5 text-[#f2f2f2]">
              {profile.name} <span className="text-[#FFCC00] text-lg">✓</span>
            </h2>
            <div className="label-tech text-[#FFCC00] mb-3">
              GrandMaster Grower
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-sm leading-relaxed text-[rgba(242,242,242,0.6)] italic mb-4">
              &quot;{profile.bio || 'Медичний гровер. Досліджую автоквіти та класичні сортові лінії з високим вмістом CBD для релаксу та здоров’я.'}&quot;
            </p>

            {/* Stats Grid 2x2 */}
            <div className="grid grid-cols-2 gap-px bg-[rgba(242,242,242,0.08)] border border-[rgba(242,242,242,0.08)] rounded-lg overflow-hidden my-4">
              <div className="bg-[#0c0c0e] p-3">
                <div className="label-tech text-[10px] text-[rgba(242,242,242,0.5)] mb-0.5">Щоденники</div>
                <div className="font-mono text-lg font-bold text-[#f2f2f2]">
                  {allDiaries.length.toString().padStart(2, '0')}
                </div>
              </div>
              <div className="bg-[#0c0c0e] p-3">
                <div className="label-tech text-[10px] text-[rgba(242,242,242,0.5)] mb-0.5">Врожаїв</div>
                <div className="font-mono text-lg font-bold text-[#FFCC00]">
                  {(trophiesList.length + 1).toString().padStart(2, '0')}
                </div>
              </div>
              <div className="bg-[#0c0c0e] p-3">
                <div className="label-tech text-[10px] text-[rgba(242,242,242,0.5)] mb-0.5">Сухий вага</div>
                <div className="font-mono text-lg font-bold text-[#d8f087]">
                  {totalHarvestGrams + 92}г
                </div>
              </div>
              <div className="bg-[#0c0c0e] p-3">
                <div className="label-tech text-[10px] text-[rgba(242,242,242,0.5)] mb-0.5">Глобал</div>
                <div className="font-mono text-lg font-bold text-[#fad277]">
                  #42
                </div>
              </div>
            </div>

            {/* Edit Profile Ghost Button */}
            <button
              onClick={() => setShowEditProfile(true)}
              className="w-full py-2.5 px-3 rounded border border-[rgba(242,242,242,0.15)] text-[#f2f2f2] hover:bg-[#f2f2f2] hover:text-[#0c0c0e] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer font-bold mt-2"
            >
              Редагувати профіль
            </button>
          </div>

          {/* Compact Achievements Card in Sidebar */}
          <div className="bg-[#161618] border border-[rgba(242,242,242,0.08)] p-4 rounded-xl text-[#f2f2f2] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#fad277]" />
                <span className="label-tech text-[#f2f2f2]">Досягнення</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveCabinetTab('badges')}
                className="font-mono text-[10px] font-bold text-[#d8f087] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>{unlockedBadgesCount}/{badgesList.length}</span>
                <span>→</span>
              </button>
            </div>

            {/* Compact Level Bar */}
            <div className="bg-[#0c0c0e] border border-[rgba(242,242,242,0.08)] rounded-lg p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#d8f087] font-bold">LVL {levelInfo.level} • {levelInfo.title}</span>
                <span className="text-[#fad277] font-bold">{userStats.points}/{levelInfo.nextLevelMax} XP</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d8f087] transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(0, Math.round(((userStats.points - levelInfo.currentLevelMin) / Math.max(1, levelInfo.nextLevelMax - levelInfo.currentLevelMin)) * 100)))}%`
                  }}
                />
              </div>
            </div>

            {/* Compact 2-col Mini Badges Grid */}
            <div className="grid grid-cols-2 gap-1.5">
              {badgesList.map((badge) => (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() => setActiveCabinetTab('badges')}
                  title={`${badge.name}: ${badge.description}`}
                  className={`flex items-center gap-1.5 p-2 rounded-lg border text-left transition-all cursor-pointer min-w-0 ${
                    badge.unlocked
                      ? 'bg-[#0c0c0e] border-[#d8f087]/35 text-[#f2f2f2] hover:border-[#d8f087]'
                      : 'bg-[#0c0c0e]/50 border-[rgba(242,242,242,0.05)] text-neutral-500 opacity-50 grayscale'
                  }`}
                >
                  {getCompactBadgeIcon(badge.icon, 'w-3.5 h-3.5')}
                  <span className="text-[10px] font-bold truncate flex-1">{badge.name}</span>
                  {badge.unlocked && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d8f087] shadow-[0_0_5px_#d8f087] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Cloud Sync Card */}
          <div className="bg-[#161618] border border-[rgba(242,242,242,0.08)] p-4 rounded-xl text-[#f2f2f2]">
            <div className="label-tech mb-2 text-[rgba(242,242,242,0.5)]">Cloud Sync</div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#d8f087] shadow-[0_0_8px_#d8f087] animate-pulse" />
              <span className="font-mono text-xs font-bold text-[#f2f2f2] truncate">
                {profile.name} Connected
              </span>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <section className="space-y-4 min-w-0">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between border-b-2 border-[#f2f2f2] pb-3 mb-2 gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f2f2f2] flex items-center gap-2">
              {activeCabinetTab === 'diaries' && (
                <>
                  Щоденники <span className="text-[#d8f087]">/</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[rgba(242,242,242,0.5)]">
                    {filteredDiaries.length.toString().padStart(2, '0')} РОСЛИНИ
                  </span>
                </>
              )}
              {activeCabinetTab === 'badges' && (
                <>
                  Досягнення <span className="text-[#d8f087]">/</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[rgba(242,242,242,0.5)]">
                    {unlockedBadgesCount}/{badgesList.length} ВІДКРИТО
                  </span>
                </>
              )}
              {activeCabinetTab === 'preferences' && (
                <>
                  Уподобання <span className="text-[#d8f087]">/</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[rgba(242,242,242,0.5)]">
                    АНАЛІТИКА
                  </span>
                </>
              )}
              {activeCabinetTab === 'setup' && (
                <>
                  Гроубокс <span className="text-[#d8f087]">/</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[rgba(242,242,242,0.5)]">
                    ОБЛАДНАННЯ
                  </span>
                </>
              )}
              {activeCabinetTab === 'qa' && (
                <>
                  База Знань <span className="text-[#d8f087]">/</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[rgba(242,242,242,0.5)]">
                    Q&A
                  </span>
                </>
              )}
            </h1>

            <div className="flex items-center gap-3">
              <span className="label-tech text-[rgba(242,242,242,0.5)] hidden sm:inline">
                Сортувати: {diaryFilter === 'active' ? 'Активні' : 'Врожаї'}
              </span>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Пошук [F]..."
                  className="bg-[#161618] border border-[rgba(242,242,242,0.1)] text-[#f2f2f2] text-xs font-mono px-2.5 py-1 rounded placeholder:text-[rgba(242,242,242,0.3)] focus:outline-none focus:border-[#d8f087]"
                />
              </div>
            </div>
          </div>

          {/* Scroll Pill Container (Filter Pills) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => { setActiveCabinetTab('diaries'); setDiaryFilter('active'); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-mono tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                activeCabinetTab === 'diaries' && diaryFilter === 'active'
                  ? 'bg-[#f2f2f2] text-[#0c0c0e] border-[#f2f2f2]'
                  : 'bg-transparent text-[#f2f2f2] border-[rgba(242,242,242,0.15)] hover:border-[#f2f2f2]'
              }`}
            >
              🌱 В процесі (Активні)
            </button>
            <button
              onClick={() => { setActiveCabinetTab('diaries'); setDiaryFilter('harvested'); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-mono tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                activeCabinetTab === 'diaries' && diaryFilter === 'harvested'
                  ? 'bg-[#f2f2f2] text-[#0c0c0e] border-[#f2f2f2]'
                  : 'bg-transparent text-[#f2f2f2] border-[rgba(242,242,242,0.15)] hover:border-[#f2f2f2]'
              }`}
            >
              🏆 Зібрані врожаї
            </button>
            <button
              onClick={() => setActiveCabinetTab('badges')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-mono tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                activeCabinetTab === 'badges'
                  ? 'bg-[#f2f2f2] text-[#0c0c0e] border-[#f2f2f2]'
                  : 'bg-transparent text-[#f2f2f2] border-[rgba(242,242,242,0.15)] hover:border-[#f2f2f2]'
              }`}
            >
              🏅 Досягнення ({unlockedBadgesCount}/{badgesList.length})
            </button>
            <button
              onClick={() => setActiveCabinetTab('preferences')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-mono tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                activeCabinetTab === 'preferences'
                  ? 'bg-[#f2f2f2] text-[#0c0c0e] border-[#f2f2f2]'
                  : 'bg-transparent text-[#f2f2f2] border-[rgba(242,242,242,0.15)] hover:border-[#f2f2f2]'
              }`}
            >
              📊 Уподобання
            </button>
            <button
              onClick={() => setActiveCabinetTab('setup')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-mono tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                activeCabinetTab === 'setup'
                  ? 'bg-[#f2f2f2] text-[#0c0c0e] border-[#f2f2f2]'
                  : 'bg-transparent text-[#f2f2f2] border-[rgba(242,242,242,0.15)] hover:border-[#f2f2f2]'
              }`}
            >
              🪴 Гроубокс
            </button>
            <button
              onClick={() => setActiveCabinetTab('qa')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-mono tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                activeCabinetTab === 'qa'
                  ? 'bg-[#f2f2f2] text-[#0c0c0e] border-[#f2f2f2]'
                  : 'bg-transparent text-[#f2f2f2] border-[rgba(242,242,242,0.15)] hover:border-[#f2f2f2]'
              }`}
            >
              💬 Нотатки & FAQ
            </button>
          </div>

          {/* TAB: COMPACT ACHIEVEMENTS & STRAINS */}
          {activeCabinetTab === 'badges' && (
            <div className="bg-[#161618] border border-[rgba(242,242,242,0.08)] rounded-2xl p-3.5 sm:p-4 shadow-xl space-y-3.5 text-white animate-fadeIn">
              {/* Compact Header & Sub-switcher */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(242,242,242,0.08)] pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0c0c0e] border border-[#d8f087]/40 flex items-center justify-center text-[#d8f087] shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white">
                        Рівень {levelInfo.level}: {levelInfo.title}
                      </h3>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#0c0c0e] border border-[#fad277]/40 text-[#fad277]">
                        {userStats.points} XP • {userStats.totalQuestsCompleted} квестів
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      До наступного рівня ({levelInfo.nextLevelMax} XP): залишилось {Math.max(0, levelInfo.nextLevelMax - userStats.points)} XP
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#0c0c0e] p-1 rounded-lg border border-[rgba(242,242,242,0.08)]">
                  <button
                    type="button"
                    onClick={() => setBadgesSubView('badges')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      badgesSubView === 'badges'
                        ? 'bg-[#d8f087] text-[#0c0c0e]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    🏅 Нагороди ({unlockedBadgesCount}/{badgesList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBadgesSubView('strains')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      badgesSubView === 'strains'
                        ? 'bg-[#d8f087] text-[#0c0c0e]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    📚 Сорти ({MEDICAL_STRAINS.length})
                  </button>
                </div>
              </div>

              {badgesSubView === 'badges' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {badgesList.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                        badge.unlocked
                          ? 'bg-[#0c0c0e] border-[#d8f087]/35 text-white'
                          : 'bg-[#0c0c0e]/50 border-[rgba(242,242,242,0.06)] opacity-55 grayscale text-neutral-400'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        badge.unlocked
                          ? 'bg-[#d8f087]/15 border border-[#d8f087]/40'
                          : 'bg-neutral-900 border border-neutral-800'
                      }`}>
                        {getCompactBadgeIcon(badge.icon, 'w-4 h-4')}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <h4 className="text-xs font-black text-white truncate">{badge.name}</h4>
                          <span className={`font-mono uppercase text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                            badge.unlocked
                              ? 'bg-[#d8f087]/15 text-[#d8f087] border-[#d8f087]/40'
                              : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                          }`}>
                            {badge.unlocked ? '✓' : '🔒'}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-snug mt-0.5 line-clamp-2">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MEDICAL_STRAINS.map((strain) => (
                    <div
                      key={strain.name}
                      className="bg-[#0c0c0e] border border-[rgba(242,242,242,0.08)] hover:border-[#d8f087]/40 rounded-xl p-3 flex flex-col justify-between gap-2.5 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1.5 mb-1">
                          <h4 className="text-xs sm:text-sm font-black text-white truncate">{strain.name}</h4>
                          <span className="font-mono text-[9.5px] font-bold px-2 py-0.5 rounded bg-[#d8f087]/15 text-[#d8f087] border border-[#d8f087]/35 shrink-0">
                            {strain.type} • {strain.floweringWeeks} тиж.
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 line-clamp-2 leading-snug">
                          {strain.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-300">
                          <span>ТГК: <strong className="text-[#fad277]">{strain.thc}</strong></span>
                          <span>•</span>
                          <span>pH: <strong className="text-teal-300">{strain.optimalPH}</strong></span>
                        </div>
                        {onAddPlantFromStrain && (
                          <button
                            type="button"
                            onClick={() => onAddPlantFromStrain(strain)}
                            className="bg-[#161618] hover:bg-[#d8f087] text-[#d8f087] hover:text-[#0c0c0e] border border-[#d8f087]/40 font-mono uppercase text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer shrink-0"
                          >
                            <Plus className="w-3 h-3" />
                            <span>У бокс</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 1: DIARIES LIST */}
          {activeCabinetTab === 'diaries' && (
            <div className="space-y-3.5 animate-fadeIn">
              {filteredDiaries.length === 0 ? (
                <div className="bg-[#161618] border border-[rgba(242,242,242,0.08)] rounded-xl p-10 text-center text-[rgba(242,242,242,0.5)] space-y-2">
                  <BookOpen className="w-8 h-8 text-[rgba(242,242,242,0.3)] mx-auto" />
                  <h4 className="font-syne text-base font-bold text-[#f2f2f2]">Щоденників не знайдено</h4>
                  <p className="font-mono text-xs text-[rgba(242,242,242,0.4)]">
                    Спробуйте змінити фільтри або пошуковий запит
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDiaries.map(diary => (
                    <DiaryWidgetCard
                      key={diary.id}
                      diary={diary as unknown as DiaryItem}
                      onNavigateToPlant={onNavigateToPlant}
                      onOpenCertificate={(trophy) => setSelectedTrophy(trophy)}
                      onOpenFullJournal={(plant) => setSelectedJournalPlant(plant)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

      {/* 4. TAB CONTENT: CULTIVATION PREFERENCES BREAKDOWN WIDGET (GROWDIARIES SIGNATURE) */}
      {activeCabinetTab === 'preferences' && (
        <div className="bg-[#121418] border border-neutral-800/90 rounded-3xl p-4 sm:p-6 shadow-xl space-y-5 text-white animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tight">
                  Уподобання гровера (Cultivation Preferences)
                </h3>
                <p className="text-xs text-neutral-400">
                  Аналітика методів, генетики, поживних речовин та обладнання
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-neutral-400 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800 self-start sm:self-auto">
              Оновлено за результатами всіх циклів
            </span>
          </div>

          {/* 2-Column Grid: Left: Splits (Auto vs Photo, Indoor vs Outdoor, Medium), Right: Top Brands */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Splits */}
            <div className="space-y-4">
              {/* Auto vs Photo */}
              <div className="space-y-1.5 bg-[#181a20] p-3.5 rounded-2xl border border-neutral-800/60">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-400">⚡ Автоквіти (Autoflower): 65%</span>
                  <span className="text-amber-400">🌿 Фотоперіод (Photo): 35%</span>
                </div>
                <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: '65%' }} />
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: '35%' }} />
                </div>
              </div>

              {/* Indoor vs Outdoor */}
              <div className="space-y-1.5 bg-[#181a20] p-3.5 rounded-2xl border border-neutral-800/60">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-sky-400">🏠 Індор (Growbox): 85%</span>
                  <span className="text-green-400">☀️ Аутдор (Outdoor): 15%</span>
                </div>
                <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-gradient-to-r from-sky-500 to-blue-600" style={{ width: '85%' }} />
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600" style={{ width: '15%' }} />
                </div>
              </div>

              {/* Medium Distribution */}
              <div className="space-y-1.5 bg-[#181a20] p-3.5 rounded-2xl border border-neutral-800/60">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-amber-300">🪴 Ґрунт/Перліт: 70%</span>
                  <span className="text-teal-300">🥥 Кокос: 25%</span>
                  <span className="text-purple-300">💧 Гідро: 5%</span>
                </div>
                <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-amber-600" style={{ width: '70%' }} />
                  <div className="h-full bg-teal-500" style={{ width: '25%' }} />
                  <div className="h-full bg-purple-500" style={{ width: '5%' }} />
                </div>
              </div>
            </div>

            {/* Right Column: Top Brands of Choice */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Top Breeders */}
              <div className="bg-[#181a20] p-3.5 rounded-2xl border border-neutral-800/70 space-y-2">
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-tight block">
                  🧬 Сідбанки (Breeders)
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-200">
                    <span className="font-bold">Fast Buds</span>
                    <span className="font-mono text-amber-400 font-bold">32%</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Sensi Seeds</span>
                    <span className="font-mono text-neutral-400">25%</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Barney&apos;s Farm</span>
                    <span className="font-mono text-neutral-400">20%</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-[11px]">
                    <span>RQS / Sweet Seeds</span>
                    <span className="font-mono">23%</span>
                  </div>
                </div>
              </div>

              {/* Top Nutrients */}
              <div className="bg-[#181a20] p-3.5 rounded-2xl border border-neutral-800/70 space-y-2">
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-tight block">
                  🧪 Добрива (Nutrients)
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-200">
                    <span className="font-bold">Advanced Nutr.</span>
                    <span className="font-mono text-emerald-400 font-bold">45%</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>BioBizz Organic</span>
                    <span className="font-mono text-neutral-400">30%</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Fox Farm</span>
                    <span className="font-mono text-neutral-400">15%</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-[11px]">
                    <span>Plagron / Hesi</span>
                    <span className="font-mono">10%</span>
                  </div>
                </div>
              </div>

              {/* Top Lights */}
              <div className="bg-[#181a20] p-3.5 rounded-2xl border border-neutral-800/70 space-y-2">
                <span className="text-[11px] font-black text-[#FFCC00] uppercase tracking-tight block">
                  💡 Світло (Lights)
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-200">
                    <span className="font-bold">Mars Hydro LED</span>
                    <span className="font-mono text-[#FFCC00] font-bold">55%</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Spider Farmer</span>
                    <span className="font-mono text-neutral-400">30%</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Lumatek PRO</span>
                    <span className="font-mono text-neutral-400">15%</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-[11px]">
                    <span>Quantum Board</span>
                    <span className="font-mono">Samsung</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 5. TAB CONTENT: GROW SETUP & TENT */}
      {activeCabinetTab === 'setup' && (
        <div className="bg-[#121418] border border-neutral-800/90 rounded-3xl p-4 sm:p-6 shadow-xl space-y-6 text-white animate-fadeIn">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  Обладнання та Конфігурація Гроубоксу (Grow Setup)
                </h3>
                <p className="text-xs text-neutral-400">
                  Технічні специфікації вашого гроу-простору
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#181a20] border border-neutral-800 p-4 rounded-2xl space-y-2">
              <span className="text-[11px] font-black text-emerald-400 uppercase tracking-tight block">🏠 Гроубокс (Tent)</span>
              <h4 className="text-sm font-bold text-white">Homebox Ambient Q120+</h4>
              <p className="text-xs text-neutral-400">Розмір: 120 x 120 x 220 см • PAR+ внутрішнє світловідбиваюче покриття</p>
            </div>

            <div className="bg-[#181a20] border border-neutral-800 p-4 rounded-2xl space-y-2">
              <span className="text-[11px] font-black text-[#FFCC00] uppercase tracking-tight block">💡 Освітлення (LED)</span>
              <h4 className="text-sm font-bold text-white">Mars Hydro FC-3000-EVO</h4>
              <p className="text-xs text-neutral-400">Потужність: 300W • Samsung LM301H діоди • Повний спектр 660nm</p>
            </div>

            <div className="bg-[#181a20] border border-neutral-800 p-4 rounded-2xl space-y-2">
              <span className="text-[11px] font-black text-sky-400 uppercase tracking-tight block">💨 Вентиляція & Фільтрація</span>
              <h4 className="text-sm font-bold text-white">Prima Klima PK125-TC</h4>
              <p className="text-xs text-neutral-400">Продуктивність: 400 м³/год • Вбудований регулятор температури + Can-Lite фільтр</p>
            </div>

            <div className="bg-[#181a20] border border-neutral-800 p-4 rounded-2xl space-y-2">
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-tight block">🪴 Горщики & Субстрат</span>
              <h4 className="text-sm font-bold text-white">Air-Pot 15L + BioBizz Light</h4>
              <p className="text-xs text-neutral-400">Суміш: 70% Торф BioBizz + 25% Перліт + 5% Біогумус з мікоризою Great White</p>
            </div>

            <div className="bg-[#181a20] border border-neutral-800 p-4 rounded-2xl space-y-2">
              <span className="text-[11px] font-black text-purple-400 uppercase tracking-tight block">🧪 Лінія Живлення</span>
              <h4 className="text-sm font-bold text-white">Advanced Nutrients pH Perfect</h4>
              <p className="text-xs text-neutral-400">Sensi Grow/Bloom A&B • B-52 • Big Bud • Overdrive • Flawless Finish</p>
            </div>

            <div className="bg-[#181a20] border border-neutral-800 p-4 rounded-2xl space-y-2">
              <span className="text-[11px] font-black text-teal-400 uppercase tracking-tight block">📊 Вимірювальні Прилади</span>
              <h4 className="text-sm font-bold text-white">Milwaukee pH55 Pro + Inkbird</h4>
              <p className="text-xs text-neutral-400">pH метр Milwaukee pH55 • TDS/EC метр Xiaomi • Wi-Fi гігрометр Inkbird IBS-TH2</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: GROW Q&A */}
      {activeCabinetTab === 'qa' && (
        <div className="bg-[#121418] border border-neutral-800/90 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 text-white animate-fadeIn">
          <div className="flex items-center gap-2.5 border-b border-neutral-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Запитання & База Знань Гровера (Grow Q&A)
              </h3>
              <p className="text-xs text-neutral-400">
                Практичні рекомендації для максимізації врожайності та якості
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-[#181a20] p-4 rounded-2xl border border-neutral-800 space-y-1.5">
              <h4 className="font-black text-amber-300 text-sm">❓ Як правильно контролювати VPD на різних стадіях?</h4>
              <p className="text-neutral-300 leading-relaxed">
                На стадії вегетації тримайте VPD 0.8–1.1 kPa (температура ~25°C, вологість 60–65%). На стадії цвітіння підвищуйте VPD до 1.2–1.5 kPa (температура 23–24°C, вологість 45–50%) для запобігання плісняві та збільшення виділення смоли.
              </p>
            </div>

            <div className="bg-[#181a20] p-4 rounded-2xl border border-neutral-800 space-y-1.5">
              <h4 className="font-black text-emerald-300 text-sm">❓ Чому важливо заміряти pH та PPM дренажу після поливу?</h4>
              <p className="text-neutral-300 leading-relaxed">
                Дренаж показує реальний стан кореневої зони. Якщо PPM на виході вищий за вхідний розчин більш ніж на 300 ppm, у субстраті накопичуються солі і потрібна промивка чистою водою з CalMag або Flawless Finish.
              </p>
            </div>
          </div>
        </div>
      )}
        </section>
      </div>

      {/* Certificate Modal */}
      {selectedTrophy && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto">
          <div className="bg-[#121316] border-0 sm:border border-[#FFCC00]/50 rounded-none sm:rounded-3xl p-3 sm:p-6 w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] shadow-2xl space-y-5 text-white relative">
            <div className="text-center space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCC00]">
                Офіційний Сертифікат Врожаю PROPAHANDA GROW
              </span>
              <h3 className="text-xl font-black text-white">
                {selectedTrophy.trophyTitle}
              </h3>
              <p className="text-xs text-neutral-400">
                Сорт {selectedTrophy.strain} • {selectedTrophy.breeder}
              </p>
            </div>

            <div className="bg-[#18191c] p-4 rounded-2xl border border-neutral-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400">Сухий врожай:</span>
                <strong className="text-emerald-400 font-bold">{selectedTrophy.totalYieldGrams} грамів</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Тривалість циклу:</span>
                <strong className="text-white">{selectedTrophy.totalDays} днів</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Дата збору:</span>
                <strong className="text-amber-400">{selectedTrophy.harvestDate}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Оцінка якості:</span>
                <strong className="text-[#FFCC00]">★ {selectedTrophy.rating}/5 зірок</strong>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleCopyTrophyShare(selectedTrophy)}
                className="w-full flex items-center justify-center gap-2 bg-[#FFCC00] hover:bg-[#e6b800] text-neutral-950 font-black text-xs py-3 rounded-2xl transition-all cursor-pointer shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedLink ? 'Посилання скопійовано!' : 'Поділитися врожаєм'}</span>
              </button>

              <button
                onClick={() => setSelectedTrophy(null)}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs py-2.5 rounded-2xl cursor-pointer transition-colors"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto">
          <div className="bg-[#121316] border-0 sm:border border-neutral-800 rounded-none sm:rounded-3xl p-3 sm:p-6 w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#d8f087]" />
                Редагування Профілю Гровера
              </h3>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              {/* Photo selector inside Edit Profile */}
              <div>
                <label className="block text-neutral-300 font-bold mb-1.5">Фотографія профілю</label>
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#18191c] border border-neutral-800">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-neutral-900 border-2 border-neutral-700 shrink-0 flex items-center justify-center">
                    {editAvatarUrl ? (
                      <Image
                        src={editAvatarUrl}
                        alt="Preview"
                        fill
                        unoptimized
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-neutral-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file, true);
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer border border-neutral-700 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#d8f087]" />
                        <span>Обрати фото</span>
                      </button>
                      {editAvatarUrl && (
                        <button
                          type="button"
                          onClick={() => setEditAvatarUrl('')}
                          className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[11px] font-bold flex items-center gap-1 cursor-pointer border border-red-800/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Видалити</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={editAvatarUrl}
                      onChange={(e) => setEditAvatarUrl(e.target.value)}
                      placeholder="Або посилання на фото (URL)"
                      className="w-full bg-[#121316] border border-neutral-800 rounded-lg px-2.5 py-1 text-[11px] text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-[#d8f087]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Нікнейм гровера</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-3 font-bold text-white focus:outline-none focus:border-[#d8f087]"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Локація / Регіон</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-3 font-medium text-white focus:outline-none focus:border-[#d8f087]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Досвід вирощування</label>
                <input
                  type="text"
                  value={editExp}
                  onChange={(e) => setEditExp(e.target.value)}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-3 font-medium text-white focus:outline-none focus:border-[#d8f087]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Про себе / Філософія культивації</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-3 font-medium text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d8f087]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="px-4 py-2.5 bg-[#18191c] hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#d8f087] hover:bg-[#cbe37a] text-[#18181b] font-black rounded-xl cursor-pointer transition-colors"
                >
                  Зберегти зміни
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Standalone Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto">
          <div className="bg-[#121316] border-0 sm:border border-neutral-800 rounded-none sm:rounded-3xl p-3 sm:p-6 w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#d8f087]" />
                Фотографія Профілю
              </h3>
              <button
                onClick={() => {
                  setShowPhotoModal(false);
                  setPhotoPreview('');
                  setUrlInput('');
                }}
                className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />

            {/* Drag and drop zone / Preview */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingPhoto(true);
              }}
              onDragLeave={() => setIsDraggingPhoto(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingPhoto(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileSelect(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-3xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                isDraggingPhoto
                  ? 'border-[#d8f087] bg-[#d8f087]/10 scale-[1.02]'
                  : 'border-neutral-700 bg-[#18191c] hover:border-neutral-500 hover:bg-[#1f2024]'
              }`}
            >
              {photoPreview || urlInput ? (
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#d8f087] shadow-xl">
                  <Image
                    src={photoPreview || urlInput}
                    alt="Аватар"
                    fill
                    unoptimized
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[11px] font-bold text-white gap-1">
                    <Upload className="w-4 h-4 text-[#d8f087]" />
                    <span>Замінити</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center text-neutral-400">
                    <ImageIcon className="w-8 h-8 text-[#d8f087]" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Натисніть або перетягніть фото сюди</span>
                    <span className="text-[11px] text-neutral-400">Підтримуються PNG, JPG, WebP, GIF</span>
                  </div>
                </div>
              )}
            </div>

            {/* URL Input Alternative */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300">Або вкажіть пряме посилання на фото (URL):</label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (e.target.value && !photoPreview) {
                    setPhotoPreview(e.target.value);
                  }
                }}
                placeholder="https://images.example.com/my-photo.jpg"
                className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#d8f087]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800">
              {profile.avatarUrl ? (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3.5 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-400 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Видалити фото</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhotoModal(false);
                    setPhotoPreview('');
                    setUrlInput('');
                  }}
                  className="px-4 py-2.5 bg-[#18191c] hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Скасувати
                </button>
                <button
                  type="button"
                  onClick={handleSavePhotoModal}
                  disabled={!photoPreview && !urlInput.trim()}
                  className="px-5 py-2.5 bg-[#d8f087] hover:bg-[#cbe37a] disabled:opacity-40 text-[#18181b] text-xs font-black rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Зберегти фото</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grow Journal Modal Overlay */}
      {selectedJournalPlant && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto">
          <div className="bg-[#121316] border-0 sm:border border-neutral-800 rounded-none sm:rounded-3xl w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] overflow-y-auto shadow-2xl relative flex flex-col text-white">
            <div className="sticky top-0 bg-[#18191c]/95 backdrop-blur-md border-b border-neutral-800 p-3 sm:p-4 flex items-center justify-between z-10 rounded-none sm:rounded-t-3xl text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#d8f087]/20 text-[#d8f087] rounded-xl">
                  <BookOpen className="w-5 h-5 text-[#d8f087]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Щоденник вирощування: {selectedJournalPlant.name}
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium">
                    Сорт {selectedJournalPlant.strain} • {selectedJournalPlant.breeder || 'Sensi Seeds'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJournalPlant(null)}
                className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <GrowJournal
                plant={selectedJournalPlant}
                onUpdatePlant={(updated) => {
                  // handle plant update if needed
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
