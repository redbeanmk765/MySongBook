import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTagColorStore } from "@/stores/tagColorStore";

interface TagButtonProps {
  currentTag: string;
  tagList: string[];
  onTagChange: (newTag: string) => void;
  onBlur: () => void;
}

function getTagColor(tag: string, tagColors: Record<string, { backgroundColor: string; textColor: string }>) {
  return tagColors[tag] || tagColors['default'];
}

export default function TagButton({ currentTag, tagList, onTagChange, onBlur }: TagButtonProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tagColors = useTagColorStore(state => state.tagColors);
  const tagColor = getTagColor(currentTag, tagColors);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX - 10,
      });
    }
  }, [isOpen]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onBlur();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onBlur]);

  const handleTagSelect = (selectedTag: string) => {
    onTagChange(selectedTag);
    setIsOpen(false);
    onBlur();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        //className="block w-full min-w-0 max-w-25 overflow-hidden whitespace-nowrap text-ellipsis text-left pl-4 h-[20px] hover:bg-gray-100 focus:outline-none"
        className="inline-block ml-4 px-3 py-[3px] rounded-full text-xs font-medium "
        style={{
            backgroundColor: tagColor.backgroundColor,
            color: tagColor.textColor,
          }}
        onClick={() => {
            setIsOpen(!isOpen);
            onBlur();
        }}
      >
        {currentTag}
      </button>
      
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="absolute flex flex-col items-start z-[8] w-28 max-h-48 overflow-y-auto bg-white shadow-md border rounded mt-1"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          {tagList.map((tag) => {
            const color = getTagColor(tag, tagColors);
            return (
              <div key={tag} className="w-full py-2 cursor-pointer hover:bg-cyan-50/75" onClick={() => handleTagSelect(tag)}>
                <div
                className="inline-block ml-3 px-3 py-[3px] rounded-full text-xs font-medium"
                style={{
                    backgroundColor: color.backgroundColor,
                    color: color.textColor,
                  }}   
                >
                  {tag}
                </div>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}