import { User } from "../model/role.model/user.model.js";
import { ApiError, asyncHandler, ApiResponse } from "../utils/index.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const generateTokens = async (user) => {

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.accessToken = accessToken
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
    
    const user = await User.findOne({email}).select("-refreshToken")

    if(!user) throw new ApiError(400, "User doesnot exists!!")

    const isPasswordCorrect =  await user.verifyPassword(password)

    if(!isPasswordCorrect) throw new ApiError(400, "Invalid password!!")

    const {accessToken, refreshToken} = await generateTokens(user)

    if(!accessToken || !refreshToken) throw new ApiError(500, "Error while creating token!!")

    const options = {
        httpOnly : true,
        secure : true,
        sameSite : "none"
    }
    // console.log(userDetails)
    // const user = Object.keys(userDetails).reduce((acc, field)=>{
    //     if(!["password", "refreshToken"].includes(field)){
    //         acc[field] = userDetails[field]
    //     }
    //     return acc
// },{})

    console.log(!user.role === "admin")

    if(user?.role === "admin"){ return res.status(200)
         //.cookie("accessToken", accessToken, options) 
         // if you want to handle access token from server side without client intervention using this it automatically set cookies in server side
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user, accessToken}, "Admin login Successfully!!")) 

    }else{
    return res.status(200)
    .cookie("accessToken", accessToken, options) 
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user}, "User login Successfully!!"))
    }
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

    console.log(incomingRefreshToken)
    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request!!")
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken._id)

    console.log(user)

    if(!user){
        throw new ApiError(400, "Invalid refreshtoken!!")
    }
    //console.log(user.refreshToken)
    console.log(incomingRefreshToken !== user.refreshToken)
    
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

export const initializeAdmin = async () => {
    try {
        // Check if any admin exists
        const adminCount = await User.countDocuments({ role: 'admin' });
        
        if (adminCount === 0) {
            console.log('No admin found. Creating default admin...');
            
            const defaultAdmin = {
                fullname: 'Administrator',
                username : "Admin123",
                email: process.env.DEFAULT_ADMIN_EMAIL || "admin@gmail.com",
                password: process.env.DEFAULT_ADMIN_PASSWORD||'admin123', 
                role: 'admin'
            };
            
            // Create admin
            await User.create({
                ...defaultAdmin
            });
            
            console.log('✅ Default admin created successfully!');
            console.log(`📧 Email: ${defaultAdmin.email}`);
            console.log(`🔑 Password: ${defaultAdmin.password}`);
            console.log('⚠️  Please change the password after first login!');
        } else {
            console.log(`✅ Admin already exists (${adminCount} admin(s))`);
        }
    } catch (error) {
        console.error('❌ Error initializing admin:', error);
    }
};

