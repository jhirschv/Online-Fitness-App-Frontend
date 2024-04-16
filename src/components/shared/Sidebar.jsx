import React from 'react'
import { sidebarLinks } from '../../constants'
import { NavLink } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faFolder } from '@fortawesome/free-regular-svg-icons';
import { faDumbbell, faPersonRunning, faChartLine, faWandMagicSparkles, faComments, faUserGroup, faGear } from '@fortawesome/free-solid-svg-icons';


const SideBar = () => {
  return (
    <nav className="hidden bg-background xl:flex h-full w-1/6 pt-6 pl-4">
      <div className="w-5/6">
        <ul className="flex flex-col gap-4">

          <NavLink to='/account'>
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-300 ease-in-out">
              <Avatar className="mr-3">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className='md:hidden lg:block'>Account</p>
            </li>
          </NavLink>

          <NavLink  to="/">
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-150 ease-in-out">
              <FontAwesomeIcon  size='lg' className="mr-3" icon={faDumbbell} />
              Train!
            </li>
          </NavLink>
          
          {/* <NavLink  to="programs">
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-150 ease-in-out">
              <FontAwesomeIcon className="mr-3" icon={faFolder} />
              Resources
            </li>
          </NavLink> */}

          {/* <NavLink  to="/workouts">
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-150 ease-in-out">
              <FontAwesomeIcon className="mr-3" icon={faDumbbell} />
              Workouts
            </li>
          </NavLink> */}

          <NavLink to='/Progress'> 
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-150 ease-in-out">
              <FontAwesomeIcon className="mr-3" icon={faChartLine} />
              Progress
            </li>
          </NavLink>

          <NavLink to='/chat'> 
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