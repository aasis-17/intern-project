import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { NavLink, Outlet, useParams } from 'react-router';
import destinationService from '../services/destinationService';

const DestinationDetailPage = () => {
  const destinationRoute = [{
    day : "Day 1",
    routeTask : "butwal to pokhara",
    routeMapCoordinates : {slocation : {latitude :27.6866 ,longitude :83.4323}, elocation : {latitude :28.2096,longitude :83.9856}}
  },
{
  day : "Day 2",
  routeTask : "pokhara to mustang",
  routeMapCoordinates : {slocation : {latitude :28.2096 ,longitude : 83.9856}, elocation : {latitude :28.9985,longitude :83.8473}}
}]

  const {destinationId} = useParams()

  const{data, isLoading, isError, error} = useQuery({
    queryKey : ["destinationId"],
    queryFn : () => destinationService.getDestinationById(destinationId)
  })

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

          {/* Location */}
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-gray-700 font-medium">{}</p>
          </div>
        </div>

        {/* navigation */}
        <nav className="mt-5">
          <ul className="flex justify-end gap-x-10 md:text-lg font-semibold text-gray-800 mb-4">    
            <li>
              <NavLink
                to={`/destination/${data._id}/gallery`}
               className={`({isActive}) => isActive ? "hidden" : "" bg-gray-200 hover:bg-gray-400 rounded-2xl px-3 py-2`}
              >
                Gallery
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/destination/${data._id}/route`}
                className={`({isActive}) => isActive ? "hidden" : "" bg-gray-200 hover:bg-gray-400 rounded-2xl px-3 py-2`}
              >
                Recommended Routes
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/destination/${data._id}/review`}    
                className={`({isActive}) => isActive ? "hidden" : "" bg-gray-200 hover:bg-gray-400 rounded-2xl px-3 py-2`} 
              >
                Reviews
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Additional Sections (Optional) */}
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Outlet context = {destinationRoute}/>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;