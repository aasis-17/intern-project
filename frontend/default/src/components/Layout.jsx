import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useThrottel } from "../utiles/throttel";
import { useContext } from "react";
import { AuthContext } from "../store/authContext";

const Layout = ({children, className}) => {

  // const [lastScroll, setLastScroll] = useState(0)
  // const {dispatch} = useContext(AuthContext)

  // //scrolling header 
  // useEffect(()=>{
  //   const handleHeaderScroll = useThrottel(() => {
  //     const currentScroll = window.scrollY
  //     console.log(currentScroll, lastScroll)
  //     if(currentScroll > lastScroll) dispatch({type : "isVisible", payload : true})
  //     else dispatch({type : "isVisible", payload : false})
  //        setLastScroll(currentScroll)
  //   },400)
  //   window.addEventListener("scroll", handleHeaderScroll)

  //   return ()=> window.removeEventListener("scroll",handleHeaderScroll)
  // },[lastScroll])

  return (
    <div className={`${className}`}>
      {children }
      {/* <main> */}
        <Outlet /> {/* This renders the matching route's component */}
      {/* </main> */}
    </div>
  );
};

export default Layout;
