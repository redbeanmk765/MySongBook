import { create } from 'zustand';
import { Column } from '@/types/Column';
import { nanoid } from 'nanoid';

interface ColumnStore {
  columns: Column[];

  addColumn: (header: string) => void;
  updateColumn: (key: string, newHeader: string) => void;
  deleteColumn: (key: string) => void;
  setColumns: (columns: Column[]) => void;
}

export const useColumnStore = create<ColumnStore>((set) => ({
  columns: [
    { key: 'tag', header: '태그', isTag: true, isFixed: true },
    { key: 'singer', header: '가수', isFixed: true },
    { key: 'name', header: '제목', isFixed: true },
    { key: 'memo', header: '메모', isFixed: true },
    { key: 'col_1', header: '컬럼1' },
    { key: 'col_2', header: '컬럼2' },
    { key: 'col_3', header: '컬럼3' },
    { key: 'col_4', header: '컬럼4' },
    { key: 'col_5', header: '컬럼5' },
  ],

  addColumn: (header) =>
    set((state) => {
      const index = state.columns.filter(col => col.key.startsWith('col_')).length + 1;
      const newKey = `col_${index}`;
      const newColumn = { key: newKey, header, isFixed: false };
      return { columns: [...state.columns, newColumn] };
    }),

  updateColumn: (key, newHeader) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.key === key ? { ...col, header: newHeader } : col
      ),
    })),

  deleteColumn: (key) =>
    set((state) => ({
      columns: state.columns.filter((col) => col.key !== key),
    })),

  setColumns: (columns) => set({ columns }),
}));
