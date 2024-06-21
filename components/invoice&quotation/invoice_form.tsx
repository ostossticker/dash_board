"use client"
import Image from 'next/image';
import React, {  useEffect, useMemo, useState } from 'react'
import ResponsiveElement from './ResComp';
import useToggle from '@/hooks/stores';
import { dateFormat } from '@/lib/functions';

type tableProps = {
    id:string;
    description?: string;
    sizeWidth?: number;
    sizeHeight?: number;
    quantity?: string;
    unitPrice?: string | number;
    m2?: number;
    total?: string | number;
  
}

type invFormProps = {
    invStatus?:string;
    discount:number;
    partial:number
    ///invoice form
    cusName?:string;
    cusComp?:string;
    items?:tableProps[];
    cusPhone?:string;
    cusEmail?:string;
    cusAddr?:string;
    invPo?:string;
    invNo?:string;
    invDate?:string;
    abaNumber?:string;
    abaName?:string;
    busDes?:string;
    //// ur infomation
    busAddr?:string;
    busEmail?:string;
    busTelegram?:string;
    busPhone?:string;
    busType?:string;
    /// grand totals
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
    bankdes?:string;
    busEng?:string;
    busKh?:string
  }

const PrintForm = ({
    toggleAddr,
    toggleEmail,
    togglePo,
    toggleComp,
    toggleName,
    togglePhone,
    grandTotal,
    balance,
    busType,
    items,
    discount , 
    partial,
    invPo ,
    busDes, 
    invStatus,
    abaName,
    abaNumber,
    invNo,
    invDate, 
    cusName ,
    cusComp , 
    cusPhone , 
    cusEmail , 
    cusAddr,
    /////logo
    busLogo,
    abaLogo,
    sigLogo,
    ///business
    busAddr,
    busEmail,
    busPhone,
    busTelegram,
    bankdes,
    busEng,
    busKh
}:invFormProps) => {
    const {logo , address , signature , bankInfo , routerSwitch} = useToggle()
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
    const meters = useMemo(()=>[
        {
            label:"No.",
            class:"text-start pl-2 2xl!:text-[14px]"
        },
        {
            label:"Description",
            class:'text-start 2xl!:text-[14px]'
        },
        {
            label:"Size cm",
            class:"text-center 2xl!:text-[14px]"
        },
        {
            label:"M2",
            class:"text-center 2xl!:text-[14px]"
        },
        {
            label:"Qty",
            class:'text-center 2xl!:text-[14px]'
        },
        {
            label:"Unit Price",
            class:'text-end 2xl!:text-[14px]'
        },
        {
            label:"Total Amount",
            class:'text-end pr-2 2xl!:text-[14px]'
        }
    ],[])
    
    const busInfo = useMemo(()=>[
        {
            id:'invBus1',
            label:"Add:",
            val:busAddr,
            clss:`${address === true || busAddr === "" ? "!hidden" : ""}`
        },
        {
            id:'invBus2',
            label:"Email:",
            val:busEmail,
            clss:`${address === true || busEmail === "" ? "!hidden" : ""}`
        },
        {
            id:'invBus3',
            label:"Tel:",
            val:busPhone,
            clss:`${address === true || busPhone === "" ? "!hidden" : ""}`
        },
        {
            id:'invBus4',
            label:"Telegram:",
            val:busTelegram,
            clss:`${address === true || busTelegram === "" ? "!hidden" : ""}`
        }
    ],[busAddr , busEmail , busPhone ,  busTelegram  , address])
    const cusInfo = useMemo(()=>[
        {
            id:'invCus1',
            label:"At:",
            val:cusName,
            class:`${toggleName? "hidden" : ""}`
        },
        {
            id:'invCus1',
            label:"To:",
            val:cusComp,
            class:`${toggleComp ? "hidden" : ""}`
        },
        {
            id:'invCus2',
            label:"Tel:",
            val:cusPhone,
            class:`${togglePhone ? "hidden" : ""}`
        },
        {
            id:'invCus3',
            label:"Email:",
            val:cusEmail,
            class:`${toggleEmail ? "hidden" : ""}`
        },
        {
            id:'invCus4',
            label:"Add:",
            val:cusAddr,
            class:`${toggleAddr ? "hidden" : ""}`
        },
        {
            id:'invCus5',
            label:"Po",
            val:invPo,
            class:`${togglePo ? "hidden" : ""}`
        }
    ],[cusName , cusComp , cusPhone , cusEmail , cusAddr , invPo])
    const [arr , setArr] = useState<tableProps[]>([])
    useEffect(()=>{
        setArr(items || [])
    },[items])
    const handleDragStart = (e:React.DragEvent<HTMLTableRowElement>,id:string)=>{
        e.dataTransfer.setData('text/plain',id.toString());
    }
    const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
        e.preventDefault();
    };
      
    const handleDrop = (e:React.DragEvent<HTMLTableRowElement>,targetId:string) =>{
        e.preventDefault();
    
        // Ensure arr is not null or undefined before proceeding
        if (arr) {
            const draggedId = e.dataTransfer.getData('text/plain');
            const targetIndex = arr.findIndex((row) => row.id === targetId);
            const draggedIndex = arr.findIndex((row) => row.id === draggedId);
    
            // Ensure targetIndex and draggedIndex are valid
            if (targetIndex !== -1 && draggedIndex !== -1) {
                const updatedRows = [...arr];
                const draggedRow = updatedRows.splice(draggedIndex, 1)[0];
                updatedRows.splice(targetIndex, 0, draggedRow);
                setArr(updatedRows);
            }
        }
    }
    let test2 = cusInfo.reduce((a:number[], e ,i)=>(e.val !== "") ? a.concat(i) : a ,[])
   let test3 = busInfo.reduce((a:number[], e, i)=>(e.val !== "") ? a.concat(i) : a ,[])
    useEffect(()=>{
        const start = () =>{
            if(invStatus === "partial" || !Number.isNaN(discount) && discount !== 0){
                console.log('bottom' , invStatus)
            }else{
                console.log('blue')
            }
        }
        start()
    },[toggleAddr])
  return ( 
    <div className='flex'>
        <ResponsiveElement width={490}  height={'auto'} px={40} py={20} className='bg-white mx-auto'>
            <div>
            <div className='flex justify-between'>
                            <div className='flex justify-start items-center '>
                                {
                                    logo === true ? (
                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={routerSwitch === 'invoice' ? 30 : routerSwitch === 'delivery' ? 20 : 0} pb={39.5} className='font-semibold'>
                                            <h1>
                                            {routerSwitch === 'invoice' ? 'INVOICE' : routerSwitch === 'delivery' ? 'DELIVERY NOTE' : ''}
                                            </h1>
                                        </ResponsiveElement>
                                    ) : (
                                        <ResponsiveElement width={'auto'} height={80}>
                                            <Image src={!busLogo ? '/white.png' : busLogo} alt='#' width={0} height={0} sizes="100vw"/>
                                        </ResponsiveElement>
                                    )
                                }
                                {/*****************Image size w-160 h-160**************/}
                            </div>
                            <div className='text-end '>
                                <ResponsiveElement leading={25} width={270} height={110} fontSize={8} className='text-end pt-[20pxs] p-4 !pr-0 resize-none outline-none overflow-hidden' style={{fontFamily:"khmerContent"}}>
                                     <textarea className='outline-none'>
                                     {busDes}
                                    </textarea>
                                </ResponsiveElement>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 py-[5px]  px-[5px]'>
                            <div className='col-span-1'>
                                {
                                    logo === false && (
                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={16} className='font-bold'>
                                        <h1 >{routerSwitch === 'invoice' ? 'INVOICE' : routerSwitch === 'delivery' ? 'DELIVERY NOTE' : ''}</h1>
                                        </ResponsiveElement>
                                    )
                                }
                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} className='font-bold'>
                                    <p>No. {invNo}</p>
                                </ResponsiveElement>
                            </div>
    
                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} className='text-end font-bold  flex flex-col col-span-1 justify-end'>
                                    <p >
                                        Date. {dateFormat(invDate === undefined ? '' : invDate)}
                                    </p>
                            </ResponsiveElement>
    
                        </div>
                        <div className='grid grid-cols-2'>
                            <div className='col-span-1'>
                            {(()=>{
                                    let row = []
                                    for(let i = 6; i > (test2?.length || 0); i--){
                                        row.push(
                                            <div key={crypto.randomUUID()} className={`flex pl-[5px] justify-start invisible `} style={{fontFamily:"khmerContent"}}>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7}>
                                                    <p>mp</p>
                                                </ResponsiveElement>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={6}>
                                                    <p>ddd</p>
                                                </ResponsiveElement>
                                            </div>
                                        )
                                    }
                                    return row
                                })()
                                }
                                {
                                    cusInfo.map((item)=>{
                                        return(
                                            <div key={item.label} className={`${item.class} ${!item.val ? "hidden" : "flex"} w-[300px] pl-[5px] items-start gap-1`} style={{fontFamily:"khmerContent"}}>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7}>
                                                    <p>{item.label}</p>
                                                </ResponsiveElement>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={6}>
                                                    <p>{item.val}</p>
                                                </ResponsiveElement>
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
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={8}>
                                                    <p>ddd</p>
                                                </ResponsiveElement>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7}>
                                                    <p>ddd</p>
                                                </ResponsiveElement>
                                        </div>
                                        <div className='invisible flex pl-[5px] justify-end' style={{fontFamily:"khmerContent"}}>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={8}>
                                                    <p>ddd</p>
                                                </ResponsiveElement>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7}>
                                                    <p>ddd</p>
                                                </ResponsiveElement>
                                        </div>
                                        <div className='invisible flex pl-[5px] justify-end' style={{fontFamily:"khmerContent"}}>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={8}>
                                                    <p>ddd</p>
                                                </ResponsiveElement>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7}>
                                                    <p>ddd</p>
                                                </ResponsiveElement>
                                        </div>
                                        <div className='invisible flex pl-[5px] justify-end' style={{fontFamily:"khmerContent"}}>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={8}>
                                                    <p>ddd</p>
                                                </ResponsiveElement>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7}>
                                                    <p>ddd</p>
                                                </ResponsiveElement>
                                        </div>
                                        </>
                                    )
                                }
                                {(()=>{
                                    let row = []
                                    for(let i = 4; i > (test3?.length || 0); i--){
                                        row.push(
                                            <div key={crypto.randomUUID()} className={`flex pl-[5px] justify-start items-center invisible`} style={{fontFamily:"khmerContent"}}>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7}>
                                                    <p>mp</p>
                                                </ResponsiveElement>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={6}>
                                                    <p>ddd</p>
                                                </ResponsiveElement>
                                            </div>
                                        )
                                    }
                                    return row
                                })()
                                }
                                {
                                    busInfo.map((item)=>{
                                        return(
                                            <div key={item.label} className='flex justify-end'>
                                                <div  className={`flex pl-[5px] w-[240px] justify-end ${item.clss} items-start gap-1`} style={{fontFamily:"khmerContent"}}>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} >
                                                    <p>{item.label}</p>
                                                </ResponsiveElement>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={6} className='text-end pt-[2px]'>
                                                    <p>{item.val}</p>
                                                </ResponsiveElement>
                                            </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            </div>
                        </div>
                        <table className='w-full mt-[3px] lg:mt-[5px] md:mt-[5px] 2xl:mt-[10px]'>
                            <thead>
                                <tr>
                                {
                                        busType === "meter" && (
                                            <>
                                            {
                                            meters.map((item)=>{
                                                    return(
                                                            <ResponsiveElement key={crypto.randomUUID()} width={'auto'} height={'auto'} fontSize={7.3} className={`bg-mainBlue text-white font-bold ${item.class}`}>
                                                                <th>{item.label} </th>
                                                            </ResponsiveElement>
                                                    )
                                                })
                                            }
                                            </>
                                        )
                                    }
                                    {
                                        busType === "general" && (
                                            <>
                                            {
                                                generals.map((item)=>{
                                                    return(
                                                            <ResponsiveElement key={crypto.randomUUID()} width={'auto'} height={'auto'} fontSize={7.3} className={`bg-mainBlue text-white font-bold ${item.class}`}>
                                                                <th>{item.label} </th>
                                                            </ResponsiveElement>
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
                                            arr.map((item,i)=>{
                                                return(
                                                    <tr 
                                                    key={item.id} 
                                                    draggable="true"
                                                    onDragStart={(e)=>handleDragStart(e,item.id)}
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e)=>handleDrop(e,item.id)}
                                                    >
                                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={5} py={1} className='text-start pl-3 2xl:!text-[15px]'>
                                                        <td >
                                                            {i+1}
                                                        </td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement width={150} height={'auto'} fontSize={5} py={1} className='text-start 2xl:!text-[15px]' style={{fontFamily:"khmerContent"}}>
                                                            <td>
                                                                {!item.description ? '' : item.description.length < 44 ? item.description : <input className='outline-none leading-7'  value={item.description}/> }
                                                            </td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={5} py={1} className='2xl:!text-[15px]'>
                                                            <td>
                                                                <div className='flex items-center justify-center'>
                                                                <div>{item.sizeWidth === 0 ? "" : item.sizeWidth}</div>
                                                                    <p className='px-[2px]'>{item.sizeHeight && item.sizeWidth ? "x" : ""}</p>
                                                                    <div>{item.sizeHeight === 0 ? "" : item.sizeHeight}</div>
                                                                </div>
                                                            </td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={5} py={1} px={5}  className='text-center  2xl:!text-[15px]'>
                                                            <td>{item.m2 === 0 ? "" : item.m2?.toFixed(2)}</td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={5} py={1} className='text-center  2xl:!text-[15px]'>
                                                            <td>{item.quantity === "" ? "" : item.quantity}</td>
                                                        </ResponsiveElement>
                                                    
                                                        <ResponsiveElement className='text-end  2xl:!text-[15px]' fontSize={5} py={1} width={'auto'} height={'auto'}>
                                                            <td>{item.unitPrice} </td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement className='text-end pr-3  2xl:!text-[15px]' fontSize={5} py={1} width={'auto'} height={'auto'}>
                                                            <td>{item.total}</td>
                                                        </ResponsiveElement>
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
                                            arr.map((item,i)=>{
                                                return(
                                                    <tr 
                                                    key={item.id} 
                                                    draggable="true"
                                                    onDragStart={(e)=>handleDragStart(e,item.id)}
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e)=>handleDrop(e,item.id)}
                                                    >
                                                        <ResponsiveElement fontSize={5} py={1} width={'auto'} height={'auto'} className='text-start pl-3'>
                                                        <td >
                                                            {i+1}
                                                        </td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={5} py={1} className='text-start'>
                                                            <td>
                                                            {!item.description ? "" : item.description.length < 44 ? item.description : <input className='w-[220px] outline-none' value={item.description}/>}
                                                            </td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={5} py={1} className='text-center'>
                                                            <td>{item.quantity === "" ? "" : item.quantity}</td>
                                                        </ResponsiveElement>
                                                    
                                                        <ResponsiveElement className='text-end' fontSize={5} py={1} width={'auto'} height={'auto'}>
                                                            <td>{item.unitPrice} </td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement className='text-end pr-3' fontSize={5} py={1} width={'auto'} height={'auto'}>
                                                            <td>{item.total}</td>
                                                        </ResponsiveElement>
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
                                        for(let i = 12; i > (items?.length || 0) ; i--){
                                            row.push(
                                                <tr key={crypto.randomUUID()}>
                                                    <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px]'>
                                                    <td><div className='invisible'>No</div></td>
                                                    </ResponsiveElement>
                                                    <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px]'>
                                                    <td><div className='invisible'>No</div></td>
                                                    </ResponsiveElement>
                                                    <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px]'>
                                                    <td><div className='invisible'>No</div></td>
                                                    </ResponsiveElement>
                                                    <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px]'>
                                                    <td><div className='invisible'>No</div></td>
                                                    </ResponsiveElement>
                                                    <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px]'>
                                                    <td><div className='invisible'>No</div></td>
                                                    </ResponsiveElement>
                                                </tr>
                                            )
                                        }
                                        return row
                                    })()
                                }
                            </tbody>
                        </table>
                        <div className='flex justify-between mt-[3px] lg:mt-[5px] md:mt-[5px] 2xl:mt-[10px] px-[5px] '>
                                    {
                                        bankInfo === true && (
                                            <ResponsiveElement width={200} height={'auto'} fontSize={6.3} style={{fontFamily:"khmerContent"}}>
                                                    <div>
                                                                    <textarea className='w-full resize-none outline-none overflow-hidden text-start py-[5px]' rows={2} value={busKh}>

                                                                    </textarea><br />
                                                                    <textarea className='w-full resize-none outline-none overflow-hidden text-start' rows={2} value={busEng}>

                                                                    </textarea>                                                  
                                                               </div>
                                            </ResponsiveElement>
                                        )
                                    }
                                {
                                    bankInfo === false && (
                                        <div className='flex'>
                                            <ResponsiveElement width={35} height={'auto'}>
                                            <div>
                                            <Image
                                            src='https://bankerjobs.asia/storage/files/kh/7/thumb-816x460-8bb28995e73226227d77d1c107b05228.png'
                                            alt='#'
                                            width={500}
                                            height={500}
                                            className='w-full'
                                            />
                                            </div>
                                            </ResponsiveElement>
                                                            
                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={6} className='pl-[10px]' style={{fontFamily:"khmerContent"}}>
                                                        <div >
                                                            <p>{bankdes} Bank Acount</p>
                                                            <p>Account: {abaNumber}</p>
                                                            <p>Name: {abaName}</p>
                                                        </div>
                                            </ResponsiveElement>
                                
                                        </div>
                                    )
                                }

                                <div>
                                    <div className='flex justify-end'>
                                        <ResponsiveElement fontSize={6} width={'auto'} height={'auto'} className='text-end pr-[5px]'  style={{fontFamily:"khmerContent"}}>
                                            <div>សរុប/Total</div>
                                        </ResponsiveElement >
                                        <ResponsiveElement width={70} height={'auto'} fontSize={6} className={`font-bold text-end px-[8px] pb-[1px] 
                                        ${invStatus === "partial" || !Number.isNaN(discount) && discount !== 0 ? 'text-black' : 'text-white bg-mainBlue'}`}>
                                                    <div >
                                                    ${grandTotal}
                                                    </div>
                                        </ResponsiveElement>
                                    </div>
                                    <div className={`flex justify-end`}>
                                        <ResponsiveElement fontSize={6} width={'auto'} height={'auto'} className='text-end pr-[5px]'  style={{fontFamily:"khmerContent"}}>
                                            <div>ប្រាក់កក់/Deposite</div>
                                        </ResponsiveElement>
                                        <ResponsiveElement width={70} height={'auto'} fontSize={6} className={`font-bold text-end px-[8px] py-[1px] ${invStatus === "partial" || !Number.isNaN(discount) && discount !== 0 ? "text-black" : "text-white"}`}>
                                                    <div >
                                                        { invStatus !== 'partial' || isNaN(partial) || partial === parseFloat('0.00') ? '$0.00' : `$${partial.toFixed(2)}`}
                                                    </div>
                                        </ResponsiveElement>
                                    </div>
                                    {
                                        !isNaN(discount) && discount !== 0 && (
                                            <div className='flex justify-end'>
                                                <ResponsiveElement fontSize={6} width={'auto'} height={'auto'} className='text-end pr-[5px]'  style={{fontFamily:"khmerContent"}}>
                                                       <div>
                                                       បញ្ចុះតម្លៃ/Discount
                                                       </div>
                                                </ResponsiveElement>
                                                <ResponsiveElement width={70} height={'auto'} fontSize={6} className={`font-bold text-end px-[8px] py-[1px]   text-black`}>
                                                        <div >
                                                            {isNaN(discount) || discount === parseFloat('0.00') ? '$0.00' : `$${discount.toFixed(2)}`}
                                                        </div>
                                                </ResponsiveElement>
                                            </div>
                                        )
                                    }
                                    <div className='flex justify-end'>
                                        <ResponsiveElement fontSize={6} width={'auto'} height={'auto'} className='text-end pr-[5px]'  style={{fontFamily:"khmerContent"}}>
                                            <div>នៅខ្វះ/Balance</div>
                                        </ResponsiveElement>
                                        <ResponsiveElement width={70} height={'auto'} fontSize={6} className={`font-bold text-end px-[8px] py-[1px] ${invStatus === "partial" || !Number.isNaN(discount) && discount !== 0 ? 'bg-mainBlue text-white' : 'text-white'}`}>
                                                <div >
                                                {balance === 'NaN'|| balance ===  '$0.00' ? '' : `$${balance}`}
                                                </div>
                                        </ResponsiveElement>
                                    </div>
                                            <div className={`flex justify-end ${!isNaN(discount) && discount !== 0 ? "hidden" : "invisible"}`}>
                                                <ResponsiveElement fontSize={6} width={'auto'} height={'auto'} className='text-end pr-[5px]'  style={{fontFamily:"khmerContent"}}>
                                                       <div>
                                                       dddd
                                                       </div>
                                                </ResponsiveElement>
                                                <ResponsiveElement width={70} height={'auto'} fontSize={6} className={`font-bold text-end px-[8px] py-[1px]   text-black`}>
                                                        <div >
                                                           dddd
                                                        </div>
                                                </ResponsiveElement>
                                            </div>
                                </div>


                        </div>
                        <ResponsiveElement width={'auto'} height={'auto'} pt={5} className='flex justify-between px-[5px]'>
                                <div>
                                <ResponsiveElement width={'auto'} height={130} className={`${bankInfo === false ? "" : "invisible"} w-full`}>
                                <Image
                                    src={!abaLogo ? '/white.png' : abaLogo}
                                    alt='#'
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    />
                                </ResponsiveElement>
                                    <div>
                                         <ResponsiveElement className={`  ${bankInfo === false ? "" : "invisible"}`} width={200} height={'auto'} fontSize={6} style={{fontFamily:"khmerContent"}}>
                                                               <div>
                                                                    <textarea className='w-full resize-none outline-none overflow-hidden text-end py-[5px]' rows={2} value={busKh}>

                                                                    </textarea><br />
                                                                    <textarea className='w-full resize-none outline-none overflow-hidden text-end' rows={2} value={busEng}>

                                                                    </textarea>                                                  
                                                               </div>
                                                                
                                                </ResponsiveElement>
                                                <ResponsiveElement width={'auto'} height={'auto'} pt={7} className='flex justify-end '>
                                                    <div>
                                                    <ResponsiveElement width={'auto'} height={'auto'} pr={10} className='text-end'>
                                                    <div>
                                                            <div className='flex justify-center invisible'>
                                                            <ResponsiveElement width={'auto'} height={55}>
                                                                <Image src={!sigLogo ? '/white.png' : sigLogo} alt='#'
                                                                    width={0}
                                                                    height={0}
                                                                    sizes="100vw"
                                                                    
                                                                />
                                                            </ResponsiveElement>
                                                            </div>
                                                        {/*****************origin 50x50***************/}
                                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={6} className='text-center' style={{fontFamily:"khmerContent"}}>
                                                            <p>ហត្ថលេខាអ្នកទិញ</p>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement fontSize={6} width={'auto'} height={'auto'} >
                                                            <p>customer signature</p>
                                                        </ResponsiveElement>
                                                    </div>
                                                    </ResponsiveElement>
                                                    <div className='text-center'>
                                                            {/*****************origin 50x50***************/}
                                                            <div className='flex justify-center'>
                                                            <ResponsiveElement width={'auto'} height={55} className={`${signature === true ? "invisible" : ""}`}>
                                                                <Image src={!sigLogo ? '/white.png' : sigLogo} alt='#'
                                                                    width={0}
                                                                    height={0}
                                                                    sizes="100vw"
                                                                    
                                                                />
                                                            </ResponsiveElement>
                                                            </div>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={6} className='text-center' style={{fontFamily:"khmerContent"}}>
                                                                <p >ហត្ថលេខាអ្នកលក់</p>
                                                            </ResponsiveElement>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={6}>
                                                                <p >Seller Signature</p>
                                                            </ResponsiveElement>
                                                            
                                                    </div>
                                                </div>
                                            </ResponsiveElement>
                                        
                                    </div>
                                </div>
                        </ResponsiveElement>
    
            </div>
        </ResponsiveElement>
        </div>
  )
}

export default PrintForm