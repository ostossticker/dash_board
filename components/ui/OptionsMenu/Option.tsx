"use client"
import { addGeneral, editGeneral } from '@/app/(protected)/invoice/actions/generals';
import { addMeter, editMeter } from '@/app/(protected)/invoice/actions/meters';
import { addQtGen, editQtGen } from '@/app/(protected)/quotation/actions/generals';
import { addQtMeter, editQtMeter } from '@/app/(protected)/quotation/actions/meters';
import { recentlyActivity } from '@/app/(protected)/recently/action';
import ResponsiveElement from '@/components/invoice&quotation/ResComp';
import useToggle from '@/hooks/stores'
import { useCurrentUser } from '@/hooks/use-current-user';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import ReactToPrint from 'react-to-print';
import { toast } from 'react-toastify';

type calculation = {
  id:string;
  description: string;
  sizeWidth: number;
  sizeHeight: number;
  quantity: string;
  unitPrice: string;
  m2: number;
  total: string;
}

type calculate ={
  id:string;
  description: string;
  quantity: string;
  unitPrice: string;
  total: string;
}

type optionProps = {
  child:React.ReactNode;
  printingChild:React.ReactNode
  width?: number | 'auto' | 'full',
  toggleName?:boolean;
  toggleComp?:boolean;
  togglePhone?:boolean;
  toggleEmail?:boolean;
  toggleAddr?:boolean;
  togglePo?:boolean;
  toggleLogo?:boolean;
  toggleBankInfo?:boolean;
  toggleAddress?:boolean;
  toggleSignature?:boolean;
  cusName1?:string;
  cusComp?:string;
  mode?:string;
  invCusPhone1?:string;
  cusEmail?:string;
  cusAddr?:string;
  invNo?:string;
  invPo?:string;
  invStatus?:string;
  invBus?:string;
  invTitle?:string;
  invStaff?:string[];
  invDate?:string;
  method?:string;
  invNote?:string;
  items?:calculation[];
  items1?:calculate[];
  partial?:number;
  discount?:number;
  total?:number;
  balance?:number;
  busType?:string;
  ////router push
  routerPush?:string;
  des?:desProps[]
  ////staff info
  staffName?:string;
  staffPhone?:string;
  staffTelegram?:string;
  ////oldimg
  oldImg?:string;
  oldImg1?:string
  ////img undefined
  img1?:File | undefined;
  img2?:File | undefined;
  ////mode 
  changeMode?:string;
  customerId:string
}

type desProps = {
  id:string
  text:string
}

