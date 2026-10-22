'use client';

import React from 'react';
import { Plant, UserStats } from '@/lib/types';
import { StrainInfo } from '@/lib/growData';
import { UserProfile } from '@/components/UserProfile';

interface HomePageProps {
  plants: Plant[];
  userStats: UserStats;
  onNavigateTab: (tab: string) => void;
  onSelectPlant: (id: string) => void;
  onQuickWater: (plantId: string) => void;
  onUpdateUserStats?: (updated: UserStats) => void;
  onAddPlantFromStrain?: (strain: StrainInfo) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  plants,
  userStats,
  onNavigateTab,
  onSelectPlant,
  onUpdateUserStats,
  onAddPlantFromStrain
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* GrowDiaries Style Grower Cabinet (Дім) */}
      <UserProfile
        userStats={userStats}
        plants={plants}
        onUpdateUserStats={(updated) => {
          if (onUpdateUserStats) onUpdateUserStats(updated);
        }}
        onNavigateToPlant={(plantId) => {
          onSelectPlant(plantId);
          onNavigateTab('overview');
        }}
        onAddPlantFromStrain={onAddPlantFromStrain}
      />
    </div>
  );
};
