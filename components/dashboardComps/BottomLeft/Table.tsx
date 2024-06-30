"use client"
import useToggle from '@/hooks/stores';
import { useCurrentUser } from '@/hooks/use-current-user';
import { convertTime, dateFormat, fetchData } from '@/lib/functions';
import { url } from '@/lib/url';
import React, { useEffect, useState } from 'react'
import { MdOutlineArrowDropDown } from "react-icons/md";
import useSWR, { mutate } from 'swr';

type recentlyPropsf = {
  id:string;
  user:string;
  cust:string;
  updatedAt:string
  paperNo:string;
  action:string;
}

const Table = () => {
  const { isOpen , isHover ,darkMode} = useToggle()
  const user = useCurrentUser()
  const[page , setPage] = useState(1);
  const [filterDate , setFilterdate] = useState<string>('')
  const [currentPage , setCurrentPage] = useState(1);
  const [take , setTake] = useState<number>(6)

  const {data , error} = useSWR(`${url}/api/recently?email=${user.id}&page=${page}&pageSize=${take}&filterDate=${filterDate}`,fetchData)

  const recently:recentlyPropsf[] = data?.recently || []
  const totalPages:number = data?.pagination.totalPages || 0

  const loadPage = (newPage:number) =>{
    setPage(newPage)
    setCurrentPage(newPage)
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

useEffect(()=>{
  if(!filterDate){
      setPage(currentPage)
      mutate(`${url}/api/recently?email=${user.id}&page=${currentPage}&filterDate=${filterDate}`)
  }
  if(filterDate !== '' ){
      mutate(`${url}/api/recently?email=${user.id}&page=1&pageSize=${take}&filterDate=${filterDate}`)
  }
},[take , currentPage , user , filterDate])

  const thead = [
    {
      label:"NO" ,
      textAlign:"lg:pl-[10px] xl:pl-[0px]"   
    },
    {
      label:"USER",
      textAlign:"text-start lg:pl-[10px] xl:pl-[30px]"
    },
    {
      label:"CUSTOMER",
      textAlign:"text-start lg:pl-[10px] xl:pl-[30px]"
    },
    {
      label:"DATE",
      textAlign:"text-end pr-[120px] lg:pl-[10px] xl:pl-[30px]"
    },
    {
      label:"NO#",
      textAlign:"text-start pr-[50px]"
    },
    {
      label: "ACTION",
      textAlign:"text-end lg:pr-[20px] xl:pr-[80px]"
    },
  ]
  if(error) return <div>Error fetching data</div>

  const placeholderClass = `${isOpen || isHover ? "xl:py-[13px] lg:py-[6px]" : "xl:py-[15px] lg:py-[8px]"} text-center text-[13px] border-b-[1px]`

  const classes = "bg-thead-primary text-white xl:w-[30px] lg:w-[25px] xl:h-[30px] lg:h-[20px] lg:rounded-sm xl:rounded-md mx-1 xl:text-[16px] lg:text-[10px]"

  return (
    <div className={`${darkMode ? "bg-dark-box-color" : "bg-white"} xl:mt-[40px] lg:mt-[16px] lg: col-span-3 shadow-md rounded-lg xl:px-[30px] lg:px-[15px] ${isOpen || isHover ? "xl:pb-[8px] lg:pb-[2px]" : "xl:pb-[10px] lg:pb-[3px]"}`}>
        <div className={`flex items-center ${isOpen || isHover ? "xl:pt-[28px] lg:pt-[13px] xl:pb-[13px] lg:pb-[8px]" : "xl:pt-[30px] lg:pt-[15px] xl:pb-[15px] lg:pb-[7px]"} justify-between`}>
          <h1 className={`${isOpen || isHover ? "xl:text-[23px] lg:text-[13px]" : "xl:text-[25px] lg:text-[16px]"} ${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"}`}>Recently Activity</h1>
          <div className='flex items-center'>
                <select className={`${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"} text-end outline-none bg-transparent xl:text-[18px] lg:text-[13px]`} value={filterDate} onChange={(e)=>setFilterdate(e.target.value)}>
                  <option className='text-black' value="">all</option>
                  <option className='text-black'>today</option>
                  <option className='text-black'>yesterday</option>
                  </select><MdOutlineArrowDropDown color={`${darkMode ? "white" : "black"}`}/>
            </div>
        </div>

        <table className='w-full'>
            <thead>
              <tr>
                {
                  thead?.map((item,i)=>{
                    return(
                      <th key={item.label} className={`${item.textAlign} ${i === 0 ? 'rounded-tl-md' : ''} ${i === 5 ? 'rounded-tr-md' : ''} text-white bg-thead-primary xl:text-[16px] lg:text-[10px] xl:leading-7 pt-[3px] `}>{item.label}</th>
                    )
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
                recently?.map((item,i)=>{
                  return(
                    <tr key={item.id} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] hover:bg-[#F9FAFB]`}>
                    <td className={`${placeholderClass} lg:text-[9px] xl:text-[15px] lg:pl-[10px] xl:pl-[0px]`}>{(page - 1) * take + i + 1}</td>
                    <td className={`${placeholderClass} text-start lg:pl-[10px] xl:pl-[30px] lg:text-[9px] xl:text-[15px] `}>{item.user}</td>
                    <td className={`${placeholderClass} text-start lg:text-[9px] xl:text-[15px] lg:pl-[10px] xl:pl-[30px]`}>{item.cust}</td>
                    <td className={`${placeholderClass} pr-[120px] lg:text-[9px] xl:text-[15px] lg:pl-[10px] xl:pl-[30px]`}><div className='flex justify-end items-center '>
                    <div className='pr-[5px]'>{!item.updatedAt ? '' : dateFormat(item.updatedAt)}</div>
                    <div>{item.updatedAt ? convertTime(item.updatedAt) : ''}</div>
                    </div></td>
                    <td className={`${placeholderClass} text-start pr-[50px] lg:text-[9px] xl:text-[15px]`}>{item.paperNo}</td>
                    <td className={`${placeholderClass} text-end lg:pr-[20px] xl:pr-[80px] lg:text-[9px] xl:text-[15px]`}>{item.action}</td>
                  </tr>
                  )
                })
              }
              {
                (()=>{
                  let row = []
                  for(let i = take; i > recently.length; i--){
                    row.push(
                      <tr key={i * Date.now()} className={`${darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"} xl:text-[16px] lg:text-[11px]`}>
                        <td className={`${placeholderClass} invisible xl:text-[16px] lg:text-[11px]`}>-</td>
                        <td className={placeholderClass}></td>
                        <td className={placeholderClass}></td>
                        <td className={placeholderClass}></td>
                        <td className={placeholderClass}></td>
                        <td className={placeholderClass}></td>
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
                <option value="15" className='text-black'>5</option>
                <option value="20" className='text-black'>15</option>
                <option value="30" className='text-black'>20</option>
                <option value="40" className='text-black'>25</option>
                <option value="50" className='text-black'>30</option>
                <option value="100" className='text-black'>35</option>
            </select><MdOutlineArrowDropDown/>
              </div>
            <div className='flex mt-[16px] '>
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
    </div>
  )
}

export default Table