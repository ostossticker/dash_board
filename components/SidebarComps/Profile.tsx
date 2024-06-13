"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { IoIosArrowDown,IoIosNotifications, IoMdMail } from 'react-icons/io'
import { motion } from 'framer-motion'

////icons
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdOutlineAccountCircle } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import useToggle from '@/hooks/stores';
import { useCurrentUser } from '@/hooks/use-current-user'
import { logout } from '@/actions/logout'
import {FaTelegramPlane} from 'react-icons/fa'
import { url } from '@/lib/url'
import axios from 'axios'

type profileProps = {
  toggleMode:boolean
}

const Profile = ({toggleMode} : profileProps) => {
  const [hidden , setHidden] = useState<boolean>(false)
  const [image , setImage] = useState<string>('')
  const [name , setName] = useState<string>('')
  const [clik , setClik] = useState<boolean>(false)
  const user = useCurrentUser()

  //// theme switcher
  const {darkMode ,notiNum, toggleDarkMode,initializeDarkModeFromLocalStorage , setProfile , profile , refresh} = useToggle()

  useEffect(()=>{
    initializeDarkModeFromLocalStorage();
  },[initializeDarkModeFromLocalStorage])

  useEffect(()=>{
    const fetchData = async() =>{
     const {data} = await axios.get(`${url}/api/admins/${user.id}?email=${user?.id}`)
     setImage(data?.image)
     setName(data?.name)
    }
    
      fetchData()
    
},[profile , refresh])
  //// end theme switcher

  const openModal = () => {
    const modal = document.getElementById('my_modal_4') as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };


  const handleEnter = () =>{
    setHidden(true)
  }
  const handleLeave = () =>{
    setHidden(false)
  }

  const onClick = () =>{
    logout()
  }

  const LogoData = [
    {
      label:"Profile",
      icon:MdOutlineAccountCircle,
      func:()=>{}
    },
    {
      label:"Settings",
      icon:IoSettingsOutline,
      func:()=>{
        openModal()
        setProfile()
      }
    },
    {
      label:"Log Out",
      icon:RiLogoutBoxLine,
      func:onClick
    },
  ]

  return (
    <>
     <div className='cursor-pointer mx-[15px] ' onClick={async()=>{
      let token = "6779249789:AAGGMx5yDzNMbcWvm7gU8RkRtz1YIf3gdMg";
      let chat_id = "-1002185625635";
      const currentTime = new Date();
      setClik(true)
      if(user.telegramReport === true){
        const { data } = await axios.get(`${url}/api/telegram?email=${user.id}`);
        let myText = `Daily Report / Date ${currentTime.getDate().toString().padStart(2, '0')}-${(currentTime.getMonth()+1).toString().padStart(2, '0')}-${currentTime.getFullYear()}`;
        let urling = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${myText}:%0A - Invoice ${data.invoice} %0A - Total Expense $${data.expense.toFixed(2)} %0A - Total Sale $${data.sales.toFixed(2)} %0A - Total Paid $${data.paid.toFixed(2)}`;
        let api = new XMLHttpRequest();
        api.open("GET", urling, true);
        api.send();
      }
      setTimeout(()=>{
        setClik(false)
      },150)
     }}>
     <FaTelegramPlane size={25} color={clik === true ? "#3399ff" : "#F0F7FF" }/>
     </div>
    <div className='relative group cursor-pointer '>
    <IoMdMail size={25} color="#FFF"/>
    <div
            className="absolute  -top-[4px] -left-[355%] transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-[999] min-w-[80px] transform">
            <div className={`relative top-6 p-6  ${darkMode ? "bg-dark-lg-color" : "bg-gray-800"} rounded-xl shadow-xl w-[130px]`}>
              <div
                className={`w-10 h-10  ${darkMode ? "bg-dark-lg-color" : "bg-gray-800"} transform rotate-45 absolute top-0 right-5 z-0 -translate-x-4 transition-transform group-hover:translate-x-3 duration-500 ease-in-out rounded-sm`}>
              </div>
              <div className="relative z-10">
                <ul className="text-[15px]">
                  <li className='text-white'>
                    UPCOMING
                  </li>
                </ul>


              </div>
            </div>
          </div>
    </div>
    
    <div className='relative cursor-pointer mx-[8px]'>
    <IoIosNotifications size={25} className='flex' color="#FFF"/>
    {notiNum > 0 && (
        <span className="absolute top-0 right-0 -mt-1 -mr-2 bg-red-500 text-white rounded-full text-[11px] px-[6px] py-[2px]">
          {notiNum > 90 ? 99 : notiNum}
        </span>
      )}
    </div>

    <DarkModeSwitch
      onChange={toggleDarkMode}
      checked={darkMode}
      size={25}
      sunColor='white'
    />
    
    <div className='relative group flex cursor-pointer justify-center items-center' onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
    <div className={`border-[1px] ${toggleMode ? "border-dark-lg-color" : "border-[#ffb3b3]"} p-[3px] rounded-full ml-[8px]`}>
        <Image src={image ? image : user?.image || "/profile.jpg"} alt='Profile' width={30} height={50} className='rounded-full'/>

    </div>
    <p className={`ml-[5px] text-[#FFF]`}>{name ? name : user?.name || "Guest"}</p>
    <motion.div animate={
        hidden ? {
            rotate:0
        } : {
            rotate:180
        }
    }>
    <IoIosArrowDown size={12} className='mx-[5px]' color="#FFF"/>
    </motion.div>
    <div
            className={` absolute  top-1  transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible mr-5 group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-[999] min-w-[130px] transform`}>
            <div className={`relative top-6 p-6 ${darkMode ? "bg-dark-lg-color" : "bg-gray-800"} rounded-xl shadow-xl w-[130px]`}>
              <div
                className={`w-10 h-10  ${darkMode ? "bg-dark-lg-color" : "bg-gray-800"} transform rotate-45 absolute top-0 right-[15%] z-0 -translate-x-4 transition-transform group-hover:translate-x-3 duration-500 ease-in-out rounded-sm`}>
              </div>
              <div className="relative z-[999]">
                <ul className="text-[15px] ">
                  {
                    LogoData?.map((item)=>{
                      return(
                      <li key={item.label} onClick={item.func}>
                        <div className={`flex ${darkMode ? "text-dark-box-color" : "text-white"} py-1 items-center font-normal`}>
                          <item.icon size={15} className='mr-[5px]'/> {item.label}
                        </div>
                      </li>
                      )
                    })
                  }
                </ul>


              </div>
            </div>
          </div>
    
    </div>
   
    </>
  )
}

export default Profile