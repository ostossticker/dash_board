import Paytable from '@/components/payment/table'
import Top from '@/components/ui/table/Top'
import React from 'react'

const page = () => {
  return (
    <>
      <Top title='Payment' routing='/invoice/created'  showButtonCreate/>
      <Paytable/>
    </>
  )
}

export default page