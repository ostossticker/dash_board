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

type meterProps = {
    busType?:string;
    items?:tableProps[];
    abaName?:string;
    abaNumber?:string;
    invNo?:string;
    cusName?:string;
    cusComp?:string;
    cusPhone?:string;
    cusEmail?:string;
    cusAddr?:string
    invPo?:string;
    invDate?:string;
    invStatus?:string;
    partial:number;
    discount:number;
    grandTotal?:string;
    balance?:string;
    ////Toggle 
    toggleEmail?:boolean;
    toggleAddr?:boolean;
    togglePo?:boolean;
    toggleName?:boolean;
    toggleComp?:boolean;
    togglePhone?:boolean;
    ////logo
    busLogo?:string;
    abaLogo?:string;
    sigLogo?:string;
    ///busDes
    busDes?:string;
}


const Invprint = ({
    toggleAddr,
    toggleComp,
    toggleEmail,
    toggleName,
    togglePhone,
    togglePo,
    busType,
    items,
    abaName,
    abaNumber,
    invNo,
    cusName,
    cusComp,
    cusPhone,
    cusEmail,
    cusAddr,
    invPo,
    invDate,
    invStatus,
    partial,
    discount,
    grandTotal,
    balance,
    busLogo,
    abaLogo,
    sigLogo,
    busDes
}:meterProps) => {
    const {logo , address , signature , bankInfo , routerSwitch} = useToggle()
    const [val , setVal] = useState({
        staffName:'wdad',
        staffPhone:'dwada',
        busAddr:'dwadad',
        busEmail:'dwada',
        busTel:'dwadadad',
        busTelegram:'jjlkjk'
    })
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
            class:'text-center'
        },
        {
            label:"M2",
            class:"text-center"
        },
        {
            label:"Qty",
            class:'text-center'
        },
        {
            label:"Unit Price",
            class:'text-end'
        },
        {
            label:"Total Amount",
            class:'text-end pr-2'
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
            class:'text-end'
        },
        {
            label:"Unit Price",
            class:'text-end'
        },
        {
            label:"Total Amount",
            class:'text-end pr-2'
        }
    ],[])
    
    const busInfo = useMemo(()=>[
        {
            id:"printBus1",
            label:"Add:",
            val:"dawdadwadada",
            clss:`${address === true || val.busAddr === "" ? "!hidden" : ""}`
        },
        {
            id:"printBus2",
            label:"Email:",
            val:val.busEmail,
            clss:`${address === true || val.busEmail === "" ? "!hidden" : ""}`
        },
        {
            id:"printBus3",
            label:"Tel:",
            val:"2131231",
            clss:`${address === true || val.busTel === "" ? "!hidden" : ""}`
        },
        {
            id:"printBus4",
            label:"Telegram",
            val:"#231313",
            clss:`${address === true || val.busTelegram === "" ? "!hidden" : ""}`
        }
    ],[val , address])
    const cusInfo = useMemo(()=>[
        {
            id:'cusInvForm1',
            label:"At:",
            val:cusName,
            class:`${toggleName? "hidden" : ""}`
        },
        {
            id:'cusInvForm2',
            label:"To:",
            val:cusComp,
            class:`${toggleComp ? "hidden" : ""}`
        },
        {
            id:'cusInvForm3',
            label:"Tel:",
            val:cusPhone,
            class:`${togglePhone ? "hidden" : ""}`
        },
        {
            id:'cusInvForm4',
            label:"Email:",
            val:cusEmail,
            class:`${toggleEmail ? "hidden" : ""}`
        },
        {
            id:'cusInvForm5',
            label:"Add:",
            val:cusAddr,
            class:`${toggleAddr ? "hidden" : ""}`
        },
        {
            id:'cusInvForm6',
            label:"Po:",
            val:invPo,
            class:`${togglePo? "hidden" : ""}`
        }
    ],[cusName , cusComp , cusPhone , cusEmail , cusAddr , invPo])
    const [arr , setArr] = useState<tableProps[]>([])
    useEffect(()=>{
        setArr(items || [])
    },[items])
    let test2 = cusInfo.reduce((a:number[], e ,i)=>(e.val !== "") ? a.concat(i) : a ,[])
    let test3 = busInfo.reduce((a:number[], e, i)=>(e.val !== "") ? a.concat(i) : a ,[])
  return ( 
        <div className={`bg-white py-[20px] px-[30px] w-[555px] mx-auto my-auto`}>
            <div>
                    
                    <div className={`flex justify-between mb-[20px] ${logo === true && "mt-[20px]"}`}>
                            <div className={`flex justify-start items-center`}>
                                {
                                    logo === true ? (
                                        <h1 className={`font-bold ${routerSwitch === 'invoice' ? 'text-[58px]' : routerSwitch === 'delivery' ? 'text-[28px]' : ''} leading-[5px] mb-[40px]`}>
                                            {routerSwitch === 'invoice' ? 'INVOICE' : routerSwitch === 'delivery' ? 'DELIVERY NOTE' : ''}
                                        </h1>
                                    ) : (
                                        <Image src={!busLogo ? '/n5LOGO.png' : busLogo} 
                                        alt='#' 
                                        width={520} 
                                        height={520} 
                                        className='Logo w-[auto] h-[60px]'/>
                                    )
                                }
                                    
                                {/*****************Image size w-160 h-160**************/}
                            </div>
                            <div className='text-end'>
                                <textarea className={`text-end text-[11.5px] ${!logo ? 'w-[300px]' : 'w-[190px]'} h-[90px] leading-[20.5px] overflow-hidden outline-none resize-none`} style={{fontFamily:"khmerContent"}}>
                                        {busDes}
                                </textarea>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 py-[3px]  px-[5px]'>
                            <div className='col-span-1'>
                                {
                                    logo === false && (
                                        <h1 className='font-bold text-[28px]'>{routerSwitch === 'invoice' ? 'INVOICE' : routerSwitch === 'delivery' ? 'DELIVERY NOTE' : ''}</h1>
                                    )
                                }
                                <p className='text-[13px] font-bold'>
                                 No. {invNo}
                                </p>
                            </div>
                            <p className='text-[13px] text-end font-bold flex flex-col col-span-1 justify-end'>
                                Date. {dateFormat(invDate === undefined ? '' : invDate)}
                            </p>
                        </div>
                        <div className='grid grid-cols-2'>
                            <div className='col-span-1'>
                            {(()=>{
                                    let row = []
                                    for(let i = 6; i > (test2?.length || 0); i--){
                                        row.push(
                                            <div key={crypto.randomUUID()} className={`flex pl-[5px] justify-start items-center invisible`} style={{fontFamily:"khmerContent"}}>
                                                    <p className='text-[10.6px]'>mp</p>
                                                    <p className='text-[10px]'>ddd</p>
                                            </div>
                                        )
                                    }
                                    return row
                                })()
                                }
                                {
                                    cusInfo.map((item)=>{
                                        return(
                                            <div key={item.id} className={`pl-[5px] ${item.class} ${!item.val ? "hidden" : "flex"} items-center gap-1`} style={{fontFamily:"khmerContent"}}>
                                                <p className='text-[10px]'>{item.label}</p>
                                                <p className='text-[10px]'>{item.val}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='col-span-1 flex flex-col justify-end'>
                            <div>
                            {
                                    address === true && (
                                        <>
                                        <div className='invisible flex pl-[5px] justify-end' style={{fontFamily:"khmerContent"}}>
                                                    <p className='text-[10.6px]'>mp</p>
                                                    <p className='text-[10px] text-end'>ddd</p>
                                        </div>
                                        <div className='invisible flex pl-[5px] justify-end' style={{fontFamily:"khmerContent"}}>
                                                    <p className='text-[10.6px]'>mp</p>
                                                    <p className='text-[10px] text-end'>ddd</p>
                                        </div>
                                        <div className='invisible flex pl-[5px] justify-end' style={{fontFamily:"khmerContent"}}>
                                                    <p className='text-[10.6px]'>mp</p>
                                                    <p className='text-[10px] text-end'>ddd</p>
                                        </div>
                                        <div className='invisible flex pl-[5px] justify-end' style={{fontFamily:"khmerContent"}}>
                                                    <p className='text-[10.6px]'>mp</p>
                                                    <p className='text-[10px] text-end'>ddd</p>
                                        </div>
                                        </>
                                    )
                                }
                            {(()=>{
                                    let row = []
                                    for(let i = 4; i > (test3?.length || 0); i--){
                                        row.push(
                                            <div key={crypto.randomUUID()} className={`flex pl-[5px] justify-start items-center invisible`} style={{fontFamily:"khmerContent"}}>
                                                    <p className='text-[10.6px]'>mp</p>
                                                    <p className='text-[10px] text-end'>ddd</p>
                                            </div>
                                        )
                                    }
                                    return row
                                })()
                                }
                                {
                                    busInfo.map((item)=>{
                                        return(
                                            <div key={item.id} className={`flex pl-[5px] justify-end ${item.clss} items-center gap-1`} style={{fontFamily:"khmerContent"}}>
                                                <p className='text-[10.6px]'>{item.label}</p>
                                                <p className='text-[10px] text-end'>{item.val}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            </div>
                        </div>
                        <table className='w-full mt-[10px]'>
                            <thead>
                                <tr>
                                    {
                                        busType === 'meter' && (
                                            <>
                                            {
                                                meters.map((item)=>{
                                                    return(
                                                                <th key={item.label}  className={`bg-mainBlue text-white font-bold ${item.class} text-[11px]`}>{item.label} </th>
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
                                                                <th key={item.label}  className={`bg-mainBlue text-white font-bold ${item.class} text-[11px]`}>{item.label} </th>
                                                    )
                                                })
                                            }
                                            </>
                                        )
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    busType === 'meter' && (
                                        <>
                                        {
                                            arr?.map((item,i)=>{
                                                return(
                                                    <tr 
                                                    key={item.id} 
                                                    >
                                                            <td className='text-[10px] text-start pl-3 py-[2px]'>
                                                                {i+1}
                                                            </td>
                                                            <td className='text-[10px] text-start py-[2px] w-[170px]'>
                                                                {item.description}
                                                            </td>
                                                            <td className='text-[10px] py-[2px]'>
                                                                <div className='flex justify-center items-center'>
                                                                {item.sizeWidth === 0 ? "" : item.sizeWidth}
                                                                <p className='px-[2px]'>{item.sizeHeight && item.sizeWidth ? "x" : ""}</p>
                                                                {item.sizeHeight === 0 ? "" : item.sizeHeight}
                                                              </div> 
                                                            </td>
                                                            <td className='text-[10px] text-center py-[2px]'>
                                                                {item.m2 === 0 ? "" : item.m2}
                                                            </td>
                                                            <td className='text-[10px] text-center py-[2px]'>{item.quantity !== '' ? item.quantity : ""}</td>
                                                            <td className='text-[10px] text-end py-[2px]'>{item.unitPrice} </td>
                                                            <td className='text-[10px] text-end pr-3 py-[2px]'>{item.total}</td>
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
                                                            <td className='text-[10px] text-start pl-3 py-[2px]'>
                                                                {i+1}
                                                            </td>
                                                            <td className='text-[10px] text-start py-[2px] w-[170px]'>
                                                                {item.description}
                                                            </td>
                                                            <td className='text-[10px] text-end py-[2px]'>{item.quantity !== '' || item.quantity !== undefined  ? "" : item.quantity > 1 ? `${item.quantity}pcs` : `${item.quantity}pc`}</td>
                                                            <td className='text-[10px] text-end py-[2px]'>{item.unitPrice} </td>
                                                            <td className='text-[10px] text-end pr-3 py-[2px]'>{item.total}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </>
                                    )
                                }
                                {
                                    (()=>{
                                        let row = []
                                        for(let i = 12; i > (items?.length || 0); i--){
                                            row.push(
                                                <tr key={i}>
                                                    <td className='text-[10px] py-[2px]'><div className='invisible'>No</div></td>
                                                    <td className='text-[10px] py-[2px]'></td>
                                                    <td className='text-[10px] py-[2px]'></td>
                                                    <td className='text-[10px] py-[2px]'></td>
                                                    <td className='text-[10px] py-[2px]'></td>
                                                    <td className='text-[10px] py-[2px]'></td>
                                                </tr>
                                            )
                                        }
                                        return row
                                    })()
                                }
                            </tbody>
                        </table>
                        <div className='flex justify-between mt-[10px] px-[5px] pb-[4px]'>
                                {
                                        bankInfo === true && (
                                            <div className='text-start text-[10px]' style={{fontFamily:"khmerContent"}}>
                                                    <div>
                                                        <p>djawdjwakldwjaldkjakldjwakld</p>
                                                        <p>wdadadadwadwadwadadwadwadwad</p>
                                                        <p>dawdadadadaddadwadwadawdada</p>
                                                        <p>dawdadadadadadadadwad</p>      
                                                    </div> 
                                            </div>
                                        )
                                    }
                                {
                                    bankInfo === false && (
                                        <div className='flex'>
                                            <div>
                                            <Image 
                                                className='w-[40px]'
                                                width={80} 
                                                height={80} 
                                                alt='#' 
                                                src="https://bankerjobs.asia/storage/files/kh/7/thumb-816x460-8bb28995e73226227d77d1c107b05228.png"
                                            />
                                            </div>
                                                        <div className='text-[10px] pl-[10px]' style={{fontFamily:"khmerContent"}}>
                                                            <p>ABA Bank Acount</p>
                                                            <p>Account: {abaNumber}</p>
                                                            <p>Name: {abaName}</p>
                                                        </div>
                                        </div>
                                    )
                                }



                                <div>
                                    <div className='flex justify-end'>
                                        <div className={`col-span-1 flex items-center justify-end ${!isNaN(discount) && discount !== 0 ? "text-[9px]" : "text-[10px]"} pr-[5px]`} style={{fontFamily:"khmerContent"}}>
                                        សរុប/Total
                                        </div>
                                        <div className={`col-span-1 font-bold text-end px-[8px] pb-[1px] ${invStatus === "partial" || !Number.isNaN(discount) && discount !== 0 ? 'text-black' : 'text-white bg-mainBlue'} ${!isNaN(discount) && discount !== 0 ? "text-[10px]" : "text-[11px]"} w-[80px] h-[17px]`}>
                                        ${grandTotal}
                                        </div>
                                    </div>
                                    <div className='flex justify-end'>
                                        <div className={`col-span-1 flex items-center justify-end ${!isNaN(discount) && discount !== 0 ? "text-[9px]" : "text-[10px]"} pr-[5px]`} style={{fontFamily:"khmerContent"}}>
                                        ប្រាក់កក់/Deposite
                                        </div>
                                        <div className={`col-span-1 font-bold text-end px-[8px] pb-[1px]  ${!isNaN(discount) && discount !== 0 ? "text-[10px]" : "text-[11px]"} w-[80px] h-[17px] ${invStatus === "partial" || !Number.isNaN(discount) && discount !== 0 ? "text-black" : "text-white"}`}>
                                        { invStatus !== 'partial' || isNaN(partial) || partial === parseFloat('0.00') ? '$0.00' : `$${partial.toFixed(2)}`}
                                        </div>
                                    </div>
                                    {
                                        !isNaN(discount) && discount !== 0 && (
                                                <div className='flex justify-end'>
                                                    <div className={`col-span-1 flex items-center justify-end ${!isNaN(discount) && discount !== 0 ? "text-[9px]" : "text-[10px]"} pr-[5px]`} style={{fontFamily:"khmerContent"}}>
                                                    បញ្ចុះតម្លៃ/Discount
                                                    </div>
                                                    <div className={`${!isNaN(discount) && discount !==0 ? "" : "hidden"} col-span-1 font-bold text-end px-[8px] pb-[1px]  ${!isNaN(discount) && discount !== 0 ? "text-[10px]" : "text-[11px]"} w-[80px] h-[17px]`}>
                                                    {isNaN(discount) || discount === parseFloat('0.00') ? '' : `$${discount.toFixed(2)}`}
                                                    </div>
                                                </div>
                                        )
                                    }
                                    <div className='flex justify-end'>
                                        <div className={`col-span-1 flex items-center justify-end ${!isNaN(discount) && discount !== 0 ? "text-[9px]" : "text-[10px]"} pr-[5px]`} style={{fontFamily:"khmerContent"}}>
                                        នៅខ្វះ/Balance
                                        </div>
                                        <div className={`col-span-1 font-bold text-end px-[8px] pb-[1px]  ${!isNaN(discount) && discount !== 0 ? "text-[10px]" : "text-[11px]"} w-[80px] h-[17px] ${invStatus === "partial" || !Number.isNaN(discount) && discount !== 0 ? 'bg-mainBlue text-white' : 'text-white'}`}>
                                        {balance === 'NaN'|| balance ===  '$0.00' ? '' : `$${balance}`}
                                        </div>
                                    </div>
                                </div>

                        </div>
                        <div className='flex justify-between px-[5px] pt-[8px]  '>
                            <div>
                                    <Image src={!abaLogo ? '/bocchi.jpg' : abaLogo} 
                                    width={700} 
                                    height={700} 
                                    alt='#' className={`${bankInfo === false ? "" : "invisible"} mx-auto ${!isNaN(discount) && discount !== 0 ? "w-[100px]" : "w-[120px]" }  h-auto`}/>
                                {/*******************original size 140 x 90******************/}
                            </div>
                            <div>
                                            <div className={`text-end ${!isNaN(discount) && discount !== 0 ? "text-[9px]" : "text-[10px]"}  ${bankInfo === false ? "" : "invisible"}`} style={{fontFamily:"khmerContent"}}>
                                                <p>djawdjwakldwjaldkjakldjwakld</p>
                                                <p>wdadadadwadwadwadadwadwadwad</p>
                                                <p>dawdadadadaddadwadwadawdada</p>
                                                <p>dawdadadadadadadadwad</p>      
                                            </div> 
                                <div className='flex justify-end pt-[22px]'>
                                    <div className='text-end pr-[40px]'>
                                        <Image src='/signature.png' width={500} height={500} alt='#' className={`invisible mx-auto w-[auto]  ${!isNaN(discount) && discount !== 0 ? "h-[20px]" : "h-[30px]" }`}/>
                                        {/*****************origin 50x50***************/}
                                            <p className='text-[10px] text-center' style={{fontFamily:"khmerContent"}}>ហត្ថលេខាអ្នកទិញ</p>
                                            <p className='text-[10px]'>customer signature</p>
                                    </div>
                                    <div className='text-center'>
                                            {/*****************origin 50x50***************/}
                                            <Image src={!sigLogo ? '/signature.png' : sigLogo} width={500} height={500} alt='#' className={`mx-auto w-[auto]  ${!isNaN(discount) && discount !== 0 ? "h-[20px]" : "h-[30px]" } ${signature === true ? "invisible" : ""}`}/>
                                                <p className='text-[10px] text-center' style={{fontFamily:"khmerContent"}}>
                                                    ហត្ថលេខាអ្នកលក់
                                                </p>
                                                <p className='text-[10px]'>Seller Signature</p>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                    </div>

        </div>
  )
}

export default Invprint