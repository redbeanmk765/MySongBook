import { create } from 'zustand';
import { produce } from 'immer';
import { RowData } from '@/types/RowData';
import { sortData } from '@/utils/sortUtils';

interface ChangeLog {
  id: number;
  type: "update" | "delete" | "add";
  prevRow?: RowData;
  nextRow?: RowData;
}

interface SheetStore {
  // 상태
  data: RowData[];
  origin: RowData[];
  editingCell: { rowId: number; field: keyof RowData } | null;
  selectedTag: string | null;
  sortKey: keyof RowData | null;
  sortDirection: "asc" | "desc";
  undoStack: ChangeLog[];
  redoStack: ChangeLog[];
  max: number;

  // 액션
  loadData: () => Promise<void>;
  setData: (data: RowData[]) => void;
  setOrigin: (origin: RowData[]) => void;
  setEditingCell: (cell: { rowId: number; field: keyof RowData } | null) => void;
  setSelectedTag: (tag: string | null) => void;
  setSortKey: (key: keyof RowData | null) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  setMax: (max: number) => void;

  // 데이터 조작
  addRow: (newData: RowData) => void;
  updateRow: (id: number, updatedData: Partial<RowData>) => void;
  deleteRow: (id: number) => void;
  renameTagInData: (oldTag: string, newTag: string) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  
  // 유틸리티
  getTagList: () => string[];
  createBlankData: () => RowData;
}

export const useSheetStore = create<SheetStore>((set, get) => ({
  // 초기 상태
  data: [],
  origin: [],
  editingCell: null,
  selectedTag: null,
  sortKey: "tag",
  sortDirection: "asc",
  undoStack: [],
  redoStack: [],
  max: 50,

  // 상태 설정
  loadData: async () => {
    // API 라우트나 public 폴더의 파일을 fetch 할 수 있습니다.
    // 예시: public/data.json
    try {
      const response = await fetch('/data.json'); 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData: RowData[] = await response.json();
      // 로드된 데이터로 data와 origin 상태를 모두 업데이트합니다.
      // undo/redo 스택도 초기화합니다.
      set({ data: jsonData, origin: jsonData, undoStack: [], redoStack: [] });
    } catch (error) {
      console.error("Failed to load sheet data:", error);
      // 에러 처리 로직 (예: 에러 상태 설정)
    }
  },
  
  setData: (data) => set({ data }),
  setOrigin: (origin) => set({ origin }),
  setEditingCell: (editingCell) => set({ editingCell }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  setSortKey: (sortKey) => set({ sortKey }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  setMax: (max) => set({ max }),

  // 데이터 조작
  addRow: (newData) => {
    const { data, undoStack, redoStack } = get();
    set({
      data: [...data, newData],
      undoStack: [...undoStack, { id: newData.id, type: "add", nextRow: newData }],
      redoStack: []
    });
  },

  updateRow: (id, updatedData) => {
    const { data, undoStack, redoStack } = get();
    const prevRow = data.find(row => row.id === id);
    if (!prevRow) return;
    
    const nextRow = { ...prevRow, ...updatedData };
    
    set({
      data: produce(data, (draft) => {
        const index = draft.findIndex((item) => item.id === id);
        if (index !== -1) {
          draft[index] = { ...draft[index], ...updatedData };
        }
      }),
      undoStack: [...undoStack, { id, type: "update", prevRow, nextRow }],
      redoStack: []
    });
  },

  deleteRow: (id) => {
    const { data, undoStack, redoStack } = get();
    const target = data.find((row) => row.id === id);
    if (!target) return;

    set({
      data: produce(data, (draft) => {
        const index = draft.findIndex((item) => item.id === id);
        if (index !== -1) {
          draft.splice(index, 1);
        }
      }),
      undoStack: [...undoStack, { id, type: "delete", prevRow: target }],
      redoStack: []
    });
  },

  renameTagInData: (oldTag, newTag) => set((state) => ({
    data: state.data.map(row => 
      row.tag === oldTag ? { ...row, tag: newTag } : row
    ),
  })),
  

  // Undo/Redo
  undo: () => {
    const { data, undoStack, redoStack } = get();
    if (undoStack.length === 0) return;

    const last = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    const newRedoStack = [...redoStack, last];

    let newData = data;

    if (last.type === "update" && last.prevRow) {
      newData = produce(data, (draft) => {
        const index = draft.findIndex((row) => row.id === last.id);
        if (index !== -1) draft[index] = last.prevRow!;
      });
    } else if (last.type === "add") {
      newData = data.filter((row) => row.id !== last.id);
    } else if (last.type === "delete" && last.prevRow) {
      newData = [...data, last.prevRow!];
    }

    set({
      data: newData,
      undoStack: newUndoStack,
      redoStack: newRedoStack
    });
  },

  redo: () => {
    const { data, undoStack, redoStack } = get();
    if (redoStack.length === 0) return;

    const last = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    const newUndoStack = [...undoStack, last];

    let newData = data;

    if (last.type === "update" && last.nextRow) {
      newData = produce(data, (draft) => {
        const index = draft.findIndex((row) => row.id === last.id);
        if (index !== -1) draft[index] = last.nextRow!;
      });
    } else if (last.type === "add" && last.nextRow) {
      newData = [...data, last.nextRow!];
    } else if (last.type === "delete") {
      newData = data.filter((row) => row.id !== last.id);
    }

    set({
      data: newData,
      undoStack: newUndoStack,
      redoStack: newRedoStack
    });
  },

  // 유틸리티
  getTagList: () => {
    const { data } = get();
    return Array.from(new Set(data.map((item) => item.tag)));
  },

  createBlankData: () => {
    const { data, selectedTag, getTagList } = get();
    const newId = Math.max(0, ...data.map((d) => d.id)) + 1;
    const tag = selectedTag || getTagList()[0] || "";
    return { id: newId, tag: tag, singer: "", name: "", memo: "", col_1: "", col_2: "", col_3: "", col_4: "", col_5: ""};
  }
})); 