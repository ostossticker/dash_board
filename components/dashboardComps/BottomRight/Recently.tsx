"use client"
import useToggle from '@/hooks/stores'
import { useCurrentUser } from '@/hooks/use-current-user';
import { convertTime, dateFormat, fetchData } from '@/lib/functions';
import { url } from '@/lib/url';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';

type notificaiton = {
    id:string
    invNo:string;
    cusName1:string;
    invDate:string;
    invBus:string;
}

const Recently = () => {
    const router = useRouter()
    const {darkMode , isOpen , isHover,setNotiNum , onEdit , setQtid , setPassingId , setPrint} = useToggle()
    const [incr , setIncr] = useState<number>(10)
    const user = useCurrentUser()
    const {data , error} = useSWR(`${url}/api/notificaiton?email=${user.id}&take=${incr}`,fetchData)
   
    const note:notificaiton[] = data || []
    useEffect(()=>{
        setNotiNum(note.length || 0)
    },[data])

    if(error) return <div>Error fetching data</div>
  return (
    <div className={`${darkMode ? "bg-dark-box-color" : "bg-white"} col-span-1 shadow-md h-full rounded-lg xl:px-[30px] lg:px-[15px] xl:pb-[10px] lg:pb-[5px]`}>
        <div className={`flex items-center xl:pt-[30px] lg:pt-[15px] justify-start border-b-[1px] ${darkMode ? "text-dark-sm-color" : "text-[#a6afc7]"} pb-[5px]`}>
            <h1 className={`${isOpen || isHover ? "xl:text-[23px] lg:text-[13px]" : "xl:text-[25px] lg:text-[16px]"}  ${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"}`}>Notificaiton</h1>
        </div>

        <div className='py-[5px] h-[92%] flex flex-col justify-between'>
            <div>
            {
                note.map((item)=>{
                    return(
                        <div key={item.id} className={`flex justify-between border-b-[1px] lg:text-[8px] xl:text-[15px] ${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"} ${isOpen || isHover ? "py-[8px]" : "py-[10px]"}`}>
                            <div className='hover:text-insomnia-primary cursor-pointer' onClick={()=>{
                                router.push('/invoice/created')
                                onEdit()
                                setQtid('')
                                setPassingId(item.id)
                                setPrint(false)
                            }}>{item.invNo}</div>
                            <div>{item.cusName1}</div>
                            <div>{item.invBus}</div>
                            <div className='flex gap-1'>
                                <div className='pr-[5px]'>{!item.invDate ? '' : dateFormat(item.invDate)}</div>
                                <div>{item.invDate ? convertTime(item.invDate) : ''}</div>
                            </div>
                        </div>
                    )
                })
            }
            </div>
            <div className='flex justify-end'>
                <button className={`text-[#c3c9da] xl:pb-[10px] lg:pb-[5px] ${isOpen || isHover ? "xl:text-[15px] lg:text-[8px]" : ""}`} onClick={()=>setIncr(incr + 10)}>
                    More...
                </button>
            </div>
        </div>
    </div>
  )
}

export default Recently