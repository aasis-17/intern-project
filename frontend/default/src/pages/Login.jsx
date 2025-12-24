import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import authService from '../services/authServices'
import { useNavigate, Link } from 'react-router'
import FormField from '../components/form/FormField'
import { AuthContext } from '../store/authContext.jsx'
import { useMutation } from '@tanstack/react-query'

const Login = ({onClose}) => {

const {dispatch} = useContext(AuthContext) 
const [visibility, setVisibility] =useState()
const [handleError, setHandleError] = useState()
const {register, handleSubmit} = useForm()
const navigate = useNavigate()

// const onSubmit = async (data) => {
//     try {
//         const userData = await authService.login(data.password, data.email)
//         dispatch({type : "login", payload : userData})  
//         onClose && onClose()
//         navigate("/")     
//     } catch (error) {
//         setHandleError(error.message)
//     }
// }

const {mutate} = useMutation({
  mutationFn : (data) => authService.login(data.password, data.email),
  onSuccess : (data) => {
    dispatch({type : "login", payload : data})
    onClose && onClose()
    navigate("/")
  },
  onError : (error) => setHandleError(error.message)

})

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

        <form className="mt-6 space-y-4" onSubmit={ handleSubmit(mutate)}>
            <div>
            <FormField 
            label = "Email"
            type = "email"
            onClick = {() => setHandleError("")}
            labelClassName="block text-m font-medium text-gray-700"
            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
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