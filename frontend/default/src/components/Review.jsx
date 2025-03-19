import React, { useContext, useState } from "react";
import { useLocation, useOutletContext } from "react-router";
import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import reviewService from "../services/reviewService.js"
import { AuthContext } from "../store/authContext.jsx";

const ReviewComponent = ({reviewState}) => {

  const [hoverRating, setHoverRating] = useState(0);
  const [reviews, setReviews] = useState({
    rating : 0,
    comment : ""
  });
  const queryClient = useQueryClient()
  const {state, dispatch} = useContext(AuthContext)

  const reviewDetails = queryClient.getQueryData([reviewState])

  const handleStarClick = (star) => {
    setReviews(prev => ({...prev, rating : star }))
  };

  const handleStarHover = (star) => {
    setHoverRating(star);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleCommentChange = (e) => {
    setReviews(prev => ({...prev, comment : e.target.value}))
  };

  const deleteMutation = useMutation({
    mutationFn : async(reviewId) => {
      const data = await reviewService.deleteReview(reviewId)
      return data
    },
    onSuccess : (data) => {
      if(reviewState === "serviceId"){
        queryClient.setQueryData([reviewState],(prev) => ({...prev, reviews : prev.reviews.filter(review => review._id !== data._id)}) )
        alert(`Review deleted successfully!!`)
      }else{
        queryClient.setQueryData( [reviewState], 
          (prev) => ({...prev, reviews : prev.reviews.filter(review => review._id !== data._id)}) )
        alert(`Review deleted successfully!!`)
      }
    },
    onError : () => {
      alert(`Error while deleting review!!`)
    }
  })

  const mutation = useMutation({
    mutationFn : async()=>{ 
      if(!state.isAuthenticated) {
        dispatch({type : "setModal", payload : true})
        return null
      } 
      else if (reviews.rating === 0 || !reviews.comment.trim() === "") {
        throw "Please provide a rating and a comment before submitting.";
      }
      const data = await reviewService.createReview(reviews, reviewState, reviewDetails._id)
      return data
    },
    onSuccess : (data) => {
      if(!data) return 
      if(reviewState === "serviceId"){
        queryClient.setQueryData([reviewState], data) 
        alert(`Review submitted to ${reviewState} successfully!!`)
        setReviews({rating : 0, comment : ""})
      }else{
        queryClient.setQueryData( [reviewState], data ) 
        alert(`Review submitted to ${reviewState} successfully!!`)
        setReviews({rating : 0, comment : ""})
      }

    },
    onError : (error) => {
      alert(error)
    }
  })

  return (
    <>
      {/* Display Submitted Reviews */}
      <div className=" p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">
          Submitted Reviews
        </h3>
        {reviewDetails?.length === 0 ? (
          <p className="text-gray-500 text-center">No reviews yet.</p>
        ) : (
          <div className="overflow-y-scroll h-96">{
          reviewDetails?.reviews.map((review) => (

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
            <p className="text-gray-800 font-semibold">- {review.creator.fullname}</p>
            {state.userData && review.creator._id === state.userData._id && <span onClick={() =>deleteMutation.mutateAsync(review._id)} className= " flex items-end  text-red-500 text-xs cursor-pointer">Delete</span>}
            </div>    
          </div>
            // <div
            //   key={review._id}
            //   className="flex  mb-4 p-4 bg-white rounded-lg shadow-md border border-purple-100"
            // >
            //   <div className="w-1/4">
            //     <img alt="avatar" className="w-7 h-7 rounded-full mb-2" src={review.creator.avatar} />
            //     <span>{review.creator.fullname}</span>
            //   </div>
            //   <div className="flex-1 items-center space-x-2  ">
            //     <div className="flex justify-end">
            //       {[...Array(review.rating)].map((_, i) => (
            //         <span key={i} className="text-yellow-400 text-xl">
            //           ★
            //         </span>
            //       ))}
            //     </div>
            //     <p className="text-gray-700 text-lg">{review.reviewMessage}</p>
                
            //   </div>
            //   {review.creator._id === state.userData._id && <span onClick={() =>deleteMutation.mutateAsync(review._id)} className= " flex items-end  text-red-500 text-xs cursor-pointer">Delete</span>}
            // </div>
            ))
          }
          </div>)
        } 
       </div>

    <div className=" p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-2xl border border-purple-100">
      <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">
        Share Your Feedback
      </h2>

      {/* Star Rating */}
        <div className="flex justify-center space-x-3 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            name="rating"
            value={star}
            onClick={(e)=> handleStarClick(star)  }
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleStarLeave}
            className={`text-4xl transition-all duration-300 ${
              star <= (hoverRating || reviews.rating)
                ? "text-yellow-400 transform scale-110"
                : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Comment Box */}
      <textarea
        value={reviews.comment}
        placeholder="Write your review here..."
        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white placeholder-gray-400 text-gray-700"
        rows="5"
        name="review"
        onChange={handleCommentChange}
      />

      {/* Submit Button */}
      <button
        onClick={mutation.mutate}
        className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
      >
        Submit Review
      </button>
      </div>
      </>
    
  );
};

export default ReviewComponent;