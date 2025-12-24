import { useQuery } from '@tanstack/react-query'
import serviceOwnerService from '../../services/serviceOwnerServices'
import destinationService from '../../services/destinationService'
import Loader from '../../components/loader/Loader'
import { useNavigate } from 'react-router'
import { useCallback, useState } from 'react'
import  {useDebounceState}  from '../../utiles/debounce'
import FormField from '../../components/form/FormField'
import Error from '../Error'
import ServiceCard from './component/ServiceCard'

const Services = () => {

   const navigate = useNavigate()

    const [filter, setFilter] = useState({
        search : "",
        option : "approved",
        serviceDestination : ""
    })

    const debouncedFilter = useDebounceState(filter, 1000)
    console.log(debouncedFilter)

      const {data : services = [], isLoading, isError, error} = useQuery({
        // queryKey :["services", filter.search, filter.option, filter.serviceDestination],
        queryKey :["services", debouncedFilter],
        queryFn : () => serviceOwnerService.getAllServices(filter),
        placeholderData : (prev) => prev
      })

    const {data : destinations, isLoading : isDestinationLoading}= useQuery({
      queryKey : ["destinationName"],
      queryFn :  () => destinationService.getAllDestinationName(),
      staleTime: 1000 * 60 * 60, // 1 hour
    })
    console.log(destinations,"destination name")

    const handleSearch = useCallback((e) =>{
        const {name, value} = e.target
        setFilter(prev => ({...prev, [name] : value}))
      }, [])

    

    if(isDestinationLoading) return <Loader />
    if(isError) return <Error />

  return (
    <div className="p-8 flex-1" >
     
        <div className='flex justify-between'>
          <div onClick={()=> navigate(-1)} className='text-4xl font-garamond font-medium mb-3 cursor-pointer'> {"< Services"} </div>     
        </div>

 {/* Search and Filter Section */}
 <div className="flex flex-col sm:flex-row gap-4 mb-8">

{/* Search Bar */}
<FormField
  name="search"
  placeholder="Search service..."
  onChange={handleSearch}
  className="p-2 border border-gray-300 rounded-lg flex-grow"
/>

{/* Region Select Dropdown */}
<select
  name="serviceDestination"
  onChange={handleSearch}
  className="p-2 border border-gray-300 rounded-lg"
>
    <option key="all" value="">
      Select destination
    </option>
  {destinations?.map((destination) => (
    <option key={destination.destinationName} value={destination.destinationName}>
      {destination.destinationName}
    </option>
  ))}
</select>


</div>

      {/* services Cards Grid */}
      <div >
        {isLoading ? <Loader size='lg' /> 
        
        :

        (     
        <>
        {services.length === 0 ? 

        (<div className='text-center mt-3'>No services avaliable!!</div>)
        :
          services?.map((service) => (
         <ServiceCard
          key={service._id}
          service={service}
          onReview={() => navigate(`/profile/${service._id}`, {state :filter} )} />
        ))
}
        </>)
        
}

      </div>
    </div>
  )
}

export default Services