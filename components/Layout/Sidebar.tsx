"use client"
import useToggle from '@/hooks/stores';
import React, { useCallback, useEffect, useMemo, useRef, useState} from 'react'
import { useMediaQuery } from 'react-responsive';
import {motion} from 'framer-motion'

// * React icons
import { LuLayoutDashboard } from "react-icons/lu";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { TbFileInvoice} from "react-icons/tb";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { IoPeopleOutline } from "react-icons/io5";
import { MdPeopleOutline } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { AiOutlineDollar } from "react-icons/ai";
import {MdAdminPanelSettings} from 'react-icons/md'
import { FaRecycle } from "react-icons/fa";
import { TfiReceipt } from "react-icons/tfi";

import { useRouter } from 'next/navigation';
import MenuButton from '../SidebarComps/HamburgerIcon';
import SearchInput from '../SidebarComps/SearchInput';
import Profile from '../SidebarComps/Profile';
import Image from 'next/image';
import { UserRole } from '@prisma/client';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useBusiness, useCustomer, useEmployee, useNote, usePayment, useProduct, usePurchase, useQuotation, useReceipt, usedatainvoice } from '@/hooks/usedatas';
import { url } from '@/lib/url';
import axios from 'axios';
import { useCurrentUser } from '@/hooks/use-current-user';
import { PiNotebook } from "react-icons/pi";

type layoutProps = {
  children: React.ReactNode
}

