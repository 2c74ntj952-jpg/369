import fs from 'fs';
import path from 'path';
import { Plant, UserDocData, UserStats } from '@/lib/types';

const DB_FILE_PATH = path.join(process.cwd(), '.data_store.json');

export interface AppServerDatabase {
  users: Record<string, UserDocData>;
  plants: Record<string, Plant[]>; // userId -> Plant[]
  userStats: Record<string, UserStats>;
  userProfiles: Record<string, any>;
}

const DEFAULT_ADMIN_USER: UserDocData = {
  userId: 'BkUXSyh6XqW9AinMS5vlx7iTuov1',
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
};

const DEFAULT_DEMO_USER: UserDocData = {
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
};

function readDatabase(): AppServerDatabase {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading server DB file, using initial memory state:', err);
  }

  const initialDb: AppServerDatabase = {
    users: {
      [DEFAULT_ADMIN_USER.userId]: DEFAULT_ADMIN_USER,
      [DEFAULT_DEMO_USER.userId]: DEFAULT_DEMO_USER,
    },
    plants: {},
    userStats: {},
    userProfiles: {},
  };

  writeDatabase(initialDb);
  return initialDb;
}

function writeDatabase(db: AppServerDatabase): void {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing server DB file:', err);
  }
}

// ---------------- USER OPERATIONS ---------------- //

export function getServerUser(userId: string): UserDocData | null {
  const db = readDatabase();
  return db.users[userId] || null;
}

export function getAllServerUsers(): UserDocData[] {
  const db = readDatabase();
  return Object.values(db.users);
}

export function saveServerUser(userId: string, userData: Partial<UserDocData>): UserDocData {
  const db = readDatabase();
  const existing = db.users[userId] || {
    userId,
    email: userData.email || 'grower@floragrow.local',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    points: 0,
    level: 1,
    levelTitle: 'Новачок',
    streakDays: 1,
    totalQuestsCompleted: 0,
    accountType: 'grower',
    isSeller: false,
  };

  const updated: UserDocData = {
    ...existing,
    ...userData,
    updatedAt: new Date().toISOString(),
  };

  db.users[userId] = updated;
  writeDatabase(db);
  return updated;
}

export function saveServerUserData(userId: string, data: any): void {
  const db = readDatabase();
  if (data.stats) db.userStats[userId] = data.stats;
  if (data.profile) db.userProfiles[userId] = data.profile;
  
  const existingUser = db.users[userId];
  if (existingUser) {
    existingUser.updatedAt = new Date().toISOString();
    if (data.points !== undefined) existingUser.points = data.points;
    if (data.level !== undefined) existingUser.level = data.level;
    if (data.levelTitle) existingUser.levelTitle = data.levelTitle;
    if (data.streakDays !== undefined) existingUser.streakDays = data.streakDays;
    if (data.totalQuestsCompleted !== undefined) existingUser.totalQuestsCompleted = data.totalQuestsCompleted;
  }
  writeDatabase(db);
}

export function getServerUserData(userId: string): any {
  const db = readDatabase();
  const user = db.users[userId] || null;
  const stats = db.userStats[userId] || null;
  const profile = db.userProfiles[userId] || null;
  return { user, stats, profile };
}

// ---------------- PLANT OPERATIONS ---------------- //

export function getServerUserPlants(userId: string): Plant[] {
  const db = readDatabase();
  return db.plants[userId] || [];
}

export function saveServerPlant(userId: string, plant: Plant): Plant[] {
  const db = readDatabase();
  const userPlants = db.plants[userId] || [];
  const idx = userPlants.findIndex((p) => p.id === plant.id);

  if (idx >= 0) {
    userPlants[idx] = plant;
  } else {
    userPlants.push(plant);
  }

  db.plants[userId] = userPlants;
  writeDatabase(db);
  return userPlants;
}

export function deleteServerPlant(userId: string, plantId: string): Plant[] {
  const db = readDatabase();
  const userPlants = db.plants[userId] || [];
  const filtered = userPlants.filter((p) => p.id !== plantId);

  db.plants[userId] = filtered;
  writeDatabase(db);
  return filtered;
}
