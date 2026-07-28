import { useAuth } from "../store/authContext"

export const useAuthAction = () => {

    const {state, dispatch} = useAuth()

    const runIfAuthenticated =(action) =>{
    if (!state.isAuthenticated) {
        dispatch({type : "setModal", payload : true})
        return false
  }
    action()
    return false
}
  return {runIfAuthenticated, userData : state?.userData}
}
