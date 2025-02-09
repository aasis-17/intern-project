import React, { useContext } from 'react'
import { useState } from "react";
import FormField from  "../../form/FormField.jsx"
import { useForm } from "react-hook-form"
import authService from '../../../services/authServices.js';
import { MapContainer,TileLayer } from 'react-leaflet';
import RouteLocate from '../../map/MapRouting.jsx';
import { useMutation} from "@tanstack/react-query"
import destinationService from '../../../services/destinationService.js';
import Container from "../../Container.jsx"
import TextField from '../../form/TextField.jsx';
import Map from '../../map/Map.jsx';
import { useLocation, useNavigate} from 'react-router';
import { latLng } from 'leaflet';
import Button from '../../Button.jsx';
import { AuthContext } from '../../../store/authContext.jsx';
import RouteUpload from './RouteUpload.jsx';

const DestinationUpload = () => {

    const {state} = useLocation()
    const navigate = useNavigate()
    const [imagePreview, setImagePreview] = useState("")
    console.log (state)

    const [mapState, setMapState] = useState({
        position : state ? latLng( state.destinationMapCoordinates.latitude, state.destinationMapCoordinates.longitude) : "",
        province : {lat : 27.05365240, lng :87.30161320},
        region : ""
    })

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
        state !== "edit"? await destinationService.createDestination(formData)
                : await destinationService.updateDestination(formData)
      },
      onSuccess : () => {
        alert(`Destination ${state === "edit" ? "updated" : "added"} successfully!!`)
        navigate(-1)
        reset()
      },
      onError : (error) => {
        alert("Error while uploading destination!!",error)
      }
    })
 
   return(
   <div className='h-screen flex-1'>
        
         <form onSubmit={ handleSubmit(mutation.mutateAsync) } className=" h-full  flex flex-col justify-evenly ml-4">
          <div className='flex justify-between'>
              <div className='text-4xl font-garamond font-medium mb-3'>Destination Details</div>
              <div className='flex gap-5 p-2'>
                  <Button 
                  onClick={() =>  state  ? navigate("/admin/route",{state : state}) : alert("create destination first!!")} 
                  children="Add Route" 
                  size='md'
                  variant='secondary'
                  />  
                  <Button 
                  onClick={() =>  state  ? navigate("/admin/photoUpload",{state : state}) : alert("create destination first!!")} 
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
            <img className=' object-cover h-full w-full' src={imagePreview || state && state.destinationCoverImage} alt='cover image' />
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
                defaultValue={state && state.destinationName}
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
              defaultValue={state && state.destinationInfo}
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
              defaultValue={mapState.position}
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
            defaultValue={state && state.destinationRegion}
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
            defaultValue ={state && state.destinationTips}
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
                  state={state}
                  path='upload'
                  />}
                  />
          </div>
          </div>
          
          {/* Submit Button */}
          <Button
            type="submit"
            className='w-full my-3'
            // className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
           children= "Upload Destination"
          />


        </form>

    </div>
            
    )
}

export default DestinationUpload