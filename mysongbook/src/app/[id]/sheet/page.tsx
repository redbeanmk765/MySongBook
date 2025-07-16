"use client"

import Link from "next/link";
import Header from "@/components/Header";
import { useEffect, useMemo, useState } from "react";
import { RowData } from "@/types/RowData";
import Row from "@/components/Row";
import TagFilterButton from "@/components/TagFilterButton";
import { ChevronUpIcon, ChevronDownIcon, PencilIcon } from "@heroicons/react/24/solid";
import { UserRound, CaseSensitive } from "lucide-react";
import { useSheetStore } from "@/stores/sheetStore";
import { useUIStore } from "@/stores/uiStore";
import { sortData } from "@/utils/sortUtils";
import BlockNoteEditor from "@/components/BlockNoteEditor"; 
import { PartialBlock } from "@blocknote/core";


export default function sheet() {
  const {
    data,
    origin,
    editingCell,
    selectedTag,
    sortKey,
    sortDirection,
    undoStack,
    redoStack,
    max,
    setData,
    setOrigin,
    setEditingCell,
    setSelectedTag,
    setSortKey,
    setSortDirection,
    addRow,
    updateRow,
    deleteRow,
    undo,
    redo,
    getTagList,
    createBlankData,
    setMax
  } = useSheetStore();

  

  const { isTagDropdownOpen, setTagDropdownOpen } = useUIStore();

  const [noteBlocks, setNoteBlocks] = useState<PartialBlock[]>([
    {
      type: "paragraph",
      content: "여기에 자유롭게 메모를 남겨보세요!",
    },
    ]);

  // 초기 데이터 설정 (컴포넌트 마운트 시 한 번만)
  useEffect(() => {
    if (data.length === 0) {
      const initialData: RowData[] = [
        { id: 1, tag: "K", singer: "BTS", name: "Dynamiteㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ", memo: "TEST" },
        { id: 2, tag: "J", singer: "BTS2", name: "好きだから", memo: "TEST2" },
        { id: 3, tag: "K", singer: "tt", name: "123123", memo: "yesy" },
        { id: 4, tag: "K", singer: "가나다", name: "가나다", memo: "가나다" },
        { id: 5, tag: "K", singer: "BTS", name: "Dynamite", memo: "TEST" },
        { id: 6, tag: "VOCALOID", singer: "BTS2", name: "好きだから", memo: "TEST2" },
        { id: 7, tag: "K", singer: "tt", name: "123123", memo: "yesy" },
        { id: 8, tag: "K", singer: "가나다", name: "가나다", memo: "가나다" },
        { id: 9, tag: "K", singer: "BTS", name: "Dynamite", memo: "TEST" },
        { id: 10, tag: "K", singer: "BTS2", name: "好きだから", memo: "TEST2" },
        { id: 11, tag: "K", singer: "tt", name: "123123", memo: "yesy" },
        { id: 12, tag: "K", singer: "가나다", name: "가나다", memo: "가나다" },
        { id: 13, tag: "K", singer: "BTS", name: "Dynamite", memo: "TEST" },
        { id: 14, tag: "K", singer: "BTS2", name: "好きだから", memo: "TEST2" },
        { id: 15, tag: "K", singer: "tt", name: "123123", memo: "yesy" },
        { id: 16, tag: "K", singer: "가나다", name: "가나다", memo: "가나다" },
      ];
      setData(initialData);
      setOrigin(initialData);
    }
  }, [data.length, setData, setOrigin]);

  const tagList = getTagList();

  // 테이블 데이터 변경 시 태그 동기화
  const handleAddData = (newData: RowData) => {
    addRow(newData);
  };

  const handleSort = (key: keyof RowData) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // 정렬된 데이터 계산
  const sortedData = useMemo(() => {
    return sortData(data, sortKey, sortDirection);
  }, [data, sortKey, sortDirection]);

  // 필터링된 데이터 계산
  const filteredData = useMemo(() => {
    if (!selectedTag) return sortedData;
    return sortedData.filter((item) => item.tag === selectedTag);
  }, [sortedData, selectedTag]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container w-full max-w-screen-2xl mx-auto px-4 py-8">
        <div className="mb-8 p-6 rounded-lg bg-white shadow-md">
          <BlockNoteEditor content={noteBlocks} onChange={setNoteBlocks} editable={true}/>
        </div>
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-6">
                <span className="text-lg font-semibold">노래 목록</span>
            </div>
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
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="lg:px-10 md:px-8 sm:px-2 text-sm text-gray-600">
                총 {filteredData.length}개 항목
              </div>
            </div>

            {/* 테이블 */}
            <section id="table" className="flex flex-col justify-center lg:px-10 md:px-8 sm:px-2 bg-white">
              <table className="table-auto w-full">
                <thead className="sticky top-[64px] md:top-[96px] sm:top-[64px] z-10 bg-blue-100 whitespace-nowrap">
                  <tr className="sticky z-10 border-b-4 bg-gray-300">
                    <th scope="col" className=" min-w-[120px] w-[10%] sticky z-20 border-r text-left px-2 py-2">
                      <TagFilterButton
                        tagList={tagList}
                        selectedTag={selectedTag}
                        onTagSelect={setSelectedTag}
                        isOpen={isTagDropdownOpen}
                        setIsOpen={setTagDropdownOpen}
                      />
                    </th>
                    <th scope="col" className=" min-w-[90px] w-[20%] sticky z-20 border-r text-left pl-2 pr-2"
                      onClick={() => handleSort("singer")}>
                      <div className="flex items-center justify-between min-w-0 overflow-hidden cursor-pointer hover:bg-gray-100 pl-2 py-1 rounded">
                        <span className="truncate inline-flex items-center gap-2 leading-none">
                          가수 
                          <UserRound className="w-4 h-4 text-gray-700 " />
                        </span>
                        <span className="w-5 h-5">
                          {sortKey === "singer" && (
                            sortDirection === "asc" ? (
                              <ChevronDownIcon className="w-5 h-5 text-gray-700" />
                            ) : (
                              <ChevronUpIcon className="w-5 h-5 text-gray-700" />
                            )
                          )}
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="min-w-[150px] w-[40%] sticky z-20 border-r text-left pl-2 pr-2"
                      onClick={() => handleSort("name")}>
                      <div className="flex items-center justify-between min-w-0 overflow-hidden cursor-pointer hover:bg-gray-100 pl-2 py-1 rounded">
                        <span className="truncate inline-flex items-center gap-2 leading-none">
                          제목 
                          <CaseSensitive className="w-6 h-6 relative top-[1.5px] text-gray-700 " />
                        </span>
                        <span className="w-5 h-5">
                          {sortKey === "name" && (
                            sortDirection === "asc" ? (
                              <ChevronDownIcon className="w-5 h-5 text-gray-700" />
                            ) : (
                              <ChevronUpIcon className="w-5 h-5 text-gray-700" />
                            )
                          )}
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="min-w-[90px] w-[25%] sticky z-20 border-r  text-left pl-2 pr-2"
                      onClick={() => handleSort("memo")}>
                      <div className="flex items-center justify-between min-w-0 overflow-hidden cursor-pointer hover:bg-gray-100 pl-2 py-1 rounded">
                        <span className="truncate inline-flex items-center gap-2">메모 <PencilIcon className="w-3 h-3 text-gray-700" /> </span>
                        <span className="w-5 h-5">
                          {sortKey === "memo" && (
                            sortDirection === "asc" ? (
                              <ChevronDownIcon className="w-5 h-5 text-gray-700" />
                            ) : (
                              <ChevronUpIcon className="w-5 h-5 text-gray-700" />
                            )
                          )}
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="sticky z-20 w-[60px] text-left px-4">삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, max).map((row) => (
                    <Row
                      key={row.id}
                      data={row}
                      tagList={tagList} 
                      isEditable={true}                    />
                  ))}
                </tbody>
              </table>
              <div className="flex w-full bg-white justify-center">
                <button className=" h-8 my-2 bg-gray-200 rounded-full w-full" onClick={() => handleAddData(createBlankData())}>+</button>
              </div>
            </section>

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
        </div>
      </div>
    </div>
  );
}