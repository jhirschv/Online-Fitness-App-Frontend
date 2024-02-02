import React from 'react'
import { sidebarLinks } from '../../constants'
import { NavLink } from 'react-router-dom'


const SideBar = () => {
  return (
    <nav className="h-screen w-1/6">
      <div>
        <ul className="flex flex-col gap-6">
        {sidebarLinks.map((link) => {
          return (
            <NavLink key={link.label} to={link.route}>
                <li key={link.label}>
                {link.label}
                </li>
            </NavLink>
        )})}
        </ul>
      </div>
    </nav>
    
  )
}

export default SideBar