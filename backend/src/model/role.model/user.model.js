import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        fullname : {
            type : String,
            required : true,
            lowercase : true,
            trim : true
        },
        username : {
            type : String,
            required : true,
            lowercase : true,
            trim : true
        },
        email : {
            type : String,
            unique : true,
            required : true,
            lowercase : true,
            trim : true
        },
        password: {
            type : String,
            required : true,
            lowercase : true,
            trim : true
        },
        userAvatar : {
            type : String,
        },
        userAvatarPublicId :{
            type : String
        },
        contactno : {
            type : Number,
        },
        address : {
            type : String,
            lowercase : true,
            trim : true
        },
        gender : {
            type : String,
            enum : ["male", "female", "other"],
        },
        role : {
            type : String,
            enum : ["user", "admin", "guide", "serviceOwner", "productOwner"],
            default : "user"
        }
    }
)

export const User = mongoose.model("User", userSchema)