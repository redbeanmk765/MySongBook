'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useColumnStore } from '@/stores/columnStore';
import HeaderItem from './HeaderItem';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay, MouseSensor, TouchSensor } from '@dnd-kit/core';
import {restrictToHorizontalAxis,restrictToParentElement} from "@dnd-kit/modifiers";
import { arrayMove,  SortableContext,  horizontalListSortingStrategy,} from '@dnd-kit/sortable';
import { Column } from '@/types/Column';

export default function ColumnHeader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const columns = useColumnStore((state) => state.columns);
  const setColumns = useColumnStore((state) => state.setColumns);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null); // 추가

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const sensors = useSensors(
      useSensor(MouseSensor, {
        activationConstraint: {
          distance: 5, // 5px 이상 이동해야 drag 시작
        },
      }),
      useSensor(TouchSensor, {
        activationConstraint: {
          delay: 200,
          tolerance: 5,
        },
      })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    const col = columns.find((col) => col.key === id);
    setActiveColumn(col ?? null); // 추가
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumn(null); // 추가

    if (over && active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.key === active.id);
      const newIndex = columns.findIndex((col) => col.key === over.id);
      const newColumns = arrayMove(columns, oldIndex, newIndex);
      setColumns(newColumns);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={columns.map((col) => col.key)}
        strategy={horizontalListSortingStrategy}
      >
        <div
  ref={containerRef}
  className="
    flex border-b border-gray-300 w-full overflow-visible
    sticky top-16 md:top-24   // 4 rem(=h-16) / 6 rem(=h-24) 아래에 붙음
    z-10                      // 메인 헤더(z-20)보다 낮게
    bg-white
  "
>
          {columns.map((col, index) => (
            <HeaderItem
              key={col.key}
              id={col.key}
              index={index}
              containerWidth={containerWidth}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay style={{ opacity: 0.6, pointerEvents: 'none' }}>
        {activeColumn ? (
          <HeaderItem
            id={activeColumn.key}
            index={-1} // 드래그 중 index는 무의미하므로 -1
            containerWidth={containerWidth}
            column={activeColumn}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
