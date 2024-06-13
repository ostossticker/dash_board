import React from 'react'

type HeaderProps = {
    label:string;
}

const Header = ({label}:HeaderProps) => {
  return (
    <div>
        <h1 className="text-3xl font-semibold mr-2 text-center text-blue-500">Insomnia</h1>
        <p className='text-muted-foreground text-xl px-1 py-5 text-gray-600 text-center mt-[8rem]'>
            {label}
        </p>
    </div>
  )
}

export default Header