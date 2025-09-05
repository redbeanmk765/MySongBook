import { useState } from "react";
import { useSheetStore } from "@/stores/sheetStore";
import { TagColor } from "@/stores/slices/tagSlice";
import { useSortable } from "@dnd-kit/sortable";

interface ColumnEditorPanelItemProps {
  id: string;   
  tagColor: TagColor;
  isOverlay?: boolean;
}
  
  
export default function TagColorSettingsModalItem(
  { id, tagColor, isOverlay }: ColumnEditorPanelItemProps
) {
  const sortable= isOverlay ? null : useSortable({ id });

  const [isEditing, setIsEditing] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const { tagColors, renameTag, changeTagColor } = useSheetStore();


  const handleRename = (oldTag: string) => {
    const trimmed = newTagName.trim();
    if (trimmed === "" || trimmed === oldTag) {
      setIsEditing(false);
      return;
    }

    const isTagExist = tagColors.findIndex(item => item.tag === trimmed) !== -1;
    if (isTagExist) {
      alert("이미 존재하는 태그입니다.");
      setIsEditing(false);
      return;
    }
    renameTag(oldTag, trimmed);
    setIsEditing(false);
  };

  const handleColorChange = (tag: string, field: "backgroundColor" | "textColor", value: string) => {
    changeTagColor(tag, { [field]: value });
  };

  return (
    <div 
      ref={ sortable?.setNodeRef}
        {...sortable?.attributes}
        {...sortable?.listeners}
    className="flex items-center w-full mb-3">
                {/* 왼쪽 영역 */}
                <div className="flex items-center gap-3 ml-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)} 
                          onBlur={(e) => handleRename(tagColor.tag)}
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
                            setIsEditing(true);
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
}