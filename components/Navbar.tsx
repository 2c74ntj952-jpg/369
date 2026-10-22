'use client';

import React from 'react';
import { UserStats, Plant, ReminderTask } from '@/lib/types';
import { getLevelInfo } from '@/lib/growData';
import { Sparkles, Flame, Trophy, Sprout, Cloud, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { UserAdapter as User } from '@/lib/storageAdapter';

interface NavbarProps {
  userStats: UserStats;
  plants?: Plant[];
  activePlantId?: string;
  onSelectPlant?: (id: string) => void;
  onOpenAddPlant?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser?: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
  isCloudSynced?: boolean;
  tasks?: ReminderTask[];
}

export const Navbar: React.FC<NavbarProps> = ({
  userStats,
  activeTab,
  setActiveTab,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const levelInfo = getLevelInfo(userStats.points);
  const xpInCurrentLevel = userStats.points - levelInfo.currentLevelMin;
  const xpNeededForLevel = levelInfo.nextLevelMax - levelInfo.currentLevelMin;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100)));

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0e]/95 backdrop-blur-md border-b border-[rgba(242,242,242,0.08)] px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-xl w-full">
      <div className="w-full max-w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4 min-w-0">
        {/* Logo & App Name */}
        <div id="tour-logo" className="flex items-center justify-between w-full md:w-auto gap-2 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 shrink overflow-hidden">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#161618] border border-[rgba(242,242,242,0.08)] rounded-lg flex items-center justify-center text-[#d8f087] shadow-xs shrink-0 font-black">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 overflow-hidden">
              <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                <h1 className="font-syne text-base sm:text-xl font-extrabold text-[#f2f2f2] tracking-tight flex items-center gap-1 shrink-0">
                  PROPAHANDA <span className="text-[#d8f087]">GROW</span>
                </h1>
                <span className="label-tech px-2 py-0.5 rounded bg-[#161618] border border-[rgba(242,242,242,0.08)] text-[#d8f087] shrink-0">
                  v1.0
                </span>
              </div>
              <p className="font-mono text-[10px] text-[rgba(242,242,242,0.5)] tracking-wide hidden sm:block truncate">
                Медичний Гроу-Помічник вдома
              </p>
            </div>
          </div>
        </div>

        {/* Gamification Stats Bar (XP, Level, Streak) */}
        <div id="tour-gamification" className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end overflow-x-auto no-scrollbar py-0.5">
          {/* XP Pill */}
          <div className="bg-[#161618] border border-[rgba(242,242,242,0.08)] px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="label-tech text-[#d8f087] text-[10px] font-bold">
                  LEVEL 0{levelInfo.level}
                </span>
                <span className="text-[10px] text-[rgba(242,242,242,0.5)] font-mono hidden sm:inline">
                  • {levelInfo.title}
                </span>
              </div>
              <div className="w-16 sm:w-20 h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[#d8f087] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="font-mono text-xs sm:text-sm font-bold text-[#fad277] flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-[#fad277]" />
                <span>{userStats.points} XP</span>
              </div>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="bg-[#fa6e59] text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-black text-[11px] sm:text-xs flex items-center gap-1.5 shrink-0 shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
            <span className="font-mono uppercase font-bold tracking-tight">
              {userStats.streakDays} ДН.
            </span>
          </div>

          {/* Cloud Account Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-[#161618] border border-[rgba(242,242,242,0.08)] px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-bold shrink-0 min-w-0">
              {currentUser.uid === 'BkUXSyh6XqW9AinMS5vlx7iTuov1' ? (
                <span className="flex items-center gap-1 bg-[#d8f087] text-[#0c0c0e] px-1.5 py-0.5 rounded text-[9px] font-black uppercase shrink-0">
                  <ShieldCheck className="w-2.5 h-2.5 stroke-[3]" />
                  <span>Admin</span>
                </span>
              ) : (
                <div className="w-2 h-2 rounded-full bg-[#d8f087] shadow-[0_0_8px_#d8f087] shrink-0" />
              )}
              <span className="font-mono text-[11px] text-[#f2f2f2] max-w-[45px] sm:max-w-[100px] truncate">
                {currentUser.displayName || currentUser.email || 'Cloud'}
              </span>
              <button
                onClick={onLogout}
                title="Вийти з хмари"
                className="hover:text-rose-400 transition-colors cursor-pointer p-0.5 ml-0.5 shrink-0"
              >
                <LogOut className="w-3 h-3 text-[rgba(242,242,242,0.5)] hover:text-rose-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 bg-[#161618] hover:bg-[#202024] text-[#f2f2f2] hover:text-[#d8f087] border border-[rgba(242,242,242,0.08)] text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 uppercase tracking-wider"
              title="Увійти для синхронізації з Хмарою"
            >
              <LogIn className="w-3 h-3" />
              <span>Вхід</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Switcher (Variation 3 style) */}
      <nav
        id="main-nav-tabs"
        className="w-full max-w-full mx-auto mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-[rgba(242,242,242,0.08)] flex items-center justify-start gap-3 sm:gap-6 overflow-x-auto no-scrollbar px-1"
      >
        {([
          ...(currentUser?.uid === 'BkUXSyh6XqW9AinMS5vlx7iTuov1'
            ? [{ id: 'admin', label: 'Адмін-Панель', badge: 'Admin' }]
            : []),
          { id: 'home', label: 'Дім' },
          { id: 'overview', label: 'Кімната 1' },
          { id: 'community', label: 'Спільнота' },
          { id: 'manufacturers', label: 'Виробники' },
        ] as { id: string; label: string; badge?: string }[]).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`nav-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-1.5 sm:py-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer select-none flex items-center gap-1.5 ${
                isActive
                  ? 'text-[#f2f2f2] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#d8f087]'
                  : 'text-[rgba(242,242,242,0.5)] hover:text-[#f2f2f2]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#d8f087] text-[#0c0c0e] font-black uppercase font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
