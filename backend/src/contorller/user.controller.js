import { User } from "../model/role.model/user.model.js";
import fs from "fs"
import { ApiError, asyncHandler, ApiResponse } from "../utils/index.js";
import { removeFileFromCloudinary, uploadFileOnCloudinary } from "../utils/fileHandler.js";
import { isValidObjectId } from "mongoose";

export const updateUserInfo = asyncHandler(async (req, res) => {

    const {fullname, gender,email, contactNo, address, username } = req.body

    if(!fullname || !gender || !username) throw new ApiError(400, "Field missing!!")

    const user = await User.findByIdAndUpdate(req.user._id, {
        $set : {
            fullname,
            username,
            email,
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

export const getCurrentUser = asyncHandler(async(req, res) => {

    const {_id} = req.user

    if(!isValidObjectId(_id)) throw new ApiError(400, "Invalid userId!!")

    const user = await User.findById(_id).select("-password ")

    if(!user) throw new ApiError(404, "User not found!!")

    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully!!"))
})

export const getUserById = asyncHandler(async(req, res) => {

    const {userId} = req.params

    if(!isValidObjectId(userId)) throw new ApiError(400, "Invalid id !!")

    const userDetails = await User.findById(userId).select(["-password", "-refreshToken"])

    if(!userDetails) throw new ApiError(404, "User not found!!")

    return res.status(200).json(new ApiResponse(200, userDetails, "User fetched successfully!!"))
})

export const deactivateUser = asyncHandler(async(req,res) => {})

