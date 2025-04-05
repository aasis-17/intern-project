import React from 'react'
import ServiceOwner from '../../../pages/signup/Service'
import Button from '../../Button'
import { useLocation, useNavigate, useParams } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import serviceOwnerService from '../../../services/serviceOwnerServices'
import NearByServices from './NearByServices'

const RequestDetail = () => {

  const {id} = useParams()
  const navigate = useNavigate()

  const {data : serviceDetails, isLoading} = useQuery({
    queryKey : ["serviceDetails"],
    queryFn : () => {
      return serviceOwnerService.getServiceProfile(id)
    }
  })
  console.log(id,serviceDetails)

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
    <div className='flex-1 h-screen'>
      <NearByServices />

   {/* Buttons for Approve and Reject */}
   <div className="flex space-x-4 w-full ">
         <Button
         children="Approve"
         variant='secondary'
         className='w-1/2'
         onClick={() => mutation.mutateAsync("approved")}
         />

         <Button
         children="Reject"
         variant='delete'
         className='w-1/2'
         onClick={()=>mutation.mutateAsync("reject")}
         />
       </div>
    </div>
  )
}

export default RequestDetail