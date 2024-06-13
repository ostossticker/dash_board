"use server"
import { getPasswordResetTokenByToken } from "@/fetch/password-reset-token"
import { getUserByEmail } from "@/fetch/user";
import { prisma } from "@/lib/db/prisma";

export const newPassword = async(password:string ,token?:string | null) =>{
    if(!token){
        return {error:"Missing token!"}
    }
    const existingToken = await getPasswordResetTokenByToken(token);
    if(!existingToken){
        return {error:"Invalid token!"}
    }
    const hasExpired = new Date(existingToken.expires) < new Date();
    if(hasExpired){
        return {error:"Token has expired!"}
    }
    const existingUser = await getUserByEmail(existingToken.email)
    if(!existingUser){
        return {error:"Email does not exist!"}
    }
    await prisma.user.update({
        where:{id:existingUser.id},
        data:{
            password:password
        }
    })
    await prisma.passwordResetToken.delete({
        where:{id:existingToken.id}
    })
    return {success:"Password updated!"}
}