import React from 'react'
import { Outlet } from 'react-router-dom'

const DestinationLayout = () => {
  console.log("admin123")
  return (
    <>
        <Outlet />
    </>
  )
}

export default DestinationLayout