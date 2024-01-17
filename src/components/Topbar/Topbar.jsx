import React from 'react'
import './Topbar.css'

const Topbar = () => {
  return (
    <div className='topbar'>
      <img className="main-logo"src='/assets/images/TrainerZ-logo.svg' alt="My SVG" />
      <div className="right-topbar">
        <img className="logout-icon" src='/assets/icons/logout (1).png' alt="My SVG" />
        <p>Logout</p>
      </div>
      
    </div>
  )
}

export default Topbar