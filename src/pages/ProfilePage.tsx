import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useFlashcardStore } from '../stores/flashcardStore';
import { useStudyStore } from '../stores/studyStore';
import { usePomodoroStore } from '../stores/pomodoroStore';
import { getRankByPoints, getProgressToNextRank, calculateLevel, formatDate } from '../utils/helpers';
import { ACHIEVEMENTS } from '../utils/constants';
import {
  User,
  Mail,
  Calendar,
  Star,
  Trophy,
  BookOpen,
  Flame,
  Target,
  Award,
  Edit2,
  Save,
  X,
  TrendingUp,
  Clock,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { sets, cards } = useFlashcardStore();
  const { studyHistory, getSessionStats } = useStudyStore();
  const { completedSessions, totalWorkTime } = usePomodoroStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || '');

  const rank = user ? getRankByPoints(user.points) : null;
  const rankProgress = user ? getProgressToNextRank(user.points) : null;
  const level = user ? calculateLevel(user.points) : 1;
  const stats = getSessionStats();

  const handleSaveProfile = () => {
    if (user && editUsername.trim()) {
      setUser({ ...user, username: editUsername.trim() });
      setIsEditing(false);
    }
  };

  // Calculate unlocked achievements (simplified)
  const unlockedAchievements = ACHIEVEMENTS.filter((achievement) => {
    switch (achievement.requirement_type) {
      case 'sets_created':
        return sets.length >= achievement.requirement_value;
      case 'cards_learned':
        return (user?.total_cards_learned || 0) >= achievement.requirement_value;
      case 'sessions_completed':
        return studyHistory.length >= achievement.requirement_value;
      case 'pomodoro_completed':
        return completedSessions >= achievement.requirement_value;
      case 'perfect_session':
        return studyHistory.some((s) => s.correct_answers === s.total_cards && s.total_cards > 0);
      default:
        return false;
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Hồ sơ cá nhân</h1>
        <p className="text-white/70">Xem thông tin và thành tích của bạn</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên người dùng
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Lưu
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditUsername(user?.username || '');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">{user?.username}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Tham gia {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Rank badge */}
          <div className="flex-shrink-0 text-center">
            <div
              className={`w-16 h-16 rounded-2xl ${rank?.badge} flex items-center justify-center text-3xl shadow-lg mx-auto mb-2`}
            >
              {rank?.icon}
            </div>
            <p className="font-bold text-gray-800">{rank?.name}</p>
            <p className="text-sm text-gray-500">Level {level}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Star className="w-6 h-6" />}
          label="Tổng điểm"
          value={user?.points || 0}
          color="from-yellow-400 to-orange-500"
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          label="Bộ flashcard"
          value={sets.length}
          color="from-blue-400 to-indigo-500"
        />
        <StatCard
          icon={<Target className="w-6 h-6" />}
          label="Từ vựng"
          value={cards.length}
          color="from-green-400 to-emerald-500"
        />
        <StatCard
          icon={<Flame className="w-6 h-6" />}
          label="Streak"
          value={`${user?.streak_days || 0} ngày`}
          color="from-red-400 to-pink-500"
        />
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          Tiến độ lên hạng
        </h3>
        {rank && rankProgress && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{rank.icon}</span>
                <span className="font-semibold text-gray-800">{rank.name}</span>
              </div>
              {rankProgress.pointsToNext > 0 && (
                <span className="text-gray-500">
                  Còn {rankProgress.pointsToNext} điểm
                </span>
              )}
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${rankProgress.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Learning Stats */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Thống kê học tập
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalSessions}</p>
            <p className="text-gray-500">Phiên học</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalCards}</p>
            <p className="text-gray-500">Thẻ đã học</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">{stats.averageScore}%</p>
            <p className="text-gray-500">Độ chính xác</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">{totalWorkTime}</p>
            <p className="text-gray-500">Phút tập trung</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Thành tích ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedAchievements.some((a) => a.id === achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isUnlocked
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-100 bg-gray-50 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className={`font-semibold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                  {achievement.name}
                </h4>
                <p className="text-sm text-gray-500">{achievement.description}</p>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-600 font-medium">+{achievement.points_reward}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
