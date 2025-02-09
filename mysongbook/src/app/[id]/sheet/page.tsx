"use client"

import Link from "next/link";
import Header from "@/components/Header";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {produce} from 'immer';

type rowData = {
    id : number;
    tag : string;
    singer : string;
    name : string;
    memo : string;
}

function Row({ data, handleAddData, handleUpdate, handleDelete}: {
  data: rowData, handleAddData:(newData: rowData) => void,
  handleUpdate:(id:number, updatedData: Partial<rowData>) => void,
  handleDelete:(id:number) => void,}) {

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
    const [isEditing2, setIsEditing2] = useState(false);
    let nameString = fieldName as string;
    const inputRef = useRef<HTMLInputElement>(null);

    const handleEditMode2 = () => {
      // 수정된 데이터를 서버에 저장하거나 다른 로직 실행
      console.log("test");
      setIsEditing2(true); 
    };

    useEffect(() => {
      if (isEditing2 && inputRef.current) {
          inputRef.current.focus();
      }
    }, [isEditing2]);

    const handleBlur = ((event: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(event);
      setIsEditing2(false);
      handleUpdate(data.id,{ [fieldName]: event.target.value});
    });

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      setEditedData({
        ...editedData,
        [event.target.name]: event.target.value
      });
      if (isEditing2 && inputRef.current) {
        inputRef.current.focus();
      }
    }, []);
    
    return (
      <td className="border-r w-32 text-left py-2 h-[37px]">
        {isEditing2 ? (
          <input
          
            type = "text"
            name = {nameString}
            defaultValue={editedData[fieldName]}
            // onChange={handleChange}
            onBlur={handleBlur}
            ref={inputRef}
            className="border-r w-full text-left pl-4 py-2 h-[30px]"
            
          />
        ) : (
          <span className="flex w-full text-left pl-4 h-[20px]" onClick={handleEditMode2}>{editedData[fieldName] }</span>
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
            <button className="relative w-8 h-8 bg-white rounded-full hover:bg-gray-200 focus:outline-none"
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
      {id : 2, tag : "K2", singer: "BTS2", name: "Dynamite2", memo: "TEST2"}
    ]

    const newData2: rowData = (
        {id : 4, tag : "K", singer: "BTS", name: "Dynamite", memo: "TEST"}
    )


    const [data, setData] = useState<rowData[]>(origin);
    const [max, setMax] = useState(2);

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

    const [sortKey, setSortKey] = useState<keyof rowData | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const sortedData = useMemo(() => {
      if (!sortKey) return data; // 정렬 기준이 없으면 원본 데이터 반환
  
      return [...data].sort((a, b) => {
          const aValue = a[sortKey];
          const bValue = b[sortKey];
  
          if (typeof aValue === 'string' && typeof bValue === 'string') {
              const comparison = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' }); // 숫자 포함 문자열 정렬
              return sortDirection === 'asc' ? comparison : -comparison;
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
              return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
          } else {
              return 0; // 다른 타입의 경우 정렬하지 않음
          }
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

      
    
    

    return( 
        <html>
            <head>
            </head>

            <body>
                <main>
                    <Header/>

                    <section id="table" className="flex justify-center  bg-white " >
                        <table className="table-fixed ">
                            <thead>
                                <tr className="border-b-4 bg-gray-300">
                                    <th scope="col" className="border-r w-32 text-left pl-4 py-2" >태그</th>
                                    <th scope="col" className="border-r w-52 text-left pl-4">원곡자</th>
                                    <th scope="col" className="border-r w-[678px] text-left pl-4" >제목</th>
                                    <th scope="col" className="border-r w-[512px] text-left pl-4">메모</th>
                                    <th scope="col" className="w-[60px] text-left pl-4">삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <Row key={item.id} data={item} handleAddData={handleAddData} handleUpdate={handleUpdate} handleDelete={handleDelete}/>
                                ))}
                            </tbody>
                        </table>
                    </section>
                    <section className="flex justify-center">
                      <button onClick={() => handleAddData(createBlankData())}>빈 데이터 추가</button> 
                    </section>

                    <button onClick={() => handleAddData(newData2)}>데이터 추가</button>
                    <button onClick={() => handleAddData(createBlankData())}>빈 데이터 추가</button>  
                    <button onClick={() => handleUpdate(1, { memo: 'Updated memo' })}>데이터 변경</button>
                    <button onClick={() => console.log(data)}>데이터 확인</button>
      

                </main>
            </body>

        </html>
    );
}