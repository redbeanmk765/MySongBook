// stores/sheetStore.ts

import { create } from 'zustand';
import { RowData } from '@/types/RowData';
import { useHistoryStore } from './historyStore';
import { createDataSlice, DataSlice } from './slices/dataSlice';
import { createViewSlice, ViewSlice } from './slices/viewSlice';
import { createTagSlice, TagSlice } from './slices/tagSlice';
import { createColumnSlice, ColumnSlice } from './slices/columnSlice';

interface SheetActions {
  loadData: () => Promise<void>;
  getTagList: () => string[];
  createBlankData: () => RowData;
  setData: (data: RowData[]) => void;
  undo: () => void;
  redo: () => void;
}

type SheetStore = DataSlice & ViewSlice & TagSlice & ColumnSlice & SheetActions;

export const useSheetStore = create<SheetStore>((set, get, store) => {
  useHistoryStore.getState()._setStore(set);

  return {
    setData: (data) => {
      set({ data });
    },

    ...createDataSlice(set, get as any, store as any),
    ...createViewSlice(set, get as any, store as any),
    ...createTagSlice(set, get as any, store as any),
    ...createColumnSlice(set, get as any, store as any),

    // undo/redo 로직은 historyStore에 위임
    undo: () => useHistoryStore.getState().undo(),
    redo: () => useHistoryStore.getState().redo(),

    loadData: async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const jsonData: RowData[] = await response.json();
        set({ data: jsonData });
        useHistoryStore.getState().clearHistory();
      } catch (error) {
        console.error("Failed to load sheet data:", error);
      }
    },

    getTagList: () => {
      const { data } = get();
      return Array.from(new Set(data.map((item) => item.tag)));
    },

    createBlankData: () => {
      const { data, selectedTag, getTagList } = get();
      const newId = Math.max(0, ...data.map((d) => d.id)) + 1;
      const tag = selectedTag || getTagList()[0] || "";
      return { id: newId, tag: tag, singer: "", name: "", memo: "", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" };
    }
  };
});