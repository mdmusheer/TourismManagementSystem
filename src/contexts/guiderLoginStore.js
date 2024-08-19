import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { GuiderLoginContext } from './guiderLoginContext'
import { useEffect } from 'react'
import { createContext } from "react";





function GuiderLoginStore({children}) {
    

    // let navigate=useNavigate()

    let [LoggedInGuider,setLoggedInGuider]=useState({})
    let [GuiderLoginErr,setGuiderLoginErr]=useState("")
    let [GuiderLoginStatus,setGuiderLoginStatus]=useState(false)
   

        // Load token and user details from local storage on initialization
  useEffect(() => {
    const token = localStorage.getItem('Guider-token');
    if (token) {
      setGuiderLoginStatus(true);
    }
    const storedUser = localStorage.getItem('GuiderDetails');
    if (storedUser) {
      setLoggedInGuider(JSON.parse(storedUser));
      setGuiderLoginStatus(true);
    }
  }, []);


    const GuiderLogoutUserFunc = () => {
        localStorage.removeItem('Guider-token');
        localStorage.removeItem("Guider-profile-details")
        localStorage.removeItem("GuiderDetails")
        localStorage.removeItem("profile-details")
        setLoggedInGuider({});
        setGuiderLoginStatus(false);
      };
    


    // func to make user login request
    const GuiderLoginuserFunc=(userCredintial)=>{
      
            console.log(userCredintial)
            axios.post("http://localhost:3500/guider-login",userCredintial)
            .then(res=>{
                console.log(res)
                if(res.data.message==='Valid user'){
                    console.log("Valid guider block")
                    console.log("Res is",res.data.message)
                    setGuiderLoginErr("")
                    setGuiderLoginStatus(true)
                    setLoggedInGuider(res.data.user)
                    console.log(res.data.user)
                    console.log("status:",GuiderLoginStatus)
                    console.log(LoggedInGuider)

                    const GuiderObject=res.data.user
                    localStorage.setItem('GuiderDetails', JSON.stringify(GuiderObject));
                    localStorage.setItem('Guider-profile-details',JSON.stringify(GuiderObject))
    
                    // Correctly parse the JSON string back to an object
                    // const obj = JSON.parse(localStorage.getItem('GuiderDetails'));
    
                    localStorage.setItem('Guider-token',res.data.token)
                    
                    console.log(res)
                    
                    console.log(res.data.user)
                   
                //    navigate("/guider-profile")
                   
                }
                else{
                    console.log("Guiderlogin failed",res.data.message)
                    setGuiderLoginErr(res.data.message)
                    
                }
            })
            .catch(err=>{
                console.log("error in Guiderlogin",err)
                setGuiderLoginErr(err)
            })

    }
  return(
    <GuiderLoginContext.Provider value={{LoggedInGuider,GuiderLoginStatus,GuiderLoginErr,GuiderLoginuserFunc,GuiderLogoutUserFunc}}>
    {/* <loginContext.Provider value={{loginuserFunc}}> */}

        {children}
    </GuiderLoginContext.Provider>
  )
}

export default GuiderLoginStore