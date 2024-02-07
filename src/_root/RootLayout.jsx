import React from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from '../components/shared/Sidebar'
import Topbar from '../components/shared/Topbar'

const RootLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default RootLayout