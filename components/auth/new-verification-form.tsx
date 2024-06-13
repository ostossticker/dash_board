"use client"
import React, { useCallback, useEffect, useState } from 'react'
import CardWrapper from './card-wrapper'
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'
import { newVerification } from '@/actions/new-verification'

const NewVerificationForm = () => {
  const [error , setError] = useState<string | undefined>();
  const [success , setSuccess] = useState<string | undefined>()

  const searchParams = useSearchParams();
  const token = searchParams.get("token")

  const onSubmit = useCallback(() =>{
    if(success || error) return;

    if(!token) {
      setError("Missing token!")
      return;
    }
    newVerification(token)
      .then((data)=>{
        setSuccess(data.success)
        setError(data.error)
      }).catch(()=>{
        setError("something went wrong")
      })
  },[token,success,error])

  useEffect(()=>{
    onSubmit()
  },[onSubmit])

  return (
    <CardWrapper
    headerLabel='Confirming your verification'
    backButtonLabel='Back to login'
    backButtonHref='/auth/login'
    >
      <div className='flex items-center w-full justify-center'>
        {
          !success && !error && (
            <BeatLoader/>
          )
        }
        {success && <span>{success}</span>}
        {
          !success && (
            <>
            {error && <span>{error}</span>}
            </>
          )
        }
      </div>
    </CardWrapper>
  )
}

export default NewVerificationForm