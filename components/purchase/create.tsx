"use client"
import useToggle from '@/hooks/stores';
import { useCurrentUser } from '@/hooks/use-current-user';
import { closeModal, fetchData } from '@/lib/functions';
import React, {useLayoutEffect, ChangeEvent, useRef, useState, useMemo, useEffect } from 'react'
import { toast } from 'react-toastify';
import { addPurchase, editPurchase } from '@/app/(protected)/purchase/actions/purchase';
import useSWR from 'swr';
import { url } from '@/lib/url';
import axios from 'axios';



type imgUploadProps = {
    image:File | undefined;
    image1:File | undefined
}

type compInput = {
  label:string;
  type:string;
  name:string | keyof imgUploadProps;
  value:string | number | File | undefined;
  func:(e: React.ChangeEvent<HTMLInputElement>) => void;
  classes?:string;
  handlePriceblur?:(e: React.FocusEvent<HTMLInputElement>) =>void
  handleClick?:()=>void;
  handleBlur?:()=>void;
  handleKeyDown?:(event: React.KeyboardEvent<HTMLInputElement>)=>void;
  handleFocuss?:()=>void;
}

type purProps = {
  purName:string;
  purPrice:string;
  purBus:string;
  purSince:string;
  purInvN:string
  purSupp:string;
  oldImg?:string;
  oldImg1?:string;
}



