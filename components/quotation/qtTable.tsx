"use client"
import useToggle from '@/hooks/stores';
import { useCurrentUser } from '@/hooks/use-current-user';
import { areAnagrams, convertTime, dateFormat, fetchData, openModal } from '@/lib/functions';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { PiTrashLight , PiPencilSimpleLineLight } from "react-icons/pi";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { toast } from 'react-toastify';
import useSWR, { mutate } from 'swr';
import Modal from '../ui/modal/modal';
import axios from 'axios';
import { url } from '@/lib/url';
import { useRouter } from 'next/navigation';
import { softDelete } from '@/app/(protected)/quotation/actions/meters';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useQuotation } from '@/hooks/usedatas';
import { IoPrintOutline } from "react-icons/io5";
import { GrDocumentTransfer } from "react-icons/gr";
import { recentlyActivity } from '@/app/(protected)/recently/action';
import { LuCalendarSearch } from "react-icons/lu";
import { LuCalendarX2 } from "react-icons/lu";

type qtProps = {
  id:string;
  qtNo:string;
  qtTitle:string;
  customer:{
    cusName:string;
  }
  qtBus:string;
  total:number;
  createdAt:string;
  updatedAt:string;
  qtDate:string;
}

type Option ={
  id:string;
  cusName:string;
}

