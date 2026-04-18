"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, UserProfile } from './db';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (username: string, password?: string) => Promise<boolean>;
  register: (userData: Omit<UserProfile, 'id' | 'onboarded'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = db.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password?: string) => {
    const foundUser = db.getUser(username);
    if (foundUser && (!password || foundUser.password === password)) {
      db.setCurrentUser(foundUser);
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<UserProfile, 'id' | 'onboarded'>) => {
    const existing = db.getUser(userData.username);
    if (existing) return false;

    const newUser: UserProfile = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      onboarded: false,
      academyData: {
        xp: 0,
        coursesCompleted: [],
        badgesEarned: [],
        currentStreak: 0,
        lastActiveDate: Date.now()
      }
    };

    db.saveUser(newUser);
    db.setCurrentUser(newUser);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    db.logout();
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    db.saveUser(updated);
    db.setCurrentUser(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
