import Link from "next/link";

const Header = () =>{
    return(
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
        )  
    }

export default Header;