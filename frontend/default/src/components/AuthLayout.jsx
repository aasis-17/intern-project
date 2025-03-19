import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../store/authContext'
import Modal from "./Modal"
import Login from '../pages/Login'

function PageProtector({children, authentication = true}) {
  
    const navigate = useNavigate()
    const {state, dispatch} = useContext(AuthContext)

    useEffect(() => {
        if(authentication && state.isAuthenticated !== authentication){
            // setVisible(true) 
            // navigate("login")
            dispatch({type : "setModal", payload : true})
        }
        else if(!authentication && state.isAuthenticated !== authentication){
        state.userData.role === "admin" && navigate("/admin",{ replace : true}) 
        // : navigate("/",{ replace : true})  //it is same as history.forward()      
        }
        // else if(authentication && state.isAuthenticated === authentication && state.userData.role !== "admin"){
        //     navigate("/error")
        // }        

    },[state.isAuthenticated, navigate,  authentication])
      
    return(<>
                {!state.isVisible && children}
                <Modal 
                    onClose={() =>{
                    dispatch({type : "setModal", payload : false})
                    navigate(-1)   // it is same as history.back() (for previous path)
                    }}  
                    visible={state.isVisible}>
                    <Login onClose={()=> dispatch({type : "setModal", payload : false})}/>
                    
                </Modal>
            </>)
}

export default PageProtector