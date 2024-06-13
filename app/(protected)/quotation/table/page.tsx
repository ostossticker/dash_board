import QtTable from '@/components/quotation/qtTable'
import Top from '@/components/ui/table/Top'
import React from 'react'

const page = () => {
  return (
    <>
    <Top routing='/quotation/created' title='Quotation' showButtonCreate/>
    <QtTable/>
    </>
  )
}

export default page