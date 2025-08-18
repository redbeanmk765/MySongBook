'use client'

import { cn } from "@/lib/utils";
import { useColumnStore } from "@/stores/columnStore"
import { useEffect, useRef } from "react";

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
    const hideColumn = useColumnStore((state) => state.hideColumn);

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
    
    


    return (
        <div
            ref={panelRef}
            className={cn(
                'absolute top-10 right-0 w-[380px] min-h-[380px] h-auto',
                'bg-white rounded-lg p-4 ',
                'duration-500 border ease-in-out ',
                'will-change-transform will-change-opacity',
                // Open/close animation
                isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
                // Block mouse/drag events when closed
                isOpen ? 'pointer-events-auto' : 'pointer-events-none'
            )}
        >
        <div className="flex justify-between items-center ">
            test
            <button
                 onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}>
                X
            </button>
        </div>

        <div className="mt-4 space-y-2">
          {columns.map((column, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-white rounded ">
              <span className="text-sm">{column.header}</span>
              <button                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                onClick={() => hideColumn(column.key)}
                className="text-red-500 hover:text-red-700"
              >
                숨기기
              </button>
            </div>
          ))}
        </div>
        </div>
    )
}