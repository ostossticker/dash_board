import Create from '@/components/purchase/create'
import PurTable from '@/components/purchase/table'
import Top from '@/components/ui/table/Top'
import React from 'react'

const page = () => {
  return (
    <>
    <Top topTitle='NEW PURCHASE' editlabel='EDIT PURCHASE' showCancel={false} title='Purchase' modalChildren={<Create/>} showButtonForm/>
    <PurTable/>
    </>
  )
}

export default page