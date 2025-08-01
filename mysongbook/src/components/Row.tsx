import React, { useState, useEffect } from "react";
import { RowData } from "@/types/RowData";
import GenerateTd from "./GenerateTd";
import { useSheetStore } from "@/stores/sheetStore";
import { useTagColorStore } from '@/stores/tagColorStore';
import { useColumnStore } from '@/stores/columnStore';

interface RowProps {
  data: RowData;
  tagList: string[];
  isEditable: boolean;
  containerWidth: number; // Optional prop for container width
}

export default function Row({
  data,
  tagList = [],
  isEditable,
  containerWidth,
}: RowProps) {
  const { editingCell, setEditingCell, updateRow, deleteRow } = useSheetStore();
  const [editedData, setEditedData] = useState<RowData>(data);
  const columns = useColumnStore((state) => state.columns);

  useEffect(() => {
    setEditedData(data);
  }, [data]);

  return (
    <div className="flex border-b bg-white text-sm">
      {columns.map((col, index) => (
        <GenerateTd
          data={data}
          fieldName={col.key as keyof RowData}
          editingCell={editingCell}
          setEditingCell={setEditingCell}
          editedData={editedData}
          setEditedData={setEditedData}
          handleUpdate={updateRow}
          tagList={tagList}
          isEditable={isEditable}
          containerWidth={containerWidth}
          widthRatio={col.widthRatio}
        />
                  
                ))}

      
      {/* <GenerateTd
        data={data}
        fieldName="tag"
        editingCell={editingCell}
        setEditingCell={setEditingCell}
        editedData={editedData}
        setEditedData={setEditedData}
        handleUpdate={updateRow}
        tagList={tagList}
        isEditable={isEditable}
      />
      <GenerateTd
        data={data}
        fieldName="singer"
        editingCell={editingCell}
        setEditingCell={setEditingCell}
        editedData={editedData}
        setEditedData={setEditedData}
        handleUpdate={updateRow}
        isEditable={isEditable}
      />
      <GenerateTd
        data={data}
        fieldName="name"
        editingCell={editingCell}
        setEditingCell={setEditingCell}
        editedData={editedData}
        setEditedData={setEditedData}
        handleUpdate={updateRow}
        isEditable={isEditable}
      />
      <GenerateTd
        data={data}
        fieldName="memo"
        editingCell={editingCell}
        setEditingCell={setEditingCell}
        editedData={editedData}
        setEditedData={setEditedData}
        handleUpdate={updateRow}
        isEditable={isEditable}
      /> */}
      {/* <td className="pl-[15px] h-[38px]">
        {isEditable && (
          <div className="flex items-center h-full">
            <button
              className="relative w-8 h-8 z-0 bg-white rounded-full hover:bg-gray-200 focus:outline-none"
              onClick={() => deleteRow(data.id)}
            >
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-black rotate-45 bg-red-400"></span>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-black -rotate-45 bg-red-400"></span> 
            </button>
          </div>
        )}
      </td> */}
    </div>
  );
}
