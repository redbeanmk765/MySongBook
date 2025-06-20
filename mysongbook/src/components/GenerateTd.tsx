import React, { useRef, useEffect, useCallback } from "react";
import { RowData } from "@/types/RowData";
import { getTagColor, TagColorMap } from "@/types/TagColor";
import TagButton from "./TagButton";

interface GenerateTdProps {
  data: RowData;
  fieldName: keyof RowData;
  editingCell: { rowId: number; field: keyof RowData } | null;
  setEditingCell: React.Dispatch<React.SetStateAction<{ rowId: number; field: keyof RowData } | null>>;
  editedData: RowData;
  setEditedData: React.Dispatch<React.SetStateAction<RowData>>;
  handleUpdate: (id: number, updatedData: Partial<RowData>) => void;
  customTagColors: TagColorMap;
  tagList?: string[];
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
}: GenerateTdProps) {
  const isEditingTd = editingCell?.rowId === data.id && editingCell.field === fieldName;
  const nameString = fieldName as string;
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const isTagField = fieldName === 'tag';
  const tagColor = isTagField ? getTagColor(editedData[fieldName] as string) : null;


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
    <td className={"border-r min-w-0 max-w-28 text-left justify-center h-[38px] overflow-hidden whitespace-nowrap text-ellipsis min-w-0 "
      + (isEditingTd ? "bg-gray-50" : "")}>
      {isEditingTd ?  (
        isTagField ? (
          <TagButton
            currentTag={editedData[fieldName] as string}
            tagList={tagList}
            onTagChange={handleTagChange}
            onBlur={handleTagBlur}
          />
        ) : (
        <input
          type="text"
          name={nameString}
          defaultValue={editedData[fieldName] ?? ""}
          onBlur={handleBlur}
          ref={inputRef}
          className="block w-full min-w-0 box-border border-r text-left pl-4 py-2 h-[30px] overflow-hidden whitespace-nowrap text-ellipsis"
        />
        )
      ) : (
        <span
          ref={spanRef}
          className={"flex items-center w-full h-full min-w-0 max-w-26 overflow-hidden whitespace-nowrap text-ellipsis text-left pl-4 cursor-pointer hover:bg-gray-100 " }
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
    </td>
  );
}
