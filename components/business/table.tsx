"use client"
import useToggle from '@/hooks/stores';
import { useCurrentUser } from '@/hooks/use-current-user';
import { areAnagrams, fetchData, openModal } from '@/lib/functions';
import React, { useEffect, useMemo, useState } from 'react'
import { MdOutlineArrowDropDown } from "react-icons/md";
import { PiTrashLight , PiPencilSimpleLineLight , PiEyeLight } from "react-icons/pi";
import useSWR, { mutate } from 'swr';
import Modal from '../ui/modal/modal';
import { deleteBusiness } from '@/app/(protected)/bussiness/action/business';
import { toast } from 'react-toastify';
import Bustop from './top';
import { useRouter } from 'next/navigation';
import { url } from '@/lib/url';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useBusiness } from '@/hooks/usedatas';
import { PiCheckLight } from "react-icons/pi";

type businessProps = {
  id:string
  busName:string;
  busDes:string;
  busEmail:string;
  busLogo:string;
  signature:string;
  Rec1:string;
  abaQr:string;
  see:boolean;
}

type Option = {
  id:string;
  busName:string;
  busEmail:string;
}

type displayProps = {
  abaQr:string;
  signature:string;
  busLogo:string;
  Rec1:string;
}


const BusTable = () => {
  const { isOpen , isHover ,darkMode , pending,setPending,onEdit,setPassingId} = useToggle()
  const vall = typeof window !== 'undefined' ? localStorage.getItem("businessCheck") : null
  const user = useCurrentUser()                                            
  const router = useRouter()
  const role = useCurrentRole()
  const busCheck = useBusiness()
  const[page , setPage] = useState(1);
  const [currentPage , setCurrentPage] = useState(1);
  const [bustick , setBusTick] = useState<string>(vall || '')
  const [take , setTake] = useState<number>(15)
  const [filter , setFilter] = useState<string>('')
  const [suggesting , setSuggest] = useState<Option[]>([])
  const [display , setDisplay] = useState<displayProps>({
    abaQr:'',
    signature:'',
    busLogo:'',
    Rec1:''
  })
  const [passing , setPassing] = useState<string>('')
  const {data , error} = useSWR(`${url}/api/businesstable?email=${user.id}&page=${page}&take=${take}&filter=${filter}&name=${user.name}`,fetchData)

  const bus:businessProps[] = data?.buses || []
  const totalPages: number = data?.pagination.totalPages || 0;       
             
  const loadPage = (newPage:number) =>{
    setPage(newPage);
    setCurrentPage(newPage);
  }

  const handleFilterChange = (e:React.ChangeEvent<HTMLInputElement>,options:Option[],setSuggests:React.Dispatch<React.SetStateAction<Option[]>>)=>{
    const value = e.target.value
    setFilter(value)
    const filteredOptions = options.filter(op=>areAnagrams(op.busName,value.trim()))
    setSuggests(filteredOptions)
  }

  useEffect(()=>{
    if(!filter){
      setPage(currentPage)
      mutate(`${url}/api/businesstable?email=${user.id}&name=${user.name}&page=${currentPage}&take=${take}&filter=${filter}`)
    }
    if(filter !== ''){
      setPage(1)
      mutate(`${url}/api/businesstable?email=${user.id}&name=${user.name}&page=1&take=${take}&filter=${filter}`)
    }
  },[filter , take , currentPage , user , pending])


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
      textAlign:"text-center"   
    },
    {
      label:"BUSINESS",
      textAlign:"text-start pl-[30px]"
    },
    {
      label:"DESCRIPTION",
      textAlign:"text-start"
    },
    {
      label:"EMAIL",
      textAlign:"text-start"
    },
    {
        label:"ACTIONS",
        textAlign:"text-end pr-[50px]"
    }
  ],[])

  if(error) return <div>Error fetching data</div>

  const handleDelete = async (id:string , oldImg:string , oldImg1:string , oldImg2:string , oldImg3:string) =>{
    setPending(true)
    await deleteBusiness(id , oldImg , oldImg1 , oldImg2 , oldImg3)
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


  const placeholderClass = `${isOpen || isHover ? "py-[1px]" : "py-[1px]"} lg:text-[9px] xl:text-[13px] border-b-[1px] py-[5px]`

  const classes = "bg-thead-primary text-white xl:w-[30px] lg:w-[25px] xl:h-[30px] lg:h-[20px] lg:rounded-sm xl:rounded-md mx-1 xl:text-[16px] lg:text-[10px]"

  
 
  if(role !== 'ADMIN' && busCheck !== true){
    router.push('/dashboard')
    return(
        <div>
            WE SORRY YOU NOT ALLOW TO SEE THIS PAGE AND GET REKT
        </div>
    )
  }

  return (
    <div className={`${darkMode ? "bg-dark-box-color" : "bg-white"} mt-[20px] shadow-md rounded-lg px-[30px] ${isOpen || isHover ? "py-[8px]" : "py-[10px]"}`}>
        <Bustop
        val={filter} 
        setFilter={setFilter}
        func={(e)=>handleFilterChange(e,bus,setSuggest)}
        suggesting={suggesting}
        onclick={()=>setFilter('')}
        />
        <table className='w-full mt-[10px]'>
            <thead>
              <tr>
                {
                  thead?.map((item , i)=>{
                    return(
                      <th key={item.label} className={`${item.textAlign} ${i === 0 ? 'rounded-tl-md' : ''} ${i === 4 ? 'rounded-tr-md' : ''} xl:text-[16px] lg:text-[10px] xl:leading-7 pt-[3px] text-white bg-thead-primary text-[15px]`}>{item.label}</th>
                    )
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
                bus.map((item,i)=>{
                  return(
                  <tr key={item.id} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px] hover:bg-[#F9FAFB]`}>
                    <td className={`${placeholderClass} text-center`}>{(page - 1) * take + i + 1}</td>
                    <td className={`${placeholderClass} text-start pl-[30px]`}>{item.busName}</td>
                    <td className={`${placeholderClass} text-start`}>{item.busDes}</td>
                    <td className={`${placeholderClass} text-start`}>{item.busEmail}</td>
                    <td className={`${placeholderClass}`}>
                        <div className='flex justify-end items-center gap-1 pr-[20px]'>
                        <button className={`${item.busName === bustick ? "text-green-700" : ""} p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                          localStorage.setItem("businessCheck" , item.busName)
                          setBusTick(item.busName)
                        }}>
                          <PiCheckLight/>
                        </button>
                        <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                          openModal('my_modal_5')
                          onEdit()
                          setPassingId(item.id)
                        }}>
                           <PiPencilSimpleLineLight/>
                        </button>
                        <button className={`${darkMode ? "text-red-400 " : "text-red-700" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                          openModal('business')
                          setPassing(item.id)
                          setDisplay(prev=>({
                            ...prev,
                            busLogo:item.busLogo,
                            signature:item.signature,
                            abaQr:item.abaQr,
                            Rec1:item.Rec1
                          }))
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
                  for(let i = take; i > bus.length; i--){
                    row.push(
                      <tr key={crypto.randomUUID()} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px]`}>
                        <td className={placeholderClass}><div className='invisible'>-</div></td>
                        <td className={placeholderClass}></td>
                        <td className={placeholderClass}></td>
                        <td className={placeholderClass}></td>
                        <td className={placeholderClass}>
                        <div className='flex justify-end items-center gap-1 invisible'>
                      
                        <button className={`${darkMode ? "text-blue-400" : "text-blue-700" } p-1 lg:text-[14px] xl:text-[20px]`}>
                           <PiPencilSimpleLineLight size={20}/>
                        </button>
                        <button className={`${darkMode ? "text-red-400 " : "text-red-700  "}p-1 lg:text-[14px] xl:text-[20px]`}>
                            <PiTrashLight size={20}/>
                        </button>
                        </div>
                        </td>
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
        <Modal typeSelect='caution' id='business' handlingAction={()=>handleDelete(passing , display.abaQr , display.signature , display.busLogo , display.Rec1)} CautionText={'Deletion'}/>
    </div>
  )
}

export default BusTable
