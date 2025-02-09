import mongoose from "mongoose";

const nearbyplacesSchema = new mongoose.Schema({

    destinationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Destination"
    },
    destinationRouteId : {
        type : mongoose.Schema.Types.ObjectId
    },
    placeMapCoordinates :{
        latitude : {
            type : Number,
            required : true
        },
        longitude : {
            type : Number,
            required : true
        }
    },
    defaultPlaceDetails : {
        placeName : {
            type :String,
            required : true
        },
        placeContactNo : {
            type : Number,
            required : true
        }

    },
    placeOption : {
        enum : ["Hotel", "Restaurent", "Others"],
        default : "Hotel"
    },
    serviceId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "ServiceOwner"
    }
})

export const NearByPlace = mongoose.model("NearByPlace", nearbyplacesSchema)