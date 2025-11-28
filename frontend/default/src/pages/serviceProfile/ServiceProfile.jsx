import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import serviceOwnerService from '../../services/serviceOwnerServices'
import Loader from '../../components/loader/Loader'
import Review from "../../components/Review.jsx"
import Error from '../Error.jsx'

const ServiceProfile = () => {

    const {id} = useParams()

    const {data : serviceDetails, isLoading, isError} = useQuery({
        queryKey : ["serviceId", id],
        queryFn : () =>{
            return serviceOwnerService.getServiceProfile(id)
        }
    })

    if(isLoading) return <Loader />
    if(isError) return <Error />

  return (
      <div className="min-h-screen bg-gray-50">
      {/* Cover Photo */}
     <div>
 
        <div className="relative h-96">
        <img
          src={serviceDetails?.serviceCoverImage} // Replace with your hero image
          alt="Hotel Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4">{serviceDetails?.serviceName}</h1>
            <p className="text-xl text-gray-200">Where Luxury Meets Comfort</p>
          </div>
        </div>
      </div>
        
      </div>
    
                    {/* // <div key={review._id} className="bg-white px-6 mb-5 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"> */}
                    <div className="flex justify-end">
                      {[...Array(serviceDetails.avgReview ? serviceDetails.avgReview.toFixed(1) : 0)].map((_, i) => (
                       <span key={i} className="text-yellow-400 text-3xl">
                         ★
                       </span>
                     ))}
                     {serviceDetails.avgReview && <span className="">{serviceDetails.reviews.length}</span>}
                   </div> 
      {/* </div> */}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 py-7">

        {/* About Section */}
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">About Us</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            {serviceDetails?.serviceInfo}
           
          </p>
        </section>

        {/* Image Gallery Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceDetails?.serviceImages.map(image => {
              return (
             <div key={image.publicId} className="relative group overflow-hidden rounded-lg shadow-lg">
              <img
                src={image.src}
                alt="Gallery 1"
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-lg font-semibold">Luxurious Rooms</p>
              </div>
            </div> 
              )
            })}
          </div>
        </section>

        {/* Stay Packages Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Stay Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Weekend Getaway</h3>
              <p className="text-gray-600 mb-4">Enjoy a relaxing weekend with our special package.</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                Book Now
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Family Vacation</h3>
              <p className="text-gray-600 mb-4">Perfect for families looking for a memorable stay.</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                Book Now
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Business Travel</h3>
              <p className="text-gray-600 mb-4">Tailored for professionals on the go.</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                Book Now
              </button>
            </div>
          </div>
        </section>

        {/* Reviews Section */}

        (<section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">What Our Guests Say</h2>

          <Review reviewState="serviceId" reviewId={id} />

        </section>)
        

        {/* Call-to-Action Section */}
        <section className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Book Your Stay?</h2>
          <p className="text-gray-600 text-lg mb-8">Experience luxury like never before. Book your stay today!</p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
            Book Now
          </button>
        </section>

      </div>

    </div>
  )
}

export default ServiceProfile