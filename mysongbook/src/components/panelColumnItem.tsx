'use client';

import { cn } from "@/lib/utils";
import { useColumnStore } from "@/stores/columnStore";
import { Column } from "@/types/Column";
import { useSortable } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical} from 'lucide-react';

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
  const sortable= isOverlay ? null : useSortable({ id });
 

  const updateColumn = useColumnStore((state) => state.updateColumn);
  const hideColumn = useColumnStore((state) => state.hideColumn);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
   if (inputRef.current) {
        inputRef.current.focus();
      }
  }, [isEditing]);

  const handleIsEditing = (): void => {
    if (!(sortable?.isDragging))
      setIsEditing(true);
  }

  const handleChange = (key: string, newHeader: string) => {
    updateColumn(key, newHeader);
  }

  const handleBlur = (key: string, newHeader: string) => {
    updateColumn(key, newHeader);
    setIsEditing(false);
  }

   const style = sortable
    ? {
        transform: CSS.Transform.toString(sortable.transform),
        transition: 'none',
        opacity: sortable.isDragging ? 0.4 : 1,
      }
    : {};


  return (
    <div
      ref={ sortable?.setNodeRef}
      style={style}   
        {...sortable?.attributes}
        {...sortable?.listeners}
        className={cn(
          'relative flex items-center border-gray-300 bg-white text-sm',
          'select-none pr-1',
          'transition-colors duration-150',
          'z-10',
          'flex-shrink',
          'h-8 w-full'
        )}
        > 
      <div className="w-full h-full px-3">
        <div className="flex items-center justify-between bg-white rounded">
          <div className="flex items-center h-[28px]">
            <GripVertical className="flex text-gray-400 h-5 w-5 mr-2 cursor-move"/>
            {!isEditing ? (
              <span className="flex items-center leading-none text-sm rounded  mr-2 min-w-[80px] h-[28px] truncate hover:bg-gray-100"
                onClick={handleIsEditing}>
                  {col.header}
              </span>
              ) : (
              <input
                type="text"
                value={col.header}
                ref={inputRef}
                onChange={(e) => handleChange(col.key, e.target.value)}
                onBlur={(e) => handleBlur(col.key, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") inputRef.current?.blur();}}
                className="flex leading-none text-sm rounded max-w-[175px] min-w-[40px] h-[20px] truncate  border-gray-100">

              </input>
              )
            }
          </div>
          <button
            onClick={() => hideColumn(col.key)}
          >
            {col.isHidden ? <EyeOff className="text-gray-500 h-[18px] w-[18px]"/> :
              <Eye className="text-gray-500 h-[18px] w-[18px]"/>}
          </button>
        </div>
      </div>
    </div>
  );
}
