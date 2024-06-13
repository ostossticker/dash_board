"use client"
import { editAdmin } from '@/actions/admin';
import useToggle from '@/hooks/stores';
import { useCurrentUser } from '@/hooks/use-current-user';
import { closeModal, fetchData , generateRandomString, validateEmail } from '@/lib/functions';
import { url } from '@/lib/url';
import { UserRole } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import useSWR from 'swr';
import ResponsiveElement from '../invoice&quotation/ResComp';

type compInput = {
    label:string;
    type:string;
    name:string;
    value:string | boolean;
    which:string;
    list:string;
    func:(e: React.ChangeEvent<HTMLInputElement>) => void;
    func1?:(e:React.ChangeEvent<HTMLSelectElement>) =>void;
  }

type adminProps = {
    name:string;
    email:string;
    phoneNumber:string;
    password:string;
    role:UserRole;
    invoice:boolean;
    quotation:boolean;
    receipt:boolean;
    business:boolean;
    employee:boolean;
    customer:boolean;
    product:boolean;
    purchase:boolean;
    payment:boolean;
    telegramReport:boolean;
    isTwoFactorEnabled:boolean;
}

type adminProps1 = {
    businessType:string[]
    name:string;
    email:string;
    phoneNumber:string;
    password:string;
    role:UserRole;
    invoice:boolean;
    quotation:boolean;
    receipt:boolean;
    business:boolean;
    employee:boolean;
    customer:boolean;
    product:boolean;
    purchase:boolean;
    payment:boolean;
    telegramReport:boolean;
    isTwoFactorEnabled:boolean;
    alarmTime:string;
}

type Option ={
    id:string;
    busName:string;
}

