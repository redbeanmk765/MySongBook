'use client'

import { cn } from "@/lib/utils";
import { useColumnStore } from "@/stores/columnStore"

interface ColumnEditorPanelProps {
    isOpen: boolean;
    onClose: () => void;
    // 필요한 props를 정의합니다.   
    }

export default function ColumnEditorPanel({
    isOpen,
    onClose
    // 필요한 props를 정의합니다.
}: ColumnEditorPanelProps) {
    const columns = useColumnStore((state) => state.columns);
    const hideColumn = useColumnStore((state) => state.hideColumn);
    


    return (
        <div
            className={cn(
                'absolute top-10 right-0 w-[380px] h-[380px]',
                'bg-gray-200 rounded-lg p-4',
                'shadow-xl transition-transform transition-opacity duration-200 ease-out',
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
                onClick={onClose}>
                X
            </button>
        </div>
        </div>
    )
}