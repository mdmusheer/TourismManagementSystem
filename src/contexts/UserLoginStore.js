import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { loginContext } from './logincontext'
import { useEffect } from 'react'


import { createContext } from "react";




function UserLoginStore({children}) {
    

    // let navigate=useNavigate()

    let [LoggedinUser,setLoggedinUser]=useState({})
    let [loginErr,setloginErr]=useState("")
    let [userLoginStatus,setStatus]=useState(false)
   

        // Load token and user details from local storage on initialization
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setStatus(true);
    }
    const storedUser = localStorage.getItem('LoggedinUser');
    if (storedUser) {
      setLoggedinUser(JSON.parse(storedUser));
      setStatus(true);
    }
  }, []);


    const logoutUserFunc = () => {
        localStorage.removeItem('token');
        localStorage.removeItem("profile-details")
        localStorage.removeItem("user")
        setLoggedinUser({});
        setStatus(false);
      };
    


    // func to make user login request
    const loginuserFunc=(userCredintial)=>{
        console.log(userCredintial)
        axios.post("http://localhost:3500/user-login",userCredintial)
        .then(res=>{
            console.log(res)
            if(res.data.message==='Valid user'){
                console.log("Valid user block")
                console.log("Res is",res.data.message)
                setloginErr("")
                setStatus(true)
                setLoggedinUser(res.data.user)
                console.log(res.data.user)
                console.log("status:",userLoginStatus)
                console.log(LoggedinUser)
                // save to local storage
                // localStorage.setItem('user',res.data.user)
                // Correctly serialize the user object to a JSON string
                const userObject=res.data.user
                localStorage.setItem('user', JSON.stringify(userObject));
                localStorage.setItem('profile-details',JSON.stringify(userObject))

                // Correctly parse the JSON string back to an object
                const obj = JSON.parse(localStorage.getItem('user'));

                localStorage.setItem('token',res.data.token)
            //    navigate("/userprofile")
               
            }
            else{
                console.log("login failed",res.data.message)
                setloginErr(res.data.message)
            }
        })
        .catch(err=>{
            console.log("error in login",err)
        })


    }
  return(
    <loginContext.Provider value={{LoggedinUser,userLoginStatus,loginErr,loginuserFunc,logoutUserFunc}}>
    {/* <loginContext.Provider value={{loginuserFunc}}> */}

        {children}
    </loginContext.Provider>
  )
}

export default UserLoginStore
