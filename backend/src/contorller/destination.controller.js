import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { Destination } from "../model/destination.model.js";
import { removeFileFromCloudinary, uploadFileOnCloudinary, uploadMultipleFileOnCloudinary } from "../utils/fileHandler.js";
import { isValidObjectId } from "mongoose";
import mongoose from "mongoose";

export const createDestination = asyncHandler( async(req, res) => {

    const {destinationName, destinationInfo, longitude="12", latitude="123", destinationRegion, destinationTips} = req.body
    console.log(destinationInfo,destinationName, destinationTips)
    if(!destinationInfo || !destinationTips || !destinationName ||!longitude || !latitude || !destinationRegion){
        throw new ApiError(400, "Filed missing!!")
    }

    const localFileCoverPath = req.files.destinationCoverImage[0]?.path
    console.log(localFileCoverPath)

    if(!localFileCoverPath) throw new ApiError(400, "cover image is missing!!")
    
    const uploadCoverImage = await uploadFileOnCloudinary(localFileCoverPath, "image", `destinationImage/${destinationName}`)

    const localFilePath = req.files.destinationImages?.map(file => file.path) || []

    let uploadImage;
    if(localFilePath.length > 0){
        uploadImage = await uploadMultipleFileOnCloudinary(localFilePath, "image", `destinationImage/${destinationName}`)
    }

    const destination = await Destination.create({
        destinationName,
        destinationInfo,
        destinationRegion,
        destinationCoverImage : uploadCoverImage.url,
        destinationCoverImagePublicId : uploadCoverImage.public_id,
        destinationImages : uploadImage?.map(image => image.url) || [],
        destinationImagesPublicId : uploadImage?.map(image => image.public_id) || [],
        destinationMapCoordinates : {latitude : latitude, longitude : longitude},
        destinationTips
    })

    if(!destination) throw new ApiError(500, "Server error while creating destination!!")

    return res.status(201).json(new ApiResponse(200, destination, "Destination created successfully!!"))
})

export const updateDestination = asyncHandler( async (req, res) => {

    const {destinationId} = req.params

    if(!isValidObjectId(destinationId)) throw new ApiError(400, "Invalid id!!")

    const {destinationName, destinationInfo, destinationTips, latitude, longitude} = req.body
    console.log(req.body)

    if(!destinationInfo || !destinationTips || !destinationName || !longitude || !latitude){
        throw new ApiError(400, "Field missing!!")
    }

    const destination = await Destination.findById(destinationId)

    if(!destination) throw new ApiError(404, "Destination not found!!")

    const localFileCoverPath = req.file?.destinationCoverImage[0]?.path
    console.log(localFileCoverPath)

    let uploadCoverImage;

    if(localFileCoverPath){
        await removeFileFromCloudinary(destination.destinationCoverImagePublicId)
        uploadCoverImage = await uploadFileOnCloudinary(localFileCoverPath, "image", `destinationImage/${destinationName}`)
    }
    

    const updateDestination = await Destination.findByIdAndUpdate(destinationId, {
        $set : {
            destinationName,
            destinationInfo,
            destinationMapCoordinates : {latitude : latitude, longitude : longitude},
            destinationTips,
            destinationCoverImage : uploadCoverImage && uploadCoverImage.url ,
            destinationCoverImagePublicId : uploadCoverImage && uploadCoverImage.public_id
        }
    },{ new : true})

    if(!updateDestination) throw new ApiError(500, "Server errro while updating destination!!")

    return res.status(200).json( new ApiResponse(200, updateDestination, "Destination details updated successfully!!"))

})

// export const updateDestinationCoverImage = asyncHandler( async(req, res) => {

//     const {destinationId} = req.params

//     if(!isValidObjectId(destinationId)) throw new ApiError(400, "Invalid id!!")

//     const localFileCoverPath = req.file?.path

//     if(!localFileCoverPath) throw new ApiError(400, "CoverImage not selected!!")

//     const destination = await Destination.findById(destinationId)

//     if(!destination) throw new ApiError(500, "Destination not found!!")

//     await removeFileFromCloudinary(destination.destinationCoverImagePublicId)

//     const upload = await uploadFileOnCloudinary(localFileCoverPath, "image", `destinationImage/${destination.destinationName}`)

//     const updateCoverImage = await Destination.findByIdAndUpdate(destinationId,{
//         $set : {
//             destinationCoverImage : upload.url,
//             destinationCoverImagePublicId : upload.public_id
//         }
//     },{ new : true})

//     if(!updateCoverImage) throw new ApiError(500, "Server Error!!")

//     return res.status(200).json( new ApiResponse(200, updateCoverImage, "Destination cover image updated successfully!!"))

// })

export const addDestinationImage = asyncHandler( async(req, res) => {

    const {destinationId} = req.params

    if(!isValidObjectId(destinationId)) throw new ApiError(400, "Invalid Id!!")
    
    const destination = await Destination.findById(destinationId)

    if(!destination) throw new ApiError(500, "Destination doesnot exists!!")

    if(destination.destinationImages.length > 6) throw new ApiError(400, "upload limit exceeded!!")

    const localFilePath = req.files?.map(file => file.path)

    if(!localFilePath[0]) throw new ApiError(400, "Image missing!!")

    const upload = await uploadMultipleFileOnCloudinary(localFilePath, "image", `destinationImage/${destination.destinationName}`)

    if(!upload) throw new ApiError(500, "Server Error!!")

    const addImage = await Destination.findByIdAndUpdate(destinationId,{
        $push : {
            destinationImages : {
                    $each : upload.map(image =>  {
                        return {
                            src : image.url, 
                            publicId : image.public_id
                        }})
                },
            }

    },{ new : true})

    if(!addImage) throw new ApiError(500, "Server error while updating images!!")

    return res.status(200).json(new ApiResponse(200, addImage, "image added successfully!!"))
})

