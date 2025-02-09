import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { NavLink, Outlet, useParams } from 'react-router';
import destinationService from '../services/destinationService';
import Navigation from "../components/layouts/Navigation"

const DestinationDetailPage = () => {

  const {destinationId} = useParams()

  const{data, isLoading, isError, error} = useQuery({
    queryKey : ["destinationId"],
    queryFn : () => destinationService.getDestinationById(destinationId)
  })

  const navChild = data?.routePlan[0] ? [
    {name : "Gallery", link : `/destination/${destinationId}/gallery`},
    {name : "Recommended Route", link : `/destination/${destinationId}/route`},
    {name : "Reviews", link : `/destination/${destinationId}/review`}, 
  ] : 
  [
    {name : "Gallery", link : `/destination/${destinationId}/gallery`},
    {name : "Reviews", link : `/destination/${destinationId}/review`, state : "destinationId"}, 
  ]

  if(isLoading) return <div>Loading...</div>
  if(isError) return <div>{error.message}</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Image Section */}
      <div className="relative h-96 md:h-[500px]">
        <img
          src={data.destinationCoverImage}
          alt={data.destinationName}
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
            {data.destinationName}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Destination Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            About {data.destinationName}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {data.destinationInfo}
          </p>
        </div>

        {/* navigation */}
        <nav className="mt-5">
          <Navigation children={navChild} className="flex justify-end gap-x-10 md:text-lg font-semibold text-gray-800 mb-4" navClassName={({isActive}) => `${isActive ? "hidden" : ""}  bg-gray-200 hover:bg-gray-400 rounded-2xl px-3 py-2`} />
        </nav>

        {/* Additional Sections (Optional) */}
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Outlet context = {data}/>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;