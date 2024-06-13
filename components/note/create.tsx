"use client"
import { addNote, udpateNote } from '@/app/(protected)/note/action/note';
import useToggle from '@/hooks/stores';
import { useCurrentUser } from '@/hooks/use-current-user';
import { closeModal, fetchData } from '@/lib/functions';
import { url } from '@/lib/url';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import useSWR from 'swr';

type compInput = {
  label: string;
  value: string | number;
  name: string;
  type: string;
  func: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type createProps ={
    title:string;
    text:string;
    noteDate:string
  }
  


const CompInput: React.FC<compInput> = ({ label, value, name, type, func}) => {


  return (
    <div className='[&>span]:focus-within:text-mainBlue lg:col-span-1 px-3 py-1 pb-3 col-span-1'>
      <span className='text-[12px] font-bold text-slate-400'>{label}</span><br />
        <input
          type={type}
          className='w-full text-[13px] outline-none shadow-sm border-full solid
            border-[1px] rounded-md border-slate-200 focus:border-mainLightBlue h-[30px] px-1 bg-[#F8F8F8]'
          name={name}
          value={value}
          onChange={func}
        />
    </div>
  );
};



const Create = () => {
  const { pending , setPending  ,edit , passingId} = useToggle()
  const user = useCurrentUser()

  const    MIN_TEXTAREA_HEIGHT = 32;
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
  
  const {data , error} = useSWR(`${url}/api/note/${passingId}?email=${user?.id}`,fetchData)

  const note:createProps = data?.editNote || ''
  const [val , setVal] = useState({
    title:'',
    noteDate:''
  })

  useEffect(()=>{
    setVal({
      title: edit ? note.title : '',
      noteDate: edit ? note.noteDate : new Date().toISOString().split('T')[0]
    });
    setText(edit ? note.text : '')
  },[passingId, edit]);

  const left = useMemo(()=>[
    {
      label:"Title",
      type:"text",
      name:'title',
      val:val.title,
    },
  ],[val.title])
  const right = useMemo(()=>[
    {
        label:"Date",
        type:"date",
        name:"noteDate",
        val:val.noteDate
    }
  ],[val.noteDate])



  const handleChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
    const { name, value } = e.target;
  
    setVal({
      ...val,
      [name]: value
    });
  };
  
  
  const onSave = async() =>{
    setPending(true)

    let validation = ''

    const {title , noteDate} = val

    if(!title){
      validation= "sorry this field is required"
      toast.error(validation)
      setPending(false)
    }else{
       addNote({
        title,
        text,
        noteDate
      }).then((data)=>{
        setVal(prev=>({
          ...prev,
          title:'',
          text:'',
          noteDate:''
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
  }

  const onUpdate = async() =>{
    setPending(true)

    let validation = ''

    const {title , noteDate} = val

    if(!title){
      validation= "sorry title is required"
      toast.error(validation)
      setPending(false)
    }else{
       udpateNote({
        id:passingId,
        title,
        text,
        noteDate
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
  }


  if(error){
    return (
        <div>
            error fetching datas
        </div>
    )
  }

  return (
    <>
    <div className='grid grid-cols-2'>
      <div >
      {
        left.map((item)=>{
          return(

               <CompInput key={item.label} value={item.val} label={item.label}  func={handleChange} name={item.name} type={item.type} />
             )
            }
          )
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
    <button className={`px-4 py-1 text-white duration-200 ease-in-out ${val.title  !== "" ? "shadowHover bg-mainLightBlue text-white" : "bg-slate-300"} w-[185px] rounded-md `} onClick={edit ? onUpdate : onSave}>{pending ? <span className='loading loading-spinner text-default'></span> : <p>Save</p>}</button>
      <button className={`px-4 py-1 text-white duration-200 ease-in-out bg-slate-300 hover:bg-mainLightRed w-[185px] rounded-md`} onClick={()=>closeModal('my_modal_5')}>Cancel</button>
    </div>
    </>
  )
}

export default Create;
