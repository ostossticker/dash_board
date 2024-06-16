"use client"
import useToggle from '@/hooks/stores'
import React from 'react'
import { IoIosNotifications } from 'react-icons/io'
import { PiNotePencilBold } from "react-icons/pi";
import Modal from '../ui/modal/modal';
import Create from '../customer/create';

type topProps = {
  children:React.ReactNode;
  text:string;
  classname?:string;
  topTitle:string
  which?:string;
}



const Top = ({topTitle,text,classname,which,children,...props}:topProps) => {
  const { darkMode ,print , notification , setNotifcation , enableNote , setEnableNote} = useToggle()

  const openModal = () => {
    const modal = document.getElementById('my_modal_5') as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <>
    <div className={`flex justify-between px-1 ${print === true ? "!hidden" : ""}`}>
        <h1 className={`font-bold ${darkMode ? "text-dark-lg-color" : "text-white"} text-[30px]`}>{text}</h1>
        <div className='flex items-center'>
        {
          which === 'invoice' && (
            <button className={`py-1 text-white ${!notification ? "bg-insomnia-primary" : "bg-[#BFBFBF]"} px-1 my-2 rounded-md mr-[10px]`} onClick={setNotifcation}>
             <IoIosNotifications size={20}/>
            </button>
          )
        }
        
        <button className={`py-1 text-white ${!enableNote ? "bg-[#BFBFBF]" : "bg-insomnia-primary"} px-1 my-2 rounded-md`} onClick={setEnableNote}>
          <PiNotePencilBold size={20}/>
        </button>
      
        </div>
    </div>
    <div {...props} className={`${darkMode? "bg-dark-box-color" : "bg-[#ffffff] "}
    rounded-lg shadow-md mt-[20px]
    ${classname} ${print === true ? "hidden" : ""}`}>
  
      <div className='flex justify-between items-center'>
      <div className='pt-4 px-[20px] text-thead-primary rounded-t-lg text-[20px] font-semibold'>
       {topTitle}
      </div>
      <button onClick={()=>openModal()} className='font-bold text-white bg-thead-primary px-3 my-2 rounded-md mx-[20px] mt-4'>
        Create
      </button>
      </div>
        <div className='p-6'>
        {children}
        </div>
    </div>
    <Modal id='my_modal_5' title='Customer' showCancel={false}>
        <Create/>
    </Modal>
    </>
  )
}

export default Top