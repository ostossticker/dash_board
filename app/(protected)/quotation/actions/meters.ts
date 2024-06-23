"use server"

import { prisma } from "@/lib/db/prisma";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { writeFile } from "fs/promises";
import path, { join } from "path";

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

type des ={
    id?:string;
    text:string;
}


type quotationProps = {
    id?:string;
    toggleName?:boolean;
    toggleComp?:boolean;
    togglePhone?:boolean;
    toggleEmail?:boolean;
    toggleAddr?:boolean;
    toggleLogo?:boolean;
    toggleBankInfo?:boolean;
    toggleAddress?:boolean;
    toggleSignature?:boolean;
    toggleEmployee?:boolean;
    cusName2?:string;
    cusComp?:string;
    cusPhone2?:string;
    cusEmail?:string;
    cusAddr?:string;
    staffName?:string;
    staffPhone?:string;
    staffTelegram?:string;
    qtNo?:string;
    qtTitle?:string;
    qtDate?:string;
    qtBus?:string;
    qtStaff?:string[]
    prodDes?:des[]
    items?:arr[];
    method?:string;
    total?:number;
    oldImg?:string;
    oldImg1?:string;
    enableNote?:boolean;
}

function isArrValid(item: arr): boolean {
    return !!item.description && !!item.total;
}


const region = process.env.AWS_S3_REGION as string
const access_key = process.env.AWS_S3_ACCESS_KEY as string
const secretKey = process.env.AWS_S3_SECRET_KEY as string

if(!region || !access_key || !secretKey ){
    console.log('error missing requirement')
}

const s3Client = new S3Client({
    region:region,
    credentials:{
        accessKeyId:access_key,
        secretAccessKey:secretKey
    }
})

async function deleteObjectFromS3(bucket:string, key:string){
    const params = {
        Bucket:bucket,
        Key:key
    }
    try{
        const command = new DeleteObjectCommand(params)
        await s3Client.send(command)
    }catch(error){
        console.error('Error deleting old file from S3:', error);
      throw error;
    }
}

const uploadToS3 = async ({fileBuffer , key , file} : { fileBuffer: Buffer, key: string, file: File }) =>{
    try{
      const uploadParams = {
        Bucket:'ostoss3',
        Key:key,
        Body:fileBuffer,
        ContentType:file.type
      }
      const command = new PutObjectCommand(uploadParams)
      await s3Client.send(command)

    }catch(error){
      console.error("Error uploading to S3:", error);
      throw new Error("Error uploading image to S3.");
    }
}

export const addQtMeter = async({
    toggleName,
    toggleComp,
    togglePhone,
    toggleEmail,
    toggleAddr,
    toggleLogo,
    toggleBankInfo,
    toggleAddress,
    toggleSignature,
    toggleEmployee,
    cusName2,
    cusComp,
    cusPhone2,
    cusEmail,
    cusAddr,
    staffName,
    staffPhone,
    staffTelegram,
    qtNo,
    qtTitle,
    qtDate,
    qtBus,
    qtStaff,
    prodDes,
    items,
    method,
    enableNote,
    total
}:quotationProps,data:FormData) =>{
    const file:File | null = data.get('img1') as unknown as File
    const file1:File | null = data.get('img2') as unknown as File

    let path = ''
    let path1 = ''

    if(!file){
        console.log("image not founded")
    }else{
        const bucketName = 'ostoss3'
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        ///path = join('public','quotation',Date.now() + file.name)
        ///await writeFile(path,buffer)
        const s3Key = `quotation/${Date.now()}-${file.name}`
        await uploadToS3({fileBuffer:buffer , key:s3Key , file:file})
        path = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`
        console.log(`open ${path} to see the uploaded file`)
    }

    if(!file1){
        console.log("image1 not founded")
    }else{
        const bucketName = 'ostoss3'
        const byte1 = await file1.arrayBuffer()
        const buffer = Buffer.from(byte1)
        
        const s3key1 = `quotation/${Date.now}-${file1.name}`
        await uploadToS3({fileBuffer:buffer , key:s3key1 , file:file1})
        path1 = `https://${bucketName}.s3.${region}.amazonaws.com/${s3key1}`
        console.log(`open ${path1} to see the uploaded file`)
    }
    const isValid = items?.every(item => isArrValid(item));
    if(!isValid){
        return {error:"all array of the object must not be empty"}
    }
    if(!cusName2){
        return {error:"customer name is required!"}
    }
    if(!staffName && !staffPhone){
        return {error:"sorry staff username and staff phone number is required!"}
    }
    if(!qtBus){
        return {error:"quotation business is required!"}
    }
    if(!qtNo){
        return {error:"quotation id number is missing make sure it the number start with Qt-000000"}
    }
    if(items?.length === 0){
        return {error:"sorry u cant save this quotation without adding some item"}
    }
   const datas = await prisma.quotation.create({
        data:{
            toggleName,
            toggleComp,
            togglePhone,
            toggleEmail,
            toggleAddr,
            toggleLogo,
            toggleBankInfo,
            toggleAddress,
            toggleSignature,
            toggleEmployee,
            staffName,
            staffPhone,
            staffTelegram,
            qtNo,
            qtTitle,
            qtDate,
            qtBus,
            qtStaff,
            prodDes,
            items,
            method,
            total,
            enableNote,
            qtImage1:!file ? null : path,
            qtImage2:!file1 ? null : path1
        }
    })
    if(datas){
        return {success:"add quotation!" , id: datas.id}
    }
}

