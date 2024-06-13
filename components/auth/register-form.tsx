"use client"
import React, { useState } from 'react'
import CardWrapper from './card-wrapper'
import { RegisterFunc } from '@/actions/Register'
import { TestApi } from '@/actions/test'
import { useRouter } from 'next/navigation'

type  formProps = {
    username:string,
    email:string,
    cpassword:string,
    password:string,
    phoneNumber:string
}

const RegisterForm = () => {
     const router = useRouter()
     const [pending , setPending] = useState<boolean>(false)
     const [val , setVal] = useState<formProps>({
        username:'' , 
        email:'' ,
        cpassword:'' ,
        password:'',
        phoneNumber:''
     })

     const [success , setSuccess] = useState<string | undefined>("")
     const [error , setError] = useState<string | undefined>("")
     const [errors , setErrors] = useState<formProps>({
        username:'',
        email:'',
        cpassword:'',
        password:'',
        phoneNumber:''
     })

     const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const {name , value} = e.target
        if((name === 'phoneNumber') && isNaN(Number(value))){
            setVal(prev=>({
                ...prev,
                [name]:''
            }))
        }else{
            setVal(prev=>({
                ...prev,[name]:value
            }))
        }
     }
     const handleSubmit = async () =>{
        setPending(true)
        setSuccess("")
        setError("")
        setErrors({
            username:'',
            email:'',
            password:'',
            cpassword:'',
            phoneNumber:''
        })

        
        const {username , email , password , cpassword , phoneNumber} = val
        if(!errors.username || !errors.password || !errors.cpassword){
            RegisterFunc(username , email , password , cpassword,phoneNumber)
            .then((data)=>{

                if(data?.error){
                 setError(data.error)
                 setPending(false)
                }
                    if(data?.errorname){
                    setErrors(prev=>({
                        ...prev,
                       username:data.errorname
                    }))
                    setPending(false)
                   }
                   if(data?.errorpass){
                    setErrors(prev=>({
                        ...prev,
                        password:data.errorpass
                    }))
                    setPending(false)
                   }
                   if(data?.errorcpass){
                    setErrors(prev=>({
                        ...prev,
                        cpassword:data.errorcpass
                    }))
                    setPending(false)
                   }
                if(data?.success){
                    setSuccess(data.success)
                    setPending(false)
                    router.push("/auth/login")
                }
            })
            .catch(()=>{
                setError("something went wrong")
                setPending(false)
                setTimeout(() => {
                    router.push('/auth/register')
                }, 200);
        
            })
        }else{
            if(errors){
                setTimeout(() => {
                    router.push('/auth/register')
                }, 200);
            }
            setPending(false)
        }

        console.log(errors)
     }


     const onClick = async() =>{
        alert("yes")
        const data = {test1:"1" ,test2:"2"}
        const arrays = [
            {description:"something",qty:1,unitprice:1,total:1},
            {description:"something1",qty:2,unitprice:2,total:2},
        ]
        await TestApi(data,arrays)
     }

  return (
    <>
    <CardWrapper
    headerLabel="Hellow new commers :D"
    backButtonLabel='Already have an account?'
    backButtonHref='/auth/login'
    >
        <div className='flex flex-col gap-y-2'>
            <label className='text-gray-500 text-sm'>Username &quot;optional</label>
            <input type="text" placeholder='username' name='username' value={val.username} onChange={handleChange} 
            className='px-4 py-2 border-b-[1px] w-[300px] border-gray-500 outline-none'/>
            {errors && <span className='bg-red-300 text-red-700'>{errors.username}</span>}
            <label className='text-gray-500 text-sm'>Phone Number &quot;optional</label>
            <input type="text" placeholder='phone number' name='phoneNumber' value={val.phoneNumber} onChange={handleChange} 
            className='px-4 py-2 border-b-[1px] w-[300px] border-gray-500 outline-none'/>
            {errors && <span className='bg-red-300 text-red-700'>{errors.phoneNumber}</span>}
            <label className='text-gray-500 text-sm'>Email &quot;optional</label>
            <input type="email" placeholder='email' name='email' value={val.email} onChange={handleChange} 
            className='px-4 py-2 border-b-[1px] w-[300px] border-gray-500 outline-none'/>
            {errors && <span className='bg-red-300 text-red-700'>{errors.email}</span>}
            <label className='text-gray-500 text-sm'>Password</label>
            <input type="password" placeholder='password' value={val.cpassword} onChange={handleChange} name='cpassword' 
            className='px-4 py-2 border-b-[1px] w-[300px] border-gray-500 outline-none'/>
            {errors && <span className='bg-red-300 text-red-700'>{errors.cpassword}</span>}
            <label className='text-gray-500 text-sm'>Confirm Password</label>
            <input type="password" name="password" value={val.password} onChange={handleChange} placeholder='confirm password' 
            className='px-4 py-2 border-b-[1px] w-[300px] border-gray-500 outline-none'/>
            {errors && <span className='bg-red-300 text-red-700'>{errors.password}</span>}
            {error && <span className='bg-red-300 text-red-700 rounded-sm text-center'>{error}</span>}
            {success && <span className='bg-green-300 text-green-700 rounded-sm text-center'>{success}</span>}
            <div className='flex justify-center my-5'>
                <button onClick={handleSubmit} className='bg-blue-500 disabled:bg-gray-500 py-2 w-[200px] text-white rounded-full'>
                    {pending ? <span className='loading loading-spinner text-default'></span> : <p>Sign up</p>}
                </button>
            </div>
        </div>
        
    </CardWrapper>
    <div className='hidden'>
        <button className='bg-red-400' onClick={onClick}>login</button>
    </div>
    </>
  )
}

export default RegisterForm
