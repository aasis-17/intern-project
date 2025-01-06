import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"


const app = express()

//middlewares
app.use(express.urlencoded({extended : true})) //true means qs which parses nested object in query false means querystring which false to parse nested object in query

app.use(express.json())

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(cookieParser())

export default app