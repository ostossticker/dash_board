"use client"
import React , {useEffect , useState} from 'react'

type authLay ={
    children:React.ReactNode
}

const AuthLay = ({children}:authLay) => {
  const [backgroundIndex, setBackgroundIndex] = useState<number>(0);
  const backgrounds: string[] = [
    '/background1.png',
    '/background2.png',
    '/background3.png',
    // Add more background images as needed
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex(prevIndex => (prevIndex + 1) % backgrounds.length);
    }, 5000); // Change background every 10 seconds

    return () => clearInterval(interval);
  }, [backgrounds.length]);

  const backgroundStyle: React.CSSProperties = {
    backgroundImage: `url(${backgrounds[backgroundIndex]})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    transition: 'background-image 2s ease-in-out',
  };
  return (
    <div className='h-screen flex  justify-end bg-white bg-contain' style={backgroundStyle}>
        {children}
    </div>
  )
}

export default AuthLay