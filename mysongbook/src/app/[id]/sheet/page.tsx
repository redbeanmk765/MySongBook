"use client"

import Link from "next/link";
import Header from "@/components/Header";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {produce} from 'immer';
import { spawn } from "child_process";

type rowData = {
    id : number;
    tag : string;
    singer : string;
    name : string;
    memo : string;
}

function Row({ data, handleAddData, handleUpdate, handleDelete, editingCell, setEditingCell}: {
  data: rowData, handleAddData:(newData: rowData) => void,
  handleUpdate:(id:number, updatedData: Partial<rowData>) => void,
  handleDelete:(id:number) => void,
  editingCell: { rowId: number, field: keyof rowData } | null,
  setEditingCell: React.Dispatch<React.SetStateAction<{ rowId: number, field: keyof rowData } | null>>}) { 

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(data);

  

  
    
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData({
      ...editedData,
      [event.target.name]: event.target.value
    });
  };

  const handleSave = () => {
    // 수정된 데이터를 서버에 저장하거나 다른 로직 실행
    console.log('Saved data:', editedData);
    setIsEditing(false);
  };

  const handleEditMode = () => {
    // 수정된 데이터를 서버에 저장하거나 다른 로직 실행
    setIsEditing(true); 
  };

  const handleBlur = () => {
    setIsEditing(false);
  };



 function GenerateTd({ fieldName }: { fieldName: keyof rowData}){  
    const isEditingTd = editingCell?.rowId === data.id && editingCell.field === fieldName;
    let nameString = fieldName as string;
    
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocusTd = () => {
      //setEditingCell({ rowId: data.id, field: fieldName });

    };  

    const handleClickTd = () => {
      //console.log("click :" , data.id , "fieldName:", fieldName, "editingCell:", editingCell); 
      setEditingCell({ rowId: data.id, field: fieldName });
    }

    useEffect(() => {
      if(
        editingCell?.rowId === data.id &&
        editingCell.field === fieldName &&
        inputRef.current
        ) {
         inputRef.current.focus();
        }

      if (editingCell === null) {
       //console.log("focus 해제 후 실행!");
      } 
    }, [editingCell]);
    
    

    const handleBlur = ((event: React.FocusEvent<HTMLInputElement>) => {
      const relatedTarget = event.relatedTarget as HTMLElement | null;

      if (
        relatedTarget &&
        relatedTarget.hasAttribute("data-id") &&
        relatedTarget.hasAttribute("data-field")
      ) {
      const rowId = Number(relatedTarget.getAttribute("data-id"));
      const field = relatedTarget.getAttribute("data-field") as keyof rowData;
      setEditingCell({ rowId, field });
      } else{
        setEditingCell(null);
      }

      handleChange(event);
      handleUpdate(data.id,{ [fieldName]: event.target.value}); 
      
      //console.log("focus :" , data.id, event.target.value, "isEditingTd:", isEditingTd); 
      //console.log("newFocus :", event.relatedTarget);
    });

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setEditedData(prev => ({
        ...prev,
        [name]: value
      }));
    }, []);

    const spanRef = useRef<HTMLSpanElement>(null);
    const [spanWidth, setSpanWidth] = useState<number | null>(null);

    useEffect(() => {
      //console.log("spanRef.current:", spanRef.current);
      if (!isEditingTd && spanRef.current) {
        setSpanWidth(spanRef.current.offsetWidth); 
        console.log("spanWidth:", spanRef.current.offsetWidth);
      }
    }, [isEditingTd, editedData[fieldName]]);
    
    return (
      <td className="border-r w-32 text-left py-2 h-[37px] overflow-hidden whitespace-nowrap text-ellipsisce">
        {isEditingTd ? (
          <input
            type = "text"
            name = {nameString}
            defaultValue={editedData[fieldName] ?? ""}
            //onChange={handleChange}
            onBlur={handleBlur}
            key={`${data.id}-${fieldName}`}
            ref={inputRef}
            style={spanWidth ? { width: spanWidth } : undefined}
            //ㄴonClick={handleClickTd}
            className="border-r w-full text-left pl-4 py-2 h-[30px]"
          />
        ) : (
          <span 
            className="flex w-full text-left pl-4 h-[20px]" 
            data-id={data.id}
            data-field={fieldName}
            tabIndex={0}
            onFocusCapture={handleClickTd} 
          >
            {editedData[fieldName] }
          </span>
        )}
      </td>
    );
  }


  return (
    <tr className="border-b bg-white text-sm">
        <>
          <GenerateTd fieldName = {"tag" as keyof rowData}/>
          <GenerateTd fieldName = {"singer" as keyof rowData}/>
          <GenerateTd fieldName = {"name" as keyof rowData}/>
          <GenerateTd fieldName = {"memo" as keyof rowData}/>
          <td className="pl-[15px] pt-[3px]">
            <button className="relative w-8 h-8 z-0 bg-white rounded-full hover:bg-gray-200 focus:outline-none"
                    onClick={() => handleDelete(data.id)}>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-black rotate-45"></span>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-black -rotate-45"></span>
            </button>
          </td>
        </>
    </tr>
  );    

    // return (
    //   <tr className="border-b bg-white text-sm">
    //     <td className="border-r w-32 text-left pl-4 py-2 h-[37px]">{data.tag}</td>
    //     <td className="border-r w-52 text-left pl-4">{data.singer}</td>
    //     <td className="border-r w-[678px] text-left pl-4">{data.name}</td>
    //     <td className="w-[512px] text-left pl-4">{data.memo}</td>
    //   </tr>
    // );
};


  



