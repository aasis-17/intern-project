import axios from "axios";

class serviceOwnerServices {
    constructor(
        uri
    ){
        this.uri = uri
    }
    async getServiceProfile(serviceId){
        try {
            const res = await axios.get(`/api/v1/serviceOwner/${serviceId}`)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async getServiceProfileByUserId(userId){
        try {
            const res = await axios.get(`${this.uri}/${userId}`)
            return res.data.data
        } catch (error) {
            throw error.response.data      
        }
    }

    async upgradeToServiceOwner(formData){
        try {
            const res = await axios.post("/api/v1/serviceOwner", formData)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
    async updateServiceInfo(formData, serviceId){
        try {
            const res = await axios.patch(`/api/v1/serviceOwner/${serviceId}`, formData)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
    async addServiceImages(formData){
        try {
           const res = await axios.put(`/api/v1/serviceOwner`) 
        } catch (error) {
            
        }
    }
}

const serviceOwnerService = new serviceOwnerServices("/api/v1/serviceOwner")

export default serviceOwnerService