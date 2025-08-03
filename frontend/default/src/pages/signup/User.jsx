import { useContext } from 'react'
import { useState } from "react";
import FormField from '../../components/form/FormField.jsx';
import { useForm } from "react-hook-form"
import authService from '../../services/authServices.js';
import { AuthContext } from '../../store/authContext.jsx';
import Button from '../../components/Button.jsx';
import { useMutation } from '@tanstack/react-query';
import userService from '../../services/userService.js';
import TextField from '../../components/form/TextField.jsx';
import { toast } from 'react-toastify';
import Notify from '../../components/toast/Notify.jsx';

const User = ({option}) => {

  const [visible, setVisible] =useState(() => option !== "edit")

  const {dispatch} = useContext(AuthContext)

  const {register ,handleSubmit} = useForm()

  const authContext = useContext(AuthContext)

  const userDetails = authContext.state.userData

  const mutation = useMutation({
    mutationFn : async(data) => {
      if(option === "edit"){
        await userService.updateUserInfo(data)
      }else{
        const userData = await authService.signup(data)
        return userData
      }
    },
    onSuccess : (userData) => {
      if(option !== "edit")  {
        toast.success(Notify,{data : {msg : "User signup successfully!!"}, autoClose : 1000})
        dispatch({type : "login", payload : userData})  
      }
     
      else{
        toast.success(Notify,{data : {msg : "User info updated successfully!!"}, autoClose : 1000})
        setVisible(false)
      } 
    },
    onError : () => {
      if(option !== "edit") toast.error(Notify, { data : {msg : "Error while signing user!!"}, autoClose : 1000})
     
        else toast.error(Notify, {data : {msg: "Error while updating details!!"}, autoClose : 1000})
    }
  })
 
  return (
    <div className='h-screen bg-white p-6 rounded-lg shadow-md'>

        
         <form onSubmit={ handleSubmit(mutation.mutateAsync) } className=" h-full relative flex flex-col justify-evenly ml-4">

          <div className='flex justify-between'>
          <h1 className='text-3xl font-garamond font-medium'>{option === "edit" ? "Basic Details" : "Your Details"}</h1>
          {option === "edit" && (

          <Button
          children={visible ? "Cancel" : "Edit"}
          onClick={()=> setVisible(prev => !prev)}
          size='sm'
          className={` w-16 ${visible ? "bg-red-400 hover:bg-red-500" : ""} `}
          variant='outline'
          />
          )}

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
          {option !== "edit" && (
            
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

          {/* <div className='flex'> */}

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
          <div className='w-1/2'>
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
          
          {option !== "edit" &&(
          /* Submit Button */
          <Button
          loading ={mutation.isPending}
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            children="Sign Up"
          />
      )}
        {option === "edit" && visible &&(
          /* Submit Button */
          <Button
          loading={mutation.isPending}
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