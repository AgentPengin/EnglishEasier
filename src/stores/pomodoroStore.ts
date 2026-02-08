import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PomodoroSettings } from '../types';

interface PomodoroState {
  settings: PomodoroSettings;
  isRunning: boolean;
  isPaused: boolean;
  currentPhase: 'work' | 'short_break' | 'long_break';
  timeRemaining: number; // in seconds
  completedSessions: number;
  totalWorkTime: number; // in minutes
  
  // Actions
  updateSettings: (settings: Partial<PomodoroSettings>) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  completePhase: () => void;
  skipPhase: () => void;
}

const defaultSettings: PomodoroSettings = {
  work_duration: 25,
  short_break: 5,
  long_break: 15,
  sessions_until_long_break: 4,
};

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isRunning: false,
      isPaused: false,
      currentPhase: 'work',
      timeRemaining: defaultSettings.work_duration * 60,
      completedSessions: 0,
      totalWorkTime: 0,

      updateSettings: (newSettings) =>
        set((state) => {
          const settings = { ...state.settings, ...newSettings };
          return {
            settings,
            timeRemaining: state.currentPhase === 'work' 
              ? settings.work_duration * 60 
              : state.currentPhase === 'short_break'
              ? settings.short_break * 60
              : settings.long_break * 60,
          };
        }),

      startTimer: () => set({ isRunning: true, isPaused: false }),
      
      pauseTimer: () => set({ isPaused: true }),
      
      resumeTimer: () => set({ isPaused: false }),
      
      resetTimer: () => {
        const { settings, currentPhase } = get();
        const time = currentPhase === 'work' 
          ? settings.work_duration 
          : currentPhase === 'short_break' 
          ? settings.short_break 
          : settings.long_break;
        set({ timeRemaining: time * 60, isRunning: false, isPaused: false });
      },

      tick: () =>
        set((state) => {
          if (!state.isRunning || state.isPaused || state.timeRemaining <= 0) {
            return state;
          }
          return { timeRemaining: state.timeRemaining - 1 };
        }),

      completePhase: () =>
        set((state) => {
          const { settings, currentPhase, completedSessions } = state;
          
          if (currentPhase === 'work') {
            const newCompletedSessions = completedSessions + 1;
            const isLongBreak = newCompletedSessions % settings.sessions_until_long_break === 0;
            const nextPhase = isLongBreak ? 'long_break' : 'short_break';
            const nextTime = isLongBreak ? settings.long_break : settings.short_break;
            
            return {
              currentPhase: nextPhase,
              timeRemaining: nextTime * 60,
              completedSessions: newCompletedSessions,
              totalWorkTime: state.totalWorkTime + settings.work_duration,
              isRunning: false,
            };
          } else {
            return {
              currentPhase: 'work',
              timeRemaining: settings.work_duration * 60,
              isRunning: false,
            };
          }
        }),

      skipPhase: () => {
        const { settings, currentPhase, completedSessions } = get();
        
        if (currentPhase === 'work') {
          const isLongBreak = (completedSessions + 1) % settings.sessions_until_long_break === 0;
          const nextPhase = isLongBreak ? 'long_break' : 'short_break';
          const nextTime = isLongBreak ? settings.long_break : settings.short_break;
          
          set({
            currentPhase: nextPhase,
            timeRemaining: nextTime * 60,
            completedSessions: completedSessions + 1,
            isRunning: false,
            isPaused: false,
          });
        } else {
          set({
            currentPhase: 'work',
            timeRemaining: settings.work_duration * 60,
            isRunning: false,
            isPaused: false,
          });
        }
      },
    }),
    {
      name: 'pomodoro-storage',
      partialize: (state) => ({
        settings: state.settings,
        completedSessions: state.completedSessions,
        totalWorkTime: state.totalWorkTime,
      }),
    }
  )
);
