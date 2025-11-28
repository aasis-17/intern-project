import axios from "axios";

// const {state} = useContext(AuthContext)

export const apiInstance = axios.create({
    withCredentials : true
})

// apiInstance.interceptors.request.use(request => {
//   const accessToken = request
//   console.log(accessToken)
//   if (accessToken) {
//     request.headers['Authorization'] = `Bearer ${accessToken}`;
//   }
//   return request;
// }, error => {
//     console.log(error)
//   return Promise.reject(error);
// });
    
apiInstance.interceptors.response.use(response => response,  async (error) => {
    console.log(error)
            if (error.status === 500 && error.response?.data.message === "jwt expired") {
                try {
                    await axios.post("/api/v1/auth/refresh")
                    return apiInstance(error.config); // Retry original request 
                } catch (error) {
                    console.log("refresh error", error)
                    throw error
                }
            }

            throw error;
});

 
