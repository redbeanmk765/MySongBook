import { ExternalLink, SquarePen  } from 'lucide-react';
import { useState } from 'react';
import { RowData } from "@/types/RowData";

interface LinkManagerProps {
  link: string
}

export default function LinkManager({ link } : LinkManagerProps) {
  const hasLink = !!link;


  return (
    <div className='w-full flex items-center justify-between'>
      {hasLink? (
        <ExternalLink onClick={() => window.open(link, '_blank')}/>
      ) : null}

      {/* <SquarePen onClick={()=> }/> */}
    </div>
  );
}