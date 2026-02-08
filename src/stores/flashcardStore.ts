import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Flashcard, FlashcardSet, Folder } from '../types';

interface FlashcardState {
  folders: Folder[];
  sets: FlashcardSet[];
  cards: Flashcard[];
  currentSet: FlashcardSet | null;
  currentFolder: Folder | null;
  
  // Folder actions
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  setCurrentFolder: (folder: Folder | null) => void;
  
  // Set actions
  addSet: (set: FlashcardSet) => void;
  updateSet: (id: string, updates: Partial<FlashcardSet>) => void;
  deleteSet: (id: string) => void;
  setCurrentSet: (set: FlashcardSet | null) => void;
  
  // Card actions
  addCard: (card: Flashcard) => void;
  updateCard: (id: string, updates: Partial<Flashcard>) => void;
  deleteCard: (id: string) => void;
  addMultipleCards: (cards: Flashcard[]) => void;
  
  // Utility
  getSetCards: (setId: string) => Flashcard[];
  getFolderSets: (folderId: string) => FlashcardSet[];
  getRandomCards: (count: number, setIds?: string[]) => Flashcard[];
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      folders: [],
      sets: [],
      cards: [],
      currentSet: null,
      currentFolder: null,

      // Folder actions
      addFolder: (folder) => set((state) => ({ folders: [...state.folders, folder] })),
      updateFolder: (id, updates) =>
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),
      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          sets: state.sets.map((s) => (s.folder_id === id ? { ...s, folder_id: undefined } : s)),
        })),
      setCurrentFolder: (folder) => set({ currentFolder: folder }),

      // Set actions
      addSet: (newSet) => set((state) => ({ sets: [...state.sets, newSet] })),
      updateSet: (id, updates) =>
        set((state) => ({
          sets: state.sets.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
      deleteSet: (id) =>
        set((state) => ({
          sets: state.sets.filter((s) => s.id !== id),
          cards: state.cards.filter((c) => c.set_id !== id),
        })),
      setCurrentSet: (currentSet) => set({ currentSet }),

      // Card actions
      addCard: (card) =>
        set((state) => {
          const newCards = [...state.cards, card];
          const sets = state.sets.map((s) =>
            s.id === card.set_id ? { ...s, cards_count: s.cards_count + 1 } : s
          );
          return { cards: newCards, sets };
        }),
      updateCard: (id, updates) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCard: (id) =>
        set((state) => {
          const card = state.cards.find((c) => c.id === id);
          if (!card) return state;
          return {
            cards: state.cards.filter((c) => c.id !== id),
            sets: state.sets.map((s) =>
              s.id === card.set_id ? { ...s, cards_count: Math.max(0, s.cards_count - 1) } : s
            ),
          };
        }),
      addMultipleCards: (newCards) =>
        set((state) => {
          const allCards = [...state.cards, ...newCards];
          const cardCountBySet: Record<string, number> = {};
          newCards.forEach((card) => {
            cardCountBySet[card.set_id] = (cardCountBySet[card.set_id] || 0) + 1;
          });
          const sets = state.sets.map((s) =>
            cardCountBySet[s.id] ? { ...s, cards_count: s.cards_count + cardCountBySet[s.id] } : s
          );
          return { cards: allCards, sets };
        }),

      // Utility
      getSetCards: (setId) => get().cards.filter((c) => c.set_id === setId),
      getFolderSets: (folderId) => get().sets.filter((s) => s.folder_id === folderId),
      getRandomCards: (count, setIds) => {
        const state = get();
        let availableCards = setIds
          ? state.cards.filter((c) => setIds.includes(c.set_id))
          : state.cards;
        
        // Shuffle and take count
        const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
      },
    }),
    {
      name: 'flashcard-storage',
    }
  )
);
