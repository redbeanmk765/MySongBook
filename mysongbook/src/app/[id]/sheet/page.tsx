"use client"

import Header from "@/components/Header";
import { useEffect } from "react";
import { RowData } from "@/types/RowData";
import { useSheetStore } from "@/stores/sheetStore";
import { SheetView } from "@/components/SheetView";


export default function sheet() {
  const {
    data,
    setData,
    setOrigin,
    undo,
    redo,
  } = useSheetStore();

  useEffect(() => {
    if (data.length === 0) {
      const initialData: RowData[] = [
        { id: 1, tag: "K", singer: "BTS", name: "Dynamiteㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ", memo: "TEST", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 2, tag: "J", singer: "BTS2", name: "好きだから", memo: "TEST2", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 3, tag: "K", singer: "tt", name: "123123", memo: "yesy", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 4, tag: "K", singer: "가나다", name: "가나다", memo: "가나다", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 5, tag: "K", singer: "BTS", name: "Dynamite", memo: "TEST", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 6, tag: "VOCALOID", singer: "BTS2", name: "好きだから", memo: "TEST2", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 7, tag: "K", singer: "tt", name: "123123", memo: "yesy", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 8, tag: "K", singer: "가나다", name: "가나다", memo: "가나다", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 9, tag: "K", singer: "BTS", name: "Dynamite", memo: "TEST", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 10, tag: "K", singer: "BTS2", name: "好きだから", memo: "TEST2", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 11, tag: "K", singer: "tt", name: "123123", memo: "yesy", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 12, tag: "K", singer: "가나다", name: "가나다", memo: "가나다", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 13, tag: "K", singer: "BTS", name: "Dynamite", memo: "TEST", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 14, tag: "K", singer: "BTS2", name: "好きだから", memo: "TEST2", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 15, tag: "K", singer: "tt", name: "123123", memo: "yesy", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
        { id: 16, tag: "K", singer: "가나다", name: "가나다", memo: "가나다", col_1: "", col_2: "", col_3: "", col_4: "", col_5: "" },
      ];

      setData(initialData);
      setOrigin(initialData);
    }
  }, [data.length, setData, setOrigin]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SheetView />
    </div>

    

  );
}