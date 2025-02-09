// src/components/Dashboard.jsx
import React, { useContext } from 'react';
import Button from "../../components/Button"
import { AuthContext } from '../../store/authContext';
import { useMutation } from '@tanstack/react-query';
import authService from '../../services/authServices';
import { useNavigate } from 'react-router';

const Dashboard = () => {

  const {state, dispatch} = useContext(AuthContext)

  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn : () => { 
      authService.logout()
    },
    onSuccess : () => {
      dispatch({type : "logout"})
      navigate("/")
    },
    onError : () => {

    }
  })
  

  return (
    <div className="flex h-screen bg-gray-100 flex-1">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navigation Bar */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-lg font-semibold">Welcome, {state.userData?.fullname}</h2>
            <div className="flex items-center space-x-4">

            <Button onClick={logoutMutation.mutateAsync} children="Logout" />
                    
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-gray-700 text-3xl font-medium">Dashboard Overview</h3>
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="text-lg font-semibold">Total Revenue</h4>
                  <p className="text-gray-600">$12,345</p>
                </div>
                {/* Card 2 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="text-lg font-semibold">Users</h4>
                  <p className="text-gray-600">1,234</p>
                </div>
                {/* Card 3 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="text-lg font-semibold">Conversion Rate</h4>
                  <p className="text-gray-600">12.34%</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;