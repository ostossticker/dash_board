"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

type loginButtonProps = {
    children:React.ReactNode
    mode?:"modal" | "redirect"
    asChild?:boolean
}

const LoginButton = ({
    children,
    mode = "redirect",
    asChild
}:loginButtonProps) => {
    const router = useRouter()
    const onClick = () =>{
        router.push("/auth/login");
    }
    if(mode === "modal"){
        return(
            <span>
                TODO: implement modal
            </span>
        )
    }
  return (
    <div onClick={onClick} className='cursor-pointer'>
        {children}
    </div>
  )
}

export default LoginButton