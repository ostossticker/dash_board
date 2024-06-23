"use server"
import { prisma } from "@/lib/db/prisma"

export const deletePaymentAll = async(cusName:string , cusComp:string ,invBus:string) =>{
    try {
        const now = new Date()

        await prisma.invoice.updateMany({
            where: {
                invCusName:cusName,
                invCusComp:cusComp,
                invBus:{
                    contains:invBus
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