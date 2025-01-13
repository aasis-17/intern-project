import { ApiError, asyncHandler } from "../utils/index.js";


export const accessToRole = (allowedRole) => {

    return asyncHandler(async(req,_,next) => {
        if(!allowedRole.includes(req.user.role)) throw new ApiError(400, "You are not authorized!!")
        next()
    })
}