import { ApiResponse } from "./index.js"
export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
         Promise.resolve(requestHandler(req, res, next))
         .catch((error) => {
            console.log(error)
            return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "error"))
         })
    }
}