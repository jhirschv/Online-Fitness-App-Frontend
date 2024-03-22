import React from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from '../components/shared/Sidebar'
import Topbar from '../components/shared/Topbar'
import Bottombar from '../components/shared/Bottombar'
import { useTheme } from '@/components/theme-provider';

const RootLayout = () => {
  const { theme } = useTheme();
  const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';
  
  return (
    <div  className={`flex ${backgroundColorClass} flex-col justify-between pb-24 pt-16 md:pb-0 h-screen`}>
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <Outlet />
      </div>
      <Bottombar />
    </div>
  )
}

export default RootLayout