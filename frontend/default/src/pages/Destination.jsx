import {useState } from 'react'
import DestinationCard from '../components/DestinationCard';
import { useQuery} from "@tanstack/react-query"
import destinationService from '../services/destinationService';
import {useDebounceState } from '../utiles/debounce';
import Loader from '../components/loader/Loader';

// Main Destination Page Component
const Destination = () => {

  const [filter, setFilter] = useState({
    search : "",
    region : ""
  })

  const debounceFilter = useDebounceState(filter, 400)

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

  const {data, isError, error, isLoading} = useQuery({
    queryKey :["destinations", debounceFilter],
    queryFn : () => destinationService.getDestination(filter),
    placeholderData : (prev) => prev
  })

  const destinations = data?.destinations

  const handleSearch = (e) =>{
    const {name, value} = e.target
    setFilter((prev) => ({...prev, [name] : value}))
  }

  if(isError) return <div className='text-red-400 text-center'>{error.message}</div>
  if(isLoading) return <><Loader color='dark' /></>
  
   return (
    <div className="p-8">
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search Bar */}
        <input
          type="text"
          name="search"
          placeholder="Search destinations..."
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded-lg flex-grow"
        />

        {/* Region Select Dropdown */}
        <select
          name="region"
          onChange={(e) => handleSearch}
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
          <div className='text-4xl font-garamond font-medium mb-7'>Destinations </div>
      {/* Destination Cards Grid */}
      <div className='animate-fade-down animate-delay-200 animate-ease-out'>

        {isLoading ? <div>Loading...</div> 
        
        : 

        destinations[0] ? destinations.map((destination) => (

          <DestinationCard
            key={destination._id}
            {...destination}
            className="h-64"
            variant = "list"
          />
        )) 
        
        :
        
        (<div className='text-center'>No destination avaliable!!</div>)}

      </div>
    </div>
  );
};

export default Destination;