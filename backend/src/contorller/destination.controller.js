import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { Destination } from "../model/destination.model.js";
import { removeFileFromCloudinary, uploadFileOnCloudinary, uploadMultipleFileOnCloudinary } from "../utils/fileHandler.js";
import { isValidObjectId } from "mongoose";


export const createDestination = asyncHandler( async(req, res) => {

    const {destinationName, destinationInfo, destinationMapCoordinates, routePlan, destinationTips} = req.body

    if(!destinationInfo || !destinationTips || !destinationName || destinationMapCoordinates.some(field => field?.trim() === "") || routePlan.some(field => field?.trim() === "")){
        throw new ApiError(400, "Filed missing!!")
    }

    const localFileCoverPath = req.file?.destinationCoverImage.path

    if(!localFileCoverPath) throw new ApiError(400, "cover image is missing!!")
    
    const uploadCoverImage = await uploadFileOnCloudinary(localFileCoverPath, "image", `destinationImage/${destinationName}`)

    const localFilePath = req.files?.map(file => file.path)

    let uploadImage;
    if(localFilePath.length > 0){
        uploadImage = await uploadMultipleFileOnCloudinary(localFilePath, "image", `destinationImage/${destinationName}`)
    }

    const destination = await Destination.create({
        destinationName,
        destinationInfo,
        destinationCoverImage : uploadCoverImage.url,
        destinationCoverImagePublicId : uploadCoverImage.public_id,
        destinationImages : uploadImage.map(image => image.url) || [],
        destinationImagesPublicId : uploadImage.map(image => image.public_id) || [],
        destinationTips,
        routePlan
    })

    if(!destination) throw new ApiError(500, "Server error while creating destination!!")

    return res.status(201).json(new ApiResponse(200, destination, "Destination created successfully!!"))
})

export const updateDestination = asyncHandler( async (req, res) => {

    const {destinationId} = req.params

    if(!isValidObjectId(destinationId)) throw new ApiError(400, "Invalid id!!")

    const {destinationName, destinationInfo, destinationTips,destinationMapCoordinates, routePlan} = req.body

    if(!destinationInfo || !destinationTips || !destinationName || destinationMapCoordinates.some(field => field?.trim() === "") || routePlan.some(field => field?.trim() === "")){
        throw new ApiError(400, "Filed missing!!")
    }

    const destination = await Destination.findByIdAndUpdate(destinationId, {
        $set : {
            destinationName,
            destinationInfo,
            destinationMapCoordinates,
            destinationTips,
            routePlan
        }
    })

    if(!destination) throw new ApiError(500, "Server errro while updating destination!!")

    return res.status(200).json( new ApiResponse(200, destination, "Destination details updated successfully!!"))

})

export const updateDestinationCoverImage = asyncHandler( async(req, res) => {

    const {destinationId} = req.params

    if(!isValidObjectId(destinationId)) throw new ApiError(400, "Invalid id!!")

    const localFileCoverPath = req.file?.path

    if(!localFileCoverPath) throw new ApiError(400, "CoverImage not selected!!")

    const destination = await Destination.findById(destinationId)

    if(!destination) throw new ApiError(500, "Destination not found!!")

    await removeFileFromCloudinary(destination.destinationCoverImagePublicId)

    const upload = await uploadFileOnCloudinary(localFileCoverPath, "image", `destinationImage/${destination.destinationName}`)

    const updateCoverImage = await Destination.findByIdAndUpdate(destinationId,{
        $set : {
            destinationCoverImage : upload.url,
            destinationCoverImagePublicId : upload.public_id
        }
    },{ new : true})

    if(!updateCoverImage) throw new ApiError(500, "Server Error!!")

    return res.status(200).json( new ApiResponse(200, updateCoverImage, "Destination cover image updated successfully!!"))

})

export const addDestinationImage = asyncHandler( async(req, res) => {

    const {destinationId} = req.params

    if(!isValidObjectId(destinationId)) throw new ApiError(400, "Invalid Id!!")
    
    const destination = await Destination.findById(destinationId)

    const localFilePath = req.files?.map(file => file.path)

    if(localFilePath.length < 0) throw new ApiError(400, "Image missing!!")

    const upload = await uploadMultipleFileOnCloudinary(localFilePath, "image", `destinationImage/${destination.destinationName}`)

    if(!upload) throw new ApiError(500, "Server Error!!")

    const addImage = await Destination.findByIdAndUpdate(destinationId,{
        $push : {
            destinationImages : {
                $each : upload.map(image => image.url)
            },
            destinationImagesPublicId : {
                $each : upload.map(image => image.public_id)
            }          
        }
    })

    if(!addImage) throw new ApiError(500, "Server error while updating images!!")

    return res.status(200).json(new ApiResponse(200, addImage, "image added successfully!!"))
})

export const deleteDestinationImage = asyncHandler( async(req, res) => {

    const {destinationId} = req.params

    if(!destinationId) throw new ApiError(400, "Invalid Id!!")
    
    const {destinationImages, destinationImagesPublicId} = req.body

    if(destinationImages.length < 0 || destinationImagesPublicId.length < 0) throw new ApiError(400, "Image missing!!")

    const removeImage = await removeFileFromCloudinary(destinationImagesPublicId, "image")

    if(!removeImage) throw new ApiError(500, "Server error!!")

    const destination = await Destination.findByIdAndUpdate(destinationId,{
        $pull : {
            destinationImages : {
                $in : destinationImages
            },
            destinationImagesPublicId : {
                $in : destinationImagesPublicId
            }
        }
    }, {new : true})

    if(!destination) throw new ApiError(500, "Server Error!!")

    return res.status(200).json(new ApiResponse(200, destination, "Image removed successfully!!"))

})

export const getDestinationById = asyncHandler(async(req,res) => {

    const {destinationId} = req.params

    if(!destinationId) throw new ApiError(400, "Invalid id!!")

    const destination = await Destination.findById(destinationId)

    if(!destination) throw new ApiError(404, "Destination doesnot exists!!")

    return res.status(200).json(new ApiResponse(200, destination, "Destinaion fetched successfully!!"))

})

export const deleteDestination = asyncHandler(async(req, res) =>{

    const {destinationId} = req.params

    if(!isValidObjectId(destinationId)) throw new ApiError(400,"Invalid id!!")

    const deleteDestination = await Destination.findByIdAndDelete(destinationId)

    if(!deleteDestination) throw new ApiError(500, "Error while deleting document!!")

    await removeFileFromCloudinary(deleteDestination.destinationCoverImagePublicId, "image")
    await removeFileFromCloudinary(deleteDestination.destinationImagesPublicId)

    return res.status(200).json(new ApiResponse(200, deleteDestination, "Destination deleted successfully!!"))
})