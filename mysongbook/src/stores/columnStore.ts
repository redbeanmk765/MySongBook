// stores/columnStore.ts
import { create } from 'zustand';
import { Column } from '@/types/Column';

const ALLOWED_DYNAMIC_KEYS = ['col_1', 'col_2', 'col_3', 'col_4', 'col_5'];

interface ColumnStore {
  columns: Column[];

  setColumns: (newColumns: Column[]) => void;
  addColumn: (header: string) => void;
  updateColumn: (key: string, newHeader: string) => void;
  deleteColumn: (key: string) => void;
}

export const useColumnStore = create<ColumnStore>((set, get) => ({
  // 초기 고정 컬럼
  columns: [
    { key: 'tag', header: '태그', isTag: true, isFixed: true }, 
    { key: 'singer', header: '가수', isFixed: true },
    { key: 'name', header: '곡명', isFixed: true },
    { key: 'memo', header: '메모' },
  ],

  setColumns: (newColumns) => set({ columns: newColumns }),

  addColumn: (header) => {
    const usedKeys = get().columns.map((col) => col.key);
    const availableKey = ALLOWED_DYNAMIC_KEYS.find((key) => !usedKeys.includes(key));

    if (!availableKey) {
      alert("더 이상 컬럼을 추가할 수 없습니다 (최대 5개).");
      return;
    }

    set((state) => ({
      columns: [
        ...state.columns,
        {
          key: availableKey,
          header,
        },
      ],
    }));
  },

  updateColumn: (key, newHeader) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.key === key ? { ...col, header: newHeader } : col
      ),
    })),

  deleteColumn: (key) =>
    set((state) => ({
      columns: state.columns.filter((col) => col.key !== key || col.isFixed),
    })),
}));
