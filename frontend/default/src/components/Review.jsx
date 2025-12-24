import { useCallback, useContext, useState } from "react";
import { AuthContext } from "../store/authContext.jsx";
import Button from "./Button.jsx";
import { useReview } from "../utiles/useReview.js";
import ReviewList from "./ReviewList.jsx";

const ReviewComponent = ({reviewState, reviewId}) => {

  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState({
    rating : 0,
    comment : ""
  });

  const {state, dispatch} = useContext(AuthContext)

  const {reviews,
      createReviewMutation,
      deleteReviewMutation} = useReview({reviewState, reviewId})

  const handleReviewSubmit = () => {
      if(!state.isAuthenticated) {
        dispatch({type : "setModal", payload : true})
        return 
      } 
      createReviewMutation.mutate(review)
  }

  const handleReviewDelete = useCallback((id) =>{
    deleteReviewMutation.mutate(id)
  }, [deleteReviewMutation])

  const handleStarClick = (star) => {
    setReview(prev => ({...prev, rating : star }))
  };

  const handleStarHover = (star) => {
    setHoverRating(star);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleCommentChange = (e) => {
    setReview(prev => ({...prev, comment : e.target.value}))
  };

  return (
    <>
      {/* Display Submitted Reviews */}

       <ReviewList
        reviews = {reviews}
        user={state.userData}
        onDelete={handleReviewDelete}
        isDeleting={deleteReviewMutation.isPending}
        />

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
              star <= (hoverRating || review.rating)
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
        value={review.comment}
        placeholder="Write your review here..."
        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white placeholder-gray-400 text-gray-700"
        rows="5"
        name="review"
        onChange={handleCommentChange}
      />

      {/* Submit Button */}
      <Button
        onClick={handleReviewSubmit}
        loading={createReviewMutation.isPending}
        disabled={review.rating === 0 || !review.comment.trim()}
        className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
        children="Submit Review"
      />
        
      </div>
      </>
    
  );
};

export default ReviewComponent;