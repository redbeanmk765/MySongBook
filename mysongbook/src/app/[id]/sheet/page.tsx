"use client"

import Link from "next/link";
import Header from "@/components/Header";
import { useEffect, useState, useMemo } from "react";
import { produce } from "immer";
import { RowData } from "@/types/RowData";
import Row from "@/components/Row";
import TagFilterButton from "@/components/TagFilterButton";

export default function sheet() {
  const origin: RowData[] = [
    { id: 1, tag: "K", singer: "BTS", name: "Dynamiteㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ", memo: "TEST" },
    { id: 2, tag: "K", singer: "BTS2", name: "好きだから", memo: "TEST2" },
    { id: 3, tag: "K", singer: "tt", name: "123123", memo: "yesy" },
    { id: 4, tag: "K", singer: "가나다", name: "가나다", memo: "가나다" },
    { id: 5, tag: "K", singer: "BTS", name: "Dynamite", memo: "TEST" },
    { id: 6, tag: "K", singer: "BTS2", name: "好きだから", memo: "TEST2" },
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

  const tagList = Array.from(new Set(data.map((item) => item.tag)));
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    rowId: number;
    field: keyof RowData;
  } | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleAddData = (newData: RowData) => {
    setData([...data, newData]);
    origin.push(newData);
  };

  function createBlankData() {
    const newId = Math.max(0, ...data.map((d) => d.id)) + 1;
    const tag = selectedTag || "";
    return { id: newId, tag: tag, singer: "", name: "", memo: "" };
  }

  const handleUpdate = (id: number, updatedData: Partial<RowData>) => {
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
    setData(
      produce(data, (draft) => {
        const index = draft.findIndex((item) => item.id === id);
        if (index !== -1) {
          draft.splice(index, 1);
        }
      })
    );
  };

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
        primaryCompare = aValue.localeCompare(bValue, "en", { numeric: true, sensitivity: "base" });
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
      <section id="table" className="flex justify-center lg:px-20 md:px-8 sm:px-2 bg-white border-r">
        <table className="table-fixed ">
          <thead className="sticky md:top-[96px] sm:top-[64px] z-10 bg-blue-100 whitespace-nowrap ">
            <tr className="sticky z-10 border-b-4 bg-gray-300">
              <th scope="col" className="sticky z-20 border-r w-32 text-left pl-4 py-2">
                <TagFilterButton
                  tagList={tagList}
                  selectedTag={selectedTag}
                  setSelectedTag={setSelectedTag}
                /></th>
              <th scope="col" className="sticky z-20 border-r w-52 text-left pl-4">원곡자</th>
              <th scope="col" className="sticky z-20 border-r w-[678px] text-left pl-4">제목</th>
              <th scope="col" className="sticky z-20 border-r w-[512px] text-left pl-4">메모</th>
              <th scope="col" className="sticky z-20 w-[60px] z-10 text-left pl-4">삭제</th>
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
                />
              ))}
          </tbody>
        </table>
      </section>
      <section className="flex justify-center">
        <button onClick={() => handleAddData(createBlankData())}>빈 데이터 추가</button>
      </section>
      <button onClick={() => handleAddData(createBlankData())}>데이터 추가</button>
      <button onClick={() => handleAddData(createBlankData())}>빈 데이터 추가</button>
      <button onClick={() => handleUpdate(1, { memo: "Updated memo" })}>데이터 변경</button>
      <button onClick={() => console.log(sortedData, "focus :", editingCell)}>데이터 확인</button>
      <button onClick={() => setEditingCell({ rowId: 2, field: "singer" })}>  포커스 확인</button>
    </main>
  );
}