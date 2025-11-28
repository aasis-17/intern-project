import axios from "axios"
import { apiInstance } from "../axios/axios"
class userServices{
    constructor(uri){
        this.uri=uri
    }

    async getCurrentUser (){
        try {
            const res = await apiInstance.get(this.uri)
            console.log(res)
            return res.data.data
        }catch(error) {
            console.log(error, 'errrror')
            throw error
        }
    }
    async getUserById (userId){
        try {
            const res = await axios.get(`${this.uri}/${userId}`)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
    async updateUserInfo (formData){
        try {
            const res = await axios.patch(this.uri, formData)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async updateUserAvatar (formData){
        try {
            const res = await axios.put(this.uri,formData)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
}

const userService = new userServices("/api/v1/user")

export default userService