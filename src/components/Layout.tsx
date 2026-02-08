import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  Home,
  BookOpen,
  FolderOpen,
  Timer,
  Trophy,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  Sparkles,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: 'Tổng quan', href: '/dashboard', icon: Home },
    { name: 'Flashcards', href: '/flashcards', icon: BookOpen },
    { name: 'Thư mục', href: '/folders', icon: FolderOpen },
    { name: 'Pomodoro', href: '/pomodoro', icon: Timer },
    { name: 'Xếp hạng', href: '/leaderboard', icon: Trophy },
    { name: 'Hồ sơ', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EnglishEasier</span>
            </Link>
            <button
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Create button */}
          <div className="p-4">
            <Link
              to="/create-set"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Tạo bộ mới
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user?.username || 'User'}</p>
                <p className="text-white/60 text-sm">{user?.points || 0} điểm</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/10 backdrop-blur-xl border-b border-white/20">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-white" />
              <span className="text-lg font-bold text-white">EnglishEasier</span>
            </Link>
            <div className="w-6" />
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-screen pt-16 lg:pt-0">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
