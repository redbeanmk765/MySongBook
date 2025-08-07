import { create } from 'zustand';
import { Column } from '@/types/Column';

const ALLOWED_DYNAMIC_KEYS = ['col_1', 'col_2', 'col_3', 'col_4', 'col_5'];

interface ColumnStore {
  columns: Column[];
  editingKey: string | null;

  setColumns: (newColumns: Column[]) => void;
  addColumn: (header: string, containerWidth: number) => void;  // containerWidth 추가
  updateColumn: (key: string, newHeader: string) => void;
  deleteColumn: (key: string) => void;
  updateWidth: (key: string, newWidth: number) => void;
  reorderColumns: (fromKey: string, toKey: string) => void;
  setEditingKey: (key: string | null) => void;
  hideColumn: (key: string) => void;
}

export const useColumnStore = create<ColumnStore>((set, get) => ({
  columns: [
    { key: 'tag', header: '태그', isTag: true, isFixed: true, widthRatio: 0.1, pixelWidth: 110 },
    { key: 'singer', header: '가수', isFixed: true, widthRatio: 0.12, pixelWidth: 110 },
    { key: 'name', header: '곡명', isFixed: true, widthRatio: 0.37, pixelWidth: 110 },
    { key: 'memo', header: '메모', widthRatio: 0.15, pixelWidth: 110 },
  ],

  setColumns: (newColumns) => set({ columns: newColumns }),

  addColumn: (header, containerWidth) => {
    const columns = get().columns;
    const usedKeys = columns.map((col) => col.key);
    const availableKey = ALLOWED_DYNAMIC_KEYS.find((key) => !usedKeys.includes(key));
    if (!availableKey) {
      alert("더 이상 컬럼을 추가할 수 없습니다.");
      return;
    }

    const newColPx = 110;
    const newColRatio = newColPx / containerWidth;

    const totalRatio = columns.reduce((sum, col) => sum + col.widthRatio, 0);
    const freeRatio = 1 - totalRatio;

    if (freeRatio >= newColRatio) {
      // 충분한 여유 공간 있을 때는 그냥 추가
      set({
        columns: [
          ...columns,
          { key: availableKey, header, widthRatio: newColRatio, pixelWidth: newColPx },
        ],
      });
      get().setEditingKey(availableKey);
      return;
    }

    // 최소 비율: 110px 대비
    const minRatio = newColPx / containerWidth;

    // 줄일 수 있는 컬럼들 (너비Ratio가 최소비율 초과하는 컬럼)
    const shrinkable = columns.filter((col) => col.widthRatio > minRatio);
    const shrinkableCapacity = shrinkable.reduce((sum, col) => {
      const possible = col.widthRatio - minRatio;
      return sum + (possible > 0 ? possible : 0);
    }, 0);

    if (shrinkableCapacity < newColRatio) {
      alert("더 이상 속성을 추가할 수 없습니다 (최소 너비 제한).");
      return;
    }

    // 줄일 수 있는 컬럼 비율만큼 비례해서 너비 줄이기
    const resizedShrinkables = shrinkable.map((col) => {
      const possible = col.widthRatio - minRatio;
      const shrinkAmount = (possible / shrinkableCapacity) * newColRatio;
      return {
        ...col,
        widthRatio: col.widthRatio - shrinkAmount,
      };
    });

    // 줄일 수 없는 컬럼 (이미 최소비율 이하)
    const nonShrinkables = columns.filter((col) => col.widthRatio <= minRatio);

    // 새 컬럼 추가
    const newColumns = [
      ...resizedShrinkables,
      ...nonShrinkables,
      { key: availableKey, header, widthRatio: newColRatio, pixelWidth: newColPx },
    ];

    set({ columns: newColumns });
    get().setEditingKey(availableKey);
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
        col.key === key
          ? {
              ...col,
              pixelWidth: Math.max(newWidth, 110),
              widthRatio: Math.max(newWidth, 110) / window.innerWidth,
            }
          : col
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

  hideColumn: (key) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.key === key ? { ...col, isHidden: !col.isHidden } : col
      ),
    })),

  editingKey: null,
  setEditingKey: (key: string | null) => set({ editingKey: key }),
}));
