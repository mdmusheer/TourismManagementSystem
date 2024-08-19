import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Login from '../login/Login';
import "./Register.css";

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  let [SelectedFile,setSelectedFile]=useState(null)
  const navigate = useNavigate();
 
  const [Err, setErr] = useState("");

  const GuideHandler=()=>{
    navigate('/guide-register')
  }

  const createuser = async (newuser) => {
    console.log("In create user func");
      // Ensure the file is extracted from the FormData object
      const { name, password, Email, image } = newuser;
     console.log("image is",image)
     setSelectedFile(newuser.image[0]); // Assuming you only want the first file
     console.log("selected file is",SelectedFile)
     // Ensure newuser.image is a FileList and has files
    if (!newuser.image || newuser.image.length === 0) {
      console.error("No file selected");  
  }
  // Extract the file from FileList
  const file = newuser.image[0]; // Use the first file in the FileList
  console.log("file is",file)
  if (!file) {
      console.error("File extraction failed");
    
  }
  console.log(newuser)

    const fd = new FormData();
    fd.append("user", JSON.stringify(newuser));
    fd.append("photo", file);

     // Log FormData entries for debugging
     for (let [key, value] of fd.entries()) {
      console.log(key, value);
  }
  
    try {
      const response = await axios.post("http://localhost:3500/user-signup", fd);
  
      if (response.status === 201) {
        setErr(""); // Clear any previous error
        navigate('/Login');
      } else {
        setErr("User already exists");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setErr("An error occurred while creating the user.");
    }
  };
  return (
    <div className='users' style={{marginTop:30}}>
      <h2 className="text-center">User Registration</h2>
      <h2 className='text-warning text-center'>{Err}</h2>
      <div className='row'>
        <div className='col-11 col-sm-8 col-md-6 mx-auto'>
          <form onSubmit={handleSubmit(createuser)}>
            {/* <div className='mb-1 form-group'>
              <label htmlFor='name' className='form-label'>Name</label>
              <input type='text' id='name' className='form-control' placeholder='Username' {...register("name", { required: true })} />
              {errors.name?.type === "required" && <p className='text-danger'>* Name is required</p>}
            </div> */}
              <div className='mb-1 form-group'>
              <label htmlFor='name' className='form-label'>Name</label>
              <input
                type='text'
                id='name'
                className='form-control'
                placeholder='Username'
                {...register("name", { required: true, minLength: 4 })}
              />
              {errors.name?.type === "required" && <p className='text-danger'>* Name is required</p>}
              {errors.name?.type === "minLength" && <p className='text-danger'>* Name must be at least 4 characters</p>}
            </div>
            {/* <div className='mb-1 form-group'>
              <label htmlFor='password' className='form-label'>Password</label>
              <input type='password' id='password' placeholder='Password' className='form-control' {...register("password", { required: true })} />
              {errors.password?.type === "required" && <p className='text-danger'>* Password is required</p>}
            </div> */}

              <div className='mb-1 form-group'>
              <label htmlFor='password' className='form-label'>Password</label>
              <input
                type='password'
                id='password'
                placeholder='Password'
                className='form-control'
                {...register("password", { required: true, minLength: 6 })}
              />
              {errors.password?.type === "required" && <p className='text-danger'>* Password is required</p>}
              {errors.password?.type === "minLength" && <p className='text-danger'>* Password must be at least 6 characters</p>}
            </div> 

            <div className='mb-1 form-group'>
              <label htmlFor='mobile' className='form-label'>Mobile Number</label>
                <input
                      type='number'
                      id='mobile'
                      placeholder='Mobile Number'
                      className='form-control'
                      {...register("mobile", { required: true, minLength: 10, maxLength: 10 })}
                 />
             {errors.mobile?.type === "required" && <p className='text-danger'>* Mobile number is required</p>}
            {(errors.mobile?.type === "minLength" || errors.mobile?.type === "maxLength") &&  <p className='text-danger'>* Mobile number must be 10 digits</p>}
            </div>    


            <div className='mb-1 form-group'>
              <label htmlFor='Email' className='form-label'>Email</label>
              <input type='email' id='Email' placeholder='Email' className='form-control' {...register("Email", { required: true })} />
              {errors.Email?.type === "required" && <p className='text-danger'>* Email is required</p>}
            </div>
            <div className='mb-1 form-group'>
              <label htmlFor='image' className='form-label'>Select Profile Picture</label>
              <input type='file' id='image' className='form-control' {...register("image", { required: true })} />
              {errors.image?.type === "required" && <p className='text-danger'>* Image is required</p>}
            

            </div>
          
            <button type='submit' className='btn btn-warning text-center mt-2'>Register</button>
           
            <span className='text-danger'> or </span> <br></br>
            <button type='button' className='btn btn-success text-center mt-2' onClick={()=>GuideHandler()}>Register as Guider</button>
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;













// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Login from '../login/Login';
// import "./Register.css";

// function Register() {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   let [SelectedFile,setSelectedFile]=useState(null)
//   const navigate = useNavigate();
 
//   const [Err, setErr] = useState("");

//   const GuideHandler=()=>{
//     navigate('/guide-register')
//   }

//   const createuser = async (newuser) => {
//     console.log("In create user func");
//       // Ensure the file is extracted from the FormData object
//       const { name, password, Email, image } = newuser;
//      console.log("image is",image)
//      setSelectedFile(newuser.image[0]); // Assuming you only want the first file
//      console.log("selected file is",SelectedFile)
//      // Ensure newuser.image is a FileList and has files
//     if (!newuser.image || newuser.image.length === 0) {
//       console.error("No file selected");  
//   }
//   // Extract the file from FileList
//   const file = newuser.image[0]; // Use the first file in the FileList
//   console.log("file is",file)
//   if (!file) {
//       console.error("File extraction failed"); 
//   }
//   console.log(newuser)

//     const fd = new FormData();
//     fd.append("user", JSON.stringify(newuser));
//     fd.append("photo", file);

//      // Log FormData entries for debugging
//      for (let [key, value] of fd.entries()) {
//       console.log(key, value);
//   }
  
//     try {
//       const response = await axios.post("http://localhost:3500/user-signup", fd);
  
//       if (response.status === 201) {
//         setErr(""); // Clear any previous error
//         navigate('/Login');
//       } else {
//         setErr("User already exists");
//       }
//     } catch (error) {
//       console.error("Error creating user:", error);
//       setErr("An error occurred while creating the user.");
//     }
//   };
//   return (
//     <div className='users' style={{marginTop:30}}>
//       <h2 className="text-center">User Registration</h2>
//       <h2 className='text-warning text-center'>{Err}</h2>
//       <div className='row'>
//         <div className='col-11 col-sm-8 col-md-6 mx-auto'>
//           <form onSubmit={handleSubmit(createuser)}>
//             <div className='mb-1 form-group'>
//               <label htmlFor='name' className='form-label'>Name</label>
//               <input type='text' id='name' className='form-control' placeholder='Username' {...register("name", { required: true })} />
//               {errors.name?.type === "required" && <p className='text-danger'>* Name is required</p>}
//             </div>
//             <div className='mb-1 form-group'>
//               <label htmlFor='password' className='form-label'>Password</label>
//               <input type='password' id='password' placeholder='Password' className='form-control' {...register("password", { required: true })} />
//               {errors.password?.type === "required" && <p className='text-danger'>* Password is required</p>}
//             </div>

//             <div className='mb-1 form-group'>
//               <label htmlFor='Email' className='form-label'>Email</label>
//               <input type='email' id='Email' placeholder='Email' className='form-control' {...register("Email", { required: true })} />
//               {errors.Email?.type === "required" && <p className='text-danger'>* Email is required</p>}
//             </div>
//             <div className='mb-1 form-group'>
//               <label htmlFor='image' className='form-label'>Select Profile Picture</label>
//               <input type='file' id='image' className='form-control' {...register("image", { required: true })} />
//               {errors.image?.type === "required" && <p className='text-danger'>* Image is required</p>}
            

//             </div>
          
//             <button type='submit' className='btn btn-warning text-center mt-2'>Register</button>
           
//             <span className='text-danger'> or </span> <br></br>
//             <button type='button' className='btn btn-success text-center mt-2' onClick={()=>GuideHandler()}>Register as Guider</button>
            
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;
