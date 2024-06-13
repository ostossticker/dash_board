import React from 'react'
import Sidebar from './Sidebar'
import { auth } from '@/auth'
import AuthLay from './AuthLay'
import Modal from '../ui/modal/modal'
import MainSetting from '../settings/main'

type layoutProps = {
    children:React.ReactNode
}

const Layout = async ({children}:layoutProps) => {
  const session = await auth()
  return (
    <>
    {
      session === null ? ( 
      <AuthLay>
        <div className='bg-white h-screen flex items-center p-10'>
          {children}
        </div>
      </AuthLay> ) : (
       <>
        <Sidebar>
        {children}
        <Modal showCancel={true} id='my_modal_4' title='Settings'>
          <MainSetting/>
        </Modal>
        </Sidebar>
       </>
      )
    }
    </>
  )
}

export default Layout