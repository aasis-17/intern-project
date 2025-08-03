import { useCallback, useEffect, useState } from 'react'
import FormField from '../../../../components/fields/FormField.jsx';
import { useForm } from "react-hook-form"
import Map from "../../../../components/map/Map.jsx"
import RouteLocate from "../../../../components/map/MapRouting.jsx"
import { useLocation, useNavigate, useOutletContext, useParams} from 'react-router';
import { latLng } from 'leaflet';
import Button from '../../../../components/button/Button.jsx';
import TextField from "../../../../components/fields/TextFieldcustom.jsx"
import {  useUpdateDestinationMutation, useUploadDestinationMutation } from '../../../../services/apiSlice.js';
import Review from '../../components/Review.jsx';
import { toast } from 'react-toastify';
import Notify from '../../../../layouts/toast/Notify.jsx';

const DestinationUpload = ({edit=false}) => {

    const {id} = useParams()
    
    const {state} = useLocation()
    
    const [imagePreview, setImagePreview] = useState("")

    const navigate = useNavigate()

    const destinationDetails = useOutletContext()

    const [mapState, setMapState] = useState({
      position : destinationDetails ? latLng( destinationDetails.destinationMapCoordinates.latitude, destinationDetails.destinationMapCoordinates.longitude) : "",
      province : destinationDetails ? {lat : destinationDetails.destinationMapCoordinates.latitude, lng : destinationDetails.destinationMapCoordinates.longitude} : {lat : 28, lng : 84},
      region : destinationDetails ? destinationDetails.destinationRegion : ""
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
  
    const handlePreview = useCallback((e) => {
  
      const file = e.target.files[0];
      const reader = new FileReader();
   
     reader.onloadend = () => {
       setImagePreview(reader.result);  
     };
     if (file) {
       reader.readAsDataURL(file);
     } 
    },[])

    const handleChange = useCallback((e)=>{  
      setMapState(prev => ({...prev, region : e.target.value}))
      locations.filter((province) => {
        return province.name === e.target.value && setMapState(prev => ({...prev, province : province.latLng}))
      })
    },[])

    const [mutation, {data, isLoading: isDestinationUploading, isError : isDestinationUploadError, error : destinationUploadError , isSuccess : isDestinationUploadSuccess, reset : destinationUploadReset}] = useUploadDestinationMutation()

    const [update, {data : updateData, isLoading : isDestinationUpdating, isError : isDestinationUpdateError, error : destinationUpdateError, isSuccess : isDestinationUpdateSuccess, reset : destinationUpdateReset}] = useUpdateDestinationMutation()

    const handleForm = async(data) => {

      const formData = new FormData()
      
      Object.keys(data).forEach((key) => {
          if(key === "destinationCoverImage" || key === "destinationImages"){
              formData.append(key, data[key][0] )
          }else{
              formData.append(key, data[key])
          }
      })
      formData.append("latitude",mapState.position.lat)
      formData.append("longitude", mapState.position.lng)
      formData.append("destinationRegion",mapState.region)

      !edit ? await mutation({formData, state}) : await update({id, formData, state})
  }

  const notification = () => {
    isDestinationUploadSuccess && toast.success(Notify, {data : {msg :"Destination created successfully!!"}, autoClose : 1000}) && destinationUploadReset()
    isDestinationUploadError && toast.error(Notify, {data : {msg : destinationUploadError?.data?.message ||"Error while creating destination!!"}, autoClose : 1000}) && destinationUploadReset()

    isDestinationUpdateSuccess && toast.success(Notify, {data : {msg : "Destination updated successfully!!"}, autoClose : 1000}) && destinationUpdateReset()
    isDestinationUpdateError && toast.error(Notify, {data : {msg : destinationUpdateError?.data?.message ||"Error while updating destination!!"}, autoClose : 1000}) && destinationUpdateReset()
  }

  useEffect(() => {
   notification()
  },[isDestinationUploadSuccess, isDestinationUploadError, isDestinationUpdateSuccess, isDestinationUpdateError])

   return(
  <>
         <form onSubmit={ handleSubmit(handleForm) } className=" h-full  flex flex-col justify-evenly ml-4 w-full">
          <div className='flex justify-between'>
              <div className='flex gap-5 p-2'>
                  <Button 
                  onClick={() =>  destinationDetails  ? navigate(`/admin/destinations/${destinationDetails._id}/route`) : alert("create destination first!!")} 
                  children="Add Route" 
                  size='sm'
                  variant='secondary'
                  />  
                  <Button 
                  onClick={() =>  destinationDetails ? navigate(`/admin/destinations/${destinationDetails._id}/photoUpload`) : alert("create destination first!!")} 
                  children="Add Photos" 
                  size='sm'
                  variant='secondary'
                  />  
              </div>

          </div>
 
          <div className='flex gap-4 '>
          <div className='w-1/2'>
          {/* Image preview */}
          <div className=' h-60  rounded-3xl border-black border-2 overflow-hidden'>
            <img className=' object-cover h-full w-full' src={imagePreview ||destinationDetails?.destinationCoverImage || "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png" } alt='cover image' />
          </div>
          {/* destination cover image */}
          <div className=''>
            <FormField
              label="Cover :"
              type="file"
              onInput={(e) => handlePreview(e)}
              className="w-full"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("destinationCoverImage")}
            />
          </div>
          </div>
          <div className='w-1/2'>
          {/* destinationName */}
          <div className=''>
          <FormField 
                defaultValue={destinationDetails?.destinationName}
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
             <TextField
              defaultValue={destinationDetails?.destinationInfo}
              label="Destination Info :"
              required
              placeholder="Enter info"
              className="w-full h-44 mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("destinationInfo",{required : true})}
            />
          </div>
          </div>
          <div className='flex gap-4 '>
          <div className='w-1/2 '>

          {/* Destination coordinates preview */}
          <div className=''>
            <FormField
              label="Destination Coordinates :"
              value={mapState.position}
              readOnly={true}
              onChange={(e) => {setMapState(prev => ({...prev, position : e.target.value}))}}
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
              value={mapState.region}
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
              defaultValue ={destinationDetails?.destinationTips}
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
          <div className='h-64 w-[45%] z-0'>
              <Map 
            
                children={ 
                  <RouteLocate 
                  mapState={mapState}
                  setMapState={setMapState}
                  state={destinationDetails}
                  path='upload'
                  />
                }
                  />
          </div>
          </div>
          
          {/* Submit Button */}
          <Button
            loading={isDestinationUploading || isDestinationUpdating}
            type="submit"
            className='w-full mt-5'
            children= {edit ? "Save" : "Upload"}
          />


        </form>

    <Review reviewData ={destinationDetails} />
    </>
            
    )
}

export default DestinationUpload