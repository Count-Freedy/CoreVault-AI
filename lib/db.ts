/**
 * CoreVault Database Utility (Local Persistence)
 * Designed for seamless transition to MongoDB Compass later.
 */

export interface UserProfile {
  id: string;
  name: string;
  contact: string;
  email: string;
  username: string;
  password?: string;
  avatar?: string; // Base64 image
  onboarded: boolean;
  onboardingData?: {
    age: string;
    occupation: string;
    income: string;
    expenses: string;
    riskAppetite: string;
    sectors: string[];
    lifeGoals: string;
    investmentMindset: string;
    knowledgeLevel: string; // New field
    investmentHorizon: string; // New field
    savingsTarget: string;
  };
  investorId?: string;
  qrCode?: string;
  academyData?: {
    xp: number;
    coursesCompleted: string[];
    badgesEarned: string[];
    currentStreak: number;
    lastActiveDate: number;
  };
  walletBalance: number;
  walletHistory: {
    type: 'deposit' | 'withdrawal';
    amount: number;
    note: string;
    timestamp: number;
  }[];
  holdings: {
    symbol: string;
    name: string;
    qty: number;
    avgPrice: number;
    type: 'stock' | 'crypto' | 'mf' | 'sip' | 'bond';
  }[];
  watchlists: {
    id: string;
    name: string;
    symbols: string[];
  }[];
  tradeHistory: {
    symbol: string;
    qty: number;
    price: number;
    type: 'buy' | 'sell';
    timestamp: number;
  }[];
}

const STORAGE_KEY = 'corevault_users';
const CURRENT_USER_KEY = 'corevault_current_session';

export const db = {
  // --- User Management ---
  
  getUsers: (): UserProfile[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: UserProfile) => {
    const users = db.getUsers();
    const existingIndex = users.findIndex(u => u.username === user.username);
    
    if (existingIndex > -1) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  },

  getUser: (username: string): UserProfile | undefined => {
    return db.getUsers().find(u => u.username === username);
  },

  // --- Session Management ---

  setCurrentUser: (user: UserProfile | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  getCurrentUser: (): UserProfile | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
