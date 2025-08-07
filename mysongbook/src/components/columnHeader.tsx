'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useColumnStore } from '@/stores/columnStore';
import HeaderItem from './HeaderItem';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core';
import {
  restrictToHorizontalAxis,
  restrictToParentElement
} from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import { Column } from '@/types/Column';

export default function ColumnHeader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const columns = useColumnStore((state) => state.columns);
  const setColumns = useColumnStore((state) => state.setColumns);
  const addColumn = useColumnStore((state) => state.addColumn);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(Math.round(entry.contentRect.width));
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5
      }
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    const col = columns.find((col) => col.key === id);
    setActiveColumn(col ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumn(null);

    if (over && active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.key === active.id);
      const newIndex = columns.findIndex((col) => col.key === over.id);
      const newColumns = arrayMove(columns, oldIndex, newIndex);
      setColumns(newColumns);
    }
  };

  const handleAddColumn = () => {
    addColumn('새 속성', containerWidth);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
      autoScroll={false}
    >
      <SortableContext
        items={columns.map((col) => col.key)}
        strategy={horizontalListSortingStrategy}
      >
        <div
          ref={containerRef}
          className="
            flex border-b border-gray-300 w-full 
            sticky top-16 md:top-24
            z-10
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

          <button
            onClick={handleAddColumn}
            className="
              flex items-center justify-center
              h-6 w-6 min-w-[24px] my-auto ml-1
              text-sm font-semibold
              text-gray-500 hover:text-black
              rounded-md hover:bg-gray-200
              transition
            "
            title="속성 추가"
          >
            +
          </button>
          <button
            onClick={handleAddColumn}
            className="
              flex items-center justify-center
              h-6 w-6 min-w-[24px] my-auto ml-1
              text-sm font-semibold
              text-gray-500 hover:text-black
              rounded-md hover:bg-gray-200
              transition
            "
            title="속성 추가"
          >
            +
          </button>
        </div>
      </SortableContext>

      <DragOverlay style={{ opacity: 0.6, pointerEvents: 'none' }}>
        {activeColumn ? (
          <HeaderItem
            id={activeColumn.key}
            index={-1}
            containerWidth={containerWidth}
            column={activeColumn}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
