import { Routes, Route, useNavigate } from 'react-router-dom';
import { lazy, memo, Suspense, useState, useContext } from 'react';
import { AuthContext } from './store/authContext.jsx';
import { useQuery } from '@tanstack/react-query';
import Container from  './components/Container.jsx';
import userService from './services/userService.js';
import RouteIndex from './components/layouts/destination/RouteIndex.jsx';
import RoutePlan from './components/layouts/destination/RoutePlan.jsx';
import Skeleton from './components/skeleton/skeleton.jsx';

const Error = lazy(() => import ('./pages/Error.jsx'));

const Layout = lazy(() => import ('./components/Layout.jsx'));
const PageProtector = lazy(() => import ('./components/AuthLayout.jsx'));

const Home = lazy(() => import ('./pages/home/Home.jsx'));
const SignupPage = lazy(() => import ('./pages/Signup.jsx'));
const Header = lazy(() => import ('./components/layouts/Header.jsx')) 
const User = lazy(() => import ('./pages/signup/User.jsx'));
const Login = lazy(() => import ('./pages/Login.jsx'));
const Destination = lazy(() => import ('./pages/Destination.jsx'));
const ServiceProfile = lazy(() => import ('./pages/serviceProfile/serviceProfile.jsx'));
const DestinationDetailPage = lazy(() => import ('./pages/DestinationDetail.jsx'));
const UserProfile = lazy(() => import ('./pages/UserProfile.jsx'));
const ServiceOwner = lazy(() => import ('./pages/signup/Service.jsx'));
const Settings = lazy(() => import ('./pages/Settings.jsx'));
const Services = lazy(() => import ('./pages/services/Services.jsx'));

function App() {

  const {dispatch} = useContext(AuthContext)
  const navigate = useNavigate()
  const [currentUserState, setCurrentUserState] = useState(false)

  const MemoHeader = memo(Header)

  const {isLoading} = useQuery({
    queryKey : ["current user"],
    queryFn : 
    async() => {
      try {
        const data = await userService.getCurrentUser()
        console.log(data, "datata")
        dispatch({type : "login", payload : data})
        return data
      } catch (error) {
        console.log(error)
        if (error.data.message === "jwt expired" || error.status === 401) {
           dispatch({type : "logout"})
        }else setCurrentUserState(true)
         
        navigate("/")
        console.log("eeee")
                
        return error
        }
    }
  })



  if(currentUserState) return <Error /> 
 
  if(isLoading) return <Skeleton />
  return (

    <Container>
     <Suspense  fallback={<Skeleton/>}>
      <Routes>
         {/* Pages with Header and footer*/}
        <Route path="/" element={<Layout children={<MemoHeader />}/>}>
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
        </Suspense>
    </Container>
  


  )
}

export default App
