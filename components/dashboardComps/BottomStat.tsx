import React from 'react'
import BottomRight from './BottomRight/BottomRight'
import BottomLeft from './BottomLeft/BottomLeft'

const BottomStat = () => {
  return (
    <div className='grid grid-cols-4 xl:gap-10 lg:gap-4 xl:mt-[40px] lg:mt-[16px]'>
        <BottomLeft/>
        <BottomRight/>
    </div>
  )
}

export default BottomStat