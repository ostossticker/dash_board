"use client"
import { addMeter, editMeter } from "@/app/(protected)/invoice/actions/meters";
import useToggle from "@/hooks/stores";
import React, {  use, useCallback, useEffect, useRef, useState } from "react";
import { PiCopySimpleLight } from "react-icons/pi";
import { PiTrashLight } from "react-icons/pi";
import { toast } from "react-toastify";
import Invprint from "./PrintForms/Invoice";
import InvoiceForm from "./invoice_form";
import QuotationForm from "./quotation_form";
import Qtprint from "./PrintForms/quotation";
import Option from "../ui/OptionsMenu/Option";
import { useRouter } from "next/navigation";
import { addQtMeter, editQtMeter } from "@/app/(protected)/quotation/actions/meters";
import axios from "axios";
import { url } from "@/lib/url";
import { useCurrentUser } from "@/hooks/use-current-user";
import { recentlyActivity } from "@/app/(protected)/recently/action";

interface Calculation {
  id:string;
  description: string;
  sizeWidth: number;
  sizeHeight: number;
  quantity: string;
  unitPrice: string;
  m2: number;
  total: string;
}

type desProps = {
  id:string;
  text:string;
}

type meterProps = {
  form:string;
  busType:string | undefined;
  ////invoice form
  cusName:string;
  cusComp:string;
  cusPhone:string;
  cusEmail:string;
  cusAddr:string;
  invBus:string;
  invNo:string;
  invPo?:string;
  invTitle:string;
  staff:string[];
  invDate:string;
  partial?:number;
  discount?:number;
  invStatus?:string;
  ////staff information
  staffName?:string;
  staffPhone?:string;
  staffTelegram?:string;
  ////staff information
  //ur info
  abaName?:string;
  abaNumber?:string
    ////toggleStuff

    ///business 
  busAddr?:string;
  busEmail?:string;
  busTelegram?:string;
  busPhone?:string;
  busPayTerm?:string;

    toggleEmail?:boolean;
    togglePo?:boolean;
    toggleAddr?:boolean;
    toggleName?:boolean;
    toggleComp?:boolean;
    togglePhone?:boolean;
    ///////router push
    routerPush?:string;
    meterItems:Calculation[]
    ////des
    des:desProps[]
    setDes: React.Dispatch<React.SetStateAction<desProps[]>>
    /////logo
    busLogo?:string;
    abaQr?:string;
    sigLogo?:string;
    ///// old img
    oldImg?:string;
    oldImg1?:string;
    ///busDes
    busDes?:string;
    ////mode
    mode?:string,
    customerId:string;
    ////bankdes
    bankdes?:string;
    ////bus
    busKh?:string;
    busEng?:string;
}

type prodProps ={
  id:string;
  prodItemName:string;
  prodUnitPrice:string;
  prodBusType:string;
  prodBus:string;
}

type quoteImage = {
  img1:File | undefined,
  img2:File | undefined
}

