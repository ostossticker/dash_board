"use client"

import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { signIn } from 'next-auth/react'
import React from 'react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

export const Social = () => {
  const onClick = (provider:"google" | "github") =>{
    signIn(provider,{
      callbackUrl:DEFAULT_LOGIN_REDIRECT
    })
  }
  return (
    <div className='flex items-center justify-center w-[260px] gap-x-2'>
        <button className='flex items-center p-2 ml-2 rounded-md' onClick={()=>onClick("google")}>
            <FcGoogle className='h-5 w-[30px]'/><p>Google</p>
        </button>
        <button className='flex items-center p-2 mr-2 rounded-md' onClick={()=>onClick("github")}>
            <FaGithub className='h-5 w-[30px]'/><p>GitHub</p>
        </button>
    </div>
  )
}
