import { createContext, useEffect } from "react";
import { useAuth } from "./authContext";
import {  connectUserSocket, disconnectSockets, onServiceReject } from "../socket/socket.js";
import { useContext } from "react";
import { useState } from "react";

const SocketContext = createContext(null)

 export const SocketProvider = ({ children }) => {

  const {state} = useAuth()

  const token = state?.userData?.accessToken
  console.log(token, "socket token")

  const [userSocket, setUserSocket] = useState(null)

      useEffect(() =>{
        if(!state.isAuthenticated){
          disconnectSockets()
          return
        }

        const userSocket = connectUserSocket(token)

        setUserSocket(userSocket)

        console.log("userSocket", userSocket)

        return () => disconnectSockets()

    },[state.isAuthenticated])
  return (

    <SocketContext.Provider value={userSocket} >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext)