export const editQtMeter = async ({
            id,
            toggleName,
            toggleComp,
            togglePhone,
            toggleEmail,
            toggleAddr,
            toggleLogo,
            toggleBankInfo,
            toggleAddress,
            toggleSignature,
            toggleEmployee,
            cusName2,
            cusComp,
            cusPhone2,
            cusEmail,
            cusAddr,
            staffName,
            staffPhone,
            staffTelegram,
            qtNo,
            qtTitle,
            qtDate,
            qtBus,
            qtStaff,
            prodDes,
            items,
            method,
            total,
            oldImg1,
            enableNote,
            oldImg
}:quotationProps,data:FormData)=>{
    const file:File | null = data.get('img1') as unknown as File
    const file1:File | null = data.get('img2') as unknown as File

    let path = ''
    let path1 = ''

    if(!file){
        console.log("image not founded")
    }else{
        if(oldImg){
            const result = oldImg.substring(oldImg.indexOf("quotation"))
            await deleteObjectFromS3('ostoss3',result)
        }
        const bucketName = 'ostoss3'
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        ///path = join('public','quotation',Date.now() + file.name)
        ///await writeFile(path,buffer)
        const s3Key = `quotation/${Date.now()}-${file.name}`
        await uploadToS3({fileBuffer:buffer , key:s3Key , file:file})
        path = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`
        console.log(`open ${path} to see the uploaded file`)
    }

    if(!file1){
        console.log("image1 not founded")
    }else{
        if(oldImg1){
            const result = oldImg1.substring(oldImg1.indexOf("quotation"))
            await deleteObjectFromS3('ostoss3',result)
        }
        const bucketName = 'ostoss3'
        const byte1 = await file1.arrayBuffer()
        const buffer = Buffer.from(byte1)
        
        const s3key1 = `quotation/${Date.now}-${file1.name}`
        await uploadToS3({fileBuffer:buffer , key:s3key1 , file:file1})
        path1 = `https://${bucketName}.s3.${region}.amazonaws.com/${s3key1}`
        console.log(`open ${path1} to see the uploaded file`)
    }
    const isValid = items?.every(item => isArrValid(item));
    if(!isValid){
        return {error:"all array of the object must not be empty"}
    }
    if(!cusName2){
        return {error:"customer name is required!"}
    }
    if(!staffName && !staffPhone){
        return {error:"sorry staff username and staff phone number is required!"}
    }
    if(!qtBus){
        return {error:"quotation business is required!"}
    }
    if(!qtNo){
        return {error:"quotation id number is missing make sure it the number start with Qt-000000"}
    }
    if(items?.length === 0){
        return {error:"sorry u cant save this quotation without adding some item"}
    }
   const datas = await prisma.quotation.update({
        where:{
            id
        },
        data:{
            toggleName,
            toggleComp,
            togglePhone,
            toggleEmail,
            toggleAddr,
            toggleLogo,
            toggleBankInfo,
            toggleAddress,
            toggleSignature,
            toggleEmployee,
            staffName,
            staffPhone,
            staffTelegram,
            qtNo,
            qtTitle,
            qtDate,
            qtBus,
            qtStaff,
            prodDes,
            items,
            method,
            total,
            enableNote,
            qtImage1:!file ? oldImg : path,
            qtImage2:!file1 ? oldImg1 : path1
        }
    })
    if(datas){
        return {success:"updated quotation!" , id: datas.id}
    }
}

export const deleteQt = async (id:string , oldImg:string , oldImg1:string) =>{
    if(!id){
        return {error:"error!"}
    }
    if(oldImg){
        const result = oldImg.substring(oldImg.indexOf("quotation"))
        await deleteObjectFromS3('ostoss3',result)
    }
    if(oldImg1){
        const result = oldImg1.substring(oldImg1.indexOf("quotation"))
        await deleteObjectFromS3('ostoss3',result)
    }
    await prisma.quotation.delete({
        where:{
            id
        }
    })
    return {success:"quotation delete permanently successful!"}
}

export const softDelete = async(id:string) =>{
    const now = new Date()
    if(!id){
        return {error :"sorry error!"}
    }
    await prisma.quotation.update({
        where:{
            id
        },
        data:{
            deletedAt:now
        }
    })
    return {success:"quotation deleted successful!"}
}

export const restoringQt = async(id:string) =>{
    if(!id){
        return {error :"sorry error!"}
    }
    await prisma.quotation.update({
        where:{
            id
        },
        data:{
            deletedAt:null
        }
    })
    return {success:"quotation restore successful!"}
}