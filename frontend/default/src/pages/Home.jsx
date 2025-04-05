import ImageSlider from '../components/layouts/ImageSlider.jsx';
import { useQuery } from '@tanstack/react-query';
import destinationService from '../services/destinationService.js';
import { useNavigate } from 'react-router';
import { useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight, faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  
  const [index, setIndex] = useState({
    even : 0,
    odd : 1
  })

  const [css, setCss] = useState("")

  const navigate = useNavigate()
    const {data, isLoading, isError, isPending} = useQuery({
      queryKey :["destination"],
      queryFn : () => destinationService.getDestination()
    })

  const back = () =>{
    const totalDestination = data.destinations.length - 1
    if(totalDestination == 2 || index.odd == totalDestination) return
    setCss("animate-fade-left  animate-ease-out")
    setIndex(prev => ({...prev, even : prev.even + 2, odd : prev.odd + 2}))
    setTimeout(()=> setCss("animate-none"),300)
  }
  console.log(css)

  const next = () =>{
    const totalDestination = data.destinations.length
    if(totalDestination < 2 || index.even == 0 || index.odd == 1) return
    setCss("animate-fade-right animate-ease-out")
    setIndex(prev => ({...prev, even : prev.even - 2, odd : prev.odd - 2}))
    setTimeout(()=> setCss("animate-none"),300)
  }

  if(isLoading) return <div>Loading!!</div>

  return  (
    <div className='relative top-[-80px] '>

      <ImageSlider />

      <div className='absolute top-2/3 md:top-96 w-full  inset-0  backdrop-blur-3xl h-full'>
        <div className='animate-fade-down text-center  absolute -top-10 lg:-top-20 right-0 left-0 text-xl md:text-4xl lg:text-6xl text-white font-garamond font-medium'>Weaving your Dreams into Unforgettable <span className='block mt-5 pt-1'>Adventures</span></div>

      <div className='flex justify-evenly mt-14 md:mt-24 '>
        <button className='cursor-default' onClick={next}><FontAwesomeIcon className='cursor-pointer text-5xl text-slate-300' icon={faCircleChevronLeft} /></button>

{/* example even */}
    {data.destinations[index.even] &&
        <div onClick={() => navigate(`destination/${data.destinations[index.even]._id}`)} className={` hover:scale-105 cursor-pointer w-[35%] rounded-xl overflow-hidden shadow-md transition hover:shadow-2xl ${css}`}>
        <img
          alt=""
          src={data.destinations[index.even].destinationCoverImage}
          className=" h-1/2 w-full object-cover"
        />

        <div className="bg-white p-2 md:p-6 h-1/2 ">
          <div className='flex justify-between items-center'>
          <h3 className="md:mt-1 md:text-lg text-xs  text-gray-900 ">{data.destinations[index.even].destinationName}</h3>

      <div className="flex justify-end ">
        {[...Array(Number(data.destinations[index.even].avgReview?.toFixed() || 0))].map((_, i) => (
        <span key={i} className="text-yellow-400 md:text-xl text-md">
          ★
        </span>
      ))}
      </div>  
          </div>

    <p className="md:mt-2 line-clamp-3 text-[8px]/relaxed md:text-sm/relaxed text-gray-500">{data.destinations[index.even].destinationInfo}
    </p>
  </div>
</div>
}

{/* example2 odd*/}
{data.destinations[index.odd] && 
    <div onClick={() => navigate(`destination/${data.destinations[index.odd]._id}`)} className={`${css} cursor-pointer w-[35%] overflow-hidden hover:scale-105 rounded-lg shadow-md transition hover:shadow-2xl`}>
        <img
          alt=""
          src={data.destinations[index.odd].destinationCoverImage}
          className="h-1/2 w-full object-cover"
        />

        <div className="bg-white p-2 md:p-6 h-1/2 ">
          <div className='flex justify-between items-center'>
          <h3 className="md:mt-1 md:text-lg text-xs  text-gray-900 ">{data.destinations[index.odd].destinationName}</h3>

      <div className="flex justify-end ">
        {[...Array(Number(data.destinations[index.odd].avgReview?.toFixed() || 0))].map((_, i) => (
        <span key={i} className="text-yellow-400 md:text-xl text-md">
          ★
        </span>
      ))}
      </div>  
          </div>

    <p className="md:mt-2 line-clamp-3 text-[8px]/relaxed md:text-sm/relaxed text-gray-500">{data.destinations[index.odd].destinationInfo}
    </p>
  </div>
</div>
}

<button className='cursor-default' onClick={back}><FontAwesomeIcon className='text-5xl text-slate-300 cursor-pointer' icon={faCircleChevronRight} /></button>
    </div>
      </div>
    </div>
  
  )
}

export default Home
