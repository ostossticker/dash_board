import Create from "@/components/business/create"
import BusTable from "@/components/business/table"
import Top from "@/components/ui/table/Top"
import React from 'react'

const page = () => {

  return (
    <>
    <Top typeSelect="bigmodal" bigModal={<Create/>} bgLeft="Business Info" bgCenter="Description" bgRight="Payment Info" showCancel={false} topTitle="NEW BUSINESS" title="Business" showButtonForm/>
    <BusTable/>
    </>
  )
}

export default page