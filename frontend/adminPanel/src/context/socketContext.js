import { useContext, useState } from "react";
import { createContext } from "react";
import { useEffect } from "react";
import { connectAdminSocket, disconnectAdminSocket } from "../socket/socket.js";
import { useSelector } from "react-redux";

const SocketCotext = createContext(null)

export const SocketProvider = ({children}) =>{

  const {accessToken : token, authStatus} = useSelector((state) => state.auth)

  // const token = state?.userData?.accessToken
  console.log( "socket token by useSelector", token)

  const [adminSocket, setAdminSocket] = useState(null)

  useEffect(() => {
    if(!authStatus){
        disconnectAdminSocket()
    }
    const adminSocket = connectAdminSocket(token)

    setAdminSocket(adminSocket)

    console.log("admin socket", adminSocket)
    return () => disconnectAdminSocket()
  },[token])

    return (
        <SocketCotext.Provider value={adminSocket}>{children}</SocketCotext.Provider>
    )

}

export const useSocket = () => useContext(SocketCotext)