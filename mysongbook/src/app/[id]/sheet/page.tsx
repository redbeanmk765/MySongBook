"use client"

import Header from "@/components/Header";
import { useEffect, useMemo, useState } from "react";
import { RowData } from "@/types/RowData";
import { useSheetStore } from "@/stores/sheetStore";
import BlockNoteEditor from "@/components/BlockNoteEditor"; 
import { PartialBlock } from "@blocknote/core";
import { SheetTable } from "@/components/SheetTable";
import { SheetView } from "@/components/SheetView";


export default function sheet() {
  const {
    data,
    setData,
    setOrigin,
    undo,
    redo,
  } = useSheetStore();

  

 // const { isTagDropdownOpen, setTagDropdownOpen } = useUIStore();

  const [noteBlocks, setNoteBlocks] = useState<PartialBlock[]>([
    {
      type: "paragraph",
      content: "여기에 자유롭게 메모를 남겨보세요!",
    },
    ]);

  // 초기 데이터 설정 (컴포넌트 마운트 시 한 번만)
  useEffect(() => {
    if (data.length === 0) {
      const initialData: RowData[] = [
        { id: 1, tag: "K", singer: "BTS", name: "Dynamiteㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ", memo: "TEST" },
        { id: 2, tag: "J", singer: "BTS2", name: "好きだから", memo: "TEST2" },
        { id: 3, tag: "K", singer: "tt", name: "123123", memo: "yesy" },
        { id: 4, tag: "K", singer: "가나다", name: "가나다", memo: "가나다" },
        { id: 5, tag: "K", singer: "BTS", name: "Dynamite", memo: "TEST" },
        { id: 6, tag: "VOCALOID", singer: "BTS2", name: "好きだから", memo: "TEST2" },
        { id: 7, tag: "K", singer: "tt", name: "123123", memo: "yesy" },
        { id: 8, tag: "K", singer: "가나다", name: "가나다", memo: "가나다" },
        { id: 9, tag: "K", singer: "BTS", name: "Dynamite", memo: "TEST" },
        { id: 10, tag: "K", singer: "BTS2", name: "好きだから", memo: "TEST2" },
        { id: 11, tag: "K", singer: "tt", name: "123123", memo: "yesy" },
        { id: 12, tag: "K", singer: "가나다", name: "가나다", memo: "가나다" },
        { id: 13, tag: "K", singer: "BTS", name: "Dynamite", memo: "TEST" },
        { id: 14, tag: "K", singer: "BTS2", name: "好きだから", memo: "TEST2" },
        { id: 15, tag: "K", singer: "tt", name: "123123", memo: "yesy" },
        { id: 16, tag: "K", singer: "가나다", name: "가나다", memo: "가나다" },
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
      <div className="container w-full max-w-screen-2xl mx-auto px-4 py-8">
        <div className="mb-8 p-6 rounded-lg bg-white shadow-md">
          <BlockNoteEditor content={noteBlocks} onChange={setNoteBlocks} editable={true}/>
        </div>
        <div className="bg-white rounded-lg shadow-md">
          <SheetTable isEditable={true} />
        </div>
      </div>
      {/* <SheetView /> */}
    </div>

    

  );
}