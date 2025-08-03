import React, { useEffect } from 'react'
import { useLocation, useParams } from 'react-router'
import Button from '../../../components/button/Button'
import { useApproveServiceMutation, useGetServiceByIdQuery, useRejectServiceMutation } from '../../../services/apiSlice'
import ServiceOwner from "./component/Service"
import Review from '../components/Review'
import Loader from '../../../layouts/loader/Loader'
import { toast } from 'react-toastify'
import Notify from '../../../layouts/toast/Notify'

const ServiceDetails = () => {
    const {serviceId} = useParams()
   
    const {state} = useLocation()
    
    const {data : serviceDetails, isLoading, isError} = useGetServiceByIdQuery(serviceId)

    const [rejectMutation, {isError : rejectError, isSuccess : rejectSuccess}] = useRejectServiceMutation()
    const [approveMutation, {isError : approveError, isSuccess : approveSuccess}] = useApproveServiceMutation()

    const mutation = async(submit) => {
        
        if(submit === "approved"){
          await approveMutation({userId : serviceDetails.userId, serviceId})
        }else{
          await rejectMutation({serviceId : serviceDetails._id})
        }
        return submit
      }

    useEffect(()=>{
      rejectError && toast.error(Notify, {data : { msg : "service reject error!!"}, autoClose : 1000})
      rejectSuccess && toast.success(Notify ,{data : { msg : "service reject success!!"}, autoClose : 1000})
      approveError && toast.error(Notify, {data : {msg : "service approve error!!"}, autoClose : 1000})
      approveSuccess && toast.success(Notify, {data : {msg : "service approve success!!"}, autoClose : 1000})
    },[rejectError, rejectSuccess, approveError, approveSuccess])
  
    if(isLoading) return <Loader size='lg' color='secondary' />

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

  <Review reviewData={serviceDetails} />
    </div>
        
  )
}

export default ServiceDetails