"use client"
import { addProduct, editProduct } from '@/app/(protected)/product/actions/product';
import useToggle from '@/hooks/stores';
import { useCurrentUser } from '@/hooks/use-current-user';
import { closeModal, fetchData } from '@/lib/functions';
import { url } from '@/lib/url';
import axios from 'axios';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import useSWR from 'swr';

type compInput = {
  label: string;
  value: string | number;
  name: string;
  type: string;
  func: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePriceblur?:(e: React.FocusEvent<HTMLInputElement>) =>void;
  onclick?:()=>void;
  handleBlur?:()=>void;
  handleKeyDown?:(event: React.KeyboardEvent<HTMLInputElement>)=>void;
  handleFocuss?:()=>void;
}

type prodProps = {
  prodItemName: string;
  prodUnitPrice: string // Update type to allow string or number
  prodBus: string;
  prodSince: string;
  prodBustype:string;
}


const CompInput: React.FC<compInput> = ({ label, handlePriceblur, value, name, type, func ,onclick , handleBlur , handleKeyDown ,handleFocuss}) => {

  const handleFocus = (event:React.FocusEvent<HTMLInputElement>) => event.target.select();

  return (
    <div className='[&>span]:focus-within:text-mainBlue col-span-3 lg:col-span-1 px-3 py-1 pb-3'>
      <span className='text-[12px] font-bold text-slate-400'>{label}</span><br />

      { label === 'Unit Price' ? (
        <input type="text" className='w-full text-[13px] outline-none shadow-sm border-full solid 
          border-[1px] rounded-md border-slate-200 focus:border-mainLightBlue h-[30px] px-1 bg-[#F8F8F8]' 
          name={name}
          value={typeof value === 'string' ? value : value?.toString()}
          onChange={func}
          onFocus={handleFocus}
          onBlur={handlePriceblur}
          />
      ) : (
        <input
          type={type}
          className='w-full text-[13px] outline-none shadow-sm border-full solid
            border-[1px] rounded-md border-slate-200 focus:border-mainLightBlue h-[30px] px-1 bg-[#F8F8F8]'
          name={name}
          value={typeof value === 'string' ? value : value?.toString()}
          onChange={func}
          onClick={onclick}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onFocus={handleFocuss}
        />
      )}
    </div>
  );
};

type createProps ={
  prodItemName:string;
  prodUnitPrice:number | string; // Update type to allow string or number
  prodBus:string;
  prodSince:string;
  prodBusType:string;
  proditemDes:string;
}

type optionDrop = {
  id:string;
  busName:string;
  busType:string;
}

const Create = () => {
  const { pending , setPending  ,edit , passingId , setModalisopen , isModal} = useToggle()
  const user = useCurrentUser()

  const    MIN_TEXTAREA_HEIGHT = 32;
  const textareaRef = useRef<any>(null);
  const [text , setText] = useState("")
  const [focus , setFocus] = useState<number | null>(0)
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const ulRef = useRef<HTMLUListElement>(null);
  const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)
  useLayoutEffect(()=>{
    textareaRef.current.style.height = "inherit";
    textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        MIN_TEXTAREA_HEIGHT
      )}px`;
  },[text])
  
  const {data , error} = useSWR(`${url}/api/product/${passingId}?email=${user?.id}`,fetchData)

  const prods:createProps = data?.editProduct || ''
  const [suggest , setSuggest] = useState<optionDrop[]>([])
  const [isError , setIsError] = useState<boolean>(false)
  const [val , setVal] = useState<prodProps>({
    prodItemName:'',
    prodUnitPrice:'', 
    prodBus:'',
    prodSince:'',
    prodBustype:''
  })

  useEffect(()=>{
    setVal({
      prodItemName: edit ? prods.prodItemName : '',
      prodUnitPrice: edit ? (typeof prods.prodUnitPrice === 'number' ? `$${prods.prodUnitPrice.toFixed(2)}` : prods.prodUnitPrice) : '',
      prodBus: edit ? prods.prodBus : '',
      prodSince: edit ? prods.prodSince : new Date().toISOString().split('T')[0],
      prodBustype: edit ? prods.prodBusType : ''
    });
    setText(edit ? prods.proditemDes : '')

    if(isModal === true && !edit){
      setVal(prev=>({
        ...prev,
        prodSince:new Date().toISOString().split('T')[0],
      }))
    }
    
  },[passingId,isModal, edit, prods]);


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
            prodBus:suggest.find(item => item.id === selectedItemId)?.busName || "",
            prodBustype:suggest.find(item => item.id === selectedItemId)?.busType || ""
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
      label:"Item Name",
      type:"text",
      name:'prodItemName',
      val:val.prodItemName,
    },
    {
      label:'Business',
      type:'text',
      name:'prodBus',
      val:val.prodBus
    }
  ],[val.prodItemName , val.prodBus])
  const right = useMemo(()=>[
    {
        label:"Unit Price",
        type:"text",
        name:"prodUnitPrice",
        val:val.prodUnitPrice
    },
    {
        label:"Product Since",
        type:"date",
        name:"prodSince",
        val:val.prodSince
    }
  ],[val.prodUnitPrice , val.prodSince])

  const formatValueWithDollarSign = (value: number): string => {
    return `$${value.toFixed(2)}`;
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    // Ensure prodUnitPrice is always stored as a string
    let newValue: string | number = value;
  
    if (name === 'prodUnitPrice') {
      const parsedValue = parseFloat(value);
      const valueWithoutDollarSign = value.replace(/\$/g, '');
      isNaN(parsedValue) ? '' : valueWithoutDollarSign
    }
  
    setVal({
      ...val,
      [name]: newValue,
    });
    
    if(name === 'prodBus' && value  !== ""){
      setVal(prev=>({
        ...prev,
        prodBustype:suggest.find(item => item.busName === value)?.busType || ""
      }))
      setFocus(1)
    }else{
      fetchDatas('')
    }
  };
  
  const handleProBlur = (e:React.FocusEvent<HTMLInputElement>) =>{
    const value = parseFloat(e.target.value.replace(/\$/g, ''))
    const formattedValue = isNaN(value) ? '' : formatValueWithDollarSign(value)
    setVal({
      ...val,
      prodUnitPrice:formattedValue
    })
  }

  useEffect(()=>{
    if(val.prodBus !== ""){
      fetchDatas(val.prodBus)
    }
  },[val.prodBus])
  
  
  const onSave = async() =>{
    setPending(true)

    let validation = ''

    const {prodItemName , prodUnitPrice , prodBus , prodSince , prodBustype} = val

    if(!prodItemName || !prodBus || !text){
      validation= "product item name , product unitprice , product business , product since is required!"
      toast.error(validation)
      setPending(true)
          setIsError(true)
    }else{
       addProduct({
        prodItemName:prodItemName,
        prodUnitPrice:prodUnitPrice,
        prodBus:prodBus,
        prodSince:prodSince,
        proditemDes:text,
        prodBusType: prodBustype
      }).then((data)=>{
        setVal(prev=>({
          ...prev,
          prodItemName:'',
          prodUnitPrice:'',
          prodBus:'',
          prodBustype:''
        }))
        setText('')
        if(data?.error){
          toast.error(data.error)
          setPending(true)
          setIsError(true)
        }
        if(data?.success){
          toast.success(data.success)
          setPending(false)
          setIsError(false)
        }
      }).catch(()=>{
        toast.error("something went wrong")
        setPending(true)
          setIsError(true)
      })
    }
  }

  const onUpdate = async() =>{
    setPending(true)

    let validation = ''

    const {prodItemName , prodUnitPrice , prodBus , prodSince , prodBustype} = val

    if(!prodItemName || !prodBus || !text){
      validation= "product item name , product unitprice , product business , product since is required!"
      toast.error(validation)
      setPending(true)
          setIsError(true)
    }else{
       editProduct({
        id:passingId,
        prodItemName:prodItemName,
        prodUnitPrice:prodUnitPrice,
        prodBus:prodBus,
        prodSince:prodSince,
        proditemDes:text,
        prodBusType:prodBustype
      }).then((data)=>{
        if(data?.error){
          toast.error(data.error)
          setPending(true)
          setIsError(true)
        }
        if(data?.success){
          toast.success(data.success)
          setPending(false)
          setIsError(false)
        }
      }).catch(()=>{
        toast.error("something went wrong")
        setPending(true)
          setIsError(true)
      })
    }
  }


  const handleFilClick = (value:string | undefined , type: string | undefined) =>{
    if(value === undefined || type === undefined){
      setVal({
        ...val,
        prodBus:'',
        prodBustype:''
      })
    }else{
      setVal({
        ...val,
        prodBus:value,
        prodBustype:type
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
            <React.Fragment key={item.label}>
            {
             item.label !== "Business" ? (
               <CompInput value={item.val} label={item.label}  func={handleChange} name={item.name} type={item.type} />
             ) : (
               <div>
                 <CompInput value={item.val} label={item.label}  func={handleChange} name={item.name} type={item.type} onclick={()=>fetchDatas('')} handleKeyDown={handleKeyDown}  handleFocuss={()=>setFocus(1)} handleBlur={()=>setTimeout(()=>{
                          setFocus(null)
                        }, 150)}/>
                   <div className='relative mx-[13px]'>
                     {
                       focus === 1 && (
                         <ul ref={ulRef} className='absolute bg-white w-full rounded-md max-h-[100px] overflow-auto'>
                           {
                             suggest.map((item)=>{
                               return(
                                 <li key={item.id} data-id={item.id} className={`cursor-pointer px-2 ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`}  onClick={()=>handleFilClick(item?.busName , item?.busType)}>
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
            </React.Fragment>
          )
        })
      }
      </div>
      <div >
      {
        right.map((item)=>{
          return(
            <CompInput handlePriceblur={handleProBlur} key={item.label} value={item.val} label={item.label} func={handleChange} name={item.name} type={item.type}/>
          )
        })
      }
      </div>
    </div>
    <div className=" flex justify-center pb-[20px] ">
          <div className="[&>span]:focus-within:text-mainBlue w-full px-3">
          <span className={` text-[12px] font-bold text-slate-400`}>Item Description</span><br/>
          <textarea name="itemDes" className="w-full px-1 overflow-y-hidden bg-[#F8F8F8] h-[150px] text-[13px] border-solid border-[1px] shadow-sm   rounded-md border-slate-200 focus:border-mainLightBlue outline-none " onChange={onChange}
          ref={textareaRef}
          style={{
            minHeight: MIN_TEXTAREA_HEIGHT,
            resize: "none"
          }}
          value={text} >

            </textarea>
          </div>
          </div>
          <input className='hidden' type="text" name='prodBustype' value={val.prodBustype} onChange={handleChange}/>
    <div className='flex justify-center items-center gap-5'>
    <button className={`px-4 py-1 text-white duration-200 ease-in-out ${val.prodItemName  !== "" || val.prodBus !== "" ? "shadowHover bg-mainLightBlue text-white" : "bg-slate-300"} w-[185px] rounded-md `} onClick={edit ? onUpdate : onSave}>{pending ? isError ? <p>{edit ? "Update" : "Save"}</p> : <span className='loading loading-spinner text-default'></span> : <p>{edit ? "Update" : "Save"}</p>}</button>
      <button className={`px-4 py-1 text-white duration-200 ease-in-out bg-slate-300 hover:bg-mainLightRed w-[185px] rounded-md`} onClick={()=>closeModal('my_modal_5')}>Cancel</button>
    </div>
    </>
  )
}

export default Create;
