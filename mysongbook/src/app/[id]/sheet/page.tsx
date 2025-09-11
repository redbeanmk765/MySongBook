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
    undo,
    redo,
  } = useSheetStore();

  useEffect(() => {
    if (data.length === 0) {
      const initialData: RowData[] = [
        { "id": 1, "tag": "K", "singer": "BTS", "name": "Dynamiteㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ", "memo": "TEST" },
        { "id": 2, "tag": "J", "singer": "BTS2", "name": "好きだから", "memo": "yesy"  },
        { "id": 3, "tag": "K", "singer": "tt", "name": "123123", "memo": "yesy" },
        { "id": 4, "tag": "K", "singer": "가나다", "name": "가나다", "memo": "가나다" },
        { "id": 5, "tag": "K", "singer": "BTS", "name": "Dynamite", "memo": "TEST" },
        { "id": 6, "tag": "VOCALOID", "singer": "BTS2", "name": "好きだから", "memo": "TEST2" },
        { "id": 7, "tag": "K", "singer": "tt", "name": "123123", "memo": "yesy" },
        { "id": 8, "tag": "K", "singer": "가나다", "name": "가나다", "memo": "가나다" },
        { "id": 9, "tag": "K", "singer": "BTS", "name": "Dynamite", "memo": "TEST" , "link": "https://www.youtube.com/watch?v=gdZLi9oWNZg"},
        { "id": 10, "tag": "K", "singer": "BTS2", "name": "好きだから", "memo": "TEST2" },
        { "id": 11, "tag": "K", "singer": "tt", "name": "123123", "memo": "yesy" },
        { "id": 12, "tag": "K", "singer": "가나다", "name": "가나다", "memo": "가나다" },
        { "id": 13, "tag": "K", "singer": "BTS", "name": "Dynamite", "memo": "TEST" },
        { "id": 14, "tag": "K", "singer": "BTS2", "name": "好きだから", "memo": "TEST2" },
        { "id": 15, "tag": "K", "singer": "tt", "name": "123123", "memo": "yesy" },
        { "id": 16, "tag": "K", "singer": "가나다", "name": "가나다", "memo": "가나다" }
      ];

      setData(initialData);
    }
  }, [data.length, setData]);

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
    <div className="min-h-screen bg-[rgb(249,249,251)]">
      <Header /> 
      <SheetView />
    </div>

    

  );
}