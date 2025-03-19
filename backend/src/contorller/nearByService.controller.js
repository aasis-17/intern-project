import { isValidObjectId } from "mongoose"
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js"
import { removeFileFromCloudinary, uploadFileOnCloudinary } from "../utils/fileHandler.js"
import { NearByService } from "../model/nearbyServices.model.js"

export const createNearbyServices = asyncHandler( async(req, res) => {

    const {serviceName, serviceContactNo, latitude, longitude, destinationId, serviceOption} =req.body

    if(!serviceName || !serviceContactNo || !latitude || !longitude || !isValidObjectId(destinationId)){
        throw new ApiError(400, "Field missing!!")
    }

    const localFilePath = req.file?.path
    let coverImage;
    if(localFilePath) {
        coverImage = await uploadFileOnCloudinary(localFilePath, "image",`serviceImage/${serviceName}`)
    }

    const nearByService = await NearByService.create({
        serviceName, 
        serviceContactNo,
        serviceMapCoordinates : {
            latitude,
            longitude
        },
        serviceCoverImage : coverImage && coverImage.url,
        serviceCoverImagePublicId : coverImage && coverImage.public_id
    })

    if(!nearByService) throw new ApiError(500, "Server error!!")

    return res.status(201).json(new ApiResponse(200, nearByService, "Near by service added to destination"))

})

export const updateNearByServiceDetails = asyncHandler( async(req, res) =>{

    const {nearByServiceId} = req.params

    if(!isValidObjectId(nearByServiceId)) throw new ApiError(400, "Invalid id!!")

    const {serviceName, serviceContactNo, serviceOption, latitude, longitude, destinationId} = req.body

    if(!serviceName || !serviceContactNo || !latitude || !longitude || !isValidObjectId(destinationId)){
        throw new ApiError(400, "Field missing!!")
    }

    const existingService = await NearByService.findById(nearByServiceId)

    if(!existingService) throw new ApiError(404, "Service not found!!")

    const localFilePath = req.file?.path

    let updatedCoverImage;

    if(localFilePath){
       existingService.serviceCoverImage && await removeFileFromCloudinary(serviceCoverImagePublicId)
       updatedCoverImage = await uploadFileOnCloudinary(localFilePath, "image", `serviceImage/${serviceName}`)
    }

    const updatedDetails = await NearByService.findByIdAndUpdate(nearByServiceId,{
        $set : {
            serviceName,
            serviceContactNo,
            serviceOption,
            serviceMapCoordinates :{
                longitude, 
                latitude
            },
            serviceCoverImage : updatedCoverImage && updatedCoverImage.url,
            serviceCoverImagePublicId : updatedCoverImage && updatedCoverImage.public_id
        }
    },{new : true})

    if(!updatedDetails) throw new ApiError(500, "Servic error!!")

    return res.status(200).json(new ApiResponse(200, updatedDetails, "Details updated successfully!!"))
})

export const deleteNearByService = asyncHandler( async(req, res) =>{

    const {nearByServiceId} = req.params

    if(!isValidObjectId(nearByServiceId)) throw new ApiError(400, "iinvalid id!!")

    const deletedService = await NearByService.findByIdAndDelete(nearByServiceId)

    if(!deletedService) throw new ApiError(404, "Service not found!!")

    deletedService.serviceCoverImagePublicId && await removeFileFromCloudinary(deletedService.serviceCoverImagePublicId)

    return res.status(200).json(new ApiResponse(200, deleteNearByService,"Service removed successfully!!"))
})