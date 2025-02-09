import React, { useState, useRef } from 'react'
import FormField from '../../form/FormField'
import Button from '../../Button'
import { useMutation } from '@tanstack/react-query'
import { useLocation } from 'react-router'
import destinationService from '../../../services/destinationService'

const PhotoUpload = () => {
    const {state} = useLocation()
    console.log(state)
    // const state =  {destinationImages : [{src : "hahah", publicId : "123"}]}
    const [imagePreview, setImagePreview] = useState(0)
    const [images, setImages] = useState(state.destinationImages[0] ? [...state.destinationImages] : [])
    
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
      const deleteMutation = useMutation({
        mutationFn :async (image) => {   
            if(image.hasOwnProperty("publicId")){
                console.log(images)
               await destinationService.deleteDestinationImage(image, state._id)
            }
            setImages(prev => prev.filter((img) => img.src !== image.src))
        },
        onSuccess : () => {
            alert("Image deleted successfully!!")
        },
        onError : () =>{
            alert("Error while deleting image!!")
        }
      })


      const mutation = useMutation({
        mutationFn :async () => {
            const formData = new FormData()
            images.forEach(image => {
                if(image.hasOwnProperty("file")) formData.append("destinationImages", image.file)
            })  
            await destinationService.addDestinationImages(formData, state._id)   
        },
        onSuccess : () => {
            alert(`Images added successfully!!`)
        },
        onError : () => {
            alert("Error while uploading Images!!")
        }
      })

  return (
    <div className='flex-1'>
        <div className='flex-col flex justify-between h-full'>

            <div className='text-4xl p-4 font-garamond'>
            Add Destination Images :
            </div>

            <div className='flex gap-x-5'>
                <div className='flex-1 h-80  '>
                    <img alt='images' className='rounded-lg  object-cover w-full h-full' 
                    src={images[imagePreview]?.src || ""}
                    /> 

                    <div className='flex justify-between'>
                        <Button children="back" variant='secondary' onClick={() => setImagePreview(prev => prev - 1)} />
                        <div className=''>
                            <FormField
                            label="Select images"
                            type="file"
                            onChange={(e) => handlePreview(e)}
                            className=" hidden"
                            labelClassName="text-sm font-medium text-gray-600 bg-gray-200 px-3 pb-2 cursor-pointer rounded-md "
                            />
                        </div>
          
                        <Button children="next" variant='secondary' onClick={() => setImagePreview(prev => prev + 1)} />
                    </div> 
                </div>

                <div className='w-1/4'>
                    <div>Images selected : {images.length}</div>
                    <ul>
                        {images.map(image => {

                                return (<li key={image.src} className='flex bg-gray-100 rounded-lg overflow-hidden justify-between h-14 w-full mb-3'>
                                    <img className='w-[40%] object-cover rounded-lg' src={image.src} />
                                    <Button size='sm' variant='delete' children="Delete" onClick={() =>deleteMutation.mutateAsync(image)} />
                                    </li>)
                            
                        }) }
                    </ul>
                </div>  
        
          </div>
          <div>
          <Button children="Submit" className='w-full my-10' onClick={mutation.mutateAsync} />
          </div>

        </div>

    </div>
    
  )
}

export default PhotoUpload