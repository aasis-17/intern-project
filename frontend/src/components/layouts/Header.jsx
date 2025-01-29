import React, { useContext } from 'react'
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../../store/authContext.jsx';
import authService from '../../services/authServices.js';

const Header = ({isVisible}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const {state, dispatch} = useContext(AuthContext)
  const navigate = useNavigate()
  console.log("header",state)
  const location = useLocation()
  const path = location.pathname

  const handleLogout = async() => {
     try {
      await authService.logout()
      dispatch({type : "logout"})
      navigate("/")
     } catch (error) {
      
     }
  }

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  return (
    <header className={`${isVisible ? "translate-y-[-100%]" : "translate-y-0"} transition duration-500  font-garamond sticky top-0 z-50`}>
      <div className="container mx-auto flex items-center justify-between px-6 py-4">


        {/* Hamburger Menu (Mobile) */}
        <button
          className="text-3xl text-gray-800 lg:hidden"
          onClick={toggleNav}
        >
          ☰
        </button>

        
                {/* Logo */}
                <div className={`${path === "/" ? "text-white" : "text-black" } text-2xl font-bold  font-garamond`}>
          <Link to="/">TREKERS HUB</Link>
        </div>

        {/* Navigation */}
        <nav
          className={`${
            isNavOpen ? "block" : "hidden"
          }  absolute left-0 top-full w-full shadow-lg lg:relative lg:top-0 lg:block lg:w-auto lg:shadow-none`}
        >
          <ul className="flex flex-col items-center space-y-4 p-6 lg:flex-row lg:space-y-0 lg:space-x-8 lg:p-0">
            <li>
              <Link
                to="/"
                className={`text-xl font-medium ${path === "/" ? "text-white" : "text-black" }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/destination"
                className={`text-xl font-medium ${path === "/" ? "text-white" : "text-black" } `}
              >
                Destinations
              </Link>
            </li>
            <li>
              <Link
                to="#about"
                className={`text-xl font-medium ${path === "/" ? "text-white" : "text-black" } `}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="#contact"
                className={`text-xl font-medium ${path === "/" ? "text-white" : "text-black" } `}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>


        {/* Buttons */}
        <div className="hidden lg:flex space-x-4">
        {!state.isAuthenticated ? (<>
          <button onClick={() => navigate("/signup/login")} className={`px-4 py-2 rounded border font-medium text-lg ${path === "/" ? "border-white text-white hover:bg-white hover:text-black": "border-black text-black hover:bg-orange-600 hover:text-white"}   transition`}>
            Login
          </button>
          <button onClick={() => navigate("signup") } className={`px-4 py-2 rounded ${path === "/" ? "bg-white text-black hover:bg-white" : "bg-orange-500 text-white hover:bg-white hover:text-black hover:border hover:border-black"}   transition`}>
            Sign Up
          </button>
          </>) :
           
          (<button onClick={handleLogout } className={`px-4 py-2 rounded ${path === "/" ? "bg-white text-black hover:bg-white" : "bg-orange-500 text-white hover:bg-white hover:text-black hover:border hover:border-black"}   transition`}>
                    Log out
          </button>)
                  }
        </div>
      </div>
    </header>
  );
};

export default Header;
