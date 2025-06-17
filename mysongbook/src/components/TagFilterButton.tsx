import React, { useState, useRef, useEffect } from "react";

interface TagFilterButtonProps {
  tagList: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

export default function TagFilterButton({ tagList, selectedTag, setSelectedTag }: TagFilterButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div
      ref={ref}
      className={`inline-flex items-center relative cursor-pointer px-2 py-1 rounded ${open ? "bg-gray-200" : ""} hover:bg-gray-100`}
      onClick={() => setOpen(open => !open)}
      tabIndex={0}
    >
      <span>{selectedTag === null ? '전체' : selectedTag}</span>
      <span className="ml-1">▼</span>
      {open && (
        <div className="absolute left-0 top-full z-10 w-28 max-h-48 overflow-y-auto bg-white border shadow mt-1">
          <div
            className={`px-4 py-2 cursor-pointer ${selectedTag === null ? "bg-blue-100" : ""}`}
            onClick={e => {
              e.stopPropagation();
              setSelectedTag(null);
              setOpen(false);
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
                setOpen(false);
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
