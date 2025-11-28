import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../store/authContext";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import serviceOwnerService from "../services/serviceOwnerServices";
import { useParams } from "react-router";
import userService from "../services/userService";
import Review from "../components/Review"
import { toast } from "react-toastify";
import Notify from "../components/toast/Notify";
import Button from "../components/Button";
import Loader from "../components/loader/Loader";
import Error from "./Error";


const UserProfile = () => {

  const {state} = useContext(AuthContext)

  const {id} = useParams()

  const queryClient = useQueryClient()

  const editOption = id === state?.userData?._id || false

  const [image, setImage] = useState({
    userAvatar : "",
    serviceCoverImage : "",
    editAvatar : false,
    editCoverImage : false
  })

  const [imageFile, setImageFile] = useState("")

    const {data : userDetails,isError :isUserDetailError,error : userDetailError, isLoading: isUserDetailLoading, isSuccess : isUserDetailSuccess} = useQuery({
      queryKey: ["profile", id],
      queryFn :  () => {
        if(state.userData._id === id) return state.userData
        return userService.getUserById(id)
      }
    })
     
    const {data : serviceDetails,  isLoading : isServiceDetailLoading, isSuccess : isServiceDetailSuccess, isError : isServiceDetailError, error : serviceDetailError} = useQuery({
      queryKey : ["serviceId", id],
      queryFn : () => {
        if(state.userData._id === id && state.userData.role === "serviceOwner"){
          return serviceOwnerService.getServiceProfileByUserId(id)
        }else if(userDetails.role === "serviceOwner") return serviceOwnerService.getServiceProfileByUserId(userDetails._id)  
        else return null  
      },
      enabled : !!userDetails
    })

    useEffect(() => {
      setImage(prev => ({...prev, userAvatar : userDetails?.userAvatar, serviceCoverImage : serviceDetails?.serviceCoverImage}))
    },[isUserDetailSuccess, isServiceDetailSuccess, id])

  const handleImage = (e, field) => {
    
    const file = e.target.files[0];
    const reader = new FileReader();
 
   reader.onloadend = () => {
     setImage((prev) => ({ ...prev, [field]: reader.result })); 
   };
   if (file) {
     reader.readAsDataURL(file);
   } 
    setImageFile(file)
    e.target.value = null 
  }

  const handleImageChange = (e, field) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append(field, imageFile)

      switch (field) {
        case "userAvatar" : 
          mutateAvatar.mutateAsync(formData)
          break;
        case "serviceCoverImage" : 
          mutateCoverImage.mutateAsync(formData)
          break;
      }
  };

  // Handler for toggling edit mode
  const toggleEdit = (field) => {
     setImage((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const cancelImage = (field, toggleField) => {
    toggleEdit(toggleField)
    field === "userAvatar" ? 
    setImage(prev => ({...prev, [field] : userDetails[field]}))
    :
    setImage(prev => ({...prev, [field] : serviceDetails[field]}))
  }

  const mutateAvatar = useMutation({
    mutationFn : async(data)=>{
      const mutateData = await userService.updateUserAvatar(data)
      return mutateData
    },
    onSuccess : (data) => {
      console.log(data, "mutatedata")
      toast.success(Notify, {data : {msg : "User avatar updated successfully!!"}, autoClose : 1000})
      setImage(prev => ({...prev, editAvatar : !prev.editAvatar}))
      queryClient.setQueryData(["profile", id], (prev) =>{
        Object.assign(prev, data)
      })
      
    },
    onError : ()=>{
      toast.error(Notify, {data : { msg : "Error while updating user avatar!!"} , autoClose : 1000 })
    }
  })

  const mutateCoverImage = useMutation({
    mutationFn : async(data)=>{
      const mutateData = await serviceOwnerService.updateServiceCoverImage(serviceDetails._id, data)
      return mutateData
    },
    onSuccess : (data) => {
      toast.success(Notify, {data : {msg : "Cover image updated successfully!!"}, autoClose : 1000})
      setImage(prev => ({...prev, editCoverImage : !prev.editCoverImage}))
      queryClient.setQueryData(["serviceDetails", id], (prev) =>{
        Object.assign(prev, data)
      })
    },
    onError : ()=>{
      toast.error(Notify, {data : {msg : "Error while updating coverImage!!"}, autoClose : 1000})
    }
  })

if(isUserDetailLoading || isServiceDetailLoading) return <Loader />
if(isUserDetailError || isServiceDetailError) return <Error />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo */}
     <div className={`${userDetails.role !== "user" ? "" : "h-24"} relative`}>
     {userDetails?.role === "serviceOwner" &&  
      <>
        <div className="relative h-96">
        <img
          src={image.serviceCoverImage} // Replace with your hero image
          alt="Hotel Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4">{serviceDetails?.serviceName}</h1>
            <p className="text-xl text-gray-200">Where Luxury Meets Comfort</p>
          </div>
        </div>
      </div>
        

  <form onSubmit={(e) =>handleImageChange(e,"serviceCoverImage")}>
      {editOption && 
          <label hidden={image.editCoverImage} onClick={() => toggleEdit("editCoverImage")} htmlFor="example" className="absolute top-2 right-4 px-2 py-1 bg-gray-800 text-white text-sm rounded-lg" >
      edit
      </label>}

    { image.editCoverImage && (
      <div className='absolute top-2 right-4 flex flex-col gap-3' >
      <Button children="save" variant="noCss"  type='submit' loading={mutateCoverImage.isPending} className=" px-1 py-1  bg-gray-800 text-white text-sm rounded-lg" />
      <Button children="cancel" variant="noCss" onClick={() => cancelImage( "serviceCoverImage", "editCoverImage")} className=" px-1 py-1 bg-gray-800 text-white text-sm rounded-lg" />
      </div>
    )}
  <input
    id='example'
    type="file"
    accept="image/*"
    onInput = {(e) => handleImage(e, 'serviceCoverImage')}
    className="absolute top-2 left-20"
    hidden     
  />
    </form>
    </>
}
        {/* Profile Picture */}
        <div className="absolute -bottom-20 left-8 flex  items-center">
          <img
            src={image.userAvatar || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" }
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-white"
          />

          
   <form onSubmit={(e) =>handleImageChange(e,"userAvatar")}>

   { editOption && <label hidden={image.editAvatar} onClick={() => toggleEdit("editAvatar")} htmlFor="avatar" className="absolute top-2 -right-3 px-2 py-1 bg-gray-800 text-white text-sm rounded-lg" >
      edit
      </label>}
    { image.editAvatar && (
      <div className='absolute top-2 -right-7 flex flex-col gap-3' >
      <Button variant="noCss" loading={mutateAvatar.isPending}  type='submit' children="save" className=" px-1 py-1  bg-gray-800 text-white text-sm rounded-lg" />
      <Button variant="noCss" children="cancel" onClick={() => cancelImage( "userAvatar", "editAvatar")} className=" px-1 py-1 bg-gray-800 text-white text-sm rounded-lg" />
      </div>
    )}
  <input
    id='avatar'
    type="file"
    accept="image/*"
    onInput = {(e) => handleImage(e, 'userAvatar')}
    className="absolute top-2 left-20"
    hidden     
  />
    </form>
          {userDetails.role !== "serviceOwner" && userDetails.userInfo && <p className="animate-fade-down text-gray-600 mt-2 font-garamond text-xl">"{userDetails.userInfo}"</p>}
        </div>
      </div>

      {/* Profile Details */}
      <div className="px-12 pt-20 pb-6 shadow-lg flex justify-between">
        <div>
        <h1 className="text-3xl font-bold text-gray-800">{userDetails.fullname}</h1>
        <p className="text-gray-600 text-lg">{userDetails.email}</p>
        {userDetails.role === "serviceOwner" && 
        <>
          <p className="text-lg text-gray-600 mb-2">Founder & CEO</p>
          <p className="text-gray-600 mt-2">{userDetails.userInfo}</p>
        </>
        }
        </div>
        
        {userDetails.role === "serviceOwner" && 
                    // <div key={review._id} className="bg-white px-6 mb-5 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex justify-end">
                      {[...Array(serviceDetails.avgReview ? serviceDetails.avgReview.toFixed(1) : 0)].map((_, i) => (
                       <span key={i} className="text-yellow-400 text-3xl">
                         ★
                       </span>
                     ))}
                     {serviceDetails.avgReview && <span className="">{serviceDetails.reviews.length}</span>}
                   </div> }
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 py-7">
      {userDetails.role !== "user" && <>
        {/* About Section */}
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">About Us</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            {serviceDetails?.serviceInfo}
           
          </p>
        </section>

        {/* Image Gallery Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceDetails?.serviceImages.map(image => {
              return (
             <div key={image.publicId} className="relative group overflow-hidden rounded-lg shadow-lg">
              <img
                src={image.src}
                alt="Gallery 1"
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-lg font-semibold">Luxurious Rooms</p>
              </div>
            </div> 
              )
            })}
          </div>
        </section>

        {/* Stay Packages Section */}
        {/* <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Stay Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Weekend Getaway</h3>
              <p className="text-gray-600 mb-4">Enjoy a relaxing weekend with our special package.</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                Book Now
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Family Vacation</h3>
              <p className="text-gray-600 mb-4">Perfect for families looking for a memorable stay.</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                Book Now
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Business Travel</h3>
              <p className="text-gray-600 mb-4">Tailored for professionals on the go.</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                Book Now
              </button>
            </div>
          </div>
        </section> */}

        {/* Reviews Section */}

        (<section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">What Our Guests Say</h2>

          <Review reviewState="serviceId" reviewId={id} />

        </section>)
        

        {/* Call-to-Action Section */}
        <section className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Book Your Stay?</h2>
          <p className="text-gray-600 text-lg mb-8">Experience luxury like never before. Book your stay today!</p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
            Book Now
          </button>
        </section>
      </>}
      </div>

    </div>


    // </div>
  );
};

export default UserProfile;