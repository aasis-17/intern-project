import { User } from "../model/role.model/user.model.js";
import { ApiError, asyncHandler, ApiResponse } from "../utils/index.js";
import jwt from "jsonwebtoken"

const generateTokens = async (user) => {

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false})

    return {accessToken, refreshToken}
}

export const signup = asyncHandler(async (req, res) => {

    const {fullname, username, email, password, gender, role, contactNo, address} = req.body

    if([fullname, username, email, password, gender].some(field => field?.trim() === "")){
        throw new ApiError(400, "All fields are required!!")
    }

    const existingUser = await User.findOne({email})

    if(existingUser) throw new ApiError(400, "User already exists!!")
    
    const user = await User.create({
        fullname,
        username,
        email,
        password,
        gender,
        role,
        contactNo,
        address
    })

    if(!user) throw new ApiError(500, "Error while creating user in DB!!")

    return res.status(201).json(new ApiResponse(200, user, "User created successfully!!"))

})

export const login = asyncHandler( async (req, res) => {

    const {email, password} = req.body
    console.log(email, password)

    if(!email || !password) throw new ApiError(400, "Email or password missing!!")
    
    const userExists = await User.findOne({email})

    if(!userExists) throw new ApiError(400, "User doesnot exists!!")

    const isPasswordCorrect =  await userExists.verifyPassword(password)

    if(!isPasswordCorrect) throw new ApiError(400, "Invalid password!!")

    const {accessToken, refreshToken} = await generateTokens(userExists)

    if(!accessToken || !refreshToken) throw new ApiError(500, "Error while creating token!!")

    const options = {
        httpOnly : true,
        secure : true,
        sameSite : "none"
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {userExists,accessToken, refreshToken}, "User login Successfully!!"))
})

export const logout = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user._id,{
        $unset : {
            refreshToken : 1
        }
    }, { new : true })
    
    const options = {
        httpOnly : true,
        sameSite : "none",
        secure : true
    }

    req.user = null
    
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out Successfully!!"))
})

export const refreshAccessToken = asyncHandler(async(req, res) =>{
    
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(400, "unauthorized request!!")
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken._id)

    if(!user){
        throw ApiError(400, "Invalid refreshtoken!!")
    }
    //console.log(user.refreshToken)
    console.log(incomingRefreshToken)

    if(incomingRefreshToken !== user.refreshToken){
        throw new ApiError(400, "Refreshtoken expired or used!!")
    }

    const {accessToken, refreshToken} = await generateTokens(user)

    if(!accessToken || !refreshToken) throw new ApiError(500, "Error while creating token!!")

    const options = {
        httpOnly : true,
        secure : true,
        sameSite : "none"
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200, {
            accessToken,
            refreshToken : refreshToken
        }, "AccessToken refreshed successfully!!"
    ))
})

export const updatePassword = asyncHandler(async(req, res) => {

    const {oldPassword, newPassword} = req.body

    if(!oldPassword || !newPassword) throw new ApiError(400, "password missing!!")

    const user = await User.findById(req.user._id)

    const isPasswordCorrect = await user.verifyPassword(oldPassword)

    if(!isPasswordCorrect) throw new ApiError(400, "Invalid password!!")

    user.password = newPassword
    await user.save({validateBeforeSave : false}) 

    return res.status(200).json(new ApiResponse(200, {}, "Password updated successfully!!"))
})

