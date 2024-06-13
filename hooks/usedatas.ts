import { useSession } from "next-auth/react"

export const usedatainvoice = () =>{
    const session = useSession()

    return session.data?.user.invoice;
}

export const useQuotation = () =>{
    const session = useSession()

    return session.data?.user.quotation;
}

export const useReceipt = () =>{
    const session = useSession()

    return session.data?.user.receipt;
}

export const useBusiness = () =>{
    const session = useSession()

    return session.data?.user.business;
}

export const useEmployee = () =>{
    const session = useSession()

    return session.data?.user.employee;
}

export const useCustomer = () =>{
    const session = useSession()

    return session.data?.user.customer;
}

export const useProduct = () =>{
    const session = useSession()

    return session.data?.user.product;
}

export const usePurchase = () =>{
    const session = useSession()

    return session.data?.user.purchase;
}

export const usePayment = () =>{
    const session = useSession()

    return session.data?.user.payment;
}

export const useNote = () =>{
    const session = useSession()

    return session.data?.user.noting
}