const Option = ({
  staffName,
  staffPhone,
  staffTelegram,
  child,
  printingChild,
  width,
  toggleName,
  toggleComp,
  togglePhone,
  toggleEmail,
  toggleAddr,
  togglePo,
  toggleLogo,
  toggleBankInfo,
  toggleAddress,
  toggleSignature,
  cusName1,
  cusComp,
  mode,
  invCusPhone1,
  cusEmail,
  cusAddr,
  invNo,
  invPo,
  invStatus,
  invBus,
  invTitle,
  invStaff,
  invDate,
  method,
  invNote,
  items,
  items1,
  partial,
  discount,
  total,
  balance,
  routerPush,
  busType,
  des,
  oldImg1,
  oldImg,
  img1,
  img2,
  changeMode,
  customerId
}:optionProps) => {
  const router = useRouter()
  const {
    darkMode, 
    setPending , 
    setPrint ,
    setBankInfo, 
    setPrinting , 
    printing ,
    setLogo , 
    setAddr , 
    setSign ,
    setRec, 
    setEmp,
    logo,
    bankInfo,
    routerSwitch,
    address,
    signature,
    employee,
    edit,
    passingId
  } = useToggle()
  const printableComponent = useRef<any>()
  const printableComponent1 = useRef<any>()
  const user = useCurrentUser()
  const [elementSize , setElementSize] = useState<{width: number | 'auto' | '100%';}>({
    width:'auto'
  })

  useEffect(()=>{
    const handleResize = () =>{
      const newWidth = width === 'full' ? '100%' : width === 'auto' ? 'auto' :   Math.max(1, width === undefined ? 0 : width * (window.innerWidth / 1540));
      setElementSize({width:newWidth})
    }
    window.addEventListener('resize',handleResize);
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[width])

  const options = [
    {
        id:"Opmenu4",
        label:"Cancel",
        clss:"",
        func:()=>{
          setPrint(false)
          setPrinting('')
        }
    },
  ]

  const expandableMenu = [
    {
        id:"Opmenu5",
        label:"Logo",
        clss:"bg-mainLightBlue",
        func:()=>setLogo()
    },
    {
      id:"Opmenu6",
      label:"Bank Info",
      clss:`bg-mainLightBlue ${printing !== 'quotation' ? "" : "!hidden"}` ,
      func:()=>setBankInfo()
  },
    {
        id:"Opmenu7",
        label:"Address",
        clss:"bg-mainLightBlue",
        func:()=>setAddr()
    },
    {
      id:"Opmenu8",
      label:"Signature",
      clss:"bg-mainLightBlue",
      func:()=>setSign()
    },
    {
      id:"Opmenu9",
      label:"Employee",
      clss:`bg-mainLightBlue ${printing !== "quotation" && "!hidden"}`,
      func:()=>setEmp()
    },
    {
      id:"Opmenu10",
      label:"PDF",
      clss:"bg-mainLightBlue",
      func:()=>{}
    },
    {
      id:"Opmenu11",
      label:"Receipt",
      clss:`bg-mainLightBlue ${printing === "quotation" && "!hidden"}`,
      func:()=>{
        if(edit && routerSwitch === changeMode){
          update({id:passingId , receip:'receipt'})
        }else{
          save('receipt')
        }
      }
    },
  ] 

  const save = async(receip?:string) =>{
    setPending(true)
    let validation = ''
    if(!cusName1 || !invCusPhone1){
      validation = "sorry this field is reuqired"
      toast.error(validation)
      setPending(false)
    }else{
      if(busType === 'meter'){
        try{
          const data = await addMeter({
            toggleName,
            toggleComp,
            togglePhone,
            toggleEmail,
            toggleAddr,
            togglePo,
            toggleLogo,
            toggleBankInfo,
            toggleAddress,
            toggleSignature,
            cusName1,
            cusComp,
            mode,
            invCusPhone1,
            cusEmail,
            cusAddr,
            invNo,
            invPo,
            invStatus,
            invBus,
            invTitle,
            invStaff:invStaff === undefined ? [] : invStaff,
            invDate,
            method,
            invNote,
            items:items === undefined ? [] : items,
            partial,
            discount,
            total,
            balance,
            customerId
            })
            if(data?.error){
              toast.error(data.error)
              setPending(false)
            }
            if(data?.success){
              await recentlyActivity({
                user:user.name,
                cust:cusName1,
                route:'Invoice',
                action:'Created',
                paperNo:invNo || ''
              })
              toast.success("saving succesffully")
              setPending(false)
              const id = data?.id
              if(receip === 'receipt'){
                setRec(id)
                router.push('/receipt/create')
              }else{
                router.push(`/${routerPush}/table`)
              }
            }
        }catch(error){
          toast.error("something went wrong")
          setPending(false)
        }
      }else if (busType === 'general'){
        try{
          const data = await addGeneral({
            toggleName,
            toggleComp,
            togglePhone,
            toggleEmail,
            toggleAddr,
            togglePo,
            toggleLogo,
            toggleBankInfo,
            toggleAddress,
            toggleSignature,
            cusName1,
            cusComp,
            mode,
            invCusPhone1,
            cusEmail,
            cusAddr,
            invNo,
            invPo,
            invStatus,
            invBus,
            invTitle,
            invStaff:invStaff === undefined ? [] : invStaff,
            invDate,
            method,
            invNote,
            items:items1 === undefined ? [] : items1,
            partial,
            discount,
            total,
            balance,
            customerId
          })
          if(data?.error){
            toast.error(data.error)
            setPending(false)
          }
          if(data?.success){
            await recentlyActivity({
              user:user.name,
              cust:cusName1,
              route:'Invoice',
              action:'Created',
              paperNo:invNo || ''
            })
            toast.success("saving succesffully")
            setPending(false)
            const id = data?.id
            if(receip === 'receipt'){
              setRec(id)
              router.push('/receipt/create')
            }else{
              router.push(`/${routerPush}/table`)
            }
          }
        }catch(error){
          toast.error("something went wrong")
          setPending(false)
        }
      }
    }
  }

  const saveQt = async() =>{
    setPending(true)
    let validation = ''
    
    const formData = new FormData();

    if(img1){
      formData.append('img1',img1)
    }

    if(img2){
      formData.append('img2',img2)
    }

    if(!cusName1 || !invCusPhone1){
      validation = "sorry this field is reuqired"
      toast.error(validation)
      setPending(false)
    }else{
      if(busType === 'meter'){
       try{
        const data = await addQtMeter({
          toggleName,
          toggleComp,
          togglePhone,
          toggleEmail,
          toggleAddr,
          toggleLogo:logo,
          toggleBankInfo:bankInfo,
          toggleAddress:address,
          toggleSignature:signature,
          toggleEmployee:employee,
          cusName2:cusName1,
          cusComp,
          cusPhone2:invCusPhone1,
          cusEmail,
          cusAddr,
          /// staff infomation
          staffName,
          staffPhone,
          staffTelegram,
          ///////
          qtNo:invNo,
          qtTitle:invTitle,
          qtDate:invDate,
          qtBus:invBus,
          qtStaff:invStaff === undefined ? [] : invStaff,
          prodDes:des,
          items:items === undefined ? [] : items,
          method:busType,
          total,
          customerId
        },formData)
          if(data?.error){
            toast.error(data.error)
            setPending(false)
            
          }
          if(data?.success){
            await recentlyActivity({
              user:user.name,
              cust:cusName1,
              route:'Quotation',
              action:'Updated',
              paperNo:invNo || ''
            })
            toast.success("saving succesffully")
            setPending(false)
            router.push(`/${routerPush}/table`)
          }
       }catch(error){
          toast.error("something went wrong")
          setPending(false)
       }
      }else if (busType === 'general'){
        try{
          const data = await addQtGen({
            toggleName,
            toggleComp,
            togglePhone,
            toggleEmail,
            toggleAddr,
            toggleLogo:logo,
            toggleBankInfo:bankInfo,
            toggleAddress:address,
            toggleSignature:signature,
            toggleEmployee:employee,
            cusName2:cusName1,
            cusComp,
            cusPhone2:invCusPhone1,
            cusEmail,
            cusAddr,
            /// staff infomation
            staffName,
            staffPhone,
            staffTelegram,
            ///////
            qtNo:invNo,
            qtTitle:invTitle,
            qtDate:invDate,
            qtBus:invBus,
            qtStaff:invStaff === undefined ? [] : invStaff,
            prodDes:des,
            items:items1 === undefined ? [] : items1,
            method:busType,
            total,
            customerId
          },formData)
            if(data?.error){
              toast.error(data.error)
              setPending(false)
              
            }
            if(data?.success){
              await recentlyActivity({
                user:user.name,
                cust:cusName1,
                route:'Quotation',
                action:'Updated',
                paperNo:invNo || ''
              })
              toast.success("saving succesffully")
              setPending(false)
              router.push(`/${routerPush}/table`)
            }
        }catch(error){
          toast.error("something went wrong")
          setPending(false)
        }
      }
    }
  }

  //// invoicer
  const update = ({id,receip}:{id:string , receip?:string}) =>{ 
    setPending(true)
    let validation = ''
    if(!cusName1 || !invCusPhone1){
      validation = "sorry this field is reuqired"
      toast.error(validation)
      setPending(false)
    }else{
      if(busType === 'meter'){
        editMeter({
          id,
          toggleName,
          toggleComp,
          togglePhone,
          toggleEmail,
          toggleAddr,
          togglePo,
          toggleLogo,
          toggleBankInfo,
          toggleAddress,
          toggleSignature,
          cusName1,
          cusComp,
          mode,
          invCusPhone1,
          cusEmail,
          cusAddr,
          invNo,
          invPo,
          invStatus,
          invBus,
          invTitle,
          invStaff:invStaff === undefined ? [] : invStaff,
          invDate,
          method,
          invNote,
          items:items === undefined ? [] : items,
          partial,
          discount,
          total,
          balance,
          customerId
        }).then((data)=>{
          if(data?.error){
            toast.error(data.error)
            setPending(false)
          }
          if(data?.success){
            toast.success("saving succesffully")
            setPending(false)
            const id = data?.id
            if(receip === 'receipt'){
              setRec(id)
              router.push('/receipt/create')
            }else{
              router.push(`/${routerPush}/table`)
            }
          }
        }).catch(()=>{
          toast.error("something went wrong")
          setPending(false)
        })
      }else if(busType === 'general'){
        editGeneral({
          id,
          toggleName,
          toggleComp,
          togglePhone,
          toggleEmail,
          toggleAddr,
          togglePo,
          toggleLogo,
          toggleBankInfo,
          toggleAddress,
          toggleSignature,
          cusName1,
          cusComp,
          mode,
          invCusPhone1,
          cusEmail,
          cusAddr,
          invNo,
          invPo,
          invStatus,
          invBus,
          invTitle,
          invStaff:invStaff === undefined ? [] : invStaff,
          invDate,
          method,
          invNote,
          items:items1 === undefined ? [] : items1,
          partial,
          discount,
          total,
          balance,
          customerId
        }).then((data)=>{
        if(data?.error){
          toast.error(data.error)
          setPending(false)
        }
        if(data?.success){
          toast.success("saving succesffully")
          setPending(false)
          const id = data?.id
          if(receip === 'receipt'){
            setRec(id)
            router.push('/receipt/create')
          }else{
            router.push(`/${routerPush}/table`)
          }
        }
      }).catch(()=>{
        toast.error("something went wrong")
        setPending(false)
      })
      }
    }
  }

  ///// quotation
  const update1 = (id:string) =>{
    setPending(true)
    let validation = ''

    const formData = new FormData();

    if(img1){
      formData.append('img1',img1)
    }

    if(img2){
      formData.append('img2',img2)
    }
    if(!cusName1 || !invCusPhone1){
      validation = "sorry this field is reuqired"
      toast.error(validation)
      setPending(false)
    }else{
      if(busType === 'meter'){
        editQtMeter({
          id,
          toggleName,
          toggleComp,
          togglePhone,
          toggleEmail,
          toggleAddr,
          toggleLogo:logo,
          toggleBankInfo:bankInfo,
          toggleAddress:address,
          toggleSignature:signature,
          toggleEmployee:employee,
          cusName2:cusName1,
          cusComp,
          cusPhone2:invCusPhone1,
          cusEmail,
          cusAddr,
          /// staff infomation
          staffName,
          staffPhone,
          staffTelegram,
          ///////
          qtNo:invNo,
          qtTitle:invTitle,
          qtDate:invDate,
          qtBus:invBus,
          qtStaff:invStaff === undefined ? [] : invStaff,
          prodDes:des,
          items:items === undefined ? [] : items,
          method:busType,
          oldImg:oldImg,
          oldImg1:oldImg1,
          total,
          customerId
        },formData).then((data)=>{
        if(data?.error){
          toast.error(data.error)
          setPending(false)
          
        }
        if(data?.success){
          toast.success("saving succesffully")
          setPending(false)
          router.push(`/${routerPush}/table`)
        }
      }).catch(()=>{
        toast.error("something went wrong")
        setPending(false)
      })
      }else if(busType === 'general'){
        editQtGen({
          id,
          toggleName,
          toggleComp,
          togglePhone,
          toggleEmail,
          toggleAddr,
          toggleLogo:logo,
          toggleBankInfo:bankInfo,
          toggleAddress:address,
          toggleSignature:signature,
          toggleEmployee:employee,
          cusName2:cusName1,
          cusComp,
          cusPhone2:invCusPhone1,
          cusEmail,
          cusAddr,
          /// staff infomation
          staffName,
          staffPhone,
          staffTelegram,
          ///////
          qtNo:invNo,
          qtTitle:invTitle,
          qtDate:invDate,
          qtBus:invBus,
          qtStaff:invStaff === undefined ? [] : invStaff,
          prodDes:des,
          items:items1 === undefined ? [] : items1,
          method:busType,
          oldImg:oldImg,
          oldImg1:oldImg1,
          total,
          customerId
        },formData).then((data)=>{
          if(data?.error){
            toast.error(data.error)
            setPending(false)
          }
          if(data?.success){
            toast.success("saving succesffully")
            setPending(false)
            router.push(`/${routerPush}/table`)
          }
        }).catch(()=>{
          toast.error("something went wrong")
          setPending(false)
        })
      }
    }
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        router.push(`/${routerPush}/table`)
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <>
    <div className={`flex justify-between mx-auto`} style={{width:elementSize.width}}>
    {child}
    <ResponsiveElement width={100} height={'auto'} className='flex flex-col justify-end'>
    <div >

        <ResponsiveElement width={'auto'} height={'auto'} className={`${darkMode ? "bg-dark-box-color" : "bg-white"} flex flex-col items-center rounded-t-lg justify-center`} py={4}>
        <div >
            <h1 className='text-gray-800 text-[25px] font-semibold'>SETTING</h1>
            {expandableMenu.map((item)=>{
              return(
                <ResponsiveElement key={item.id} width={80} height={'auto'} py={2} mt={5} mb={5} fontSize={10} className={`${item.clss} text-white rounded-lg`}>
                  <button onClick={item.func}>
                    {item.label}
                  </button>
                </ResponsiveElement>
                
              )
            })}
        </div>
        </ResponsiveElement>
        
    <ResponsiveElement width={'auto'} height={'auto'} py={4} className={`${darkMode ? "bg-dark-box-color" : "bg-white"} flex flex-col justify-center   rounded-b-lg items-center`}>
    <div >
    {
        printing === 'quotation' && (
              <button onClick={()=>{if(edit){
                update1(passingId)
              }else{
                saveQt()
              }}}>
              <ResponsiveElement className='bg-insomnia-primary text-white rounded-lg' width={80} height={'auto'} py={2} mt={5} mb={5} fontSize={10} >
                  <div>
                    {edit ? "UPDATED" : "SAVE" }
                  </div>
              </ResponsiveElement>
              </button>
        )
    }
    {
        printing === 'invoice' && (
              <button onClick={()=>{
                if(edit && routerSwitch === changeMode){
                  update({id:passingId})
                }else{
                  save()
                }
              }}>
              <ResponsiveElement className='bg-insomnia-primary text-white rounded-lg' width={80} height={'auto'} py={2} mt={5} mb={5} fontSize={10} >
                  <div>
                    {edit && routerSwitch === changeMode ? "UPDATED" : "SAVE"}
                  </div>
              </ResponsiveElement>
              </button>
        )
    }
    {
        printing === 'quotation' && (
          <ReactToPrint
          trigger={()=>(
          <button>
          <ResponsiveElement className='bg-insomnia-primary text-white rounded-lg' width={80} height={'auto'} py={2} mt={5} mb={5} fontSize={10} >
            <div>
              Print
            </div>
          </ResponsiveElement>
          </button>
          )}
          content={()=>printableComponent1.current}
          pageStyle="@page {size: A5 portrait; margin: 10px;}"
          />
        
        )
      }
      {
        printing === 'invoice' && (
          <ReactToPrint
              trigger={()=>(
              <button>
              <ResponsiveElement className='bg-insomnia-primary text-white rounded-lg' width={80} height={'auto'} py={2} mt={5} mb={5} fontSize={10} >
                  <div>
                    Print
                  </div>
              </ResponsiveElement>
              </button>
              )}
              content={()=>printableComponent.current}
              pageStyle="@page {size: A5 portrait; margin: 0px;}"
            />
          
        )
      }
      {
          options.map((item)=>{
            return(
              <ResponsiveElement className={`${item.clss} bg-gray-200 text-gray-800 rounded-lg`} width={80} height={'auto'} py={2} mt={5} mb={5} key={item.id} fontSize={10} >
                <button  onClick={item.func}>
                  {item.label}
                </button>
              </ResponsiveElement>
              
            )
          })
        }
      </div>
    </ResponsiveElement>
    
    </div>
    
    </ResponsiveElement>
    </div>


    <div className='show'>
    {
      printing === 'invoice' && (
        <div ref={printableComponent}>
        {printingChild}
        </div>
      )
    }
    </div>
    <div className='show'>
    {
      printing === 'quotation' && (
        <div ref={printableComponent1}>
        {printingChild}
        </div>
      )
    }
    </div>
    </>
  )
}

export default Option