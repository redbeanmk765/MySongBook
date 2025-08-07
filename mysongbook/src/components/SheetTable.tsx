"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { RowData } from "@/types/RowData";
import Row from "@/components/Row";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useSheetStore } from "@/stores/sheetStore";
import { sortData } from "@/utils/sortUtils";
import ColumnHeader from "./ColumnHeader";

interface SheetTableProps {
  isEditable: boolean;
}

export function SheetTable({ isEditable }: SheetTableProps) {
  const {
    data,
    selectedTag,
    sortKey,
    sortDirection,
    undoStack,
    redoStack,
    max,
    addRow,
    undo,
    redo,
    getTagList,
    createBlankData,
    setMax,
  } = useSheetStore();

  const tagList = getTagList();

  const handleAddData = (newData: RowData) => {
    addRow(newData);
  };

  const sortedData = useMemo(
    () => sortData(data, sortKey, sortDirection),
    [data, sortKey, sortDirection]
  );

  const filteredData = useMemo(() => {
    if (!selectedTag) return sortedData;
    return sortedData.filter((item) => item.tag === selectedTag);
  }, [sortedData, selectedTag]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div >
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-6">
          <span className="text-lg font-semibold">노래 목록</span>
        </div>
        {isEditable && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleAddData(createBlankData())}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              <span>추가</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={undo}
                disabled={undoStack.length === 0}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                실행취소
              </button>
              <button
                onClick={redo}
                disabled={redoStack.length === 0}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다시실행
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 테이블 전체 래퍼: overflow-x visible 유지, 가로 스크롤은 상위 컴포넌트에서 처리 */}
      <div
        className="p-8"
        ref={containerRef}
        style={{
          overflowX: "visible",
          whiteSpace: "nowrap",
          minWidth: "100%",
        }}
      >
        {/* 헤더는 가로로 flex row 배치 */}
        <div style={{ display: "flex", whiteSpace: "normal" }}>
          <ColumnHeader />
        </div>

        {/* 데이터 행은 블록으로 세로 쌓기 */}
        <div style={{ whiteSpace: "normal" }}>
          {filteredData.slice(0, max).map((row) => (
            <Row
              key={row.id}
              data={row}
              tagList={tagList}
              isEditable={isEditable}
              containerWidth={containerWidth}
            />
          ))}
        </div>

        {isEditable && (
          <div className="flex w-full bg-white justify-center">
            <button
              className="h-8 my-2 bg-gray-200 rounded-full w-full"
              onClick={() => handleAddData(createBlankData())}
            >
              +
            </button>
          </div>
        )}
      </div>

      {filteredData.length > max && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setMax(max + 4)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            더 보기 ({filteredData.length - max}개 더)
          </button>
        </div>
      )}
    </div>
  );
}
