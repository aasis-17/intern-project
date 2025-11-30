import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
import { useContext } from 'react';
import { AuthContext } from './store/authContext.jsx';
import RoutePlan from './components/layouts/destination/RoutePlan.jsx';
import RouteIndex from './components/layouts/destination/RouteIndex.jsx';
import userService from './services/userService.js';
import PageProtector from './components/AuthLayout.jsx';
import UserProfile from './pages/UserProfile.jsx';
import ServiceOwner from './pages/signup/Service.jsx';
import Settings from './pages/Settings.jsx';
import Error from './pages/Error.jsx';
import Services from './pages/services/Services.jsx';
import { useQuery } from '@tanstack/react-query';
import Loader from './components/loader/Loader.jsx';

function App() {

  const {dispatch} = useContext(AuthContext)
  const navigate = useNavigate()
  const [currentUserState, setCurrentUserState] = useState({ isError : false})

  const currentUser = useQuery({
    queryKey : ["current user"],
    queryFn : 
    async() => {
      try {
        const data = await userService.getCurrentUser()
        console.log(data, "datata")
        dispatch({type : "login", payload : data})
        return data
      } catch (error) {
        console.log(error.response.status)
        error.response.status === 401 ?
         dispatch({type : "logout"})
         : setCurrentUserState({...currentUserState, isError : true})
        navigate("/")
        return error
      }
      
    }
  })

  if(currentUserState.isError) return <Error /> 
 
  if(currentUser.isLoading) return <Loader size='xl' color="dark" />
  return (

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

    
      </Routes>
    </Container>


  )
}

export default App
