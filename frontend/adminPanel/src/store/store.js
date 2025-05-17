import {configureStore} from "@reduxjs/toolkit"
import { authApi } from "../services/authApi"
import authReducer from "./authSlice"
import { apiSlice } from "../services/apiSlice"

const store = configureStore({
    reducer : {
        auth : authReducer,
        [authApi.reducerPath] : authApi.reducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware : (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(authApi.middleware, apiSlice.middleware)
    }
})

export default store