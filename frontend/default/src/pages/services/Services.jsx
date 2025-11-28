import { useQuery } from '@tanstack/react-query'
import serviceOwnerService from '../../services/serviceOwnerServices'
import destinationService from '../../services/destinationService'
import Loader from '../../components/loader/Loader'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useDebounce } from '../../utiles/debounce'
import FormField from '../../components/form/FormField'
import Button from '../../components/Button'
import Error from '../Error'

const Services = () => {

   const navigate = useNavigate()

    const [filter, setFilter] = useState({
        search : "",
        option : "approved",
        serviceDestination : ""
    })
      const {data : services, isLoading, isError, error} = useQuery({
        queryKey :["services", filter.search, filter.option, filter.serviceDestination],
        queryFn : () => serviceOwnerService.getAllServices(filter),
        // staleTime : 2 * 60000
      })

      console.log(isError)

    const {data : destinations, isLoading : isDestinationLoading}= useQuery({
      queryKey : ["destinationName"],
      queryFn :  () => destinationService.getAllDestinationName()
    })
    console.log(destinations,"destination name")

    const handleSearch = (e) =>{
        const {name, value} = e.target
        setFilter(prev => ({...prev, [name] : value}))
      }

    const debounceQuery = useDebounce(handleSearch, 400)

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
  onChange={(e) => debounceQuery(e)}
  className="p-2 border border-gray-300 rounded-lg flex-grow"
/>

{/* Region Select Dropdown */}
<select
  name="serviceDestination"
  onChange={(e) => debounceQuery(e)}
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
        {isLoading ? <Loader size='lg' /> :
        (
            
        <>
        {services[0] ? services?.map((service) => (
          <div key={service._id} className='shadow-md flex justify-between items-center h-32 mb-3'>
          <div  className={`h-full w-[35%] bg-red-50   rounded overflow-hidden shadow-lg relative`}>
          {/* Image Container */}
          <div className="h-32 w-full relative rounded-lg overflow-hidden">
            {/* Image */}
            <img
              className={`h-32 w-full object-cover transition-transform duration-300 transform hover:scale-110`}
              src={service.serviceCoverImage}
              alt={service.serviceName}
            />
        {/* Dark Gradient Overlay at the Bottom */}
        <div className="absolute h-8 top-24 inset-0 bg-gradient-to-t from-black/80 to-transparent -z-0"></div>
          </div>
    
          {/* Destination Name */}
          <div className="absolute bottom-2 left-2 text-white font-bold text-xl">
            {service.serviceName}
          </div>
          <div>

          </div>

          </div>
          {/* <span className='text-sm '>Status : {service.isApproved === "approved" ? <MdCheckCircle className="text-green-500 me-1 dark:text-green-300 inline" /> : <MdOutlineError className="text-amber-500 me-1 dark:text-amber-300 inline" />}<span >{service.isApproved.toUpperCase()}</span> </span> */}
          <div className='mr-5 '>
            <Button 
              onClick={() =>{
                navigate(`/profile/${service._id}`, {state :filter} )
                }}
              children="Review" 
              variant='outline'
              className='mr-5'
              />
          </div>
        </div>
        )) : (<div className='text-center mt-3'>No services avaliable!!</div>)}
        </>)
        
}

      </div>
    </div>
  )
}

export default Services