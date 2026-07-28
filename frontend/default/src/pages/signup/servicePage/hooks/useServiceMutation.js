import { useMutation, useQueryClient } from "@tanstack/react-query"
import { serviceFormData } from "../../../../utiles/serviceFormData.js"
import { toast } from "react-toastify"
import Notify from "../../../../components/toast/Notify.jsx"
import serviceOwnerService from "../../../../services/serviceOwnerServices.js"
import { useNavigate} from 'react-router';

export const useServiceMutation = ({mode, mapState, setVisible, reset, state}) => {

    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const mutation = useMutation({
      mutationFn :  async(data) => {
      const formData = serviceFormData(data, mapState)
        if(mode === "edit"){
          const data = await serviceOwnerService.updateServiceInfo( formData, serviceDetails._id)
          return data
        }else{
          const data = await serviceOwnerService.upgradeToServiceOwner(formData)
          return data
        }    
      },
      onSuccess : (data) => {
        
        if(mode === "edit"){
          toast.success(Notify,{data : {msg :`Service info updated successfully!!`}, autoClose : 1000})
          setVisible(false)
                  queryClient.setQueryData(["serviceDetails", state.userData._id], (prev) =>{
                  console.log(prev)
                    Object.assign(prev, data)
                })
        }else{
          toast.success(Notify,{data : {msg : `Service request send successfully!!`}, autoClose : 1000}) 
          // navigate(-1)
          reset()         
        }
                // queryClient.setQueryData(["serviceDetails", state.userData._id], (prev) =>{
                //   console.log(prev)
                    
                // })
                queryClient.invalidateQueries({
                  queryKey:["serviceDetails", state.userData._id
                    
                  ]
                })

              },

      onError : (error) => {
        if(mode==="edit"){
          toast.error(Notify, {data : {msg :error || "Error while  updating service info!!" }, autoClose : 1000})
        }else{
          toast.error(Notify, {data : {msg : error || "Error while  signing user as service !!"}, autoClose : 1000})
        }

      }
    })
  return {
    mutation
  }
}
