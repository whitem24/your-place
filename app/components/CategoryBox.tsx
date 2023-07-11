'use client';
import React, {useCallback} from 'react';
import { IconType } from 'react-icons/lib';
import { useRouter, useSearchParams} from "next/navigation";
import qs from 'query-string';

interface CategoryBoxProps {
    label: string,
    description?:string,
    icon: IconType,
    selected?:boolean
}
const CategoryBox = ({label, icon:Icon, selected}:CategoryBoxProps) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
      let currentQuery = {}

      //We parse params to string
      if (params) {
          currentQuery = qs.parse(params.toString());      
      }

      //We add a new, updating category after click
      const updatedQuery:any = {
        ...currentQuery,
        category:label
      }

      //Once the user click the icon again we will remove it
      if (params?.get('category') === label) {
        delete updatedQuery.category;    
      }
      const url = qs.stringifyUrl({
        query:updatedQuery,
        url:'/',
      }, { skipNull:true });

      router.push(url);
    },
    [label, params, router],
  )
  
  return (
    <div onClick={handleClick} className={`
            flex 
            flex-col 
            items-center 
            justify-center 
            gap-2 
            p-3 
            border-b-2
            hover:text-neutral-800 
            transition 
            cursor-pointer
            ${ selected ? 'border-b-neutral-800' : 'border-transparent' }
            ${ selected ? 'text-neutral-800' : 'text-neutral-500' }
            `}
    >
        <Icon size={26}/>
        <div className='font-medium text-sm'>
            {label}
        </div>
    </div>
  )
}

export default CategoryBox