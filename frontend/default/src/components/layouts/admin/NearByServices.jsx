
import TextField from '../../form/TextField.jsx';
import Map from '../../map/Map.jsx';
import { latLng } from 'leaflet';
import Button from '../../Button.jsx';
import destinationService from '../../../services/destinationService.js';
import serviceOwnerService from '../../../services/serviceOwnerServices.js';
import { AuthContext } from '../../../store/authContext.jsx';
import { useQueryClient, useMutation } from '@tanstack/react-query';

const NearByServices = () => {

    const [visible, setVisible] = useState(false)
    const [btnVisible, setBtnVisible] = useState(false)
    const [imagePreview, setImagePreview] = useState("")

    const {state} = useContext(AuthContext)

    const queryClient = useQueryClient()

    const {_id, serviceName, serviceLocationMapCoordinates, serviceCoverImage, serviceInfo} = queryClient.getQueriesData(["serviceDetails"])

    const [mapState, setMapState] = useState({
        position : latLng( serviceLocationMapCoordinates.latitude, serviceLocationMapCoordinates.longitude) ,
        province : {lat : serviceLocationMapCoordinates.latitude ||  29.8412 , lng : serviceLocationMapCoordinates.longitude ||88.0943} ,
        region : serviceDestination || ""
    })

    const {data, isSuccess}= useQuery({
      queryKey : ["destination"],
      queryFn :  () => {
        return  destinationService.getDestination()
      }
    })


    const locations = isSuccess ? data.destinations?.map(destination => {
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
      locations?.filter((province) => {
        return province.name === e.target.value && setMapState(prev => ({...prev, province : province.latLng}))
      })
    }
    const mutation = useMutation({
      mutationFn :  async(data) => {
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
        formData.append("serviceDestination",mapState.region )

        await serviceOwnerService.updateServiceInfo( formData, _id) 
      },
      onSuccess : () => {
          alert(`Service info updated successfully!!`)
          setVisible(false)
          queryClient.invalidateQueries({queryKey : ["serviceOwner"]})
      },
      onError : (error) => {
          alert("Error while  updating service info!!",error)
      }
    })
 
   return(
   <div className=' flex-1'>
         <form onSubmit={ handleSubmit(mutation.mutateAsync) } className=" h-full  flex flex-col justify-evenly ml-4">
          <div className='flex justify-between'>
                <div className='text-4xl font-garamond font-medium mb-3'>Service Details</div>
              <div className='flex gap-5 p-2'>

                          <Button
                          children={visible ? "Cancel" : "Edit"}
                          onClick={()=> setVisible(prev => !prev)}
                          size='sm'
                          className={` w-16 ${visible ? "bg-red-400 hover:bg-red-500" : ""} `}
                          variant='secondary'
                          />  
              </div>

          </div>
 
          <div className='flex gap-4 '>
          <div className='w-1/2'>

          {/* Image preview */}
          <div className=' h-60  rounded-3xl border-black border-2 overflow-hidden'>
            <img className=' object-cover h-full w-full' src={imagePreview || serviceCoverImage || "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"} alt='cover image' />
          </div>

          {/* NearByServices cover image */}
          <div className=''>
            <FormField
              label="Cover Image :"
              type="file"
              onInput={(e) => handlePreview(e)}
              className="w-full"
              labelClassName="block text-sm font-medium text-gray-600"
              {...register("serviceCoverImage", {required : true})}
            />
          </div>
          </div>

          <div className={`${option ==="setting" ? "w-full h-full" : "w-1/2"}`}>
          {/* serviceName */}
          <div className=''>
          <FormField 
                defaultValue={serviceName}
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

          {/* Service info */}
          <div className=''>
             <TextField
              defaultValue={serviceInfo}
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


          <div className='flex gap-4'>
          <div className='w-1/2'>

          {/* service located coordinates preview */}
          <div className=''>
            <FormField
              defaultValue={mapState.position}
              label="Service Located Map Coordinates :"
              value={mapState.position}
              readOnly={true}
              required
              placeholder="Service map coordinates"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              labelClassName="block text-sm font-medium text-gray-600"
            />
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
                  option={option}
                  />}
                  />
          </div>
          </div>
          
          {/* Submit Button */}
          {visible  && option !== "display" && (
          <Button
          type="submit"
          className='w-full my-3'
         children= "Save"
        />
          
          )}

        </form>

    </div>
            
    )
}

export default NearByServices