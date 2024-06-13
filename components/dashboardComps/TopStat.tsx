"use client"
import React, { useEffect, useState } from 'react'
import { MdOutlineArrowDropDown } from "react-icons/md";
import { MdOutlineArrowDropUp } from "react-icons/md";

//all summaries icons
import { IoCart } from 'react-icons/io5';
import { FaMoneyBillAlt } from 'react-icons/fa';
import { IoWalletSharp } from 'react-icons/io5';
import { MdOutlineMoneyOff } from 'react-icons/md';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import { FaHandshakeSimple } from 'react-icons/fa6';
import CountUp from 'react-countup'
import useToggle from '@/hooks/stores';
import axios from 'axios';
import { url } from '@/lib/url';
import { useCurrentUser } from '@/hooks/use-current-user';

type topstatProps = {
    caltoday:number;
    calyesterday:number;
    changeType:string;
    percentageChange:string;
}

type unpaidProps = {
    thisMonth:number;
    lastMonth:number;
    percentageChange:string;
    changeType:string;
}

type totalProps = {
    thisMonth:string;
    lastMonth:number;
    percentageChange:string
    changeType:string;
}

type expProps = {
    caltoday:number;
    calyesterday:number;
    changeType:string;
    percentageChange:string;
}

type customerProps = {
    thisMonth:number;
    lastMonth:number;
    percentageChange:string;
    changeType:string;
}

