import React from 'react'
import Navigation from '../../components/layouts/Navigation'

const AdminPage = () => {

    const navChilds = [
        {name : "Dashboard", link : "/admin"},
        {name : "Destination", link : "/admin/destination"},
        {name : "Requests", link : "/admin/request"}
    ]
  return (
    <div className="flex h-screen bg-gray-100">
        <div className="bg-white w-64 border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <nav>
            <Navigation 
                children={navChilds}
                className={` mt-6`}
                navClassName={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200`} />
        </nav>
        </div>
    </div>
  )
}

export default AdminPage