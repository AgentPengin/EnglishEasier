import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  updateUserPoints: (points: number) => void;
  updateWeeklyPoints: (points: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUserPoints: (points) =>
        set((state) => ({
          user: state.user ? { ...state.user, points: state.user.points + points } : null,
        })),
      updateWeeklyPoints: (points) =>
        set((state) => ({
          user: state.user ? { ...state.user, weekly_points: state.user.weekly_points + points } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
