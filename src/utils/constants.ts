import type { RankInfo } from '../types';

export const RANKS: RankInfo[] = [
  { name: 'Người mới', minPoints: 0, maxPoints: 99, color: '#9CA3AF', icon: '🌱', badge: 'badge-bronze' },
  { name: 'Học viên', minPoints: 100, maxPoints: 499, color: '#CD7F32', icon: '📚', badge: 'badge-bronze' },
  { name: 'Trung cấp', minPoints: 500, maxPoints: 1499, color: '#C0C0C0', icon: '⭐', badge: 'badge-silver' },
  { name: 'Thành thạo', minPoints: 1500, maxPoints: 3999, color: '#FFD700', icon: '🏆', badge: 'badge-gold' },
  { name: 'Chuyên gia', minPoints: 4000, maxPoints: 9999, color: '#E5E4E2', icon: '💎', badge: 'badge-platinum' },
  { name: 'Bậc thầy', minPoints: 10000, maxPoints: Infinity, color: '#B9F2FF', icon: '👑', badge: 'badge-diamond' },
];

export const SET_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E',
];

export const SET_ICONS = [
  '📚', '📖', '📝', '✏️', '🎯', '🎨', '🎭', '🎬',
  '🎵', '🎸', '⚽', '🏀', '🎮', '🚀', '💼', '🏠',
  '🌍', '🍕', '🚗', '✈️', '🏥', '🎓', '💻', '📱',
];

export const FOLDER_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#F97316',
  '#22C55E', '#06B6D4', '#6366F1',
];

export const ACHIEVEMENTS = [
  { id: '1', name: 'Bắt đầu hành trình', description: 'Tạo bộ flashcard đầu tiên', icon: '🌟', points_reward: 50, requirement_type: 'sets_created', requirement_value: 1 },
  { id: '2', name: 'Siêng năng', description: 'Học 100 từ vựng', icon: '📚', points_reward: 100, requirement_type: 'cards_learned', requirement_value: 100 },
  { id: '3', name: 'Chăm chỉ', description: 'Hoàn thành 10 phiên học', icon: '⭐', points_reward: 150, requirement_type: 'sessions_completed', requirement_value: 10 },
  { id: '4', name: 'Kiên trì', description: 'Duy trì streak 7 ngày', icon: '🔥', points_reward: 200, requirement_type: 'streak_days', requirement_value: 7 },
  { id: '5', name: 'Tập trung cao độ', description: 'Hoàn thành 10 Pomodoro', icon: '🍅', points_reward: 100, requirement_type: 'pomodoro_completed', requirement_value: 10 },
  { id: '6', name: 'Hoàn hảo', description: 'Đạt 100% trong một phiên học', icon: '💯', points_reward: 75, requirement_type: 'perfect_session', requirement_value: 1 },
  { id: '7', name: 'Người sưu tầm', description: 'Tạo 10 bộ flashcard', icon: '🗃️', points_reward: 200, requirement_type: 'sets_created', requirement_value: 10 },
  { id: '8', name: 'Bậc thầy từ vựng', description: 'Học 1000 từ vựng', icon: '👑', points_reward: 500, requirement_type: 'cards_learned', requirement_value: 1000 },
];
