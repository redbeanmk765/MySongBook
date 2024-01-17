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
                <section className="flex justify-evenly items-center bg-gray-600 p-12 ">
                    <h1 className="text-blue-100 text-6xl ">
                        오늘은 무슨노래 부르지?
                        <br/>
                        <br/>
                        이사람은 어떤 노래를 부를 수 있지?
                    </h1>

                </section>

                <section className="flex justify-evenly items-center bg-black ">
                    <div/>
                    
                    <div className=" flex-none box-border p-12 border-4 box-content h-32 w-[500px] rounded text-center justify-center item-center bg-white">
                        
                        <span>나만의 노래책 만들기</span>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    
                        <div className="items-center py-2 px-3 z-8 border-2 border-neutral-500 rounded transition-colors hover:bg-neutral-700 ">
                            <span className="text-sm md:text-base"> 검색창 </span>
                        </div>

                    
                    </div >

                    <div className=" flex-none box-border p-12 border-4 box-content h-32 w-[500px] rounded text-center justify-center item-center bg-white">
                        
                        <span>다른이의 노래책 구경하기</span>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    
                        <p className="text-black-100 text-2xl ">상단의 검색창에서 유저이름 검색하기!</p>

                    
                    </div>

                    <div/>
                    
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
