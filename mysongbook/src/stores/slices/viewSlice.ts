import { StateCreator } from 'zustand';
import { RowData } from '@/types/RowData';

export interface ViewSlice {
  editingCell: { rowId: number; field: keyof RowData } | null;
  selectedTag: string | null;
  sortKey: keyof RowData | null;
  sortDirection: "asc" | "desc";
  max: number;
  setEditingCell: (cell: { rowId: number; field: keyof RowData } | null) => void;
  setSelectedTag: (tag: string | null) => void;
  setSortKey: (key: keyof RowData | null) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  setMax: (max: number) => void;
}

// T에 전체 스토어 타입이 들어갑니다.
export const createViewSlice: StateCreator<any, [], [], ViewSlice> = (set) => ({
  editingCell: null,
  selectedTag: null,
  sortKey: "tag",
  sortDirection: "asc",
  max: 50,

  setEditingCell: (editingCell) => set({ editingCell }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  setSortKey: (sortKey) => set({ sortKey }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  setMax: (max) => set({ max }),
});