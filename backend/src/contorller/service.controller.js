import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { removeFileFromCloudinary, uploadFileOnCloudinary, uploadMultipleFileOnCloudinary } from "../utils/fileHandler.js";
import { ServiceOwner } from "../model/role.model/serviceOwner.model.js";
import { isValidObjectId } from "mongoose";
import { User } from "../model/role.model/user.model.js";
import mongoose from "mongoose";


export const upgradeToService = asyncHandler( async(req, res) => {

    const {serviceName, serviceInfo,serviceType, serviceDestination, latitude, longitude} = req.body

    if(!serviceInfo || !serviceName || !serviceDestination || !longitude || !latitude) throw new ApiError(400, "Field missing!!")

    const localFilePath = req.file?.path

    if(!localFilePath) throw new ApiError(400, "Image missing!!")

    const uploadImage = await uploadFileOnCloudinary(localFilePath, "image",`serviceImage/${serviceName}`)
    
    if(req.user.role === "admin"){
        const serviceOwner = await ServiceOwner.create({
            serviceType,
            serviceName,
            serviceInfo,
            serviceDestination,
            serviceLocationMapCoordinates : {
                longitude : longitude,
                latitude : latitude
            },
            serviceCoverImage : uploadImage.url,
            serviceCoverImagePublicId : uploadImage.public_id,
            isApproved : "default"
        })

        return res.status(201).json(new ApiResponse(200, serviceOwner, "Service created by admin successfully!!"))
    }else{
        const serviceOwner = await ServiceOwner.create({
            userId : req.user._id,
            serviceName,
            serviceInfo,
            serviceDestination,
            serviceLocationMapCoordinates : {
                longitude : longitude,
                latitude : latitude
            },
            serviceCoverImage : uploadImage.url,
            serviceCoverImagePublicId : uploadImage.public_id
        })
        
        return res.status(200).json(new ApiResponse(200, {serviceOwner}, "Request send to admin!!"))
    }

})

export const approveServiceRequest = asyncHandler( async(req, res) => {

    const {userId} = req.params

    if(!isValidObjectId(userId)) throw new ApiError(400, "Invalid userid!!")

    const upgrade = await User.findByIdAndUpdate(userId,{
        $set : {
            role : "serviceOwner"
        }
    },{
        new : true
    })

    if(!upgrade) throw new ApiError(500, "Server error!!")

    const approved = await ServiceOwner.findOneAndUpdate({userId }, {
        $set : {
            isApproved : "approved"
        }
    },{
        new : true
    })

    if(!approved) throw new ApiError(500, "Server error!!")

    return res.status(200).json(new ApiResponse(200, {}, `${upgrade.fullname} has been upgraded to service!!`))
})

export const getAllServices = asyncHandler(async(req, res) => {

    const {option, serviceDestination, search, reviewSort="dec", limit=10, page=1} = req.query
    console.log(option, serviceDestination)

    const filter = {}
    const sort = {}
    const pageNo = parseInt(page)
    const limitNo = parseInt(limit)
    const skip = (pageNo - 1) * limitNo; //NOTE : skip no of videos 

    if(reviewSort) sort.avgReview = reviewSort === "asc" ? 1 : -1

    if(option) filter.isApproved = option
    if(serviceDestination) filter.serviceDestination = serviceDestination
    if(search) filter.serviceName = {$regex : search, $options : "i"}

    console.log(filter)

    // if(!serviceRequest) throw new ApiError(400, "request missing!")
      const services = await ServiceOwner.aggregate([{
    
            $match : filter
        },
        {
                    
            $lookup :{
                from : 'users',
                localField : "userId",
                foreignField : "_id",
                as : "userId",
            }
        },
        {
            $addFields : {
                userId : {$first : "$userId"} 
            }
        },
        {
            $lookup :{
                from : 'reviews',
                localField : "reviews",
                foreignField : "_id",
                as : "reviews",
            }
        },
        {
            $addFields : {
                avgReview : {
                    $avg : "$reviews.rating"
                }
            }
        },
        {
            $sort : sort
        },
        {
            $skip : skip
        },
        {
            $limit : limitNo
        }
    ]
    )

    // const requests = await ServiceOwner.find(filter).populate("userId").sort(sort).limit(limitNo).skip(skip)

    if(!services) throw new ApiError(500, "Server error!!")

            const totalCount = await ServiceOwner.countDocuments(filter)
        
            const pagination = {
                currentPage : pageNo,
                totalPage : Math.ceil(totalCount / limitNo),
                totalCount 
            }

    return res.status(200).json(new ApiResponse(200, services, "Service requests fetched successfully!!"))
})

export const rejectServiceRequest = asyncHandler(async(req, res) => {

    const {serviceId} = req.params

    if(!isValidObjectId(serviceId)) throw new ApiError(400, "Invalide service id!!")

        const rejected = await ServiceOwner.findByIdAndUpdate({serviceId}, {
            $set : {
                isApproved : "rejected"
            }
        },{
            new : true
        })

    // const serviceOwner = await ServiceOwner.findByIdAndDelete(serviceId)
    
    // if(!serviceOwner) throw new ApiError(500, "Server Error while removing service owner!!")

    // await removeFileFromCloudinary(serviceOwner.serviceCoverImagePublicId, "image")

    return res.status(200).json(new ApiResponse(200, {}, "Service rejected!!"))
})

