// components/TagColorSettingsModal.tsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useSheetStore } from "@/stores/sheetStore";
import { TagColor } from "@/stores/slices/tagSlice";
import { closestCenter, DndContext, DragEndEvent, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TagColorSettingsModalItem from "./TagColorSettingsModalItem";

interface TagColorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TagColorSettingsModal({ isOpen, onClose }: TagColorSettingsModalProps) {
  const { tagColors, setTagColors, reorderTags } = useSheetStore();
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const { changeTagColor, addTag } = useSheetStore();
  const [activeTag, setActiveTag] = useState<TagColor | null>(null); // 드래그 중인 태그
  const renameTag = useSheetStore((state) => state.renameTag); // 색상 map 내부 이름 변경 함수

  const sensors = useSensors(
      useSensor(MouseSensor, {
        activationConstraint: { distance: 5 },
      }),
      useSensor(TouchSensor, {
        activationConstraint: { delay: 200, tolerance: 5 },
      })
    );

  if (!isOpen) return null;

  const handleColorChange = (tag: string, field: "backgroundColor" | "textColor", value: string) => {
    changeTagColor(tag, { [field]: value });
  };

   const handleRename = (oldTag: string) => {
    const trimmed = newTagName.trim();
    if (trimmed === "" || trimmed === oldTag) {
      setEditingTag(null);
      return;
    }

    const isTagExist = tagColors.findIndex(item => item.tag === trimmed) !== -1;
    if (isTagExist) {
      alert("이미 존재하는 태그입니다.");
      setEditingTag(null);
      return;
    }
    renameTag(oldTag, trimmed);
    setEditingTag(null);
  };

  const handleAddTag = () => {
    const defaultTag = "새 태그";
    const newTag: TagColor = { 
      tag: defaultTag, 
      backgroundColor: "#95A5A6", 
      textColor: "#FFFFFF" 
    };

    let suffix = 2;
    while (tagColors.some(item => item.tag === newTag.tag)) {
        newTag.tag = `${defaultTag} ${suffix}`;
        suffix++;
    }

    addTag(newTag);
  };


  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    const tag = tagColors.find((tag) => tag.tag === id);
    setActiveTag(tag ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
  
    setActiveTag(null);

    if (over && active.id !== over.id) {
        reorderTags(active.id as string, over.id as string);
      }
  };


  return ReactDOM.createPortal(
    <div  onMouseDown={(e) => {e.stopPropagation();}} 
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">태그 설정</h3>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement, restrictToVerticalAxis]}
          autoScroll={false}
        >
        
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <SortableContext
              items={tagColors.map((tag) => tag.tag)}
              strategy={verticalListSortingStrategy}
            >
                <div className="mt-2 relative">
                  {tagColors.map((tag, index) => (
                    <TagColorSettingsModalItem id={tag.tag} tagColor={tag}/>
                  ))}
                </div>
            </SortableContext>
          </div>

        </DndContext>

        <div className="mt-4 pt-3 border-t">
          <button
            onClick={() => handleAddTag()}
            className="w-full px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >                     
            추가
          </button>
        </div>

        <div className="mt-4 pt-3 border-t">
          <button
            onClick={onClose}
            className="w-full px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            닫기
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
