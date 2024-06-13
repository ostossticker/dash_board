import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineArrowDropDown } from "react-icons/md";
import dynamic from 'next/dynamic';
import useToggle from '@/hooks/stores';
import axios from 'axios';
import { url } from '@/lib/url';
import ReactToPrint from 'react-to-print';
import { IoPrintOutline } from "react-icons/io5";
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMediaQuery } from 'react-responsive';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });


type valProps = {
    createdAt:string;
    balance:number;
}

type Idem = {
  customer: number;
  quotation: number;
  invoice: number;
  sales: number;
  partial: number;
  unpaid: number;
  paid: number;
  expense: number;
}
type dataItem = {
    month: string;
    arr: Idem[];
}

type textContent = {
    startMonth:string,
    endMonth:string
}



const Charts = () => {
    const months = [
      "null", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
    const date = new Date()
    const user = useCurrentUser()
    const { isOpen, isHover, darkMode} = useToggle();
    const printableComponent = useRef<any>()
    const printableChart = useRef<any>()
    const [data , setData] = useState<valProps[]>([])
    const [printData , setPrintdata] = useState<dataItem[]>([])
    const [seriesData, setSeriesData] = useState<any>([]);
    const [startYear, setStartYear] = useState('');
    const [choose , setChoose] = useState<string>('Chart')
    
    const [startMonth, setStartMonth] = useState(1);
    const [endYear, setEndYear] = useState(`${date.getFullYear()}`);
    const [endMonth, setEndMonth] = useState(12);
    const [textContent , setTextContent] = useState<textContent>({
        startMonth: months[date.getMonth()], // Adjust index to start from 0
        endMonth: months[date.getMonth()]
    })
   

    const fetchData = async () => {
        try {
            const response = await axios.get(`${url}/api/chart`);
            setData(response.data);
            if(response.data){
                filterData(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    let testVal = startYear && endYear ? endYear : startYear ? startYear : endYear ? endYear : ''
    const fetchData1 = async () =>{
        try{
            const {data} = await axios.get(`${url}/api/print?email=${user.id}&filterYear=${testVal}&startMonth=${startMonth}&endMonth=${endMonth}`)
            setPrintdata(data)
        }catch(error){
            console.error('Error fetching data:', error);
        }
    }

    const generateMonthRange = (start: number, end: number) => {
        const months = [];
        for (let i = start; i <= end; i++) {
            months.push(new Date(2000, i - 1).toLocaleDateString('en-US', { month: 'short' })); // Subtracting 1 to match month index
        }
        return months;
    };

    const filterData = (data:any[]) => {
        let series: any[] = [];
            const startMonthIndex = startMonth - 1;
            const endMonthIndex = endMonth - 1;
    
            // Generate the range of months based on the start and end dates
            const monthsInRange: string[] = [];
            for (let i = startMonthIndex; i <= endMonthIndex; i++) {
                monthsInRange.push(new Date(parseInt(!startYear ? endYear : startYear), i).toLocaleDateString('en-US', { month: 'short' }));
            }
                series.push({
                    name: !startYear ? endYear : startYear,
                    data: monthsInRange.map(month => {
                        const monthData = data.find(item => {
                            const itemDate = new Date(item.createdAt);
                            const itemYear = itemDate.getFullYear();
                            return itemYear === parseInt(!startYear ? endYear : startYear) && month === itemDate.toLocaleDateString('en-US', { month: 'short' });
                        });
                        return monthData ? monthData.balance : 0;
                    })
                })
            if(startYear && endYear){
                series.push({
                    name: endYear,
                    data: monthsInRange.map(month => {
                        const monthData = data.find(item => {
                            const itemDate = new Date(item.createdAt);
                            const itemYear = itemDate.getFullYear();
                            return itemYear === parseInt(endYear) && month === itemDate.toLocaleDateString('en-US', { month: 'short' });
                        });
                        return monthData ? monthData.balance : 0;
                    })
                });
            }
            
    
            setSeriesData(series)
        
    };
    
    useEffect(()=>{
        fetchData()
    },[])
    

    useEffect(() => {
        fetchData1()
        fetchData()
    }, [startYear, startMonth, endYear, endMonth]);

    const options = {
        chart: {
            toolbar: {
                show: false
            },
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top', // top, center, bottom
              style:{
                fontSize:'10px'
              }
            },
          }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val:number) {
              return "$" + val.toFixed(2);
            },
            offsetY: -20,
            style: {
              fontSize: '10px',
              colors: ["#304758"]
            }
        },
        markers: {
            size: 5,
            colors: ["#44b1f7", "#F04846"],
            strokeColor: ["#d8efff", "#F04846"],
            strokeWidth: 3
        },
        xaxis: {
            categories:generateMonthRange(startMonth, endMonth),
            labels: {
                style: {
                    fontSize: '10px',
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '10px',
                },
            },
            formatter: function (val:number) {
                return "$" + val.toFixed(2);
              },
        },
        legend: {
            marginTop:'8px',
            fontSize:'10px',
        },
        colors: ["#005D85","#F04846"]
    };

    const options1 = {
        chart: {
            toolbar: {
                show: false
            },
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top', // top, center, bottom
              style:{
                fontSize:'6px'
              }
            },
          }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val:number) {
              return "$" + val.toFixed(2);
            },
            offsetY: -20,
            style: {
              fontSize: '6px',
              colors: ["#304758"]
            }
        },
        markers: {
            size: 5,
            colors: ["#44b1f7", "#F04846"],
            strokeColor: ["#d8efff", "#F04846"],
            strokeWidth: 3
        },
        xaxis: {
            categories:generateMonthRange(startMonth, endMonth),
            labels: {
                style: {
                    fontSize: '8px',
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '6px',
                },
            },
            formatter: function (val:number) {
                return "$" + val.toFixed(2);
              },
        },
        legend: {
            marginTop:'6px',
            fontSize:'8px',
        },
        colors: ["#005D85","#F04846"]
    };

    const thead = 'px-[8px]  bg-mainBlue text-white'

    const monthData = [
       0, 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 , 11 ,12
    ]

    const sumCustomerValues = () => {
        return printData.reduce((total, item) => {
          return total + item.arr.reduce((subtotal, idem) => subtotal + idem.customer, 0);
        }, 0);
      };
    
      const sumQuotation = () =>{
        return printData.reduce((total, item) => {
          return total + item.arr.reduce((subtotal, idem) => subtotal + idem.quotation, 0);
        }, 0);
      }
    
      const sumInvoice = () =>{
        return printData.reduce((total, item) => {
          return total + item.arr.reduce((subtotal, idem) => subtotal + idem.invoice, 0);
        }, 0);
      }
    
      const sumSale = () =>{
        return printData.reduce((total, item) => {
          return total + item.arr.reduce((subtotal, idem) => subtotal + idem.sales, 0);
        }, 0);
      }
    
      const sumPartial = () =>{
        return printData.reduce((total, item) => {
          return total + item.arr.reduce((subtotal, idem) => subtotal + idem.partial, 0);
        }, 0);
      }
      
      const sumUnpaid = () =>{
        return printData.reduce((total, item) => {
          return total + item.arr.reduce((subtotal, idem) => subtotal + idem.unpaid, 0);
        }, 0);
      }
    
      const sumPaid = () =>{
        return printData.reduce((total, item) => {
          return total + item.arr.reduce((subtotal, idem) => subtotal + idem.paid, 0);
        }, 0);
      }
    
      const sumExpense = () =>{
        return printData.reduce((total, item) => {
          return total + item.arr.reduce((subtotal, idem) => subtotal + idem.expense, 0);
        }, 0);
      }

    return (
        <>
        <div className={`${darkMode ? "bg-dark-box-color" : "bg-white"} col-span-3 rounded-lg px-[30px] pb-[10px] shadow-md w-full`}>
            <div className='flex items-center pt-[30px] justify-between'>
                <h1 className={`xl:text-[25px] lg:text-[16px] ${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"}`}>Summary Sales</h1>
                <div className='flex gap-5'>

                    <div className='flex justify-center items-start gap-3'>
                        <ReactToPrint
                            trigger={()=>(
                                <div className={`cursor-pointer ${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"}`}>
                                    <IoPrintOutline className='xl:w-[20px] xl:h-[20px] lg:w-[15px] lg:h-[15px]'/>
                                </div>
                            )}
                            content={()=>choose === 'Report' ? printableComponent.current : printableChart.current}
                            pageStyle={`@page {size: A5 landscape; margin: ${choose === 'Report' ? "" : "20px"};}`}
                        />
                        <div className='flex items-center'>
                        <select value={choose} className={`bg-transparent ${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"} outline-none xl:text-[15px] lg:text-[13px]`} onChange={(e)=>setChoose(e.target.value)}>
                            <option className='text-black'>Report</option>
                            <option className='text-black'>Chart</option>
                        </select>
                        <MdOutlineArrowDropDown color={darkMode ? "#F0F7FF" : ""} />
                        </div>
                    </div>

                    <div className='flex'>
                        <div>
                            <div className='flex items-center'>
                                <select className={`${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"} xl:text-[15px] lg:text-[13px] text-center bg-transparent outline-none`} value={startMonth} onChange={(e)=>{setStartMonth(parseInt(e.target.value)) , setTextContent({...textContent , startMonth:e.target.options[e.target.selectedIndex].textContent || ''})}}>
                                    {
                                        monthData.map((item)=>{
                                            return(
                                                <option className='text-black' key={crypto.randomUUID()} value={item}>{months[item]}</option>
                                            )
                                        })
                                    }
                                </select>
                                <MdOutlineArrowDropDown color={darkMode ? "#F0F7FF" : ""} />
                            </div>
                            <input type="text" value={startYear} placeholder='year' onChange={(e)=>setStartYear(e.target.value)} className="text-[#1a3158] text-center w-[90px] xl:text-[15px] lg:text-[13px] outline-none" style={darkMode ? { backgroundColor: "#262B49", color: "#F0F7FF" } : {}}/>
                        </div>
                    </div>
                    <div className='flex'>
                        <label className={`${darkMode ? "text-dark-sm-color" : "text-[#a6afc7]"} pr-3 xl:text-[19px] lg:text-[13px]`}>to</label>
                        <div>
                            <div className='flex items-center'>
                            <select className={`${darkMode ? "text-dark-lg-color" : "text-[#1a3158]"} xl:text-[15px] lg:text-[13px] text-center bg-transparent outline-none`} value={endMonth} onChange={(e)=>{setEndMonth(parseInt(e.target.value)) , setTextContent({...textContent , endMonth:e.target.options[e.target.selectedIndex].textContent || ''})}}>
                                    {
                                        monthData.map((item)=>{
                                            return(
                                                <option className='text-black' key={crypto.randomUUID()} value={item}>{months[item]}</option>
                                            )
                                        })
                                    }
                                </select>
                                <MdOutlineArrowDropDown color={darkMode ? "#F0F7FF" : ""} />
                            </div>
                            <input type="text" value={endYear} placeholder='year' onChange={(e)=>setEndYear(e.target.value)} className="text-[#1a3158] xl:text-[15px] lg:text-[13px] text-center w-[90px] outline-none" style={darkMode ? { backgroundColor: "#262B49", color: "#F0F7FF" } : {}}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${isOpen || isHover ? "xl:h-[373px] lg:h-[195px]" : "xl:h-[400px] lg:h-[235px]"}`}>
            <Chart  type="bar" options={options} series={seriesData} height={"100%"} width={"100%"} />
            </div>
            
           
        </div>
        <div className='hidden absolute'>
            <div ref={printableComponent} className=' bg-white h-[520px]'>
                    <div className='text-end text-[20px] pr-[10px] mb-[15px]'>
                        <h1 className='text-[23px] font-bold leading-8'>REPORT SALE FROM YEAR {testVal}</h1>
                        <p>{textContent.startMonth} to {textContent.endMonth}</p>
                    </div>
                <div className='flex justify-center'>
                <table className='border-[1px] border-black'>
                    <thead>
                        <tr>
                            <th className={`${thead} border-r-[1px] border-black`}><div className='px-[1.2px] text-[11px] '>No.</div></th>
                            <th className={`${thead} border-r-[1px] border-black`}><div className='px-[1.2px] text-[11px] w-[55px]'>Date</div></th>
                            <th className={`${thead} border-r-[1px] border-black`}><div className='px-[1.2px] text-[11px] w-[55px]'>Customer</div></th>
                            <th className={`${thead} border-r-[1px] border-black`}><div className='px-[1.2px] text-[11px] w-[55px]'>Quotation</div></th>
                            <th className={`${thead} border-r-[1px] border-black`}><div className='px-[1.2px] text-[11px] w-[55px]'>Invoice</div></th>
                            <th className={`${thead} border-r-[1px] border-black`}><div className='px-[1.2px] text-[11px] w-[55px]'>Sale</div></th>
                            <th className={`${thead} border-r-[1px] border-black`}><div className='px-[1.2px] text-[11px] w-[56px]'>Partial Bill</div></th>
                            <th className={`${thead} border-r-[1px] border-black`}><div className='px-[1.2px] text-[11px] w-[55px]'>Unpaid</div></th>
                            <th className={`${thead} border-r-[1px] border-black`}><div className='px-[1.2px] text-[11px] w-[55px]'>Paid</div></th>
                            <th className={thead}><div className='px-[1.2px] text-[11px] w-[55px]'>Expense</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {printData.map((item, i) => (
                            <tr key={crypto.randomUUID()} className={i % 2 === 0 ? ' bg-white ' : 'bg-gray-200'}>
                            <td className='text-center border-r-[1px] border-black text-[11px]'>{i + 1}</td>
                            <td className='text-center border-r-[1px] border-black text-[11px]'>{item.month}</td>
                                {item.arr.map((idem, index) => (
                                <React.Fragment key={index}>
                                <td className='text-center border-r-[1px] border-black text-[11px]'>{idem.customer}</td>
                                <td className='text-center border-r-[1px] border-black text-[11px]'>{idem.quotation}</td>
                                <td className='text-center border-r-[1px] border-black text-[11px]'>{idem.invoice}</td>
                                <td className='text-end border-r-[1px] border-black text-[11px]'><div className='pr-[10px]'>${idem.sales.toFixed(2)}</div></td>
                                <td className='text-end border-r-[1px] border-black text-[11px]'><div className='pr-[10px]'>${idem.partial.toFixed(2)}</div></td>
                                <td className='text-end border-r-[1px] border-black text-[11px]'><div className='pr-[10px]'>${idem.unpaid.toFixed(2)}</div></td>
                                <td className='text-end border-r-[1px] border-black text-[11px]'><div className='pr-[10px]'>${idem.paid.toFixed(2)}</div></td>
                                <td className='text-end text-[11px]'><div className='pr-[10px]'>${idem.expense.toFixed(2)}</div></td>
                                </React.Fragment>
                            ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className={`${thead} border-r-[1px] border-black`}></td>
                            <td className={`${thead} text-center text-[11px] border-r-[1px] font-bold border-black`}>Total</td>
                            <td className={`${thead} text-center text-[11px] border-r-[1px] font-bold border-black`}>{sumCustomerValues()}</td>
                            <td className={`${thead} text-center text-[11px] border-r-[1px] font-bold border-black`}>{sumQuotation()}</td>
                            <td className={`${thead} text-center text-[11px] border-r-[1px] font-bold border-black`}>{sumInvoice()}</td>
                            <td className={`${thead} text-end text-[11px] border-r-[1px] font-bold border-black`}>${sumSale().toFixed(2)}</td>
                            <td className={`${thead} text-end text-[11px] border-r-[1px] font-bold border-black`}>${sumPartial().toFixed(2)}</td>
                            <td className={`${thead} text-end text-[11px] border-r-[1px] font-bold border-black`}>${sumUnpaid().toFixed(2)}</td>
                            <td className={`${thead} text-end text-[11px] border-r-[1px] font-bold border-black`}>${sumPaid().toFixed(2)}</td>
                            <td className={`${thead} text-end text-[11px] font-bold`}>${sumExpense().toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
                </div>
            </div>
        </div>
        <div className='absolute invisible'>
                <div ref={printableChart} className='bg-white h-[520px]'>
                <div className='text-end text-[20px] pr-[10px] pt-[20px]'>
                        <h1 className='text-[23px] font-bold leading-8'>REPORT SALE FROM {startYear} TO {endYear}</h1>
                        <p>{textContent.startMonth} to {textContent.endMonth}</p>
                </div>
                <Chart  type="bar" options={options1} series={seriesData} height={"250px"} width={"750px"}/>
                </div>
            </div>
        </>
    );
};

export default Charts;
