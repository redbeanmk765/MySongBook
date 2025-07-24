// stores/historyStore.ts
import { create } from "zustand";
import { ChangeLog } from "@/types/ChangeLog";
import { performUndo, performRedo } from "@/utils/historyActions";

interface HistoryStore {
  undoStack: ChangeLog[];
  redoStack: ChangeLog[];
  push: (log: ChangeLog) => void;
  undo: () => void;
  redo: () => void;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  undoStack: [],
  redoStack: [],

  push: (log) => {
    set((state) => ({
      undoStack: [...state.undoStack, log],
      redoStack: [],
    }));
  },

  undo: () => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return;

    const log = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    // 여기서 switch 문으로 실제 상태 되돌림 수행
    performUndo(log);

    set({
      undoStack: newUndoStack,
      redoStack: [...redoStack, log],
    });
  },

  redo: () => {
    const { undoStack, redoStack } = get();
    if (redoStack.length === 0) return;

    const log = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    performRedo(log);

    set({
      undoStack: [...undoStack, log],
      redoStack: newRedoStack,
    });
  },
}));
