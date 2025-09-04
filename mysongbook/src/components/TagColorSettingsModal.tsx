// components/TagColorSettingsModal.tsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useSheetStore } from "@/stores/sheetStore";
import { TagColor } from "@/stores/slices/tagSlice";

interface TagColorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
          // 입력 필드 내용

export default function TagColorSettingsModal({ isOpen, onClose }: TagColorSettingsModalProps) {
  const { tagColors, setTagColors } = useSheetStore();
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const { changeTagColor, addTag } = useSheetStore();
  const renameTagInData = useSheetStore((state) => state.renameTag); // RowData의 tag 변경 함수
  const renameTag = useSheetStore((state) => state.renameTag); // 색상 map 내부 이름 변경 함수


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


  return ReactDOM.createPortal(
    <div  onMouseDown={(e) => {e.stopPropagation();}} 
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">태그 설정</h3>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {tagColors.map((tagColor) => {
            if (tagColor.tag === "default") return null;
            const isEditing = editingTag === tagColor.tag;

            return (
                <div key={tagColor.tag} className="flex items-center w-full mb-3">
                {/* 왼쪽 영역 */}
                <div className="flex items-center gap-3 ml-3">

                      {isEditing ? (
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)} 
                          onBlur={() => handleRename(tagColor.tag)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRename(tagColor.tag);
                          }}
                          className="w-20 text-sm border rounded px-1"
                          autoFocus
                        />
                      ) : (
                        <span
                          className="flex w-20 text-sm font-medium cursor-pointer hover:underline"
                          onClick={() => {
                            setEditingTag(tagColor.tag);
                            setNewTagName(tagColor.tag);
                          }}
                        >
                          {tagColor.tag}
                        </span>
                      )}

                  <div className="flex w-20 items-center space-x-2 mx-3">
                    <label className="text-xs">배경:</label>
                    <input
                      type="color"
                      value={tagColor.backgroundColor}
                      onChange={(e) => handleColorChange(tagColor.tag, "backgroundColor", e.target.value)}
                      className="w-8 h-8 border rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex w-20 items-center space-x-2 mx-3">
                    <label className="text-xs">텍스트:</label>
                    <input
                      type="color"
                      value={tagColor.textColor}
                      onChange={(e) => handleColorChange(tagColor.tag, "textColor", e.target.value)}
                      className="w-8 h-8 border rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* 오른쪽 영역: ml-auto로 오른쪽 정렬 */}
                <div className="ml-auto mr-3 flex items-center justify-center w-20">
                  <div
                    className="inline-block px-3 py-[3px] rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: tagColor.backgroundColor,
                      color: tagColor.textColor,
                    }}
                  >
                    {tagColor.tag}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
