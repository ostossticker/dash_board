import Create from '@/components/employee/create'
import EmpTable from '@/components/employee/table'
import Top from '@/components/ui/table/Top'
import React from 'react'



const Employeetable = () => {
  return (
    <>
     <Top topTitle='NEW EMPLOYEE' editlabel='EDIT EMPLOYEEE' modalChildren={<Create/>} showCancel={false} title='Employee' showButtonForm/>
     <EmpTable/>
    </>
  )
}

export default Employeetable