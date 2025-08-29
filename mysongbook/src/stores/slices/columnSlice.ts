// stores/slices/columnSlice.ts

import { StateCreator } from 'zustand';
import { Column } from '@/types/Column';
import { useHistoryStore } from '@/stores/historyStore';
import { produce } from 'immer'; 

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
    { key: 'singer', header: '가수', widthRatio: 0.12, pixelWidth: 110 },
    { key: 'name', header: '곡명', isFixed: true, widthRatio: 0.37, pixelWidth: 110 },
    { key: 'memo', header: '메모', widthRatio: 0.15, pixelWidth: 110 },
  ],
  editingKey: null,
  setEditingKey: (key: string | null) => set({ editingKey: key }),

  setColumns: (updater) =>
    set((state: any) => {
      const nextColumns = typeof updater === 'function' ? updater(state.columns) : updater;
      return { columns: nextColumns };
    }),

  addColumn: (header, containerWidth) => {
    const columns = (get() as any).columns;
    const prevColumns = [...columns];
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

    // 첫 번째 조건: 남은 공간이 충분할 경우
    if (freeRatio >= newColRatio) {
      const nextColumns = [
        ...columns,
        { key: availableKey, header, widthRatio: newColRatio, pixelWidth: newColPx },
      ];
      useHistoryStore.getState().push({
        type: "addColumn",
        prev: prevColumns,
        next: nextColumns,
      });
      set({ columns: nextColumns });
      (get() as any).setEditingKey(availableKey);
      return;
    }

    // 두 번째 조건: 기존 컬럼 너비를 줄여야 할 경우
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

    const nextColumns = produce<Column[]>(columns, (draft: Column[]) => {
      draft.forEach(col => {
        const isShrinkable = col.widthRatio > minRatio;
        if (isShrinkable) {
          const possible = col.widthRatio - minRatio;
          const shrinkAmount = (possible / shrinkableCapacity) * newColRatio;
          col.widthRatio -= shrinkAmount;
        }
      });
      draft.push({ key: availableKey, header, widthRatio: newColRatio, pixelWidth: newColPx });
    }); 

    useHistoryStore.getState().push({
      type: "addColumn",
      prev: prevColumns,
      next: nextColumns,
    });

    set({ columns: nextColumns });
    (get() as any).setEditingKey(availableKey);
  },

  deleteColumn: (key) => {
    const prevColumns = [...(get() as any).columns]; // 현재 상태 백업
    const target = prevColumns.find(col => col.key === key);

    // 못 찾았거나 고정 컬럼이면 중단
    if (!target || target.isFixed) {
      return;
    }

    // immer로 next 상태 만들기
    const nextColumns = produce<Column[]>(prevColumns, (draft) => {
      const index = draft.findIndex(col => col.key === key);
      if (index !== -1) {
        draft.splice(index, 1); // 배열에서 해당 컬럼 제거
      }
    });

    // historyStore에 기록 (undo/redo 용)
    useHistoryStore.getState().push({
      type: "deleteColumn",
      prev: prevColumns,
      next: nextColumns,
    });

    // 상태 반영
    set({ columns: nextColumns });
  },
    
  updateColumn: (key, newHeader) =>{
    useHistoryStore.getState().push({ 
      type: "updateColumnHeader", 
      key, 
      prev: (get() as any).columns.find((
        (col: Column) => col.key === key
      )).header,
      next: newHeader
    });
    set((state: any) => ({
      columns: state.columns.map((col: Column) =>
        col.key === key ? { ...col, header: newHeader } : col
      ),
    }))},

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
    const columns = [...(get() as any).columns];
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