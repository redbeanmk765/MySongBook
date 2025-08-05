'use client';

import React, { useEffect, useRef } from 'react';
import { useColumnStore } from '@/stores/columnStore';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Column } from '@/types/Column';
import { RowData } from '@/types/RowData';
import { useSheetStore } from '@/stores/sheetStore';
import TagFilterButton from './TagFilterButton';

interface Props {
  id: string;
  index: number;
  containerWidth: number;
  column?: Column; // 드래그 중 overlay용
  isOverlay?: boolean;
}

export default function HeaderItem({
  id,
  index,
  containerWidth,
  column,
  isOverlay = false,
}: Props) {
  const columns = useColumnStore((state) => state.columns);
  const setColumns = useColumnStore((state) => state.setColumns);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const { 
    sortKey, 
    sortDirection, 
    setSortKey, 
    setSortDirection,
    selectedTag,
  } = useSheetStore();

  const col = column ?? columns[index];
  const widthRatio = col?.widthRatio ?? 0.2;
  const currentWidthPx = Math.round(containerWidth * col.widthRatio);

  const initialWidthPx = useRef(currentWidthPx);
  useEffect(() => {
    if (isDragging) {
      initialWidthPx.current = currentWidthPx;
    }
  }, [isDragging, currentWidthPx]);

  useEffect(() => {
    if (!isOverlay && col && col.widthRatio && containerWidth > 0) {
      const newPixelWidth = Math.round(containerWidth * col.widthRatio);

      if (col.pixelWidth !== newPixelWidth) {
        const next = [...columns];
        next[index] = {
          ...next[index],
          pixelWidth: newPixelWidth,
        };
        setColumns(next);
      }
    }
  }, [containerWidth, columns, index, col, isOverlay, setColumns]);

  const widthPx = isDragging ? initialWidthPx.current : currentWidthPx;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    width: `${widthPx}px`,
    minWidth: '110px',
    maxWidth: `${widthPx}px`,
    flexShrink: 0,
    opacity: isDragging ? 0 : 1,
    pointerEvents: isDragging ? 'none' : 'auto',
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startWidthPx = containerWidth * widthRatio;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newWidthPx = startWidthPx + deltaX;

        if (newWidthPx < 110) newWidthPx = 110; // 최소 너비 제한

      let newRatio = newWidthPx / containerWidth; 

      const otherRatiosSum = columns.reduce((sum, col, i) => {
        if (i === index) return sum;
        return sum + (col.widthRatio ?? 0.1);
      }, 0);

      const maxAllowed = 1 - otherRatiosSum;

      if (newRatio > maxAllowed ) newRatio = maxAllowed;

      const next = [...columns];
      next[index] = { ...next[index], widthRatio: newRatio};
      setColumns(next);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

    const handleSort = (key: keyof RowData) => {
      if (sortKey === key) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortDirection("asc");
      }
    };

      const clickTimer = useRef<number | null>(null);
      const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

      const handlePointerDown = (e: React.PointerEvent) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
      };

      const handlePointerUp = (e: React.PointerEvent) => {
        if (!pointerDownPos.current) return;

        const deltaX = Math.abs(e.clientX - pointerDownPos.current.x);
        const deltaY = Math.abs(e.clientY - pointerDownPos.current.y);

        const isClick = deltaX < 5 && deltaY < 5;

        if (isClick && col?.key !== 'tag') {
          handleSort(col?.key as keyof RowData);
        }

        pointerDownPos.current = null;
      };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        'relative flex items-center border-gray-300 bg-white text-sm',
        'select-none px-2',
        'transition-colors duration-150',
        'z-10',
        'flex-shrink-0',
        'h-8'
      )}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      //onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between w-full h-full">
         {col?.key === 'tag' ? (
          <TagFilterButton/>
        ) : (
          col?.pixelWidth
        )}

      </div>

      {!isOverlay && (

        <div className=" w-[4px] h-[32px] bg-transparent group">

            {/* 바 (리사이즈 핸들) */}
            <div
              onMouseDown={handleMouseDown}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute top-0 right-0 w-[6px] h-full cursor-col-resize bg-transparent group hover:bg-blue-100 transition-colors z-10"
            >
              <div
              className="absolute top-[-12px] right-[3px] translate-x-1/2 w-0 h-0 
                        border-l-[9px] border-l-transparent 
                        border-r-[9px] border-r-transparent 
                        border-t-[9px] border-t-transparent
                        group-hover:border-t-blue-100
                        cursor-col-resize transition-all"
              onMouseDown={handleMouseDown}
              onPointerDown={(e) => e.stopPropagation()}
            ></div>
            </div>
        </div>
      )}
    </div>
  );
}
