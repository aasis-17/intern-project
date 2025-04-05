import { useQuery } from '@tanstack/react-query'
import React from 'react'
import serviceOwnerService from '../../services/serviceOwnerServices'
import Button from '../../components/Button';
import { useNavigate } from 'react-router';

const Requests = () => {
    const navigate = useNavigate()

    const {data : requests, isLoading, error} = useQuery({
        queryKey : ["requests"],
        queryFn : () => serviceOwnerService.getAllServices("pending")
    })
    console.log(requests)
    if(isLoading) return <div>Loading..</div>
      // Dummy data for the number of requests
    
      return (
        <div className='flex-1 p-5'>
            <h1 className='text-4xl font-garamond mb-14 p-3'>Requests</h1>
            {!requests[0] && <div className='text-xl text-center'> No request pending!!</div> }
        {requests?.map(request => {
            return (
                <div  key={request._id} className="bg-white rounded-lg shadow-md p-6 w-full flex justify-between mb-5">

 
       {/* Service Details */}
       <div className="space-y-2">
               {/* Service Name */}
       <h2 className="text-xl font-semibold mb-2">{request.serviceName}</h2>
         <p className="text-sm text-gray-500">
           <span className="font-medium">Requested By:</span> {request.userId.fullname}
         </p>
         <p className="text-sm text-gray-500">
           <span className="font-medium">Date:</span> {request.createdAt}
         </p>
       </div>
 
        <div className="mt-6 flex space-x-4">
         <Button
         children="Review"
         size='sm'
         variant='outline'
         onClick={() => navigate(`/admin/request/${request._id}`)}
         />

       </div> 
            </div>)
        })}

 
      </div>
      );
    };
    

export default Requests