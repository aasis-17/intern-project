import React, { useContext } from 'react'
import { useState } from "react";
import FormField from '../../components/form/FormField.jsx';
import { useForm } from "react-hook-form"
import authService from '../../services/authServices.js';
import { useLocation } from 'react-router';
import { AuthContext } from '../../store/authContext.jsx';
import Button from '../../components/Button.jsx';
import { useMutation } from '@tanstack/react-query';
import userService from '../../services/userService.js';
import TextField from '../../components/form/TextField.jsx';

const User = ({option}) => {

  const [imagePreview, setImagePreview] = useState("")
  const [visible, setVisible] =useState(false)

  const {register ,handleSubmit} = useForm()
  // const {option} = useLocation()
  const authContext = useContext(AuthContext)
  const userDetails = authContext.state.userData
  console.log(option)

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

  const mutation = useMutation({
    mutationFn : async(data) => {
      if(option === "setting"){
        await userService.updateUserInfo(data)
      }else{
        await authService.signup(data)
        await authService.login(data)
      }
    },
    onSuccess : () => {
      if(option !== "setting")  alert("User signup successfully!!")
     
      else alert("User info updated successfully!!")
    },
    onError : () => {
      if(option !== "setting")  alert("Error while signing user!!")
     
        else alert("Error while updating details!!")
    }
  })
  // const onSubmit = async (data) => {

  //   try{
  //     const res = await authService.signup(data)
  //     console.log(res)
  //     const login = await authService.login(data)
      
  //   }catch(error){
  //     console.log(error.message)
  //   }
    

  // };
  return (
    <div className='h-screen bg-white p-6 rounded-lg shadow-md'>

        
         <form onSubmit={ handleSubmit(mutation.mutateAsync) } className=" h-full relative flex flex-col justify-evenly ml-4">

          {option !== "setting" && (
          <div className=' absolute right-10 top-20  w-1/3 h-2/5'>
          <div className='border-black border-2 w-full h-full rounded-3xl overflow-hidden'>
          <img className=' object-cover  ' src={imagePreview} alt='avatar' />
          </div>
          {/* Avatar */}
          <div >
            <FormField
              label="Select Avatar"
              type="file"
              onInput={(e) => handlePreview(e)}
              className="hidden"
              labelClassName="block text-md bg-gray-300 text-center mt-4 cursor-pointer hover:bg-gray-400 py-2 rounded-lg font-medium text-gray-600"
              {...register("userAvatar")}
            />
          </div>
          </div>
          )}
          <div className='flex justify-between'>
          <h1 className='text-3xl font-garamond font-medium'>{option === "setting" ? "Basic Details" : "Your Details"}</h1>
          <Button
          children={visible ? "Cancel" : "Edit"}
          onClick={()=> setVisible(prev => !prev)}
          size='sm'
          className={` w-16 ${visible ? "bg-red-400 hover:bg-red-500" : ""} `}
          variant='secondary'
          />
          </div>
          

          {/* Full Name */}
          <div className='w-1/2'>
          <FormField 
                defaultValue={userDetails?.fullname}
                readOnly={!visible}
                labelClassName = "block text-sm font-medium text-gray-700"
                label = "Fullname"
                required
                className="w-full"
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
            defaultValue={userDetails?.username}
              label="Username:"  
              readOnly={!visible}
              required
              className="w-full"
              placeholder="Choose a username"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("username",{required : true})}
            />
          </div>

          {/* Email */}
          <div className='w-1/2'>
             <FormField
             defaultValue={userDetails?.email}
              label="Email:"
              readOnly={!visible}
              type="email"
              required
              className="w-full"
              placeholder="Enter your email"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("email",{required : true})}
            />
          </div>
          {option !== "setting" && (
            
          <div className='w-1/2'>
          <FormField
            label="Password:"
            type="password"
            required
            className="w-full"
            placeholder="Create a password"
            labelClassName="block text-sm font-medium text-gray-600"
            {...register("password",{required : true})}
          />
        </div>
          )}


          <div className='flex '>

          {/* Gender */}
          <div className='w-1/2'>
            <label className="block text-sm font-medium text-gray-600">
              Gender
            </label>
            <select
            defaultValue={userDetails?.gender}
              required
              disabled={!visible}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              {...register("gender",{required : "true"})}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          </div>

          <div className='flex'>

          {/* Contact Number */}
          <div className='w-1/2'>
            <FormField
            defaultValue={userDetails?.contactNo}
              label="Contact No:"
              type="tel"
              required
              readOnly={!visible}
              placeholder="Enter your contact number"
              className="w-full"
              pattern="[7-9]{1}[0-9]{9}"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("contactNo",{required : true})}
            />
          </div>

          {/* Address */}
          <div className='ml-10 flex-1'>
            {/* <label className="block text-sm font-medium text-gray-600">
              Address
            </label> */}
            <TextField
            label="Address :"
            defaultValue={userDetails?.address}
            readOnly={!visible}
            required
            labelClassName="block text-sm font-medium text-gray-600"
              placeholder="Enter your address"
              className="w-full"          
              {...register("address")}
            />
          </div> 
          </div>
          {option !== "setting" &&(
          /* Submit Button */
          <Button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            children="Sign Up"
          />
      )}
        {visible &&(
          /* Submit Button */
          <Button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            children="Save"
          />
      )}

        </form>

    </div>
  )
}

export default User