"use server"

import { prisma } from "@/lib/db/prisma";

type testProps = {
        test1:string;
        test2:string;
}

type arrayProps = {
        description:string;
        qty:number;
        unitprice:number;
        total:number
}


export async function TestApi ({test1 , test2}:testProps , array:arrayProps[]){
    try{
        if(test1){ 
            console.log({test1, test2,array})
        }
    }catch{
        return null
    }
}

export async function TestApi1 (){
    const user = await prisma.user.findMany({})
    return {user}
}