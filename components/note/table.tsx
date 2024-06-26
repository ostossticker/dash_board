"use client"
import { addNote, deleteNote, udpateNote } from '@/app/(protected)/note/action/note'
import useToggle from '@/hooks/stores'
import { useCurrentRole } from '@/hooks/use-current-role'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useNote } from '@/hooks/usedatas'
import { convertTime, dateFormat, fetchData, openModal } from '@/lib/functions'
import { url } from '@/lib/url'
import { useRouter } from 'next/navigation'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { PiTrashLight , PiPencilSimpleLineLight } from "react-icons/pi";
import { MdOutlineArrowDropDown } from "react-icons/md";
import Modal from '../ui/modal/modal';
import { toast } from 'react-toastify'
import useSWR, { mutate } from 'swr'
import axios from 'axios'

type noteProps = {
    id:string;
    title:string;
    createdAt:string;
    text:string;
    noteDate:string;
    updatedAt:string;
}

const NoteTable = () => {
    const { isOpen , isHover ,darkMode , noteSwitch ,edit , setNoteSwitch, passingId, isModal , setModalisopen, pending,setPending,onEdit,setPassingId} = useToggle()
    const user = useCurrentUser()
    const role = useCurrentRole()
    const    MIN_TEXTAREA_HEIGHT = 32;
    const textareaRef = useRef<any>(null);
    const noteCheck = useNote()
    const router = useRouter()
    const [page , setPage] = useState<number>(1)
    const [currentPage , setCurrentPage] = useState(1)
    const [take , setTake] = useState<number>(15)
    const [print , setPrint] = useState({
        no:'',
        title:'',
        text:'',
        createdAt:'',
        updatedAt:''
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

    useEffect(()=>{
      setPending(false)
    },[])

    const note:noteProps[] = data?.note || []
    const totalPages:number = data?.pagination.totalPages || 0

    const loadPage = (newPage:number) =>{
        setPage(newPage)
        setCurrentPage(newPage)
    }

    useEffect(()=>{
      setNoteSwitch(false)
    },[])

    const fetchSingle = async () =>{
      const {data} = await axios.get(`${url}/api/note/${passingId}?email=${user?.id}`)
      
      setPrint(prev=>({
        ...prev,
        title:edit ? data.editNote.title : '',
        createdAt:edit ? data.editNote.noteDate : new Date().toISOString().split('T')[0],
        text:edit ? data.editNote.text : '',
        updatedAt:edit ? data.editNote.updatedAt : ''
      }))
    }

    useEffect(()=>{
      fetchSingle()
      if(isModal === true && !edit){
        setPrint(prev=>({
          ...prev,
          no:'',
          title:'',
          text:'',
          createdAt:new Date().toISOString().split('T')[0]
        }))
      }
    },[passingId , edit , isModal])

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

    const handleChanges = (e:React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) =>{
      const {name , value} = e.target
      setPrint({...print,[name]:value})
    }

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

    const onSave = async() =>{
      setPending(true)
  
      let validation = ''
  
      const {title , text , createdAt} = print
  
      if(!title){
        validation= "sorry this field is required"
        toast.error(validation)
        setPending(false)
      }else{
         addNote({
          title,
          text,
          noteDate:createdAt
        }).then((data)=>{
          setPrint(prev=>({
            ...prev,
            title:'',
            text:'',
            createdAt:'',
            updatedAt:''
          }))
          if(data?.error){
            toast.error(data.error)
            setPending(false)
          }
          if(data?.success){
            toast.success(data.success)
            setPending(false)
            setModalisopen(false)
            setNoteSwitch(false)
          }
        }).catch(()=>{
          toast.error("something went wrong")
          setPending(false)
        })
      }
    }
  
    const onUpdate = async() =>{
      setPending(true)
  
      let validation = ''
  
      const {title , text , createdAt} = print
  
      if(!title){
        validation= "sorry title is required"
        toast.error(validation)
        setPending(false)
      }else{
         udpateNote({
          id:passingId,
          title,
          text,
          noteDate:createdAt
        }).then((data)=>{
          if(data?.error){
            toast.error(data.error)
            setPending(false)
          }
          if(data?.success){
            toast.success(data.success)
            setPending(false)
            setModalisopen(false)
            setNoteSwitch(false)
          }
        }).catch(()=>{
          toast.error("something went wrong")
          setPending(false)
        })
      }
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
        {
          noteSwitch === false && (
              <>
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
                                onEdit()
                                setNoteSwitch(true)
                                setPassingId(item.id)
                                setPrint(prev=>({
                                  ...prev,
                                  no:`${(page - 1) * take + i + 1}`
                                }))
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
              </>
          )
        }
        
         
          {
          noteSwitch === true && (
            <div className='bg-white rounded-md  mt-5'>
              <div className='flex justify-between items-center w-full bg-thead-primary rounded-t-md px-5 py-1'>
              <div className='font-semibold text-white flex gap-4'><p>NO.</p><p>{print.no}</p></div>
              <div className='font-semibold text-white flex gap-4'><p>TITLE.</p><input type="text" value={print.title} className='bg-transparent outline-none' name='title' onChange={handleChanges}/></div>
              <div className='font-semibold text-white flex gap-4'><p>CREATED AT.</p><input type="date" className='outline-none bg-transparent' name='createdAt' value={print.createdAt} onChange={handleChanges}/></div>
              
              {
                edit && (
                  <div className='font-semibold text-white flex gap-4'><p>UPDATED AT.</p>
                    <div className='flex gap-2'><p>{dateFormat(print.updatedAt)}</p><p>{convertTime(print.updatedAt)}</p></div>
                  </div>
                )
              }
              </div>
             
           
            <textarea className="notes outline-none w-full mt-2 px-[20px]"
              rows={15}
              ref={textareaRef}
              style={{
                  minHeight: MIN_TEXTAREA_HEIGHT,
                  resize: "none"
              }}
              value={print.text} name='text' onChange={handleChanges}>

              </textarea>

              <div className='flex justify-end items-center gap-5'>
                  <button className={`px-4 py-1 text-white duration-200 ease-in-out ${print.title  !== "" ? "shadowHover bg-mainLightBlue text-white" : "bg-slate-300"} w-[185px] rounded-md `} onClick={edit ? onUpdate : onSave}>{pending ? <span className='loading loading-spinner text-default'></span> : <p>Save</p>}</button>
                  <button className={`px-4 py-1 text-white duration-200 ease-in-out bg-slate-300 hover:bg-mainLightRed w-[185px] rounded-md`} onClick={()=>{setNoteSwitch(false) , setModalisopen(false)}}>Cancel</button>
              </div>
            </div>
          )
        }
          <Modal typeSelect='caution' id='note' handlingAction={()=>handleDelete(passing)} CautionText={'Deletion'}/>
          
    </div>
    
    </>
  )
}

export default NoteTable