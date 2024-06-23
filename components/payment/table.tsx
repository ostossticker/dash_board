"use client"
import useToggle from '@/hooks/stores';
import { useCurrentUser } from '@/hooks/use-current-user';
import { convertTime, dateFormat, fetchData, openModal } from '@/lib/functions';
import { url } from '@/lib/url';
import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { PiTrashLight , PiEyeLight ,PiPencilSimpleLineLight} from "react-icons/pi";
import { MdOutlineArrowDropDown } from "react-icons/md";
import useSWR, { mutate } from 'swr';
import Modal from '../ui/modal/modal';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { deletePaymentAll } from '@/app/(protected)/payment/actions/payment';
import { softDelete } from '@/app/(protected)/invoice/actions/meters';
import { useCurrentRole } from '@/hooks/use-current-role';
import { usePayment } from '@/hooks/usedatas';

type arr = {
  id:string;
  invNo:string;
  invCusName:string;
  invCusComp:string;
  invCusPhone:string;
  invBus:string;
  invStatus:string;
  createdAt:string;
  updatedAt:string;
  balance:string;
  _sum:{
    balance:number
  }
  _count:{
    invCusName:number;
  }
}

type optionDrop = {
  id:string;
  busName:string;
}
type balanceStatus = {
  id:string;
  _sum:{
    balance:number
  }
  invStatus:string;
}

