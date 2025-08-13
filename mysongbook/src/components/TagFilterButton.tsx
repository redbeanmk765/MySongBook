'use client';

import React, { useState, useRef, useEffect } from "react";
import { BarsArrowDownIcon } from "@heroicons/react/24/solid";
import TagColorSettingsModal from "@/components/TagColorSettingsModal";
import { createPortal } from "react-dom";
import { useTagColorStore } from '@/stores/tagColorStore';
import { useSheetStore } from "@/stores/sheetStore";
import { useUIStore } from "@/stores/uiStore";

export default function TagFilterButton() {
  const { isTagDropdownOpen: isOpen, setTagDropdownOpen: setIsOpen } = useUIStore();
  const { selectedTag, setSelectedTag } = useSheetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const tagColors = useTagColorStore(state => state.tagColors);

  const openDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setIsOpen(!isOpen);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  const handleSelectTag = (tag: string | null) => {
    setSelectedTag(tag);
    setIsOpen(false);
  };

  return (
    <>
      <div
        ref={buttonRef}
        className={`flex w-full justify-center items-center relative cursor-pointer pl-2 py-1 rounded ${isOpen ? "bg-gray-200" : ""} hover:bg-gray-100`}
        onClick={openDropdown}
        tabIndex={0}
      >
        <span className="inline-block w-full overflow-hidden whitespace-nowrap text-ellipsis">
          {selectedTag === null ? '전체' : selectedTag}
        </span>
        <BarsArrowDownIcon className="w-5 h-5 text-gray-700 ml-1" />
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute z-10 w-32 max-h-48 overflow-y-auto bg-white border shadow"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            <div
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedTag === null ? "bg-blue-100" : ""}`}
              onClick={() => handleSelectTag(null)}
            >
              전체
            </div>

            {useTagColorStore.getState().getTagNames().map(tag => (
              <div
                key={tag}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedTag === tag ? "bg-blue-100" : ""}`}
                onClick={() => handleSelectTag(tag)}
              >
                {tag}
              </div>
            ))}

            <div
              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setIsModalOpen(true); // 모달 열기
                setIsOpen(false);    // 드롭다운 닫기
              }}
            >
              태그 설정
            </div>
          </div>,
          document.body
        )}

      <TagColorSettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
