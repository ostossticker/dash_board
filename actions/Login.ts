"use server"

import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { AuthError } from "next-auth"
import { signIn } from "@/auth"
import { getUserByEmail } from "@/fetch/user"
import { generateTwoFactorToken, generateVerificationtoken } from "@/lib/token"
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail"
import { getTwoFactorTokenByEmail } from "@/fetch/two-factor-token"
import { prisma } from "@/lib/db/prisma"
import { getTwoFactorConfirmation } from "@/fetch/two-factor-confirmation"
import { validateEmail } from "@/lib/functions"
import { error } from "console"

export async function loginFunc (name:string , email:string , phoneNumber:string, password:string,code?:string){
    
    console.log(name , email , phoneNumber , password,code)

    const checkNumber = (num:string): boolean =>{
      const nums = /^\d+\.\d+$/; 
      return nums.test(num) 
    }

    
    const existingUser = await getUserByEmail(email)

      if(validateEmail(existingUser?.email || '')){
        if(!existingUser?.emailVerified){
            return {error:"sorry your email is not verify"}
          }
      }

      if(validateEmail(email)){
            if( !existingUser || !existingUser.email){
                return {error: "Email does not exist!"}
            }
        
            if(!existingUser.emailVerified){
                const verificationToken = await generateVerificationtoken(
                    existingUser.email
                )
        
                await sendVerificationEmail(
                    verificationToken.email,
                    verificationToken.token
                )
        
                return {success:"confirmation email sent!"}
            }
        
            if(existingUser.isTwoFactorEnabled && existingUser.email){
                if(code){
                    const twoFactorToken = await getTwoFactorTokenByEmail(
                        existingUser.email
                    );
        
                    if(!twoFactorToken){
                        return {error:"Invalid code!"}
                    }
                    if(twoFactorToken.token !== code){
                        return {error:"Invalid code!"}
                    }
                    const hasExpired = new Date(twoFactorToken.expires) < new Date()
        
                    if(hasExpired){
                        return {error:"Code expired!"}
                    }
        
                    await prisma.twoFactorToken.delete({
                        where:{id:twoFactorToken.id}
                    })
                    const existingConfirmation = await getTwoFactorConfirmation(
                        existingUser.id
                    )
                    if(existingConfirmation){
                        await prisma.twoFactorConfirmation.delete({
                            where:{id:existingConfirmation.id}
                        })
                    }
        
                    await prisma.twoFactorConfirmation.create({
                        data:{
                            userId:existingUser.id
                        }
                    })
                }else{
                    const twoFactorToken = await generateTwoFactorToken(existingUser.email)
                    await sendTwoFactorTokenEmail(
                        twoFactorToken.email,
                        twoFactorToken.token
                    );
                    return {twoFactor:true};
                }
            }
            try{
                await signIn("credentials",{
                    email,
                    password,
                    redirectTo:DEFAULT_LOGIN_REDIRECT
                })
            }catch(error){
                if(error instanceof AuthError){
                    switch(error.type){
                        case"CredentialsSignin":
                            return {error: "Invalid credentials!"}
                        default:
                            return {error:"Something went wrong"}
                    }
                }
                throw error
            }
      }else if(checkNumber(email) && email.length == 10 || email.length == 9){
        try{
            await signIn("credentials",{
                phoneNumber,
                password,
                redirectTo:DEFAULT_LOGIN_REDIRECT
            })
        }catch(error){
            if(error instanceof AuthError){
                switch(error.type){
                    case"CredentialsSignin":
                        return {error: "Invalid credentials!"}
                    default:
                        return {error:"Something went wrong"}
                }
            }
            throw error
        }
      }else{
        try{
            await signIn("credentials",{
                name,
                password,
                redirectTo:DEFAULT_LOGIN_REDIRECT
            })
        }catch(error){
            if(error instanceof AuthError){
                switch(error.type){
                    case"CredentialsSignin":
                        return {error: "Invalid credentials!"}
                    default:
                        return {error:"Something went wrong"}
                }
            }
            throw error
        }
      }


    

    
    
    
   
}