import React from 'react'
import Button from "../../Button"
import RouteMap from '../../map/Routemap'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

const RouteIndex = () => {

    const queryClient = useQueryClient()
    const destination = queryClient.getQueryData(["destinationId"])

    const navigate = useNavigate()

    const{data : nearbyServices, isLoading, isError} = useQuery({
      queryKey : "nearByServices",
      queryFn : () => {
      }     
    })
    
  return (
    <>
    {/* Route Section */}
    <div className="bg-white rounded-lg shadow-lg p-3">
      <div className='flex justify-between mb-2'>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Map</h3>
        {destination?.routePlan[0] && (
          
        <Button 
        children="Recommended Route" 
        size='sm'
        variant="outline" 
        className='rounded-xl'
        onClick={()=> navigate(`/destination/${destination._id}/route`)}/>
        )}

      </div>

      <div className=" h-72 w-full">

        {/* add map */}
     <RouteMap />

      </div>
    </div>

    {/* Activities Section */}
    <div className="bg-white rounded-lg shadow-lg p-6 mt-2">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Safty Tips :
      </h3>
      <ul className="space-y-2">
          {destination?.destinationTips}
      </ul>
    </div>

 </>
  )
}

export default RouteIndex