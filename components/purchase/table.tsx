"use client"
import { deletePurchase } from '@/app/(protected)/purchase/actions/purchase';
import useToggle from '@/hooks/stores';
import { useCurrentUser } from '@/hooks/use-current-user';
import { areAnagrams, closeModal, dateFormat, fetchData, openModal } from '@/lib/functions';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { PiTrashLight , PiPencilSimpleLineLight } from "react-icons/pi";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import useSWR, { mutate } from 'swr';
import Modal from '../ui/modal/modal';
import axios from 'axios';
import { url } from '@/lib/url';
import { useRouter } from 'next/navigation';
import { useCurrentRole } from '@/hooks/use-current-role';
import { usePurchase } from '@/hooks/usedatas';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from 'next/image';
import ResponsiveElement from '../invoice&quotation/ResComp';

type purProps = {
  id:string;
  purInvN:string;
  purSupp:string;
  purName:string;
  purDes:string;
  purBus:string;
  purSince:string;
  purPrice:string;
  image1:string;
  image2:string;
}

type Option ={
  id:string;
  busName:string;
}

type displayProps = {
  img1:string;
  img2:string;
}

const PurTable = () => {
  const { isOpen , isHover ,darkMode , pending,setPending,onEdit,setPassingId} = useToggle()
  const user = useCurrentUser()
  const router = useRouter()
  const role = useCurrentRole()
  const purCheck = usePurchase()
  const[page , setPage] = useState(1);
  const [currentPage , setCurrentPage] = useState(1);
  const [popup , setPopup] = useState<boolean>(false)
  const [focus , setFocus] = useState<number | null>(0)
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [take , setTake] = useState<number>(15)
  const [forPopup , setForpopup] = useState<string>('')
  const [test , setTest] = useState<Option[]>([])
  const [passing , setPassing] = useState<string>('')
  const [display , setDisplay] = useState<displayProps>({
    img1:'',
    img2:''
  })
  const [val , setVal] = useState({
    filter:'',
    filter1:'',
    fromDate:'',
    toDate:''
  })
  const anagramFilter:string =''
  const {data , error} = useSWR(`${url}/api/purchasetable?email=${user.id}&name=${user.name}&page=${page}&take=${take}&filter=${val.filter}&filter1=${val.filter1}&fromDate=${val.fromDate}&toDate=${val.toDate}`,fetchData)
  const ulRef = useRef<HTMLUListElement>(null);
  const purs:purProps[] = data?.purchase || []
  const totalPages: number = data?.pagination.totalPages || 0;
  const totalPurcahse:number = data?.totalFilter._sum.purPrice || 0

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

  useEffect(()=>{
    if(!val.filter || !val.filter1){
      setPage(currentPage)
      mutate(`${url}/api/purchasetable?email=${user.id}&name=${user.name}&page=${currentPage}&take=${take}&filter=${val.filter}&filter1=${val.filter1}&fromDate=${val.fromDate}&toDate=${val.toDate}`)
    }
    if(val.filter !== '' || val.filter1 !== ''){
      setPage(1)
      mutate(`${url}/api/purchasetable?email=${user.id}&name=${user.name}&page=1&take=${take}&filter=${val.filter}&filter1=${val.filter1}&fromDate=${val.fromDate}&toDate=${val.toDate}`)
    }
    
    if(val.filter1 !== ""){
      fetchDatas(val.filter1)
    }
  },[val, take , currentPage,user,pending])

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
  ? purs.filter(pur => areAnagrams(pur.purName, anagramFilter))
  : purs;

  const thead = useMemo(()=>[
    {
      label:"NO." ,
      textAlign:""   
    },
    {
      label:"INVOICE#",
      textAlign:"text-start pl-[50px]"
    },
    {
      label:"SUPPLIER",
      textAlign:"text-start"
    },
    {
      label:"ITEM",
      textAlign:"text-start"
    },
    {
      label:"DESCRIPTION",
      textAlign:"text-start"
    },
    {
        label:"BUSINESS",
        textAlign:"text-start"
    },
    {
        label:"PURCHASE DATE",
        textAlign:"text-end"
    },
    {
        label:"UNIT PRICE",
        textAlign:"text-end"
    },
    {
        label:"ACTIONS",
        textAlign:""
    }
  ],[])

  if(error) return <div>Error fetching data</div>

  const handleDelete = async (id:string , oldImg:string , oldImg1:string) =>{
    
    setPending(true)
    await deletePurchase(id , oldImg , oldImg1)
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
    if(name === 'filter1' && value !== ""){
      setFocus(1)
    }else{
      fetchDatas('')
    }
  }

  const handlesClick = () =>{
    fetchDatas('')
  }

  const handsClick =(name:string , newString:string) =>{
    setVal({
      ...val , [name]:newString
    })
  }
  const placeholderClass = `${isOpen || isHover ? "py-[1px]" : "py-[1px]"} text-center lg:text-[9px] xl:text-[13px] border-b-[1px] py-[5px]`

  const classes = "bg-thead-primary text-white xl:w-[30px] lg:w-[25px] xl:h-[30px] lg:h-[20px] lg:rounded-sm xl:rounded-md mx-1 xl:text-[16px] lg:text-[10px]"

  if(role !== 'ADMIN' && purCheck !== true){
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
              <div className=" relative border-[1px] xl:p-1 border-input-primary rounded-md w-[200px]">
                <input 
                type="text" 
                className={`block px-2 py-1 w-full lg:text-[12px] xl:text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`} 
                name='filter'
                value={val.filter}
                onChange={handleChange}
                autoComplete='off'
                placeholder='Search'
                />
                <label  className={`absolute top-0 lg:text-[15px] xl:text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                    FILTER
                  </label>
              </div>
            </div>
            <div>
            <div className=" relative xl:p-1 border-[1px] border-input-primary rounded-md w-[200px]">
                <input 
                type="text" 
                className={`block px-2 py-1 w-full lg:text-[12px] xl:text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`} 
                name='filter1'
                value={val.filter1}
                onClick={handlesClick}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={()=>setFocus(1)}
                autoComplete='off'
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
                                  handsClick('filter1' , item.busName)
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
                      <th key={item.label} className={`${item.textAlign} ${i === 0 ? 'rounded-tl-md' : ''} ${i === 8 ? 'rounded-tr-md' : ''} xl:text-[16px] lg:text-[10px] xl:leading-7 pt-[3px] text-white bg-thead-primary text-[15px]`}>{item.label}</th>
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
                    <td className={`${placeholderClass} text-start pl-[50px]`}>{item.purInvN}</td>
                    <td className={`${placeholderClass} text-start`}>{item.purSupp}</td>
                    <td className={`${placeholderClass} text-start`}>{item.purName}</td>
                    <td className={`${placeholderClass} text-start`}>{item.purDes}</td>
                    <td className={`${placeholderClass} text-start`}>{item.purBus}</td>
                    <td className={`${placeholderClass} text-end`}>{dateFormat(item.purSince)}</td>
                    <td className={`${placeholderClass} text-end`}>${parseFloat(item.purPrice).toFixed(2)}
                    </td>    
                    <td className={placeholderClass}>
                        <div className='flex justify-center items-center gap-1'>
                        <button className={`${darkMode ? "text-[#5a5a5a]" : "text-mainLightBlue" } p-1 lg:text-[14px] xl:text-[20px]`} onClick={()=>{
                        if(item.image1 !== null || item.image2 !== null){
                          openModal('viewimage') , 
                          setDisplay(prev=>({
                          ...prev,
                          img1:item.image1,
                          img2:item.image2
                          }))
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
                          openModal('purchases')
                          setPassing(item.id)
                          setDisplay(prev=>({
                            ...prev,
                            img1:item.image1,
                            img2:item.image2
                            }))
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
                        <td className={placeholderClass}>
                        <div className='flex justify-end items-center gap-1 invisible'>
                        <button className={`${darkMode ? "text-thead-primary" : "text-thead-primary" } p-1 lg:text-[14px] xl:text-[20px]`}>
                           <PiPencilSimpleLineLight />
                        </button>
                        <button className={`${darkMode ? "text-red-400 " : "text-red-700" } p-1 lg:text-[14px] xl:text-[20px]`}>
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
      
        <Modal typeSelect='caution' id='purchases' handlingAction={()=>handleDelete(passing, display.img1 , display.img2)} CautionText={'Deletion'}/>
        <Modal id='viewimage' title='View Images' showCancel={true}>
          <div className='w-full flex'>
            {
              display.img1 && (
                <Image src={display.img1} alt='#' width={0} height={0} sizes='100vw' className='w-[auto] h-[300px] m-[20px]' onClick={()=>{setPopup(true) , closeModal('viewimage') , setForpopup(display.img1)}}/>
              )
            }
            {
              display.img2 && (
                <Image src={display.img2} alt='#' width={0} height={0} sizes='100vw' className='w-[auto] h-[300px] m-[20px]' onClick={()=>{
                  setPopup(true)
                  closeModal('viewimage')
                  setForpopup(display.img2)
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
    <div className='flex justify-end'>
            <div className={`bg-insomnia-primary mt-[15px] font-bold text-white px-5 xl:text-[20px] lg:text-[13px] py-[5px] xl:rounded-lg lg:rounded-md`}>
              TOTAL: ${totalPurcahse.toFixed(2)}
            </div>
        </div>
    </>
  )
}

export default PurTable
