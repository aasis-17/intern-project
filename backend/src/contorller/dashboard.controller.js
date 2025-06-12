import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { Destination } from "../model/destination.model.js";
import {User} from "../model/role.model/user.model.js"
import { ServiceOwner } from "../model/role.model/serviceOwner.model.js";

export const totalDestinationCount = asyncHandler(async(req, res) => {

    const totalDestinationCount = await Destination.countDocuments({})

    const totalUserCount = await User.countDocuments({})

    const totalServiceCount = await ServiceOwner.countDocuments({})

    console.log(totalDestinationCount)

    return res.status(200).json(new ApiResponse(200, {totalDestinationCount, totalServiceCount, totalUserCount}, "Total destination count fetched successfuly!!" ))

})

export const totalUserCount = asyncHandler(async(req, res) => {
    const {role, gender, address} = req.query

    const filter ={}

    if(role) filter.role = role

    if(gender) filter.gender = gender

    if(address) filter.address = address

    const totalUserCount = await User.countDocuments(filter)

    return res.status(200).json(new ApiResponse(200, totalUserCount, "user count fetched!!"))

})

export const totalServiceCount = asyncHandler(async(req, res) => {

    const {isApproved, serviceType, serviceDestination} = req.query

    const filter = {}

    if(isApproved) filter.isApproved = isApproved

    if(serviceType) filter.serviceType = serviceType

    if(serviceDestination) filter.serviceDestination = serviceDestination

    const totalService = await ServiceOwner.find(filter)

    const totalServiceCount = await ServiceOwner.aggregate([
        {

        $match : filter,
    },
    {
        $group : {
            serviceType
        }
    },
{
    $addFields : {
        restaurent : {
            $
        }
    }
}])

    return res.status(200).json(new ApiResponse(200, totalService, "Service count fetched!!"))
})