'use client';

import { cn } from "@/lib/utils";
import { useColumnStore } from "@/stores/columnStore";
import { Column } from "@/types/Column";
import { RowData } from "@/types/RowData";
import { useSortable } from "@dnd-kit/sortable";
import { useRef, useState } from "react";

interface PanelColumnItemProps {
  id: string;   
  col: Column;
}

export default function PanelColumnItem({
  id,
  col,
}: PanelColumnItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const columns = useColumnStore((state) => state.columns);
  const hideColumn = useColumnStore((state) => state.hideColumn);
  const [isClick, setIsClick] = useState(false);


  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerDownPos.current) return;
    const deltaX = Math.abs(e.clientX - pointerDownPos.current.x);
    const deltaY = Math.abs(e.clientY - pointerDownPos.current.y);
    const isClick = deltaX < 5 && deltaY < 5;

    if (isClick) {
      handleRename(col?.key as keyof RowData);
    }
    pointerDownPos.current = null;
  };

  const handleRename = (key: keyof RowData) => {

  }

  
  


  return (
    <div
      ref={(node) => {
          setNodeRef(node);
        }}
        {...attributes}
        {...listeners}
        className={cn(
          'relative flex items-center border-gray-300 bg-white text-sm',
          'select-none px-2',
          'transition-colors duration-150',
          'z-10',
          'flex-shrink',
          'h-8 w-full'
        )}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}>
      <div className="mt-4 space-y-2 w-full">
              <div className="flex items-center justify-between p-2 bg-white rounded ">
                {isClick ? (
                  <span className="text-sm">{col.header}</span>
                  ) : (
                  <input
                    type="text"
                    value={col.header}
                    onChange={(e) => handleRename(e.target.value)}
                    onBlur={() => handleRename(col.key)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(col.key);}}>

                  </input>
                  )
                }

                
                
                
                
                
                <button
                  onClick={() => hideColumn(col.key)}
                  className="text-red-500 hover:text-red-700"
                >
                  숨기기
                </button>
              </div>
          </div>
    </div>
  );
}
