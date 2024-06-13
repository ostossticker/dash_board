import Create from '@/components/product/create'
import ProdTable from '@/components/product/table'
import Top from '@/components/ui/table/Top'

import React from 'react'

const page = () => {
  return (
    <>
    <Top showCancel={false} topTitle='NEW PRODUCT' editlabel='EDIT PRODUCTS' modalChildren={<Create/>} title='Product' showButtonForm/>
    <ProdTable/>
    </>
  )
}

export default page