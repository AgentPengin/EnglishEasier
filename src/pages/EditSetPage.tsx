import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFlashcardStore } from '../stores/flashcardStore';
import { generateId } from '../utils/helpers';
import { SET_COLORS, SET_ICONS } from '../utils/constants';
import type { Flashcard } from '../types';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface CardInput {
  id: string;
  english: string;
  vietnamese: string;
  isNew?: boolean;
}

export default function EditSetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sets, cards, folders, updateSet, addCard, updateCard, deleteCard } = useFlashcardStore();

  const set = sets.find((s) => s.id === id);
  const setCards = cards.filter((c) => c.set_id === id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(SET_COLORS[0]);
  const [icon, setIcon] = useState(SET_ICONS[0]);
  const [folderId, setFolderId] = useState<string>('');
  const [cardInputs, setCardInputs] = useState<CardInput[]>([]);
  const [deletedCardIds, setDeletedCardIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (set) {
      setName(set.name);
      setDescription(set.description || '');
      setColor(set.color);
      setIcon(set.icon);
      setFolderId(set.folder_id || '');
      setCardInputs(
        setCards.map((card) => ({
          id: card.id,
          english: card.english,
          vietnamese: card.vietnamese,
        }))
      );
    }
  }, [set]);

  if (!set) {
    return (
      <div className="text-center py-20">
        <p className="text-white text-lg">Không tìm thấy bộ flashcard</p>
        <button
          onClick={() => navigate('/flashcards')}
          className="mt-4 text-white/70 hover:text-white"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const addCardInput = () => {
    setCardInputs([
      ...cardInputs,
      { id: generateId(), english: '', vietnamese: '', isNew: true },
    ]);
  };

  const removeCardInput = (cardId: string, isNew?: boolean) => {
    if (cardInputs.length > 1) {
      setCardInputs(cardInputs.filter((card) => card.id !== cardId));
      if (!isNew) {
        setDeletedCardIds([...deletedCardIds, cardId]);
      }
    }
  };

  const updateCardInput = (cardId: string, field: 'english' | 'vietnamese', value: string) => {
    setCardInputs(
      cardInputs.map((card) =>
        card.id === cardId ? { ...card, [field]: value } : card
      )
    );
  };

  const randomizeAppearance = () => {
    setColor(SET_COLORS[Math.floor(Math.random() * SET_COLORS.length)]);
    setIcon(SET_ICONS[Math.floor(Math.random() * SET_ICONS.length)]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    try {
      // Delete removed cards
      deletedCardIds.forEach((cardId) => deleteCard(cardId));

      // Update or add cards
      cardInputs.forEach((cardInput) => {
        if (!cardInput.english.trim() || !cardInput.vietnamese.trim()) return;

        if (cardInput.isNew) {
          const newCard: Flashcard = {
            id: cardInput.id,
            set_id: id!,
            english: cardInput.english.trim(),
            vietnamese: cardInput.vietnamese.trim(),
            mastery_level: 0,
            times_reviewed: 0,
            created_at: new Date().toISOString(),
          };
          addCard(newCard);
        } else {
          updateCard(cardInput.id, {
            english: cardInput.english.trim(),
            vietnamese: cardInput.vietnamese.trim(),
          });
        }
      });

      // Update set
      const validCardsCount = cardInputs.filter(
        (c) => c.english.trim() && c.vietnamese.trim()
      ).length;

      updateSet(id!, {
        name: name.trim(),
        description: description.trim() || undefined,
        color,
        icon,
        folder_id: folderId || undefined,
        cards_count: validCardsCount,
        updated_at: new Date().toISOString(),
      });

      navigate('/flashcards');
    } catch (error) {
      console.error('Error updating set:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Chỉnh sửa bộ flashcard</h1>
          <p className="text-white/70">Cập nhật thông tin và từ vựng</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Set Info */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Thông tin bộ flashcard
          </h2>

          {/* Preview */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl transition-all"
              style={{ backgroundColor: color + '20' }}
            >
              {icon}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">{name || 'Tên bộ flashcard'}</p>
              <p className="text-gray-500 text-sm">{description || 'Mô tả bộ flashcard'}</p>
            </div>
            <button
              type="button"
              onClick={randomizeAppearance}
              className="p-2 rounded-lg hover:bg-white text-gray-400 hover:text-purple-600 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên bộ flashcard *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả (tùy chọn)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
              rows={2}
            />
          </div>

          {/* Folder */}
          {folders.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thư mục
              </label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              >
                <option value="">Không có thư mục</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Màu sắc
            </label>
            <div className="flex flex-wrap gap-2">
              {SET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biểu tượng
            </label>
            <div className="flex flex-wrap gap-2">
              {SET_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    icon === i ? 'bg-purple-100 ring-2 ring-purple-500 scale-110' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">
              Thẻ từ vựng ({cardInputs.filter((c) => c.english && c.vietnamese).length})
            </h2>
            <button
              type="button"
              onClick={addCardInput}
              className="flex items-center gap-1 text-purple-600 font-medium hover:text-purple-700"
            >
              <Plus className="w-4 h-4" />
              Thêm thẻ
            </button>
          </div>

          <div className="space-y-3">
            {cardInputs.map((card, index) => (
              <div
                key={card.id}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl"
              >
                <span className="text-gray-400 font-medium w-8">{index + 1}</span>
                <div className="flex-1 grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={card.english}
                    onChange={(e) => updateCardInput(card.id, 'english', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    placeholder="Tiếng Anh"
                  />
                  <input
                    type="text"
                    value={card.vietnamese}
                    onChange={(e) => updateCardInput(card.id, 'vietnamese', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    placeholder="Tiếng Việt"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCardInput(card.id, card.isNew)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                  disabled={cardInputs.length === 1}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addCardInput}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm thẻ mới
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!name.trim() || isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              Lưu thay đổi
            </>
          )}
        </button>
      </form>
    </div>
  );
}
