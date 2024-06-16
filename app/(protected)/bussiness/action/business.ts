"use server"

import { prisma } from "@/lib/db/prisma";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

type businessProps = {
    id?:string;
    busName:string;
    busEmail:string;
    busType:string;
    busAddr?:string;
    busPhone1?:string;
    busPhone2?:string;
    busTelegram?:string;
    busDes?:string;
    busInvkh?:string;
    busInvEng?:string;
    busBankName?:string;
    busBankNumber?:string;
    busBankDes?:string;
    busPayTerm?:string;
    oldImg?:string;
    oldImg1?:string;
    oldImg2?:string;
    oldImg3?:string;
    
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
        console.log('Deleted old file from S3:', key);
    }catch(error){
        console.error('Error deleting old file from S3:', error);
      throw error;
    }
}

const uploadToS3 = async ({fileBuffer , key , file} : { fileBuffer: Buffer, key: string, file: File }) =>{
    try{
      const uploadParams = {
        Bucket:'ostospos',
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

export const addBus = async ({
    busName,
    busEmail,
    busType,
    busAddr,
    busPhone1,
    busPhone2,
    busTelegram,
    busDes,
    busInvkh,
    busInvEng,
    busBankName,
    busBankNumber,
    busBankDes,
    busPayTerm
}:businessProps,data:FormData) =>{
    const file: File | null = data.get('abaQr') as unknown as File
    const file1: File | null = data.get('signature') as unknown as File
    const file2: File | null = data.get('busLogo') as unknown as File
    const file3: File | null = data.get('Rec1') as unknown as File

    let path = ''
    let path1 = ''
    let path2 = ''
    let path3 = ''
    
    if(!file){
        console.log("image not founded")
    }else{
        const bucketName = 'ostospos'
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const s3Key  = `business/${Date.now()}-${file.name}`
        await uploadToS3({fileBuffer:buffer , key:s3Key , file:file})
        path = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`
        console.log(`open ${path} to see the uploaded file`)
    }

    if(!file1){
        console.log("image1 not founded")
    }else{
        const bucketName = 'ostospos'
        const byte1 = await file1.arrayBuffer()
        const buffer = Buffer.from(byte1)

        const s3Key1 = `business/${Date.now()}-${file1.name}`
        await uploadToS3({fileBuffer:buffer , key:s3Key1 , file:file1})
        path1 = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key1}`
        console.log(`open ${path} to see the uploaded file`)
    }

    if(!file2){
        console.log("image2 not founded")
    }else{
        const bucketName = 'ostospos'
        const bytes2 = await file2.arrayBuffer()
        const buffer = Buffer.from(bytes2)

        const s3key2 = `business/${Date.now()}-${file2.name}`
        await uploadToS3({fileBuffer:buffer , key:s3key2 , file:file2})
        path2 = `https://${bucketName}.s3.${region}.amazonaws.com/${s3key2}`
        console.log(`open ${path} to see the uploaded file`)
    }

    if(!file3){
        console.log("image3 not founded")
    }else{
        const bucketName = 'ostospos'
        const bytes3 = await file3.arrayBuffer()
        const buffer = Buffer.from(bytes3);

        const s3key3 = `business/${Date.now()}-${file3.name}`
        await uploadToS3({fileBuffer:buffer , key:s3key3 , file:file3})
        path3 = `https://${bucketName}.s3.${region}.amazonaws.com/${s3key3}`
        console.log(`open ${path} to see the uploaded file`)
    }

    const user = await prisma.business.findUnique({
        where:{
            busName
        }
    })
    if(user){
        return {error:"this business name is already exist!"}
    }else if(!busName){
        return {error:"sorry business name is required!"}
    }else if (!busType){
        return {error:"sorry business type is required!"}
    }else if (!busPhone1){
        return {error:"phone number 1 is required!"}
    }
    await prisma.business.create({
        data:{
            busName,
            busEmail,
            busType,
            busAddr,
            busPhone1,
            busPhone2,
            busTelegram,
            busDes,
            busInvkh,
            busInvEng,
            busBankName,
            busBankNumber,
            busBankDes,
            busPayTerm,
            abaQr:!file ? null : path,
            signature:!file1 ? null : path1,
            busLogo:!file2 ? null : path2,
            Rec1:!file3 ? null : path3,
        }
    })
    return {success:"created business!"}
}


export const editBusiness = async ({
    id,
    busName,
    busEmail,
    busType,
    busAddr,
    busPhone1,
    busPhone2,
    busTelegram,
    busDes,
    busInvkh,
    busInvEng,
    busBankName,
    busBankNumber,
    busBankDes,
    busPayTerm,
    oldImg,
    oldImg1,
    oldImg2,
    oldImg3
}:businessProps,data:FormData) =>{
    const file: File | null = data.get('abaQr') as unknown as File
    const file1: File | null = data.get('signature') as unknown as File
    const file2: File | null = data.get('busLogo') as unknown as File
    const file3: File | null = data.get('Rec1') as unknown as File

    let path = ''
    let path1 = ''
    let path2 = ''
    let path3 = ''
    
    if(!file){
        console.log("image not founded")
    }else{
        if(oldImg){
            const result = oldImg.substring(oldImg.indexOf("business"))
            await deleteObjectFromS3('ostospos',result)
        }
        const bucketName = 'ostospos'
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const s3Key  = `business/${Date.now()}-${file.name}`
        await uploadToS3({fileBuffer:buffer , key:s3Key , file:file})
        path = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`
        console.log(`open ${path} to see the uploaded file`)
    }

    if(!file1){
        console.log("image1 not founded")
    }else{
        if(oldImg1){
            const result = oldImg1.substring(oldImg1.indexOf("business"))
            await deleteObjectFromS3('ostospos',result)
        }
        const bucketName = 'ostospos'
        const byte1 = await file1.arrayBuffer()
        const buffer = Buffer.from(byte1)

        const s3Key1 = `business/${Date.now()}-${file1.name}`
        await uploadToS3({fileBuffer:buffer , key:s3Key1 , file:file1})
        path1 = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key1}`
        console.log(`open ${path} to see the uploaded file`)
    }

    if(!file2){
        console.log("image2 not founded")
    }else{
        if(oldImg2){
            const result = oldImg2.substring(oldImg2.indexOf("business"))
            await deleteObjectFromS3('ostospos',result)
        }
        const bucketName = 'ostospos'
        const bytes2 = await file2.arrayBuffer()
        const buffer = Buffer.from(bytes2)

        const s3key2 = `business/${Date.now()}-${file2.name}`
        await uploadToS3({fileBuffer:buffer , key:s3key2 , file:file2})
        path2 = `https://${bucketName}.s3.${region}.amazonaws.com/${s3key2}`
        console.log(`open ${path} to see the uploaded file`)
    }

    if(!file3){
        console.log("image3 not founded")
    }else{
        if(oldImg3){
            const result = oldImg3.substring(oldImg3.indexOf("business"))
            await deleteObjectFromS3('ostospos',result)
        }
        const bucketName = 'ostospos'
        const bytes3 = await file3.arrayBuffer()
        const buffer = Buffer.from(bytes3);

        const s3key3 = `business/${Date.now()}-${file3.name}`
        await uploadToS3({fileBuffer:buffer , key:s3key3 , file:file3})
        path3 = `https://${bucketName}.s3.${region}.amazonaws.com/${s3key3}`
        console.log(`open ${path} to see the uploaded file`)
    }

    if(!id){
        return {error : "id is undefined!"}
    }else if (!busName){
        return {error:"business name is required!"}
    }else if(!busType){
        return {error:"business type is required!"}
    }else if (!busPhone1){
        return {error:"phone number 1 is required!"}
    }

    
    await prisma.business.update({
        where:{
            id
        },
        data:{
            busName,
            busEmail,
            busType,
            busAddr,
            busPhone1,
            busPhone2,
            busTelegram,
            busDes,
            busInvkh,
            busInvEng,
            busBankName,
            busBankNumber,
            busBankDes,
            busPayTerm,
            abaQr:!file ? oldImg : path,
            signature:!file1 ? oldImg1 : path1,
            busLogo:!file2 ? oldImg2 : path2,
            Rec1:!file3 ? oldImg3 : path3,

        }
    })
    return {success:"updated! business"}
}

export const deleteBusiness = async (id:string , oldImg:string , oldImg1:string , oldImg2:string , oldImg3:string) =>{
    if(!id){
        return {error:"id is undefined!"}
    }
    if(oldImg){
        const result = oldImg.substring(oldImg.indexOf("business/"))
        await deleteObjectFromS3('ostospos',result)
    }
    if(oldImg1){
        const result = oldImg1.substring(oldImg1.indexOf("business/"))
        await deleteObjectFromS3('ostospos',result)
    }
    if(oldImg2){
        const result = oldImg2.substring(oldImg2.indexOf("business/"))
        await deleteObjectFromS3('ostospos',result)
    }
    if(oldImg3){
        const result = oldImg3.substring(oldImg3.indexOf("business/"))
        await deleteObjectFromS3('ostospos',result)
    }
    await prisma.business.delete({
        where:{
            id
        }
    })
    return {success:"business deleted successfully"}
}