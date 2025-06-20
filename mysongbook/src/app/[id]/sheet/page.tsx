"use client"

import Link from "next/link";
import Header from "@/components/Header";
import { useEffect, useState, useMemo } from "react";
import { produce } from "immer";
import { RowData } from "@/types/RowData";
import { TagColorMap, defaultTagColors } from "@/types/TagColor";
import Row from "@/components/Row";
import TagFilterButton from "@/components/TagFilterButton";
import { ChevronUpIcon, ChevronDownIcon, PencilIcon } from "@heroicons/react/24/solid";
import { UserRound, CaseSensitive } from "lucide-react";
//import TagColorSettings from "@/components/TagColorSettings";

interface ChangeLog {
  id: number;
  type: "update" | "delete" | "add";
  prevRow?: RowData;
  nextRow?: RowData;
}

export default function sheet() {
  const origin: RowData[] = [
    { id: 1, tag: "K", singer: "BTS", name: "Dynamiteㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ", memo: "TEST" },
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

  const [data, setData] = useState<RowData[]>(origin);
  const [max, setMax] = useState(4);
  const [tagColors, setTagColors] = useState<TagColorMap>(defaultTagColors);

  const tagList = Array.from(new Set(data.map((item) => item.tag)));
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    rowId: number;
    field: keyof RowData;
  } | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [undoStack, setUndoStack] = useState<ChangeLog[]>([]);
  const [redoStack, setRedoStack] = useState<ChangeLog[]>([]);

  const handleAddData = (newData: RowData) => {
    setUndoStack((prev) => [
      ...prev,
      { id: newData.id, type: "add", next: newData },
    ]);
    setRedoStack([]);
    setData([...data, newData]);
    origin.push(newData);
  };

  function createBlankData() {
    const newId = Math.max(0, ...data.map((d) => d.id)) + 1;
    const tag = selectedTag || tagList[0] || "";
    return { id: newId, tag: tag, singer: "", name: "", memo: "" };
  }

  const handleUpdate = (id: number, updatedData: Partial<RowData>) => {
    const prevRow = data.find(row => row.id === id);
    if (!prevRow) return;
    const nextRow = { ...prevRow, ...updatedData };

    setUndoStack((prev) => [...prev, { id, type: "update", prevRow, nextRow }]);
    setRedoStack([]);
   
    setData(
      produce(data, (draft) => {
        const index = draft.findIndex((item) => item.id === id);
        if (index !== -1) {
          draft[index] = {
            ...draft[index],
            ...updatedData,
          };
        }
      })
    );

    
  };

  const handleDelete = (id: number) => {
    const target = data.find((row) => row.id === id);
    if (!target) return;

    setUndoStack((prev) => [
      ...prev,
      { id, type: "delete", previous: target }
    ]);
    setRedoStack([]);
  
    setData(
      produce(data, (draft) => {
        const index = draft.findIndex((item) => item.id === id);
        if (index !== -1) {
          draft.splice(index, 1);
        }
      })
    );
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
  
    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, last]);
  
    if (last.type === "update" && last.prevRow) {
      setData(
        produce(data, (draft) => {
          const index = draft.findIndex((row) => row.id === last.id);
          if (index !== -1) draft[index] = last.prevRow!;
        })
      );
    }
  
    if (last.type === "add") {
      setData((prev) => prev.filter((row) => row.id !== last.id));
    }
  
    if (last.type === "delete" && last.prevRow) {
      setData((prev) => [...prev, last.prevRow!]);
    }
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
  
    const last = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, last]);
  
    if (last.type === "update" && last.nextRow) {
      setData(
        produce(data, (draft) => {
          const index = draft.findIndex((row) => row.id === last.id);
          if (index !== -1) draft[index] = last.nextRow!;
        })
      );
    }
  
    if (last.type === "add" && last.nextRow) {
      setData((prev) => [...prev, last.nextRow!]);
    }
  
    if (last.type === "delete") {
      setData((prev) => prev.filter((row) => row.id !== last.id));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        handleRedo();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undoStack, redoStack]);

  const [sortKey, setSortKey] = useState<keyof RowData | null>("tag");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      const aIsEmpty = aValue === "";
      const bIsEmpty = bValue === "";

      // 빈 값 처리: 빈 값은 항상 마지막에 오도록
      if (aIsEmpty && !bIsEmpty) return 1;
      if (!aIsEmpty && bIsEmpty) return -1;

      // 1순위: sortKey(기본값은 "tag")
      let primaryCompare = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        primaryCompare = aValue.localeCompare(bValue, "ko", { numeric: true, sensitivity: "base" });
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        primaryCompare = aValue - bValue;
      }
      if (primaryCompare !== 0) {
        return sortDirection === "asc" ? primaryCompare : -primaryCompare;
      }

      // 2순위: name(이름)
      const aNameEmpty = a.name === "";
      const bNameEmpty = b.name === "";
      if (aNameEmpty && !bNameEmpty) return 1;
      if (!aNameEmpty && bNameEmpty) return -1;
      const nameCompare = a.name.localeCompare(b.name, "ko", { numeric: true, sensitivity: "base" });
      return sortDirection === "asc" ? nameCompare : -nameCompare;
    });
  }, [data, sortKey, sortDirection]);

  const handleSort = (key: keyof RowData) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <main>
      <Header />
      <section id="table" className="flex flex-col justify-center lg:px-20 md:px-8 sm:px-2 bg-white border-r">
        <table className="table-fixed ">
          <thead className="sticky top-[64px] md:top-[96px] sm:top-[64px] z-10 bg-blue-100 whitespace-nowrap ">
            <tr className="sticky z-10 border-b-4 bg-gray-300">
              <th scope="col" className="block min-w-0 max-w-28  sticky z-20 border-r w-32 text-left px-2 py-2">
                <TagFilterButton
                  tagList={tagList}
                  selectedTag={selectedTag}
                  setSelectedTag={setSelectedTag}
                /></th>
              <th scope="col" className="sticky z-20 border-r w-52 text-left pl-2 pr-2"
                onClick={() => handleSort("singer")}> 
                <div className="flex items-center justify-between min-w-0 overflow-hidden cursor-pointer hover:bg-gray-100 pl-2 py-1 rounded">
                  <span className="truncate inline-flex items-center gap-2 leading-none">
                    가수 
                    <UserRound className="w-5 h-5 text-gray-700 " />
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
              <th scope="col" className="sticky z-20 border-r w-[678px] text-left pl-2 pr-2"
                onClick={() => handleSort("name")}> 
                <div className="flex items-center justify-between min-w-0 overflow-hidden cursor-pointer hover:bg-gray-100 pl-2 py-1 rounded">
                  <span className="truncate inline-flex items-center gap-2 leading-none">
                    제목 
                    <CaseSensitive  className="w-7 h-7 relative top-[2px] text-gray-700 " />
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
              <th scope="col" className="sticky z-20 border-r w-[512px] text-left pl-2 pr-2"
                onClick={() => handleSort("memo")}>
                <div className="flex items-center justify-between min-w-0 overflow-hidden cursor-pointer hover:bg-gray-100 pl-2 py-1 rounded">             
                <span className="truncate inline-flex items-center gap-2">  메모 <PencilIcon className="w-4 h-4 text-gray-700" /> </span>
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
              <th scope="col" className="sticky z-20 w-[60px] z-10 text-left px-4">삭제</th>
            </tr>
          </thead>
          <tbody>
            {sortedData
              .filter((item) => !selectedTag || item.tag === selectedTag)
              .map((item) => (
                <Row
                  key={item.id}
                  data={item}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  editingCell={editingCell}
                  setEditingCell={setEditingCell}
                  customTagColors={tagColors}
                  tagList={tagList}
                />
              ))}
          </tbody>
        </table>
        <div className="flex w-full bg-white justify-center">
          <button className="w-10 h-8 my-2 bg-gray-200 rounded-full w-full" onClick={() => handleAddData(createBlankData())}>+</button>
        </div>
      </section>
    
      <button onClick={() => handleAddData(createBlankData())}>데이터 추가</button>
      <button onClick={() => handleAddData(createBlankData())}>빈 데이터 추가</button>
      <button onClick={() => handleUpdate(1, { memo: "Updated memo" })}>데이터 변경</button>
      <button onClick={() => console.log(sortedData, "focus :", editingCell)}>데이터 확인</button>
      <button onClick={() => setEditingCell({ rowId: 2, field: "singer" })}>  포커스 확인</button>
    </main>
  );
}