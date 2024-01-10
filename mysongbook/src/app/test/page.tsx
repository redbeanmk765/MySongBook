import Link from "next/link";
import Header from "../../components/Header";


export default function test(){
    return( 
        <main>
            <div>
                <h1> test page </h1>
            </div>

            <div>
                <nav>
                    <Link href="/">홈 </Link>
                    <Link href="/test">test</Link>

                </nav>
            </div>
            
      </main>
    );
}