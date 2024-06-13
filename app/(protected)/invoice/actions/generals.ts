"use server"
import { prisma } from "@/lib/db/prisma";

type arr  = {
    id?:string;
    description: string;
    quantity: string;
    unitPrice: string;
    total: string;
}


type invoiceProps = {
 id?:string;
 ////toggle name 
 noti?:boolean;
 enableNote?:boolean;
 toggleName?:boolean;
 toggleComp?:boolean;
 togglePhone?:boolean;
 toggleEmail?:boolean;
 toggleAddr?:boolean;
 togglePo?:boolean;
 ///// -------------- /////
 toggleLogo?:boolean;
 toggleBankInfo?:boolean;
 toggleAddress?:boolean;
 toggleSignature?:boolean;
 ////toggle name
 cusName1:string;
 cusComp?:string;
 invCusPhone1?:string;
 cusEmail?:string;
 cusAddr?:string;
 invNo?:string;
 invPo?:string;
 invNote?:string;
 invBus?:string;
 invTitle?:string;
 mode?:string;
 invStaff:string[];
 invStatus?:string;
 invDate?:string;
 items?:arr[];
 partial?:number;
 method?:string;
 discount?:number;
 total?:number;
 balance?:number;
 customerId:string
}

function isArrValid(item: arr): boolean {
    return !!item.description && !!item.total;
}

export const addGeneral = async ({
    /////// toggle stuff
    toggleName,
    toggleComp,
    togglePhone,
    toggleEmail,
    toggleAddr,
    togglePo,
    ///////-----///////
    toggleLogo,
    toggleBankInfo,
    toggleAddress,
    toggleSignature,
    /////// toggle stuff
    cusName1,
    cusComp,
    invCusPhone1,
    cusEmail,
    cusAddr,
    invNo,
    invPo,
    mode,
    invStatus,
    invBus,
    invTitle,
    invStaff,
    invDate,
    method,
    invNote,
    items,
    partial,
    discount,
    total,
    balance,
    noti,
    enableNote,
    customerId
}:invoiceProps) =>{
    const isValid = items?.every(item => isArrValid(item));
    if(!isValid){
        console.log(isValid)
        return {error:"all array of the object must not be empty"}
    }
    if(!cusName1){
        return {error:"customer name is required!"}
    }
    if(!invBus){
        return {error:"business is required!"}
    }
    if(!invNo){
        return {error:"invoice id number is missing make sure it the number start with Inv-000000"}
    }
    if(items?.length === 0){
        return {error:"sorry u cant save this invoice without adding some item"}
    }

    const creatcustomer = await prisma.customer.update({
        where:{
            id:customerId
        },
        data:{
            cusName:cusName1,
            cusPhone1:invCusPhone1,
            cusComp,
            cusEmail,
            cusAddr
        }
    })

    const datas = await prisma.invoice.create({
        data:{
            /////// toggle stuff
            toggleName,
            toggleComp,
            togglePhone,
            toggleEmail,
            toggleAddr,
            togglePo,
            ///////-----///////
            toggleLogo,
            toggleBankInfo,
            toggleAddress,
            toggleSignature,
            /////// toggle stuff
            invNo,
            invPo,
            mode,
            invTitle,
            invDate,
            invBus,
            invStatus,
            invStaff,
            invNote,
            items,
            partial,
            method,
            discount,
            total,
            balance,
            noti,
            enableNote,
            customerId
        }
    })
    if(datas && creatcustomer){
        return {success:"updated! invoice" , id: datas.id}
    }
}



export const editGeneral = async ({
    id,
    /////// toggle stuff
    toggleName,
    toggleComp,
    togglePhone,
    toggleEmail,
    toggleAddr,
    togglePo,
    ///////-----///////
    toggleLogo,
    toggleBankInfo,
    toggleAddress,
    toggleSignature,
    /////// toggle stuff
    cusName1,
    cusComp,
    invCusPhone1,
    cusEmail,
    cusAddr,
    invNo,
    invPo,
    invStatus,
    invBus,
    invTitle,
    invStaff,
    invDate,
    method,
    invNote,
    items,
    partial,
    discount,
    total,
    balance,
    noti,
    enableNote,
    customerId
}:invoiceProps) =>{
    const isValid = items?.every(item => isArrValid(item));
    if(!isValid){
        return {error:"all array of the object must not be empty"}
    }
    if(!cusName1){
        return {error:"customer name is required!"}
    }
    if(!invBus){
        return {error:"business is required!"}
    }
    if(!invNo){
        return {error:"invoice id number is missing make sure it the number start with Inv-000000"}
    }
    if(items?.length === 0){
        return {error:"sorry u cant save this invoice without adding some item"}
    }

    const creatcustomer = await prisma.customer.update({
        where:{
            id:customerId
        },
        data:{
            cusName:cusName1,
            cusPhone1:invCusPhone1,
            cusEmail,
            cusComp,
            cusAddr
        }
    })

    const datas = await prisma.invoice.update({
        where:{
            id
        },
        data:{
            /////// toggle stuff
            toggleName,
            toggleComp,
            togglePhone,
            toggleEmail,
            toggleAddr,
            togglePo,
            ///////-----///////
            toggleLogo,
            toggleBankInfo,
            toggleAddress,
            toggleSignature,
            /////// toggle stuff
            invNo,
            invPo,
            invTitle,
            invDate,
            invBus,
            invStatus,
            invStaff,
            invNote,
            items,
            partial,
            method,
            discount,
            total,
            balance,
            noti,
            enableNote,
            customerId
        }
    })
    if(datas && creatcustomer){
        return {success:"updated! invoice" , id: datas.id}
    }
}

export const deleteInv = async(id:string)=>{
    if(!id){
        return {error:"error!"}
    }
    await prisma.invoice.delete({
        where:{
            id
        }
    })
    return {success:"invoice delete successful!"}
}