"use client"

import Link from "next/link";
import Header from "../../components/Header";
import HookForm from "./registerForm";



export default function register(){
    return(
    <html>
        <head>

        </head>
        <body>
            <main>
                <Header />

                <section id="title" className="flex justify-center bg-gray-100 h-24" >
                    <div className="flex container items-center justify-start lg:w-[1520px] px-8">
                        <a className="px-4 inline-block vertical-align-middle "> 회원가입 </a>
                    </div>
                    
                </section>

                <section id="title" className="flex justify-start container mx-auto px-16">
                    <div className="flex justify-start bg-white lg:w-[1410px]">
                        <HookForm />
                    
                    </div>
                    
                </section>

                <div>
                    <nav>
                        <Link href="/">홈 </Link>
                        <Link href="/test">test</Link>

                    </nav>
                </div>
                
            </main>
        </body>
    </html>
  );
}