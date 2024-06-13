"use server"

import { getUserByEmail } from "@/fetch/user"
import { prisma } from "@/lib/db/prisma"
import { generateRandomString, validateEmail } from "@/lib/functions"
import { sendVerificationEmail } from "@/lib/mail"
import { generateVerificationtoken } from "@/lib/token"
import { User } from "next-auth"

const randomString = generateRandomString(10); 

export async function RegisterFunc (
    username:string, 
    email:string , 
    password:string , 
    cpassword:string,
    phoneNumber:string
    ){
    try{
        if(email !== ""){
            const existingUser:User | null = await getUserByEmail(email)
            if(existingUser){
                return { error:"Email already exist!" }
            }
        }
        if(phoneNumber !== ""){
            const existingUser:User | null = await getUserByEmail(phoneNumber)
            if(existingUser){
                return { error:"Email already exist!" }
            }
        }
        if(username.length > 20){
            return { errorname:"username too long sorry"}
        }
        if (!validateEmail(email) && email !== ""){
            return {erroremail:"invalid email!"}
        }
        if(!password){
            return {errorpass:"password is required!"}
        }else if(password !== cpassword){
            return {errorpass:"make sure both password field are the same match"}
        }
        if(!cpassword){
            return {errorcpass:"password is required!"}
        }else if (cpassword.length < 4) {
            return {errorcpass:"password be atleast greater or equal to 6 letters or characters"}
        }
        if((username && password) || (email && password) || (phoneNumber && password)){
            await prisma.user.create({
                data:{
                    name:username,
                    email:!email ? randomString : email,
                    password,
                    phoneNumber
                }
            })
        }else{
            return {error:"sorry make sure username email or phonenumber must atleast have something"}
        }

        const verificationToken = await generateVerificationtoken(email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )
        if(!email){
            return {success:"User has been created!"}
        }else{
            return {success:"Confirmation email send!"};
        }
    }catch{
        console.log('error!')
        return null
    }

}