const Meters = ({meterItems,
  des,
  setDes,
  busType,
  form,
  cusName,
  routerPush,
  staffName ,
  oldImg, 
  oldImg1, 
  staffPhone ,
  busLogo , 
  abaQr , 
  sigLogo, 
  staffTelegram,
  busPayTerm,
  toggleEmail,
  toggleName , 
  toggleComp , 
  togglePhone ,
  busDes,
  staff, 
  toggleAddr , 
  togglePo ,
  busEmail,
  busAddr,
  busPhone,
  busTelegram,
  invStatus ,
  abaName , 
  abaNumber , 
  partial , 
  discount , 
  mode,
  cusComp , 
  cusPhone ,
  cusEmail ,
  cusAddr ,
  invBus ,
  invNo ,
  invPo ,
  invTitle ,
  customerId,
  bankdes,
  busEng,
  busKh,
  invDate}:meterProps) => {
  const router = useRouter()
  const {darkMode, 
    pending , 
    setPending , 
    setPrint , 
    setRec ,
    print , 
    printing , 
    setPrinting ,
    routerSwitch ,
    logo ,
    address ,
    signature ,
    employee ,
    bankInfo,
    passingId,
    edit,
    setQtid,
    onCancel,
    setSwitch,
    setPassingId,
    qtId,
    notification,
    enableNote,
    setPdf
  } = useToggle()
  const user = useCurrentUser()
  const [note , setNote] = useState<string>('')
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [focus1 , setFocus1] = useState<number | null>(null)
  const [focus , setFocus] = useState<number | null >(null)
  const [productFilter , setProductFilter] = useState<string>('')
  const [check , setCheck] = useState<boolean>(false)
  const [icon , setIcon] = useState<boolean>(false)
  const ref1 = useRef<HTMLInputElement>(null)
  const ref2 = useRef<HTMLInputElement>(null)
  const [products , setProducts] = useState<prodProps[]>([])
  const ulRef = useRef<HTMLUListElement>(null);
  const [calculations, setCalculations] = useState<Calculation[]>([
    {
      id:crypto.randomUUID(),
      description: "",
      sizeWidth: 0,
      sizeHeight: 0,
      quantity: "",
      unitPrice: "",
      m2: 0,
      total: ""
    }
  ]);
  const [image , setImage] = useState<quoteImage>({
    img1:undefined,
    img2:undefined
  })

  const handleCopy = (
    description: string,
    sizeWidth: number,
    sizeHeight: number,
    m2: number,
    quantity: string,
    unitPrice: string,
    total: string
  ) => {
    if(form === 'invoice'){
      if (calculations.length < 12) {
        const newItem = {
          id:crypto.randomUUID(),
          description,
          sizeWidth,
          sizeHeight,
          m2,
          quantity,
          unitPrice,
          total
        };
      
        // Add the newItem to the calculations array
        setCalculations(prevCalculations => [...prevCalculations, newItem]);
      } else {
        // Display a message or handle the case where the limit is reached
        console.log('Cannot add more than 12 calculations.');
      }
    }
    if(form === 'quotation'){
      if (calculations.length < 6) {
        const newItem = {
          id:crypto.randomUUID(),
          description,
          sizeWidth,
          sizeHeight,
          m2,
          quantity,
          unitPrice,
          total
        };
      
        // Add the newItem to the calculations array
        setCalculations(prevCalculations => [...prevCalculations, newItem]);
      } else {
        // Display a message or handle the case where the limit is reached
        console.log('Cannot add more than 12 calculations.');
      }
    }
  };

  const handleAddCalculation = () => {
    if(form === 'invoice'){
      if (calculations.length < 12) {
        setCalculations([
          ...calculations,
          {
            id:crypto.randomUUID(),
            description: "",
            sizeWidth: 0,
            sizeHeight: 0,
            quantity: "",
            unitPrice: "",
            m2: 0,
            total: ""
          }
        ]);
      } else {
        console.log('Cannot add more than 12 calculations.');
      }
    }else if (form === 'quotation'){
      if (calculations.length < 6) {
        setCalculations([
          ...calculations,
          {
            id:crypto.randomUUID(),
            description: "",
            sizeWidth: 0,
            sizeHeight: 0,
            quantity: "",
            unitPrice: "",
            m2: 0,
            total: ""
          }
        ]);
      } else {
        console.log('Cannot add more than 12 calculations.');
      }
    }
  };

  useEffect(()=>{
    setCalculations(edit && passingId || qtId ? meterItems === undefined ? [{
      id:crypto.randomUUID(),
      description: "",
      sizeWidth: 0,
      sizeHeight: 0,
      quantity: "",
      unitPrice: "",
      m2: 0,
      total: ""
    }] :meterItems : [{
      id:crypto.randomUUID(),
      description: "",
      sizeWidth: 0,
      sizeHeight: 0,
      quantity: "",
      unitPrice: "",
      m2: 0,
      total: ""
    }])
  },[edit , passingId , qtId])

  const handleRemoveCalculation = (index: number) => {
    const updatedCalculations = [...calculations];
    updatedCalculations.splice(index, 1);
    setCalculations(updatedCalculations);
  };
  
  const formatUnitPrice = (value: string): string => {
    // Remove the dollar sign if present
    const valueWithoutDollarSign = value.replace(/\$/g, '');
    
    if (valueWithoutDollarSign.trim() === '') {
        return ''; // Return empty string if the input value is empty after removing the dollar sign
    }
    
    const parsedValue = parseFloat(valueWithoutDollarSign);
    if (!isNaN(parsedValue)) {
        return parsedValue.toFixed(2);
    }
    return ''; // Return empty string if the input value is not a valid number
};

const formatTotal = (value: string): string => {
  // Remove the dollar sign if present
  const valueWithoutDollarSign = value.replace(/\$/g, '');
  
  if (valueWithoutDollarSign.trim() === '') {
      return ''; // Return empty string if the input value is empty after removing the dollar sign
  }
  
  const parsedValue = parseFloat(valueWithoutDollarSign);
  if (!isNaN(parsedValue)) {
      return parsedValue.toFixed(2);
  }
  return ''; // Return empty string if the input value is not a valid number
};

  const handleChange = (index: number, field: keyof Calculation, value: string | number) => {
    setCalculations(prevCalculations => {
        const updatedCalculations = [...prevCalculations];
        const updatedCalculation = { ...updatedCalculations[index] };

        if (field === 'description') {
            updatedCalculation[field] = value as string; // Set description directly
        } else if (field === 'sizeWidth' || field === 'sizeHeight') {
            updatedCalculation[field] = parseFloat(value as string);
        }else if (field === 'm2'){
            updatedCalculation[field] = parseFloat(value as string)
        }else if (field === 'quantity') {
          updatedCalculation[field] = value as string
        } else if (field === 'unitPrice' || field === 'total') {
            // Remove $ sign if present and convert to float
            const unitPriceString = (value as string).replace(/\$/g, '');
            if (unitPriceString === '') {
              updatedCalculation[field] = ''; // Set unitPrice to empty if value is empty after removing the dollar sign
          } else {
              updatedCalculation[field] = `$${unitPriceString}`; // Add dollar sign to unitPrice and total
          }
        }

        const descrip = updatedCalculation.description;
          if(field === 'description' && descrip !== ''){
            setFocus1(index)
          }else{
            fetchdatas('')
          }
   

        // Calculate m2
        const width = updatedCalculation.sizeWidth;
        const height = updatedCalculation.sizeHeight;
        if (!isNaN(width) && width !== 0 && !isNaN(height) && height !== 0) {
            updatedCalculation.m2 = ((width * height) / 10000);
        } else {
            updatedCalculation.m2 = updatedCalculation.m2;
        }

        // Calculate total based on the provided conditions
        if (updatedCalculation.m2 !== 0) {
            const quantity = updatedCalculation.quantity;
            const unitPrice = parseFloat(updatedCalculation.unitPrice.replace(/\$/g, ''));
            if (!isNaN(width) || !isNaN(height) || quantity || !isNaN(unitPrice)) {
              if(quantity.match(/\./g)){
                setFocus(index)
              }else{
                setFocus(null)
              }
                updatedCalculation.total = `$${(updatedCalculation.m2 * parseInt(quantity) * unitPrice).toFixed(2)}`;
            } else {
                updatedCalculation.total = '';
            }
        } else {
            const quantity = updatedCalculation.quantity;
            const unitPrice = parseFloat(updatedCalculation.unitPrice.replace(/\$/g, ''));
            if (!quantity) {
                if (!isNaN(unitPrice)) {
                    updatedCalculation.total = `$${unitPrice.toFixed(2)}`;
                } else {
                    updatedCalculation.total = '';
                }
            } else if (quantity !=='' || !isNaN(unitPrice)) {
              if(quantity.match(/\./g)){
                setFocus(index)
              }else{
                setFocus(null)
              }
              updatedCalculation.total = `$${(parseInt(quantity.replace(/\./g , '')) * unitPrice).toFixed(2)}`;
            }
        }

        // Handle NaN total
        if (isNaN(parseFloat(updatedCalculation.total.replace(/\$/g, '')))) {
            updatedCalculation.total = '';
        }

        updatedCalculations[index] = updatedCalculation;
        return updatedCalculations;
    });
};

const handleLiClick = (index:number , field:keyof Calculation , value:string | number , op:string) =>{
  setCalculations(prev =>{
        const updatedCalculations = [...prev];
        const updatedCalculation = { ...updatedCalculations[index] };

        if(field === "quantity"){
          if(op === "pcs"){
            if(parseInt((value as string).replace(/\./g, '')) === 1){
              updatedCalculation[field] = (value as string).replace(/\./g, '') + "pc"
            }else{
              updatedCalculation[field] = (value as string).replace(/\./g, '') + op
            }
          }else{
            updatedCalculation[field] = (value as string).replace(/\./g, '') + op
          }
        }

        updatedCalculations[index] = updatedCalculation;
        return updatedCalculations;
  })
  setFocus(null)
}

const fetchdatas = async (filterProduct?:string) =>{
  const {data} = await axios.get(`${url}/api/products?email=${user.id}&filter=${filterProduct}`)
  setProducts(data)
}

const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index?: number, field?: string) => {
  if (focus1 === index) {
    if (event.keyCode === 38 || event.keyCode === 40) { // Up or Down arrow key
      const filteredProducts = products.filter(item => item.prodBusType === busType);
      const indexInFiltered = filteredProducts.findIndex(item => item.id === selectedItemId);
      const newIndex = event.keyCode === 38
        ? Math.max(indexInFiltered - 1, 0)
        : Math.min(indexInFiltered + 1, filteredProducts.length - 1);
      setSelectedItemId(filteredProducts[newIndex]?.id || selectedItemId);
      scrollToSelectedIndex();
    } else if (event.keyCode === 13) { // Enter key
      setCalculations(prev => {
        const updatedCalculations = [...prev];
        const updatedCalculation = { ...updatedCalculations[index === undefined ? 1 : index] };

        if (field === 'description') {
          updatedCalculation[field] = products.find(item => item.id === selectedItemId)?.prodItemName || '';
          updatedCalculation.unitPrice = `$${parseFloat(products.find(item => item.id === selectedItemId)?.prodUnitPrice || '').toFixed(2)}`
          handleChange(index , 'unitPrice' , updatedCalculation.unitPrice)
        }

        updatedCalculations[index] = updatedCalculation;
        return updatedCalculations;
      });


      setCheck(false)
      setFocus1(null);
     
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
  if(productFilter !== ''){
    fetchdatas(productFilter)
  }
},[productFilter])

const handleOnClick = () =>{
  fetchdatas('')
}

///// products items

const handleClickProducts = (index:number , field:keyof Calculation , op:string , money:string) =>{
  setCalculations(prev =>{
    const update = [...prev]
    const updated = {...update[index]}
    if(field === 'description'){
      updated[field] = op as string
      updated.unitPrice = `$${parseFloat(money).toFixed(2)}`
      handleChange(index , 'unitPrice' , updated.unitPrice)
    } 

    update[index] = updated
    return update
  })
}

const handleUnitPriceBlur = (value: string, index: number) => {
  if (value.trim() === '') {
      console.log('Value is empty, setting unitPrice to empty');
      handleChange(index, 'unitPrice', ''); 
  } else {
      const formattedValue = formatUnitPrice(value);
      console.log('Formatted Value:', formattedValue);
      const parsedValue = parseFloat(formattedValue);
      console.log('Parsed Value:', parsedValue);
      if (!isNaN(parsedValue)) {
          const formattedNumber = parsedValue.toFixed(2);
          console.log('Formatted Number:', formattedNumber);
          handleChange(index, 'unitPrice', formattedNumber); 
      } else {
          handleChange(index, 'unitPrice', ''); 
      }
  }
};

const handleUnitPriceKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, value: string, index: number) => {
  if (event.key === 'Enter') {
      if (value.trim() === '') {
          console.log('Value is empty, setting unitPrice to empty');
          handleChange(index, 'unitPrice', ''); 
      } else {
          const formattedValue = formatUnitPrice(value);
          console.log('Formatted Value:', formattedValue);
          const parsedValue = parseFloat(formattedValue);
          console.log('Parsed Value:', parsedValue);
          if (!isNaN(parsedValue)) {
              const formattedNumber = parsedValue.toFixed(2);
              console.log('Formatted Number:', formattedNumber);
              handleChange(index, 'unitPrice', formattedNumber); 
          } else {
              handleChange(index, 'unitPrice', ''); 
          }
      }
  }
};
const handleTotalChange = (index: number, value: string) => {
  setCalculations(prevCalculations => {
      const updatedCalculations = [...prevCalculations];
      const updatedCalculation = { ...updatedCalculations[index] };
      if (updatedCalculation.unitPrice === "") {
          const valueWithoutDollarSign = value.replace(/\$/g, '');

          if (valueWithoutDollarSign === '') {
              updatedCalculation.total = '';
          } else {
              updatedCalculation.total = `$${valueWithoutDollarSign}`;
          }
      }

      updatedCalculations[index] = updatedCalculation;
      return updatedCalculations;
  });
};

