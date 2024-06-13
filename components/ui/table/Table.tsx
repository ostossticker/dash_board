"use client"
import useToggle from '@/hooks/stores';
import React from 'react'
import { MdOutlineArrowDropDown } from "react-icons/md";

type tableProps = {
  children?:React.ReactNode;
}

const Table = ({children}:tableProps) => {
  const { isOpen , isHover ,darkMode} = useToggle()
  const thead = [
    {
      label:"NO" ,
      textAlign:""   
    },
    {
      label:"NAME",
      textAlign:""
    },
    {
      label:"DATE",
      textAlign:""
    },
    {
      label:"INV-NO",
      textAlign:""
    },
    {
      label:"BUSINESS",
      textAlign:""
    },
    {
      label: "PRICE",
      textAlign:""
    },
  ]

  const placeholderData = [
    {
      name:"Renko",
      date:"8/4/2003",
      invNo:"Inv-001",
      bus:"ktv",
      usd:300.00
    }
  ]

  const placeholderClass = `${isOpen || isHover ? "py-[13px]" : "py-[15px]"} text-center border-b-[1px]`

  const classes = "bg-[#f79f5f] text-white w-[30px] h-[30px] rounded-md mx-1"

  return (
    <div className={`${darkMode ? "bg-dark-box-color" : "bg-white"} mt-[20px] shadow-md rounded-lg px-[30px] ${isOpen || isHover ? "py-[8px]" : "py-[10px]"}`}>
        {
          children
        }
        <table className='w-full mt-[14px]'>
            <thead>
              <tr>
                {
                  thead?.map((item)=>{
                    return(
                      <th key={item.label} className={`${item.textAlign} text-white bg-[#f79f5f]`}>{item.label}</th>
                    )
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
                placeholderData?.map((item,i)=>{
                  return(
                  <tr key={item.name} className={darkMode ? "bg-dark-box-color text-dark-lg-color" : "bg-white"}>
                    <td className={placeholderClass}>{i + 1}</td>
                    <td className={placeholderClass}>{item.name}</td>
                    <td className={placeholderClass}>{item.date}</td>
                    <td className={placeholderClass}>{item.invNo}</td>
                    <td className={placeholderClass}>{item.bus}</td>
                    <td className={placeholderClass}>{item.usd}</td>
                  </tr>
                  )
                })
              }
              {
                (()=>{
                  let row = []
                  for(let i = 6; i > placeholderData.length; i--){
                    row.push(
                      <tr key={i * Date.now()}>
                        <td className={`${placeholderClass} invisible`}>-</td>
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
        <div className='flex justify-between pb-[14px]'>
        <div className='flex px-[5px] rounded-md items-center mt-[16px] bg-[#f79f5f] h-[30px] text-white'>
                <p>row:5</p><MdOutlineArrowDropDown/>
            </div>
          <div className='flex mt-[16px]'>
            <button className={classes}>{"<"}</button>
            <button className={classes}>1</button>
            <button className={classes}>2</button>
            <button className={classes}>3</button>
            <button className={classes}>{">"}</button>
          </div>
          
        </div>
        {/****************** */}
    </div>
  )
}

export default Table