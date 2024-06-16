"use client"
import React from 'react'
import Table from './Table'
import Charts from './Chart'
import DailySummaries from './DailySummaries'
import HistorySummaries from './HistorySummaries'

const BottomLeft = () => {
  return (
    <div className='lg:col-span-3 col-span-6 '>
      <div className='grid grid-cols-4 xl:gap-10 lg:gap-4'>
        
      <Charts/>

        <DailySummaries/>
      </div>
      <div className='grid grid-cols-4 xl:gap-10 lg:gap-4'>
      <Table/>
      <HistorySummaries/>
      </div>
    </div>
  )
}

export default BottomLeft