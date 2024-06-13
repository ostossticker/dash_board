"use server"

import { prisma } from "@/lib/db/prisma";

type customerProps ={
    id?:string
    cusName:string;
    cusTelegram?:string;
    cusBus?:string;
    cusPhone1?:string;
    cusPhone2?:string;
    cusComp?:string;
    cusMember:string;
    cusEmail?:string
    cusAddr?:string;
    cusWebsite?:string;
}

export const addCustomer = async ({
    cusName,
    cusTelegram,
    cusBus,
    cusPhone1,
    cusPhone2,
    cusComp,
    cusMember,
    cusEmail,
    cusAddr,
    cusWebsite
}:customerProps) =>{
 if(!cusName){
    return {error:"customer name is required!"}
 }else if(!cusBus){
    return {error:"address is required!"}
 }
 await prisma.customer.create({
    data:{
        cusName,
        cusTelegram,
        cusBus,
        cusPhone1,
        cusPhone2,
        cusComp,
        cusMember,
        cusEmail,
        cusAddr,
        cusWebsite
    }
 })
 return {success:"created customer!"}
}

export const deleteCustomer = async (id:string) =>{
    if(!id){
        return {error:"pls refresh the page or try again"}
    }
    await prisma.customer.delete({
        where:{
            id
        }
    })
    return {success:"deleted operation success !"}
}

export const editCustomer = async (
    {
        id,
        cusName,
        cusTelegram,
        cusBus,
        cusPhone1,
        cusPhone2,
        cusComp,
        cusMember,
        cusEmail,
        cusAddr,
        cusWebsite
    }:customerProps
) =>{
    if(!id){
        return {error: "please refresh the page or try it again"}
    }else if(!cusName){
        return {error:"customer name is required!"}
     }else if(!cusBus){
        return {error:"address is required!"}
     }
     await prisma.customer.update({
        where:{
            id
        }, 
        data:{
            cusName,
            cusTelegram,
            cusBus,
            cusPhone1,
            cusPhone2,
            cusComp,
            cusMember,
            cusEmail,
            cusAddr,
            cusWebsite
        }
     })
     return {success:"updated! customer"}
}