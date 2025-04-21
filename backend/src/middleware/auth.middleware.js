import { User } from "../model/role.model/user.model.js";
import { ApiError, asyncHandler } from "../utils/index.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req, res, next) => {

    const encodedToken = await req.cookies?.accessToken || req.headers.authorization?.replace("Bearer","")

    console.log(encodedToken)
    if(!encodedToken) throw new ApiError(401, "Unauthorized request!!")
    
    const decodedToken = jwt.verify(encodedToken, process.env.ACCESS_TOKEN_SECRET)

    if(!decodedToken) throw new ApiError(500, "Error while verifying token!!")

    const user = await User.findById(decodedToken._id).select("-password")

    if(!user) throw new ApiError(500, "User not found!!")
    
    req.user = user

    next()
})

