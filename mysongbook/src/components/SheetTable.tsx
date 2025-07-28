"use client";

import { useMemo } from "react";
import { RowData } from "@/types/RowData";
import Row from "@/components/Row";
import TagFilterButton from "@/components/TagFilterButton";
import { ChevronUpIcon, ChevronDownIcon, PencilIcon } from "@heroicons/react/24/solid";
import { UserRound, CaseSensitive } from "lucide-react";
import { useSheetStore } from "@/stores/sheetStore";
import { useUIStore } from "@/stores/uiStore";
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
    setSelectedTag,
    setSortKey,
    setSortDirection,
    addRow,
    undo,
    redo,
    getTagList,
    createBlankData,
    setMax,
  } = useSheetStore();

  const { isTagDropdownOpen, setTagDropdownOpen } = useUIStore();

  const tagList = getTagList();

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

  const sortedData = useMemo(() => sortData(data, sortKey, sortDirection), [data, sortKey, sortDirection]);
  const filteredData = useMemo(() => {
    if (!selectedTag) return sortedData;
    return sortedData.filter((item) => item.tag === selectedTag);
  }, [sortedData, selectedTag]);

  return (
    <>
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
            <button onClick={undo} disabled={undoStack.length === 0} className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
              실행취소
            </button>
            <button onClick={redo} disabled={redoStack.length === 0} className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
              다시실행
            </button>
          </div>
        </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="lg:px-10 md:px-8 sm:px-2 text-sm text-gray-600">
            총 {filteredData.length}개 항목
          </div>
        </div>

        <section id="table" className="flex flex-col justify-center lg:px-10 md:px-8 sm:px-2 bg-white">
          <ColumnHeader/>
          <table className="table-auto w-full">
            <thead className="sticky top-[64px] md:top-[96px] sm:top-[64px] z-10 bg-blue-100 whitespace-nowrap">
              <tr className="sticky z-10 border-b-4 bg-gray-300">
                <th scope="col" className="min-w-[120px] w-[10%] sticky z-20 border-r text-left px-2 py-2">
                  <TagFilterButton tagList={tagList} selectedTag={selectedTag} onTagSelect={setSelectedTag} isOpen={isTagDropdownOpen} setIsOpen={setTagDropdownOpen} />
                </th>
                <th scope="col" className="min-w-[90px] w-[20%] sticky z-20 border-r text-left pl-2 pr-2" onClick={() => handleSort("singer")}>
                  <div className="flex items-center justify-between min-w-0 overflow-hidden cursor-pointer hover:bg-gray-100 pl-2 py-1 rounded">
                    <span className="truncate inline-flex items-center gap-2 leading-none">가수 <UserRound className="w-4 h-4 text-gray-700 " /></span>
                    <span className="w-5 h-5">{sortKey === "singer" && (sortDirection === "asc" ? <ChevronDownIcon className="w-5 h-5 text-gray-700" /> : <ChevronUpIcon className="w-5 h-5 text-gray-700" />)}</span>
                  </div>
                </th>
                <th scope="col" className="min-w-[150px] w-[40%] sticky z-20 border-r text-left pl-2 pr-2" onClick={() => handleSort("name")}>
                  <div className="flex items-center justify-between min-w-0 overflow-hidden cursor-pointer hover:bg-gray-100 pl-2 py-1 rounded">
                    <span className="truncate inline-flex items-center gap-2 leading-none">제목 <CaseSensitive className="w-6 h-6 relative top-[1.5px] text-gray-700 " /></span>
                    <span className="w-5 h-5">{sortKey === "name" && (sortDirection === "asc" ? <ChevronDownIcon className="w-5 h-5 text-gray-700" /> : <ChevronUpIcon className="w-5 h-5 text-gray-700" />)}</span>
                  </div>
                </th>
                <th scope="col" className="min-w-[90px] w-[25%] sticky z-20 border-r  text-left pl-2 pr-2" onClick={() => handleSort("memo")}>
                  <div className="flex items-center justify-between min-w-0 overflow-hidden cursor-pointer hover:bg-gray-100 pl-2 py-1 rounded">
                    <span className="truncate inline-flex items-center gap-2">메모 <PencilIcon className="w-3 h-3 text-gray-700" /> </span>
                    <span className="w-5 h-5">{sortKey === "memo" && (sortDirection === "asc" ? <ChevronDownIcon className="w-5 h-5 text-gray-700" /> : <ChevronUpIcon className="w-5 h-5 text-gray-700" />)}</span>
                  </div>
                </th>
                <th scope="col" className="sticky z-20 w-[60px] text-left px-4">삭제</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, max).map((row) => (
                <Row key={row.id} data={row} tagList={tagList} isEditable={isEditable} />
              ))}
            </tbody>
          </table>
          {isEditable && (
            <div className="flex w-full bg-white justify-center">
              <button className=" h-8 my-2 bg-gray-200 rounded-full w-full" onClick={() => handleAddData(createBlankData())}>+</button>
            </div>
          )}
        </section>

        {filteredData.length > max && (
          <div className="mt-4 text-center">
            <button onClick={() => setMax(max + 4)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              더 보기 ({filteredData.length - max}개 더)
            </button>
          </div>
        )}
      </div>
    </>
  );
}