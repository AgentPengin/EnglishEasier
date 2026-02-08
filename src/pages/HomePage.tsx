import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, Timer, Trophy, ArrowRight, Star, Users, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">EnglishEasier</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-white/80 hover:text-white font-medium transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="bg-white text-purple-600 font-semibold px-6 py-2.5 rounded-full hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
            >
              Bắt đầu miễn phí
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm">Phương pháp học hiệu quả #1</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Học tiếng Anh
            <br />
            <span className="text-yellow-300">dễ dàng hơn</span> bao giờ hết
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Tạo flashcard thông minh, học theo phương pháp khoa học, và theo dõi tiến độ học tập của bạn. 
            Hệ thống xếp hạng giúp bạn có động lực học mỗi ngày!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-white text-purple-600 font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              Bắt đầu ngay
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full hover:bg-white/30 transition-all border border-white/30"
            >
              Đã có tài khoản
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">10K+</div>
            <div className="text-white/70">Người dùng</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">500K+</div>
            <div className="text-white/70">Flashcards</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">95%</div>
            <div className="text-white/70">Hài lòng</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          Tính năng nổi bật
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Flashcards thông minh"
            description="Tạo và tổ chức flashcard theo chủ đề. Hỗ trợ nhiều chế độ học khác nhau."
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Đa dạng chế độ học"
            description="Lật thẻ, trắc nghiệm, điền từ - chọn phương pháp phù hợp với bạn."
          />
          <FeatureCard
            icon={<Timer className="w-8 h-8" />}
            title="Pomodoro Timer"
            description="Tích hợp kỹ thuật Pomodoro giúp bạn tập trung và học hiệu quả hơn."
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8" />}
            title="Xếp hạng & Thành tích"
            description="Cạnh tranh với bạn bè, thu thập điểm và lên hạng mỗi tuần."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20">
          <Users className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tham gia cộng đồng học tập
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Hơn 10,000 người đã tin tưởng sử dụng EnglishEasier để cải thiện tiếng Anh mỗi ngày
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Đăng ký miễn phí
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">EnglishEasier</span>
          </div>
          <p className="text-white/60 text-sm">
            © 2026 EnglishEasier. Được tạo với ❤️ cho việc học tập.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all group">
      <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/70">{description}</p>
    </div>
  );
}
