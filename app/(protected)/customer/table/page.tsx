import Create from '@/components/customer/create'
import CusTable from '@/components/customer/table'
import Top from '@/components/ui/table/Top'
import React from 'react'

const page = () => {

  return (
    <>
        <Top topTitle='NEW CUSTOMER' editlabel='EDIT CUSTOMER' modalChildren={<Create/>} showCancel={false} title='Customer' showButtonForm/>
        <CusTable/>
    </>
  )
}

export default page