'use client';

import React, { useState, useRef, useEffect, use } from "react";
import { BarsArrowDownIcon } from "@heroicons/react/24/solid";
import TagColorSettingsModal from "@/components/TagColorSettingsModal";
import { createPortal } from "react-dom";
import { useSheetStore } from "@/stores/sheetStore";
import { useUIStore } from "@/stores/uiStore";
import { set } from "lodash";

interface TagFilterButtonProps {
  isOverlay?: boolean;
}

export default function TagFilterButton({isOverlay=false }: TagFilterButtonProps) {
  const { isTagDropdownOpen: isOpen, setTagDropdownOpen: setIsOpen } = useUIStore();
  const { selectedTag, setSelectedTag, setSortKey, setSortDirection  } = useSheetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const tagColors = useSheetStore(state => state.tagColors);

  const [dropdownWidth, setDropDownWidth] = useState(0);

  const openDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + window.scrollY + 2, left: rect.left + window.scrollX - 8 });
    setDropDownWidth(rect.width + 32);
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

  useEffect(() => {
    const handleWheel = (e:WheelEvent) => {
      // 드롭다운 내부에서는 스크롤을 허용
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
        return;
      }
      e.preventDefault();
    };

    if (isOpen) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen]);

  const handleSelectTag = (tag: string | null) => {
    if( tag === null) {
      setSortKey('tag');
      setSortDirection('asc');
    }
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

      {isOpen && !isOverlay &&
        createPortal(
          <div
            ref={dropdownRef}
            onPointerDown={(e) => {e.stopPropagation(); e.preventDefault();}} 
            onWheel={(e) => {
              const target = e.currentTarget;
              // 스크롤이 맨 위에 있고 위로 휠을 돌리거나,
              // 스크롤이 맨 아래에 있고 아래로 휠을 돌릴 때
              if ((e.deltaY < 0 && target.scrollTop === 0) || (e.deltaY > 0 && target.scrollHeight - target.scrollTop === target.clientHeight)) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="absolute flex-col z-10 min-w-40 max-h-48 overflow-y-auto bg-white shadow border border-gray-300"
            style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownWidth, }}
          >
            <div
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedTag === null ? "bg-blue-100" : ""}`}
              onClick={() => handleSelectTag(null)}
            >
              전체
            </div>

            {tagColors.map(tag => (
              <div className="w-full py-2 cursor-pointer hover:bg-cyan-50/75" onClick={() => handleSelectTag(tag.tag)}>
                <div
                className="inline-block ml-3 px-3 py-[3px] rounded-full text-xs font-medium"
                style={{
                    backgroundColor: tag?.backgroundColor,
                    color: tag?.textColor,
                  }}   
                >
                  {tag.tag}
                </div>
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
