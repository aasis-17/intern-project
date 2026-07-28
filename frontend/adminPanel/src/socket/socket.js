// admin-frontend/src/services/socket.js
import { useState } from 'react';
import { io } from 'socket.io-client';

// class SocketService {
//     constructor() {
//         this.socket = null;
//     }

//     connect(token) {
        
//     if (this.socket?.connected) {
//         return this.socket;
//     }
//         // Connect to the same backend
//         this.socket = io('http://localhost:8000/admin', {
//             auth: { token },
//             transports: ['websocket']
//         });

//         this.socket.on('connect', () => {
//             console.log('✅ Admin connected to socket');
//         });

//         this.socket.on('disconnect', () => {
//             console.log('❌ Admin disconnected');
//         });
//         this.socket.on("connect_error", (err) => {
//         console.error("❌ Socket error:", err.message);
//     });

//         return this.socket;
//     }

//     disconnect() {
//         if (this.socket) {
//             this.socket.disconnect();
//             this.socket = null;
//         }
//     }

//     on(event, callback) {
//         if (this.socket) {
//             this.socket.on(event, callback);
//         }
//     }

//     off(event, callback) {
//         if (this.socket) {
//             this.socket.off(event, callback);
//         }
//     }
// }

// export default new SocketService();

let adminSocket;

export const connectAdminSocket = (token) => {
      if(!adminSocket){
        adminSocket = io(`${import.meta.env.VITE_API_URL}/admin`,{
          auth: { token },
          transports:['WebSocket'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
    })
}
    console.log("Admin socket connected!!")
    return adminSocket
}

export const disconnectAdminSocket = () => {
  
  adminSocket?.off('service-approved');
  adminSocket?.off('service-rejected');
	adminSocket?.disconnect()
  // adminSocket?.disconnect(),
  adminSocket = null
  // adminSocket = null
  console.log('Admin Socket disconnected')
}