const Sidebar = ({children}:layoutProps) => {
  const isFirstRun = useRef(true); // Create a ref to track the first run
  const router = useRouter()
  let isTabletMid = useMediaQuery({query:"(max-width:768px)"});
  let isLarge = useMediaQuery({query:"(max-width:1490px)"})
  const role = useCurrentRole()
  const useInvoice = usedatainvoice()
  const user = useCurrentUser()
  const quotationCheck = useQuotation()
  const receiptCheck = useReceipt()
  const businessCheck = useBusiness()
  const employeeCheck = useEmployee() 
  const customerCheck = useCustomer()
  const noteCheck = useNote()
  const prodCheck = useProduct()
  const purchaseCheck = usePurchase()
  const paymentCheck = usePayment()
  const [hour , setHour] = useState<number>(17)
  const [minute , setMinute] = useState<number>(0)
  ///end theme changer
  const {
    darkMode,
    onOpen , 
    onClose , 
    isOpen, 
    toggle , 
    setPrint,
    setPrinting,
    isHover , 
    onCloseHover , 
    onOpenHover,
    links,
    print,
    changeLink,
    onCancel,
  } = useToggle()

  useEffect(()=>{
    if(isTabletMid){
      onOpen()
    }else{
        onClose()
    }
  },[isTabletMid])

  useEffect(()=>{
    document.body.style.backgroundColor = darkMode ? "#1C2039" : "#F4F4F4";
  },[darkMode])

  const nav_animation = isTabletMid 
  ? {
    open: {
      x: 0,
      width: "16rem",
      transition: {
        damping: 40,
      },
    },
    closed: {
      x:isLarge ? -270 : -250,
      width: 0,
      transition: {
        damping: 40,
        delay: 0.15,
      },
    },
  }
: {
    open: {
      width: "16rem",
      transition: {
        damping: 40,
      },
    },
    closed: {
      width:isLarge ? "3.5rem" : "4rem",
      transition: {
        damping: 40,
      },
    },
  };

  const handleHover = () =>{
    if(!isOpen){
      onOpenHover()
    }
  }

  const handleLeave = () =>{
    if(!isOpen){
      onCloseHover()
    }
  }

  const handle = useCallback((e:string)=>{
    router.push(e)
    changeLink(e)
  },[router,changeLink])
 
  const leftMenu = useMemo(()=> [
    {
      label:"Menu",
      menus:[
        {
          icon:LuLayoutDashboard ,
          name:"Dashboard",
          class:'',
          link:"/dashboard"
        },
        {
          icon:LiaFileInvoiceDollarSolid ,
          name:"Invoice",
          class:`${role !== 'ADMIN' && useInvoice !== true && '!hidden'} mt-2.5`,
          link:"/invoice/table"
        },
        {
          icon:TbFileInvoice,
          name:"Quotation",
          class:`${role !== 'ADMIN' && quotationCheck !== true && '!hidden'} mt-2.5`,
          link:"/quotation/table"
        },
        {
          icon:TfiReceipt,
          name:"Receipt",
          class:`${role !== 'ADMIN' && receiptCheck !== true && '!hidden'} mt-2.5`,
          link:"/receipt/table"
        }
      ]
    },
    {
      label:"Management",
      class:"pt-5",
      menus:[
        {
          icon:MdOutlineBusinessCenter ,
          name:"Business",
          class:`${role !== 'ADMIN' && businessCheck !== true && '!hidden'} mt-2.5`,
          link:"/bussiness/table"
        },
        {
          icon:IoPeopleOutline ,
          name:"Employee",
          class:`${role !== 'ADMIN' && employeeCheck !== true && '!hidden'} mt-2.5`,
          link:"/employee/table"
        },
        {
          icon:MdPeopleOutline,
          name:"Customer",
          class:`${role !== 'ADMIN' && customerCheck !== true && '!hidden'} mt-2.5`,
          link:"/customer/table"
        },
        {
          icon: BsBoxSeam,
          name:"Product",
          class:`${role !== 'ADMIN' && prodCheck !== true && '!hidden'} mt-2.5`,
          link:"/product/table"
        },
        {
          icon: BiPurchaseTagAlt,
          name:"Purchase",
          class:`${role !== 'ADMIN' && purchaseCheck !== true && '!hidden'} mt-2.5`,
          link:"/purchase/table"
        },
        
        {
          icon:AiOutlineDollar,
          name:"Payment",
          class:`${role !== 'ADMIN' && paymentCheck !== true && '!hidden'} mt-2.5`,
          link:"/payment/table"
        },
        {
          icon:PiNotebook,
          name:"Note",
          class:`${role !== 'ADMIN' && noteCheck !== true && '!hidden'} mt-2.5`,
          link:"/note/table"
        }
      ]
    },
    {
      label:"Others",
      class:"pt-5",
      menus:[
        {
          icon:FaRecycle,
          name:"Recycles",
          class:"mt-2.5",
          link:"/recycle/table"
        },
        {
          icon: MdAdminPanelSettings,
          name:"Admin",
          class:"mt-2.5",
          link:"/admin"
        },
      ]
    },
    
  ],[])

  useEffect(()=>{
    let token = process.env.TOKEN;
    let chat_id = process.env.CHATID;
  
    if (isFirstRun.current) {
      isFirstRun.current = false;

      const eveningFunc = async () => {
        const currentTime = new Date();

        
        if(user.alarmTime){
        const alarTime = user.alarmTime
        const [hour , minute] = alarTime.split('-')
        const val = parseInt(hour || '17',10)
        const val1 = parseInt(minute || '0',10)
          setHour(val)
          setMinute(val1)
        }
        if(currentTime.getHours() === hour && currentTime.getMinutes() === minute){
          const lastRunDate = localStorage.getItem('lastRunDate')
          const today = new Date().toDateString();
          if(lastRunDate !== today){
              const { data } = await axios.get(`${url}/api/telegram?email=${user.id}`);
              let myText = `Daily Report / Date ${currentTime.getDate().toString().padStart(2, '0')}-${(currentTime.getMonth()+1).toString().padStart(2, '0')}-${currentTime.getFullYear()}`;
              let urling = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${myText}:%0A - Invoice ${data.invoice} %0A - Total Expense $${data.expense.toFixed(2)} %0A - Total Sale $${data.sales.toFixed(2)} %0A - Total Paid $${data.paid.toFixed(2)}`;
              let api = new XMLHttpRequest();
              api.open("GET", urling, true);
              api.send();
          }
        }
      };

      if(user && user.telegramReport === true){
        eveningFunc();
      }

      const reload = async() =>{
        try{
          const userId = user.id
          console.log('User Id:',userId)
        }catch(error){
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
      reload()
    }

    
    
  },[])

  return (
    <div className='flex'>
      {/*w-[14rem] h-full xl:h-screen lg:h-screen md:h-screen max-w-[14rem]**/}
       {/*overflow-hidden top-0 fixed md:top-0 md:sticky lg:top-0 lg:sticky*/}
    <div>
        <div onClick={()=>{
          onCloseHover()
          onClose()
        }} className={`md:hidden fixed inset-0 max-h-screen z-[998] bg-black/50 ${isOpen? "block" : "hidden"}`}>
          
        </div>
       <motion.div
       variants={nav_animation}
       initial={{ x: isTabletMid ? -250 : 0 }}
        animate={isOpen || isHover ? "open" : "closed"}
       className={` ${darkMode ? "bg-dark-sidebar" : "bg-[#024466]"} text-gray shadow-xl z-[999] lg:max-w-[11rem] lg:w-[11rem] xl:max-w-[16rem] xl:w-[16rem]
       overflow-hidden top-0 fixed md:top-0 md:sticky lg:top-0 lg:sticky h-screen`}
       
       
       onMouseEnter={handleHover}
       onMouseLeave={handleLeave}
       >
        <div className='flex justify-center items-center lg:pt-[15px] lg:pb-[7px] xl:pt-5 xl:pb-3 mx-3 lg:px-[10px]'>
          <Image
              src="/abc.png"
              width={150}
              height={150}
              alt=""
            />
            
        </div>
        <div className='flex flex-col h-full'>
          <ul className={`whitespace-pre 
          px-2.5 
          text-[0.9rem] 
          pb-5 flex 
          flex-col 
          gap-1  
          font-medium 
          overflow-x-hidden 
          scrollbar-thin 
          ${darkMode ? "scrollbar-track-dark-box-color scrollbar-thumb-dark-sm-color" : "scrollbar-track-[#024466] scrollbar-thumb-[#024466]"}
          
          
          md:h-[68%] h-[70%]`}>
            {
              leftMenu?.map((item)=>{
                return(
                  <React.Fragment key={item.label}>
                    {
                      item.label === 'Others' && role !== UserRole.ADMIN ? (
                        <>
                        
                        </>
                      ) : (
                        <li>
                            {
                              (isOpen || isHover || isTabletMid) && (
                                <div className={`${darkMode ? "text-dark-lg-color" : "text-[#FFF]"} lg:pt-[15px] lg:pb-[5px]  xl:pt-[20px] xl:pb-2.5 lg:p-2  xl:p-2.5 xl:text-lg lg:text-md ${item.class}`}>
                                  {item.label}
                                </div>
                              )
                            }
                            {
                              item.menus.map((subItem)=>{
                                return(
                                  <div key={subItem.name} className={`linked group 
                                  ${subItem.class} 
                                  ${isOpen || isHover ? "xl:pl-[30px] lg:pl-[20px] pr-2.5" : "px-2.5 "} xl:py-2 lg:py-1 text-[#b1b8ce] 
                                  ${links === subItem.link ? "active" : ""}`} onClick={()=>{handle(subItem.link),setPrint(false),setPrinting(''),onCancel()}}>
                                    <subItem.icon className={`min-w-max ${links === subItem.link ? 'text-white':`group-hover:text-white text-[#b1b8ce]`} xl:text-[23px] lg:text-[18px]`}  />
                                    <p className='group-hover:text-white lg:text-[12px] xl:text-[15px]'>{subItem.name}</p>
                                  </div>
                                )
                              })
                            }
                            
                          </li>
                      )
                    }
                  </React.Fragment>
                  
                )
              })
            }
            
            


          </ul>
          
        </div>
        
       </motion.div>
       <div className="m-3 md:hidden " onClick={onOpen}>
       <MenuButton
            isOpen={isOpen}
            onClick={toggle}
            toggleMode={darkMode}
          />
      </div>
    </div>
    {/***************************************************** */}
    <div className='w-full'>
       <header className={isTabletMid || print ? "hidden" : "top-0 sticky z-10"}>
          <motion.nav
          initial={false}
          animate={isOpen || isHover ? "open" : "closed"}
          custom="100%"
          className={`flex justify-between items-center h-18 p-2 transition-all duration-300 ${darkMode ? "bg-dark-sidebar" : "bg-insomnia-primary"}`}
          > 
          <div className='flex justify-center items-center'>
          <MenuButton
            isOpen={isOpen}
            onClick={toggle}
            toggleMode={darkMode}
          />
          {/********************** */}
          <SearchInput/>
          {/********************** */}
          </div>
          <div className='flex justify-center items-center'>
            <Profile
            toggleMode={
              darkMode
            }
            />
          </div>
          </motion.nav>
        </header>
        <div className='relative'>
        <div className={`${isTabletMid || print ? "" : "bg-insomnia-primary"} absolute z-1 w-full xl:h-[130px] lg:h-[90px]`}>
              
            </div>
        <main className='xl:px-10 xl:pb-10 xl:pt-5 lg:px-4 lg:pb-4 lg:pt-5 relative z-2'>
            
            {children}
          </main>
        </div>
    </div>
        
    </div>
  )
}

export default Sidebar