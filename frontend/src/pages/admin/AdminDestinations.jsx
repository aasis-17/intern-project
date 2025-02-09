import React,{ useContext, useRef} from 'react'
import DestinationCard from '../../components/DestinationCard';
import destinationService from '../../services/destinationService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '../../utiles/debounce';
import Button from '../../components/Button';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../store/authContext';

const AdminDestinations = () => {
  //make req for destination using react-query tanstack
  const destinations = useRef([])
  const navigate = useNavigate()
  const {dispatch} = useContext(AuthContext)

  const queryClient = useQueryClient()

    // Region Options
    const regionOptions = [
      'Gandaki',
      'Bagmati',
      'Lumbini',
      'Madhesh',
      'Karnali',
      'Sudurpashchim',
      "Koshi"
    ];
  
  let filter =useRef({
    search:"",
    region:""
  })

  const {data, isError, error, isLoading, isSuccess} = useQuery({
    queryKey :["destination"],
    queryFn : () => destinationService.getDestination(),
  })
 
  if(isSuccess && !destinations.current[0]) destinations.current = data.destinations

  const mutation = useMutation({
    mutationFn : (filter) => destinationService.getDestination(filter.search, filter.region)
  })

  if (mutation.isSuccess) destinations.current = mutation.data.destinations

  const deleteMutation = useMutation({
    mutationFn : (destinationId) => destinationService.deleteDestination(destinationId),
    onSettled :()=>{
      queryClient.invalidateQueries({queryKey : ["destination"]})
    }
  })

  const handleSearch = (e) =>{
    const {name, value} = e.target
    filter.current={...filter.current, [name] : value}
    mutation.mutateAsync(filter.current)
  }

  if(isLoading) return <div>loading..</div> //create loading structure

  if(isError) return <div className='text-red-400 text-center'>{error.message}</div>
  
  const debounceQuery = useDebounce(handleSearch, 400)

  return (
    <div className="p-8 flex-1">
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">

        {/* Search Bar */}
        <input
          type="text"
          name="search"
          placeholder="Search destinations..."
          onChange={(e) => debounceQuery(e)}
          className="p-2 border border-gray-300 rounded-lg flex-grow"
        />

        {/* Region Select Dropdown */}
        <select
          name="region"
          onChange={(e) => debounceQuery(e)}
          className="p-2 border border-gray-300 rounded-lg"
        >
            <option key="all" value="">
              All
            </option>
          {regionOptions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
      <div className='flex justify-between'>
          <div className='text-4xl font-garamond font-medium mb-3'>Destinations  
            {/* {`${selectedRegion !== "All"? selectedRegion : " Nepal" }`} */}
            </div>
            <Button onClick={()=> navigate("/admin/upload")}variant='secondary' className='p-0' children="Add Destination" />
            </div>
      {/* Destination Cards Grid */}
      <div >
        {destinations.current[0] ? destinations.current.map((destination) => (
          <div key={destination._id} className='bg-red-50 flex justify-between items-center h-32'>
          <div  className={`h-full w-[35%] bg-red-50   rounded overflow-hidden shadow-lg relative`}>
          {/* Image Container */}
          <div className="h-32 w-full relative rounded-lg overflow-hidden">
            {/* Image */}
            <img
              className={`h-32 w-full object-cover transition-transform duration-300 transform hover:scale-110`}
              src={destination.destinationCoverImage}
              alt={destination.destinationName}
            />
        {/* Dark Gradient Overlay at the Bottom */}
        <div className="absolute h-8 top-24 inset-0 bg-gradient-to-t from-black/80 to-transparent -z-0"></div>
          </div>
    
          {/* Destination Name */}
          <div className="absolute bottom-2 left-2 text-white font-bold text-xl">
            {destination.destinationName}
          </div>
          <div>

          </div>

          </div>
          <div className='mr-5'>
            <Button 
              onClick={() =>{
                navigate("/admin/upload",{ state : destination})
                
                }}
              children="Edit" 
              className='mr-5'
              />
            <Button
              onClick={() => deleteMutation.mutateAsync(destination._id)}
              children="Delete" />
          </div>
        </div>
        )) : (<div className='text-center mt-3'>No destination avaliable!!</div>)}

        {mutation.isError && <div className='text-red-400 text-center'>{error.message}</div>}
      </div>
    </div>
  );
}

export default AdminDestinations