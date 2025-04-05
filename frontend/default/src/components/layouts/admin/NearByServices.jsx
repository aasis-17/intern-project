import { useState } from 'react';
import TextField from '../../form/TextField.jsx';
import Map from '../../map/Map.jsx';
import { latLng } from 'leaflet';
import FormField from '../../form/FormField.jsx';
import { useForm } from 'react-hook-form';
import destinationService from '../../../services/destinationService.js';
import serviceOwnerService from '../../../services/serviceOwnerServices.js';
import { AuthContext } from '../../../store/authContext.jsx';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import RouteLocate from '../../map/MapRouting.jsx';
import NearByServiceMap from '../../map/NearByServiceMap.jsx';

const NearByServices = () => {

    const [imagePreview, setImagePreview] = useState("")

    const queryClient = useQueryClient()

    const {_id, serviceName,serviceType, serviceDestination, serviceLocationMapCoordinates, serviceCoverImage, serviceInfo} = queryClient.getQueryData(["serviceDetails"])

    const {data: services, isLoading} = useQuery({
      queryKey :["nearByServices"],
      queryFn : () => {
          return serviceOwnerService.getAllServices("approved", serviceDestination)
      }
  })
  console.log(services)

    const {register ,handleSubmit, reset} = useForm()
    if(isLoading) return <div>Loading..</div>

   return(
    <div className=' flex-1 h-full'>
          <div className='h-2/5 w-full'>
            <Map children={<NearByServiceMap mapDetails={{serviceLocationMapCoordinates, serviceName}} />} />
          </div>
   
         <form  className="  flex flex-col justify-evenly ml-4">
          <div className='flex justify-between'>
                <div className='text-4xl font-garamond font-medium mb-3'>Service Details</div>

          </div>

          <div className='flex gap-4 mt-5'>

          <div className='w-1/2'>

          {/* Image preview */}
          <div className=' h-60  rounded-3xl border-black border-2 overflow-hidden'>
            <img className=' object-cover h-full w-full' src={imagePreview || serviceCoverImage || "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"} alt='cover image' />
          </div>

          </div>

          <div className= "w-full mb-5">
          {/* serviceName */}
          <div className=''>
          <FormField 
                defaultValue={serviceName}
                readOnly={true}
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
              defaultValue={serviceType}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              disabled={true}
            >
              <option value="">Select service type..</option>
              <option value="Hotel">Hotel</option>
              <option value="Restaurent">Restaurent</option>
              <option value="HomeStay">Home Stay</option>
            </select>
          </div>

          {/* selection for destination  */}
          <div className=''>
          <FormField 
                defaultValue={serviceDestination}
                readOnly={true}
                labelClassName = "block text-sm font-medium text-gray-700"
                className = "mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                label = "Service Destination :"
                required
                placeholder = "Enter service nam"
                />
          </div>

          {/* service located coordinates preview */}
          <div className=''>
            <FormField
              // defaultValue={mapState.position}
              label="Service Located Map Coordinates :"
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
              defaultValue={serviceInfo}
              readOnly={true}
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

        </form>

    </div>
            
    )
}

export default NearByServices