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
    queryKey : "serviceDetails",
    queryFn : () => {
      serviceOwnerService.getServiceProfile(id)
    }
  })

  const mutation = useMutation({
    mutationFn : async(submit) => {
      console.log(submit)
      if(submit === "approve"){
        await serviceOwnerService.approveServiceRequest(state.userId._id)
      }else{
        await serviceOwnerService.rejectServiceRequest(state._id)
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
    <div className='flex-1 py-5'>
      <NearByServices />

   {/* Buttons for Approve and Reject */}
   <div className="mt-6 flex space-x-4 w-full ">
         <Button
         children="Approve"
         variant='secondary'
         className='w-1/2'
         onClick={() => mutation.mutateAsync("approve")}
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