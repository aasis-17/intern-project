import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
    reducerPath : "authApi",
    baseQuery : fetchBaseQuery({
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
        
    }),
    endpoints(builder){
        return {
            loginUser : builder.mutation({
                query(body){
                    return  {
                    url: "auth",
                    method: 'POST',
                    body,
                }    
            }
                }),
            logoutUser : builder.mutation({
                query(){
                    return {
                        url : "auth",
                        method : "GET",
                    }
                },
            }),

        }
    }
})

export const { useLoginUserMutation, useLogoutUserMutation} = authApi