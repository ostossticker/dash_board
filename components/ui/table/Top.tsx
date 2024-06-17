"use client"
import useToggle from '@/hooks/stores'
import React from 'react'
import Modal from '../modal/modal';
import { useRouter } from 'next/navigation';

type topProps = {
  title?:string;
  showButtonCreate?:boolean;
  showButtonForm?:boolean;
  classname?:string;
  routing?:string | undefined;
  showCancel?:boolean;
  modalChildren?:JSX.Element;
  topTitle?:string;
  editlabel?:string;
  typeSelect?:string;
  bgLeft?:string;
  bgRight?:string;
  bgCenter?:string
  bigModal?:JSX.Element;
  deliveryNote?:boolean
  invoice?:boolean;
  switchable?:boolean;
}

const Top = ({title,bgLeft,bgRight,bigModal, switchable, bgCenter,showButtonCreate,typeSelect,editlabel,showButtonForm,showCancel,modalChildren , deliveryNote , invoice ,topTitle,routing = ''}:topProps) => {
    const router = useRouter()
    const {darkMode,onCancel ,setModalisopen, setSwitch ,setValueNote , enableNote , setValueNoti, setPrinting, setPassingId , setQtid , setRec , routerSwitch , setPrint} = useToggle()
    const openModal = () => {
      const modal = document.getElementById('my_modal_5') as HTMLDialogElement | null;
      if (modal) {
        modal.showModal();
      }
    };
  return (
    <>
    <div className={`flex justify-between px-1`}>
      <h1 className={`font-bold ${darkMode ? "text-dark-lg-color" : "text-white"} lg:text-[25px] xl:text-[30px]`}>{switchable ? routerSwitch === 'delivery' ? "Delivery Note" : "Invoice" : title}</h1>
      <div className='flex gap-3'>
      {
        deliveryNote && (
          <button onClick={()=>{
            router.push(routing)
            setSwitch('delivery')
            setPassingId('')
            onCancel()
            setQtid('')
            setRec('')
            setPrint(false)
            setPrinting('')
            setValueNote(false)
            setValueNoti(false)
          }} className='font-bold text-white bg-thead-primary xl:px-3 lg:px-2 lg:my-1 xl:my-2 rounded-md xl:text-[15px] lg:text-[12px]'>
            Create Delivery Note
          </button>
        )
      }
      {
        showButtonCreate && (
          <button onClick={()=>{
            router.push(routing)
            setSwitch('invoice')
            setPassingId('')
            setPrinting('')
            onCancel()
            setQtid('')
            setRec('')
            setPrint(false)
            setValueNote(false)
            setValueNoti(false)
          }} className={`font-bold text-white bg-thead-primary xl:px-3 lg:px-2 lg:my-1 xl:my-2 rounded-md xl:text-[15px] lg:text-[12px]`}>
            Create {invoice && "Invoice"}
          </button>
        )
      }
      {
        showButtonForm && (
          <button onClick={()=>{
            openModal()
            onCancel()
            setQtid('')
            setRec('')
            setPrint(false)
            setValueNote(false)
            setValueNoti(false)
            setPrinting('')
            setModalisopen(true)
          }} className='font-bold text-white bg-thead-primary xl:px-3 lg:px-2 lg:my-1 xl:my-2 rounded-md xl:text-[15px] lg:text-[12px]'>
            Create 
          </button>
        )
      }
      </div>
      
    </div>
    <Modal id='my_modal_5' 
    bigModal={bigModal}
    bgLeft={bgLeft} 
    bgCenter={bgCenter}
    bgRight={bgRight} 
    typeSelect={typeSelect} 
    title={topTitle} 
    editLabel={editlabel} 
    showCancel={showCancel}>
      {modalChildren}
    </Modal>
    </>
  )
}

export default Top