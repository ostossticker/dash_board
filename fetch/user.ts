import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client";

interface User {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    phoneNumber: string | null;
    role: UserRole;
    isTwoFactorEnabled:boolean;
    // Add other fields as needed
}

export const getUserByEmail = async (email:string):Promise<User | null> =>{
    try{
        const validateEmail = (email: string): boolean => {
            // Regular expression for email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
        
        if(validateEmail(email)){

            const user = await prisma.user.findUnique({
                where:{
                    email:email
                }
            })
            console.log('email')
            return user;
        }else if (!isNaN(Number(email))){
            const user = await prisma.user.findMany({
                where:{
                    phoneNumber:{contains:email}
                }
            })
            return user.length > 0 ? user[0] : null
        }else{

            const user = await prisma.user.findMany({
                where:{
                    name:{contains:email}
                }
            })
            console.log('phone')
            return user.length > 0 ? user[0] : null;
        }
    }catch{
        return null
    }
}

export const getUserById = async (id:string) =>{
    try{
        const user = await prisma.user.findUnique({
            where:{
                id
            }
        })
        console.log(id)
        return user
    }catch{
        console.log('error here')
        return null
    }
}