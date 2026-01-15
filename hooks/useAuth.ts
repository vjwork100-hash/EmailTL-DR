
import { useState, useCallback } from 'react';
import { User } from '../types';
import { STORAGE_KEYS } from '../constants';
import { trackEvent, ANALYTICS_EVENTS } from '../analytics';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((email: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      subscription_tier: 'free',
      summaries_used: Number(localStorage.getItem(STORAGE_KEYS.ANON_COUNT) || 0)
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    trackEvent(ANALYTICS_EVENTS.LOGIN_VIEWED, { email });
  }, []);

  const signup = useCallback((email: string) => {
    login(email);
    trackEvent(ANALYTICS_EVENTS.SIGNUP_COMPLETED, { email });
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }, []);

  const upgrade = useCallback(() => {
    if (user) {
      const updatedUser: User = { ...user, subscription_tier: 'pro' };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }
  }, [user]);

  const incrementUsage = useCallback(() => {
    if (user) {
      const updatedUser = { ...user, summaries_used: user.summaries_used + 1 };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    } else {
      const current = Number(localStorage.getItem(STORAGE_KEYS.ANON_COUNT) || 0);
      localStorage.setItem(STORAGE_KEYS.ANON_COUNT, (current + 1).toString());
    }
  }, [user]);

  return { user, login, signup, logout, upgrade, incrementUsage, isAuthenticated: !!user };
};
