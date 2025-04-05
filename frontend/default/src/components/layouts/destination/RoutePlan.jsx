import React, { useState } from 'react'
import 'leaflet/dist/leaflet.css';
import RouteMap from '../../map/Routemap';
import {  useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel } from '@fortawesome/free-solid-svg-icons';
import Button from '../../Button';
import { useNavigate } from 'react-router';

const RoutePlan = () => {

   const [routeIndex, setRouteIndex] = useState(0)
   const navigate = useNavigate()
   const {id} = useParams()

   const queryClient = useQueryClient()
   const destination = queryClient.getQueryData(["destinationId", id])

   const services = queryClient.getQueryData(["nearByServices", id])

    const handleIndex =(index) => {
      setRouteIndex(Number(index))
    }

  return (
    <>
     {/* Route Section */}
     <div className="bg-white rounded-lg shadow-lg p-6">
       <h3 className="text-xl font-bold text-gray-800 mb-4">Map</h3>
       <div className=" h-80 w-full">
         {/* add map */}

      <RouteMap routeIndex={routeIndex} mapDetails={destination}/>

       </div>
     </div>
     <div className='flex gap-5 justify-end p-1'>
      {destination.routePlan.map(plan => <button className=' bg-gray-200 hover:bg-gray-400 rounded-2xl px-3 py-2' onClick={()=>handleIndex(plan.day - 1)}>Day {plan.day}</button>)}
    </div>

    <div className='mt-2 grid grid-cols-2 md:grid-cols-2 gap-6 min-h-96'>

    <div className="bg-white rounded-lg shadow-lg p-6 ">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recommented Route Plan :</h3>
            <div className="">
              <h1 className='text-lg font-semibold'>Day : {destination.routePlan[routeIndex].day}</h1>
              <span>{destination.routePlan[routeIndex]?.routeTask}</span>
            </div>
          </div>

          {/* services Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 ">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Near by Services :
            </h3>
      <div className="space-y-2">
          {services.map((service) => {
            return (

<div key={service._id} className="relative w-full flex items-center justify-between  space-y-4  px-2 py-2 border-2 border-dashed border-gray-400 dark:border-gray-400 shadow-lg rounded-lg">

    <div className="w-full  flex justify-between items-center sm:justify-start sm:w-auto">
        <img className="object-cover w-16 h-16 mt-3 mr-7 rounded-full" src={service.serviceCoverImage} />
    
     <div className="w-full sm:w-auto flex flex-col items-center sm:items-start">

        <p className="font-display mb-1 text-2xl font-semibold dark:text-gray-200" >
            {service.serviceName}
        </p>

        <div className="mb-2 md:text-lg text-gray-400">
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
          })}
      </div>
          </div>

    </div>
 

  </>
   
  )
}

export default RoutePlan