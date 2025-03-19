import axios from "axios"
import { data } from "react-router"

class reviewServices {
    constructor(uri){
        this.uri = uri
    }

    async createReview (formData, reviewOption, id){
        console.log(formData, reviewOption)
        try {
            const res = await axios.post(`${this.uri}?${reviewOption}=${id}`, formData)
            console.log(res)
            return res.data.data
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    async getReviews(reviewOption, id, limit=10, page=1){
        try {
            const res = await axios.get(`${this.uri}?${reviewOption}=${id}&limit=${limit}&page=${page}`)
            console.log(res)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async getReviewById (reviewId) {
        try {
            const res = await axios.get(`${this.uri}/${reviewId}`)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async updateReview (reviewId, formData) {
        try {
            const res = await axios.patch(`${this.uri}/${reviewId}`, formData)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async deleteReview (reviewId) {
        try {
            const res = await axios.delete(`${this.uri}/${reviewId}`)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
}

const reviewService = new reviewServices("/api/v1/review")

export default reviewService