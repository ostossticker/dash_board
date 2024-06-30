"use server"
import { prisma } from "@/lib/db/prisma";
import { error } from "console";

type arr  = {
    id?:string;
    description: string;
    sizeWidth: number;
    sizeHeight: number;
    quantity: string;
    unitPrice: string;
    m2: number;
    total: string;
}


type invoiceProps = {
 id?:string;
 noti?:boolean;
 enableNote?:boolean;
 ////toggle name 
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
 mode?:string;
 invNote?:string;
 invBus?:string;
 invTitle?:string;
 invStaff:string[];
 invStatus?:string;
 invDate?:string;
 items?:arr[];
 partial?:number;
 method?:string;
 discount?:number;
 total?:number;
 balance?:number;
}

function isArrValid(item: arr): boolean {
    return !!item.description && !!item.total;
}

export const addMeter = async ({
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
    mode,
    partial,
    discount,
    total,
    balance,
    noti,
    enableNote
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

     

    const datas =  await prisma.invoice.create({
        data:{
            /////// toggle stuff
            toggleName,
            toggleComp,
            togglePhone,
            toggleEmail,
            toggleAddr,
            togglePo,
            ///////-----///////
            invCusAddr:cusAddr,
            invCusComp:cusComp,
            invCusName:cusName1,
            invCusEmail:cusEmail,
            invCusPhone:invCusPhone1, 
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
        }
    })
    if(datas ){
        return {success:"add! invoice" , id: datas.id}
    }
    
}



export const editMeter = async ({
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
    enableNote
}:invoiceProps) =>{
    const isValid = items?.every(item => isArrValid(item));
    if(!isValid){
        return {error:"description and total of items field must not empty []"}
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
            invCusAddr:cusAddr,
            invCusComp:cusComp,
            invCusName:cusName1,
            invCusEmail:cusEmail,
            invCusPhone:invCusPhone1, 
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
        }
    })
    if(datas){
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
    return {success:"invoice delete permanently successful!"}
}

export const softDelete = async(id:string) =>{
    const now = new Date()
    if(!id){
        return {error :"sorry error!"}
    }
    await prisma.invoice.update({
        where:{
            id
        },
        data:{
            deletedAt:now
        }
    })
    return {success:"invoice deleted successful!"}
}

export const restoringInv = async(id:string) =>{
    if(!id){
        return {error :"sorry error!"}
    }
    await prisma.invoice.update({
        where:{
            id
        },
        data:{
            deletedAt:null
        }
    })
    return {success:"invoice restore successful!"}
}