import { RowData } from "./RowData";
import { Column } from "./Column";

export type ChangeLog =
  | {
      type: "addRow";
      row: RowData;
    }
  | {
      type: "deleteRow";
      row: RowData;
    }
  | {
      type: "updateRow";
      id: number;
      prev: RowData;
      next: RowData;
    }
  | {
      type: "addColumn";
      prev: Column[];
      next: Column[];
    }
  | {
      type: "deleteColumn";
      prev: Column[];
      next: Column[];
    }
  | {
      type: "updateColumnHeader";
      key: string;
      prev: string;
      next: string;
    }
  | {
      type: "renameTag";
      oldTag: string;
      newTag: string;
    }
  | {
      type: "changeTagColor";
      tag: string;
      prevColor: string;
      newColor: string;
    };
