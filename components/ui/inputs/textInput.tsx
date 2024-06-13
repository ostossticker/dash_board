"use client"
import React, { useState } from 'react'

type textInputProps = {
  setVal:React.Dispatch<React.SetStateAction<string>>;
  val:string;
}

const TextInput = ({val , setVal}:textInputProps) => {
  return (
    <div className="relative">
        <input type="text" id="username" value={val} onChange={(e)=>setVal(e.target.value)} className="border-b py-1 focus:outline-none focus:border-insomnia-primary focus:border-b-2 transition-colors peer" />
        <label htmlFor="username" className={
          `absolute 
          left-0 
          top-1 
          text-gray-600 
          cursor-text 
          peer-focus:text-xs 
          peer-focus:-top-4 
          peer-focus:text-insomnia-primary
          transition-all 
          ${val !== "" ? "text-xs top-[-1rem] text-insomnia-primary" : " "}`
        }>Username</label>
    </div>
  )
}

export default TextInput