const QtTable = () => {
  const router = useRouter()

  const { isOpen , isHover ,darkMode , qtId , passingId , pending, setPending,onEdit,setPassingId , setSwitch , setQtid ,edit ,setPrint , setPrinting} = useToggle()
  const user = useCurrentUser()
  const role = useCurrentRole()
  const quotationCheck = useQuotation()
  const [cus , setCus] = useState<string>('')
  const[page , setPage] = useState(1);
  const [currentPage , setCurrentPage] = useState(1);
  const [focus , setFocus] = useState<number | null>(0)
  const [switched , setSwitched] = useState<boolean>(false)
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [take , setTake] = useState<number>(15)
  const [paperNo , setPaperno] = useState<string>('')
  const [test , setTest] = useState<Option[]>([])
  const [passing , setPassing] = useState<string>('')
  const [val , setVal] = useState({
    filter:'',
    filter1:'',
    fromDate:'',
    toDate:''
  })
  const anagramFilter:string =''
  const {data , error} = useSWR(`${url}/api/qtTable?email=${user.id}&name=${user.name}&page=${page}&take=${take}&filter=${val.filter}&filter1=${val.filter1}&fromDate=${val.fromDate}&toDate=${val.toDate}`,fetchData)

  const qt:qtProps[] = data?.quotations || []
  const totalPages: number = data?.pagination.totalPages || 0;
  const totalFilter:number = data?.totalFilter || 0

  const loadPage = (newPage:number) =>{
    setPage(newPage);
    setCurrentPage(newPage);
  }

  const ulRef = useRef<HTMLUListElement>(null);


  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(focus === 1){
      if (event.keyCode === 38) {
        // Up arrow key
        const index = test.findIndex(item => item.id === selectedItemId);
        setSelectedItemId(index === -1 ? test[test.length - 1].id : test[Math.max(index - 1, 0)].id);
        scrollToSelectedIndex();
      } else if (event.keyCode === 40) {
        // Down arrow key
        const index = test.findIndex(item => item.id === selectedItemId);
        setSelectedItemId(index === -1 ? test[0].id : test[Math.min(index + 1, test.length - 1)].id);
        scrollToSelectedIndex();
      } else if (event.keyCode === 13) {
        // Enter key
        setVal(prev=>({
          ...prev,
          filter1:test.find(item => item.id === selectedItemId)?.cusName || ""
        }));
        setFocus(null)
      }
    }
  };
  
  
  const scrollToSelectedIndex = () => {
    if (ulRef.current && selectedItemId) {
      const selectedItem = ulRef.current.querySelector(`[data-id="${selectedItemId}"]`) as HTMLLIElement | null;
      if (selectedItem) {
        selectedItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  };


  useEffect(() => {
    const handleKeyDownDocument = (event: KeyboardEvent) => {
      handleKeyDown(event as any as React.KeyboardEvent<HTMLInputElement>);
    };
  
    document.addEventListener("keydown", handleKeyDownDocument);
  
    return () => {
      document.removeEventListener("keydown", handleKeyDownDocument);
    };
  }, [selectedItemId]);

  const fetchDatas = async (newString:string) =>{
    const {data} = await axios.get(`${url}/api/customerss?email=${user.id}&filter=${newString}`)
    setTest(data)
  }

  useEffect(()=>{
    if(!val.filter || !val.filter1){
      setPage(currentPage)
      mutate(`${url}/api/qtTable?email=${user.id}&name=${user.name}&page=${currentPage}&take=${take}&filter=${val.filter}&filter1=${val.filter1}&fromDate=${val.fromDate}&toDate=${val.toDate}`)
    }
    if(val.filter !== '' || val.filter1 !== ''){
      setPage(1)
      mutate(`${url}/api/qtTable?email=${user.id}&name=${user.name}&page=1&take=${take}&filter=${val.filter}&filter1=${val.filter1}&fromDate=${val.fromDate}&toDate=${val.toDate}`)
    }
    
    if(val.filter1 !== ""){
      fetchDatas(val.filter1)
    }
  },[val , take , currentPage,user,pending])

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

  const filteredUsers = anagramFilter
  ? qt.filter(quote => areAnagrams(quote.customer.cusName, anagramFilter))
  : qt;

  const thead = useMemo(()=>[
    {
      label:"NO." ,
      textAlign:""   
    },
    {
      label:"QUOTE #",
      textAlign:"text-start pl-[30px]"
    },
    {
      label:"TITLE",
      textAlign:"text-start"
    },
    {
      label:"CUSTOMER",
      textAlign:"text-start"
    },
    {
        label:"BUSINESS",
        textAlign:"text-start"
    },
    {
      label:"TOTAL",
      textAlign:"text-end"
    },
    {
        label:"CREATE DATE",
        textAlign:"text-end"
    },
    {
        label:"UPDATE DATE",
        textAlign:"text-end"
    },
    {
        label:"ACTIONS",
        textAlign:"text-center"
    }
  ],[])

  if(error) return <div>Error fetching data</div>

  const handleDelete = async (id:string) =>{
    
    setPending(true)
      try{
        const data = await softDelete(id)
        if(data?.success){
          recentlyActivity({
            user:user.name,
            cust:cus,
            route:'Quotation',
            action:'Delete',
            paperNo:paperNo
          })
          toast.success(data.success)
          setPending(false)
        }      
        if(data?.error){
          toast.error(data.error)
          setPending(false)
        }
      }catch(error){
        toast.error('error')
        setPending(false)
      }
  }

  const handdleClick = (name:string ,newString:string) =>{
    setVal({
      ...val , [name]:newString
    })
  }

  const handleclick = () =>{
    fetchDatas('')
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const {name , value} = e.target
    setVal({
      ...val , [name]:value
    })
    if(name === 'filter1' && value !== ""){
      setFocus(1)
    }else{
      fetchDatas('')
    }
  }

  if(role !== 'ADMIN' && quotationCheck !== true){
    router.push('/dashboard')
    return(
      <div>
        sorry this page is not allow you to see
      </div>
    )
  }

  const placeholderClass = `${isOpen || isHover ? "py-[1px]" : "py-[1px]"} text-center lg:text-[9px] xl:text-[13px] border-b-[1px] py-[5px]`

  const classes = "bg-thead-primary text-white xl:w-[30px] lg:w-[25px] xl:h-[30px] lg:h-[20px] lg:rounded-sm xl:rounded-md mx-1 xl:text-[16px] lg:text-[10px]"

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
            <div>
            <div className="xl:p-1 relative border-[1px] border-input-primary rounded-md w-[200px]">
                <input 
                type="text" 
                className={`block px-2 py-1 w-full lg:text-[12px] xl:text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`} 
                name='filter1'
                value={val.filter1}
                onClick={handleclick}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={()=>setFocus(1)}
                onBlur={()=>setTimeout(() => {
                  setFocus(null)
                }, 150)}
                placeholder='All'
                />
                <label  className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                    CUSTOMER
                  </label>
                </div>
                <div className='w-[200px] relative'>
                    {
                        focus === 1 && (
                          <ul ref={ulRef} className='absolute rounded-md border-[1px] shadow-md bg-white px-2  py-1 w-full mt-2 max-h-[100px] overflow-auto'>
                            {test.map((item)=>{
                              return(
                                <li data-id={item.id} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`} key={item.id} onClick={()=>{
                                  handdleClick('filter1' , item.cusName)
                                }}>
                                  {item.cusName}
                                </li>
                              )
                            })}
                          </ul>
                        )
                    }
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

            <button className='bg-insomnia-primary h-full px-2 p-1 rounded lg:text-[15px] xl:text-md' onClick={()=>setSwitched(!switched)}>
                  {
                    !switched ? (
                      <div className='text-white'>
                          <LuCalendarSearch />
                      </div>
                    ) : (
                      <div className='text-white'>
                        <LuCalendarX2 />
                      </div>
                    )
                  }
            </button>
          </div>
        </div>
        <table className='w-full mt-[10px]'>
            <thead>
              <tr>
                {
                  thead?.map((item,i)=>{
                    return(
                      <th key={item.label} className={`${item.textAlign} ${item.textAlign} ${i === 0 ? 'rounded-tl-md' : ''} ${i === 8 ? 'rounded-tr-md' : ''} xl:text-[16px] lg:text-[10px] xl:leading-7 pt-[3px] text-white bg-thead-primary`}>{item.label === 'CREATE DATE' ? !switched ? "QT DATE" : "CREATE DATE" : item.label }</th>
                    )
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
                filteredUsers?.map((item,i)=>{
                  return(
                  <tr key={item.id} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px] hover:bg-[#F9FAFB]`}>
                    <td className={placeholderClass}>{(page - 1) * take + i + 1}</td>
                    <td className={`${placeholderClass} text-start pl-[30px]`}>{item.qtNo}</td>
                    <td className={`${placeholderClass} text-start`}>{item.qtTitle}</td>
                    <td className={`${placeholderClass} text-start`}>{item.customer.cusName}</td>
                    <td className={`${placeholderClass} text-start`}>{item.qtBus}</td>
                    <td className={`${placeholderClass} text-end`}>${item.total.toFixed(2)}</td>
                    <td className={placeholderClass}>
                      {
                        !switched ?  (
                          <div className='text-end'>
                            {dateFormat(item.qtDate)}
                          </div>
                        ) : (
                          <div className='flex justify-end items-center'>
                              <div className='pr-[5px]'>{!item.createdAt ? '' : dateFormat(item.createdAt)}</div>
                              <div>{item.createdAt ? convertTime(item.createdAt) : ''}</div>
                          </div>
                        )
                      }
                        
                    
                    </td>
                    <td className={placeholderClass}><div className='flex justify-end items-center gap-1'>
                    <div className='pr-[5px]'>{!item.updatedAt ? '' : dateFormat(item.updatedAt.split("T")[0])}</div><div>{item.updatedAt ? convertTime(item.updatedAt) : ''}</div></div></td>
                    <td className={placeholderClass}>
                        <div className='flex justify-center items-center gap-1'>
                        <button className={`${darkMode ? "text-mainLightBlue" : "text-[#5a5a5a]" } p-1 lg:text-[11px] xl:text-[15px]`} onClick={()=>{
                          setQtid(item.id)
                          setSwitch('invoice')
                          router.push('/invoice/created')
                          console.clear()
                          setPrint(false)
                          setPrinting('')
                        }}>
                          <GrDocumentTransfer />
                        </button>
                        <button className={`${darkMode ? "text-[#5a5a5a]" : "text-mainLightBlue" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                          router.push('/quotation/created')
                          setPrinting('quotation')
                          setPrint(true)
                          onEdit()
                          setPassingId(item.id)
                        }}>
                          <IoPrintOutline />
                        </button>
                        <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                          router.push('/quotation/created')
                          onEdit()
                          setPassingId(item.id)
                          setPrint(false)
                          setPrinting('')
                        }}>
                           <PiPencilSimpleLineLight/>
                        </button>
                        <button className={`${darkMode ? "text-red-400 " : "text-red-700" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                          openModal('quotations')
                          setPassing(item.id)
                          setPrint(false)
                          setCus(item.customer.cusName)
                          setPaperno(item.qtNo)
                        }}>
                            <PiTrashLight />
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
                  for(let i = take; i > filteredUsers.length; i--){
                    row.push(<tr key={crypto.randomUUID()} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px]`}>
                    <td className={placeholderClass}><div className='invisible'>-</div></td>
                     <td className={placeholderClass}></td>
                     <td className={placeholderClass}></td>
                     <td className={placeholderClass}></td>
                     <td className={placeholderClass}></td>
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
                   </tr>)
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
        <Modal typeSelect='caution' id='quotations' handlingAction={()=>handleDelete(passing)} CautionText={'Deletion'}/>
    </div>
    <div className='flex justify-end'>
    <div className='bg-insomnia-primary mt-[15px] font-bold text-white px-5 xl:text-[20px] lg:text-[13px] py-[5px] xl:rounded-lg lg:rounded-md'>
      TOTAL: ${totalFilter.toFixed(2)}
    </div>
    </div>
    </>
  )
}

export default QtTable
