'use client';

import React, { useState, useEffect } from 'react';
import { subscribeAllUsers, fetchUserPlants } from '@/lib/storageAdapter';
import { UserDocData, Plant } from '@/lib/types';
import { Users, Sprout, Store, Award, ChevronRight, X, User as UserIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommunityViewProps {
  currentUserId?: string | null;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ currentUserId }) => {
  const [usersList, setUsersList] = useState<UserDocData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDocData | null>(null);
  const [selectedUserPlants, setSelectedUserPlants] = useState<Plant[]>([]);
  const [isLoadingPlants, setIsLoadingPlants] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const unsub = subscribeAllUsers((users) => {
      setUsersList(users);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      setSelectedUserPlants([]);
      return;
    }
    setIsLoadingPlants(true);
    fetchUserPlants(selectedUser.userId)
      .then((pList) => setSelectedUserPlants(pList))
      .catch((err) => console.error('Error fetching plants:', err))
      .finally(() => setIsLoadingPlants(false));
  }, [selectedUser]);

  return (
    <div className="space-y-6">
      <div className="bg-[#1c1e24] border border-neutral-800 rounded-[28px] p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#d8f087] text-[#18181b] rounded-2xl flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Спільнота Гроверів PROPAHANDA</h2>
            <p className="text-xs text-neutral-400 font-medium">
              Переглядайте публічні профілі інших гроверів та їхні досягнення
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-neutral-400 bg-[#1c1e24] rounded-[28px] border border-neutral-800 space-y-3">
          <div className="w-8 h-8 border-2 border-[#d8f087] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold">Завантаження спільноти...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usersList.map((u) => {
            const isSelf = currentUserId === u.userId;
            const isSeller = u.isSeller || u.accountType === 'seller';

            return (
              <div
                key={u.userId}
                className="bg-[#1c1e24] border border-neutral-800 rounded-[24px] p-5 shadow-lg flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#2c2e35] text-white flex items-center justify-center font-black text-sm border border-neutral-700">
                      {u.profile?.name?.[0]?.toUpperCase() || 'G'}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <span>{u.profile?.name || `Гровер #${u.userId.substring(0, 5)}`}</span>
                        {isSelf && <span className="text-[10px] text-[#d8f087] font-bold">(Ви)</span>}
                      </h4>
                      <div className="text-xs text-[#fad277] font-bold">
                        Рівень {u.level}: {u.levelTitle}
                      </div>
                    </div>
                  </div>

                  {isSeller ? (
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#fad277] text-[#18181b] shrink-0 flex items-center gap-1">
                      <Store className="w-3 h-3" />
                      Продавець
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#2c2e35] text-neutral-300 border border-neutral-700 shrink-0">
                      Гровер
                    </span>
                  )}
                </div>

                <div className="bg-[#141518] rounded-xl p-3 text-xs space-y-1.5 border border-neutral-800">
                  <div className="flex justify-between text-neutral-400">
                    <span>XP Досягнення:</span>
                    <span className="font-bold text-[#d8f087]">{u.points} XP</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Серія входу:</span>
                    <span className="font-bold text-white">{u.streakDays} дн.</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUser(u)}
                  className="w-full py-2 bg-[#2c2e35] hover:bg-[#383b45] text-white text-xs font-black rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 border border-neutral-700"
                >
                  <span>Переглянути профіль</span>
                  <ChevronRight className="w-4 h-4 text-[#d8f087]" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* User Profile View Drawer/Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex flex-col justify-start sm:justify-center items-stretch bg-black/95 backdrop-blur-md p-0 sm:p-2 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-[#18191c] rounded-none sm:rounded-[28px] w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] overflow-y-auto shadow-2xl border-0 sm:border border-neutral-800 text-white p-3 sm:p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#d8f087] text-[#18181b] flex items-center justify-center font-black">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white">
                      {selectedUser.profile?.name || `Гровер #${selectedUser.userId.substring(0, 5)}`}
                    </h3>
                    <p className="text-xs text-[#fad277] font-bold">
                      Рівень {selectedUser.level} • {selectedUser.levelTitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-8 h-8 rounded-full bg-[#2c2e35] hover:bg-neutral-700 text-neutral-300 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#22242a] p-4 rounded-2xl border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Загальний досвід XP:</span>
                    <span className="font-black text-[#d8f087] text-sm">{selectedUser.points} XP</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Виконано квестів:</span>
                    <span className="font-bold text-white">{selectedUser.totalQuestsCompleted}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-[#d8f087]" />
                    Публічні Рослини ({selectedUserPlants.length})
                  </h4>

                  {isLoadingPlants ? (
                    <div className="p-4 text-center text-xs text-neutral-400 bg-[#22242a] rounded-2xl">
                      Завантаження...
                    </div>
                  ) : selectedUserPlants.length === 0 ? (
                    <div className="p-4 text-center text-xs text-neutral-400 bg-[#22242a] rounded-2xl border border-neutral-800">
                      Немає відкритих рослин.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedUserPlants.map((plant) => (
                        <div
                          key={plant.id}
                          className="bg-[#22242a] p-3.5 rounded-2xl border border-neutral-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-black text-white">{plant.name}</span>
                            <span className="text-neutral-400 ml-2">({plant.strain})</span>
                          </div>
                          <span className="text-[#d8f087] font-bold">Фаза: {plant.stage}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-6 py-2.5 bg-[#d8f087] text-[#18181b] font-black text-xs rounded-full cursor-pointer hover:bg-[#cbe385]"
                >
                  Закрити
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
