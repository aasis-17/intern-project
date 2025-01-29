
import Button from '../components/Button.jsx';
import ImageSlider from '../components/layouts/ImageSlider.jsx';
// import Modal from '../components/Modal.jsx';
import { useState } from 'react';
import DestinationCard from '../components/DestinationCard.jsx';
import { useQuery } from '@tanstack/react-query';
import destinationService from '../services/destinationService.js';

const Home = () => {

    // const [isModalVisible, setIsModalVisible] = useState(false);

    const {data, isLoading,isError, error} = useQuery({
      queryKey :["destination"],
      queryFn : () => destinationService.getDestination()
    })

  if(isError) return <div>{error.message}</div>

  if(isLoading) return <div>Loading!!</div>

  return  (
    <div className='relative top-[-80px]'>
      <ImageSlider />
      <div className='absolute w-full h-full top-72  '>
        <div className='pl-9 text-8xl text-white font-garamond font-medium'>Weaving your Dreams <br/>into Unforgettable<br/>Adventures</div>
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

      { data.destinations?.map((destination) => (
        <DestinationCard
          key={destination._id}
          imageUrl={destination.destinationCoverImage}
          destinationName={destination.destinationName}
          review={destination.avgReview}
        />
      ))}

    </div>
      </div>
    </div>
  )
}

export default Home
