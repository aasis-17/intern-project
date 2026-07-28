import { Routes, Route } from 'react-router-dom';
import { lazy, memo, Suspense } from 'react';
import Container from  './components/Container.jsx';
import RouteIndex from './components/layouts/destination/RouteIndex.jsx';
import RoutePlan from './components/layouts/destination/RoutePlan.jsx';
import Skeleton from './components/skeleton/skeleton.jsx';
import Modal from './components/Modal.jsx';
import Login from './pages/login/Login.jsx';
import { useCurrentUser } from './hooks/useCurrentUser.js';
import { useNetwork } from './store/networkContext.jsx';

const Error = lazy(() => import ('./pages/Error.jsx'));

const Layout = lazy(() => import ('./components/Layout.jsx'));
const PageProtector = lazy(() => import ('./components/AuthLayout.jsx'));

const Home = lazy(() => import ('./pages/home/Home.jsx'));
const SignupPage = lazy(() => import ('./pages/signup/Signup.jsx'));
const Header = lazy(() => import ('./components/layouts/Header.jsx')) 
const User = lazy(() => import ('./pages/signup/UserPage/User.jsx'));
const Destination = lazy(() => import ('./pages/Destination.jsx'));
const ServiceProfile = lazy(() => import ('./pages/serviceProfile/serviceProfile.jsx'));
const DestinationDetailPage = lazy(() => import ('./pages/DestinationDetail.jsx'));
const UserProfile = lazy(() => import ('./pages/UserProfile.jsx'));
const ServicePage = lazy(() => import ('./pages/signup/servicePage/ServicePage.jsx'));
const Settings = lazy(() => import ('./pages/settings/Settings.jsx'));
const Services = lazy(() => import ('./pages/services/Services.jsx'));

function App() {

  const MemoHeader = memo(Header)

  const {isOnline} = useNetwork()
  
  const {isLoading, isError, state, dispatch} = useCurrentUser()

  if(isError) return <Error /> 

  if(!isOnline) return <Error mode="offline"/>
 
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
          <Route path='profile/:id' element={<PageProtector children={<ServiceProfile />} />} />
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
         <Route path='service' element={<ServicePage />} />
         <Route  path='login' element={<Login />} />
          </Route>
      </Routes>
       
</Suspense>

        <Modal 
            onClose={() =>{
            dispatch({type : "setModal", payload : false})
            }}  
            visible={state.isModelVisible}>
            <Login mode='modal' onClose={()=> dispatch({type : "setModal", payload : false})}/>
            
        </Modal>
         
    </Container>
  
  )
}

export default App
