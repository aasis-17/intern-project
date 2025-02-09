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
        destinationRegion :{
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
                src : {
                    type : String
                },
                publicId : {
                    type : String
                }
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
                routeMapCoordinates :{
                    sLocation : {
                        lat :{
                        type : Number,
                        required : true
                    },
                    lng : {
                        type : Number,
                        required : true
                    }
                   },
                        eLocation :{
                        lat :{
                        type : Number,
                        required : true
                    },
                    lng : {
                        type : Number,
                        required : true
                    }
                }
                }
                   
            }
            ],
        destinationTips : {
            type :String
        },
        reviews : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }]
        
    },{timestamps : true}
)

export const Destination = mongoose.model("Destination", destinationSchema)