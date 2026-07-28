import { useState } from "react";
import FormField from '../../../components/form/FormField.jsx';
import { useForm } from "react-hook-form"
import RouteLocate from '../../../components/map/MapRouting.jsx';
import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import TextField from '../../../components/form/TextField.jsx';
import Map from '../../../components/map/Map.jsx';
import { useNavigate} from 'react-router';
import { latLng } from 'leaflet';
import Button from '../../../components/Button.jsx';
import destinationService from '../../../services/destinationService.js';
import serviceOwnerService from '../../../services/serviceOwnerServices.js';
import { useAuth } from '../../../store/authContext.jsx';
import PhotoUpload from '../../../components/layouts/admin/PhotoUpload.jsx';
import { toast } from 'react-toastify';
import Notify from '../../../components/toast/Notify.jsx';
import Loader from '../../../components/loader/Loader.jsx';
import { useServiceMutation } from "./hooks/useServiceMutation.js";

const ServicePage = ({option, serviceDetails}) => {
    const [visible, setVisible] = useState(() => option !== "edit" )
    const [btnVisible, setBtnVisible] = useState(false)
    const [imagePreview, setImagePreview] = useState("")

    const {state} = useAuth()
    console.log(option)

    const isEditable = option === "edit"

    // const queryClient = useQueryClient()
    // const serviceDetails = queryClient.getQueryData(["serviceDetails", state?.userData?._id])

    const [mapState, setMapState] = useState({
        position : latLng( serviceDetails?.serviceLocationMapCoordinates.latitude, serviceDetails?.serviceLocationMapCoordinates.longitude) || "",
        province : {lat : serviceDetails?.serviceLocationMapCoordinates.latitude ||  29.8412 , lng :serviceDetails?.serviceLocationMapCoordinates.longitude ||88.0943} ,
        region : serviceDetails?.serviceDestination || ""
    })

    const {data, isSuccess, isError, isLoading}= useQuery({
      queryKey : ["destinations"],
      queryFn :  () => {
        return  destinationService.getDestination()
      }
    })

    let locations = isSuccess ? data.destinations?.map(destination => {
      return {name : destination.destinationName,_id : destination._id, latLng : {lat : destination.destinationMapCoordinates.latitude, lng :destination.destinationMapCoordinates.longitude}}
    }) : []

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
      locations?.forEach((province) => {
         province.name === e.target.value && setMapState(prev => ({...prev, province : province.latLng}))
      })
    }

    const {mutation} = useServiceMutation({mode : option="", mapState, setVisible, reset, state})

  if( isLoading) return <Loader />
   return(
   <div className=' flex-1'>
    {btnVisible ? (<PhotoUpload id={state.userData._id} option="service" setBtnVisible={setBtnVisible} />) 
    : (
         <form onSubmit={ handleSubmit(mutation.mutateAsync) } className=" h-full  flex flex-col justify-evenly">
          <div className='flex justify-between'>
                <div className='text-4xl font-garamond font-medium mb-3'>{isEditable ? "Service Details" : "Details"}</div>
              <div className='flex gap-5 p-2'>

                {isEditable &&(
                <Button 
                  onClick={() => setBtnVisible(prev => !prev) } 
                  children={`${isEditable ? "Edit Photos" : "Add Photos" }`}
                  size='sm'
                  className={`${visible ? "" : "hidden"}`}
                  variant='outline'
                  /> )}
                  

                  {isEditable && (
                          <Button
                          children={visible ? "Cancel" : "Edit"}
                          onClick={()=> setVisible(prev => !prev)}
                          size='sm'
                          variant={visible ? "delete" : "outline"}
                          />  
                  )}
              </div>

          </div>

          {/* map preview */}
          <div className='h-48 w-full z-0'>
              <Map 
                children={
                  <RouteLocate 
                  mapState={mapState}
                  setMapState={setMapState}
                  state={state}
                  path='upload'
                  option={option}
                  />}
                  />
          </div>
 
          <div className='flex gap-4 mt-5'>

            {/* {isEditable && ( */}
          <div className='w-1/2'>

          {/* Image preview */}
          <div className='mb-2 h-60  rounded-3xl border-black border-2 overflow-hidden'>
            <img className=' object-cover h-full w-full' src={imagePreview || serviceDetails && serviceDetails.serviceCoverImage || "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"} alt='cover image' />
          </div>

          {/* ServicePage cover image */}
          {/* <div className=''> */}
            <FormField
              label="Cover Image"
              type="file"
              onInput={(e) => handlePreview(e)}
              className="w-full hover:scale-110 transition-transform duration-200"
              labelClassName="cursor-pointer text-center "
              {...register("serviceCoverImage", {required : true})}
            />
          {/* </div> */}
          </div>
            {/* )} */}

          <div className= "w-full mb-5">
          {/* serviceName */}
          <div className=''>
          <FormField 
                defaultValue={ serviceDetails?.serviceName}
                readOnly={!visible}
                labelClassName = "block text-sm font-medium text-gray-700"
                className = "mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                label = "Service Name :"
                required
                placeholder = "Enter service name"
                {...register("serviceName", {
                    required : true,
                })
            }
                />
          </div>

          <div className=''>
            <label className="block text-sm font-medium text-gray-600">
              Service type :
            </label>
            <select
              defaultValue={serviceDetails?.serviceType}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              disabled={!visible}
            >
              <option value="">Select service type..</option>
              <option value="Hotel">Hotel</option>
              <option value="Restaurent">Restaurent</option>
              <option value="HomeStay">Home Stay</option>
            </select>
          </div>

          {/* selection for destination  */}
          <div className=''>
            <label className="block text-sm font-medium text-gray-600">
              Service Located :
            </label>

            <select
            defaultValue={mapState.region}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              disabled={!visible}
            >
              <option value="">Select destination</option>
              {  locations?.map((destination) => {
                return (<option key={destination._id} value={destination.name}>{destination.name}</option>)
              })}
            </select>
          </div>

          {/* service located coordinates preview */}
          <div className=''>
            <FormField
              // defaultValue={mapState.position}
              label="Service Located Map Coordinates :"
              value={mapState.position}
              readOnly={true}
              required
              placeholder="Service map coordinates"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              labelClassName="block text-sm font-medium text-gray-600"
            />
          </div>

          </div> 
          </div>


          <div className='flex gap-4'>
           <div className='w-full'>

                     {/* Service info */}
          <div className=''>
             <TextField
              defaultValue={serviceDetails && serviceDetails.serviceInfo}
              readOnly={!visible}
              label="Service Info :"
              required
              placeholder="Enter info"
              className="w-full h-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("serviceInfo",{required : true})}
            />
          </div>

          </div> 

          </div>
          
          {/* Submit Button */}
          {visible   && (
          <Button
          loading={mutation.isPending}
          type="submit"
          className='w-full my-3'
         children= {`${isEditable && "Save" || option ==="admin" && "Add service" || "Create Page as Service " }`}
        />
          
          )}

        </form>
    )}

    </div>
            
    )
}

export default ServicePage