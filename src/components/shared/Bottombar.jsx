import React, {useEffect}  from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faFolder } from '@fortawesome/free-regular-svg-icons';
import { faDumbbell, faPersonRunning, faChartLine, faWandMagicSparkles, faComments, faUserGroup, faGear } from '@fortawesome/free-solid-svg-icons';


const Bottombar = ({chatSessions}) => {
    const location = useLocation();

    const hasUnreadMessages = chatSessions.some(session => 
        session.last_message && !session.last_message.read && session.last_message.sender == "other_user"
    );

  return (
    <div className='fixed bottom-0 xl:hidden w-full border-t flex h-20 bg-background'>
        <ul className="flex w-full justify-evenly">
            <NavLink className={() => `flex justify-center items-center ${
                location.pathname === '/' || location.pathname === '/workoutSession' ? 'text-primary' : 'text-current'
                }`} to="/">
            <li className="flex items-center text-lg lg:hover:bg-muted p-8 w-full h-16 rounded-md lg:transition lg:duration-150 lg:ease-in-out">
                <FontAwesomeIcon  size='lg' icon={faPersonRunning} />
            </li>
            </NavLink>

            <NavLink className={({ isActive }) =>
                `flex justify-center items-center ${isActive ? 'text-primary' : 'text-current'}`
              } to='/progress'> 
            <li className="flex items-center text-lg lg:hover:bg-muted p-8 w-full h-16 rounded-md lg:transition lg:duration-150 lg:ease-in-out">
                <FontAwesomeIcon size='lg' icon={faChartLine} />
            </li>
            </NavLink>

            <NavLink className={() => `relative flex justify-center items-center ${
                location.pathname === '/chat' || location.pathname.startsWith('/ClientProgress/') ? 'text-primary' : 'text-current'
                }`} to='/chat'> 
            {hasUnreadMessages && (
                <div className="absolute top-6 right-8 transform -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-primary">
                {/* This div represents the blue ball */}
                </div>
            )}
            <li className="flex items-center text-lg lg:hover:bg-muted p-8 w-full h-16 rounded-md lg:transition lg:duration-150 lg:ease-in-out">
                <FontAwesomeIcon size='lg' icon={faComments} />
            </li>
            </NavLink>

        </ul>

    </div>
  )
}

export default Bottombar