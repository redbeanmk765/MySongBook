'use client';

import { cn } from "@/lib/utils";
import { useColumnStore } from "@/stores/columnStore";
import { Column } from "@/types/Column";
import { useSortable } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";

interface PanelColumnItemProps {
  id: string;   
  col: Column;
  isOverlay?: boolean;
}

export default function PanelColumnItem({
  id,
  col,
  isOverlay
}: PanelColumnItemProps) {
  const sortableProps = isOverlay ? null : useSortable({ id });
 

  const updateColumn = useColumnStore((state) => state.updateColumn);
  const hideColumn = useColumnStore((state) => state.hideColumn);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);


  // const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  // const handlePointerDown = (e: React.PointerEvent) => {
  //   pointerDownPos.current = { x: e.clientX, y: e.clientY };
  // };

  // const handlePointerUp = (e: React.PointerEvent) => {
  //   if (!pointerDownPos.current) return;
  //   const deltaX = Math.abs(e.clientX - pointerDownPos.current.x);
  //   const deltaY = Math.abs(e.clientY - pointerDownPos.current.y);
  //   const isClick = deltaX < 5 && deltaY < 5;
  //   if (isClick) {
  //     setIsClick(true);
  //   }

  //   pointerDownPos.current = null;
  // };

  useEffect(() => {
   if (inputRef.current) {
        inputRef.current.focus();
      }
  }, [isEditing]);

  const handleIsEditing = (): void => {
    if (!(sortableProps?.isDragging))
      setIsEditing(true);
  }

  const handleChange = (key: string, newHeader: string) => {
    updateColumn(key, newHeader);
  }

  const handleBlur = (key: string, newHeader: string) => {
    updateColumn(key, newHeader);
    setIsEditing(false);
  }

  return (
    <div
      ref={(node) => {
          sortableProps?.setNodeRef(node);
        }}
        {...sortableProps?.attributes}
        {...sortableProps?.listeners}
        className={cn(
          'relative flex items-center border-gray-300 bg-white text-sm',
          'select-none px-2',
          'transition-colors duration-150',
          'z-10',
          'flex-shrink',
          'h-8 w-full'
        )}
        >
      <div className="mt-4 space-y-2 w-full h-full">
        <div className="flex items-center justify-between bg-white rounded">
          {!isEditing ? (
            <span className="leading-none text-sm rounded p-2 mr-2 min-w-[80px] truncate hover:bg-gray-100 transition-colors"
              onClick={handleIsEditing}>{col.header}</span>
            ) : (
            <input
              type="text"
              value={col.header}
              ref={inputRef}
              onChange={(e) => handleChange(col.key, e.target.value)}
              onBlur={(e) => handleBlur(col.key, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") inputRef.current?.blur();}}
              className="leading-none text-sm rounded px-2 py-[7px] mr-2 min-w-[80px] truncate h-full">

            </input>
            )
          }
          <button
            onClick={() => hideColumn(col.key)}
            className="text-red-500 hover:text-red-700 min-w-[38px]"
          >
            숨기기
          </button>
        </div>
      </div>
    </div>
  );
}
