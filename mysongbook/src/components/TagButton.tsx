import React, { useState } from "react";
import { useSheetStore } from "@/stores/sheetStore";
import TagBadge from "./ui/TagBadge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface TagButtonProps {
  currentTag: string;
  onTagChange: (newTag: string) => void;
  onBlur: () => void;
}

export default function TagButton({ currentTag, onTagChange, onBlur }: TagButtonProps) {
  const tagColors = useSheetStore(state => state.tagColors);
  const getTagColor = useSheetStore(state => state.getTagColor);
  const tagColor = getTagColor(currentTag);

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (tag: string) => {
    onTagChange(tag);
    onBlur();
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex w-full h-full items-center pl-2 justify-start cursor-pointer hover:bg-gray-100 
            ${isOpen ? "bg-gray-100" : ""}`}
        >
          <TagBadge
            text={currentTag}
            backgroundColor={tagColor?.backgroundColor}
            textColor={tagColor?.textColor}
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        alignOffset={-2}
        sideOffset={1}
        className="min-w-[160px] max-h-96 overflow-y-auto"
      >
        {tagColors.map(tag => {
          const color = getTagColor(tag.tag);
          return (
            <DropdownMenuItem key={tag.tag} onClick={() => handleSelect(tag.tag)}>
              <TagBadge
                text={tag.tag}
                backgroundColor={color?.backgroundColor}
                textColor={color?.textColor}
              />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
