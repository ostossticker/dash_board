"use client"
import useToggle from '@/hooks/stores';
import { useCurrentUser } from '@/hooks/use-current-user';
import { areAnagrams, closeModal, fetchData, openModal } from '@/lib/functions';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { PiTrashLight , PiPencilSimpleLineLight } from "react-icons/pi";
import { MdOutlineArrowDropDown } from "react-icons/md";
import useSWR, { mutate } from 'swr';
import Modal from '../ui/modal/modal';
import { deleteEmployee } from '@/app/(protected)/employee/action/employee';
import { toast } from 'react-toastify'
import { IoEyeOutline } from "react-icons/io5";
import axios from 'axios';
import { url } from '@/lib/url';
import { useCurrentRole } from '@/hooks/use-current-role';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEmployee } from '@/hooks/usedatas';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ResponsiveElement from '../invoice&quotation/ResComp';

type empProps = {
  id:string;
  empName:string;
  empGender:string;
  empOcc:string;
  empPhone:string;
  empNational:string;
  empId:string;
  empAddr:string;
  empCard:string;
}

type Option = {
  id:string;
  empName:string;
  
}

type Option1 = {
  id:string;
  empOcc:string;
}

const EmpTable = () => {
  const { isOpen , isHover ,darkMode , pending , setPending , onEdit , setPassingId} = useToggle()
  const user = useCurrentUser();
  const role = useCurrentRole()
  const router = useRouter()
  const empCheck = useEmployee()
  const [page , setPage] = useState(1)
  const [currentPage , setCurrentPage] = useState(1)
  const [display , setDisplay] = useState<string>('')
  const [focus , setFocus] = useState<{check:boolean , check1:boolean}>({
    check:false,
    check1:false
  })
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [forPopup , setForpopup] = useState<string>('')
  const [popup , setPopup] = useState<boolean>(false)
  const [take , setTake] = useState<number>(15)
  const [test , setTest] = useState<Option[]>([])
  const [test1 , setTest1] = useState<Option1[]>([])
  const [passing , setPassing] = useState<string>('')
  const anagramFilter:string = ''
  const [val , setVal] = useState({
    filter:'' , 
    filter1:'' , 
    filter2:'' ,
    filter3:'' ,
  })
  const {data , error} = useSWR(`${url}/api/employeetable?email=${user.id}&page=${page}&take=${take}&filter=${val.filter}&filter1=${val.filter1}&gender=${val.filter2}&occ=${val.filter3}`,fetchData)

  const ulRef = useRef<HTMLUListElement>(null);

  const emps:empProps[] = data?.employ || []
  const totalPages:number = data?.pagination.totalPages || 0

  const loadPage = (newPage:number) =>{
    setPage(newPage)
    setCurrentPage(newPage)
  }

 
  const fetchDatas = async (fil1?:string) =>{
   const {data} =  await axios.get(`${url}/api/employees?email=${user.id}&filter=${fil1 === undefined ? '' : fil1 }`)
      setTest(data)
  }
  const fetchDatas1 = async (fil2?:string) =>{
    const {data} =  await axios.get(`${url}/api/employees1?email=${user.id}&occupationFilter=${fil2 === undefined ? '' : fil2}`)
       setTest1(data)
   }

const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, name?:string) => {
  if(focus.check === true || focus.check1 === true){
    if (event.keyCode === 38) {
      // Up arrow key
      if(name === 'filter1'){
        const index = test.findIndex(item => item.id === selectedItemId);
      setSelectedItemId(index === -1 ? test[test.length - 1].id : test[Math.max(index - 1, 0)].id);
      scrollToSelectedIndex();
      }
      if(name === 'filter3'){
        const index = test1.findIndex(item => item.id === selectedItemId);
        setSelectedItemId(index === -1 ? test1[test1.length - 1].id : test1[Math.max(index - 1, 0)].id);
        scrollToSelectedIndex();
      }
    } else if (event.keyCode === 40) {
      // Down arrow key
      if(name === 'filter1'){
          const index = test.findIndex(item => item.id === selectedItemId);
        setSelectedItemId(index === -1 ? test[0].id : test[Math.min(index + 1, test.length - 1)].id);
        scrollToSelectedIndex();
      }
      if(name === 'filter3'){
        const index = test1.findIndex(item => item.id === selectedItemId);
        setSelectedItemId(index === -1 ? test1[0].id : test1[Math.min(index + 1, test1.length - 1)].id);
        scrollToSelectedIndex();
      }
    } else if (event.keyCode === 13) {
      // Enter key
      if(name === 'filter1'){
        setVal(prev=>({
          ...prev,
          filter1:test.find(item => item.id === selectedItemId)?.empName || ""
        }));
        setFocus(prev=>({
          ...prev,
          check:false
        }))
      }
      if(name === 'filter3'){
        setVal(prev=>({
          ...prev,
          filter3:test1.find(item => item.id === selectedItemId)?.empOcc || ""
        }));
        setFocus(prev=>({
          ...prev,
          check1:false
        }))
      }
      
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
    if(!val.filter || !val.filter1){
      setPage(currentPage)
      mutate(`${url}/api/employeetable?email=${user.id}&page=${currentPage}&take=${take}&filter=${val.filter}&filter1=${val.filter1}&gender=${val.filter2}&occ=${val.filter3}`)
    }
    if(val.filter !== '' || val.filter1 !== ''){
      setPage(1)
      mutate(`${url}/api/employeetable?email=${user.id}&page=1&take=${take}&filter=${val.filter}&filter1=${val.filter1}&gender=${val.filter2}&occ=${val.filter3}`)
    }
      fetchDatas(val.filter1 )
      fetchDatas1(val.filter3)
  },[val , take, currentPage , user , pending])

  const handlesClick = () =>{
    const fetchdata = async () =>{
      const {data} = await axios.get(`${url}/api/employees?email=${user.id}`)
      setTest(data)
    }
    fetchdata()
  }

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

  const filteredUser = anagramFilter
  ? emps.filter(emp => areAnagrams(emp.empName, anagramFilter))
  : emps

  const thead = useMemo(()=>[
    {
      label:"NO." ,
      textAlign:""   
    },
    {
      label:"NAME",
      textAlign:"text-start pl-[50px]"
    },
    {
      label:"GENDER",
      textAlign:"text-start"
    },
    {
      label:"OCCUPATION",
      textAlign:"text-start"
    },
    {
      label:"PHONE#",
      textAlign:"text-end"
    },
    {
        label:"NATIONALITY",
        textAlign:"text-start pl-[50px]"
    },
    {
        label:"IDENTITY ID",
        textAlign:"text-end"
    },
    {
        label:"ADDRESS",
        textAlign:"text-start pl-[50px]"
    },
    {
        label:"ACTIONS",
        textAlign:""
    }
  ],[])

  if(error) return <div>Error fetching data</div>

  const handleDelete = async(id:string , oldImg:string) =>{
    setPending(true)
    await deleteEmployee(id,oldImg)
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

  const handdleClick = (name:string ,newString:string) =>{
    setVal({
      ...val , [name]:newString
    })
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const {name , value} = e.target
    setVal({
      ...val , [name]:value
    })
    if(name === 'filter1' && value !== ""){
        setFocus(prev=>({
          ...prev,
          check:true
        }))
    }else{
      fetchDatas('')
    }
    if(name === 'filter3' && value !== ''){
      setFocus(prev=>({
        ...prev,
        check1:true
      }))
    }else{
      fetchDatas1('')
    }
  }

  const handleSelectChange = (e:React.ChangeEvent<HTMLSelectElement>) =>{
    setVal({
      ...val , filter2:e.target.value
    })
  }
  const placeholderClass = `${isOpen || isHover ? "py-[1px]" : "py-[1px]"} text-center lg:text-[9px] xl:text-[13px] border-b-[1px] py-[5px]`

  const classes = "bg-thead-primary text-white xl:w-[30px] lg:w-[25px] xl:h-[30px] lg:h-[20px] lg:rounded-sm xl:rounded-md mx-1 xl:text-[16px] lg:text-[10px]"

  if(role !== 'ADMIN' && empCheck !== true){
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
                name='filter1'
                value={val.filter1}
                onClick={handlesClick}
                onChange={handleChange}
                onKeyDown={(event)=>handleKeyDown(event , "filter1")}
                onFocus={()=>setFocus(prev=>({
                  ...prev,
                  check:true
                }))}
                autoComplete='off'
                onBlur={()=>setTimeout(() => {
                  setFocus(prev=>({
                    ...prev,
                    check:false
                  }))
                }, 150)}
                placeholder='All'
                />
                <label  className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                    EMLOYEE NAME
                  </label>
                </div>
                <div className='w-[200px] relative'>
                    {
                        focus.check === true && (
                          <ul ref={ulRef} className='absolute rounded-md border-[1px] shadow-md bg-white px-2  py-1 w-full mt-2 max-h-[100px] overflow-auto'>
                            {test.map((item)=>{
                              return(
                                <li data-id={item.id} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`} key={item.id} onClick={()=>{
                                  handdleClick('filter1' , item.empName)
                                }}>
                                  {item.empName}
                                </li>
                              )
                            })}
                          </ul>
                        )
                    }
                </div>
            </div>
            <div>
                <div className=" relative xl:p-1 border-[1px] border-input-primary rounded-md w-[200px]">
                <select value={val.filter2} name='filter2' onChange={handleSelectChange} className={`block px-2 py-1 w-full lg:text-[12px] xl:text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : `${val.filter2 === "" ? 'text-input-primary' : ''}`}`} >
                                        <option value="">All</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                  <label  className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                      GENDER
                  </label>
                </div>
            </div>
            <div>
                <div className="p-1 relative border-[1px] border-input-primary rounded-md w-[200px]">
                <input 
                type="text" 
                className={`block px-2 py-1 w-full lg:text-[12px] xl:text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`} 
                name='filter3'
                value={val.filter3}
                autoComplete='off'
                onClick={handlesClick}
                onChange={handleChange}
                onKeyDown={(event)=>handleKeyDown(event,'filter3')}
                onFocus={()=>setFocus(prev=>({
                  ...prev,
                  check1:true
                }))}
                onBlur={()=>setTimeout(() => {
                  setFocus(prev=>({
                    ...prev,
                    check1:false
                  }))
                }, 150)}
                placeholder='All'
                />
                <label  className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                    OCCUPATION
                  </label>
                </div>
                <div className='w-[200px] relative'>
                    {
                        focus.check1 === true && (
                          <ul ref={ulRef} className='absolute rounded-md border-[1px] shadow-md bg-white px-2  py-1 w-full mt-2 max-h-[100px] overflow-auto'>
                            {test1.map((item)=>{
                              return(
                                <li data-id={item.id} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`} key={item.id} onClick={()=>{
                                  handdleClick('filter3' , item.empOcc)
                                }}>
                                  {item.empOcc}
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
                  thead?.map((item,i)=>{
                    return(
                      <th key={item.label} className={`${item.textAlign} ${i === 0 ? 'rounded-tl-md' : ''} ${i === 8 ? 'rounded-tr-md' : ''} xl:text-[16px] lg:text-[10px] xl:leading-7 pt-[3px] text-white bg-thead-primary text-[15px]`}>{item.label}</th>
                    )
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
                filteredUser?.map((item,i)=>{
                  return(
                  <tr key={item.id} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px] hover:bg-[#F9FAFB]`}>
                    <td className={placeholderClass}>{(page - 1 ) * take + i + 1}</td>
                    <td className={`${placeholderClass} text-start pl-[50px]`}>{item.empName}</td>
                    <td className={`${placeholderClass} text-start`}>{item.empGender}</td>
                    <td className={`${placeholderClass} text-start`}>{item.empOcc}</td>
                    <td className={`${placeholderClass} text-end`}>{item.empPhone}</td>
                    <td className={`${placeholderClass} text-start pl-[50px]`}>{item.empNational}</td>
                    <td className={`${placeholderClass} text-end`}>{item.empId}</td>
                    <td className={`${placeholderClass} text-start pl-[50px]`}>{item.empAddr}</td>
                    <td className={placeholderClass}>
                        <div className='flex justify-center items-center gap-1'>
                        <button className={`${darkMode ? "text-[#5a5a5a]" : "text-mainLightBlue" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                          if(item.empCard !== null){
                            openModal('viewimage')
                            setDisplay(item.empCard)
                          }else{
                            toast.warning('oops seem like there is no image here')
                          }
                        }}>
                          <IoEyeOutline/>
                        </button>
                        <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                          openModal('my_modal_5')
                          onEdit()
                          setPassingId(item.id)
                        }}>
                           <PiPencilSimpleLineLight/>
                        </button>
                        <button className={`${darkMode ? "text-red-400 " : "text-red-700" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                          openModal('employee')
                          setPassing(item.id)
                          setDisplay(item.empCard)
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
                  for(let i = take; i > filteredUser.length; i--){
                    row.push(
                    <tr key={crypto.randomUUID()} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px] `}>
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
        <Modal typeSelect='caution' id='employee' handlingAction={()=>handleDelete(passing , display)} CautionText={'Deletion'}/>
        <Modal id='viewimage' title='View Images' showCancel={true}>
          <div className='w-full'>
            {
              display && (
                <Image src={display} alt='#' width={0} height={0} sizes='100vw' className='w-[auto] h-[300px] m-[20px]' onClick={()=>{
                  setPopup(true)
                  closeModal('viewimage')
                  setForpopup(display)
                }}/>
              )
            }
          </div>
        </Modal>
        {
          popup && (
            <div className='fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0_,0_,0_,.7)] z-[1000]'>
              <div className='fixed top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4  z-[1000] bg-white p-[20px] rounded-lg'>
              <div className='flex justify-between border-b border-slate-300 pb-[10px]'>
                <h1>Preview</h1>
                <button onClick={()=>setPopup(false)} className='bg-red-400 w-[26px] h-[26px] items-center justify-center rounded-md text-white font-bold'><span className="inline-block align-middle">X</span></button>
              </div>
                {
                  forPopup && (
                    <TransformWrapper>
                      <TransformComponent>
                        <ResponsiveElement width={'auto'} height={800}>
                        <Image 
                          alt='#'
                          width={0}
                          height={0}
                          sizes="100vw"
                          src={forPopup}
                        />
                        </ResponsiveElement>
                      </TransformComponent>
                    </TransformWrapper>
                  )
                }
              </div>
            </div>
          )
        }
    </div>
  )
}

export default EmpTable
