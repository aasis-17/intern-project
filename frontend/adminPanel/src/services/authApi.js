import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setCredentials } from "../store/authSlice";


const baseQuery = fetchBaseQuery({
    baseUrl : "http://localhost:8000/api/v1/",
    credentials : "include",
    prepareHeaders : (headers, {getState}) => {
        const token = getState().auth.accessToken
       
        if(token){
            headers.set(`Authorization`, `Bearer${token}`)
        }
        return headers
    }
})

const baseQueryWithReAuth = async(args, api, extraOption) => {
    let result = await baseQuery(args, api, extraOption)
    

     if(result?.error?.status >= 401){
        const token = await baseQuery(
            {url :"auth/refresh", method : "POST"},
                  api,
                  extraOption)
        

        if(token?.data?.data){
            api.dispatch(setCredentials(token.data.data))

            result = await baseQuery(args, api, extraOption)
        }else{
            console.log("loout user")
            api.dispatch(logoutUser())
        }
    }
    return result

}

export const authApi = createApi({
    reducerPath : "authApi",
    baseQuery : baseQueryWithReAuth,
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