import React from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from '../components/Sidebar/Sidebar'
import Topbar from '../components/Topbar/Topbar'
import "./RootLayout.css";

const RootLayout = () => {
  return (
    <div className='rootLayout'>
      <Topbar />
      <div className='main'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default RootLayout