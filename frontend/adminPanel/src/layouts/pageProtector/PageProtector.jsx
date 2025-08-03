import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

const PageProtector = ({children}) => {

  const navigate = useNavigate()
  const authStatus = useSelector((state) => state.auth.authStatus)

    if(!authStatus){ 
      return <Navigate to={"/"} replace/> 
    }

      return (
        <div>{children}</div>
      )
    }


export default PageProtector