export const updateServiceInfo = asyncHandler( async(req, res) => {

    const {serviceId} = req.params
    console.log("body",req.body)

    if(!isValidObjectId(serviceId)) throw new ApiError(400, "Invalid service id!!")
    
    const {serviceName, serviceInfo,serviceType, serviceDestination, latitude, longitude} = req.body

    if(!serviceName || !serviceDestination || !serviceInfo || !longitude || !latitude) throw new ApiError(400, "Fields missing!!")

    const serviceOwner = await ServiceOwner.findByIdAndUpdate(serviceId, {
        $set : {
            serviceName,
            serviceInfo,
            serviceType,
            serviceDestination,
            serviceLocationMapCoordinates : {
                latitude : latitude,
                longitude : longitude
            }
        }
    },{ new : true })

    if(!serviceOwner) throw new ApiError(500, "Error while updating!!")

    return res.status(200).json(new ApiResponse(200, serviceOwner, "service owner document updated successfully!!"))
})

export const addServiceImages = asyncHandler(async(req, res) => {

    const {serviceId} = req.params

    if (!isValidObjectId(serviceId)) throw new ApiError(400, "Invalid service id!!")

    const localFilePath = req.files?.map(file => file.path)

    if (!localFilePath[0]) throw new ApiError(400, "file missing!!")
    
    const serviceOwner = await ServiceOwner.findById(serviceId)

    if(!serviceOwner) throw new ApiError(400, "Service does not exists!!")
    
    if(serviceOwner.serviceImages.length > 6) throw new ApiError(400, `Image upload limit exceeded i.e 5`)
    
    const uploadImage = await uploadMultipleFileOnCloudinary(localFilePath, "image", `serviceImage/${serviceOwner.serviceName}`)

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
                $each : uploadImage.map(image => { 
                        return {
                             src : image.url,
                             publicId : image.public_id
                            }
                    })
            }
        }
    }, {new : true})

    return res.status(200).json(new ApiResponse(200, upload, "Image added to service owner!!"))  
})

export const removeServiceImage = asyncHandler( async( req, res) => {

    const {serviceId} = req.params

    if(!isValidObjectId(serviceId)) throw new ApiError(400, "Invalid guide id!!")

    const {src, publicId} = req.body
    console.log(src, publicId)
    
    if(!src || !publicId) throw new ApiError(400, "Image missing!!")
    
    const removeImages = await removeFileFromCloudinary(publicId, "image")

    if(!removeImages) throw new ApiError(500, "server error!!")

    const serviceOwner = await ServiceOwner.findByIdAndUpdate(serviceId,{
        $pull : {
            serviceImages : {src, publicId}           //$each is used with $push   //$in is used with $pull }
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

    const publicIds = serviceOwner.serviceImages?.reduce((acc, image) => {
        acc.push(image.publicId)
    },[] )

    await removeFileFromCloudinary(serviceOwner.serviceCoverImagePublicId,"image")

    await removeFileFromCloudinary(publicIds, "image")

    if(serviceOwner.isApproved === "default"){
        return res.status(200).json(new ApiResponse(200, serviceOwner, "Service removed successfully!!"))
    }else{
   const existingUser = await User.findByIdAndUpdate(req.user._id,{
        $set : {
            role : "user"
        }
    }, {new : true}) 

    return res.status(200).json(new ApiResponse(200, {serviceOwner, role : existingUser.role}, "service owner account deleted successfully!!"))
    }

    
})

export const getServiceProfileByUserId = asyncHandler(async(req, res) => {

    const {userId} = req.params

    if(!isValidObjectId(userId)) throw new ApiError(400, "Invalid userid!!")

    // const serviceProfile = await ServiceOwner.findOne({userId})
    const serviceProfile =await ServiceOwner.aggregate([
        {
            $match : {
                userId : new mongoose.Types.ObjectId(userId)
            }
        },{
            $lookup : {
                from : "reviews",
                localField : "reviews",
                foreignField : "_id",
                as : "reviews",
                pipeline : [{
                    $lookup : {
                        from : "users",
                        localField : "creator",
                        foreignField : "_id",
                        as : "creator"
                    }
                },{
                    $addFields : {
                        creator : {
                            $first : "$creator"
                        }
                    }
                }]
            }   
        },{
            $addFields : {
                avgReview : {
                    $avg : "$reviews.rating" 
                }
            }
        }
    ])

    if(!serviceProfile)  throw new ApiError(404, "Service profile not found!!")

    return res.status(200).json(new ApiResponse(200, serviceProfile[0] || null, "Service profile fetched successfully!!"))
})

export const updateServiceCoverImage = asyncHandler(async(req, res) => {

    const {serviceId} = req.params

    if(!isValidObjectId(serviceId)) throw new ApiError(400, "Invalid id!!")
    
    const localFilePath = req.file?.path

    if(!localFilePath) throw new ApiError(400, "File missing!!")

    const serviceOwner = await ServiceOwner.findById(serviceId)

    if(!serviceOwner) throw new ApiError(404, "Service doesnot exists!!")

    await removeFileFromCloudinary(serviceOwner.serviceCoverImagePublicId)

    const uploadImage = await uploadFileOnCloudinary(localFilePath, "image", `serviceImage/${serviceOwner.serviceName}`)

    if(!uploadImage) throw new ApiError(500, "Error while uploading image!!")

    const updatedCoverImage = await ServiceOwner.findByIdAndUpdate(serviceId,{
        $set : {
            serviceCoverImage : uploadImage.url,
            serviceCoverImagePublicId : uploadImage.public_id
        }
    },{ new : true})

    if(!updatedCoverImage) throw new ApiError(500, "Server error")

    return res.status(200).json(new ApiResponse(200, {}, "CoverImage updated successfully!!"))
})