import React, { useState, useRef, useEffect } from "react";
import { BarsArrowDownIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

interface TagFilterButtonProps {
  tagList: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

export default function TagFilterButton({ tagList, selectedTag, setSelectedTag }: TagFilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutSide(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutSide);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    }
  }, [isOpen]);

  return (
    <div
      ref={ref}
      className={`block min-w-0 max-w-28 flex justify-center items-center relative cursor-pointer pl-2 py-1 rounded ${isOpen ? "bg-gray-200" : ""} hover:bg-gray-100`}
      onClick={() => setIsOpen(open => !open)}
      tabIndex={0}
    >
      <span className="inline-block w-full overflow-hidden whitespace-nowrap text-ellipsis">{selectedTag === null ? '전체' : selectedTag}</span>
      <span className="w-5 h-5"> <BarsArrowDownIcon className="w-5 h-5 text-gray-700" /> </span>
      {isOpen && (
        <div className="absolute left-0 top-full z-10 w-28 max-h-48 overflow-y-auto bg-white border shadow mt-1">
          <div
            className={`px-4 py-2 cursor-pointer ${selectedTag === null ? "bg-blue-100" : ""}`}
            onClick={e => {
              e.stopPropagation();
              setSelectedTag(null);
              setIsOpen(false);
            }}
          >
            전체
          </div>
          {tagList.map(tag => (
            <div
              key={tag}
              className={`px-4 py-2 cursor-pointer ${selectedTag === tag ? "bg-blue-100" : ""}`}
              onClick={e => {
                e.stopPropagation();
                setSelectedTag(tag);
                setIsOpen(false);
              }}
            >
              {tag}
            </div>
          ))}
          
        </div>
      )}
    </div>
  );
}

{/* <div className="px-4 py-2 cursor-pointer" 
          onClick={e => {
            e.stopPropagation();
            setOpen(false);
            setSelectedTag(null);
          }}>
           태그 추가
          </div> */}
