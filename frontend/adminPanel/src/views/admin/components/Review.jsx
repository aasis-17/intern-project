
const Review = ({reviewData}) => {
  
  return (
    <div>
            <div className="mt-8 p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">
          Reviews
        </h3>
              {reviewData?.reviews.length === 0 ? (
          <p className="text-gray-500 text-center">No reviews yet.</p>
        ) : (
          <div className="overflow-y-scroll h-96">{
          reviewData?.reviews?.map((review) => (

            <div key={review._id} className="bg-white px-6 mb-5 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                 <div className="flex justify-end">
                   {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}
                </div>              
            <p className="text-gray-600 mb-2">"{review.reviewMessage}"</p>
            <div className="flex justify-between">
            <p className="text-gray-800 font-semibold">- {review?.creator?.fullname}</p>
            {/* {state.userData && review.creator._id === state.userData._id && <span onClick={() =>deleteMutation.mutateAsync(review._id)} className= " flex items-end  text-red-500 text-xs cursor-pointer">Delete</span>} */}
            </div>    
          </div>
                      ))
          }
          </div>)
        } 
    </div>
    </div>
  )
}

export default Review