import { getVerificationTokenByEmail } from '@/fetch/verification-token';

import { prisma } from './db/prisma';
import { v4 as uuid} from 'uuid';
import { getPasswordResetTokenByEmail } from '@/fetch/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/fetch/two-factor-token';

const getrandomInt=(min:number , max:number)=>{
    return Math.floor(Math.random() * (max - min)) + min
}

export const generateTwoFactorToken = async (email:string) =>{
 const token = getrandomInt(10000 , 1000000).toString()
 const expires = new Date(new Date().getTime() + 5 * 60 * 1000)
 const existingToken = await getTwoFactorTokenByEmail(email)
 if(existingToken){
    await prisma.twoFactorToken.delete({
        where:{
            id:existingToken.id
        }
    })
 }  
 const twoFactorToken = await prisma.twoFactorToken.create({
    data:{
        email,
        token,
        expires
    }
 })
 return twoFactorToken
}

export const generatePasswordResetToken = async (email:string) =>{
    const token = uuid()
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getPasswordResetTokenByEmail(email)

    if(existingToken){
        await prisma.passwordResetToken.delete({
            where:{id:existingToken.id}
        })
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
        data:{
            email,
            token,
            expires
        }
    })
    return passwordResetToken;
}

export const generateVerificationtoken = async ( email :string) =>{
    const token = uuid()
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken){
        await prisma.verificationToken.delete({
            where:{
                id:existingToken.id
            }
        })
    }

    const verificationToken = await prisma.verificationToken.create({
        data:{
            email,
            token,
            expires
        }
    })

    return verificationToken
}