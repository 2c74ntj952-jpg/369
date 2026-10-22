'use client';

import React, { useState, useEffect } from 'react';
import { subscribeAllUsers, updateUserAccountType, fetchUserPlants } from '@/lib/storageAdapter';
import { UserDocData, Plant } from '@/lib/types';
import { ShieldCheck, Users, Store, Search, Calendar, Activity, Sprout, ChevronRight, X, User as UserIcon, CheckCircle2, Award, Mail, Sparkles, Filter, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminPanelProps {
  currentUserId: string;
  onNavigateTab: (tab: string) => void;
  onInspectUserPlants?: (userPlants: Plant[], targetUserName: string) => void;
}

export const ADMIN_UID = 'BkUXSyh6XqW9AinMS5vlx7iTuov1';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUserId,
  onNavigateTab,
  onInspectUserPlants,
}) => {
  const [usersList, setUsersList] = useState<UserDocData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sellers' | 'growers'>('all');
  const [selectedUser, setSelectedUser] = useState<UserDocData | null>(null);
  const [selectedUserPlants, setSelectedUserPlants] = useState<Plant[]>([]);
  const [isLoadingPlants, setIsLoadingPlants] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const isAdmin = currentUserId === ADMIN_UID;

  // Realtime subscription to users collection
  useEffect(() => {
    setIsLoading(true);
    const unsub = subscribeAllUsers((users) => {
      setUsersList(users);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  // Fetch plants when inspecting a selected user
  useEffect(() => {
    if (!selectedUser) {
      setSelectedUserPlants([]);
      return;
    }

    setIsLoadingPlants(true);
    fetchUserPlants(selectedUser.userId)
      .then((pList) => setSelectedUserPlants(pList))
      .catch((err) => console.error('Error fetching user plants:', err))
      .finally(() => setIsLoadingPlants(false));
  }, [selectedUser]);

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleToggleSellerStatus = async (userDoc: UserDocData) => {
    if (!isAdmin) return;
    const newStatus = !userDoc.isSeller;
    const newType = newStatus ? 'seller' : 'grower';
    try {
      await updateUserAccountType(userDoc.userId, newStatus, newType);
      showToast(`Статус акаунту користувача ${userDoc.email} змінено на: ${newStatus ? '🛍️ Продавець' : '🌿 Гровер'}`);
      if (selectedUser?.userId === userDoc.userId) {
        setSelectedUser((prev) => prev ? { ...prev, isSeller: newStatus, accountType: newType } : null);
      }
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.profile?.name && u.profile.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.userId.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'sellers') return u.isSeller || u.accountType === 'seller';
    if (filterType === 'growers') return !u.isSeller && u.accountType !== 'admin';
    return true;
  });

  const sellersCount = usersList.filter((u) => u.isSeller || u.accountType === 'seller').length;
  const growersCount = usersList.filter((u) => !u.isSeller && u.accountType !== 'admin').length;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Невідомо';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('uk-UA', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {actionMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#d8f087] text-[#18181b] font-black text-xs px-5 py-3 rounded-full shadow-2xl border border-[#d8f087] flex items-center gap-2">
          <Sparkles className="w-4 h-4 fill-[#18181b]" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-[#1c1e24] via-[#24262d] to-[#1c1e24] border border-neutral-700/80 rounded-[28px] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-[#d8f087] rounded-2xl flex items-center justify-center text-[#18181b] shadow-lg shrink-0">
              <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">Панель Адміністратора</h2>
                {/* Visual Administrator Indicator Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#d8f087] text-[#18181b] shadow-sm uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[3]" />
                  Адміністратор
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">
                Повний доступ до бази користувачів Firestore та аналітики акаунтів продавців
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('overview')}
            className="px-4 py-2 bg-[#2c2e35] hover:bg-[#353842] text-white text-xs font-bold rounded-full transition-colors cursor-pointer border border-neutral-700 flex items-center gap-2"
          >
            <span>Перейти в Кімнату 1</span>
            <ChevronRight className="w-4 h-4 text-[#d8f087]" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-[#141518]/90 border border-neutral-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-400">Всього користувачів</div>
              <div className="text-lg font-black text-white">{usersList.length}</div>
            </div>
          </div>

          <div className="bg-[#141518]/90 border border-neutral-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#fad277]/20 text-[#fad277] flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-400">Акаунти Продавців</div>
              <div className="text-lg font-black text-[#fad277]">{sellersCount}</div>
            </div>
          </div>

          <div className="bg-[#141518]/90 border border-neutral-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d8f087]/20 text-[#d8f087] flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-400">Акаунти Гроверів</div>
              <div className="text-lg font-black text-[#d8f087]">{growersCount}</div>
            </div>
          </div>

          <div className="bg-[#141518]/90 border border-neutral-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-400">Активні в базі</div>
              <div className="text-lg font-black text-purple-300">{usersList.filter(u => u.updatedAt).length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1c1e24] p-4 rounded-[24px] border border-neutral-800">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Пошук за поштою, іменем або ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#141518] text-white text-xs font-medium border border-neutral-700/80 rounded-2xl focus:outline-none focus:border-[#d8f087]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-[#141518] p-1.5 rounded-2xl border border-neutral-800">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#d8f087] text-[#18181b]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Усі ({usersList.length})
          </button>
          <button
            onClick={() => setFilterType('sellers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'sellers'
                ? 'bg-[#fad277] text-[#18181b]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Продавці ({sellersCount})
          </button>
          <button
            onClick={() => setFilterType('growers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'growers'
                ? 'bg-[#d8f087] text-[#18181b]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            Гровери ({growersCount})
          </button>
        </div>
      </div>

      {/* Users List Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-neutral-400 bg-[#1c1e24] rounded-[28px] border border-neutral-800 space-y-3">
          <div className="w-8 h-8 border-2 border-[#d8f087] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold">Завантаження баз користувачів з Firestore...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center text-neutral-400 bg-[#1c1e24] rounded-[28px] border border-neutral-800">
          <Users className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
          <p className="text-sm font-bold text-white">Користувачів не знайдено</p>
          <p className="text-xs mt-1">Спробуйте змінити критерії пошуку або фільтрування</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            const isSeller = user.isSeller || user.accountType === 'seller';
            const isAdminUser = user.userId === ADMIN_UID;

            return (
              <motion.div
                key={user.userId}
                whileHover={{ y: -2 }}
                className={`bg-[#1c1e24] border rounded-[24px] p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all ${
                  isAdminUser
                    ? 'border-[#d8f087]/60 bg-gradient-to-b from-[#1c1e24] to-[#252830]'
                    : isSeller
                    ? 'border-[#fad277]/50'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* User Card Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isAdminUser
                          ? 'bg-[#d8f087] text-[#18181b]'
                          : isSeller
                          ? 'bg-[#fad277] text-[#18181b]'
                          : 'bg-[#2c2e35] text-white border border-neutral-700'
                      }`}>
                        {user.profile?.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          user.profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-white truncate flex items-center gap-1.5">
                          <span>{user.profile?.name || user.email?.split('@')[0] || 'Користувач'}</span>
                        </h4>
                        <div className="text-xs text-neutral-400 font-mono truncate flex items-center gap-1">
                          <Mail className="w-3 h-3 text-neutral-500 shrink-0" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Badge */}
                    {isAdminUser ? (
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#d8f087] text-[#18181b] shrink-0">
                        Адмін
                      </span>
                    ) : isSeller ? (
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

                  {/* Metadata fields */}
                  <div className="bg-[#141518] rounded-xl p-3 space-y-2 text-xs border border-neutral-800">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        Дата реєстрації:
                      </span>
                      <span className="font-bold text-white">{formatDate(user.createdAt)}</span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-neutral-500" />
                        Активність в додатоку:
                      </span>
                      <span className="font-bold text-[#d8f087]">{formatDate(user.updatedAt)}</span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-neutral-500" />
                        Рівень &amp; XP:
                      </span>
                      <span className="font-bold text-[#fad277]">
                        Рівень {user.level} • {user.points} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="flex-1 py-2 bg-[#2c2e35] hover:bg-[#383b45] text-white text-xs font-black rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-neutral-700"
                  >
                    <span>Переглянути акаунт</span>
                    <ChevronRight className="w-4 h-4 text-[#d8f087]" />
                  </button>

                  {isAdmin && !isAdminUser && (
                    <button
                      onClick={() => handleToggleSellerStatus(user)}
                      title={isSeller ? 'Зробити гровером' : 'Зробити продавцем'}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSeller
                          ? 'bg-[#fad277]/20 border-[#fad277]/40 text-[#fad277] hover:bg-[#fad277]/30'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex flex-col justify-start sm:justify-center items-stretch bg-black/95 backdrop-blur-md p-0 sm:p-2 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-[#18191c] rounded-none sm:rounded-[28px] w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] overflow-y-auto shadow-2xl border-0 sm:border border-neutral-800 text-white"
            >
              {/* Modal Header */}
              <div className="bg-[#22242a] px-6 py-4 flex items-center justify-between border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#d8f087] text-[#18181b] flex items-center justify-center font-black">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white">
                      Детальний перегляд акаунту
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono">{selectedUser.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-8 h-8 rounded-full bg-[#2c2e35] hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                {/* Account Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#22242a] p-4 rounded-2xl border border-neutral-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      📧 Електронна пошта
                    </span>
                    <span className="text-sm font-black text-white font-mono break-all">{selectedUser.email}</span>
                  </div>

                  <div className="bg-[#22242a] p-4 rounded-2xl border border-neutral-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      🆔 UID користувача Firestore
                    </span>
                    <span className="text-xs font-mono text-neutral-300 break-all">{selectedUser.userId}</span>
                  </div>

                  <div className="bg-[#22242a] p-4 rounded-2xl border border-neutral-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      📅 Дата створення облікового запису
                    </span>
                    <span className="text-sm font-bold text-[#d8f087]">
                      {formatDate(selectedUser.createdAt)}
                    </span>
                  </div>

                  <div className="bg-[#22242a] p-4 rounded-2xl border border-neutral-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      ⚡ Останнє оновлення / Активність
                    </span>
                    <span className="text-sm font-bold text-[#fad277]">
                      {formatDate(selectedUser.updatedAt)}
                    </span>
                  </div>
                </div>

                {/* Seller Status Controls */}
                <div className="bg-[#22242a] p-4 rounded-2xl border border-neutral-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Store className={`w-6 h-6 ${selectedUser.isSeller ? 'text-[#fad277]' : 'text-neutral-500'}`} />
                    <div>
                      <h4 className="text-xs font-black text-white">Статус акаунту продавця</h4>
                      <p className="text-[11px] text-neutral-400">
                        {selectedUser.isSeller
                          ? 'Цей користувач зареєстрований як акаунт Продавця'
                          : 'Звичайний акаунт гровера'}
                      </p>
                    </div>
                  </div>

                  {isAdmin && selectedUser.userId !== ADMIN_UID && (
                    <button
                      onClick={() => handleToggleSellerStatus(selectedUser)}
                      className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                        selectedUser.isSeller
                          ? 'bg-[#fad277] text-[#18181b] hover:bg-[#f3c55d]'
                          : 'bg-[#2c2e35] text-white hover:bg-neutral-700 border border-neutral-700'
                      }`}
                    >
                      {selectedUser.isSeller ? 'Скасувати статус Продавця' : 'Надати статус Продавця'}
                    </button>
                  )}
                </div>

                {/* Plants section for inspected user */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-[#d8f087]" />
                      Рослини користувача в Кімнаті ({selectedUserPlants.length})
                    </h4>
                  </div>

                  {isLoadingPlants ? (
                    <div className="p-6 text-center text-xs text-neutral-400 bg-[#22242a] rounded-2xl">
                      Завантаження рослин...
                    </div>
                  ) : selectedUserPlants.length === 0 ? (
                    <div className="p-6 text-center text-xs text-neutral-400 bg-[#22242a] rounded-2xl border border-neutral-800">
                      У цього користувача ще немає рослин в базі даних.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedUserPlants.map((plant) => (
                        <div
                          key={plant.id}
                          className="bg-[#22242a] p-3.5 rounded-2xl border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-black text-white">{plant.name}</span>
                            <span className="text-neutral-400 ml-2">({plant.strain})</span>
                            <div className="text-[11px] text-[#d8f087] mt-0.5">
                              Фаза: {plant.stage} • День {plant.stageDay}
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-[#18191c] text-neutral-300 font-mono text-[11px] border border-neutral-800">
                            {plant.medium}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-[#22242a] px-6 py-4 border-t border-neutral-800 flex justify-end">
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
