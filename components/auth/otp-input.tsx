"use client"
import React, { useEffect, useRef, useState } from 'react'

type otpIndexProps = {
    otp:string[];
    setOtp:React.Dispatch<React.SetStateAction<string[]>>;
}

let currentOTPIndex:number = 0
const OtpInput = ({otp , setOtp} :otpIndexProps) => {
  const [activeOTPIndex , setActiveOTPIndex] = useState<number>(0)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = ({target}:React.ChangeEvent<HTMLInputElement>) =>{
    const { value } =target
    const newOTP: string[] = [...otp];
    newOTP[currentOTPIndex] = value.substring(value.length -1)

    setActiveOTPIndex(currentOTPIndex+ 1)

    if(!value) setActiveOTPIndex(currentOTPIndex -1)
    else setActiveOTPIndex(currentOTPIndex + 1)

    setOtp(newOTP)
  }

  const handleKeyDown = ({key}:React.KeyboardEvent<HTMLInputElement>,index:number)=>{
    currentOTPIndex = index
    if(key === "Backspace") setActiveOTPIndex(currentOTPIndex -1)

  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData('text');
    if (pasteData.length === otp.length) {
      const newOTP: string[] = pasteData.split('');
      setOtp(newOTP);
    }
    
  };

  useEffect(()=>{
    inputRef.current?.focus();
  },[activeOTPIndex])

  return (
    <div className=' flex justify-center items-center space-x-2 mt-1'>
        {otp.map((_,index)=>{
            return(
                <React.Fragment key={index}>
                    <input type="number" 
                        ref={index === activeOTPIndex ? inputRef : null}
                        className='w-[2.05rem] h-[2.05rem] border-2 rounded bg-transparent 
                        outline-none text-center font-semibold text-lg spin-button-none
                         border-gray-400 
                        focus:border-gray-700 focus:text-gray-700
                         text-gray-400 transition'
                         onChange={handleChange}
                         onKeyDown={(e)=>handleKeyDown(e,index)}
                         onPaste={handlePaste}
                         value={otp[index]}
                    />
                    {index === otp.length - 1 ? null: (
                        <span className='w-1 py-0.5 bg-gray-400 '/>
                    )}
                </React.Fragment>
            )
        })}
    </div>
  )
}

export default OtpInput