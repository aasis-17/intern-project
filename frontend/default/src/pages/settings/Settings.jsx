import { lazy, Suspense, useState, useTransition, useMemo } from 'react';
import Button from '../../components/Button.jsx';
import Loader from '../../components/loader/Loader.jsx';
import Error from '../Error.jsx';
import Skeleton from '../../components/skeleton/skeleton.jsx';
import { useServiceQuery } from '../signup/servicePage/hooks/useServiceQuery.js';
import ServiceSection from './components/ServiceSection.jsx';

const ChangePassword = lazy(() => import ('./components/ChangePassword.jsx'));
const ServicePage = lazy(() => import ("../signup/servicePage/ServicePage.jsx"));
const User = lazy(() => import ("../signup/UserPage/User.jsx"))


const Settings = () => {


  return (
    <div className="flex h-screen overflow-y-hidden bg-gray-100">
      {/* Navigation Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 ">
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
              <a href="#pages" className="flex items-center text-gray-700 hover:text-blue-600">
                <span className="mr-2">🔔</span>
                Pages
              </a>
            </li>
            <li>
              <a href="#privacy" className="flex items-center text-gray-700 hover:text-blue-600">
                <span className="mr-2">🔒</span>
                Change Password
              </a>
            </li>

          </ul>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-10 overflow-y-auto ">
        {/* Account Information Section */}
        <section id="account" className="mb-10">

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Account Information</h2>
          <Suspense fallback={<Loader />} >
            <User option="edit"/>
          </Suspense>
          
        </section>

        {/* pages Section */}
        <section id="pages" className="mb-10">
          <Suspense fallback={<Loader />} >
            <ServiceSection />
          </Suspense>
          
        </section>

        {/*change password Section */}
        <section id="privacy" className="mb-10">
  
          <Suspense fallback={<Loader />}>
            <ChangePassword />
          </Suspense>
            
        </section>

   
      </div>
    </div>
  );
};

export default Settings;