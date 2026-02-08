import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StudyMode, StudySession } from '../types';

interface StudyState {
  currentSession: StudySession | null;
  studyHistory: StudySession[];
  totalPointsEarned: number;
  
  // Actions
  startSession: (session: Omit<StudySession, 'id' | 'correct_answers' | 'wrong_answers' | 'points_earned' | 'started_at'>) => void;
  recordAnswer: (isCorrect: boolean) => void;
  completeSession: () => StudySession | null;
  cancelSession: () => void;
  getSessionStats: () => { totalSessions: number; averageScore: number; totalCards: number };
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      studyHistory: [],
      totalPointsEarned: 0,

      startSession: (sessionData) => {
        const session: StudySession = {
          id: crypto.randomUUID(),
          ...sessionData,
          correct_answers: 0,
          wrong_answers: 0,
          points_earned: 0,
          started_at: new Date().toISOString(),
        };
        set({ currentSession: session });
      },

      recordAnswer: (isCorrect) =>
        set((state) => {
          if (!state.currentSession) return state;
          
          const pointsForCorrect = getPointsForMode(state.currentSession.mode);
          
          return {
            currentSession: {
              ...state.currentSession,
              correct_answers: state.currentSession.correct_answers + (isCorrect ? 1 : 0),
              wrong_answers: state.currentSession.wrong_answers + (isCorrect ? 0 : 1),
              points_earned: state.currentSession.points_earned + (isCorrect ? pointsForCorrect : 0),
            },
          };
        }),

      completeSession: () => {
        const { currentSession } = get();
        if (!currentSession) return null;

        const completedSession: StudySession = {
          ...currentSession,
          completed_at: new Date().toISOString(),
        };

        set((state) => ({
          currentSession: null,
          studyHistory: [completedSession, ...state.studyHistory],
          totalPointsEarned: state.totalPointsEarned + completedSession.points_earned,
        }));

        return completedSession;
      },

      cancelSession: () => set({ currentSession: null }),

      getSessionStats: () => {
        const { studyHistory } = get();
        if (studyHistory.length === 0) {
          return { totalSessions: 0, averageScore: 0, totalCards: 0 };
        }

        const totalCards = studyHistory.reduce((sum, s) => sum + s.total_cards, 0);
        const totalCorrect = studyHistory.reduce((sum, s) => sum + s.correct_answers, 0);
        const averageScore = totalCards > 0 ? (totalCorrect / totalCards) * 100 : 0;

        return {
          totalSessions: studyHistory.length,
          averageScore: Math.round(averageScore),
          totalCards,
        };
      },
    }),
    {
      name: 'study-storage',
    }
  )
);

// Helper function to determine points based on study mode
function getPointsForMode(mode: StudyMode): number {
  switch (mode) {
    case 'flip':
      return 5;
    case 'multiple-choice':
      return 10;
    case 'typing':
      return 15;
    case 'reverse-typing':
      return 15;
    default:
      return 5;
  }
}
