"use server"

import { getUserByEmail } from "@/fetch/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/token"

export const resetPass = async(email:string) =>{
    const existingUser = await getUserByEmail(email)

    if(!existingUser) {
        return {error:"Email not found!"}
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    )
    
    return {success:"success email sent!"};
}