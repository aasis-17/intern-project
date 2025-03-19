import mongoose from "mongoose";

const nearbyServicesSchema = new mongoose.Schema({

    serviceName : {
        type :String,
        required : true
    },
    serviceContactNo : {
        type : Number,
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
    serviceDestination : {
        type : String,
        required : true
    },
    serviceOption : {
        type :String,
        enum : ["Hotel, restaurent", "Homestay"],
        default : "Hotel"
    },

    serviceMapCoordinates :{
        latitude : {
            type : Number,
            required : true
        },
        longitude : {
            type : Number,
            required : true
        }
    }
})

export const NearByService = mongoose.model("NearByPlace", nearbyServicesSchema)