import { memo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';

const DestinationCard = (destinationDetail) => {

  const {
  _id,
  destinationName,
  destinationInfo,
  destinationCoverImage,
  avgReview,
  variant = "grid"
  } = destinationDetail

  const isList = variant === "list"

  const navigate = useNavigate()
  const location = useLocation()

  const handelNavigation = useCallback(() => {
    navigate(`/destination/${_id}`)
  },[_id, navigate])
    
  // if(location.pathname === "/destination") 
     return (
    <div onClick={handelNavigation} className={`${isList ? "sm:flex mb-7 h-60 sm:w-full hover:shadow-xl shadow-md" : "h-56 max-w-sm shadow-lg " } rounded overflow-hidden  relative cursor-pointer `}>
      {/* Image Container */}
      <div className={`${isList ? "sm:w-1/3" : "rounded-lg" }  relative  overflow-hidden`}>
        {/* Image */}
        <img
          className={`${isList ? "h-60" : "h-56"}  w-full  object-cover transition-transform duration-300 transform hover:scale-110`}
          src={destinationCoverImage}
          alt={destinationName}
        />

        {/* Dark Gradient Overlay at the Bottom */}
        <div className={`${isList ? "h-28 -z-0 bg-gradient-to-t from-black/80 to-transparent " : "h-24 bg-gradient-to-t from-black/60 to-transparent"}absolute  top-32 inset-0 `}></div>
      </div>
      {isList &&
        <div className="flex-1 p-9 ">
            <span className='font-garamond text-lg'>{destinationInfo}</span>
        </div>
      }


      {/* Review Overlay */}
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
        ⭐ {avgReview?.toFixed(1)}
      </div>

      {/* Destination Name */}
      <div className="absolute bottom-2 left-2 text-white font-bold text-xl">
        {destinationName}
      </div>
    </div>
  )
//   else return(
// <div onClick={()=> navigate(`/destination/${_id}`)} className={`${className}h-56 max-w-sm rounded overflow-hidden shadow-lg relative`}>
//       {/* Image Container */}
//       <div className=" relative rounded-lg overflow-hidden">
//         {/* Image */}
//         <img
//           className={`h-56 w-full object-cover transition-transform duration-300 transform hover:scale-110`}
//           src={destinationCoverImage}
//           alt={destinationName}
//         />

//       {/* Dark Gradient Overlay at the Bottom */}
//         <div className="absolute h-24 top-32 inset-0 bg-gradient-to-t from-black/60 to-transparent "></div>
//       </div>

//       {/* Review Overlay */}
//       <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
//         ⭐ {avgReview?.toFixed(1)}
//       </div>

//       {/* Destination Name */}
//       <div className="absolute bottom-2 left-2 text-white font-bold text-xl">
//         {destinationName}
//       </div>
//     </div>
  // )
};

export default memo(DestinationCard);