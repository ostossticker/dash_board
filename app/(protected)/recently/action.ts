"use server"

import { prisma } from "@/lib/db/prisma"

type recently ={
    user:string;
    cust:string;
    route:string;
    action:string;
    paperNo:string;
}

export const recentlyActivity = async ({user , cust , paperNo , route , action}:recently) =>{
    await prisma.recently.create({
        data:{
            user,
            cust,
            route,
            action,
            paperNo
        }
    })
    return {success:"success"}
}