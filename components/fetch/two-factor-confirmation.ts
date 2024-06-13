import { prisma } from "@/lib/db/prisma"

export const getTwoFactorConfirmation = async (userId:string) =>{
    try{
        const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
            where:{userId}
        })
        return twoFactorConfirmation
    }catch{
        return null
    }
}