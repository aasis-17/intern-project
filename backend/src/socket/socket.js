//socket connection
//we use namespace path for creating multiple connections or chats
//io.of("/custom-namespace") this creates custom namespace
import { Server } from "socket.io";
// import { User } from "./src/model/role.model/user.model.js";
import {createServer} from "http"
import app from "../app.js"
import jwt from "jsonwebtoken"
import { Chat } from "../model/chat.model.js";

export const server = createServer(app)

const io = new Server(server)

const usp = io.of("/user-namespace")

usp.on("connection", async (socket) => {
    console.log("User connected!!")
//here we set user online true if connected else false while disconnected
    const token = socket.handshake.auth?.token
    // const {_id} = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    // await User.findByIdAndUpdate(_id, {
    //     $set : {
    //         is_online : "true"
    //     }
    // })


    //Here we broadcast online userId to all clients
    socket.broadcast.emit("onlineUserId", _id)

    //here server receive chat object from client
    socket.on("newMessage", (data) => {
        console.log(data)
        socket.broadcast.emit("broadcastMsg", data) //this will send chat obj msg to all client connected to server
    })

    //load old chat from database
    socket.on("existingChat", async (data) => {
        const chats = await Chat.find(
                {$or : [
                    {sender_id : data.sender_id, receiver_id : data.receiver_id},
                    {sender_id : data.receiver_id, receiver_id : data.sender_id}
                    ]
                })
        socket.emit("loadExistingChat", chats) //here we send database document to client
    })


    socket.on("disconnect", () => {
        console.log("user disconnected!!")
        // await User.findByIdAndUpdate(_id, {
    //     $set : {
    //         is_online : "false"
    //     }
    // })

    //Here we broadcast offline userId 
    socket.broadcast.emit("offlineUserId", _id)
    })
})