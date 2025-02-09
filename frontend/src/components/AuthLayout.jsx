import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../store/authContext'
import Modal from "./Modal"
import Login from '../pages/Login'

function PageProtector({children, authentication = true}) {
  
    const navigate = useNavigate()
    const {state} = useContext(AuthContext)

    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if(authentication && state.isAuthenticated !== authentication){
            setVisible(true)
        }
        else if(!authentication && state.isAuthenticated !== authentication){
        state.userData.role === "admin" ? navigate("/admin",{ replace : true}) : navigate("/",{ replace : true})  //it is same as history.forward()      
        }

    },[state.isAuthenticated, navigate,  authentication])
      
    return(<>
                {!visible && children}
                <Modal 
                    onClose={() =>{
                    setVisible(false)
                    navigate(-1)   // it is same as history.back() (for previous path)
                    }}  
                    visible={visible}>
                    <Login onClose={()=> setVisible(false)}/>
                </Modal>
            </>)
}

export default PageProtector