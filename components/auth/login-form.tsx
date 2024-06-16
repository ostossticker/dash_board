"use client"
import CardWrapper from './card-wrapper'
import { loginFunc } from '@/actions/Login'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import OtpInput from './otp-input'

type form = {
    email:string ,
     password:string ,
}

const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" 
        ? "Email already in use with different provider!"
        : ""
  const [val , setVal] = useState<form>({
    email:'',
    password:'',
  })
  const [otp , setOtp] = useState<string[]>(new Array(6).fill(""))

  const [pending , setPending] = useState<boolean>(false)
  const [showTwoFactor , setShowTwoFactor] = useState<boolean>(false);
  const [success , setSuccess] = useState<string | undefined>("")
  const [error , setError] = useState<string | undefined>("")
  const [errors , setErrors] = useState({
    email:'',
    password:'',
  })

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const {name , value} = e.target
    setVal({
        ...val,[name]:value
    })
 }
 const handleSubmit = () =>{
   
    setPending(true)
    setSuccess("")
    setError("")
    setErrors({
        email:'',
        password:'',
    })
    let validation = {
        email:'',
        password:'',
    }

    const {email , password } = val
    console.log(email , password)
    if(!password){
        validation.password = "password is required!"
    }else if(password.length < 4){
        validation.password = "ur dick too short need atleast 6 inch"
    }
    if(!errors.email && !errors.password){
        loginFunc(email , email , email , password,otp.join(""))
        .then((data)=>{
            if(data?.error){
                setError(data.error)
                setPending(false)
            }
            if(data?.success){
                setSuccess(data.success)
                setPending(false) 
                router.push('/dashboard')
            }
            if(data?.twoFactor){
                setShowTwoFactor(true);
                setPending(false)
            }
        })
        .catch(()=>{
            setError("something went wrong")
            setPending(false)
        })
    }
    setErrors(validation)
    setPending(false)
 }

  const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) =>{
    if(e.key === 'Enter'){
        handleSubmit()
    }
  }

  return (
    <CardWrapper
    headerLabel="Welcome to Insomnia"
    backButtonLabel='Create Account'
    backButtonHref='/auth/register'
    showSocial
    >
        {
            showTwoFactor && (
                <div className='flex flex-col gap-y-2'>


                    <label className='text-gray-500 text-sm'>Two Factor Code</label>
                    <OtpInput otp={otp} setOtp={setOtp} handleEvent={handleKeyDown}/>
                    {urlError && <span className='bg-red-300 text-red-700 rounded-sm text-center'>{urlError}</span>}
                    {error && <span className='bg-red-300 text-red-700 rounded-sm text-center'>{error}</span>}
                    {success && <span className='bg-green-300 text-green-700 rounded-sm text-center'>{success}</span>}
                    
                    <div className='flex justify-end text-sm text-gray-500 mt-1'>
                        <button>
                            <Link href="/auth/reset">
                                Forgot Password?
                            </Link>
                        </button>
                    </div>      
                    <div className='flex justify-center my-5'>
                    <button onClick={handleSubmit} type='submit' className='bg-blue-500 disabled:bg-gray-500 py-2 w-[200px] text-white rounded-full'>
                        {pending ? <span className='loading loading-spinner text-default'></span> : <p>Sign in</p>}
                    </button>
                    </div>
                    
                </div>
            )
        }
         {
            !showTwoFactor && (
                <div className='flex flex-col gap-y-2'>
                    <label className='text-gray-500 text-sm'>Email / Phone Number / Username</label>
                    <input type="email"
                    placeholder='Johndoe@example.com' 
                    value={val.email} 
                    onChange={handleChange} 
                    onKeyDown={handleKeyDown}
                    name='email' className='px-4 py-2 border-b-[1px] w-[300px] border-gray-500 outline-none'/>
                    {errors && <span className='bg-red-300 text-red-700 rounded-sm text-center'>{errors.email}</span>}
                    <label className='text-gray-500 text-sm'>Password</label>
                    
                    <input type="password" 
                    placeholder='*********' 
                    value={val.password} 
                    onChange={handleChange} 
                    onKeyDown={handleKeyDown}
                    name='password' 
                    className='px-4 py-2 border-b-[1px] border-gray-500 w-[300px] outline-none'/>
                    {errors && <span className='bg-red-300 text-red-700 rounded-sm text-center'>{errors.password}</span>}
                    {urlError && <span className='bg-red-300 text-red-700 rounded-sm text-center'>{urlError}</span>}
                    {error && <span className='bg-red-300 text-red-700 rounded-sm text-center'>{error}</span>}
                    {success && <span className='bg-green-300 text-green-700 rounded-sm text-center'>{success}</span>}
                    <div className='flex justify-end text-sm text-gray-500'>
                        <button>
                            <Link href="/auth/reset">
                                Forgot Password?
                            </Link>
                        </button>
                    </div>      
                    <div className='flex justify-center my-5'>
                    <button onClick={handleSubmit} className='bg-blue-500 disabled:bg-gray-500 py-2 w-[200px] text-white rounded-full'>
                        {pending ? <span className='loading loading-spinner text-default'></span> : <p>Sign in</p>}
                    </button>
                    </div>
                    
                </div>
            )
         }
        
      
    </CardWrapper>
  )
}

export default LoginForm