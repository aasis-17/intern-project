//socket connection
//we use namespace path for creating multiple connections or chats
//io.of("/custom-namespace") this creates custom namespace
import { Server } from "socket.io";
import jwt from "jsonwebtoken"
import { verifyUser } from "./middleware.js";
import registerUserEvents from "./user.socket.js";
import registerAdminEvents from "./admin.socket.js";

let io;

export const initSocket = (server) =>{

  if(io){
    console.log('Socket.IO already initialized');
    return io;
  }

   io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://localhost:3001"],
            credentials: true,
            methods: ["GET", "POST"],
            transports: ['websocket', 'polling']
        }
    })

	const userNs = io.of("/user-namespace")
  const adminNs = io.of("/admin")

	userNs.use(verifyUser)
  
	adminNs.use(verifyUser)

  registerUserEvents(userNs, adminNs)
  
  registerAdminEvents(adminNs, userNs)

  return io
}
//here we set user online true if connected else false while disconnected
    // const token = socket.handshake.auth?.token
    // const {_id} = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    // await User.findByIdAndUpdate(_id, {
    //     $set : {
    //         is_online : "true"
    //     }
    // })


    //Here we broadcast online userId to all clients
    // socket.broadcast.emit("onlineUserId", _id)

    //here server receive chat object from client
    // socket.on("newMessage", (data) => {
    //     console.log(data)
        // socket.broadcast.emit("broadcastMsg", data) 
				//this will send chat obj msg to all client connected to server
    // })

    //load old chat from database
    // socket.on("existingChat", async (data) => {
    //     const chats = await Chat.find(
    //             {$or : [
    //                 {sender_id : data.sender_id, receiver_id : data.receiver_id},
    //                 {sender_id : data.receiver_id, receiver_id : data.sender_id}
    //                 ]
    //             })
    //     socket.emit("loadExistingChat", chats) //here we send database document to client
    // })


    // socket.on("disconnect", () => {
    //     console.log("user disconnected!!")
        // await User.findByIdAndUpdate(_id, {
    //     $set : {
    //         is_online : "false"
    //     }
    // })

    //Here we broadcast offline userId 
    // socket.broadcast.emit("offlineUserId", _id)
    // })



export const shutdownSocket = () =>{
	return new Promise((resolve) =>{
		  console.log("🛑 Closing sockets...");
			if(!io) return resolve()
			
			io.close(() =>{
				console.log("✅ Socket.IO closed");
				resolve()
			})
	})
}

export const getIo = () =>{
    if(!io) return null
    return io
}



