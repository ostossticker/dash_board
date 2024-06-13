"use client"
import Image from 'next/image'
import React  from 'react'
import { currencyToWords } from 'dollars2words';

type busProps = {
  busName?:string;
  busLogo?:string;
  Rec1?:string;
  id?:string
}

type printRecProps = {
    day:string;
    month:string;
    year:string;
    usdinput?:string;
    recFrom?:string;
    paymentOf?:string;
    checks?:string;
    suggest?:busProps[]
    busfil?:string;
    recNum?:string;
}

const Print = ({day , month , year , usdinput , recFrom  , paymentOf , checks,suggest,busfil,recNum}:printRecProps) => {

  const date = "h-[50px] w-[100px] border-solid border-solid border-l-[8px] border-y-[8px] border-r-[4px] border-gray-300 "
  const date1 = "h-[50px] w-[100px] border-solid border-solid border-y-[8px]  border-x-[4px] border-gray-300 "
  const date2 = "h-[50px] w-[100px] border-solid border-solid border-r-[8px] border-y-[8px] border-l-[4px] border-gray-300 "

  return (
    <div className=" pt-[130px] px-[20px] bg-white w-[1200px]" >
            <div  className=' mx-auto'>
            <div className='bg-white '>

            </div>
            <div style={{backgroundImage:"url('/RecImg.png')",backgroundSize:"cover"}} className={`h-[530px] pt-[60px] px-[20px]`} >
            {/***************************/}
            <div className='flex justify-between items-center'>
      
                  <div className='flex justify-center items-center'>
                    {
                      suggest?.map((item)=>{
                        return(
                          <React.Fragment key={item.id}>
                            {
                              busfil === item.busName && (
                                <>
                                  <Image src={!item.busLogo ? '/n5LOGO.png' : item.busLogo}  className='w-[210px] h-[98px]' alt="#" width={210} height={210}/>
                                  <Image src={!item.Rec1 ? '/text.png' : item.Rec1}  className='w-[190px] h-[70px]' alt='#' width={190} height={190}/>
                                </>
                              )
                            }
                          </React.Fragment>
                        )
                      })
                    }
                    {
                      busfil === '' && (
                        <>
                          <Image src="/n5LOGO.png"  className='w-[210px]' alt="#" width={210} height={210}/>
                          <Image src="/text.png"  className='w-[190px] h-[70px]' alt='#' width={190} height={190}/>
                        </>
                      )
                    }
                  </div>
        
                  <Image src="/RecLetter.png"  className='w-[230px] ' alt='#' width={230} height={230}/>
            
                <div>
                
                
                <div className='flex justify-center items-center'>
                  <div className='pt-[13px] text-[24px] pr-[5px] text-end text-slate-400' >
                  <p className='h-[20px]' style={{fontFamily:"khmerContent"}}>កាលបរិច្ឆទ:</p>
                  <p className='h-[20px] pt-[5px]' style={{fontFamily:"khmerContent"}}>Date:</p>
                  </div>
                  <div>
                    <div className='text-center text-[24px] text-slate-400' style={{fontFamily:"khmerContent"}}>
                    លេខ​ /​ No: <span className='text-black'>{recNum}</span>
                    </div>


                  {
                    /*/////////////////////// date /////////////////////////////////////*/
                   
                  }
                  <input className={`${date} text-[24px] text-center outline-none`} type='number'name='day'  value={day}/>
                  <input className={`${date1} text-[24px] text-center outline-none`} type='number' name='month' value={month} />
                  <input className={`${date2} text-[24px] text-center outline-none`} type='number' name='year' value={year}/>
                  <div>
                  </div>
                  {
                    /*/////////////////////// date /////////////////////////////////////*/
                  }
                  </div>
                </div>
                </div>
            </div>
            {/***************************/}
            <div className='flex'>
              {/*************************/}
              <div className='w-full'>
              <div className='mt-[20px] mb-[6px]'>
                <p className='text-start text-[24px] h-[23px] text-slate-400 pt-[13px]' style={{fontFamily:"khmerContent"}}>ទទួលពី:</p>
                <div className='flex'>
                  <label className='text-[24px] text-slate-400 pt-[13px]'>Received From:</label>
                  <input className='outline-none border-dotted w-[511px] h-[40px] pt-[3px] pl-[10px] border-b-[3px] border-slate-400 ml-1 text-[24px] ' type="text" style={{background:"none",fontFamily:"khmerContent"}} value={recFrom}/>
                </div>
              </div>
              <div className='mb-[6px]'>
                <p className='text-start text-[24px] h-[23px] text-slate-400' style={{fontFamily:"khmerContent"}}>ចំនួនប្រាក់:</p>
                <div className='flex'>
                  <label className='text-[24px] w-[138px] text-slate-400'>The Sum of:</label>
                  <span className='border-dotted border-b-[3px] inline-block leading-[0.7em] h-[27px] pl-[10px]  border-slate-400 ml-1 text-[24px] w-[551px]'>
                  {usdinput !== undefined && usdinput !== '' ? (
                        currencyToWords(parseFloat(usdinput)).length >= 43 
                            ? `${usdinput === " " ? "" : currencyToWords(parseFloat(usdinput)).split(" ").slice(0, 5).join(" ")}`
                            : `${usdinput === " " ? "" : currencyToWords(parseFloat(usdinput)).split(" ").slice(0, 8).join(" ")}`
                    ) : ''}
                  </span>
                </div>
                {
                  usdinput !== undefined ? parseFloat(usdinput) >= 100000 ? (
                    <input type="text" className={`border-dotted border-b-[3px]  inline-block leading-[0.7em] bg-transparent pb-[5px] pl-[137px] mt-[19px] border-slate-400 ml-1 text-[24px] w-[691px] `} value={usdinput !== undefined && usdinput !== '' ? (
                      currencyToWords(parseFloat(usdinput)).length >= 43
                          ?  `${currencyToWords(parseFloat(usdinput)).split(" ").slice(5).join(" ")}`
                          :  `${currencyToWords(parseFloat(usdinput)).split(" ").slice(8).join(" ")}`
                  ) : ''}/>
                  ) : (
                    <span className={`border-dotted border-b-[3px]  inline-block leading-[0.7em] pb-[10px] pl-[150px] mt-[26px] border-slate-400 ml-1 text-[24px] w-[691px]`}>
                        {usdinput !== undefined && usdinput !== '' ? (
                              currencyToWords(parseFloat(usdinput)).length >= 43
                                  ?  `${currencyToWords(parseFloat(usdinput)).split(" ").slice(5).join(" ")}`
                                  :  `${currencyToWords(parseFloat(usdinput)).split(" ").slice(8).join(" ")}`
                          ) : ''}
                  </span>
                  ) :"" 
                }
              </div>
              <div className='mb-[6px]'>
                <p className='text-start text-[24px] h-[23px] text-slate-400 pt-[13px]'  style={{fontFamily:"khmerContent"}}>សំរាប់ការចំណាយ:</p>
                <div className='flex text-[20px]'>
                  <label className='text-[24px] text-slate-400 pt-[13px]'>For Payment of:</label>
                  <input className='outline-none border-dotted border-b-[3px] h-[40px] pt-[3px]  pl-[20px] w-[510px] border-slate-400 ml-1 text-[24px]' style={{background:"none",fontFamily:"khmerContent"}} type="text" value={paymentOf}/>
                </div>
              </div>
              {/********************************** */}
              <div className='flex mt-[16px]'>
              <div className='flex text-[24px] items-center '>
                <div className='text-slate-400'>Cash.</div>
                {checks === 'check' ? (
                    <Image className='w-[23px] h-[23px]' src="/tickblack.png" alt='#' width={23} height={23}/>
                  ) : (
                    <Image className='w-[23px] h-[23px]' src="/tickgrey.png" alt='#'  width={23} height={23}/>
                  )}
              </div>
              <div className='flex text-[24px] mx-[10px] items-center '>
                <div className='text-slate-400'>/E-Banking.</div>
                {checks === 'check1' ? (
                    <Image className='w-[23px] h-[23px]' src="/tickblack.png" alt='#'  width={23} height={23}/>
                  ) : (
                    <Image className='w-[23px] h-[23px]' src="/tickgrey.png" alt='#'  width={23} height={23}/>
                  )}
              </div>
              <div className='flex text-[24px] mx-[10px] items-center '>
                <div className='text-slate-400'>/Cheque.</div>
                {checks === 'check2' ? (
                    <Image className='w-[23px] h-[23px]' src="/tickblack.png"   alt='#'  width={23} height={23}/>
                  ) : (
                    <Image className='w-[23px] h-[23px]' src="/tickgrey.png"  alt='#'  width={23} height={23}/>
                  )}
              </div>
              <div className='flex text-[24px]'>
                <div className='text-slate-400'>No.</div>
                <div className='border-dotted border-b-[3px] border-slate-400 w-[241px] ml-1'></div>
              </div>
              </div>
              </div>
              {/*************************/}
              {/*************************/}
              <div className='flex justify-end ml-[30px] mt-[20px]'>
                  <div>
                    <div className='flex my-[20px] border-[2px] border-gray-400 h-[70px] bg-white'>
                      <p className=' h-[70px] text-[40px] text-center relative bottom-1 z-20 pl-[10px] font-bold pt-[8px]'>USD</p>
                    <input type="text" className='w-[290px] text-center text-[30px] font-bold outline-none bg-transparent' value={`${usdinput === "" ? "" : `$${usdinput}`}`}/>
                    </div>
                  <div className='border-dashed border-[2px] border-slate-300 bg-white w-[390px] pt-[10px] h-[200px]'>
                      <p className='text-center text-slate-400' style={{fontFamily:"khmerContent"}}>ហត្ថលេខាអ្នកទទួល / Receiver Signature</p>
                  </div>
                  </div>
              </div>
              {/*************************/}
            </div>
            {/***************************/}
              </div>
              <div className="bg-white h-[127.5px]">

              </div>
            </div>

           </div>
  )
}

export default Print