import mongoose from "mongoose"
import { DB_NAME } from "../../constants.js"

export const connectDb = async (URL) => {
    try {
        await mongoose.connect(`${URL}/${DB_NAME}`)
        console.log("Database connected successfully!!")
    } catch (error) {
        console.log("Database connection failed!!")
        process.exit(1) // terminates node.js process, 1 indicate safe termination, by stoping current thread rather than current process
    }
}