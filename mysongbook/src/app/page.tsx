import Link from "next/link";
import Header from "../components/Header";

export default function home(){
    return(
      <html>
        <head>


        </head> 

        
        <body>
            <Header />

            <main>
                <section className="flex justify-evenly items-center bg-black ">
                    <a/>
                    
                    <a className=" flex-none box-border p-12 border-4 box-content h-32 w-[600px] rounded text-center justify-center item-center bg-white">
                        
                        <span>나만의 노래책 만들기</span>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    
                        <div className="items-center py-2 px-3 z-8 border-2 border-neutral-500 rounded transition-colors hover:bg-neutral-700 ">
                            <span className="text-sm md:text-base"> 검색창 </span>
                        </div>

                    
                    </a>

                    <a className=" flex-none box-border p-12 border-4 box-content h-32 w-[600px] rounded text-center justify-center item-center bg-white">
                        
                        <span>나만의 노래책 만들기</span>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    
                        <div className="items-center py-2 px-3 z-8 border-2 border-neutral-500 rounded transition-colors hover:bg-neutral-700 ">
                            <span className="text-sm md:text-base"> 검색창 </span>
                        </div>

                    
                    </a>

                    <a/>
                    
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
