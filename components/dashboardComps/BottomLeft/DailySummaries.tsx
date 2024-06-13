"use client"
import useToggle from '@/hooks/stores';
import React, { useEffect, useState } from 'react'
import { MdOutlineArrowDropDown } from "react-icons/md";
import { MdOutlineArrowDropUp } from "react-icons/md";
import CountUp from 'react-countup';
import axios from 'axios';
import { url } from '@/lib/url';
import { useCurrentUser } from '@/hooks/use-current-user';

type valProps = {
    paid:number;
    total:number;
    unpaid:number,
    paidStat:string;
    unpaidStat:string;
    totalStat:string;
}

const DailySummaries = () => {
    const getFormattedDate = (offset: number) => {
        const today = new Date();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + offset);
        const day = ('0' + targetDate.getDate()).slice(-2); // Adding leading zero if necessary
        const month = ('0' + (targetDate.getMonth() + 1)).slice(-2); // Adding leading zero if necessary
        const year = targetDate.getFullYear();
        return `${year}-${month}-${day}`; 
    };
  const user = useCurrentUser()
  const {isHover , isOpen ,darkMode} = useToggle()
  const [filter , setFilter] = useState<string>(getFormattedDate(0))
  const [val , setVal] = useState<valProps>({
    paid:0,
    total:0,
    unpaid:0,
    paidStat:'',
    unpaidStat:'',
    totalStat:''
  })
  const placeholderData = [
    {
        Status:"sale",
        Icon: val.totalStat === 'increase' ? MdOutlineArrowDropUp : MdOutlineArrowDropDown,
        iconColor:`${val.totalStat === 'increase' ? "#37dbc5" : "#ff807f"}`,
        total:val.total
    },
    {
        Status:"Paid",
        Icon:val.paidStat === 'increase' ? MdOutlineArrowDropUp : MdOutlineArrowDropDown,
        iconColor:`${val.paidStat === 'increase' ? "#37dbc5" : "#ff807f"}`,
        total:val.paid
    },
    {
        Status:"Unpaid",
        Icon:val.unpaidStat === 'increase' ? MdOutlineArrowDropUp : MdOutlineArrowDropDown,
        iconColor:`${val.unpaidStat === 'increase' ? "#37dbc5" : "#ff807f"}`,
        total:val.unpaid
    },
    
  ]

  
  useEffect(()=>{
    const fetchPaid = async () =>{
        const {data} = await axios.get(`${url}/api/dailyCard?email=${user.id}&mode=${'paid'}&filterDate=${filter}`)
        setVal(prev=>({
            ...prev,
            paid:data.total,
            paidStat:data.status
        }))
    }
    fetchPaid()
    const fetchUnpaid = async () =>{
        const {data} = await axios.get(`${url}/api/dailyCard?email=${user.id}&mode=${'unpay'}&filterDate=${filter}`)
        setVal(prev=>({
            ...prev,
            unpaid:data.total,
            unpaidStat:data.status
        }))
    }
    fetchUnpaid()
    const fetchTotal = async () =>{
        const {data} = await axios.get(`${url}/api/dailyCard?email=${user.id}&filterDate=${filter}`)
        setVal(prev=>({
            ...prev,
            total:data.total,
            totalStat:data.status
        }))
    }
    fetchTotal()
  },[filter])

  const placeholderClass = `text-start ${isOpen || isHover ? "xl:py-[8px] lg:py-[2px]" : "xl:py-[10px] lg:py-[3px]"} ${darkMode ? "text-dark-lg-color" : ""}`

  return (
    <div className={`${darkMode ? "bg-dark-box-color" : "bg-white"} col-span-1 shadow-md rounded-lg ${isOpen || isHover ? "xl:h-[476px] lg:h-[290px]" : "xl:h-[503px] lg:h-[315px]"} xl:px-[30px] lg:px-[15px] xl:pb-[10px] lg:pb-[5px]`}>
        <div className='flex items-center xl:pt-[30px] lg:pt-[15px] justify-between'>
            <h1 className={`${isOpen || isHover ? "xl:text-[23px] lg:text-[16px]" : "xl:text-[25px] lg:text-[16px]"}  ${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"}`}>Daily</h1>
            <div className='flex items-center'>
                <select className={`${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"} ${isOpen || isHover ? "xl:text-[15px] lg:text-[13px]" : "lg:text-[13px]"} text-end outline-none bg-transparent`} value={filter} onChange={(e)=>setFilter(e.target.value)}>
                    <option className='text-black'value={getFormattedDate(0)}>Today</option>
                    <option className='text-black' value={getFormattedDate(-1)}>Yesterday</option>
                    
                </select><MdOutlineArrowDropDown color={`${darkMode ? "white" : "black"}`}/>
            </div>
        </div>

        <div>
            <div>
               <CountUp prefix='$' duration={1} className={`font-bold ${isOpen || isHover ? "xl:text-[28px] lg:text-[15px]" : "lg:text-[18px] xl:text-[30px]"} ${darkMode ? "text-dark-lg-color" : ""}`} decimals={2} end={val.total}/>
               <p className={`${isOpen || isHover ? "xl:text-[15px] lg:text-[10px]" : "xl:text-sm lg:text-[9px]"} text-[#c3c9da]`}>Current Balance</p>
            </div>
            <table className='w-full'>
                <tbody>
                    {
                        placeholderData?.map((item)=>{
                            return( 
                            <tr key={item.Status} className='lg:text-[11px] xl:text-[15px]'>
                                <td className={placeholderClass}><item.Icon size={20} color={item.iconColor}/></td>
                                <td className={placeholderClass}>{item.Status}</td>
                                <td className={`text-end ${isOpen || isHover ? "xl:py-[8px] lg:py-[2px]" : "xl:py-[10px] lg:py-[3px]"} ${darkMode ? "text-dark-lg-color" : ""}`}>${item.total}</td>
                            </tr>
                            )
                        })
                    }
                    {
                        (()=>{
                            let row = [];
                            for(let i = 6; i > placeholderData.length; i--){
                               row.push(
                                <tr key={i * Date.now()} className='lg:text-[11px] xl:text-[15px]'>
                                    <td className={`${isOpen || isHover ? "xl:py-[8px] lg:py-[2px]" : "xl:py-[10px] lg:py-[3px]"} invisible`}>{"s"}</td>
                                    <td className={isOpen || isHover ? "xl:py-[8px] lg:py-[2px]" : "xl:py-[10px] lg:py-[3px]"}></td>
                                    <td className={isOpen || isHover ? "xl:py-[8px] lg:py-[2px]" : "xl:py-[10px] lg:py-[3px]"}></td>
                                </tr>
                               ) 
                            }
                            return row;
                        })()
                    }
                </tbody>
            </table>
            <div className='flex justify-end invisible'>
                <button className={`text-[#c3c9da] pb-[10px]`}>More...</button>
            </div>
            <button className={`bg-insomnia-primary w-full xl:h-[45px] lg:h-[35px] rounded-md font-semibold text-white ${isOpen || isHover ? "xl:text-[15px] lg:text-[8px]" : " xl:text-[17px] lg:text-[10px]"}`}>Print Daily Report</button>
        </div>
    </div>
  )
}

export default DailySummaries
