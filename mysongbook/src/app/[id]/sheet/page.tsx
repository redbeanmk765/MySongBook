"use client"

import Link from "next/link";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

type rowData = {
    tag : string;
    singer : string;
    name : string;
    memo : string;
}

const Row = ({ data, handleAddData }: { data: rowData, handleAddData: (newData: rowData) => void}) => {

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


  return (
    <tr className="border-b bg-white text-sm">
      {isEditing ? (
        <>
          {/* 수정 모드일 때 */}
          <td><input type="text" name="tag" value={editedData.tag} onChange={handleChange} className="border-r w-32 text-left pl-4 py-2 h-[37px]" /></td>
          {/* ... 다른 컬럼도 동일하게 input으로 변경 */}
          <td><button onClick={handleSave}>저장</button></td>
        </>
      ) : (
        <>
          {/* 일반 모드일 때 */}
          <td className="border-r w-32 text-left pl-4 py-2 h-[37px]">{data.tag}</td>
          <td><button onClick={handleEditMode}>수정</button></td>
          {/* ... 다른 컬럼도 동일하게 */}
        </>
      )}
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
    ]

    const blankData: rowData = (
        {tag : "", singer: "", name: "", memo: ""}
    )

    const newData2: rowData = (
        {tag : "K", singer: "BTS", name: "Dynamite", memo: "TEST"}
    )


    const [data, setData] = useState<rowData[]>(origin);

    const handleAddData = (newData: rowData) => {
        setData([...data, newData]); // 기존 데이터에 새로운 데이터 추가
        origin.push(newData);
    };
    

    return( 
        <html>
            <head>
            </head>

            <body>
                <main>
                    <Header/>

                    <section id="table" className="flex justify-center bg-white " >
                        <table className="table-fixed ">
                            <thead>
                                <tr className="border-b-4 bg-gray-300">
                                    <th scope="col" className="border-r w-32 text-left pl-4 py-2" >태그</th>
                                    <th scope="col" className="border-r w-52 text-left pl-4">원곡자</th>
                                    <th scope="col" className="border-r w-[678px] text-left pl-4" >제목</th>
                                    <th scope="col" className="w-[512px] text-left pl-4">메모</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <Row key={index} data={item} handleAddData={handleAddData} />
                                ))}

                            </tbody>
                        </table>

                    </section>

                    <button onClick={() => handleAddData(newData2)}>데이터 추가</button>
                    <button onClick={() => handleAddData(blankData)}>빈 데이터 추가</button>

                </main>
            </body>

        </html>
    );
}