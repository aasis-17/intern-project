export class ApiError extends Error {
    constructor(
        statusCode,
        message="Something went wrong!",
        errors=[],
    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.data = null
        this.errors = errors
        this.success = false

    }
}
//using this class we can return error response in structure