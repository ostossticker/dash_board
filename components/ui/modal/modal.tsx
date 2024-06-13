"use client"
import useToggle from '@/hooks/stores';
import React, { useEffect} from 'react'

type modalProps = {
    children?:React.ReactNode;
    title?:string;
    id:string;
    showCancel?:boolean;
    typeSelect?:string
    handlingAction?:()=>void
    CautionText?:string;
    editLabel?:string;
    bgLeft?:string;
    bgCenter?:string;
    bgRight?:string;
    bigModal?:JSX.Element;
    contentWarning?:string
    restoring?:boolean;
}

const Modal = ({handlingAction , bigModal ,contentWarning ,bgCenter ,CautionText,children,title,bgLeft ,bgRight,editLabel,id,showCancel,typeSelect,restoring}:modalProps) => {
  const { darkMode ,pending,edit, setModal ,bgModal} =useToggle()

  const closeModal = () => {
    const modal = document.getElementById(id as string) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  useEffect(()=>{
    const modal = document.getElementById(id as string) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  },[pending])

  useEffect(()=>{
    setModal('bgLeft')
  },[])

  return (
    <>
      <dialog id={id} className="modal">
        <div className={`modal-box !pt-[22px] !px-[32px] !pb-[25px] !w-[auto]  ${darkMode ? "bg-dark-box-color" : "bg-[#F4F4F4]"}`}>
          {
            typeSelect === "caution" ? (
              <>
              <div className='flex justify-start items-center pb-[15px]  mx-1'>
              <h3 className={`font-bold text-[25px]   ${darkMode ? "text-dark-lg-color" : "text-dark-box-color"}`}>Confirm {CautionText}</h3>
              </div>
              <div className='w-[320px] text-start text-[#787E8A]'>
                  Are you sure you would like to do this action ? This action cannot be undone.
                </div>
              <div className="modal-action mt-[25px] flex justify-center ">  
                <div className='flex gap-5'>
                <button onClick={closeModal} className='bg-[#E6E7E8] w-[150px] h-[40px] rounded-lg font-semibold text-[#787E8A]'>Cancel</button>
                <button onClick={handlingAction} className={`${restoring ? "bg-[#1C567D]" : "bg-[#E94043]"} w-[150px] h-[40px] rounded-lg font-semibold text-white`}>{pending ? <span className='loading loading-spinner text-default'></span> : <span>{restoring ? 'Restore' : 'Delete'}</span>}</button>
                </div>
                
              </div>
              </>
            ) : typeSelect === 'bigmodal' ? (
              <>
                <div className='flex justify-between items-center pb-[10] border-b border-slate-300 mx-1 px-[5px]'>
                  <div className={`text-start  font-bold text-lg cursor-pointer ${darkMode ? "text-dark-lg-color" : "text-dark-box-color"} ${bgModal === "bgLeft" ? "!text-insomnia-primary" : ""}`} onClick={()=>setModal('bgLeft')}><h3>{bgLeft}</h3></div>
                  <div className={`text-start  font-bold text-lg cursor-pointer ${darkMode ? "text-dark-lg-color" : "text-dark-box-color"} ${bgModal === "bgCenter" ? "!text-insomnia-primary" : ""}`} onClick={()=>setModal('bgCenter')}><h3>{bgCenter}</h3></div>
                  <div className={`text-end   font-bold text-lg cursor-pointer ${darkMode ? "text-dark-lg-color" : "text-dark-box-color"} ${bgModal === "bgRight" ? "!text-insomnia-primary" : ""}`} onClick={()=>setModal('bgRight')}><h3>{bgRight}</h3></div>
                </div>
              <div className='flex justify-center  modal-action mt-[20px]'>
                  <div>
                    {bigModal}
                  </div>
              </div>
              </>
            ) : (
              <>
              <div className='flex justify-between pb-[10px] border-b border-slate-300 mx-1 overflow-hidden'>
              <h3 className={`font-bold text-lg  ${darkMode ? "text-dark-lg-color" : "text-dark-box-color"}`}>{edit ? editLabel : title}</h3>
              {
                showCancel && (
                  <button onClick={closeModal} className='bg-insomnia-primary w-[26px] h-[26px] items-center justify-center rounded-md text-white font-bold'><span className="inline-block align-middle">X</span></button>
                )
              }
              </div>
              <div className="modal-action mt-[20px] flex justify-center ">
                <div className='overflow-y-hidden overflow-x-auto'>
                {children}
                </div>
                
              </div>
              </>
            )
          }
        </div>
      </dialog>
    </>
  )
}

export default Modal