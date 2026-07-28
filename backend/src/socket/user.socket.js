
export default function registerUserEvents(userNs, adminNs) {

    userNs.on("connection", (socket) => {

        console.log("User connected");

        socket.join(`user:${socket.user._id}`);

        // socket.on("requestPost", async(data)=>{

            // Save to database

            // adminNs
            //     .to("admin-room")
            //     .emit("newRequest", {
            //         userId: socket.user._id,
            //         title: data.title
            //     });

        // })

        socket.on("disconnect",()=>{
            console.log("User disconnected");
        });

    });

}