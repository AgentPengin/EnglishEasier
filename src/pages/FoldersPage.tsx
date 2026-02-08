import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFlashcardStore } from '../stores/flashcardStore';
import { useAuthStore } from '../stores/authStore';
import { generateId } from '../utils/helpers';
import { FOLDER_COLORS } from '../utils/constants';
import type { Folder } from '../types';
import {
  Plus,
  FolderOpen,
  MoreVertical,
  Edit,
  Trash2,
  BookOpen,
  X,
  Check,
  Play,
} from 'lucide-react';

export default function FoldersPage() {
  const { user } = useAuthStore();
  const { folders, sets, addFolder, updateFolder, deleteFolder } = useFlashcardStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState(FOLDER_COLORS[0]);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const handleCreateFolder = () => {
    if (!folderName.trim()) return;

    const newFolder: Folder = {
      id: generateId(),
      user_id: user?.id || '',
      name: folderName.trim(),
      color: folderColor,
      sets_count: 0,
      created_at: new Date().toISOString(),
    };

    addFolder(newFolder);
    setFolderName('');
    setFolderColor(FOLDER_COLORS[0]);
    setShowCreateModal(false);
  };

  const handleUpdateFolder = () => {
    if (!editingFolder || !folderName.trim()) return;

    updateFolder(editingFolder.id, {
      name: folderName.trim(),
      color: folderColor,
    });

    setEditingFolder(null);
    setFolderName('');
    setFolderColor(FOLDER_COLORS[0]);
  };

  const handleDeleteFolder = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa thư mục này? Các bộ flashcard trong thư mục sẽ không bị xóa.')) {
      deleteFolder(id);
    }
    setMenuOpen(null);
  };

  const openEditModal = (folder: Folder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setFolderColor(folder.color);
    setMenuOpen(null);
  };

  const getFolderSetsCount = (folderId: string) => {
    return sets.filter((s) => s.folder_id === folderId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Thư mục</h1>
          <p className="text-white/70">Tổ chức các bộ flashcard theo chủ đề</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 bg-white text-purple-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Tạo thư mục
        </button>
      </div>

      {/* Folders Grid */}
      {folders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <FolderOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Chưa có thư mục nào
          </h3>
          <p className="text-gray-500 mb-6">
            Tạo thư mục để sắp xếp các bộ flashcard của bạn
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-purple-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Tạo thư mục đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder) => {
            const setsCount = getFolderSetsCount(folder.id);
            return (
              <div
                key={folder.id}
                className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all relative group"
              >
                {/* Menu button */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setMenuOpen(menuOpen === folder.id ? null : folder.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                  {menuOpen === folder.id && (
                    <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-40 z-10">
                      <button
                        onClick={() => openEditModal(folder)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 w-full"
                      >
                        <Edit className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => handleDeleteFolder(folder.id)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-red-600 w-full"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    </div>
                  )}
                </div>

                {/* Folder info */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: folder.color + '20' }}
                  >
                    <FolderOpen className="w-7 h-7" style={{ color: folder.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg truncate">{folder.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <BookOpen className="w-4 h-4" />
                      {setsCount} bộ flashcard
                    </div>
                  </div>
                </div>

                {/* Sets in folder */}
                {setsCount > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {sets
                      .filter((s) => s.folder_id === folder.id)
                      .slice(0, 4)
                      .map((set) => (
                        <span
                          key={set.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-sm"
                        >
                          {set.icon}
                        </span>
                      ))}
                    {setsCount > 4 && (
                      <span className="px-2 py-1 bg-gray-100 rounded-lg text-sm text-gray-500">
                        +{setsCount - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Study button */}
                {setsCount > 0 && (
                  <Link
                    to={`/study?folder=${folder.id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Học tất cả ({setsCount} bộ)
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingFolder) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingFolder ? 'Chỉnh sửa thư mục' : 'Tạo thư mục mới'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingFolder(null);
                  setFolderName('');
                  setFolderColor(FOLDER_COLORS[0]);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Preview */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: folderColor + '20' }}
                >
                  <FolderOpen className="w-7 h-7" style={{ color: folderColor }} />
                </div>
                <div>
                  <p className="font-bold text-gray-800">
                    {folderName || 'Tên thư mục'}
                  </p>
                  <p className="text-sm text-gray-500">0 bộ flashcard</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên thư mục
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="Ví dụ: IELTS, TOEIC, Business..."
                  autoFocus
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu sắc
                </label>
                <div className="flex flex-wrap gap-2">
                  {FOLDER_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFolderColor(color)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        folderColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingFolder(null);
                  setFolderName('');
                  setFolderColor(FOLDER_COLORS[0]);
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={editingFolder ? handleUpdateFolder : handleCreateFolder}
                disabled={!folderName.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                {editingFolder ? 'Lưu' : 'Tạo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
