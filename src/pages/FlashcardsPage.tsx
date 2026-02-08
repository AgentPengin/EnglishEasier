import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFlashcardStore } from '../stores/flashcardStore';
import {
  Plus,
  Search,
  BookOpen,
  MoreVertical,
  Edit,
  Trash2,
  Play,
  FolderOpen,
  Grid,
  List,
  FolderPlus,
  FolderMinus,
} from 'lucide-react';

export default function FlashcardsPage() {
  const { sets, folders, deleteSet, updateSet } = useFlashcardStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [movingSet, setMovingSet] = useState<string | null>(null);

  // Filter sets based on search and folder
  const filteredSets = sets.filter((set) => {
    const matchesSearch = set.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === null || set.folder_id === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const handleDeleteSet = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bộ flashcard này?')) {
      deleteSet(id);
    }
    setMenuOpen(null);
  };

  const handleMoveToFolder = (setId: string, folderId: string | undefined) => {
    updateSet(setId, { folder_id: folderId });
    setMovingSet(null);
    setMenuOpen(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Flashcards của tôi</h1>
          <p className="text-white/70">Quản lý tất cả bộ flashcard của bạn</p>
        </div>
        <Link
          to="/create-set"
          className="flex items-center justify-center gap-2 bg-white text-purple-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Tạo bộ mới
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bộ flashcard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>

          {/* Folder filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedFolder || ''}
              onChange={(e) => setSelectedFolder(e.target.value || null)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            >
              <option value="">Tất cả thư mục</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>

            {/* View toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-white/50'
                }`}
              >
                <Grid className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-white/50'
                }`}
              >
                <List className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sets Grid/List */}
      {filteredSets.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có bộ flashcard nào'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? 'Thử tìm kiếm với từ khóa khác'
              : 'Tạo bộ flashcard đầu tiên để bắt đầu học'}
          </p>
          {!searchQuery && (
            <Link
              to="/create-set"
              className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-purple-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              Tạo bộ đầu tiên
            </Link>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSets.map((set) => (
            <div
              key={set.id}
              className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all group relative"
            >
              {/* Menu button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setMenuOpen(menuOpen === set.id ? null : set.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
                {menuOpen === set.id && (
                  <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48 z-10">
                    <Link
                      to={`/edit-set/${set.id}`}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa
                    </Link>
                    <button
                      onClick={() => setMovingSet(set.id)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 w-full"
                    >
                      <FolderPlus className="w-4 h-4" />
                      Di chuyển vào thư mục
                    </button>
                    {set.folder_id && (
                      <button
                        onClick={() => handleMoveToFolder(set.id, undefined)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-orange-600 w-full"
                      >
                        <FolderMinus className="w-4 h-4" />
                        Bỏ khỏi thư mục
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSet(set.id)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-red-600 w-full"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                )}
                {movingSet === set.id && (
                  <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48 z-20">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b">
                      Chọn thư mục
                    </div>
                    {folders.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        Chưa có thư mục nào
                      </div>
                    ) : (
                      folders.map((folder) => (
                        <button
                          key={folder.id}
                          onClick={() => handleMoveToFolder(set.id, folder.id)}
                          className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full ${
                            set.folder_id === folder.id ? 'text-purple-600 bg-purple-50' : 'text-gray-700'
                          }`}
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: folder.color }}
                          />
                          {folder.name}
                        </button>
                      ))
                    )}
                    <button
                      onClick={() => setMovingSet(null)}
                      className="flex items-center justify-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-500 w-full border-t mt-1"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>

              {/* Set info */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ backgroundColor: set.color + '20' }}
                >
                  {set.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-lg truncate">{set.name}</h3>
                  {set.description && (
                    <p className="text-gray-500 text-sm truncate">{set.description}</p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {set.cards_count} từ
                </div>
                {set.folder_id && (
                  <div className="flex items-center gap-1">
                    <FolderOpen className="w-4 h-4" />
                    {folders.find((f) => f.id === set.folder_id)?.name}
                  </div>
                )}
              </div>

              {/* Actions */}
              <Link
                to={`/study/${set.id}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <Play className="w-5 h-5" />
                Học ngay
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl divide-y divide-gray-100">
          {filteredSets.map((set) => (
            <div
              key={set.id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: set.color + '20' }}
              >
                {set.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{set.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{set.cards_count} từ</span>
                  {set.folder_id && (
                    <span className="flex items-center gap-1">
                      <FolderOpen className="w-3 h-3" />
                      {folders.find((f) => f.id === set.folder_id)?.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/edit-set/${set.id}`}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDeleteSet(set.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <Link
                  to={`/study/${set.id}`}
                  className="flex items-center gap-2 bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
                >
                  <Play className="w-4 h-4" />
                  Học
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
