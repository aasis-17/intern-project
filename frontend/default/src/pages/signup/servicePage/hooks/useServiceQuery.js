import { useQuery} from "@tanstack/react-query"
import { useAuth } from "../../../../store/authContext"
import { useMemo } from "react"
import serviceOwnerService from "../../../../services/serviceOwnerServices"

export const useServiceQuery = () => {

	const getApprovalMessage = (status) => {
	  switch (status){
		case "rejected":
		  return "Your page has been rejected!!"
		case "pending" : 
		  return "Your page is under review!!"
		default :
		  return ""
	
	  }
	}

	const {state} = useAuth()
	const userDetail = state?.userData

	const {data : serviceDetails, isLoading, isError} = useQuery({
		queryKey : ["serviceDetails", userDetail?._id],
		queryFn :() => serviceOwnerService.getServiceProfileByUserId(userDetail?._id),
		enabled : !!userDetail?._id 
		})
	console.log(serviceDetails?.status)
	  // Memoized derived values for cleaner JSX
	  const isServiceOwner = userDetail?.role === "serviceOwner";
	  const approvalStatus = serviceDetails?.status??null
	  const approvalMessage = useMemo(() => getApprovalMessage(approvalStatus), [approvalStatus]);
	  const isStatusPending = approvalStatus === "pending";

  return {
	isServiceOwner,
	approvalMessage,
	approvalStatus,
	isStatusPending,
	isLoading,
	isError,
	serviceDetails
  }
}
