import ImageSlider from '../components/layouts/ImageSlider.jsx';
import { useQuery } from '@tanstack/react-query';
import destinationService from '../services/destinationService.js';
import { useNavigate } from 'react-router';

const Home = () => {
  
  const navigate = useNavigate()
    const {data, isLoading, isError, isPending} = useQuery({
      queryKey :["destination"],
      queryFn : () => destinationService.getDestination()
    })

  if(isLoading) return <div>Loading!!</div>

  return  (
    <div className='relative top-[-80px] '>

      <ImageSlider />

      <div className='absolute top-2/3 md:top-96 w-full  inset-0  backdrop-blur-3xl h-full'>
        <div className='text-center  absolute -top-10 lg:-top-20 right-0 left-0 text-xl md:text-4xl lg:text-6xl text-white font-garamond font-medium'>Weaving your Dreams into Unforgettable <span className='block mt-5 pt-1'>Adventures</span></div>

      <div className='flex justify-evenly mt-14 md:mt-24 '>
        {/* <div className=' w-[80%] mx-auto bg-black overflow-x-hidden'>
      <div className='grid grid-flow-col gap-x-44'>

      { !isError && data.destinations.map((destination) => 
        (
        <div onClick={() => navigate(`destination/${destination._id}`)} key={destination._id} className=" cursor-pointer w-[400px] rounded-lg shadow-md transition hover:shadow-2xl">
        <img
          alt=""
          src={destination.destinationCoverImage}
          className="h-1/2 w-full object-cover"
        />

        <div className="bg-white p-2 md:p-6 h-1/2 ">
          <div className='flex justify-between items-center'>
          <h3 className="md:mt-1 md:text-lg text-xs  text-gray-900 ">{destination.destinationName}</h3>

      <div className="flex justify-end ">
        {[...Array(Number(destination.avgReview?.toFixed() || 0))].map((_, i) => (
        <span key={i} className="text-yellow-400 md:text-xl text-md">
          ★
        </span>
      ))}
      </div>  
          </div>


    <p className="md:mt-2 line-clamp-3 text-[8px]/relaxed md:text-sm/relaxed text-gray-500">{destination.destinationInfo}
    </p>
  </div>
</div>
)

)}

    </div>
    </div> */}

{/* example */}
        <div onClick={() => navigate(`destination/${data.destinations[0]._id}`)} className="hover:scale-105 cursor-pointer w-[35%] rounded-xl overflow-hidden shadow-md transition hover:shadow-2xl">
        <img
          alt=""
          src={data.destinations[0].destinationCoverImage}
          className="h-1/2 w-full object-cover"
        />

        <div className="bg-white p-2 md:p-6 h-1/2 ">
          <div className='flex justify-between items-center'>
          <h3 className="md:mt-1 md:text-lg text-xs  text-gray-900 ">{data.destinations[0].destinationName}</h3>

      <div className="flex justify-end ">
        {[...Array(Number(data.destinations[0].avgReview?.toFixed() || 0))].map((_, i) => (
        <span key={i} className="text-yellow-400 md:text-xl text-md">
          ★
        </span>
      ))}
      </div>  
          </div>


    <p className="md:mt-2 line-clamp-3 text-[8px]/relaxed md:text-sm/relaxed text-gray-500">{data.destinations[0].destinationInfo}
    </p>
  </div>
</div>

{/* example2 */}

    <div onClick={() => navigate(`destination/${data.destinations[0]._id}`)} className=" cursor-pointer w-[35%] overflow-hidden hover:scale-105 rounded-lg shadow-md transition hover:shadow-2xl">
        <img
          alt=""
          src={data.destinations[0].destinationCoverImage}
          className="h-1/2 w-full object-cover"
        />

        <div className="bg-white p-2 md:p-6 h-1/2 ">
          <div className='flex justify-between items-center'>
          <h3 className="md:mt-1 md:text-lg text-xs  text-gray-900 ">{data.destinations[0].destinationName}</h3>

      <div className="flex justify-end ">
        {[...Array(Number(data.destinations[0].avgReview?.toFixed() || 0))].map((_, i) => (
        <span key={i} className="text-yellow-400 md:text-xl text-md">
          ★
        </span>
      ))}
      </div>  
          </div>


    <p className="md:mt-2 line-clamp-3 text-[8px]/relaxed md:text-sm/relaxed text-gray-500">{data.destinations[0].destinationInfo}
    </p>
  </div>
</div>


    </div>


      </div>
    </div>
  
  )
}

export default Home
