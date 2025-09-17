"use client";

import { useState, useRef, forwardRef } from "react";
import { useUIStore } from "@/stores/uiStore";
import { SheetTable } from "./SheetTable";
import { Button } from "@/components/ui/button";
import { PartialBlock } from "@blocknote/core";
import dynamic from "next/dynamic";

const BlockNoteEditor = dynamic(() => import("./BlockNoteEditor"), { ssr: false });

export const SheetView = forwardRef<HTMLDivElement, {}>(function SheetView(props, ref) {
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

  return (
    <div ref={ref} className="h-[calc(100vh-60px)] overflow-y-scroll flex flex-col px-6 py-10 ">
      {/* 상단 에디터 */}
      <div className="mx-6 mb-8 p-6 rounded-2xl bg-white">
        <BlockNoteEditor content={noteBlocks} onChange={setNoteBlocks} editable={isEditable} />
      </div>

      {/* ✅ 이제 ref를 받아서 연결할 div */}
      <div 
        
        className="relative bg-white rounded-2xl pt-8 mx-6 pl-8 pr-8 flex-1"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="min-w-full">
          <SheetTable isEditable={isEditable} scrollContainerRef={ref as React.RefObject<HTMLDivElement>} />
        </div>
      </div>
    </div>
  );
});