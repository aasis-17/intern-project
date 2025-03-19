import React, { useState } from 'react'
import 'leaflet/dist/leaflet.css';
import RouteMap from '../../map/Routemap';
import { useOutletContext } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';

const RoutePlan = () => {

   const [routeIndex, setRouteIndex] = useState(0)
   const queryClient = useQueryClient()
   const destination = queryClient.getQueryData(["destinationId"])
   console.log(destination)

    const handleNext =() => {
        if(routeIndex < destination.routePlan?.length - 1) setRouteIndex(prev => prev + 1)       
    }

    const handleBack = () => {
        if(routeIndex > 0) setRouteIndex(prev => prev - 1 )
    }

  return (
    <>
     {/* Route Section */}
     <div className="bg-white rounded-lg shadow-lg p-6">
       <h3 className="text-xl font-bold text-gray-800 mb-4">Map</h3>
       <div className=" h-80 w-full">
         {/* add map */}

      <RouteMap routeIndex={routeIndex} />

       </div>
     </div>

     {/* Activities Section */}
     <div className="bg-white rounded-lg shadow-lg p-6 relative">
       <h3 className="text-xl font-bold text-gray-800 mb-4">
         Recommended Route plan
       </h3>
       <ul className="space-y-2">
         <li className="text-gray-600">{destination.routePlan[routeIndex]?.routeTask}</li>
         <li className="text-gray-600">Exploring Ubud's Rice Terraces</li>
         <li className="text-gray-600">Visiting Uluwatu Temple</li>
         <li className="text-gray-600">Snorkeling in Nusa Penida</li>
       </ul>
       <div>
        <button className='absolute top-[50%] left-0' onClick={handleBack}>back </button>
        <button className='absolute top-[50%] right-0' onClick={handleNext}>next</button>
    </div> 
     </div> 
  </>
   
  )
}

export default RoutePlan