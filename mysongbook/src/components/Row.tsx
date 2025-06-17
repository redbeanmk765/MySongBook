import React, { useState, useEffect } from "react";
import { RowData } from "@/types/RowData";
import GenerateTd from "./GenerateTd";

interface RowProps {
  data: RowData;
  handleUpdate: (id: number, updatedData: Partial<RowData>) => void;
  handleDelete: (id: number) => void;
  editingCell: { rowId: number; field: keyof RowData } | null;
  setEditingCell: React.Dispatch<React.SetStateAction<{ rowId: number; field: keyof RowData } | null>>;
}

export default function Row({
  data,
  handleUpdate,
  handleDelete,
  editingCell,
  setEditingCell,
}: RowProps) {
  const [editedData, setEditedData] = useState<RowData>(data);

  useEffect(() => {
    setEditedData(data);
  }, [data]);

  return (
    <tr className="border-b bg-white text-sm">
      <GenerateTd
        data={data}
        fieldName="tag"
        editingCell={editingCell}
        setEditingCell={setEditingCell}
        editedData={editedData}
        setEditedData={setEditedData}
        handleUpdate={handleUpdate}
      />
      <GenerateTd
        data={data}
        fieldName="singer"
        editingCell={editingCell}
        setEditingCell={setEditingCell}
        editedData={editedData}
        setEditedData={setEditedData}
        handleUpdate={handleUpdate}
      />
      <GenerateTd
        data={data}
        fieldName="name"
        editingCell={editingCell}
        setEditingCell={setEditingCell}
        editedData={editedData}
        setEditedData={setEditedData}
        handleUpdate={handleUpdate}
      />
      <GenerateTd
        data={data}
        fieldName="memo"
        editingCell={editingCell}
        setEditingCell={setEditingCell}
        editedData={editedData}
        setEditedData={setEditedData}
        handleUpdate={handleUpdate}
      />
      <td className="pl-[15px] pt-[3px]">
        <button
          className="relative w-8 h-8 z-0 bg-white rounded-full hover:bg-gray-200 focus:outline-none"
          onClick={() => handleDelete(data.id)}
        >
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-black rotate-45"></span>
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-black -rotate-45"></span>
        </button>
      </td>
    </tr>
  );
}