const InvTable = () => {
  const router = useRouter()
  const user = useCurrentUser()
  const role = useCurrentRole()
  const payCheck = usePayment()
  const { isOpen , isHover ,darkMode , pending , setPending , onEdit , setPassingId , setQtid} = useToggle()
  const [page , setPage] = useState(1)
  const [currentPage , setCurrentPage] = useState<number>(1)
  const [take , setTake] = useState<number>(15)
  const [focus , setFocus] = useState<number | null>(0)
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [test , setTest] = useState<optionDrop[]>([])
  const [totalStatus , setTotalStatus] = useState<balanceStatus[]>([])
  const [passing , setPassing] = useState<string>('')
  const [cusComp , setCusComp] = useState<string>('')
  const [bus , setBus] = useState<string>('')
  const ulRef = useRef<HTMLUListElement>(null);
  const [val , setVal] = useState({
    filter:'',
    filter1:'',
    status:'',
    fromDate:'',
    toDate:''
  })
  const [icon ,  setIcon] = useState<boolean>(false)
  const [switching , setSwitching] = useState<string>('group')

  const {data , error} = useSWR(`${url}/api/getPayment?switched=${switching}&email=${user.id}&name=${user.name}&page=${page}&take=${take}&filter=${val.filter}&filter1=${val.filter1}&filter2=${val.status}&fromDate=${val.fromDate}&toDate=${val.toDate}`,fetchData)

  const invoices:arr[] = data?.payment || []
  const totalPages: number = data?.pagination.totalPages || 0;
  const totalValue: number = data?.totalV || 0

  const loadPage = (newPage:number) =>{
    setPage(newPage);
    setCurrentPage(newPage);
  }

  const fetchDatas = async (newString:string) =>{
    const {data} = await axios.get(`${url}/api/businesss?email=${user.id}&name=${user.name}&filter=${newString}`)
    setTest(data)
}

 const fetchdatas1 = async () =>{
  const {data} = await axios.get(`${url}/api/paymentStatus?email=${user.id}&name=${user.name}`)
  setTotalStatus(data)
 }

  useEffect(()=>{
    if(!val.filter || !val.filter1 || !val.status){
        setPage(currentPage)
        mutate(`${url}/api/getPayment?switched=${switching}&email=${user.id}&name=${user.name}&page=${currentPage}&take=${take}&filter=${val.filter}&filter1=${val.filter1}&filter2=${val.status}&fromDate=${val.fromDate}&toDate=${val.toDate}`)
    }
    if(val.filter !== '' && val.filter1 !== '' && val.status !== '' ){
        setPage(currentPage)
        mutate(`${url}/api/getPayment?switched=${switching}&email=${user.id}&name=${user.name}&page=1&take=${take}&filter=${val.filter}&filter1=${val.filter1}&filter2=${val.status}&fromDate=${val.fromDate}&toDate=${val.toDate}`)
    }
    
    if(val.filter1 !== ""){
      fetchDatas(val.filter1)
    }

    fetchdatas1()
     /// fix this part it need loop 4 times
  },[take , currentPage , user , val , pending ])

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
          filter1:test.find(item => item.id === selectedItemId)?.busName || ""
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

    useEffect(() => {
      const handleBackspace = (event: KeyboardEvent) => {
          event.preventDefault();
  
          if (event.key === 'Backspace') {
            setIcon(false) /// set switching invoice and delivery as text withy icon instead
            setSwitching('group')
          }
      };
  
      window.addEventListener('keydown', handleBackspace);
  
      return () => {
          window.removeEventListener('keydown', handleBackspace);
      };
  }, []);

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
        label:"INVOICE#",
        textAlign:'text-start pl-[30px]'
    },
    {
      label:"CUSTOMER",
      textAlign:"text-start pl-[50px]"
    },
    {
      label:"COMPANY",
      textAlign:"text-start"
    },
    {
      label:"BUSINESS",
      textAlign:"text-start"
    },
    {
      label:"INVOICES",
      textAlign:'text-center'
    },
    {
      label: "STATUS",
      textAlign:`${switching === 'ungroup' ? "text-center" : "hidden"}`
    },
    {
      label: "CREATE DATE",
      textAlign:`${switching === 'ungroup' ? "text-end" : "hidden"}`
    },
    {
      label: "UPDATE DATE",
      textAlign:`${switching === 'ungroup' ? "text-end" : "hidden"}`
    },
    {
     label: "PHONE NUMBER",
     textAlign:`${switching === 'ungroup' ? "text-end" : "hidden"}`
    },
    {
      label:"TOTAL",
      textAlign:"text-end"
    },
    {
        label:"ACTIONS",
        textAlign:""
    }
  ],[switching])

  if(error) return <div>Error fetching data</div>

  const handleDelete = async (id:string , cusComp:string ,invBus:string) =>{
    setPending(true)
    if(switching === 'group'){
        await deletePaymentAll(id , cusComp , invBus )
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
    if(switching === 'ungroup'){
        await softDelete(id)
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

  const handdleClick = (name:string ,newString:string) =>{
    setVal({
      ...val , [name]:newString
    })
  }

  const handleclick = () =>{
    fetchDatas('')
  }

  const handleSelectChange = (e:React.ChangeEvent<HTMLSelectElement>) =>{
    setVal(prev=>({
      ...prev,
      status:e.target.value
    }))
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

  const placeholderClass = `${isOpen || isHover ? "py-[1px]" : "py-[1px]"} text-center xl:text-[13px] lg:text-[9px] border-b-[1px] py-[5px]`

  const classes = "bg-thead-primary text-white xl:w-[30px] lg:w-[25px] xl:h-[30px] lg:h-[20px] lg:rounded-sm xl:rounded-md mx-1 xl:text-[16px] lg:text-[10px]"

    
  if(role !== 'ADMIN' && payCheck !== true){
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
                autoComplete='off'
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
                autoComplete='off'
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
                    BUSINESS
                  </label>
                </div>
                <div className='w-[200px] relative'>
                    {
                        focus === 1 && (
                          <ul ref={ulRef} className='absolute rounded-md border-[1px] shadow-md bg-white px-2  py-1 w-full mt-2 max-h-[100px] overflow-auto'>
                            {test.map((item)=>{
                              return(
                                <li data-id={item.id} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`} key={item.id} onClick={()=>{
                                  handdleClick('filter1' , item.busName)
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
            <div>
                <div className="xl:p-1 relative border-[1px] border-input-primary rounded-md w-[200px]">
                <select value={val.status} onChange={handleSelectChange} className={`block px-2 py-1 w-full lg:text-[12px] xl:text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : `${val.status === "" ? 'text-input-primary' : ''}`}`} >
                                        <option value="">All</option>
                                        <option value="paid">paid</option>
                                        <option value="unpay">unpaid</option>
                                        <option value="partial">partial</option>
                                    </select>
                  <label  className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                      STATUS
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
            <div className='flex gap-3'>
            <div className='flex justify-center items-center rounded-[7px]'>
            <button className={`bg-insomnia-primary h-full px-2 py-1 rounded w-[100px] flex justify-center items-center lg:text-[15px] xl:text-md`} onClick={()=>{
                setVal(prev=>({
                  ...prev,
                  filter:'',
                  filter1:'',
                  status:'',
                  fromDate:'',
                  toDate:''
                }))
                setIcon(!icon) /// set switching invoice and delivery as text withy icon instead
                setSwitching(!icon ? 'ungroup' : "group")
            }}>
                        {
                            !icon ? (
                                <div className='text-white'>
                                    ungroup
                                </div>
                            ) : (
                                <div className='text-white'>
                                    group
                                </div>
                            )
                        }
            </button>
        </div>
            </div>
        </div>
        <table className='w-full mt-[10px]'>
            <thead>
              <tr>
                {
                  thead?.map((item , i)=>{
                    return(
                      <React.Fragment key={item.label}>
                        <th className={`${item.textAlign} ${i === 0 ? 'rounded-tl-md' : ''} ${i === 11 ? 'rounded-tr-md' : ''} xl:text-[16px] lg:text-[10px] xl:leading-7 pt-[3px] ${item.label === 'INVOICES' && icon && '!hidden'} ${item.label === 'INVOICE#' && !icon && '!hidden'} text-white bg-thead-primary text-[14px]`}>{item.label} </th>
                      </React.Fragment>
                    )
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
                invoices?.map((item,i)=>{
                  return(
                  <tr key={item.id} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px] hover:bg-[#F9FAFB]`}>
                    <td className={placeholderClass}>{i + 1}</td>
                    <td className={`${placeholderClass} text-start pl-[30px] ${switching === 'ungroup' ? "" : "!hidden"}`}>{item.invNo}</td>
                    <td className={`${placeholderClass} text-start pl-[50px]`}>{item.invCusName}</td>
                    <td className={`${placeholderClass} text-start`}>{item.invCusComp}</td>
                    <td className={`${placeholderClass} text-start`}>{item.invBus}</td>
                    {
                        item._count && (
                            <td className={`${placeholderClass} text-center`}>{item._count.invCusName}</td>
                        )
                    }
                   
                    {
                      item.invStatus && (
                        <td className={`${placeholderClass}`}>
                        <div className='flex justify-center '>
                          <div className={` font-semibold text-[15px] rounded-md lg:text-[9px] xl:text-[13px] ${item.invStatus === 'paid' ? "bg-mainLightBlue text-white" : item.invStatus === 'unpay' ? "bg-insomnia-primary text-white" : item.invStatus === 'partial' ? "bg-[#FBB96F] text-white" : ""} xl:w-[80px] lg:w-[50px]`}>
                            {item.invStatus === "unpay" ? "Unpaid" : item.invStatus.charAt(0).toUpperCase() + item.invStatus.slice(1) }
                          </div>
                          </div>
                          </td>
                      )
                    }
                   {
                    item.createdAt && (
                      <td className={placeholderClass}>
                        <div className='flex justify-end items-center'>
                      <div className='pr-[5px]'>
                          {dateFormat(item.createdAt)}
                      </div>
                      <div>
                          {convertTime(item.createdAt)}
                      </div>
                      </div>
                      </td>
                    )
                   }
                    {
                      item.updatedAt && (
                        <td className={placeholderClass}>
                          <div className='flex justify-end items-center'>
                          <div className='pr-[5px]'>
                              {dateFormat(item.updatedAt)}

                          </div>
                              <div>
                                  {convertTime(item.updatedAt)}
                              </div>
                          </div>
                          </td>
                      )
                    }
                    
                          {
                            switching === 'ungroup' && (
                              <td className={`${placeholderClass} text-end`}>
                                  {item.invCusPhone }
                             </td>
                            ) 
                          }
                    
                    <td className={`${placeholderClass} text-end`}>${item._sum && item._sum.balance !== undefined && item._sum.balance.toFixed(2)} {item.balance !== undefined && parseFloat(item.balance).toFixed(2)}</td>
                    <td className={placeholderClass}>
                    <div className='flex justify-center items-center gap-1'>
                        <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                          if(item._count.invCusName !== undefined){
                            setSwitching('ungroup')
                            setIcon(true)
                            setVal(prev=>({
                                ...prev,
                                filter:item.invCusName,
                                filter1:item.invBus
                            }))
                          }else{
                            router.push('/invoice/created')
                            onEdit()
                            setQtid('')
                            setPassingId(item.id)
                          }
                        }}>
                         {item._count && item._count.invCusName ? <PiEyeLight/> : <PiPencilSimpleLineLight/> }  
                        </button>
                        <button className={`${darkMode ? "text-red-400 " : "text-red-700" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                            openModal('invtable')
                            if(item._count.invCusName){
                                setPassing(item.invCusName)
                                setCusComp(item.invCusComp)
                                setBus(item.invBus)
                            }else{
                                setPassing(item.id)
                            }
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
                  for(let i = take; i > invoices.length; i--){
                    row.push(
                      <tr key={crypto.randomUUID()} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px]`}>
                        <td className={placeholderClass}><div className='invisible'>-</div></td>
                        <td className={placeholderClass}></td>
                        <td className={placeholderClass}></td>
                        <td className={placeholderClass}></td>
                        <td className={placeholderClass}></td>
                        <td className={placeholderClass}></td>
                        {switching === 'ungroup' && <td className={placeholderClass}></td>}
                        {switching === 'ungroup' && <td className={placeholderClass}></td>}
                        {switching === 'ungroup' && <td className={placeholderClass}></td>}
                        {switching === 'ungroup' && <td className={placeholderClass}></td>}
                        <td className={placeholderClass}>
                          <div className='flex justify-end items-center gap-1 invisible'>
                          <button className={`${darkMode ? "text-blue-400" : "text-blue-700" } p-1 lg:text-[14px] xl:text-[20px]`}>
                            <PiEyeLight />
                          </button>
                          <button className={`${darkMode ? "text-red-400 " : "text-red-700  "}p-1 lg:text-[14px] xl:text-[20px]`} >
                              <PiTrashLight />
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
        
        <Modal typeSelect='caution' id='invtable' handlingAction={()=>handleDelete(passing , cusComp , bus)} CautionText={'Deletion'}/>
    </div>
    <div className='flex justify-end gap-4'>

              {
                totalStatus.map((item,id)=>{
                  return(
                    <div key={item.id} className='bg-insomnia-primary mt-[15px] font-bold text-white px-5 xl:text-[20px] lg:text-[13px] py-[5px] xl:rounded-lg lg:rounded-md'>
                    <p>
                      {item.invStatus === 'unpay' ? "unpaid" : item.invStatus}: ${item._sum.balance.toFixed(2)}
                    </p>
                    </div>
                  )
                })
              }
              <div className='bg-insomnia-primary mt-[15px] font-bold text-white px-5 xl:text-[20px] lg:text-[13px] py-[5px] xl:rounded-lg lg:rounded-md'>       
              <p>
              Total Sale: ${totalValue.toFixed(2)}  
              </p>
            </div>
    </div>
    </>
  )
}

export default InvTable
