"use client";

import { useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { SheetTable } from './SheetTable';
import { Button } from "@/components/ui/button"; // Shadcn/ui 버튼 사용 예시
import BlockNoteEditor from './BlockNoteEditor';
import { PartialBlock } from '@blocknote/core';

export function SheetView() {
  const { isAdmin, mode, setMode } = useUIStore((state) => ({
    isAdmin: state.isAdmin,
    mode: state.mode,
    setMode: state.setMode,
  }));

  const [noteBlocks, setNoteBlocks] = useState<PartialBlock[]>([]);

  const isEditable = isAdmin && mode === 'edit';

  const handleToggleMode = () => {
    setMode(mode === 'edit' ? 'read' : 'edit');
  };

  return (
    <div className="container mx-auto py-10">
       <div className="mb-8 p-6 rounded-lg bg-white shadow-md">
          <BlockNoteEditor content={noteBlocks} onChange={setNoteBlocks} editable={isEditable}/>
        </div>
      <div className="flex justify-between items-center mb-4 px-6">
        <h1 className="text-2xl font-bold">My Song Book</h1>
        {isAdmin && (
          <Button onClick={handleToggleMode}>
            {mode === 'edit' ? '읽기 모드로 전환' : '편집 모드로 전환'}
          </Button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
         <SheetTable isEditable={isEditable} />
      </div>
    </div>
  );
}