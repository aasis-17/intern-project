import { useState } from "react"
import userService from "../services/userService"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { useAuth } from "../store/authContext"

export const useCurrentUser = () => {

	const [isError, setIsError] = useState(false)

	const {state, dispatch} = useAuth()

	const navigate = useNavigate()

	const unAuthorized = (error) =>{
		error.status === 401 && error.data.message === "Unauthorized request!!" ? true : false
	}
	

	const getCurrentUser = async() => {
		try {
			const data = await userService.getCurrentUser()
			console.log(data)
			dispatch({type : "login", payload : data})
			return data
		} catch (error) {
			if (error.data.message === "jwt expired" || unAuthorized(error)) {
				console.log(unAuthorized(error))
				dispatch({type : "logout"})
				navigate("/")
			}
			else if(error.status >= 500) setIsError(true)

				return error
		}
	}
	const {isLoading} = useQuery({
    queryKey : ["current user"],
    queryFn : getCurrentUser,
	})

  return {
		isLoading,
		isError, 
		state, 
		dispatch
	}
}
