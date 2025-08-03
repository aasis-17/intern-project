import { useState, useEffect } from 'react'
import FormField from '../../../../components/fields/FormField'
import Button from '../../../../components/button/Button'
import { useNavigate, useOutletContext } from 'react-router'
import { useRemoveDestinationPhotoMutation, useUploadDestinationPhotoMutation, useUploadServiceImageMutation, useRemoveServicePhotoMutation } from '../../../../services/apiSlice'
import { toast } from 'react-toastify'
import Notify from '../../../../layouts/toast/Notify'

const PhotoUpload = ({option, details:serviceDetails, setBtnVisible}) => {
    const state = useOutletContext()

    const navigate = useNavigate()

    const [imagePreview, setImagePreview] = useState(0)
    const [images, setImages] = useState(option === "service" ? [...serviceDetails.serviceImages] : [...state.destinationImages] || [])
    
    const handlePreview = (e) => {
        
        const file = e.target.files[0];
        const reader = new FileReader();
     
       reader.onloadend = () => {
        setImages(prev => {return [...prev, {src : reader.result, file : e.target.files[0]}]})
       };
       if (file) {
         reader.readAsDataURL(file);
       } 
      }

      const [addDestinationImages, {isSuccess : isDestinationImageSuccess, isLoading : isDestinationImageUploading, isError : isDestinationImageError, error : destinationUploadError, reset : destinationUploadReset}] = useUploadDestinationPhotoMutation()
      const [addServiceImages, {isSuccess : isServiceImageSuccess, isError : isServiceImageError, isLoading : isServiceImageUploading, error : serviceUploadError, reset : serviceUploadReset}] = useUploadServiceImageMutation()

      const [removeDestinationImage, {reset: destinationDeleteReset, isError : isDestinationImageDeletedError, isSuccess : isDestinationImageDeletedSuccess, isLoading : isDestinationImageDeleting, error : destinationDeleteError }] = useRemoveDestinationPhotoMutation()
      const [removeServiceImage, {isError : isServiceImageDeletedError, isSuccess : isServiceImageDeletedSuccess, isLoading : isServiceImageDeleting, reset : serviceDeleteReset, error : serviceDeleteError}] = useRemoveServicePhotoMutation()

      const handlePhotoDelete = async (image)=> {
            if(option === "service"){
                if(image.hasOwnProperty("publicId")) await removeServiceImage({serviceId : serviceDetails._id, data : image})
                
            } else{
                if(image.hasOwnProperty("publicId")) await removeDestinationImage({data : image, destinationId : state._id})
                   
            }  
            setImages(prev => prev.filter((img) => img.src !== image.src))
        }
      
        const handlePhotoUpload = async() => {
             const formData = new FormData()
            if(option !== "service"){
                images.forEach(image => {
                    if(image.hasOwnProperty("file")) formData.append("destinationImages", image.file)
                })  
                const {data : destination} = await addDestinationImages({data : formData, destinationId :state._id}) 
                setImages([...destination.data.destinationImages])
            }else{
                images.forEach(image => {
                    if(image.hasOwnProperty("file")) formData.append("serviceImages", image.file)
                })  
                const {data:service} = await addServiceImages({data : formData, serviceId : serviceDetails._id})
                setImages([...service.data.serviceImages])   
            }       
        } 

    const notification = () => {
      isDestinationImageError  && toast.error(Notify, {data : {msg : destinationUploadError.data?.message || `Destination Photo upload error!!`}, autoClose : 1000}) && destinationUploadReset()
      isDestinationImageDeletedError  && toast.error(Notify,{data : {msg : destinationDeleteError?.data?.message ||`Destination Photo delete error!!`}, autoClose : 1000}) && destinationDeleteReset()
      isDestinationImageSuccess  &&  toast.success(Notify,{data : {msg :`Destination photo uploaded successfully!!`}, autoClose : 1000}) && destinationUploadReset()
      isDestinationImageDeletedSuccess  && toast.success(Notify,{data : { msg :`Destination Photo deleted successfully!!`}, autoClose : 1000}) && destinationDeleteReset()
      isServiceImageDeletedError && toast.error(Notify,{data : {msg : serviceDeleteError?.data?.message || "Service photo delete error!!"}, autoClose : 1000})  && serviceDeleteReset()
      isServiceImageDeletedSuccess && toast.success(Notify,{data : {msg : "service photo deleted successfully!!"}, autoClose : 1000}) && serviceDeleteReset()
      isServiceImageError && toast.error(Notify,{data  : {msg : serviceUploadError?.data?.message || "Service photo upload error!!"}, autoClose : 1000}) && serviceUploadReset()
      isServiceImageSuccess && toast.success(Notify,{data : {msg : "Service photo uploaded successfully!!"}, autoClose: 1000}) && serviceUploadReset()
    }

    useEffect(() => {
      
      notification()
    },[isDestinationImageDeletedError, 
        isDestinationImageDeletedSuccess,
        isDestinationImageError, 
        isDestinationImageSuccess,
        isServiceImageDeletedError,
        isServiceImageDeletedSuccess,
        isServiceImageError,
        isServiceImageSuccess])

  return (
    <div className=' h-full'>
        <div className='flex-col flex justify-between h-full'>

            <div className='flex justify-between mb-7'>
                <div className='text-4xl  font-garamond'>Add Images :</div>
            {option === "service" ?
            <Button 
            children="< Back"
            size='sm'
            onClick={() => setBtnVisible(prev => !prev)}
            variant='outline'/>
            :
            <Button 
            children="< Back"
            size='sm'
            onClick={() => navigate(-1)}
            variant='secondary'/>
}
            {/* <div> */}
            {/* <Button 
            children="Add Routes"
            size='md'
            onClick={() => navigate(`/admin/upload/${state._id}/route`)}
            variant='secondary'/> */}


            {/* </div> */}

            </div>
            <div className='flex gap-x-5'>
                <div className='flex-1 h-80  '>
                    <img alt='images' className='rounded-lg  object-cover w-full h-full' 
                    src={images[imagePreview]?.src || "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"}
                    /> 

                    <div className='flex justify-between'>
                        <Button children="back" variant='secondary' onClick={() =>  {
                            setImagePreview(prev => prev <= 0 ? 0 : prev - 1)
                            }} />
                        <div className=''>
                            <FormField
                            label="Select images"
                            type="file"
                            onChange={handlePreview}
                            className=" hidden"
                            labelClassName="text-sm font-medium text-gray-600 bg-gray-200 px-3 pb-2 cursor-pointer rounded-md "
                            />
                        </div>
          
                        <Button 
                        children="next" 
                        variant='secondary' 
                        onClick={() => setImagePreview(prev => prev >= images.length - 1 ? images.length - 1 : prev + 1)}
                         />
                    </div> 
                </div>


                <div className='w-1/4'>
                    <div>Images selected : {images.length}</div>
                    <ul>
                        {images.map(image => {

                                return (<li key={image.src} className='flex bg-gray-100 rounded-lg overflow-hidden justify-between h-14 w-full mb-3'>
                                    <img className='w-[40%] object-cover rounded-lg' src={image.src} />
                                    <Button 
                                    size='sm' 
                                    variant='delete' 
                                    children="Delete"
                                    loading = {isServiceImageDeleting || isDestinationImageDeleting} 
                                    onClick={() => handlePhotoDelete(image)} 
                                    />
                                    </li>)        
                        }) }
                    </ul>
                </div>  
        
          </div>
          <div className='mt-20'>

          <Button 
          children="Submit" 
          className='w-full ' 
          onClick={handlePhotoUpload} 
          loading ={isServiceImageUploading || isDestinationImageUploading}
        />
          </div>

        </div>

    </div>
    
  )
}

export default PhotoUpload