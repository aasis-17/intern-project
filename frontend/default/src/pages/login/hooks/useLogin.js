import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { useAuth } from "../../../store/authContext"
import { toast } from "react-toastify"
import Notify from "../../../components/toast/Notify"
import authService from "../../../services/authServices"

export const useLogin = ({onClose, mode}) => {

  console.log(mode)

    const navigate = useNavigate()

    const {dispatch} = useAuth()

    const loginMutation = useMutation({
        mutationFn : (data) => authService.login(data.password, data.email),

        onSuccess : (data) => {
            dispatch({type : "login", payload : data})
            if(mode === "modal"){
            onClose()
            }else{
            navigate("/")
            }    
            toast.success(Notify,{data : {msg : "Login successfully!!"}, autoClose : 1000})
         },
         onError : (error) =>{
            console.log(error)
            toast.error(Notify, {data : {msg : error.msg || "Error while logging !"}, autoClose : 1000})
         }

})
  return {
    loginMutation
  }
  
}
