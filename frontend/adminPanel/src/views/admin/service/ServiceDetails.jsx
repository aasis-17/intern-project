import React, { useEffect } from 'react'
import { useLocation, useParams } from 'react-router'
import Button from '../../../components/button/Button'
import { useApproveServiceMutation, useGetServiceByIdQuery, useRejectServiceMutation } from '../../../services/apiSlice'
import ServiceOwner from "./component/Service"

const ServiceDetails = () => {
    const {serviceId} = useParams()
    console.log(serviceId)
    const {state} = useLocation()
    console.log(state, "state")
    const {data : serviceDetails, isLoading, isError} = useGetServiceByIdQuery(serviceId)

    const [rejectMutation, {isError : rejectError, isSuccess : rejectSuccess}] = useRejectServiceMutation()
    const [approveMutation, {isError : approveError, isSuccess : approveSuccess}] = useApproveServiceMutation()

    const mutation = async(submit) => {
        console.log(submit)
        if(submit === "approved"){
          await approveMutation({userId : serviceDetails.userId, serviceId})
        }else{
          await rejectMutation({serviceId : serviceDetails._id})
        }
        return submit
      }

    useEffect(()=>{
      rejectError && alert("service reject error!!")
      rejectSuccess && alert("service reject success!!")
      approveError && alert("service approve error!!")
      approveSuccess && alert("service approve success!!")
    },[rejectError, rejectSuccess, approveError, approveSuccess])
  
    if(isLoading) return <div>Loading..</div>
  return (
    <div className='flex-1 p-7'>
        <ServiceOwner details={serviceDetails} option="edit" filterState = {state} />
        {serviceDetails?.isApproved === "pending" && 
           <div className="flex mt-3 gap-5">
                 <Button
                 children="Approve"
                 variant='outline'
                 className='w-1/2 bg-green-300 hover:bg-green-400'
                 onClick={() => mutation("approved")}
                 />
        
                 <Button
                 children="Reject"
                 variant='delete'
                 className='w-1/2'
                 onClick={()=>mutation("reject")}
                 />
               </div>
}
    </div>
        
  )
}

export default ServiceDetails