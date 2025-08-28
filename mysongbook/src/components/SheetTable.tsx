// components/SheetTable/SheetTable.tsx
"use client";

import React, { useMemo, useState } from "react";
import Row from "@/components/Row";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useSheetStore } from "@/stores/sheetStore";
import { sortData } from "@/utils/sortUtils";
import ColumnHeader from "./ColumnHeader";
import { HorizontalScrollbar } from "./HorizontalScrollBar";
import { StickyTableHeader } from "./StickyTableHeader";

function useContainerMeasurements() {
  const parentContainerRef = React.useRef<HTMLDivElement>(null);
  const tableContentContainerRef = React.useRef<HTMLDivElement>(null);
  const columnHeaderRef = React.useRef<HTMLDivElement | null>(null);

  const [parentWidth, setParentWidth] = useState(0);
  const [parentLeft, setParentLeft] = useState(0);
  const [parentTop, setParentTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  React.useEffect(() => {
    if (!parentContainerRef.current) return;
    const parentElement = parentContainerRef.current;

    const measure = () => {
      const rect = parentElement.getBoundingClientRect();
      setParentWidth(rect.width);
      setParentLeft(rect.left);
      const scrollY = window.scrollY || window.pageYOffset;
      setParentTop(scrollY + rect.top);
    };

    measure();

    const observer = new ResizeObserver(() => measure());
    observer.observe(parentElement);

    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, []);

  React.useEffect(() => {
    const contentElement = tableContentContainerRef.current;
    if (!contentElement) return;

    const onScroll = () => setScrollLeft(contentElement.scrollLeft);
    contentElement.addEventListener("scroll", onScroll);

    return () => {
      contentElement.removeEventListener("scroll", onScroll);
    };
  }, []);

  return {
    parentContainerRef,
    tableContentContainerRef,
    parentWidth,
    parentLeft,
    parentTop,
    scrollLeft,
  };
}

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

  const {
    parentContainerRef,
    tableContentContainerRef,
    parentWidth,
    parentLeft,
    parentTop,
    scrollLeft,
  } = useContainerMeasurements();

  const columnHeaderRef = React.useRef<HTMLDivElement | null>(null);

  const tagList = getTagList();

  const sortedData = useMemo(
    () => sortData(data, sortKey, sortDirection),
    [data, sortKey, sortDirection]
  );

  const filteredData = useMemo(() => {
    if (!selectedTag) return sortedData;
    return sortedData.filter((item) => item.tag === selectedTag);
  }, [sortedData, selectedTag]);

  const slicedData = filteredData.slice(0, max);

  return (
    <div className="overflow-x-hidden" ref={parentContainerRef}>
      {/* 상단 타이틀 및 버튼 */}
      {/* <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-6">
          <span className="text-lg font-semibold">노래 목록</span>
        </div>
        {isEditable && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => addRow(createBlankData())}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              <span>추가</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={undo}
                disabled={undoStack.length === 0}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                실행취소
              </button>
              <button
                onClick={redo}
                disabled={redoStack.length === 0}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                다시실행
              </button>
            </div>
          </div>
        )}
      </div> */}

      {/* 고정 헤더 */}
      <div>
        <StickyTableHeader
          parentWidth={parentWidth}
          parentLeft={parentLeft}
          parentTop={parentTop}
          fixedOffset={64}
          scrollLeft={scrollLeft}
        >
          <ColumnHeader ref={columnHeaderRef} scrollLeft={scrollLeft} />
        </StickyTableHeader>
      </div>

      {/* 테이블 내용 영역 */}
      <div
        ref={tableContentContainerRef}
        style={{ overflowX: "hidden", minWidth: "100%", paddingRight: 52  }}
        className="px-6 min-h-[380px]"
      >
        {slicedData.map((row, index) => ( 
          <Row
            key={row.id}
            data={row}
            tagList={tagList}
            isEditable={isEditable}
            isLastRow={index === slicedData.length - 1}
          />
        ))}
      </div>

      {isEditable && (
        <div className="flex w-full bg-white justify-center">
          <button
            className="h-8 my-2 bg-gray-200 rounded-full w-full"
            onClick={() => addRow(createBlankData())}
          >
            +
          </button>
        </div>
      )}

      {/* 커스텀 가로 스크롤바 */}
      <HorizontalScrollbar scrollRef={tableContentContainerRef} />

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
