import axios from "axios";

class destinationServices{

    async getDestination(search="",region="", sortType, page=1){
        // console.log(filter)
        try {
            const res = await axios.get(`/api/v1/destination?search=${search}&region=${region}&page=${page}&sortType=${sortType}`)
            console.log(res)
            return res.data.data
        } catch (error) {
            console.log(error)
            throw error.response.data
            
        }
    }

    async getDestinationById (_id) {
        try {
            const res = await axios.get(`/api/v1/destination/${_id}`)
            return res.data.data
        } catch (error) {
            throw error.response.data
        }
    }
}

const destinationService = new destinationServices()
export default destinationService