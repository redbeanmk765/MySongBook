'use client'

import { useColumnStore } from "@/stores/columnStore"

export default function ColumnEditorPanel(){
    const columns = useColumnStore((state) => state.columns);
    const hideColumn = useColumnStore((state) => state.hideColumn);


    return (
        <div
            className="
                absolute top-10 right-[-100px] 
                bg-[#191919] border-l border-[#2F2F2F]
                pr-[96px] z-[88]
                h-[540px] opacity-100 
                transform translate-x-0
                transition-opacity transition-transform duration-200 ease-in-out
            "
        >   
           test                                             
        </div>
    )
}