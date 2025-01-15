import app from "./src/app.js";
import dotenv from "dotenv"
import { connectDb } from "./src/dbConnection/index.js";
import {createServer} from "http"
import { Server } from "socket.io";

dotenv.config(
    {
        path :"./.env"
})

const server = createServer(app)

const io = new Server(server)

const PORT = process.env.PORT || 7000
const URL = process.env.MONGODB_URL

connectDb(URL)
.then( () => {
    server.listen(PORT, () => {
        console.log("**Server started at port!!"+ PORT)
    })
    server.on("error", () => {
        console.log("error", error)
        throw error
    })
})
.catch((error) => {
    console.log("Database connection failed!!", error)
})