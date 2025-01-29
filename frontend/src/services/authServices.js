import axios from "axios"
class authServices {

    async signup (data) {
        try {
            console.log(data)
            const res = await axios.post("/api/v1/auth/signup", data)
            console.log(res)
            await this.login(data.email, data.password)
            return res
        } catch (error) {
            throw error.response.data
        }
    }
    async login(password, email){
        try {
            const res = await axios.post("/api/v1/auth/", {password, email})
            return res.data.data.userExists
        } catch (error) {
            throw error.response.data
        }
    }
    async logout(){
        try {
            const res = await axios.get("/api/v1/auth")
            return res.data.data.userExists
        } catch (error) {
            throw error.response.data
        }
    }
    async getCurrentUser (){
        try {
            const res = await  axios.get("/api/v1/")
            return res.data.data
        } catch (error) {
            throw error
        }
    }
}

const authService = new authServices()
export default authService