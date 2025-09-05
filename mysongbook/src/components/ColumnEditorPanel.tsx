'use client'

import { cn } from "@/lib/utils";
import { useSheetStore } from "@/stores/sheetStore"
import { Column } from "@/types/Column";
import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors , MeasuringStrategy, useDndMonitor } from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import ColumnEditorPanelItem from "./ColumnEditorPanelItem";  


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
  const columns = useSheetStore((state) => state.columns);
  const reorderColumns = useSheetStore((state) => state.reorderColumns);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [overlayPos, setOverlayPos] = useState<{ x: number; y: number } | null>(null);

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

  // const handleDragStart = (event: DragStartEvent) => {
  //   const id = event.active.id as string;
  //   const col = columns.find((col) => col.key === id);
  //   setActiveColumn(col ?? null);

  // };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
 
    setActiveColumn(null);

    if (over && active.id !== over.id) {
        reorderColumns(active.id as string, over.id as string);
      }
  };



  return (  
    <div
      ref={panelRef}
      className={cn(
        'absolute top-8 right-0 w-[260px] min-h-[320px] h-auto',
        'bg-white rounded-b-lg py-4 ',
        'duration-500 border ease-in-out ',
        'will-change-transform will-change-opacity',
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        // onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement, restrictToVerticalAxis]}
        autoScroll={false}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
            
          }}
      >
        <div className="flex justify-between items-center pl-4 pr-3 pb-3 relative">
          <div className="absolute inset-x-0 bottom-0 border-b border-gray-300">
            <div className="absolute right-0 top-[-2px] w-[12px] h-1.5  bg-white"></div>
            <div className="absolute left-0 top-[-2px] w-[12px] h-1.5  bg-white"></div>
          </div>
          속성
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <span className="flex items-center justify-center hover:bg-gray-200 rounded h-6 w-6"> X </span>
          </button>
        </div>

        <div className="py-2"></div>

        <SortableContext
          items={columns.map((col) => col.key)}
          strategy={verticalListSortingStrategy}
          
        >
          <div className="mt-2 relative">
            {columns.map((column, index) => (
              <ColumnEditorPanelItem id={column.key} col={column}/>
            ))}
          </div>

        </SortableContext>
      </DndContext>
    </div>
  )
}
