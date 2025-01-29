import React from 'react'
import { useOutletContext } from 'react-router'
import RouteMap from '../../Routemap'

const RouteIndex = () => {
    const destinationRoute = useOutletContext()

 console.log(destinationRoute)
    const intermediate = destinationRoute.reduce((acc,curr,index) => {
        if(destinationRoute.length - 1 !== index) {
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
       location={destinationRoute[0].routeMapCoordinates.slocation} 
       sLocation={destinationRoute[0].routeMapCoordinates.slocation} 
       eLocation={destinationRoute[destinationRoute.length - 1].routeMapCoordinates.elocation}
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
        <li className="text-gray-600"></li>
        <li className="text-gray-600">Exploring Ubud's Rice Terraces</li>
        <li className="text-gray-600">Visiting Uluwatu Temple</li>
        <li className="text-gray-600">Snorkeling in Nusa Penida</li>
      </ul>
    </div>

 </>
  )
}

export default RouteIndex