'use client';

import React from 'react';
import { Plant } from '@/lib/types';
import { calculateVPD } from '@/lib/growData';

interface RoomClimateCardProps {
  roomPlant: Plant;
}

export const RoomClimateCard: React.FC<RoomClimateCardProps> = React.memo(({ roomPlant }) => {
  const roomVpdStatus = calculateVPD(roomPlant.currentTemp, roomPlant.currentHumidity, roomPlant.stage);

  return (
    <div className="w-full">
      {/* 3 Metrics Cards Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-[#1c1e24] p-3 rounded-2xl border border-neutral-800/80 text-center sm:text-left shadow-md">
          <span className="text-[10px] uppercase text-[#fad277] font-black block mb-0.5 truncate">
            Температура
          </span>
          <div className="text-xl sm:text-2xl font-black text-white">
            {roomPlant.currentTemp}°C
          </div>
          <span className="text-[9px] sm:text-[10px] text-neutral-400 font-medium block truncate">
            22-26°C
          </span>
        </div>

        <div className="bg-[#1c1e24] p-3 rounded-2xl border border-neutral-800/80 text-center sm:text-left shadow-md">
          <span className="text-[10px] uppercase text-[#67e8f9] font-black block mb-0.5 truncate">
            Вологість
          </span>
          <div className="text-xl sm:text-2xl font-black text-white">
            {roomPlant.currentHumidity}%
          </div>
          <span className="text-[9px] sm:text-[10px] text-neutral-400 font-medium block truncate">
            50-65%
          </span>
        </div>

        <div className="bg-[#1c1e24] p-3 rounded-2xl border border-neutral-800/80 text-center sm:text-left shadow-md">
          <span className="text-[10px] uppercase text-[#d8f087] font-black block mb-0.5 truncate">
            VPD Монітор
          </span>
          <div className="text-xl sm:text-2xl font-black text-white">
            {roomVpdStatus.vpd} <span className="text-xs font-bold text-[#d8f087]">kPa</span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-neutral-400 font-medium block truncate">
            {roomVpdStatus.statusLabelUk}
          </span>
        </div>
      </div>
    </div>
  );
});

RoomClimateCard.displayName = 'RoomClimateCard';
