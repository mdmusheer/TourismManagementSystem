import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import UserProfile from '../userProfile/UserProfile';
import { Outlet, useNavigate } from 'react-router-dom';
import { loginContext } from '../../contexts/logincontext'; // Import the login context
import { useEffect } from 'react';
import "./Login.css";
import UserLoginStore from '../../contexts/UserLoginStore';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  let [SelectedFile,setSelectedFile]=useState(null)
  const navigate = useNavigate();
  const [Err, setErr] = useState("");
  const { LoggedinUser, userLoginStatus, loginErr, loginuserFunc, logoutUserFunc  } = useContext(loginContext);

  const GuideHandler=()=>{
    navigate('/guider-login')
  }

  const createuser = async (newuser) => {
    try {
      console.log("in User login page")     
      console.log(loginuserFunc)
      console.log(loginErr)
      console.log(LoggedinUser)
      console.log(userLoginStatus)
      await loginuserFunc(newuser);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  useEffect(() => {
    console.log("In use effect for checking navigation to user profile")
    console.log(loginuserFunc)
    console.log(loginErr)
    console.log(userLoginStatus)
    if (userLoginStatus) {
      navigate("/user-profile");
    } else if (loginErr) {
      setErr(loginErr);
    }
  }, [userLoginStatus, loginErr, navigate]);

  return (
    <div className='users' style={{marginTop:30}}>
      <h2 className="text-center">User Login</h2>
      <h2 className='text-warning text-center'>{Err}</h2>
      <div className='row'>
        <div className='col-11 col-sm-8 col-md-6 mx-auto'>
          <form onSubmit={handleSubmit(createuser)}>
            <div className='mb-1 form-group'>
              <label htmlFor='name' className='form-label'>Name</label>
              <input type='text' id='name' className='form-control' placeholder='Username' {...register("name", { required: true })} />
              {errors.name?.type === "required" && <p className='text-danger'>* Name is required</p>}
            </div>
            <div className='mb-1 form-group'>
              <label htmlFor='password' className='form-label'>Password</label>
              <input type='password' id='password' placeholder='Password' className='form-control' {...register("password", { required: true })} />
              {errors.password?.type === "required" && <p className='text-danger'>* Password is required</p>}
            </div>

            <div className='mb-1 form-group'>
              <label htmlFor='Email' className='form-label'>Email</label>
              <input type='text' id='Email' placeholder='Email' className='form-control' {...register("Email", { required: true })} />
              {errors.Email?.type === "required" && <p className='text-danger'>* Email is required</p>}
            </div>
            
           
            <button type='submit' className='btn btn-warning text-center mt-2'>Login</button>
            
            <span className='text-danger'> or </span>
             <br></br>
         <button type='button' className='btn btn-success text-center mt-2' onClick={()=>GuideHandler()}>Login as Guider</button>
    
          </form>
        </div>
      </div> 

    </div>
  );
}

export default Login;
