import React from 'react'
import { useOutletContext } from 'react-router'
import RouteMap from '../../map/Routemap'

const RouteIndex = () => {
    const destination = useOutletContext()
    
    const intermediate = destination.routePlan?.reduce((acc,curr,index) => {
        if(destination.routePlan.length - 1 !== index) {
          acc.push(curr.routeMapCoordinates.elocation)
        }
        return acc
       },[])
     console.log(intermediate)
  return (
    <>
    {/* Route Section */}
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Map</h3>
      <div className=" h-80 w-full">

        {/* add map */}
     <RouteMap  
       location={destination.destinationMapCoordinates} 
       routePlan={destination.routePlan[0]}
       intermediate = {intermediate}
       />

      </div>
    </div>

    {/* Activities Section */}
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Safty Tips :
      </h3>
      <ul className="space-y-2">
          {destination.destinationTips}
      </ul>
    </div>

 </>
  )
}

export default RouteIndex