const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
         Promise.resolve(requestHandler(req, res, next))
         .catch((error) => {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode,null,error.message))
         })
    }
}