// User types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  points: number;
  level: number;
  streak_days: number;
  total_cards_learned: number;
  weekly_points: number;
}

// Flashcard types
export interface Flashcard {
  id: string;
  set_id: string;
  english: string;
  vietnamese: string;
  example_sentence?: string;
  pronunciation?: string;
  mastery_level: number; // 0-5, 0 = new, 5 = mastered
  times_reviewed: number;
  last_reviewed?: string;
  created_at: string;
}

export interface FlashcardSet {
  id: string;
  user_id: string;
  folder_id?: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  cards_count: number;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  color: string;
  sets_count: number;
  created_at: string;
}

// Study session types
export type StudyMode = 'flip' | 'multiple-choice' | 'typing' | 'reverse-typing';

export interface StudySession {
  id: string;
  user_id: string;
  set_ids: string[];
  mode: StudyMode;
  total_cards: number;
  correct_answers: number;
  wrong_answers: number;
  points_earned: number;
  started_at: string;
  completed_at?: string;
}

// Pomodoro types
export interface PomodoroSettings {
  work_duration: number; // in minutes
  short_break: number;
  long_break: number;
  sessions_until_long_break: number;
}

export interface PomodoroSession {
  id: string;
  user_id: string;
  type: 'work' | 'short_break' | 'long_break';
  duration: number;
  completed: boolean;
  created_at: string;
}

// Ranking types
export interface RankInfo {
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: string;
  badge: string;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url?: string;
  points: number;
  level: number;
  rank: number;
}

// Achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points_reward: number;
  requirement_type: string;
  requirement_value: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}
