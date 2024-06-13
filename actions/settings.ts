"use server"

import { getUserById } from "@/fetch/user"
import { currentUser } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"

export const Settings = async (name:string | undefined , email:string,new_password:string) =>{
    const user = await currentUser()
    if(!user){
        return {error: "Unauthorized"}
    }

    const dbuser = await getUserById(user.id as string)

    if(!dbuser){
        return {error:"Unauthorized"}
    }

    if(user.isOAuth){
        name = undefined;
    }

    await prisma.user.update({
        where:{id:dbuser.id},
        data:{
            
        }
    });

    return {success:"Settings Updated!"}
}