import React, { useRef, useState } from 'react'
import DestinationCard from '../components/DestinationCard';
import {useMutation, useQuery} from "@tanstack/react-query"
import destinationService from '../services/destinationService';
import { useDebounce } from '../utiles/debounce';

// Main Destination Page Component
const Destination = () => {
 
  //make req for destination using react-query tanstack
  const destinations = useRef([])

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

  const {data, isError, error, isLoading, isSuccess} = useQuery({
    queryKey :["destination"],
    queryFn : () => destinationService.getDestination(),
  })
 
  if(isSuccess && !destinations.current[0]) destinations.current = data.destinations

  const mutation = useMutation({
    mutationFn : (filter) => destinationService.getDestination(filter.search, filter.region),

  })

  if (mutation.isSuccess) destinations.current = mutation.data.destinations

  let filter =useRef({
    search:"",
    region:""
  })
  const handleSearch = (e) =>{
    const {name, value} = e.target

    filter.current={...filter.current, [name] : value}

    mutation.mutateAsync(filter.current)
  }

  if(isLoading) return <div>loading..</div> //create loading structure

  if(isError) return <div className='text-red-400 text-center'>{error.message}</div>

  console.log(destinations.current)
  
  const debounceQuery = useDebounce(handleSearch, 400)

   return (
    <div className="p-8">
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
          <div className='text-4xl font-garamond font-medium mb-7'>Destinations all over 
            {/* {`${selectedRegion !== "All"? selectedRegion : " Nepal" }`} */}
            </div>
      {/* Destination Cards Grid */}
      <div className="">
        {destinations.current[0] ? destinations.current.map((destination) => (
          <DestinationCard
            id={destination._id}
            key={destination._id}
            imageUrl={destination.destinationCoverImage}
            destinationName={destination.destinationName}
            review={destination.avgReview}
            region={destination.destinationRegion}
            info={destination.destinationInfo}
            className="h-64"
          />
        )) : (<div className='text-center'>No destination avaliable!!</div>)}

        {mutation.isError && <div className='text-red-400 text-center'>{error.message}</div>}
      </div>
    </div>
  );
};

export default Destination;