  import React, { useRef, useEffect, useCallback } from "react";
  import { RowData } from "@/types/RowData";
  import TagButton from "./TagButton";
  import { Input } from "@/components/ui/input";
  import TagBadge from "@/components/ui/TagBadge";
  import { useSheetStore } from "@/stores/sheetStore";
  import LinkManager from "./LinkManager";

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
    pixelWidth: number; 
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
    pixelWidth,
  }: GenerateTdProps) {
    const getTagColor = useSheetStore(state => state.getTagColor);
    const isEditingTd = editingCell?.rowId === data.id && editingCell.field === fieldName;
    const nameString = fieldName as string;
    const inputRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);

    const isTagField = fieldName === 'tag';
    const isLinkField = fieldName === 'link';
    const tagColor = isTagField ? getTagColor(editedData[fieldName] as string) : null;


    const width = pixelWidth;


    useEffect(() => {
      if (isEditingTd && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditingTd]);

    const updateValue = (value: string) => {
      console.log("updateValue called with value:", value);
      setEditingCell(null);
      setEditedData({ ...editedData, [nameString]: value });
      handleUpdate(data.id, { [fieldName]: value });
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
      <div className={'flex border-r min-w-0 text-left min-h-[36px] items-center '
        + (isEditingTd ? "bg-gray-100 " : "")}
        style={{ width,  minWidth: '90px',}}>
        {isTagField ? (
          <TagButton
            currentTag={editedData[fieldName] as string}
            onTagChange={handleTagChange}
            onBlur={handleTagBlur}
          />
        ) : isLinkField ? (
          <LinkManager 
            link={editedData[fieldName] as string}
            updateValue={updateValue}
          />
        ) : isEditingTd ? (
          <Input
            type="text"
            name={nameString}
            defaultValue={editedData[fieldName] ?? ""}
            onBlur={(e) => updateValue(e.target.value)}
            onKeyDown={(e) => { if(e.key === "Enter") updateValue(e.currentTarget.value); }}
            ref={inputRef}
            className="flex w-full min-w-0 rounded h-8 overflow-hidden whitespace-nowrap text-ellipsis bg-gray-50 focus-visible:ring-gray-400"
          />
        ) : (
          <span
            ref={spanRef}
            className="flex items-center text-left pl-2 pr-2 w-full h-full cursor-pointer truncate break-all hover:bg-gray-100"
            data-id={data.id}
            data-field={fieldName}
            tabIndex={0}
            onFocusCapture={() => setEditingCell({ rowId: data.id, field: fieldName })}
          >
            {editedData[fieldName]}
          </span>
        )}
      </div>
    );
  }
