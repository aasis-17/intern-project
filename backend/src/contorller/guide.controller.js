import { Guide } from "../model/role.model/guide.model.js";
import { User } from "../model/role.model/user.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { removeFileFromCloudinary, uploadMultipleFileOnCloudinary } from "../utils/fileHandler.js";
import { isValidObjectId } from "mongoose";


export const updateRoleToGuide = asyncHandler(async(req, res) => {

    const { guideInfo, destination} = req.body

    if([ guideInfo, destination].some(field => field?.trim() === "")){
        throw new ApiError(400, "All fields must be filled!!")
    }

    const existingUser = await User.findByIdAndUpdate(req.user._id,{
        $set : {
            role : "guide"
        }
    }, {new : true})

    const localFilePath = req.files?.map(file => file.path)
    console.log(localFilePath)

    const uploadedImages = await uploadMultipleFileOnCloudinary(localFilePath, "image", "guideImage")

    if(!uploadedImages) throw new ApiError(500, "Server errror while uploading!!") 

    const createGuide = await Guide.create({
        userId : existingUser._id,
        guideInfo,
        destination,
        guideImage : uploadedImages?.map(image => image.url) || [],
        guideImagePublicId : uploadedImages?.map(image => image.public_id) || [],
    })

    if(!createGuide) throw new ApiError(500, "Server error!!")

    return res.status(201).json(new ApiResponse(200, createGuide, "User role updated to Guide!!"))

})  

export const getGuideProfile = asyncHandler( async(req, res) => {

    const guide = await Guide.findOne({userId : req.user._id})

    if(!guide) throw new ApiError(500, "Guide doesnot exists!!")
    
    return res.status(200).json(new ApiResponse(200, guide, "Guide profile fetched successfully!!"))
})

export const updateGuideInfo = asyncHandler(async(req, res) => {

    const {guideInfo, destination} = req.body

    if(!guideInfo || !destination) throw new ApiError(400, "Field missing!!")

    const guide = await Guide.findOneAndUpdate({userId : req.user._id},{
        $set : {
            guideInfo,
            destination
        }
    }, { new : true })

    if(!guide) throw new ApiError(500, "Server error while updating!!")

    return res.status(200).json( new ApiResponse(200, guide, "Guide details updates successfully!!"))

})

export const addGuideImages = asyncHandler( async(req, res) => {

    const {guideId} = req.params

    if(!isValidObjectId(guideId)) throw new ApiError(400, "Invalid guideId!!")
    
    const localFilePath = req.files?.map(file => file.path)

    if(!localFilePath) throw new ApiError(400, "File missing!!")

    const guide = await Guide.findById(guideId)

    if(!guide) throw new ApiError(500, "Guide doesnot exists!!")

    if(guide.guideImage.length > 6) throw new ApiError(400, "Upload limit crossed i.e 5!!")
    
    const uploadImage = await uploadMultipleFileOnCloudinary(localFilePath, "image", "guideImage")

    if(!uploadImage) throw new ApiError(500, "Error while uploading !!")

    uploadImage.forEach(image => {
         guide.guideImage.push(image.url)
         guide.guideImagePublicId.push(image.public_id)
    })

    guide.save({validateBeforeSave : false})

    return res.status(200).json(new ApiResponse(200, guide, "images added successfully!!"))
    
})

export const removeGuideImage = asyncHandler( async(req, res) => {

    const guideId = req.params.guideId

    if(!isValidObjectId(guideId)) throw new ApiError(400, "Invalid guide Id!!")

    const {guideImagePublicId, guideImage} = req.body
    console.log(req.body)

    if(!guideImagePublicId[0] || !guideImage[0]) throw new ApiError(400, "Images missing to remove!!")
    
    const removeImage = await removeFileFromCloudinary(guideImagePublicId, "image")

    if(!removeImage) throw new ApiError(500, "Error while removing images!!")

    const guide = await Guide.findById(guideId)

    if(!guide) throw new ApiError(500, "Guide not found!!")

    guideImage.forEach(image => {
        guide.guideImage.pull(image)
    })
    guideImagePublicId.forEach(imagePublicId => {
        guide.guideImagePublicId.pull(imagePublicId)
    })

    guide.save({validateBeforeSave : false})

    return res.status(200).json( new ApiResponse(200, guide, "Image removed from guide!!"))
   
})

export const deleteGuideAccount = asyncHandler(async(req, res) => {

    const guideId = req.params.guideId

    if(!isValidObjectId(guideId)) throw new ApiError(400, "Invalide guideId!!")
    
    const guide = await Guide.findById(guideId)
  
    const removeImage = await removeFileFromCloudinary(guide.guideImagePublicId)

    if(!removeImage) throw new ApiError(500, "Error while removing images!!")

    const deletedGuide = await Guide.findByIdAndDelete(guideId)

    if(!deletedGuide) throw new ApiError(500, "Server error!!")

    const user = await User.findByIdAndUpdate(guide.userId, {
        $set : {
            role : "user"
        }
    }, {new : true})

    return res.status(200).json(new ApiResponse(200, {deletedGuide, role : user.role}, "Guide account deleted successfully!!"))
})
