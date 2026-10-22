'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Plant } from '@/lib/types';

interface RoomHeaderProps {
  sortedPlants: Plant[];
  activePlantId: string;
  onOpenAddPlant?: () => void;
  onOpenDeleteModal?: (plantId: string) => void;
}

export const RoomHeader: React.FC<RoomHeaderProps> = React.memo(({
  onOpenAddPlant,
}) => {
  if (!onOpenAddPlant) return null;

  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex items-stretch w-full">
        <button
          type="button"
          onClick={onOpenAddPlant}
          className="rounded-[24px] sm:rounded-[28px] px-4 py-2 w-full h-[54px] sm:h-[58px] flex items-center justify-center gap-1.5 cursor-pointer select-none bg-[#F86015] hover:bg-[#e0530f] active:bg-[#c94508] shadow-md transition-all duration-200 border-0 group"
        >
          <Plus className="w-4 h-4 stroke-[2.8] text-white shrink-0 transition-transform duration-300 group-hover:rotate-90" />
          <span className="text-[14px] sm:text-[15px] font-bold tracking-tight text-white leading-none">
            Додати рослину
          </span>
        </button>
      </div>
    </div>
  );
});

RoomHeader.displayName = 'RoomHeader';
