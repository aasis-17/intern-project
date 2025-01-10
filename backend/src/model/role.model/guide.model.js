import mongoose from "mongoose"

const guideSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User", 
            unique : true
        },
        guideInfo : {
            type : String,
        },
        destination : {
            type : String,
            required : true
        },
        guideImage : [{
            type : String
        }],
        guideImagePublicId : [{
            type : String
        }],
        guideReview : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Review"
            }
        ]

    }
)

export const Guide = mongoose.model("Guide", guideSchema)