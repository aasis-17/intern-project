import { useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {  useAuth } from '../store/authContext'


function PageProtector({children, authentication = true}) {

    const {state, dispatch} = useAuth()
    
    useEffect(() => {
        if(authentication && state.isAuthenticated !== authentication){
            dispatch({type : "setModal", payload : true})
        }
        // else if(!authentication && state.isAuthenticated !== authentication){ 
        // : navigate("/",{ replace : true})  //it is same as history.forward()      
        // }
        // else if(authentication && state.isAuthenticated === authentication && state.userData.role !== "admin"){
        //     navigate("/error")
        // }        

    },[state.isAuthenticated, authentication])

    if(authentication && state.isAuthenticated !== authentication){
        return null
    }
      
    return children

}

export default PageProtector