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
        serviceType : {
            type :String,
            enum : ["Hotel, restaurent", "Homestay"],
            default : "Hotel"
        },
        serviceInfo : {
            type : String,
        },
        serviceDestination : {
            type : String,
            required : true
        },
        serviceCoverImage : {
            type :String,
            required : true
        },
        serviceCoverImagePublicId : {
            type : String,
            required : true
        },
        serviceLocationMapCoordinates : {
            longitude :{
                type : Number,
                required : true
            },
            latitude : {
                type : Number,
                required : true
            }
        },
        serviceImages : [{
            src : {
                type : String
            },
            publicId : {
                type : String
            }
        }],
        reviews : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }],

        isApproved : {
            type : String,
            enum : ["pending", "approved", "rejected", "default"],
            default : "pending"
        }
    },{timestamps : true}
)

export const ServiceOwner = mongoose.model("ServiceOwner", serviceOwnerSchema)