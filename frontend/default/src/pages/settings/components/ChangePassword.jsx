import  {useState} from 'react'
import FormField from '../../../components/form/FormField'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Button from '../../../components/Button'
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
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Change Password</h2>

      <form onSubmit={handleSubmit(mutation.mutateAsync)} className="bg-white p-6 rounded-lg shadow-md">
      
          {/* old password */}
          <div className='w-1/2 mb-4'>
            <FormField 
            label = "Old Password"
            type={visibility.oldPassword ? "text" : "password"}
            labelClassName="block text-m font-medium text-gray-700"
            className="" 
            required
            placeholder = "password.."
            {...register("oldPassword", {
                required : true
            })}
            />

            <FormField
            label = "Show Password"
            labelClassName = " text-xs text-gray-600 mx-2"
            type='checkbox'
            className="flex mt-1"
            defaultChecked = {visibility.oldPassword}
            onClick={() => setVisibility(prev => ({...prev, oldPassword : !prev.oldPassword }))}
            />   

          </div>  
          <div className='w-1/2 mb-4'>
            <FormField 
            label = "New Password"
            type={visibility.newPassword ? "text" : "password"}
            labelClassName="block text-m font-medium text-gray-700 "
            required
            placeholder = "password.."
            {...register("newPassword", {
                required : true
            })}
            />

            <FormField
            label = "Show Password"
            className="flex mt-1"
            labelClassName = "text-xs text-gray-600 mx-2"
            type='checkbox'
            defaultChecked = {visibility.newPassword}
            onClick={() => setVisibility(prev => ({...prev, newPassword : !prev.newPassword }))}
            />   
          </div> 

          <div className='w-1/2 mb-4'>
            <FormField 
            label = "Confirm Password"
            type={visibility.confirmPassword ? "text" : "password"}
            labelClassName="block text-m font-medium text-gray-700"
            required
            placeholder = "password.."
            {...register("confirmPassword", {
                required : true
            })}
            />

            <FormField
            label = "Show Password"
            labelClassName = "text-xs text-gray-600 mx-2"
            type='checkbox'
            className="flex mt-1"
            defaultChecked = {visibility.confirmPassword}
            onClick={() => setVisibility(prev => ({...prev, confirmPassword : !prev.confirmPassword }))}
            />   
        
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