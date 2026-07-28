import {  useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import FormField from '../../components/form/FormField.jsx'
import { useLogin } from './hooks/useLogin.js'

const Login = ({onClose, mode}) => {

const [visibility, setVisibility] =useState()
const {register, handleSubmit} = useForm()

const {loginMutation} = useLogin({onClose, mode})


  return (
    <div>
    <div className=" flex items-center justify-center">
    <div className=" p-8 rounded-lg w-full max-w-lg">
    <div className="mb-5 sm:mb-8 mt-10">
            <h1 className=" font-semibold text-gray-800 text-3xl dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-md text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

        <form className="mt-6 space-y-4" onSubmit={ handleSubmit(loginMutation.mutate)}>
            
            <FormField 
            label = "Email"
            type = "email"
            className="w-full"
            placeholder = "Email or username"
            labelClassName = "text-xs text-gray-600 mx-2"
            {...register("email", {
                required : true
            })}
             />
                  
            <div className='space-y-2'>
            <FormField 
            label = "Password"
            type={visibility ? "text" : "password"}
            labelClassName = "text-xs text-gray-600 mx-2"
            placeholder = "password.."
            {...register("password", {
                required : true
            })}
             />

            <FormField
            label = "Show Password"
            labelClassName = "text-xs text-gray-600 mx-2"
            type='checkbox'
            className="flex"
            defaultChecked = {visibility}
            onClick={() => setVisibility(prev => !prev)}
             />            
             </div>

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