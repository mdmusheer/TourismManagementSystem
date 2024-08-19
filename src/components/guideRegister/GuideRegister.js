import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./GuideRegister.css";

function GuideRegister() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  let [SelectedFile,setSelectedFile]=useState(null)
  const navigate = useNavigate();
  const [Err, setErr] = useState("");

  const GuiderHandler=()=>{
    navigate('/guider-login')
  }

  const createuser = (newuser) => {
    
    let fd=new FormData()
    // append new user object
    fd.append("user",JSON.stringify(newuser))
     // Extract the file from FileList
  const file = newuser.image[0]; // Use the first file in the FileList
  console.log("file is",file)
  if (!file) {
      console.error("File extraction failed");
  }
    // append file
    fd.append("photo",file)
    
    console.log(fd)

    console.log(newuser)
    axios.post("http://localhost:3500/guider-signup",fd)
    .then(response=>{
      console.log(response)
      if(response.status===201){
        setErr("")
        navigate('/guider-login')
      }
      else{
        setErr("User already exist")
      }
    })
    .catch(error=>(console.log(error)))
  }

  return (
    <div className='users' style={{marginTop:30}}>
      <h2 className="text-center">Trip Guider Registration</h2>
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
            <div className='mb-1 form-group'>
              <label htmlFor='image' className='form-label'>Select Profile Picture</label>
              <input type='file' id='image' className='form-control' {...register("image", { required: true })} />
              {errors.image?.type === "required" && <p className='text-danger'>* Image is required</p>}

            </div>
          
          <div className='text-center mt-3'>
          <button type='submit' className='btn btn-success text-center mb-2'>Register</button>
            {/* <span className='text-danger'> or </span>
            <button type='button' className='btn btn-warning text-center' onClick={()=>GuiderHandler()}>Login</button> */}
          </div>
          
          </form>
        </div>
      </div>
    </div>
  );
}

export default GuideRegister;
