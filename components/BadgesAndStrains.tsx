'use client';

import React, { useState } from 'react';
import { UserStats, Badge } from '@/lib/types';
import { MEDICAL_STRAINS, StrainInfo, getLevelInfo } from '@/lib/growData';
import { Trophy, Sprout, Gauge, Droplets, Bot, Flower2, Award, BookOpen, Plus, Heart, Shield, CheckCircle2 } from 'lucide-react';

interface BadgesAndStrainsProps {
  userStats: UserStats;
  onAddPlantFromStrain: (strain: StrainInfo) => void;
}

export const BadgesAndStrains: React.FC<BadgesAndStrainsProps> = ({
  userStats,
  onAddPlantFromStrain
}) => {
  const [activeSection, setActiveSection] = useState<'badges' | 'strains'>('badges');
  const levelInfo = getLevelInfo(userStats.points);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout': return <Sprout className="w-6 h-6 text-emerald-400" />;
      case 'Gauge': return <Gauge className="w-6 h-6 text-amber-400" />;
      case 'Droplets': return <Droplets className="w-6 h-6 text-blue-400" />;
      case 'Bot': return <Bot className="w-6 h-6 text-teal-400" />;
      case 'Flower2': return <Flower2 className="w-6 h-6 text-pink-400" />;
      default: return <Trophy className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => setActiveSection('badges')}
          className={`flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeSection === 'badges'
              ? 'bg-[#d8f087] text-[#18181b] shadow-xs'
              : 'bg-[#18191c] text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>🏆 Досягнення ({(userStats?.badges || []).filter(b => b.unlocked).length}/{(userStats?.badges || []).length})</span>
        </button>

        <button
          onClick={() => setActiveSection('strains')}
          className={`flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeSection === 'strains'
              ? 'bg-[#d8f087] text-[#18181b] shadow-xs'
              : 'bg-[#18191c] text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>📚 Довідник Сортів</span>
        </button>
      </div>

      {activeSection === 'badges' && (
        <div className="space-y-6">
          {/* Level Progress Banner */}
          <div className="bg-[#fce182] text-[#18181b] rounded-3xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border border-amber-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#18181b]/15 border border-[#18181b]/20 flex items-center justify-center shrink-0">
                <Trophy className="w-8 h-8 text-[#18181b] fill-[#18181b]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#18181b] px-2.5 py-0.5 rounded-full">
                  Поточний Статус
                </span>
                <h3 className="text-xl font-black text-[#18181b] mt-1">
                  Рівень {levelInfo.level}: <span>{levelInfo.title}</span>
                </h3>
                <p className="text-xs text-[#18181b]/80 mt-0.5 font-bold">
                  Загальний досвід: <strong className="text-[#18181b]">{userStats.points} XP</strong> • Виконано {userStats.totalQuestsCompleted} квестів
                </p>
              </div>
            </div>

            <div className="text-right bg-[#18181b]/10 p-3.5 rounded-2xl border border-[#18181b]/20 w-full md:w-auto">
              <div className="text-xs font-bold text-[#18181b]/80">Наступний статус:</div>
              <div className="text-sm font-black text-[#18181b]">
                Рівень {levelInfo.level + 1} ({levelInfo.nextLevelMax} XP)
              </div>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userStats.badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 ${
                  badge.unlocked
                    ? 'bg-[#18191c] border-neutral-800 text-white shadow-xs'
                    : 'bg-[#121316] border-neutral-900 opacity-50 grayscale text-neutral-400'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    badge.unlocked ? 'bg-[#d8f087]/20 border border-[#d8f087]/30' : 'bg-neutral-800'
                  }`}>
                    {getBadgeIcon(badge.icon)}
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    badge.unlocked
                      ? 'bg-[#d8f087] text-[#18181b]'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {badge.unlocked ? 'Відкрито ✓' : 'Заблоковано'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-white">{badge.name}</h4>
                  <p className="text-xs text-neutral-400 font-medium mt-1 leading-relaxed">{badge.description}</p>
                </div>

                {badge.unlocked && badge.unlockedAt && (
                  <div className="text-[10px] text-neutral-500 font-semibold border-t border-neutral-800 pt-2">
                    Отримано: {badge.unlockedAt}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'strains' && (
        <div className="space-y-4">
          <div className="bg-[#18191c] border border-neutral-800 rounded-3xl p-4 sm:p-5 text-xs font-medium text-neutral-300">
            Повний каталог сортів насіння (THC & CBD). Натисніть &quot;Додати у мій гроубокс&quot; для створення нової рослини з попередньо налаштованими параметрами.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MEDICAL_STRAINS.map((strain) => (
              <div
                key={strain.name}
                className="bg-[#18191c] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#d8f087]/60 transition-all text-white"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="bg-[#d8f087]/20 text-[#d8f087] border border-[#d8f087]/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                      {strain.type} • {strain.isAuto ? 'Автоквіт' : 'Фотоперіод'}
                    </span>

                    <span className="text-[10px] bg-[#fce182]/20 text-[#fce182] border border-[#fce182]/40 px-2.5 py-0.5 rounded-full font-black">
                      Складність: {strain.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white">{strain.name}</h3>
                  <p className="text-xs text-neutral-400 font-medium mt-1.5 leading-relaxed">{strain.description}</p>

                  {/* Medical Benefits Tags */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-neutral-400">Медичні властивості:</span>
                    {strain.medicalUses.map((use) => (
                      <span
                        key={use}
                        className="bg-[#121316] text-neutral-300 border border-neutral-800 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      >
                        {use}
                      </span>
                    ))}
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-800 text-center text-xs">
                    <div className="bg-[#121316] p-2.5 rounded-2xl border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 block font-bold">Вміст ТГК / CBD</span>
                      <strong className="text-[#fce182] font-black">
                        {strain.thc} {strain.cbd && !strain.cbd.includes('< 0.1') && !strain.cbd.includes('0.1%') ? `/ ${strain.cbd}` : ''}
                      </strong>
                    </div>

                    <div className="bg-[#121316] p-2.5 rounded-2xl border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 block font-bold">Цвітіння</span>
                      <strong className="text-[#d8f087] font-black">{strain.floweringWeeks} тижнів</strong>
                    </div>

                    <div className="bg-[#121316] p-2.5 rounded-2xl border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 block font-bold">Оптимальний pH</span>
                      <strong className="text-teal-400 font-black">{strain.optimalPH}</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onAddPlantFromStrain(strain)}
                  className="w-full bg-[#d8f087] hover:bg-[#c4e06d] text-[#18181b] font-black text-xs py-3 rounded-2xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Додати в мій гроубокс (+15 XP)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
