import mongoose from "mongoose";

const serviceOwnerSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        serviceName : {
            type : String,
            required : true,
            trim : true
        },
        serviceInfo : {
            type : String,
        },
        serviceDestination : {
            type : String,
            required : true
        },
        serviceImages : [{
            type : String
        }],
        serviceImagePublicId : [{
            type : String
        }],
        serviceReview : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }]
    }
)

export const ServiceOwner = mongoose.model("ServiceOwner", serviceOwnerSchema)