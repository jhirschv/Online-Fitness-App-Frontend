import React from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from '../components/shared/Sidebar'
import Topbar from '../components/shared/Topbar'
import Bottombar from '../components/shared/Bottombar'
import { useTheme } from '@/components/theme-provider';

const RootLayout = ({userInfo, chatSessions}) => {
  const { theme } = useTheme();
  const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';
  
  return (
    <div  className={`flex flex-col justify-between pb-20 pt-16 xl:pb-0 h-screen`}>
      <Topbar userInfo={userInfo}/>
      <div className="overflow-hidden flex flex-1">
        <Sidebar chatSessions={chatSessions} userInfo={userInfo}/>
        <Outlet />
      </div>
      <Bottombar chatSessions={chatSessions}/>
    </div>
  )
}

export default RootLayout