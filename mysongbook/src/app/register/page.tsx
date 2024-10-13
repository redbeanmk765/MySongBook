"use client"

import Link from "next/link";
import Header from "../../components/Header";
import HookForm from "./registerForm";



export default function register(){


    const handleSubmit=(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
    }

    return( 
    <main>
        <Header />

        <section id="title" className="flex justify-start container mx-auto px-4">
            <div className="flex justify-start bg-white lg:w-[1410px]">
                <a className="px-4"> 회원가입 </a>
            </div>
            
        </section>

        <section id="title" className="flex justify-start container mx-auto px-4">
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
  );
}