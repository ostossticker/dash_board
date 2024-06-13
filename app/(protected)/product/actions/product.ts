"use server"

import { prisma } from "@/lib/db/prisma";

type productProps = {
    id?:string;
    prodItemName:string;
    prodUnitPrice:string;
    prodBus:string;
    prodSince:string;
    proditemDes?:string;
    prodBusType:string;
}

export const addProduct = async ({
    prodItemName,
    prodUnitPrice,
    prodBus,
    prodSince,
    proditemDes,
    prodBusType
}:productProps) =>{
    if(!prodItemName){
        return {error : "u forgot to giving an item a name"}
    }else if(!prodBus){
        return {error:"product bussiness is missing"}
    }else if (!proditemDes){
        return {error:"product item description is required!"}
    }
    await prisma.product.create({
        data:{
            prodItemName,
            prodUnitPrice:parseFloat(prodUnitPrice.replace(/\$/g, '')),
            prodBus,
            prodSince,
            proditemDes,
            prodBusType
        }
    })
    return {success:"product was created!"}
}

export const deleteProduct = async (id:string) =>{
    if(!id){
        return {error : "please refresh the page or try again"}
    }
    await prisma.product.delete({
        where:{
            id
        }
    })
    return {success:"product created!"}
}

export const editProduct = async (
    {
        id,
        prodItemName,
        prodUnitPrice,
        prodBus,
        prodSince,
        proditemDes,
        prodBusType
    }:productProps
) =>{
    if(!id){
        return {error : "please refresh the page or try again"}
    }else if(!prodItemName){
        return {error : "u forgot to giving an item a name"}
    }else if(!prodBus){
        return {error:"product bussiness is missing"}
    }else if (!proditemDes){
        return {error:"product item description is required!"}
    }
    await prisma.product.update({
        where:{
            id
        },
        data:{
            prodItemName,
            prodUnitPrice:parseFloat(prodUnitPrice.replace(/\$/g, '')),
            prodBus,
            prodSince,
            proditemDes,
            prodBusType
        }
    })
    return {success:"updated! product"}
}