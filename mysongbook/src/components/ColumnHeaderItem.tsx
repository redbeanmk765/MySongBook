'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { Column } from '@/types/Column';
import { RowData } from '@/types/RowData';
import { useSheetStore } from '@/stores/sheetStore';
import TagFilterButton from './TagFilterButton';

interface Props {
  id: string;
  index: number;
  containerWidth: number;
  scrollLeft: number;
  column?: Column;
  isOverlay?: boolean;
}

export default function ColumnHeaderItem({
  id,
  index,
  containerWidth,
  scrollLeft,
  column,
  isOverlay = false,
}: Props) {
  const columns = useSheetStore((state) => state.columns);
  const setColumns = useSheetStore((state) => state.setColumns);
  const updateColumn = useSheetStore((state) => state.updateColumn);
  const editingKey = useSheetStore((state) => state.editingKey);
  const setEditingKey = useSheetStore((state) => state.setEditingKey);

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
    setSortDirection 
  } = useSheetStore();

  const col = column ?? columns[index];
  const widthRatio = col?.widthRatio ?? 0.2;
  const currentWidthPx = Math.round(containerWidth * widthRatio);
  const initialWidthPx = useRef(currentWidthPx);
  const divRef = useRef<HTMLDivElement | null>(null); 

  const isEditing = col.key === editingKey;
  const [tempHeader, setTempHeader] = useState(col.header ?? '');

  useEffect(() => {
    if (isDragging) {
      initialWidthPx.current = currentWidthPx;
    }
  }, [isDragging, currentWidthPx]);

  useEffect(() => {
    if (!isOverlay && divRef.current) {
      const actualWidth = divRef.current.offsetWidth;
      if (Math.abs((col.pixelWidth ?? 0) - actualWidth) > 1) {
        const next = [...columns];
        next[index] = {
          ...next[index],
          pixelWidth: actualWidth,
        };
        setColumns(next);
      }
    }
  }, [containerWidth, isDragging, columns, col.pixelWidth, index, setColumns, isOverlay]);

  const widthPx = isDragging ? initialWidthPx.current : currentWidthPx;

  // ★ transform + scrollLeft 통합
  const combinedTransform = transform
    ? `translate3d(${transform.x - scrollLeft}px, ${transform.y}px, 0)`
    : `translateX(${-scrollLeft}px)`;

  const style: React.CSSProperties = {
    transform: combinedTransform,
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    width: `${widthPx}px`,
    minWidth: '110px',
    flexShrink: 1,
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

      if (newWidthPx < 110) newWidthPx = 110;

      let newRatio = newWidthPx / containerWidth;

      const otherRatiosSum = columns.reduce((sum, col, i) => {
        if (i === index) return sum;
        return sum + (col.widthRatio ?? 0.1);
      }, 0);
      const maxAllowed = 1 - otherRatiosSum;
      if (newRatio > maxAllowed) newRatio = maxAllowed;

      const next = [...columns];
      next[index] = { ...next[index], widthRatio: newRatio };
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
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
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

  const handleBlur = () => {
    const newHeader = tempHeader.trim();
    if (col.header !== newHeader) { // 변경이 있을 때만 업데이트
        updateColumn(col.key, newHeader || '새 속성'); // 👈 updateColumn 사용
    }
    setEditingKey(null)
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        divRef.current = node;
      }}
      {...attributes}
      {...listeners}
      className={cn(
        'relative flex items-center border-gray-300 bg-white text-sm',
        'select-none px-2',
        'transition-colors duration-150',
        'z-10',
        'flex-shrink',
        'h-8'
      )}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div className="flex items-center justify-between w-full h-full">
         {col?.key === 'tag' ? (
          <TagFilterButton isOverlay={isOverlay} />
        ) : isEditing ? (
          <input
            className="w-full px-2 py-1 rounded text-sm bg-gray-100 focus:outline-none"
            value={tempHeader}
            onChange={(e) => setTempHeader(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
            autoFocus
          />
        ) : (
          <div className='tr'>{col.header || '새 속성'}</div>
        )} 
      </div>

      {!isOverlay && (
        <div className="w-[4px] h-[32px] bg-transparent group">
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
