import React, { useContext } from 'react'
import { useState, useEffect } from "react";
import FormField from '../../../../components/fields/FormField.jsx';
import { useForm } from "react-hook-form"
import RouteLocate from '../../../../components/map/MapRouting.jsx';
import TextField from '../../../../components/fields/TextFieldcustom.jsx';
import Map from '../../../../components/map/Map.jsx';
import { useLocation, useNavigate} from 'react-router';
import { latLng } from 'leaflet';
import Button from '../../../../components/button/Button.jsx';
import PhotoUpload from '../../destinations/components/PhotoUpload.jsx';
import { useGetAllDestinationNameQuery, useRemoveServiceMutation, useUpdateServiceDataMutation, useUpgradeToServiceMutation } from '../../../../services/apiSlice.js';

const ServiceOwner = ({option, details : serviceDetails, filterState}) => {
    const [visible, setVisible] = useState(() => option !== "edit" )
    const [btnVisible, setBtnVisible] = useState(false)
    const [imagePreview, setImagePreview] = useState("")

    const {state}= useLocation()

    console.log(state)
    const filter = option === "edit" ? filterState : state

    const navigate = useNavigate()

    const [mapState, setMapState] = useState({
        position : serviceDetails ? latLng( serviceDetails?.serviceLocationMapCoordinates.latitude, serviceDetails?.serviceLocationMapCoordinates.longitude) : "",
        province : {lat : serviceDetails?.serviceLocationMapCoordinates.latitude ||  29.8412 , lng :serviceDetails?.serviceLocationMapCoordinates.longitude ||88.0943} ,
        region : serviceDetails?.serviceDestination || ""
    })

    const {data, isSuccess, isLoading} = useGetAllDestinationNameQuery()
    console.log(data)

    const [removeService, {isSuccess : removeSuccess, isError : removeError}] = useRemoveServiceMutation()

    let locations = isSuccess ? data.data.map(destination => {
      return {name : destination.destinationName,_id : destination._id, latLng : {lat : destination.destinationMapCoordinates.latitude, lng :destination.destinationMapCoordinates.longitude}}
    }) : []
     console.log( locations)

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
    const [upgrade, { isError, isSuccess:upgradingSuccess}] = useUpgradeToServiceMutation()

    const [update, { isError : updateError, isSuccess : updateSuccess}] = useUpdateServiceDataMutation()

    const mutation =  async(data) => {
        const formData = new FormData()

        Object.keys(data).forEach((key) => {
            if(key === "serviceCoverImage"){
                formData.append(key, data[key][0])
            }else{
                formData.append(key, data[key])
            }
        })

        formData.append("latitude",mapState.position.lat)
        formData.append("longitude", mapState.position.lng)
        formData.append("serviceDestination",mapState.region)

        if(option === "edit"){
          console.log(formData.get("serviceDestination"))
          const datas = {...data, serviceDestination : mapState.region, latitude : mapState.position.lat, longitude :mapState.position.lng }
           await update({serviceId:serviceDetails._id, formData : datas, filter})
        }else{
           await upgrade({ formData, filter})
        }    
      }

      useEffect(()=>{
        isError && alert(`service upgrade error!!`)
        updateError && alert(`service update eror!!`)
        upgradingSuccess && alert(`service upgrade successfully!!`)
        updateSuccess && alert(`service updated successfully!!`)
        removeSuccess && alert(`service deleted successfully!!`)
        removeError && alert(`service error while removing!!`)
      },[isError, upgradingSuccess, updateError, updateSuccess, removeSuccess, removeError])

      if(isLoading) return <div>Loading..</div>

   return(
   <div className=' flex-1'>
    {btnVisible ? (<PhotoUpload details={serviceDetails} option="service" setBtnVisible={setBtnVisible} />) 
    : (
         <form onSubmit={ handleSubmit(mutation) } className=" h-full  flex flex-col justify-evenly">
          <div className='flex justify-between'>
                <div className='text-4xl font-garamond font-medium mb-3'>{option ==="edit" ? "Service Details" : "Details"}</div>
              <div className='flex gap-5 p-2'>
                {option === "edit" &&
                <Button 
                  onClick={() => setBtnVisible(prev => !prev) } 
                  children={`${option === "edit" ? "Edit Photos" : "Add Photos" }`}
                  size='sm'
                  className={`${visible ? "" : "hidden"}`}
                  variant='outline'
                  />  }
                  

                  {option ==="edit" && (
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
                  // state={state}
                  path='upload'
                  option={option}
                  />}
                  />
          </div>
 
          <div className='flex gap-4 mt-5'>

            {option !== "edit" && (
          <div className='w-1/2'>

          {/* Image preview */}
          <div className=' h-60  rounded-3xl border-black border-2 overflow-hidden'>
            <img className=' object-cover h-full w-full' src={imagePreview || serviceDetails && serviceDetails.serviceCoverImage || "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"} alt='cover image' />
          </div>

          {/* ServiceOwner cover image */}
          <div className=''>
            <FormField
              label="Cover Image"
              type="file"
              onInput={(e) => handlePreview(e)}
              className="w-full hidden"
              labelClassName="block text-lg font-medium  text-center text-gray-600"
              {...register("serviceCoverImage")}
            />
          </div>
          </div>
             )}

          <div className= "w-full mb-5">
          {/* serviceName */}
          <div className=''>
          <FormField 
                defaultValue={serviceDetails && serviceDetails.serviceName}
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
              defaultValue={serviceDetails && serviceDetails.serviceType}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              disabled={!visible}
               {...register("serviceType",{required : true})}
            >
              <option value="">Select service type..</option>
              <option value="Hotel">Hotel</option>
              <option value="Restaurent">Restaurent</option>
              <option value="Homestay">Home Stay</option>
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
              { locations?.map((destination) => {
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
            <>
          <Button
          type="submit"
          className='w-full my-3'
         children= {`${option === "edit" && "Save" || option ==="admin" && "Add service" || "Create Page as Service " }`}
        />
          {option === "edit" && (
          <Button
            children="Delete service"
            onClick={()=> removeService({serviceId : serviceDetails._id, filter})}
            size='sm'
            variant= "delete" 
          /> )} 
       </>
          
          )}

        </form>
    )}

    </div>
            
    )
}

export default ServiceOwner