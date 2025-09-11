'use client';

import React, { useState } from "react";
import { BarsArrowDownIcon } from "@heroicons/react/24/solid";
import TagColorSettingsModal from "@/components/TagColorSettingsModal";
import { useSheetStore } from "@/stores/sheetStore";
import { useUIStore } from "@/stores/uiStore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import TagBadge from "./ui/TagBadge";

interface TagFilterButtonProps {
  isOverlay?: boolean;
}

export default function TagFilterButton({ isOverlay = false }: TagFilterButtonProps) {
  const { selectedTag, setSelectedTag, setSortKey, setSortDirection } = useSheetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const tagColors = useSheetStore((state) => state.tagColors);
  const currentTagColor = selectedTag 
    ? tagColors.find(tag => tag.tag === selectedTag) 
    : null;


  const handleSelectTag = (tag: string | null) => {
    if (tag === null) {
      setSortKey('tag');
      setSortDirection('asc');
    }
    setSelectedTag(tag);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={`flex w-full justify-center items-center cursor-pointer pl-2 py-1 rounded hover:bg-gray-100 ${
              selectedTag === null ? "" : ""
            }`}
          >
            <span className="flex w-full items-center overflow-hidden whitespace-nowrap text-ellipsis">
              {selectedTag === null ? '전체' : <TagBadge text={selectedTag} backgroundColor={currentTagColor?.backgroundColor} textColor={currentTagColor?.textColor} />}
            </span>
            <BarsArrowDownIcon className="w-5 h-5 text-gray-700 ml-1" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          className="min-w-[160px] max-h-96 overflow-y-auto"
          align="start" 
          alignOffset={-4}
          sideOffset={3}
          onPointerDown={(e) => {
            e.stopPropagation();  // 상위 DnD-kit으로 이벤트 전파 막기
            e.preventDefault();   // 기본 드래그/선택 이벤트 막기
          }}>
          <DropdownMenuItem
            className={`pl-[9px] ${selectedTag === null ? "bg-blue-100" : ""}`}
            onClick={() => handleSelectTag(null)}
          >
            전체
          </DropdownMenuItem>

          {tagColors.map((tag) => (
            <DropdownMenuItem
              key={tag.tag}
              className={`flex items-center space-x-2 ${selectedTag === tag.tag ? "bg-blue-100" : ""}`}
              onClick={() => handleSelectTag(tag.tag)}
            >
              <TagBadge text={tag.tag} backgroundColor={tag?.backgroundColor} textColor={tag?.textColor} />
            </DropdownMenuItem>
          ))}

          <DropdownMenuItem
            className="text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            태그 설정
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TagColorSettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
