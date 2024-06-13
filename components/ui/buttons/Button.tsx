import React from 'react'

type buttonProps = {
    text:string;
    color?:string;
    bgColor?:string
    classname?:string;
    handleClick?:()=>void;
}

const Button = ({text , bgColor , handleClick , color ,classname, ...props}:buttonProps) => {
  return (
    <button {...props} className={`${bgColor} text-${color} ${classname} px-4 text-[15px] rounded-md py-1`} onClick={handleClick}>
        {text}
    </button>
  )
}

export default Button