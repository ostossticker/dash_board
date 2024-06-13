"use client"
import useToggle from '@/hooks/stores';
import { areSimilarWithTolerance } from '@/lib/functions';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { GoSearch } from 'react-icons/go';
import { IoIosArrowForward } from "react-icons/io";

const SearchInput = () => {
  const router = useRouter()
  const [expanded , setExpanded] = useState(false);
  const [filteredData , setFilteredData] = useState<{name:string ; route:string;}[]>([])
  const [searchTerm , setSearchTerm] = useState<string>('')
  const {darkMode} = useToggle()

  const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const routes = [
    {
      name:"dashboard",
      route:"/dashboard"
    },
    {
      name:"invoice table",
      route:"/invoice/table"
    },
    {
      name:"invoice create",
      route:"/invoice/created"
    },
    {
      name:"quotation table",
      route:"/quotation/table"
    },
    {
      name:"quotation create",
      route:"/quotation/created"
    },
    {
      name:"receipt table",
      route:"/receipt/table"
    },
    {
      name:"receipt create",
      route:"/receipt/create"
    },
    {
      name:"business table",
      route:"/bussiness/table"
    },
    {
      name:"employee table",
      route:"/employee/table"
    },
    {
      name:"customer table",
      route:"/customer/table"
    },
    {
      name:"product table",
      route:"/product/table"
    },
    {
      name:"purchase table",
      route:"/purchase/table"
    },
    {
      name:"payment table",
      route:"/payment/table"
    },
    {
      name:"recycle table",
      route:"/recycle/table"
    },
    {
      name:"admin table",
      route:"/admin"
    }
  ]

  useEffect(()=>{
    if(searchTerm.trim() === ''){
      setFilteredData(routes)
      return
    }
    const exactMatch = routes.find(item => item.name === searchTerm.trim());
    if(exactMatch){
      setFilteredData([exactMatch])
      return
    }
    const filtered = routes.filter(item => 
      areSimilarWithTolerance(item.name, searchTerm.trim())
    )
    setFilteredData(filtered)
  },[searchTerm])

  return (
    <>
    <div>
    <div className={`relative transition-width mx-[6px] ease-in-out bg-[#f2f3f8] duration-300 border-[1px]  rounded-full ${expanded ? 'w-auto' : '0'} overflow-hidden flex`}>
          <button
            onClick={handleToggleExpand}
            className="p-2"
          >
            <GoSearch className='text-insomnia-primary'/>
          </button>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleInputChange}
            className={` transition-width ease-in-out bg-[#f2f3f8] placeholder-[#b8bfd3] duration-300 outline-none ${expanded? "w-[300px] p-1 flex-grow " : "w-0"}`}
          />
          
        </div>
        {
        searchTerm !== "" && (
            <div className='z-[999] absolute top-[50px]'>
                <ul className={`${darkMode ? "bg-dark-lg-color" : "bg-gray-800"} p-[10px] rounded-lg`}>
                      {
                        filteredData.map((item,i)=>{
                          return(
                            <li key={i} onClick={()=>router.push(item.route)} className={`flex items-center gap-3 ${darkMode ? "text-dark-box-color" : "text-white"} cursor-pointer`}>
                              <p>{item.name}</p>
                              <IoIosArrowForward />
                            </li>
                          )
                        })
                      }
                </ul>
              </div>
          )
        }
    </div>
    </>
  )
}

export default SearchInput