import React, { useState, useRef, useEffect } from 'react'
import FormField from '../../../../components/fields/FormField'
import Button from '../../../../components/button/Button'
import { useNavigate, useOutletContext } from 'react-router'
import { useRemoveDestinationPhotoMutation, useUploadDestinationPhotoMutation } from '../../../../services/apiSlice'

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
      const [deleteMutation, {isError : deleteError, isSuccess : deleteSuccess }] = useRemoveDestinationPhotoMutation()

      const handlePhotoDelete = async (image)=> {
            if(option === "service"){
                if(!image.hasOwnProperty("publicId")) return
                // await (serviceDetails._id, image)
            } else{
                if(image.hasOwnProperty("publicId")){
                    console.log(images)
                   await deleteMutation({data : image, destinationId : state._id})
                }
            }

            setImages(prev => prev.filter((img) => img.src !== image.src))
        }
      
    //     mutationFn :async (image) => {  
    //         if(option === "service"){
    //             if(!image.hasOwnProperty("publicId")) return
    //             await serviceOwnerService.deleteServiceImage(serviceDetails._id, image)
    //         } else{
    //             if(image.hasOwnProperty("publicId")){
    //                 console.log(images)
    //                await destinationService.deleteDestinationImage(image, state._id)
    //             }
    //         }

    //         setImages(prev => prev.filter((img) => img.src !== image.src))
    //     },
    //     onSuccess : () => {
    //         alert("Image deleted successfully!!")
    //     },
    //     onError : () =>{
    //         alert("Error while deleting image!!")
    //     }
    //   })

      const [mutation, { isSuccess, isLoading, isError}] = useUploadDestinationPhotoMutation()

        const handlePhotoUpload = async() => {
             const formData = new FormData()
            if(option !== "service"){
                images.forEach(image => {
                    if(image.hasOwnProperty("file")) formData.append("destinationImages", image.file)
                })  
                await mutation({data : formData, destinationId :state._id})   
            }else{
                images.forEach(image => {
                    if(image.hasOwnProperty("file")) formData.append("serviceImages", image.file)
                })  
                await mutation(formData, serviceDetails._id)   
            }         

        }
    //     mutationFn :async () => {
    //         const formData = new FormData()
    //         if(option !== "service"){
    //             images.forEach(image => {
    //                 if(image.hasOwnProperty("file")) formData.append("destinationImages", image.file)
    //             })  
    //             await destinationService.addDestinationImages(formData, state._id)   
    //         }else{
    //             images.forEach(image => {
    //                 if(image.hasOwnProperty("file")) formData.append("serviceImages", image.file)
    //             })  
    //             await serviceOwnerService.addServiceImages(formData, serviceDetails._id)   
    //         }

    //     },
    //     onSuccess : () => {
    //         alert(`Images added successfully!!`)
    //     },
    //     onError : () => {
    //         alert("Error while uploading Images!!")
    //     }
    //   })

    useEffect(() => {
      isError && alert(`Photo upload error!!`)
      deleteError && alert(`Photo delete error!!`)
      isSuccess && alert(`photo uploaded successfully!!`)
      deleteSuccess && alert(`Photot deleted successfully!!`)
    },[isError, deleteError, isSuccess, deleteSuccess])

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