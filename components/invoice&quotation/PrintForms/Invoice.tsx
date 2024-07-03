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
    //// ur infomation
    busAddr?:string;
    busEmail?:string;
    busTelegram?:string;
    busPhone?:string;
    busPhone2?:string;
    ///busDes
    bankdes?:string;
    ////
    busInvEng?:string;
    busInvkh?:string;
    bankLogo?:string;

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
    busDes,
    busAddr,
    busEmail,
    busPhone,
    busPhone2,
    busTelegram,
    bankdes,
    busInvEng,
    busInvkh,
    bankLogo
}:meterProps) => {
    const {logo , address , signature , bankInfo , routerSwitch} = useToggle()
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
    
    const busInfo = useMemo(()=>[
        {
            id:"printBus1",
            label:"Add:",
            val:busAddr,
            clss:`${address === true || busAddr === "" ? "hidden" : ""}`
        },
        {
            id:"printBus2",
            label:"Email:",
            val:busEmail,
            clss:`${address === true || busEmail === "" ? "hidden" : ""}`
        },
        {
            id:"printBus3",
            label:"Tel:",
            val:`${busPhone} | ${busPhone2}`,
            clss:`${address === true || busPhone === "" ? "hidden" : ""}`
        },
        {
            id:"printBus4",
            label:"Telegram",
            val:busTelegram,
            clss:`${address === true || busTelegram === "" ? "hidden" : ""}`
        }
    ],[address])
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
  return ( 
        <>
        <div className="bg-white py-[10px] px-[30px] w-[561px] h-[795px] border-[1px] border-black mx-auto my-auto">
                    
                    <div className={`flex justify-between  mt-[15px]`}>
                            <div className={`flex justify-start items-start`}>
                                {
                                    logo === true ? (
                                        <h1 className={`font-bold ${routerSwitch === 'invoice' ? 'text-[40px]' : routerSwitch === 'delivery' ? 'text-[28px]' : ''}  `}>
                                            {routerSwitch === 'invoice' ? 'INVOICE' : routerSwitch === 'delivery' ? 'DELIVERY NOTE' : ''}
                                        </h1>
                                    ) : (
                                        <Image src={!busLogo ? '/white.png' : busLogo} 
                                        alt='#' 
                                        width={520} 
                                        height={520} 
                                        className='Logo w-[auto] h-[80px]'/>
                                    )
                                }
                                    
                                {/*****************Image size w-160 h-160**************/}
                            </div>
                            <div className='text-end'>
                                <textarea className={`text-end text-[11.5px] w-[300px] h-[90px] leading-[20.5px] overflow-hidden outline-none resize-none`} style={{fontFamily:"khmerContent"}}>
                                        {busDes}
                                </textarea>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 py-[3px]'>
                            <div className='col-span-1'>

                                <h1 className={`font-bold text-[26px] ${logo === false ? '' : 'invisible'}`}>{routerSwitch === 'invoice' ? 'INVOICE' : routerSwitch === 'delivery' ? 'DELIVERY NOTE' : ''}</h1>

                                <p className='text-[10px] font-bold'>
                                 No. {invNo}
                                </p>
                            </div>
                            <p className='text-[10px] text-end font-bold flex flex-col col-span-1 justify-end'>
                                Date. {dateFormat(invDate === undefined ? '' : invDate)}
                            </p>
                        </div>
                        <div className='grid grid-cols-2'>
                            <div className='col-span-1'>
                                <div className={`flex py-[1px] justify-start items-center ${cusName === "" ? "invisible" : "hidden"}`} style={{fontFamily:"khmerContent"}}>
                                    <p className='text-[9px]'>mp</p>
                                    <p className='text-[9px]'>ddd</p>
                                </div>
                                <div className={`flex  py-[1px] justify-start items-center ${cusComp === "" ? "invisible" : "hidden"}`} style={{fontFamily:"khmerContent"}}>
                                    <p className='text-[9px]'>mp</p>
                                    <p className='text-[9px]'>ddd</p>
                                </div>
                                <div className={`flex  py-[1px] justify-start items-center ${cusPhone === "" ? "invisible" : "hidden"}`} style={{fontFamily:"khmerContent"}}>
                                    <p className='text-[9px]'>mp</p>
                                    <p className='text-[9px]'>ddd</p>
                                </div>
                                <div className={`flex py-[1px] justify-start items-center ${cusEmail === "" ? "invisible" : "hidden"}`} style={{fontFamily:"khmerContent"}}>
                                    <p className='text-[9px]'>mp</p>
                                    <p className='text-[9px]'>ddd</p>
                                </div>
                                <div className={` py-[1px] ${cusAddr === "" ? "invisible" : "hidden"}  items-start gap-1`} style={{fontFamily:"khmerContent"}}>
                                        <p className='text-[9px]'>N</p>
                                        <textarea className='text-[9px] outline-none resize-none overflow-hidden w-[170px]' rows={4}>

                                        </textarea>
                                    </div>

                                {
                                    cusInfo.map((item)=>{
                                        return(
                                            <React.Fragment key={item.id}>
                                                {
                                                    item.label !== 'Add:' ? (
                                                        <div className={` py-[1px] ${item.class} ${!item.val ? "hidden" : "flex"} w-[200px] items-start gap-1`} style={{fontFamily:"khmerContent"}}>
                                                            <p className='text-[9px]'>{item.label}</p>
                                                            <p className='text-[9px]'>{item.val}</p>
                                                        </div>
                                                    ) : (
                                                        <div className={` py-[1px] ${item.class} ${!item.val ? "hidden" : "flex"}  items-start gap-1`} style={{fontFamily:"khmerContent"}}>
                                                            <p className='text-[9px]'>{item.label}</p>
                                                            <textarea className='text-[9px] outline-none resize-none overflow-hidden w-[200px]' rows={4} value={item.val}>

                                                            </textarea>
                                                        </div>
                                                    )
                                                }
                                            </React.Fragment>
                                            
                                        )
                                    })
                                }
                            </div>
                            <div className='col-span-1 flex flex-col justify-end'>
                            
                            <div>
                             <div className={`flex justify-end ${busAddr === "" ? "invisible" : "hidden"}`}>
                                    <div className={`flex  w-[150px] py-[1px] justify-end items-start gap-1`} style={{fontFamily:"khmerContent"}}>
                                        <p className='text-[9px]'>n</p>
                                        <textarea className='text-[9px] text-end  outline-none resize-none overflow-hidden w-[120px]' rows={2}>n</textarea>
                                    </div>
                                </div>
                                <div className={`flex justify-end ${busEmail === "" ? 'invisible' : 'hidden'}`}>
                                    <div className={`flex  w-[150px] py-[1px] justify-end items-start gap-1`} style={{fontFamily:"khmerContent"}}>
                                        <p className='text-[9px]'>n</p>
                                        <p className='text-[9px] text-end'>n</p>
                                    </div>
                                </div>
                                <div className={`flex justify-end ${busPhone === "" ? "invisible" : "hidden"}`}>
                                    <div className={`flex  w-[150px] py-[1px] justify-end items-start gap-1`} style={{fontFamily:"khmerContent"}}>
                                        <p className='text-[9px]'>n</p>
                                        <p className='text-[9px] text-end'>n</p>
                                    </div>
                                </div>
                                <div className={`flex justify-end ${busTelegram === "" ? "invisible" : "hidden"}`}>
                                    <div className={`flex  w-[150px] py-[1px] justify-end items-start gap-1`} style={{fontFamily:"khmerContent"}}>
                                        <p className='text-[9px]'>n</p>
                                        <p className='text-[9px] text-end'>n</p>
                                    </div>
                                </div>
                                
                                {
                                    busInfo.map((item)=>{
                                        return(
                                            <React.Fragment key={item.id}>
                                                {
                                                    item.label !== 'Add:' ? (
                                                        <div  className='flex justify-end'>
                                                            <div  className={`flex pl-[5px] w-[150px] py-[1px] justify-end ${item.clss} items-start gap-1`} style={{fontFamily:"khmerContent"}}>
                                                                <p className='text-[9px]'>{item.label}</p>
                                                                <p className='text-[9px] text-end'>{item.val}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='flex justify-end'>
                                                            <div className={`flex pl-[5px]  py-[1px] justify-end items-start gap-1 ${item.clss}`} style={{fontFamily:"khmerContent"}}>
                                                                <p className='text-[9px]'>{item.label}</p>
                                                                <textarea className='text-[9px] text-end  outline-none resize-none overflow-hidden w-[120px]' rows={2} value={item.val}></textarea>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </React.Fragment>
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
                                                                <th key={item.label}  className={`bg-mainBlue text-white font-bold ${item.class} text-[10px]`}>{item.label} </th>
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
                                                            <td className={`text-[9px] text-start pl-3 py-[2px] ${i === 0 ? "pt-[5px]" : ""}`}>
                                                                {i+1}
                                                            </td>
                                                            <td className={`text-[9px] text-start py-[2px] ${i === 0 ? "pt-[5px]" : ""}`} style={{fontFamily:"khmerContent"}}>
                                                                {!item.description ? "" : item.description.length < 44 ? item.description : <input className='outline-none' style={{fontFamily:"khmerContent"}} value={item.description}/>}
                                                            </td>
                                                            <td className={`text-[9px] py-[2px] ${i === 0 ? "pt-[5px]" : ""}`}>
                                                                <div className='flex justify-center items-center'>
                                                                {item.sizeWidth === 0 ? "" : item.sizeWidth}
                                                                <p className='px-[2px]'>{item.sizeHeight && item.sizeWidth ? "x" : ""}</p>
                                                                {item.sizeHeight === 0 ? "" : item.sizeHeight}
                                                              </div> 
                                                            </td>
                                                            <td className={`text-[9px] text-center py-[2px] ${i === 0 ? "pt-[5px]" : ""}`}>
                                                                {item.m2 === 0 ? "" : item.m2}
                                                            </td>
                                                            <td className={`text-[9px] text-center py-[2px] ${i === 0 ? "pt-[5px]" : ""}`}>{item.quantity !== '' ? item.quantity : ""}</td>
                                                            <td className={`text-[9px] text-end py-[2px] ${i === 0 ? "pt-[5px]" : ""}`}>{item.unitPrice} </td>
                                                            <td className={`text-[9px] text-end pr-3 py-[2px] ${i === 0 ? "pt-[5px]" : ""}`}>{item.total}</td>
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
                                                            <td className={`text-[9px] text-start pl-3 py-[2px] ${i === 0 ? "pt-[5px]" : ""}`}>
                                                                {i+1}
                                                            </td>
                                                            <td className={`text-[9px] text-start py-[2px] ${i === 0 ? "pt-[5px]" : ""}`} style={{fontFamily:"khmerContent"}}>
                                                                {!item.description ? "" : item.description.length < 44 ? item.description : <input className='w-[220px] outline-none' style={{fontFamily:"khmerContent"}} value={item.description}/>}
                                                            </td>
                                                            <td className={`text-[9px] text-center py-[2px] ${i === 0 ? "pt-[5px]" : ""}`}>{item.quantity}</td>
                                                            <td className={`text-[9px] text-end py-[2px] ${i === 0 ? "pt-[5px]" : ""}`}>{item.unitPrice} </td>
                                                            <td className={`text-[9px] text-end pr-3 py-[2px] ${i === 0 ? "pt-[5px]" : ""}`}>{item.total}</td>
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
                                                    <td className='text-[9px] py-[2px]'><div className='invisible'>No</div></td>
                                                    <td className='text-[9px] py-[2px]'></td>
                                                    <td className='text-[9px] py-[2px]'></td>
                                                    <td className='text-[9px] py-[2px]'></td>
                                                    <td className='text-[9px] py-[2px]'></td>
                                                    <td className='text-[9px] py-[2px]'></td>
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
                                            <div style={{fontFamily:"khmerContent"}}>
                                                    <textarea rows={2} className='outline-none text-[9px] resize-none pt-[3px] overflow-hidden text-start w-[200px] ' value={busInvkh}>

                                                    </textarea><br />
                                                    <textarea rows={2} className='outline-none text-[9px] resize-none overflow-hidden text-start w-[200px] ' value={busInvEng}>

                                                    </textarea>
                                            </div>
                                        )
                                    }
                                {
                                    bankInfo === false && (
                                        <div className='flex'>
                                            <div>
                                            <Image 
                                                className='w-[35px]'
                                                width={80} 
                                                height={80} 
                                                alt='#' 
                                                src={!bankLogo ? '/white.png' : bankLogo}
                                            />
                                            </div>
                                                        <div className='text-[9px] pl-[10px]' style={{fontFamily:"khmerContent"}}>
                                                            <p>{bankdes}</p>
                                                            <p>Account: {abaNumber}</p>
                                                            <p>Name: {abaName}</p>
                                                        </div>
                                        </div>
                                    )
                                }



                                <div>
                                    <div className='flex justify-end'>
                                        <div className={`col-span-1 flex items-center justify-end text-[9px] pr-[5px]`} style={{fontFamily:"khmerContent"}}>
                                        សរុប/Total
                                        </div>
                                        <div className={`col-span-1 font-bold text-end px-[8px] pb-[1px] ${invStatus === "partial" || !Number.isNaN(discount) && discount !== 0 ? 'text-black' : 'text-white bg-mainBlue'} ${!isNaN(discount) && discount !== 0 ? "text-[9px]" : "text-[10px]"} w-[80px] h-[15px]`}>
                                        ${grandTotal}
                                        </div>
                                    </div>
                                    <div className='flex justify-end'>
                                        <div className={`col-span-1 flex items-center justify-end text-[9px] pr-[5px]`} style={{fontFamily:"khmerContent"}}>
                                        ប្រាក់កក់/Deposite
                                        </div>
                                        <div className={`col-span-1 font-bold text-end px-[8px] pb-[1px]  ${!isNaN(discount) && discount !== 0 ? "text-[9px]" : "text-[10px]"} w-[80px] h-[15px] ${invStatus === "partial" || !Number.isNaN(discount) && discount !== 0 ? "text-black" : "text-white"}`}>
                                        { invStatus !== 'partial' || isNaN(partial) || partial === parseFloat('0.00') ? '$0.00' : `$${partial.toFixed(2)}`}
                                        </div>
                                    </div>
                                    {
                                        !isNaN(discount) && discount !== 0 && (
                                                <div className='flex justify-end'>
                                                    <div className={`col-span-1 flex items-center justify-end text-[9px] pr-[5px]`} style={{fontFamily:"khmerContent"}}>
                                                    បញ្ចុះតម្លៃ/Discount
                                                    </div>
                                                    <div className={`${!isNaN(discount) && discount !==0 ? "" : "hidden"} col-span-1 font-bold text-end px-[8px] pb-[1px]  ${!isNaN(discount) && discount !== 0 ? "text-[9px]" : "text-[10px]"} w-[80px] h-[15px]`}>
                                                    {isNaN(discount) || discount === parseFloat('0.00') ? '' : `$${discount.toFixed(2)}`}
                                                    </div>
                                                </div>
                                        )
                                    }
                                    <div className='flex justify-end'>
                                        <div className={`col-span-1 flex items-center justify-end text-[9px] pr-[5px]`} style={{fontFamily:"khmerContent"}}>
                                        នៅខ្វះ/Balance
                                        </div>
                                        <div className={`col-span-1 font-bold text-end px-[8px] pb-[1px]  ${!isNaN(discount) && discount !== 0 ? "text-[9px]" : "text-[10px]"} w-[80px] h-[15px] ${invStatus === "partial" || !Number.isNaN(discount) && discount !== 0 ? 'bg-mainBlue text-white' : 'text-white'}`}>
                                        {balance === 'NaN'|| balance ===  '$0.00' ? '' : `$${balance}`}
                                        </div>
                                    </div>
                                </div>

                        </div>
                        <div className='flex justify-between px-[5px] pt-[8px]  '>
                            <div>
                                    <Image src={!abaLogo ? '/white.png' : abaLogo} 
                                    width={700} 
                                    height={700} 
                                    alt='#' className={`${bankInfo === false ? "" : "invisible"} mx-auto w-[120px] h-[120px]`}/>
                                {/*******************original size 140 x 90******************/}
                            </div>
                            <div>
                                    <div className={` ${!isNaN(discount) && discount !== 0 ? "text-[8px]" : "text-[9px]"}  ${bankInfo === false ? "" : "invisible"}`} style={{fontFamily:"khmerContent"}}>
                                        <textarea rows={2} className='outline-none resize-none overflow-hidden text-end w-[220px] pt-[3px]' value={busInvkh}>

                                        </textarea><br />
                                        <textarea rows={2} className='outline-none resize-none overflow-hidden text-end w-[220px]' value={busInvEng}>

                                        </textarea>
                                    </div> 
                                <div className='flex justify-end pt-[10px]'>
                                    <div className='text-end pr-[40px]'>
                                        <Image src='/white.png' width={500} height={500} alt='#' className={`invisible mx-auto w-[auto]  h-[50px]`}/>
                                        {/*****************origin 50x50***************/}
                                            <p className='text-[9px] text-center' style={{fontFamily:"khmerContent"}}>ហត្ថលេខាអ្នកទិញ</p>
                                            <p className='text-[9px]'>customer signature</p>
                                    </div>
                                    <div className='text-center'>
                                            {/*****************origin 50x50***************/}
                                            <Image src={!sigLogo ? '/white.png' : sigLogo} width={500} height={500} alt='#' className={`mx-auto w-[auto]  h-[50px] ${signature === true ? "invisible" : ""}`}/>
                                                <p className='text-[9px] text-center' style={{fontFamily:"khmerContent"}}>
                                                    ហត្ថលេខាអ្នកលក់
                                                </p>
                                                <p className='text-[9px]'>Seller Signature</p>
                                    </div>
                                </div>
                            </div>
                        </div>


        </div>

        </>
  )
}

export default Invprint