import React from 'react'
import CardWrapper from './card-wrapper'
import { BsExclamationTriangle } from 'react-icons/bs'

const ErrorCard = () => {
  return (
    <CardWrapper
    headerLabel='Oops! Something went wrong!'
    backButtonHref='/auth/login'
    backButtonLabel='Back to login'
    >
        <div className='w-full flex justify-center items-center'>
            <BsExclamationTriangle className='text-red-500' size={50}/>
        </div>
    </CardWrapper>
  )
}

export default ErrorCard