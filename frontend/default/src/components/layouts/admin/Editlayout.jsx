import React from 'react'
import { Outlet, useLocation, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import destinationService from '../../../services/destinationService'

const Editlayout = () => {

    const {destinationId} = useParams()
    console.log(destinationId)

    const {data : destinationDetail, isLoading} = useQuery({
        queryKey : ["destinationDetail"],
        queryFn : () => destinationId ? destinationService.getDestinationById(destinationId) : null
        
})

      console.log(destinationDetail)

if(isLoading) return <div>Loading..</div>

  return (
    <>
        <main className='flex-1'>
            <Outlet context={destinationDetail}/>
        </main>
    </>
  )
}

export default Editlayout