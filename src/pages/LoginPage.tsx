import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import type { User } from '../types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Demo mode - create a mock user
      // In production, this would authenticate with Supabase
      if (email && password) {
        // Admin account with pre-filled data
        if (email === 'admin@englisheasier.com' && password === 'admin123') {
          const adminUser: User = {
            id: 'admin-user-001',
            email: 'admin@englisheasier.com',
            username: 'Admin',
            created_at: '2025-01-01T00:00:00.000Z',
            points: 2500,
            level: 6,
            streak_days: 15,
            total_cards_learned: 450,
            weekly_points: 320,
          };
          setUser(adminUser);
          navigate('/dashboard');
          return;
        }

        const mockUser: User = {
          id: 'demo-user-' + Date.now(),
          email: email,
          username: email.split('@')[0],
          created_at: new Date().toISOString(),
          points: 0,
          level: 1,
          streak_days: 0,
          total_cards_learned: 0,
          weekly_points: 0,
        };
        
        // Check localStorage for existing user data
        const storedAuth = localStorage.getItem('auth-storage');
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          if (parsed.state?.user?.email === email) {
            setUser(parsed.state.user);
            navigate('/dashboard');
            return;
          }
        }
        
        setUser(mockUser);
        navigate('/dashboard');
      } else {
        setError('Vui lòng nhập email và mật khẩu');
      }
    } catch {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">EnglishEasier</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Chào mừng trở lại! 👋
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Đăng nhập để tiếp tục học tập
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3.5 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-purple-600 font-semibold hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Demo note */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-6 text-center">
          <p className="text-white font-medium mb-2">🔐 Tài khoản Admin:</p>
          <p className="text-white/80 text-sm">Email: <code className="bg-white/20 px-2 py-0.5 rounded">admin@englisheasier.com</code></p>
          <p className="text-white/80 text-sm">Password: <code className="bg-white/20 px-2 py-0.5 rounded">admin123</code></p>
          <p className="text-white/60 text-xs mt-2">Hoặc nhập bất kỳ email/password để tạo tài khoản mới</p>
        </div>
      </div>
    </div>
  );
}
