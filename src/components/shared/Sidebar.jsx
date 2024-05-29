import React from 'react'
import { sidebarLinks } from '../../constants'
import { NavLink } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faFolder } from '@fortawesome/free-regular-svg-icons';
import { faDumbbell, faPersonRunning, faChartLine, faWandMagicSparkles, faComments, faUserGroup, faGear } from '@fortawesome/free-solid-svg-icons';


const SideBar = ({chatSessions, userInfo}) => {

  const hasUnreadMessages = chatSessions.some(session => 
    session.last_message && !session.last_message.read && session.last_message.sender == "other_user"
  );

  return (
    <nav className="hidden bg-background xl:flex h-full w-1/6 pt-6 pl-4">
      <div className="w-5/6">
        <ul className="flex flex-col gap-4">

          <NavLink className={({ isActive }) =>
                `${isActive ? 'text-primary' : 'text-current'}`
              } to='/account'>
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-300 ease-in-out">
              <Avatar className="mr-3">
                <AvatarImage src={userInfo && userInfo.profile_picture && userInfo.profile_picture || "https://github.com/shadcn.png" } />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className='md:hidden lg:block'>Account</p>
            </li>
          </NavLink>

          <NavLink className={() => `${
                location.pathname === '/' || location.pathname === '/workoutSession' ? 'text-primary' : 'text-current'
                }`} to="/">
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-150 ease-in-out">
              <FontAwesomeIcon  size='lg' className="mr-3" icon={faDumbbell} />
              Train!
            </li>
          </NavLink>

          <NavLink className={({ isActive }) =>
                `${isActive ? 'text-primary' : 'text-current'}`
              } to='/Progress'> 
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-150 ease-in-out">
              <FontAwesomeIcon className="mr-3" icon={faChartLine} />
              Progress
            </li>
          </NavLink>

          <NavLink className={() => `relative ${
                location.pathname === '/chat' || location.pathname.startsWith('/ClientProgress/') ? 'text-primary' : 'text-current'
                }`} to='/chat'> 
            {hasUnreadMessages && (
                <div className="absolute top-5 left-8 transform -translate-y-1/2 h-2 w-2 rounded-full bg-primary">
                {/* This div represents the blue ball */}
                </div>
            )}
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-150 ease-in-out">
              <FontAwesomeIcon className="mr-3" icon={faComments} />
              Messages
            </li>
          </NavLink>
          
        </ul>
      </div>
    </nav>
    
  )
}

export default SideBar