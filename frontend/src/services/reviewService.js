import axios from "axios"
import { data } from "react-router"

class reviewServices {

    async createReview (formData, field, id){
        console.log(formData, field, id)
        try {
            const res = await axios.post(`/api/v1/review?${field}Id=${id}`, formData)
            console.log(res)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async getReview (reviewId) {
        try {
            const res = await axios.get(`/api/v1/review/${reviewId}`)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async updateReview (reviewId, formData) {
        try {
            const res = await axios.patch(`/api/v1/review/${reviewId}`, formData)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async deleteReview (reviewId) {
        try {
            const res = await axios.delete(`/api/v1/review/${reviewId}`)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
}

const reviewService = new reviewServices()

export default reviewService