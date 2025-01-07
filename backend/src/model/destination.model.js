import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
    {
        destinationName : {
            type : String,
            required : true,
            unique : true
        },
        destinationInfo : {
            type : true,
            required : true
        },
        destinationCoverImage : {
            type : String,
            required : true
        },
        destinationCoverImagePublicId : {
            type : String,
            required : true
        },
        destinationImages : [
            {
                type : String
            }
        ],
        destinationImagesPublicId : [
            {
                type : String
            }
        ],
        destinationMapCodinates : {
            type : String,
            required : true
        },
        routePlan :[
            {
                day : {
                    type : Number,
                    required : true
                },
                routeTask : {
                    type : String,
                    required : true
                },
                routeMapCodinates : {
                    type : String,
                    required : true
                }
            }
        ],
        destinationTips : {
            type :String
        },
        destinationReview : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }]
        
    }
)

export const Destination = mongoose.model("Destination", destinationSchema)