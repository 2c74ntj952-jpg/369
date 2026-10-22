'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plant, UserStats, ReminderTask, Badge, HarvestTrophy } from '@/lib/types';
import { INITIAL_PLANTS, INITIAL_USER_STATS, INITIAL_TASKS, INITIAL_BADGES, getLevelInfo, StrainInfo } from '@/lib/growData';
import { Navbar } from '@/components/Navbar';
import { HomePage } from '@/components/HomePage';
import { PlantOverview } from '@/components/PlantOverview';
import { PredictionsAndReminders } from '@/components/PredictionsAndReminders';
import { PlantDoctor } from '@/components/PlantDoctor';
import { BadgesAndStrains } from '@/components/BadgesAndStrains';
import { AddPlantModal } from '@/components/AddPlantModal';
import { AuthModal } from '@/components/AuthModal';
import { AdminPanel, ADMIN_UID } from '@/components/AdminPanel';
import { CommunityView } from '@/components/CommunityView';
import { ManufacturersCatalog } from '@/components/ManufacturersCatalog';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, CheckCircle2, Flame, RefreshCw } from 'lucide-react';

import {
  UserAdapter as User,
  subscribeAuth,
  subscribeUserData,
  subscribeUserPlants,
  saveUserData,
  savePlant,
  deletePlant as deleteCloudPlant,
  loginWithGoogle,
  logout,
} from '@/lib/storageAdapter';

