import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import authService from '../services/authServices'
import { useNavigate, Link } from 'react-router'
import FormField from '../components/form/FormField'
import { AuthContext } from '../store/authContext.jsx'

const Login = ({onClose}) => {

const {dispatch} = useContext(AuthContext) 
const [visibility, setVisibility] =useState()
const [handleError, setHandleError] = useState()
const {register, handleSubmit} = useForm()
const navigate = useNavigate()

const onSubmit = async (data) => {
    try {
        const userData = await authService.login(data.password, data.email)
        console.log(userData)
        dispatch({type : "login", payload : userData})  
        onClose && onClose() 
             
        
    } catch (error) {
        setHandleError(error.message)
    }
}
  return (
    <div>
    <div className=" flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>

        <form className="mt-6 space-y-4" onSubmit={ handleSubmit(onSubmit)}>
            <div>
            <FormField 
            label = "Email"
            type = "email"
            onClick = {() => setHandleError("")}
            labelClassName="block text-m font-medium text-gray-700"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder = "Email or username"
            {...register("email", {
                required : true
            })}
             />
            </div>
            
            <div>
            <FormField 
            label = "Password"
            type={visibility ? "text" : "password"}
            labelClassName="block text-m font-medium text-gray-700"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            onClick = {() => setHandleError("")}
            placeholder = "password.."
            {...register("password", {
                required : true
            })}
             />
            <FormField
            label = "Show Password"
            labelClassName = "text-xs text-gray-600 mx-2"
            type='checkbox'
            defaultChecked = {visibility}
            onClick={() => setVisibility(prev => !prev)}
             />            
             </div>
             {handleError ? <p className='text-red-500 text-xs'>{handleError}</p> : ""}

             <div className="text-sm">
              <Link  className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</Link>
            </div>

             <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" type='submit'>Login</button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to={'/signup'} className="text-blue-600 hover:text-blue-500 font-medium">Sign Up</Link>
        </p>
    </div>
    </div>
    </div>
  )
}

export default Login