import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Layout from './components/Layout.jsx';
import Container from './components/Container.jsx';
import SignupPage from './pages/Signup.jsx';
import Header from './components/layouts/Header.jsx'
import User from './pages/signup/User.jsx';
import Login from './pages/Login.jsx';
import Destination from './pages/Destination.jsx';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import DestinationDetailPage from './pages/DestinationDetail.jsx';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './store/authContext.jsx';
import RoutePlan from './components/layouts/destination/RoutePlan.jsx';
import RouteIndex from './components/layouts/destination/RouteIndex.jsx';
import RouteGallery from './components/layouts/destination/Routegallery.jsx';
import ReviewComponent from './components/Review.jsx';
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


function App() {
  const queryClient = new QueryClient()
  const [isLoading, setIsLoading] = useState(true)
  const {state, dispatch} = useContext(AuthContext)

  const getCurrentUser = async() =>{

    try {
      const res = await userService.getCurrentUser()
      dispatch({type : "login", payload : res})
    } catch (error) {
      if(error.status >= 400) dispatch({type : "logout"})
        else console.log(error)
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCurrentUser()
  },[])
 
  if(isLoading) return <>Loading...</>
  return (
    <QueryClientProvider client={queryClient}>
    <Container>
      <Routes>
         {/* Pages with Header and footer*/}
        <Route path="/" element={<Layout children={<Header />}/>}>
          <Route index element={<Home />} />
          <Route path="/destination" element={<Destination />} />
          <Route path="/userProfile" element={<PageProtector children={<UserProfile />}/>} />
          <Route path='settings' element={<Settings />} />

          {/* Destination detailed page */}
           <Route path='/destination/:destinationId' element={<DestinationDetailPage />} >
            <Route index element={<RouteIndex />} />
            <Route path='route' element={<PageProtector children={<RoutePlan />}/>} />
            <Route path='gallery' element={<PageProtector children={<RouteGallery />}/>} />
            <Route path='review' element={<PageProtector children={<ReviewComponent />} />} />
           </Route>
          {/* <Route path="about" element={<About />} /> */}
        </Route>

        {/* Pages without Header and footer */}
         <Route path="/signup" element={<PageProtector authentication={false} children={<SignupPage />}/> } >
         <Route index element={<User />} />
         <Route path='service' element={<ServiceOwner />} />
          <Route  path='login' element={<PageProtector authentication={false} children={<Login />}/>} />
          </Route>

          {/* admin panel */}
            <Route path='/admin' element={<Layout children={<AdminPage />} className={"flex"} />}>
            <Route index element={<Dashboard />} />
            <Route path='destination' element={<AdminDestinations />}/>
            <Route path='upload' element={<DestinationUpload />} />
            <Route path='route' element={<RouteUpload />} />
            <Route path="photoUpload" element={<PhotoUpload />} />
            </Route>
    
      </Routes>
    </Container>
    </QueryClientProvider>


  )
}

export default App
