import dotenv from "dotenv"
import { connectDb, shutdownDb } from "./src/dbConnection/index.js";
import app from "./src/app.js";
import {createServer} from "http"

import { initializeAdmin } from "./src/contorller/auth.controller.js";


dotenv.config(
    {
        path :"./.env"
})

const PORT = process.env.PORT || 7000
const URL = process.env.MONGODB_URL


const server = createServer(app)

import { initSocket, shutdownSocket} from "./src/socket/socket.js"
import { isStringObject } from "util/types";

	const io = initSocket(server)
	// Verify socket is initialized
if (!io) {
    console.error('❌ Failed to initialize Socket.IO');
    process.exit(1);
}

const serverListner = (PORT) =>{
	console.log(typeof PORT)
		server.listen(PORT , () => {
		console.log("**✅ Server started at port!!"+ PORT)
    })
}


const startServer = async(currentPORT) =>{
    try {
      await connectDb(URL)

	  await initializeAdmin()

		serverListner(currentPORT)
		


    } catch (error) {
			console.log("**🛑 Server startup failed!!**", error)
    	process.exit(1) // terminates node.js process, 1 indicate Error / abnormal termination
        
    }
}

let isShuttingDown = false

const shutdown = async(signal) => {
	if(isShuttingDown) return
	isShuttingDown = true

	console.log("🛑 Shutting down server gracefully...", signal);

	try {
		await new Promise((resolve) => {
			server.close(() => {
			console.log("✅ HTTP server closed !!");
			resolve()
  		})
		})

		await shutdownSocket()

		await shutdownDb()

		process.exit(0)

	} catch (error) {
		console.log("🛑 Error while shutdown..", error)
		process.exit(1)
	}
};

		server.on("error", (error) => {

	if(error.code === "EADDRINUSE"){
		console.log("Port is in use, Retrying in another PORT...")
		server.close();
		const newPORT = Number(PORT) + 1
		console.log(newPORT)
		setTimeout(()=>{
			
			serverListner(newPORT)
		}, 1000)

	}else{
  console.log("**🛑 Server error!!**", error)
  shutdown("server_error")
	}

})



process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("SIGUSR2", shutdown);

startServer(PORT)

