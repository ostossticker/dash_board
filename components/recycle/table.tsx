"use client"

type Invoice ={
    id:string
    invNo:string;
    invCusName:string;
    createdAt:string;
    deletedAt:string;
}

type Quotation ={
    id:string
    qtNo:string;
    invCusName:string;
    createdAt:string;
    deletedAt:string;
    qtImage1:string;
    qtImage2:string;
}

type Receipt ={
    id:string
    recNo:string;
    recFrom:string;
    createdAt:string;
    deletedAt:string;
}



type arr = {
    invoice:Invoice[]
    quotation:Quotation[] 
    receipt:Receipt[]
}

type valProps = {
    invNo:string;
    cusName1:string;
    createdAt:string;
    deletedAt:string;
}

import useToggle from '@/hooks/stores'
import { useCurrentUser } from '@/hooks/use-current-user'
import { convertTime, dateFormat, fetchData, openModal } from '@/lib/functions';
import { MdOutlineArrowDropDown } from "react-icons/md";
import { ImLoop2 } from "react-icons/im";
import { PiTrashLight , } from "react-icons/pi";
import { url } from '@/lib/url'
import React, { useEffect, useMemo, useState } from 'react'
import useSWR, { mutate } from 'swr'
import Modal from '../ui/modal/modal';
import { toast } from 'react-toastify';
import { deleteInv, restoringInv } from '@/app/(protected)/invoice/actions/meters';
import { deleteQt, restoringQt } from '@/app/(protected)/quotation/actions/meters';
import { deleteRec, restoringRec } from '@/app/(protected)/receipt/actions/receipt';

type displayProps = {
    qtImage1:string;
    qtImage2:string;
}

