"use client"
import useToggle from '@/hooks/stores'
import React , { useEffect,useRef, useState } from 'react'
import { editSetting } from '@/actions/admin'
import { useCurrentUser } from '@/hooks/use-current-user'
import Image from 'next/image'
import { toast } from 'react-toastify'
import axios from 'axios'
import { url } from '@/lib/url'
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { validateEmail } from '@/lib/functions'

type formInputProps = {
  name:string,
  email:string,
  password:string,
  new_password:string,
  oldImg?:string;
}

type QuoteImage = {
  [key: string]: File | undefined;
};

const MainSetting = () => {
  const {darkMode , profile , setRefresh} = useToggle()
  const [toggle , setToggle] = useState<boolean>(false)
  const [image, setImage] = useState<QuoteImage>({});
  const [loadImage , setLoadImage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useCurrentUser()
  const [val , setVal] = useState<formInputProps>({
      name:'',
      email:'',
      password:'',
      new_password:'',
      oldImg:''
  })


    

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
      const { name , value  } = e.target
      setVal({
       ...val , [name]:value
      }) 
   }

   useEffect(()=>{
       const fetchData = async() =>{
        const {data} = await axios.get(`${url}/api/admins/${user.id}?email=${user?.id}`)
        setLoadImage(data?.image)
        setVal(prev=>({
          ...prev,
          name:data?.name,
          email:!validateEmail(data?.email) ? "" : data?.email,
          password:'',
          new_password:'',
          oldImg:data?.image
      }))
       }
       fetchData()
       
       
   },[profile])

   const forminput = [
       {
           label:"Name",
           name:"name",
           val:val.name,
           type:"text",
           label_style:"",
           input_style:"",
           func:handleChange
       },
       {
           label:"Email",
           name:"email",
           val:val.email,
           type:"email",
           label_style:"",
           input_style:"",
           func:handleChange
       },
       {
           label:"Old Password",
           name:"password",
           val:val.password,
           type:"password",
           label_style:"",
           input_style:"",
           func:handleChange
       },
       {
           label:"New Password",
           name:"new_password",
           val:val.new_password,
           type:"password",
           label_style:"",
           input_style:"",
           func:handleChange
       }
   ]

  const handleImageSelection = (key: keyof QuoteImage) => () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (key: keyof QuoteImage) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileType = file.type;
      const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

      if (validImageTypes.includes(fileType)) {
        setImage((prevState) => ({
          ...prevState,
          [key]: file,
        }));
      } else {
        console.error('Invalid file type');
      }
    } else {
      console.error('No files selected');
    }
  };

  const handleSetting = async () =>{
    const modal = document.getElementById('my_modal_4') as HTMLDialogElement | null;
    const formData = new FormData();

    if (image && 'profile' in image && image.profile) {
      formData.append('profile', image.profile);
    }

    await editSetting({
      id:user.id , 
      name:val.name , 
      email:val.email , 
      password:val.password , 
      newpass:val.new_password ,
      oldImg:val.oldImg
    },formData)
    .then((data)=>{
      if(data?.success){
        toast.success(data.success)
        setRefresh()
        if(modal){
          modal.close()
        }
      }
      if(data?.error){
        toast.error(data.error)
      }
    }).catch((error)=>{
      toast.error(error)
    })
  }

  return (
    <>
    <div className={`flex justify-center gap-4  p-4 ${darkMode ? "bg-dark-box-color" : ""} rounded-md`}>
        <div >
            {
                forminput?.map((item,index)=>{
                    return(
                        <div key={index} className={index === 3 ? "" : "mb-4"}>
                            <label className={`${item.label_style}  black mb-1 ${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"}`}>{item.label}</label>
                            {
                              item.label === 'New Password' ? (
                                <div className={`${item.input_style} w-full flex bg-white py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                <input className='outline-none'  type={!toggle ? item.type : 'text'} value={item.val} name={item.name} onChange={item.func}/>
                                <button onClick={()=>setToggle(!toggle)}>{!toggle ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                                </div>
                              ) : (
                                <input className={`${item.input_style} w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`} type={item.type} value={item.val} name={item.name} onChange={item.func}/>
                              )
                            }
                        </div>
                    )
                })
            }
          
        </div>
        <div className='flex flex-col items-center'>
        <Image src={image.profile ? URL.createObjectURL(image.profile) :loadImage !== null ? loadImage.split("\\").join("/").split('public').join('') : "/profile.jpg"} alt='Profile' width={200} height={300} className='border-[1px] p-1' />
        <div className='flex flex-row justify-center items-center'>
          <button className='text-white bg-insomnia-primary rounded-md w-[50px] m-1' onClick={handleImageSelection('profile')}>
            Edit
          </button>
          <button className='text-white bg-red-300 rounded-md w-[50px] m-1' onClick={()=>setImage({profile:undefined})}>Clear</button>
        </div>
        <input
          type="file"
          name='image'
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageChange('profile')}
        />
      </div>
    </div>
    <div className='flex justify-end'>
    <button  className={`py-2 mt-2 px-4  text-white rounded focus:outline-none bg-insomnia-primary`} onClick={handleSetting}>
            Update Change!
    </button>
    </div>
    <input type="text" className="hidden" value={val.oldImg === '' ? 'empty' : val.oldImg}/>
    </>
  )
}

export default MainSetting