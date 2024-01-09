import Link from "next/link";

export default function home(){
    return(
      <html>
        <head>


        </head> 

        
        <body>
          <header className="sticky top-0 z-10 flex justify-between items-center h-16 md:h-24 px-2 md:px-6 bg-white border-b border-neutral-800">
              
          <div className="flex justify-center w-1500">
                <a className="flex items-center py-2 px-3 z-8 border-2 border-neutral-500 rounded-md transition-colors hover:bg-neutral-700 ">
                    <span className="text-sm md:text-base"> 검색창 </span>
                </a>
              </div>

              <div className="flex justify-center w-1500">
                <a className="flex items-center py-2 px-3 z-8 border-2 border-neutral-500 rounded-md transition-colors hover:bg-neutral-700 ">
                    <span className="text-sm md:text-base"> 검색창ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd </span>
                </a>
              </div>

              <div className="flex justify-center w-100">
                <a className="flex items-center py-2 px-3 z-8 border-2 border-neutral-500 rounded-md transition-colors hover:bg-neutral-700 ">
                    <span className="text-sm md:text-base"> 검색창 </span>
                </a>
              </div>

          </header> 
          
            <div>
                <h1> test page </h1>
            </div>

            <div>
                <nav>
                    <Link href="/">홈 </Link>
                    <Link href="/test">test</Link>

                </nav>
            </div>
              
        </body>
      </html>
    );
}
