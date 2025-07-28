import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface HeaderItemProps {
  id: string;
  header: string;
  width: number;
  onResize?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function HeaderItem({ id, header, width, onResize }: HeaderItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    width, // px 기반 고정
    zIndex: isDragging ? 9999 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative flex items-center border-r border-gray-300 bg-white text-sm",
        "select-none px-2",
        "transition-colors duration-150",
        "flex-shrink-0", // 💡 드래그 시 너비 고정
        "z-10",           // 💡 드래그 중 가림 방지
        isDragging && "opacity-50" // 드래그 중 시각 피드백
      )}
    >
      <span className="truncate">{header}</span>

      {/* 리사이즈 핸들 */}
      <div
        onMouseDown={onResize}
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize"
      />
    </div>
  );
}