const calculateGrandTotal = () => {
  return calculations.reduce((acc, curr) => acc + parseFloat(curr.total.replace(/\$/g, '') || '0'), 0).toFixed(2);
};

const calculateBalance = () => {
  let grandTotalNumber: number = parseFloat(calculateGrandTotal());
  let balance = 0.00;

  let partialNumber: number = partial ? parseFloat(partial.toString().replace(/\$/g, '')) : 0;
  let discountNumber: number = discount ? parseFloat(discount.toString().replace(/\$/g, '')) : 0;

  if (isNaN(grandTotalNumber)) {
    return '0';
  }


  if (invStatus === "partial" && Number.isNaN(discount)) {
    balance = grandTotalNumber - partialNumber;
  } else if (invStatus !== "partial" && !Number.isNaN(discount)) {
    balance = grandTotalNumber - discountNumber;
  } else if (invStatus === "partial" && !Number.isNaN(discount)) {
    balance = grandTotalNumber - partialNumber - discountNumber;
  }else {
    balance = grandTotalNumber; 
  }
  return balance.toFixed(2);
};

  const handleM2 = ( value:string, index:number) =>{
    if(value.trim() === ''){
      handleChange(index, 'm2', ''); 
    }else{
      const parseValue = value
      if(!Number.isNaN(parseValue)){
        handleChange(index , 'm2' , value)
      }else{
        handleChange(index, 'm2', ''); 
      }
    }
  }

  const handleM2Key = (e:React.KeyboardEvent<HTMLInputElement> , index:number , value:string) =>{
    if(e.key === 'Enter'){
      if(value.trim() === ''){
        handleChange(index , 'm2' , '')
      }else{
        const parsedValue = parseFloat(value)
        if(!Number.isNaN(parsedValue)){
          handleChange(index , 'm2' , value)
        }else{
          handleChange(index , 'm2' , '')
        }
      }
    }
  }

  const handleTotalBlur = (index: number, value: string) => {
    if(value.trim() === ''){
      handleTotalChange(index,'')
    }else{
      const formattedValue = formatTotal(value)
      const parsedValue = parseFloat(formattedValue)
      if(!isNaN(parsedValue)){
        handleTotalChange(index,formattedValue)
      }else{
        handleTotalChange(index , '')
      }
    }
  };
  
  const handleTotalKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number, value: string) => {
    if (event.key === 'Enter') {
      if(value.trim() === ''){
        handleTotalChange(index,'')
      }else{
        const formattedValue = formatTotal(value)
        const parsedValue = parseFloat(formattedValue)
        if(!isNaN(parsedValue)){
          handleTotalChange(index,formattedValue)
        }else{
          handleTotalChange(index , '')
        }
      }
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement | HTMLTableRowElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const updatedRows = [...calculations];
    const draggedRow = updatedRows.find((row) => row.id === draggedId);
    if (!draggedRow) return;
    const targetIndex = updatedRows.findIndex((row) => row.id === targetId);
    updatedRows.splice(updatedRows.indexOf(draggedRow), 1);
    updatedRows.splice(targetIndex, 0, draggedRow);
    setCalculations(updatedRows);
  };


  const meters = [
    {
      label:"NO.",
      clss:""
    },
    {
      label:"DESCRIPTION",
      clss:""
    },
    {
      label:"SIZE CM",
      clss:""
    },
    {
      label:"M2",
      clss:""
    },
    {
      label:"QUANTITY",
      clss:""
    },
    {
      label:"UNIT PRICE",
      clss:""
    },
    {
      label:"TOTAL",
      clss:""
    },
    {
      label:"ACTIONS",
      clss:""
    }
  ]

  

  const buttons = [
    {
      label:"RECEIPT",
      clss:`${form === 'quotation' ? "!hidden" : ""} bg-[#00BCD4] hover:bg-[#036080]`,
      type:"",
      func:()=>{
        if(edit){
          onUpdate({id:passingId,receip:'receipt'})
        }else{
          save('receipt')
        }
      }
    },
    {
      label:"PDF",
      clss:"bg-[#00BCD4] hover:bg-[#036080]",
      type:"inv",
      func:()=>{
        setPdf('pdf')
        setPrinting('invoice')
        setPrint(true)
      }
    },
    {
      label:"PDF",
      clss:"bg-[#00BCD4] hover:bg-[#036080]",
      type:"qty",
      func:()=>{
        setPdf('pdf')
        setPrinting('quotation')
        setPrint(true)
      }
    },
    {
      label:"PRINT",
      clss:"bg-[#00BCD4] hover:bg-[#036080]",
      type:"inv",
      func:()=>{
        setPdf('print')
        setPrinting('invoice')
        setPrint(true)
      }
    },
    {
      label:"PRINT",
      clss:"bg-[#00BCD4] hover:bg-[#036080]",
      type:"qty",
      func:()=>{
        setPdf('print')
        setPrinting('quotation')
        setPrint(true)
      }
    },
    {
      label:`${pending ? "Loading..." : "SAVE"}`,
      clss:`bg-[#024466] hover:bg-[#00BCD4] ${form === 'invoice' ? "!hidden" : ""}`,
      type:"quotation",
      func:()=>{
        if(edit){
          onUpdate1({id:passingId})
        }else{
          save1()
        }
      }
    },
    {
      label:`${pending ? "Loading..." : "SAVE"}`,
      clss:`bg-[#024466] hover:bg-[#00BCD4] ${form === 'quotation' ? "!hidden" : ""}`,
      type:"invoice",
      func:()=>{
        if(edit && routerSwitch === mode){
          onUpdate({id:passingId})
        }else{
          save()
        }
      } 
    },
    {
      label:"CANCEL",
      clss:`${form === 'quotation' ? "!hidden" : ""} bg-insomnia-primary hover:bg-[#E94043]`,
      type:"",
      func:()=>router.push('/invoice/table')
    },
    {
      label:"CANCEL",
      clss:`${form === 'invoice' ? "!hidden" : ""} bg-insomnia-primary hover:bg-[#E94043]`,
      type:"",
      func:()=>{
        router.push('/quotation/table')
      }
    }
  ]

  const onUpdate = async({id,receip}:{id:string , receip?:string}) =>{
    setPending(true)
    let validation = ''
    if(!cusName || !cusPhone){
      validation = "sorry this field is required"
      toast.error(validation)
      setPending(false)
    }else{
      try {
        const data = await editMeter({
          id,
          toggleName:toggleName,
          toggleComp:toggleComp,
          togglePhone:togglePhone,
          toggleEmail:toggleEmail,
          toggleAddr:toggleAddr,
          togglePo:togglePo,
          toggleLogo:logo,
          toggleBankInfo:bankInfo,
          toggleAddress:address,
          toggleSignature:signature,
          cusName1:cusName,
          cusComp,
          mode:routerSwitch,
          invCusPhone1:cusPhone,
          cusEmail,
          cusAddr,
          invNo,
          invPo,
          invStatus,
          invBus,
          invTitle,
          invStaff:staff,
          invDate,
          method:busType,
          invNote:note,
          items:calculations,
          partial,
          discount,
          noti:notification,
          customerId,
          enableNote:enableNote,
          total:parseFloat(calculateGrandTotal()),
          balance:parseFloat(calculateBalance())
        });

        if(data?.error){
          toast.error(data.error)
          setPending(false)
        }
        if(data?.success){
          await recentlyActivity({
            user:user.name,
            cust:cusName,
            route:'Invoice',
            action:'Updated',
            paperNo:invNo
          });
          toast.success("saving successfully")
          setPending(false)
          const receiptId = data?.id;
          if(receip === 'receipt'){
            setRec(receiptId)
            onCancel()
            router.push('/receipt/create')
          }else{
            router.push(`/${routerPush}/table`)
          }
        }
      } catch (error) {
        toast.error("something went wrong")
        setPending(false)
      }
    }
  }

  const onUpdate1 = async({id, convert}:{id:string , convert?:string}) =>{
    setPending(true)
    let validation = ''

    const formData = new FormData();

    if(image.img1){
      formData.append('img1',image.img1)
    }

    if(image.img2){
      formData.append('img2',image.img2)
    }

    if(!cusName || !cusPhone){
      validation = "sorry this field is required"
      toast.error(validation)
      setPending(false)
    }else{
      try{
        const data = await editQtMeter({
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
          cusName2:cusName,
          cusComp:cusComp,
          cusPhone2:cusPhone,
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
          qtStaff:staff,
          prodDes:des,
          items:calculations,
          method:busType,
          oldImg:oldImg,
          oldImg1:oldImg1,
          enableNote:enableNote,
          customerId,
          total:parseFloat(calculateGrandTotal()),
        },formData)
        setImage({
          img1:undefined,
          img2:undefined
        })
        if(data?.error){
          toast.error(data.error)
          setPending(false)
          
        }
        if(data?.success){
         await recentlyActivity({
            user:user.name,
            cust:cusName,
            route:'Quotation',
            action:'Updated',
            paperNo:invNo
          })
          toast.success("saving succesffully")
          setPending(false)
          const id = data?.id
          if(convert === 'convert'){
            setQtid(id)
            onCancel()
            setPassingId('')
            setSwitch('invoice')
            router.push(`/invoice/created`)
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

  const save = async(receip?:string) =>{
    setPending(true)
    let validation = ''
    if(!cusName || !cusPhone){
      validation = "sorry this field is required"
      toast.error(validation)
      setPending(false)
    }else{
      try{
        const data = await addMeter({
          toggleName:toggleName,
          toggleComp:toggleComp,
          togglePhone:togglePhone,
          toggleEmail:toggleEmail,
          toggleAddr:toggleAddr,
          togglePo:togglePo,
          toggleLogo:logo,
          toggleBankInfo:bankInfo,
          toggleAddress:address,
          toggleSignature:signature,
          cusName1:cusName,
          cusComp,
          mode:routerSwitch,
          invCusPhone1:cusPhone,
          cusEmail,
          cusAddr,
          invNo,
          invPo,
          invStatus,
          invBus,
          invTitle,
          invStaff:staff,
          invDate,
          method:busType,
          invNote:note,
          items:calculations,
          partial,
          discount,
          noti:notification,
          enableNote:enableNote,
          customerId,
          total:parseFloat(calculateGrandTotal()),
          balance:parseFloat(calculateBalance())
        })
          if(data?.error){
            toast.error(data.error)
            setPending(false)
          }
          if(data?.success){
            await recentlyActivity({
              user:user.name,
              cust:cusName,
              route:'Invoice',
              action:'Created',
              paperNo:invNo
            })
            toast.success("saving succesffully")
            setPending(false)
            const id = data?.id
            if(receip === 'receipt'){
              setRec(id)
              onCancel()
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

  const save1 = async(convert?:string) =>{
    setPending(true)
    let validation = ''

    const formData = new FormData();

    if(image.img1){
      formData.append('img1',image.img1)
    }

    if(image.img2){
      formData.append('img2',image.img2)
    }

    if(!cusName || !cusPhone){
      validation = 'sorry this field is required'
      toast.error(validation)
      setPending(false)
    }else{
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
            cusName2:cusName,
            cusComp:cusComp,
            cusPhone2:cusPhone,
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
            qtStaff:staff,
            prodDes:des,
            items:calculations,
            method:busType,
            enableNote:enableNote,
            customerId,
            total:parseFloat(calculateGrandTotal()),
          },formData)
          setImage({
            img1:undefined,
            img2:undefined
          })
          setImage({
            img1:undefined,
            img2:undefined
          })
          if(data?.error){
            toast.error(data.error)
            setPending(false)
          }
          if(data?.success){
            await recentlyActivity({
              user:user.name,
              cust:cusName,
              route:'Quotation',
              action:'Created',
              paperNo:invNo
            })
            toast.success("saving succesffully")
            setPending(false)
            const id = data?.id
            if(convert === 'convert'){
            setQtid(id)
            onCancel()
            setSwitch('invoice')
            setPassingId('')
            router.push(`/invoice/created`)
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

  const converting = () =>{
      if(edit){
        onUpdate1({id:passingId , convert:'convert'})
      }else{
        save1('convert')
      }
  }

  const handleImageSelection = (ref:React.RefObject<HTMLInputElement> , key: keyof quoteImage) =>{
    if(ref.current){
        ref.current.click()
    }
  }

  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement> , key:keyof quoteImage) =>{
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
  }

  return (
    <>
    <div className={`${busType === "meter" ? "block" : "hidden"} ${print === true ? "!hidden" : ""}`}>
      <div className={`overflow-x-auto mt-[20px] ${darkMode ? "bg-dark-box-color" : "bg-white"} p-[24px] rounded-lg shadow-md`}>
      <table className="w-full">
        <thead>
            <tr>
              {
                meters.map((item)=>{
                  return(
                    <th key={item.label} className={`${item.clss} ${darkMode ? "text-dark-lg-color" : "text-thead-primary" } py-2`}>
                      {item.label}
                    </th>
                  )
                })
              }
            </tr>
        </thead>
        
        <tbody>
        {calculations?.map((item, index) => (
        <tr key={index}
          onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item.id)}
            onDragStart={(e) => handleDragStart(e, item.id)}
        >
          <td className="py-2"
          >
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
              {index + 1}
            </div>
          </td>
          <td className=" px-[10px] py-2" >
            <input
              type="text"
              className={`${darkMode ? "text-dark-lg-color" : ""} lg:w-[400px] outline-none xl:w-[700px] 2xl:w-[900px] border px-2 py-1 bg-transparent border-input-primary rounded-md `}
              value={item.description}
              onClick={handleOnClick}
              onChange={(e) => {
                handleChange(index, 'description', e.target.value)
                setProductFilter(e.target.value)
              }}
              onFocus={()=>setFocus1(index)}
              onBlur={()=>{if(check === false){
                setFocus1(null)
              }}}
              onKeyDown={(event)=>handleKeyDown(event,index,'description')}
              placeholder='All'
              autoComplete='off'
            />
            <div className="absolute z-50">
              {
                focus1 === index && products.length !== 0 && (
                  <ul ref={ulRef} className=' rounded-md border-[1px] shadow-md bg-white p-4 w-full mt-2 max-h-[100px] overflow-auto' onMouseEnter={()=>setCheck(true)} onMouseLeave={()=>{setCheck(false) , setFocus1(null)}}>
                    {
                      products.filter(op => op.prodBus === invBus).map((op)=>{
                        return(
                                <li data-id={op.id} key={op.id} className={`cursor-pointer ${selectedItemId === op.id ? "bg-gray-200" : "bg-transparent" }`}   onClick={()=>{handleClickProducts(index , 'description' ,op.prodItemName , op.prodUnitPrice), setCheck(false) , setFocus1(null)}}>
                                  {op.prodItemName}
                                </li>
                        )
                      })
                    }
                  </ul>
                )
              }
            </div>
          </td>
          <td className="px-[10px] py-2">
            <div className="flex justify-center items-center border border-input-primary rounded-md">
            <input
              type="number"
              value={item.sizeWidth === 0 ? '' : item.sizeWidth}
              onChange={(e) => handleChange(index, 'sizeWidth', e.target.value)}
              className={`${darkMode ? "text-dark-lg-color" : ""}  px-2 py-1 lg:w-[70px] bg-transparent text-end outline-none xl:w-[80px]`}
            />
            <div className={`${darkMode ? "text-dark-lg-color" : ""} lg:mx-[10px] xl:mx-[20px] px-3 flex justify-center items-center py-1 bg-transparent `}>
              x
            </div>
            <input
              type="number"
              value={item.sizeHeight === 0 ? '' : item.sizeHeight}
              onChange={(e) => handleChange(index, 'sizeHeight', e.target.value)}
              className={`${darkMode ? "text-dark-lg-color" : ""} px-2 py-1 lg:w-[70px]  bg-transparent text-start outline-none xl:w-[80px]`}
            />
            </div>
          </td>
          <td className=" px-[10px] py-2">
            <input
              type="number"
              value={item.m2 === 0 || item.m2 === undefined ? '' : item.m2.toFixed(2)}
              onChange={(e) => handleChange(index , 'm2' , e.target.value)}
              onBlur={(e) => handleM2(e.target.value, index)}
              onKeyDown={(e) => handleM2Key(e, index , item.m2.toString())}
              className={`${darkMode ? "text-dark-lg-color" : ""} w-full text-center border px-2 py-1 bg-transparent border-input-primary rounded-md`}
            />
          </td>
          <td className=" px-[10px] py-2">
            <input
              type="text"
              value={item.quantity === '' ? '' : item.quantity}
              onChange={(e) => handleChange(index, 'quantity', e.target.value)}
              className={`${darkMode ? "text-dark-lg-color" : ""} w-full border text-center px-2 py-1 bg-transparent border-input-primary rounded-md`}
            />
            <div className="relative ">
            {
              focus === index && (
                <ul className="absolute z-50">
                  <li className="cursor-pointer" onClick={()=>handleLiClick(index , 'quantity' , item.quantity , 'pcs')}>pcs</li>
                  <li className="cursor-pointer" onClick={()=>handleLiClick(index , 'quantity' , item.quantity , 'unit')}>unit</li>
                </ul>
              )
            }
            </div>
          </td>
          <td className=" px-[10px] py-2">
            <input
              type="text"
              value={item.unitPrice === '' ? '' : item.unitPrice}
              onChange={(e) => handleChange(index, 'unitPrice', e.target.value)}
              onBlur={(e) => handleUnitPriceBlur(e.target.value, index)}
              onKeyDown={(e) => handleUnitPriceKeyDown(e, e.currentTarget.value, index)}
              className={`${darkMode ? "text-dark-lg-color" : ""} w-full text-center border px-2 py-1 bg-transparent border-input-primary rounded-md`}
            />
          </td>
          <td className=" px-[10px] py-2">
            <input
              type="text"
              value={item.total === '' ? '' : item.total}
              onBlur={(e) => handleTotalBlur(index, e.target.value)}
              onKeyDown={(e) => handleTotalKeyDown(e, index, item.total)}
              onChange={(e) => handleTotalChange(index, e.target.value)}
              className={`${darkMode ? "text-dark-lg-color" : ""} w-full text-center border px-2 py-1 bg-transparent border-input-primary rounded-md`}
            />
          </td>
          <td className=" px-[10px] py-2">
          <div className={`flex justify-center items-center gap-2`}>
            <button className={`${darkMode ? "text-blue-400" : "text-[#024466]"} p-1 rounded-md`} onClick={()=>handleCopy(item.description , item.sizeHeight , item.sizeHeight , item.m2 , item.quantity, item.unitPrice,item.total)}><PiCopySimpleLight size={25}/></button>
            <button className={`${darkMode ? "text-red-400" : "text-red-700"} p-1 rounded-md`} onClick={() => handleRemoveCalculation(index)}><PiTrashLight size={25}/></button>
          </div>
          </td>
        </tr>
      ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-[8px]">
      <div className="flex"> 
          <div className="px-[23px] invisible">
            1
          </div>
          <button onClick={handleAddCalculation} className={`${darkMode ? "text-dark-lg-color" : ""} ml-[10px] hover:bg-[#E94043] bg-insomnia-primary text-white rounded-md px-[45px] py-[5px] text-[18px] font-bold`}>Add</button>
      </div>
      <div className="flex items-center">
      <div className={`${darkMode ? "text-dark-lg-color" : ""} bg-insomnia-primary text-white rounded-md px-[20px] py-[5px] flex text-[18px] mr-[10px]`}>
        {
          form !== 'quotation' && (
            <>
            {
              invStatus === "partial" || !Number.isNaN(discount) && discount !== 0  ? (
                <>
                Balance: <p className="pl-[5px]  font-bold">${calculateBalance()}</p> 

                </>
              ) : <>
              
              </>
            }
            </>
          )
        }
        {
          partial !== undefined && (
            <>
            {
              invStatus === "partial" && (
                <>
                <div className="w-[2px] bg-insomnia-primary mx-1 h-auto"></div>
                Partial: <p className="pl-[5px]  font-bold">${isNaN(partial) ? 0.00 : partial.toFixed(2)}</p> 
                </>
              ) 
            }
            </>
          )
        }
        {
          discount !== undefined && (
            <>
            {
              !isNaN(discount) && discount !== 0 && (
                <>
                <div className="w-[2px] bg-insomnia-primary mx-1 h-auto"></div>
                Discount: <p className="pl-[5px]  font-bold">${isNaN(discount) ? 0.00 : discount.toFixed(2)}</p> 
                
                </>
              ) 
            }
            </>
          )
        }
        {
          form !== 'quotation' && (
            <>
            {
              invStatus === "partial" || !Number.isNaN(discount) && discount !== 0  ? (
                <div className="w-[2px] bg-insomnia-primary mx-1 h-auto"></div>
              ) : <>
              
              </>
            }
            </>
          )
        }
       
        Total: <p className="pl-[5px]  font-bold">${calculateGrandTotal()}</p>
      </div>
      <div className="px-[10px] py-2 invisible">
        <div className={`flex justify-center items-center gap-2`}>
              <button className={`${darkMode ? "text-blue-400" : "text-blue-700"}  p-1 rounded-md`}><PiCopySimpleLight size={25}/></button>
              <button className={`${darkMode ? "text-red-400" : "text-red-700"}  p-1 rounded-md`}><PiTrashLight size={25}/></button>
            </div>
        </div>
      </div>

      </div>
     
      </div>
       <div className="flex mt-[20px] justify-between">
    {
      enableNote === true ? (
       <div className="rounded-md">
        <h1 className="rounded-t-md text-white bg-insomnia-primary py-1 font-bold px-[24px]">NOTE</h1>
      <div className="py-1 px-[24px] bg-white rounded-b-md">
      <textarea className="w-[300px] outline-none" value={note} onChange={(e)=>setNote(e.target.value)}></textarea>
      </div>
     </div>
    ) : (
      <div>
      </div>
    )
  }
     <div className="flex gap-3">
      {
        form === "invoice" && (
          <button className="bg-[#00BCD4] hover:bg-[#036080] text-dark-lg-color h-[35px] px-2 font-bold text-[20px] w-[120px] rounded-md" onClick={()=>{
            setIcon(!icon)
            setSwitch(!icon ? 'invoice' : 'delivery')
          }}>{routerSwitch === 'delivery' ? "INVOICE" : "DELIVERY"}</button>
        )
      }
      {
        form === 'quotation' && (
          <>
          <button className={`bg-[#00BCD4] hover:bg-[#036080] text-dark-lg-color h-[35px] px-2 font-bold text-[20px] w-[120px] rounded-md`} onClick={()=>handleImageSelection(ref1,'img1' as keyof quoteImage)}>Artwork 1</button>
          <button className={`bg-[#00BCD4] hover:bg-[#036080] text-dark-lg-color h-[35px] px-2 font-bold text-[20px] w-[120px] rounded-md`} onClick={()=>handleImageSelection(ref2,'img2' as keyof quoteImage)}>Artwork 2</button>
          <button className={`bg-[#00BCD4] hover:bg-[#036080] text-dark-lg-color h-[35px] px-2 font-bold text-[20px] w-[120px] rounded-md`} onClick={converting}>CONVERT</button>
          </>
        )
      }
     {
            buttons.map((item)=>{
              return(
                <React.Fragment key={crypto.randomUUID()}>
                  {
                    item.label !== "PRINT" && item.label !== 'PDF' && item.label !== 'SAVE' ? (
                      <button className={`text-dark-lg-color h-[35px] px-2 font-bold text-[20px] w-[120px] rounded-md  ${item.clss}`} onClick={item.func} >{item.label}</button>
                    ) : (
                      <>
                      
                      {
                         item.type === 'qty' && form === 'quotation' && (
                         <button className={`text-dark-lg-color h-[35px] px-2 font-bold text-[20px] w-[120px] rounded-md  ${item.clss}`} onClick={item.func} >{item.label}</button>
                        )    
                      }
                      {
                        item.type === 'inv' && form === 'invoice' && (
                          <button className={`text-dark-lg-color h-[35px] px-2 font-bold text-[20px] w-[120px] rounded-md  ${item.clss}`} onClick={item.func} >{item.label}</button>
                        )
                      }
                      {
                        item.type === 'quotation' && form === 'quotation' && (
                          <button className={`text-dark-lg-color h-[35px] px-2 font-bold text-[20px] w-[120px] rounded-md  ${item.clss}`} onClick={item.func} >{edit ? "UPDATE" : item.label}</button>
                        )
                      }
                      {
                        item.type === 'invoice' && form === 'invoice' && (
                          <button className={` text-dark-lg-color h-[35px] px-2 font-bold text-[20px] w-[120px] rounded-md ${item.clss}`} onClick={item.func} >{edit && routerSwitch === mode ? "UPDATE" : item.label}</button>
                        )
                      }
                      </>
                    )
                  }
                </React.Fragment>
              )
            })
          }
     </div>
       </div>
    </div>
    {
      busType === 'meter' && (
        <>
        {
          printing === "quotation" && (
            <>
            <Option 
            customerId={customerId}
            staffName={staffName}
            staffPhone={staffPhone}
            staffTelegram={staffTelegram}
             busType={busType}
             toggleName={toggleName}
             toggleComp={toggleComp}
             togglePhone={togglePhone}
             toggleEmail={toggleEmail}
             toggleAddr={toggleAddr}
             toggleLogo={logo}
            toggleBankInfo={bankInfo}
            toggleAddress={address}
            toggleSignature={signature}
            cusName1={cusName}
            cusComp={cusComp}
            mode={routerSwitch}
            invCusPhone1={cusPhone}
            cusEmail={cusEmail}
            cusAddr={cusAddr}
            invNo={invNo}
            invStatus={invStatus}
            invBus={invBus}
            invTitle={invTitle}
            invStaff={staff}
            invDate={invDate}
            method={busType}
            invNote={note}
            items={calculations}
            total={parseFloat(calculateGrandTotal())}
            routerPush={routerPush}
             des={des}
             width={610}
             child={
              <QuotationForm
              setDes={setDes}
              des={des}
              toggleName={toggleName}
              toggleComp={toggleComp}
              staffName={staffName || ''}
              staffPhone={staffPhone || ''}
              togglePhone={togglePhone}
              toggleAddr={toggleAddr}
              oldImg1={oldImg1}
              oldImg={oldImg}
              busPayTerm={busPayTerm}
              img1={image.img1 ? URL.createObjectURL(image.img1) : ''}
              img2={image.img2 ? URL.createObjectURL(image.img2) : ''}
              toggleEmail={toggleEmail}
              busType={busType}
              items={calculations}
              busAddr={busAddr}
              busEmail={busEmail}
              busTelegram={busTelegram}
              busPhone={busPhone}
              busLogo={busLogo}
              sigLogo={sigLogo}
              invNo={invNo}
              cusName={cusName}
              cusComp={cusComp}
              busDes={bankdes}
              cusPhone={cusPhone}
              cusEmail={cusEmail}
              cusAddr={cusAddr}
              invDate={invDate}
              grandTotal={calculateGrandTotal()}/>
            } 
            printingChild={
              <Qtprint
              des={des}
              toggleName={toggleName}
              toggleComp={toggleComp}
              togglePhone={togglePhone}
              toggleAddr={toggleAddr}
              invNo={invNo}
              oldImg1={oldImg1}
              oldImg={oldImg}
              img1={image.img1 ? URL.createObjectURL(image.img1) : ''}
              img2={image.img2 ? URL.createObjectURL(image.img2) : ''}
              toggleEmail={toggleEmail}
              busDes={bankdes}
              staffName={staffName || ''}
              staffPhone={staffPhone || ''}
              busAddr={busAddr}
              busEmail={busEmail}
              busPayTerm={busPayTerm}
              busPhone={busPhone}
              busTelegram={busTelegram}
              busLogo={busLogo}
              sigLogo={sigLogo}
              busType={busType}
              items={calculations}
              cusName={cusName}
              cusComp={cusComp}
              cusPhone={cusPhone}
              cusEmail={cusEmail}
              cusAddr={cusAddr}
              invDate={invDate}
              grandTotal={calculateGrandTotal()}
              />
            }
            
            />
            </>
          ) 
        }
        {
          printing === 'invoice' &&(
            <>
            <Option width={610}
            customerId={customerId}
            busType={busType}
            toggleName={toggleName}
            toggleComp={toggleComp}
            togglePhone={togglePhone}
            toggleEmail={toggleEmail}
            toggleAddr={toggleAddr}
            togglePo={togglePo}
            toggleLogo={logo}
            toggleBankInfo={bankInfo}
            toggleAddress={address}
            toggleSignature={signature}
            cusName1={cusName}
            cusComp={cusComp}
            mode={routerSwitch}
            invCusPhone1={cusPhone}
            cusEmail={cusEmail}
            changeMode={mode}
            cusAddr={cusAddr}
            invNo={invNo}
            invPo={invPo}
            invStatus={invStatus}
            invBus={invBus}
            invTitle={invTitle}
            invStaff={staff}
            invDate={invDate}
            method={busType}
            invNote={note}
            items={calculations}
            partial={partial}
            discount={discount}
            total={parseFloat(calculateGrandTotal())}
            balance={parseFloat(calculateBalance())}
            routerPush={routerPush}
            child={<InvoiceForm
              toggleName={toggleName}
              toggleComp={toggleComp}
              togglePhone={togglePhone}
              toggleAddr={toggleAddr}
              toggleEmail={toggleEmail}
              togglePo={togglePo}
              busType={busType}
              items={calculations}
              busAddr={busAddr}
              busEmail={busEmail}
              busEng={busEng}
              busKh={busKh}
              busTelegram={busTelegram}
              busPhone={busPhone}
              abaName={abaName}
              abaNumber={abaNumber}
              invNo={invNo}
              busDes={busDes}
              cusName={cusName}
              cusComp={cusComp}
              bankdes={bankdes}
              cusPhone={cusPhone}
              cusEmail={cusEmail}
              busLogo={busLogo}
              abaLogo={abaQr}
              sigLogo={sigLogo}
              cusAddr={cusAddr}
              invPo={invPo}
              invDate={invDate}
              invStatus={invStatus}
              partial={partial === undefined ? 0.00 : partial}
              discount={discount === undefined ? 0.00 : discount}
              grandTotal={calculateGrandTotal()}
              balance={calculateBalance()}
              />}
              printingChild={
                <Invprint
                toggleName={toggleName}
                toggleComp={toggleComp}
                togglePhone={togglePhone}
                toggleAddr={toggleAddr}
                toggleEmail={toggleEmail}
                togglePo={togglePo}
                busType={busType}
                busDes={busDes}
                items={calculations}
                abaName={abaName}
                abaNumber={abaNumber}
                busInvEng={busEng}
                busInvkh={busKh}
                busLogo={busLogo}
                busAddr={busAddr}
                busEmail={busEmail}
                busPhone={busPhone}
                busTelegram={busTelegram}
                bankdes={bankdes}
                abaLogo={abaQr}
                sigLogo={sigLogo}
                invNo={invNo}
                cusName={cusName}
                cusComp={cusComp}
                cusPhone={cusPhone}
                cusEmail={cusEmail}
                cusAddr={cusAddr}
                invPo={invPo}
                invDate={invDate}
                invStatus={invStatus}
                partial={partial === undefined ? 0.00 : partial}
                discount={discount === undefined ? 0.00 : discount}
                grandTotal={calculateGrandTotal()}
                balance={calculateBalance()}
                />
              }
            />
                 

              
            </>
          )
        }
        </>
      )
    }
     <input type="file"  ref={ref1} className='hidden' name='img1' onChange={(e)=>handleImageChange(e,'img1')}/>
    <input type="file" ref={ref2} className='hidden' name='img2' onChange={(e)=>handleImageChange(e,'img2')}/>
    <input type="text" className="hidden" value={oldImg === '' ? 'empty' : oldImg}/>
    <input type="text" className="hidden" value={oldImg1 === '' ? 'empty' : oldImg1}/>
    </>
  );
};

export default Meters;