export default function sheet(){
    const origin: rowData[] = [
      {id : 1, tag : "K", singer: "BTS", name: "Dynamite", memo: "TEST"},
      {id : 2, tag : "K", singer: "BTS2", name: "好きだから", memo: "TEST2"},
      {id : 3, tag : "K", singer: "tt", name: "123123", memo: "yesy"},
      {id : 4, tag : "K", singer: "가나다", name: "가나다", memo: "가나다"},
      {id : 5, tag : "K", singer: "BTS", name: "Dynamite", memo: "TEST"},
      {id : 6, tag : "K", singer: "BTS2", name: "好きだから", memo: "TEST2"},
      {id : 7, tag : "K", singer: "tt", name: "123123", memo: "yesy"},
      {id : 8, tag : "K", singer: "가나다", name: "가나다", memo: "가나다"},
      {id : 9, tag : "K", singer: "BTS", name: "Dynamite", memo: "TEST"},
      {id : 10, tag : "K", singer: "BTS2", name: "好きだから", memo: "TEST2"},
      {id : 11, tag : "K", singer: "tt", name: "123123", memo: "yesy"},
      {id : 12, tag : "K", singer: "가나다", name: "가나다", memo: "가나다"},
      {id : 13, tag : "K", singer: "BTS", name: "Dynamite", memo: "TEST"},
      {id : 14, tag : "K", singer: "BTS2", name: "好きだから", memo: "TEST2"},
      {id : 15, tag : "K", singer: "tt", name: "123123", memo: "yesy"},
      {id : 16, tag : "K", singer: "가나다", name: "가나다", memo: "가나다"},
    ]

    const [data, setData] = useState<rowData[]>(origin);
    const [max, setMax] = useState(4);

    const tagList = Array.from(new Set(data.map(item => item.tag)));

    const [editingCell, setEditingCell] = useState<{ rowId: number, field: keyof rowData } | null>(null);
    

    const handleAddData = (newData: rowData) => {
        setData([...data, newData]); // 기존 데이터에 새로운 데이터 추가
        origin.push(newData);
    };

    function createBlankData() {
      let newId = max + 1;
      setMax(max + 1);

      const blankData: rowData = (
        {id : newId, tag : "", singer: "", name: "", memo: ""}
      )


      return blankData;
    }

    const handleUpdate = (id: number, updatedData: Partial<rowData>) => {
      setData(
        produce(data, (draft) => {
          const index = draft.findIndex((item) => item.id === id);
          if (index !== -1) {
            // draft[index]를 직접 수정하면 됩니다.
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
            draft.splice(index, 1); // draft에서 직접 splice 사용
          }
        })
      );
    };

    const [sortKey, setSortKey] = useState<keyof rowData | null>("tag");
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const sortedData = useMemo(() => {
      if (!sortKey) return data; // 정렬 기준이 없으면 원본 데이터 반환
  
      return [...data].sort((a, b) => {
          const aValue = a[sortKey];
          const bValue = b[sortKey];

        // 빈 문자열 우선 처리
        const aIsEmpty = aValue === "";
        const bIsEmpty = bValue === "";

        if (aIsEmpty && !bIsEmpty) return 1;   // a가 빈 문자열이면 b보다 뒤로
        if (!aIsEmpty && bIsEmpty) return -1;  // b가 빈 문자열이면 a가 앞으로
      
          let primaryCompare = 0;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          primaryCompare = aValue.localeCompare(bValue, "en", { numeric: true, sensitivity: 'base' });
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          primaryCompare = aValue - bValue;
        }

        if (primaryCompare !== 0) {
          return sortDirection === 'asc' ? primaryCompare : -primaryCompare;
        }

        // 2순위: name (고정)
        const nameCompare = a.name.localeCompare(b.name, "ko", { numeric: true, sensitivity: 'base' });
        return sortDirection === 'asc' ? nameCompare : -nameCompare;
      });
    }, [data, sortKey, sortDirection]);

    const handleSort = (key: keyof rowData) => {
      if (sortKey === key) {
          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
          setSortKey(key);
          setSortDirection('asc');
      }
    };

      
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    

    return( 
        <html>
            <head>
            </head>

            <body>
                <main>
                    <Header/>

                    

                    {/* <button onClick={() => setSelectedTag(null)}>전체</button>
                      {tagList.map(tag => (
                        <button key={tag} onClick={() => setSelectedTag(tag)}>
                          {tag}
                        </button>
                      ))} */}
                    <section id="table" className="flex justify-center lg:px-20 md:px-8 sm:px-2 bg-white border-r" >
                        <table className="table-fixed ">
                            <thead className="sticky md:top-[96px] sm:top-[64px] z-10 bg-blue-100">
                                <tr className="sticky z-10 border-b-4 bg-gray-300">
                                    <th scope="col" className="sticky z-20 border-r w-32 text-left pl-4 py-2" >태그</th>
                                    <th scope="col" className="sticky z-20 border-r w-52 text-left pl-4">원곡자</th>
                                    <th scope="col" className="sticky z-20 border-r w-[678px] text-left pl-4" >제목</th>
                                    <th scope="col" className="sticky z-20 border-r w-[512px] text-left pl-4">메모</th>
                                    <th scope="col" className="sticky z-20 w-[60px] z-10 text-left pl-4">삭제</th>
                                </tr>
                            </thead>
                            <tbody>                                                      
                                {sortedData
                                  .filter(item => !selectedTag || item.tag === selectedTag)
                                  .map(item => (
                                    <Row 
                                      key={item.id} 
                                      data={item} 
                                      handleAddData={handleAddData} 
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
                    <button onClick={() => handleUpdate(1, { memo: 'Updated memo' })}>데이터 변경</button>
                    <button onClick={() => console.log(sortedData, "focus :" , editingCell)}>데이터 확인</button>
                    <button onClick={() => setEditingCell({ rowId: 2, field: "singer" })}>  포커스 확인</button>

                </main>
            </body>

        </html>
    );
}