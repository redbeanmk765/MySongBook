import { create } from 'zustand';
import { Column } from '@/types/Column';

const ALLOWED_DYNAMIC_KEYS = ['col_1', 'col_2', 'col_3', 'col_4', 'col_5'];

interface ColumnStore {
  columns: Column[];

  setColumns: (newColumns: Column[]) => void;
  addColumn: (header: string) => void;
  updateColumn: (key: string, newHeader: string) => void;
  deleteColumn: (key: string) => void;
  updateWidth: (key: string, newWidth: number) => void;
  reorderColumns: (fromKey: string, toKey: string) => void;
}

export const useColumnStore = create<ColumnStore>((set, get) => ({
  columns: [
    { key: 'tag', header: '태그', isTag: true, isFixed: true, widthRatio: 0.1 },
    { key: 'singer', header: '가수', isFixed: true, widthRatio: 0.2 },
    { key: 'name', header: '곡명', isFixed: true, widthRatio: 0.4 },
    { key: 'memo', header: '메모', widthRatio: 0.1},
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
        { key: availableKey, header,  widthRatio: 0.1 }, // 새 column의 기본 grow = 1
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

  updateWidth: (key, newWidth) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.key === key ? { ...col, grow: Math.max(newWidth, 100) } : col
      ),
    })),

  reorderColumns: (fromKey, toKey) => {
    const columns = [...get().columns];
    const fromIndex = columns.findIndex(col => col.key === fromKey);
    const toIndex = columns.findIndex(col => col.key === toKey);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

    const [moved] = columns.splice(fromIndex, 1);
    columns.splice(toIndex, 0, moved);
    set({ columns });
  },
}));
