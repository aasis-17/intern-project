import React from 'react'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useGetDestinationByIdQuery } from '../../../../services/apiSlice'

const Layout = () => {
        const {id} = useParams()
        console.log(id)
    
        const {data : destinationDetails, isLoading, isError, isSuccess}= useGetDestinationByIdQuery(id) 
    
        console.log(destinationDetails, "hrllllp")
    
        const navigate = useNavigate()
        console.log(destinationDetails)

  if( isLoading) return  <div>Loading..</div>
  return (
    <div className='h-full flex-1 py-5'>
        <Outlet context={destinationDetails}/>
    </div>
  )
}

export default Layout