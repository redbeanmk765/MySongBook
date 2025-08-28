// stores/slices/columnSlice.ts
import { StateCreator } from 'zustand';
import { Column } from '@/types/Column';
import { useHistoryStore } from '@/stores/historyStore';

const ALLOWED_DYNAMIC_KEYS = ['col_1', 'col_2', 'col_3', 'col_4', 'col_5'];

export interface ColumnSlice {
  columns: Column[];
  editingKey: string | null;

  setColumns: (updater: ((prev: Column[]) => Column[]) | Column[]) => void;
  addColumn: (header: string, containerWidth: number) => void;
  updateColumn: (key: string, newHeader: string) => void;
  deleteColumn: (key: string) => void;
  updateWidth: (key: string, newWidth: number) => void;
  reorderColumns: (fromKey: string, toKey: string) => void;
  setEditingKey: (key: string | null) => void;
  hideColumn: (key: string) => void;
}

export const createColumnSlice: StateCreator<any, [], [], ColumnSlice> = (set, get) => ({
  columns: [
    { key: 'tag', header: '태그', isTag: true, isFixed: true, widthRatio: 0.1, pixelWidth: 110 },
    { key: 'singer', header: '가수', isFixed: true, widthRatio: 0.12, pixelWidth: 110 },
    { key: 'name', header: '곡명', isFixed: true, widthRatio: 0.37, pixelWidth: 110 },
    { key: 'memo', header: '메모', widthRatio: 0.15, pixelWidth: 110 },
  ],
  editingKey: null,
  setEditingKey: (key: string | null) => set({ editingKey: key }),

  setColumns: (updater) =>
    set((state: any) => { // T에 전체 스토어 타입이 들어가므로 any로 캐스팅
      const nextColumns = typeof updater === 'function' ? updater(state.columns) : updater;
      return { columns: nextColumns };
    }),

  addColumn: (header, containerWidth) => {
    const columns = (get() as any).columns; // T에 전체 스토어 타입이 들어가므로 any로 캐스팅
    const usedKeys = columns.map((col: Column) => col.key);
    const availableKey = ALLOWED_DYNAMIC_KEYS.find((key) => !usedKeys.includes(key));
    if (!availableKey) {
      alert("더 이상 컬럼을 추가할 수 없습니다.");
      return;
    }

    const newColPx = 110;
    const newColRatio = newColPx / containerWidth;
    const totalRatio = columns.reduce((sum: number, col: Column) => sum + col.widthRatio, 0);
    const freeRatio = 1 - totalRatio;

    if (freeRatio >= newColRatio) {
      set((state: any) => ({
        columns: [
          ...state.columns,
          { key: availableKey, header, widthRatio: newColRatio, pixelWidth: newColPx },
        ],
      }));
      (get() as any).setEditingKey(availableKey);
      return;
    }

    const minRatio = newColPx / containerWidth;
    const shrinkable = columns.filter((col: Column) => col.widthRatio > minRatio);
    const shrinkableCapacity = shrinkable.reduce((sum: number, col: Column) => {
      const possible = col.widthRatio - minRatio;
      return sum + (possible > 0 ? possible : 0);
    }, 0);

    if (shrinkableCapacity < newColRatio) {
      alert("더 이상 속성을 추가할 수 없습니다 (최소 너비 제한).");
      return;
    }

    const resizedShrinkables = shrinkable.map((col: Column) => {
      const possible = col.widthRatio - minRatio;
      const shrinkAmount = (possible / shrinkableCapacity) * newColRatio;
      return {
        ...col,
        widthRatio: col.widthRatio - shrinkAmount,
      };
    });

    const nonShrinkables = columns.filter((col: Column) => col.widthRatio <= minRatio);

    const newColumns = [
      ...resizedShrinkables,
      ...nonShrinkables,
      { key: availableKey, header, widthRatio: newColRatio, pixelWidth: newColPx },
    ];

    useHistoryStore.getState().push({
      type: "addColumn",
      prev: columns,
      next: newColumns,
    });

    set({ columns: newColumns });
    (get() as any).setEditingKey(availableKey);
  },

  updateColumn: (key, newHeader) =>
    set((state: any) => ({
      columns: state.columns.map((col: Column) =>
        col.key === key ? { ...col, header: newHeader } : col
      ),
    })),

  deleteColumn: (key) =>
    set((state: any) => ({
      columns: state.columns.filter((col: Column) => col.key !== key || col.isFixed),
    })),

  updateWidth: (key, newWidth) =>
    set((state: any) => ({
      columns: state.columns.map((col: Column) =>
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
    const columns = [...(get() as any).columns]; // T에 전체 스토어 타입이 들어가므로 any로 캐스팅
    const fromIndex = columns.findIndex((col: Column) => col.key === fromKey);
    const toIndex = columns.findIndex((col: Column) => col.key === toKey);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

    const [moved] = columns.splice(fromIndex, 1);
    columns.splice(toIndex, 0, moved);
    set({ columns });
  },

  hideColumn: (key) =>
    set((state: any) => ({
      columns: state.columns.map((col: Column) =>
        col.key === key ? { ...col, isHidden: !col.isHidden } : col
      ),
    })),
});