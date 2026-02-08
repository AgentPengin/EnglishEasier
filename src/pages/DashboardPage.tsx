import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useFlashcardStore } from '../stores/flashcardStore';
import { useStudyStore } from '../stores/studyStore';
import { usePomodoroStore } from '../stores/pomodoroStore';
import { getRankByPoints, getProgressToNextRank, calculateLevel } from '../utils/helpers';
import {
  BookOpen,
  Trophy,
  Flame,
  Clock,
  TrendingUp,
  Star,
  Plus,
  Play,
  ArrowRight,
  Target,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { sets, cards } = useFlashcardStore();
  const { studyHistory, getSessionStats } = useStudyStore();
  const { completedSessions, totalWorkTime } = usePomodoroStore();

  const rank = user ? getRankByPoints(user.points) : null;
  const rankProgress = user ? getProgressToNextRank(user.points) : null;
  const level = user ? calculateLevel(user.points) : 1;
  const stats = getSessionStats();

  // Recent study sessions
  const recentSessions = studyHistory.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Xin chào, {user?.username}! 👋
            </h1>
            <p className="text-white/70">
              Hãy tiếp tục học tập để đạt được mục tiêu của bạn.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/create-set"
              className="flex items-center gap-2 bg-white text-purple-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Tạo bộ mới
            </Link>
            {sets.length > 0 && (
              <Link
                to="/study"
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                <Play className="w-5 h-5" />
                Học ngay
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Star className="w-6 h-6" />}
          label="Điểm tích lũy"
          value={user?.points || 0}
          color="from-yellow-400 to-orange-500"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Cấp độ"
          value={`Level ${level}`}
          color="from-blue-400 to-indigo-500"
        />
        <StatCard
          icon={<Flame className="w-6 h-6" />}
          label="Streak"
          value={`${user?.streak_days || 0} ngày`}
          color="from-red-400 to-pink-500"
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          label="Từ đã học"
          value={user?.total_cards_learned || 0}
          color="from-green-400 to-emerald-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Rank Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Xếp hạng hiện tại
          </h2>
          {rank && rankProgress && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl ${rank.badge} flex items-center justify-center text-3xl shadow-lg`}
                >
                  {rank.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{rank.name}</h3>
                  <p className="text-gray-500">
                    {rankProgress.pointsToNext > 0
                      ? `Còn ${rankProgress.pointsToNext} điểm để lên hạng tiếp theo`
                      : 'Bạn đã đạt hạng cao nhất!'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">{user?.points}</div>
                  <div className="text-sm text-gray-500">điểm</div>
                </div>
              </div>
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${rankProgress.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Thống kê nhanh
          </h2>
          <div className="space-y-4">
            <QuickStat label="Tổng bộ flashcard" value={sets.length} />
            <QuickStat label="Tổng từ vựng" value={cards.length} />
            <QuickStat label="Phiên học hoàn thành" value={stats.totalSessions} />
            <QuickStat label="Pomodoro hoàn thành" value={completedSessions} />
            <QuickStat label="Thời gian tập trung" value={`${totalWorkTime} phút`} />
          </div>
        </div>
      </div>

      {/* Recent Sets */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Bộ flashcard gần đây
          </h2>
          <Link
            to="/flashcards"
            className="text-purple-600 font-medium hover:underline flex items-center gap-1"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {sets.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Bạn chưa có bộ flashcard nào</p>
            <Link
              to="/create-set"
              className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-purple-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              Tạo bộ đầu tiên
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sets.slice(0, 6).map((set) => (
              <Link
                key={set.id}
                to={`/study/${set.id}`}
                className="group p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: set.color + '20' }}
                  >
                    {set.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                      {set.name}
                    </h3>
                    <p className="text-sm text-gray-500">{set.cards_count} từ vựng</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {recentSessions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-500" />
            Hoạt động gần đây
          </h2>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Phiên học {session.mode === 'flip' ? 'Lật thẻ' : session.mode === 'multiple-choice' ? 'Trắc nghiệm' : 'Điền từ'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {session.correct_answers}/{session.total_cards} đúng
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-purple-600">+{session.points_earned}</p>
                  <p className="text-xs text-gray-500">điểm</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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

function QuickStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
}
