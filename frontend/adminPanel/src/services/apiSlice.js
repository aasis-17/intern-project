import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutUser,  setCredentials } from "../store/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl : "http://localhost:8000/api/v1/",
    credentials : "include",
    prepareHeaders : (headers, {getState}) => {
        const token = getState().auth.accessToken
        console.log("accessToken",token)
        if(token){
            headers.set(`Authorization`, `Bearer${token}`)
        }
        return headers
    }
})

const baseQueryWithReAuth = async(args, api, extraOption) => {
    let result = await baseQuery(args, api, extraOption)
    console.log("baseQueryWithreauthresult",result)

     if(result?.error?.status >= 401){
        const token = await baseQuery(
            {url :"auth/refresh",
                 method : "POST"}
                 , api,
                  extraOption)
        console.log("refrehToken",token)

        if(token?.data?.data){
            api.dispatch(setCredentials(token.data.data))

            result = await baseQuery(args, api, extraOption)
        }else{
            api.dispatch(logoutUser())
        }
    }
    return result

}

export const apiSlice = createApi({
    reducerPath : "apiSlice",
    baseQuery : baseQueryWithReAuth,
    tagTypes : ["Destination", "Service"],

    endpoints : (builder) => ({
        getCurrentUser : builder.query ({
            query(){
                return {
                    url : "user",
                    method : "GET"
                }
            }
        }),
        getAllDestinationName : builder.query({
            query(){
                return {
                    url : "destination",
                    method : "PATCH"
                }
            }
        }),
        getDestinations : builder.query ({
            query({search="", region="", page="", sortType=""}){
                return {
                    url : `destination`,
                    method : "GET",
                    params : {
                        search,
                        region,
                        page,
                        sortType
                    }
                }
            },
            providesTags : 
            (result) =>
                result?.data
                  ? [
                      ...result.data.map(({ _id }) => ({ type: "Destination", _id })),
                      "Destination"
                    ]
                  : 
                  ["Destination"],
            transformResponse : (res) => {
                return res.data
            }
        }),
        getDestinationById : builder.query ({
            query(destinationId){
                return {
                    url : `destination/${destinationId}`,
                    method : "GET",
                }
            },
            providesTags: (result, error, id) => [{ type: "Destination", id }],
            transformResponse : (res) => {
                return res.data
            }
        }),
        deleteDestination : builder.mutation({
            query({destination}){
                return {
                    url : `destination/${destination._id}`,
                    method : "DELETE"
                }
            },
            invalidatesTags : (result, error, {id}) => [{type : "Destination", id}]
            // async onQueryStarted({ destination, filter }, { dispatch, queryFulfilled }) {
            //     try {
            //       const data = await queryFulfilled
            //       dispatch(
            //         apiSlice.util.updateQueryData('getDestinations', filter, (draft) => {
            //             const array = draft.destinations.filter(post => post._id !== destination._id)
            //             draft.destinations = array
            //         console.log(JSON.parse(JSON.stringify(draft)),"draft")
            //         })
                  
            //       )
            //     } catch(error) {
            //         console.log("error while deleting destination",error)
            //     }
            //   },
        }),

        uploadDestination : builder.mutation({
            query({formData :data}){
                return {
                    url : `destination`,
                    method : "POST",
                    body : data
                }
            },
            invalidatesTags : (result, error, {id}) => [{type : "Destination", id}]
            // async onQueryStarted({ state }, { dispatch, queryFulfilled }) {
            //     try {
            //       const { data: createdPost } = await queryFulfilled
            //       console.log(createdPost)
            //        dispatch(
            //         apiSlice.util.updateQueryData('getDestinations', state,(draft) =>{
            //             draft.destinations.push(createdPost.data)
            //         }),
            //       )
            //     } catch(error) {console.log(error)}
            //   },
        
        }),

        updateDestination : builder.mutation({
            query({id :destinationId, formData:data}){
                console.log("formData", data, destinationId)
                return {
                    url : `destination/${destinationId}`,
                    method : "PATCH",
                    body : data
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: "Destination", id }], // this refetches 
            async onQueryStarted({id, state}, { dispatch, queryFulfilled }) {
                console.log(state)
                try {
                  const { data: updatedDestination } = await queryFulfilled
                 
                //     dispatch(
                //     apiSlice.util.updateQueryData('getDestinations',  state,
                //       (draft) => {
                //         const index = draft.destinations.findIndex(item => item._id === id);
                //         if (index !== -1) {
                //           draft.destinations[index] = updatedDestination.data;
                //         }
                // }),
                //   )
            // Update individual destination cache
          dispatch(
            apiSlice.util.updateQueryData(
              'getDestinationById', 
              id, 
              () => updatedDestination.data
            )
          );
                } catch(error) {
                    console.log("error while updating destination",error)
                }
              },
        }),

        uploadRoute : builder.mutation({
            query({id, data}){
                return {
                    url : `destination/route/${id}`,
                    method : "POST",
                    body : data
                }
            },
            async onQueryStarted({id},{dispatch, queryFulfilled}){
                try {
                    const {data : routeAdded} = await queryFulfilled
                    console.log("route added",routeAdded)
                    dispatch(
                        apiSlice.util.updateQueryData("getDestinationById",id,(draft) => {
                            
                            Object.assign(draft, routeAdded.data)
                            console.log("added to draft",JSON.parse(JSON.stringify(draft)))
                        })
                    )
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        removeRoutePlan: builder.mutation({
            query({destinationId, routeId}){
                console.log(destinationId, routeId)
                return{
                    url : `destination/route/${destinationId}`,
                    method : "PATCH",
                    body : {routeId}
                }
            },
            async onQueryStarted({destinationId},{dispatch, queryFulfilled}){
                try {
                    const {data : updatedRoutePlan} = await queryFulfilled
                    console.log(updatedRoutePlan)
                    dispatch(apiSlice.util.updateQueryData("getDestinationById", destinationId, (draft) =>{
                        
                        Object.assign(draft, updatedRoutePlan.data)
                        console.log(JSON.parse(JSON.stringify(draft)))
                    }))
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        uploadDestinationPhoto : builder.mutation({
            query({destinationId, data}){
                return {
                    url : `destination/${destinationId}`,
                    method : "PUT",
                    body : data
                }
            },
            async onQueryStarted({destinationId}, {dispatch, queryFulfilled}){
                try {
                    const {data} = await queryFulfilled
                    console.log(data)
                    dispatch(apiSlice.util.updateQueryData("getDestinationById",destinationId, (draft) => {
                        Object.assign(draft, data.data)
                    }))
                } catch (error) {
                    console.log(error)
                }
            }
        }),

        removeDestinationPhoto : builder.mutation({
            query({destinationId, data}){
                return{
                    url : `destination/${destinationId}`,
                    method : "POST",
                    body : data
                }
            },
            async onQueryStarted({destinationId}, {dispatch, queryFulfilled}){
                try{
                   const {data} = await queryFulfilled
                   console.log(data)
                   dispatch(apiSlice.util.updateQueryData("getDestinationById", destinationId,(draft) => {
                    Object.assign(draft, data.data)
                
                   })) 
                }catch(error){
                    console.log(error)
                }
            }
        }),

        getServices : builder.query({
            query({search="", option="",serviceDestination=""}){
                return {
                    url : `serviceOwner`,
                    params : {
                        search,
                        option,
                        serviceDestination
                    }
                }
            },
            providesTags : 
            (result) =>
                result?.data
                  ? [
                      ...result.data.map(({ _id }) => ({ type: "Service", _id })),
                      "Service"
                    ]
                  : 
                  ["Service"],
            transformResponse : (res) => {
                return res.data
            }
        }),

        getServiceById : builder.query({
            query(serviceId){
                return {
                    url : `serviceOwner/${serviceId}`
                }
            },
            providesTags: (result, error, id) => [{ type: "Service", id }],
            transformResponse : (res) => {
                return res.data
            }
        }),

        updateServiceData : builder.mutation({
            query({serviceId, formData}){
                console.log(formData)
                return{
                    url : `serviceOwner/${serviceId}`,
                    method : "PATCH",
                    body : formData
                    
                }
            },
            invalidatesTags :  (result, error, { id }) => [{ type: "Service", id }],
            async onQueryStarted({serviceId, filter},{dispatch, queryFulfilled}){
            //     console.log(serviceId,"filter")
                try {
                    const {data} = await queryFulfilled
            //         console.log(data)
            //         dispatch(apiSlice.util.updateQueryData("getServices", filter, (draft) =>{
            //             const index = draft.findIndex(service => service._id === serviceId )
            //             if (index !== -1) {
            //               draft[index] = data.data;
            //             }
            //         }))

                    dispatch(apiSlice.util.updateQueryData('getServiceById', serviceId, 
                        
                        (draft) => {   
                        Object.assign(draft, data.data)
                        console.log(JSON.parse(JSON.stringify(draft)))
                        }
                    
                ))
                } catch (error) {
                    console.log(error)
                }
            }
        }),

        upgradeToService : builder.mutation({
            query({formData}){
                return{
                    url : `serviceOwner`,
                    method : "POST",
                    body : formData
                }
            },
            invalidatesTags : (result, error, {id}) => [{type : "Service", id}]
            // async onQueryStarted({filter},{dispatch, queryFulfilled}){
            //     console.log("filter", filter)
            //     try {
            //         const {data} = await queryFulfilled
            //         console.log(data)
            //         dispatch(apiSlice.util.updateQueryData('getServices', filter, (draft) => {
            //             draft.push(data.data)
            //             console.log(JSON.parse(JSON.stringify(draft)))
            //             return draft
            //         }))
            //     } catch (error) {
            //         console.log(error)
            //     }
            // }
        }),

        approveService : builder.mutation({
            query({userId}){
                return{
                    url : `serviceOwner/approve/${userId}`,
                    method : "POST"
                }
            },
            async onQueryStarted({serviceId}, {dispatch, queryFulfilled}){
                try {
                    const {data} = await queryFulfilled
                    console.log(data)
                    dispatch(apiSlice.util.updateQueryData("getServiceById", serviceId, (draft) => {
                        Object.assign(draft, data.data)
                        console.log(JSON.parse(JSON.stringify(draft)))
                    }))
                } catch (error) {
                    console.log(error)      
                }
            }
        }),

        rejectService : builder.mutation({
            query(serviceId){
                return{
                    url : `serviceOwner/reject/${serviceId}`,
                    method : "DELETE"
                }
            },
            async onQueryStarted({ serviceId}, {dispatch, queryFulfilled}){
                try {
                    const {data} = await queryFulfilled
                    console.log(data)
                    dispatch(apiSlice.util.updateQueryData("getServiceById", serviceId, (draft) => {
                        Object.assign(draft, data.data)
                        console.log(JSON.parse(JSON.stringify(draft)))
                    }))
                } catch (error) {
                    console.log(error)      
                }
            }
        }),

        removeService : builder.mutation({
            query({serviceId}){
                return{
                    url : `serviceOwner/${serviceId}`,
                    method : "DELETE"
                }
            },
            invalidatesTags : (result, error, {id}) => [{type : "Service", id}]
            // async onQueryStarted({serviceId, filter}, {dispatch, queryFulfilled}){
            //     try {
            //         const {data} = await queryFulfilled
            //         console.log(serviceId, filter, "filter")
            //         dispatch(apiSlice.util.updateQueryData("getServices", filter, (draft) => {
            //             // Object.assign(draft, data.data)
            //             draft = draft.filter((service) => service._id !== serviceId )
            //             console.log(JSON.parse(JSON.stringify(draft)))
            //             return draft
            //         }))
            //     } catch (error) {
            //         console.log(error)      
            //     }
            // }
        }),

        uploadServiceImage : builder.mutation({
            query({serviceId, data}){
                return{
                    url : `serviceOwner/${serviceId}`,
                    method : "PUT",
                    body : data
                }
            },
            async onQueryStarted({serviceId}, {dispatch, queryFulfilled}){
                try {
                    const {data} = await queryFulfilled
                    console.log(data)
                    dispatch(apiSlice.util.updateQueryData("getServiceById" ,serviceId, (draft) => {
                        Object.assign(draft, data.data)
                    }))
                } catch (error) {
                    console.log(error)
                }
            }
        }),

        removeServicePhoto : builder.mutation({
            query({serviceId, data}){
                return{
                    url : `serviceOwner/${serviceId}`,
                    method : "POST",
                    body : data
                }
            },
            async onQueryStarted({serviceId}, {dispatch, queryFulfilled}){
                try{
                    const {data}= await queryFulfilled
                    console.log(data)
                    dispatch(apiSlice.util.updateQueryData("getServiceById", serviceId, (draft) =>{
                        Object.assign(draft, data.data)
                    }))
                }catch(error){
                    console.log(error)
                }
            }
        }),

        changePassword : builder.mutation({
            query(data){
                return {
                    url :"auth",
                    method : "PATCH",
                    body : data
                }
            }
        })

    })
})

export const {useGetCurrentUserQuery,
    useChangePasswordMutation,
    useUploadDestinationMutation,
    useUpdateDestinationMutation,
    useGetDestinationsQuery, 
    useGetDestinationByIdQuery, 
    useDeleteDestinationMutation, 
    useUploadRouteMutation, 
    useUploadDestinationPhotoMutation, 
    useRemoveRoutePlanMutation,
    useRemoveDestinationPhotoMutation,
    useGetServiceByIdQuery,
    useGetServicesQuery,
    useGetAllDestinationNameQuery,
    useUpdateServiceDataMutation,
    useUpgradeToServiceMutation,
    useApproveServiceMutation,
    useRejectServiceMutation,
    useRemoveServiceMutation,
    useUploadServiceImageMutation,
    useRemoveServicePhotoMutation
    } = apiSlice