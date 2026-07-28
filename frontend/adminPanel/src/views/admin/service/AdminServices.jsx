import {useState, useCallback} from 'react'
import { useDebounceState } from '../../../utiles/debounce'
import Button from '../../../components/button/Button'
import FormField from '../../../components/fields/FormField'
import { useNavigate } from 'react-router'
import { MdCheckCircle, MdOutlineError } from "react-icons/md";
import { useGetAllDestinationNameQuery, useGetDestinationsQuery, useGetServicesQuery } from '../../../services/apiSlice'
import Loader from '../../../layouts/loader/Loader'

const AdminServices = () => {

    const navigate = useNavigate()

    const [filter, setFilter] = useState({
        search : "",
        option : "",
        serviceDestination : ""
    })

      const debounceQuery = useDebounceState(filter, 400)

      const {data, isLoading, isError, error} = useGetServicesQuery(debounceQuery)

      const services = data?.services

      const {data :destinationData} = useGetAllDestinationNameQuery()

      const destinations = destinationData?.data

    const handleSearch =  useCallback((e) => {
        const {name, value} = e.target
        setFilter(prev => ({...prev, [name] : value}))
      },[])


  return (
    <div className="p-8 flex-1">
     
      <div className='flex justify-between'>
          <div onClick={()=> navigate(-1)} className='text-4xl font-garamond font-medium mb-3 cursor-pointer'> {"< Services"} </div>
            <Button onClick={()=> navigate(`/admin/service/upload`,{state:filter})}  variant='outline'  className='mb-3' children="Add Service" />
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

<select
  name="option"
  onChange={handleSearch}
  className="p-2 border border-gray-300 rounded-lg"
>
    <option value="">Select status</option>
    <option value="pending">pending</option>
    <option value="approved">approved</option>
    <option value="rejected">rejected</option>
</select>
</div>

      {/* services Cards Grid */}
      <div >
        {isLoading ? <Loader size='lg' /> :
        (
        <>
        {services[0] ? services.map((service) => (
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
          <span className='text-sm '>Status : {service.status === "approved" ? <MdCheckCircle className="text-green-500 me-1 dark:text-green-300 inline" /> : <MdOutlineError className="text-amber-500 me-1 dark:text-amber-300 inline" />}<span >{service.status.toUpperCase()}</span> </span>
          <div className='mr-5 '>
            <Button 
              onClick={() =>{
                navigate(`/admin/service/${service._id}`, {state :filter} )
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

export default AdminServices