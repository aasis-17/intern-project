import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../store/authContext'
import Modal from "./Modal"
import Login from '../pages/Login'

function PageProtector({children, authentication = true}) {
  
    const navigate = useNavigate()
    const {state} = useContext(AuthContext)
    console.log(state.isAuthenticated !== authentication)

    const [isLoading, setIsLoading] = useState(true)
    const [visible, setVisible] = useState(false)
    const location = useLocation()
    const path = location.pathname.replace("/route","")
    console.log(path)

    useEffect(() => {
        if(authentication && state.isAuthenticated !== authentication){
            setVisible(true)
        }
        else if(!authentication && state.isAuthenticated !== authentication){
            navigate("/")
        }

        setIsLoading(false)

    },[state.isAuthenticated, navigate,  authentication])

    if(isLoading) return <div>loading...</div>
      
    return(<>
                {!visible && children}
                <Modal 
                    onClose={() =>{
                    setVisible(false)
                    navigate(`${path}`)
                    }}  
                    visible={visible}>
                    <Login onClose={()=> setVisible(false)} path={location.pathname}/>
                </Modal>
            </>)
}

export default PageProtector