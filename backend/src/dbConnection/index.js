import mongoose from "mongoose"
import { DB_NAME } from "../../constants.js"

export const connectDb = async (URL) => {
    try {
        await mongoose.connect(`${URL}/${DB_NAME}`)

        console.log("✅ Database connected successfully!!")
    } catch (error) {
        console.log("🛑 Database connection failed!!")
        throw error
    }
}

export const shutdownDb = async() =>{
	if(mongoose.connection.readyState !== 0){
		try {
			await mongoose.connection.close();
			console.log("✅ Database closed");
		} catch (error) {
			console.log("🛑 Error while shuttingdown database!!")
		}
	}

}