const CompInput = ({label,value,name,type,func,func1,which}:compInput) =>{
    return(
        <div className='[&>span]:focus-within:text-mainBlue col-span-3 lg:col-span-1  px-3 py-1 pb-3'>
            <span className='text-[12px] font-bold text-slate-400'>{label}</span><br />
            {
                type === 'select' ? (
                    <>
                    <select name={name} value={value?.toString()} onChange={func1} className='text-[13px] w-full outline-none shadow-sm border-full solid 
                    border-[1px] rounded-md border-slate-200 focus:border-mainLightBlue  h-[30px] px-1 bg-[#F8F8F8]'>
                    {
                        which === 'role' && (
                            <>
                                <option>none</option>
                                <option>ADMIN</option>
                                <option>USER</option>
                            </>
                        )
                    }
                    {
                        which === 'invoice' && (
                            <>
                                <option value="false">disable</option>
                                <option value="true">enable</option>
                            </>
                        )
                    }
                    {
                        which === 'quotation' && (
                            <>
                                <option value="false">disable</option>
                                <option value="true">enable</option>
                            </>
                        )
                    }
                    {
                        which === 'receipt' && (
                            <>
                                <option value="false">disable</option>
                                <option value="true">enable</option>
                            </>
                        )
                    }
                    {
                        which === 'business' && (
                            <>
                                <option value="false">disable</option>
                                <option value="true">enable</option>
                            </>
                        )
                    }
                    {
                        which === 'employee' && (
                            <>
                                <option value="false">disable</option>
                                <option value="true">enable</option>
                            </>
                        )
                    }
                    {
                        which === 'customer' && (
                            <>
                                <option value="false">disable</option>
                                <option value="true">enable</option>
                            </>
                        )
                    }
                    {
                        which === 'product' && (
                            <>
                                <option value="false">disable</option>
                                <option value="true">enable</option>
                            </>
                        )
                    }
                    {
                        which === 'purchase' && (
                            <>
                                <option value="false">disable</option>
                                <option value="true">enable</option>
                            </>
                        )
                    }
                    {
                        which === 'payment' && (
                            <>
                                <option value="false">disable</option>
                                <option value="true">enable</option>
                            </>
                        )
                    }
                    {
                        which === 'telegram' && (
                            <>
                                <option value="false">disable</option>
                                <option value="true">enable</option>
                            </>
                        )
                    }
                    {
                        which === '2fa' && (
                            <>
                                <option value="false">disable</option>
                                <option value="true">enable</option>
                            </>
                        )
                    }
                    </select>
                    </>
                ) : (
                    <>
                    <input type={type} className='w-full text-[13px] outline-none shadow-sm border-full solid 
                         border-[1px] rounded-md border-slate-200 focus:border-mainLightBlue  h-[30px] px-1 bg-[#F8F8F8]
                        ' name={name} value={value?.toString()}  onChange={func}/>
                    </>
                )
            }
        </div>
    )
}

const Editadmin = () => {
  const {pending , setPending , edit , passingId ,darkMode , bgModal} = useToggle()
  const user = useCurrentUser()

  const {data , error} = useSWR(`${url}/api/admins/${passingId}?email=${user.id}`,fetchData)
  const admins:adminProps1 = data || ''
  const [businesses , setBusiness] = useState<string[]>([])
  const ulRef = useRef<HTMLUListElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [test , setTest] = useState<Option[]>([])
  const [busVal , setBusVal] = useState<string>('')
  const [focus , setFocus] = useState<boolean>(false)
  const [val , setVal] = useState<adminProps>({
    name:'',
    email:'',
    phoneNumber:'',
    password:'',
    role:user.admin,
    invoice:false,
    quotation:false,
    receipt:false,
    business:false,
    employee:false,
    customer:false,
    product:false,
    purchase:false,
    payment:false,
    telegramReport:false,
    isTwoFactorEnabled:false
  })
  const [hour , setHour] = useState<string>('')
  const [minute , setMinute] = useState<string>('')

  const fetchDatas = async (filterVal:string) =>{
    const {data} = await axios.get(`${url}/api/businesss?email=${user.id}&name=${user.name}&filter=${filterVal}`)
    setTest(data)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(focus === true){
      if (event.keyCode === 38) {
        // Up arrow key
        const index = test.findIndex(item => item.id === selectedItemId);
        setSelectedItemId(index === -1 ? test[test.length - 1].id : test[Math.max(index - 1, 0)].id);
        scrollToSelectedIndex();
      } else if (event.keyCode === 40) {
        // Down arrow key
        const index = test.findIndex(item => item.id === selectedItemId);
        setSelectedItemId(index === -1 ? test[0].id : test[Math.min(index + 1, test.length - 1)].id);
        scrollToSelectedIndex();
      } else if (event.keyCode === 13) {
        // Enter key
        setBusVal(test.find(item => item.id === selectedItemId)?.busName || "")
        setFocus(false)
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

  useEffect(()=>{
    setVal(prev=>({
        ...prev,
        name:edit ? admins.name === '' || admins.name === null ? 'no name' : admins.name : '',
        email:edit ? !validateEmail(admins.email) || admins.email === null ? 'no email' : admins.email : '',
        phoneNumber:edit ? admins.phoneNumber == '' || admins.phoneNumber === null ? 'no phone' : admins.phoneNumber : '',
        password:edit ? admins.password === '' || admins.password === null ? 'no password' : admins.password : '',
        role:edit ? admins.role : user.user,
        invoice:edit ? admins.invoice : false,
        quotation:edit ? admins.quotation : false,
        receipt:edit ? admins.receipt : false,
        business:edit ? admins.business : false,
        employee:edit ? admins.employee : false,
        customer:edit ? admins.customer : false,
        product:edit ? admins.product : false,
        purchase:edit ? admins.purchase : false,
        payment:edit ? admins.payment : false,
        telegramReport:edit ? admins.telegramReport : false,
        isTwoFactorEnabled:edit ? admins.isTwoFactorEnabled : false
    }))
    if(edit){
        if (admins.alarmTime && typeof admins.alarmTime === 'string') {
            let parts = admins.alarmTime.split("-");
            if (parts.length >= 2) {
                setMinute(parts[1]);
                setHour(parts[0])
            } else {
                setMinute("Invalid format");
                setHour("Invalid format")
            }
           
        } else {
            setMinute("00");
            setHour("00")
        }
        setBusiness(admins.businessType || [])
    
    }
  },[passingId , edit , admins])

  useEffect(()=>{
    if(busVal !== ""){
        fetchDatas(busVal)
    }
  },[busVal])

  const left = useMemo(()=>[
    {
        label:"Name",
        type:"text",
        name:"name",
        val:val.name,
        which:''
    },
    {
        label:"Email",
        type:"text",
        name:"email",
        val:val.email,
        which:''
    },
    {
        label:"Password",
        type:"text",
        name:"password",
        val:val.password,
        which:''
    },
    {
        label:"Role",
        type:"select",
        name:"role",
        val:val.role,
        which:'role'
    },
    {
        label:"Invoice",
        type:"select",
        name:"invoice",
        val:val.invoice,
        which:'invoice'
    },
    {
        label:"Quotation",
        type:"select",
        name:"quotation",
        val:val.quotation,
        which:'quotation'
    },
    {
        label:"Payment",
        type:"select",
        name:"payment",
        val:val.payment,
        which:'payment'
    },
    {
        label:"Telegram",
        type:"select",
        name:"telegramReport",
        val:val.telegramReport,
        which:'telegram'
    },
  ],[val])

  const right = useMemo(()=>[
    {
        label:"Phone Number",
        type:"text",
        name:"phoneNumber",
        val:val.phoneNumber,
        which:''
    },
    {
        label:"Receipt",
        type:"select",
        name:"receipt",
        val:val.receipt,
        which:'receipt'
    },
    {
        label:"Business",
        type:"select",
        name:"business",
        val:val.business,
        which:'business'
    },
    {
        label:"Employee",
        type:"select",
        name:"employee",
        val:val.employee,
        which:'employee'
    },
    {
        label:"Customer",
        type:"select",
        name:"customer",
        val:val.customer,
        which:'customer'
    },
    {
        label:"Product",
        type:"select",
        name:"product",
        val:val.product,
        which:'product'
    },
    {
        label:"Purchase",
        type:"select",
        name:"purchase",
        val:val.purchase,
        which:'purchase'
    },
    {
        label:"2fa",
        type:"select",
        name:"isTwoFactorEnabled",
        val:val.isTwoFactorEnabled,
        which:'2fa'
    },
  ],[val])

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const {name , value} = e.target
    setVal(prev=>({
        ...prev,
        [name]:value
    }))
  }

  const handleChangeSelect = (e:React.ChangeEvent<HTMLSelectElement>) =>{
    const {name , value} = e.target
    setVal(prev=>({
        ...prev,
        [name]:value
    }))
  }

  const handleStaffChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const value = e.target.value
    setBusVal(value)
    if(value !== ""){
        setFocus(true)
    }else{
        fetchDatas('')
    }
  }

  const handleStaffKey = (e:React.KeyboardEvent<HTMLInputElement>) =>{
    if(e.key === 'Enter' && busVal.trim() !== ''){
        e.preventDefault();
        addStaff(busVal)
    }
  }

  const addStaff = (businessName:string) =>{
    const updateName = [...businesses , businessName];
    setBusiness(updateName)
  }

  const removeStaff = (index:number) =>{
    const updateName = [...businesses];
    updateName.splice(index , 1);
    setBusiness(updateName);
  }

  const onUpdate = () =>{
    const {name , email , phoneNumber , password , role , invoice , quotation , receipt , business , employee , customer , product , telegramReport , purchase , payment , isTwoFactorEnabled} = val
    setPending(true)
     // Convert properties to appropriate types if necessary
     const isEmployeeBoolean = typeof employee === "boolean" ? employee : employee === "true";
     const isInvoiceBoolean = typeof invoice === "boolean" ? invoice : invoice === "true";
     const isQuotationBoolean = typeof quotation === "boolean" ? quotation : quotation === "true";
     const isReceiptBoolean = typeof receipt === "boolean" ? receipt : receipt === "true";
     const isBusinessBoolean = typeof business === "boolean" ? business : business === "true";
     const isCustomerBoolean = typeof customer === "boolean" ? customer : customer === "true";
     const isProductBoolean = typeof product === "boolean" ? product : product === "true";
     const isPurchaseBoolean = typeof purchase === "boolean" ? purchase : purchase === "true";
     const isPaymentBoolean = typeof payment === "boolean" ? payment : payment === "true";
     const isTelegramBoolean = typeof telegramReport === "boolean" ? telegramReport : telegramReport === "true";
     const isTwoFactorEnableds = typeof isTwoFactorEnabled === "boolean" ? isTwoFactorEnabled : isTwoFactorEnabled === "true";
     editAdmin({
      id:passingId,
      name,
      email:email === 'no email' || email === '' || email === null ? generateRandomString(10) : email,
      phoneNumber,
      password,
      role,
      invoice: isInvoiceBoolean,
      quotation: isQuotationBoolean,
      receipt: isReceiptBoolean,
      business: isBusinessBoolean,
      employee: isEmployeeBoolean,
      customer: isCustomerBoolean,
      product: isProductBoolean,
      purchase: isPurchaseBoolean,
      payment: isPaymentBoolean,
      telegramReport: isTelegramBoolean,
      alarmTime:`${hour}-${minute}`,
      isTwoFactorEnabled:email === 'no email' || email === '' || email === null ? false : isTwoFactorEnableds,
      businessType:businesses
    }).then((data)=>{
        if(data?.error){
            toast.error(data.error)
            setPending(false)
          }
          if(data?.success){
            toast.success(data.success)
            setPending(false)
          }
        }).catch(()=>{
          toast.error("something went wrong")
          setPending(false)
        })
  }

  const handsClick = () =>{
    fetchDatas('')
  }

  const handleClick = ( newString:string) =>{
    setBusVal(newString)
  }

  if(error){
    return(
        <div>
            error fetching data
        </div>
    )
  }

  return (
    <>
    
    {
        bgModal === 'bgLeft' && (
            <>
            <div className='flex justify-center items-center'>
      
                <div >
                {
                    left.map((item)=>{
                    return(
                            <CompInput key={item.label} value={item.val} label={item.label} list={item.label} which={item.which} func1={handleChangeSelect} func={handleChange} name={item.name} type={item.type}/>
                    )
                    })
                }
                </div>
                <div >
                {
                    right.map((item)=>{
                    return(
                        <CompInput key={item.label} value={item.val} label={item.label} list={item.label} which={item.which} func1={handleChangeSelect} func={handleChange} name={item.name} type={item.type}/>
                    )
                    })
                }
                </div>
                </div>

                <div className='flex justify-center px-7 gap-6 py-1 pb-7'>
                    <div className='[&>span]:focus-within:text-mainBlue '>
                    <span className='text-[12px] font-bold text-slate-400 '>Hour</span><br />
                    <input type="text" className='text-[13px] w-full outline-none shadow-sm border-full solid border-[1px] rounded-md border-slate-200 focus:border-mainLightBlue  h-[30px] px-1 bg-[#F8F8F8]'
                    value={hour}
                    onChange={(e)=>setHour(e.target.value)}
                    />
                    </div>
                    <div className='[&>span]:focus-within:text-mainBlue '>
                    <span className='text-[12px] font-bold text-slate-400 '>Minute</span><br />
                    <input type="text" className='text-[13px] w-full outline-none shadow-sm border-full solid border-[1px] rounded-md border-slate-200 focus:border-mainLightBlue  h-[30px] px-1 bg-[#F8F8F8]'
                    value={minute}
                    onChange={(e)=>setMinute(e.target.value)}
                    />
                    </div>
                </div> 
            </>
        )
    }
    {
        bgModal === 'bgRight' && (
            <ResponsiveElement width={'auto'} height={515} className='px-3'>
            <div> 
                <ResponsiveElement width={255} height={'auto'} className=' text-[15px] border-full solid border-[1px] border-slate-200 bg-[#F8F8F8] px-3 py-2 rounded-md outline-none'>
                    <input type="text" placeholder='Add business permission' value={busVal} onChange={handleStaffChange} onClick={handsClick} onKeyDown={(event)=>{handleStaffKey(event) , handleKeyDown(event)}} 
                        onFocus={()=>setFocus(true)}
                        autoComplete='off'
                        onBlur={()=>setTimeout(()=>{
                            setFocus(false)
                        },150)}
                        />
                </ResponsiveElement>
                <div className='w-[200px] relative'>
                    {
                        focus === true && (
                            <ul ref={ulRef} className='absolute rounded-md border-[1px] shadow-md bg-white px-2  py-1 w-full mt-2 max-h-[100px] overflow-auto'>
                                {
                                    test.map((item)=>{
                                        return(
                                            <li data-id={item.id} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`} key={item.id} onClick={()=>handleClick(item.busName)}>
                                                {item.busName}
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        )
                    }
                </div>
                <div className='mt-3 rounded-lg bg-white'>
                {
                    businesses.map((item,iruka)=>{
                        return(
                            <div className='flex  mx-[2px]  px-3 py-1 gap-1 justify-between' key={crypto.randomUUID()}>
                                <p>{item}</p>
                                <button className='text-red-500' onClick={()=>removeStaff(iruka)}>x</button>
                            </div>
                        )
                    })
                }
                </div>
            </div>
            </ResponsiveElement>
          
        )
    }
    <div className='flex justify-center items-center gap-5'>
        <button className={`px-4 py-1 duration-200 ease-in-out bg-insomnia-primary text-white w-[185px] rounded-md `} onClick={onUpdate}>{pending ? <span className='loading loading-spinner text-default'></span> : <p>Update</p>}</button>
        <button className={`px-4 py-1 text-white duration-200 ease-in-out bg-slate-300 hover:bg-mainLightRed w-[185px] rounded-md`} onClick={()=>closeModal('my_modal_5')}>Cancel</button>
    </div>
    </>
  )
}

export default Editadmin
