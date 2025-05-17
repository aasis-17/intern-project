import {useState} from 'react'
import { useDebounce } from '../../../utiles/debounce'
import Button from '../../../components/button/Button'
import FormField from '../../../components/fields/FormField'
import { useNavigate } from 'react-router'
import { useGetAllDestinationNameQuery, useGetDestinationsQuery, useGetServicesQuery } from '../../../services/apiSlice'

const AdminServices = () => {

    const navigate = useNavigate()

    const [filter, setFilter] = useState({
        search : "",
        option : "",
        serviceDestination : ""
    })
      const {data : services, isLoading, isError, error} = useGetServicesQuery(filter)

      console.log(filter.search)

      const {data} = useGetAllDestinationNameQuery()
    // const {data } = useQuery({
    //     queryKey :["destinations"],
    //     queryFn : () => destinationService.getDestination(),
    //   })
      const destinations = data?.data

    // const {data : services, isError, error, isLoading} = useQuery({
    //     queryKey :["services", filter.search, filter.option, filter.serviceDestination],
    //     queryFn : () => serviceOwnerService.getAllServices(filter.search, filter.option, filter.serviceDestination),
    //   })
    
      // const deleteMutation = useMutation({
      //   mutationFn : (serviceId) => serviceOwnerService(serviceId),
      //   onSettled :()=>{
      //     queryClient.setQueryData({queryKey : ["services", filter.search, filter.option, filter.serviceDestination]})
      //   }
      // })

    const handleSearch = (e) =>{
        const {name, value} = e.target
        setFilter(prev => ({...prev, [name] : value}))
      }

    const debounceQuery = useDebounce(handleSearch, 400)
  return (
    <div className="p-8 flex-1">
     
      <div className='flex justify-between'>
          <div className='text-4xl font-garamond font-medium mb-3'>Services </div>
            <Button onClick={()=> navigate(`/admin/uploadService`)} variant='outline'  className='mb-3' children="Add Service" />
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

<select
  name="option"
  onChange={(e) => debounceQuery(e)}
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
        {isLoading ? <div>loading..</div> :
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
          <span className='text-sm'>Status : <span className={`${service.isApproved === "approved" ? "text-green-500" : "text-orange-500"} `}>{service.isApproved}</span> </span>
          <div className='mr-5 '>
            <Button 
              onClick={() =>{
                navigate(`/admin/uploadService/${service._id}`)
                }}
              children="Review" 
              variant='outline'
              className='mr-5'
              />
            {/* <Button
              onClick={() => deleteMutation.mutateAsync(service._id)}
              children="Delete"
              variant='delete' /> */}
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