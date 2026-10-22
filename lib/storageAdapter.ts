'use client';

import { Plant, UserDocData } from '@/lib/types';
import { safeFetchJson } from '@/lib/utils';

export const ADMIN_UID = 'BkUXSyh6XqW9AinMS5vlx7iTuov1';

export interface UserAdapter {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

const LOCAL_USER_KEY = 'floragrow_auth_user';
const LOCAL_PLANTS_KEY = 'floragrow_app_v2';
const LOCAL_USER_DATA_KEY = 'floragrow_user_data';

export function isCloudAvailable(): boolean {
  return true;
}

// ---------------- AUTH METHODS ---------------- //

export function subscribeAuth(callback: (user: UserAdapter | null) => void): () => void {
  if (typeof window === 'undefined') {
    callback(null);
    return () => {};
  }

  try {
    const savedLocal = localStorage.getItem(LOCAL_USER_KEY);
    if (savedLocal) {
      callback(JSON.parse(savedLocal));
    } else {
      const defaultUser: UserAdapter = {
        uid: 'local-demo-grower-id',
        email: 'grower@floragrow.local',
        displayName: 'Гровер FloraGrow',
        photoURL: undefined,
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(defaultUser));
      callback(defaultUser);
    }
  } catch (e) {
    callback(null);
  }

  return () => {};
}

export async function loginWithGoogle(): Promise<UserAdapter | null> {
  try {
    const data = await safeFetchJson<{ success?: boolean; user?: UserAdapter }>('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'google' }),
    });
    if (data?.success && data.user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(data.user));
      }
      return data.user;
    }
  } catch (e) {
    console.warn('Backend login error, fallback to local user:', e);
  }

  const mockUser: UserAdapter = {
    uid: 'local-demo-grower-id',
    email: 'grower@floragrow.local',
    displayName: 'Гровер FloraGrow',
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
  }
  return mockUser;
}

export async function loginWithEmail(email: string, pass: string): Promise<UserAdapter | null> {
  try {
    const data = await safeFetchJson<{ success?: boolean; user?: UserAdapter }>('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, pass }),
    });
    if (data?.success && data.user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(data.user));
      }
      return data.user;
    }
  } catch (e) {
    console.warn('Backend auth error:', e);
  }

  const user: UserAdapter = {
    uid: 'user-' + email.replace(/[^a-zA-Z0-9]/g, '_'),
    email: email,
    displayName: email.split('@')[0] || 'Гровер',
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  }
  return user;
}

export async function registerWithEmail(email: string, pass: string, name?: string): Promise<UserAdapter | null> {
  try {
    const data = await safeFetchJson<{ success?: boolean; user?: UserAdapter }>('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', email, pass, name }),
    });
    if (data?.success && data.user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(data.user));
      }
      return data.user;
    }
  } catch (e) {
    console.warn('Backend register error:', e);
  }

  const user: UserAdapter = {
    uid: 'user-' + email.replace(/[^a-zA-Z0-9]/g, '_'),
    email: email,
    displayName: name || email.split('@')[0] || 'Гровер',
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  }
  return user;
}

export async function logout(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_USER_KEY);
  }
}

// ---------------- USER DATA METHODS ---------------- //

export function subscribeUserData(userId: string, callback: (data: any) => void): () => void {
  if (typeof window === 'undefined') {
    callback(null);
    return () => {};
  }

  let isMounted = true;

  // Load from local storage first
  try {
    const savedData = localStorage.getItem(`${LOCAL_USER_DATA_KEY}_${userId}`) || localStorage.getItem(LOCAL_USER_DATA_KEY);
    if (savedData) {
      callback(JSON.parse(savedData));
    }
  } catch (e) {
    // ignore
  }

  // Fetch latest from backend API
  safeFetchJson<{ success?: boolean; userData?: any }>(`/api/users?userId=${encodeURIComponent(userId)}`)
    .then((data) => {
      if (isMounted && data?.success && data.userData) {
        callback(data.userData);
      }
    })
    .catch(() => {});

  return () => {
    isMounted = false;
  };
}

