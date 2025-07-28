"use client";

import React, { useRef } from "react";
import { useColumnStore } from "@/stores/columnStore";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import HeaderItem from "./HeaderItem";

export default function ColumnHeader() {
  const { columns, setColumns } = useColumnStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResize = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startWidth = columns[index].width ?? 100;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(100, startWidth + deltaX); // 최소 너비 제한

      const next = [...columns];
      next[index] = { ...next[index], width: newWidth };
      setColumns(next);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = columns.findIndex((col) => col.key === active.id);
    const newIndex = columns.findIndex((col) => col.key === over.id);
    const newOrder = arrayMove(columns, oldIndex, newIndex);
    setColumns(newOrder);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <SortableContext
        items={columns.map((c) => c.key)}
        strategy={horizontalListSortingStrategy}
      >
        <div
          ref={containerRef}
          className="flex w-full h-12 border-b border-gray-300 overflow-x-auto min-w-[100px]"
        >
          {columns.map((col, index) => (
            <HeaderItem
              key={col.key}
              id={col.key}
              width={col.width ?? 100}
              header={col.header}
              onResize={(e) => handleResize(e, index)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
