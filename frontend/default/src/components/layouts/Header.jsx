import React, { useContext } from 'react'
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../../store/authContext.jsx';
import authService from '../../services/authServices.js';
import { useThrottel } from '../../utiles/throttel.js';
import Navigation from './Navigation.jsx';
import Button from '../Button.jsx';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faGear, faCircleUser} from "@fortawesome/free-solid-svg-icons"

const Header = ({}) => {

  const [lastScroll, setLastScroll] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const {dispatch, state} = useContext(AuthContext)
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [setting, setSetting] = useState(false)
  const navigate = useNavigate()
  const {pathname} = useLocation()

  const navChild = [
    {name : "Home", link : "/"},
    {name : "Destination", link : "/destination"},
    {name : "Services", link : "/services"},
    {name : "Contact", link : "/contact"}
  ]

  //scrolling header 
  useEffect(()=>{
    const handleHeaderScroll = useThrottel(() => {
      const currentScroll = window.scrollY
      if(currentScroll > lastScroll) setIsVisible(true)

      else setIsVisible(false)
         setLastScroll(currentScroll)
    },400)
    window.addEventListener("scroll", handleHeaderScroll)

    return ()=> window.removeEventListener("scroll",handleHeaderScroll)
  },[lastScroll])


//handle logout 
  const handleLogout = async() => {
     try {
      await authService.logout()
      dispatch({type : "logout"})
      navigate("/",{replace : true})
     } catch (error) {   
     }
  }

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  return (
    <>
    <header className={`${isVisible ? "translate-y-[-100%]" : "translate-y-0"} transition duration-500  font-garamond sticky top-0 z-50`}>
      <div className=" mx-auto flex items-center justify-between px-8 py-4">


        {/* Hamburger Menu (Mobile) */}
        <button
          className="text-3xl text-gray-800 lg:hidden"
          onClick={toggleNav}
        >
          ☰
        </button>       
                {/* Logo */}
                <div className={`${pathname === "/" ? "text-white" : "text-black" } text-2xl font-bold  font-garamond`}>
          <Link to="/">TREKERS HUB</Link>
        </div>

        {/* Navigation */}
        <nav
          className={`${
            isNavOpen ? "block" : "hidden"
          }  absolute left-0 top-full w-full shadow-lg lg:relative lg:top-0 lg:block lg:w-auto lg:shadow-none`}
        >
          <Navigation children={navChild} className="flex flex-col items-center space-y-4 p-6 lg:flex-row lg:space-y-0 lg:space-x-8 lg:p-0" navClassName={`text-xl font-medium ${pathname === "/" ? "text-white" : "text-black" }`} />
          
        </nav>


        {/* Buttons */}
        <div className="hidden lg:flex space-x-4">
          {!state.isAuthenticated ? 
          (<>
          <Button 
            children="Login" 
            hidden={state.isAuthenticated} 
            onClick={() => navigate("/signup/login")} 
            className={`px-4 py-2 rounded  font-medium text-lg ${pathname === "/" ? "border-white text-white hover:bg-white hover:text-black": "border-black text-black hover:bg-orange-600 hover:text-white"}   transition`} />

          <button
            onClick={() => navigate("signup") } 
            className={`px-4 py-2 rounded ${pathname === "/" ? "bg-white text-black hover:bg-white" : "bg-orange-500 text-white hover:bg-white hover:text-black hover:border hover:border-black"}   transition`} 
          >Signup</button>
          </>) : (
            <div className='flex gap-6 items-center' >
              <FontAwesomeIcon onClick={() => setSetting(prev => !prev)} className={`relative cursor-pointer ${pathname === "/" ? "text-white" : "text-black"} h-5`} icon={faGear} />
              <div className='' onClick={() => navigate(`/${state.userData._id}`)}>
                {state.userData.userAvatar ? 
                <img alt='' className='w-8 h-8 rounded-full object-cover cursor-pointer' src={state.userData.userAvatar}/>
                :
                <FontAwesomeIcon  className={`cursor-pointer ${pathname === "/" ? "text-white" : "text-black"} h-6`} icon={faCircleUser} />
              }   
              </div>  
            </div>

          )}


  <div className={`${!setting && "hidden"} animate-fade-down absolute right-5 z-10 mt-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden`} >
    <div className="py-1 text-lg text-gray-900" >
      <span className="hover:bg-gray-100 block px-4 py-2 cursor-pointer" onClick ={() => {setSetting(false),navigate("/settings")}}  >Setting</span>
      <span className="hover:bg-gray-100 block px-4 py-2 cursor-pointer" onClick ={() => {setSetting(false),handleLogout()}}>Logout</span>
    </div>

  </div>
{/* </div> */}

        </div>
      </div>
    </header>  
</>
  );
};

export default Header;
