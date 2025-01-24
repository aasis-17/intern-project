import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navigate = useNavigate()

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  return (
    <header className="border-b bg-red-100 shadow-md font-garamond">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">


        {/* Hamburger Menu (Mobile) */}
        <button
          className="text-3xl text-gray-800 lg:hidden"
          onClick={toggleNav}
        >
          ☰
        </button>

        {/* Navigation */}
        <nav
          className={`${
            isNavOpen ? "block" : "hidden"
          } absolute left-0 top-full w-full bg-white shadow-lg lg:relative lg:top-0 lg:block lg:w-auto lg:shadow-none`}
        >
          <ul className="flex flex-col items-center space-y-4 p-6 lg:flex-row lg:space-y-0 lg:space-x-8 lg:p-0">
            <li>
              <Link
                to="#features"
                className="text-lg font-medium text-gray-700 hover:text-blue-600"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="#pricing"
                className="text-lg font-medium text-gray-700 hover:text-blue-600"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="#about"
                className="text-lg font-medium text-gray-700 hover:text-blue-600"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="#contact"
                className="text-lg font-medium text-gray-700 hover:text-blue-600"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

                {/* Logo */}
        <div className="text-2xl font-bold text-gray-800 font-garamond">
          <Link to="/">TREKERS HUB</Link>
        </div>

        {/* Buttons */}
        <div className="hidden lg:flex space-x-4">
          <button className="px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition">
            Login
          </button>
          <button onClick={() => navigate("signup/user") } className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
