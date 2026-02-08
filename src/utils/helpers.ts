import { RANKS } from './constants';
import type { RankInfo } from '../types';

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getRankByPoints(points: number): RankInfo {
  for (const rank of RANKS) {
    if (points >= rank.minPoints && points <= rank.maxPoints) {
      return rank;
    }
  }
  return RANKS[0];
}

export function getProgressToNextRank(points: number): { progress: number; pointsToNext: number } {
  const currentRank = getRankByPoints(points);
  const currentRankIndex = RANKS.findIndex(r => r.name === currentRank.name);
  
  if (currentRankIndex === RANKS.length - 1) {
    return { progress: 100, pointsToNext: 0 };
  }
  
  const nextRank = RANKS[currentRankIndex + 1];
  const pointsInCurrentRank = points - currentRank.minPoints;
  const pointsNeeded = nextRank.minPoints - currentRank.minPoints;
  const progress = Math.round((pointsInCurrentRank / pointsNeeded) * 100);
  const pointsToNext = nextRank.minPoints - points;
  
  return { progress: Math.min(progress, 100), pointsToNext };
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomItems<T>(array: T[], count: number): T[] {
  return shuffleArray(array).slice(0, count);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatDate(dateString);
}

export function calculateLevel(points: number): number {
  // Level formula: level = floor(sqrt(points / 100)) + 1
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

export function getPointsForLevel(level: number): number {
  // Reverse of calculateLevel
  return Math.pow(level - 1, 2) * 100;
}

export function normalizeString(str: string): string {
  return str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function compareAnswers(answer: string, correct: string): boolean {
  return normalizeString(answer) === normalizeString(correct);
}
