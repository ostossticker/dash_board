import NoteTable from '@/components/note/table'
import Top from '@/components/ui/table/Top'
import React from 'react'

const page = () => {
  return (
    <>
    <Top showCancel={false} title='Note' isNote/>
    <NoteTable/>
    </>
  )
}

export default page