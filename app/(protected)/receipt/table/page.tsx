import RecTable from '@/components/receipt/recTable'
import Top from '@/components/ui/table/Top'
import React from 'react'

const page = () => {
  return (
    <>
    <Top routing='/receipt/create' title='Receipt' showButtonCreate/>
    <RecTable/>
    </>
  )
}

export default page