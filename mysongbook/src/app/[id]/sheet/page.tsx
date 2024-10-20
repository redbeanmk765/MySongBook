"use client"

import Link from "next/link";
import Header from "@/components/Header";


export default function test(){
    return( 
        <html>
            <head>
            </head>

            <body>
                <main>
                    <Header/>

                    <section id="title" className="flex justify-center bg-gray-100 h-24" >
                        <table>
                            <thead>
                                <th>태그</th>
                                <th>원곡자</th>
                                <th>제목</th>
                                <th>메모</th>
                            </thead>

                            <tbody>
                                
                            </tbody>
                        </table>

                    </section>


                </main>
            </body>

        </html>
    );
}