import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import reviewService from "../services/reviewService"
import { toast } from "react-toastify"
import Notify from "../components/toast/Notify"


export const useReview = ({reviewState, reviewId}) => {

    const queryClient = useQueryClient()

    const {data} = useQuery({
        queryKey : ["reviews", reviewId],
        queryFn : () => reviewService.getReviews({reviewState, reviewId})
    })
    console.log(data)

    const createReviewMutation = useMutation({
        mutationFn : (reviewForm) => reviewService.createReview({reviewForm, reviewState, reviewId}),
        onSuccess : (data) => { 
            console.log(data)
            queryClient.setQueryData(["reviews", reviewId],
                (prev) => ({...prev, reviews : [...prev.reviews, data]})) 
            toast.success(Notify,{data : {msg : `Review submitted successfully!!`}, autoClose : 1000})
        },
        onError : (error) => {
        toast.error(Notify,{data : {msg :error || "Error while submitting review!!"}, autoClose : 1000})
        }
    })
        
    const deleteReviewMutation = useMutation({
        mutationFn : (reviewId) => reviewService.deleteReview(reviewId),
        onSuccess : (data) => {
            queryClient.setQueryData(["reviews", reviewId],(prev) => ({...prev, reviews : prev.reviews.filter(review => review._id !== data._id)}) )
            toast.success(Notify, {data : {msg :`Review deleted successfully!!`}, autoClose : 1000})
        },
        onError : (error) => {
        toast.error(Notify,{data : {msg : error ||`Error while deleting review!!`}, autoClose : 1000})
        }
    })

  return {
    reviews : data?.reviews || [],
    reviewPagination : data?.pagination,
    createReviewMutation,
    deleteReviewMutation
  }
}

