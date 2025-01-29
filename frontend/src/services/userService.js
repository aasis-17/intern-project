import axios from "axios"
class userServices{

    async getCurrentUser (){
        try {
            const res = await axios.get("/api/v1/user")
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
    async updateUserInfo (formData){
        try {
            const res = await axios.patch("/api/v1/user", formData)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async updateUserAvatar (formData){
        try {
            const res = await axios.put("/api/v1/user/userAvatar",formData)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
}

const userService = new userServices()

export default userService