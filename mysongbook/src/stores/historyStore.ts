// stores/historyStore.ts

import { create } from "zustand";
import { ChangeLog } from "@/types/ChangeLog";
import { produce } from 'immer';
import { RowData } from '@/types/RowData';
import { Column } from '@/types/Column';

interface HistoryStore {
  undoStack: ChangeLog[];
  redoStack: ChangeLog[];
  push: (log: ChangeLog) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  _setStore: (set: (updater: any) => void) => void;
}

export const useHistoryStore = create<HistoryStore>((set, get) => {
  let _setSheetStore: (updater: any) => void;

  return {
    undoStack: [],
    redoStack: [],

    _setStore: (setFn) => {
      _setSheetStore = setFn;
    },

    push: (log) => {

      set((state) => ({
        undoStack: [...state.undoStack, log],
        redoStack: [],
      }));
    },

    undo: () => {
      const { undoStack, redoStack } = get();
      if (undoStack.length === 0 || !_setSheetStore) return;

      const log = undoStack[undoStack.length - 1];
      const newUndoStack = undoStack.slice(0, -1);

      switch (log.type) {
        case "updateRow":
          _setSheetStore((state: any) => ({
            data: produce(state.data, (draft: RowData[]) => {
              const index = draft.findIndex((row: RowData) => row.id === log.id);
              if (index !== -1) draft[index] = log.prev;
            }),
          }));
          break;
        case "addRow":
          _setSheetStore((state: any) => ({
            data: state.data.filter((row: RowData) => row.id !== log.row.id),
          }));
          break;
        case "deleteRow":
          _setSheetStore((state: any) => ({
            data: [...state.data, log.row],
          }));
          break;
        case "addColumn":
          _setSheetStore((state: any) => ({
            columns: log.prev,
          }));
          break
        case "deleteColumn":
          _setSheetStore((state: any) => ({
            columns: log.prev,
          }));
          break
        case "updateColumnHeader":
          _setSheetStore((state: any) => ({
            columns: produce(state.columns, (draft: Column[]) => {
              const index = draft.findIndex((col: Column) => col.key === log.key);
              if (index !== -1) draft[index].header = log.prev;
            }),
        }));
        break;
        
        default:
          console.warn("Unhandled undo log type:", log.type);
      }

      set({
        undoStack: newUndoStack,
        redoStack: [...redoStack, log],
      });
    },

    redo: () => {
      const { undoStack, redoStack } = get();
      if (redoStack.length === 0 || !_setSheetStore) return;

      const log = redoStack[redoStack.length - 1];
      const newRedoStack = redoStack.slice(0, -1);

      switch (log.type) {
        case "updateRow":
          _setSheetStore((state: any) => ({
            data: produce(state.data, (draft: RowData[]) => {
              const index = draft.findIndex((row: RowData) => row.id === log.id);
              if (index !== -1) draft[index] = log.next;
            }),
          }));
          break;
        case "addRow":
          _setSheetStore((state: any) => ({
            data: [...state.data, log.row],
          }));
          break;
        case "deleteRow":
          _setSheetStore((state: any) => ({
            data: state.data.filter((row: RowData) => row.id !== log.row.id),
          }));
          break;
        case "addColumn":
          _setSheetStore((state: any) => ({
            columns: log.next,
          }));
          break
        case "deleteColumn":
          _setSheetStore((state: any) => ({
            columns: log.next,
          }));
          break
        case "updateColumnHeader":
          _setSheetStore((state: any) => ({
            columns: produce(state.columns, (draft: Column[]) => {
              const index = draft.findIndex((col: Column) => col.key === log.key);
              if (index !== -1) draft[index].header = log.next;
            }),
        }));  
        default:
          console.warn("Unhandled redo log type:", log.type);
      }
      
      set({
        undoStack: [...undoStack, log],
        redoStack: newRedoStack,
      });
    },

    clearHistory: () => {
      set({
        undoStack: [],
        redoStack: [],
      });
    },
  };
});