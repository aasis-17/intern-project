import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import Notify from "../../../../components/toast/Notify"
import authService from "../../../../services/authServices"
import userService from "../../../../services/userService"
import { useAuth } from "../../../../store/authContext"

export const useUser = ({option, setIsEditable}) => {

    const {state, dispatch} = useAuth()

    const isUserUpdate = option === "edit"

    const signUpMutation = useMutation({
        mutationFn : (data) => authService.signup(data),
        onSuccess : (data) =>{
            
            toast.success(Notify,{data : {msg : "User signup successfully!!"}, autoClose : 1000})
            dispatch({type : "login", payload : data})  
        },
        onError : () =>{
            toast.error(Notify, { data : {msg : "Error while signing user!!" }, autoClose : 1000})
        }
    })

    const updateUserInfoMutation = useMutation({
        mutationFn : (data) => userService.updateUserInfo(data),
        onSuccess : (data) => {
            toast.success(Notify,{data : {msg : "User info updated successfully!!"}, autoClose : 1000})
            dispatch({type : "login", payload : data}) 
            setIsEditable(false)
        },  
        onError : () => {
            toast.error(Notify, { data : {msg :"Error while updating details!!"}, autoClose : 1000})
    }
  })
  return {
    mutation : isUserUpdate ? updateUserInfoMutation : signUpMutation,
    userData : state.userData
  }
}