const TopStat = () => {
  const { darkMode , isHover , isOpen} = useToggle()
  const [val , setVal] = useState<topstatProps>({
    caltoday:0,
    calyesterday:0,
    changeType:'',
    percentageChange:''
  })
  const [paid , setPaid] = useState<topstatProps>({
    caltoday:0,
    calyesterday:0,
    changeType:'',
    percentageChange:''
  })
  const [unpaid , setunpaid] = useState<unpaidProps>({
    thisMonth:0,
    lastMonth:0,
    percentageChange:'',
    changeType:''
  })
  const [total , setTotal] = useState<totalProps>({
    thisMonth:'',
    lastMonth:0,
    percentageChange:'',
    changeType:''
  })
  const [exp , setExp] = useState<expProps>({
    caltoday:0,
    calyesterday:0,
    changeType:'',
    percentageChange:''
  })
  const [customer , setCustomer] = useState<customerProps>({
    thisMonth:0,
    lastMonth:0,
    percentageChange:'',
    changeType:''
  })
  
  const user = useCurrentUser()
  useEffect(()=>{
    const fetchdata = async() =>{
        const {data} = await axios.get(`${url}/api/daily?email=${user.id}`)
        setVal(prev=>({
            ...prev,
            caltoday:data.caltoday,
            calyesterday:data.calyesterday,
            changeType:data.changeType,
            percentageChange:data.percentageChange
        }))
    }
    fetchdata()
    const fetchdata5 = async() =>{
        const {data} = await axios.get(`${url}/api/dailyPaid?email=${user.id}`)
        setPaid(prev=>({
            ...prev,
            caltoday:data.caltoday,
            calyesterday:data.calyesterday,
            changeType:data.changeType,
            percentageChange:data.percentageChange
        }))
    }
    fetchdata5()
    const fetchData1 = async ( ) =>{
        const {data} = await axios.get(`${url}/api/unpaid?email=${user.id}`)
        setunpaid(prev=>({
            ...prev,
            thisMonth:data.thisMonth,
            lastMonth:data.lastMonth,
            percentageChange:data.percentageChange,
            changeType:data.changeType
        }))
    }
    fetchData1()
    const fetchdata2 = async () =>{
        const {data} = await axios.get(`${url}/api/totalsales?email=${user.id}`)
        setTotal(prev=>({
            ...prev,
            thisMonth:data.thisMonth,
            lastMonth:data.lastMonth,
            percentageChange:data.percentageChange,
            changeType:data.changeType
        }))
    }
    fetchdata2()
    const fetchData3 = async () =>{
        const {data} = await axios.get(`${url}/api/expenses?email=${user.id}`)
        setExp(prev=>({
            ...prev,
            caltoday:data.caltoday,
            calyesterday:data.calyesterday,
            changeType:data.changeType,
            percentageChange:data.percentageChange
        }))
    }
    fetchData3()
    const fetchdata4 = async () =>{
        const {data} = await axios.get(`${url}/api/customer?email=${user.id}`)
        setCustomer(prev=>({
            ...prev,
            thisMonth:data.thisMonth,
            lastMonth:data.lastMonth,
            percentageChange:data.percentageChange,
            changeType:data.changeType
        }))
    }
    fetchdata4()
  },[])


  ////iconColor:"#ff5656",
////iconBorderColor:"bg-[#fcdede]",

  const allSummaries = [
    {
        status:"Today",
        percentage:val.caltoday,
        icon:IoCart,
        iconColor:"#FFF",
        iconBorderColor:"bg-[#00BCD4]",
        stat:val.percentageChange === 'Infinity' ? 0 : parseFloat(val.percentageChange),
        upDownIcon:val.changeType === 'increase' ? MdOutlineArrowDropUp : MdOutlineArrowDropDown,
        statIcon:`${val.changeType === 'increase' ? '#37dbc5' : '#ff807f'}`,
        statClass:`${val.changeType === 'increase' ? 'text-[#37dbc5]' : 'text-[#ff807f]'}`, 
        label:"Daily Sales"
    },
    {
        status:"Today",
        percentage:paid.caltoday,
        icon:IoWalletSharp,
        iconColor:"#FFF",
        iconBorderColor:"bg-[#00BCD4]",
        stat:val.percentageChange === 'Infinity' ? 0 : parseFloat(val.percentageChange),
        upDownIcon:val.changeType === 'increase' ? MdOutlineArrowDropUp : MdOutlineArrowDropDown,
        statIcon:`${val.changeType === 'increase' ? '#37dbc5' : '#ff807f'}`,
        statClass:`${val.changeType === 'increase' ? 'text-[#37dbc5]' : 'text-[#ff807f]'}`,  
        label:"Daily Paid"
    },
    {
        status:"This Month",
        percentage:unpaid.thisMonth,
        icon:MdOutlineMoneyOff,
        iconColor:"#FFF",
        iconBorderColor:"bg-[#00BCD4]",
        stat:unpaid.percentageChange === 'Infinity' ? 0 : parseFloat(unpaid.percentageChange),
        upDownIcon:unpaid.changeType === 'increase' ? MdOutlineArrowDropUp : MdOutlineArrowDropDown,
        statIcon:`${unpaid.changeType === 'increase' ? '#37dbc5' : '#ff807f'}`,
        statClass:`${unpaid.changeType === 'increase' ? 'text-[#37dbc5]' : 'text-[#ff807f]'}`, 
        label:"Total Unpaid"
    },
    {
        status:"This Month",
        percentage: parseFloat(total.thisMonth),
        icon:FaMoneyBillAlt,
        iconColor:"#FFF",
        iconBorderColor:"bg-[#00BCD4]",
        stat:total.percentageChange === 'Infinity' ? 0 : parseFloat(total.percentageChange),
        upDownIcon:total.changeType === 'increase' ? MdOutlineArrowDropUp : MdOutlineArrowDropDown,
        statIcon:`${total.changeType === 'increase' ? '#37dbc5' : '#ff807f'}`,
        statClass:`${total.changeType === 'increase' ? 'text-[#37dbc5]' : 'text-[#ff807f]'}`, 
        label:"Total Sales"
    },
    {
        status:"This Month",
        percentage:exp.caltoday,
        icon:FaMoneyCheckAlt,
        iconColor:"#FFF",
        iconBorderColor:"bg-[#00BCD4]",
        stat:exp.percentageChange === 'Infinity' ? 0 : parseFloat(exp.percentageChange),
        upDownIcon:exp.changeType === 'increase' ? MdOutlineArrowDropUp : MdOutlineArrowDropDown,
        statIcon:`${exp.changeType === 'increase' ? '#37dbc5' : '#ff807f'}`,
        statClass:`${exp.changeType === 'increase' ? 'text-[#37dbc5]' : 'text-[#ff807f]'}`, 
        label:"Total Expenses"
    },
    {
        status:"This Month",
        percentage:customer.thisMonth,
        icon:FaHandshakeSimple,
        iconColor:"#FFF",
        iconBorderColor:"bg-[#00BCD4]",
        stat:customer.percentageChange === 'Infinity' ? 0 : parseFloat(customer.percentageChange),
        upDownIcon:customer.changeType === 'increase' ? MdOutlineArrowDropUp : MdOutlineArrowDropDown,
        statIcon:`${customer.changeType === 'increase' ? '#37dbc5' : '#ff807f'}`,
        statClass:`${customer.changeType === 'increase' ? 'text-[#37dbc5]' : 'text-[#ff807f]'}`,  
        label:"Invoices"
    },
    
  ]

  
  return (
    <div className='grid grid-cols-6 xl:gap-10 lg:gap-4'>

        {
            allSummaries?.map((item)=>{
                return(
                    <div key={item.label} className={
                        `
                        lg:col-span-1
                        col-span-6 
                        rounded-lg 
                        ${darkMode ? "bg-dark-box-color" : "bg-[#ffffff] "}
                        flex
                        justify-between
                        xl:p-6
                        lg:p-4
                        shadow-md
                        `
                    }>
                        <div>
                            <p className={`${darkMode? "text-dark-md-color" : "text-[#c3c9da]"} lg:text-[8px] xl:text-[15px]`}>{item.status}</p>
                            {
                                item.label === 'Invoices' ? (
                                    <CountUp duration={1} className={`${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"} lg:text-[15px] xl:text-[25px] font-semibold`} end={item.percentage} />
                                ) : (
                                    <CountUp prefix='$' duration={1} className={`${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"} lg:text-[15px] xl:text-[25px] font-semibold`} decimals={2} end={item.percentage} />
                                )
                            }
                            <div className='flex items-center text-[15px]'>
                            <item.upDownIcon size={15} color={item.statIcon} />
                            <CountUp duration={1} className={`${item.statClass} lg:text-[9px] xl:text-[15px]`} decimals={2} end={item.stat}/>
                            </div>
                            <p className={`${darkMode ? "text-dark-sm-color" : "text-[#bdbec2]"} lg:text-[8px] xl:text-[15px]`}>{item.label}</p>
                        </div>
                        <item.icon className={`${item.iconBorderColor} rounded-full xl:p-2 lg:p-[4px] ${isHover || isOpen ? "lg:w-[30px] lg:h-[30px] xl:w-[50px] xl:h-[50px]" : "lg:w-[34px] lg:h-[34px] xl:w-[54px] xl:h-[54px]"}`}  color={item.iconColor}/>
                    </div>
                )
            })
        }
    </div>
  )
}

export default TopStat