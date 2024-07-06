"use server"

import { prisma } from "@/lib/db/prisma";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

type purchaseProps = {
    id?:string;
    purName:string;
    purPrice:string;
    purBus:string;
    purSince:string;
    purDes?:string;
    purInvN:string;
    purSupp?:string;
    oldImg?:string;
    oldImg1?:string;
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
    },
});

async function deleteObjectFromS3(bucket: string, key: string) {
    const params = {
      Bucket: bucket,
      Key: key
    };
  
    try {
      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);
    } catch (error) {
      console.error('Error deleting old file from S3:', error);
      throw error;
    }
  }

const uploadToS3 = async ({ fileBuffer, key, file }: { fileBuffer: Buffer, key: string, file: File }) => {
    try {
      const uploadParams = {
        Bucket: 'ostospos',
        Key: key,
        Body: fileBuffer,
        ContentType: file.type
      };
  
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw new Error("Error uploading image to S3.");
    }
  }

export const addPurchase = async ({
    purName,
    purPrice,
    purBus,
    purSince,
    purDes,
    purInvN,
    purSupp,
}:purchaseProps,data:FormData) =>{
    const file: File | null = data.get('image') as unknown as File
    const file1: File | null = data.get('image1') as unknown as File
    let path = '';
    let paths = '';

        if (!file) {
            console.log('image:notfounded')
        }else{
          const bucketName = 'ostospos'
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
      
          const s3key1 = `purchases/${Date.now()}-${file.name}`
          await uploadToS3({fileBuffer:buffer , key:s3key1 , file:file})
          path = `https://${bucketName}.s3.${region}.amazonaws.com/${s3key1}`
          console.log(`open ${path} to see the uploaded file`)
        }
      if (!file1) {
          console.log('image1:notfounded')
      }else{
          const bucketName = 'ostospos'
          const bytess = await file1.arrayBuffer()
          const buffers = Buffer.from(bytess)

          const s3key = `purchases/${Date.now()}-${file.name}`
          await uploadToS3({fileBuffer:buffers , key:s3key , file:file1})
          paths = `https://${bucketName}.s3.${region}.amazonaws.com/${s3key}`
          console.log(`open ${paths} to see the uploaded file`)
      }

    if(!purName){
        return {error: "seem like u forgot to name ur item name"}
    }else if (!purPrice){
        return {error:"seem like u forgot to giving a price to an item"}
    }else if(!purBus){
        return {error:"business is required!"}
    }else if(!purSupp){
        return {error:"supplier is required!"}
    }else if(!purSince){
        return {error:"purchase date is required!"}
    }else{
    await prisma.purchase.create({
        data:{
            purName,
            purPrice:parseFloat(purPrice.replace(/\$/g, '')),
            purBus,
            purSince,
            purDes,
            purInvN,
            purSupp,
            image1:!file ? null : path,
            image2:!file1 ? null : paths
        }
    })
    return {success:"purchase created!"}
    }
}

export const deletePurchase = async(id:string, oldImg:string , oldImg1:string)=>{
    if(!id){
        return {error:"please refresh the page again"}
    }
    if(oldImg){
        const result = oldImg.substring(oldImg.indexOf("purchases/"));
        await deleteObjectFromS3('ostospos',result)
    }
    if(oldImg1) {
        const result = oldImg1.substring(oldImg1.indexOf("purchases/"));
        await deleteObjectFromS3('ostospos',result)
    }
    await prisma.purchase.delete({
        where:{
            id
        }
    })
    return {success:"purchase row delete success!"}
}

export const editPurchase = async ({
    id,
    purName,
    purPrice,
    purBus,
    purSince,
    purDes,
    purInvN,
    purSupp,
    oldImg1,
    oldImg
}:purchaseProps,data:FormData)=>{
    const file: File | null = data.get('image') as unknown as File
    const file1: File | null = data.get('image1') as unknown as File
    let path = '';
    let paths = '';

        if (!file) {
            console.log('image:notfounded')
        }else{
            if(oldImg) {
                const result = oldImg.substring(oldImg.indexOf("purchases/"));
                await deleteObjectFromS3('ostospos',result)
            }
          const bucketName = 'ostospos'
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
      
          // With the file data in the buffer, you can do whatever you want with it.
          // For this, we'll just write it to the filesystem in a new location
          const s3key1 = `purchases/${Date.now()}-${file.name}`
          await uploadToS3({fileBuffer:buffer , key:s3key1 , file:file})
          path = `https://${bucketName}.s3.${region}.amazonaws.com/${s3key1}`
          console.log(`open ${path} to see the uploaded file`)
        }
        if (!file1) {
            console.log('image1:notfounded')
        }else{
            if(oldImg1) {
                const result = oldImg1.substring(oldImg1.indexOf("purchases/"));
                await deleteObjectFromS3('ostospos',result)
            }
            const bucketName = 'ostospos'
            const bytess = await file1.arrayBuffer()
            const buffers = Buffer.from(bytess)
            
            // With the file data in the buffer, you can do whatever you want with it.
            // For this, we'll just write it to the filesystem in a new location
            const s3key = `purchases/${Date.now()}-${file.name}`
            await uploadToS3({fileBuffer:buffers , key:s3key , file:file1})
            paths = `https://${bucketName}.s3.${region}.amazonaws.com/${s3key}`
            console.log(`open ${paths} to see the uploaded file`)
        }
        if(!purName){
            return {error: "seem like u forgot to name ur item name"}
        }else if (!purPrice){
            return {error:"seem like u forgot to giving a price to an item"}
        }else if(!purBus){
            return {error:"business is required!"}
        }else if(!purSupp){
            return {error:"supplier is required!"}
        }else if(!purSince){
            return {error:"purchase date is required!"}
        }else{
            await prisma.purchase.update({
                where:{
                    id
                },
                data:{
                    purName,
                    purPrice:parseFloat(purPrice.replace(/\$/g, '')),
                    purBus,
                    purSince,
                    purDes,
                    purInvN,
                    purSupp,
                    image1:!file ? oldImg : path,
                    image2:!file1 ? oldImg1 : paths
                }
        })
    return {success:"purchase row delete success!"}
    }
}