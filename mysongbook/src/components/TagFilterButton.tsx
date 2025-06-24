import React, { useState, useRef, useEffect } from "react";
import { BarsArrowDownIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { defaultTagColors, TagColorMap } from "@/types/TagColor";
import TagColorSettingsModal from "@/components/TagColorSettingsModal";

interface TagFilterButtonProps {
  tagList: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

export default function TagFilterButton({ tagList, selectedTag, setSelectedTag }: TagFilterButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [tagColors, setTagColors] = useState<TagColorMap>(defaultTagColors);


  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutSide(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsDropdownOpen(false);
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutSide);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    }
  }, [isDropdownOpen]);

  return (
    <>
    <div
      ref={ref}
      className={`block min-w-0 max-w-28 flex justify-center items-center relative cursor-pointer pl-2 py-1 rounded ${isDropdownOpen ? "bg-gray-200" : ""} hover:bg-gray-100`}
      onClick={() => setIsDropdownOpen(open => !open)}
      tabIndex={0}
    >
      <span className="inline-block w-full overflow-hidden whitespace-nowrap text-ellipsis">{selectedTag === null ? '전체' : selectedTag}</span>
      <span className="w-5 h-5"> <BarsArrowDownIcon className="w-5 h-5 text-gray-700" /> </span>
       
      {isDropdownOpen && (
        <div className="absolute left-0 top-full z-10 w-30 max-h-48 overflow-y-auto bg-white border shadow mt-1">
          <div
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedTag === null ? "bg-blue-100" : ""}`}
            onClick={e => {
              e.stopPropagation();
              setSelectedTag(null);
              setIsDropdownOpen(false);
            }}
          >
            전체
          </div>
          {tagList.map(tag => (
            <div
              key={tag}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedTag === tag ? "bg-blue-100" : ""}`}
              onClick={e => {
                e.stopPropagation();
                setSelectedTag(tag);
                setIsDropdownOpen(false);
              }}  
            >
              {tag}
            </div>
          ))}
             <div
              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true); // 모달 열기
                setIsDropdownOpen(false); // 드롭다운 닫기
              }}
            >
              태그 설정
            </div>
        </div>
      )}
    </div>
    <TagColorSettingsModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      tagColors={tagColors}
      onTagColorsChange={setTagColors}
    />
  </>
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
