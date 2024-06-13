"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { currencyToWords } from 'dollars2words';
import Print from './print_from';
import Button from '../ui/buttons/Button';
import ReactToPrint from 'react-to-print';
import useToggle from '@/hooks/stores';
import { useCurrentUser } from '@/hooks/use-current-user';
import axios from 'axios';
import { url } from '@/lib/url';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { handleEditRec, handleReceipt } from '@/app/(protected)/receipt/actions/receipt';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useReceipt } from '@/hooks/usedatas';
import { recentlyActivity } from '@/app/(protected)/recently/action';

type optionDrop = {
  id:string;
  busName:string;
  busLogo:string;
  Rec1:string;
}

type test = {
  recNo:string;
}

type valProps = {
  val:string;
  val1:string;
  val2:string;
}

const Receipting = () => {
     const user = useCurrentUser();
     const role = useCurrentRole()
     const receiptCheck = useReceipt()
     const router = useRouter()
     const printableCompRef1 = useRef<any>()
     const [focus , setFocus] = useState<number | null>(0)
     const { pending , setPending , recId , edit , passingId , onCancel} = useToggle();
     const [selectedItemId, setSelectedItemId] = useState<string>("");
    const [busFil , setBusFil] = useState<string>('')
    const [test , setTest] = useState<string>('')
    const [from , setFrom] =useState<string>('')
    const [payOf  ,  setPayOf] = useState<string>('')
    const [recNum , setRecNum] = useState<string>('')
    const [suggest , setSuggest] = useState<optionDrop[]>([])
    const [ statecheck  , setStateCheck] =useState<string>("")
    const [datee , setDate] = useState({
        day:'',
        month:'',
        year:'',
    })
    const ulRef = useRef<HTMLUListElement>(null);
    const [testval , setTestVal] = useState<valProps>({
      val:'',
      val1:'',
      val2:''
    })
    useEffect(()=>{
      const dateV = new Date()
      const day = dateV.getDate().toString().padStart(2,'0');
      const month = (dateV.getMonth() + 1).toString().padStart(2,'0');
      const year = dateV.getFullYear().toString();;
      setDate({day , month , year});

      const fetchingData = async () =>{
        const {data} = await axios.get(`${url}/api/receipts?email=${user.id}`)
        function generateFourDigitCode():string{
          let largestNumber = 0
          if(data.length > 0){
            largestNumber = Math.max(...data.map((item:test) => parseInt(item.recNo.split("Rc-").join(''))));
            console.log('largestnumber:',largestNumber)
          }
          const getNumber = largestNumber + 1
          const fourDigitCode = getNumber.toString().padStart(5,'0')
          
          return fourDigitCode
      }
      const code = generateFourDigitCode()
        setRecNum(`Rc-${code}`)
      }
      if(!edit){
        fetchingData()
      }
    },[])  

    useEffect(()=>{
      const fetchData = async () =>{
        try{
          const {data} = await axios.get(`${url}/api/receipt/${passingId}?email=${user?.id}`)
          setFrom(edit ? data.recFrom : '')
          setPayOf(edit ? data.payOf : '')
          setTest(edit ? `$${data.usd.toFixed(2)}` : '')
          setStateCheck(edit ? data.check : '')
          setRecNum(edit ? data.recNo : '')
          setBusFil(edit ? data.recBus : '')
        }catch(error){
          console.log(error)
        }
      }
      if(edit && passingId){
        fetchData()
      }
    },[edit , passingId])

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
          setBusFil(suggest.find(item => item.id === selectedItemId)?.busName || "")
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

    useEffect(() => {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`${url}/api/invoice/${recId}?email=${user.id}`);
          setTest(`$${data.balance.toFixed(2)}`)
          setFrom(data.cusComp)
          setPayOf(data.invTitle)
          setBusFil(data.invBus)
          setTestVal(prev=>({
            ...prev,
            val:data.cusComp,
            val1:data.invTitle,
            val2:data.invBus
          }))
          console.log(testval)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      if (recId) { // recId
        fetchData();
      }
    }, [recId]); // dependencie recId
    const fetchDatas = async (newString:string) =>{
      const {data} = await axios.get(`${url}/api/businesss?email=${user.id}&name=${user.name}&filter=${newString}`)
      setSuggest(data)
    }

    useEffect(()=>{
        fetchDatas(busFil)
    },[busFil])



    const check = () =>{
        setStateCheck('check')
    }

    const check1 = () =>{
        setStateCheck('check1')
    }

    const check2 = () =>{
        setStateCheck('check2')
    }

    const formattedValueWithDollarSign = (value:number):string =>{
      return `$${value.toFixed(2)}` 
  }
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      let newValue: string | number = value;

      const parseValue = parseFloat(value);
      const valueWithDollarSign = value.replace(/\$/g, '');
       isNaN(parseValue) ? '' : valueWithDollarSign
       setTest(newValue)  
  }
  const onBlur = (e:React.FocusEvent<HTMLInputElement>) =>{
   const value = parseFloat(e.target.value.replace(/\$/g, ''))
   const formattedValue = isNaN(value) ? '' : formattedValueWithDollarSign(value)
   setTest(formattedValue)   
  }
  const dateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // If the value is less than 10, ensure it has a leading zero
    if (formattedValue.length === 1 && parseInt(formattedValue, 10) < 10) {
        formattedValue = formattedValue.padStart(2, '0');
    }

    // If changing day or month, enforce two decimal places
    if (name === 'day' || name === 'month') {
        // Remove any non-digit characters
        formattedValue = formattedValue.replace(/\D/g, '');
        // Ensure only the first two characters are kept
        formattedValue = formattedValue.slice(0, 2);
    }

    // Parse values to integers
    const dayValue = parseInt(formattedValue, 10);
    const monthValue = parseInt(formattedValue, 10);

    // Check if the day exceeds the minimum day value
    const minDay = 1; // Assuming minimum day is 1
    const maxDay = 31; // Assuming maximum day is 31
    if (name === 'day' && (dayValue < minDay || dayValue > maxDay)) {
        // Reset day to today's date
        const today = new Date();
        formattedValue = String(today.getDate()).padStart(2, '0');
    }

    // Check if the month exceeds the maximum month value
    const minMonth = 1; // Assuming minimum month is 1
    const maxMonth = 12; // Assuming maximum month is 12
    if (name === 'month' && (monthValue < minMonth || monthValue > maxMonth)) {
        // Reset month to today's date
        const today = new Date();
        formattedValue = String(today.getMonth() + 1).padStart(2, '0');
    }

    setDate({
        ...datee,
        [name]: formattedValue
    });
};




  const handleFilClick = (value:string | undefined) =>{
    if(value === undefined){
      setBusFil('')
    }else{
      setBusFil(value)
  
    }
  }

  const combineDate =(day:string , month:string, year:string):Date =>{
    const dayNumber = parseInt(day,10)
    const monthNumber = parseInt(month,10)
    const yearNumber = parseInt(year,10)
    const combinedate = new Date(yearNumber  , monthNumber - 1 , dayNumber + 1);
    return combinedate
  }

  const saving = async() =>{
    setPending(true)
    let validation = ''
    if(!from){
      validation = "sorry this field is required"
      toast.error(validation)
      setPending(false)
    }else{
      const comdate = combineDate(datee.day , datee.month , datee.year)
      try{
        const data = await handleReceipt({
          datee:comdate.toISOString().split('T')[0],
          recFrom:from,
          payOf:payOf,
          usd:parseFloat(test.replace(/\$/g, '')),
          recNo:recNum,
          check:statecheck,
          recBus:busFil
        })
          if(data?.error){
            toast.error(data.error)
            setPending(false)
          }
          if(data?.success){
           await recentlyActivity({
              user:user.name,
              cust:from,
              route:'Receipt',
              action:'Created',
              paperNo:recNum
            })
            toast.success('saving successfully')
            setPending(false)
            router.push('/receipt/table')
          }
      }catch(error){
        toast.error('somethign went wrong')
        setPending(false)
      }
    }
  }

  const onUpdate = async() =>{
    setPending(true)
    let validation = ''
    if(!from && !test){
      validation = 'sorry this field is required'
      toast.error(validation)
      setPending(false)
    }else{
      const comdate = combineDate(datee.day , datee.month , datee.year)
      try{
        const data = await handleEditRec({
          id:passingId,
          updateDate:comdate.toISOString().split('T')[0],
          recFrom:from,
          payOf:payOf,
          usd:parseFloat(test.replace(/\$/g, '')),
          recNo:recNum,
          check:statecheck,
          recBus:busFil
        })
        if(data?.error){
          toast.error(data.error)
          setPending(false)
        }
        if(data?.success){
          await recentlyActivity({
            user:user.name,
            cust:from,
            route:'Receipt',
            action:'Updated',
            paperNo:recNum
          })
          toast.success(data.success)
          setPending(false)
          router.push('/receipt/table')
        }
      }catch(error){
        toast.error("something went wrong")
        setPending(false)
      }
       
    }
  }

  const valueReplace = test.replace(/\$/g, '')

  const date = "h-[50px] w-[100px] lg:h-[40px] lg:w-[90px] border-solid border-solid border-l-[8px] border-y-[8px] border-r-[4px] border-gray-300 "
  const date1 = "h-[50px] w-[100px] lg:h-[40px] lg:w-[90px] border-solid border-solid border-y-[8px]  border-x-[4px] border-gray-300 "
  const date2 = "h-[50px] w-[100px] lg:h-[40px] lg:w-[90px] border-solid border-solid border-r-[8px] border-y-[8px] border-l-[4px] border-gray-300 "

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        router.push('/receipt/table')
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);


  if(role !== 'ADMIN' && receiptCheck !== true){
    router.push('/dashboard')
    return(
        <div>
            WE SORRY YOU NOT ALLOW TO SEE THIS PAGE AND GET REKT
        </div>
    )
  }



  return (
    <>
    <div className=" px-[10px] pt-10 xl:w-[1000px] lg:w-[1000px] mx-auto" >
            <div  >
            <div style={{backgroundImage:"url('/RecImg.png')",backgroundSize:"cover"}} className={`h-[530px] lg:h-[460px] pt-[60px] px-[30px]`} >
            {/***************************/}
            <div className='flex justify-between items-center'>
      
                  <div className='flex justify-center items-center'>
                    {
                      suggest.map((item)=>{
                        return(
                          <React.Fragment key={item.id}>
                            {
                              busFil === item.busName && (
                                <>
                                <Image src={!item.busLogo ? '/n5LOGO.png' : item.busLogo} className='w-[210px] lg:w-[170px] h-[80px] ' alt="#" width={210} height={210}/>
                                <Image src={!item.Rec1 ? '/text.png' : item.Rec1} className='w-[190px] lg:w-[160px] h-[70px]'  alt='#' width={190} height={190}/>
                                </>
                              ) 
                            }
                          </React.Fragment>
                        )
                      })
                    }
                    {
                      busFil === '' && (
                            <>
                                <Image src='/n5LOGO.png'  className='w-[210px] lg:w-[170px]' alt="#" width={210} height={210}/>
                                <Image src='/text.png' className='w-[190px] h-[70px] lg:w-[160px]' alt='#' width={190} height={190}/>
                            </>
                      )
                    }
                  </div>
        
                  <Image src="/RecLetter.png"  className='w-[230px] lg:w-[190px] ' alt='#' width={230} height={230}/>
            
                <div>
                
                
                <div className='flex justify-center items-center'>
                  <div className='pt-[13px] text-[24px] lg:text-[20px] pr-[5px] text-end text-slate-400' >
                  <p className='h-[20px]' style={{fontFamily:"khmerContent"}}>កាលបរិច្ឆទ:</p>
                  <p className='h-[20px] pt-[5px]' style={{fontFamily:"khmerContent"}}>Date:</p>
                  </div>
                  <div>
                    <div className='text-center text-[24px] lg:text-[20px] text-slate-400' style={{fontFamily:"khmerContent"}}>
                    លេខ​ /​ No: <span className='text-black'>{recNum}</span>
                    </div>


                  {
                    /*/////////////////////// date /////////////////////////////////////*/
                   
                  }
                  <input className={`${date} text-[24px] lg:text-[20px] text-center outline-none`} type='number'name='day'  value={datee.day}
                  onChange={dateChange} />
                  <input className={`${date1} text-[24px] lg:text-[20px] text-center outline-none`} type='number' name='month' value={datee.month} 
                  onChange={dateChange}/>
                  <input className={`${date2} text-[24px] lg:text-[20px] text-center outline-none`} type='number' name='year' value={datee.year}
                  onChange={dateChange}/>
                  <div>
                  </div>
                  {
                    /*/////////////////////// date /////////////////////////////////////*/
                  }
                  </div>
                </div>
                </div>
            </div>
            {/***************************/}
            <div className='flex'>
              {/*************************/}
              <div className='w-full'>
              <div className='mt-[20px] lg:mt-[5px] mb-[6px] lg:mb-[3px]'>
                <p className='text-start text-[24px] lg:text-[20px] h-[23px] text-slate-400 pt-[13px]' style={{fontFamily:"khmerContent"}}>ទទួលពី:</p>
                <div className='flex'>
                  <label className='text-[24px] lg:text-[20px] text-slate-400 pt-[13px]'>Received From:</label>
                  <input className='outline-none border-dotted w-[515px] lg:w-[379px] h-[40px] pt-[3px] pl-[10px] lg:pl-[6px] border-b-[3px] border-slate-400 ml-1 text-[24px] lg:text-[20px]' type="text" style={{background:"none",fontFamily:"khmerContent"}} value={from} onChange={(e)=>setFrom(e.target.value)}/>
                </div>
              </div>
              <div className='mb-[6px] lg:mb-[3px]'>
                <p className='text-start text-[24px] lg:text-[20px] h-[23px] text-slate-400' style={{fontFamily:"khmerContent"}}>ចំនួនប្រាក់:</p>
                <div className='flex'>
                  <label className='text-[24px] lg:text-[20px] w-[138px] lg:w-[120px] text-slate-400'>The Sum of:</label>
                  <span className='border-dotted border-b-[3px] inline-block leading-[0.7em] h-[27px] pl-[10px] lg:pl-[6px]  border-slate-400 ml-1 text-[24px] lg:text-[20px] w-[551px] lg:w-[406px]'>
                  {valueReplace !== undefined && valueReplace !== '' ? (
                        currencyToWords(parseFloat(valueReplace)).length >= 43 
                            ? `${valueReplace === " " ? "" : currencyToWords(parseFloat(valueReplace)).split(" ").slice(0, 5).join(" ")}`
                            : `${valueReplace === " " ? "" : currencyToWords(parseFloat(valueReplace)).split(" ").slice(0, 8).join(" ")}`
                    ) : ''}
                  </span>
                </div>
                {
                  valueReplace !== undefined ? parseFloat(valueReplace) >= 100000 ? (
                    <input type="text" className={`border-dotted border-b-[3px]  inline-block leading-[0.7em] bg-transparent pb-[5px] pl-[137px] mt-[19px] border-slate-400 ml-1 text-[24px] lg:text-[20px] w-[691px] lg:w-[526px]`} value={valueReplace !== undefined && valueReplace !== '' ? (
                      currencyToWords(parseFloat(valueReplace)).length >= 43
                          ?  `${currencyToWords(parseFloat(valueReplace)).split(" ").slice(5).join(" ")}`
                          :  `${currencyToWords(parseFloat(valueReplace)).split(" ").slice(8).join(" ")}`
                  ) : ''}/>
                  ) : (
                    <span className={`border-dotted border-b-[3px]  inline-block leading-[0.7em] pb-[10px] pl-[130px] mt-[26px] border-slate-400 ml-1 text-[24px] lg:text-[20px] w-[691px] lg:w-[526px]`}>
                        {valueReplace !== undefined && valueReplace !== '' ? (
                              currencyToWords(parseFloat(valueReplace)).length >= 43
                                  ?  `${currencyToWords(parseFloat(valueReplace)).split(" ").slice(5).join(" ")}`
                                  :  `${currencyToWords(parseFloat(valueReplace)).split(" ").slice(8).join(" ")}`
                          ) : ''}
                          
                  </span>
                  ) :"" 
                }
              </div>
              <div className='mb-[6px] lg:mb-[3px]'>
                <p className='text-start text-[24px] lg:text-[20px] h-[23px] text-slate-400 pt-[13px]'  style={{fontFamily:"khmerContent"}}>សំរាប់ការចំណាយ:</p>
                <div className='flex text-[20px]'>
                  <label className='text-[24px] lg:text-[20px] text-slate-400 pt-[13px]'>For Payment of:</label>
                  <input className='outline-none border-dotted border-b-[3px] h-[40px] pt-[3px]  pl-[20px] w-[380px] border-slate-400 ml-1 text-[24px] lg:text-[20px]' style={{background:"none",fontFamily:"khmerContent"}} type="text" value={payOf} onChange={(e)=>setPayOf(e.target.value)} />
                </div>
              </div>
              {/********************************** */}
              <div className='flex mt-[16px] lg:mt-[14px]'>
              <div className='flex text-[24px] lg:text-[20px] items-center '>
                <div className='text-slate-400'>Cash.</div>
                {statecheck === 'check' ? (
                    <Image className='w-[23px] h-[23px]' src="/tickblack.png" alt='#' width={23} height={23}/>
                  ) : (
                    <Image className='w-[23px] h-[23px]' src="/tickgrey.png" onClick={check} alt='#'  width={23} height={23}/>
                  )}
              </div>
              <div className='flex text-[24px] lg:text-[20px] mx-[10px] items-center '>
                <div className='text-slate-400'>/E-Banking.</div>
                {statecheck === 'check1' ? (
                    <Image className='w-[23px] h-[23px]' src="/tickblack.png" alt='#'  width={23} height={23}/>
                  ) : (
                    <Image className='w-[23px] h-[23px]' src="/tickgrey.png" onClick={check1} alt='#'  width={23} height={23}/>
                  )}
              </div>
              <div className='flex text-[24px] lg:text-[20px] mx-[10px] items-center '>
                <div className='text-slate-400'>/Cheque.</div>
                {statecheck === 'check2' ? (
                    <Image className='w-[23px] h-[23px] ' src="/tickblack.png"   alt='#'  width={23} height={23}/>
                  ) : (
                    <Image className='w-[23px] h-[23px]' src="/tickgrey.png" onClick={check2} alt='#'  width={23} height={23}/>
                  )}
              </div>
              <div className='flex text-[24px] lg:text-[20px]'>
                <div className='text-slate-400'>No.</div>
                <div className='border-dotted border-b-[3px] border-slate-400 w-[135px] ml-1'></div>
              </div>
              </div>
              </div>
              {/*************************/}
              {/*************************/}
              <div className='flex justify-end ml-[30px]'>
                  <div>
                    <div className='flex my-[20px] lg:my-[10px] border-[2px] border-gray-400 h-[70px] lg:h-[60px] bg-white'>
                      <p className=' h-[70px] text-[40px] lg:text-[34px] text-center relative bottom-1 z-20 pl-[10px] font-bold pt-[8px]'>USD</p>
                      <input type="text" className='w-[290px] lg:w-[250px] text-center text-[30px] font-bold outline-none bg-transparent' value={`${test === "" ? "" : test}`} onChange={handleChange} onBlur={onBlur}/>
                    </div>
                  <div className='border-dashed border-[2px] border-slate-300 bg-white w-[390px] lg:w-[350px] pt-[10px] h-[200px]'>
                      <p className='text-center text-slate-400' style={{fontFamily:"khmerContent"}}>ហត្ថលេខាអ្នកទទួល / Receiver Signature</p>
                  </div>
                  </div>
              </div>
              {/*************************/}
            </div>
            {/***************************/}
              </div>
              <div className=" h-[20.5px]">

              </div>
            </div>

            <div className='flex justify-end'>
            <div  className='flex gap-2 items-center'>
            <div>
            <input type="text" className='text-center w-[120px] bg-red-500 text-white h-[29px] rounded-md' 
            value={busFil} 
                onChange={(e)=>setBusFil(e.target.value)}
                onClick={()=>fetchDatas('')}
                onKeyDown={handleKeyDown}
                onFocus={()=>setFocus(1)}
                onBlur={()=>setTimeout(() => {
                  setFocus(null)
                }, 150)}
                placeholder='All'
                autoComplete='off'
             />
            <div className='relative'>
                {
                  focus === 1 && (
                    <ul ref={ulRef} className='absolute bg-white max-h-[100px] overflow-auto'>
                      {
                        suggest.map((item)=>{
                          return(
                            <li data-id={item.id} key={item.id} className={`cursor-pointer ${selectedItemId === item.id ? "bg-gray-200" : "bg-transparent" }`}  onClick={()=>handleFilClick(item?.busName)}>
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
            <Button bgColor='bg-red-500' color='white' text='Cancel' handleClick={()=>{
              onCancel()
              router.push('/receipt/table') 
            }}/>
            
            <Button bgColor='bg-red-500' color='white' text='PDF'/>

            <Button bgColor='bg-red-500' color='white' text={pending ? "loading..." : `${edit ? "Update" : "Saving"}`} handleClick={edit ? onUpdate : saving}/>

            <ReactToPrint
              trigger={()=>(<button className='bg-red-500 px-4 text-[15px] rounded-md py-1 text-white'>Print!</button>)}
              content={()=>printableCompRef1.current}
              pageStyle="@page {size: A4 landscape; margin: 0;}"
            />
            </div>
            </div>
                      
           </div>
           <div className='hidden'>
           <div ref={printableCompRef1}>
           <Print
           recNum={recNum}
           busfil={busFil}
           suggest={suggest}
           day={datee.day}
           month={datee.month}
           year={datee.year}
           usdinput={valueReplace}
           recFrom={from}
           paymentOf={payOf}
           checks={statecheck}
           />
           </div>
           </div>
    </>
  )
}

export default Receipting
