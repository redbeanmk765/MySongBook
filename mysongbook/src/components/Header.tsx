import Link from "next/link";

const Header = () =>{
    return(
        <header className="sticky top-0 z-10 flex justify-between items-center h-16 md:h-24 px-2 md:px-6 bg-white border-b border-neutral-800">
              
              
                <div className="flex-none items-center py-2 px-3 z-8 border-2 border-neutral-500 rounded-md transition-colors hover:bg-neutral-700 ">
                   
                    <Link href="/ " className="text-sm md:text-base">메인 화면</Link>
                    
                </div>
              

              
                <div className="flex-none items-center py-2 px-3 z-8   w-[700px] border-2 border-neutral-500 rounded-md transition-colors hover:bg-neutral-700 ">
                    <span className="text-sm md:text-base">  </span>
                </div>
             

              
                <div className="flex-none items-center py-2 px-3 z-8 border-2 border-neutral-500 rounded-md transition-colors hover:bg-neutral-700 ">
                    <span className="text-sm md:text-base"> 로그인 </span>
                </div>
             

        </header> 
        )  
    }

export default Header;
