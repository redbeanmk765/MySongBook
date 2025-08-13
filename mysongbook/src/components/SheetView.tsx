"use client";

import { useState, useRef } from "react";
import { useUIStore } from "@/stores/uiStore";
import { SheetTable } from "./SheetTable";
import { Button } from "@/components/ui/button";
import { PartialBlock } from "@blocknote/core";
import dynamic from "next/dynamic";
import { HorizontalScrollbar } from "./HorizontalScrollBar";
import ColumnHeader from "./ColumnHeader";

const BlockNoteEditor = dynamic(() => import("./BlockNoteEditor"), { ssr: false });

export function SheetView() {
  const isAdmin = useUIStore((state) => state.isAdmin);
  const mode = useUIStore((state) => state.mode);
  const setMode = useUIStore((state) => state.setMode);

  const [noteBlocks, setNoteBlocks] = useState<PartialBlock[]>([
    {
      type: "paragraph",
      content: "여기에 자유롭게 메모를 남겨보세요!",
    },
  ]);

  const isEditable = isAdmin && mode === "edit";

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-6 py-10">
      {/* 상단 에디터 */}
      <div className="mx-6 mb-8 p-6 rounded-lg bg-white shadow-md">
        <BlockNoteEditor content={noteBlocks} onChange={setNoteBlocks} editable={isEditable} />
      </div>

      {/* 제목 및 모드 전환 버튼 */}
      <div className="flex justify-between items-center  mb-4 px-6">
        <h1 className="text-2xl font-bold">My Song Book</h1>
        {isAdmin && (
          <Button onClick={() => setMode(mode === "edit" ? "read" : "edit")}>
            {mode === "edit" ? "읽기 모드로 전환" : "편집 모드로 전환"}
          </Button>
        )}
      </div>

      {/* ✅ scrollRef 내부에 Header + Table */}
      <div className="relative bg-white rounded-lg shadow-md mx-6 pl-8 pr-8">
        <div ref={scrollRef} >
          <div className="min-w-full">
            {/* <ColumnHeader /> */}
            <SheetTable isEditable={isEditable} />
          </div>
        </div>
      </div>

    </div>
  );
}