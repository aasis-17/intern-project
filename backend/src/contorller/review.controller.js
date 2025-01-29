import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { Review } from "../model/review.model.js";
import { isValidObjectId } from "mongoose";
import { Destination } from "../model/destination.model.js";
import { Guide } from "../model/role.model/guide.model.js";
import { ServiceOwner } from "../model/role.model/serviceOwner.model.js";

export const createReview = asyncHandler( async(req, res) => {

    const objectId = req.query

    const {rating, comment} = req.body
    console.log(rating, comment)

    if(!rating || !comment) throw new ApiError(400, "Field missing!!")

    const createdReview = await Review.create({
        creator : req.user._id,
        reviewMessage : comment,
        rating,
        ...objectId
    })

    if(!createdReview) throw new ApiError(500, "Server error while creating review!!")

    let addReview;
    if(Object.keys(objectId)[0] === "destinationId"){
         addReview = await Destination.findByIdAndUpdate(objectId.destinationId,{
            $push : {
                destinationReview : createdReview._id
            }
        },{new : true})
    }
    if(Object.keys(objectId)[0] === "guideId"){
         addReview = await Guide.findByIdAndUpdate(objectId.destinationId,{
            $push : {
                guideReview : createdReview._id
            }
        },{new : true})
    }
    if(Object.keys(objectId)[0] === "serviceId"){
         addReview = await ServiceOwner.findByIdAndUpdate(objectId.serviceId,{
            $push : {
                serviceReview : createdReview._id
            }
            
        },{new : true})

    }
     if(!addReview) throw new ApiError(500, "Server error while adding review!!")
    
    return res.status(201).json( new ApiResponse(200, {createdReview}, "Review created successfully!!"))
})

export const updateReview = asyncHandler(async(req, res) => {

    const {reviewId} = req.params

    if(!isValidObjectId(reviewId)) throw new ApiError(400, "Invalid id!!")

    const {reviewMessage, rating} = req.body

    if(!reviewMessage || !rating) throw new ApiError(400, "Field missing!!")

    const updateReview = await Review.findByIdAndUpdate(reviewId, {
        $set :{
            reviewMessage,
            rating
        }
    },{ new : true})

    if(!updateReview) throw new ApiError(500, "Server error while updating review!!")

    return res.status(200).json(new ApiResponse(200, updateReview, "Review updated successfully!!"))
})

export const getReviewById = asyncHandler(async(req, res) => {

    const {reviewId} = req.params

    if(!isValidObjectId(reviewId)) throw new ApiError(400, "Invalid id!!")

    const review = await Review.findById(reviewId).populate('comments')

    if(!review) throw new ApiError(500, "Server error !!")

    return res.status(200).json(new ApiResponse(200, review, "Review fetched successfully!!"))
})


export const deleteReview = asyncHandler(async(req, res) => {

    const {reviewId} = req.params

    if(!isValidObjectId(reviewId)) throw new ApiError(400, "Invalid id!!")

    const review = await Review.findByIdAndDelete(reviewId)

    if(!review) throw new ApiError(500, "Server error while deleting review!!")

    return res.status(200).json( new ApiResponse(200, review, "Review deleted successfully!!"))
})

