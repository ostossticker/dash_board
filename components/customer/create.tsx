"use client"
import { addCustomer, editCustomer } from '@/app/(protected)/customer/actions/customer';
import useToggle from '@/hooks/stores';
import { useCurrentUser } from '@/hooks/use-current-user';
import { closeModal, fetchData } from '@/lib/functions';
import { url } from '@/lib/url';
import axios from 'axios';
import React, {  useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import useSWR from 'swr';


type compInput = {
  label:string;
  type:string;
  name:string;
  value:string
  func:(e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick?:()=>void;
  handleBlur?:()=>void;
  handleKeyDown?:(event: React.KeyboardEvent<HTMLInputElement>)=>void;
  handleFocus?:()=>void;
}

type customerProps = {
    cusName:string;
    cusTelegram:string;
    cusBus:string;
    cusPhone1:string
    cusPhone2:string
    cusComp: string
    cusMember: string
    cusEmail: string
    cusAddr: string
    cusWebsite: string
}


const CompInput = ({label,value,name,type,func,handleClick,handleBlur,handleKeyDown,handleFocus}:compInput) =>{
    
  return (
    <div className='[&>span]:focus-within:text-mainBlue col-span-3 lg:col-span-1  px-3 py-1 pb-3'>
       <span className='text-[12px] font-bold text-slate-400'>{label}</span><br />
      
         <input autoComplete='off' type={type} className='w-full text-[13px] outline-none shadow-sm border-full solid 
               border-[1px] rounded-md border-slate-200 focus:border-mainLightBlue  h-[30px] px-1 bg-[#F8F8F8]
       ' name={name} value={value}  onChange={func} onClick={handleClick} onKeyDown={handleKeyDown} onFocus={handleFocus} onBlur={handleBlur}/>
    </div>
  )
}

type createProps ={
    cusName:string;
    cusTelegram:string;
    cusBus:string;
    cusPhone1:string;
    cusPhone2:string;
    cusComp:string;
    cusMember:string;
    cusEmail:string;
    cusAddr:string;
    cusWebsite:string;
}

type optionDrop = {
  id:string;
  busName:string;
}

const Create = () => {
  const { pending , setPending , setModalisopen ,isModal ,edit , passingId} = useToggle()
  const [suggest , setSuggest] = useState<optionDrop[]>([])
  const user = useCurrentUser()
  const [focus , setFocus] = useState<number | null>(0)
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const {data , error} = useSWR(`${url}/api/customer/${passingId}?email=${user?.id}`,fetchData)
  const ulRef = useRef<HTMLUListElement>(null);
  const cus:createProps = data?.editcus || ''
  const [val , setVal] = useState<customerProps>({
    cusName:'',
    cusTelegram:'',
    cusBus:'',
    cusPhone1:'',
    cusPhone2:'',
    cusComp:'',
    cusMember:'',
    cusEmail:'',
    cusAddr:'',
    cusWebsite:'',
  })

  useEffect(()=>{
    setVal({
      cusName:edit ? cus.cusName : '',
      cusTelegram:edit ? cus.cusTelegram : '',
      cusBus:edit ? cus.cusBus : '',
      cusPhone1:edit ? cus.cusPhone1 : '',
      cusPhone2:edit ? cus.cusPhone2 : '',
      cusComp:edit ? cus.cusComp : '',
      cusMember:edit ? cus.cusMember : new Date().toISOString().split('T')[0],
      cusEmail:edit ? cus.cusEmail : '',
      cusAddr:edit ? cus.cusAddr :'',
      cusWebsite:edit ? cus.cusWebsite : '',
    })
    if(isModal === true && !edit){
      setVal(prev=>({
        ...prev,
        cusName:'',
        cusTelegram:'',
        cusBus:'',
        cusPhone1:'',
        cusPhone2:'',
        cusComp:'',
        cusEmail:'',
        cusAddr:'',
        cusWebsite:'',
        cusMember:new Date().toISOString().split('T')[0]
      }))
    }
},[passingId,edit,cus, isModal])


  const fetchDatas = async (newString:string) =>{
    const {data} = await axios.get(`${url}/api/businesss?email=${user.id}&name=${user.name}&filter=${newString}`)
    setSuggest(data)
  }

const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if(focus === 1){
    if (event.keyCode === 38) {
      // Up arrow key
      const index = suggest.findIndex(item => item.id === selectedItemId);
      setSelectedItemId(index === -1 ? suggest[suggest.length - 1].id : suggest[Math.max(index - 1, 0)].id);
      scrollToSelectedIndex();
    } else if (event.keyCode === 40) {
      // Down arrow key
      const index = suggest.findIndex(item => item.id === selectedItemId);
      setSelectedItemId(index === -1 ? suggest[0].id : suggest[Math.min(index + 1, suggest.length - 1)].id);
      scrollToSelectedIndex();
    } else if (event.keyCode === 13) {
      // Enter key
      setVal(prev=>({
        ...prev,
        cusBus:suggest.find(item => item.id === selectedItemId)?.busName || ""
      }));
      setFocus(null)
    }
  }
};


const scrollToSelectedIndex = () => {
  if (ulRef.current && selectedItemId) {
    const selectedItem = ulRef.current.querySelector(`[data-id="${selectedItemId}"]`) as HTMLLIElement | null;
    if (selectedItem) {
      selectedItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
};

  useEffect(() => {
    const handleKeyDownDocument = (event: KeyboardEvent) => {
      handleKeyDown(event as any as React.KeyboardEvent<HTMLInputElement>);
    };
  
    document.addEventListener("keydown", handleKeyDownDocument);
  
    return () => {
      document.removeEventListener("keydown", handleKeyDownDocument);
    };
  }, [selectedItemId]);

  const left = useMemo(()=>[
    {
      label:"Name",
      type:"text",
      name:'cusName',
      val:val.cusName
    },
    {
      label:'Business',
      type:'text',
      name:'cusBus',
      val:val.cusBus
    },
    
    {
      label:'Company',
      type:'text',
      name:'cusComp',
      val:val.cusComp
    },
    {
      label:'Member Since',
      type:'date',
      name:'cusMember',
      val:val.cusMember
    },
    {
      label:'Address',
      type:'text',
      name:'cusAddr',
      val:val.cusAddr
    }
  ],[val.cusName , val.cusBus,val.cusComp , val.cusMember , val.cusAddr])
  const right = useMemo(()=>[
    {
      label:'Telegram',
      type:'text',
      name:'cusTelegram',
      val:val.cusTelegram
    },
    {
      label:'Phone1',
      type:'text',
      name:'cusPhone1',
      val:val.cusPhone1
    },
    {
      label:'Phone2',
      type:'text',
      name:'cusPhone2',
      val:val.cusPhone2
    },
    {
      label:'Email',
      type:'email',
      name:'cusEmail',
      val:val.cusEmail
    },
    {
      label:"Website",
      type:'text',
      name:'cusWebsite',
      val:val.cusWebsite
    }
  ],[val.cusTelegram , val.cusPhone1 , val.cusPhone2 , val.cusEmail , val.cusWebsite])

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const {name , value} = e.target
    if((name === 'cusPhone1' || name === 'cusPhone2') && isNaN(Number(value))){
      setVal(prev=>({
        ...prev,
        [name]:''
      }))
    }else{
      setVal(prevState =>({
        ...prevState , [name]:value
      }))
    }
    if(name === 'cusBus' && value  !== ""){
      setFocus(1)
    }else{
      fetchDatas('')
    }
  } 

  const onSave = async() =>{
    setPending(true)

    let validation = ''

    const {cusName,cusTelegram,cusBus,cusPhone1 ,cusPhone2 , cusComp , cusMember , cusEmail , cusAddr , cusWebsite} = val
    if(!cusName){
      validation= "sorry this field is required"
      toast.error(validation)
      setPending(false)
    }else{
       addCustomer({
        cusName: cusName,
        cusTelegram:cusTelegram,
        cusBus:cusBus,
        cusPhone1:cusPhone1,
        cusPhone2:cusPhone2,
        cusComp:cusComp,
        cusMember:cusMember,
        cusEmail:cusEmail,
        cusAddr:cusAddr,
        cusWebsite:cusWebsite
      }).then((data)=>{
        setVal(prev=>({
          ...prev,
          cusName:'',
          cusTelegram:'',
          cusBus:'',
          cusPhone1:'',
          cusPhone2:'',
          cusComp:'',
          cusMember:'',
          cusEmail:'',
          cusAddr:'',
          cusWebsite:''
        }))
        if(data?.error){
          toast.error(data.error)
          setPending(false)
        }
        if(data?.success){
          toast.success(data.success)
          setPending(false)
          setModalisopen(false)
        }
      }).catch(()=>{
        toast.error("something went wrong")
        setPending(false)
      })
    }
    
  }

  const onUpdate = async() =>{
    setPending(true)

    let validation = ''

    const {cusName,cusTelegram,cusBus,cusPhone1 ,cusPhone2 , cusComp , cusMember , cusEmail , cusAddr , cusWebsite} = val

    if(!cusName){
      validation= "sorry this field is required"
      toast.error(validation)
      setPending(false)
    }else{
       editCustomer({
        id:passingId,
        cusName: cusName,
        cusTelegram:cusTelegram,
        cusBus:cusBus,
        cusPhone1:cusPhone1,
        cusPhone2:cusPhone2,
        cusComp:cusComp,
        cusMember:cusMember,
        cusEmail:cusEmail,
        cusAddr:cusAddr,
        cusWebsite:cusWebsite
      }).then((data)=>{
        if(data?.error){
          toast.error(data.error)
          setPending(false)
        }
        if(data?.success){
          toast.success(data.success)
          setPending(false)
          setModalisopen(false)
        }
      }).catch(()=>{
        toast.error("something went wrong")
        setPending(false)
      })
    }
  }

  useEffect(()=>{
    if(val.cusBus !== ""){
      fetchDatas(val.cusBus)
    }
  },[val.cusBus])

  const handleFilClick = (value:string | undefined) =>{
    if(value === undefined){
      setVal({
        ...val,
        cusBus:''
      })
    }else{
      setVal({
        ...val,
        cusBus:value
      })
    }
  }

  return (
    <>
    <div className='flex justify-center items-center'>
      <div >
      {
        left.map((item)=>{
          return(
                 <>
                 {
                  item.label !== "Business" ? (
                    <CompInput key={item.label} value={item.val} label={item.label}  func={handleChange} name={item.name} type={item.type} />
                  ) : (
                    <div>
                      <CompInput key={item.label} value={item.val} label={item.label}  func={handleChange} name={item.name} type={item.type} handleClick={()=>fetchDatas('')} handleKeyDown={handleKeyDown} handleFocus={()=>setFocus(1)} handleBlur={()=>setTimeout(()=>{
                          setFocus(null)
                        }, 150)}/>
                        <div className='relative mx-[13px]'>
                          {
                            focus === 1 && (
                              <ul ref={ulRef} className='absolute bg-white w-full rounded-md max-h-[100px] overflow-auto'>
                                {
                                  suggest.map((item)=>{
                                    return(
                                      <li data-id={item.id} key={item.id} className={`cursor-pointer px-2 ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`}  onClick={()=>handleFilClick(item?.busName)}>
                                        {item.busName}
                                      </li>
                                    )
                                  })
                                }
                              </ul>
                            )
                          }
                      </div>
                    </div>
                  )
                 }
                 </>
          )
        })
      }
      </div>
      <div >
      {
        right.map((item)=>{
          return(
            <CompInput key={item.label} value={item.val} label={item.label} func={handleChange} name={item.name} type={item.type}/>
          )
        })
      }
      </div>
    </div>
    <div className='flex justify-center items-center gap-5 mt-[20px]'>
      <button className={`px-4 py-1 text-white duration-200 ease-in-out ${val.cusName  !== "" ? "shadowHover bg-mainLightBlue text-white" : "bg-slate-300"} w-[185px] rounded-md `} onClick={edit ? onUpdate : onSave}>{pending ? <span className='loading loading-spinner text-default'></span> : <p>Save</p>}</button>
      <button className={`px-4 py-1 text-white duration-200 ease-in-out bg-slate-300 hover:bg-mainLightRed w-[185px] rounded-md`} onClick={()=>{closeModal('my_modal_5') , setModalisopen(false) }}>Cancel</button>
    </div>
    </>
  )
}

export default Create