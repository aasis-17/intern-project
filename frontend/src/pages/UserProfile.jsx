import React, { useContext } from "react";
import { AuthContext } from "../store/authContext";
import {useQuery} from "@tanstack/react-query"
import serviceOwnerService from "../services/serviceOwnerServices";

const UserProfile = () => {
  const details = useContext(AuthContext)
  const userDetails = details.state.userData
  // const userId = useParams()

  const {data, isLoading} = useQuery({
    queryKey: ["profile"],
    queryFn : () => {
      if(userDetails.role === "serviceOwner"){
        return serviceOwnerService.getServiceProfileByUserId(userDetails._id)
      }
    }
  })
if(isLoading) return <div>Loading..</div>
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo */}
     <div className={`${userDetails.role !== "user" ? "" : "h-24"} relative`}>
     {userDetails.role === "serviceOwner" &&  
          (<img
          src={data.serviceCoverImage}
          alt="Cover"
          className="w-full h-60 object-cover"
        />)}
        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-8 flex gap-20 items-center ">
          <img
            src={ userDetails.userAvatar || "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white"
          />
          {userDetails.role !== "serviceOwner" && <p className="text-gray-600 mt-2 font-garamond text-xl">"{userDetails.userInfo}"</p>}
        </div>
      </div>

      {/* Profile Details */}
      <div className="px-8 pt-20 pb-6">
        <h1 className="text-3xl font-bold text-gray-800">{userDetails.fullname}</h1>
        <p className="text-gray-600 text-lg">{userDetails.email}</p>
        {userDetails.role === "serviceOwner" &&<p className="text-gray-600 mt-2">{userDetails.userInfo}</p>}
        {/* <div className="flex space-x-6 mt-4">
          <div>
            <span className="font-bold text-gray-800">{}</span>
            <span className="text-gray-600 ml-1">Posts</span>
          </div>
          <div>
            <span className="font-bold text-gray-800">{}</span>
            <span className="text-gray-600 ml-1">Followers</span>
          </div>
          <div>
            <span className="font-bold text-gray-800">{}</span>
            <span className="text-gray-600 ml-1">Following</span>
          </div>
        </div> */}
      </div>

      {/* Gallery Section */}
      <div className="px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Photos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-4 text-center">
        <p className="text-gray-500">© 2023 {}. All rights reserved.</p>
      </div>
    </div>
  );
};

export default UserProfile;