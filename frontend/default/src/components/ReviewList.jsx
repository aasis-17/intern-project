import ReviewStar from "./ReviewStar"
import Button from "./Button"
import { memo } from "react"

const ReviewList = ({reviews, user, onDelete, isDeleting}) => {
  return (
 <div className=" p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
    <h3 className="text-xl font-semibold text-purple-800 mb-4">
        Submitted Reviews
    </h3>
    {
    reviews?.length === 0 ? (
        <p className="text-gray-500 text-center">No reviews yet.</p>
        )
         : 
        (
          <div className="overflow-y-scroll h-96">
            {

          reviews.map((review) => (

            <div key={review._id} className="bg-white px-6 mb-5 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">

              <ReviewStar avgReview={review.rating} />

            <p className="text-gray-600 mb-2">"{review.reviewMessage}"</p>
            <div className="flex justify-between">
                <p className="text-gray-800 font-semibold">- {review.creator.fullname}</p>
                {
                    review.creator._id === user?._id 
                        && 
                    <Button 
                        variant="noCss" 
                        onClick={() =>onDelete(review._id)} 
                        className= " flex items-end  text-red-500 text-xs cursor-pointer" 
                        loading={isDeleting} 
                        children="Delete"
                    />
                }
            </div>    
          </div>
            ))
          }
          </div>)
        } 
       </div>
  )
}

export default memo(ReviewList)