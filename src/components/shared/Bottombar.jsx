import React from 'react'
import { NavLink } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faFolder } from '@fortawesome/free-regular-svg-icons';
import { faDumbbell, faPersonRunning, faChartLine, faWandMagicSparkles, faComments, faUserGroup, faGear } from '@fortawesome/free-solid-svg-icons';


const Bottombar = () => {
  return (
    <div className='fixed bottom-0 md:hidden w-full border-t flex h-24 bg-background'>
        <ul className="flex w-full justify-evenly">

            <NavLink className='flex justify-center items-center ' to="/">
            <li className="flex items-center text-lg hover:bg-muted p-8 w-full h-16 rounded-md transition duration-150 ease-in-out">
                <FontAwesomeIcon  size='lg' icon={faPersonRunning} />
            </li>
            </NavLink>

            <NavLink className='flex justify-center items-center ' to="/programs">
            <li className="flex items-center text-lg hover:bg-muted p-8 w-full h-16 rounded-md transition duration-150 ease-in-out">
                <FontAwesomeIcon size='lg' icon={faFolder} />
            </li>
            </NavLink>

{/*             <NavLink className='flex justify-center items-center ' to="/workouts">
            <li className="flex items-center text-lg hover:bg-muted w-f p-8ull h-16 rounded-md transition duration-150 ease-in-out">
                <FontAwesomeIcon size='lg' icon={faDumbbell} />
            </li>
            </NavLink> */}

            <NavLink className='flex justify-center items-center ' to='/progress'> 
            <li className="flex items-center text-lg hover:bg-muted p-8 w-full h-16 rounded-md transition duration-150 ease-in-out">
                <FontAwesomeIcon size='lg' icon={faChartLine} />
            </li>
            </NavLink>

            <NavLink className='flex justify-center items-center ' to='/Chat'> 
            <li className="flex items-center text-lg hover:bg-muted p-8 w-full h-16 rounded-md transition duration-150 ease-in-out">
                <FontAwesomeIcon size='lg' icon={faComments} />
            </li>
            </NavLink>

        </ul>

    </div>
  )
}

export default Bottombar