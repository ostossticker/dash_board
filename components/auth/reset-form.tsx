"use client"
import React, { useState } from 'react'
import CardWrapper from './card-wrapper'
import { resetPass } from '@/actions/reset'

const ResetForm = () => {
    const [pending , setPending] = useState<boolean>(false)
    const [email , setEmail] = useState<string>("")
    const [error , setError] = useState<string | undefined>("")
    const [success , setSuccess] = useState<string | undefined>("")

    const onClick = () =>{
        setPending(true)
        const validateEmail = (email: string): boolean => {
            // Regular expression for email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
        let validation = ''
        setError("")
        setSuccess("")

        if(!email){
            validation = "email is required!"
        }else if (!validateEmail(email)){
            validation = ""
        }   
        setError(validation)
        resetPass(email)
        .then((data)=>{
            if(data?.error){
                setError(data?.error)
            }
            if(data?.success){
                setSuccess(data?.success)
                setPending(false)
            }
        })
        .catch(()=>{
            setError("something went wrong")
        })
    }
  return (
    <CardWrapper
        headerLabel='Forgot your password'
        backButtonLabel='Back to login'
        backButtonHref='/auth/login'
    >
        <div className='flex flex-col gap-y-2'>
            <label className='text-gray-500 text-sm'>Email</label>
            <input type="email" className='px-4 py-2 border-b-[1px] w-[300px] border-gray-500 outline-none' value={email} placeholder='Johndoe@example.com'  onChange={(e)=>setEmail(e.target.value)}/>
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

export default ResetForm