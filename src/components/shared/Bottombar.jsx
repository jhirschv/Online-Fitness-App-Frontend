import React from 'react'
import { NavLink } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faFolder } from '@fortawesome/free-regular-svg-icons';
import { faDumbbell, faPersonRunning, faChartLine, faWandMagicSparkles, faComments, faUserGroup, faGear } from '@fortawesome/free-solid-svg-icons';


const Bottombar = () => {
  return (
    <div className='fixed bottom-0 md:hidden w-full flex h-24 bg-background'>
        <ul className="flex w-full justify-between px-6">

            <NavLink  to="/">
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-150 ease-in-out">
                <FontAwesomeIcon  size='lg' className="mr-3" icon={faPersonRunning} />
            </li>
            </NavLink>

            <NavLink  to="/programs">
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-150 ease-in-out">
                <FontAwesomeIcon className="mr-3" icon={faFolder} />
            </li>
            </NavLink>

            <NavLink  to="/workouts">
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-150 ease-in-out">
                <FontAwesomeIcon className="mr-3" icon={faDumbbell} />
            </li>
            </NavLink>

            <NavLink to='/Progress'> 
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-150 ease-in-out">
                <FontAwesomeIcon className="mr-3" icon={faChartLine} />
            </li>
            </NavLink>

            <NavLink to='/Chat'> 
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-150 ease-in-out">
                <FontAwesomeIcon className="mr-3" icon={faComments} />
            </li>
            </NavLink>

        </ul>

    </div>
  )
}

export default Bottombar