"use client"
import { addBus, editBusiness } from '@/app/(protected)/bussiness/action/business';
import useToggle from '@/hooks/stores'
import { useCurrentUser } from '@/hooks/use-current-user';
import { closeModal, fetchData, validateEmail } from '@/lib/functions';
import { url } from '@/lib/url';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import useSWR from 'swr';

  type compInput = {
    label:string;
    type:string;
    name:string;
    value:string
    list:string;
    func:(e: React.ChangeEvent<HTMLInputElement>) => void;
    funcChange?:(e:React.ChangeEvent<HTMLSelectElement>) => void;
    funcText?:(e:React.ChangeEvent<HTMLTextAreaElement>) =>void;
  }

  type businessProps = {
    /////// business info
    busName:string;
    busEmail:string;
    busType:string;
    busAddr:string;
    busPhone1:string;
    busPhone2:string;
    busDes:string;
    busInvkh:string;
    busTelegram:string;
    busInvEng:string;
    /////// payment info
    busBankName:string;
    busBankNumber:string;
    busBankDes:string;
    busPayTerm:string;
    ///// old img
    oldImg?:string;
    oldImg1?:string;
    oldImg2?:string;
    oldImg3?:string;
    oldImg4?:string;
  }

  type busImgProps = {
    abaQr:File | undefined;
    bankLogo:File | undefined;
    signature:File | undefined;
    busLogo:File | undefined;
    Rec1:File | undefined;
  }


  const CompInput = ({label,value,name,list,type,func,funcChange,funcText}:compInput) =>{
    
    return (
      <div className='[&>span]:focus-within:text-mainBlue col-span-3 lg:col-span-1  px-3 py-1 pb-3'>
         <span className='text-[12px] font-bold text-slate-400'>{label}</span><br />
       {
        type === "select" ?  (
          <>
          <select className='w-full text-[13px] outline-none shadow-sm border-full solid 
          border-[1px] rounded-md border-slate-200 focus:border-mainLightBlue  h-[30px] px-1 bg-[#F8F8F8]
          ' name={name} value={value} onChange={funcChange}>
              <option value="general">General</option>
              <option value="meter">M2</option>
          </select>
         
         </>
        ) : type === 'textarea' ? (
            <>
            <textarea name={name} className='w-[390px] text-[13px] outline-none shadow-sm border-full solid 
                 border-[1px] rounded-md border-slate-200 focus:border-mainLightBlue px-1 bg-[#F8F8F8]
         ' value={value}  onChange={funcText}>
            </textarea>
            </>
        ) : (
         
         <>
        
           <input type={type} className='w-full text-[13px] outline-none shadow-sm border-full solid 
                 border-[1px] rounded-md border-slate-200 focus:border-mainLightBlue  h-[30px] px-1 bg-[#F8F8F8]
         ' name={name} value={value}  onChange={func}/>
         </>
        )
       }
      </div>
    )
  }

type createProps = {
    busName:string;
    busEmail:string;
    busType:string;
    busAddr:string;
    busPhone1:string;
    busPhone2:string;
    busDes:string;
    busInvkh:string;
    busTelegram:string;
    busInvEng:string;
    /////// payment info
    busBankName:string;
    busBankNumber:string;
    busBankDes:string;
    busPayTerm:string;
    /////image type 
    abaQr:string;
    bankLogo:string;
    signature:string;
    busLogo:string;
    Rec1:string;
    Rec2:string
    abaLogo:string;
}

const Create = () => {
    const [isError , setIsError] = useState<boolean>(false)
    const { pending , setPending , isModal , bgModal ,edit , setPassingId , onCancel , setModalisopen , passingId} = useToggle()
    const user = useCurrentUser()
    const ref1 = useRef<HTMLInputElement>(null)
    const ref2 = useRef<HTMLInputElement>(null)
    const ref3 = useRef<HTMLInputElement>(null)
    const ref4 = useRef<HTMLInputElement>(null)
    const ref5 = useRef<HTMLInputElement>(null)

    const { data , error } = useSWR(`${url}/api/business/${passingId}?email=${user?.id}`,fetchData)

    const buses:createProps = data?.editbus || ''
    
    const [val , setVal] = useState<businessProps>({
        busName:'',
        busAddr:'',
        busBankDes:'',
        busBankName:'',
        busBankNumber:'',
        busDes:'',
        busEmail:'',
        busInvEng:'',
        busInvkh:'',
        busPayTerm:'',
        busPhone1:'',
        busPhone2:'',
        busTelegram:'',
        busType:'',
        oldImg:'',
        oldImg1:'',
        oldImg2:'',
        oldImg3:'',
        oldImg4:''
    })

    useEffect(()=>{
        setVal({
            busName:edit ? buses.busName : '',
            busAddr:edit ? buses.busAddr : '',
            busBankDes:edit ? buses.busBankDes : '',
            busBankName:edit ? buses.busBankName : '',
            busBankNumber:edit ? buses.busBankNumber : '',
            busDes:edit ? buses.busDes : '',
            busEmail:edit ? buses.busEmail : '',
            busInvEng:edit ? buses.busInvEng : '',
            busInvkh:edit ? buses.busInvkh : '',
            busPayTerm:edit ? buses.busPayTerm : '',
            busPhone1:edit? buses.busPhone1 : '',
            busPhone2:edit ? buses.busPhone2 : '',
            busTelegram:edit ? buses.busTelegram : '',
            busType:edit ? buses.busType : '',
            oldImg:edit ? !buses.abaQr ? '' : buses.abaQr : '',
            oldImg1:edit ? !buses.signature ? '' : buses.signature : '',
            oldImg2:edit ? !buses.busLogo ? '' : buses.busLogo : '',
            oldImg3:edit ? !buses.Rec1 ? '' : buses.Rec1 : '',
            oldImg4:edit ? !buses.bankLogo ? '' : buses.bankLogo : ''
        })
      },[passingId, edit, buses ]);

      useEffect(()=>{
        setPending(false)
      },[])

    const [image , setImage] = useState<busImgProps>({
        abaQr:undefined,
        bankLogo:undefined,
        signature:undefined,
        busLogo:undefined,
        Rec1:undefined,
    })

    const Busleft = useMemo(()=>[
        {
            label:'Business Name',
            type:"text",
            name:"busName",
            val:val.busName
        },
        
        {
            label:'Phone Number 1',
            type:"text",
            name:"busPhone1",
            val:val.busPhone1
        },
        {
            label:'Phone Number 2',
            type:"text",
            name:"busPhone2",
            val:val.busPhone2
        },
    ],[val ])
    const Busright = useMemo(()=>[
        {
            label:'Business Select',
            type:"select",
            name:"busType",
            val:val.busType
        },
        {
            label:'Email',
            type:"text",
            name:"busEmail",
            val:val.busEmail
        },
        
        {
            label:'Telegram',
            type:"text",
            name:"busTelegram",
            val:val.busTelegram
        },
    ],[val ])

    const bgCenter = useMemo(()=>[
        {
            label:'Address',
            type:"textarea",
            name:"busAddr",
            val:val.busAddr
        },
        {
            label:'Business Description',
            type:"textarea",
            name:"busDes",
            val:val.busDes
        },
        {
            label:'Invoice Khmer',
            type:"textarea",
            name:"busInvkh",
            val:val.busInvkh
        },
        {
            label:'Invoice English',
            type:"textarea",
            name:"busInvEng",
            val:val.busInvEng
        },
    ],[val])

    const Payleft = useMemo(()=>[
        {
            label:"Bank Name",
            type:'text',
            name:'busBankName',
            val:val.busBankName
        },
        {
            label:"Bank Number",
            type:'text',
            name:'busBankNumber',
            val:val.busBankNumber
        },
        {
            label:"Bank Description",
            type:'text',
            name:'busBankDes',
            val:val.busBankDes
        },
    ],[val.busBankName , val.busBankNumber,val.busBankDes])
    const Payright = useMemo(()=>[
        {
            label:"Bank Qr",
            type:"button",
            name:"abaQr",
            func:()=>handleImageSelection(ref1,'abaQr' as keyof busImgProps),
            val:image.abaQr,
            oldImg:val.oldImg
        },
        {
            label:"Bank Logo",
            type:"button",
            name:"bankLogo",
            func:()=>handleImageSelection(ref5 , 'bankLogo' as keyof busImgProps),
            val:image.bankLogo,
            oldImg:val.oldImg4
        },
        {
            label:"Signature",
            type:"button",
            name:"signature",
            func:()=>handleImageSelection(ref2,'signature' as keyof busImgProps),
            val:image.signature,
            oldImg:val.oldImg1
        },
        {
            label:"Business Logo",
            type:"button",
            name:"busLogo",
            func:()=>handleImageSelection(ref3,'busLogo' as keyof busImgProps),
            val:image.busLogo,
            oldImg:val.oldImg2
        },
        {
            label:"Receipt Logo",
            type:"button",
            name:"Rec1",
            func:()=>handleImageSelection(ref4,'Rec1' as keyof busImgProps),
            val:image.Rec1,
            oldImg:val.oldImg3
        },

    ],[image.abaQr,image.busLogo,image.signature , image.Rec1 , image.bankLogo , val.oldImg , val.oldImg1 , val.oldImg2 , val.oldImg3 , val.oldImg4])

    useEffect(()=>{
        if(isModal === true){
            setVal(prev=>({
                ...prev,
                busName:'',
                busAddr:'',
                busBankDes:'',
                busBankName:'',
                busBankNumber:'',
                busDes:'',
                busEmail:'',
                busInvEng:'',
                busInvkh:'',
                busPayTerm:'',
                busPhone1:'',
                busPhone2:'',
                busTelegram:'',
                busType:'',   
                oldImg:'',
                oldImg1:'',
                oldImg2:'',
                oldImg3:'',
                oldImg4:''
            }))
            setImage({
                abaQr:undefined,
                bankLogo:undefined,
                signature:undefined,
                busLogo:undefined,
                Rec1:undefined,
            })
        }
    },[isModal])

    const handleBusChange = (e:React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) =>{
        const {name , value} = e.target

        if((name === 'busPhone1' || name === 'busPhone2' || name === 'busBankNumber') && isNaN(Number(value))){
            setVal(prevVal => ({
                ...prevVal,
                [name]: ''
            }));
        } else {
            setVal(prevVal => ({
                ...prevVal,
                [name]: value
            }));
        }
    }

    const handleSelectChange = (e:React.ChangeEvent<HTMLSelectElement>) =>{
        const {name , value} = e.target
        setVal({
            ...val,[name]:value
        })
    }

    const handleImageSelection = (ref: React.RefObject<HTMLInputElement>, key: keyof busImgProps) => {
        if (ref.current) {
          ref.current.click();
        }
      };

      const handleTextarea = (e:React.ChangeEvent<HTMLTextAreaElement>) =>{
        const {name , value} = e.target
        setVal({
            ...val,[name]:value
        })
      }
    
      const handleImageChange = (e: ChangeEvent<HTMLInputElement>, key: keyof busImgProps) => {
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

    const onSave = async() =>{
        setPending(true)
        const {busName 
            , busAddr 
            , busBankDes
            , busBankName
            , busBankNumber
            , busDes
            , busEmail
            , busInvEng
            , busInvkh
            , busPayTerm
            , busPhone1
            , busPhone2
            , busTelegram
            , busType} = val    
        let validation = ''
    
        const formData = new FormData();
    
        if (image.abaQr) {
          formData.append('abaQr', image.abaQr);
        }
    
        if (image.signature) {
            formData.append('signature', image.signature);
        }

        if (image.busLogo){
            formData.append("busLogo",image.busLogo)
        }

        if(image.Rec1){
            formData.append("Rec1",image.Rec1)
        }

        if(image.bankLogo){
            formData.append('bankLogo',image.bankLogo)
        }
    
        if(!busName || !busPhone1 ){
          validation= "sorry business name , phone number is required"
          toast.error(validation)
          setPending(true)
          setIsError(true)
        }else if(!validateEmail(busEmail)){
            validation="Invalid Email"
            toast.error(validation)
            setPending(true)
            setIsError(true)
        }else{
           addBus({
            busName:busName,
            busEmail:busEmail,
            busType:busType,
            busAddr:busAddr,
            busBankDes:busBankDes,
            busBankName:busBankName,
            busBankNumber:busBankNumber,
            busPhone1,
            busPhone2,
            busPayTerm,
            busTelegram,
            busDes:busDes,
            busInvEng:busInvEng,
            busInvkh:busInvkh,
           },formData)
           .then((data)=>{
            setImage({
              abaQr:undefined,
              bankLogo:undefined,
              signature:undefined,
              busLogo:undefined,
              Rec1:undefined,
            });
            setVal({
                busName:'',
                busAddr:'',
                busBankDes:'',
                busBankName:'',
                busBankNumber:'',
                busDes:'',
                busEmail:'',
                busInvEng:'',
                busInvkh:'',
                busPayTerm:'',
                busPhone1:'',
                busPhone2:'',
                busTelegram:'',
                busType:''
            })
            if(data?.error){
              toast.error(data.error)
              setPending(true)
              setIsError(true)
            }
            if(data?.success){
              toast.success(data.success)
              setPending(false)
              setIsError(false)
              setModalisopen(false)
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
        const {busName ,oldImg , oldImg1 , oldImg2 , oldImg3 ,oldImg4 , busAddr , busBankDes, busBankName , busBankNumber , busDes , busEmail , busInvEng , busInvkh , busPayTerm , busPhone1 , busPhone2 , busTelegram , busType} = val
        let validation = ''
    
        const formData = new FormData();
    
        if (image.abaQr) {
          formData.append('abaQr', image.abaQr);
        }
    
        if (image.signature) {
            formData.append('signature', image.signature);
        }

        if (image.busLogo){
            formData.append("busLogo",image.busLogo)
        }

        if(image.Rec1){
            formData.append("Rec1",image.Rec1)
        }

        if(image.bankLogo){
            formData.append('bankLogo',image.bankLogo)
        }
    
        if(!busName || !busPhone1 || !busType){
          validation= "sorry business name , phone number and business type is required"
          toast.error(validation)
          setPending(true)
           setIsError(true)
        }else{
           editBusiness({
            id:passingId,
            busName:busName,
            busEmail:busEmail,
            busType:busType,
            busAddr:busAddr,
            busBankDes:busBankDes,
            busBankName:busBankName,
            busBankNumber:busBankNumber,
            busDes:busDes,
            busInvEng:busInvEng,
            busInvkh:busInvkh,
            busTelegram,
            busPhone1,
            busPhone2,
            busPayTerm,
            oldImg:oldImg,
            oldImg1:oldImg1,
            oldImg2:oldImg2,
            oldImg3:oldImg3,
            oldImg4:oldImg4
           },formData)
           .then((data)=>{
            setImage({
              abaQr:undefined,
              bankLogo:undefined,
              signature:undefined,
              busLogo:undefined,
              Rec1:undefined,
            });
            if(data?.error){
              toast.error(data.error)
              setPending(true)
              setIsError(true)
              onCancel()
              setPassingId('')
            }
            if(data?.success){
              toast.success(data.success)
              setPending(false)
              setIsError(false)
              setModalisopen(false)
              onCancel()
              setPassingId('')
            }
          }).catch(()=>{
            toast.error("something went wrong")
            setPending(true)
              setIsError(true)
              onCancel()
              setPassingId('')
          })
        }
    }

  return (
    <>

    {
        bgModal === "bgLeft" && (
           <>
             <div className='flex justify-center items-center'>
                <div>
                    {
                        Busleft.map((item)=>{
                            return(
                                <CompInput key={item.label} value={item.val} label={item.label} list={item.label} func={handleBusChange}  name={item.name} type={item.type}/>
                            )
                        })
                    }
                </div>
                <div>
                    {
                        Busright.map((item)=>{
                            return(
                                <CompInput key={item.label} value={item.val} label={item.label} list={item.label} func={handleBusChange} funcChange={handleSelectChange} name={item.name} type={item.type}/>
                            )
                        })
                    }
                </div>
            </div>
            <div className='flex justify-center items-center gap-5 mt-[158px]'>
                <button className={`px-4 py-1 text-white duration-200 ease-in-out ${val.busName !== "" || val.busType !== "" ? "text-white shadowHover bg-mainLightBlue" : "bg-slate-300 "}  w-[185px] rounded-md `} onClick={edit ? onUpdate : onSave}>{pending ? isError ? <p>{edit ? "Update" : "Save"}</p> : <span className='loading loading-spinner text-default'></span> : <p>{edit ? "Update" : "Save"}</p>}</button>
                <button className={`px-4 py-1 text-white duration-200 ease-in-out bg-slate-300 hover:bg-insomnia-primary w-[185px] rounded-md`} onClick={()=>closeModal('my_modal_5')}>Cancel</button>
            </div>
           </>
        )
    }
    {
        bgModal === 'bgCenter' && (
            <>
            <div className='flex justify-center items-center'>
            <div>
                    {
                        bgCenter.map((item)=>{
                            return(
                                <CompInput key={item.label} value={item.val} label={item.label} list={item.label} func={handleBusChange} name={item.name} type={item.type} funcText={handleTextarea}/>
                            )
                        })
                    }
                </div>
                
            </div>
            <div className='flex justify-center items-center gap-5 mt-[20px]'>
                <button className={`px-4 py-1 text-white duration-200 ease-in-out ${val.busName  !== "" || val.busType !== "" ? "shadowHover bg-mainLightBlue text-white" : "bg-slate-300 "} w-[185px] rounded-md `} onClick={edit ? onUpdate : onSave}>{pending ? isError ? <p>{edit ? "Update" : "Save"}</p> : <span className='loading loading-spinner text-default'></span> : <p>{edit ? "Update" : "Save"}</p>}</button>
                <button className={`px-4 py-1 text-white duration-200 ease-in-out bg-slate-300 hover:bg-insomnia-primary w-[185px] rounded-md`} onClick={()=>closeModal('my_modal_5')}>Cancel</button>
            </div>
            </>
        )
    }
    {
        bgModal === "bgRight" && (
            <>
            <div className='flex justify-center items-center'>
                <div>
                    {
                        Payleft.map((item)=>{
                            return(
                                <CompInput key={item.label} value={item.val} label={item.label} list={item.label} func={handleBusChange} name={item.name} type={item.type}/>
                            )
                        })
                    }
                </div>
                <div className='mt-3'>
                    {
                        Payright.map((item)=>{
                            return(
                                <div className='flex justify-center pb-3 w-[184px] mx-[11px]' key={item.label}>
                                    <label className={`${item.val !== undefined || item.oldImg !== '' ? 'bg-mainLightBlue  shadowHover' : "bg-slate-300 "} cursor-pointer duration-200 ease-in-out px-3 w-full py-1 my-[2px] font-bold text-center text-white rounded-lg`} onClick={item.func}>
                                        {item.label} <br />
                                         {item.label === "Business Logo" && "170px x 80px"} 
                                         {item.label === 'Receipt Logo' && "160px x 70px"}
                                    </label>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='[&>span]:focus-within:text-mainBlue col-span-3 lg:col-span-1  px-3 py-1 pb-3'>
                <span className='text-[12px] font-bold text-slate-400'>Payment Term</span><br />
                <textarea name='busPayTerm' className='w-[390px] text-[13px] outline-none shadow-sm border-full solid 
                 border-[1px] rounded-md border-slate-200 focus:border-mainLightBlue px-1 bg-[#F8F8F8]
                ' value={val.busPayTerm}  onChange={handleBusChange}>
                </textarea>
            </div>
            <div className='flex justify-center items-center gap-5 mt-[88px]'>
                <button className={`px-4 py-1 text-white duration-200 ease-in-out ${val.busName  !== "" || val.busType !== "" ? "shadowHover bg-mainLightBlue text-white" : "bg-slate-300"} w-[185px] rounded-md `} onClick={edit ? onUpdate : onSave}>{pending ? isError ? <p>{edit ? "Update" : "Save"}</p> : <span className='loading loading-spinner text-default'></span> : <p>{edit ? "Update" : "Save"}</p>}</button>
                <button className={`px-4 py-1 text-white duration-200 ease-in-out bg-slate-300 hover:bg-insomnia-primary w-[185px] rounded-md`} onClick={()=>{closeModal('my_modal_5') , setModalisopen(false)}}>Cancel</button>
            </div>
            </>
        )
    }
    <input type="file" ref={ref1} className='hidden' name='abaQr' onChange={(e)=>handleImageChange(e,'abaQr')}/>
    <input type="file" ref={ref2} className='hidden' name='signature' onChange={(e)=>handleImageChange(e,'signature')}/>
    <input type="file" ref={ref3} className='hidden' name='busLogo' onChange={(e)=>handleImageChange(e,'busLogo')}/>
    <input type="file" ref={ref4} className='hidden' name='Rec1' onChange={(e)=>handleImageChange(e,'Rec1')}/>
    <input type="file" ref={ref5} className='hidden' name='bankLogo' onChange={(e)=>handleImageChange(e,'bankLogo')}/>
    <input className='hidden' type="text" value={val.oldImg === '' ? 'empty' : val.oldImg}/>
    <input className='hidden' type="text" value={val.oldImg1 === '' ? 'empty' : val.oldImg1}/>
    <input className='hidden' type="text" value={val.oldImg2 === '' ? 'empty' : val.oldImg2}/>
    <input className='hidden' type="text" value={val.oldImg3 === '' ? 'empty' : val.oldImg3}/>
    <input className='hidden' type="text" value={val.oldImg4 === '' ? 'empty' : val.oldImg4}/>
    </>
  )
}

export default Create