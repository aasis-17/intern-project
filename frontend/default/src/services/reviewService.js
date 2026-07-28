import axios from "axios"
import { data } from "react-router"
import { apiInstance } from "../axios/axios"

class reviewServices {
    constructor(uri){
        this.uri = uri
    }

    async createReview ({reviewForm, reviewState, reviewId}){
        console.log(reviewForm, reviewState, reviewId)
        try {
            const res = await apiInstance.post(`${this.uri}?${reviewState}=${reviewId}`, reviewForm)
            console.log(res)
            return res.data.data
        } catch (error) {
            console.log(error)
            throw error.response.data
        }
    }

    async getReviews({reviewState, reviewId, limit=10, page=1}){
        console.log(reviewId, reviewState)
        try {
            const res = await apiInstance.get(`${this.uri}?${reviewState}=${reviewId}&limit=${limit}&page=${page}`)
            console.log(res)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async getReviewById (reviewId) {
        try {
            const res = await apiInstance.get(`${this.uri}/${reviewId}`)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async updateReview (reviewId, formData) {
        try {
            const res = await apiInstance.patch(`${this.uri}/${reviewId}`, formData)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }

    async deleteReview (reviewId) {
        try {
            const res = await apiInstance.delete(`${this.uri}/${reviewId}`)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
}

const reviewService = new reviewServices("/api/v1/review")

export default reviewService