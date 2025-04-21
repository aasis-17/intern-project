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

export const userApiSlice = createApi({
    reducerPath : "userApiSlice",
    baseQuery : baseQueryWithReAuth,
    endpoints : (builder) => ({
        getCurrentUser : builder.query ({
            query(){
                return {
                    url : "user",
                    method : "GET"
                }
            }
        })
    })
})

export const {useGetCurrentUserQuery} = userApiSlice