import React, { useState, useEffect, useMemo } from "react";
import { RowData } from "@/types/RowData";
import GenerateTd from "./GenerateTd";
import { useSheetStore } from "@/stores/sheetStore";
import { useColumnStore } from '@/stores/columnStore';
import clsx from 'clsx'; // tailwind 클래스를 조건부로 적용하기 위해 clsx를 사용합니다.

interface RowProps {
  data: RowData;
  tagList: string[];
  isEditable: boolean;
  isLastRow: boolean; // 마지막 행인지 여부를 나타내는 prop
}

export default function Row({
  data,
  tagList = [],
  isEditable,
  isLastRow,
}: RowProps) {
  const { editingCell, setEditingCell, updateRow, deleteRow } = useSheetStore();
  const [editedData, setEditedData] = useState<RowData>(data);
  const columns = useColumnStore((state) => state.columns);

  useEffect(() => {
    setEditedData(data);
  }, [data]);

  const totalContentWidth = useMemo(() => {
    return columns.reduce((acc, col) => acc + Math.max(col.pixelWidth, 110), 0);
  }, [columns]);

  const rowClassName = clsx(
    "flex border-t border-gray-200 bg-[rgb(255,255,255)] text-sm",
    {
      "border-b border-gray-200": isLastRow, // 마지막 행일 때만 border-b 추가
    }
  );

  return (
    <div 
      className={rowClassName}
      style={{ minWidth: `${totalContentWidth}px` }}
    >
      {columns.map((col, index) => (
        col.isHidden ? null : (
        <GenerateTd
          key={index}
          data={data}
          fieldName={col.key as keyof RowData}
          editingCell={editingCell}
          setEditingCell={setEditingCell}
          editedData={editedData}
          setEditedData={setEditedData}
          handleUpdate={updateRow}
          tagList={tagList}
          isEditable={isEditable}
          pixelWidth={col.pixelWidth}
        />
      )))}
    </div>
  );
}
