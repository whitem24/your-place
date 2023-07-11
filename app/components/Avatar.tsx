'use client';
import Image from 'next/image';
import React from 'react';

interface AvatarProps {
  src:string | null | undefined;
}
const Avatar = ({src}:AvatarProps) => {
  return (
    <Image className='rounded-full' height={20} width={20}  alt='Avatar' src={src || '/images/avatar.png'}/>
  )
}

export default Avatar