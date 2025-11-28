import { useQuery } from '@tanstack/react-query';
import Loader from '../components/loader/Loader';
import { Outlet, useParams } from 'react-router';
import destinationService from '../services/destinationService';
import serviceOwnerService from '../services/serviceOwnerServices';
import Review from "../components/Review"
import RouteGallery from "../components/layouts/destination/RouteGallery"
import Error from './Error';
const DestinationDetailPage = () => {

  const {id} = useParams()

  const{data : destinationDetails, isLoading : isDestinationDetailLoading, isError : isDestinationDetailError, error} = useQuery({
    queryKey : ["destinationId", id],
    queryFn : () => destinationService.getDestinationById(id),
    staleTime : 30 * 1000
  })

  const {data: services, isLoading : isServiceDetailLoading, isError : isServiceDetailError} = useQuery({
    queryKey :["nearByServices", id],
    queryFn : () => serviceOwnerService.getAllServices({search : "", option : "approved", serviceDestination : destinationDetails.destinationName}),
    staleTime : 30 * 1000,
    enabled : !!destinationDetails
})

  const navChild = destinationDetails?.routePlan[0] ? [
    {name : "Gallery", link : `/destination/${id}/gallery`, href :"#gallery"},
    {name : "Reviews", link : `/destination/${id}/review`, href :"#review"}, 
  ] : 
  [
    {name : "Gallery", link : `/destination/${id}/gallery`, href : "#gallery"},
    {name : "Reviews", link : `/destination/${id}/review`,href : "#review", state : { reviewState : "destinationId"}}, 
  ]

  if(isServiceDetailLoading || isDestinationDetailLoading) return <Loader />
  if(isServiceDetailError || isDestinationDetailError) return <Error />

  return (
    <div className="min-h-screen bg-gray-100 animate-fade-down">
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
      <div  className="container mx-auto px-4 py-8 md:py-12 ">
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
            <Review reviewState={"destinationId"} reviewId = {id}/>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;