import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({

    message : {
        type : String,
        required : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    // replyComments :[{
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : "Comment"
    // }],
    guideId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Guide"
    },
    reviewId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Review"
    },
    destinationId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Destination"
    },
    commentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }
},{
    timestamps : true
})

export const Comment = mongoose.model("Comment", commentSchema)