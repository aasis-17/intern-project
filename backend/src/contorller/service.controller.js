import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { removeFileFromCloudinary, uploadMultipleFileOnCloudinary } from "../utils/fileHandler.js";
import { ServiceOwner } from "../model/role.model/serviceOwner.model.js";
import { isValidObjectId } from "mongoose";
import { User } from "../model/role.model/user.model.js";


export const upgradeToService = asyncHandler( async(req, res) => {

    if(req.user.role !== "user") throw new ApiError(400, `You are already + ${req.user.role}!!`)

    const {serviceName, serviceInfo, serviceDestination} = req.body

    if(!serviceInfo || !serviceName || !serviceDestination) throw new ApiError(400, "Field missing!!")

    const localFilePath = req.files?.map(file => file.path) 

    let uploadImage;
    if(localFilePath.length > 0){
        uploadImage = await uploadMultipleFileOnCloudinary(localFilePath, "image", "serviceImage")
    }
 
    const serviceOwner = await ServiceOwner.create({
        userId : req.user._id,
        serviceName,
        serviceInfo,
        serviceDestination,
        serviceImages : uploadImage?.map(image => image.url) || [],
        serviceImagePublicId : uploadImage?.map(image => image.public_id || [])
    })

    if(!serviceOwner) throw new ApiError(500, "Server error while creating service owner!!")
    
    const existingUser = await User.findByIdAndUpdate(req.user._id,{
        $set :{
            role : "serviceOwner"
        }
    },{ new : true })

    if(!existingUser) throw new ApiError(500, "Error while upgrading user!!")
    
    return res.status(200).json(new ApiResponse(200, {serviceOwner, role : existingUser.role}, "User upgraded to service owner!!"))
})

export const updateServiceInfo = asyncHandler( async(req, res) => {

    const {serviceId} = req.params

    if(!isValidObjectId(serviceId)) throw new ApiError(400, "Invalid service id!!")
    
    const {serviceName, serviceInfo, serviceDestination} = req.body

    if(!serviceName || !serviceDestination || !serviceInfo) throw new ApiError(400, "Fields missing!!")

    const serviceOwner = await ServiceOwner.findByIdAndUpdate(serviceId, {
        $set : {
            serviceName,
            serviceInfo,
            serviceDestination
        }
    },{ new : true })

    if(!serviceOwner) throw new ApiError(500, "Error while updating!!")

    return res.status(200).json(new ApiResponse(200, serviceOwner, "service owner document updated successfully!!"))
})

export const addServiceImages = asyncHandler(async(req, res) => {

    const {serviceId} = req.params

    if (!isValidObjectId(serviceId)) throw new ApiError(400, "Invalid service id!!")

    const localFilePath = req.files?.map(file => file.path)

    if (!localFilePath.length < 0) throw new ApiError(400, "file missing!!")
    
    const serviceOwner = await ServiceOwner.findById(serviceId)

    if(!serviceOwner) throw new ApiError(400, "Service does not exists!!")
    
    if(serviceOwner.serviceImages.length > 6) throw new ApiError(400, `Image upload limit exceeded i.e 5`)
    
    const uploadImage = await uploadMultipleFileOnCloudinary(localFilePath, "image", "serviceImage")

    if(!uploadImage) throw new ApiError(500, "Error while uploading!!")
        //NOTE : consume more time to return res, 3.36s
    
    // uploadImage.forEach(image => {
    //     serviceOwner.serviceImages.push(image.url)
    //     serviceOwner.serviceImagePublicId.push(image.public_id)
    // })

    // serviceOwner.save({validateBeforeSave : false})
//NOTE : consumed lesser time to return response 2.26s
    const upload = await ServiceOwner.findByIdAndUpdate(serviceId,{
        $push : {
            serviceImages : { 
                $each : uploadImage.map(image => image.url)
            },
            serviceImagePublicId : {
                $each : uploadImage.map(image => image.public_id)
            }
        }
    }, {new : true})

    return res.status(200).json(new ApiResponse(200, upload, "Image added to service owner!!"))  
})

export const removeServiceImage = asyncHandler( async( req, res) => {

    const {serviceId} = req.params

    if(!isValidObjectId(serviceId)) throw new ApiError(400, "Invalid guide id!!")

    const {serviceImages, serviceImagePublicId} = req.body

    if(serviceImages.length < 0 || serviceImagePublicId < 0) throw new ApiError(400, "Image not selected!!")
    
    const removeImages = await removeFileFromCloudinary(serviceImagePublicId, "image")

    if(!removeImages) throw new ApiError(500, "server error!!")

    const serviceOwner = await ServiceOwner.findByIdAndUpdate(serviceId,{
        $pull : {
            serviceImages : {              //$each is used with $push 
                $in : serviceImages     //$in is used with $pull 
            },
            serviceImagePublicId : {
                $in : serviceImagePublicId
            }
        }
    }, {new : true})

    if(!serviceOwner) throw new ApiError(500, "Error while removing images!!")

    return res.status(200).json( new ApiResponse(200, serviceOwner, "Images removed successfully!!"))
})

export const getServiceProfile = asyncHandler( async(req, res) => {

    const {serviceId} = req.params

    if(!isValidObjectId(serviceId)) throw new ApiError(400, "Invalid service id!!")

    const serviceOwner = await ServiceOwner.findById(serviceId)

    if(!serviceOwner) throw new ApiError(500, "Service owner doesnot exists!!")

    return res.status(200).json( new ApiResponse(200, serviceOwner, "Service owner profile fetched successfully!!"))
})

export const deleteServiceOwnerProfile = asyncHandler( async( req,res) => {

    const {serviceId} = req.params

    if(!isValidObjectId(serviceId)) throw new ApiError(400, "Invalide service id!!")

    const serviceOwner = await ServiceOwner.findByIdAndDelete(serviceId)

    if(!serviceOwner) throw new ApiError(500, "Server Error while removing service owner!!")

    await removeFileFromCloudinary(serviceOwner.serviceImagePublicId, "image")

    const existingUser = await User.findByIdAndUpdate(req.user._id,{
        $set : {
            role : "user"
        }
    }, {new : true}) 

    return res.status(200).json(new ApiResponse(200, {serviceOwner, role : existingUser.role}, "service owner account deleted successfully!!"))
    
})