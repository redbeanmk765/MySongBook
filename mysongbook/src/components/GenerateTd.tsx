import React, { useRef, useEffect, useCallback } from "react";
import { RowData } from "@/types/RowData";

interface GenerateTdProps {
  data: RowData;
  fieldName: keyof RowData;
  editingCell: { rowId: number; field: keyof RowData } | null;
  setEditingCell: React.Dispatch<React.SetStateAction<{ rowId: number; field: keyof RowData } | null>>;
  editedData: RowData;
  setEditedData: React.Dispatch<React.SetStateAction<RowData>>;
  handleUpdate: (id: number, updatedData: Partial<RowData>) => void;
}

export default function GenerateTd({
  data,
  fieldName,
  editingCell,
  setEditingCell,
  editedData,
  setEditedData,
  handleUpdate,
}: GenerateTdProps) {
  const isEditingTd = editingCell?.rowId === data.id && editingCell.field === fieldName;
  const nameString = fieldName as string;
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

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

  return (
    <td className="border-r w-32 text-left py-2 h-[37px] overflow-hidden whitespace-nowrap text-ellipsis min-w-0">
      {isEditingTd ? (
        <input
          type="text"
          name={nameString}
          defaultValue={editedData[fieldName] ?? ""}
          onBlur={handleBlur}
          ref={inputRef}
          className="w-full min-w-0 box-border border-r text-left pl-4 py-2 h-[30px] overflow-hidden whitespace-nowrap text-ellipsis"
        />
      ) : (
        <span
          ref={spanRef}
          className="block w-full min-w-0 max-w-full overflow-hidden whitespace-nowrap text-ellipsis text-left pl-4 h-[20px]"
          style={{ display: 'block' }}
          data-id={data.id}
          data-field={fieldName}
          tabIndex={0}
          onFocusCapture={() => setEditingCell({ rowId: data.id, field: fieldName })}
        >
          {editedData[fieldName]}
        </span>
      )}
    </td>
  );
}
