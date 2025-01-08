import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
            required : true    //do not use lowercase true it affects while comparing password with bcrypt
        },
        userAvatar : {
            type : String,
        },
        userAvatarPublicId :{
            type : String
        },
        contactNo : {
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

// this middleware  hash password before saving it to Db
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
//It checks the password given by the client against the password present in the database and returns a boolean.
userSchema.methods.verifyPassword = async function (password){
    return  await bcrypt.compare(password, this.password)
}
// this method generates token 
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id : this._id,
        username : this.username,
        email : this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })
}

export const User = mongoose.model("User", userSchema)