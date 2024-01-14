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
                    <a className="flex box-border  p-4 border-4 rounded item-center bg-white">
                        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                    </a>

                    <a className="flex box-border h-32 w-32 p-4 border-4 rounded item-center bg-white">
                        B
                    </a>
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
