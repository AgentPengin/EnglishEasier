import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useStudyStore } from '../stores/studyStore';
import { getRankByPoints, getProgressToNextRank } from '../utils/helpers';
import { RANKS } from '../utils/constants';
import type { LeaderboardEntry } from '../types';
import {
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  Calendar,
  Users,
} from 'lucide-react';

// Mock leaderboard data for demo
const generateMockLeaderboard = (currentUser: { id: string; username: string; points: number; weekly_points: number }): LeaderboardEntry[] => {
  const mockUsers = [
    { user_id: '1', username: 'NguyenVanA', points: 5420, level: 8 },
    { user_id: '2', username: 'TranThiB', points: 4850, level: 7 },
    { user_id: '3', username: 'LeVanC', points: 4200, level: 7 },
    { user_id: '4', username: 'PhamThiD', points: 3800, level: 6 },
    { user_id: '5', username: 'HoangVanE', points: 3450, level: 6 },
    { user_id: '6', username: 'VuThiF', points: 3100, level: 5 },
    { user_id: '7', username: 'DangVanG', points: 2800, level: 5 },
    { user_id: '8', username: 'BuiThiH', points: 2500, level: 5 },
    { user_id: '9', username: 'DoVanI', points: 2200, level: 4 },
    { user_id: '10', username: 'NguyenThiK', points: 1900, level: 4 },
  ];

  // Add current user and sort
  const allUsers = [
    ...mockUsers,
    { user_id: currentUser.id, username: currentUser.username, points: currentUser.points, level: Math.floor(Math.sqrt(currentUser.points / 100)) + 1 },
  ].sort((a, b) => b.points - a.points);

  return allUsers.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));
};

