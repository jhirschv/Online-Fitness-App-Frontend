import React from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from '../components/shared/Sidebar'
import Topbar from '../components/shared/Topbar'

const RootLayout = () => {
  return (
    <div className='rootLayout'>
      <Topbar />
      <div className='flex'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default RootLayout