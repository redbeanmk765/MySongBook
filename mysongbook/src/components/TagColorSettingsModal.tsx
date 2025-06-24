// components/TagColorSettingsModal.tsx
import React from "react";
import ReactDOM from "react-dom";
import { TagColorMap, defaultTagColors } from "@/types/TagColor";

interface TagColorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagColors: TagColorMap;
  onTagColorsChange: (colors: TagColorMap) => void;
}

export default function TagColorSettingsModal({
  isOpen,
  onClose,
  tagColors,
  onTagColorsChange,
}: TagColorSettingsModalProps) {
  if (!isOpen) return null;

  const handleColorChange = (tag: string, field: "backgroundColor" | "textColor", value: string) => {
    const updatedColors = {
      ...tagColors,
      [tag]: {
        ...tagColors[tag],
        [field]: value,
      },
    };
    onTagColorsChange(updatedColors);
  };

  const resetToDefault = () => {
    onTagColorsChange(defaultTagColors);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">태그 설정</h3>
          <button
            onClick={resetToDefault}
            className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
          >
            기본값으로 초기화
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Object.entries(tagColors).map(([tag, color]) => {
            if (tag === "default") return null;
            return (
              <div key={tag} className="flex items-center space-x-3">
                <span className="w-10 text-sm font-medium">{tag}</span>

                <div className="flex items-center space-x-2">
                  <label className="text-xs">배경:</label>
                  <input
                    type="color"
                    value={color.backgroundColor}
                    onChange={(e) => handleColorChange(tag, "backgroundColor", e.target.value)}
                    className="w-8 h-8 border rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-xs">텍스트:</label>
                  <input
                    type="color"
                    value={color.textColor}
                    onChange={(e) => handleColorChange(tag, "textColor", e.target.value)}
                    className="w-8 h-8 border rounded cursor-pointer"
                  />
                </div>

                <div
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: color.backgroundColor,
                    color: color.textColor,
                  }}
                >
                  미리보기
                </div>
              </div>
            );
          })}
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
