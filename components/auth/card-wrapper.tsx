import React from 'react'
import BackButton from './back-button';
import Header from './header';
import { Social } from './social';

type CardWrapperProps = {
    children:React.ReactNode;
    headerLabel:string;
    backButtonLabel:string;
    backButtonHref:string;
    showSocial?:boolean
}

const CardWrapper = ({
children,
headerLabel,
backButtonHref,
backButtonLabel,
showSocial
}:CardWrapperProps) => {
  return (
    <div className='p-10'>
        <div>
          <Header label={headerLabel}/>
        </div>
        {children}
        {
          showSocial && (
            <div>
             <div className='flex justify-center my-5'>
             <p className='w-[200px] text-center border-b-[1px] border-gray-300 leading-[0.1em] m-[10px_0_20px]'><span className='bg-white p-[0_10px] text-gray-400'>or</span></p>
             </div>
             <div className='flex justify-center'>
             <Social/>
             </div>
            </div>
          )
        }
        <div>
          <BackButton
          label={backButtonLabel}
          href={backButtonHref}
          />
        </div>
    </div>
  )
}

export default CardWrapper