"use client"
import useToggle from '@/hooks/stores';
import { dateFormat } from '@/lib/functions';
import Image from 'next/image';
import React, {  useEffect, useMemo, useState } from 'react'

type tableProps = {
    id:string;
    description?: string;
    sizeWidth?: number;
    sizeHeight?: number;
    quantity?: string;
    unitPrice?: string;
    m2?: number;
    total?: string;
}

type desProps = {
    id:string;
    text:string;
}

type meterProps = {
    busType?:string;
    items?:tableProps[];
    invNo?:string;
    cusName?:string;
    cusComp?:string;
    cusPhone?:string;
    cusEmail?:string;
    cusAddr?:string
    invDate?:string;
    grandTotal?:string;
    ////Toggle 
    toggleEmail?:boolean;
    toggleAddr?:boolean;
    toggleName?:boolean;
    toggleComp?:boolean;
    togglePhone?:boolean;
    ////des 
    des?:desProps[];
    ///logo
    busLogo?:string;
    sigLogo?:string;
    ////oldimg
    oldImg?:string;
    oldImg1?:string
    ////set image state
    img1?:string
    img2?:string
    ////busDes
    busDes?:string;
    //// ur infomation
    busAddr?:string;
    busEmail?:string;
    busTelegram?:string;
    busPhone?:string;
    busPayTerm?:string;
    /////staff info
    staffName:string;
    staffPhone:string;
}


