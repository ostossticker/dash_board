"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import CardWrapper from './card-wrapper'
import { newPassword } from '@/actions/new-password'

const NewPasswordForm = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [pending , setPending] = useState<boolean>(false)
    const [error , setError] = useState<string| undefined>("")
    const [success ,setSuccess] = useState<string | undefined>("")
    
    const [password , setPassword] = useState<string>("")

    const onClick =  () =>{
        setPending(true)
        let validation = ''
        setError("")
        setSuccess("")
        
        if(!password){
            validation = "password required!"
        }else if (password.length < 6){
            validation = "need atleast 6 characters!"
        }
        setError(validation)
        if(!error){
             newPassword(password,token)
            .then((data)=>{
                if(data?.error){
                    setError(data.error)
                }
                if(data?.success){
                    setSuccess(data.success)
                    setPending(false)
                    router.push("/auth/login")
                }
            })
            .catch(()=>{
                setError("something went wrong")
            })
        }
    }
  return (
    <CardWrapper
        headerLabel='Enter a new password'
        backButtonLabel='Back to login'
        backButtonHref='/auth/login'
    >
        <div className='flex flex-col gap-y-2'>
            <label className='text-gray-500 text-sm'>Password</label>
            <input type="password" placeholder='******'
            className='px-4 py-2 border-b-[1px] w-[300px] border-gray-500 outline-none'
            value={password} onChange={(e)=>setPassword(e.target.value)}/>
            {error && <span className='bg-red-300 text-red-700 rounded-sm text-center'>{error}</span>}
            {success && <span className='bg-green-300 text-green-700 rounded-sm text-center'>{success}</span>}
            <div className='flex justify-center my-5'>
                <button className='bg-blue-500 disabled:bg-gray-500 py-2 w-[200px] text-white rounded-full' onClick={onClick}>
                    {pending ? <span className='loading loading-spinner text-default'></span> : <p>Reset!</p>}
                </button>
            </div>
        </div>
    </CardWrapper>
  )
}

export default NewPasswordForm