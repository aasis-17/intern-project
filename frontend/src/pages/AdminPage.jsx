import React from 'react'
import { useState } from "react";
import FormField from '../components/form/FormField.jsx';
import { useForm } from "react-hook-form"
import authService from '../services/authServices.js';

const AdminPage = () => {
    const [imagePreview, setImagePreview] = useState("")

    const {register ,handleSubmit} = useForm()
  
    const handlePreview = (e) => {
  
      const file = e.target.files[0];
      const reader = new FileReader();
   
     reader.onloadend = () => {
       setImagePreview(reader.result);  
     };
     if (file) {
       reader.readAsDataURL(file);
     } 
      // inputRef.current = file
      // e.target.value = null 
    }
  
    const onSubmit = async (data) => {
  
      try{
        const res = await authService.signup(data)
        console.log(res)
        const login = await authService.login(data)
        
      }catch(error){
        console.log(error.message)
      }
      
  
    };
  return (
   <div className='h-screen'>
        
         <form onSubmit={ handleSubmit(onSubmit) } className=" h-full relative flex flex-col justify-evenly ml-4">
          <div className='w-1/3 h-2/5 absolute right-10 top-10 rounded-3xl border-black border-2 overflow-hidden'>
            <img className=' object-cover h-full ' src={imagePreview} alt='avatar' />
          </div>
          <div className='text-3xl font-garamond font-medium'>Your Details</div>
          {/* Full Name */}
          <div className='w-1/2'>
          <FormField 
                labelClassName = "block text-sm font-medium text-gray-700"
                className = "mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                label = "Fullname"
                required
                placeholder = "Enter your name"
                {...register("fullname", {
                    required : true,
                })
            }
                />
          </div>

          {/* Username */}
          <div className='w-1/2'>
            <FormField
              label="Username:"  
              required
              placeholder="Choose a username"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("username",{required : true})}
            />
          </div>

          {/* Email */}
          <div className='w-1/2'>
             <FormField
              label="Email:"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("email",{required : true})}
            />
          </div>

          {/* Password */}
          <div className='w-1/2'>
            <FormField
              label="Password:"
              type="password"
              required
              placeholder="Create a password"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("password",{required : true})}
            />
          </div>
          <div className='flex '>

          {/* Gender */}
          <div className='w-1/2'>
            <label className="block text-sm font-medium text-gray-600">
              Gender
            </label>
            <select
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              {...register("gender",{required : "true"})}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

                    {/* Avatar */}
          <div className='ml-10'>
            <FormField
              label="Avatar:"
              type="file"
              onInput={(e) => handlePreview(e)}
              className="w-full mt-1"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("userAvatar")}
            />
          </div>
          </div>

          <div className='flex'>

          {/* Contact Number */}
          <div className='w-1/2'>
            <FormField
              label="Contact No:"
              type="tel"
              required
              placeholder="Enter your contact number"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              pattern="[7-9]{1}[0-9]{9}"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("contactNo",{required : true})}
            />
          </div>

          {/* Address */}
          <div className='ml-10 flex-1'>
            <label className="block text-sm font-medium text-gray-600">
              Address
            </label>
            <textarea
              placeholder="Enter your address"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"              
              {...register("address")}
            />
          </div> 
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>

        </form>

    </div>
  )
}

export default AdminPage