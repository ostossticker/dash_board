import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { prisma } from "./lib/db/prisma";
import { getUserById } from "./fetch/user";
import { getTwoFactorConfirmation } from "./fetch/two-factor-confirmation";
import { UserRole } from "@prisma/client";
import { getAccountByUserId } from "./fetch/account";
import { validateEmail } from "./lib/functions";

export const {
    handlers:{GET, POST},
    auth,
    signIn,
    signOut
} = NextAuth({
    pages:{
        signIn:"/auth/login",
        error:"/auth/error"
    },
    events:{
       async linkAccount({user}){
        await prisma.user.update({
            where:{id:user.id},
            data:{emailVerified:new Date()}
        })
       }
    },
    callbacks:{
        async signIn({user , account}){
            //allow auth without email verification
            if(account?.provider !== "credentials") return true

            const existingUser = await getUserById(user.id as string);
            
            if(validateEmail(existingUser?.email || '')){
                if(!existingUser?.emailVerified) return false; //// this area need to be removed but keep here for a while
            }

            if(existingUser?.isTwoFactorEnabled){
                const twoFactorConfirmation = await getTwoFactorConfirmation(existingUser.id);
                if(!twoFactorConfirmation) return false

                await prisma.twoFactorConfirmation.delete({
                    where:{id:twoFactorConfirmation.id}
                })
            }

            return true
        },
        async session({token , session}){
            if(token.sub && session.user){
                session.user.id = token.sub
            }
            if(token.role && session.user){
                session.user.role = token.role as UserRole
            }
            if(session.user){
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
                session.user.invoice = token.invoice as boolean
                session.user.quotation = token.quotation as boolean
                session.user.receipt = token.receipt as boolean
                session.user.business = token.business as boolean
                session.user.employee = token.employee as boolean
                session.user.customer = token.customer as boolean
                session.user.product = token.product as boolean
                session.user.purchase = token.purchase as boolean
                session.user.payment = token.payment as boolean
                session.user.telegramReport = token.telegramReport as boolean
                session.user.alarmTime = token.alarmTime as string
                session.user.businessType = token.businessType as string[]
                session.user.noting = token.noting as boolean
            }
 
            if(session.user){
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.isOAuth = token.isOAuth as boolean
            }

            return session
        },
        async jwt({token}){
            if(!token.sub) return token
            const existingUser = await getUserById(token.sub)

            if(!existingUser) return token

            const existingAccount = await getAccountByUserId(existingUser.id)
            
            token.isOAuth = !!existingAccount;
            token.role = existingUser.role
            token.name = existingUser.name
            token.email = existingUser.email
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
            token.invoice = existingUser.invoice
            token.quotation = existingUser.quotation
            token.receipt = existingUser.receipt
            token.business = existingUser.business
            token.employee = existingUser.employee
            token.customer = existingUser.customer
            token.product = existingUser.product
            token.purchase = existingUser.purchase
            token.payment = existingUser.payment
            token.telegramReport = existingUser.telegramReport
            token.alarmTime = existingUser.alarmTime
            token.businessType = existingUser.businessType
            token.noting = existingUser.noting
            return token
        }
    },
    adapter:PrismaAdapter(prisma),
    session:{strategy:"jwt"},
    ...authConfig,
})