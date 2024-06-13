"use client"
import useToggle from '@/hooks/stores';
import React, { useMemo, useState } from 'react'
import { RiArrowGoBackFill } from 'react-icons/ri';

type recTopProps = {
  val?:string;
  func?:(e: React.ChangeEvent<HTMLInputElement>) => void;
  val1?:string;
  func1?:(e: React.ChangeEvent<HTMLInputElement>) => void;
  fromdate?:string;
  funcFrom?:(e: React.ChangeEvent<HTMLInputElement>) => void;
  todate?:string;
  funcTo?:(e: React.ChangeEvent<HTMLInputElement>) => void;
  onclick?:()=>void;
  setBus:React.Dispatch<React.SetStateAction<string>>;
  suggesting:Option[];
  
}

type Option ={
    id:string;
    recBus:string;
}


const RecTop = ({val ,suggesting, func,val1,func1,fromdate,funcFrom, setBus ,todate,funcTo,onclick}:recTopProps) => {
    const {darkMode} = useToggle()
    const [focus , setFocus] = useState<number | null>(null)

    const inputsFilter = useMemo(()=>[
        {
            label:"FILTER",
            placeholder:"Search...",
            type:"text",
            typeSelect:"",
            val:val,
            func:func
        },
        {
            label:"BUSINESS",
            placeholder:"Business",
            type:"drop",
            typeSelect:"business",
            val:val1,
            func:func1
        },
       
  ],[val,func, val1,func1 ])

  const handleClick = (option:Option) =>{
    setBus(option.recBus || "")
}

const handleBlur = () =>{
    setFocus(null)
  }
  const handleFocus = (index:number) =>{
    setFocus(index)
  }

  return (
    <div className='flex py-3 justify-between '>
        <div className='flex gap-3'>
        {
          inputsFilter.map((item,index)=>{
            return (
                <div key={item.placeholder}>
                        <div className=" relative border-[1px] border-insomnia-primary rounded-md w-[200px]">
                            <input
                                 type="text" 
                                 name="username" 
                                 placeholder=" " 
                                 className={`block pl-2 p-1 w-full text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`} 
                                value={item.val}
                                onChange={item.func}
                                onFocus={()=>handleFocus(index)}
                            />
                            <label  className={`absolute top-0 text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-insomnia-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                                {item.label}
                            </label>
                        </div>
                        <div className='w-[200px] relative'>
                            {
                                item.type === 'drop' && focus === index && (
                                    <>
                                    {
                                        item.val && suggesting.length > 0 && (
                                            <ul className='absolute rounded-md border-[1px] shadow-md bg-white pl-2  py-1 w-full mt-2'>
                                                {
                                                    suggesting.map((op)=>{
                                                        return(
                                                            <li key={op.id} className='cursor-pointer' onClick={()=>{
                                                                handleBlur()
                                                            item.typeSelect === "business" &&  handleClick(op)
                                                            }}>
                                                                {item.typeSelect === "business" && op.recBus }
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        )
                                    }
                                    </>
                                )
                            }
                        </div>
                </div>
                
            )
          })
        }
         <div className='flex justify-center py-1 items-center h-9 border border-insomnia-primary rounded-[7px] px-1'>
                <div className='relative'>
                    <input type="date" className={`w-[150px] px-2 py-1 text-md block appearance-none  bg-transparent ${darkMode ? "text-white dark" : "light"}`} value={fromdate} onChange={funcFrom}/>
                    <label  className={`absolute top-0 text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-insomnia-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                                From Date
                            </label>
                </div>
                
                <button className=' h-full mx-1 rounded w-[30px] text-sm flex justify-center items-center text-insomnia-primary'>To</button>
                
                <div className='relative'>
                    <input type="date" className={`w-[150px] px-2 py-1 text-md block appearance-none bg-transparent ${darkMode ? "text-white dark" : "light"}`} value={todate} onChange={funcTo}/>
                    <label  className={`absolute top-0 text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-insomnia-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                                To Date
                            </label>
                </div>
            </div>
        </div>
        
        <div className='flex justify-center py-1 items-center h-[35px] border border-blue-gray-200 rounded-[7px]'>
            <button className='bg-insomnia-primary h-full mx-1 rounded w-[26px] flex justify-center items-center' onClick={onclick}>
                <RiArrowGoBackFill color='white'/>
            </button>
        </div>
    </div>
  )
}

export default RecTop