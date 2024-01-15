import React from 'react'
import './Sidebar.css'
import { sidebarLinks } from '../../constants'
import { NavLink } from 'react-router-dom'


const SideBar = () => {
  return (
    <div className='sidebar'>
      <ul>
      {sidebarLinks.map((link) => {
        return (
          <NavLink to={link.route}>
              <li key={link.label}>
              {link.label}
              </li>
            </NavLink>
      )})}
      </ul>
    </div>
  )
}

export default SideBar