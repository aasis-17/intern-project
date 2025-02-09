import axios from "axios";

class destinationServices{
    constructor(uri){
        this.uri=uri
    }

    async getDestination(search="",region="", sortType, page=1){
        // console.log(filter)
        try {
            const res = await axios.get(`${this.uri}?search=${search}&region=${region}&page=${page}&sortType=${sortType}`)
            console.log(res)
            return res.data.data
        } catch (error) {
            console.log(error)
            throw error.response.data
            
        }
    }

    async getDestinationById (_id) {
        try {
            const res = await axios.get(`${this.uri}/${_id}`)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async createDestination (formData){
        
        try {
            console.log(formData)
            const res = await axios.post(this.uri, formData)
            
            console.log(res)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
    async deleteDestination (_id){
        try {
            const res = await axios.delete(`${this.uri}/${_id}`)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
    async updateDestination(formData){
        try {
            const res =await axios.patch(this.uri, formData)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async addRoutePlan ( destinationId, formData){

        try {
            const res = await axios.post(`${this.uri}/route/${destinationId}`, formData)
            console.log(res.data.data)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async addDestinationImages(formData, _id){
        try {
            const res = await axios.put(`${this.uri}/${_id}`, formData)
            console.log(res)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async deleteDestinationImage(formData, _id){
        console.log(formData)
        try {
            const res = await axios.post(`${this.uri}/${_id}`, formData)
            console.log(res)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
}

const destinationService = new destinationServices("/api/v1/destination")
export default destinationService