const generateWeeklyLeaderboard = (currentUser: { id: string; username: string; weekly_points: number }): LeaderboardEntry[] => {
  const mockUsers = [
    { user_id: '1', username: 'NguyenVanA', points: 520, level: 8 },
    { user_id: '2', username: 'TranThiB', points: 485, level: 7 },
    { user_id: '3', username: 'LeVanC', points: 420, level: 7 },
    { user_id: '4', username: 'PhamThiD', points: 380, level: 6 },
    { user_id: '5', username: 'HoangVanE', points: 345, level: 6 },
    { user_id: '6', username: 'VuThiF', points: 310, level: 5 },
    { user_id: '7', username: 'DangVanG', points: 280, level: 5 },
    { user_id: '8', username: 'BuiThiH', points: 250, level: 5 },
    { user_id: '9', username: 'DoVanI', points: 220, level: 4 },
    { user_id: '10', username: 'NguyenThiK', points: 190, level: 4 },
  ];

  const allUsers = [
    ...mockUsers,
    { user_id: currentUser.id, username: currentUser.username, points: currentUser.weekly_points, level: 1 },
  ].sort((a, b) => b.points - a.points);

  return allUsers.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));
};

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const { getSessionStats } = useStudyStore();
  const [activeTab, setActiveTab] = useState<'all-time' | 'weekly'>('weekly');

  const stats = getSessionStats();
  const rank = user ? getRankByPoints(user.points) : null;
  const rankProgress = user ? getProgressToNextRank(user.points) : null;

  const allTimeLeaderboard = user
    ? generateMockLeaderboard({ id: user.id, username: user.username, points: user.points, weekly_points: user.weekly_points })
    : [];
  
  const weeklyLeaderboard = user
    ? generateWeeklyLeaderboard({ id: user.id, username: user.username, weekly_points: user.weekly_points })
    : [];

  const currentLeaderboard = activeTab === 'weekly' ? weeklyLeaderboard : allTimeLeaderboard;
  const userRank = currentLeaderboard.find((e) => e.user_id === user?.id)?.rank || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Bảng xếp hạng</h1>
        <p className="text-white/70">Cạnh tranh và leo hạng cùng cộng đồng</p>
      </div>

      {/* User rank card */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Current rank */}
          <div className="flex items-center gap-4 flex-1">
            <div
              className={`w-20 h-20 rounded-2xl ${rank?.badge} flex items-center justify-center text-4xl shadow-lg`}
            >
              {rank?.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{rank?.name}</h2>
              <p className="text-gray-500">{user?.points || 0} điểm tổng cộng</p>
              {rankProgress && rankProgress.pointsToNext > 0 && (
                <p className="text-purple-600 text-sm mt-1">
                  Còn {rankProgress.pointsToNext} điểm để lên hạng
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">#{userRank}</div>
              <div className="text-sm text-gray-500">Hạng {activeTab === 'weekly' ? 'tuần' : 'tổng'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.averageScore}%</div>
              <div className="text-sm text-gray-500">Độ chính xác</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{user?.weekly_points || 0}</div>
              <div className="text-sm text-gray-500">Điểm tuần</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {rankProgress && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{rank?.name}</span>
              {rankProgress.pointsToNext > 0 && (
                <span>{RANKS[RANKS.findIndex((r) => r.name === rank?.name) + 1]?.name || 'Max'}</span>
              )}
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${rankProgress.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Rank tiers */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          Các cấp bậc
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {RANKS.map((r, index) => (
            <div
              key={r.name}
              className={`p-3 rounded-xl text-center transition-all ${
                rank?.name === r.name
                  ? 'ring-2 ring-purple-500 bg-purple-50'
                  : 'bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-1">{r.icon}</div>
              <div className="font-semibold text-gray-800 text-sm">{r.name}</div>
              <div className="text-xs text-gray-500">
                {r.minPoints}+ điểm
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-colors ${
              activeTab === 'weekly'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Tuần này
          </button>
          <button
            onClick={() => setActiveTab('all-time')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-colors ${
              activeTab === 'all-time'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Tất cả
          </button>
        </div>

        {/* Top 3 */}
        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-end justify-center gap-4">
            {/* 2nd place */}
            {currentLeaderboard[1] && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2 shadow-lg">
                  {currentLeaderboard[1].username.charAt(0)}
                </div>
                <Medal className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="font-semibold text-gray-800 truncate max-w-[100px]">
                  {currentLeaderboard[1].username}
                </p>
                <p className="text-sm text-gray-500">{currentLeaderboard[1].points} điểm</p>
              </div>
            )}

            {/* 1st place */}
            {currentLeaderboard[0] && (
              <div className="text-center -mt-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-2 shadow-lg ring-4 ring-yellow-200">
                  {currentLeaderboard[0].username.charAt(0)}
                </div>
                <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-1" />
                <p className="font-bold text-gray-800 truncate max-w-[120px]">
                  {currentLeaderboard[0].username}
                </p>
                <p className="text-sm text-purple-600 font-semibold">{currentLeaderboard[0].points} điểm</p>
              </div>
            )}

            {/* 3rd place */}
            {currentLeaderboard[2] && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2 shadow-lg">
                  {currentLeaderboard[2].username.charAt(0)}
                </div>
                <Medal className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                <p className="font-semibold text-gray-800 truncate max-w-[100px]">
                  {currentLeaderboard[2].username}
                </p>
                <p className="text-sm text-gray-500">{currentLeaderboard[2].points} điểm</p>
              </div>
            )}
          </div>
        </div>

        {/* Rest of leaderboard */}
        <div className="divide-y divide-gray-100">
          {currentLeaderboard.slice(3).map((entry) => (
            <div
              key={entry.user_id}
              className={`flex items-center gap-4 p-4 ${
                entry.user_id === user?.id ? 'bg-purple-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-8 text-center font-bold text-gray-400">
                {entry.rank}
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  entry.user_id === user?.id
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                    : 'bg-gray-300'
                }`}
              >
                {entry.username.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${entry.user_id === user?.id ? 'text-purple-600' : 'text-gray-800'}`}>
                  {entry.username}
                  {entry.user_id === user?.id && ' (Bạn)'}
                </p>
                <p className="text-sm text-gray-500">Level {entry.level}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">{entry.points}</p>
                <p className="text-xs text-gray-500">điểm</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
