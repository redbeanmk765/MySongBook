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
    { key: 'tag', header: '태그', isTag: true, isFixed: true, widthRatio: 0.1, pixelWidth: 110 },
    { key: 'singer', header: '가수', isFixed: true, widthRatio: 0.12, pixelWidth: 110 },
    { key: 'name', header: '곡명', isFixed: true, widthRatio: 0.37, pixelWidth: 110 },
    { key: 'memo', header: '메모', widthRatio: 0.15, pixelWidth: 110 },
  ],

  setColumns: (newColumns) => set({ columns: newColumns }),

  addColumn: (header) => {
    const columns = get().columns;
    const usedKeys = columns.map((col) => col.key);
    const availableKey = ALLOWED_DYNAMIC_KEYS.find((key) => !usedKeys.includes(key));
    if (!availableKey) {
      alert("더 이상 컬럼을 추가할 수 없습니다 (최대 5개).");
      return;
    }

    const totalRatio = columns.reduce((sum, col) => sum + col.widthRatio, 0);
    const freeSpace = 1 - totalRatio;
    const newColWidth = 0.1;

    if (freeSpace >= newColWidth) {
      // 빈 공간 충분 → 바로 추가
      set({
        columns: [
          ...columns,
          { key: availableKey, header, widthRatio: newColWidth, pixelWidth: 110 },
        ],
      });
    } else {
      // 빈 공간 부족 → 기존 컬럼 비율 비례 축소 후 추가
      const neededSpace = newColWidth - freeSpace;
      const scaleRatio = (totalRatio - neededSpace) / totalRatio;

      const resizedColumns = columns.map((col) => ({
        ...col,
        widthRatio: col.widthRatio * scaleRatio,
      }));

      resizedColumns.push({
        key: availableKey,
        header,
        widthRatio: newColWidth,
        pixelWidth: 110,
      });

      set({ columns: resizedColumns });
    }
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
        col.key === key ? { ...col, grow: Math.max(newWidth, 110) } : col
      ),
    })),

  reorderColumns: (fromKey, toKey) => {
    const columns = [...get().columns];
    const fromIndex = columns.findIndex((col) => col.key === fromKey);
    const toIndex = columns.findIndex((col) => col.key === toKey);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

    const [moved] = columns.splice(fromIndex, 1);
    columns.splice(toIndex, 0, moved);
    set({ columns });
  },
}));
