"use server"

import { prisma } from "@/lib/db/prisma"
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { UserRole } from "@prisma/client";

type adminProps = {
    id:string;
    name:string;
    email:string;
    phoneNumber:string;
    password:string;
    role:UserRole;
    invoice:boolean;
    quotation:boolean;
    receipt:boolean;
    business:boolean;
    employee:boolean;
    customer:boolean;
    product:boolean;
    purchase:boolean;
    payment:boolean;
    image?:string;
    telegramReport?:boolean
    alarmTime?:string
    isTwoFactorEnabled:boolean
    businessType?:string[]
}

type settingProps = {
    id?:string;
    name?:string
    email?:string
    password?:string;
    newpass?:string;
    oldImg?:string;
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
      console.log('Deleted old file from S3:', key);
    } catch (error) {
      console.error('Error deleting old file from S3:', error);
      throw error;
    }
  }

export const deleteUser = async(id:string) =>{
    if(!id){
        return {error:"sorry error!"}
    }
    await prisma.user.delete({
        where:{
            id
        }
    })
    return {success:"deleted operation success !"}
}

export const editAdmin = async ({
    id,
    name,
    email,
    phoneNumber,
    password,
    role,
    invoice,
    quotation,
    receipt,
    business,
    employee,
    customer,
    product,
    purchase,
    payment,
    telegramReport,
    alarmTime,
    isTwoFactorEnabled,
    businessType
}:adminProps) =>{
    if(!id){
        return {error: "please refresh the page or try it again"}
    }
    await prisma.user.update({
        where:{
            id
        },
        data:{
            name,
            email,
            phoneNumber,
            password,
            role,
            invoice,
            quotation,
            receipt,
            business,
            employee,
            customer,
            product,
            purchase,
            payment,
            telegramReport,
            alarmTime,
            isTwoFactorEnabled,
            businessType
        }
    })
    return {success:"updated! admins"}
}

export const editSetting = async ({id , name ,oldImg, email , password , newpass}:settingProps,data:FormData) =>{
    const file:File | null = data.get('profile') as unknown as File
    let path = ''
    if(!file){
        console.log("image not founded")
    }else{
        if(oldImg) {
            const result = oldImg.substring(oldImg.indexOf("user/"));
            await deleteObjectFromS3('ostospos',result)
        }
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const s3Key = `user/${Date.now()}-${file.name}`
        const bucketName = 'ostospos'
        const disBucket = {
            Bucket:bucketName,
            Key:s3Key,
            Body:buffer,
            Content:file.type
        }
        console.log(disBucket)
        try{
            const command = new PutObjectCommand(disBucket)
            const response = await s3Client.send(command)
            console.log('upload to s3' ,response)
            path = `https://${disBucket.Bucket}.s3.${region}.amazonaws.com/${disBucket.Key}`
        }catch(error){
            console.error('Error uploading to S3:', error);
            return { error: 'Failed to upload image to S3' };
        }
    }
  const datas =  await prisma.user.findUnique({
        where:{
            id
        }
    })
    if(datas){
      if(password !== '' && password === datas.password){
        await prisma.user.update({
            where:{
                id
            },
            data:{
                name,
                email,
                password:newpass,
                image:!file ? oldImg : path,
            }
           })
           return {success:"profile update successfully"}
      }else{
        await prisma.user.update({
            where:{
                id
            },
            data:{
                name,
                email,
                image:!file ? oldImg : path
            }
           })
           return {success:"profile update successfully"}
      }
    }else{
        return {error:'sorry about that'}
    }
}