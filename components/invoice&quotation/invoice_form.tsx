"use client"
import Image from 'next/image';
import React, {  useEffect, useMemo, useState } from 'react'
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
    const {logo , address , onCancel , setPrint , setPrinting , signature , bankInfo , routerSwitch} = useToggle()
    
    const busInfo = useMemo(()=>[
        {
            id:'invBus1',
            label:"Add:",
            val:busAddr,
            clss:`${address === true || busAddr === "" ? "hidden" : ""}`
        },
        {
            id:'invBus2',
            label:"Email:",
            val:busEmail,
            clss:`${address === true || busEmail === "" ? "hidden" : ""}`
        },
        {
            id:'invBus3',
            label:"Tel:",
            val:busPhone,
            clss:`${address === true || busPhone === "" ? "hidden" : ""}`
        },
        {
            id:'invBus4',
            label:"Telegram:",
            val:busTelegram,
            clss:`${address === true || busTelegram === "" ? "hidden" : ""}`
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

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
          event.preventDefault();
          if (event.key === 'Backspace') {
            setPrinting('')
            onCancel()
            setPrint(false)
          }
        };
    
        window.addEventListener('keydown', handleKeyPress);
    
        return () => {
          window.removeEventListener('keydown', handleKeyPress);
        };
      }, []);

  return ( 

      <div className={`bg-white cart ${routerSwitch === 'invoice' ? 'cartInv' : 'cartDe'}`}>
        
        <div className="flex justify-between ">
          {
            logo === true ? (
                <div className="flex items-start ">
                <h1 className={`inv ${routerSwitch === 'invoice' ? 'invOn' : 'dnOn'}`}>{routerSwitch === 'invoice' ? 'INVOICE' : routerSwitch === 'delivery' ? 'DELIVERY NOTE' : ''}</h1>
              </div>
            ) : (
                <div className="img">
                <Image src={!busLogo ? '/white.png' : busLogo} alt="#" width={400} height={400}/>
               </div>
            )
          }
          <div className="flex-row justify-start">
            <textarea value={busDes} className="bg-transparent font-[khmerContent] des text-end  outline-none resize-none overflow-hidden">
            
            </textarea>
          </div>
        </div>

        <div className="flex  justify-between items-end">
        <div>
        <p className={`${routerSwitch === 'invoice' ? 'inv' : 'de'} ${logo === false ? '' : 'invisible'}`}>
         {routerSwitch === 'invoice' ? 'INVOICE' : routerSwitch === 'delivery' ? 'DELIVERY NOTE' : ''}
        </p>
        <p className="invNo">No. {invNo}</p>
        </div>
        <p className="invNo">Date. {dateFormat(invDate === undefined ? '' : invDate)}</p>
        </div>

        <div className="flex justify-between items-end ptop">



        <div>
            <p className={`cusInfo ${cusName === "" ? "invisible" : "hidden"}`}>At: ដាដាដាដឹា</p>
            <p className={`cusInfo ${cusComp === "" ? "invisible" : "hidden"}`}>To: Grab</p>
            <p className={`cusInfo ${cusPhone === "" ? "invisible" : "hidden"}`}>Tel: 0712338932</p>
            <p className={`cusInfo ${cusEmail === "" ? "invisible" : "hidden"}`}>Email: renko@gmail.com</p>
            <div className={`flex cusInfo ${cusAddr === "" ? "invisible" : "hidden"}`}>
            <p>Add:</p>
            <textarea className="outline-none textarea0 resize-none bg-transparent overflow-hidden" rows={3}>
                dhwajkdhajkjakwdajkwha
                dwajkldajdklwajdlkwajdakjdw
                dwajkldwajkldawjldjdawldj
            </textarea>
            </div>
            <p className={`cusInfo ${invPo === "" ? "invisible" : "hidden"}`}>Po: t-323932</p>
            {
              cusInfo.map((item)=>{
                return(
                    <React.Fragment key={item.label}>
                        {
                            item.label !== 'Add:' ? (
                                <p className={`cusInfo ${item.class} ${!item.val ? "hidden" : ''}`}>{item.label} {item.val}</p>
                            ) : (
                                <div className={`flex cusInfo ${item.class} ${!item.val ? "hidden" : ''}`}>
                                    <p>{item.label}</p>
                                    <textarea className="outline-none textarea0 resize-none bg-transparent overflow-hidden" rows={3} value={item.val}>
                                    </textarea>
                                </div>
                            )
                        }
                    </React.Fragment>
                )
              })  
            }  

        </div>


        
        <div className='text-end'>
        
        <div className={`text-end`}>
        <div className={`flex busInfo ${busAddr === "" ? "invisible" : "hidden"}`}>
          <p>Add:</p>
          <textarea className="outline-none textarea1 text-end resize-none bg-transparent overflow-hidden" rows={2}>
            dhwajkdhajkjakwdajkwha
            dwajkldajdklwajdlkwajdakjdw
          </textarea>
          </div>
          <p className={`busInfo ${busEmail === "" ? "invisible" : "hidden"}`}>Email: renko@gmail.com</p>
          <p className={`busInfo ${busPhone === "" ? "invisible" : "hidden"}`}>Tel: 088224224 | 0712338932</p>
          <p className={`busInfo ${busTelegram === "" ? "invisible" : "hidden"}`}>Telegram: 233892</p>
        </div>

        {
            busInfo.map((item)=>{
                return(
                    <React.Fragment key={item.label}>
                        {
                            item.label !== 'Add:' ? (
                                <div className={`busInfo ${item.clss}`}>
                                    {item.label} {item.val}
                                </div>
                            ) : (
                                <div className={`flex busInfo ${item.clss}`}>
                                    <p>{item.label}</p>
                                    <textarea className="outline-none textarea1 text-end resize-none bg-transparent overflow-hidden" rows={2} value={item.val}>
                                    </textarea>
                                </div>
                            )
                        }
                    </React.Fragment>
                )
            })
        }
        </div>


        </div>
       
       <div>
          <table className="w-full table0">
            <thead className="bg-mainBlue thead0 text-white">
              {
                busType === 'meter' && (
                    <tr>
                        <th className="text-center ">No.</th>
                        <th className="text-start">Description</th>
                        <th className='text-center'>Size cm</th>
                        <th className='text-center'>M2</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Unit Price</th>
                        <th className="text-end pr-[10px]">Total Amount</th>
                    </tr>
                )
              }
              {
                busType === 'general' && (
                    <tr>
                        <th className="text-center ">No.</th>
                        <th className="text-start">Description</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Unit Price</th>
                        <th className="text-end pr-[10px]">Total Amount</th>
                    </tr>
                )
              }
            </thead>
            <tbody className="tbody0">
            {
                busType === 'meter' && (
                    <>
                    {
                        arr.map((item,i)=>{
                            return(
                                <tr key={item.id} draggable="true" onDragStart={(e)=>handleDragStart(e,item.id)} onDragOver={handleDragOver} onDrop={(e)=>handleDrop(e,item.id)}>
                                    <td className={`${i === 0 ? 'pt' : ''} text-center`}>{i + 1}</td>
                                    <td className={`${i === 0 ? 'pt' : ''} text-start`}>{!item.description ? '' : item.description.length < 44 ? item.description : <input className='outline-none leading-7'  value={item.description}/> }</td>
                                    <td>
                                        <div className='flex items-center justify-center'>
                                            <div>{item.sizeWidth === 0 ? "" : item.sizeWidth}</div>
                                                <p className='px-[2px]'>{item.sizeHeight && item.sizeWidth ? "x" : ""}</p>
                                            <div>{item.sizeHeight === 0 ? "" : item.sizeHeight}</div>
                                        </div>
                                    </td>
                                    <td className={`${i === 0 ? 'pt' : ''} text-center`}>{item.m2 === 0 ? "" : item.m2?.toFixed(2)}</td>
                                    <td className={`${i === 0 ? 'pt' : ''} text-center`}>{item.quantity === "" ? "" : item.quantity}</td>
                                    <td className={`${i === 0 ? 'pt' : ''} text-end`}>{item.unitPrice} </td>
                                    <td className={`${i === 0 ? 'pt' : ''} text-end pr-[12px]`}>{item.total}</td>
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
                                <tr  key={item.id} draggable="true" onDragStart={(e)=>handleDragStart(e,item.id)} onDragOver={handleDragOver} onDrop={(e)=>handleDrop(e,item.id)}>
                                    <td className={` text-center`}>{i + 1}</td>
                                    <td className={` text-start`}>{!item.description ? "" : item.description.length < 44 ? item.description : <input className='w-[220px] outline-none' value={item.description}/>}</td>
                                    <td className={` text-center`}>{item.quantity === "" ? "" : item.quantity}</td>
                                    <td className={` text-end`}>{item.unitPrice}</td>
                                    <td className={` text-end pr-[12px]`}>{item.total}</td>
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
                                        <td className={` text-center invisible`}>n</td>
                                        <td className={` text-start invisible`}>n</td>
                                        <td className={` text-center invisible`}>n</td>
                                        <td className={` text-end invisible`}>n</td>
                                        <td className={` text-end pr-[12px] invisible`}>n</td>
                                    </tr>
                                )
                            }
                    return row
                })()
            }
            </tbody>
          </table>
       </div>

        <div className="flex justify-between money">
              {
                bankInfo === false ? (
                  <div className="flex">
                      <Image 
                          className="aba"
                          width={400} 
                          height={400} 
                          alt='#' 
                          src="https://bankerjobs.asia/storage/files/kh/7/thumb-816x460-8bb28995e73226227d77d1c107b05228.png"
                      />
                      <div>
                            <p className='abaText'>{bankdes}</p>
                            <p className='abaText'>Account: {abaNumber}</p>
                            <p className='abaText'>Name: {abaName}</p>
                      </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-start items-start">
                   <div className={`flex justify-start `}>
                  <textarea className="outline-none resize-none text-start overflow-hidden bg-transparent eng" rows={2} value={busKh}>
                  </textarea>
                  </div>
                  <div className={`flex justify-start `}>
                  <textarea className="outline-none resize-none text-start overflow-hidden bg-transparent kh" rows={2} value={busEng}>
                  </textarea>
                  </div>
                  </div>
                )
              }

              <div>
                <div className="flex justify-end items-center"><p className="totalinging font-[khmerContent] ">សរុប/Total</p><p className={`totaling font-semibold ${invStatus === "partial" || !Number.isNaN(discount) && discount !== 0 ? 'text-black' : 'text-white bg-mainBlue'}`}>${grandTotal}</p></div>
                <div className="flex justify-end items-center"><p className="totalinging font-[khmerContent]">ប្រាក់កក់/Deposite</p><p className={`totaling font-semibold ${invStatus === "partial" || !Number.isNaN(discount) && discount !== 0 ? "text-black" : "text-white"}`}>{ invStatus !== 'partial' || isNaN(partial) || partial === parseFloat('0.00') ? '$0.00' : `$${partial.toFixed(2)}`}</p></div>
                {
                    !isNaN(discount) && discount !== 0 && (
                        <div className="flex justify-end items-center"><p className="totalinging font-[khmerContent] ">បញ្ចុះតម្លៃ/Discount</p><p className="totaling font-semibold">{isNaN(discount) || discount === parseFloat('0.00') ? '$0.00' : `$${discount.toFixed(2)}`}</p></div>
                    )
                }
                <div className="flex justify-end items-center"><p className="totalinging font-[khmerContent] ">នៅខ្វះ/Balance</p><p className={`totaling font-semibold ${invStatus === "partial" || !Number.isNaN(discount) && discount !== 0 ? 'bg-mainBlue text-white' : 'text-white'}`}>{balance === 'NaN'|| balance ===  '$0.00' ? '' : `$${balance}`}</p></div>
                <div className={`flex justify-end items-center ${!isNaN(discount) && discount !== 0 ? 'hidden' : 'invisible'}`}>
                <p className="totalinging font-[khmerContent] ">បញ្ចុះតម្លៃ/Discount</p><p className="totaling font-semibold">0</p>
                </div>
              </div>
        </div>

        <div className="flex justify-between qrdes">
          <Image
          className={`qr ${bankInfo === false ? '' : 'invisible'}`}
          src={!abaLogo ? '/white.png' : abaLogo}
          alt="#"
          width={400}
          height={400}
          />
          <div className="flex-row justify-end items-end">
            <div className={`flex justify-end ${bankInfo === false ? '' : 'invisible'}`}>
            <textarea className="outline-none resize-none text-end overflow-hidden bg-transparent eng" rows={2} value={busKh}>
            </textarea>
            </div>
            <div className={`flex justify-end ${bankInfo === false ? '' : 'invisible'}`}>
            <textarea className="outline-none resize-none text-end overflow-hidden bg-transparent kh" rows={2} value={busEng}>
            </textarea>
            </div>
            <div className="flex justify-end gap-7">
              <div className="flex flex-col justify-center items-center">
                <Image className="sigImg !invisible" src='/signature.png' alt="#" width={50} height={50}/>
                <p className="sigText">ហត្ថលេខាអ្នកទិញ</p>
                <p className="sigText">Customer Signature</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <Image className={`sigImg ${signature === false ? '' : 'invisible'}`} src={!sigLogo ? '/white.png' : sigLogo} alt="#" width={50} height={50}/>
                <p className="sigText">ហត្ថលេខាអ្នកលក់</p>
                <p className="sigText">Seller Signature</p>
              </div>
            </div>
          </div>
      </div>
      </div>                        

  )
}

export default PrintForm