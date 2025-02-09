import React, { useContext, useState } from 'react';
import User from "../pages/signup/User"
import Button from '../components/Button';
import ServiceOwner from './signup/Service';
import { useLocation } from 'react-router';
import FormField from '../components/form/FormField';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import authService from '../services/authServices';
import ChangePassword from '../components/layouts/settings/ChangePassword';
import serviceOwnerService from '../services/serviceOwnerServices';
import { AuthContext } from '../store/authContext';

const Settings = () => {

  const {state} = useContext(AuthContext)
  console.log(state)
  const {data, isLoading, isError, error} = useQuery({
    queryKey : ["serviceOwner"],
    queryFn :() => {
      if(state.userData.role !== "user") return serviceOwnerService.getServiceProfileByUserId(state.userData._id)
      return null
    }

  })

  if(isLoading) <div>Loading..</div>

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navigation Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Settings</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <a href="#account"  className="flex items-center text-gray-700 hover:text-blue-600">
                <span className="mr-2">👤</span>
                Account
              </a>
            </li>
            <li>
              <a href="#privacy" className="flex items-center text-gray-700 hover:text-blue-600">
                <span className="mr-2">🔒</span>
                Change Password
              </a>
            </li>
            <li>
              <a href="#pages" className="flex items-center text-gray-700 hover:text-blue-600">
                <span className="mr-2">🔔</span>
                Pages
              </a>
            </li>
            <li>
              <a href="#billing" className="flex items-center text-gray-700 hover:text-blue-600">
                <span className="mr-2">💳</span>
                Billing
              </a>
            </li>
            <li>
              <a href="#appearance" className="flex items-center text-gray-700 hover:text-blue-600">
                <span className="mr-2">🎨</span>
                Appearance
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-10 overflow-y-auto ">
        {/* Account Information Section */}
        <section id="account" className="mb-10">
          <div className='flex justify-between items-center'>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Account Information</h2>
          </div>

          <User option="setting"/>

        {data && (
                    <div className='mt-5 bg-white p-6 rounded-lg shadow-md'>
                    {isError && <div>{error.message}</div>}
                      <ServiceOwner option="edit" serviceDetails = {data}/>
                    </div>
        ) }


        </section>

        {/*change password Section */}
        <section id="privacy" className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Change Password</h2>
            <ChangePassword />
        </section>

        {/* pages Section */}
        <section id="pages" className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Pages</h2>

          
           <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className='text-3xl font-semibold'>Create Page</h3>
            <div className='mt-5'>
              <h3>If you are owner of any hotels, restaurent, that lies near any destination.<br>
              </br>You can create service page where you can provide your service details and help trekkers to engage. </h3>

              <div className='mt-5'>
                  <ServiceOwner />
              </div>
            </div>
          </div> 
        </section>

        {/* Billing Section */}
        <section id="billing" className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Billing</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700">Your current plan: <span className="font-bold">Pro</span></p>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 mt-4"
            >
              Upgrade Plan
            </button>
          </div>
        </section>

        {/* Appearance Section */}
        <section id="appearance">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Appearance</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Theme</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;