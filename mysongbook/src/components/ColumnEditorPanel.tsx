'use client'

import { cn } from "@/lib/utils";
import { useColumnStore } from "@/stores/columnStore"
import { Column } from "@/types/Column";
import { closestCenter, DndContext, DragEndEvent, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import PanelColumnItem from "./panelColumnItem";

interface ColumnEditorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export default function ColumnEditorPanel({
  isOpen,
  onClose,
  buttonRef
}: ColumnEditorPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const columns = useColumnStore((state) => state.columns);
  const setColumns = useColumnStore((state) => state.setColumns);
  const hideColumn = useColumnStore((state) => state.hideColumn);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
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

  return (
    <div
      ref={panelRef}
      className={cn(
        'absolute top-10 right-0 w-[380px] min-h-[380px] h-auto',
        'bg-white rounded-lg p-4 ',
        'duration-500 border ease-in-out ',
        'will-change-transform will-change-opacity',
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement, restrictToVerticalAxis]}
        autoScroll={false}
      >
        <div className="flex justify-between items-center ">
          test
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            X
          </button>
        </div>
        <SortableContext
          items={columns.map((col) => col.key)}
          strategy={verticalListSortingStrategy}
        >
          <div className="mt-4 space-y-2">
            {columns.map((column, index) => (
              <PanelColumnItem id={column.key} col={column}/>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
