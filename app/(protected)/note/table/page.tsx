import Create from '@/components/note/create'
import NoteTable from '@/components/note/table'
import Top from '@/components/ui/table/Top'
import React from 'react'

const page = () => {
  return (
    <>
    <Top showCancel={false} topTitle='NEW NOTE' editlabel='EDIT NOTE' modalChildren={<Create/>} title='Note' showButtonForm/>
    <NoteTable/>
    </>
  )
}

export default page