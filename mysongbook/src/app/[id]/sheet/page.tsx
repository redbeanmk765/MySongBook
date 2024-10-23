"use client"

import Link from "next/link";
import Header from "@/components/Header";


export default function sheet(){
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
                                <tr className="border-b bg-gray-300">
                                    <th className="border-r w-32 text-left pl-4 py-2">태그</th>
                                    <th className="border-r w-52 text-left pl-4">원곡자</th>
                                    <th className="border-r w-[678px] text-left pl-4" >제목</th>
                                    <th className="w-[512px] text-left pl-4">메모</th>
                                </tr>
                            </thead>

                            <tbody>
                             
                            </tbody>
                        </table>

                    </section>

                    <div className="relative overflow-x-auto">

    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Product name
                </th>
                <th scope="col" className="px-6 py-3">
                    Color
                </th>
                <th scope="col" className="px-6 py-3">
                    Category
                </th>
                <th scope="col" className="px-6 py-3">
                    Price
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Apple MacBook Pro 17"
                </th>
                <td className="px-6 py-4">
                    Silver
                </td>
                <td className="px-6 py-4">
                    Laptop
                </td>
                <td className="px-6 py-4">
                    $2999
                </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Microsoft Surface Pro
                </th>
                <td className="px-6 py-4">
                    White
                </td>
                <td className="px-6 py-4">
                    Laptop PC
                </td>
                <td className="px-6 py-4">
                    $1999
                </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Magic Mouse 2
                </th>
                <td className="px-6 py-4">
                    Black
                </td>
                <td className="px-6 py-4">
                    Accessories
                </td>
                <td className="px-6 py-4">
                    $99
                </td>
            </tr>
        </tbody>
    </table>
</div>
                    

                    


                </main>
            </body>

        </html>
    );
}