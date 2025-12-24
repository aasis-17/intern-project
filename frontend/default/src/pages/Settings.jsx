import { lazy, Suspense, useContext, useState, useTransition, useMemo } from 'react';
import Button from '../components/Button';
import { useQuery } from '@tanstack/react-query';
import serviceOwnerService from '../services/serviceOwnerServices';
import { AuthContext } from '../store/authContext';
import Loader from '../components/loader/Loader';
import Error from './Error';
import Skeleton from '../components/skeleton/skeleton.jsx';

const ChangePassword = lazy(() => import ('../components/layouts/settings/ChangePassword'));
const ServiceOwner = lazy(() => import ('./signup/Service'));
const User = lazy(() => import ("../pages/signup/User"))

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

const Settings = () => {

  const [view, setView] = useState(false)
  const {state} = useContext(AuthContext)
  const userId = state?.userData?._id

  // useTransition for non-blocking UI updates when toggling large sections
  const [isPending, startTransition] = useTransition();

  const {data : serviceDetails, isLoading, isError, error} = useQuery({
    queryKey : ["serviceDetails", userId],
    queryFn :() => serviceOwnerService.getServiceProfileByUserId(userId),
    enabled : !!userId 
  })

  
  // Memoized derived values for cleaner JSX
  const isServiceOwner = state?.userData?.role === "serviceOwner";
  const approvalStatus = serviceDetails?.isApproved ?? null;
  const approvalMessage = useMemo(() => getApprovalMessage(approvalStatus), [approvalStatus]);
  const isStatusPending = approvalStatus === "pending";

  const toggleView = () => {
        // useTransition makes toggling non-blocking for the UI thread
    startTransition(() => {
      setView((v) => !v);
    });
  }

  if(isLoading) return <Skeleton />
  if(isError) return <Error />

  return (
    <div className="flex h-screen overflow-y-hidden bg-gray-100">
      {/* Navigation Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 ">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Settings</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <a href="#account"  className="flex items-center text-gray-700 hover:text-blue-600">
                <span className="mr-2">👤</span>
                Account
              </a>
            </li>

            <li>
              <a href="#pages" className="flex items-center text-gray-700 hover:text-blue-600">
                <span className="mr-2">🔔</span>
                Pages
              </a>
            </li>
            <li>
              <a href="#privacy" className="flex items-center text-gray-700 hover:text-blue-600">
                <span className="mr-2">🔒</span>
                Change Password
              </a>
            </li>

          </ul>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-10 overflow-y-auto ">
        {/* Account Information Section */}
        <section id="account" className="mb-10">
          <div className='flex justify-between items-center'>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Account Information</h2>
          </div>

        <Suspense fallback={<Loader />} >
          <User option="edit"/>
        </Suspense>
          
        </section>

        {/* pages Section */}
        <section id="pages" className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Pages</h2>

          {isServiceOwner ?
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <Suspense fallback={<Loader />}>
              <ServiceOwner details={serviceDetails} option="edit" />
            </Suspense>
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
                  <Suspense fallback={<Loader />}>
                    <ServiceOwner />
                  </Suspense>)
                  :
                  (
                  <div className='bg-white rounded-md p-3 w-full shadow-lg '>
                    <div className='flex justify-between items-center'>
                    <span>{approvalMessage}</span>
                     <span className='text-sm'>Status : <span className={`${serviceDetails.isApproved === "approved" ? "text-green-500" : "text-red-500"} text-yellow-500`}>{approvalStatus}</span> </span>
                     {/* <Button
                     children="view"
                     size='sm'
                     onClick={toggleView}
                     variant='outline' /> */}
                          <Button size="sm" variant="outline" onClick={toggleView} disabled={isStatusPending && !view}>
                          {isStatusPending ? ( view ? "Hide" : "View") : "View"}
                        </Button>
                    </div>

                  {isStatusPending && view &&(

                    <div className='mt-5 bg-white'>
                    {isError && <div>{error.message}</div>}
                    <Suspense fallback={<Loader />}>
                      <ServiceOwner details={serviceDetails} option="edit" />
                    </Suspense> 
                    </div>
                  ) }
                  </div>
                )        
                }
                  
              </div>
            </div>
          </div> 
        )}


        </section>

        {/*change password Section */}
        <section id="privacy" className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Change Password</h2>
          <Suspense fallback={<Loader />}>
            <ChangePassword />
          </Suspense>
            
        </section>

   
      </div>
    </div>
  );
};

export default Settings;