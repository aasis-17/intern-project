import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Layout from './components/Layout.jsx';
import Container from './components/Container.jsx';
import SignupPage from './pages/Signup.jsx';
import Header from './components/layouts/Header.jsx'
import User from './pages/signup/User.jsx';
import Guide from './pages/signup/Guide.jsx';
import Service from './pages/signup/Service.jsx';


function App() {

  return (
    <Container>
      <Routes>
         {/* Pages with Header and footer*/}
        <Route path="/" element={<Layout childern={<Header />}/>}>
          <Route index element={<Home />} />
          {/* <Route path="about" element={<About />} /> */}
        </Route>

        {/* Pages without Header and footer */}
         <Route path="/signup" element={<SignupPage /> } >
          <Route  path='user' element={<User />} />
           <Route path='guide' element={<Guide />} />
          <Route path='service' element={<Service />} /> 
        </Route> 
        {/* <Route path="/signup" element={<Layout childern={<SignupPage />} />} /> */}
      </Routes>
    </Container>


  )
}

export default App
