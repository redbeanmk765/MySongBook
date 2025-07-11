import React, { useState, useRef, useEffect } from "react";
import { BarsArrowDownIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import TagColorSettingsModal from "@/components/TagColorSettingsModal";
import { useUIStore } from "@/stores/uiStore";
import { useTagColorStore } from '@/stores/tagColorStore';

interface TagFilterButtonProps {
  tagList: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function getTagColor(tag: string, tagColors: Record<string, { backgroundColor: string; textColor: string }>) {
  return tagColors[tag] || tagColors['default'];
}

export default function TagFilterButton({ 
  tagList, 
  selectedTag, 
  onTagSelect, 
  isOpen, 
  setIsOpen 
}: TagFilterButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tagColors = useTagColorStore(state => state.tagColors);

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
  }, [isOpen, setIsOpen]);

  return (
    <>
    <div
      ref={ref}
      className={`block w-full flex justify-center items-center relative cursor-pointer pl-2 py-1 rounded ${isOpen ? "bg-gray-200" : ""} hover:bg-gray-100`}
      onClick={() => setIsOpen(!isOpen)}
      tabIndex={0}
    >
      <span className="inline-block w-full overflow-hidden whitespace-nowrap text-ellipsis">{selectedTag === null ? '전체' : selectedTag}</span>
      <span className="w-5 h-5"> <BarsArrowDownIcon className="w-5 h-5 text-gray-700" /> </span>
       
      {isOpen && (
        <div className="absolute left-0 top-full z-10 w-32 max-h-48 overflow-y-auto bg-white border shadow mt-1">
          <div
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedTag === null ? "bg-blue-100" : ""}`}
            onClick={e => {
              e.stopPropagation();
              onTagSelect(null);
              setIsOpen(false);
            }}
          >
            전체
          </div>
          {useTagColorStore.getState().getTagNames().map(tag => (
            <div
              key={tag}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedTag === tag ? "bg-blue-100" : ""}`}
              onClick={e => {
                e.stopPropagation();
                onTagSelect(tag);
                setIsOpen(false);
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
                setIsOpen(false); // 드롭다운 닫기
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