const Rectable = () => {
    const {darkMode , isOpen , isHover , pending , setPending} = useToggle()
    const user = useCurrentUser()
    const [passing , setPassing] = useState<string>('')
    const [newstring , setNewstring] = useState<string>('')
    const [display , setDisplay] = useState<displayProps>({
        qtImage1:'',
        qtImage2:''
    })

    const[page , setPage] = useState<number>(1);
    const [currentPage , setCurrentPage] = useState<number>(1);
    const [take , setTake] = useState<number>(5)
    const [val , setVal] = useState<valProps>({
        invNo:'',
        cusName1:'',
        createdAt:'',
        deletedAt:''
    })

    const {data , error} = useSWR(`${url}/api/recycle?email=${user.id}&page=${page}&pageSize=${take}&filterName=${val.cusName1}&filters=${val.invNo}&fromDate=${val.createdAt}&toDate=${val.deletedAt}`,fetchData)
    
    const recycle:arr[] = data?.recycling || []
    const totalPages:number = data?.pagination.totalPages || 0

    const loadPage = (newPage:number) =>{
        setPage(newPage)
        setCurrentPage(newPage)
    }

    useEffect(()=>{
        if(!val.cusName1  || !val.invNo || !val.createdAt || !val.deletedAt){
            setPage(currentPage)
            mutate(`${url}/api/recycle?email=${user.id}&page=${currentPage}&pageSize=${take}&filterName=${val.cusName1}&filters=${val.invNo}&fromDate=${val.createdAt}&toDate=${val.deletedAt}`)
        }
        if(val.cusName1 !== '' || val.invNo !== '' || val.createdAt !== '' || val.deletedAt !== ''){
            mutate(`${url}/api/recycle?email=${user.id}&page=1&pageSize=${take}&filterName=${val.cusName1}&filters=${val.invNo}&fromDate=${val.createdAt}&toDate=${val.deletedAt}`)
        }
    },[take , currentPage , user , val , pending])

    const renderPageNumbers = () =>{
        const maxPagesToShow = 3;
        const startPage = Math.max(1 , page - Math.floor(maxPagesToShow / 2))
        const endPage = Math.min(totalPages, startPage  + maxPagesToShow - 1)
        
        if(endPage < startPage ){
        return []
        }

        return [...Array(endPage - startPage + 1).keys()].map(
        (index)=> startPage + index
        )
    }

    const handleDelete = async (id:string,newString:string , oldImg:string , oldImg1:string) =>{
    
        setPending(true)
        if(newString === 'invoice'){
            await deleteInv(id)
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
        if(newString === 'quotation'){
            await deleteQt(id , oldImg , oldImg1)
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
        if(newString === 'receipt'){
            await deleteRec(id)
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
      }

      const handleRestore = async (id:string,newString:string) =>{
        setPending(true)
        if(newString === 'invoice'){
            await restoringInv(id)
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
        if(newString === 'quotation'){
            await restoringQt(id)
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
        if(newString === 'receipt'){
            await restoringRec(id)
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
      }


    const thead = useMemo(()=>[
        {
            label:"NO",
            clss:""
        },
        {
            label:"ID",
            clss:"text-start"
        },
        {
            label:"NAME",
            clss:"text-start"
        },
        {
            label:"CREATE DATE",
            clss:"text-end"
        },
        {
            label:"DELETE DATE",
            clss:"text-end"
        },
        {
            label:"ACTIONS",
            clss:""
        }
    ],[])

    if(error) return <div>Error fetching data</div>

    const theadClass = "text-white leading-7 pt-[3px] bg-thead-primary text-[15px]"
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const {name , value} = e.target
        setVal({
            ...val , [name]:value
        })
    }

    const placeholderClass = `${isOpen || isHover ? "py-[1px]" : "py-[1px]"} text-center xl:text-[13px] lg:text-[9px] border-b-[1px] py-[5px]`

    const classes = "bg-thead-primary text-white xl:w-[30px] lg:w-[25px] xl:h-[30px] lg:h-[20px] lg:rounded-sm xl:rounded-md mx-1 xl:text-[16px] lg:text-[10px]"

    return (
    <div>
                <div className={`${darkMode ? "bg-dark-box-color" : "bg-white"} mt-[20px] shadow-md rounded-lg px-[30px] ${isOpen || isHover ? "py-[8px]" : "py-[10px]"}`}>
                <div className='flex py-3 justify-between'>
                    <div className='flex gap-3'>
                        <div>
                            <div className="xl:p-1 relative border-[1px] border-input-primary rounded-md w-[200px]">
                                <input type="text" name='invNo'
                                className={`block px-2 py-1 w-full lg:text-[12px] xl:text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                value={val.invNo}
                                onChange={handleChange}
                                autoComplete='off'
                                />
                                <label className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                                    ID
                                </label>
                            </div>
                        </div>
                        <div>
                            <div className="xl:p-1 relative border-[1px] border-input-primary rounded-md w-[200px]">
                                <input type="text" name='cusName1'
                                className={`block px-2 py-1 w-full lg:text-[12px] xl:text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                value={val.cusName1}
                                onChange={handleChange}
                                autoComplete='off'
                                />
                                <label className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                                    NAME
                                </label>
                            </div>
                        </div>
                        <div>
                            <div className='flex justify-center py-1 items-center lg:h-[28px] xl:h-9 border border-input-primary rounded-[7px] px-1'>
                            <div className='relative'>
                            <input name='createdAt' value={val.createdAt} onChange={handleChange} type="date" className={`lg:w-[120px] xl:w-[150px] px-2 py-1 lg:text-[12px] xl:text-md block appearance-none outline-none  bg-transparent ${darkMode ? "text-white dark" : "light"}`} 
                            />
                            <label  className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                                From Date
                            </label>
                            </div>
                            
                            <button className=' h-full mx-1 rounded w-[30px] text-sm flex justify-center items-center text-input-primary'>To</button>
                            
                            <div className='relative'>
                                <input name='deletedAt' value={val.deletedAt} onChange={handleChange} type="date" className={`lg:w-[120px] xl:w-[150px] px-2 py-1 lg:text-[12px] xl:text-md block appearance-none outline-none bg-transparent ${darkMode ? "text-white dark" : "light"}`} 
                                />
                                <label  className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                                    To Date
                                </label>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <table className='w-full mt-[10px]'>
                    <thead>
                        <tr>
                            {
                                thead.map((item,i)=>{
                                    return(
                                        <th className={`${theadClass} ${i === 0 ? 'rounded-tl-md' : ''} ${i === 5 ? 'rounded-tr-md' : ''} ${item.clss} xl:text-[16px] lg:text-[10px] xl:leading-7`} key={crypto.randomUUID()}>
                                            {item.label === "ID" ? "INVOICE#" : item.label}
                                        </th>
                                    )
                                })
                            }

                        </tr>
                    </thead>
                    <tbody>
                        {
                            recycle.map((item)=>{
                                return(
                                    <React.Fragment key={`test-3038`}>
                                        {item.invoice && item.invoice.map((idem , i)=>{
                                            return(
                                                <tr key={idem.id} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px] hover:bg-[#F9FAFB]`}>
                                                    <td className={`${placeholderClass} text-center`}>{(page - 1 ) * take + i + 1}</td>
                                                    <td className={`${placeholderClass} text-start`}>{idem.invNo}</td>
                                                    <td className={`${placeholderClass} text-start`}>{idem.invCusName}</td>
                                                    <td className={placeholderClass}>
                                                        <div className='flex justify-end items-center'>
                                                            <div className='pr-[5px]'>
                                                            {!idem.createdAt ? '' : dateFormat(idem.createdAt)}
                                                            </div>
                                                            <div>{idem.createdAt ? convertTime(idem.createdAt) : ''}</div>
                                                        </div>
                                                    </td>
                                                    <td className={placeholderClass}>
                                                        <div className='flex justify-end items-center'>
                                                            <div className='pr-[5px]'>
                                                            {!idem.deletedAt ? '' : dateFormat(idem.deletedAt)}
                                                            </div>
                                                            <div>{idem.deletedAt ? convertTime(idem.deletedAt) : ''}</div>
                                                        </div>
                                                    </td>
                                                    <td className={placeholderClass}>
                                                        <div className='flex justify-center items-center gap-1'>
                                                            <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1 lg:text-[10px] xl:text-[15px]`} onClick={()=>{
                                                                setNewstring('invoice')
                                                                openModal('restoring')
                                                                setPassing(idem.id)
                                                            }}>
                                                                    <ImLoop2 />     
                                                            </button>
                                                            <button className={`${darkMode ? "text-red-400 " : "text-red-700" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                                                                setNewstring('invoice')
                                                                openModal('recycle')
                                                                setPassing(idem.id)
                                                            }}>
                                                                <PiTrashLight/>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        {
                                            (()=>{
                                            let row = []
                                            for(let i = take; i > item.invoice.length; i--){
                                                row.push(
                                                <tr key={crypto.randomUUID()} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px]`}>
                                                            <td className={placeholderClass}><div className='invisible'>-</div></td>
                                                            <td className={placeholderClass}></td>
                                                            <td className={placeholderClass}></td>
                                                            <td className={placeholderClass}></td>
                                                            <td className={placeholderClass}></td>
                                                            <td className={placeholderClass}>
                                                                <div className='flex justify-center items-center gap-1'>
                                                                    <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1 lg:text-[10px] xl:text-[15px] invisible`}>
                                                                            <ImLoop2 />     
                                                                    </button>
                                                                    <button className={`${darkMode ? "text-red-400 " : "text-red-700" } p-1 lg:text-[14px] xl:text-[20px] invisible`}>
                                                                        <PiTrashLight/>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                return row;
                                              })()
                                            }
                                        
                                        </React.Fragment>
                                )
                            })
                        }
                        
                    </tbody>
                </table>
                </div>
                <div className={`${darkMode ? "bg-dark-box-color" : "bg-white"} mt-[20px] shadow-md rounded-lg px-[30px] ${isOpen || isHover ? "py-[8px]" : "py-[10px]"}`}>
                <table className='w-full mt-[10px]'>
                    <thead>
                        <tr>
                            {
                                thead.map((item,i)=>{
                                    return(
                                        <th className={`${theadClass} ${i === 0 ? 'rounded-tl-md' : ''} ${i === 5 ? 'rounded-tr-md' : ''} ${item.clss} xl:text-[16px] lg:text-[10px] xl:leading-7`} key={crypto.randomUUID()}>
                                            {item.label === "ID" ? "QUOTATION#" : item.label}
                                        </th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            recycle.map((item)=>{
                                return(
                                    <React.Fragment key={`test-3039`}>
                                            {item.quotation && item.quotation.map((idem,i)=>{
                                                    return(
                                                        <tr key={idem.id} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px] hover:bg-[#F9FAFB]`}>
                                                            <td className={`${placeholderClass} text-center`}>{(page - 1 ) * take + i + 1}</td>
                                                            <td className={`${placeholderClass} text-start`}>{idem.qtNo}</td>
                                                            <td className={`${placeholderClass} text-start`}>{idem.invCusName}</td>
                                                            <td className={placeholderClass}>
                                                                <div className='flex justify-end items-center'>
                                                                    <div className='pr-[5px]'>
                                                                    {!idem.createdAt ? '' : dateFormat(idem.createdAt)}
                                                                    </div>
                                                                    <div>{idem.createdAt ? convertTime(idem.createdAt) : ''}</div>
                                                                </div>
                                                            </td>
                                                            <td className={placeholderClass}>
                                                                <div className='flex justify-end items-center'>
                                                                    <div className='pr-[5px]'>
                                                                    {!idem.deletedAt ? '' : dateFormat(idem.deletedAt)}
                                                                    </div>
                                                                    <div>{idem.deletedAt ? convertTime(idem.deletedAt) : ''}</div>
                                                                </div>
                                                            </td>
                                                            <td className={placeholderClass}>
                                                                <div className='flex justify-center items-center gap-1'>
                                                                    <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1 lg:text-[10px] xl:text-[15px]`} onClick={()=>{
                                                                        setNewstring('quotation')
                                                                        openModal('restoring')
                                                                        setPassing(idem.id)
                                                                    }}>
                                                                            <ImLoop2 />     
                                                                    </button>
                                                                    <button className={`${darkMode ? "text-red-400 " : "text-red-700" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                                                                        setNewstring('quotation')
                                                                        openModal('recycle')
                                                                        setPassing(idem.id)
                                                                        setDisplay(prev=>({
                                                                            ...prev,
                                                                            qtImage1:idem.qtImage1,
                                                                            qtImage2:idem.qtImage2
                                                                        }))
                                                                    }}>
                                                                        <PiTrashLight/>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                                
                                                {
                                                    (()=>{
                                                    let row = []
                                                    for(let i = take; i > item.quotation.length; i--){
                                                        row.push(
                                                            <tr key={crypto.randomUUID()} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px]`}>
                                                                <td className={placeholderClass}><div className='invisible'>-</div></td>
                                                                <td className={placeholderClass}></td>
                                                                <td className={placeholderClass}></td>
                                                                <td className={placeholderClass}></td>
                                                                <td className={placeholderClass}></td>
                                                                <td className={placeholderClass}>
                                                                <div className='flex justify-center items-center gap-1'>
                                                                    <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1 lg:text-[10px] xl:text-[15px] invisible`}>
                                                                            <ImLoop2 />     
                                                                    </button>
                                                                    <button className={`${darkMode ? "text-red-400 " : "text-red-700" } p-1 lg:text-[14px] xl:text-[20px] invisible`}>
                                                                        <PiTrashLight/>
                                                                    </button>
                                                                </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                    return row;
                                                  })()
                                                }
                                        </React.Fragment>
                                )
                            })
                        }
                        
                        
                    </tbody>
                </table>
                </div>
                <div className={`${darkMode ? "bg-dark-box-color" : "bg-white"} mt-[20px] shadow-md rounded-lg px-[30px] ${isOpen || isHover ? "py-[8px]" : "py-[10px]"}`}>
                <table className='w-full mt-[10px]'>
                    <thead>
                        <tr>
                            {
                                thead.map((item , i)=>{
                                    return(
                                        <th className={`${theadClass} ${i === 0 ? 'rounded-tl-md' : ''} ${i === 5 ? 'rounded-tr-md' : ''} ${item.clss} xl:text-[16px] lg:text-[10px] xl:leading-7`} key={crypto.randomUUID()}>
                                            {item.label === "ID" ? "RECEIPT#" : item.label}
                                        </th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            recycle.map((item)=>{
                                return(
                                    <React.Fragment key={`test-3040`}>
                                            {item.receipt && item.receipt.map((idem,i)=>{
                                                    return(
                                                        <tr key={idem.id} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px] hover:bg-[#F9FAFB]`}>
                                                            <td className={`${placeholderClass} text-center`}>{(page - 1 ) * take + i + 1}</td>
                                                            <td className={`${placeholderClass} text-start`}>{idem.recNo}</td>
                                                            <td className={`${placeholderClass} text-start`}>{idem.recFrom}</td>
                                                            <td className={placeholderClass}>
                                                                <div className='flex justify-end items-center'>
                                                                    <div className='pr-[5px]'>
                                                                    {!idem.createdAt ? '' : dateFormat(idem.createdAt)}
                                                                    </div>
                                                                    <div>{idem.createdAt ? convertTime(idem.createdAt) : ''}</div>
                                                                </div>
                                                            </td>
                                                            <td className={placeholderClass}>
                                                                <div className='flex justify-end items-center'>
                                                                    <div className='pr-[5px]'>
                                                                    {!idem.deletedAt ? '' : dateFormat(idem.deletedAt)}
                                                                    </div>
                                                                    <div>{idem.deletedAt ? convertTime(idem.deletedAt) : ''}</div>
                                                                </div>
                                                            </td>
                                                            <td className={placeholderClass}>
                                                                <div className='flex justify-center items-center gap-1'>
                                                                    <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1 lg:text-[10px] xl:text-[15px]`} onClick={()=>{
                                                                        setNewstring('receipt')
                                                                        openModal('restoring')
                                                                        setPassing(idem.id)
                                                                    }}>
                                                                            <ImLoop2 />     
                                                                    </button>
                                                                    <button className={`${darkMode ? "text-red-400 " : "text-red-700" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                                                                        setNewstring('receipt')
                                                                        openModal('recycle')
                                                                        setPassing(idem.id)
                                                                    }}>
                                                                        <PiTrashLight/>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                                {
                                                    (()=>{
                                                    let row = []
                                                    for(let i = take; i > item.receipt.length; i--){
                                                        row.push(
                                                          <tr key={crypto.randomUUID()} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px]`}>
                                                                    <td className={placeholderClass}><div className='invisible'>-</div></td>
                                                                    <td className={placeholderClass}></td>
                                                                    <td className={placeholderClass}></td>
                                                                    <td className={placeholderClass}></td>
                                                                    <td className={placeholderClass}></td>
                                                                    <td className={placeholderClass}>
                                                                    <div className='flex justify-center items-center gap-1'>
                                                                    <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1 lg:text-[10px] xl:text-[15px] invisible`}>
                                                                            <ImLoop2 />     
                                                                    </button>
                                                                    <button className={`${darkMode ? "text-red-400 " : "text-red-700" } p-1 lg:text-[14px] xl:text-[20px] invisible`}>
                                                                        <PiTrashLight/>
                                                                    </button>
                                                                </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                        return row;
                                                      })()
                                                    }
                                    </React.Fragment>
                                )
                            })
                        }
                    </tbody>
                </table>
                </div>

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
        <Modal typeSelect='caution' id='restoring' handlingAction={()=>handleRestore(passing,newstring)} CautionText={'Restore'} restoring/>
        <Modal typeSelect='caution' id='recycle' handlingAction={()=>handleDelete(passing,newstring,display.qtImage1 , display.qtImage2)} CautionText={'Deletion'}/>
    </div>
  )
}

export default Rectable