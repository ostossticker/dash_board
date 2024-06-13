"use server"

import { prisma } from "@/lib/db/prisma";
import { error } from "console";

type recProps = {
    id?:string;
    datee?:string;
    recFrom?:string;
    payOf?:string;
    check?:string;
    usd?:number;
    recNo?:string;
    recBus?:string;
    updateDate?:string;
}

export const handleReceipt =  async ({datee , recBus , recFrom , payOf , check , usd , recNo}:recProps) =>{
    if(!recFrom){
        return {error: "received from must not be empty"}
    }
    if(!recBus){
        return {error: "business must not be empty"}
    }
    if(!payOf){
        return {error:"for payment of is required!"}
    }
    if(!usd){
        return {error: "you haven't giving a value of USD"}
    }
    if(!recNo){
        return {error:"receipt id number is missing make sure it the number start with Rec-000000"}
    }
    await prisma.receipt.create({
        data:{
            date:datee,
            recFrom,
            payOf,
            usd,
            recNo,
            check,
            recBus,
            updateDate:datee
        }
    })
    return {success:"receipt has been created!"}
}

export const handleEditRec = async ({id , updateDate ,datee ,recBus , recFrom , payOf, check ,usd , recNo}:recProps) =>{
    if(!recFrom){
        return {error: "received from must not be empty"}
    }
    if(!recBus){
        return {error: "business must not be empty"}
    }
    if(!payOf){
        return {error:"for payment of is required!"}
    }
    if(!usd){
        return {error: "you haven't giving a value of USD"}
    }
    if(!recNo){
        return {error:"receipt id number is missing make sure it the number start with Rec-000000"}
    }
    await prisma.receipt.update({
        where:{
            id
        },
        data:{
            date:datee,
            recFrom,
            payOf,
            usd,
            recNo,
            check,
            recBus,
            updateDate
        }
    })
    return {success:"receipt has been updated!"}
}

export const deleteRec = async (id:string) =>{
    if(!id){
        return {error : "error!"}
    }
    await prisma.receipt.delete({
        where:{
            id
        }
    })
    return {success:"receipt deleted permenently deleted!"}
}

export const softDelete = async(id:string) =>{
    const now = new Date()
    if(!id){
        return {error :"sorry error!"}
    }
    await prisma.receipt.update({
        where:{
            id
        },
        data:{
            deletedAt:now
        }
    })
    return {success:"receipt deleted successful!"}
}


export const restoringRec = async(id:string) =>{
    if(!id){
        return {error :"sorry error!"}
    }
    await prisma.receipt.update({
        where:{
            id
        },
        data:{
            deletedAt:null
        }
    })
    return {success:"receipt restore successful!"}
}