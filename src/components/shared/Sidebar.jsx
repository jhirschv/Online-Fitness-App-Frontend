import React from 'react'
import { sidebarLinks } from '../../constants'
import { NavLink } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faFolder } from '@fortawesome/free-regular-svg-icons';
import { faDumbbell, faUserGroup, faGear } from '@fortawesome/free-solid-svg-icons';


const SideBar = () => {
  return (
    <nav className="flex h-full w-1/6 pt-6 pl-4 border">
      <div className="w-5/6">
        <ul className="flex flex-col gap-1">

          <NavLink>
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md">
              <Avatar className="mr-3">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              Profile
            </li>
          </NavLink>
          
          <NavLink>
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md">
              <FontAwesomeIcon size="lg" className="mr-3" icon={faSquarePlus}/>
              New Program
            </li>
          </NavLink>
          
          <NavLink>
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md">
              <FontAwesomeIcon className="mr-3" icon={faFolder} />
              Programs
            </li>
          </NavLink>
          
          <NavLink> 
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md">
              <FontAwesomeIcon className="mr-3" icon={faDumbbell} />
              Exercise Library
            </li>
          </NavLink>
         
          <NavLink> 
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md">
              <FontAwesomeIcon className="mr-3" icon={faUserGroup} />
              Clients
            </li>
          </NavLink>
          
          <NavLink> 
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md">
              <FontAwesomeIcon className="mr-3" icon={faGear} />
              Settings
            </li>
          </NavLink>
          
        </ul>
      </div>
    </nav>
    
  )
}

export default SideBar