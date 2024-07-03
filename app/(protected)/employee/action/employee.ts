"use server"
import { prisma } from "@/lib/db/prisma"
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

type employeeProps = {
    id?:string
    empName:string;
    empId?:string;
    empPhone:string;
    empNational?:string;
    empAssc?:string;
    empAddr?:string;
    empTelegram?:string;
    empGender:string;
    empOcc?:string;
    memberSince?:string; /** this must be a time function */
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
    } catch (error) {
      console.error('Error deleting old file from S3:', error);
      throw error;
    }
  }


export const addEmployee = async({
    empName,
    empId,
    empPhone,
    empNational,
    empAssc,
    empAddr,
    empTelegram,
    empGender,
    empOcc,
    memberSince
}:employeeProps,data:FormData) =>{
    const user = await prisma.emp.findUnique({
        where:{
            empName
        }
    })
    if(user){
        return {error:"sorry this employee name already exist!"}
    }else if(!empName){
        return {error:"employee must have a name given"}
    }else if(!empPhone){
        return {error:"employee must have a phone number given"}
    }else if(!empOcc){
        return {error:"employee occupation is required!"}
    }else if (!empGender){
        return {error:"gender is required!"}
    }else{
        const file:File | null = data.get('image') as unknown as File
        let path =''
        if(!file){
            console.log('image:notfounded')
        }else{
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            const s3Key = `employee/${Date.now()}-${file.name}`
            const bucketName = 'ostospos'
            const disBucket = {
                Bucket:bucketName,
                Key:s3Key,
                Body:buffer,
                Content:file.type
            }
            try{
                const command = new PutObjectCommand(disBucket)
                await s3Client.send(command)
                path = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;
                console.log(`File upload to ${path}`)
            }catch(error){
                console.error('Error uploading file to S3:', error);
                return { error: "There was an error uploading the file." };
            }
        }
        try{
            await prisma.emp.create({
                data:{
                    empName,
                    empId,
                    empPhone,
                    empNational,
                    empAssc,
                    empAddr,
                    empCard:!file ? null : path,
                    empTelegram,
                    empGender,
                    empOcc,
                    memberSince
                }
            })
            console.log('success')
            return {success:"employee has been inserted!"} 
        }catch(error){
            console.error('Error inserting employee to database:', error);
            return { error: "There was an error inserting the employee." };
        }
    }
    
}

export const deleteEmployee = async (id:string, oldImg:string) =>{
    if(!id){
        return {error:"please refresh the page or try it again"}
    }
    if(oldImg) {
        const result = oldImg.substring(oldImg.indexOf("employee/"));
        await deleteObjectFromS3('ostospos',result)
    }
    await prisma.emp.delete({
        where:{
            id
        }
    })
    return {success:"employee row has been deleted!"}
}

export const editEmployee =async ({
    id,
    empName,
    empId,
    empPhone,
    empNational,
    empAssc,
    empAddr,
    empTelegram,
    empGender,
    empOcc,
    memberSince,
    oldImg
}:employeeProps,data:FormData)=>{
    const file:File | null = data.get('image') as unknown as File
    let path =''
    if(!file){
        console.log('no image founded')
    }else{
            if(oldImg) {
                const result = oldImg.substring(oldImg.indexOf("employee/"));
                await deleteObjectFromS3('ostospos',result)
            }
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            const s3Key = `employee/${Date.now()}-${file.name}`
            const bucketName = 'ostospos'
            const disBucket = {
                Bucket:bucketName,
                Key:s3Key,
                Body:buffer,
                Content:file.type
            }
            try{
                const command = new PutObjectCommand(disBucket);
                const response = await s3Client.send(command)
                console.log('upload to s3' ,response)
                path = `https://${disBucket.Bucket}.s3.${region}.amazonaws.com/${disBucket.Key}`
            }catch(error){
                console.error('Error uploading to S3:', error);
                return { error: 'Failed to upload image to S3' };
            }
        
    }
    if(!id){
        return {error:"please refresh the page or try it again"}
    }else if(!empOcc){
        return {error:"employee occupation is required!"}
    }else if(!empPhone){
        return {error:"employee must have a phone number given"}
    }else if (!empGender){
        return {error:"gender is required!"}
    }else{
        await prisma.emp.update({
            where:{
                id
            },
            data:{
                empName,
                empId,
                empPhone,
                empNational,
                empAssc,
                empAddr,
                empCard:!file ? oldImg : path,
                empTelegram,
                empGender,
                empOcc,
                memberSince
            }
        })
        return {success:"employee has been updated!"}
    }
   
}