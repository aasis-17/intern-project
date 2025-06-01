import { useState, useEffect } from 'react'
import FormField from '../../../../components/fields/FormField'
import Button from '../../../../components/button/Button'
import { useNavigate, useOutletContext } from 'react-router'
import { useRemoveDestinationPhotoMutation, useUploadDestinationPhotoMutation, useUploadServiceImageMutation, useRemoveServicePhotoMutation } from '../../../../services/apiSlice'

const PhotoUpload = ({option, details:serviceDetails, setBtnVisible}) => {
    const state = useOutletContext()
    console.log(state)
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
      const [addDestinationImages, { isSuccess : isDestinationImageSuccess, isLoading, isError : isDestinationImageError}] = useUploadDestinationPhotoMutation()
      const [addServiceImages, {isSuccess : isServiceImageSuccess, isError : isServiceImageError}] = useUploadServiceImageMutation()

      const [removeDestinationImage, {isError : isDestinationImageDeletedError, isSuccess : isDestinationImageDeletedSuccess }] = useRemoveDestinationPhotoMutation()
      const [removeServiceImage, {isError : isServiceImageDeletedError, isSuccess : isServiceImageDeletedSuccess}] = useRemoveServicePhotoMutation()

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
                await addDestinationImages({data : formData, destinationId :state._id})   
            }else{
                images.forEach(image => {
                    if(image.hasOwnProperty("file")) formData.append("serviceImages", image.file)
                })  
                await addServiceImages({data : formData, serviceId : serviceDetails._id})   
            }         
        }

    useEffect(() => {
      isDestinationImageError && alert(`Destination Photo upload error!!`)
      isDestinationImageDeletedError && alert(`Destination Photo delete error!!`)
      isDestinationImageSuccess && alert(`Destination photo uploaded successfully!!`)
      isDestinationImageDeletedSuccess && alert(`Destination Photo deleted successfully!!`)
      isServiceImageDeletedError && alert("Service photo delete error!!")
      isServiceImageDeletedSuccess && alert("service photo deleted successfully!!")
      isServiceImageError && alert("Service photo upload error!!")
      isServiceImageSuccess && alert ("Service photo uploaded successfully!!")
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
            children="Details"
            size='sm'
            onClick={() => setBtnVisible(prev => !prev)}
            variant='outline'/>
            :
            <Button 
            children="Details"
            size='md'
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
                            onChange={(e) => handlePreview(e)}
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
                                    onClick={() => handlePhotoDelete(image)} 
                                    />
                                    </li>)        
                        }) }
                    </ul>
                </div>  
        
          </div>
          <div className='mt-20'>
          <Button children="Submit" className='w-full ' 
          onClick={handlePhotoUpload} 
        />
          </div>

        </div>

    </div>
    
  )
}

export default PhotoUpload