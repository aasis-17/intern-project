import ImageSlider from '../../components/layouts/ImageSlider.jsx';
import { useQuery } from '@tanstack/react-query';
import destinationService from '../../services/destinationService.js';
import { useNavigate } from 'react-router';
import { useCallback, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight, faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../components/loader/Loader.jsx';
import DestinationPreviewCard from './components/DestinationPreviewCard.jsx';

const Home = () => {
  
  const [startIndex, setStartIndex] = useState(0)

  const [animation, setAnimation] = useState("")

  const navigate = useNavigate()

    const {data, isLoading, isError, error} = useQuery({
      queryKey :["destination"],
      queryFn : () => destinationService.getDestination()
    })
  
  const destinations = data?.destinations || []

  const swapBack = () => {
    setAnimation("animate-fade-right");
    setStartIndex((i) => i - 2);
  };

  const swapNext = () => {
    setAnimation("animate-fade-left");
    setStartIndex((i) => i + 2);
  };

  const handelNavigation = useCallback((id) => {
    return navigate(`destination/${id}`)
  }, [navigate])

  if(isError) return <Error />
  if(isLoading) return <Loader />

  return  (
    <div className='relative top-[-80px] '>

      <ImageSlider />

      <div className='absolute top-2/3 md:top-96 w-full  inset-0  backdrop-blur-3xl h-full'>
        <div className='animate-fade-down text-center  absolute -top-10 lg:-top-20 right-0 left-0 text-xl md:text-4xl lg:text-6xl text-white font-garamond font-medium'>Weaving your Dreams into Unforgettable <span className='block mt-5 pt-1'>Adventures</span></div>

      <div className='flex justify-evenly mt-14 md:mt-24 '>
        <button className='cursor-default' disabled={startIndex === 0} onClick={swapBack}><FontAwesomeIcon className='cursor-pointer text-5xl text-slate-300' icon={faCircleChevronLeft} /></button>

    <DestinationPreviewCard 
      destination = {destinations[startIndex]}
      className ={animation}
      onClick = {() => handelNavigation(destinations[startIndex]._id)}
      />

    <DestinationPreviewCard 
      destination = {destinations[startIndex + 1]}
      className ={animation}
      onClick = {() => handelNavigation(destinations[startIndex + 1]._id)}
      />

<button className='cursor-default' disabled ={startIndex + 2 >= destinations.length} onClick={swapNext}><FontAwesomeIcon className='text-5xl text-slate-300 cursor-pointer' icon={faCircleChevronRight} /></button>
    </div>
      </div>
    </div>
  
  )
}

export default Home
