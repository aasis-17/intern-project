import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Layout from './components/Layout.jsx';
import Container from './components/Container.jsx';
import SignupPage from './pages/Signup.jsx';
import Header from './components/layouts/Header.jsx'
import User from './pages/signup/User.jsx';
import Login from './pages/Login.jsx';
import Destination from './pages/Destination.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DestinationDetailPage from './pages/DestinationDetail.jsx';
import { useContext, useEffect } from 'react';
import { AuthContext } from './store/authContext.jsx';
import RoutePlan from './components/layouts/destination/RoutePlan.jsx';
import RouteIndex from './components/layouts/destination/RouteIndex.jsx';
import RouteGallery from './components/layouts/destination/Routegallery.jsx';
import ReviewComponent from './components/Review.jsx';
import userService from './services/userService.js';
import AdminPage from './pages/adminPage.jsx';
import PageProtector from './components/AuthLayout.jsx';


function App() {
  const queryClient = new QueryClient()
  const {state, dispatch} = useContext(AuthContext)

  const getCurrentUser = async() =>{
    try {
      const res = await userService.getCurrentUser()
      dispatch({type : "login", payload : res})
    } catch (error) {
      if(error.response.data.status === 400) dispatch({type : "logout"})
        else console.log(error)
    }
  }

  useEffect(() => {
    getCurrentUser()
  },[])
 
  
  return (
    <QueryClientProvider client={queryClient}>
    <Container>
      <Routes>
         {/* Pages with Header and footer*/}
        <Route path="/" element={<Layout children={<Header isVisible={state.isVisible} />}/>}>
          <Route index element={<Home />} />
          <Route path="/destination" element={<Destination />} />

          {/* Destination detailed page */}
           <Route path='/destination/:destinationId' element={<DestinationDetailPage />} >
            <Route index element={<RouteIndex />} />
            <Route path='route' element={<PageProtector><RoutePlan /></PageProtector>} />
            <Route path='gallery' element={<RouteGallery />} />
            <Route path='review' element={<ReviewComponent />} />
           </Route>
          {/* <Route path="about" element={<About />} /> */}
        </Route>

        {/* Pages without Header and footer */}
         <Route path="/signup" element={<SignupPage /> } >
         <Route index element={<User />} />
          <Route  path='login' element={<Login />} />
          </Route>
          {/* admin panel */}
        <Route path='/admin' element={<AdminPage />}/>

    
      </Routes>
    </Container>
    </QueryClientProvider>


  )
}

export default App
