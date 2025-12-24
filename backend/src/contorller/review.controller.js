import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { Review } from "../model/review.model.js";
import { isValidObjectId } from "mongoose";
import { Destination } from "../model/destination.model.js";
import { Guide } from "../model/role.model/guide.model.js";
import { ServiceOwner } from "../model/role.model/serviceOwner.model.js";
import mongoose from "mongoose";

export const createReview = asyncHandler( async(req, res) => {

    const reviewObject = req.query

    const {rating, comment} = req.body
    console.log(Object.keys(reviewObject)[0])

    if(!rating || !comment) throw new ApiError(400, "Field missing!!")

    const createdReview = await Review.create({
        creator : req.user._id,
        reviewMessage : comment,
        rating,
        ...reviewObject
    })

    if(!createdReview) throw new ApiError(500, "Server error while creating review!!")

    const review = await Review.findById(createdReview._id).populate("creator")

    // let addReview;
    // if(Object.keys(reviewObject)[0] === "destinationId"){
    //      addReview = await Destination.findByIdAndUpdate(reviewObject.destinationId,{
    //         $push : {
    //             reviews : createdReview._id
    //         }
    //     },{new : true}).populate({path :"reviews", populate :[ "comments","creator"]})
    // }
    // if(Object.keys(reviewObject)[0] === "guideId"){
    //      addReview = await Guide.findByIdAndUpdate(reviewObject.destinationId,{
    //         $push : {
    //             reviews : createdReview._id
    //         }
    //     },{new : true}).populate({path :"reviews", populate :[ "comments","creator"]})
    // }
    // if(Object.keys(reviewObject)[0] === "serviceId"){
    //      addReview = await ServiceOwner.findByIdAndUpdate(reviewObject.serviceId,{
    //         $push : {
    //             reviews : createdReview._id
    //         }
            
    //     },{new : true}).populate({path :"reviews", populate :[ "comments","creator"]})

    // }
    // console.log(addReview)
    //  if(!addReview) throw new ApiError(500, "Server error while adding review!!")
    
    return res.status(201).json( new ApiResponse(200, review, "Review created successfully!!"))
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

export const getReviews = asyncHandler( async(req, res) =>{

    const reviewObject = req.query
    console.log(reviewObject)
    const {page=1, limit=10} = req.query

    const filter = Object.keys(reviewObject).includes("serviceId")? {serviceId : new mongoose.Types.ObjectId(reviewObject["serviceId"])} : {destinationId : new mongoose.Types.ObjectId(reviewObject["destinationId"])}

    const pageNo = parseInt(page)
    const limitNo = parseInt(limit)

    const skip = (pageNo - 1) * limitNo; //NOTE : skip no of videos 

    if(!(reviewObject.hasOwnProperty("serviceId") || reviewObject.hasOwnProperty("destinationId"))) throw new ApiError(400, "Invalid id!!")

    // const reviews = await Review.find(reviewObject).populate("creator")

    const reviews = await Review.aggregate([{
        $match : filter
    },
    // {
    //     $addFields : {
    //         avgReview : {
    //             $avg : "$rating"
    //         }
    //     }
    // },
    {
        $lookup :{
            from : "users",
            localField : "creator",
            foreignField : "_id",
            as : "creator"
        }
    },{
        $addFields : {
            creator : {
                $first : "$creator"
            }
        }
    },{
        $limit : limitNo
    },{
        $skip : skip
    }

])

    console.log(reviews)

    const totalReview = await Review.countDocuments(filter)

    const pagination = {
        currentPage : pageNo,
        totalPage : Math.ceil(totalReview / limitNo),
        totalReview 
    }


    if(!reviews) throw new ApiError(500, "server error!!")

    return res.status(200).json(new ApiResponse(200, {reviews, pagination}, "Reviews fetched successfully!!"))
})      

export const getServiceReviews = asyncHandler(async(req, res) => {

    const {serviceId, limit, page} = req.query

    if(!isValidObjectId(serviceId) || !limit || !page) throw new ApiError(400, "Field missing!!")

    const reviews = await Review.aggregate([{
        $match : new mongoose.Types.ObjectId(serviceId)
    },
    // {
    //     $addFields : {
    //         $avg : "$rating"
    //     }
    // },
    {
        $lookup : {
            from : "users",
            localField : "creator",
            foreignField : "_id",
            as : "creator"
        }
    },{
        $addFields : {
            creator : {
                $first : "$creator"
            },
            reviewAvg : {
                $avg : "$rating"
            }
        }
    }
])

if(!reviews) throw new ApiError(500, "server error!!")

    return res.status(200).json(new ApiResponse(200, reviews, "Service review fetched successfully!!"))
    
}) 
