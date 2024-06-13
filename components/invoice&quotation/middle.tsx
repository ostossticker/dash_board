"use client"
import useToggle from '@/hooks/stores';
import React from 'react'

type middleProps = {
  children:React.ReactNode;
  classname?:string;
  middleTitle:string
}

const Middle = ({middleTitle,children, classname, ...props}:middleProps) => {
  const {darkMode , print} = useToggle()
  return (
    <div {...props} className={`${darkMode? "bg-dark-box-color" : "bg-[#ffffff] "}
    rounded-lg  shadow-md mt-[20px]
    ${classname} ${print === true ? "!hidden" : ""}`}>
      <div className='pt-4 px-[20px] text-thead-primary rounded-t-lg text-[20px] font-semibold'>
      {middleTitle}
      </div>
      <div className='p-6'>
      {children}
      </div>
    </div>
  )
}

export default Middle