import { ExternalLink, SquarePen  } from 'lucide-react';
import { use, useEffect, useRef, useState } from 'react';
import { RowData } from "@/types/RowData";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Input } from './ui/input';

interface LinkManagerProps {
  link: string
  updateValue: (value: string) => void;
}

export default function LinkManager({ link, updateValue } : LinkManagerProps) {
  const hasLink = !!link;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [inputValue , setInputValue] = useState(link);
  const [isValid, setIsValid] = useState(true);


  const isValidUrl = (url: string) => {
    if(!url) {
      return true;
    }
    try {
      new URL(url);
      return true;
    } catch (e) {
      if (url.includes('.') && url.length > 2) {
        try {
          new URL(`http://${url}`);
          return true;
        } catch (e) {
          return false;
        }
      }
      return false;
    }
  };

  useEffect(() => {
    setIsValid(!!isValidUrl(link));
  })

  const handleUpdate = (newLink: string) => {
      updateValue(newLink);
  }

  const handleChange = (newLink: string) => {
    setInputValue(newLink);
    setIsValid(!!isValidUrl(newLink));
  }

  const openExternalLink = () => {
    let fullLink = link;
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      fullLink = `https://${link}`;
    }
    window.open(fullLink, '_blank');
  };


  return (
    <div className={`group w-full h-full flex items-center justify-between px-1 hover:bg-gray-100 ${isDropDownOpen ? "bg-gray-100" : ""}`}>
      {(hasLink && isValid)? (
        <button className='h-7 w-7 rounded hover:bg-gray-100 flex items-center justify-center'>
          <ExternalLink onClick={openExternalLink} className= 'cursor-pointer w-5 h-5 text-gray-500 inline-block'/>
        </button>
      ) : (
        // ExternalLink가 없을 때, 빈 공간을 위한 더미 div를 렌더링
        <div className='h-7 w-7'></div>
      )}

      <DropdownMenu onOpenChange={setIsDropDownOpen}>
        <DropdownMenuTrigger asChild>
          <button className='h-7 w-7 rounded hover:bg-white flex items-center justify-center'>
            <SquarePen className= 'opacity-0 group-hover:opacity-100 cursor-pointer w-[18px] h-[18px] mt-[1px] text-gray-500 inline-block' />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="end"
          alignOffset={-4}
          sideOffset={1}
          className="min-w-[440px] max-h-96"
        >
          <Input 
            type="text" 
            ref={inputRef}
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={(e) => handleUpdate(e.target.value)}
            onKeyDown={(e) => { if(e.key === "Enter"){ e.preventDefault(); e.currentTarget.blur();}}}
            className="flex w-full min-w-0 rounded h-8 overflow-hidden whitespace-nowrap text-ellipsis focus-visible:ring-1 bg-gray-50 focus-visible:ring-gray-400"
          />

        </DropdownMenuContent>

      </DropdownMenu>
    </div>
  );
}