"use client"

import Link from 'next/link';
import React from 'react'

type BackButtonProps ={
    href:string;
    label:string;
}

const BackButton = ({href,label}:BackButtonProps) => {
  return (
    <div className='font-normal w-full text-center text-sm my-5'>
          New to Insomnia?
        <Link href={href} className='ml-2 text-blue-500 border-b-[1px] border-blue-400'>
        {label}
        </Link>
    </div>
  )
}

export default BackButton