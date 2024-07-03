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
    busPayTerm?:string;
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
    /////staff info
    staffName:string;
    staffPhone:string;
    
    oldImg?:string;
    oldImg1?:string;
    img1?:string
    img2?:string
    ////busPhone
    busPhone2?:string;
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
    busPayTerm,
    cusComp , 
    staffName,
    staffPhone,
    cusPhone , 
    cusEmail , 
    cusAddr,
    busLogo,
    sigLogo,
    oldImg,
    oldImg1,
    img1,
    img2,
    busDes,
    busAddr,
    busEmail,
    busPhone,
    busPhone2,
    busTelegram
}:invFormProps) => {
    const {logo , address , setPrint , setPrinting , onCancel, signature , employee} = useToggle()
    
    const busInfo = useMemo(()=>[
        {
            id:'qtForm1',
            label:"",
            val:staffName,
            clss:`${employee === true || staffName === "" ? "hidden" : ""}`
        },
        {
            id:'qtForm2',
            label:"Tel:",
            val:staffPhone,
            clss:`${employee === true || staffPhone === "" ? "hidden" : ""}`
        },
        {
            id:'qtForm3',
            label:"Add:",
            val:busAddr,
            clss:`${address === true || busAddr === "" ? "hidden" : ""}`
        },
        {
            id:'qtForm4',
            label:"Email:",
            val:busEmail,
            clss:`${address === true || busEmail === "" ? "hidden" : ""}`
        },
        {
            id:'qtForm5',
            label:"Tel:",
            val:`${busPhone} | ${busPhone2}`,
            clss:`${address === true || busPhone === "" ? "hidden" : ""}`
        },
        {
            id:'qtForm6',
            label:"Telegram",
            val:busTelegram,
            clss:`${address === true || busTelegram === "" ? "hidden" : ""}`
        }
    ],[employee, address, staffName , staffPhone , busAddr , busEmail , busPhone , busTelegram])
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

        <div className='cart1 bg-white'>
         

        <div className='flex justify-between'>
            {
                logo === true ? (
                    <div className='flex items-start'>  
                        <h1 className='qt'>QUOTATION</h1>
                    </div>
                ) : (
                     <Image src={!busLogo ? '/white.png' : busLogo} className="img qtImge" alt="#" width={400} height={400}/>
                )
            }
              <div className="flex-row justify-start">
            <textarea value={busDes} className="bg-transparent font-[khmerContent] des text-end  outline-none resize-none overflow-hidden">
            </textarea>
          </div>
            </div>


            <div className="flex  justify-between items-end">
                <div>
                <p className={`inv ${logo === false ? '' : 'invisible'}`}>QUOTATION</p>
                <p className="invNo">No. {invNo}</p>
                </div>
                <p className="invNo">Date. {dateFormat(invDate === undefined ? '' : invDate)}</p>
            </div>



            <div className="flex justify-between items-end ptop">
                
                <div >
                <p className={`cusInfo ${cusName === "" ? "invisible" : "hidden"}`}>At: ដាដាដាដឹា</p>
                <p className={`cusInfo ${cusComp === "" ? "invisible" : "hidden"}`}>To: Grab</p>
                <p className={`cusInfo ${cusPhone === "" ? "invisible" : "hidden"}`}>Tel: 0712338932</p>
                <p className={`cusInfo ${cusEmail === "" ? "invisible" : "hidden"}`}>Email: renko@gmail.com</p>
                <div className={`flex cusInfo ${cusAddr === "" ? "invisible" : "hidden"}`}>
                <p>Add:</p>
                <textarea className="outline-none textarea0 resize-none bg-transparent overflow-hidden" rows={4}>
                    dhwajkdhajkjakwdajkwha
                    dwajkldajdklwajdlkwajdakjdw
                    dwajkldwajkldawjldjdawldj
                </textarea>
                </div>

                {
                    cusInfo.map((item)=>{
                        return(
                            <React.Fragment key={item.label}>
                                {
                                    item.label !== 'Add:' ? (
                                        <p className={`cusInfo ${item.class} ${!item.val ? "hidden" : ''}`}>{item.label} {item.val}</p>
                                    ) : (
                                        <div className={`flex cusInfo ${item.class} ${!item.val ? "hidden" : ''}`}>
                                            <p>Add:</p>
                                            <textarea className="outline-none textarea0 resize-none bg-transparent overflow-hidden" rows={4} value={item.val}>

                                            </textarea>
                                        </div>
                                    )
                                }
                            </React.Fragment>
                        )
                    })
                }

                </div>


                <div className={`text-end`}>
                <div className={employee === false ? '' : 'hidden'}>
                <p className={`staffInfo ${staffName === '' ? 'invisible' : 'hidden'}`}>Mov</p>
                <p className={`staffInfo ${staffPhone === '' ? 'invisible' : 'hidden'}`}>Tel: 0867617822</p>
                
                </div>
           
                <div className={`text-end`}>
                <div className={`flex busInfo ${busAddr === '' ? 'invisible' : 'hidden'}`}>
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
            
            <table className='w-full table0 border border-black qtDes'>
                <thead className='bg-mainBlue thead0 text-white'>
                    <tr>
                        <th className='th1'></th>
                        <th className='text-start'>Description</th>
                    </tr>
                </thead>
                <tbody className='tbody0'>
                    {
                        des.map((item , i)=>{
                            return(
                                <tr key={item.id} draggable="true"
                                                onDragStart={(e)=>handleDragStart(e,item.id)}
                                                onDragOver={handleDragOver}
                                                onDrop={(e)=>handleDropDes(e,item.id)}>
                                    <td className={`text-center ${i === 0 ? 'pt' : 'py'}`}>{i === 0 ? '' : '-'}</td>
                                        <td className={`text-start ${i === 0 ? 'pt' : 'py'}`}>{item.text}</td>
                                </tr>
                            )
                        })
                    }
                    {
                        (()=>{
                        let row = []
                        for(let i = 6; i > (des?.length || 0) ; i--){
                                row.push(
                                        <tr key={crypto.randomUUID()}>
                                            <td className={`text-center py invisible`}>{i === 0 ? '' : '-'}</td>
                                            <td className={`text-start py invisible`}>dwadadad</td>
                                        </tr>
                                    )
                                }
                            return row
                        })()
                    }
                </tbody>
            </table>
            <table className='w-full table0 qtCal '>
                <thead className='bg-mainBlue thead0 text-white border-t-[1px] border-x-[1px] border-black'>
                    {
                        busType === 'meter' && (
                            <tr>
                                <th className='th1'></th>
                                <th className='text-start'>Item Description</th>
                                <th className='text-center border-l-[1px] border-black'>Size cm</th>
                                <th className='text-center border-l-[1px] border-black'>M2</th>
                                <th className='text-center border-l-[1px] border-black'>Qty</th>
                                <th className='text-end border-l-[1px] border-black theadUnitprice'>Unit Price</th>
                                <th className='text-end border-l-[1px] border-black theadTotal'>Total Amount</th>
                            </tr>
                        )
                    }
                    {
                        busType === 'general' && (
                            <tr>
                                <th className='th1'></th>
                                <th className='text-start'>Item Description</th>
                                <th className='text-center border-l-[1px] border-black'>Qty</th>
                                <th className='text-end border-l-[1px] border-black theadUnitprice'>Unit Price</th>
                                <th className='text-end border-l-[1px] border-black theadTotal'>Total Amount</th>
                            </tr>
                        )
                    }
                </thead>
                <tbody className='tbody0 border-b-[1px] border-x-[1px] border-black'>
                    {
                        busType === 'meter' && (
                            <>
                            {
                                arr.map((item,i)=>{
                                    return(
                                        <tr key={item.id} 
                                        draggable="true"
                                        onDragStart={(e)=>handleDragStart(e,item.id)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e)=>handleDrop(e,item.id)}>
                                            <td className={`text-center ${i === 0 ? 'pt' : 'py'}`}>{i + 1}</td>
                                            <td className={`text-start ${i === 0 ? 'pt' : 'py'}`}>{!item.description ? "" : item.description.length < 44 ? item.description : <input value={item.description} className='w-[180px] outline-none'/>}</td>
                                            <td className='border-l-[1px] border-black'>
                                                <div className='flex items-center justify-center'>
                                                    <div>{item.sizeWidth === 0 ? "" : item.sizeWidth}</div>
                                                        <p className='px-[2px]'>{item.sizeHeight && item.sizeWidth ? "x" : ""}</p>
                                                    <div>{item.sizeHeight === 0 ? "" : item.sizeHeight}</div>
                                                </div>
                                            </td>
                                            <td className={`border-l-[1px] text-center border-black ${i === 0 ? 'pt' : 'py'}`}>{item.m2 === 0 ? "" : item.m2?.toFixed(2)}</td>
                                            <td className={`border-l-[1px] text-center border-black ${i === 0 ? 'pt' : 'py'}`}>{item.quantity === "" ? "" : item.quantity}</td>
                                            <td className={`border-l-[1px] text-end border-black theadUnitprice ${i === 0 ? 'pt' : 'py'}`}>{item.unitPrice}</td>
                                            <td className={`border-l-[1px] text-end border-black theadTotal ${i === 0 ? 'pt' : 'py'}`}>{item.total}</td>
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
                                        <tr key={item.id} 
                                        draggable="true"
                                        onDragStart={(e)=>handleDragStart(e,item.id)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e)=>handleDrop(e,item.id)}>
                                            <td className={`text-center ${i === 0 ? 'pt' : 'py'}`}>{i + 1}</td>
                                            <td className={`text-start ${i === 0 ? 'pt' : 'py'}`}>{!item.description ? "" : item.description.length < 44 ? item.description : <input value={item.description} className='w-[320px] outline-none'/>}</td>
                                            <td className={`border-l-[1px] text-center border-black ${i === 0 ? 'pt' : 'py'}`}>{item.quantity === "" ? "" : item.quantity}</td>
                                            <td className={`border-l-[1px] text-end border-black theadUnitprice ${i === 0 ? 'pt' : 'py'}`}>{item.unitPrice}</td>
                                            <td className={`border-l-[1px] text-end border-black theadTotal ${i === 0 ? 'pt' : 'py'}`}>{item.total}</td>
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
                                    for(let i = 6; i > (items?.length || 0); i--){
                                        row.push(
                                            <tr key={crypto.randomUUID()}>
                                                <td className={`text-center py invisible`}>n</td>
                                                <td className={`text-start py invisible`}>n</td>
                                                <td className={`border-l-[1px] text-center border-black py invisible`}>n</td>
                                                <td className={`border-l-[1px] text-end border-black theadUnitprice py invisible`}>n</td>
                                                <td className={`border-l-[1px] text-end border-black theadTotal py invisible`}>n</td>
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
                                    for(let i = 6; i > (items?.length || 0); i--){
                                        row.push(
                                            <tr key={crypto.randomUUID()}>
                                                <td className={`text-center py invisible`}>n</td>
                                                <td className={`text-start py invisible`}>n</td>
                                                <td className={`border-l-[1px] text-center border-black py invisible`}>n</td>
                                                <td className={`border-l-[1px] text-center border-black py invisible`}>n</td>
                                                <td className={`border-l-[1px] text-center border-black py invisible`}>n</td>
                                                <td className={`border-l-[1px] text-end border-black theadUnitprice py invisible`}>n</td>
                                                <td className={`border-l-[1px] text-end border-black theadTotal py invisible`}>n</td>
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
                        <td></td>
                        <td className='text-start'>
                            <p className={`prodArtWork ${!img1 && !img2 && !oldImg && !oldImg1 ? 'invisible' : ''}`}>Production Sample Artwork</p>
                            <div className='flex gap-2 prodflex'>
                                <Image src={img1 ? img1 : oldImg ? oldImg : '/white.png'} alt='#' width={400} height={400} className='img1'/>
                                <Image src={img2 ? img2 : oldImg1 ? oldImg1 : '/white.png'} alt='#' width={400} height={400} className='img2'/>
                            </div>
                        </td>
                        {
                            busType === 'general' && (
                                <>
                                <td className='border-l-[1px] border-black'></td>
                                <td className='border-l-[1px] border-black'></td>
                                <td className='border-l-[1px] border-black'></td>
                                </>
                            )
                        }
                        {
                            busType === 'meter' && (
                                <>
                                <td className='border-l-[1px] border-black'></td>
                                <td className='border-l-[1px] border-black'></td>
                                <td className='border-l-[1px] border-black'></td>
                                <td className='border-l-[1px] border-black'></td>
                                <td className='border-l-[1px] border-black'></td>
                                </>
                            )
                        }
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td rowSpan={3} colSpan={busType === 'meter' ? 5 : 3}>
                            <p className='paymentTitle'>Note: Payment Term:</p>
                            <div>
                                <textarea rows={3} className='outline-none resize-none overflow-hidden bg-transparent paymentTerm' value={busPayTerm}>

                                </textarea>
                            </div>
                        </td>
                        <td className='qtTotal text-end'>Total:</td>
                        <td className='qtPrice font-semibold bg-mainBlue text-white text-end border-x-[1px] border-black border-b-[1px] theadUnitprice'>${grandTotal}</td>
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
                                <div className='border-b-[1px] cusempty  border-black'>
                                    <p className='invisible'>d</p>
                                </div>
                                <p className='text-center cusSig'>
                                    {"Customer's Signature"}
                                </p>
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
                                    <div className='flex justify-center items-end border-b-[1px] cusempty border-black'>
                                        <Image src={!sigLogo ? '/white.png' : sigLogo} className={`sigImg ${signature === false ? '' : 'invisible'}`} alt='#' width={400} height={400}/>
                                    </div>
                                    <p className='text-center authSig'>Authorized Signature</p>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
           
        </div>

  )
}

export default QuotationForm