const Qtprint = ({
    toggleAddr,
    toggleComp,
    toggleEmail,
    toggleName,
    togglePhone,
    busType,
    items,
    des,
    invNo,
    cusName,
    cusComp,
    cusPhone,
    cusEmail,
    cusAddr,
    invDate,
    grandTotal,
    busLogo,
    sigLogo,
    oldImg,
    oldImg1,
    img1,
    img2,
    busDes,
    /////
    busAddr,
    busEmail,
    busPayTerm,
    busPhone,
    busTelegram,
    ////
    staffName,
    staffPhone
}:meterProps) => {
    const {logo , address , signature , employee} = useToggle()
    const meters = useMemo(()=>[
        {
            label:"No.",
            class:"text-start pl-2"
        },
        {
            label:"Description",
            class:'text-start'
        },
        {
            label:"Size cm",
            class:'text-center border-l-[1px] border-black'
        },
        {
            label:"M2",
            class:"text-center border-l-[1px] border-black"
        },
        {
            label:"Qty",
            class:'text-center border-l-[1px] border-black'
        },
        {
            label:"Unit Price",
            class:'text-center border-l-[1px] border-black'
        },
        {
            label:"Total Amount",
            class:'text-center border-l-[1px] border-black'
        }
    ],[])

    const generals = useMemo(()=>[
        {
            label:"No.",
            class:"text-start pl-2"
        },
        {
            label:"Description",
            class:'text-start'
        },
        {
            label:"Qty",
            class:'text-center px-1 border-l-[1px] border-black'
        },
        {
            label:"Unit Price",
            class:'text-center border-l-[1px] border-black'
        },
        {
            label:"Total Amount",
            class:'text-center border-l-[1px] border-black'
        }
    ],[])
    
    const busInfo = useMemo(()=>[
        {
            label:"Name:",
            val:staffName,
            clss:`${employee === true || staffName === "" ? "!hidden" : ""}`
        },
        {
            label:"Tel:",
            val:staffPhone,
            clss:`${employee === true || staffPhone === "" ? "!hidden" : ""}`
        },
        {
            label:"Add:",
            val:busAddr,
            clss:`${address === true || busAddr === "" ? "!hidden" : ""}`
        },
        {
            label:"Email:",
            val:busEmail,
            clss:`${address === true || busEmail === "" ? "!hidden" : ""}`
        },
        {
            label:"Tel:",
            val:busPhone,
            clss:`${address === true || busPhone === "" ? "!hidden" : ""}`
        },
        {
            label:"Telegram",
            val:busTelegram,
            clss:`${address === true || busTelegram === "" ? "!hidden" : ""}`
        }
    ],[address , employee])
    const cusInfo = useMemo(()=>[
        {
            id:"formCus1",
            label:"At:",
            val:cusName,
            class:`${toggleName? "hidden" : ""}`
        },
        {
            id:"formCus2",
            label:"To:",
            val:cusComp,
            class:`${toggleComp ? "hidden" : ""}`
        },
        {
            id:"formCus3",
            label:"Tel:",
            val:cusPhone,
            class:`${togglePhone ? "hidden" : ""}`
        },
        {
            id:"formCus4",
            label:"Email:",
            val:cusEmail,
            class:`${toggleEmail ? "hidden" : ""}`
        },
        {
            id:"formCus5",
            label:"Add:",
            val:cusAddr,
            class:`${toggleAddr ? "hidden" : ""}`
        }
    ],[cusName, cusComp , cusPhone , cusEmail , cusAddr])
    const desTop = useMemo(()=>[
     {
        label:"No.",
        class:"text-start pl-2"
     },
     {
        label:"Description",
        class:'text-start pl-2'
     },
     
    ],[])
    const [arr , setArr] = useState<tableProps[]>([])
    useEffect(()=>{
        setArr(items || [])
    },[items])
    let test2 = cusInfo.reduce((a:number[], e ,i)=>(e.val !== "") ? a.concat(i) : a , [] )
    let test3 = busInfo.reduce((a:number[] , e ,i) => (e.val !== "") ? a.concat(i) : a ,[])
  return ( 
        <div className={`bg-white py-[20px] px-[30px] w-[546px] mx-auto my-auto`}>
            <div>
                    
                    <div className={`flex justify-between ${logo === true ? "mb-[41.8px]" : ""}`}>
                            <div className='flex justify-start items-center'>
                                   {
                                    logo === true ? (
                                        <h1 className='font-semibold text-[35px] leading-[10px] mb-[40px]'>Quotation</h1>
                                    ) : (
                                        <Image src={!busLogo ? '/white.png' : busLogo} 
                                        alt='#' 
                                        width={520} 
                                        height={520} 
                                        className={`Logo w-[auto] h-[70px]`}/>
                                    )
                                   }
                                {/*****************Image size w-160 h-160**************/}
                            </div>
                            <div className='text-end'>
                                    <textarea className={`text-end text-[10.5px] w-[300px] h-[90px] leading-[20.5px] overflow-hidden outline-none resize-none`} style={{fontFamily:"khmerContent"}}
                                    value={busDes}>
                                        
                                </textarea>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 py-[3px]  px-[5px]'>
                            <div className='col-span-1'>
                                {
                                    logo === false && (
                                        <h1 className='font-bold text-[27px]'>Quotation</h1>
                                    )
                                }
                                <p className='text-[12px] font-bold'>
                                No. {invNo}
                                </p>
                            </div>
                            <p className='text-[12px] text-end font-bold flex flex-col col-span-1 justify-end'>
                                Date. {dateFormat(invDate === undefined ? '' : invDate)}
                            </p>
                        </div>
                        <div className='grid grid-cols-2'>
                            <div className='col-span-1 flex flex-col justify-end'>
                            {(()=>{
                                    let row = []
                                    for(let i = 6; i > (test2?.length || 0); i--){
                                        row.push(
                                            <div key={crypto.randomUUID()} className={`flex pl-[5px] justify-start items-center invisible`} style={{fontFamily:"khmerContent"}}>
                                                    <p className='text-[9.6px]'>mp</p>
                                                    <p className='text-[9px]'>ddd</p>
                                            </div>
                                        )
                                    }
                                    return row
                                })()
                                }
                                {
                                    cusInfo.map((item)=>{
                                        return(
                                            <div key={item.id} className={`pl-[5px] ${item.class} ${!item.val ? "hidden" : "flex"} items-start gap-1 w-[200px]`} style={{fontFamily:"khmerContent"}}>
                                                <p className='text-[9.6px]'>{item.label}</p>
                                                <p className='text-[9px]'>{item.val}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='col-span-1 flex flex-col justify-end'>
                            <div>
                            {
                                    employee === true && (
                                            <>
                                            <div className={`invisible flex pl-[5px] justify-end`} style={{fontFamily:"khmerContent"}}>
                                                <p className='text-[9.6px]'>ddd</p>
                                                <p className='text-[9px]'>ddd</p>
                                            </div>
                                            <div className={`invisible flex pl-[5px] justify-end`} style={{fontFamily:"khmerContent"}}>
                                                <p className='text-[9.6px]'>ddd</p>
                                                <p className='text-[9px]'>ddd</p>
                                            </div>
                                            </>
                                    )
                                }
                                {
                                    address === true && (
                                        <>
                                            <div className={`invisible flex pl-[5px] justify-end`} style={{fontFamily:"khmerContent"}}>
                                                <p className='text-[9.6px]'>ddd</p>
                                                <p className='text-[9px]'>ddd</p>
                                            </div>
                                             <div className={`invisible flex pl-[5px] justify-end`} style={{fontFamily:"khmerContent"}}>
                                                <p className='text-[9.6px]'>ddd</p>
                                                <p className='text-[9px]'>ddd</p>
                                            </div>
                                             <div className={`invisible flex pl-[5px] justify-end`} style={{fontFamily:"khmerContent"}}>
                                                <p className='text-[9.6px]'>ddd</p>
                                                <p className='text-[9px]'>ddd</p>
                                            </div>
                                        </>
                                    )
                                }
                                {(()=>{
                                    let row = []
                                    for(let i = 5; i > (test3?.length || 0); i--){
                                        row.push(
                                            <div key={crypto.randomUUID()} className={`flex pl-[5px] justify-start items-center invisible`} style={{fontFamily:"khmerContent"}}>
                                                    <p className='text-[9.6px]'>mp</p>
                                                    <p className='text-[9px]'>ddd</p>
                                            </div>
                                        )
                                    }
                                    return row
                                })()
                                }
                                {
                                    busInfo.map((item)=>{
                                        return(
                                           <div className='flex justify-end'>
                                             <div key={item.label} className={`flex pl-[5px] justify-end w-[200px] ${item.clss} items-start gap-1 pt-[1px]`} style={{fontFamily:"khmerContent"}}>
                                                <p className='text-[9.6px]'>{item.label}</p>
                                                <p className='text-[9px] text-end'>{item.val}</p>
                                            </div>
                                           </div>
                                        )
                                    })
                                }
                            </div>
                            </div>
                        </div>
                        <table className={`w-full ${ !cusAddr ? "" : cusAddr.length > 44 ? "mt-[18px]" : "mt-[25px]"} border-[1px] border-black`}>
                        <thead>
                                <tr>
                                {
                                    desTop.map((item)=>{
                                        return(
                                            <th className={`bg-mainBlue text-white font-bold ${item.class} text-[10px] `} key={crypto.randomUUID()} >
                                                {item.label}
                                            </th>           
                                        )
                                    })
                                }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    des?.map((item,index)=>{
                                        return(
                                            <tr key={item.id}>
                                                <td className='text-[9px] text-start pl-3 py-[2px]'>
                                                {index + 1}
                                                </td>
                                                <td className='text-[9px] text-start py-[2px] w-full pl-[8px]'>
                                                {item.text}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                {
                                            (()=>{
                                                let row = []
                                                for(let i = 6; i > (des?.length || 0); i--){
                                                    row.push(
                                                        <tr key={i}>
                                                            <td className='text-[9px] py-[2px]'><div className='invisible'>No</div></td>
                                                            <td className='text-[9px] py-[2px]'></td>
                                                        </tr>
                                                    )
                                                }
                                                return row
                                            })()
                                        }
                            </tbody>
                        </table>







                        <table className='w-full mt-[5px]'>
                            <thead className='border-t-[1px] border-x-[1px] bg-blue-950 text-white border-black'>
                                <tr>
                                {
                                    busType === 'meter' && (
                                        <>
                                        {
                                            meters.map((item)=>{
                                                return(
                                                            <th key={item.label}  className={`bg-mainBlue text-white font-bold ${item.class} text-[10px]`}>{item.label} </th>
                                                )
                                            })
                                        }
                                        </>
                                    )
                                }                   
                                {
                                busType === 'general' && (
                                    <>
                                    {
                                            generals.map((item)=>{
                                                return(
                                                            <th key={item.label}  className={`bg-mainBlue text-white font-bold ${item.class} text-[9px]`}>{item.label} </th>
                                                )
                                            })
                                        }
                                        </>
                                    )
                                }                                                 
                                </tr>
                            </thead>
                            <tbody className='border-b-[1px] border-x-[1px] border-black'>
                                {
                                    busType === 'meter' && (
                                        <>
                                        {
                                            arr?.map((item,i)=>{
                                                return(
                                                    <tr 
                                                    key={item.id} >
                                                            <td className='text-[9px] text-start pl-3 py-[2px]'>
                                                                {i+1}
                                                            </td>
                                                            <td className='text-[9px] text-start py-[2px] w-[170px]'>
                                                                {!item.description ? "" : item.description.length < 44 ? item.description : <input className='outline-none' value={item.description}/>}
                                                            </td>
                                                            <td className='text-[9px] py-[2px] border-l-[1px] border-black'>
                                                                <div className='flex justify-center items-center'>
                                                                {item.sizeWidth === 0 ? "" : item.sizeWidth}
                                                                {item.sizeHeight && item.sizeWidth ? "x" : ""}
                                                                {item.sizeHeight === 0 ? "" : item.sizeHeight}
                                                              </div> 
                                                            </td>
                                                            <td className='text-[9px] text-center py-[2px] border-l-[1px] border-black'>
                                                                {item.m2 === 0 ? "" : item.m2}
                                                            </td>
                                                            <td className='text-[9px] text-center py-[2px] border-l-[1px] border-black'>{item.quantity !== '' ? item.quantity : ""}</td>
                                                            <td className='text-[9px] text-end py-[2px] border-l-[1px] border-black pr-1.5'>{item.unitPrice} </td>
                                                            <td className='text-[9px] text-end pr-3 py-[2px] border-l-[1px] border-black'>{item.total}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </>
                                    )
                                }
                                {
                                    busType === 'general' && (
                                        <>
                                        {
                                            arr?.map((item,i)=>{
                                                return(
                                                    <tr 
                                                    key={item.id} >
                                                            <td className='text-[9px] text-start pl-3 py-[2px]'>
                                                                {i+1}
                                                            </td>
                                                            <td className='text-[9px] text-start py-[2px] w-[260px]'>
                                                                {!item.description ? "" : item.description.length < 44 ? item.description : <input className='w-[200px] outline-none' value={item.description}/>}
                                                            </td>
                                                            <td className='text-[9px] text-center py-[2px] border-l-[1px] border-black'>{item.quantity === "" ? "" : item.quantity}</td>
                                                            <td className='text-[9px] text-end pr-2 py-[2px] border-l-[1px] border-black'>{item.unitPrice} </td>
                                                            <td className='text-[9px] text-end pr-2 py-[2px] border-l-[1px] border-black'>{item.total}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </>
                                    )
                                }

                                {
                                    busType === 'meter' && (
                                        <>
                                        {
                                            (()=>{
                                                let row = []
                                                for(let i = 6; i > (items?.length || 0); i--){
                                                    row.push(
                                                        <tr key={i}>
                                                            <td className='text-[9px] py-[2px]'><div className='invisible'>No</div></td>
                                                            <td className='text-[9px] py-[2px]'></td>
                                                            <td className='text-[9px] py-[2px] border-l-[1px] border-black'></td>
                                                            <td className='text-[9px] py-[2px] border-l-[1px] border-black'></td>
                                                            <td className='text-[9px] py-[2px] border-l-[1px] border-black'></td>
                                                            <td className='text-[9px] py-[2px] border-l-[1px] border-black'></td>
                                                            <td className='text-[9px] py-[2px] border-l-[1px] border-black'></td>
                                                        </tr>
                                                    )
                                                }
                                                return row
                                            })()
                                        }
                                        </>
                                    )
                                }
                                {
                                    busType === 'general' && (
                                        <>
                                        {
                                            (()=>{
                                                let row = []
                                                for(let i = 6; i > (items?.length || 0); i--){
                                                    row.push(
                                                        <tr key={i}>
                                                            <td className='text-[9px] py-[2px]'><div className='invisible'>No</div></td>
                                                            <td className='text-[9px] py-[2px]'></td>
                                                            <td className='text-[9px] py-[2px] border-l-[1px] border-black'></td>
                                                            <td className='text-[9px] py-[2px] border-l-[1px] border-black'></td>
                                                            <td className='text-[9px] py-[2px] border-l-[1px] border-black'></td>
                                                        </tr>
                                                    )
                                                }
                                                return row
                                            })()
                                        }
                                        </>
                                    )
                                }

                                <tr>
                                <td className='text-center invisible'>1</td>
                                <td className='text-start'>
                                    <div>
                                    <p className={`text-[8px] ${!img1 && !img2 && !oldImg && !oldImg1  ? 'invisible' : ''}`}>Production Sample Artwork</p>
                                    <div className='flex'>
                                    <div className='flex justify-center items-center'>
                                    <Image src={img1 ? img1 : oldImg ? oldImg : '/bocchi.jpg'} alt='#'
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className={`border-[5px] border-white ${!img1 && !oldImg ? 'invisible' : ''}`}
                                        style={{ width: "auto", height: "47px" }}/>
                                    </div>
                                    
                                    <div className='flex justify-center items-center'>
                                    <Image src={img2 ? img2 : oldImg1 ? oldImg1 : '/bocchi.jpg'} alt='#'
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className={`border-[5px] border-white ${!img2 && !oldImg1 ? 'invisible' : ''}`}
                                        style={{ width: "auto", height: "47px" }}/>
                                    </div>
                                    </div>
                                    </div>
                                </td>
                                {
                                    busType === 'meter' && (
                                        <>
                                        <td className='text-center border-l-[1px] border-black'></td>
                                        <td className='text-center border-l-[1px] border-black'></td>
                                        <td className='text-center border-l-[1px] border-black'></td>
                                        <td className='text-end border-l-[1px] border-black'></td>
                                        <td className='text-end border-l-[1px] border-black'></td>
                                        </>
                                    )
                                }
                                {
                                    busType === 'general' && (
                                        <>
                                        <td className='text-center border-l-[1px] border-black'></td>
                                        <td className='text-center border-l-[1px] border-black'></td>
                                        <td className='text-center border-l-[1px] border-black'></td>
                                        </>
                                    )
                                }
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                <td className='text-start' rowSpan={3} colSpan={busType === 'meter' ? 5 : 3}>
                                <p className='font-bold text-[8px]'>Note: Payment term:</p>
                                    <textarea className='w-[200px] text-[7px] outline-none resize-none overflow-hidden' rows={4} value={busPayTerm}>
                                    
                                    </textarea>
                                </td>
                                <td className='text-end text-[12px] font-bold'>Total:</td>
                                <td >
                                    <div className=' text-white 
                                    flex items-center justify-end
                                    bg-mainBlue font-bold border-x-[1px] 
                                    border-b-[1px] border-black pr-2 
                                    text-[10px] h-[18px]'>${grandTotal}</div>
                                </td>
                                </tr>
                                <tr>
                                <td className='invisible'>1</td>
                                <td className='invisible'>2</td>
                                </tr>
                                <tr>
                                <td className='invisible'>1</td>
                                <td className='invisible'>2</td>
                                </tr>
                                <tr>
                                <td colSpan={2}>
                                <div className='flex justify-start items-center'>
                                <div>
                                    <div className='h-[50px] border-b-[1px]'>
                                    
                                    </div>
                                    <p className='text-center text-[10px]'>{"Customer's Signature"}</p>
                                    </div>
                                </div>
                                </td>
                                {
                                    busType === 'meter' && (
                                        <>
                                         <td className='invisible'>2</td>
                                        <td className='invisible'>2</td>
                                        <td className='invisible'>2</td>
                                        </>
                                    )
                                }
                                {
                                    busType === 'general' && (
                                        <>
                                        <td className='invisible'>2</td>
                                       </>
                                    )
                                }
                                <td colSpan={busType === 'meter' ? 2 : 3}>
                                <div className='flex justify-end items-center'>
                                <div>
                                    <div className='h-[50px] border-b-[1px] flex justify-center'>
                                    <Image src={!sigLogo ? '/white.png' : sigLogo} alt='#'
                                        width={520}
                                        height={520}
                                        className={`${signature === true ? "invisible" : ""} w-[auto] h-[45px]`}
                                        />
                                    </div>
                                    <p className='text-center text-[10px]'>Authorized Signature</p>
                                    </div>
                                </div>
                                </td>

                                </tr>
                            </tfoot>
                            </table>

    
                    </div>

        </div>
  )
}

export default Qtprint