const STORAGE_KEY = 'floragrow_app_v2';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [plants, setPlants] = useState<Plant[]>(INITIAL_PLANTS);
  const [activePlantId, setActivePlantId] = useState<string>(INITIAL_PLANTS[0].id);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [tasks, setTasks] = useState<ReminderTask[]>(INITIAL_TASKS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals state
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedStrainForAdd, setSelectedStrainForAdd] = useState<StrainInfo | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Auth listener
  useEffect(() => {
    const unsubscribe = subscribeAuth((user) => {
      setCurrentUser(user);
      if (user) {
        showToast(`☁️ Увійшли в хмару як ${user.displayName || user.email}`);
        if (user.uid === ADMIN_UID) {
          setActiveTab('admin');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Realtime Sync when User is authenticated
  useEffect(() => {
    if (!currentUser) {
      setIsCloudSynced(false);
      return;
    }

    // Sync User Stats Doc
    const unsubUser = subscribeUserData(currentUser.uid, (cloudData) => {
      if (cloudData) {
        setUserStats((prev) => ({
          ...prev,
          ...cloudData,
          profile: {
            ...prev.profile,
            name: currentUser.displayName || prev.profile?.name || 'Гровер',
            avatarUrl: currentUser.photoURL || prev.profile?.avatarUrl,
            email: currentUser.email || prev.profile?.email,
          },
        }));
      } else {
        // Initialize doc if not present
        saveUserData(currentUser.uid, {
          ...INITIAL_USER_STATS,
          userId: currentUser.uid,
          email: currentUser.email || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          accountType: currentUser.uid === ADMIN_UID ? 'admin' : 'grower',
          isSeller: false,
          profile: {
            ...INITIAL_USER_STATS.profile,
            email: currentUser.email || '',
          },
        });
      }
      setIsCloudSynced(true);
    });

    // Sync User Plants
    const unsubPlants = subscribeUserPlants(currentUser.uid, (cloudPlants) => {
      if (cloudPlants && cloudPlants.length > 0) {
        const cleaned = cloudPlants.filter((p) => p.id !== 'plant-2');
        const finalPlants = cleaned.length > 0 ? cleaned : INITIAL_PLANTS;
        setPlants(finalPlants);
        setActivePlantId((prev) => (finalPlants.some((p) => p.id === prev) ? prev : finalPlants[0].id));
      }
    });

    return () => {
      unsubUser();
      unsubPlants();
    };
  }, [currentUser]);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.plants && Array.isArray(parsed.plants) && parsed.plants.length > 0) {
          const loadedPlants: Plant[] = parsed.parsedPlants || parsed.plants;
          const cleaned = loadedPlants.filter((p) => p.id !== 'plant-2');
          const finalPlants = cleaned.length > 0 ? cleaned : INITIAL_PLANTS;
          setPlants(finalPlants);
          if (parsed.activePlantId && finalPlants.some((p) => p.id === parsed.activePlantId)) {
            setActivePlantId(parsed.activePlantId);
          } else {
            setActivePlantId(finalPlants[0].id);
          }
        }
        if (parsed.userStats) {
          setUserStats({
            ...INITIAL_USER_STATS,
            ...parsed.userStats,
            badges: Array.isArray(parsed.userStats.badges) && parsed.userStats.badges.length > 0 ? parsed.userStats.badges : INITIAL_USER_STATS.badges,
            harvestTrophies: Array.isArray(parsed.userStats.harvestTrophies) ? parsed.userStats.harvestTrophies : INITIAL_USER_STATS.harvestTrophies,
            profile: {
              ...INITIAL_USER_STATS.profile,
              ...(parsed.userStats.profile || {}),
            },
          });
        }
        if (parsed.tasks && Array.isArray(parsed.tasks)) {
          setTasks(parsed.tasks);
        }
      }
    } catch (e) {
      console.error('LocalStorage load error:', e);
    } finally {
      setIsLoaded(true);
      setIsMounted(true);
    }
  }, []);

  // Persist to LocalStorage on state change (debounced to avoid blocking UI)
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            plants,
            activePlantId,
            userStats,
            tasks,
          })
        );
      } catch (e) {
        console.error('LocalStorage save error:', e);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [plants, activePlantId, userStats, tasks, isLoaded]);

  const activePlant = plants.find((p) => p.id === activePlantId) || plants[0] || INITIAL_PLANTS[0];

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      showToast('⚠️ Помилка авторизації');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Ви вийшли з акаунту');
    } catch (err) {
      showToast('⚠️ Помилка виходу');
    }
  };

  // Save Plant to Firestore if logged in
  const syncPlantToCloud = useCallback(async (plant: Plant) => {
    if (!currentUser) return;
    try {
      await savePlant(plant, currentUser.uid);
    } catch (err) {
      console.error('Error syncing plant to cloud:', err);
    }
  }, [currentUser]);

  // Save User Stats to Firestore if logged in
  const syncUserStatsToCloud = useCallback(async (stats: UserStats) => {
    if (!currentUser) return;
    try {
      await saveUserData(currentUser.uid, stats);
    } catch (err) {
      console.error('Error syncing user stats to cloud:', err);
    }
  }, [currentUser]);

  // Gamification helper: Award XP & check level up / badge unlocks
  const handleAwardXP = useCallback((xpPoints: number, reason: string) => {
    setUserStats((prev) => {
      const oldLevelInfo = getLevelInfo(prev.points);
      const newPoints = Math.max(0, prev.points + xpPoints);
      const newLevelInfo = getLevelInfo(newPoints);

      if (xpPoints < 0) {
        showToast(`🚨 ${xpPoints} XP (Штраф): ${reason}`);
      } else if (newLevelInfo.level > oldLevelInfo.level) {
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        } catch (e) {}
        showToast(`🎉 ВІТАЄМО! Новий рівень ${newLevelInfo.level}: "${newLevelInfo.title}"! (+${xpPoints} XP)`);
      } else {
        showToast(`✨ +${xpPoints} XP: ${reason}`);
      }

      const badgesToUpdate = prev.badges || INITIAL_USER_STATS.badges;
      const updatedBadges = badgesToUpdate.map((b) => {
        if (!b.unlocked) {
          if (b.id === 'badge-ai-graduate' && (prev.totalQuestsCompleted || 0) >= 5) {
            return { ...b, unlocked: true, unlockedAt: new Date().toISOString().split('T')[0] };
          }
          if (b.id === 'badge-ph-guru' && newPoints >= 500) {
            return { ...b, unlocked: true, unlockedAt: new Date().toISOString().split('T')[0] };
          }
        }
        return b;
      });

      const nextStats: UserStats = {
        ...prev,
        points: newPoints,
        level: newLevelInfo.level,
        levelTitle: newLevelInfo.title,
        badges: updatedBadges,
      };

      syncUserStatsToCloud(nextStats);
      return nextStats;
    });
  }, [syncUserStatsToCloud]);

  const handleUpdatePlant = useCallback((updated: Plant) => {
    setPlants((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    syncPlantToCloud(updated);
    showToast(`🌿 Дані рослини "${updated.name}" оновлено`);
  }, [syncPlantToCloud]);

  const handleCompleteTask = useCallback((taskId: string, xpReward: number) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t)));
    setUserStats((prev) => {
      const updated = { ...prev, totalQuestsCompleted: prev.totalQuestsCompleted + 1 };
      syncUserStatsToCloud(updated);
      return updated;
    });
    handleAwardXP(xpReward, 'Виконано нагадування в боксі');
  }, [syncUserStatsToCloud, handleAwardXP]);

  const handleAddTask = (newTask: ReminderTask) => {
    setTasks((prev) => [newTask, ...prev]);
    showToast(`⚡ Додано нове завдання: "${newTask.title}"`);
  };

  const handleAddPlant = (newPlant: Plant) => {
    setPlants((prev) => [...prev, newPlant]);
    setActivePlantId(newPlant.id);
    syncPlantToCloud(newPlant);
    handleAwardXP(15, `Створено нову рослину "${newPlant.name}"`);
  };

  const handleDeletePlant = (plantId: string) => {
    const targetPlant = plants.find((p) => p.id === plantId);
    const plantName = targetPlant ? targetPlant.name : 'рослину';

    if (plants.length <= 1) {
      showToast('⚠️ В кімнаті повинна залишатися хоча б одна рослина.');
      return;
    }

    const updated = plants.filter((p) => p.id !== plantId);
    setPlants(updated);
    setTasks((prevTasks) => prevTasks.filter((t) => t.plantId !== plantId));
    if (activePlantId === plantId && updated.length > 0) {
      setActivePlantId(updated[0].id);
    }
    if (currentUser) {
      deleteCloudPlant(plantId, currentUser.uid).catch((err) => console.error('Error deleting cloud plant:', err));
    }
    showToast(`🗑️ Рослину "${plantName}" видалено з Кімнати 1`);
  };

  const handleAddPlantFromStrain = (strain: StrainInfo) => {
    setSelectedStrainForAdd(strain);
    setIsAddPlantOpen(true);
  };

  const handleAwardHarvestTrophy = (trophy: HarvestTrophy) => {
    setUserStats((prev) => {
      const existing = prev.harvestTrophies || [];
      const updated = {
        ...prev,
        harvestTrophies: [trophy, ...existing],
      };
      syncUserStatsToCloud(updated);
      return updated;
    });
    handleAwardXP(100, `Отримано нагороду врожаю: ${trophy.trophyTitle}`);
  };

  const handleResetData = () => {
    if (confirm('Бажаєте скинути всі дані до початкових демо-налаштувань?')) {
      localStorage.removeItem(STORAGE_KEY);
      setPlants(INITIAL_PLANTS);
      setActivePlantId(INITIAL_PLANTS[0].id);
      setUserStats(INITIAL_USER_STATS);
      setTasks(INITIAL_TASKS);
      showToast('Дані успішно скинуто');
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#121316] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#d8f087] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-neutral-400 font-medium">Завантаження PROPAHANDA GROW...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121316] text-white flex flex-col font-sans selection:bg-[#d8f087] selection:text-[#18181b]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#d8f087] text-[#18181b] font-black text-xs sm:text-sm px-5 py-3.5 rounded-full shadow-2xl border border-[#d8f087] animate-bounce flex items-center gap-2">
          <Sparkles className="w-5 h-5 fill-[#18181b]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        userStats={userStats}
        plants={plants}
        activePlantId={activePlantId}
        onSelectPlant={(id) => setActivePlantId(id)}
        onOpenAddPlant={() => {
          setSelectedStrainForAdd(null);
          setIsAddPlantOpen(true);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        isCloudSynced={isCloudSynced}
        tasks={tasks}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 w-full max-w-full mx-auto px-0 sm:px-6 py-2 sm:py-6 space-y-3 sm:space-y-6">
        {/* Tab Admin: Admin Panel Dashboard */}
        {activeTab === 'admin' && (
          <AdminPanel
            currentUserId={currentUser?.uid || ''}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Tab 0: Home Page Dashboard & Account Profile */}
        {activeTab === 'home' && (
          <HomePage
            plants={plants}
            userStats={userStats}
            onUpdateUserStats={(updated) => {
              setUserStats(updated);
              syncUserStatsToCloud(updated);
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectPlant={(id) => setActivePlantId(id)}
            onQuickWater={(plantId) => {
              const p = plants.find((pl) => pl.id === plantId);
              if (p) {
                const todayStr = new Date().toISOString().split('T')[0];
                handleUpdatePlant({ ...p, lastWatered: todayStr });
                handleAwardXP(3, `Полив куща "${p.name}"`);
              }
            }}
            onAddPlantFromStrain={handleAddPlantFromStrain}
          />
        )}

        {/* Tab 1: Overview & Active Plant Dashboard (Кімната 1) */}
        {activeTab === 'overview' && (
          <PlantOverview
            plant={activePlant}
            plants={plants}
            activePlantId={activePlantId}
            onSelectPlant={(id) => setActivePlantId(id)}
            onOpenAddPlant={() => {
              setSelectedStrainForAdd(null);
              setIsAddPlantOpen(true);
            }}
            onDeletePlant={handleDeletePlant}
            onUpdatePlant={handleUpdatePlant}
            onOpenDoctorWithPlant={() => setActiveTab('doctor')}
            onOpenReminders={() => setActiveTab('reminders')}
            tasks={tasks}
            userStats={userStats}
            onCompleteTask={handleCompleteTask}
            onAddTask={handleAddTask}
            onAwardTrophy={handleAwardHarvestTrophy}
            onAwardXP={handleAwardXP}
            onNavigateToAccount={() => setActiveTab('home')}
          />
        )}

        {/* Tab 3: Predictions & AI Forecast */}
        {activeTab === 'reminders' && <PredictionsAndReminders plant={activePlant} />}

        {/* Tab 4: AI Doctor Plant Diagnosis */}
        {activeTab === 'doctor' && (
          <PlantDoctor
            plant={activePlant}
            onAddTask={handleAddTask}
            onAwardXP={handleAwardXP}
            onBackToOverview={() => setActiveTab('overview')}
          />
        )}

        {/* Tab 5: Badges & Strains Guide */}
        {activeTab === 'badges' && (
          <BadgesAndStrains
            userStats={userStats}
            onAddPlantFromStrain={handleAddPlantFromStrain}
          />
        )}

        {/* Tab 6: Community & Growers List */}
        {activeTab === 'community' && (
          <CommunityView currentUserId={currentUser?.uid} />
        )}

        {/* Tab 7: Manufacturers Catalog */}
        {activeTab === 'manufacturers' && (
          <ManufacturersCatalog />
        )}
      </main>

      {/* Footer (Variation 3 style) */}
      <footer className="mt-auto border-t border-[rgba(242,242,242,0.08)] bg-[#0c0c0e] py-4 px-4 sm:px-8 text-xs w-full">
        <div className="w-full max-w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="label-tech text-[rgba(242,242,242,0.5)] text-center sm:text-left">
            PROPAHANDA GROW v1.0 • Медичний Гроу-Помічник вдома
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={handleResetData}
              className="label-tech text-[rgba(242,242,242,0.5)] hover:text-[#fa6e59] transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Скинути демо-дані
            </button>
          </div>
        </div>
      </footer>

      {/* Add Plant Modal */}
      <AddPlantModal
        isOpen={isAddPlantOpen}
        onClose={() => setIsAddPlantOpen(false)}
        onAddPlant={handleAddPlant}
        initialStrain={selectedStrainForAdd}
      />

      {/* Cloud Auth & Storage Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSuccessToast={showToast}
      />
    </div>
  );
}
