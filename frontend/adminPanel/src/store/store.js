import {configureStore} from "@reduxjs/toolkit"
import { authApi } from "../services/authApi"
import authReducer from "./authSlice"
import { userApiSlice } from "../services/userApiSlice"

const store = configureStore({
    reducer : {
        auth : authReducer,
        [authApi.reducerPath] : authApi.reducer,
        [userApiSlice.reducerPath]: userApiSlice.reducer
    },
    middleware : (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(authApi.middleware, userApiSlice.middleware)
    }
})

export default store