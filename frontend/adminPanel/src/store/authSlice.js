import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authStatus : false,
    userData : null,
    accessToken : null
}

export const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {

        setUserData(state, action){
            state.userData = action.payload
        },

        setCredentials(state, action){
            const {accessToken} = action.payload
            state.accessToken = accessToken
            state.authStatus = true
        },

        logoutUser(state){
            state.authStatus = false,
            state.accessToken = null,
            state.userData = null
        }
    }

})

export const {setUserData, setCredentials, logoutUser} = authSlice.actions

export default authSlice.reducer


