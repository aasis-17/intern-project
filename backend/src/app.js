import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"

const app = express()

//middlewares

app.use(express.json())
app.use(express.urlencoded({extended : true})) //true means qs which parses nested object in query false means querystring which false to parse nested object in query
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))
app.use(cookieParser())

//router
import { userRouter, authRouter, guideRouter, serviceOwnerRouter, destinationRouter } from "./routes/index.js"

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/guide", guideRouter)
app.use("/api/v1/serviceOwner", serviceOwnerRouter)
app.use("/api/v1/destination", destinationRouter)

export default app