    import jwt from "jsonwebtoken"
    export const verifyUser = (socket, next) =>{
        try {
            const token = socket.handshake.auth?.token
            const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) 
            socket.user = payload
            next()
        } catch (error) {
            console.log("error", error)
            next(new Error("Unauthorized!"))
    }
    }