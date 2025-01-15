import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        createdBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        reviewMessage : {
            type : String,
        },
        comments : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }],
        rating : {
            type : Number,
            enum : [0, 1, 2, 3, 4, 5],
            default : 0
        },
        destinationId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Destination"
        },
        guideId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Guide"
        },
        serviceId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "ServiceOwner"
        }
    }
)

export const Review = mongoose.model("Review", reviewSchema)