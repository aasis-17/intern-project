
export default function registerAdminEvents(adminNs, userNs){

    adminNs.on("connection",(socket)=>{

        console.log("Admin connected");

        socket.join("admin-room");

        socket.on("approveRequest",(data)=>{

            userNs
                .to(`user:${data.userId}`)
                .emit("approved",{
                    requestId:data.requestId
                });

        });

        socket.on("rejectRequest",(data)=>{

            userNs
                .to(`user:${data.userId}`)
                .emit("rejected");

        });

    });

}