export async function saveUserData(userId: string, data: any): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${LOCAL_USER_DATA_KEY}_${userId}`, JSON.stringify(data));
      localStorage.setItem(LOCAL_USER_DATA_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage write error:', e);
    }
  }

  try {
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, data }),
    });
  } catch (e) {
    console.warn('saveUserData API error:', e);
  }
}

// ---------------- PLANTS METHODS ---------------- //

export function subscribeUserPlants(userId: string, callback: (plants: Plant[]) => void): () => void {
  if (typeof window === 'undefined') {
    callback([]);
    return () => {};
  }

  let isMounted = true;

  // Load local cache immediately
  try {
    const savedPlants = localStorage.getItem(LOCAL_PLANTS_KEY);
    if (savedPlants) {
      const parsed: Plant[] = JSON.parse(savedPlants);
      const cleaned = parsed.filter((p) => p.id !== 'plant-2');
      callback(cleaned);
    }
  } catch (e) {
    callback([]);
  }

  // Fetch live server plants
  safeFetchJson<{ success?: boolean; plants?: Plant[] }>(`/api/plants?userId=${encodeURIComponent(userId)}`)
    .then((data) => {
      if (isMounted && data?.success && Array.isArray(data.plants)) {
        const cleaned = data.plants.filter((p) => p.id !== 'plant-2');
        if (cleaned.length > 0) {
          callback(cleaned);
          try {
            localStorage.setItem(LOCAL_PLANTS_KEY, JSON.stringify(cleaned));
          } catch {
            // ignore
          }
        }
      }
    })
    .catch(() => {});

  return () => {
    isMounted = false;
  };
}

export async function savePlant(plant: Plant, userId: string): Promise<void> {
  // Save local cache
  if (typeof window !== 'undefined') {
    try {
      const savedPlantsRaw = localStorage.getItem(LOCAL_PLANTS_KEY);
      let plantsList: Plant[] = savedPlantsRaw ? JSON.parse(savedPlantsRaw) : [];
      const index = plantsList.findIndex((p) => p.id === plant.id);
      if (index >= 0) {
        plantsList[index] = { ...plant };
      } else {
        plantsList.push({ ...plant });
      }
      localStorage.setItem(LOCAL_PLANTS_KEY, JSON.stringify(plantsList));
    } catch (e) {
      console.warn('LocalStorage plant save error:', e);
    }
  }

  try {
    await fetch('/api/plants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, plant }),
    });
  } catch (e) {
    console.warn('savePlant API error:', e);
  }
}

export async function deletePlant(plantId: string, userId: string): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      const savedPlantsRaw = localStorage.getItem(LOCAL_PLANTS_KEY);
      if (savedPlantsRaw) {
        const plantsList: Plant[] = JSON.parse(savedPlantsRaw);
        const filtered = plantsList.filter((p) => p.id !== plantId);
        localStorage.setItem(LOCAL_PLANTS_KEY, JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn('LocalStorage plant delete error:', e);
    }
  }

  try {
    await fetch(`/api/plants?userId=${encodeURIComponent(userId)}&plantId=${encodeURIComponent(plantId)}`, {
      method: 'DELETE',
    });
  } catch (e) {
    console.warn('deletePlant API error:', e);
  }
}

// ---------------- ADMIN / COMMUNITY METHODS ---------------- //

export function subscribeAllUsers(callback: (users: UserDocData[]) => void): () => void {
  if (typeof window === 'undefined') {
    callback([]);
    return () => {};
  }

  let isMounted = true;

  safeFetchJson<{ success?: boolean; users?: any[] }>('/api/users?action=all')
    .then((data) => {
      if (isMounted && data?.success && Array.isArray(data.users)) {
        callback(data.users);
      }
    })
    .catch(() => {
      if (isMounted) {
        callback([
          {
            userId: ADMIN_UID,
            email: 'admin@floragrow.com',
            createdAt: '2026-01-01',
            updatedAt: new Date().toISOString(),
            points: 1250,
            level: 5,
            levelTitle: 'Майстер Гровер',
            streakDays: 14,
            totalQuestsCompleted: 42,
            accountType: 'admin',
            isSeller: false,
          },
          {
            userId: 'local-demo-grower-id',
            email: 'grower@floragrow.local',
            createdAt: '2026-08-01',
            updatedAt: new Date().toISOString(),
            points: 350,
            level: 2,
            levelTitle: 'Любитель',
            streakDays: 4,
            totalQuestsCompleted: 8,
            accountType: 'grower',
            isSeller: false,
          },
        ]);
      }
    });

  return () => {
    isMounted = false;
  };
}

export async function updateUserAccountType(userId: string, isSeller: boolean, accountType: string): Promise<void> {
  try {
    await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isSeller, accountType }),
    });
  } catch (e) {
    console.warn('updateUserAccountType API error:', e);
  }
}

export async function fetchUserPlants(userId: string): Promise<Plant[]> {
  try {
    const data = await safeFetchJson<{ success?: boolean; plants?: Plant[] }>(`/api/plants?userId=${encodeURIComponent(userId)}`);
    if (data?.success && Array.isArray(data.plants)) {
      return data.plants;
    }
  } catch {
    // fallback
  }

  if (typeof window !== 'undefined') {
    try {
      const savedPlantsRaw = localStorage.getItem(LOCAL_PLANTS_KEY);
      if (savedPlantsRaw) {
        return JSON.parse(savedPlantsRaw);
      }
    } catch (e) {
      // ignore
    }
  }
  return [];
}

// ---------------- FILE UPLOAD STORAGE ---------------- //

export async function uploadFile(file: File, _folder = 'uploads'): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success && data.url) {
      return data.url;
    }
  } catch (e) {
    console.warn('Backend file upload error, falling back to blob URL:', e);
  }

  return URL.createObjectURL(file);
}

// ---------------- OBJECT SERVICE EXPORTS ---------------- //

export const authService = {
  subscribeAuth,
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logout,
  isCloudAvailable,
};

export const dbService = {
  subscribeUserData,
  saveUserData,
  subscribeUserPlants,
  savePlant,
  deletePlant,
  subscribeAllUsers,
  updateUserAccountType,
  fetchUserPlants,
  uploadFile,
  isCloudAvailable,
};
