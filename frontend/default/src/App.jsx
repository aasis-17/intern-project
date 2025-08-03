import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Layout from './components/Layout.jsx';
import Container from './components/Container.jsx';
import SignupPage from './pages/Signup.jsx';
import Header from './components/layouts/Header.jsx'
import User from './pages/signup/User.jsx';
import Login from './pages/Login.jsx';
import Destination from './pages/Destination.jsx';
import ServiceProfile from './pages/serviceProfile/serviceProfile.jsx';
import DestinationDetailPage from './pages/DestinationDetail.jsx';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './store/authContext.jsx';
import RoutePlan from './components/layouts/destination/RoutePlan.jsx';
import RouteIndex from './components/layouts/destination/RouteIndex.jsx';
import userService from './services/userService.js';
import PageProtector from './components/AuthLayout.jsx';
import RouteUpload from './components/layouts/admin/RouteUpload.jsx';
import DestinationUpload from './components/layouts/admin/DestinationUpload.jsx';
import AdminPage from './pages/admin/AdminPage.jsx';
import Dashboard from "./pages/admin/Dashboard.jsx"
import AdminDestinations from './pages/admin/AdminDestinations.jsx';
import { DestinationProvider } from './store/destinationContext.jsx';
import PhotoUpload from './components/layouts/admin/PhotoUpload.jsx';
import UserProfile from './pages/UserProfile.jsx';
import ServiceOwner from './pages/signup/Service.jsx';
import Settings from './pages/Settings.jsx';
import Editlayout from './components/layouts/admin/Editlayout.jsx';
import Requests from './pages/admin/Requests.jsx';
import RequestDetail from './components/layouts/admin/RequestDetail.jsx';
import Error from './pages/Error.jsx';
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import authService from './services/authServices.js';
import AdminServices from './pages/admin/AdminServices.jsx';
import Service from "./pages/signup/Service.jsx"
import ServiceDetails from './pages/admin/ServiceDetails.jsx';
import Services from './pages/services/Services.jsx';

function App() {

  const [isLoading, setIsLoading] = useState(true)
  const {dispatch} = useContext(AuthContext)
  const navigate = useNavigate()

  const getCurrentUser = async() =>{
    try {
      const res = await userService.getCurrentUser()
      const refresh = await authService.refreshAccessToken()
      dispatch({type : "login", payload : res})
      
    } catch (error) {
       console.log(error)
       try {
        await authService.logout()
        dispatch({type : "logout"})
        navigate("/")
        
       } catch (error) {
       
       }
       
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCurrentUser()
  },[])
 
  if(isLoading) return <>Loading...</>
  return (
    // <QueryClientProvider client={queryClient}>
    <Container>
      <Routes>
         {/* Pages with Header and footer*/}
        <Route path="/" element={<Layout children={<Header />}/>}>
          <Route index element={<Home />} />
          <Route path="/destination" element={<Destination />} />
          <Route path="/:id" element={<PageProtector children={<UserProfile />}/>} />
          <Route path='settings' element={<Settings />} />
          <Route path='profile/:id' element={<PageProtector children={<ServiceProfile />}/>} />
          <Route path='services' element={<Services />} />

          {/* Destination detailed page */}
           <Route path='/destination/:id' element={<PageProtector authentication={false} children={<DestinationDetailPage />} />} >
            <Route index element={<RouteIndex />} />
            <Route path='route' element={<PageProtector children={<RoutePlan />}/>} />
           </Route>
          {/* <Route path="about" element={<About />} /> */}
        </Route>

        {/* Pages without Header and footer */}
        <Route path='/error' element={<Error />} />
         <Route path="/signup" element={<PageProtector authentication={false} children={<SignupPage />}/> } >
         <Route index element={<PageProtector authentication={false} children={<User />} />}  />
         <Route path='service' element={<ServiceOwner />} />
         <Route  path='login' element={<Login />} />
          </Route>

          {/* admin panel */}
            <Route path='/admin' element={<PageProtector><Layout children={<AdminPage />} className={"flex"} /></PageProtector>}>
            <Route index element={<Dashboard />} />

            <Route path='destination' element={<AdminDestinations />}/>

            <Route path='upload' element={<DestinationUpload />}/>
            
            <Route path='upload/:destinationId' element={<Editlayout />}>
            <Route index element={<DestinationUpload />} />
            <Route path='route' element={<RouteUpload />} />
            <Route path="photoUpload" element={<PhotoUpload />} />
            </Route>

            <Route path='services' element={<AdminServices />} />
            <Route path="uploadService" element={<Service option="admin" />} />
            <Route path="uploadService/:serviceId" element={<ServiceDetails  />} />

            <Route path='request' element={<Requests />} />
            <Route path='request/:id' element={<RequestDetail />} />

            </Route>
    
      </Routes>
    </Container>


  )
}

export default App
