"use client"
import React, { SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import Top from '../invoice&quotation/top'
import Middle from '../invoice&quotation/middle'
import Meter from '../invoice&quotation/meter'
import useToggle from '@/hooks/stores'
import axios from 'axios'
import { useCurrentUser } from '@/hooks/use-current-user'
import General from '../invoice&quotation/general'
import { url } from '@/lib/url'
import Bottom from '../invoice&quotation/bottom'
import { PiCopySimpleLight, PiTrashLight } from 'react-icons/pi';
import { useRouter } from 'next/navigation'
import { useCurrentRole } from '@/hooks/use-current-role'
import { useQuotation } from '@/hooks/usedatas'

type cusType = {
    cusName:string;
    cusComp:string;
    cusPhone:string;
    cusEmail:string;
    cusAddr:string;
    staffName:string;
    staffPhone:string;
    staffTelegram:string;
    qtNo:string;
    quoteBus:string;
    quoteTitle:string;
    quoteDate:string;
    oldImg1?:string;
    oldImg2?:string;
}

type optionDrop = {
    id:string;
    busName:string;
    busType:string;
    busBankName:string;
    busBankNumber:string
    busLogo:string;
    signature:string;
    busDes:string;
    busAddr:string;
    busEmail:string;
    busTelegram:string;
    busPhone1:string;
    busBankDes:string;
    busPayTerm:string;
}

type cusDrop = {
    id:string;
    cusName:string;
    cusPhone1:string;
    cusEmail:string;
    cusAddr:string;
    cusComp:string;
    cusBus:string;
}

type empProps = {
    id:string;
    empName:string;
    empTelegram:string;
    empPhone:string;
}

type meter = {
    id:string;
    description: string;
    sizeWidth: number;
    sizeHeight: number;
    quantity: string;
    unitPrice: string;
    m2: number;
    total: string;
}

type general = {
    id:string;
    description: string;
    quantity: string;
    unitPrice: string;
    total: string;
}

type desProps ={
    id:string;
    text:string
}

type focusProps = {
    check:boolean,
    check1:boolean,
    check2:boolean,
    check3:boolean,
    check4:boolean,
    check5:boolean
}

const CreateQt = () => {
    const router = useRouter()
    const role = useCurrentRole()
    const quotationCheck = useQuotation()
    const {darkMode ,print ,edit , passingId , setToggleLogo , setToggleAddr , pending , setToggleBankInfo , setToggleEmp , setToggleSign , setValueNote} = useToggle()
    const [restoring , setRestoring] = useState<string>('')
    const [selectedItemId, setSelectedItemId] = useState<string>("");
    const [test , setTest] = useState<optionDrop[]>([])
    const [test1 ,  setTest1] = useState<cusDrop[]>([])
    const [focus , setFocus] = useState<focusProps>({
        check:false,
        check1:false,
        check2:false,
        check3:false,
        check4:false,
        check5:false
    })
    const [meter , setMeter] = useState<meter[]>([])
    const [general , setGeneral] = useState<general[]>([])
    const [des,setDes] = useState<desProps[]>([{
        id:crypto.randomUUID(),
        text:'',
      }])
    const [test2 , setTest2] = useState<cusDrop[]>([])
    const [test3 , setTest3] = useState<empProps[]>([])
    const [test4 , setTest4] = useState<empProps[]>([])
    const [test5 , setTest5] = useState<empProps[]>([])
    const [emp , setEmp] = useState<string[]>([])
    const [staff , setStaff] = useState<string>('')
    const user = useCurrentUser()
    const [toggle , setToggle] = useState({
        cusName:false,
        cusComp:false,
        cusPhone:false,
        cusEmail:false ,
        cusAddr:false,
    })
    const ulRef = useRef<HTMLUListElement>(null);
    const ulRef1 = useRef<HTMLUListElement>(null)
    const ulRef2 = useRef<HTMLUListElement>(null)
    const ulRef3 = useRef<HTMLUListElement>(null)
    const ulRef4 = useRef<HTMLUListElement>(null)
    const ulRef5 = useRef<HTMLUListElement>(null)
    const buscheck = !edit && passingId === "" ? typeof window !== 'undefined' ? localStorage.getItem('businessCheck') : null :""
    const [val , setVal] = useState<cusType>({
        cusName:'',
        cusComp:'',
        cusPhone:'',
        cusEmail:'',
        cusAddr:'',
        staffName:'',
        staffPhone:'',
        staffTelegram:'',
        quoteBus:buscheck || "",
        qtNo:'',
        quoteTitle:'',
        oldImg1:'',
        oldImg2:'',
        quoteDate:new Date().toISOString().split('T')[0]
    })

    useEffect(()=>{
            const fetchData = async () => {
                await axios.get(`${url}/api/quotation/${passingId}?email=${user.id}`)
                .then((res)=>{
                    const data = res.data
                    setVal({
                        cusName: edit ? data.invCusName : '',
                        cusComp: edit ? data.invCusComp : '',
                        cusPhone: edit ? data.invCusPhone : '',
                        cusEmail: edit ? data.invCusEmail : '',
                        cusAddr: edit ? data.invCusAddr : '',
                        staffName: edit ? data.staffName : '',
                        staffPhone: edit ? data.staffPhone : '',
                        staffTelegram: edit ? data.staffTelegram : '',
                        quoteBus: edit ? data.qtBus : '',
                        qtNo: edit ? data.qtNo : '',
                        quoteTitle: edit ? data.qtTitle : '',
                        quoteDate: edit ? data.qtDate : '',
                        oldImg1:edit ? data.qtImage1 : '',
                        oldImg2:edit ? data.qtImage2 : ''
                    });
                    setToggle({
                        cusName:edit ? data.toggleName : false,
                        cusComp:edit ? data.toggleComp : false,
                        cusPhone:edit ? data.togglePhone : false, 
                        cusEmail:edit ? data.toggleEmail : false,
                        cusAddr:edit ? data.toggleAddr : false
                    })
                        setToggleLogo(edit ? data.toggleLogo : false)
                        setToggleBankInfo(edit ? data.toggleBankInfo : false)
                        setToggleAddr(edit ? data.toggleAddress :false)
                        setToggleSign(edit ? data.toggleSignature : false)
                        setToggleEmp(edit ? data.toggleEmployee : false)
                    if (edit) {
                        data.prodDes.forEach((item:any)=>setDes(item))
                        setRestoring(data.qtBus)
                        setEmp(data.qtStaff)
                        setMeter(data.items)
                        setGeneral(data.items)
                        setValueNote(data.enableNote)
                        setDes(data.prodDes === null ? [{
                            id:crypto.randomUUID(),
                            text:'',
                          }] : data.prodDes)
                    }
                    
                }).catch((error)=>{
                    console.log(error)
                });
        };
        if(edit && passingId){
            fetchData()
        }
    },[edit , passingId])

    useEffect(()=>{
        const fetchData = async () =>{
            try{
                const {data} = await axios.get(`${url}/api/quotation?email=${user.id}`)
                function generateFourDigitCode(): string {
                    let largestNumber = 0;
                
                    if (data.length > 0) {
                        largestNumber = Math.max(...data.map((item: cusType) => parseInt(item.qtNo.split('Qt-').join(''))));
                    }
                
                    const getNumber = largestNumber + 1;
                    const fourDigitCode = getNumber.toString().padStart(6, '0');
                    return fourDigitCode;
                }
                const code = generateFourDigitCode()
                setVal({...val , qtNo:`Qt-${code}`})
            }catch(error){
                console.error("Error fetching data:", error);
            }
        }
        if(!edit){
            fetchData()
        }
    },[url , user.id ])

    const fetchdata1 = async (newString:string) =>{
        const {data} = await axios.get(`${url}/api/customerss?email=${user.id}&filter=${newString}`)
        setTest1(data)
    }
    const fetchdata = async(newString:string) =>{
        const {data} = await axios.get(`${url}/api/businesss?email=${user.id}&name=${user.name}&filter=${newString}`)
        setTest(data)
    }
    const fetchdata2 = async (newString:string) =>{
        const {data} = await axios.get(`${url}/api/customerss?email=${user.id}&phone=${newString}`)
        setTest2(data)
    }
    const fetchData3 = async (newString:string) =>{
        const {data} = await axios.get(`${url}/api/employees?email=${user.id}&filter=${newString}`)
        setTest3(data)
    }
    const fetchData5 = async (newString:string) =>{
        const {data} = await axios.get(`${url}/api/employees?email=${user.id}&filter=${newString}`)
        setTest5(data)
    }
    const fetchData4 = async(newString:string) =>{
        const {data} = await axios.get(`${url}/api/employees?email=${user.id}&filter=${newString}`)
        setTest4(data)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, name?:string) => {
        if(focus.check === true || focus.check1 === true || focus.check2 === true || focus.check3 === true || focus.check4 === true || focus.check5 === true){
          if (event.keyCode === 38) {
            // Up arrow key
            if(name === 'quoteBus'){
                const index = test.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test[test.length - 1].id : test[Math.max(index - 1, 0)].id);
                scrollToSelectedIndex(ulRef);
            }
            if(name === 'cusName'){
                const index = test1.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test1[test1.length - 1].id : test1[Math.max(index - 1, 0)].id);
                scrollToSelectedIndex(ulRef1);
            }
            if(name === 'cusPhone'){
                const index = test2.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test2[test2.length - 1].id : test2[Math.max(index - 1, 0)].id);
                scrollToSelectedIndex(ulRef2);
            }
            if(name === 'staffName'){
                const index = test3.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test3[test3.length - 1].id : test3[Math.max(index - 1, 0)].id);
                scrollToSelectedIndex(ulRef3);
            }
            if(name === 'staffPhone'){
                const index = test5.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test5[test5.length - 1].id : test5[Math.max(index - 1, 0)].id);
                scrollToSelectedIndex(ulRef4);
            }
            if(name === 'staff'){
                const index = test4.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test4[test4.length - 1].id : test4[Math.max(index - 1, 0)].id);
                scrollToSelectedIndex(ulRef5);
            }
          } else if (event.keyCode === 40) {
            // Down arrow key
            if(name === 'quoteBus'){
                const index = test.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test[0].id : test[Math.min(index + 1, test.length - 1)].id);
                scrollToSelectedIndex(ulRef);
            }
            if(name === 'cusName'){
                const index = test1.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test1[0].id : test1[Math.min(index + 1, test1.length - 1)].id);
                scrollToSelectedIndex(ulRef1);
            }
            if(name === 'cusPhone'){
                const index = test2.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test2[0].id : test2[Math.min(index + 1, test2.length - 1)].id);
                scrollToSelectedIndex(ulRef2);
            }
            if(name === 'staffName'){
                const index = test3.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test3[0].id : test3[Math.min(index + 1, test3.length - 1)].id);
                scrollToSelectedIndex(ulRef3);
            }
            if(name === 'staffPhone'){
                const index = test5.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test5[0].id : test5[Math.min(index + 1, test5.length - 1)].id);
                scrollToSelectedIndex(ulRef4);
            }
            if(name === 'staff'){
                const index = test4.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test4[0].id : test4[Math.min(index + 1, test4.length - 1)].id);
                scrollToSelectedIndex(ulRef5);
            }
          } else if (event.keyCode === 13) {
            // Enter key
            if(name === 'quoteBus'){
              setVal(prev=>({
                ...prev,
                quoteBus:test.find(item => item.id === selectedItemId)?.busName || ""
              }));
              setFocus(prev=>({
                ...prev,
                check5:false
              }))
            }
            if(name === 'cusName'){
              setVal(prev=>({
                ...prev,
                cusName:test1.find(item => item.id === selectedItemId)?.cusName || "",
                cusComp:test1.find(item => item.id === selectedItemId)?.cusComp || "",
                cusPhone:test1.find(item => item.id === selectedItemId)?.cusPhone1 || "",
                cusEmail:test1.find(item => item.id === selectedItemId)?.cusEmail || "",
                cusAddr:test1.find(item => item.id === selectedItemId)?.cusAddr || "",
                quoteBus:test1.find(item => item.id === selectedItemId)?.cusBus || ""
            }));
              setFocus(prev=>({
                ...prev,
                check:false
              }))
            }
            if(name === 'cusPhone'){
                setVal(prev=>({
                  ...prev,
                  cusName:test2.find(item => item.id === selectedItemId)?.cusName || "",
                  cusComp:test2.find(item => item.id === selectedItemId)?.cusComp || "",
                  cusPhone:test2.find(item => item.id === selectedItemId)?.cusPhone1 || "",
                  cusEmail:test2.find(item => item.id === selectedItemId)?.cusEmail || "",
                  cusAddr:test2.find(item => item.id === selectedItemId)?.cusAddr || "",
                  quoteBus:test1.find(item => item.id === selectedItemId)?.cusBus || ""
                }));
                setFocus(prev=>({
                  ...prev,
                  check1:false
                }))
              }
            if(name === 'staffName'){
                setVal(prev=>({
                    ...prev,
                    staffName:test3.find(item => item.id === selectedItemId)?.empName || "",
                    staffPhone:test3.find(item => item.id === selectedItemId)?.empPhone || "",
                    staffTelegram:test3.find(item => item.id === selectedItemId)?.empTelegram || "",
                }))
                setFocus(prev=>({
                    ...prev,
                    check3:false
                  }))
            }
            if(name === 'staffPhone'){
                setVal(prev=>({
                    ...prev,
                    staffName:test5.find(item => item.id === selectedItemId)?.empName || "",
                    staffPhone:test5.find(item => item.id === selectedItemId)?.empPhone || "",
                    staffTelegram:test5.find(item => item.id === selectedItemId)?.empTelegram || "",
                }))
                setFocus(prev=>({
                    ...prev,
                    check2:false
                  }))
            }
            if(name === 'staff'){
                setStaff(test4.find(item => item.id === selectedItemId)?.empName || "")
                setFocus(prev=>({
                    ...prev,
                    check4:false
                  }))
            }
          }
        }
      };
      
      
      const scrollToSelectedIndex = (reful: React.RefObject<HTMLUListElement>) => {
        if (reful.current && selectedItemId) {
            const selectedItem = reful.current.querySelector(`[data-id="${selectedItemId}"]`) as HTMLLIElement | null;
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
        fetchdata(val.quoteBus)
        fetchdata1(val.cusName)
        fetchdata2(val.cusPhone)
        fetchData3(val.staffName)
        fetchData4(staff)
        fetchData5(val.staffPhone)
    },[user.id,val.quoteBus,val.cusName,staff,val.cusPhone,pending,val.staffName , val.staffPhone])

    const cusForm = useMemo(()=>[
        {
            id:"cusFrom1",
            label:'Name',
            name:'cusName',
            val:val.cusName,
            func:()=>setToggle({...toggle , cusName:!toggle.cusName})
        },
        {
            id:"cusFrom2",
            label:"Company",
            name:'cusComp',
            val:val.cusComp,
            func:()=>setToggle({...toggle , cusComp:!toggle.cusComp})
        },
        {
            id:"cusFrom3",
            label:"Phone",
            name:'cusPhone',
            val:val.cusPhone,
            func:()=>setToggle({...toggle , cusPhone:!toggle.cusPhone})
        },
        {
            id:"cusFrom4",
            label:"Email",
            name:'cusEmail',
            val:val.cusEmail,
            func:()=>setToggle({...toggle, cusEmail:!toggle.cusEmail})
        },
        {
            id:"cusFrom5",
            label:"Address",
            name:'cusAddr',
            val:val.cusAddr,
            func:()=>setToggle({...toggle, cusAddr:!toggle.cusAddr})
        }
    ],[val,toggle])
    const staffFrom = useMemo(()=>[
        {
            id:"staffForm1",
            label:"Name",
            name:"staffName",
            type:"text",
            val:val.staffName,
            func:()=>{}
        },
        {
            id:"staffForm2",
            label:"Phone",
            name:"staffPhone",
            type:"text",
            val:val.staffPhone,
            func:()=>{}
        },
        {
            id:"staffForm3",
            label:"Telegram",
            name:"staffTelegram",
            type:"text",
            val:val.staffTelegram,
            func:()=>{}
        },
    ],[val])
    const invForm = useMemo(()=>[
        {
            id:"invFrom1",
            label:'No#',
            name:'qtNo',
            type:'text',
            val:val.qtNo,
            func:()=>{}
        },
        {
            id:"invFrom2",
            label:"Title",
            name:'quoteTitle',
            type:'text',
            val:val.quoteTitle,
            func:()=>{}
        },
        {
            id:"invFrom3",
            label:"Business",
            name:'quoteBus',
            type:'',
            val:val.quoteBus,
            func:()=>{}
        },
        {
            id:"invFrom4",
            label:"Date",
            name:'quoteDate',
            type:'date',
            val:val.quoteDate,
            func:()=>{}
        },
        {
            id:"invFrom5",
            label:"Staff",
            name:'invStaff',
            type:'array',
            val:"",
            func:()=>{}
        },
    ],[val])
    const handleChangeVal = (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const { name, value } = e.target;   
      
        setVal(prev=>({
          ...prev,
          [name]: value,
        }));
        if(name === 'cusName'){
            setFocus(prev=>({
                ...prev,
                check:true
            }))
        }else{
            fetchdata1('')
        }
        if(name === 'cusPhone'){
            setFocus(prev=>({
                ...prev,
                check1:true
            }))
        }else{
            fetchdata2('')
        }
        if(name === 'staffName'){
            setFocus(prev=>({
                ...prev,
                check3:true
            }))
        }else{
            fetchData3('')
        }
        if(name === 'staffPhone'){
            setFocus(prev=>({
                ...prev,
                check2:true
            }))
        }else{
            fetchData5('')
        }
        if(name === 'quoteBus'){
            setFocus(prev=>({
                ...prev,
                check5:true
            }))
        }else{
            fetchdata('')
        }
      };

      
      const handleStaffChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const value = e.target.value
        setStaff(value)
        if(e.target.value !== ""){
            setFocus(prev=>({
                ...prev,
                check4:true
            }))
        }else{
            fetchData4('')
        }
      }

      const handleStaffKey = (e:React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key === 'Enter' && staff.trim() !== ''){
            e.preventDefault();
            addStaff(staff)
            setStaff('')
        }
      }

      const addStaff = (staffName:string) =>{
        const updateName = [...emp , staffName];
        setEmp(updateName)
      }

      const removeStaff = (index:number) =>{
        const updateName = [...emp];
        updateName.splice(index , 1);
        setEmp(updateName);
      }

      const addDes = () =>{
        if(des.length < 6){
            setDes([
                ...des , {
                    id:crypto.randomUUID(),
                    text:''
                }
            ])
        }else{
            console.log('sorry can not add more')
        }
      }

      const handleCopy = (text:string) =>{
        if(des.length < 6){
            setDes([
                ...des , {
                    id:crypto.randomUUID(),
                    text
                }
            ])
        }else{
            console.log('Cannot add more than 12 calculations.'); 
        }
      }

      const remove = (index:number) =>{
        const updateString = [...des]
        updateString.splice(index ,1)
        setDes(updateString)
    }

      const handleDragStart = (e: React.DragEvent<HTMLDivElement | HTMLTableRowElement>, id: string) =>{
        e.dataTransfer.setData('text/plain', id);
      }

      const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) =>{
        e.preventDefault();
      }

      const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetId: string) =>{
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        const updatedRows = [...des];
        const draggedRow = updatedRows.find((row) => row.id === draggedId);
        if (!draggedRow) return;
        const targetIndex = updatedRows.findIndex((row) => row.id === targetId);
        updatedRows.splice(updatedRows.indexOf(draggedRow), 1);
        updatedRows.splice(targetIndex, 0, draggedRow);
        setDes(updatedRows);
      }

      const handleChangeDes = (index:number , field: keyof desProps , value:string) =>{
        setDes(prev =>{
            const update = [...prev]
            const updeted = {...update[index]}
            if(field === 'text'){
                updeted[field] = value as string
            }

            update[index] = updeted
            return update
        })
      }

      useEffect(()=>{
        if(role !== 'ADMIN' && quotationCheck !== true){
            router.push('/dashboard')
        }
      },[])

      if(role !== 'ADMIN' && quotationCheck !== true){
        return(
            <div>
                WE SORRY YOU NOT ALLOW TO SEE THIS PAGE AND GET REKT
            </div>
        )
      }

      const fetchallEmp = async () =>{
        const {data} = await axios.get(`${url}/api/employees?email=${user.id}`)
        setTest3(data)
      }

      const fetchallCus = async () =>{
        const {data} = await axios.get(`${url}/api/customerss?email=${user.id}`)
        setTest1(data)
      }

      const fetchallBus = async() =>{
        const {data} = await axios.get(`${url}/api/businesss?email=${user.id}&name=${user.name}`)
        setTest(data)
      }

  return (
    <>
    <Top text='Quotation' topTitle='Customer Info'>
        <div className={`grid grid-cols-5 gap-3 `}>
        {
            cusForm.map((item,index)=>{
                return(
                    <div key={item.id} className="col-span-1 relative border-[1px] border-input-primary rounded-md ">
                        {
                            item.label !== "Name" && item.label !== "Phone" ? (
                                <input
                                    type="text" 
                                    className={`block pl-2 p-1 w-full text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                    placeholder=" "
                                    required
                                    name={item.name}
                                    value={item.val}
                                    onChange={handleChangeVal}
                                />
                            ) : (
                                <>
                                {
                                   item.label === "Name" && (
                                    <>
                                    <input 
                                    type="text" 
                                    className={`block pl-2 p-1 w-full text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                    placeholder=''
                                    required
                                    name={item.name}
                                    value={item.val}
                                    onChange={handleChangeVal}
                                    onKeyDown={(event)=>handleKeyDown(event, "cusName")}
                                    onClick={fetchallCus}
                                    onFocus={()=>setFocus(prev=>({
                                        ...prev,
                                        check:true
                                      }))}
                                      autoComplete='off'
                                      onBlur={()=>setTimeout(() => {
                                        setFocus(prev=>({
                                          ...prev,
                                          check:false
                                        }))
                                      }, 150)}
                                    />
                                    <div className='relative'>
                                        {
                                            focus.check === true && (
                                                <ul ref={ulRef1} className='absolute z-50 rounded-md border-[1px] shadow-md bg-white px-2  py-1 w-full mt-2 max-h-[100px]  overflow-auto'>
                                                    {
                                                        test1.map((item)=>{
                                                            return(
                                                                <li data-id={item.id} key={item.id} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`} onClick={()=>{
                                                                    setVal(prev=>({
                                                                        ...prev,
                                                                        cusName:item.cusName || '',
                                                                        cusComp:item.cusComp || '',
                                                                        cusPhone:item.cusPhone1 || '',
                                                                        cusEmail:item.cusEmail || '',
                                                                        cusAddr:item.cusAddr || '',
                                                                        quoteBus:item.cusBus || ''
                                                                    }))
                                                                }}>{item.cusName}</li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            )
                                        }
                                    </div>
                                    </>
                                   ) 
                                }
                                {
                                    item.label === "Phone" && (
                                        <>
                                        <input
                                        type="text" 
                                        className={`block pl-2 p-1 w-full text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                        placeholder=''
                                        required
                                        name={item.name}
                                        value={item.val}
                                        onChange={handleChangeVal}
                                        onClick={fetchallCus}
                                        onKeyDown={(event)=>handleKeyDown(event, "cusPhone")}
                                        onFocus={()=>setFocus(prev=>({
                                            ...prev,
                                            check1:true
                                          }))}
                                          autoComplete='off'
                                          onBlur={()=>setTimeout(() => {
                                            setFocus(prev=>({
                                              ...prev,
                                              check1:false
                                            }))
                                          }, 150)}
                                        />
                                        <div className='relative'>
                                        {
                                            focus.check1 === true && (
                                                <ul ref={ulRef2} className='absolute z-50 rounded-md border-[1px] shadow-md bg-white px-2  py-1 w-full mt-2 max-h-[100px]  overflow-auto'>
                                                    {
                                                        test2.map((item)=>{
                                                            return(
                                                                <li data-id={item.id} key={item.cusPhone1} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`} onClick={()=>{setVal(prev=>({
                                                                    ...prev,
                                                                    cusName:item.cusName || '',
                                                                    cusComp:item.cusComp || '',
                                                                    cusPhone:item.cusPhone1 || '',
                                                                    cusEmail:item.cusEmail || '',
                                                                    cusAddr:item.cusAddr || '',
                                                                    quoteBus:item.cusBus || ''
                                                                }))}}>{item.cusPhone1}</li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            )
                                        }
                                        </div>
                                        </>
                                    )
                                }
                                
                                </>
                            )
                        }
                        <label  className={`absolute top-0 text-md cursor-pointer ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}
                        onClick={item.func}>
                                {item.label}
                            </label>
                    </div>
                )
            })
        }
        </div>
    </Top>
    <Middle middleTitle='Staff Info'>
      <div className={`grid grid-cols-3 gap-3`}>
        {
            staffFrom.map((item)=>{
                return(
                    <React.Fragment key={item.id}>
                        <div className='col-span-1 relative border-[1px] border-input-primary rounded-md '>
                        {
                            item.label === 'Name' ? (
                                <>
                                <input
                                    type={item.type} 
                                    className={`block pl-2 p-1 w-full text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                    placeholder=" "
                                    required
                                    name={item.name}
                                    value={item.val}
                                    onChange={handleChangeVal}
                                    onClick={fetchallEmp}
                                    onKeyDown={(event)=>handleKeyDown(event, "staffName")}
                                    onFocus={()=>setFocus(prev=>({
                                        ...prev,
                                        check3:true
                                      }))}
                                      autoComplete='off'
                                      onBlur={()=>setTimeout(() => {
                                        setFocus(prev=>({
                                          ...prev,
                                          check3:false
                                        }))
                                      }, 150)}
                                />
                           
                                    {
                                        focus.check3 === true && (
                                            <ul ref={ulRef3} className='absolute z-50 rounded-md border-[1px] shadow-md bg-white pl-2  px-1 w-full mt-2 max-h-[100px] overflow-auto'>
                                                    {
                                                        test3.map((item)=>{
                                                            return (
                                                                <li data-id={item.id} key={crypto.randomUUID()} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`} onClick={()=>{
                                                                    setVal(prev=>({
                                                                        ...prev,
                                                                        staffName:item.empName || '',
                                                                        staffPhone:item.empPhone || '',
                                                                        staffTelegram:item.empTelegram || ''
                                                                    }))
                                                                }}>{item.empName}</li>
                                                            )
                                                        })

                                                    }
                                            </ul>
                                        )
                                    }
                                
                                </>
                            ) : item.label === 'Phone' ? (
                                <>
                                <input
                                    type={item.type} 
                                    className={`block pl-2 p-1 w-full text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                    placeholder=" "
                                    required
                                    name={item.name}
                                    value={item.val}
                                    onChange={handleChangeVal}
                                    onClick={fetchallEmp}
                                    onKeyDown={(event)=>handleKeyDown(event, "staffPhone")}
                                    onFocus={()=>setFocus(prev=>({
                                        ...prev,
                                        check2:true
                                      }))}
                                      autoComplete='off'
                                      onBlur={()=>setTimeout(() => {
                                        setFocus(prev=>({
                                          ...prev,
                                          check2:false
                                        }))
                                      }, 150)}
                                />
                                 
                                    {
                                        focus.check2 === true && (
                                            <ul ref={ulRef4} className='absolute z-50 rounded-md border-[1px] shadow-md bg-white px-2  py-1 w-full mt-2 max-h-[100px] overflow-auto'>
                                                    {
                                                        test5.map((item)=>{
                                                            return (
                                                                <li data-id={item.id} key={crypto.randomUUID()} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`} onClick={()=>{setVal(prev=>({
                                                                    ...prev,
                                                                    staffName:item.empName || '',
                                                                    staffPhone:item.empPhone || '',
                                                                    staffTelegram:item.empTelegram || ''
                                                                }))}}>{item.empPhone}</li>
                                                            )
                                                        })

                                                    }
                                            </ul>
                                        )
                                    }
                                
                                </>
                            ) : (
                                <input
                                    type={item.type} 
                                    className={`block pl-2 p-1 w-full text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                    placeholder=" "
                                    required
                                    name={item.name}
                                    value={item.val}
                                    onChange={handleChangeVal}
                                />
                            )
                        }
                            
                             <label className={`absolute top-0 text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}
                             onClick={item.func}>
                                {item.label}
                            </label>
                        </div>
                       
                    </React.Fragment>
                )
            })
        }
      </div>
    </Middle>
    <Bottom bottomTitle='Quotation Info'>
    <div className={`grid grid-cols-5 gap-3`}>
            {
                invForm.map((item,index)=>{
                    return(
                        <React.Fragment key={item.id}>
                            <div className='col-span-1 relative border-[1px] border-input-primary rounded-md '>
                           {
                            item.label !== "Business" && item.label !== "Status" && item.label !== "Staff"  ? (
                                <input
                                type={item.type} 
                                className={`block pl-2 p-1 w-full text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                placeholder=" "
                                required
                                name={item.name}
                                value={item.val}
                                onChange={handleChangeVal}
                                
                            />
                            ) : item.type === "array" ? (
                                <>
                                <div className='block pl-2 p-1 w-full text-md focus:outline-none overflow-hidden h-[32px]'>
                                   <div className={`overflow-y-hidden overflow-x-scroll mb-[-50px] pb-[50px] h-full`} >
                                    <div className='flex'>
                                    {
                                        emp.map((item,iruka)=>{
                                            return(
                                                <div className='flex bg-white mx-[2px] rounded-md px-[2px] gap-1 ' key={crypto.randomUUID()}>
                                                    <p>{item}</p>
                                                    <button className='text-red-500' onClick={()=>removeStaff(iruka)}>x</button>
                                                </div>
                                            )
                                        })
                                    }
                                   <input type="text" className={`${darkMode ? "text-dark-lg-color" : ""} outline-none bg-transparent`} value={staff} onChange={handleStaffChange} 
                                   onClick={fetchallEmp}
                                   onKeyDown={(event)=>{handleKeyDown(event, "staff"), handleStaffKey(event)}}
                                   onFocus={()=>setFocus(prev=>({
                                    ...prev,
                                    check4:true
                                  }))}
                                  autoComplete='off'
                                  onBlur={()=>setTimeout(() => {
                                    setFocus(prev=>({
                                      ...prev,
                                      check4:false
                                    }))
                                  }, 150)}
                                   />
                                    </div>
                                   
                                   </div>
                                </div>
                                <div className='relative'>
                                {
                                    focus.check4 === true && (
                                        <ul ref={ulRef5} className='absolute z-50 rounded-md border-[1px] shadow-md bg-white px-2  py-1 w-full mt-2 max-h-[100px] overflow-auto'>
                                      
                                                    {
                                                        test4.map((item)=>{
                                                            return (
                                                                <li data-id={item.id} key={item.id} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`} onClick={()=>setStaff(item.empName || '')}>{item.empName}</li>
                                                            )
                                                        })

                                                    }
                                               
                                        </ul>
                                    )
                                }
                            </div>
                                </>
                            ) : (
                                <>
                                <input 
                                type="text" 
                                className={`block pl-2 p-1 w-full text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                placeholder=''
                                required
                                name={item.name}
                                value={val.quoteBus}
                                onChange={handleChangeVal}
                                onClick={fetchallBus}
                                onKeyDown={(event)=>handleKeyDown(event,'quoteBus')}
                                onFocus={()=>setFocus(prev=>({
                                    ...prev,
                                    check5:true
                                  }))}
                                  autoComplete='off'
                                  onBlur={()=>setTimeout(() => {
                                    setFocus(prev=>({
                                      ...prev,
                                      check5:false
                                    }))
                                  }, 150)}
                                />
                                <div className='relative'>
                                    {
                                        focus.check5 === true && (
                                            <ul ref={ulRef} className='absolute z-50 rounded-md border-[1px] shadow-md bg-white px-2  py-1 w-full mt-2 max-h-[100px] overflow-auto'>
                                          
                                                        {
                                                            test.map((item)=>{
                                                                return (
                                                                    <li data-id={item.id} key={item.id} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`} onClick={()=>{
                                                                        setVal(prev=>({
                                                                            ...prev,
                                                                           quoteBus:item.busName || '' 
                                                                        }))
                                                                    }} >{item.busName}</li>
                                                                )
                                                            })

                                                        }
                                                   
                                            </ul>
                                        )
                                    }
                                </div>
                                </>
                            )
                           }
                             <label className={`absolute top-0 text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}
                             onClick={item.func}>
                                {item.label}
                            </label>
                        </div>
                
                        
                        </React.Fragment>
                        
                    )
                })
            }
        </div>
    </Bottom>
    <div className={`overflow-x-auto mt-[20px] ${print === true ? "!hidden" : ""} ${darkMode ? "bg-dark-box-color" : "bg-white"} p-[24px] rounded-lg shadow-md`}>
        <table className='w-full'>
            <thead>
                <tr>
                    <th className={` ${darkMode ? "text-dark-lg-color" : "text-thead-primary" } py-2`}>No</th>
                    <th className={` ${darkMode ? "text-dark-lg-color" : "text-thead-primary" } py-2`}>Description</th>
                    <th className={` ${darkMode ? "text-dark-lg-color" : "text-thead-primary" } py-2`}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    des.map((item,index)=>{
                        return(
                            <tr key={item.id} onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, item.id)}
                            onDragStart={(e) => handleDragStart(e, item.id)}>
                               <td className="py-2 w-[60px]">
                               <div className='flex justify-center'>
                               <div className={`cursor-grabbing flex justify-center items-center py-1 mx-[10px] w-[34px] rounded-md ${darkMode ? "text-dark-lg-color" : ""}`}
                                draggable // Make the div draggable
                                onDragStart={(e) => {
                                const target = e.target as HTMLElement; // Cast the target to HTMLElement
                                const tableRow = target.parentNode?.parentNode as HTMLTableRowElement; // Get the table row
                                if (tableRow) {
                                    e.dataTransfer.setDragImage(tableRow, 0, 0); // Set the table row as the drag image
                                }
                                handleDragStart(e, item.id);
                                }}
                                >
                                {index === 0 ? '' : '-'}
                                </div>
                               </div>
                               </td>
                                
                                <td className=" px-[10px] py-2">
                                <input type="text" 
                                 value={item.text}
                                 onChange={(e)=>handleChangeDes(index,'text',e.target.value)}
                                 className={`${darkMode ? "text-dark-lg-color" : ""} w-full outline-none text-start border px-2 py-1 bg-transparent border-input-primary rounded-md`}/>    
                                </td>
                                <td className=" px-[10px] py-2 w-[100px]">
                                    <div className={`flex justify-center items-center gap-2 `}>
                                    <button className={`${darkMode ? "text-blue-400" : "text-[#024466]"} p-1 rounded-md`} onClick={()=>handleCopy(item.text)}><PiCopySimpleLight size={25}/></button>
                                    <button className={`${darkMode ? "text-red-400" : "text-red-700"} p-1 rounded-md`} onClick={() => remove(index)}><PiTrashLight size={25}/></button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
        
            <div className='flex justify-between'>
           <div className='flex'>
            <div className="px-[26px] invisible">
                1
            </div>
            <button onClick={addDes} className={`${darkMode ? "text-dark-lg-color" : ""} ml-[10px] hover:bg-[#E94043] bg-insomnia-primary text-white rounded-md px-[45px] py-[5px] text-[18px] font-bold`}>Add</button>
           </div>
            </div>
    </div>
    {
        test.map((item)=>{
            return(
                <React.Fragment key={item.busName}>
                    {
                        val.quoteBus === item.busName && (
                            <>
                            <General 
                            des={des}
                            setDes={setDes}
                            generalItems={general}
                            form="quotation"
                            routerPush='quotation'
                            staff={emp}
                            staffName={val.staffName}
                            staffPhone={val.staffPhone}
                            staffTelegram={val.staffTelegram}
                            toggleName={toggle.cusName}
                            toggleComp={toggle.cusComp}
                            togglePhone={toggle.cusPhone}
                            busLogo={item.busLogo}
                            busAddr={item.busAddr}
                            busEmail={item.busEmail}
                            bankdes={item.busDes}
                            busTelegram={item.busTelegram}
                            busPayTerm={item.busPayTerm}
                            busPhone={item.busPhone1}
                            sigLogo={item.signature}
                            oldImg1={val.oldImg2}
                            oldImg={val.oldImg1}
                            toggleAddr={toggle.cusAddr}
                            toggleEmail={toggle.cusEmail}
                            cusName={val.cusName} 
                            cusComp={val.cusComp} 
                            cusPhone={val.cusPhone} 
                            cusEmail={val.cusEmail} 
                            cusAddr={val.cusAddr} 
                            invBus={val.quoteBus} 
                            invNo={val.qtNo} 
                            invTitle={val.quoteTitle} 
                            invDate={val.quoteDate} 
                            busType={item.busType}
                            abaName={item.busBankName}
                            abaNumber={item.busBankNumber}
                            />
                            <Meter 
                            des={des}
                            setDes={setDes}
                            meterItems={meter}
                            form="quotation"
                            routerPush='quotation'
                            busLogo={item.busLogo}
                            busAddr={item.busAddr}
                            busEmail={item.busEmail}
                            bankdes={item.busDes}
                            busTelegram={item.busTelegram}
                            busPhone={item.busPhone1}
                            sigLogo={item.signature}
                            staff={emp}
                            staffName={val.staffName}
                            staffPhone={val.staffPhone}
                            busPayTerm={item.busPayTerm}
                            staffTelegram={val.staffTelegram}
                            toggleName={toggle.cusName}
                            toggleComp={toggle.cusComp}
                            togglePhone={toggle.cusPhone}
                            oldImg1={val.oldImg2}
                            oldImg={val.oldImg1}
                            toggleAddr={toggle.cusAddr}
                            toggleEmail={toggle.cusEmail}
                            busDes={item.busDes}
                            cusName={val.cusName} 
                            cusComp={val.cusComp} 
                            cusPhone={val.cusPhone} 
                            cusEmail={val.cusEmail} 
                            cusAddr={val.cusAddr} 
                            invBus={val.quoteBus} 
                            invNo={val.qtNo} 
                            invTitle={val.quoteTitle} 
                            invDate={val.quoteDate} 
                            busType={item.busType}
                            abaName={item.busBankName}
                            abaNumber={item.busBankNumber}
                            />
                            
                            
                            </>
                        )
                    }
                </React.Fragment>
            )
        })
    }
   
    </>
  )
}

export default CreateQt