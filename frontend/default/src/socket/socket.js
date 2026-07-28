import { useState } from "react";
import {io} from "socket.io-client"

//  const server = io(import.meta.env.VITE_API_URL,{
//     withCredentials : true,
//     autoConnect : false
// })

let userSocket;
// let adminSocket;

export const connectUserSocket = (token) => {
  if(!userSocket){
    userSocket = io(`${import.meta.env.VITE_API_URL}/user-namespace`,{
      auth: { token },
      transports:['WebSocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
})
  }
  console.log('✅ user connected to socket');
    return userSocket
}


        // Listen for approval
export const onServiceApprovle = (socket) =>{
  const [status, setStatus] = useState({})
    socket?.on('service-approved', (data) => {
        console.log('🎉 Service approved:', data);
        setStatus({
            type: 'approved',
            message: data.message
        });
       
    });
     return status
}
  //listen for reject
export const onServiceReject = (socket) =>{
  const [status, setStatus] = useState({})
    socket?.on('service-rejected', (data) => {
        console.log('🎉 Service rejected:', data);
        setStatus({
            type: 'approved',
            message: data.message
        });
       
    });
     return status
}


export const disconnectSockets = () =>{
  userSocket?.disconnect(),
  userSocket?.off('service-approved');
  userSocket?.off('service-rejected');
  // adminSocket?.disconnect(),
  userSocket = null
  // adminSocket = null
  console.log('Socket disconnected')
}
