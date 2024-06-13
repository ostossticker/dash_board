"use client"
import Editadmin from '@/components/auth/editadmin'
import RoleGate from '@/components/auth/role-gate'
import Top from '@/components/ui/table/Top'
import { UserRole } from '@prisma/client'
import React from 'react'

const AdminPage = () => {
  return (
    <>
        <Top typeSelect='bigmodal' topTitle='ADMIN PAGE' editlabel='EDIT USER' bgLeft='User Info' bgRight='Permission' title='Admin' bigModal={<Editadmin/>} showCancel={false}/>
        <RoleGate allowedRole={UserRole.ADMIN}/>
    </>
  )
}

export default AdminPage