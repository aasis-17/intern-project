import { useParams, Outlet } from 'react-router-dom'
import { useGetDestinationByIdQuery } from '../../../../services/apiSlice'

const Layout = () => {
  const {id} = useParams()

  const {data : destinationDetails, isLoading, isError}= useGetDestinationByIdQuery(id) 

  if( isLoading) return  <div>Loading..</div>

  return (
    <div className='h-full flex-1 py-5'>
        <Outlet context={destinationDetails}/>
    </div>
  )
}

export default Layout