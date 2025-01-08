import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import pLimit from "p-limit"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const deleteMultipleFileFromServer = async(localFilePath) => {
    const files = localFilePath.map((filePath) => {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if(err) return reject()
                else resolve()
            })
        })
    })
    await Promise.all(files)
}

export const uploadFileOnCloudinary = async (localFilePath, type, folder) => {
    try {
        if(!localFilePath) throw error("Invalid local path!!")
        const response = await cloudinary.uploader.upload(localFilePath,{
                    resource_type : type,
                    asset_folder : `trekersHub/${folder}`
                })
        console.log("File uploaded to cloudinary successfully!!")
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        console.log("Error while uploading file on cloudinary!!", error)
        fs.unlinkSync(localFilePath)
    }
}

export const uploadMultipleFileOnCloudinary = async(localFilePath, type, folder) => {
    try {
        const limit = pLimit(10)
        const imagesToUpload = localFilePath.map((filePath) => {
            return limit(async () => {
                const response = await cloudinary.uploader.upload(filePath,{
                    resource_type : type,
                    asset_folder : `trekersHub/${folder}`,
                })
                return response
            })
        })
        const upload = await Promise.all(imagesToUpload)
        deleteMultipleFileFromServer(localFilePath)
        console.log("All files uploaded successfully!!")
        return upload
        
    } catch (error) {
        deleteMultipleFileFromServer(localFilePath)
        console.log("Error while uploading file on cloudinary!!", error)  
    }
}

export const removeFileFromCloudinary = async (publicId, type) => {
    try {
        if(publicId && typeof(publicId) === "string"){
            const response = await cloudinary.uploader.destroy(publicId,{
                resource_type : type
            })
            console.log("File removed from cloudinary successfully!!")
            return response
        }
        else if(Array.isArray(publicId) && publicId.length > 0){
            const response = await cloudinary.api.delete_resources(publicId,{
                resource_type : type
            })
            console.log("file removed from cloudinary successfully!!")
            return response;
        }
    } catch (error) {
        console.log("error while removing file from cloudinary!!", error)
        throw error
    }
}