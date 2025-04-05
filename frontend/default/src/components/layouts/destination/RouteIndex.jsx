import React from 'react'
import Button from "../../Button"
import serviceOwnerService from '../../../services/serviceOwnerServices'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'
import NearByServiceMap from '../../map/NearByServiceMap'
import Map from '../../map/Map'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHotel } from '@fortawesome/free-solid-svg-icons'

const RouteIndex = () => {
    const {id} = useParams()

    const queryClient = useQueryClient()
    const destination = queryClient.getQueryData(["destinationId", id])

    const services = queryClient.getQueryData(["nearByServices", id])

    console.log(destination)

    const navigate = useNavigate()
    
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
     {/* <RouteMap /> */}
     <Map children={<NearByServiceMap mapDetails={destination} />} />

      </div>
    </div>

    {/* Activities Section */}
    <div className="bg-white rounded-lg shadow-lg p-6 mt-2">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Services Avaliable :
      </h3>
      <div className="space-y-2">
          {services[0] ? services.map((service) => {
            return (

<div key={service._id} className="relative w-full flex items-center justify-between  space-y-4 sm:space-y-0 sm:space-x-6 px-4 py-2 border-2 border-dashed border-gray-400 dark:border-gray-400 shadow-lg rounded-lg">

    <div className="w-full  flex justify-between items-center sm:justify-start sm:w-auto">
        <img className="object-cover w-20 h-20 mt-3 mr-7 rounded-full" src={service.serviceCoverImage} />
    
     <div className="w-full sm:w-auto flex flex-col items-center sm:items-start">

        <p className="font-display mb-2 text-2xl font-semibold dark:text-gray-200" >
            {service.serviceName}
        </p>

        <div className="mb-4 md:text-lg text-gray-400">
            <p>{service.serviceInfo} </p>
        </div>

        <div className="flex gap-4">
          <span><FontAwesomeIcon icon={faHotel} /></span>
          <span className="h-6 w-6 dark:text-gray-300">{service.serviceType}</span>

        </div>
        </div>
</div>
              { service.isApproved === "approved" && 
              <Button
              children="View Profile"
              onClick={()=>navigate(`/${service.userId._id}`)}
              variant='outline' />
              }
</div>
            )
          }) : <span className='text-center'>No services avaliable!!</span>}
      </div>
    </div>

 </>
  )
}

export default RouteIndex