import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useFlashcardStore } from '../stores/flashcardStore';
import { useStudyStore } from '../stores/studyStore';
import { useAuthStore } from '../stores/authStore';
import { shuffleArray, compareAnswers } from '../utils/helpers';
import type { Flashcard, StudyMode } from '../types';
import {
  ArrowLeft,
  RotateCcw,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Star,
  Home,
  RefreshCw,
  Shuffle,
  BookOpen,
  CheckCircle,
  ListChecks,
  Keyboard,
} from 'lucide-react';

export default function StudyPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { sets, cards, folders } = useFlashcardStore();
  const { currentSession, startSession, recordAnswer, completeSession } = useStudyStore();
  const { user, updateUserPoints, updateWeeklyPoints } = useAuthStore();

  const [mode, setMode] = useState<StudyMode>('flip');
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(true);
  const [reverseMode, setReverseMode] = useState(false);

  // Get set info
  const set = id ? sets.find((s) => s.id === id) : null;
  const folderId = searchParams.get('folder');
  const folder = folderId ? folders.find((f) => f.id === folderId) : null;

  // Initialize cards
  useEffect(() => {
    let cardsToStudy: Flashcard[] = [];
    
    if (id) {
      // Study specific set
      cardsToStudy = cards.filter((c) => c.set_id === id);
    } else if (folderId) {
      // Study all sets in folder
      const folderSets = sets.filter((s) => s.folder_id === folderId);
      const folderSetIds = folderSets.map((s) => s.id);
      cardsToStudy = cards.filter((c) => folderSetIds.includes(c.set_id));
    } else {
      // Study all cards or specific sets
      const setIds = searchParams.get('sets')?.split(',') || [];
      if (setIds.length > 0) {
        cardsToStudy = cards.filter((c) => setIds.includes(c.set_id));
      } else {
        cardsToStudy = [...cards];
      }
    }

    setStudyCards(shuffleArray(cardsToStudy));
  }, [id, folderId, cards, sets, searchParams]);

  // Generate multiple choice options
  const generateOptions = useCallback((correctCard: Flashcard) => {
    const isEnglishQuestion = !reverseMode;
    const correctAnswer = isEnglishQuestion ? correctCard.vietnamese : correctCard.english;
    
    // Get wrong answers from other cards
    const otherCards = cards.filter((c) => c.id !== correctCard.id);
    const wrongAnswers = shuffleArray(otherCards)
      .slice(0, 3)
      .map((c) => (isEnglishQuestion ? c.vietnamese : c.english));
    
    // Combine and shuffle
    const allOptions = shuffleArray([correctAnswer, ...wrongAnswers]);
    setMultipleChoiceOptions(allOptions);
  }, [cards, reverseMode]);

  // Setup for current card
  useEffect(() => {
    if (studyCards.length > 0 && currentIndex < studyCards.length && mode === 'multiple-choice') {
      generateOptions(studyCards[currentIndex]);
    }
  }, [currentIndex, studyCards, mode, generateOptions]);

  const startStudy = (selectedMode: StudyMode, reverse: boolean = false) => {
    setMode(selectedMode);
    setReverseMode(reverse);
    setShowModeSelector(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowResult(false);
    setUserAnswer('');
    setSelectedOption(null);

    startSession({
      user_id: user?.id || '',
      set_ids: id ? [id] : sets.map((s) => s.id),
      mode: selectedMode,
      total_cards: studyCards.length,
    });
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnown = () => {
    // Play happy sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
    
    recordAnswer(true);
    nextCard();
  };

  const handleUnknown = () => {
    // Play sad sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(311.13, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(277.18, audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
    
    recordAnswer(false);
    nextCard();
  };

  const handleMultipleChoiceSelect = (option: string) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    const currentCard = studyCards[currentIndex];
    const correctAnswer = !reverseMode ? currentCard.vietnamese : currentCard.english;
    const correct = option === correctAnswer;
    
    // Play sound effect
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    if (correct) {
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
    } else {
      oscillator.frequency.setValueAtTime(311.13, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(277.18, audioContext.currentTime + 0.15);
    }
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    setIsCorrect(correct);
    setShowResult(true);
    recordAnswer(correct);
    
    setTimeout(() => {
      nextCard();
    }, 1500);
  };

  // Play sound effect
  const playSound = (isCorrect: boolean) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (isCorrect) {
      // Happy sound for correct answer
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    } else {
      // Sad sound for wrong answer
      oscillator.frequency.setValueAtTime(311.13, audioContext.currentTime); // Eb4
      oscillator.frequency.setValueAtTime(277.18, audioContext.currentTime + 0.15); // Db4
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const handleTypingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const currentCard = studyCards[currentIndex];
    // Fix: When reverseMode is true (Vietnamese question), user answers in English
    // When reverseMode is false (English question), user answers in Vietnamese
    const correctAnswer = reverseMode ? currentCard.english : currentCard.vietnamese;
    const correct = compareAnswers(userAnswer, correctAnswer);
    
    playSound(correct);

    setIsCorrect(correct);
    setShowResult(true);
    recordAnswer(correct);
  };

  const nextCard = () => {
    if (currentIndex + 1 >= studyCards.length) {
      // Complete session
      const session = completeSession();
      if (session) {
        updateUserPoints(session.points_earned);
        updateWeeklyPoints(session.points_earned);
      }
      setIsCompleted(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowResult(false);
      setUserAnswer('');
      setSelectedOption(null);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const restartStudy = () => {
    setStudyCards(shuffleArray(studyCards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowResult(false);
    setUserAnswer('');
    setSelectedOption(null);
    setIsCompleted(false);
    setShowModeSelector(true);
  };

  // Mode selector
  if (showModeSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {set ? set.name : folder ? `📁 ${folder.name}` : 'Học tất cả'}
              </h1>
              <p className="text-white/70">{studyCards.length} thẻ</p>
            </div>
          </div>

          {studyCards.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Chưa có thẻ để học</h2>
              <p className="text-gray-500 mb-6">Thêm từ vựng vào bộ flashcard để bắt đầu</p>
              <button
                onClick={() => navigate('/flashcards')}
                className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-purple-700 transition-all"
              >
                Quay lại
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-800 text-center">
                Chọn chế độ học
              </h2>

              <div className="grid gap-4">
                <ModeCard
                  icon={<RotateCcw className="w-8 h-8" />}
                  title="Lật thẻ"
                  description="Xem từ và tự kiểm tra bằng cách lật thẻ"
                  onClick={() => startStudy('flip')}
                  color="from-blue-500 to-cyan-500"
                />
                <ModeCard
                  icon={<ListChecks className="w-8 h-8" />}
                  title="Trắc nghiệm"
                  description="Chọn đáp án đúng trong 4 lựa chọn"
                  onClick={() => startStudy('multiple-choice')}
                  color="from-green-500 to-emerald-500"
                />
                <ModeCard
                  icon={<Keyboard className="w-8 h-8" />}
                  title="Điền từ (Anh → Việt)"
                  description="Gõ nghĩa tiếng Việt từ từ tiếng Anh"
                  onClick={() => startStudy('typing', false)}
                  color="from-purple-500 to-pink-500"
                />
                <ModeCard
                  icon={<Keyboard className="w-8 h-8" />}
                  title="Điền từ (Việt → Anh)"
                  description="Gõ từ tiếng Anh từ nghĩa tiếng Việt"
                  onClick={() => startStudy('reverse-typing', true)}
                  color="from-orange-500 to-red-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Completed screen
  if (isCompleted && currentSession === null) {
    const lastSession = useStudyStore.getState().studyHistory[0];
    const accuracy = lastSession
      ? Math.round((lastSession.correct_answers / lastSession.total_cards) * 100)
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hoàn thành! 🎉</h1>
          <p className="text-gray-500 mb-8">Bạn đã hoàn thành phiên học</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-gray-800">{lastSession?.total_cards || 0}</p>
              <p className="text-sm text-gray-500">Tổng thẻ</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-600">{lastSession?.correct_answers || 0}</p>
              <p className="text-sm text-gray-500">Đúng</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-red-600">{lastSession?.wrong_answers || 0}</p>
              <p className="text-sm text-gray-500">Sai</p>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <span className="text-3xl font-bold text-purple-600">
                +{lastSession?.points_earned || 0}
              </span>
            </div>
            <p className="text-purple-600">điểm kinh nghiệm</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Độ chính xác</span>
              <span>{accuracy}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  accuracy >= 80 ? 'bg-green-500' : accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
            >
              <Home className="w-5 h-5" />
              Trang chủ
            </button>
            <button
              onClick={restartStudy}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Học lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = studyCards[currentIndex];
  if (!currentCard) return null;

  const question = reverseMode ? currentCard.vietnamese : currentCard.english;
  const answer = reverseMode ? currentCard.english : currentCard.vietnamese;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <p className="text-white font-semibold">
              {currentIndex + 1} / {studyCards.length}
            </p>
            <div className="w-32 h-2 bg-white/20 rounded-full mt-1">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${((currentIndex + 1) / studyCards.length) * 100}%` }}
              />
            </div>
          </div>
          <button
            onClick={restartStudy}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <Shuffle className="w-6 h-6" />
          </button>
        </div>

        {/* Session progress */}
        {currentSession && (
          <div className="flex items-center justify-center gap-6 mb-6 text-white">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>{currentSession.correct_answers}</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-400" />
              <span>{currentSession.wrong_answers}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>+{currentSession.points_earned}</span>
            </div>
          </div>
        )}

        {/* Flip mode */}
        {mode === 'flip' && (
          <>
            <div
              className="flashcard-container cursor-pointer mb-6"
              onClick={handleFlip}
            >
              <div className={`flashcard relative w-full aspect-[3/2] ${isFlipped ? 'flipped' : ''}`}>
                {/* Front */}
                <div className="flashcard-front absolute inset-0 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8">
                  <p className="text-sm text-gray-400 mb-4">
                    {reverseMode ? 'Tiếng Việt' : 'Tiếng Anh'}
                  </p>
                  <p className="text-3xl font-bold text-gray-800 text-center">{question}</p>
                  <p className="text-gray-400 mt-6">Nhấn để lật</p>
                </div>
                {/* Back */}
                <div className="flashcard-back absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8">
                  <p className="text-sm text-white/70 mb-4">
                    {reverseMode ? 'Tiếng Anh' : 'Tiếng Việt'}
                  </p>
                  <p className="text-3xl font-bold text-white text-center">{answer}</p>
                </div>
              </div>
            </div>

            {isFlipped && (
              <div className="flex gap-4">
                <button
                  onClick={handleUnknown}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all"
                >
                  <X className="w-6 h-6" />
                  Chưa nhớ
                </button>
                <button
                  onClick={handleKnown}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all"
                >
                  <Check className="w-6 h-6" />
                  Đã nhớ
                </button>
              </div>
            )}
          </>
        )}

        {/* Multiple choice mode */}
        {mode === 'multiple-choice' && (
          <>
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
              <p className="text-sm text-gray-400 mb-2 text-center">
                {reverseMode ? 'Tiếng Việt' : 'Tiếng Anh'}
              </p>
              <p className="text-3xl font-bold text-gray-800 text-center">{question}</p>
            </div>

            <div className="grid gap-3">
              {multipleChoiceOptions.map((option, index) => {
                const isSelected = selectedOption === option;
                const correctAnswer = !reverseMode ? currentCard.vietnamese : currentCard.english;
                const isCorrectOption = option === correctAnswer;

                let bgColor = 'bg-white hover:bg-gray-50';
                if (showResult) {
                  if (isCorrectOption) {
                    bgColor = 'bg-green-500 text-white';
                  } else if (isSelected && !isCorrectOption) {
                    bgColor = 'bg-red-500 text-white';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleMultipleChoiceSelect(option)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-xl font-semibold text-left transition-all ${bgColor} ${
                      showResult ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    <span className="mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Typing mode */}
        {(mode === 'typing' || mode === 'reverse-typing') && (
          <>
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
              <p className="text-sm text-gray-400 mb-2 text-center">
                {reverseMode ? 'Tiếng Việt' : 'Tiếng Anh'}
              </p>
              <p className="text-3xl font-bold text-gray-800 text-center">{question}</p>
            </div>

            {showResult ? (
              <div className={`rounded-2xl p-6 mb-6 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                <div className="flex items-center justify-center gap-2 text-white mb-2">
                  {isCorrect ? (
                    <>
                      <Check className="w-6 h-6" />
                      <span className="font-bold">Chính xác!</span>
                    </>
                  ) : (
                    <>
                      <X className="w-6 h-6" />
                      <span className="font-bold">Chưa đúng</span>
                    </>
                  )}
                </div>
                {!isCorrect && (
                  <p className="text-white/90 text-center">
                    Đáp án đúng: <strong>{answer}</strong>
                  </p>
                )}
                <button
                  onClick={nextCard}
                  className="w-full mt-4 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all"
                >
                  Tiếp tục
                </button>
              </div>
            ) : (
              <form onSubmit={handleTypingSubmit} className="space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full px-6 py-4 text-xl rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none transition-all text-center"
                  placeholder={`Nhập ${reverseMode ? 'tiếng Anh' : 'nghĩa tiếng Việt'}...`}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!userAnswer.trim()}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  Kiểm tra
                </button>
              </form>
            )}
          </>
        )}

        {/* Navigation for flip mode */}
        {mode === 'flip' && !isFlipped && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="p-3 rounded-xl bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextCard}
              disabled={currentIndex >= studyCards.length - 1}
              className="p-3 rounded-xl bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ModeCard({
  icon,
  title,
  description,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all text-left group"
    >
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </button>
  );
}
