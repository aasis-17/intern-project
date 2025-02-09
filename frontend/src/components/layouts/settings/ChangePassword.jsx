import  {useState} from 'react'
import FormField from '../../form/FormField'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Button from '../../Button'
import authService from '../../../services/authServices'

const ChangePassword = () => {
    const [visibility, setVisibility] = useState({
        oldPassword : false,
        newPassword : false,
        confirmPassword : false
      })
    
      const mutation = useMutation({
        mutationFn : async(formData) => {
          if(formData.newPassword === formData.confirmPassword){
            await authService.updatePassword(formData)
            console.log( "validate",formData)
          }else{
            throw "Password does not match!!"
          }
          console.log(formData)
          
        },
        onSuccess : () => {
          alert("Password changed successfully!!")
          reset()
        },
        onError : () => {
          alert("Error while updating data!!" )
        }
      })
    
      const {register, handleSubmit, reset} = useForm()

  return (
    <>
    <form onSubmit={handleSubmit(mutation.mutateAsync)} className="bg-white p-6 rounded-lg shadow-md">
    
            {/* old password */}
        <div className='w-1/2 mb-2'>
        <FormField 
        label = "Old Password"
        type={visibility.oldPassword ? "text" : "password"}
        labelClassName="block text-m font-medium text-gray-700"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
        required
        placeholder = "password.."
        {...register("oldPassword", {
            required : true
        })}
        />
        <div className='flex mt-1 '>
        <FormField
        label = "Show Password"
        labelClassName = " text-xs text-gray-600 mx-2"
        type='checkbox'
        className="w-3 focus:ring-0"
        defaultChecked = {visibility.oldPassword}
        onClick={() => setVisibility(prev => ({...prev, oldPassword : !prev.oldPassword }))}
        />   
        </div>

        </div>  
        <div className='w-1/2'>
        <FormField 
        label = "New Password"
        type={visibility.newPassword ? "text" : "password"}
        labelClassName="block text-m font-medium text-gray-700"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
        required
        placeholder = "password.."
        {...register("newPassword", {
            required : true
        })}
        />
        <div className='flex mt-1 '>
        <FormField
        label = "Show Password"
        labelClassName = " text-xs text-gray-600 mx-2"
        type='checkbox'
        defaultChecked = {visibility.newPassword}
        onClick={() => setVisibility(prev => ({...prev, newPassword : !prev.newPassword }))}
        />   
        </div>

        </div>  
        <div className='w-1/2 mb-2'>
        <FormField 
        label = "Confirm Password"
        type={visibility.confirmPassword ? "text" : "password"}
        labelClassName="block text-m font-medium text-gray-700"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
        required
        placeholder = "password.."
        {...register("confirmPassword", {
            required : true
        })}
        />
        <div className='flex mt-1 '>
        <FormField
        label = "Show Password"
        labelClassName = " text-xs text-gray-600 mx-2"
        type='checkbox'
        className="focus:ring-0"
        defaultChecked = {visibility.confirmPassword}
        onClick={() => setVisibility(prev => ({...prev, confirmPassword : !prev.confirmPassword }))}
        />   
        </div>
        {mutation.isError && <span className='text-red-500 text-xs'>{mutation.error}</span>}
        </div>  
        <Button
            type='submit'
            children="Change password"
            className='w-full'
            />
</form>
    </>
  )
}

export default ChangePassword