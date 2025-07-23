// ColumnHeader.tsx
import React, { useState, useRef } from 'react';
import { useUIStore } from '@/stores/uiStore'; // 정렬 상태 등 저장
import { cn } from '@/lib/utils'; // Tailwind 조건부 클래스 헬퍼

interface ColumnHeaderProps {
  columnId: string;
  columnName: string;
  sortOrder: 'asc' | 'desc' | null;
  onSortToggle: (columnId: string) => void;
  onNameChange: (columnId: string, newName: string) => void;
  onResize: (columnId: string, newWidth: number) => void;
  onDragStart: (columnId: string) => void;
  onDrop: (fromId: string, toId: string) => void;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  columnId,
  columnName,
  sortOrder,
  onSortToggle,
  onNameChange,
  onResize,
  onDragStart,
  onDrop,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(columnName);
  const headerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // 너비 조절 관련
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDownResize = (e: React.MouseEvent) => {
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = headerRef.current?.offsetWidth || 0;
    document.addEventListener('mousemove', handleMouseMoveResize);
    document.addEventListener('mouseup', handleMouseUpResize);
  };

  const handleMouseMoveResize = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const deltaX = e.clientX - startX.current;
    const newWidth = Math.max(60, startWidth.current + deltaX);
    onResize(columnId, newWidth);
  };

  const handleMouseUpResize = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMoveResize);
    document.removeEventListener('mouseup', handleMouseUpResize);
  };

  const handleNameClick = () => setIsEditing(true);

  const handleNameBlur = () => {
    setIsEditing(false);
    if (nameInput !== columnName) {
      onNameChange(columnId, nameInput.trim() || columnName);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    isDragging.current = true;
    onDragStart(columnId);
    e.dataTransfer.setData('text/plain', columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    const fromId = e.dataTransfer.getData('text/plain');
    onDrop(fromId, columnId);
    isDragging.current = false;
  };

  return (
    <div
      ref={headerRef}
      className="relative group flex items-center px-2 py-1 border-r cursor-pointer bg-white select-none"
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* 이름 변경 영역 */}
      {isEditing ? (
        <input
          className="w-full text-sm border rounded px-1"
          value={nameInput}
          autoFocus
          onChange={(e) => setNameInput(e.target.value)}
          onBlur={handleNameBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleNameBlur();
          }}
        />
      ) : (
        <span
          onClick={handleNameClick}
          className="flex-1 text-sm font-medium truncate"
        >
          {columnName}
        </span>
      )}

      {/* 정렬 아이콘 */}
      <span
        className="ml-2 text-xs opacity-50 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onSortToggle(columnId);
        }}
      >
        {sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '⇅'}
      </span>

      {/* 너비 조절 핸들 */}
      <div
        onMouseDown={handleMouseDownResize}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent group-hover:bg-blue-300 transition-colors"
      />
    </div>
  );
};
