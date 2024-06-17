"use server"
import { prisma } from "@/lib/db/prisma"

export const deletePaymentAll = async(cusName:string , cusComp:string ,invBus:string, invStatus:string , invCusPhone1:string ,invCusPhone:string) =>{
    try {
        const now = new Date()

        await prisma.invoice.updateMany({
            where: {
                customer:{
                    cusName:{contains:cusName},
                    cusComp:{contains:cusComp},
                    cusPhone1:{contains:invCusPhone1}
                },
                invBus:{
                    contains:invBus
                },
                invStatus:{
                    contains:invStatus
                },
                invCusPhone:{
                    contains:invCusPhone
                }
            },
            data:{
                deletedAt:now
            }
        });

        return { success: `Invoice delete successful for ${cusName} ${cusComp}` };
    } catch (error) {
        console.log("Error deleting invoices:", error);
        return { error: "An error occurred while deleting invoices" };
    }
    
}