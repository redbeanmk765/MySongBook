"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { RowData } from "@/types/RowData";
import Row from "@/components/Row";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useSheetStore } from "@/stores/sheetStore";
import { sortData } from "@/utils/sortUtils";
import ColumnHeader from "./ColumnHeader";
import { HorizontalScrollbar } from "./HorizontalScrollBar";
import React from "react";

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

  const sortedData = useMemo(
    () => sortData(data, sortKey, sortDirection),
    [data, sortKey, sortDirection]
  );

  const filteredData = useMemo(() => {
    if (!selectedTag) return sortedData;
    return sortedData.filter((item) => item.tag === selectedTag);
  }, [sortedData, selectedTag]);

  // 스크롤이 발생하는 컨테이너의 ref
  const tableContentContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 헤더를 고정할지 여부를 결정하는 상태와 높이
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerInitialY = useRef(0);

  // 이 컨테이너의 너비에 맞춰서 헤더의 너비를 조절합니다.
  const parentContainerRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState(0);
  
  // 부모 컨테이너의 너비를 측정하는 ResizeObserver
  useEffect(() => {
    if (!parentContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setParentWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(parentContainerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!tableContentContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(tableContentContainerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // 세로 스크롤 위치에 따라 헤더 고정 여부 결정
      if (headerContainerRef.current) {
        const currentScrollY = window.scrollY;
        // 고정 위치를 48px로 설정
        const fixedPosition = 48;
        if (currentScrollY > headerInitialY.current - fixedPosition) {
          setIsHeaderFixed(true);
        } else {
          setIsHeaderFixed(false);
        }
      }
    };
    
    // 가로 스크롤 동기화
    const handleHorizontalScroll = () => {
      if (tableContentContainerRef.current) {
        setScrollLeft(tableContentContainerRef.current.scrollLeft);
      }
    };

    const measureHeaderPosition = () => {
      if (headerContainerRef.current) {
        headerInitialY.current = headerContainerRef.current.offsetTop;
        setHeaderHeight(headerContainerRef.current.offsetHeight);
      }
    };

    measureHeaderPosition();
    window.addEventListener('resize', measureHeaderPosition);
    window.addEventListener('scroll', handleScroll);
    if (tableContentContainerRef.current) {
      tableContentContainerRef.current.addEventListener('scroll', handleHorizontalScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', measureHeaderPosition);
      if (tableContentContainerRef.current) {
        tableContentContainerRef.current.removeEventListener('scroll', handleHorizontalScroll);
      }
    };
  }, []);

  const headerClassName = isHeaderFixed 
    ? "fixed top-[76px] z-10 bg-white transition-all duration-300 border-b border-gray-300" 
    : "relative w-full transition-all duration-300";

  return (
    <div className="overflow-x-hidden" ref={parentContainerRef}> {/* 부모 컨테이너의 너비를 측정하기 위해 ref 추가 */}
      <div className="flex items-center justify-between p-6 border-b">
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
      </div>

      {/* 헤더를 위한 컨테이너. 스크롤 시 fixed로 변경됩니다. */}
      <div className={headerClassName} ref={headerContainerRef} style={isHeaderFixed ? { width: `${Math.min(parentWidth, window.innerWidth)}px` } : {}}>
        {/* 이 div에 overflow-hidden을 추가하여 헤더의 가로 스크롤을 막습니다. */}
        <div className="px-6 pt-6 overflow-x-hidden">
          {/* 가로 스크롤 위치를 동기화하기 위해 transform을 적용합니다. */}
          <div style={{ display: "flex", transform: `translateX(-${scrollLeft}px)` }}>
            <ColumnHeader />
          </div>
        </div>
      </div>
      
      {/* fixed 헤더가 공간을 차지하지 않아 생기는 레이아웃 점프를 방지하기 위한 더미 요소 */}
      {isHeaderFixed && (
        <div style={{ height: headerHeight }} />
      )}

      {/* 데이터 영역 - 가로 스크롤은 이 컨테이너에서 발생하고, 스크롤바는 숨겨집니다. */}
      <div
        ref={tableContentContainerRef}
        style={{
          overflowX: "auto",
          minWidth: "100%",
        }}
        className="no-scrollbar px-6 pt-6"
      >
        <div>
          {filteredData.slice(0, max).map((row, index) => (
            <Row
              key={row.id}
              data={row}
              tagList={tagList}
              isEditable={isEditable}
              containerWidth={containerWidth}
              isLastRow={index === filteredData.slice(0, max).length - 1}
            />
          ))}
        </div>
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

      {/* 커스텀 스크롤바 */}
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