const CompInput = ({label, handlePriceblur, value, name,  type, func , handleClick, classes , handleBlur,handleKeyDown,handleFocuss}: compInput) =>{
  const handleFocus = (event:React.FocusEvent<HTMLInputElement>) => event.target.select();
  return (
    <div className={`[&>span]:focus-within:text-mainBlue col-span-3 lg:col-span-1 px-3 py-1 pb-3 ${classes}`}>
      <span className='text-[12px] font-bold text-slate-400'>{label}</span><br />
      {
    label === 'Unit Price' ? (
          <input autoComplete='off' type="text" className='w-full text-[13px] outline-none shadow-sm border-full solid 
          border-[1px] rounded-md border-slate-200 focus:border-mainLightBlue h-[30px] px-1 bg-[#F8F8F8]' 
          name={name}
          value={typeof value === 'string' ? value : value?.toString()}
          onChange={func}
          onFocus={handleFocus}
          onBlur={handlePriceblur}
          />
        ) : (
          <input autoComplete='off' type={type} className='w-full text-[13px] outline-none shadow-sm border-full solid 
          border-[1px] rounded-md border-slate-200 focus:border-mainLightBlue h-[30px] px-1 bg-[#F8F8F8]'
          name={name} value={typeof value === 'string' ? value : value?.toString()} onChange={func} onClick={handleClick} onBlur={handleBlur} onKeyDown={handleKeyDown} onFocus={handleFocuss}/>
        )
      }
    </div>
  )
}

type createProps = {
  purName:string;
  purPrice:number | string
  purBus: string;
  purInvN:string;
  purSince:string;
  purSupp:string;
  purDes:string;
  image1:string;
  image2:string
}

type optionDrop = {
  id:string;
  busName:string;
}

const Create = () => {
  const { pending , setPending  ,edit , passingId} = useToggle()
  const [suggest , setSuggest] = useState<optionDrop[]>([])
  const user = useCurrentUser()
  const [focus , setFocus] = useState<number | null>(0)
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const ulRef = useRef<HTMLUListElement>(null);
  const MIN_TEXTAREA_HEIGHT = 32;
  const textareaRef = useRef<any>(null);
  const [text , setText] = useState("")
  const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)
  useLayoutEffect(()=>{
    textareaRef.current.style.height = "inherit";
    textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        MIN_TEXTAREA_HEIGHT
      )}px`;
  },[text])

  const {data ,error} = useSWR(`${url}/api/purchase/${passingId}?email=${user?.id}`,fetchData)

  const pur:createProps = data?.editPur || ''

  const [val , setVal] = useState<purProps>({
    purName:'',
    purPrice:'',
    purBus:'',
    purSince:'',
    purInvN:'',
    purSupp:'',
    oldImg:'',
    oldImg1:''
  })

  useEffect(()=>{
    setVal({
      purName: edit ? pur.purName : '',
      purPrice: edit ? (typeof pur.purPrice === 'number' ? `$${pur.purPrice.toFixed(2)}` : pur.purPrice) : '',
      purBus: edit ? pur.purBus : '',
      purSince: edit ? pur.purSince : new Date().toISOString().split('T')[0],
      purInvN: edit ? pur.purInvN : '',
      purSupp: edit ? pur.purSupp : '',
      oldImg: edit ? pur.image1 : '',
      oldImg1: edit ? pur.image2:''
    });
    setText(pur.purDes)
  },[passingId, edit, pur]);

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
            purBus:suggest.find(item => item.id === selectedItemId)?.busName || ""
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

  const [image , setImage] = useState<imgUploadProps>({
    image:undefined,
    image1:undefined
  })

  const fileInput1 = useRef<HTMLInputElement>(null);
  const fileInput2 = useRef<HTMLInputElement>(null);
  
  const handleImageSelection = (ref: React.RefObject<HTMLInputElement>, key: keyof imgUploadProps) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, key: keyof imgUploadProps) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileType = file.type;
      const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  
      if (validImageTypes.includes(fileType)) {
        setImage((prevState) => ({
          ...prevState,
          [key]: file,
        }));
      }else {
        console.error('Invalid file type');
      }
    }else{
      console.error('no files selected')
    }
  };

  const left = useMemo(()=>[
    {
      label:"Item Name",
      type:"text",
      name:'purName',
      val:val.purName,
    },
    {
      label:"Business",
      type:"text",
      name:'purBus',
      val:val.purBus,
    },
    {
      label:"Invoice No",
      type:"text",
      name:'purInvN',
      val:val.purInvN,
    },
    {
      label:"Supplier",
      type:"text",
      name:'purSupp',
      val:val.purSupp,
    },
  ],[val.purName , val.purBus , val.purInvN , val.purSupp])
  const right = useMemo(()=>[
    {
      label:'Unit Price',
      type:'text',
      name:'purPrice',
      val:val.purPrice
    },
    {
      label:'Purchase Date',
      type:'date',
      name:'purSince',
      val:val.purSince
    },
    {
      label:'Image 1',
      type:'button',
      name:'image',
      func:()=>handleImageSelection(fileInput1, 'image' as keyof imgUploadProps),
      val:image.image
    },
    {
      label:'Image 2',
      type:'button',
      name:'image1',
      func:()=>handleImageSelection(fileInput2, 'image1' as keyof imgUploadProps),
      val:image.image1
    }
  ],[val.purPrice , val.purSince , image.image , image.image1])

  const formatValueWithDollarSign = (value: number): string => {
    return `$${value.toFixed(2)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue: string | number = value;
  
    if (name === 'purPrice') {
      const parsedValue = parseFloat(value);
      const valueWithoutDollarSign = value.replace(/\$/g, '');
      isNaN(parsedValue) ? '' : valueWithoutDollarSign
    }else if (name === 'purInvN') {
      const numericValue = parseInt(value);
      newValue = isNaN(numericValue) ? '' : numericValue;
    }
  
    setVal({
      ...val,
      [name]: newValue,
    });
    if(name === 'purBus' && value !== ""){
      setFocus(1)
    }else{
      fetchDatas('')
    }
  };

  const handlePurBlur = (e:React.FocusEvent<HTMLInputElement>) =>{
    const value = parseFloat(e.target.value.replace(/\$/g, ''))
    const formattedValue = isNaN(value) ? '' : formatValueWithDollarSign(value)
    setVal({
      ...val,
      purPrice:formattedValue
    })
  }

  useEffect(()=>{
    if(val.purBus !== ""){
      fetchDatas(val.purBus)
    }
  },[val.purBus])

  const onSave = async () => {
    const {purName , purBus , purInvN , purPrice ,purSupp,purSince} = val
    setPending(true)

    let validation = ''

    const formData = new FormData();

    if (image.image) {
      formData.append('image', image.image);
    }

    if (image.image1) {
        formData.append('image1', image.image1);
    }

    if(!purName || !purPrice){
      validation= "sorry this field is required"
      toast.error(validation)
      setPending(false)
    }else{
       addPurchase({
        purName:purName,
        purPrice:purPrice,
        purBus:purBus,
        purSince:purSince,
        purInvN:purInvN.toString(),
        purDes:text,
        purSupp:purSupp.toString()
       },formData)
       .then((data)=>{
        setImage({
          image: undefined,
          image1: undefined,
        });
        setVal(prev=>({
          ...prev,
          purName:'',
          purPrice:'',
          purBus:'',
          purSince:'',
          purInvN:'',
          purDes:'',
          purSupp:''
        }))
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
   
  };

  const onUpdate = async () =>{
    const {purName , purBus ,oldImg1 , oldImg, purInvN , purPrice ,purSupp,purSince} = val
    setPending(true)

    let validation = ''

    const formData = new FormData();

    if (image.image) {
      formData.append('image', image.image);
    }

    if (image.image1) {
        formData.append('image1', image.image1);
    }

    if(!purName || !purPrice){
      validation= "sorry this field is required"
      toast.error(validation)
      setPending(false)
    }else{
       editPurchase({
        id:passingId,
        purName:purName,
        purPrice:purPrice,
        purBus:purBus,
        purSince:purSince,
        purInvN:purInvN,
        purDes:text,
        purSupp:purSupp,
        oldImg:oldImg,
        oldImg1:oldImg1
       },formData)
       .then((data)=>{
        setImage({
          image: undefined,
          image1: undefined,
        });
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
  }


  const handleFilClick = (value:string | undefined) =>{
    if(value === undefined){
      setVal({
        ...val,
        purBus:''
      })
    }else{
      setVal({
        ...val,
        purBus:value
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
                <CompInput  value={item.val} label={item.label}  func={handleChange} name={item.name} type={item.type}/>
              ) : (
                <div>
                  <CompInput  value={item.val} label={item.label}  func={handleChange} name={item.name} type={item.type} handleClick={()=>fetchDatas('')} handleKeyDown={handleKeyDown}  handleFocuss={()=>setFocus(1)} handleBlur={()=>setTimeout(()=>{
                          setFocus(null)
                        }, 150)}/>
                  <div className='relative mx-[13px]'>
                    {
                      focus === 1 && (
                        <ul ref={ulRef} className='absolute bg-white w-full rounded-md max-h-[100px] overflow-auto'>
                          {
                            suggest.map((item)=>{
                              return(
                                <li key={item.id} data-id={item.id} className={`cursor-pointer px-2 ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`}   onClick={()=>handleFilClick(item?.busName)}>
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
            <React.Fragment key={item.label}>
              {item.label === 'Image 1' || item.label === 'Image 2' ? (
                <div className='flex justify-center my-3 px-[5px] pt-1 pb-3'>
                  <label
                    className={`${item.val !== undefined ? 'bg-mainLightBlue  shadowHover' : "bg-slate-300 "} cursor-pointer duration-200 ease-in-out px-3 w-full py-1 my-[2px] font-bold text-center text-white rounded-lg`}
                    onClick={item.func}
                  >
                    {item.label}
                  </label>
                </div>
              ) : (
                <CompInput
                handlePriceblur={handlePurBlur}
                    value={typeof item.val === 'string' ? item.val : ''}
                    label={item.label}
                    func={handleChange}
                    name={item.name}
                    type={item.type}
                  />
              )}
            </React.Fragment>
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
    <div className='flex justify-center items-center gap-5'>
    <button className={`px-4 py-1 text-white duration-200 ease-in-out ${val.purName  !== "" || val.purPrice !== "" ? "shadowHover bg-mainLightBlue text-white" : "bg-slate-300"} w-[185px] rounded-md `} onClick={edit ? onUpdate : onSave}>{pending ? <span className='loading loading-spinner text-default'></span> : <p>Save</p>}</button>
      <button className={`px-4 py-1 text-white duration-200 ease-in-out bg-slate-300 hover:bg-mainLightRed w-[185px] rounded-md`} onClick={()=>closeModal('my_modal_5')}>Cancel</button>
    </div>
    <input type="file" className="hidden" ref={fileInput1} name="image" onChange={(e) => handleImageChange(e, 'image')} />
    <input type="file" className="hidden" ref={fileInput2} name="image1" onChange={(e) => handleImageChange(e, 'image1')} />
    <input type="text" value={val.oldImg === '' ? 'empty' : val.oldImg} className='hidden'/>
    <input type="text" value={val.oldImg === '' ? 'empty' : val.oldImg1} className='hidden'/>
    </>
  )
}

export default Create