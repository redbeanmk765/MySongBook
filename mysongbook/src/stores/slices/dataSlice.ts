// stores/slices/dataSlice.ts

import { produce } from 'immer';
import { StateCreator } from 'zustand';
import { RowData } from '@/types/RowData';
import { useHistoryStore } from '@/stores/historyStore';
import { ChangeLog } from '@/types/ChangeLog';

export interface DataSlice {
  data: RowData[];
  addRow: (newData: RowData) => void;
  updateRow: (id: number, updatedData: Partial<RowData>) => void;
  deleteRow: (id: number) => void;
}

export const createDataSlice: StateCreator<any, [], [], DataSlice> = (set, get) => ({
  data: [],


  addRow: (newData) => {
    useHistoryStore.getState().push({ type: "addRow", row: newData });
    set((state: any) => ({ data: [...state.data, newData] }));
    console.log(get().data);
  },

  updateRow: (id, updatedData) => {
    const { data } = get();
    const prev = data.find((row: RowData) => row.id === id);
    if (!prev) return;
    const next = { ...prev, ...updatedData };

    useHistoryStore.getState().push({ type: "updateRow", id, prev, next });
    set({
      data: produce(data, (draft: RowData[]) => {
        const index = draft.findIndex((row: RowData) => row.id === id);
        if (index !== -1) draft[index] = next;
      }),
    });
  },

  deleteRow: (id) => {
    const { data } = get();
    const row = data.find((row: RowData) => row.id === id);
    if (!row) return;

    useHistoryStore.getState().push({ type: "deleteRow", row });
    set({
      data: produce(data, (draft: RowData[]) => {
        const index = draft.findIndex((row: RowData) => row.id === id);
        if (index !== -1) draft.splice(index, 1);
      }),
    });
  },
});