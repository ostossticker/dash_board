import InvTable from '@/components/invoice/invTable'
import Top from '@/components/ui/table/Top'
import React from 'react'

const page = () => {
  return (
    <>
    <Top routing='/invoice/created' switchable  showButtonCreate invoice deliveryNote/>
    <InvTable/>
    </>
  )
}

export default page