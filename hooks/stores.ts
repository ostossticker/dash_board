import { profile } from 'console';
import {create} from 'zustand'

type toggleVal = {
   
    isOpen: boolean;
    onOpen:() =>void;
    onClose:()=>void;
    toggle:()=>void; ////toggle 

    isHover:boolean;
    onCloseHover:()=>void;
    onOpenHover:()=>void; /////// hover

    links:string;
    changeLink:(newVal:string)=>void;/// changeLink in sidebar

    currentTime:Date;
    setCurrentTime:(newTime:Date)=>void;

    //toggle dark mode and light mode
    darkMode:boolean;
    toggleDarkMode:()=>void;
    initializeDarkModeFromLocalStorage:()=>void;

    pending:boolean; // for using globaly when need
    setPending:(toggle:boolean)=>void;

    passingId:string; // for edit datas with modal
    edit:boolean;
    onEdit:()=>void;
    onCancel:()=>void;
    setPassingId:(id:string)=>void;

    bgModal:string; //for big modal with split 
    setModal:(newString:string)=>void;

    ////print stuff
    printing:string;
    print:boolean;
    setPrint:(val:boolean)=>void;
    setPrinting:(val:string)=>void
    ////option menu
    logo:boolean;
    address:boolean;
    signature:boolean;
    employee:boolean;
    bankInfo:boolean;
    notification:boolean;
    enableNote:boolean;
    setLogo:()=>void;
    setAddr:()=>void;
    setSign:()=>void;
    setEmp:()=>void;
    setBankInfo:()=>void;
    setToggleLogo:(bool:boolean)=>void;
    setToggleAddr:(bool:boolean)=>void;
    setToggleSign:(bool:boolean)=>void;
    setToggleEmp:(bool:boolean)=>void;
    setToggleBankInfo:(bool:boolean)=>void;
    setNotifcation:()=>void;
    setValueNoti:(newString:boolean)=>void;
    setEnableNote:()=>void;
    setValueNote:(newString:boolean)=>void;
    ///switch 
    routerSwitch:string;
    setSwitch:(newString:string)=>void;

    /// receipt id
    recId:string;
    setRec:(newString:string)=>void

    ///quotation id 
    qtId:string;
    setQtid:(newString:string)=>void

    ////////profile setting
    profile:boolean;
    setProfile:()=>void;

    /////refresh
    refresh:boolean;
    setRefresh:()=>void;

    ///notiNum
    notiNum:number;
    setNotiNum:(num:number)=>void;

    ///enable telegram
    telegram:boolean;
    setTelegram:()=>void;


    ///pdf 
    pdf:string,
    setPdf:(newString:string)=>void;
}

const useToggle = create<toggleVal>((set)=>({
    enableNote:true,
    passingId:'',
    notification:false,
    edit:false,
    links:"",
    pending:false,
    isOpen:false,
    isHover:false,
    darkMode:false,
    bgModal:'',
    print:false,
    printing:'',
    routerSwitch:'invoice',
    recId:'',
    onOpen:()=>{
        set({ isOpen:true})
    },
    onClose:()=>{
        set({isOpen:false})
    },
    toggle:()=>{
        set((state)=>({
            isOpen: !state.isOpen,
        }));
    },
    onCloseHover:()=>{
        set({isHover:false})
    },
    onOpenHover:()=>{
        set({isHover:true})
    },
    setPending:(toggle)=>{
      set({pending:toggle})  
    },
    changeLink:(newVal:string)=>{
        set({
            links:newVal
        })
    },
    currentTime: new Date(),
    setCurrentTime:(newTime)=> {
        set({
            currentTime: newTime
        })
    },
    toggleDarkMode:() => set((state) =>{
      const newDarkMode = !state.darkMode;
      localStorage.setItem('darkMode',newDarkMode.toString());
      return{darkMode:newDarkMode}  
    }),
    initializeDarkModeFromLocalStorage:()=>{
        const storedTheme = localStorage.getItem('darkMode');
        if(storedTheme){
            set({
                darkMode:storedTheme === 'true'
            })
        }
    },

    //////// edit datas with modals 
    onEdit:()=>{
        set({edit:true})
    },
    onCancel:()=>{
        set({edit:false})
    },
    setPassingId:(id)=>{
        set({passingId:id})
    },
    
    ///////// bigmodal for split
    setModal:(newString)=>{
        set({bgModal:newString})
    },
    ////// print 
    setPrint:(val)=>{
        set({
            print:val
        });
    },
    /// description
    setPrinting:(val)=>{
        set({printing:val})
    },
    logo:false,
    address:false,
    signature:false,
    employee:false,
    bankInfo:false,
    setLogo:()=>{
        set((state)=>({
            logo:!state.logo
        }))
    },
    setAddr:()=>{
        set((state)=>({
            address:!state.address
        }))
    },
    setSign:()=>{
        set((state)=>({
            signature:!state.signature
        }))
    },
    setEmp:()=>{
        set((state)=>({
            employee:!state.employee
        }))
    },
    setBankInfo:()=>{
        set((state)=>({
            bankInfo:!state.bankInfo
        }))
    },
    ////setSwitch
    setSwitch:(newString)=>{
        set({
            routerSwitch:newString
        })
    },
    ///rec id
    setRec:(newString)=>{
        set({
            recId:newString
        })
    },
    ///////set toggle stuff 
    setToggleLogo:(bool)=>{
        set({
            logo:bool
        })
    },
    setToggleAddr:(bool)=>{
        set({
            address:bool
        })
    },
    setToggleBankInfo:(bool)=>{
        set({
            bankInfo:bool     
        })      
    },
    setToggleEmp:(bool)=>{
        set({
            employee:bool
        })
    },
    setToggleSign:(bool)=>{
        set({
            signature:bool
        })
    },
    ////quotation id 
    qtId:'',
    setQtid:(newString)=>{
        set({
            qtId:newString
        })
    },
    ////notification
    setNotifcation:()=>{
        set((state)=>({
            notification:!state.notification
        }))
    },
    setValueNoti:(newString)=>{
        set({
            notification:newString
        })
    },
    ////toggle note
    setEnableNote:()=>{
        set((state)=>({
            enableNote:!state.enableNote
        }))
    },
    setValueNote:(newString)=>{
        set({
            enableNote:newString
        })
    },
    ///////profile
    profile:false,
    setProfile:()=>{
        set((state)=>({
            profile:!state.profile
        }))
    },
    ////refresh
    refresh:false,
    setRefresh:()=>{
        set((state)=>({
            refresh:!state.refresh
        }))
    },
    ///notiNum
    notiNum:0,
    setNotiNum:(num)=>{
        set({
            notiNum:num
        })
    },
    ////enable telegram
    telegram:false,
    setTelegram:()=>{
        set((state)=>({
            telegram:!state.telegram
        }))
    },
    /////pdf
    pdf:'',
    setPdf:(newString)=>{
        set({
            pdf:newString
        })
    }
}))

export default useToggle