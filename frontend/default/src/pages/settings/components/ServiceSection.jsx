import { useState, Suspense, useTransition, useEffect } from "react"
import { useServiceQuery } from "../../signup/servicePage/hooks/useServiceQuery"
import ServicePage from "../../signup/servicePage/ServicePage"
import Button from "../../../components/Button"
import Loader from "../../../components/loader/Loader"


const ServiceSection = () => {

  const [view, setView] = useState(false)
	// useTransition for non-blocking UI updates when toggling large sections
	const [isPending, startTransition] = useTransition();
	
  const toggleView = () => {
    // useTransition makes toggling non-blocking for the UI thread
    startTransition(() => {
      setView((v) => !v);
    });
  }

      // useEffect(() => {
    //     // Connect to socket
    //     socketService.connect(token);
        
    //     // Listen for approval
    //     socketService.on('service-approved', (data) => {
    //         console.log('🎉 Service approved:', data);
    //         setStatus({
    //             type: 'approved',
    //             message: data.message
    //         });
    //         alert('Congratulations! Your service has been approved!');
    //     });
        
    //     return () => {
    //         socketService.off('service-approved');
    //         socketService.disconnect();
    //     };
    // }, []);

	const {
		serviceDetails,
		isLoading,
		isError,
		isServiceOwner,
		isStatusPending,
		approvalMessage,
		approvalStatus
	} = useServiceQuery()

  console.log(!serviceDetails)

	if(isLoading) return <Loader />
	if(isError) return <Error />

  return (
    <>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Pages</h2>

          {isServiceOwner ?

          <div className='bg-white p-6 rounded-lg shadow-md'>

              <ServicePage  option="edit" />
  
          </div>

        :
        (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className='text-3xl font-semibold'>Create Page</h3>
            <div className='mt-5'>
              <h3>If you are owner of any hotels, restaurent, that lies near any destination.<br>
              </br>You can create service page where you can provide your service details and help trekkers to engage. </h3>

              <div className='mt-5'>


                {!serviceDetails ?
                (
                  
                    <ServicePage />
								)
                  :
                  (
                  <div className='bg-white rounded-md p-3 w-full shadow-lg'>
                    <div className='flex justify-between items-center'>
                    <span>{approvalMessage}</span>
                     <span className='text-sm'>Status : <span className={`${approvalStatus === "approved" ? "text-green-500" : "text-red-500"} text-yellow-500`}>{approvalStatus.toUpperCase()}</span> </span>
   
                        <Button size="sm" variant="outline" onClick={toggleView} >
                          {isStatusPending ? ( view ? "Hide" : "View") : "View"}
                        </Button>
                    </div>

                  {isStatusPending && view &&(

                    <div className='mt-5 bg-white'>
                   
                      <ServicePage option="edit" serviceDetails={serviceDetails} />
                    
                    </div>
                  ) }
                  </div>
                )        
                }


                  
              </div>
            </div>
          </div> 
        )}
    </>
  )
}

export default ServiceSection