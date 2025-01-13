import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
    {
        destinationName : {
            type : String,
            required : true,
            unique : true,
        },
        destinationInfo : {
            type : String,
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
        destinationMapCoordinates : {
            longitude :{
                type : Number,
                required : true
            },
            latitude : {
                type : Number,
                required : true
            }
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
                routeMapCoordinates : {
                    longitude :{
                        type : Number,
                        required : true
                    },
                    latitude : {
                        type : Number,
                        required : true
                    }
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
        
    },{timestamps : true}
)

export const Destination = mongoose.model("Destination", destinationSchema)