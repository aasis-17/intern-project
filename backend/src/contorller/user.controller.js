import { User } from "../model/role.model/user.model.js";
import fs from "fs"
import { ApiError, asyncHandler, ApiResponse } from "../utils/index.js";
import { removeFileFromCloudinary, uploadFileOnCloudinary } from "../utils/fileHandler.js";


export const signup = asyncHandler(async (req, res) => {

    const {fullname, username, email, password, gender, role} = req.body

    if([fullname, username, email, password, gender].some(field => field?.trim() === "")){
        throw new ApiError(400, "All fields are required!!")
    }

    const existingUser = await User.findOne({email})

    if(existingUser) throw new ApiError(400, "User already exists!!")
    
    const user = await User.create({
        fullname,
        username,
        email,
        password,
        gender,
        role
    })

    if(!user) throw new ApiError(500, "Error while creating user in DB!!")

    return res.status(201).json(new ApiResponse(200, user, "User created successfully!!"))

})

export const login = asyncHandler( async (req, res) => {

    const {email, password} = req.body

    if(!email || !password) throw new ApiError(400, "Email or password missing!!")
    
    const userExists = await User.findOne({email})

    if(!userExists) throw new ApiError(400, "User doesnot exists!!")

    const isPasswordCorrect =  await userExists.verifyPassword(password)

    if(!isPasswordCorrect) throw new ApiError(400, "Invalid password!!")

    const accessToken = await userExists.generateAccessToken()

    if(!accessToken) throw new ApiError(500, "Error while creating token!!")

    const options = {
        httpOnly : true,
        secure : true,
        sameSite : "none"
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, {accessToken}, "User login Successfully!!"))
})

export const logout = asyncHandler(async (req, res) => {
    
    const options = {
        httpOnly : true,
        sameSite : "none",
        secure : true
    }

    req.user = null
    
    return res.status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out Successfully!!"))
})

export const updateUserInfo = asyncHandler(async (req, res) => {

    const {fullname, gender, contactNo, address, username } = req.body

    if(!fullname || !gender || !username) throw new ApiError(400, "Field missing!!")

    const user = await User.findByIdAndUpdate(req.user._id, {
        $set : {
            fullname,
            username,
            gender,
            contactNo,
            address
        }
    },{ new : true })

    if(!user) throw new ApiError(500, "Server error!!")
    
    return res.status(200).json(new ApiResponse(200, user, "User info updated successfully!!"))
})

export const updateUserAvatar = asyncHandler(async (req, res) => {

    const localFilePath = req.file?.path
    console.log(localFilePath)

    if(!localFilePath) throw new ApiError(400, "File missing!!")
    try {
        req.user.userAvatarPublicId && await removeFileFromCloudinary(req.user.userAvatarPublicId, "image")
    } catch (error) {
        fs.unlinkSync(localFilePath)
        throw new ApiError(500, "Error while removing on cloudinary!!")
    }
    
    const userAvatar = await uploadFileOnCloudinary(localFilePath, "image", "users")

    if(!userAvatar) throw new ApiError(500, "Error while uploading on cloudinary!!")

    const user = await User.findByIdAndUpdate(req.user._id,{
        $set : {
            userAvatar : userAvatar.url,
            userAvatarPublicId : userAvatar.public_id
        }
    },{ new : true })

    if(!user) throw new ApiError(500, "Error while updating DB!!")
    
    return res.status(200).json(new ApiResponse(200, user, "User avatar updated successfully!!"))

})

export const updatePassword = asyncHandler(async(req, res) => {

    const {oldPassword, newPassword} = req.body

    if(!oldPassword || !newPassword) throw new ApiError(400, "password missing!!")

    const user = await User.findById(req.user._id)

    const isPasswordCorrect = await user.verifyPassword(oldPassword)

    if(!isPasswordCorrect) throw new ApiError(400, "Invalid password!!")

    user.password = newPassword
    await user.save({validateBeforeSave : false})

    return res.status(200).json(new ApiResponse(200, {}, "Password updated successfully!!"))
})

export const deactivateUser = asyncHandler(async(req,res) => {})

