import React, { useRef, useEffect, useCallback } from "react";
import { RowData } from "@/types/RowData";
import { useTagColorStore } from '@/stores/tagColorStore';
import TagButton from "./TagButton";
import { Input } from "@/components/ui/input";

interface GenerateTdProps {
  data: RowData;
  fieldName: keyof RowData;
  editingCell: { rowId: number; field: keyof RowData } | null;
  setEditingCell: (cell: { rowId: number; field: keyof RowData } | null) => void;
  editedData: RowData;
  setEditedData: React.Dispatch<React.SetStateAction<RowData>>;
  handleUpdate: (id: number, updatedData: Partial<RowData>) => void;
  tagList?: string[];
  isEditable: boolean;
  containerWidth: number; // Optional prop for container width
  widthRatio: number; // Optional prop for width ratio
}

function getTagColor(tag: string, tagColors: Record<string, { backgroundColor: string; textColor: string }>) {
  return tagColors[tag] || tagColors['default'];
}

export default function GenerateTd({
  data,
  fieldName,
  editingCell,
  setEditingCell,
  editedData,
  setEditedData,
  handleUpdate,
  tagList = [],
  containerWidth,
  widthRatio
}: GenerateTdProps) {
  const tagColors = useTagColorStore(state => state.tagColors);
  const isEditingTd = editingCell?.rowId === data.id && editingCell.field === fieldName;
  const nameString = fieldName as string;
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const isTagField = fieldName === 'tag';
  const tagColor = isTagField ? getTagColor(editedData[fieldName] as string, tagColors) : null;

  const width = Math.round(containerWidth * widthRatio);


  useEffect(() => {
    if (isEditingTd && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingTd]);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setEditingCell(null);
    setEditedData({ ...editedData, [nameString]: event.target.value });
    handleUpdate(data.id, { [fieldName]: event.target.value });
  };

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleTagChange = (newTag: string) => {
    setEditedData({ ...editedData, [fieldName]: newTag });
    handleUpdate(data.id, { [fieldName]: newTag });
  };

  const handleTagBlur = () => {
    setEditingCell(null);
  };

  return (
    <div className={'flex border-r min-w-0 text-left min-h-[38px] items-center '
      + (isEditingTd ? "bg-gray-50" : "")}
      style={{ width,  minWidth: '110px',}}>
      {isEditingTd ?  (
        isTagField ? (
          <TagButton
            currentTag={editedData[fieldName] as string}
            tagList={tagList}
            onTagChange={handleTagChange}
            onBlur={handleTagBlur}
          />
        ) : (
        <Input
          type="text"
          name={nameString}
          defaultValue={editedData[fieldName] ?? ""}
          onBlur={handleBlur}
          ref={inputRef}
          className="block w-full min-w-0 box-border border-r h-8 text-left overflow-hidden whitespace-nowrap text-ellipsis "
        />
        )
      ) : (
        <span
          ref={spanRef}
          className={"flex items-center w-full h-full min-w-0 text-left pl-4 cursor-pointer hover:bg-gray-100 " }
          data-id={data.id}
          data-field={fieldName}
          tabIndex={0}
          onFocusCapture={() => setEditingCell({ rowId: data.id, field: fieldName })}
        >
          {isTagField && tagColor ? (
            <span
              className="inline-block px-3 py-[3px] rounded-full text-xs font-medium "
              style={{
                backgroundColor: tagColor.backgroundColor,
                color: tagColor.textColor,
              }}
            >
              {editedData[fieldName]}
            </span>
          ) : (
            editedData[fieldName]
          )}
        </span>
      )}
    </div>
  );
}
