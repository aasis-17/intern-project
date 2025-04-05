import React from 'react'
import ServiceOwner from '../signup/Service'
import { useParams } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import serviceOwnerService from '../../services/serviceOwnerServices'
import Button from '../../components/Button'

const ServiceDetails = () => {
    const {serviceId} = useParams()

    const {data : serviceDetails, isLoading} = useQuery({
        queryKey : ["serviceDetails", serviceId],
        queryFn : () => serviceOwnerService.getServiceProfile(serviceId)
    })

    const mutation = useMutation({
      mutationFn : async(submit) => {
        console.log(submit)
        if(submit === "approved"){
          await serviceOwnerService.approveServiceRequest(serviceDetails.userId)
        }else{
          await serviceOwnerService.rejectServiceRequest(serviceDetails._id)
        }
        return submit
      },
      onSuccess :(submit) => {
        submit === "approved" ? alert("Service has been approved!!")
        : alert("Service has been rejected!!")
        navigate(-1)
      },
      onError : (submit) => {
        submit === "approved" ? alert("Error while approving service form!!")
        : alert("Error while rejecting service form!!")
      }
    })
    if(isLoading) return <div>Loading..</div>
  return (
    <div className='flex-1 p-7'>
        <ServiceOwner details={serviceDetails} option="edit" />
        {serviceDetails.isApproved === "pending" && 
           <div className="flex mt-3 gap-5">
                 <Button
                 children="Approve"
                 variant='outline'
                 className='w-1/2 bg-green-300 hover:bg-green-400'
                 onClick={() => mutation.mutateAsync("approved")}
                 />
        
                 <Button
                 children="Reject"
                 variant='delete'
                 className='w-1/2'
                 onClick={()=>mutation.mutateAsync("reject")}
                 />
               </div>
}
    </div>
        
  )
}

export default ServiceDetails