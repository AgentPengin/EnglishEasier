import { useState, useEffect, useRef } from 'react';
import { usePomodoroStore } from '../stores/pomodoroStore';
import { formatTime } from '../utils/helpers';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  Timer,
  Coffee,
  Brain,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

export default function PomodoroPage() {
  const {
    settings,
    isRunning,
    isPaused,
    currentPhase,
    timeRemaining,
    completedSessions,
    totalWorkTime,
    updateSettings,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    tick,
    completePhase,
    skipPhase,
  } = usePomodoroStore();

  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, tick]);

  // Check for phase completion
  useEffect(() => {
    if (timeRemaining === 0 && isRunning) {
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      completePhase();
    }
  }, [timeRemaining, isRunning, completePhase, soundEnabled]);

  const handlePlayPause = () => {
    if (!isRunning) {
      startTimer();
    } else if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  const getPhaseInfo = () => {
    switch (currentPhase) {
      case 'work':
        return { label: 'Tập trung', icon: Brain, color: 'from-red-500 to-orange-500' };
      case 'short_break':
        return { label: 'Nghỉ ngắn', icon: Coffee, color: 'from-green-500 to-emerald-500' };
      case 'long_break':
        return { label: 'Nghỉ dài', icon: Coffee, color: 'from-blue-500 to-cyan-500' };
    }
  };

  const phaseInfo = getPhaseInfo();
  const progress = (() => {
    const totalTime = currentPhase === 'work'
      ? settings.work_duration * 60
      : currentPhase === 'short_break'
      ? settings.short_break * 60
      : settings.long_break * 60;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  })();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1NOj02SF9tenqAdHhqYF9XYG51gIWHhn97c2phXF1iaXF+g4iIhoF8dW5qZmdqcXiBhomJh4N+eHJua2tvc3qAhYiJh4WBfHdzb29xdXl/hIeIh4aEgHt3dHJydXl9goaIiIeFg4B8eXZ1dXh7f4OGh4eGhYOAfXp4dnZ4e36Bg4aGhoaFg4B9e3l4eHp8f4KFhoaGhYSCgH17enl5en1/goSFhYWFhIOBf316eXl6fH6BhISFhYSEg4KAfn17enp7fYCCg4SEhISEg4KAf318fHx9f4GDhISEhISEgoGAf358fHx+gIKDhISEhISEgoKAf35+fn5/gYKDhISEhISEgoKAf35+fn6AgYKDhIODhISDgoGAf39/f4CBgoODg4ODg4ODgoGAf4CAf4CBgoODg4ODg4ODgoGAgICAgIGBgoKDg4ODg4OCgoGAgICAgIGBgoKDg4ODg4OCgoGAgICAgIGBgoKCg4ODg4OCgoGAgICAgIGBgoKCg4OCg4OCgoGAgICAgIGBgoKCg4OCg4OCgoGAgICAgIGBgoKCgoKDgoKCgoGAgICAgIGBgoKCgoKCgoKCgoGAgICAgIGBgoKCgoKCgoKCgoGAgICAgIGBgoKCgoKCgoKCgoGAgICAgIGBgoKCgoKCgoKCgoGAgICAgIGBgoKCgoKCgoKCgoGAgICAgA==" type="audio/wav" />
      </audio>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pomodoro Timer</h1>
          <p className="text-white/70">Tập trung học tập hiệu quả hơn</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Timer Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        {/* Phase indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {['work', 'short_break', 'long_break'].map((phase) => (
            <button
              key={phase}
              onClick={() => {
                // Could add phase selection logic here
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentPhase === phase
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {phase === 'work' ? 'Tập trung' : phase === 'short_break' ? 'Nghỉ ngắn' : 'Nghỉ dài'}
            </button>
          ))}
        </div>

        {/* Timer display */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Progress ring */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <phaseInfo.icon className={`w-8 h-8 mb-2 text-purple-600`} />
            <span className="text-5xl font-bold text-gray-800 tabular-nums">
              {formatTime(timeRemaining)}
            </span>
            <span className="text-gray-500 mt-2">{phaseInfo.label}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={resetTimer}
            className="p-4 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <button
            onClick={handlePlayPause}
            className={`p-6 rounded-2xl bg-gradient-to-br ${phaseInfo.color} text-white shadow-lg hover:shadow-xl transition-all`}
          >
            {isRunning && !isPaused ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
          <button
            onClick={skipPhase}
            className="p-4 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Timer className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-gray-600">Phiên hoàn thành</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{completedSessions}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-gray-600">Thời gian tập trung</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalWorkTime} phút</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4">Cách sử dụng Pomodoro</h3>
        <div className="space-y-3 text-white/80">
          <p>🍅 Tập trung làm việc trong {settings.work_duration} phút</p>
          <p>☕ Nghỉ ngắn {settings.short_break} phút sau mỗi phiên</p>
          <p>🎉 Nghỉ dài {settings.long_break} phút sau {settings.sessions_until_long_break} phiên</p>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Cài đặt Pomodoro</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian tập trung (phút)
                </label>
                <input
                  type="number"
                  value={settings.work_duration}
                  onChange={(e) => updateSettings({ work_duration: parseInt(e.target.value) || 25 })}
                  min={1}
                  max={60}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nghỉ ngắn (phút)
                </label>
                <input
                  type="number"
                  value={settings.short_break}
                  onChange={(e) => updateSettings({ short_break: parseInt(e.target.value) || 5 })}
                  min={1}
                  max={30}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nghỉ dài (phút)
                </label>
                <input
                  type="number"
                  value={settings.long_break}
                  onChange={(e) => updateSettings({ long_break: parseInt(e.target.value) || 15 })}
                  min={1}
                  max={60}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số phiên trước nghỉ dài
                </label>
                <input
                  type="number"
                  value={settings.sessions_until_long_break}
                  onChange={(e) => updateSettings({ sessions_until_long_break: parseInt(e.target.value) || 4 })}
                  min={1}
                  max={10}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Lưu cài đặt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
