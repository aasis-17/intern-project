import { useQuery } from '@tanstack/react-query';
import React from 'react'
import {Link, Outlet, useParams } from 'react-router';
import destinationService from '../services/destinationService';
import Navigation from "../components/layouts/Navigation"
import Review from "../components/Review"
import RouteIndex from "../components/layouts/destination/RouteIndex"
import RouteGallery from "../components/layouts/destination/RouteGallery"
const DestinationDetailPage = () => {

  const {id} = useParams()

  const{data : destinationDetails, isLoading, isError, error} = useQuery({
    queryKey : ["destinationId"],
    queryFn : () => destinationService.getDestinationById(id)
  })

  const navChild = destinationDetails?.routePlan[0] ? [
    {name : "Gallery", link : `/destination/${id}/gallery`, href :"#gallery"},
    {name : "Reviews", link : `/destination/${id}/review`, href :"#review"}, 
  ] : 
  [
    {name : "Gallery", link : `/destination/${id}/gallery`, href : "#gallery"},
    {name : "Reviews", link : `/destination/${id}/review`,href : "#review", state : { reviewState : "destinationId"}}, 
  ]

  if(isLoading) return <div>Loading...</div>
  if(isError) return <div>{error.message}</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Image Section */}
      <div className="relative h-80 ">
        <img
          src={destinationDetails.destinationCoverImage}
          alt={destinationDetails.destinationName}
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
            {destinationDetails.destinationName}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Destination Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            About {destinationDetails.destinationName}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {destinationDetails.destinationInfo}
          </p>
        </div>

        {/* navigation */}
        <nav className="mt-5 flex justify-end gap-x-10 md:text-lg font-semibold text-gray-800 mb-4">
          {navChild.map(child => {
            return (
              <a key={child.href} className=' bg-gray-200 hover:bg-gray-400 rounded-2xl px-3 py-2' href={child.href}>
                {child.name}
              </a>
            )
          })}
          {/* <Navigation children={navChild} className="flex justify-end gap-x-10 md:text-lg font-semibold text-gray-800 mb-4" navClassName={({isActive}) => `${isActive ? "hidden" : ""}  bg-gray-200 hover:bg-gray-400 rounded-2xl px-3 py-2`} /> */}
        </nav>

        {/* Additional Sections (Optional) */}
        <div >
          <section className='' id="index">
            <Outlet />

          </section>

          <section className='mt-2 grid grid-cols-2 md:grid-cols-2 gap-6' id="gallery">
            <RouteGallery />
          </section>

          <section className='' id='review'>
            <Review reviewState={"destinationId"}/>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;