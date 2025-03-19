import React, { useContext, useEffect } from 'react'
import { useState } from "react";
import FormField from  "../../form/FormField.jsx"
import { useForm } from "react-hook-form"
import RouteLocate from '../../map/MapRouting.jsx';
import { useMutation, useQuery} from "@tanstack/react-query"
import destinationService from '../../../services/destinationService.js';
import TextField from '../../form/TextField.jsx';
import Map from '../../map/Map.jsx';
import { useLocation, useNavigate, useOutletContext} from 'react-router';
import { latLng } from 'leaflet';
import Button from '../../Button.jsx';

const DestinationUpload = () => {

    const destinationDetails = useOutletContext()
    const navigate = useNavigate()
    const [imagePreview, setImagePreview] = useState(destinationDetails && destinationDetails.destinationCoverImage)

    const [mapState, setMapState] = useState({
      position : destinationDetails ? latLng( destinationDetails.destinationMapCoordinates.latitude, destinationDetails.destinationMapCoordinates.longitude) : "",
      province : destinationDetails ? {lat : destinationDetails.destinationMapCoordinates.latitude, lng : destinationDetails.destinationMapCoordinates.longitude} : {lat : 28, lng : 84},
      region : ""
  })
    console.log (destinationDetails) 

    const locations = [
      {name : "Koshi", latLng : {lat : 27.05365240, lng :87.30161320}},
      {name : "Lumbini", latLng : {lat :27.8025, lng :83.4495}},
      {name : "Gandaki", latLng : {lat : 28.3949, lng : 83.9856}},
      {name : "Sudurpashchim", latLng : {lat : 29.2985, lng :80.9462}},
      {name : "Karnali", latLng : {lat : 29.3863, lng : 82.3886}},
      {name : "Bagmati", latLng : {lat :27.7172, lng : 85.3240}},
      {name : "Madesh", latLng : {lat : 26.7985, lng :85.8980}}
  ]

    const {register ,handleSubmit, reset} = useForm()
  
    const handlePreview = (e) => {
  
      const file = e.target.files[0];
      const reader = new FileReader();
   
     reader.onloadend = () => {
       setImagePreview(reader.result);  
     };
     if (file) {
       reader.readAsDataURL(file);
     } 
    }

    const handleChange = (e)=>{  
      setMapState(prev => ({...prev, region : e.target.value}))
      locations.filter((province) => {
        return province.name === e.target.value && setMapState(prev => ({...prev, province : province.latLng}))
      })
    }
    const mutation = useMutation({
      mutationFn :  async(data) => {
        console.log(data)
        const destinationMapCoordinates = {latitude : mapState.position.lat, longitude : mapState.position.lng}

        const formData = new FormData()

        Object.keys(data).forEach((key) => {
            if(key === "destinationCoverImage" || key === "destinationImages"){
                formData.append(key, data[key][0])
            }else{
                formData.append(key, data[key])
            }
        })
        formData.append("latitude",destinationMapCoordinates.latitude)
        formData.append("longitude", destinationMapCoordinates.longitude)
        formData.append("destinationRegion",mapState.region )
        destinationDetails ? await destinationService.updateDestination(formData)
        : await destinationService.createDestination(formData)
      },
      onSuccess : () => {
        alert(`Destination ${destinationDetails  ? "updated" : "added"} successfully!!`)
        navigate(-1)
        reset()
      },
      onError : (error) => {
        alert("Error while uploading destination!!",error)
      }
    })

   return(
   <div className='h-full flex-1 py-5'>
        
         <form onSubmit={ handleSubmit(mutation.mutateAsync) } className=" h-full  flex flex-col justify-evenly ml-4">
          <div className='flex justify-between'>
              <div className='text-4xl font-garamond font-medium mb-3'>Destination Details</div>
              <div className='flex gap-5 p-2'>
                  <Button 
                  onClick={() =>  destinationDetails  ? navigate(`/admin/upload/${destinationDetails._id}/route`) : alert("create destination first!!")} 
                  children="Add Route" 
                  size='md'
                  variant='secondary'
                  />  
                  <Button 
                  onClick={() =>  destinationDetails  ? navigate(`/admin/upload/${destinationDetails._id}/photoUpload`) : alert("create destination first!!")} 
                  children="Add Photos" 
                  size='md'
                  variant='secondary'
                  />  
              </div>

          </div>
 
          <div className='flex gap-4 '>
          <div className='w-1/2'>
          {/* Image preview */}
          <div className=' h-60  rounded-3xl border-black border-2 overflow-hidden'>
            <img className=' object-cover h-full w-full' src={imagePreview ||  "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"} alt='cover image' />
          </div>
          {/* destination cover image */}
          <div className=''>
            <FormField
              label="Cover :"
              type="file"
              onInput={(e) => handlePreview(e)}
              className="w-full"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("destinationCoverImage", {required : true})}
            />
          </div>
          </div>
          <div className='w-1/2'>
          {/* destinationName */}
          <div className=''>
          <FormField 
                defaultValue={destinationDetails && destinationDetails.destinationName}
                labelClassName = "block text-sm font-medium text-gray-700"
                className = "mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                label = "Destination Name :"
                required
                placeholder = "Enter destination name"
                {...register("destinationName", {
                    required : true,
                })
            }
                />
          </div>

          {/* destination info */}
          <div className='h-32'>
             <TextField
              defaultValue={destinationDetails && destinationDetails.destinationInfo}
              label="Destination Info :"
              required
              placeholder="Enter info"
              className="w-full h-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("destinationInfo",{required : true})}
            />
          </div>
          </div>
          </div>


          <div className='flex gap-4'>
          <div className='w-1/2 '>

          {/* Destination coordinates preview */}
          <div className=''>
            <FormField
              // defaultValue={mapState.position}
              label="Destination Coordinates :"
              value={mapState.position}
              readOnly={true}
              // onChange={(e) => {setMapState(prev => ({...prev, position : e.target.value}))}}
              required
              placeholder="Destination coordinates"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              labelClassName="block text-sm font-medium text-gray-600"
            />
          </div>
          {/* selection for province */}
          <div className=''>
            <label className="block text-sm font-medium text-gray-600">
              Destination Region :
            </label>
            <select
            defaultValue={destinationDetails && destinationDetails.destinationRegion}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="">Zoom region</option>
              {locations.map((province) => {
                return (<option key={province.name} value={province.name}>{province.name}</option>)
              })}
            </select>
          </div>
          {/* destination Tips */}
          <div className=''>
            <TextField
            defaultValue ={destinationDetails && destinationDetails.destinationTips}
              label="Destination Tips :"
              required
              placeholder="Enter tips and safty "
              className="w-full h-28 mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("destinationTips",{required : true})}
            />
          </div>
          </div>
          {/* map preview */}
          <div className='h-64 w-[45%]'>
              <Map 
                children={
                  <RouteLocate 
                  mapState={mapState}
                  setMapState={setMapState}
                  state={destinationDetails}
                  path='upload'
                  />}
                  />
          </div>
          </div>
          
          {/* Submit Button */}
          <Button
            type="submit"
            className='w-full '
            // className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
           children= "Upload Destination"
          />


        </form>

    </div>
            
    )
}

export default DestinationUpload