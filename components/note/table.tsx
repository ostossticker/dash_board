"use client"
import { deleteNote } from '@/app/(protected)/note/action/note'
import useToggle from '@/hooks/stores'
import { useCurrentRole } from '@/hooks/use-current-role'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useNote } from '@/hooks/usedatas'
import { convertTime, dateFormat, fetchData, openModal } from '@/lib/functions'
import { url } from '@/lib/url'
import { useRouter } from 'next/navigation'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { PiTrashLight , PiEyeLight , PiPencilSimpleLineLight } from "react-icons/pi";
import { MdOutlineArrowDropDown } from "react-icons/md";
import Modal from '../ui/modal/modal';
import { toast } from 'react-toastify'
import useSWR, { mutate } from 'swr'
import ResponsiveElement from '../invoice&quotation/ResComp'

type noteProps = {
    id:string;
    title:string;
    createdAt:string;
    text:string;
    noteDate:string;
    updatedAt:string;
}

const NoteTable = () => {
    const { isOpen , isHover ,darkMode , pending,setPending,onEdit,setPassingId} = useToggle()
    const user = useCurrentUser()
    const role = useCurrentRole()
    const    MIN_TEXTAREA_HEIGHT = 32;
    const textareaRef = useRef<any>(null);
    const noteCheck = useNote()
    const router = useRouter()
    const [popup , setPopup] = useState<boolean>(false)
    const [page , setPage] = useState<number>(1)
    const [currentPage , setCurrentPage] = useState(1)
    const [take , setTake] = useState<number>(15)
    const [print , setPrint] = useState({
        title:'',
        text:'',
        noteDate:''
    })
    const [val , setVal] = useState({
        filter:'',
        fromDate:'',
        toDate:''
    })
    const [passing , setPassing] = useState<string>('')
    const {data , error} = useSWR(`${url}/api/note?email=${user.id}&page=${page}&take=${take}&fitler=${val.filter}&fromDate=${val.fromDate}&toDate=${val.toDate}`,fetchData)
    useLayoutEffect(()=>{
      if(textareaRef.current){
        textareaRef.current.style.height = "inherit";
        textareaRef.current.style.height = `${Math.max(
            textareaRef.current.scrollHeight,
            MIN_TEXTAREA_HEIGHT
            )}px`;
      }
    },[print.text])

    const note:noteProps[] = data?.note || []
    const totalPages:number = data?.pagination.totalPages || 0

    const loadPage = (newPage:number) =>{
        setPage(newPage)
        setCurrentPage(newPage)
    }
    useEffect(()=>{
        if(!val.filter || !val.fromDate || !val.toDate){
            setPage(currentPage)
            mutate(`${url}/api/note?email=${user.id}&page=${currentPage}&take=${take}&fitler=${val.filter}&fromDate=${val.fromDate}&toDate=${val.toDate}`)
        }
        if(val.filter !== '' || val.fromDate !== '' || val.toDate !== ''){
            setPage(1)
            mutate(`${url}/api/note?email=${user.id}&page=1&take=${take}&fitler=${val.filter}&fromDate=${val.fromDate}&toDate=${val.toDate}`)
        }
    },[val , take , currentPage , user , pending])

    const renderPageNumbers = () =>{
        const maxPagesToShow = 3;
        const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage < startPage) {
            return [];
        }

        return [...Array(endPage - startPage + 1).keys()].map(
            (index) => startPage + index
        );
    }

    const thead = useMemo(()=>[
        {
            label:"NO." ,
            textAlign:""   
          },
          {
            label:"TITLE",
            textAlign:"text-start"
          },
          {
            label:"CREATED AT",
            textAlign:"text-end"
          },
          {
            label:"UPDATED AT",
            textAlign:"text-end"
          },
          {
              label:"ACTIONS",
              textAlign:"text-end "
          }
    ],[])

    if(error) return <div>Error fetching data</div>

    const handleDelete = async (id:string) =>{
        setPending(true)
        await deleteNote(id)
        .then((data)=>{
            if(data?.success){
                toast.success(data.success)
                setPending(false)
            }
            if(data?.error){
                toast.error(data.error)
                setPending(false)
            }
        }).catch(()=>{
            toast.error('error')
            setPending(false)
        })
    }
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const {name , value} = e.target
        setVal({
            ...val , [name]:value
        })
    }
    const placeholderClass = `${isOpen || isHover ? "py-[1px]" : "py-[1px]"} text-center xl:text-[13px] lg:text-[9px] border-b-[1px] py-[5px]`

    const classes = "bg-thead-primary text-white xl:w-[30px] lg:w-[25px] xl:h-[30px] lg:h-[20px] lg:rounded-sm xl:rounded-md mx-1 xl:text-[16px] lg:text-[10px]"

    if(role !== 'ADMIN' && noteCheck !== true){
        router.push('/dashboard')
        return(
            <div>
                WE SORRY YOU NOT ALLOW TO SEE THIS PAGE AND GET REKT
            </div>
        )
    }
  return ( 
    <>
    <div className={`${darkMode ? "bg-dark-box-color" : "bg-white"} mt-[20px] shadow-md rounded-lg px-[30px] ${isOpen || isHover ? "py-[8px]" : "py-[10px]"}`}>
        <div className='flex py-3 justify-between'>
            <div className='flex gap-3'>
            <div>
              <div className="xl:p-1 relative border-[1px] border-input-primary rounded-md w-[200px]">
                <input 
                type="text" 
                className={`block px-2 py-1 w-full lg:text-[12px] xl:text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`} 
                name='filter'
                value={val.filter}
                onChange={handleChange}
                placeholder='Search'
                />
                <label  className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                    FILTER
                  </label>
              </div>
            </div>

            <div className='flex justify-center py-1 items-center lg:h-[28px] xl:h-9 border border-input-primary rounded-[7px] px-1'>
                <div className='relative'>
                    <input type="date" className={`lg:w-[120px] xl:w-[150px] px-2 py-1 lg:text-[12px] xl:text-md block appearance-none outline-none bg-transparent ${darkMode ? "text-white dark" : `${val.fromDate === "" ? 'text-input-primary' : 'light'}`}`} name='fromDate' value={val.fromDate} onChange={handleChange}/>
                    <label  className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                                From Date
                            </label>
                </div>
                
                <button className=' h-full mx-1 rounded lg:w-[20px] xl:w-[27px] lg:text-[10px] xl:text-sm flex justify-center items-center text-input-primary'>To</button>
                
                <div className='relative'>
                    <input type="date" className={`lg:w-[120px] xl:w-[150px] px-2 py-1 lg:text-[12px] xl:text-md block appearance-none outline-none bg-transparent ${darkMode ? "text-white dark" : `${val.toDate === "" ? 'text-input-primary' : 'light'}`}`} name='toDate' value={val.toDate} onChange={handleChange}/>
                    <label  className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                                To Date
                            </label>
                </div>
            </div>
            </div>
        </div>
        <table className='w-full mt-[10px]'>
            <thead>
              <tr>
                {
                  thead?.map((item,i)=>{
                    return(
                      <th key={item.label}  className={`${item.textAlign} ${i === 0 ? 'rounded-tl-md' : ''} ${i === 4 ? 'rounded-tr-md !pr-[50px]' : ''} xl:text-[16px] lg:text-[10px] xl:leading-7  text-white bg-thead-primary`}>{item.label}</th>
                    )
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
                note?.map((item,i)=>{
                  return(
                  <tr key={item.id} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px] hover:bg-[#F9FAFB]`}>
                    <td className={placeholderClass}>{(page - 1) * take + i + 1}</td>
                    <td className={`${placeholderClass} text-start`}>{item.title}</td>
                    <td className={`${placeholderClass}`}><div className='flex justify-end items-center'>
                    <div className='pr-[5px]'>{!item.createdAt ? '' : dateFormat(item.createdAt)}</div>
                    <div>{item.createdAt ? convertTime(item.createdAt) : ''}</div>
                    </div></td>
                    <td className={placeholderClass}><div className='flex justify-end items-center'>
                    <div className='pr-[5px]'>{!item.updatedAt ? '' : dateFormat(item.updatedAt)}</div><div>{item.updatedAt ? convertTime(item.updatedAt) : ''}</div></div>
                    </td>
                    <td className={placeholderClass}>
                        <div className='flex justify-end mr-[50px] items-center gap-1'>
                        <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                            setPrint({
                                title:item.title,
                                text:item.text,
                                noteDate:item.noteDate
                            })
                            setPopup(true)
                        }}>
                                <PiEyeLight />
                            </button> 
                        <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                          openModal('my_modal_5')
                          onEdit()
                          setPassingId(item.id)
                        }}>
                           <PiPencilSimpleLineLight />
                        </button>
                        <button className={`${darkMode ? "text-red-400 " : "text-red-700" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                          openModal('note')
                          setPassing(item.id)
                        }}>
                            <PiTrashLight/>
                        </button>
                        </div>
                    </td>
                  </tr>
                  )
                })
              }
              {
                (()=>{
                  let row = []
                  for(let i = take; i > note.length; i--){
                    row.push(
                      <tr key={crypto.randomUUID()} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px]`}>
                        <td className={placeholderClass}><div className='invisible'>-</div></td>
                        <td className={placeholderClass}></td>
                        <td className={placeholderClass}></td>
                        <td className={placeholderClass}></td>
                        <td className={placeholderClass}>
                        <div className='flex justify-end items-center gap-1 invisible'>
                        
                        <button className={`${darkMode ? "text-blue-400" : "text-blue-700" } p-1 lg:text-[14px] xl:text-[20px]`}>
                           <PiPencilSimpleLineLight />
                        </button>
                        <button className={`${darkMode ? "text-red-400 " : "text-red-700  "}p-1 lg:text-[14px] xl:text-[20px]`}>
                            <PiTrashLight />
                        </button>
                        </div></td>
                      </tr>
                      )
                    }
                    return row;
                  })()
                }
            </tbody>
        </table>
         {/****************** */}
         <div className='flex justify-start pb-[14px] gap-4'>
          
          <div className='flex justify-center px-[5px] xl:rounded-md lg:rounded-sm items-center mt-[16px] bg-thead-primary xl:h-[30px] lg:h-[20px] text-white'>
          <select value={take} className='bg-transparent outline-none xl:text-[16px] lg:text-[10px]' onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>setTake(Number(e.target.value))}>
                  <option value="15" className='text-black'>15</option>
                  <option value="20" className='text-black'>20</option>
                  <option value="30" className='text-black'>30</option>
                  <option value="40" className='text-black'>45</option>
                  <option value="50" className='text-black'>50</option>
                  <option value="100" className='text-black'>100</option>
            </select><MdOutlineArrowDropDown/>
              </div>
            <div className='flex mt-[16px]'>
              <button className={classes} onClick={() => loadPage(1)} disabled={page === 1}>{"<<"}</button>
              <button className={classes} onClick={() => loadPage(page - 1)} disabled={page === 1}>{"<"}</button>
              {renderPageNumbers().map((pageNumber) => (
                  <button key={pageNumber}  
                  className={classes}
                  onClick={() => loadPage(pageNumber)}
                  disabled={page === pageNumber}
                  >
                    {pageNumber}
                  </button>
              ))}
              <button className={classes}  onClick={() => loadPage(page + 1)}
            disabled={page === totalPages}>{">"}</button>
              <button className={classes} onClick={() => loadPage(totalPages)} disabled={page === totalPages}>{">>"}</button>
            </div>
            
          </div>
          {/****************** */}
          <Modal typeSelect='caution' id='note' handlingAction={()=>handleDelete(passing)} CautionText={'Deletion'}/>
          
    </div>
    {
          popup === true && (
            <ResponsiveElement height={'auto'} width={430} className='bg-white p-4 rounded-lg mt-5'>
            <div className='bg-white rounded-md p-4'>
              <div className='flex justify-between items-center w-full'>
              <h1 className=' text-thead-primary font-semibold'>Note</h1>
              <h1 className='font-semibold'>Title: {print.title}</h1>
              <div className='flex gap-2 items-center'>
              <p className='font-semibold'>Date: {dateFormat(print.noteDate)}</p>
                <span onClick={()=>setPopup(false)} className="text-[20px] text-insomnia-primary font-semibold cursor-pointer">x</span>
              </div>
              </div>
           
            <textarea className="notes outline-none w-full mt-2"
              ref={textareaRef}
              style={{
                  minHeight: MIN_TEXTAREA_HEIGHT,
                  resize: "none"
              }}
              value={print.text} >

              </textarea>
            </div>
            </ResponsiveElement>
          )
        }
    </>
  )
}

export default NoteTable