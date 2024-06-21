"use client"
import React, { use, useEffect, useMemo, useRef, useState } from 'react'
import Top from '../invoice&quotation/top'
import Middle from '../invoice&quotation/middle'
import Meter from '../invoice&quotation/meter'
import useToggle from '@/hooks/stores'
import axios from 'axios'
import { useCurrentUser } from '@/hooks/use-current-user'
import General from '../invoice&quotation/general'
import { url } from '@/lib/url'
import { usedatainvoice } from '@/hooks/usedatas'
import { useCurrentRole } from '@/hooks/use-current-role'
import { useRouter } from 'next/navigation'

type cusType = {
    cusName:string;
    cusComp:string;
    cusPhone:string;
    cusEmail:string;
    cusAddr:string;
    invBus:string;
    invNo:string;
    invPo:string;
    invTitle:string;
    invDate:string;
    invStatus:string;
    customerId:string;
}

type optionDrop = {
    id:string;
    busName:string;
    busType:string;
    busBankName:string;
    busBankNumber:string
    busLogo:string;
    abaQr:string;
    signature:string;
    busDes:string;
    busAddr:string;
    busEmail:string;
    busTelegram:string;
    busPhone1:string;
    busBankDes:string;
    busInvEng:string;
    busInvkh:string;
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

type desProps = {
    id:string;
    text:string
}

type focusProps ={
    check:boolean;
    check1:boolean;
    check2:boolean;
    check3:boolean;
}

const Createinv = () => {
    const {darkMode, 
        routerSwitch,
        edit,
        passingId,
        setToggleLogo,
        setToggleAddr,
        setToggleBankInfo,
        setToggleSign,
        qtId,
        setValueNoti,
        setValueNote,
        print,
        pending
    } = useToggle()
    const router = useRouter()
    const [test , setTest] = useState<optionDrop[]>([])
    const [fetchCount , setFetchcount] = useState(0)
    const [mode , setMode] = useState<string>('')
    const [des , setDes] = useState<desProps[]>([])
    const [no , setRecno] = useState<string>('')
    const [test1 ,  setTest1] = useState<cusDrop[]>([])
    const [selectedItemId, setSelectedItemId] = useState<string>("");
    const [meter , setMeter] = useState<meter[]>([])
    const [general , setGeneral] = useState<general[]>([])
    const [test2 , setTest2] = useState<cusDrop[]>([])
    const [test3 , setTest3] = useState<empProps[]>([])
    const [emp , setEmp] = useState<string[]>([])
    const [staff , setStaff] = useState<string>('')
    const [partial , setPartial] = useState<string>('')
    const [discount , setDiscount] = useState<string>('')
    const [restoring , setRestoring] = useState<string>('')
    const [focus , setFocus] = useState<focusProps>({
        check:false,
        check1:false,
        check2:false,
        check3:false
    })
    const user = useCurrentUser()
    const userCheck = usedatainvoice()
    const role = useCurrentRole()
    const [toggle , setToggle] = useState({
        cusName:false,
        cusComp:false,
        cusPhone:false,
        cusEmail:false ,
        cusAddr:false,
        invPo:false
    })
    const urlRef = useRef<HTMLUListElement>(null);
    const ulRef1 = useRef<HTMLUListElement>(null)
    const ulRef2 = useRef<HTMLUListElement>(null)
    const ulRef3 = useRef<HTMLUListElement>(null)
    const buscheck = !edit && passingId === "" ? typeof window !== 'undefined' ? localStorage.getItem('businessCheck') : null :""
    const [val , setVal] = useState<cusType>({
        cusName:'',
        cusComp:'',
        cusPhone:'',
        cusEmail:'',
        cusAddr:'',
        invBus:buscheck || '',
        invNo:'',
        invStatus:'paid',
        invPo:'',
        invTitle:'',
        invDate:new Date().toISOString().split('T')[0],
        customerId:''
    })

    useEffect(()=>{
            const fetchData = async () =>{
                const { data:passingdata } = await axios.get(`${url}/api/invoice?mode=${routerSwitch}&email=${user.id}`);
                await axios.get(`${url}/api/invoice/${passingId}?email=${user.id}`)
                .then((res)=>{
                    const data = res.data
                    const code = generateFourDigitCode(edit && routerSwitch !== data.mode && passingdata)
                    setVal(prev=>({
                        ...prev,
                        cusName:edit ? data.customer.cusName : '',
                        cusComp:edit ? data.customer.cusComp : '',
                        cusPhone:edit ? data.customer.cusName === 'General Customer' ? data.invCusPhone : data.customer.cusPhone1 : '',
                        cusEmail:edit ? data.customer.cusEmail : '',
                        cusAddr:edit ? data.customer.cusAddr : '',
                        invBus:edit ? data.invBus : '',
                        invNo:edit && routerSwitch === data.mode ? data.invNo : `${routerSwitch === 'delivery' ? `Dn-${code}` : `Inv-${code}`}`,
                        invStatus:edit ? data.invStatus : '',
                        invPo:edit ? data.invPo : '',
                        invTitle:edit ? data.invTitle : '',
                        invDate:edit ? data.invDate : '',
                        customerId:edit ? data.customerId : ''
                    }))
                    
                    setToggle(prev=>({
                        ...prev,
                        cusName:edit ? data.toggleName : false,
                        cusComp:edit ? data.toggleComp : false,
                        cusPhone:edit ? data.togglePhone : false, 
                        cusEmail:edit ? data.toggleEmail : false,
                        cusAddr:edit ? data.toggleAddr : false,
                        invPo:edit ? data.togglePo : false
                    }))
                        setToggleLogo(edit ? data.toggleLogo : false)
                        setToggleBankInfo(edit ? data.toggleBankInfo : false)
                        setToggleAddr(edit ? data.toggleAddress :false)
                        setToggleSign(edit ? data.toggleSignature : false)
                    if(edit){
                        setRestoring(data.invBus)
                        setEmp(data.invStaff)
                        setMeter(data.items)
                        setGeneral(data.items)
                        setPartial(`$${data.partial === null ? 0 : data.partial.toFixed(2)}`)
                        setDiscount(`$${data.discount === null ? 0 : data.discount.toFixed(2)}`)
                        setValueNoti(data.noti)
                        setValueNote(data.enableNote)
                        setMode(data.mode)
                    }
                }).catch((error)=>{
                    console.log(error)
                })
            }
            if(edit && passingId){
                fetchData()
            }
        
    },[edit , passingId,routerSwitch])


    function generateFourDigitCode(data:any[]):string{
        let largestNumber = 0
        if(data.length > 0){
            largestNumber = routerSwitch === 'delivery' ? Math.max(...data.map((item:cusType) => parseInt(item.invNo.split("Dn-").join(''))))
            : Math.max(...data.map((item:cusType) => parseInt(item.invNo.split("Inv-").join(''))))
        }
        const getNumber = largestNumber + 1
        const fourDigitCode = getNumber.toString().padStart(6, '0')
        return fourDigitCode
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, name?:string) => {
        if(focus.check === true || focus.check1 === true || focus.check2 === true || focus.check3 === true){
          if (event.keyCode === 38) {
            // Up arrow key
            if(name === 'invBus'){
                const index = test.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test[test.length - 1].id : test[Math.max(index - 1, 0)].id);
                scrollToSelectedIndex(ulRef3);
            }
            if(name === 'cusName'){
                const index = test1.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test1[test1.length - 1].id : test1[Math.max(index - 1, 0)].id);
                scrollToSelectedIndex(urlRef);
            }
            if(name === 'cusPhone'){
                const index = test2.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test2[test2.length - 1].id : test2[Math.max(index - 1, 0)].id);
                scrollToSelectedIndex(ulRef1);
            }
            if(name === 'staff'){
                const index = test3.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test3[test3.length - 1].id : test3[Math.max(index - 1, 0)].id);
                scrollToSelectedIndex(ulRef2);
            }
          } else if (event.keyCode === 40) {
            // Down arrow key
            if(name === 'invBus'){
                const index = test.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test[0].id : test[Math.min(index + 1, test.length - 1)].id);
                scrollToSelectedIndex(ulRef3);
            }
            if(name === 'cusName'){
                const index = test1.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test1[0].id : test1[Math.min(index + 1, test1.length - 1)].id);
                scrollToSelectedIndex(urlRef);
            }
            if(name === 'cusPhone'){
                const index = test2.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test2[0].id : test2[Math.min(index + 1, test2.length - 1)].id);
                scrollToSelectedIndex(ulRef1);
            }
            if(name === 'staff'){
                const index = test3.findIndex(item => item.id === selectedItemId);
                setSelectedItemId(index === -1 ? test3[0].id : test3[Math.min(index + 1, test3.length - 1)].id);
                scrollToSelectedIndex(ulRef2);
            }
          } else if (event.keyCode === 13) {
            // Enter key
            if(name === 'invBus'){
              setVal(prev=>({
                ...prev,
                invBus:test.find(item => item.id === selectedItemId)?.busName || ""
              }));
              setFocus(prev=>({
                ...prev,
                check3:false
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
                customerId:test1.find(item => item.id === selectedItemId)?.id || "",
                invBus:test1.find(item => item.id === selectedItemId)?.cusBus || "",
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
                customerId:test2.find(item => item.id === selectedItemId)?.id || "",
                invBus:test2.find(item => item.id === selectedItemId)?.cusBus || "",
                }));
                setFocus(prev=>({
                  ...prev,
                  check1:false
                }))
              }
            if(name === 'staff'){
                setStaff(test3.find(item => item.id === selectedItemId)?.empName || "")
                setFocus(prev=>({
                    ...prev,
                    check2:false
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
      

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${url}/api/invoice?mode=${routerSwitch}&email=${user.id}`);
                
                const code = generateFourDigitCode(data)
                setRecno(`${routerSwitch === 'delivery' ? `Dn-${code}` : `Inv-${code}`}`)
                setVal({...val , invNo:`${routerSwitch === 'delivery' ? `Dn-${code}` : `Inv-${code}`}`})
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        
        if(!edit){
            fetchData(); // not edit 
        }
    }, [url , user.id , routerSwitch]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${url}/api/quotation/${qtId}?email=${user.id}`);
                const data = response.data;
                console.log('fetch')
                setVal(prev => ({
                    ...prev,
                    cusName: qtId ? data.customer.cusName : '',
                    cusComp: qtId ? data.customer.cusComp : '',
                    cusPhone: qtId ? data.customer.cusPhone1 : '',
                    cusEmail: qtId ? data.customer.cusEmail : '',
                    cusAddr: qtId ? data.customer.cusAddr : '',
                    invBus: qtId ? data.qtBus : '',
                    invTitle: qtId ? data.qtTitle : '',
                    invDate: qtId ? data.qtDate : '',
                    customerId:qtId ? data.customerId : ''
                }));
    
                setToggle(prev => ({
                    ...prev,
                    cusName: qtId ? data.toggleName : false,
                    cusComp: qtId ? data.toggleComp : false,
                    cusPhone: qtId ? data.togglePhone : false,
                    cusEmail: qtId ? data.toggleEmail : false,
                    cusAddr: qtId ? data.toggleAddr : false
                }));
    
                setToggleLogo(qtId ? data.toggleLogo : false);
                setToggleBankInfo(qtId ? data.toggleBankInfo : false);
                setToggleAddr(qtId ? data.toggleAddress : false);
                setToggleSign(qtId ? data.toggleSignature : false);
    
                if (qtId) {
                    setEmp(data.qtStaff);
                    setMeter(data.items);
                    setGeneral(data.items);
                }
            } catch (error) {
                console.log(error);
            }
        };
    
        // Fetch data only if qtId exists and fetchCount is 0
        if (qtId && !val.cusName && fetchCount < 3) {
            fetchData();
            setFetchcount(prev => prev + 1)
        }
    }, [qtId ,val, fetchCount]);
    

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

        useEffect(()=>{
            fetchdata1(val.cusName)
            fetchdata(val.invBus)
            fetchdata2(val.cusPhone)
            fetchData3(staff)
        },[val.cusName , val.invBus , val.cusPhone,staff ,pending])

        

    const cusForm = useMemo(()=>[
        {
            id:"cusForm1",
            label:'Name',
            name:'cusName',
            val:val.cusName,
            func:()=>setToggle({...toggle , cusName:!toggle.cusName})
        },
        {
            id:"cusForm2",
            label:"Company",
            name:'cusComp',
            val:val.cusComp,
            func:()=>setToggle({...toggle , cusComp:!toggle.cusComp})
        },
        {
            id:"cusForm3",
            label:"Phone",
            name:'cusPhone',
            val:val.cusPhone,
            func:()=>setToggle({...toggle , cusPhone:!toggle.cusPhone})
        },
        {
            id:"cusForm4",
            label:"Email",
            name:'cusEmail',
            val:val.cusEmail,
            func:()=>setToggle({...toggle, cusEmail:!toggle.cusEmail})
        },
        {
            id:"cusForm5",
            label:"Address",
            name:'cusAddr',
            val:val.cusAddr,
            func:()=>setToggle({...toggle, cusAddr:!toggle.cusAddr})
        }
    ],[val,toggle])
    const invForm = useMemo(()=>[
        {
            id:"invForm1",
            label:'No#',
            name:'invNo',
            type:'text',
            val:val.invNo,
            func:()=>{}
        },
        {
            id:"invForm2",
            label:"Po",
            name:'invPo',
            type:'text',
            val:val.invPo,
            func:()=>setToggle({...toggle , invPo:!toggle.invPo})
        },
        {
            id:"invForm3",
            label:"Title",
            name:'invTitle',
            type:'text',
            val:val.invTitle,
            func:()=>{}
        },
        {
            id:"invForm4",
            label:"Business",
            name:'invBus',
            type:'',
            val:val.invBus,
            func:()=>{}
        },
        {
            id:"invForm5",
            label:"Status",
            name:'invStatus',
            type:'select',
            val:val.invStatus,
            func:()=>{}
        },
        {
            id:"invForm6",
            label:"Discount",
            name:"",
            type:"discount",
            val:'',
            func:()=>{}
        },
        {
            id:"invForm7",
            label:"Date",
            name:'invDate',
            type:'date',
            val:val.invDate,
            func:()=>{}
        },
        {
            id:"invForm8",
            label:"Staff",
            name:'invStaff',
            type:'array',
            val:"",
            func:()=>{}
        },
    ],[val,toggle])
    const handleChangeVal = (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const { name, value } = e.target;
      
        setVal(prev=>({
          ...prev,
          [name]: value,
        }));
        if(name === 'cusName' && value !== ''){
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
            fetchdata('')
        }
        if(name === 'invBus'){
            setFocus(prev=>({
                ...prev,
                check3:true
            }))
        }else{
            fetchdata2('')
        }
      };

    const handleSelectChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
        const {name , value} = e.target
        setVal(prev=>({
            ...prev,
            [name]:value
        }))
        const parsedPartial = parseFloat(partial);
        const parsedDiscount = parseFloat(discount);

        if (!isNaN(parsedPartial)) {
            setPartial(formatValueWithDollarSign(parsedPartial));
        }
        if (!isNaN(parsedDiscount)) {
            setDiscount(formatValueWithDollarSign(parsedDiscount));
        }
    }
    

      const formatValueWithDollarSign = (value: number): string => {
        return `$${value.toFixed(2)}`;
      };
      
      const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const valueWithoutDollarSign = value.replace(/\$/g, '');
        setDiscount(isNaN(parseFloat(valueWithoutDollarSign)) ? '0' : valueWithoutDollarSign);
      };
      
      const handlePartialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const valueWithoutDollarSign = value.replace(/\$/g, '');
        setPartial(isNaN(parseFloat(valueWithoutDollarSign)) ? '0' : valueWithoutDollarSign);
      };
      
      const handleDiscountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value.replace(/\$/g, ''));
        const formattedValue = isNaN(value) ? '' : formatValueWithDollarSign(value);
        setDiscount(formattedValue)
      };
      
      const handlePartialBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value.replace(/\$/g, ''));
        const formattedValue = isNaN(value) ? '' : formatValueWithDollarSign(value);
        setPartial(formattedValue);
      };
      
      const handleStaffChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const value = e.target.value
        setStaff(value)
        if(e.target.value !== ""){
            setFocus(prev=>({
                ...prev,
                check2:true
            }))
        }else{
            fetchData3('')
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

      useEffect(()=>{
        if(role !== 'ADMIN' && userCheck !== true){
            router.push('/dashboard')
        }
    
      },[])


      const fetchallCus = async() =>{
        const {data} = await axios.get(`${url}/api/customerss?email=${user.id}`)
        setTest1(data)
      }

      const fetchallBus = async () =>{
        const {data} = await axios.get(`${url}/api/businesss?email=${user.id}&name=${user.name}`)
        setTest(data)
      }

      const fetchallEmp = async () =>{
        const {data} = await axios.get(`${url}/api/employees?email=${user.id}`)
        setTest3(data)
      }

      if(role !== 'ADMIN' && userCheck !== true){
        return(
            <div>
                WE SORRY YOU NOT ALLOW TO SEE THIS PAGE AND GET REKT
            </div>
        )
      }
      
  return (
    <>
    <Top which='invoice' text={routerSwitch === 'invoice' ? 'Invoice' : routerSwitch === 'delivery' ? 'Delivery Note' : ''} topTitle='Customer Info'>
        <div className='grid grid-cols-5 gap-3'>
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
                                    onClick={fetchallCus}
                                    onKeyDown={(event)=>handleKeyDown(event, "cusName")}
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
                                                <ul ref={urlRef} className='absolute z-50 rounded-md border-[1px] shadow-md bg-white px-2  py-1 w-full mt-2 max-h-[100px] overflow-auto'>
                                                    {
                                                        test1.map((op)=>{
                                                            return(
                                                                <li data-id={op.id} key={op.id} className={`cursor-pointer ${selectedItemId === op.id ? "bg-gray-200" : "bg-transparent" }`} onClick={()=>{
                                                                    setVal(prev=>({
                                                                        ...prev,
                                                                        cusName:op.cusName || '',
                                                                        cusComp:op.cusComp || '',
                                                                        cusPhone:op.cusPhone1 || '',
                                                                        cusEmail:op.cusEmail || '',
                                                                        cusAddr:op.cusAddr || '',
                                                                        customerId:op.id || '',
                                                                        invBus:op.cusBus || ''
                                                                    }))
                                                                }}>{op.cusName}</li>
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
                                                <ul ref={ulRef1} className='absolute z-50 rounded-md border-[1px] shadow-md bg-white px-2  py-1 w-full mt-2 max-h-[100px] overflow-auto'>
                                                    {
                                                        test2.map((op1)=>{
                                                            return(
                                                                <li data-id={op1.id} key={op1.id} className={`cursor-pointer ${selectedItemId === op1.id ? "bg-gray-200" : "bg-transparent" }`} onClick={()=>{
                                                                    setVal(prev=>({
                                                                        ...prev,
                                                                        cusName:op1.cusName || '',
                                                                        cusComp:op1.cusComp || '',
                                                                        cusPhone:op1.cusPhone1 || '',
                                                                        cusEmail:op1.cusEmail || '',
                                                                        cusAddr:op1.cusAddr || '',
                                                                        customerId:op1.id || '',
                                                                        invBus:op1.cusBus || ''
                                                                    }))
                                                                }}>{op1.cusPhone1}</li>
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
                        <label  className={`absolute cursor-pointer top-0 text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 z-50 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}
                        onClick={item.func}>
                                {item.label}
                            </label>
                    </div>
                )
            })
        }
        </div>
    </Top>
    <Middle middleTitle='Invoice Info'>
        <div className={`grid ${val.invStatus === "partial" ? `${routerSwitch === 'delivery' ? "grid-cols-8" : "grid-cols-9"}` : `${routerSwitch === 'delivery' ? "grid-cols-7" : "grid-cols-8"}`} gap-3`}>
            {
                invForm.map((item,index)=>{
                    return(
                        <React.Fragment key={item.name}>
                            <div className={`col-span-1 relative border-[1px] border-input-primary rounded-md ${routerSwitch === 'delivery' && item.type === 'select' ? "hidden" : ""}`}>
                           {
                            item.label !== "Business" && item.label !== "Status" && item.label !== "Staff" && item.label !== "Discount"  ? (
                                <input
                                type={item.type} 
                                className={`block pl-2 p-1 w-full text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                placeholder=" "
                                required
                                name={item.name}
                                value={item.val}
                                onChange={handleChangeVal}
                                
                            />
                            ) : item.type === "select" ? (
                                <>
                                <select className={`block pl-2 p-1 w-full text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                    name={item.name}
                                    value={item.val}
                                    onChange={handleSelectChange}
                                >
                                    <option className='text-dark-box-color' value="paid">Paid</option>
                                    <option className='text-dark-box-color' value="unpay">Unpaid</option>
                                    <option className='text-dark-box-color' value="partial">Partial</option>
                                </select>
                                </>
                            ): item.type === "array" ? (
                                <>
                                <div className='block pl-2 p-1 w-full text-md focus:outline-none overflow-hidden h-[32px]'>
                                   <div className={` overflow-y-hidden overflow-x-scroll mb-[-50px] pb-[50px] h-full`} >
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
                                    onKeyDown={(event)=>{handleStaffKey(event) , handleKeyDown(event, "staff")}} 
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
                                      }, 150)} onClick={fetchallEmp}/>
                                    </div>
                                   
                                   </div>
                                </div>
                                <div className='relative'>
                                {
                                    focus.check2 === true && (
                                        <ul ref={ulRef2} className='absolute z-50 rounded-md border-[1px] shadow-md bg-white px-2  py-1 w-full mt-2 max-h-[100px] overflow-auto'>
                                                    {
                                                        test3.map((item)=>{
                                                            return (
                                                                <li data-id={item.id} key={item.id} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`} onClick={()=>setStaff(item.empName)}>{item.empName}</li>
                                                            )
                                                        })

                                                    }
                                        </ul>
                                    )
                                }
                            </div>
                                </>
                            ) : item.type === "discount" ? (
                                    <input 
                                        type="text" className={`block pl-2 p-1 w-full text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                        value={discount}
                                        placeholder='$0.00'
                                        onChange={handleDiscountChange}
                                        onBlur={handleDiscountBlur}
                                    />
                            ) : (
                                <>
                                <input
                                    type="text" 
                                    className={`block pl-2 p-1 w-full text-md appearance-none focus:outline-none  bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                    placeholder=''
                                    required
                                    list='business'
                                    name={item.name}
                                    value={val.invBus}
                                    onChange={handleChangeVal}
                                    onClick={fetchallBus}
                                    onKeyDown={(event)=>handleKeyDown(event, "invBus")}
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
                                <div className='relative'>
                                    {
                                        focus.check3 === true && (
                                            <ul ref={ulRef3} className='absolute z-50 rounded-md border-[1px] shadow-md bg-white px-2  py-1 w-full mt-2 max-h-[100px] overflow-auto'>
                                          
                                                        {
                                                            test.map((item)=>{
                                                                return (
                                                                    <li data-id={item.id} key={item.id} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`} onClick={()=>{
                                                                        setVal(prev=>({
                                                                            ...prev,
                                                                            invBus:item.busName || ''
                                                                        }))
                                                                    }}>{item.busName}</li>
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
                        {
                            item.val === "partial" && (
                            <div className="col-span-1 relative border-[1px] border-input-primary rounded-md ">
                                <input 
                                type="text" className={`block pl-2 p-1 w-full text-md appearance-none focus:outline-none bg-transparent ${darkMode ? "text-dark-lg-color" : ""}`}
                                value={partial}
                                placeholder='$0.00'
                                onChange={handlePartialChange}
                                onBlur={handlePartialBlur}
                                />
                            <label className={`absolute top-0 text-md ${darkMode ? "bg-dark-box-color" : "bg-white"} p-4 -z-1 transform text-input-primary scale-75 -translate-y-4 z-0 px-1 py-0 duration-300 origin-0`}>
                                   Partial
                                </label>
                            </div>
                            )
                        }
                        
                        </React.Fragment>
                        
                    )
                })
            }
        </div>
    </Middle>
    {
        test.map((item)=>{
            return(
                <React.Fragment key={item.id}>
                    {
                        val.invBus === item.busName && (
                            <>
                            <General 
                             des={des}
                             customerId={val.customerId}
                             setDes={setDes}
                            generalItems={general}
                            form='invoice'
                            routerPush='invoice'
                            toggleName={toggle.cusName}
                            toggleComp={toggle.cusComp}
                            togglePhone={toggle.cusPhone}
                            toggleAddr={toggle.cusAddr}
                            toggleEmail={toggle.cusEmail}
                            busAddr={item.busAddr}
                            busEmail={item.busEmail}
                            busTelegram={item.busTelegram}
                            bankdes={item.busBankDes}
                            busPhone={item.busPhone1}
                            busEng={item.busInvEng}
                            busKh={item.busInvkh}
                            togglePo={toggle.invPo}
                            mode={mode}
                            invStatus={val.invStatus} 
                            busLogo={item.busLogo}
                            busDes={item.busDes}
                            abaQr={item.abaQr}
                            sigLogo={item.signature}
                            staff={emp}
                            partial={parseFloat(partial.replace(/\$/g, ''))} 
                            discount={parseFloat(discount.replace(/\$/g, ''))} 
                            cusName={val.cusName} 
                            cusComp={val.cusComp} 
                            cusPhone={val.cusPhone} 
                            cusEmail={val.cusEmail} 
                            cusAddr={val.cusAddr} 
                            invBus={val.invBus} 
                            invNo={val.invNo} 
                            invPo={val.invPo} 
                            invTitle={val.invTitle} 
                            invDate={val.invDate} 
                            busType={item.busType}
                            abaName={item.busBankName}
                            abaNumber={item.busBankNumber}
                            />
                            <Meter 
                            des={des}
                            setDes={setDes}
                            meterItems={meter}
                            customerId={val.customerId}
                            form='invoice'
                            routerPush='invoice'
                            toggleName={toggle.cusName}
                            toggleComp={toggle.cusComp}
                            togglePhone={toggle.cusPhone}
                            busDes={item.busDes}
                            toggleAddr={toggle.cusAddr}
                            busEng={item.busInvEng}
                            busKh={item.busInvkh}
                            busAddr={item.busAddr}
                            busEmail={item.busEmail}
                            bankdes={item.busBankDes}
                            busTelegram={item.busTelegram}
                            busPhone={item.busPhone1}
                            mode={mode}
                            toggleEmail={toggle.cusEmail}
                            togglePo={toggle.invPo}
                            invStatus={val.invStatus} 
                            busLogo={item.busLogo}
                            abaQr={item.abaQr}
                            sigLogo={item.signature}
                            staff={emp}
                            partial={parseFloat(partial.replace(/\$/g, ''))} 
                            discount={parseFloat(discount.replace(/\$/g, ''))} 
                            cusName={val.cusName} 
                            cusComp={val.cusComp} 
                            cusPhone={val.cusPhone} 
                            cusEmail={val.cusEmail} 
                            cusAddr={val.cusAddr} 
                            invBus={val.invBus} 
                            invNo={val.invNo} 
                            invPo={val.invPo} 
                            invTitle={val.invTitle} 
                            invDate={val.invDate} 
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

export default Createinv