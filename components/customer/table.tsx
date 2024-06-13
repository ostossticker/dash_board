"use client"
import { deleteCustomer } from '@/app/(protected)/customer/actions/customer';
import useToggle from '@/hooks/stores';
import { useCurrentUser } from '@/hooks/use-current-user';
import { areAnagrams, fetchData, openModal } from '@/lib/functions';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { PiTrashLight , PiPencilSimpleLineLight } from "react-icons/pi";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { toast } from 'react-toastify';
import useSWR, { mutate } from 'swr';
import Modal from '../ui/modal/modal';
import axios from 'axios';
import { url } from '@/lib/url';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCustomer } from '@/hooks/usedatas';
import { useRouter } from 'next/navigation';

type customerProps = {
  id:string;
  cusName:string;
  cusBus:string;
  cusComp:string;
  cusPhone1:string;
  cusPhone2:string;
  cusTelegram:string;
  cusEmail:string;
  cusAddr:string;
}

type Option = {
  id:string;
  busName:string;
}



const CusTable = () => {
  const { isOpen , isHover ,darkMode , pending,setPending,onEdit,setPassingId} = useToggle()
  const user = useCurrentUser()
  const role = useCurrentRole()
  const cusCheck = useCustomer()
  const router = useRouter()
  const [focus , setFocus] = useState<number | null>(0)
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const[page , setPage] = useState(1);
  const [currentPage , setCurrentPage] = useState(1);
  const [take , setTake] = useState<number>(15)
  const [val , setVal] = useState({
    filter:'',
    fitler1:''
  })
  const ulRef = useRef<HTMLUListElement>(null);
  const [test , setTest] = useState<Option[]>([])
  const [passing , setPassing] = useState<string>('')
  const anagramFilter:string =''
  const {data , error} = useSWR(`${url}/api/customertable?email=${user.id}&name=${user.name}&page=${page}&take=${take}&filter=${val.filter}&filter1=${val.fitler1}`,fetchData)

  const cus:customerProps[] = data?.customers || []
  const totalPages: number = data?.pagination.totalPages || 0;

  const loadPage = (newPage:number) =>{
    setPage(newPage);
    setCurrentPage(newPage);
  }


  const fetchDatas = async (filterVal:string) =>{
    const {data} = await axios.get(`${url}/api/businesss?email=${user.id}&name=${user.name}&filter=${filterVal}`)
    setTest(data)
  }
  
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
          fitler1:test.find(item => item.id === selectedItemId)?.busName || ""
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

  useEffect(()=>{
    if(!val.filter || !val.fitler1){
      setPage(currentPage)
      mutate(`${url}/api/customertable?email=${user.id}&name=${user.name}&page=${currentPage}&take=${take}&filter=${val.filter}&filter1=${val.fitler1}`)
    }
    if(val.filter !== '' || val.fitler1 !== ''){
      setPage(1)
      mutate(`${url}/api/customertable?email=${user.id}&name=${user.name}&page=1&take=${take}&filter=${val.filter}&filter1=${val.fitler1}`)
    }
    if(val.fitler1 !== ""){
      fetchDatas(val.fitler1)
    }
  },[val , take , currentPage,user,pending])

  const handsClick = () =>{
    fetchDatas('')
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

  const filteredUsers = anagramFilter
  ? cus.filter(cuss => areAnagrams(cuss.cusName, anagramFilter))
  : cus;



  const thead = useMemo(()=>[
    {
      label:"NO." ,
      textAlign:""   
    },
    {
      label:"NAME",
      textAlign:"text-start"
    },
    {
      label:"BUSINESS",
      textAlign:"text-start"
    },
    {
      label:"COMPANY",
      textAlign:"text-start"
    },
    {
      label:"PHONE NUMBER 1",
      textAlign:"text-end"
    },
    {
      label: "PHONE NUMBER 2",
      textAlign:"text-end"
    },
    {
        label:"TELEGRAM",
        textAlign:"text-end"
    },
    {
        label:"EMAIL",
        textAlign:"text-start pl-[50px]"
    },
    {
        label:"ADDRESS",
        textAlign:"text-start"
    },
    {
        label:"ACTIONS",
        textAlign:""
    }
  ],[])

  if(error) return <div>Error fetching data</div>

  const handleDelete = async (id:string) =>{
    setPending(true)
    await deleteCustomer(id)
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
    if(name === 'fitler1' && value !== ""){
      setFocus(1)
    }else{
      fetchDatas('')
    }
  }

  const handleClick = (name:string , newString:string) =>{
    setVal({
      ...val, [name]:newString
    })
  }


  const placeholderClass = `${isOpen || isHover ? "py-[1px]" : "py-[1px]"} text-center lg:text-[9px] xl:text-[13px] border-b-[1px] py-[5px]`

  const classes = "bg-thead-primary text-white xl:w-[30px] lg:w-[25px] xl:h-[30px] lg:h-[20px] lg:rounded-sm xl:rounded-md mx-1 xl:text-[16px] lg:text-[10px]"

  if(role !== 'ADMIN' && cusCheck !== true){
    router.push('/dashboard')
    return(
        <div>
            WE SORRY YOU NOT ALLOW TO SEE THIS PAGE AND GET REKT
        </div>
    )
  }

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
                value={val.filter}
                onChange={handleChange}
                placeholder='Search'
                autoComplete='off'
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
                name='fitler1'
                value={val.fitler1}
                onClick={handsClick}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={()=>setFocus(1)}
                onBlur={()=>setTimeout(() => {
                  setFocus(null)
                }, 150)}
                placeholder='All'
                autoComplete='off'
                />
                <label  className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                    BUSINESS
                  </label>
                </div>
                <div className='w-[200px] relative'>
                    {
                        focus === 1 && (
                          <ul ref={ulRef} className='absolute rounded-md border-[1px] shadow-md bg-white pl-2  py-1 w-full mt-2 max-h-[100px] overflow-auto'>
                            {test.map((item)=>{
                              return(
                                <li data-id={item.id} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`} key={item.id} onClick={()=>{
                                  handleClick('fitler1' , item.busName)
                                }}>
                                  {item.busName}
                                </li>
                              )
                            })}
                          </ul>
                        )
                    }
                </div>
            </div>
        </div>
      </div>
        <table className='w-full mt-[10px]'>
            <thead>
              <tr>
                {
                  thead?.map((item , i)=>{
                    return(
                      <th key={item.label} className={`${item.textAlign} ${i === 0 ? 'rounded-tl-md' : ''} ${i === 9 ? 'rounded-tr-md' : ''} xl:text-[16px] lg:text-[10px] xl:leading-7 pt-[3px] text-white bg-thead-primary text-[15px]`}>{item.label}</th>
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
                    <td className={`${placeholderClass} text-start`}>{item.cusName}</td>
                    <td className={`${placeholderClass} text-start`}>{item.cusBus}</td>
                    <td className={`${placeholderClass} text-start`}>{item.cusComp}</td>
                    <td className={`${placeholderClass} text-end`}>{item.cusPhone1}</td>
                    <td className={`${placeholderClass} text-end`}>{item.cusPhone2}</td>
                    <td className={`${placeholderClass} text-end`}>{item.cusTelegram}</td>
                    <td className={`${placeholderClass} text-start pl-[50px]`}>{item.cusEmail}</td>
                    <td className={`${placeholderClass} text-start`}>{item.cusAddr}</td>
                    <td className={placeholderClass}>
                        <div className='flex justify-center items-center gap-1'>
                        <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                          openModal('my_modal_5')
                          onEdit()
                          setPassingId(item.id)
                        }}>
                           <PiPencilSimpleLineLight/>
                        </button>
                        <button className={`${darkMode ? "text-red-400 " : "text-red-700" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                          openModal('customer')
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
                  for(let i = take; i > filteredUsers.length; i--){
                    row.push(
                    <tr key={crypto.randomUUID()} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px]`}>
                        <td className={placeholderClass}><div className='invisible'>-</div></td>
                        <td className={placeholderClass}></td>
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
                           <PiPencilSimpleLineLight/>
                        </button>
                        <button className={`${darkMode ? "text-red-400 " : "text-red-700  "}p-1 lg:text-[14px] xl:text-[20px]`}>
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
    
            </tbody>
        </table>
        {/****************** */}
        <div className='flex justify-start pb-[14px] gap-4'>
          
        <div className='flex justify-center px-[5px] xl:rounded-md lg:rounded-sm items-center mt-[16px] bg-thead-primary xl:h-[30px] lg:h-[20px] text-white'>
        <select value={take} className='bg-transparent outline-none xl:text-[16px] lg:text-[10px]' onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>setTake(Number(e.target.value))}>
        <option value="15" className='text-black '>15</option>
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
        <Modal typeSelect='caution' id='customer' handlingAction={()=>handleDelete(passing)} CautionText={'Deletion'}/>
    </div>
  )
}

export default CusTable