export const deleteDestinationImage = asyncHandler( async(req, res) => {

    const {destinationId} = req.params

    if(!destinationId) throw new ApiError(400, "Invalid Id!!")
    
    const {src, publicId} = req.body
    console.log(src, publicId)

    if(!src || !publicId) throw new ApiError(400, "Image missing!!")

    const removeImage = await removeFileFromCloudinary(publicId, "image")

    if(!removeImage) throw new ApiError(500, "Server error!!")

    const destination = await Destination.findByIdAndUpdate(destinationId,{
        $pull : {
            destinationImages : {src, publicId}
            },
            // destinationImagesPublicId : {
            //     $in : destinationImagesPublicId
            // }
        
    }, {new : true})

    if(!destination) throw new ApiError(500, "Server Error!!")

    return res.status(200).json(new ApiResponse(200, destination, "Image removed successfully!!"))

})

export const getDestinationById = asyncHandler(async(req,res) => {

    const {destinationId} = req.params
    console.log(destinationId)

    if(!isValidObjectId(destinationId)) throw new ApiError(400, "Invalid id!!")

    const destination = await Destination.findById(destinationId).populate({path :"reviews", populate :[ "comments","creator"]})

    console.log(destination)

    if(!destination) throw new ApiError(404, "Destination doesnot exists!!")

    return res.status(200).json(new ApiResponse(200, destination, "Destinaion fetched successfully!!"))

})

export const deleteDestination = asyncHandler(async(req, res) =>{

    const {destinationId} = req.params

    if(!isValidObjectId(destinationId)) throw new ApiError(400,"Invalid id!!")

    const deleteDestination = await Destination.findByIdAndDelete(destinationId)

    if(!deleteDestination) throw new ApiError(500, "Error while deleting document!!")

    await removeFileFromCloudinary(deleteDestination.destinationCoverImagePublicId, "image")
    await removeFileFromCloudinary(deleteDestination.destinationImagesPublicId, "image")

    return res.status(200).json(new ApiResponse(200, deleteDestination, "Destination deleted successfully!!"))
})

export const getAllDestination = asyncHandler(async(req, res) => {

    const { page=1, limit=10, search, region, sortType="asc", reviewSort="dec" } = req.query

    const filter ={}
    const sort ={}
    const pageNo = parseInt(page)
    const limitNo = parseInt(limit)
    const skip = (pageNo - 1) * limitNo; //NOTE : skip no of videos 
    console.log(skip,"ooo" )

    if(search) filter.destinationName = {$regex : search, $options : "i"}
    if(region) filter.destinationRegion = {$regex : region, $options : "i"}
    if(sortType) sort.destinationName = sortType === "asc" ? 1 : -1
    if(reviewSort) sort.avgReview = reviewSort === "asc" ? 1 : -1

    console.log(filter)
    console.log(page)

    const destinations = await Destination.aggregate([{

        $match : filter
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
    if(!destinations) throw new ApiError(400, "Server error!!")

    const totalCount = await Destination.countDocuments(filter)

    const pagination = {
        currentPage : pageNo,
        totalPage : Math.ceil(totalCount / limitNo),
        totalCount 
    }

    return res.status(200).json(new ApiResponse(200, {destinations, pagination}, "all destination fetched successfully!!"))
})

//trending top 5-10 destination on the basis of review rating 

export const addRoutePlan = asyncHandler(async(req, res) => {
    const {destinationId} = req.params

    if(!isValidObjectId(destinationId)) throw new ApiError(404, "Invalid id!!")
        const routePlan = req.body
    console.log(routePlan)

    if(!routePlan[0]) throw new ApiError(400, "Route plan missing!!")

    const destination = await Destination.findByIdAndUpdate(destinationId,{
            $set :{
                routePlan
            }
    
    },{new : true}).populate({path :"reviews", populate :[ "comments","creator"]})

    if(!destination) throw new ApiError(500, "serverError")

    return res.status(200).json(new ApiResponse(200, destination, "RoutePlan added successfully!!"))
})

export const removeRoutePlan = asyncHandler(async(req, res) =>{
    const {destinationId} = req.params

    if(!isValidObjectId(destinationId)) throw new ApiError(400,"Invalid id!")

    const {routeId} = req.body
    console.log(req.body)

    if(!routeId) throw new ApiError(400, "Route id missing!!")

    const destination = await Destination.findByIdAndUpdate(destinationId,{
        $pull :{
            routePlan : {_id : routeId}
        }
    },{new:true}).populate({path :"reviews", populate :[ "comments","creator"]})
    console.log(destination)
   
    if(!destination) throw new ApiError(404, "Destination not found!!")

    return res.status(200).json(new ApiResponse(200, destination, "Route removed successfully!!"))
    
})

export const getAllDestinationName = asyncHandler(async(_, res) => {

    const destinationNames = await Destination.find().select("destinationName destinationMapCoordinates")

    if(!destinationNames) return new ApiError(500, "server error!!")
        console.log(destinationNames)

    return res.status(200).json(new ApiResponse(200, destinationNames, "Destination names fetched successsfully!!"))
})