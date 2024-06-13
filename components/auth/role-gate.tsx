"use client"

import useToggle from '@/hooks/stores';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import { fetchData, openModal, validateEmail } from '@/lib/functions';
import { url } from '@/lib/url';
import { UserRole } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { PiTrashLight , PiPencilSimpleLineLight } from "react-icons/pi";
import React, {useEffect, useMemo, useState } from 'react'
import useSWR, { mutate } from 'swr';
import { MdOutlineArrowDropDown } from "react-icons/md";
import Modal from '../ui/modal/modal';
import { deleteUser } from '@/actions/admin';
import { toast } from 'react-toastify';
import Image from 'next/image';

type RoleGateProps ={
    allowedRole:UserRole
}

type adminProps = {
    id:string;
    name:string;
    image:string;
    email:string;
    phoneNumber:string;
    isTwoFactorEnabled:boolean;
    role:string;
    invoice:boolean;
    quotation:boolean;
    receipt:boolean;
    business:boolean;
    employee:boolean;
    customer:boolean;
    product:boolean;
    purchase:boolean;
    payment:boolean
    password:string;
    telegramReport:boolean
    noting:boolean
    alarmTime:string
}

const RoleGate = ({allowedRole}:RoleGateProps) => {
    const router = useRouter()
    const role = useCurrentRole()
    const user = useCurrentUser()
    const {darkMode , isOpen , isHover , pending , setPending , onEdit , setPassingId ,profile , refresh} = useToggle()
    const [filter , setFilter] = useState<string>('')
    const [page , setPage] = useState(1)
    const [currentPage , setCurrentPage] = useState(1)
    const [take , setTake] = useState<number>(10)
    const [passing , setPassing] = useState<string>('')

    const {data , error} = useSWR(`${url}/api/admins?email=${user.id}&page=${currentPage}&take=${take}&filter=${filter}`,fetchData)

    const admin:adminProps[] = data?.admin || []
    const totalPages: number = data?.pagination.totalPages || 0;     
    
    const loadPage = (newPage:number) =>{
        setPage(newPage)
        setCurrentPage(newPage)
    }    

    useEffect(()=>{
        if(!filter){
            setPage(currentPage)
            mutate(`${url}/api/admins?email=${user.id}&page=${currentPage}&take=${take}&filter=${filter}`)
        }
        if(filter !== ''){
            mutate(`${url}/api/admins?email=${user.id}&page=1&take=${take}&filter=${filter}`)
        }
    },[filter , take , currentPage , user , pending , profile , refresh])
    
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

    useEffect(()=>{
        if(role !== allowedRole){
            router.push('/dashboard')
        }
    },[])

    const handleDelete = async (id:string) =>{
        setPending(true)
        await deleteUser(id)
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

    const thead = useMemo(()=>[
        {
            label:"NO.",
            textAlign:"text"
        },
        {
            label:"PROFILE",
            textAlign:"text"
        },
        {
            label:"NAME",
            textAlign:"text"
        },
        {
            label:"EMAIL",
            textAlign:"text"
        },
        {
            label:"PHONE NUMBER",
            textAlign:"text"
        },
        {
            label:"PASSWORD",
            textAlign:"text"
        },
        {
            label:"2FA",
            textAlign:"text"
        },
        {
            label:"ROLE",
            textAlign:"text"
        },
        {
            label:"TELEGRAM",
            textAlign:"text"
        },
        {
            label:"INVOICE",
            textAlign:"text"
        },
        {
            label:"QUOTATION",
            textAlign:"text"
        },
        {
            label:"RECEIPT",
            textAlign:"text"
        },
        {
            label:"BUSINESS",
            textAlign:"text"
        },
        {
            label:"EMPLOYEE",
            textAlign:"text"
        },
        {
            label:"CUSTOMER",
            textAlign:"text"
        },
        {
            label:"PRODUCT",
            textAlign:"text"
        },
        {
            label:"PURCHASE",
            textAlign:"text"
        },
        {
            label:"PAYMENT",
            textAlign:"text"
        },
        {
            label:"NOTE",
            textAlign:"text"
        },
        {
            label:"ACTIONS",
            textAlign:"text"
        }
    ],[])

    if(error) return <div>Error fetching data</div>

    if(role !== allowedRole){
        return(
            <div className={`${darkMode ? "bg-dark-box-color" : "bg-white"} mt-[20px] shadow-md rounded-lg px-[30px] ${isOpen || isHover ? "py-[8px]" : "py-[10px]"}`}>
                <div>
                    <h1>SORRY</h1>
                </div>
            </div>
        )
    }

    const placeholderClass = `${isOpen || isHover ? "py-[1px]" : "py-[1px]"} text-center lg:text-[9px] xl:text-[13px] border-b-[1px] py-[5px]`

    const classes = "bg-thead-primary text-white xl:w-[30px] lg:w-[25px] xl:h-[30px] lg:h-[20px] lg:rounded-sm xl:rounded-md mx-1 xl:text-[16px] lg:text-[10px]"

    return (
        <div className={`${darkMode ? "bg-dark-box-color" : "bg-white"} mt-[20px] shadow-md rounded-lg px-[30px] ${isOpen || isHover ? "py-[8px]" : "py-[10px]"}`}>
            <div className='flex py-3 justify-between'>
            <div className='flex gap-3'>
            <div>
              <div className="xl:p-1 relative border-[1px] border-input-primary rounded-md w-[200px]">
                <input 
                type="text" 
                className={`block px-2 py-1 w-full lg:text-[12px] xl:text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`} 
                name='filter'
                value={filter}
                placeholder='Search'
                onChange={(e)=>setFilter(e.target.value)}
                />
                <label  className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                    FILTER
                  </label>
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
                                    <th className={`${item.textAlign} ${i === 0 ? 'rounded-tl-md' : ''} ${i === 19 ? 'rounded-tr-md' : ''} xl:text-[16px] lg:text-[10px] xl:leading-7 pt-[3px] text-white bg-thead-primary text-[15px]`} key={crypto.randomUUID()}>{item.label}</th>
                                )
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        admin.map((item , i) =>{
                            return(
                                <tr key={item.id} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px] hover:bg-[#F9FAFB]`}>
                                    <td className={placeholderClass}>{(page - 1) * take + i + 1}</td>
                                    <td className={placeholderClass}>
                                        <div className='flex justify-center items-center '>
                                            <div className={`border-[1px] ${darkMode ? "border-dark-lg-color" : "border-red-300"} p-[3px] my-[3px] rounded-full`}>
                                                <Image src={item.image ? item?.image.split("\\").join("/").split('public').join('') : "/profile.jpg"} alt='Profile' width={40} height={50} className='rounded-full'/>  
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`${placeholderClass} ${item.name === '' || item.name === null ? 'text-red-600' : ''}`}>{item.name === '' || item.name === null ? 'no name' : item.name}</td>
                                    <td className={`${placeholderClass} ${!validateEmail(item.email) || item.email === null ? 'text-red-600' : ''}`}>{!validateEmail(item.email) || item.email === null ? 'no email' : item.email}</td>
                                    <td className={`${placeholderClass} ${item.phoneNumber === '' || item.phoneNumber === null ? 'text-red-600' : ''}`}>{item.phoneNumber === '' || item.phoneNumber === null ? 'no phone number' : item.phoneNumber}</td>
                                    <td className={`${placeholderClass} ${item.password === '' || item.password === null ? 'text-red-600' : ''}`}>{item.password === '' || item.password === null ? 'no password' : item.password}</td>
                                    <td className={placeholderClass}><div className='flex justify-center'>{item.isTwoFactorEnabled === true ? <Image src='/Check.png' alt='#' width={15} height={15}/> : <Image src='/uncheck.png' alt='#' width={13} height={13}/>}</div></td>
                                    <td className={placeholderClass}>{item.role}</td>
                                    <td className={placeholderClass}><div className='flex justify-center items-center gap-3'>
                                    {item.telegramReport === true ? <Image src='/Check.png' alt='#' width={15} height={15}/> : <Image src='/uncheck.png' alt='#' width={13} height={13}/>}
                                    <p>{item.alarmTime === null ? '00:00' : item.alarmTime.split('-').join(':')}</p></div></td>
                                    <td className={placeholderClass}><div className='flex justify-center'>{item.invoice === true ? <Image src='/Check.png' alt='#' width={15} height={15}/> : <Image src='/uncheck.png' alt='#' width={13} height={13}/>}</div></td>
                                    <td className={placeholderClass}><div className='flex justify-center'>{item.quotation === true ? <Image src='/Check.png' alt='#' width={15} height={15}/> : <Image src='/uncheck.png' alt='#' width={13} height={13}/>}</div></td>
                                    <td className={placeholderClass}><div className='flex justify-center'>{item.receipt === true ? <Image src='/Check.png' alt='#' width={15} height={15}/> : <Image src='/uncheck.png' alt='#' width={13} height={13}/>}</div></td>
                                    <td className={placeholderClass}><div className='flex justify-center'>{item.business === true ? <Image src='/Check.png' alt='#' width={15} height={15}/> : <Image src='/uncheck.png' alt='#' width={13} height={13}/>}</div></td>
                                    <td className={placeholderClass}><div className='flex justify-center'>{item.employee === true ? <Image src='/Check.png' alt='#' width={15} height={15}/> : <Image src='/uncheck.png' alt='#' width={13} height={13}/>}</div></td>
                                    <td className={placeholderClass}><div className='flex justify-center'>{item.customer === true ? <Image src='/Check.png' alt='#' width={15} height={15}/> : <Image src='/uncheck.png' alt='#' width={13} height={13}/>}</div></td>
                                    <td className={placeholderClass}><div className='flex justify-center'>{item.product === true ? <Image src='/Check.png' alt='#' width={15} height={15}/> : <Image src='/uncheck.png' alt='#' width={13} height={13}/>}</div></td>
                                    <td className={placeholderClass}><div className='flex justify-center'>{item.purchase === true ? <Image src='/Check.png' alt='#' width={15} height={15}/> : <Image src='/uncheck.png' alt='#' width={13} height={13}/>}</div></td>
                                    <td className={placeholderClass}><div className='flex justify-center'>{item.payment === true ? <Image src='/Check.png' alt='#' width={15} height={15}/> : <Image src='/uncheck.png' alt='#' width={13} height={13}/>}</div></td>
                                    <td className={placeholderClass}><div className='flex justify-center'>{item.noting === true ? <Image src='/Check.png' alt='#' width={15} height={15}/> : <Image src='/uncheck.png' alt='#' width={13} height={13}/>}</div></td>
                                    <td className={placeholderClass}>
                                        <div className='flex justify-center items-center gap-1'>
                                        <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1`} onClick={()=>{
                                        openModal('my_modal_5')
                                        onEdit()
                                        setPassingId(item.id)
                                        }}>
                                        <PiPencilSimpleLineLight size={20}/>
                                        </button>
                                        <button className={`${darkMode ? "text-red-400 " : "text-red-700" } p-1`} onClick={()=>{
                                        openModal('admin')
                                        setPassing(item.id)
                                        }}>
                                            <PiTrashLight size={20}/>
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
                  for(let i = take; i > admin.length; i--){
                    row.push(
                      <tr key={crypto.randomUUID()} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px]`}>
                                <td className={placeholderClass}>
                                    <div className='flex justify-center items-center invisible'>
                                                    <div className={`border-[1px] ${darkMode ? "border-dark-lg-color" : "border-red-300"} p-[3px] my-[3px] rounded-full`}>
                                                        <Image src={"/profile.jpg"} alt='Profile' width={40} height={50} className='rounded-full'/>  
                                                    </div>
                                                </div></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}></td>
                                <td className={placeholderClass}><div className='flex justify-end items-center gap-1 invisible'>
                                <button className={`${darkMode ? "text-blue-400" : "text-blue-700" } p-1`}>
                                <PiPencilSimpleLineLight size={20}/>
                                </button>
                                <button className={`${darkMode ? "text-red-400 " : "text-red-700  "}p-1`}>
                                    <PiTrashLight size={20}/>
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
                    <option value="5" className='text-black'>5</option>
                    <option value="10" className='text-black'>10</option>
                    <option value="20" className='text-black'>20</option>
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
            <Modal typeSelect='caution' id='admin' handlingAction={()=>handleDelete(passing)} CautionText={'Deletion'}/>
        </div>
    )
}

export default RoleGate 