import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { useEffect } from 'react';
import GuiderLoginStore from '../../contexts/guiderLoginStore';
import { GuiderLoginContext } from '../../contexts/guiderLoginContext';
import GuiderProfile from '../guiderProfile/GuiderProfile';
import "./GuiderLogin.css";

function GuiderLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  let [SelectedFile,setSelectedFile]=useState(null)
  const navigate = useNavigate();
  const [Err, setErr] = useState("");
  const [data,setdata]=useState(null)

  const {LoggedInGuider,GuiderLoginStatus,GuiderLoginErr,GuiderLoginuserFunc,GuiderLogoutUserFunc}=useContext(GuiderLoginContext)
  
  const createuser = async (newuser) => {
    try {
      console.log("in Guider login page")     
      console.log(GuiderLoginuserFunc)
      console.log(GuiderLoginErr)
      console.log(LoggedInGuider)
      console.log(GuiderLoginStatus)
      await GuiderLoginuserFunc(newuser);
    } catch (error) {
      setErr(GuiderLoginErr)
      console.error("Error logging in:", error);
    }
  };


  useEffect(() => {
    console.log("In use effect for checking navigation to guider profile")
    console.log(GuiderLoginuserFunc)
    console.log(GuiderLoginErr)
    console.log(GuiderLoginStatus)
    if (GuiderLoginStatus) {
      navigate("/guider-profile");
    } else if (GuiderLoginErr) {
      setErr(GuiderLoginErr);
    }
  }, [GuiderLoginStatus, GuiderLoginErr, navigate]);

  return (
    <div className='users' style={{marginTop:30}}>
      <h2 className="text-center">Guider Login</h2>
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
           
            <br></br>
           
            <button type='submit' className='btn btn-warning text-center'>Login</button>
            
          </form>
        
        
        </div>
      </div>
    </div>
  );
}

export default GuiderLogin;
