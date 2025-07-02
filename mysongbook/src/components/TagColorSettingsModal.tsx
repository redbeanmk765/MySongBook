// components/TagColorSettingsModal.tsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useTagColorStore } from '@/stores/tagColorStore';
import { useSheetStore } from "@/stores/sheetStore";

interface TagColorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
          // 입력 필드 내용

export default function TagColorSettingsModal({ isOpen, onClose }: TagColorSettingsModalProps) {
  const { tagColors, setTagColor, setTagColors } = useTagColorStore();
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const renameTagInData = useSheetStore((state) => state.renameTagInData); // RowData의 tag 변경 함수
  const renameTag = useTagColorStore((state) => state.renameTag); // 색상 map 내부 이름 변경 함수


  if (!isOpen) return null;

  const handleColorChange = (tag: string, field: "backgroundColor" | "textColor", value: string) => {
    const updatedColors = {
      ...tagColors,
      [tag]: {
        ...tagColors[tag],
        [field]: value,
      },
    };
    setTagColors(updatedColors);
  };

  const handleTagRename = (oldTag: string, newTag: string) => {
    const trimmed = newTag.trim();
    if (trimmed === "" || trimmed === oldTag) {
      setEditingTag(null);
      return;
    }
  
    if (tagColors[trimmed]) {
      alert("이미 존재하는 태그입니다.");
      setEditingTag(null);
      return;
    }
  
    // 1. 태그 색상 스토어에서 이름 변경
    const updatedColors = { ...tagColors };
    updatedColors[trimmed] = {
      ...updatedColors[oldTag],
      tag: trimmed,
    };
    delete updatedColors[oldTag];
    setTagColors(updatedColors);
  
    // 2. 데이터 스토어에서도 이름 변경
    renameTagInData(oldTag, trimmed);
  
    setEditingTag(null);
  };

  const handleRename = (oldTag: string) => {
    if (!newTagName || newTagName === oldTag) {
      setEditingTag(null);
      return;
    }
  
    // 데이터와 색상 모두 변경
    renameTagInData(oldTag, newTagName);
    renameTag(oldTag, newTagName);
    
    setEditingTag(null);
  };


  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">태그 설정</h3>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Object.entries(tagColors).map(([tag, color]) => {
            if (tag === "default") return null;
            const isEditing = editingTag === tag;

            return (
                <div key={tag} className="flex items-center w-full mb-3">
                {/* 왼쪽 영역 */}
                <div className="flex items-center gap-3 ml-3">

                      {isEditing ? (
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          onBlur={() => handleRename(tag)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRename(tag);
                          }}
                          className="w-20 text-sm border rounded px-1"
                          autoFocus
                        />
                      ) : (
                        <span
                          className="flex w-20 text-sm font-medium cursor-pointer hover:underline"
                          onClick={() => {
                            setEditingTag(tag);
                            setNewTagName(tag);
                          }}
                        >
                          {tag}
                        </span>
                      )}

                  <div className="flex w-20 items-center space-x-2 mx-3">
                    <label className="text-xs">배경:</label>
                    <input
                      type="color"
                      value={color.backgroundColor}
                      onChange={(e) => handleColorChange(tag, "backgroundColor", e.target.value)}
                      className="w-8 h-8 border rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex w-20 items-center space-x-2 mx-3">
                    <label className="text-xs">텍스트:</label>
                    <input
                      type="color"
                      value={color.textColor}
                      onChange={(e) => handleColorChange(tag, "textColor", e.target.value)}
                      className="w-8 h-8 border rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* 오른쪽 영역: ml-auto로 오른쪽 정렬 */}
                <div className="ml-auto mr-3 flex items-center justify-center w-20">
                  <div
                    className="inline-block px-3 py-[3px] rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: color.backgroundColor,
                      color: color.textColor,
                    }}
                  >
                    {tag}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t">
          <button
            onClick={() => setTagColor("새 태그", { backgroundColor: "#95A5A6", textColor: "#FFFFFF" })}
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
