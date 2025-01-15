import { isValidObjectId } from "mongoose";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { Comment } from "../model/comment.model.js";
import { Review } from "../model/review.model.js";


export const createComment = asyncHandler(async(req, res) => {

    const objectId = req.query

    // if(objectId) throw new ApiError(400, "field missing")

    const {message} = req.body

    if(!message) throw new ApiError(400, "Message is missing!!")

    const createComment = await Comment.create({
        createdBy : req.user._id,
        message,
        ...objectId
    })

    if(!createComment) throw new ApiError(500, "Server error while creating comment!!")

    let addComment;
    if(Object.keys(objectId)[0] === "reviewId"){
         addComment = await Review.findByIdAndUpdate(objectId.reviewId,{
            $push : {
                comments : createComment._id
            }
        },{new : true})
    }
    // if(Object.keys(objectId)[0] === "commentId"){
    //      addComment = await Comment.findByIdAndUpdate(objectId.commentId,{
    //         $push : {
    //             replyComments : createComment._id
    //         }
    //     },{new : true})
    // }

     if(!addComment) throw new ApiError(500, "Server error while adding review!!")

    return res.status(200).json(new ApiResponse(200, {createComment, addComment}, "Comment created successfully!!"))
})

export const updateComment = asyncHandler(async(req, res) => {

    const {commentId} = req.params

    if(!isValidObjectId(commentId)) throw new ApiError(400, "Invalid id!!")

    const {message} = req.body

    if(!message) throw new ApiError(400, "Field missing!!")

    const comment = await Comment.findByIdAndUpdate(commentId,{
        $set : {
            message
        }
    },{ new : true})

    if(!comment) throw new ApiError(500, "Server Error!!")

    return res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully!!"))
})

export const deleteComment = asyncHandler(async(req, res) => {

    const {commentId} = req.params

    if(!isValidObjectId(commentId)) throw new ApiError(400, "Invalid id!!")

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    if(!deletedComment) throw new ApiError(500, "Server error!!")

    return res.status(200).json(new ApiResponse(200, deletedComment, "Commentdeleted successfully!!"))
})

export const getCommentById = asyncHandler(async(req, res) => {

    const {commentId} = req.params

    if(!isValidObjectId(commentId)) throw new ApiError(400, "Invalid id!!")

    const comment = await Comment.findById(commentId).populate("replyComments")

    if(!comment) throw new ApiError(500, "Server error!!")

    return res.status(200).json(new ApiResponse(200, comment, "Comment fetched successfully!!"))
})