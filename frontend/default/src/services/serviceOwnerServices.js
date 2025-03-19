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
            console.log(res.data)
            return res.data.data
        } catch (error) {
            throw error.response.data      
        }
    }

    async upgradeToServiceOwner(formData){
        try {
            const res = await axios.post(this.uri, formData)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async getServiceRequest (option=""){
        console.log(option)
        try {
            const res = await axios.get(`${this.uri}?isApproved=${option}`)
            console.log(res.data)
            return res.data.data
        } catch (error) {
            return error.response.data
        }
    }

    async approveServiceRequest (userId){
        try {
            const res = await axios.post(`${this.uri}/approve/${userId}`)
            return res.data.data
        } catch (error) {
            return error.response.data
        }
    }

    async rejectServiceRequest (serviceId){
        try {
            const res = await axios.delete(`${this.uri}/reject/${serviceId}`)
            return res.data.data
        } catch (error) {
            return error.response.data
        }
    }

    async updateServiceInfo(formData, serviceId){ //if hamle formData without file pathako xa vani, tyo backend ma read hudaina so hamle yo case ma header pathauna parxa i.e application/json natar pardaina
        try {
            const res = await axios({
                method : "patch",
                url : `${this.uri}/${serviceId}`,
                data : formData,
                headers : {"content-type" : "application/json"}
            })
            
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
    async addServiceImages(formData, serviceId){
        try {
           const res = await axios.put(`${this.uri}/${serviceId}`, formData) 
           return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
    async deleteServiceImage(serviceId, formData){
        try {
            const res= await axios.post(`${this.uri}/${serviceId}`, formData)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
    async updateServiceCoverImage(serviceId, formData){
        try {
            const res = await axios.put(`${this.uri}/update/${serviceId}`, formData)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
}

const serviceOwnerService = new serviceOwnerServices("/api/v1/serviceOwner")

export default serviceOwnerService