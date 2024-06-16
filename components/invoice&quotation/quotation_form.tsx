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

type desProps = {
    id:string;
    text:string
}

type invFormProps = {
    ///invoice form
    cusName?:string;
    cusComp?:string;
    items?:tableProps[];
    cusPhone?:string;
    cusEmail?:string;
    cusAddr?:string;
    invNo?:string;
    invDate?:string;
    busDes?:string;
    //// ur infomation
    busAddr?:string;
    busEmail?:string;
    busTelegram?:string;
    busPhone?:string;
    busType?:string;
    /// grand totals
    grandTotal?:string;
    ////Toggle 
    toggleEmail?:boolean;
    toggleAddr?:boolean;
    toggleName?:boolean;
    toggleComp?:boolean;
    togglePhone?:boolean;
    des:desProps[]
    setDes: React.Dispatch<React.SetStateAction<desProps[]>>
    busLogo?:string;
    sigLogo?:string;
    ///picture
    oldImg?:string;
    oldImg1?:string;
    img1?:string
    img2?:string
  }

const QuotationForm = ({
    toggleAddr,
    toggleEmail,    
    toggleName,
    toggleComp,
    togglePhone,
    des,
    setDes,
    grandTotal,
    busType,
    items,
    invNo,
    invDate, 
    cusName ,
    cusComp , 
    cusPhone , 
    cusEmail , 
    cusAddr,
    busLogo,
    sigLogo,
    oldImg,
    oldImg1,
    img1,
    img2,
    busDes
}:invFormProps) => {
    const {logo , address , signature , employee} = useToggle()
    const [val , setVal] = useState({
        staffName:'wdad',
        staffPhone:'dwada',
        busAddr:'dwadad',
        busEmail:'dwada',
        busTel:'dwadadad',
        busTelegram:''
    })
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
            class:"text-center 2xl!:text-[14px] border-l-[1px] border-black"
        },
        {
            label:"M2",
            class:"text-center 2xl!:text-[14px] border-l-[1px] border-black"
        },
        {
            label:"Qty",
            class:'text-center 2xl!:text-[14px] border-l-[1px] border-black'
        },
        {
            label:"Unit Price",
            class:'text-center 2xl!:text-[14px] border-l-[1px] border-black'
        },
        {
            label:"Total Amount",
            class:'text-center  2xl!:text-[14px] border-l-[1px] border-black'
        }
    ],[])
    
    const busInfo = useMemo(()=>[
        {
            id:'qtForm1',
            label:"Name:",
            val:"dawdawdada",
            clss:`${employee === true || val.staffName === "" ? "!hidden" : ""}`
        },
        {
            id:'qtForm2',
            label:"Tel:",
            val:"dawdawdada",
            clss:`${employee === true || val.staffPhone === "" ? "!hidden" : ""}`
        },
        {
            id:'qtForm3',
            label:"Add:",
            val:"dawdawdada",
            clss:`${address === true || val.busAddr === "" ? "!hidden" : ""}`
        },
        {
            id:'qtForm4',
            label:"Email:",
            val:"dawdawdada",
            clss:`${address === true || val.busEmail === "" ? "!hidden" : ""}`
        },
        {
            id:'qtForm5',
            label:"Tel:",
            val:"dawdawdada",
            clss:`${address === true || val.busTel === "" ? "!hidden" : ""}`
        },
        {
            id:'qtForm6',
            label:"Telegram",
            val:"dawdawda",
            clss:`${address === true || val.busTelegram === "" ? "!hidden" : ""}`
        }
    ],[val,employee,address])
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
        },
    ],[cusName , cusComp , cusPhone , cusEmail , cusAddr ,toggleAddr,toggleEmail])
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
    const handleDropDes = (e: React.DragEvent<HTMLTableRowElement>, targetId: string) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        const updatedRows = [...des];
        const draggedRow = updatedRows.find((row) => row.id === draggedId);
        if (!draggedRow) return;
        const targetIndex = updatedRows.findIndex((row) => row.id === targetId);
        updatedRows.splice(updatedRows.indexOf(draggedRow), 1);
        updatedRows.splice(targetIndex, 0, draggedRow);
        setDes(updatedRows);
      };
    const desTop = [
        {
           label:"No.",
           class:"text-start pl-2"
        },
        {
           label:"Description",
           class:'text-start pl-2'
        },
    ]
   let test2 = cusInfo.reduce((a:number[], e ,i)=>(e.val !== "") ? a.concat(i) : a ,[])
   let test3 = busInfo.reduce((a:number[], e, i)=>(e.val !== "") ? a.concat(i) : a ,[])
  return ( 
    <>
        <ResponsiveElement width={490}  height={'auto'} px={30} py={20} className='bg-white '>
            <div>
            <div className='flex justify-between'>
                            <div className='flex justify-start items-center'>
                                {
                                    logo === true ? (
                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={30}  pb={39.5} className='font-semibold'>
                                            <h1 >Quotation</h1>
                                        </ResponsiveElement>
                                    ) : (
                                        <ResponsiveElement width={'auto'} height={94}>
                                            <Image src={!busLogo ? '/white.png' : busLogo} alt='#' width={0} height={0} sizes="100vw"/>
                                        </ResponsiveElement>
                                    )
                                }
                                
                                {/*****************Image size w-160 h-160**************/}
                            </div>
                            <div className='text-end'>
                                <ResponsiveElement leading={27} width={270} height={110} fontSize={8} className='text-end pt-[20pxs] p-4 !pr-0 resize-none outline-none overflow-hidden' style={{fontFamily:"khmerContent"}}>
                                <textarea>
                                     {busDes}
                                    </textarea>
                                </ResponsiveElement>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 pb-[5px]  px-[5px]'>
                            <div className='col-span-1'>
                                {
                                    logo === false && (
                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={17} className='font-bold'>
                                        <h1 >QUOTATION</h1>
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
                            <div className='col-span-1  flex flex-col justify-end'>
                                {(()=>{
                                    let row = []
                                    for(let i = 5; i > (test2?.length || 0); i--){
                                        row.push(
                                            <div key={crypto.randomUUID()} className={`flex pl-[5px] justify-start items-center invisible`} style={{fontFamily:"khmerContent"}}>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={8}>
                                                    <p>mp</p>
                                                </ResponsiveElement>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7}>
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
                                            <div key={item.id} className={`${item.class} ${!item.val ? "hidden" : "flex"} pl-[5px] justify-start items-center gap-1`} style={{fontFamily:"khmerContent"}}>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7}>
                                                    <p>{item.label}</p>
                                                </ResponsiveElement>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7}>
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
                                    employee === true && (
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
                                        </>
                                    )
                                }
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
                                        </>
                                    )
                                }
                                {(()=>{
                                    let row = []
                                    for(let i = 5; i > (test3?.length || 0); i--){
                                        row.push(
                                            <div key={crypto.randomUUID()} className={`flex pl-[5px] justify-start items-center invisible`} style={{fontFamily:"khmerContent"}}>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={8}>
                                                    <p>mp</p>
                                                </ResponsiveElement>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7}>
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
                                            <div key={item.id} className={`flex pl-[5px] justify-end ${item.clss} items-center gap-1`} style={{fontFamily:"khmerContent"}}>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7}>
                                                    <p>{item.label}</p>
                                                </ResponsiveElement>
                                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} className='text-end'>
                                                    <p>{item.val}</p>
                                                </ResponsiveElement>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            </div>
                        </div>
                        <ResponsiveElement width={'full'} height={'auto'} mt={3} className='border border-black'>
                        <table className='w-full mt-[3px] lg:mt-[5px] md:mt-[5px] 2xl:mt-[10px] '>
                                <thead>
                                    <tr>
                                        {
                                            desTop.map((item)=>{
                                                return(
                                                <ResponsiveElement key={crypto.randomUUID()} width={'auto'} height={'auto'} fontSize={8.3} className={`bg-mainBlue text-white font-bold ${item.class}`}>
                                                    <th>{item.label} </th>
                                                </ResponsiveElement>
                                                )
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        des?.map((item,index)=>{
                                            return(
                                                <tr key={item.id} draggable="true"
                                                onDragStart={(e)=>handleDragStart(e,item.id)}
                                                onDragOver={handleDragOver}
                                                onDrop={(e)=>handleDropDes(e,item.id)}>
                                                    <ResponsiveElement fontSize={7} width={'auto'} height={'auto'} py={1} className='text-start pl-3 2xl:!text-[16px]'>
                                                        <td>{index + 1}</td>
                                                    </ResponsiveElement>
                                                    <ResponsiveElement width={'full'} height={'auto'} fontSize={7} py={1} className='text-start 2xl:!text-[16px] pl-2' style={{fontFamily:"khmerContent"}}>
                                                        <td >{item.text}</td>
                                                    </ResponsiveElement>
                                                    
                                                </tr>
                                            )
                                        })
                                    }
                                    {
                                            (()=>{
                                                let row = []
                                                for(let i = 5; i > (des?.length || 0) ; i--){
                                                    row.push(
                                                        <tr key={crypto.randomUUID()}>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px]'>
                                                            <td><div className='invisible'>No</div></td>
                                                            </ResponsiveElement>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px] '>
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
                        </ResponsiveElement>

    
                        <ResponsiveElement width={'full'} height={'auto'} mt={3}>
                        <table>
                            <thead className='border-t-[1px] border-x-[1px] bg-blue-950 text-white border-black'>
                                <tr>
                                {
                                        busType === "meter" && (
                                            <>
                                            {
                                            meters.map((item)=>{
                                                    return(
                                                            <ResponsiveElement key={crypto.randomUUID()} width={'auto'} height={'auto'} fontSize={8.3} className={`bg-mainBlue text-white font-bold ${item.class}`}>
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
                                                            <ResponsiveElement key={crypto.randomUUID()} width={'auto'} height={'auto'} fontSize={8.3} className={`bg-mainBlue text-white font-bold ${item.class}`}>
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
                            <tbody className='border-b-[1px] border-x-[1px] border-black'>
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
                                                        <ResponsiveElement fontSize={7} width={'auto'} height={'auto'} py={1} className='text-start pl-3 2xl:!text-[16px]'>
                                                        <td >
                                                            {i+1}
                                                        </td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement width={150} height={'auto'} fontSize={7} py={1} className='text-start 2xl:!text-[16px]' style={{fontFamily:"khmerContent"}}>
                                                            <td>
                                                                {item.description}
                                                            </td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px] border-l-[1px] border-black'>
                                                            <td>
                                                                <div className='flex items-center justify-center'>
                                                                <div>{item.sizeWidth === 0 ? "" : item.sizeWidth}</div>
                                                                    <p className='px-[5px]'>{item.sizeHeight && item.sizeWidth ? "x" : ""}</p>
                                                                    <div>{item.sizeHeight === 0 ? "" : item.sizeHeight}</div>
                                                                </div>
                                                            </td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} px={5} py={1} className='text-center  2xl:!text-[16px] border-l-[1px] border-black'>
                                                            <td>{item.m2 === 0 ? "" : item.m2?.toFixed(2)}</td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='text-center  2xl:!text-[16px] border-l-[1px] border-black'>
                                                            <td>{item.quantity === "" ? "" : item.quantity}</td>
                                                        </ResponsiveElement>
                                                    
                                                        <ResponsiveElement className='text-end  2xl:!text-[16px] border-l-[1px] border-black pr-3' fontSize={7} py={1} width={'auto'} height={'auto'}>
                                                            <td>{item.unitPrice} </td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement className='text-end pr-3  2xl:!text-[16px] border-l-[1px] border-black' fontSize={7} py={1} width={'auto'} height={'auto'}>
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
                                                        <ResponsiveElement fontSize={7} width={'auto'} height={'auto'} py={1} className='text-start pl-3'>
                                                        <td >
                                                            {i+1}
                                                        </td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement width={240} height={'auto'} fontSize={7} py={1} className='text-start '>
                                                            <td>
                                                            {item.description}
                                                            </td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='text-center border-l-[1px] border-black'>
                                                            <td>{item.quantity === "" ? "" : item.quantity}</td>
                                                        </ResponsiveElement>
                                                    
                                                        <ResponsiveElement className='text-end pr-2 border-l-[1px] border-black' fontSize={7} py={1} width={'auto'} height={'auto'}>
                                                            <td>{item.unitPrice} </td>
                                                        </ResponsiveElement>
                                                        <ResponsiveElement className='text-end pr-2 border-l-[1px] border-black' fontSize={7} py={1} width={'auto'} height={'auto'}>
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
                                            (()=>{
                                                let row = []
                                                for(let i = 6; i > (items?.length || 0) ; i--){
                                                    row.push(
                                                        <tr key={crypto.randomUUID()}>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px]'>
                                                            <td><div className='invisible'>No</div></td>
                                                            </ResponsiveElement>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px]'>
                                                            <td><div className='invisible'>No</div></td>
                                                            </ResponsiveElement>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px] border-l-[1px] border-black'>
                                                            <td><div className='invisible'>No</div></td>
                                                            </ResponsiveElement>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px] border-l-[1px] border-black'>
                                                            <td><div className='invisible'>No</div></td>
                                                            </ResponsiveElement>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px] border-l-[1px] border-black'>
                                                            <td><div className='invisible'>No</div></td>
                                                            </ResponsiveElement>
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
                                    busType === 'meter' && (
                                        <>
                                        {
                                            (()=>{
                                                let row = []
                                                for(let i = 6; i > (items?.length || 0) ; i--){
                                                    row.push(
                                                        <tr key={crypto.randomUUID()}>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px]'>
                                                            <td><div className='invisible'>No</div></td>
                                                            </ResponsiveElement>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px]'>
                                                            <td><div className='invisible'>No</div></td>
                                                            </ResponsiveElement>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px] border-l-[1px] border-black'>
                                                            <td><div className='invisible'>No</div></td>
                                                            </ResponsiveElement>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px] border-l-[1px] border-black'>
                                                            <td><div className='invisible'>No</div></td>
                                                            </ResponsiveElement>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px] border-l-[1px] border-black'>
                                                            <td><div className='invisible'>No</div></td>
                                                            </ResponsiveElement>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px] border-l-[1px] border-black'>
                                                            <td><div className='invisible'>No</div></td>
                                                            </ResponsiveElement>
                                                            <ResponsiveElement width={'auto'} height={'auto'} fontSize={7} py={1} className='2xl:!text-[16px] border-l-[1px] border-black'>
                                                            <td><div className='invisible'>No</div></td>
                                                            </ResponsiveElement>
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
                                    <ResponsiveElement width={'auto'} height={'auto'} fontSize={6} className={`mb-[5px] ${!img1 && !img2 && !oldImg && !oldImg1 ? 'invisible' : ''}`}>
                                        <p>Production Sample Artwork</p>
                                    </ResponsiveElement>
                                    <div className='flex'>
                                    <ResponsiveElement width={'auto'} height={70} className={`border-[5px] !border-b-[10px] border-white ${!img1 && !oldImg ? 'invisible' : ''}`}>
                                        <Image
                                            src={img1 ? img1 : oldImg ? oldImg : '/bocchi.jpg'}
                                            alt='#'
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            style={{ width: "auto", height: "10%" }}
                                        />
                                    </ResponsiveElement>
                                    <ResponsiveElement width={'auto'} height={70} className={`border-[5px] !border-b-[10px] border-white ${!img2 && !oldImg1 ? 'invisible' : ''}`}>
                                        <Image
                                            src={img2 ? img2 : oldImg1 ? oldImg1 : '/bocchi.jpg'}
                                            alt='#'
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            style={{ width: "auto", height: "10%" }}
                                        />
                                    </ResponsiveElement>
                                    
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
                               
                                <td className='text-start ' rowSpan={3} colSpan={busType === 'meter' ? 5 : 3}>
                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={5.8} className='font-bold'>
                                <p >Note: Payment term:</p>
                                </ResponsiveElement>
                                <ResponsiveElement width={250} height={'auto'} fontSize={4.7} >
                                    <p >
                                    Deposite 50% and full payment after finished the project
                                    we are looking forward to hearing from you. and we hope to
                                    have a good collaboration with you in the nearest future
                                    Thanks for your time and consideration of our company
                                    </p>
                                    </ResponsiveElement>
                                </td>
                            
                                <ResponsiveElement width={'auto'} height={'auto'} fontSize={9} className='text-end font-bold'>
                                <td className='text-end'>Total:</td>
                                </ResponsiveElement>
                                
                                <td >
                                    <ResponsiveElement width={'auto'} height={'auto'} fontSize={8} className='text-white text-end   bg-mainBlue font-bold border-x-[1px] border-b-[1px] border-black pr-2 xl:h-[15px] 2xl:h-[20px]'>
                                    <div >${grandTotal}</div>
                                    </ResponsiveElement>
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
                                    <div className='h-[38px] xl:h-[58px] border-b-2'>
                                    
                                    </div>
                                    <ResponsiveElement width={'auto'} height={'auto'} fontSize={7}>
                                    <p className='text-center '>{"Customer's Signature"}</p>
                                    </ResponsiveElement>
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
                                    <div className='flex justify-center'>
                                    <ResponsiveElement width={'auto'} height={55} className={`${signature === true ? "invisible" : ""}`}>
                                        <Image src={!sigLogo ? '/white.png' : sigLogo} alt='#'
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            
                                        />
                                    </ResponsiveElement>
                                    </div>
                                    <ResponsiveElement width={'auto'} height={'auto'} fontSize={7}>
                                    <p className='text-center '>Authorized Signature</p>
                                    </ResponsiveElement>
                                    </div>
                                </div>
                                </td>

                                </tr>
                            </tfoot>
                            </table>
                        </ResponsiveElement>







                                
            </div>
        </ResponsiveElement>
        </>
  )
}

export default QuotationForm