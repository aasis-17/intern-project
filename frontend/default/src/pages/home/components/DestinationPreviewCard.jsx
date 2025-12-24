import { memo } from 'react'
import ReviewStar from '../../../components/ReviewStar'

const DestinationPreviewCard = ({destination, className, onClick}) => {
  return (
    <>
        
        <div onClick={onClick} className={` hover:scale-105 cursor-pointer w-[35%] rounded-xl overflow-hidden shadow-md transition hover:shadow-2xl ${className}`}>
        <img
          alt=""
          src={destination.destinationCoverImage}
          className=" h-1/2 w-full object-cover"
        />

        <div className="bg-white p-2 md:p-6 h-1/2 ">
          <div className='flex justify-between items-center'>
          <h3 className="md:mt-1 md:text-lg text-xs  text-gray-900 ">{destination.destinationName}</h3>

      <ReviewStar avgReview={destination.avgReview} />

          </div>

    <p className="md:mt-2 line-clamp-3 text-[8px]/relaxed md:text-sm/relaxed text-gray-500">{destination.destinationInfo}
    </p>
  </div>
</div>
</>
  )
}

export default memo(DestinationPreviewCard)