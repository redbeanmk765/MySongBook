'use client';

import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import { useSheetStore } from '@/stores/sheetStore';
import ColumnHeaderItem from './ColumnHeaderItem';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Column } from '@/types/Column';
import ColumnEditorPanel from './ColumnEditorPanel';

interface ColumnHeaderProps {
  scrollLeft: number;
}

const ColumnHeader = forwardRef<HTMLDivElement, ColumnHeaderProps>(
  ({ scrollLeft }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const columns = useSheetStore((state) => state.columns);
    const setColumns = useSheetStore((state) => state.setColumns);
    const addColumn = useSheetStore((state) => state.addColumn);
    const reorderColumns = useSheetStore((state) => state.reorderColumns);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    // 외부 ref에 containerRef 노출
    useImperativeHandle(ref, () => containerRef.current!);

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
        reorderColumns(active.id as string, over.id as string);
      }
    };

    const handleAddColumn = () => {
      addColumn('새 속성', containerWidth);
    };


    return (
      <div className='w-full'>
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
              className="flex sticky top-16 md:top-24 z-10 bg-white"
            >
              {columns.map((col, index) => (
                col.isHidden ? null : (
                <ColumnHeaderItem
                  key={col.key}
                  id={col.key}
                  index={index}
                  containerWidth={containerWidth}
                  scrollLeft={scrollLeft} 
                />)
              ))}

              <div
                  style={{
                    transform: `translateX(${-scrollLeft}px)`,
                    display: 'flex'
                  }}

              >

                <button
                onClick={handleAddColumn}
                className="flex items-center justify-center h-6 w-6 min-w-[24px] my-auto ml-1 text-sm font-semibold text-gray-500 hover:text-black rounded-md hover:bg-gray-200 transition"
                title="속성 추가"
              >
                +
              </button>

              <button
                ref={buttonRef}
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="flex items-center justify-center h-6 w-6 min-w-[24px] my-auto ml-1 text-sm font-semibold text-gray-500 hover:text-black rounded-md hover:bg-gray-200 transition"
                title="속성 편집"
              >
                =
              </button>

              </div>

              
            </div>
          </SortableContext>

          <DragOverlay style={{ opacity: 0.6, pointerEvents: 'none' }}>
            {activeColumn && (
              <ColumnHeaderItem
                id={activeColumn.key}
                index={-1}
                containerWidth={containerWidth - 56}
                column={activeColumn}
                isOverlay
                scrollLeft={scrollLeft}
              />
            )}
          </DragOverlay>

         
        </DndContext>

        <ColumnEditorPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} buttonRef={buttonRef}/>
      </div>

      
    );
  }
) as React.ForwardRefExoticComponent<
  ColumnHeaderProps & React.RefAttributes<HTMLDivElement>
>;

export default ColumnHeader;
