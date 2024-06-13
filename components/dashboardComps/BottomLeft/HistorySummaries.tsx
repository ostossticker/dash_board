"use client"
import useToggle from '@/hooks/stores';
import React, { useEffect, useState } from 'react'
import { MdOutlineArrowDropDown } from "react-icons/md";
import { MdOutlineArrowDropUp } from "react-icons/md";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import CountUp from 'react-countup';
import axios from 'axios';
import { url } from '@/lib/url';
import { useCurrentUser } from '@/hooks/use-current-user';
import { dateFormat } from '@/lib/functions';

type invoiceProps = {
    id:string;
    invDate:string;
    balance:string;
    status:string;
}

const HistorySummaries = () => {
  const user = useCurrentUser()
  const { isOpen , isHover ,darkMode} = useToggle()
  const [data , setData] = useState<invoiceProps[]>([]) 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
  const [totalBalance , setTotalBalance] = useState<number>(0)
  const [today , setToday] = useState<number>(0)
  const [yesterday , setYesterday] = useState<number>(0)
  
  useEffect(()=>{
    const fetchData = async () => {
        try {
          const {data} = await axios.get(`${url}/api/history?email=${user.id}&page=${currentPage}`);
          setData(data.item);
          setHasNextPage(data.nextPage !== null);
          setHasPrevPage(data.prevPage !== null);
          setToday(data.today)
          setYesterday(data.yesterday)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData()
      const fetchData1 = async () =>{
        try{
            const {data} = await axios.get(`${url}/api/historyTotal?email=${user.id}`)
            setTotalBalance(data)
        }catch(error){
            console.error('Error fetching data:', error);
        }
      }
      fetchData1()
  },[currentPage])

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const placeholderClass = `text-start ${isOpen || isHover ? "xl:py-[8px] lg:py-[2px]" : "xl:py-[10px] lg:py-[3px]"} ${darkMode ? "text-dark-lg-color" : ""}`

  return (
    <div className={`${darkMode ? "bg-dark-box-color" : "bg-white"} shadow-md col-span-1 rounded-lg ${isOpen || isHover ? "xl:h-[476px] lg:h-[290px]" : "xl:h-[503px] lg:h-[315px]"} xl:mt-[40px] lg:mt-[16px] xl:px-[30px] lg:px-[15px] xl:pb-[10px] lg:pb-[5px] relative`}>
        <div className='flex items-center xl:pt-[30px] lg:pt-[15px] justify-between'>
            <h1 className={`${isOpen || isHover ? "xl:text-[23px] lg:text-[16px]" : "xl:text-[25px] lg:text-[16px]"} ${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"}`}>History</h1>
            <div className='flex items-center'>
                {hasPrevPage && (
                    <button className='flex justify-center items-center cursor-pointer' onClick={goToPrevPage}>
                    <IoMdArrowDropleft size={18} color='#c3c9da'/>
                    <p className={`${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"} ${isOpen || isHover ? "xl:text-[15px] lg:text-[13px]" : "lg:text-[13px]"} text-end`}>Prev</p>
                    </button> 
                )}
                {hasNextPage ? (
                    <button className='flex justify-center items-center cursor-pointer' onClick={goToNextPage}>
                    <p className={`${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"} ${isOpen || isHover ? "xl:text-[15px] lg:text-[13px]" : "lg:text-[13px]"} text-end `}>Next</p>
                     <IoMdArrowDropright size={18} color='#c3c9da'/>
                     </button>
                ):(
                    <button className='flex justify-center items-center cursor-pointer' >
                    <p className={`${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"} ${isOpen || isHover ? "xl:text-[15px] lg:text-[13px]" : "lg:text-[13px]"} text-end `}>Next</p>
                     <IoMdArrowDropright size={18} color='#c3c9da'/>
                     </button>
                )} 
                              
            </div>
        </div>

        <div className='relative h-[82.5%] flex flex-col justify-between'>

            <div>
            <div>
            <CountUp decimals={2} duration={1} prefix='$' className={`font-bold ${isOpen || isHover ? "xl:text-[28px] lg:text-[15px]" : "lg:text-[18px] xl:text-[30px]"} ${darkMode ? "text-dark-lg-color" : ""}`} end={totalBalance}/>
               <p className={`${isOpen || isHover ? "xl:text-[15px] lg:text-[10px]" : "xl:text-sm lg:text-[9px]"} text-[#c3c9da]`}>Current Balance</p>
            </div>
            <table className='w-full '>
                <tbody>
                    <tr className='lg:text-[11px] xl:text-[15px]'>
                        <td className={placeholderClass}>{today > yesterday ? <MdOutlineArrowDropUp size={20} color='#37dbc5'/> : <MdOutlineArrowDropDown size={20} color='#ff807f'/>}</td>
                        <td className={placeholderClass}>Today</td>
                        <td className={`text-end ${isOpen || isHover ? "xl:py-[8px] lg:py-[2px]" : "xl:py-[10px] lg:py-[3px]"} ${darkMode ? "text-dark-lg-color" : ""}`}>${today.toFixed(2)}</td>
                    </tr>
                    <tr className='lg:text-[11px] xl:text-[15px]'>
                        <td className={placeholderClass}>{yesterday > today ? <MdOutlineArrowDropUp size={20} color='#37dbc5'/> : <MdOutlineArrowDropDown size={20} color='#ff807f'/>}</td>
                        <td className={placeholderClass}>Yesterday</td>
                        <td className={`text-end ${isOpen || isHover ? "xl:py-[8px] lg:py-[2px]" : "xl:py-[10px] lg:py-[3px]"} ${darkMode ? "text-dark-lg-color" : ""}`}>${yesterday.toFixed(2)}</td>
                    </tr>
                    {
                        data?.map((item)=>{
                            return(
                            <tr key={item.id} className={`${item.invDate === 'Today' || item.invDate === 'Yesterday' ? "hidden" : ""} lg:text-[11px] xl:text-[15px]`}>
                                <td className={placeholderClass}>{item.status === 'increases' ? <MdOutlineArrowDropUp size={20} color='#37dbc5'/> :item.status === 'same' ? '' : <MdOutlineArrowDropDown size={20} color='#ff807f'/>}</td>
                                <td className={placeholderClass}>{item.invDate === 'Today' || item.invDate === 'Yesterday' ? item.invDate : dateFormat(item.invDate)}</td>
                                <td className={`text-end ${isOpen || isHover ? "xl:py-[8px] lg:py-[2px]" : "xl:py-[10px] lg:py-[3px]"} ${darkMode ? "text-dark-lg-color" : ""}`}>${parseFloat(item.balance).toFixed(2)}</td>
                            </tr>
                            )
                        })
                    }
                

                </tbody>
            </table>
            <div className='flex justify-end invisible'>
                <button>x</button>
            </div>
            </div>

            <div className='h-[25%] flex items-end'>
            <button className={`bg-insomnia-primary w-full xl:h-[45px] lg:h-[35px] rounded-md font-semibold text-white ${isOpen || isHover ? "xl:text-[15px] lg:text-[8px]" : "xl:text-[17px] lg:text-[10px]"}`}>Print Daily Report</button>
            </div>
        </div>
    </div>
  )
}

export default HistorySummaries